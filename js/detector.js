/* ==========================================================
   detector.js
   AvaliaFácil
   Detector de Marcadores v3.0
========================================================== */

const DetectorConfig = {

    AREA_MINIMA: 500,
    PROPORCAO_MAXIMA: 1.30,
    MAX_CANDIDATOS: 20

};

//==========================================================

class Marcador{

    constructor(cx,cy,area,w,h,angulo){

        this.cx=cx;
        this.cy=cy;
        this.area=area;
        this.w=w;
        this.h=h;
        this.angulo=angulo;

    }

}

//==========================================================

function detectarMarcadores(src){

    let binaria = preProcessar(src);

    let candidatos = encontrarQuadrados(binaria);

    let marcadores = selecionarMelhorGrupo(candidatos);

    binaria.delete();

    if(marcadores.length!==4){

        return{

            encontrado:false,
            marcadores:[],
            score:0

        };

    }

    marcadores = ordenarMarcadores(marcadores);

    return{

        encontrado:true,
        marcadores:marcadores,
        score:calcularScore(marcadores)

    };

}

//==========================================================

function preProcessar(src){

    let gray=new cv.Mat();
    let blur=new cv.Mat();
    let thresh=new cv.Mat();

    cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY);

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
        cv.THRESH_BINARY_INV+cv.THRESH_OTSU
    );

    gray.delete();
    blur.delete();

    return thresh;

}

//==========================================================

function encontrarQuadrados(binaria){

    let contours=new cv.MatVector();
    let hierarchy=new cv.Mat();

    cv.findContours(
        binaria,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
    );

    let lista=[];

    for(let i=0;i<contours.size();i++){

        let cnt=contours.get(i);

        let area=cv.contourArea(cnt);

        if(area<DetectorConfig.AREA_MINIMA){

            cnt.delete();
            continue;

        }

        let peri=cv.arcLength(cnt,true);

        let approx=new cv.Mat();

        cv.approxPolyDP(
            cnt,
            approx,
            0.02*peri,
            true
        );

        if(approx.rows===4){

            let r=cv.minAreaRect(approx);

            let w=r.size.width;
            let h=r.size.height;

            let proporcao=Math.max(w,h)/Math.min(w,h);

            if(proporcao<DetectorConfig.PROPORCAO_MAXIMA){

                lista.push(

                    new Marcador(

                        r.center.x,
                        r.center.y,
                        area,
                        w,
                        h,
                        r.angle

                    )

                );

            }

        }

        approx.delete();
        cnt.delete();

    }

    contours.delete();
    hierarchy.delete();

    lista.sort((a,b)=>b.area-a.area);

    return lista.slice(0,DetectorConfig.MAX_CANDIDATOS);

}

//==========================================================

function selecionarMelhorGrupo(candidatos){

    if(candidatos.length<4)
        return [];

    /*
      VERSÃO 3.0

      Atualmente devolvemos os quatro maiores.

      Na próxima versão este método testará todas
      as combinações possíveis e escolherá o grupo
      que melhor forma um retângulo.

    */

    return candidatos.slice(0,4);

}

//==========================================================

function ordenarMarcadores(lista){

    let soma=lista.map(p=>p.cx+p.cy);

    let dif=lista.map(p=>p.cx-p.cy);

    let tl=lista[soma.indexOf(Math.min(...soma))];

    let br=lista[soma.indexOf(Math.max(...soma))];

    let tr=lista[dif.indexOf(Math.max(...dif))];

    let bl=lista[dif.indexOf(Math.min(...dif))];

    return[tl,tr,br,bl];

}

//==========================================================

function calcularScore(lista){

    /*
      Placeholder.

      Futuramente calculará:

      • alinhamento
      • áreas semelhantes
      • ângulos
      • proporcionalidade

      Retornará 0–100.

    */

    return 100;

}
