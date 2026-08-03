/* ===========================================
   opencv.js
   AvaliaFácil v0.6
=========================================== */

let opencvCarregado = false;

//==========================================================

function opencvPronto(){

    cv.onRuntimeInitialized = () => {

        opencvCarregado = true;

        atualizarStatus("OpenCV carregado.");

        console.log("OpenCV pronto.");

    };

}

//==========================================================

function processarImagem(){

    try{

        //--------------------------------------
        // OpenCV
        //--------------------------------------

        if(!opencvCarregado){

            atualizarStatus("OpenCV não carregado.");

            return;

        }

        //--------------------------------------
        // Foto
        //--------------------------------------

        const img = document.getElementById("foto");

        if(!img){

            atualizarStatus("Imagem não encontrada.");

            return;

        }

        atualizarStatus("Processando imagem...");

        //--------------------------------------
        // Lê imagem
        //--------------------------------------

        let src = cv.imread(img);

        //--------------------------------------
        // Detector
        //--------------------------------------

        let resultado = detectarMarcadores(src);

        if(!resultado.encontrado){

            atualizarStatus("Folha não encontrada.");

            cv.imshow("canvas",src);

            src.delete();

            return;

        }

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

        atualizarStatus("Folha encontrada.");

        //--------------------------------------
        // Mostra imagem original
        //--------------------------------------

        cv.imshow(

            "canvas",

            src

        );

        //--------------------------------------
        // Perspective
        //--------------------------------------

        console.log("Iniciando perspective...");

        let folha = null;

        if(typeof corrigirPerspectiva==="function"){

            folha = corrigirPerspectiva(

                src,

                resultado.marcadores

            );

            console.log("Perspective executado.");

        }

        //--------------------------------------
        // Reader
        //--------------------------------------

        if(

            folha &&

            typeof lerQuestao1==="function"

        ){

            const resposta = lerQuestao1(folha);

            console.log(

                "Questão 1:",

                resposta

            );

            atualizarStatus(

                "Questão 1 = " + resposta

            );

            cv.imshow(

                "canvas",

                folha

            );

            folha.delete();

        }

        src.delete();

    }

    catch(erro){

        console.error(erro);

        atualizarStatus(

            "Erro: " +

            erro.message

        );

    }

}
