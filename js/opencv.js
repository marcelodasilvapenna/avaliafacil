/* ==========================================================
   opencv.js
   AvaliaFácil
   Versão 2.1
   Correção de perspectiva reativada
========================================================== */

let opencvCarregado = false;


//==========================================================
// Inicialização do OpenCV
//==========================================================

function opencvPronto(){

    cv.onRuntimeInitialized = ()=>{

        opencvCarregado = true;

        atualizarStatus(
            "OpenCV carregado."
        );

        console.log("--------------------------------");
        console.log("OpenCV carregado.");
        console.log("--------------------------------");

    };

}


//==========================================================
// Processamento principal
//==========================================================

function processarImagem(){

    let src = null;

    let imagemDiagnostico = null;

    try{

        //--------------------------------------
        // OpenCV carregado?
        //--------------------------------------

        if(!opencvCarregado){

            atualizarStatus(
                "OpenCV não carregado."
            );

            return;

        }


        //--------------------------------------
        // Componentes da página
        //--------------------------------------

        const img =
            document.getElementById("foto");

        const canvas =
            document.getElementById("canvas");


        if(!img){

            atualizarStatus(
                "Imagem não encontrada."
            );

            return;

        }


        if(!canvas){

            atualizarStatus(
                "Canvas não encontrado."
            );

            return;

        }


        //--------------------------------------
        // Lê imagem original
        //--------------------------------------

        atualizarStatus(
            "Lendo imagem..."
        );


        src = cv.imread(img);


        console.log("--------------------------------");
        console.log("IMAGEM ORIGINAL");
        console.log(
            "Largura:",
            src.cols
        );
        console.log(
            "Altura:",
            src.rows
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Detector
        //--------------------------------------

        atualizarStatus(
            "Detectando marcadores..."
        );


        const resultado =
            detectarMarcadores(src);


        //--------------------------------------
        // Diagnóstico
        //--------------------------------------

        console.log("--------------------------------");
        console.log("RETORNO DO DETECTOR");
        console.log(resultado);
        console.log(
            "Encontrado:",
            resultado.encontrado
        );
        console.log(
            "Marcadores:",
            resultado.marcadores.length
        );
        console.log(
            "Score:",
            resultado.score
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Folha não encontrada
        //--------------------------------------

        if(!resultado.encontrado){

            atualizarStatus(
                "Folha não encontrada."
            );


            img.style.display =
                "none";

            canvas.style.display =
                "block";


            cv.imshow(
                "canvas",
                src
            );


            src.delete();

            src = null;

            return;

        }


        //--------------------------------------
        // Folha encontrada
        //--------------------------------------

        atualizarStatus(
            "Folha encontrada."
        );


        console.log("--------------------------------");
        console.log(
            "4 MARCADORES DETECTADOS"
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Mostra marcadores somente
        // em uma cópia para diagnóstico
        //--------------------------------------

        imagemDiagnostico =
            src.clone();


        resultado.marcadores.forEach(m=>{

            cv.circle(

                imagemDiagnostico,

                new cv.Point(
                    m.cx,
                    m.cy
                ),

                12,

                new cv.Scalar(
                    255,
                    0,
                    0,
                    255
                ),

                4

            );

        });


        //--------------------------------------
        // Exibe diagnóstico
        //--------------------------------------

        img.style.display =
            "none";

        canvas.style.display =
            "block";


        cv.imshow(
            "canvas",
            imagemDiagnostico
        );


        //--------------------------------------
        // Libera cópia
        //--------------------------------------

        imagemDiagnostico.delete();

        imagemDiagnostico = null;


        //--------------------------------------
        // Corrige perspectiva (substitui src)
        //--------------------------------------

        try {

            atualizarStatus("Corrigindo perspectiva...");

            // Se houver mais de 4 marcadores, seleciona os 4 maiores por área
            let marcadoresParaCorrigir = resultado.marcadores;

            if(marcadoresParaCorrigir.length > 4){
                marcadoresParaCorrigir = marcadoresParaCorrigir.slice().sort((a,b)=> b.area - a.area).slice(0,4);
            }

            const imagemCorrigida = corrigirPerspectiva(src, marcadoresParaCorrigir);

            // liberamos a imagem original e usamos a corrigida a partir de agora
            src.delete();
            src = imagemCorrigida;

            console.log("--------------------------------");
            console.log("PERSPECTIVA CORRIGIDA");
            console.log("--------------------------------");

            // Exibe a imagem corrigida
            cv.imshow("canvas", src);

        } catch (e) {

            console.error("Falha ao corrigir perspectiva:", e);

            atualizarStatus("Falha na correção de perspectiva — usando imagem original.");

            // Em caso de erro, mantém a src original visível
            cv.imshow("canvas", src);

        }


        //--------------------------------------
        // Status
        //--------------------------------------

        atualizarStatus(
            "Foto pronta para leitura."
        );


        //--------------------------------------
        // Diagnóstico dos marcadores
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "COORDENADAS DOS MARCADORES"
        );
        console.log("--------------------------------");


        resultado.marcadores.forEach(

            (m,index)=>{

                console.log(

                    index,

                    "X:",

                    m.cx,

                    "Y:",

                    m.cy,

                    "Área:",

                    m.area

                );

            }

        );


        console.log("--------------------------------");
        console.log(
            "IMAGEM ORIGINAL PRONTA"
        );
        console.log("--------------------------------");


        //--------------------------------------
        // IMPORTANTE
        //
        // Não apagamos src aqui.
        //
        // O próximo módulo, readers.js,
        // precisará receber esta imagem.
        //--------------------------------------


        /*
        ======================================================
        PRÓXIMA ETAPA

        Aqui entraremos com:

        lerRespostas(
            src,
            resultado.marcadores
        );

        Ainda não ativamos porque o
        readers.js será criado agora.
        ======================================================
        */


        //--------------------------------------
        // Por enquanto, mantemos src
        //--------------------------------------

        /*
         * src permanece em memória.
         *
         * Quando criarmos o readers.js,
         * ele será responsável pela leitura.
         */


    }

    catch(erro){

        console.error(
            "ERRO NO PROCESSAMENTO:",
            erro
        );


        //--------------------------------------
        // Liberação segura
        //--------------------------------------

        if(imagemDiagnostico){

            imagemDiagnostico.delete();

            imagemDiagnostico = null;

        }


        if(src){

            src.delete();

            src = null;

        }


        //--------------------------------------
        // Mensagem
        //--------------------------------------

        atualizarStatus(

            "Erro: " +

            erro.message

        );

    }

}


//==========================================================
// Funções auxiliares
//==========================================================

/**
 * Corrige a perspectiva de uma imagem dado um array de 4 marcadores.
 * Cada marcador deve ter {cx, cy, area}.
 * Retorna uma nova cv.Mat com a imagem corrigida (é responsabilidade do chamador deletar quando não for mais necessária).
 */
function corrigirPerspectiva(src, marcadores){

    if(!marcadores || marcadores.length < 4){
        throw new Error("São necessários 4 marcadores para corrigir a perspectiva.");
    }

    // Seleciona exatamente 4 marcadores (se houver mais, espera-se que o chamador já tenha filtrado os 4 desejados)
    let pts = marcadores.slice(0,4).map(m => ({ x: m.cx, y: m.cy }));

    // Identifica os cantos por soma/diferença (mais robusto que ordenar por Y/X simples)
    // tl: menor x+y, br: maior x+y
    // tr: menor x-y, bl: maior x-y
    let sums = pts.map(p => p.x + p.y);
    let diffs = pts.map(p => p.x - p.y);

    const idxMinSum = sums.indexOf(Math.min.apply(null, sums));
    const idxMaxSum = sums.indexOf(Math.max.apply(null, sums));
    const idxMinDiff = diffs.indexOf(Math.min.apply(null, diffs));
    const idxMaxDiff = diffs.indexOf(Math.max.apply(null, diffs));

    // Construir ordem: tl, tr, br, bl
    let tl = pts[idxMinSum];
    let br = pts[idxMaxSum];
    let tr = pts[idxMinDiff];
    let bl = pts[idxMaxDiff];

    // Caso alguma referência coincida (p.ex. pontos quase colineares), fallback para ordenação por Y então X
    if(new Set([idxMinSum, idxMaxSum, idxMinDiff, idxMaxDiff]).size < 4){
        pts.sort((a,b) => a.y - b.y);
        let top = pts.slice(0,2).sort((a,b) => a.x - b.x);
        let bottom = pts.slice(2,4).sort((a,b) => a.x - b.x);
        tl = top[0];
        tr = top[1];
        bl = bottom[0];
        br = bottom[1];
    }

    function dist(a,b){ let dx = a.x - b.x; let dy = a.y - b.y; return Math.hypot(dx,dy); }

    let widthA = dist(br, bl);
    let widthB = dist(tr, tl);
    let maxWidth = Math.max(Math.round(widthA), Math.round(widthB));

    let heightA = dist(tr, br);
    let heightB = dist(tl, bl);
    let maxHeight = Math.max(Math.round(heightA), Math.round(heightB));

    if(maxWidth <= 0 || maxHeight <= 0){
        throw new Error("Dimensões calculadas inválidas para a perspectiva.");
    }

    // Criar matrizes de pontos (CV_32FC2)
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y
    ]);

    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        maxWidth - 1, 0,
        maxWidth - 1, maxHeight - 1,
        0, maxHeight - 1
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    let dst = new cv.Mat();
    let dsize = new cv.Size(maxWidth, maxHeight);

    // Aplica transformação de perspectiva
    cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(0,0,0,255));

    // Limpeza
    srcTri.delete();
    dstTri.delete();
    M.delete();

    return dst;
}


/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
