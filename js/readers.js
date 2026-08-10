/* ==========================================================
   readers.js
   AvaliaFácil

   Versão 0.2

   LEITOR DE TESTE
   Questão 1 - A/B/C/D/E

   Estratégia:
   - Não corrige a perspectiva da imagem
   - Usa os quatro marcadores como referência
   - Calcula a posição das bolhas na fotografia
   - Analisa o interior das bolhas
   - Não utiliza o canvas
========================================================== */


//==========================================================
// CONFIGURAÇÃO
//==========================================================

const ReaderConfig = {

    //--------------------------------------
    // Sistema virtual da folha
    //--------------------------------------

    FOLHA_LARGURA: 1000,

    FOLHA_ALTURA: 1414,


    //--------------------------------------
    // Posição dos quatro marcadores
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
    // POSIÇÃO DAS QUESTÕES
    //--------------------------------------
    //
    // Calibrado inicialmente com base
    // na fotografia enviada.
    //--------------------------------------

    QUESTOES: {

        //----------------------------------
        // Primeira alternativa (A)
        // de cada coluna
        //----------------------------------

        COLUNAS_X: [

            0.075,

            0.321,

            0.573,

            0.824

        ],


        //----------------------------------
        // Questão 1
        //----------------------------------

        Y_INICIAL: 0.305,


        //----------------------------------
        // Distância vertical
        //----------------------------------

        ESPACAMENTO_Y: 0.050

    },


    //--------------------------------------
    // Distância entre A B C D E
    //--------------------------------------

    ALTERNATIVAS: {

        A: 0.000,

        B: 0.035,

        C: 0.070,

        D: 0.105,

        E: 0.140

    },


    //--------------------------------------
    // Tamanho da região interna analisada
    //--------------------------------------

    RAIO_ANALISE: 5,


    //--------------------------------------
    // Intensidade considerada escura
    //--------------------------------------

    LIMIAR_PIXEL: 140,


    //--------------------------------------
    // Percentual mínimo para considerar
    // uma alternativa marcada
    //--------------------------------------

    LIMIAR_PREENCHIMENTO: 0.20

};


//==========================================================
// Estado
//==========================================================

let readerUltimaResposta = null;


//==========================================================
// Entrada principal do Reader
//==========================================================

function lerRespostas(

    imagem,

    marcadores

){

    console.log("================================");
    console.log("READER INICIADO");
    console.log("================================");


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
            "Reader: são necessários 4 marcadores."
        );

        return null;

    }


    //--------------------------------------
    // Ordena marcadores
    //--------------------------------------

    const ordenados =
        ordenarMarcadores(

            marcadores

        );


    console.log("--------------------------------");
    console.log(
        "MARCADORES ORDENADOS PARA O READER"
    );
    console.log("--------------------------------");


    console.log(
        "TL:",
        ordenados.TL.cx,
        ordenados.TL.cy
    );

    console.log(
        "TR:",
        ordenados.TR.cx,
        ordenados.TR.cy
    );

    console.log(
        "BR:",
        ordenados.BR.cx,
        ordenados.BR.cy
    );

    console.log(
        "BL:",
        ordenados.BL.cx,
        ordenados.BL.cy
    );


    //--------------------------------------
    // Lê questão 1
    //--------------------------------------

    const resposta =
        lerQuestao(

            imagem,

            ordenados,

            1

        );


    //--------------------------------------
    // Guarda
    //--------------------------------------

    readerUltimaResposta =
        resposta;


    //--------------------------------------
    // Resultado
    //--------------------------------------

    console.log("================================");
    console.log(
        "QUESTÃO 1 =",
        resposta
    );
    console.log("================================");


    return {

        1: resposta

    };

}


//==========================================================
// Ordena os quatro marcadores
//==========================================================

function ordenarMarcadores(

    marcadores

){

    //--------------------------------------
    // Cria cópia
    //--------------------------------------

    const lista =
        marcadores.slice().sort(

            (a,b)=>a.cy-b.cy

        );


    //--------------------------------------
    // Dois de cima
    //--------------------------------------

    const cima =
        lista
            .slice(0,2)
            .sort(
                (a,b)=>a.cx-b.cx
            );


    //--------------------------------------
    // Dois de baixo
    //--------------------------------------

    const baixo =
        lista
            .slice(2,4)
            .sort(
                (a,b)=>a.cx-b.cx
            );


    //--------------------------------------
    // Resultado
    //--------------------------------------

    return {

        TL: cima[0],

        TR: cima[1],

        BL: baixo[0],

        BR: baixo[1]

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
    // Somente 1 neste estágio
    //--------------------------------------

    if(numero !== 1){

        console.warn(
            "Neste estágio o Reader lê somente a questão 1."
        );

        return null;

    }


    //--------------------------------------
    // Coluna
    //--------------------------------------

    const coluna = 0;


    //--------------------------------------
    // X base
    //--------------------------------------

    const xBase =
        ReaderConfig
            .QUESTOES
            .COLUNAS_X[coluna];


    //--------------------------------------
    // Y
    //--------------------------------------

    const y =

        ReaderConfig
            .QUESTOES
            .Y_INICIAL;


    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log("--------------------------------");
    console.log("QUESTÃO 1");
    console.log(
        "X base:",
        xBase
    );
    console.log(
        "Y:",
        y
    );
    console.log("--------------------------------");


    //--------------------------------------
    // Valores
    //--------------------------------------

    const valores = {};


    //--------------------------------------
    // A
    //--------------------------------------

    valores.A =
        medirAlternativa(

            imagem,

            marcadores,

            xBase +
            ReaderConfig.ALTERNATIVAS.A,

            y

        );


    //--------------------------------------
    // B
    //--------------------------------------

    valores.B =
        medirAlternativa(

            imagem,

            marcadores,

            xBase +
            ReaderConfig.ALTERNATIVAS.B,

            y

        );


    //--------------------------------------
    // C
    //--------------------------------------

    valores.C =
        medirAlternativa(

            imagem,

            marcadores,

            xBase +
            ReaderConfig.ALTERNATIVAS.C,

            y

        );


    //--------------------------------------
    // D
    //--------------------------------------

    valores.D =
        medirAlternativa(

            imagem,

            marcadores,

            xBase +
            ReaderConfig.ALTERNATIVAS.D,

            y

        );


    //--------------------------------------
    // E
    //--------------------------------------

    valores.E =
        medirAlternativa(

            imagem,

            marcadores,

            xBase +
            ReaderConfig.ALTERNATIVAS.E,

            y

        );


    //--------------------------------------
    // Mostra valores
    //--------------------------------------

    console.log("--------------------------------");
    console.log(
        "INTENSIDADE DAS ALTERNATIVAS"
    );
    console.log("--------------------------------");

    console.log(
        "A:",
        valores.A.toFixed(3)
    );

    console.log(
        "B:",
        valores.B.toFixed(3)
    );

    console.log(
        "C:",
        valores.C.toFixed(3)
    );

    console.log(
        "D:",
        valores.D.toFixed(3)
    );

    console.log(
        "E:",
        valores.E.toFixed(3)
    );

    console.log("--------------------------------");


    //--------------------------------------
    // Determina resposta
    //--------------------------------------

    const resposta =
        determinarResposta(

            valores

        );


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return resposta;

}


//==========================================================
// Mede o preenchimento da alternativa
//==========================================================

function medirAlternativa(

    imagem,

    marcadores,

    x,

    y

){

    //--------------------------------------
    // Transforma coordenada
    //--------------------------------------

    const ponto =
        transformarCoordenada(

            x,

            y,

            marcadores

        );


    //--------------------------------------
    // Verifica
    //--------------------------------------

    if(!ponto){

        return 0;

    }


    //--------------------------------------
    // Diagnóstico da posição
    //--------------------------------------

    console.log(
        "Bolha:",
        "X=",
        ponto.x.toFixed(1),
        "Y=",
        ponto.y.toFixed(1)
    );


    //--------------------------------------
    // Raio
    //--------------------------------------

    const raio =
        ReaderConfig.RAIO_ANALISE;


    //--------------------------------------
    // Contadores
    //--------------------------------------

    let total = 0;

    let escuros = 0;


    //--------------------------------------
    // Analisa região interna
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
            // Apenas círculo
            //----------------------------------

            if(

                dx * dx +
                dy * dy >

                raio * raio

            ){

                continue;

            }


            //----------------------------------
            // Coordenada na foto
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
            // Intensidade
            //----------------------------------

            let intensidade;


            if(

                imagem.channels() >= 3

            ){

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

                intensidade <

                ReaderConfig.LIMIAR_PIXEL

            ){

                escuros++;

            }


            total++;

        }

    }


    //--------------------------------------
    // Resultado
    //--------------------------------------

    if(total === 0){

        return 0;

    }


    return escuros / total;

}


//==========================================================
// Converte coordenada virtual para fotografia
//==========================================================

function transformarCoordenada(

    x,

    y,

    marcadores

){

    //--------------------------------------
    // Pontos reais
    //--------------------------------------

    const srcMat =
        cv.matFromArray(

            4,

            1,

            cv.CV_32FC2,

            [

                marcadores.TL.cx,
                marcadores.TL.cy,

                marcadores.TR.cx,
                marcadores.TR.cy,

                marcadores.BR.cx,
                marcadores.BR.cy,

                marcadores.BL.cx,
                marcadores.BL.cy

            ]

        );


    //--------------------------------------
    // Pontos virtuais
    //--------------------------------------

    const dstMat =
        cv.matFromArray(

            4,
            1,

            cv.CV_32FC2,

            [

                ReaderConfig.MARCADORES.TL.x *
                ReaderConfig.FOLHA_LARGURA,

                ReaderConfig.MARCADORES.TL.y *
                ReaderConfig.FOLHA_ALTURA,


                ReaderConfig.MARCADORES.TR.x *
                ReaderConfig.FOLHA_LARGURA,

                ReaderConfig.MARCADORES.TR.y *
                ReaderConfig.FOLHA_ALTURA,


                ReaderConfig.MARCADORES.BR.x *
                ReaderConfig.FOLHA_LARGURA,

                ReaderConfig.MARCADORES.BR.y *
                ReaderConfig.FOLHA_ALTURA,


                ReaderConfig.MARCADORES.BL.x *
                ReaderConfig.FOLHA_LARGURA,

                ReaderConfig.MARCADORES.BL.y *
                ReaderConfig.FOLHA_ALTURA

            ]

        );


    //--------------------------------------
    // Matriz de perspectiva
    //--------------------------------------

    const matriz =
        cv.getPerspectiveTransform(

            dstMat,

            srcMat

        );


    //--------------------------------------
    // Ponto virtual
    //--------------------------------------

    const ponto =
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
    // Ponto transformado
    //--------------------------------------

    const resultado =
        new cv.Mat();


    cv.perspectiveTransform(

        ponto,

        resultado,

        matriz

    );


    //--------------------------------------
    // Dados
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
// Determina a alternativa
//==========================================================

function determinarResposta(

    valores

){

    //--------------------------------------
    // Maior valor
    //--------------------------------------

    let maior =
        -1;


    let resposta =
        "?";


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
    // Procura maior
    //--------------------------------------

    alternativas.forEach(

        alternativa=>{

            const valor =
                valores[alternativa];


            if(valor > maior){

                maior =
                    valor;

                resposta =
                    alternativa;

            }

        }

    );


    //--------------------------------------
    // Preenchimento mínimo
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
