/* ==========================================================
   opencv.js
   AvaliaFácil
   Versão 2.0
   Sem correção de perspectiva
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
        // NÃO fazemos mais:
        //
        // corrigirPerspectiva()
        //
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "PERSPECTIVA DESATIVADA"
        );
        console.log(
            "Usaremos a imagem original."
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Mostra novamente a imagem original
        //--------------------------------------

        cv.imshow(
            "canvas",
            src
        );


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


/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
