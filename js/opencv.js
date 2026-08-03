/* ===========================================
   opencv.js
   AvaliaFácil v0.6 DEBUG
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

    if(!opencvCarregado){

        alert("OpenCV ainda não foi carregado.");

        return;

    }

    atualizarStatus("1 - Processando imagem...");

    const img = document.getElementById("foto");

    if(!img){

        atualizarStatus("Imagem não encontrada.");

        return;

    }

    //------------------------------------------
    // Lê imagem
    //------------------------------------------

    let src = cv.imread(img);

    atualizarStatus("2 - Imagem carregada.");

    //------------------------------------------
    // Detector
    //------------------------------------------

    let resultado;

    try{

        resultado = detectarMarcadores(src);

    }catch(e){

        console.error(e);

        atualizarStatus("ERRO no detector.");

        src.delete();

        return;

    }

    //------------------------------------------

    if(!resultado.encontrado){

        atualizarStatus("Folha não encontrada.");

        cv.imshow("canvas",src);

        src.delete();

        return;

    }

    atualizarStatus("3 - Marcadores encontrados.");

    //------------------------------------------
    // Desenha marcadores
    //------------------------------------------

    resultado.marcadores.forEach(m=>{

        cv.circle(

            src,

            new cv.Point(m.cx,m.cy),

            12,

            new cv.Scalar(255,0,0,255),

            4

        );

    });

    cv.imshow("canvas",src);

    //------------------------------------------
    // Perspective
    //------------------------------------------

    atualizarStatus("4 - Corrigindo perspectiva...");

    let folha;

    try{

        folha = corrigirPerspectiva(

            src,

            resultado.marcadores

        );

    }catch(e){

        console.error(e);

        atualizarStatus("ERRO no perspective.js");

        src.delete();

        return;

    }

    if(!folha){

        atualizarStatus("Perspective retornou NULL.");

        src.delete();

        return;

    }

    atualizarStatus("5 - Perspectiva OK.");

    //------------------------------------------
    // Reader
    //------------------------------------------

    let resposta;

    try{

        resposta = lerQuestao1(folha);

    }catch(e){

        console.error(e);

        atualizarStatus("ERRO no reader.js");

        folha.delete();

        src.delete();

        return;

    }

    atualizarStatus(

        "6 - Questão 1 = " + resposta

    );

    console.log(

        "Questão 1:",

        resposta

    );

    //------------------------------------------

    cv.imshow(

        "canvas",

        folha

    );

    folha.delete();

    src.delete();

}
