/* ==========================================================
   detector.js
   AvaliaFácil
   Parte 1 de 6
========================================================== */

//==========================================================
// Configuração
//==========================================================

const DetectorConfig = {

    AREA_MINIMA: 150,

    AREA_MAXIMA: 50000,

    PROPORCAO_MAXIMA: 1.50,

    DISTANCIA_MINIMA: 40,

    MAX_CANDIDATOS: 80

};

//==========================================================
// Classe Marcador
//==========================================================

class Marcador{

    constructor(cx,cy,area,w,h){

        this.cx = cx;
        this.cy = cy;

        this.area = area;

        this.w = w;
        this.h = h;

    }

}

//==========================================================
// Detector principal
//==========================================================

function detectarMarcadores(src){
   atualizarStatus("DETECTOR NOVO");
    console.log("================================");
    console.log("DETECTOR");
    console.log("================================");

    //--------------------------------------
    // Pré-processamento
    //--------------------------------------

    const binaria = preProcessar(src);

    //--------------------------------------
    // Procura candidatos
    //--------------------------------------

    let candidatos = encontrarCandidatos(binaria);

    binaria.delete();

    console.log(
        "Candidatos encontrados:",
        candidatos.length
    );

    //--------------------------------------
    // Remove duplicados
    //--------------------------------------

    candidatos = removerDuplicados(candidatos);

    console.log(
        "Após remover duplicados:",
        candidatos.length
    );

    //--------------------------------------
    // Seleciona quatro cantos
    //--------------------------------------

    const marcadores = selecionarQuatroCantos(candidatos);

    console.log(
        "Marcadores:",
        marcadores.length
    );

    //--------------------------------------
    // Não encontrou quatro
    //--------------------------------------

    if(marcadores.length !== 4){

    console.log("ERRO 1");

    console.log("Quantidade:", marcadores.length);

    return{

        encontrado:false,

        marcadores:[],

        score:0

    };

}
    //--------------------------------------
    // Ordena
    //--------------------------------------

    const ordenados = ordenarMarcadores(marcadores);

    //--------------------------------------
    // Validação simples
    //--------------------------------------

    if(!validarGeometria(ordenados)){

    console.log("ERRO 2");

    return{

        encontrado:false,

        marcadores:[],

        score:0

    };

}
    //--------------------------------------
    // Retorno
    //--------------------------------------

    return{

        encontrado:true,

        marcadores:ordenados,

        score:100

    };

}

/* ==========================================================
   FIM DA PARTE 1

   Próxima parte:
   function preProcessar(src)

========================================================== */
/* ==========================================================
   detector.js
   AvaliaFácil
   Parte 2 de 6
========================================================== */

//==========================================================
// Pré-processamento da imagem
//==========================================================
function preProcessar(src){

    let gray = new cv.Mat();

    let equal = new cv.Mat();

    let blur = new cv.Mat();

    let thresh = new cv.Mat();

    //--------------------------------------
    // Escala de cinza
    //--------------------------------------

    cv.cvtColor(

        src,

        gray,

        cv.COLOR_RGBA2GRAY

    );

    //--------------------------------------
    // Equalização do contraste
    //--------------------------------------

    cv.equalizeHist(

        gray,

        equal

    );

    //--------------------------------------
    // Redução de ruído
    //--------------------------------------

    cv.GaussianBlur(

        equal,

        blur,

        new cv.Size(5,5),

        0

    );

    //--------------------------------------
    // Threshold adaptativo
    //--------------------------------------

    cv.adaptiveThreshold(

        blur,

        thresh,

        255,

        cv.ADAPTIVE_THRESH_GAUSSIAN_C,

        cv.THRESH_BINARY_INV,

        31,

        10

    );

    //--------------------------------------
    // Kernel
    //--------------------------------------

    let kernel = cv.getStructuringElement(

        cv.MORPH_RECT,

        new cv.Size(5,5)

    );

    //--------------------------------------
    // Fecha pequenos buracos
    //--------------------------------------

    cv.morphologyEx(

        thresh,

        thresh,

        cv.MORPH_CLOSE,

        kernel

    );

    //--------------------------------------
    // Remove pequenos ruídos
    //--------------------------------------

    cv.morphologyEx(

        thresh,

        thresh,

        cv.MORPH_OPEN,

        kernel

    );

    //--------------------------------------
    // Libera memória
    //--------------------------------------

    gray.delete();

    equal.delete();

    blur.delete();

    kernel.delete();

    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log("Pré-processamento v2 concluído.");

    //--------------------------------------
    // Retorno
    //--------------------------------------

    return thresh;

}

/* ==========================================================
   FIM DA PARTE 2

   Próxima parte:
   function encontrarCandidatos(binaria)

========================================================== */
/* ==========================================================
   detector.js
   AvaliaFácil
   Parte 3 de 6
========================================================== */

//==========================================================
// Procura candidatos
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

    //------------------------------------------------------
    // Diagnóstico
    //------------------------------------------------------

    let rejeitadosArea = 0;

    let rejeitadosForma = 0;

    let rejeitadosTamanho = 0;

    let rejeitadosProporcao = 0;

    //------------------------------------------------------
    // Tamanho da imagem
    //------------------------------------------------------

    const imagemArea =

        binaria.cols *

        binaria.rows;

    //------------------------------------------------------
    // Limites de área
    //
    // Mantemos os valores do DetectorConfig,
    // mas permitimos uma margem maior para fotos
    // em diferentes distâncias.
    //------------------------------------------------------

    const areaMinima = Math.max(

        20,

        Math.min(

            DetectorConfig.AREA_MINIMA,

            imagemArea * 0.000001

        )

    );

    const areaMaxima = Math.max(

        DetectorConfig.AREA_MAXIMA,

        imagemArea * 0.05

    );

    //------------------------------------------------------
    // Analisa cada contorno encontrado
    //------------------------------------------------------

    for(let i=0;i<contours.size();i++){

        let contorno = contours.get(i);

        let area = cv.contourArea(contorno);

        //----------------------------------
        // Área
        //----------------------------------

        if(

            area < areaMinima ||

            area > areaMaxima

        ){

            rejeitadosArea++;

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Perímetro
        //----------------------------------

        let perimetro = cv.arcLength(

            contorno,

            true

        );

        if(perimetro <= 0){

            rejeitadosForma++;

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Aproxima polígono
        //----------------------------------

        let aprox = new cv.Mat();

        cv.approxPolyDP(

            contorno,

            aprox,

            0.025 * perimetro,

            true

        );

        //----------------------------------
        // Aceitamos somente quadriláteros
        //----------------------------------

        if(aprox.rows !== 4){

            rejeitadosForma++;

            aprox.delete();

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Convexo
        //----------------------------------

        if(!cv.isContourConvex(aprox)){

            rejeitadosForma++;

            aprox.delete();

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Retângulo envolvente
        //----------------------------------

        let rect = cv.boundingRect(

            aprox

        );

        let largura = rect.width;

        let altura = rect.height;

        //----------------------------------
        // Tamanho mínimo
        //
        // Reduzimos o mínimo para permitir
        // marcadores fotografados de longe.
        //----------------------------------

        if(

            largura < 6 ||

            altura < 6

        ){

            rejeitadosTamanho++;

            aprox.delete();

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Proporção
        //----------------------------------

        let proporcao =

            Math.max(

                largura,

                altura

            ) /

            Math.min(

                largura,

                altura

            );

        //----------------------------------
        // Tolerância maior para perspectiva
        //----------------------------------

        const proporcaoMaxima = Math.max(

            DetectorConfig.PROPORCAO_MAXIMA,

            2.5

        );

        if(

            proporcao >

            proporcaoMaxima

        ){

            rejeitadosProporcao++;

            aprox.delete();

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Ocupação do retângulo
        //
        // Um marcador sólido deve ocupar boa
        // parte do seu bounding box.
        //----------------------------------

        const areaRetangulo =

            largura *

            altura;

        const ocupacao =

            area /

            areaRetangulo;

        if(

            ocupacao < 0.35

        ){

            rejeitadosForma++;

            aprox.delete();

            contorno.delete();

            continue;

        }

        //----------------------------------
        // Centro
        //----------------------------------

        let cx =

            rect.x +

            largura / 2;

        let cy =

            rect.y +

            altura / 2;

        //----------------------------------
        // Salva candidato
        //----------------------------------

        candidatos.push(

            new Marcador(

                cx,

                cy,

                area,

                largura,

                altura

            )

        );

        //----------------------------------
        // Libera memória
        //----------------------------------

        aprox.delete();

        contorno.delete();

    }

    //------------------------------------------------------
    // Libera OpenCV
    //------------------------------------------------------

    hierarchy.delete();

    contours.delete();

    //------------------------------------------------------
    // Ordena por área
    //------------------------------------------------------

    candidatos.sort(

        (a,b)=>b.area-a.area

    );

    //------------------------------------------------------
    // Limita quantidade
    //------------------------------------------------------

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
    // Diagnóstico detalhado
    //------------------------------------------------------

    console.log(

        "Contornos analisados:",

        contours.size

    );

    console.log(

        "Rejeitados por área:",

        rejeitadosArea

    );

    console.log(

        "Rejeitados por forma:",

        rejeitadosForma

    );

    console.log(

        "Rejeitados por tamanho:",

        rejeitadosTamanho

    );

    console.log(

        "Rejeitados por proporção:",

        rejeitadosProporcao

    );

    console.log(

        "Quadrados encontrados:",

        candidatos.length

    );

    //------------------------------------------------------
    // Retorno
    //------------------------------------------------------

    return candidatos;

}

/* ==========================================================
   FIM DA FUNÇÃO encontrarCandidatos()
========================================================== */

/* ==========================================================
   FIM DA PARTE 3

   Início da parte 4
========================================================== */
/* ==========================================================
   detector.js
   AvaliaFácil
   Parte 4 de 6
========================================================== */

//==========================================================
// Remove candidatos muito próximos
//==========================================================

function removerDuplicados(candidatos){

    let resultado = [];

    candidatos.forEach(candidato=>{

        let repetido = false;

        for(const existente of resultado){

            const dx = candidato.cx - existente.cx;
            const dy = candidato.cy - existente.cy;

            const dist = Math.sqrt(

                dx*dx +

                dy*dy

            );

            if(dist < DetectorConfig.DISTANCIA_MINIMA){

                repetido = true;

                break;

            }

        }

        if(!repetido){

            resultado.push(candidato);

        }

    });

    console.log(

        "Duplicados removidos:",

        resultado.length

    );

    return resultado;

}

//==========================================================
// Seleciona os quatro marcadores
//==========================================================

function selecionarQuatroCantos(candidatos){

    if(candidatos.length < 4){

        console.log(

            "Menos de quatro candidatos."

        );

        return [];

    }

    //--------------------------------------
    // Centro médio dos candidatos
    //--------------------------------------

    let centroX = 0;
    let centroY = 0;

    candidatos.forEach(c=>{

        centroX += c.cx;
        centroY += c.cy;

    });

    centroX /= candidatos.length;
    centroY /= candidatos.length;

    //--------------------------------------
    // Quadrantes
    //--------------------------------------

    let superiorEsquerdo = null;
    let superiorDireito = null;
    let inferiorEsquerdo = null;
    let inferiorDireito = null;

    candidatos.forEach(c=>{

        //-------------------------------
        // Superior esquerdo
        //-------------------------------

        if(

            c.cx < centroX &&

            c.cy < centroY

        ){

            if(

                !superiorEsquerdo ||

                c.area >

                superiorEsquerdo.area

            ){

                superiorEsquerdo = c;

            }

        }

        //-------------------------------
        // Superior direito
        //-------------------------------

        else if(

            c.cx >= centroX &&

            c.cy < centroY

        ){

            if(

                !superiorDireito ||

                c.area >

                superiorDireito.area

            ){

                superiorDireito = c;

            }

        }

        //-------------------------------
        // Inferior esquerdo
        //-------------------------------

        else if(

            c.cx < centroX &&

            c.cy >= centroY

        ){

            if(

                !inferiorEsquerdo ||

                c.area >

                inferiorEsquerdo.area

            ){

                inferiorEsquerdo = c;

            }

        }

        //-------------------------------
        // Inferior direito
        //-------------------------------

        else{

            if(

                !inferiorDireito ||

                c.area >

                inferiorDireito.area

            ){

                inferiorDireito = c;

            }

        }

    });

    //--------------------------------------
    // Validação
    //--------------------------------------

    if(

        !superiorEsquerdo ||

        !superiorDireito ||

        !inferiorDireito ||

        !inferiorEsquerdo

    ){

        console.log(

            "Não foi possível localizar os quatro marcadores."

        );

        return [];

    }

    console.log("Marcadores encontrados:");

    console.log(

        "SE:",

        superiorEsquerdo.cx,

        superiorEsquerdo.cy

    );

    console.log(

        "SD:",

        superiorDireito.cx,

        superiorDireito.cy

    );

    console.log(

        "ID:",

        inferiorDireito.cx,

        inferiorDireito.cy

    );

    console.log(

        "IE:",

        inferiorEsquerdo.cx,

        inferiorEsquerdo.cy

    );

    return [

        superiorEsquerdo,

        superiorDireito,

        inferiorDireito,

        inferiorEsquerdo

    ];

}

/* ==========================================================
   FIM DA PARTE 4

   Próxima parte:

   function ordenarMarcadores()

   function validarGeometria()

========================================================== */
/* ==========================================================
   detector.js
   AvaliaFácil
   Parte 5 de 6
========================================================== */

//==========================================================
// Ordena os marcadores
//
// Retorno:
//
// 0 -> Superior esquerdo
// 1 -> Superior direito
// 2 -> Inferior direito
// 3 -> Inferior esquerdo
//==========================================================

function ordenarMarcadores(marcadores){

    if(marcadores.length != 4){

        return [];

    }

    let pontos = [...marcadores];

    //--------------------------------------
    // Ordena por Y
    //--------------------------------------

    pontos.sort(

        (a,b)=>a.cy-b.cy

    );

    //--------------------------------------
    // Dois superiores
    //--------------------------------------

    let superiores = pontos.slice(0,2);

    //--------------------------------------
    // Dois inferiores
    //--------------------------------------

    let inferiores = pontos.slice(2,4);

    //--------------------------------------
    // Ordena por X
    //--------------------------------------

    superiores.sort(

        (a,b)=>a.cx-b.cx

    );

    inferiores.sort(

        (a,b)=>a.cx-b.cx

    );

    return[

        superiores[0],   // Superior esquerdo

        superiores[1],   // Superior direito

        inferiores[1],   // Inferior direito

        inferiores[0]    // Inferior esquerdo

    ];

}

//==========================================================
// Distância entre dois pontos
//==========================================================

function distancia(a,b){

    const dx = a.cx-b.cx;

    const dy = a.cy-b.cy;

    return Math.sqrt(

        dx*dx +

        dy*dy

    );

}

//==========================================================
// Validação geométrica
//
// Nesta versão apenas verifica:
//
// - Existem quatro marcadores
// - Não existem posições repetidas
//
// A perspectiva será responsável pelas demais validações.
//==========================================================

function validarGeometria(marcadores){

    if(marcadores.length != 4){

        console.log(

            "Quantidade inválida."

        );

        return false;

    }

    for(let i=0;i<4;i++){

        for(let j=i+1;j<4;j++){

            if(

                distancia(

                    marcadores[i],

                    marcadores[j]

                ) < 20

            ){

                console.log(

                    "Marcadores sobrepostos."

                );

                return false;

            }

        }

    }

    console.log(

        "Geometria aprovada."

    );

    return true;

}

/* ==========================================================
   FIM DA PARTE 5

   Próxima parte:

   function calcularScore()

   Final do detector.js

========================================================== */
/* ==========================================================
   detector.js
   AvaliaFácil
   Parte 6 de 6
========================================================== */

//==========================================================
// Cálculo do Score
//
// Nesta versão o detector já validou:
//
// ✓ Encontrou 4 marcadores
// ✓ Ordenou os marcadores
// ✓ Validou a geometria básica
//
// Portanto o score permanece máximo.
//
// Futuramente poderá ser utilizado para medir
// a qualidade da fotografia.
//==========================================================

function calcularScore(marcadores){

    if(!marcadores){

        return 0;

    }

    if(marcadores.length !== 4){

        return 0;

    }

    return 100;

}

//==========================================================
// Fim do detector
//==========================================================

console.log("================================");
console.log("Detector.js carregado.");
console.log("Versão 6.0");
console.log("================================");

/* ==========================================================
   FIM DA PARTE 6

   detector.js FINALIZADO

========================================================== */
