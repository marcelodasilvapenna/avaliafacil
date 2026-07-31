/* ===========================================
   opencv.js
   Motor principal do processamento
=========================================== */

let opencvCarregado = false;

//============================================
// Inicialização do OpenCV
//============================================

function opencvPronto() {

    cv.onRuntimeInitialized = () => {

        opencvCarregado = true;

        atualizarStatus("OpenCV carregado.");

        console.log("OpenCV pronto.");

    };

}

//============================================
// Processamento da imagem
//============================================

function processarImagem() {

    if (!opencvCarregado) {

        alert("OpenCV ainda não foi carregado.");
        return;

    }

    atualizarStatus("Processando imagem...");

    const img = document.getElementById("foto");

    if (!img || img.src === "") {

        atualizarStatus("Nenhuma imagem encontrada.");
        return;

    }

    //----------------------------------------
    // Leitura
    //----------------------------------------

    let src = cv.imread(img);

    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let thresh = new cv.Mat();

    //----------------------------------------
    // Escala de cinza
    //----------------------------------------

    cv.cvtColor(
        src,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    //----------------------------------------
    // Suavização
    //----------------------------------------

    cv.GaussianBlur(

        gray,

        blur,

        new cv.Size(5,5),

        0

    );

    //----------------------------------------
    // Threshold
    //----------------------------------------

    cv.threshold(

        blur,

        thresh,

        0,

        255,

        cv.THRESH_BINARY_INV + cv.THRESH_OTSU

    );

    //----------------------------------------
    // Detecta marcadores
    //----------------------------------------

    const resultado = detectarMarcadores(thresh);

    //----------------------------------------
    // Marcadores encontrados
    //----------------------------------------

    if (resultado.encontrado) {

        atualizarStatus("Folha encontrada.");

        resultado.marcadores.forEach(marcador => {

            cv.circle(

                src,

                new cv.Point(

                    marcador.cx,

                    marcador.cy

                ),

                12,

                new cv.Scalar(255,0,0,255),

                4

            );

        });

        console.log("Score:", resultado.score);

    }

    //----------------------------------------
    // Não encontrou
    //----------------------------------------

    else {

        atualizarStatus("Não foi possível localizar a folha.");

    }

    //----------------------------------------
    // Exibe resultado
    //----------------------------------------

    cv.imshow("canvas", src);

    //----------------------------------------
    // Libera memória
    //----------------------------------------

    src.delete();
    gray.delete();
    blur.delete();
    thresh.delete();

}
