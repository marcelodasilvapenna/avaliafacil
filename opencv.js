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

function processarImagem() {

    if (!opencvCarregado) {

        alert("OpenCV ainda não foi carregado.");
        return;

    }

    const img = document.getElementById("foto");

    let src = cv.imread(img);

    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let edges = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    cv.GaussianBlur(
        gray,
        blur,
        new cv.Size(5,5),
        0
    );

    cv.Canny(
        blur,
        edges,
        75,
        200
    );

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    let maiorArea = 0;
    let melhor = -1;

    for(let i=0;i<contours.size();i++){

        let cnt = contours.get(i);

        let area = cv.contourArea(cnt);

        if(area > maiorArea){

            maiorArea = area;
            melhor = i;

        }

    }

    if(melhor >= 0){

        cv.drawContours(
            src,
            contours,
            melhor,
            new cv.Scalar(0,255,0,255),
            5
        );

        atualizarStatus("Folha encontrada.");

    }else{

        atualizarStatus("Folha não encontrada.");

    }

    cv.imshow("canvas", src);

    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

}