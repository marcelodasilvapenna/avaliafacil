/* ===========================================
   opencv.js
   Motor principal do processamento
=========================================== */

let opencvCarregado = false;

function opencvPronto() {

    cv.onRuntimeInitialized = () => {

        opencvCarregado = true;

        atualizarStatus("OpenCV carregado.");

        console.log("OpenCV pronto.");

    };

}

function processarImagem() {

    if (!opencvCarregado) {

        alert("OpenCV ainda não foi carregado.");
        return;

    }

    atualizarStatus("Processando imagem...");

    const img = document.getElementById("foto");

    let src = cv.imread(img);

    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let thresh = new cv.Mat();

    // Escala de cinza
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Redução de ruído
    cv.GaussianBlur(
        gray,
        blur,
        new cv.Size(5,5),
        0
    );

    // Imagem binária
    cv.threshold(
        blur,
        thresh,
        0,
        255,
        cv.THRESH_BINARY_INV + cv.THRESH_OTSU
    );

    // Procura os marcadores
    let marcadores = detectarMarcadores(thresh);

    // Desenha um círculo vermelho em cada marcador encontrado
    for(let i = 0; i < marcadores.length; i++){

        cv.circle(

            src,

            new cv.Point(
                marcadores[i].x,
                marcadores[i].y
            ),

            12,

            new cv.Scalar(255,0,0,255),

            4

        );

    }

    if(marcadores.length === 4){

        atualizarStatus("Folha encontrada.");

    }else{

        atualizarStatus("Não foi possível localizar a folha.");

    }

    cv.imshow("canvas", src);

    src.delete();
    gray.delete();
    blur.delete();
    thresh.delete();

}