/* ===========================================
   opencv.js
   AvaliaFácil v0.6.1
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

        if(!opencvCarregado){

            atualizarStatus("OpenCV não carregado.");

            return;

        }

        const img = document.getElementById("foto");
        const canvas = document.getElementById("canvas");

        if(!img){

            atualizarStatus("Imagem não encontrada.");

            return;

        }

        atualizarStatus("Processando imagem...");

        let src = cv.imread(img);

        //--------------------------------------
        // Detector
        //--------------------------------------

        let resultado = detectarMarcadores(src);

console.log("================================");
console.log("RETORNO DO DETECTOR");
console.log(resultado);
console.log("Encontrado:", resultado.encontrado);
console.log("Marcadores:", resultado.marcadores.length);
console.log("Score:", resultado.score);
console.log("================================");

atualizarStatus(
    "E=" +
    resultado.encontrado +
    " M=" +
    resultado.marcadores.length
);

if(!resultado.encontrado){
            atualizarStatus("Folha não encontrada.");

            img.style.display = "none";
            canvas.style.display = "block";

            cv.imshow("canvas",src);

            src.delete();

            return;

        }

        //--------------------------------------
        // Desenha os marcadores
        //--------------------------------------

        resultado.marcadores.forEach(m=>{

            cv.circle(

                src,

                new cv.Point(m.cx,m.cy),

                12,

                new cv.Scalar(255,0,0,255),

                4

            );

        });

        atualizarStatus("Folha encontrada.");

        //--------------------------------------
        // Esconde a foto e mostra apenas o canvas
        //--------------------------------------

        img.style.display = "none";
        canvas.style.display = "block";

        //--------------------------------------
        // Exibe imagem com marcadores
        //--------------------------------------

        cv.imshow("canvas",src);

        //--------------------------------------
        // Perspective
        //--------------------------------------

        let folha = null;

        if(typeof corrigirPerspectiva==="function"){

            folha = corrigirPerspectiva(

                src,

                resultado.marcadores

            );

        }

        //--------------------------------------
        // Reader
        //--------------------------------------

        if(

            folha &&

            typeof lerQuestao1==="function"

        ){

            const resposta = lerQuestao1(folha);

            atualizarStatus(

                "Questão 1 = " + resposta

            );

            cv.imshow("canvas",folha);

            folha.delete();

        }

        src.delete();

    }

    catch(erro){

        console.error(erro);

        atualizarStatus(

            "Erro: " + erro.message

        );

    }

}
