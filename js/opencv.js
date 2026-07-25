/* ===========================================
   AvaliaFácil
   OpenCV.js v0.4.1
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
        50,
        150
    );

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
    );

    let folha = null;
    let maiorArea = 0;

    for(let i = 0; i < contours.size(); i++){

        let cnt = contours.get(i);

        let peri = cv.arcLength(cnt, true);

        let approx = new cv.Mat();

        cv.approxPolyDP(
            cnt,
            approx,
            0.02 * peri,
            true
        );

        let area = cv.contourArea(cnt);

        if(
            approx.rows === 4 &&
            area > maiorArea
        ){

            maiorArea = area;

            folha = approx.clone();

        }

        approx.delete();

    }

    if(folha != null){

        let folhas = new cv.MatVector();

        folhas.push_back(folha);

        cv.drawContours(
            src,
            folhas,
            0,
            new cv.Scalar(0,255,0,255),
            6
        );

        atualizarStatus(
            "Folha encontrada. Contornos: " + contours.size()
        );

        folhas.delete();
        folha.delete();

    }else{

        atualizarStatus(
            "Nenhuma folha encontrada. Contornos: " + contours.size()
        );

    }

    cv.imshow("canvas", src);

    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

}
