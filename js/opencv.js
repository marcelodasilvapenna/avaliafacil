/* ===========================================
   AvaliaFácil
   OpenCV.js
=========================================== */

let opencvCarregado = false;

function opencvPronto() {

    cv['onRuntimeInitialized'] = () => {

        opencvCarregado = true;

        atualizarStatus("OpenCV carregado.");

        console.log("OpenCV pronto.");

    };

}

/**
 * Processa a foto capturada.
 */
function processarImagem() {

    if (!opencvCarregado) {

        alert("OpenCV ainda não foi carregado.");

        return;

    }

    const img = document.getElementById("foto");

    let src = cv.imread(img);

    let gray = new cv.Mat();

    cv.cvtColor(
        src,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    cv.imshow("canvas", gray);

    src.delete();
    gray.delete();

    atualizarStatus("Imagem processada.");

}