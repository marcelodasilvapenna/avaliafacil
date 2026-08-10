/* ==========================================================
   readers.js
   AvaliaFácil

   Leitor de gabarito
   Versão 0.1

   Estratégia:
   - Não corrige a perspectiva da imagem
   - Usa os 4 marcadores como referência geométrica
   - Calcula a posição das bolhas diretamente na foto
   - A = B = C = D = E
   - Inicialmente lê somente a questão 1

========================================================== */


//==========================================================
// CONFIGURAÇÃO DO MODELO DA FOLHA
//==========================================================
//
// Sistema de coordenadas normalizado:
//
// X = 0   → lado esquerdo da folha
// X = 1   → lado direito
//
// Y = 0   → topo da folha
// Y = 1   → parte inferior
//
// Os valores abaixo representam a posição das bolhas
// na folha impressa.
//
// IMPORTANTE:
// Estes valores serão calibrados usando a folha real.
//==========================================================

const ReaderConfig = {

    //--------------------------------------
    // Dimensões virtuais da folha
    //--------------------------------------

    FOLHA_LARGURA: 1000,

    FOLHA_ALTURA: 1414,


    //--------------------------------------
    // Marcadores
    //--------------------------------------
    //
    // Ordem:
    //
    // 0 = superior esquerdo
    // 1 = superior direito
    // 2 = inferior direito
    // 3 = inferior esquerdo
    //--------------------------------------

    MARCADORES: {

        TL: {
            x: 0.075,
            y: 0.045
        },

        TR: {
            x: 0.925,
            y: 0.045
        },

        BR: {
            x: 0.925,
            y: 0.945
        },

        BL: {
            x: 0.075,
            y: 0.945
        }

    },


    //--------------------------------------
    // Área das questões
    //--------------------------------------
    //
    // A folha possui:
    //
    // 4 colunas
    // 10 questões por coluna
    //
    // 1 - 10
    // 11 - 20
    // 21 - 30
    // 31 - 40
    //--------------------------------------

    QUESTOES: {

        PRIMEIRA_COLUNA_X: 0.195,

        SEGUNDA_COLUNA_X: 0.395,

        TERCEIRA_COLUNA_X: 0.595,

        QUARTA_COLUNA_X: 0.795,


        //----------------------------------
        // Primeira questão
        //----------------------------------

        Y_INICIAL: 0.365,


        //----------------------------------
        // Distância vertical entre questões
        //----------------------------------

        ESPACAMENTO_Y: 0.035

    },


    //--------------------------------------
    // Alternativas
    //--------------------------------------
    //
    // A B C D E
    //--------------------------------------

    ALTERNATIVAS: {

        A: 0.00,

        B: 0.020,

        C: 0.040,

        D: 0.060,

        E: 0.080

    },


    //--------------------------------------
    // Raio da região analisada
    //--------------------------------------

    RAIO_ANALISE: 8,


    //--------------------------------------
    // Quantidade mínima de pixels escuros
    //--------------------------------------

    LIMIAR_PREENCHIMENTO: 0.20

};


//==========================================================
// Estado do leitor
//==========================================================

let readerUltimaResposta = null;


//==========================================================
// Lê as questões
//==========================================================

function lerRespostas(

    imagem,

    marcadores

){

    console.log("--------------------------------");

    console.log(
        "READER"
    );

    console.log("--------------------------------");


    //--------------------------------------
    // Verifica imagem
    //--------------------------------------

    if(!imagem){

        console.error(
            "Reader: imagem não encontrada."
        );

        return null;

    }


    //--------------------------------------
    // Verifica marcadores
    //--------------------------------------

    if(

        !marcadores ||

        marcadores.length !== 4

    ){

        console.error(
            "Reader: quatro marcadores são necessários."
        );

        return null;

    }


    //--------------------------------------
    // Lê somente questão 1
    //--------------------------------------

    const resposta =
        lerQuestao(

            imagem,

            marcadores,

            1

        );


    //--------------------------------------
    // Guarda resultado
    //--------------------------------------

    readerUltimaResposta =
        resposta;


    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log("--------------------------------");

    console.log(
        "QUESTÃO 1"
    );

    console.log(
        "Resposta:",
        resposta
    );

    console.log("--------------------------------");


    return {

        1: resposta

    };

}


//==========================================================
// Lê uma questão
//==========================================================

function lerQuestao(

    imagem,

    marcadores,

    numero

){

    //--------------------------------------
    // Verifica número
    //--------------------------------------

    if(

        numero < 1 ||

        numero > 40

    ){

        console.error(
            "Número de questão inválido:",
            numero
        );

        return null;

    }


    //--------------------------------------
    // Determina coluna
    //--------------------------------------

    const coluna =
        Math.floor(

            (numero - 1) / 10

        );


    //--------------------------------------
    // Determina posição na coluna
    //--------------------------------------

    const linha =
        (numero - 1) % 10;


    //--------------------------------------
    // X da coluna
    //--------------------------------------

    let xColuna;


    if(coluna === 0){

        xColuna =
            ReaderConfig.QUESTOES.PRIMEIRA_COLUNA_X;

    }

    else if(coluna === 1){

        xColuna =
            ReaderConfig.QUESTOES.SEGUNDA_COLUNA_X;

    }

    else if(coluna === 2){

        xColuna =
            ReaderConfig.QUESTOES.TERCEIRA_COLUNA_X;

    }

    else{

        xColuna =
            ReaderConfig.QUESTOES.QUARTA_COLUNA_X;

    }


    //--------------------------------------
    // Y da questão
    //--------------------------------------

    const y =

        ReaderConfig.QUESTOES.Y_INICIAL +

        (

            linha *

            ReaderConfig.QUESTOES.ESPACAMENTO_Y

        );


    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log(
        "Questão:",
        numero
    );

    console.log(
        "Coluna:",
        coluna + 1
    );

    console.log(
        "Linha:",
        linha + 1
    );

    console.log(
        "X base:",
        xColuna
    );

    console.log(
        "Y:",
        y
    );


    //--------------------------------------
    // Lê alternativas
    //--------------------------------------

    const resultados = {


        A: medirAlternativa(

            imagem,

            marcadores,

            xColuna +
            ReaderConfig.ALTERNATIVAS.A,

            y

        ),


        B: medirAlternativa(

            imagem,

            marcadores,

            xColuna +
            ReaderConfig.ALTERNATIVAS.B,

            y

        ),


        C: medirAlternativa(

            imagem,

            marcadores,

            xColuna +
            ReaderConfig.ALTERNATIVAS.C,

            y

        ),


        D: medirAlternativa(

            imagem,

            marcadores,

            xColuna +
            ReaderConfig.ALTERNATIVAS.D,

            y

        ),


        E: medirAlternativa(

            imagem,

            marcadores,

            xColuna +
            ReaderConfig.ALTERNATIVAS.E,

            y

        )

    };


    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log(
        "A:",
        resultados.A
    );

    console.log(
        "B:",
        resultados.B
    );

    console.log(
        "C:",
        resultados.C
    );

    console.log(
        "D:",
        resultados.D
    );

    console.log(
        "E:",
        resultados.E
    );


    //--------------------------------------
    // Determina resposta
    //--------------------------------------

    const resposta =
        determinarResposta(

            resultados

        );


    //--------------------------------------
    // Resultado
    //--------------------------------------

    console.log(
        "Resultado:",
        resposta
    );


    return resposta;

}


//==========================================================
// Mede uma alternativa
//==========================================================

function medirAlternativa(

    imagem,

    marcadores,

    x,

    y

){

    //--------------------------------------
    // Converte coordenada da folha
    // para coordenada da fotografia
    //--------------------------------------

    const ponto =
        transformarCoordenada(

            x,

            y,

            marcadores

        );


    //--------------------------------------
    // Verifica ponto
    //--------------------------------------

    if(!ponto){

        return 0;

    }


    //--------------------------------------
    // Raio
    //--------------------------------------

    const raio =
        ReaderConfig.RAIO_ANALISE;


    //--------------------------------------
    // Região de análise
    //--------------------------------------

    let total =
        0;

    let escuros =
        0;


    //--------------------------------------
    // Percorre pequena região circular
    //--------------------------------------

    for(

        let dy = -raio;

        dy <= raio;

        dy++

    ){

        for(

            let dx = -raio;

            dx <= raio;

            dx++

        ){

            //----------------------------------
            // Distância do centro
            //----------------------------------

            if(

                dx * dx +

                dy * dy >

                raio * raio

            ){

                continue;

            }


            //----------------------------------
            // Coordenada
            //----------------------------------

            const px =
                Math.round(

                    ponto.x + dx

                );


            const py =
                Math.round(

                    ponto.y + dy

                );


            //----------------------------------
            // Fora da imagem
            //----------------------------------

            if(

                px < 0 ||

                py < 0 ||

                px >= imagem.cols ||

                py >= imagem.rows

            ){

                continue;

            }


            //----------------------------------
            // Pixel
            //----------------------------------

            const pixel =
                imagem.ucharPtr(

                    py,

                    px

                );


            //----------------------------------
            // RGB/RGBA
            //----------------------------------

            let intensidade;


            if(imagem.channels() >= 3){

                intensidade =

                    (

                        pixel[0] +

                        pixel[1] +

                        pixel[2]

                    ) / 3;

            }

            else{

                intensidade =
                    pixel[0];

            }


            //----------------------------------
            // Pixel escuro
            //----------------------------------

            if(

                intensidade < 130

            ){

                escuros++;

            }


            total++;

        }

    }


    //--------------------------------------
    // Percentual escuro
    //--------------------------------------

    if(total === 0){

        return 0;

    }


    return escuros / total;

}


//==========================================================
// Transforma coordenada da folha para a foto
//==========================================================

function transformarCoordenada(

    x,

    y,

    marcadores

){

    //--------------------------------------
    // Converte marcadores para formato interno
    //--------------------------------------

    const TL =
        marcadores[0];

    const TR =
        marcadores[1];

    const BR =
        marcadores[2];

    const BL =
        marcadores[3];


    //--------------------------------------
    // Coordenadas dos quatro cantos
    //--------------------------------------

    const src = [

        {
            x: TL.cx,
            y: TL.cy
        },

        {
            x: TR.cx,
            y: TR.cy
        },

        {
            x: BR.cx,
            y: BR.cy
        },

        {
            x: BL.cx,
            y: BL.cy
        }

    ];


    //--------------------------------------
    // Sistema virtual da folha
    //--------------------------------------

    const dst = [

        {
            x:
                ReaderConfig.MARCADORES.TL.x *
                ReaderConfig.FOLHA_LARGURA,

            y:
                ReaderConfig.MARCADORES.TL.y *
                ReaderConfig.FOLHA_ALTURA
        },

        {
            x:
                ReaderConfig.MARCADORES.TR.x *
                ReaderConfig.FOLHA_LARGURA,

            y:
                ReaderConfig.MARCADORES.TR.y *
                ReaderConfig.FOLHA_ALTURA
        },

        {
            x:
                ReaderConfig.MARCADORES.BR.x *
                ReaderConfig.FOLHA_LARGURA,

            y:
                ReaderConfig.MARCADORES.BR.y *
                ReaderConfig.FOLHA_ALTURA
        },

        {
            x:
                ReaderConfig.MARCADORES.BL.x *
                ReaderConfig.FOLHA_LARGURA,

            y:
                ReaderConfig.MARCADORES.BL.y *
                ReaderConfig.FOLHA_ALTURA
        }

    ];


    //--------------------------------------
    // Matrices OpenCV
    //--------------------------------------

    let srcMat =
        cv.matFromArray(

            4,

            1,

            cv.CV_32FC2,

            [

                src[0].x,
                src[0].y,

                src[1].x,
                src[1].y,

                src[2].x,
                src[2].y,

                src[3].x,
                src[3].y

            ]

        );


    let dstMat =
        cv.matFromArray(

            4,

            1,

            cv.CV_32FC2,

            [

                dst[0].x,
                dst[0].y,

                dst[1].x,
                dst[1].y,

                dst[2].x,
                dst[2].y,

                dst[3].x,
                dst[3].y

            ]

        );


    //--------------------------------------
    // Homografia
    //--------------------------------------

    let matriz =
        cv.getPerspectiveTransform(

            srcMat,

            dstMat

        );


    //--------------------------------------
    // Ponto
    //--------------------------------------

    let ponto =
        cv.matFromArray(

            1,

            1,

            cv.CV_32FC2,

            [

                x *
                ReaderConfig.FOLHA_LARGURA,

                y *
                ReaderConfig.FOLHA_ALTURA

            ]

        );


    //--------------------------------------
    // Transforma ponto
    //--------------------------------------

    let resultado =
        new cv.Mat();


    cv.perspectiveTransform(

        ponto,

        resultado,

        matriz

    );


    //--------------------------------------
    // Resultado
    //--------------------------------------

    const dados =
        resultado.data32F;


    const retorno = {

        x: dados[0],

        y: dados[1]

    };


    //--------------------------------------
    // Libera memória
    //--------------------------------------

    srcMat.delete();

    dstMat.delete();

    matriz.delete();

    ponto.delete();

    resultado.delete();


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return retorno;

}


//==========================================================
// Determina alternativa marcada
//==========================================================

function determinarResposta(

    resultados

){

    //--------------------------------------
    // Encontra maior valor
    //--------------------------------------

    let maior =
        -1;

    let resposta =
        null;


    //--------------------------------------
    // Alternativas
    //--------------------------------------

    const alternativas = [

        "A",

        "B",

        "C",

        "D",

        "E"

    ];


    //--------------------------------------
    // Percorre
    //--------------------------------------

    alternativas.forEach(

        alternativa=>{

            const valor =
                resultados[alternativa];


            if(valor > maior){

                maior =
                    valor;

                resposta =
                    alternativa;

            }

        }

    );


    //--------------------------------------
    // Verifica preenchimento mínimo
    //--------------------------------------

    if(

        maior <

        ReaderConfig.LIMIAR_PREENCHIMENTO

    ){

        return "?";

    }


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return resposta;

}


/* ==========================================================
   FIM DO readers.js
========================================================== */
