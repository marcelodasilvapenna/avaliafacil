/* ==========================================================
   detector.js
   AvaliaFácil
   Detector de Marcadores v5.1
   ----------------------------------------------------------
   Detecta os quatro marcadores da folha de respostas.
========================================================== */

const DetectorConfig = {

    // Mais tolerante para imagens do celular
    AREA_MINIMA: 150,

    AREA_MAXIMA: 50000,

    // Antes era 1.25
    PROPORCAO_MAXIMA: 1.50,

    DISTANCIA_MINIMA: 40,

    MAX_CANDIDATOS: 80,

    // Antes era 60
    SCORE_MINIMO: 40

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

    console.log("====================================");
    console.log("INICIANDO DETECTOR");
    console.log("====================================");

    // Pré-processa a imagem
    const binaria = preProcessar(src);

    // Localiza todos os quadrados candidatos
    let candidatos = encontrarCandidatos(binaria);

    // A imagem binária não será mais utilizada
    binaria.delete();

    console.log(
        "Candidatos após pré-processamento:",
        candidatos.length
    );

    // Remove candidatos repetidos
    candidatos = removerDuplicados(candidatos);

    console.log(
        "Candidatos após remover duplicados:",
        candidatos.length
    );

    // Seleciona os quatro marcadores
    const marcadores = selecionarQuatroCantos(candidatos);

    console.log(
        "Marcadores selecionados:",
        marcadores.length
    );

    // Não encontrou quatro marcadores
    if(marcadores.length !== 4){

        console.log("ERRO: menos de quatro marcadores.");

        return{

            encontrado:false,

            marcadores:[],

            score:0

        };

    }

    // Ordena os quatro marcadores
    const ordenados = ordenarMarcadores(marcadores);

    console.log("Marcadores ordenados.");

    // Continua na Parte 2...
    //======================================================
    // Validação geométrica
    //======================================================

    if(!validarGeometria(ordenados)){

        console.log("ERRO: validação geométrica reprovada.");

        return{

            encontrado:false,

            marcadores:[],

            score:0

        };

    }

    console.log("Geometria aprovada.");

    //======================================================
    // Calcula índice de confiança
    //======================================================

    const score = calcularScore(ordenados);

    console.log("--------------------------------");
    console.log("Score:", score);
    console.log(
        "Score mínimo:",
        DetectorConfig.SCORE_MINIMO
    );
    console.log(
        "Detector encontrou:",
        score >= DetectorConfig.SCORE_MINIMO
    );
    console.log("--------------------------------");

    return{

        encontrado: score >= DetectorConfig.SCORE_MINIMO,

        marcadores: ordenados,

        score: score

    };

}

//==========================================================
// Pré-processamento da imagem
//==========================================================

function preProcessar(src){

    let gray = new cv.Mat();

    let blur = new cv.Mat();

    let thresh = new cv.Mat();

    let kernel = cv.getStructuringElement(

        cv.MORPH_RECT,

        new cv.Size(3,3)

    );

    // Tons de cinza
    cv.cvtColor(

        src,

        gray,

        cv.COLOR_RGBA2GRAY

    );

    // Redução de ruído
    cv.GaussianBlur(

        gray,

        blur,

        new cv.Size(5,5),

        0

    );

    // Binarização
    cv.threshold(

        blur,

        thresh,

        0,

        255,

        cv.THRESH_BINARY_INV +

        cv.THRESH_OTSU

    );

    // Fecha pequenos espaços
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
// Procura todos os quadrados candidatos
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

        let contorno = contours.get(i);

        let area = cv.contourArea(contorno);

        if(area < DetectorConfig.AREA_MINIMA){

            contorno.delete();

            continue;

        }

        if(area > DetectorConfig.AREA_MAXIMA){

            contorno.delete();

            continue;

        }

        let perimetro = cv.arcLength(

            contorno,

            true

        );

        let aproximacao = new cv.Mat();

        cv.approxPolyDP(

            contorno,

            aproximacao,

            0.02 * perimetro,

            true

        );

        // Apenas quadriláteros

        if(aproximacao.rows != 4){

            aproximacao.delete();

            contorno.delete();

            continue;

        }

        if(!cv.isContourConvex(aproximacao)){

            aproximacao.delete();

            contorno.delete();

            continue;

        }

        let retangulo = cv.boundingRect(

            aproximacao

        );

        let largura = retangulo.width;

        let altura = retangulo.height;

        if(largura < 5 || altura < 5){

            aproximacao.delete();

            contorno.delete();

            continue;

        }

        let proporcao =

            Math.max(largura,altura) /

            Math.min(largura,altura);

        if(

            proporcao >

            DetectorConfig.PROPORCAO_MAXIMA

        ){

            aproximacao.delete();

            contorno.delete();

            continue;

        }

        // Centro do marcador

        let cx =

            retangulo.x +

            largura / 2;

        let cy =

            retangulo.y +

            altura / 2;

        candidatos.push(

            new Marcador(

                cx,

                cy,

                area,

                largura,

                altura,

                0

            )

        );

        aproximacao.delete();

        contorno.delete();

    }

    hierarchy.delete();

    contours.delete();

    candidatos.sort(

        (a,b)=>b.area-a.area

    );

    if(

        candidatos.length >

        DetectorConfig.MAX_CANDIDATOS

    ){

        candidatos = candidatos.slice(

            0,

            DetectorConfig.MAX_CANDIDATOS

        );

    }

    //------------------------------------------------------
    // Diagnóstico
    //------------------------------------------------------

    console.log("--------------------------------");
    console.log("Detector - Candidatos encontrados:", candidatos.length);

    candidatos.forEach((c,i)=>{

        console.log(

            "#" + (i+1),

            "Área:", Math.round(c.area),

            "Centro:",

            "(" + Math.round(c.cx) + "," + Math.round(c.cy) + ")"

        );

    });

    console.log("--------------------------------");

    return candidatos;

}
// começo da parte 4
//==========================================================
// Remove candidatos duplicados
//==========================================================

function removerDuplicados(candidatos){

    if(candidatos.length <= 1){

        return candidatos;

    }

    let resultado = [];

    for(let i=0;i<candidatos.length;i++){

        const atual = candidatos[i];

        let encontrado = false;

        for(let j=0;j<resultado.length;j++){

            const outro = resultado[j];

            const dx = atual.cx - outro.cx;
            const dy = atual.cy - outro.cy;

            const distancia = Math.sqrt(

                dx * dx +

                dy * dy

            );

            if(

                distancia <

                DetectorConfig.DISTANCIA_MINIMA

            ){

                encontrado = true;

                // Mantém o maior candidato

                if(atual.area > outro.area){

                    resultado[j] = atual;

                }

                break;

            }

        }

        if(!encontrado){

            resultado.push(atual);

        }

    }

    resultado.sort(

        (a,b)=>b.area-a.area

    );

    return resultado;

}

//==========================================================
// Seleciona os quatro candidatos mais extremos
//==========================================================

function selecionarQuatroCantos(candidatos){

    if(candidatos.length < 4){

        console.log("Menos de quatro candidatos.");

        return [];

    }

    let superiorEsquerdo = null;
    let superiorDireito = null;
    let inferiorDireito = null;
    let inferiorEsquerdo = null;

    let menorSoma = Number.POSITIVE_INFINITY;
    let maiorSoma = Number.NEGATIVE_INFINITY;

    let menorDif = Number.POSITIVE_INFINITY;
    let maiorDif = Number.NEGATIVE_INFINITY;

    for(const candidato of candidatos){

        const soma = candidato.cx + candidato.cy;

        const diferenca = candidato.cx - candidato.cy;

        if(soma < menorSoma){

            menorSoma = soma;
            superiorEsquerdo = candidato;

        }

        if(soma > maiorSoma){

            maiorSoma = soma;
            inferiorDireito = candidato;

        }

        if(diferenca > maiorDif){

            maiorDif = diferenca;
            superiorDireito = candidato;

        }

        if(diferenca < menorDif){

            menorDif = diferenca;
            inferiorEsquerdo = candidato;

        }

    }

    const marcadores = [

        superiorEsquerdo,

        superiorDireito,

        inferiorDireito,

        inferiorEsquerdo

    ];

    // Verifica se há repetição do mesmo objeto

    const unicos = [];

    for(const marcador of marcadores){

        if(!unicos.includes(marcador)){

            unicos.push(marcador);

        }

    }

    console.log(
        "Marcadores únicos:",
        unicos.length
    );

    if(unicos.length !== 4){

        console.log("Marcadores repetidos.");

        return [];

    }

    return unicos;

}
//==========================================================
// Ordena os marcadores na sequência:
// 0 = Superior Esquerdo
// 1 = Superior Direito
// 2 = Inferior Direito
// 3 = Inferior Esquerdo
//==========================================================

function ordenarMarcadores(marcadores){

    if(marcadores.length !== 4){

        return [];

    }

    let pontos = [...marcadores];

    pontos.sort((a,b)=>a.cy-b.cy);

    let superiores = pontos.slice(0,2);

    let inferiores = pontos.slice(2,4);

    superiores.sort((a,b)=>a.cx-b.cx);

    inferiores.sort((a,b)=>a.cx-b.cx);

    return [

        superiores[0],

        superiores[1],

        inferiores[1],

        inferiores[0]

    ];

}

//==========================================================
// Distância entre dois marcadores
//==========================================================

function distancia(a,b){

    const dx = a.cx - b.cx;

    const dy = a.cy - b.cy;

    return Math.sqrt(

        dx*dx +

        dy*dy

    );

}

//==========================================================
// Verifica se os quatro marcadores formam um quadrilátero
// compatível com uma folha A4
//==========================================================

function validarGeometria(marcadores){

    if(marcadores.length !== 4){

        console.log("Geometria: quantidade inválida.");

        return false;

    }

    const tl = marcadores[0];
    const tr = marcadores[1];
    const br = marcadores[2];
    const bl = marcadores[3];

    const larguraSuperior = distancia(tl,tr);

    const larguraInferior = distancia(bl,br);

    const alturaEsquerda = distancia(tl,bl);

    const alturaDireita = distancia(tr,br);

    console.log("-----------------------------");
    console.log("VALIDAÇÃO GEOMÉTRICA");
    console.log("Largura superior :", Math.round(larguraSuperior));
    console.log("Largura inferior :", Math.round(larguraInferior));
    console.log("Altura esquerda  :", Math.round(alturaEsquerda));
    console.log("Altura direita   :", Math.round(alturaDireita));

    if(

        larguraSuperior < 100 ||

        larguraInferior < 100 ||

        alturaEsquerda < 100 ||

        alturaDireita < 100

    ){

        console.log("Geometria rejeitada: folha muito pequena.");

        return false;

    }

    const erroHorizontal =

        Math.abs(

            larguraSuperior -

            larguraInferior

        ) /

        Math.max(

            larguraSuperior,

            larguraInferior

        );

    const erroVertical =

        Math.abs(

            alturaEsquerda -

            alturaDireita

        ) /

        Math.max(

            alturaEsquerda,

            alturaDireita

        );

    console.log("Erro horizontal:", erroHorizontal.toFixed(3));
    console.log("Erro vertical  :", erroVertical.toFixed(3));

    if(erroHorizontal > 0.35){

        console.log("Geometria rejeitada: erro horizontal.");

        return false;

    }

    if(erroVertical > 0.35){

        console.log("Geometria rejeitada: erro vertical.");

        return false;

    }

    const diagonal1 = distancia(tl,br);

    const diagonal2 = distancia(tr,bl);

    const erroDiagonal =

        Math.abs(

            diagonal1 -

            diagonal2

        ) /

        Math.max(

            diagonal1,

            diagonal2

        );

    console.log("Erro diagonal:", erroDiagonal.toFixed(3));

    if(erroDiagonal > 0.30){

        console.log("Geometria rejeitada: diagonais.");

        return false;

    }

    console.log("Geometria aprovada.");
    console.log("-----------------------------");

    return true;

}
//==========================================================
// Calcula um índice de confiança da detecção
//==========================================================

function calcularScore(marcadores){

    if(marcadores.length !== 4){

        return 0;

    }

    const tl = marcadores[0];
    const tr = marcadores[1];
    const br = marcadores[2];
    const bl = marcadores[3];

    const larguraSuperior = distancia(tl,tr);
    const larguraInferior = distancia(bl,br);

    const alturaEsquerda = distancia(tl,bl);
    const alturaDireita = distancia(tr,br);

    const mediaHorizontal =

        (larguraSuperior + larguraInferior) / 2;

    const mediaVertical =

        (alturaEsquerda + alturaDireita) / 2;

    const erroHorizontal =

        Math.abs(

            larguraSuperior -

            larguraInferior

        ) / mediaHorizontal;

    const erroVertical =

        Math.abs(

            alturaEsquerda -

            alturaDireita

        ) / mediaVertical;

    const diagonal1 = distancia(tl,br);

    const diagonal2 = distancia(tr,bl);

    const mediaDiagonal =

        (diagonal1 + diagonal2) / 2;

    const erroDiagonal =

        Math.abs(

            diagonal1 -

            diagonal2

        ) / mediaDiagonal;

    //------------------------------------------------------
    // Score
    //------------------------------------------------------

    let score = 100;

    score -= erroHorizontal * 40;

    score -= erroVertical * 40;

    score -= erroDiagonal * 20;

    score = Math.max(

        0,

        Math.min(

            100,

            score

        )

    );

    score = Math.round(score);

    //------------------------------------------------------
    // Diagnóstico
    //------------------------------------------------------

    console.log("==============================");
    console.log("CÁLCULO DO SCORE");
    console.log("==============================");

    console.log(
        "Erro Horizontal:",
        erroHorizontal.toFixed(3)
    );

    console.log(
        "Erro Vertical:",
        erroVertical.toFixed(3)
    );

    console.log(
        "Erro Diagonal:",
        erroDiagonal.toFixed(3)
    );

    console.log(
        "Score Final:",
        score
    );

    console.log(
        "Score mínimo:",
        DetectorConfig.SCORE_MINIMO
    );

    if(score >= DetectorConfig.SCORE_MINIMO){

        console.log("RESULTADO: FOLHA ENCONTRADA");

    }else{

        console.log("RESULTADO: FOLHA REJEITADA");

    }

    console.log("==============================");

    return score;

}


