/* ==========================================================
   opencv.js
   AvaliaFácil
   Versão 1.0
   Parte 1 de 2
========================================================== */

let opencvCarregado = false;

//==========================================================
// Inicialização do OpenCV
//==========================================================

function opencvPronto(){

    cv.onRuntimeInitialized = ()=>{

        opencvCarregado = true;

        atualizarStatus("OpenCV carregado.");

        console.log("--------------------------------");
        console.log("OpenCV carregado.");
        console.log("--------------------------------");

    };

}

//==========================================================
// Processamento principal
//==========================================================

function processarImagem(){

    try{

        //--------------------------------------
        // OpenCV carregado?
        //--------------------------------------

        if(!opencvCarregado){

            atualizarStatus("OpenCV não carregado.");

            return;

        }

        //--------------------------------------
        // Componentes da página
        //--------------------------------------

        const img = document.getElementById("foto");
        const canvas = document.getElementById("canvas");

        if(!img){

            atualizarStatus("Imagem não encontrada.");

            return;

        }

        //--------------------------------------
        // Lê imagem
        //--------------------------------------

        atualizarStatus("Lendo imagem...");

        let src = cv.imread(img);

        console.log(

            "Imagem:",

            src.cols,

            "x",

            src.rows

        );

        //--------------------------------------
        // Detector
        //--------------------------------------

        atualizarStatus("Detectando marcadores...");

        let resultado = detectarMarcadores(src);

        console.log("--------------------------------");
        console.log("RETORNO DO DETECTOR");
        console.log(resultado);
        console.log("--------------------------------");

        //--------------------------------------
        // Não encontrou
        //--------------------------------------

        if(!resultado.encontrado){

            atualizarStatus("Folha não encontrada.");

            img.style.display = "none";
            canvas.style.display = "block";

            cv.imshow(

                "canvas",

                src

            );

            src.delete();

            return;

        }

        //--------------------------------------
        // Encontrou
        //--------------------------------------

        atualizarStatus("Folha encontrada.");

        //--------------------------------------
        // Desenha marcadores
        //--------------------------------------

        resultado.marcadores.forEach(m=>{

            cv.circle(

                src,

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
        // Mostra imagem
        //--------------------------------------

        img.style.display = "none";
        canvas.style.display = "block";

        cv.imshow(

            "canvas",

            src

        );

        //--------------------------------------
        // Continua na Parte 2
        //--------------------------------------
           //--------------------------------------
        // Perspective
        //--------------------------------------

        let folha = null;

        if(typeof corrigirPerspectiva === "function"){

            atualizarStatus("Corrigindo perspectiva...");

            folha = corrigirPerspectiva(

                src,

                resultado.marcadores

            );

            if(folha){

                console.log("Perspective OK.");

                cv.imshow(

                    "canvas",

                    folha

                );

            }else{

                console.log("Perspective retornou NULL.");

            }

        }

        //--------------------------------------
        // Reader
        //--------------------------------------

        if(

            folha &&

            typeof lerQuestao1 === "function"

        ){

            atualizarStatus("Lendo questão 1...");

            const resposta = lerQuestao1(

                folha

            );

            console.log(

                "Questão 1:",

                resposta

            );

            atualizarStatus(

                "Questão 1 = " +

                resposta

            );

            cv.imshow(

                "canvas",

                folha

            );

        }

        //--------------------------------------
        // Libera memória
        //--------------------------------------

        if(folha){

            folha.delete();

        }

        src.delete();

        console.log("--------------------------------");
        console.log("Processamento finalizado.");
        console.log("--------------------------------");

    }

    catch(erro){

        console.error(erro);

        atualizarStatus(

            "Erro: " +

            erro.message

        );

    }

}

/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
