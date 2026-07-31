/* =====================================================
   detector.js
   AvaliaFácil
   Versão 2.0
   Detecta os quatro marcadores do Provão Afrânio
===================================================== */

class Marcador {

    constructor(cx, cy, area, largura, altura, angulo) {

        this.cx = cx;
        this.cy = cy;
        this.area = area;
        this.largura = largura;
        this.altura = altura;
        this.angulo = angulo;

    }

}

//=====================================================

function detectarMarcadores(src){

    let binaria = preProcessar(src);

    let candidatos = encontrarQuadrados(binaria);

    let marcadores = selecionarMarcadores(candidatos);

    if(binaria) binaria.delete();

    return ordenarMarcadores(marcadores);

}

//=====================================================

function preProcessar(src){

    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let thresh = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    cv.GaussianBlur(
        gray,
        blur,
        new cv.Size(5,5),
        0
    );

    cv.threshold(
        blur,
        thresh,
        0,
        255,
        cv.THRESH_BINARY_INV + cv.THRESH_OTSU
    );

    gray.delete();
    blur.delete();

    return thresh;

}

//=====================================================

function encontrarQuadrados(binaria){

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
        binaria,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
    );

    let candidatos = [];

    for(let i=0;i<contours.size();i++){

        let cnt = contours.get(i);

        let area = cv.contourArea(cnt);

        if(area < 500){

            cnt.delete();
            continue;

        }

        let perimetro = cv.arcLength(cnt,true);

        let approx = new cv.Mat();

        cv.approxPolyDP(
            cnt,
            approx,
            0.02*perimetro,
            true
        );

        if(approx.rows==4){

            let rot = cv.minAreaRect(approx);

            let w = rot.size.width;
            let h = rot.size.height;

            let proporcao = Math.max(w,h)/Math.min(w,h);

            if(proporcao < 1.3){

                candidatos.push(

                    new Marcador(
                        rot.center.x,
                        rot.center.y,
                        area,
                        w,
                        h,
                        rot.angle
                    )

                );

            }

        }

        approx.delete();
        cnt.delete();

    }

    contours.delete();
    hierarchy.delete();

    return candidatos;

}

//=====================================================

function selecionarMarcadores(candidatos){

    candidatos.sort((a,b)=>b.area-a.area);

    if(candidatos.length>4){

        candidatos=candidatos.slice(0,4);

    }

    return candidatos;

}

//=====================================================

function ordenarMarcadores(lista){

    if(lista.length!=4)
        return lista;

    let soma = lista.map(p=>p.cx+p.cy);

    let diferenca = lista.map(p=>p.cx-p.cy);

    let tl = lista[soma.indexOf(Math.min(...soma))];

    let br = lista[soma.indexOf(Math.max(...soma))];

    let tr = lista[diferenca.indexOf(Math.max(...diferenca))];

    let bl = lista[diferenca.indexOf(Math.min(...diferenca))];

    return [tl,tr,br,bl];

}
