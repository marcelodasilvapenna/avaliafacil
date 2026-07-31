/* ===========================================
   detector.js
   Localiza os marcadores do Provão Afrânio
=========================================== */

function detectarMarcadores(imagemBinaria) {

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
        imagemBinaria,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
    );

    let marcadores = [];

    for (let i = 0; i < contours.size(); i++) {

        let cnt = contours.get(i);

        let area = cv.contourArea(cnt);

        if (area < 300)
            continue;

        let perimetro = cv.arcLength(cnt, true);

        let approx = new cv.Mat();

        cv.approxPolyDP(
            cnt,
            approx,
            0.02 * perimetro,
            true
        );

        if (approx.rows === 4) {

            let rect = cv.boundingRect(approx);

            let proporcao = rect.width / rect.height;

            if (proporcao > 0.8 && proporcao < 1.2) {

                marcadores.push({

                    x: rect.x + rect.width / 2,
                    y: rect.y + rect.height / 2,
                    area: area

                });

            }

        }

        approx.delete();

    }

    contours.delete();
    hierarchy.delete();

    marcadores.sort((a, b) => b.area - a.area);

    if (marcadores.length > 4)
        marcadores = marcadores.slice(0, 4);

    return marcadores;

}