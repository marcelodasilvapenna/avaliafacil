/* ==========================================================
   detector.js
   AvaliaFácil
   Detector de Marcadores v4.0
========================================================== */

const DetectorConfig = {

    // Área mínima aceita para um candidato
    AREA_MINIMA: 400,

    // Área máxima (evita pegar a folha inteira)
    AREA_MAXIMA: 50000,

    // Relação largura/altura permitida
    PROPORCAO_MAXIMA: 1.25,

    // Distância mínima entre dois centros
    DISTANCIA_MINIMA: 40,

    // Número máximo de candidatos analisados
    MAX_CANDIDATOS: 80

};

//==========================================================

class Marcador{

    constructor(cx,cy,area,w,h,angulo){

        this.cx = cx;
        this.cy = cy;

        this.area = area;

        this.w = w;
        this.h = h;

        this.angulo = angulo;

    }

}

//==========================================================

function detectarMarcadores(src){

    const binaria = preProcessar(src);

    let candidatos = encontrarCandidatos(binaria);

    candidatos = removerDuplicados(candidatos);

    const marcadores = selecionarQuatroCantos(candidatos);

    binaria.delete();

    if(marcadores.length !== 4){

        return{

            encontrado:false,

            marcadores:[],

            score:0

        };

    }

    const ordenados = ordenarMarcadores(marcadores);

    return{

        encontrado:true,

        marcadores:ordenados,

        score:calcularScore(ordenados)

    };

}

//==========================================================
// Pré-processamento
//==========================================================

function preProcessar(src){

    let gray = new cv.Mat();

    let blur = new cv.Mat();

    let thresh = new cv.Mat();

    cv.cvtColor(

        src,

        gray,

        cv.COLOR_RGBA2GRAY

    );

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

    let kernel = cv.getStructuringElement(

        cv.MORPH_RECT,

        new cv.Size(3,3)

    );

    cv.morphologyEx(

        thresh,

        thresh,

        cv.MORPH_CLOSE,

        kernel

    );

    gray.delete();

    blur.delete();

    kernel.delete();

    return thresh;

}
//==========================================================
// Localiza todos os candidatos quadrados
//==========================================================

function encontrarCandidatos(binaria){

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

        //------------------------------------
        // Área
        //------------------------------------

        if(area < DetectorConfig.AREA_MINIMA){

            cnt.delete();

            continue;

        }

        if(area > DetectorConfig.AREA_MAXIMA){

            cnt.delete();

            continue;

        }

        //------------------------------------
        // Aproxima polígono
        //------------------------------------

        let peri = cv.arcLength(

            cnt,

            true

        );

        let approx = new cv.Mat();

        cv.approxPolyDP(

            cnt,

            approx,

            0.02 * peri,

            true

        );

        //------------------------------------
        // Apenas quadriláteros
        //------------------------------------

        if(approx.rows != 4){

            approx.delete();

            cnt.delete();

            continue;

        }

        //------------------------------------
        // Retângulo mínimo
        //------------------------------------

        let rect = cv.minAreaRect(

            approx

        );

        let w = rect.size.width;

        let h = rect.size.height;

        //------------------------------------
        // Evita divisão por zero
        //------------------------------------

        if(w <= 1 || h <= 1){

            approx.delete();

            cnt.delete();

            continue;

        }

        //------------------------------------
        // Proporção
        //------------------------------------

        let proporcao = Math.max(w,h) / Math.min(w,h);

        if(proporcao > DetectorConfig.PROPORCAO_MAXIMA){

            approx.delete();

            cnt.delete();

            continue;

        }

        //------------------------------------
        // Área preenchida
        //------------------------------------

        let areaRetangulo = w * h;

        let ocupacao = area / areaRetangulo;

        if(ocupacao < 0.55){

            approx.delete();

            cnt.delete();

            continue;

        }

        //------------------------------------
        // Guarda candidato
        //------------------------------------

        candidatos.push(

            new Marcador(

                rect.center.x,

                rect.center.y,

                area,

                w,

                h,

                rect.angle

            )

        );

        approx.delete();

        cnt.delete();

    }

    contours.delete();

    hierarchy.delete();

    //------------------------------------
    // Ordena pela maior área
    //------------------------------------

    candidatos.sort(

        (a,b)=>b.area-a.area

    );

    //------------------------------------
    // Limita quantidade
    //------------------------------------

    if(candidatos.length >

        DetectorConfig.MAX_CANDIDATOS){

        candidatos = candidatos.slice(

            0,

            DetectorConfig.MAX_CANDIDATOS

        );

    }

    return candidatos;

}
//==========================================================
// Remove candidatos muito próximos (duplicados)
//==========================================================

function removerDuplicados(candidatos){

    if(candidatos.length <= 1){

        return candidatos;

    }

    let resultado = [];

    for(let i=0;i<candidatos.length;i++){

        const atual = candidatos[i];

        let duplicado = false;

        for(let j=0;j<resultado.length;j++){

            const existente = resultado[j];

            const dx = atual.cx - existente.cx;

            const dy = atual.cy - existente.cy;

            const distancia = Math.sqrt(dx*dx + dy*dy);

            if(distancia < DetectorConfig.DISTANCIA_MINIMA){

                duplicado = true;

                if(atual.area > existente.area){

                    resultado[j] = atual;

                }

                break;

            }

        }

        if(!duplicado){

            resultado.push(atual);

        }

    }

    resultado.sort(

        (a,b)=>b.area-a.area

    );

    return resultado;

}

//==========================================================
// Seleciona os quatro marcadores mais extremos
//==========================================================

function selecionarQuatroCantos(candidatos){

    if(candidatos.length < 4){

        return [];

    }

    let superiorEsquerdo = null;
    let superiorDireito = null;
    let inferiorEsquerdo = null;
    let inferiorDireito = null;

    let menorSoma = Number.POSITIVE_INFINITY;
    let maiorSoma = Number.NEGATIVE_INFINITY;

    let menorDif = Number.POSITIVE_INFINITY;
    let maiorDif = Number.NEGATIVE_INFINITY;

    candidatos.forEach(c=>{

        const soma = c.cx + c.cy;
        const diferenca = c.cx - c.cy;

        if(soma < menorSoma){

            menorSoma = soma;
            superiorEsquerdo = c;

        }

        if(soma > maiorSoma){

            maiorSoma = soma;
            inferiorDireito = c;

        }

        if(diferenca < menorDif){

            menorDif = diferenca;
            inferiorEsquerdo = c;

        }

        if(diferenca > maiorDif){

            maiorDif = diferenca;
            superiorDireito = c;

        }

    });

    let marcadores = [

        superiorEsquerdo,
        superiorDireito,
        inferiorDireito,
        inferiorEsquerdo

    ];

    //------------------------------------------------------
    // Remove possíveis repetições
    //------------------------------------------------------

    let unicos = [];

    marcadores.forEach(m=>{

        if(!m){

            return;

        }

        if(!unicos.includes(m)){

            unicos.push(m);

        }

    });

    if(unicos.length != 4){

        return [];

    }

    return unicos;

}
//==========================================================
// Remove candidatos muito próximos (duplicados)
//==========================================================

function removerDuplicados(candidatos){

    if(candidatos.length <= 1){

        return candidatos;

    }

    let resultado = [];

    for(let i=0;i<candidatos.length;i++){

        const atual = candidatos[i];

        let duplicado = false;

        for(let j=0;j<resultado.length;j++){

            const existente = resultado[j];

            const dx = atual.cx - existente.cx;

            const dy = atual.cy - existente.cy;

            const distancia = Math.sqrt(dx*dx + dy*dy);

            if(distancia < DetectorConfig.DISTANCIA_MINIMA){

                duplicado = true;

                if(atual.area > existente.area){

                    resultado[j] = atual;

                }

                break;

            }

        }

        if(!duplicado){

            resultado.push(atual);

        }

    }

    resultado.sort(

        (a,b)=>b.area-a.area

    );

    return resultado;

}

//==========================================================
// Seleciona os quatro marcadores mais extremos
//==========================================================

function selecionarQuatroCantos(candidatos){

    if(candidatos.length < 4){

        return [];

    }

    let superiorEsquerdo = null;
    let superiorDireito = null;
    let inferiorEsquerdo = null;
    let inferiorDireito = null;

    let menorSoma = Number.POSITIVE_INFINITY;
    let maiorSoma = Number.NEGATIVE_INFINITY;

    let menorDif = Number.POSITIVE_INFINITY;
    let maiorDif = Number.NEGATIVE_INFINITY;

    candidatos.forEach(c=>{

        const soma = c.cx + c.cy;
        const diferenca = c.cx - c.cy;

        if(soma < menorSoma){

            menorSoma = soma;
            superiorEsquerdo = c;

        }

        if(soma > maiorSoma){

            maiorSoma = soma;
            inferiorDireito = c;

        }

        if(diferenca < menorDif){

            menorDif = diferenca;
            inferiorEsquerdo = c;

        }

        if(diferenca > maiorDif){

            maiorDif = diferenca;
            superiorDireito = c;

        }

    });

    let marcadores = [

        superiorEsquerdo,
        superiorDireito,
        inferiorDireito,
        inferiorEsquerdo

    ];

    //------------------------------------------------------
    // Remove possíveis repetições
    //------------------------------------------------------

    let unicos = [];

    marcadores.forEach(m=>{

        if(!m){

            return;

        }

        if(!unicos.includes(m)){

            unicos.push(m);

        }

    });

    if(unicos.length != 4){

        return [];

    }

    return unicos;

}
//==========================================================
// Ajuste final da detecção
//==========================================================

// SUBSTITUA, dentro da função detectarMarcadores(), este trecho:
//
// const ordenados = ordenarMarcadores(marcadores);
//
// return{
//
//     encontrado:true,
//
//     marcadores:ordenados,
//
//     score:calcularScore(ordenados)
//
// };
//
// PELO BLOCO ABAIXO:

const ordenados = ordenarMarcadores(marcadores);

if(!validarGeometria(ordenados)){

    return{

        encontrado:false,

        marcadores:[],

        score:0

    };

}

if(!validarAreaFolha(ordenados,src)){

    return{

        encontrado:false,

        marcadores:[],

        score:0

    };

}

const score = calcularScore(ordenados);

return{

    encontrado: score >= 60,

    marcadores: ordenados,

    score: score

};

//==========================================================
// Fim do detector.js
//==========================================================
