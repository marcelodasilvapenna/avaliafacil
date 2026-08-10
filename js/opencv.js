/* ==========================================================
   opencv.js
   AvaliaFácil
   Versão 1.1
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

    let folha = null;

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


        //--------------------------------------
        // Cria imagem apenas para diagnóstico
        //--------------------------------------
        //
        // IMPORTANTE:
        //
        // Não vamos desenhar os marcadores
        // diretamente em src.
        //
        // A perspectiva precisa receber
        // a imagem original.
        //--------------------------------------

        imagemDiagnostico =
            src.clone();


        //--------------------------------------
        // Desenha marcadores
        // somente na imagem de diagnóstico
        //--------------------------------------

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
        // Mostra imagem com marcadores
        //--------------------------------------

        img.style.display =
            "none";

        canvas.style.display =
            "block";


        cv.imshow(
            "canvas",
            imagemDiagnostico
        );


        atualizarStatus(
            "Marcadores encontrados."
        );


        console.log("--------------------------------");
        console.log(
            "4 MARCADORES DETECTADOS"
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Libera imagem de diagnóstico
        //--------------------------------------

        imagemDiagnostico.delete();

        imagemDiagnostico = null;


        //--------------------------------------
        // Perspective
        //--------------------------------------

        if(
            typeof corrigirPerspectiva !==
            "function"
        ){

            atualizarStatus(
                "Perspective não encontrado."
            );

            console.error(
                "A função corrigirPerspectiva() não existe."
            );

            src.delete();

            src = null;

            return;

        }


        //--------------------------------------
        // Inicia perspectiva
        //--------------------------------------

        atualizarStatus(
            "Corrigindo perspectiva..."
        );


        console.log("--------------------------------");
        console.log(
            "INICIANDO PERSPECTIVE"
        );
        console.log("--------------------------------");


        //--------------------------------------
        // IMPORTANTE:
        //
        // Enviamos src ORIGINAL.
        //
        // Não enviamos imagemDiagnostico.
        //--------------------------------------

        folha =
            corrigirPerspectiva(

                src,

                resultado.marcadores

            );


        //--------------------------------------
        // Verifica retorno
        //--------------------------------------

        if(!folha){

            console.error(
                "Perspective retornou NULL."
            );

            atualizarStatus(
                "Erro na perspectiva."
            );

            src.delete();

            src = null;

            return;

        }


        //--------------------------------------
        // Diagnóstico da folha
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "FOLHA CORRIGIDA RECEBIDA"
        );
        console.log(
            "Largura:",
            folha.cols
        );
        console.log(
            "Altura:",
            folha.rows
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Verifica se a folha possui tamanho
        //--------------------------------------

        if(

            folha.cols <= 0 ||

            folha.rows <= 0

        ){

            console.error(
                "Folha retornada está vazia."
            );

            atualizarStatus(
                "Folha corrigida inválida."
            );

            folha.delete();

            folha = null;

            src.delete();

            src = null;

            return;

        }


        //--------------------------------------
        // MOSTRA A FOLHA CORRIGIDA
        //--------------------------------------
        //
        // Este é o ponto mais importante.
        //
        // Depois daqui, não mostramos mais
        // src.
        //--------------------------------------

        cv.imshow(
            "canvas",
            folha
        );


        //--------------------------------------
        // Perspectiva concluída
        //--------------------------------------

        atualizarStatus(
            "Perspectiva concluída."
        );


        console.log("--------------------------------");
        console.log(
            "PERSPECTIVA CONCLUÍDA"
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Reader
        //--------------------------------------
        //
        // NÃO vamos executar o reader ainda.
        //
        // O readers.js ainda será desenvolvido.
        //--------------------------------------

        console.log(
            "Reader ainda não implementado."
        );


        //--------------------------------------
        // Libera imagem original
        //--------------------------------------

        src.delete();

        src = null;


        //--------------------------------------
        // NÃO liberamos folha aqui.
        //
        // Ela continua sendo usada pelo canvas.
        //
        // Será liberada na próxima etapa,
        // quando começarmos o readers.js.
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "PROCESSAMENTO FINALIZADO"
        );
        console.log("--------------------------------");

    }

    catch(erro){

        console.error(
            "ERRO NO PROCESSAMENTO:",
            erro
        );


        //--------------------------------------
        // Liberação segura
        //--------------------------------------

        if(
            imagemDiagnostico
        ){

            imagemDiagnostico.delete();

            imagemDiagnostico = null;

        }


        if(folha){

            folha.delete();

            folha = null;

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
