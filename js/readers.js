/* ==========================================================
   readers.js
   AvaliaFácil

   Versão 0.4

   PRIMEIRO TESTE REAL DO LEITOR

   - Não corrige a perspectiva da imagem
   - Usa os quatro marcadores como referência
   - Localiza as bolhas diretamente na fotografia
   - Testa somente a questão 1
   - Alternativas A, B, C, D e E
   - Mostra o diagnóstico NA TELA DO CELULAR
   - Não interfere nas funções do detector
========================================================== */


//==========================================================
// CONFIGURAÇÃO
//==========================================================

const ReaderConfig = {

    //--------------------------------------
    // Questão 1
    //--------------------------------------

    QUESTAO1: {

        //----------------------------------
        // Posição vertical
        //----------------------------------

        Y: 0.295,


        //----------------------------------
        // Posição das quatro colunas
        //----------------------------------

        COLUNAS: [

            0.000,

            0.290,

            0.575,

            0.880

        ],


        //----------------------------------
        // Distância entre alternativas
        //----------------------------------

        ESPACAMENTO_ALTERNATIVAS: 0.040

    },


    //--------------------------------------
    // Análise da bolha
    //--------------------------------------

    ANALISE: {

        //----------------------------------
        // Raio proporcional
        //----------------------------------

        RAIO_RELATIVO: 0.010,


        //----------------------------------
        // Pixel considerado escuro
        //----------------------------------

        LIMIAR_ESCURO: 150,


        //----------------------------------
        // Mínimo para considerar marcado
        //----------------------------------

        LIMIAR_PREENCHIMENTO: 0.18

    }

};


//==========================================================
// Estado do Reader
//==========================================================

let readerUltimaResposta = null;


//==========================================================
// Cria painel de diagnóstico
//==========================================================

function criarPainelReader(){

    let painel =
        document.getElementById(
            "reader-diagnostico"
        );


    //--------------------------------------
    // Já existe
    //--------------------------------------

    if(painel){

        return painel;

    }


    //--------------------------------------
    // Cria
    //--------------------------------------

    painel =
        document.createElement(
            "section"
        );


    painel.id =
        "reader-diagnostico";


    //--------------------------------------
    // Estilo
    //--------------------------------------

    painel.style.margin =
        "15px";

    painel.style.padding =
        "18px";

    painel.style.borderRadius =
        "12px";

    painel.style.background =
        "#ffffff";

    painel.style.boxShadow =
        "0 2px 8px rgba(0,0,0,0.15)";

    painel.style.fontFamily =
        "Arial, sans-serif";

    painel.style.fontSize =
        "18px";

    painel.style.lineHeight =
        "1.6";


    //--------------------------------------
    // Insere depois do status
    //--------------------------------------

    const status =
        document.getElementById(
            "status"
        );


    if(

        status &&

        status.parentNode

    ){

        status.parentNode.insertBefore(

            painel,

            status.nextSibling

        );

    }

    else{

        document.body.appendChild(
            painel
        );

    }


    return painel;

}


//==========================================================
// Mostra diagnóstico
//==========================================================

function mostrarDiagnosticoReader(

    valores,

    resposta,

    pontos

){

    const painel =
        criarPainelReader();


    //--------------------------------------
    // Formata
    //--------------------------------------

    function formatar(valor){

        return valor
            .toFixed(3)
            .replace(".", ",");

    }


    //--------------------------------------
    // HTML
    //--------------------------------------

    let html = "";


    html +=
        "<strong>Leitura — Questão 1</strong>";


    html +=
        "<br><br>";


    //--------------------------------------
    // Valores
    //--------------------------------------

    html +=
        "A: " +
        formatar(valores.A);

    html +=
        "<br>";


    html +=
        "B: " +
        formatar(valores.B);

    html +=
        "<br>";


    html +=
        "C: " +
        formatar(valores.C);

    html +=
        "<br>";


    html +=
        "D: " +
        formatar(valores.D);

    html +=
        "<br>";


    html +=
        "E: " +
        formatar(valores.E);


    html +=
        "<br><br>";


    //--------------------------------------
    // Resultado
    //--------------------------------------

    html +=
        "<strong>Resultado: " +
        resposta +
        "</strong>";


    //--------------------------------------
    // Coordenadas
    //--------------------------------------

    if(pontos){

        html +=
            "<hr>";

        html +=
            "<small>" +
            "Posições analisadas:" +
            "</small>";

        html +=
            "<br>";


        html +=
            "<small>" +
            "A (" +
            Math.round(pontos.A.x) +
            ", " +
            Math.round(pontos.A.y) +
            ")" +
            "</small>";

        html +=
            "<br>";


        html +=
            "<small>" +
            "B (" +
            Math.round(pontos.B.x) +
            ", " +
            Math.round(pontos.B.y) +
            ")" +
            "</small>";

        html +=
            "<br>";


        html +=
            "<small>" +
            "C (" +
            Math.round(pontos.C.x) +
            ", " +
            Math.round(pontos.C.y) +
            ")" +
            "</small>";

        html +=
            "<br>";


        html +=
            "<small>" +
            "D (" +
            Math.round(pontos.D.x) +
            ", " +
            Math.round(pontos.D.y) +
            ")" +
            "</small>";

        html +=
            "<br>";


        html +=
            "<small>" +
            "E (" +
            Math.round(pontos.E.x) +
            ", " +
            Math.round(pontos.E.y) +
            ")" +
            "</small>";

    }


    painel.innerHTML =
        html;

}


//==========================================================
// Função principal do Reader
//==========================================================

function lerRespostas(

    imagem,

    marcadores

){

    //--------------------------------------
    // Painel
    //--------------------------------------

    const painelAnterior =
        document.getElementById(
            "reader-diagnostico"
        );


    if(painelAnterior){

        painelAnterior.innerHTML =
            "Analisando questão 1...";

    }


    //--------------------------------------
    // Verifica imagem
    //--------------------------------------

    if(!imagem){

        mostrarErroReader(
            "Imagem não encontrada."
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

        mostrarErroReader(
            "Os quatro marcadores não foram encontrados."
        );

        return null;

    }


    //--------------------------------------
    // IMPORTANTE
    //
    // Usa função com nome exclusivo do Reader.
    //
    // Não utiliza ordenarMarcadores(),
    // pois essa função pertence ao detector.
    //--------------------------------------

    const pontos =
        ordenarMarcadoresReader(
            marcadores
        );


    //--------------------------------------
    // Lê questão 1
    //--------------------------------------

    const resultado =
        lerQuestao1Reader(

            imagem,

            pontos

        );


    //--------------------------------------
    // Guarda
    //--------------------------------------

    readerUltimaResposta =
        resultado.resposta;


    //--------------------------------------
    // Mostra
    //--------------------------------------

    mostrarDiagnosticoReader(

        resultado.valores,

        resultado.resposta,

        resultado.pontos

    );


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return {

        1: resultado.resposta

    };

}


//==========================================================
// Ordena marcadores EXCLUSIVAMENTE para o Reader
//==========================================================

function ordenarMarcadoresReader(

    marcadores

){

    //--------------------------------------
    // Copia
    //--------------------------------------

    const lista =
        marcadores.slice();


    //--------------------------------------
    // Ordena por Y
    //--------------------------------------

    lista.sort(

        (a,b)=>a.cy-b.cy

    );


    //--------------------------------------
    // Superiores
    //--------------------------------------

    const superiores =
        lista
            .slice(0,2)
            .sort(
                (a,b)=>a.cx-b.cx
            );


    //--------------------------------------
    // Inferiores
    //--------------------------------------

    const inferiores =
        lista
            .slice(2,4)
            .sort(
                (a,b)=>a.cx-b.cx
            );


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return {

        TL: superiores[0],

        TR: superiores[1],

        BL: inferiores[0],

        BR: inferiores[1]

    };

}


//==========================================================
// Lê questão 1
//==========================================================

function lerQuestao1Reader(

    imagem,

    marcadores

){

    //--------------------------------------
    // Posição vertical
    //--------------------------------------

    const y =
        ReaderConfig
            .QUESTAO1
            .Y;


    //--------------------------------------
    // Primeira coluna
    //--------------------------------------

    const xBase =
        ReaderConfig
            .QUESTAO1
            .COLUNAS[0];


    //--------------------------------------
    // Espaçamento
    //--------------------------------------

    const espacamento =
        ReaderConfig
            .QUESTAO1
            .ESPACAMENTO_ALTERNATIVAS;


    //--------------------------------------
    // Calcula pontos
    //--------------------------------------

    const pontos = {

        A:
            transformarCoordenadaReader(

                xBase,

                y,

                marcadores

            ),

        B:
            transformarCoordenadaReader(

                xBase + espacamento,

                y,

                marcadores

            ),

        C:
            transformarCoordenadaReader(

                xBase + espacamento * 2,

                y,

                marcadores

            ),

        D:
            transformarCoordenadaReader(

                xBase + espacamento * 3,

                y,

                marcadores

            ),

        E:
            transformarCoordenadaReader(

                xBase + espacamento * 4,

                y,

                marcadores

            )

    };


    //--------------------------------------
    // Mede
    //--------------------------------------

    const valores = {

        A:
            medirBolhaReader(
                imagem,
                pontos.A,
                marcadores
            ),

        B:
            medirBolhaReader(
                imagem,
                pontos.B,
                marcadores
            ),

        C:
            medirBolhaReader(
                imagem,
                pontos.C,
                marcadores
            ),

        D:
            medirBolhaReader(
                imagem,
                pontos.D,
                marcadores
            ),

        E:
            medirBolhaReader(
                imagem,
                pontos.E,
                marcadores
            )

    };


    //--------------------------------------
    // Determina
    //--------------------------------------

    const resposta =
        determinarRespostaReader(
            valores
        );


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return {

        resposta: resposta,

        valores: valores,

        pontos: pontos

    };

}


//==========================================================
// Mede uma bolha
//==========================================================

function medirBolhaReader(

    imagem,

    ponto,

    marcadores

){

    //--------------------------------------
    // Verifica
    //--------------------------------------

    if(!ponto){

        return 0;

    }


    //--------------------------------------
    // Distância entre marcadores superiores
    //--------------------------------------

    const distanciaX =
        Math.hypot(

            marcadores.TR.cx -
            marcadores.TL.cx,

            marcadores.TR.cy -
            marcadores.TL.cy

        );


    //--------------------------------------
    // Raio
    //--------------------------------------

    let raio =

        distanciaX *

        ReaderConfig
            .ANALISE
            .RAIO_RELATIVO;


    //--------------------------------------
    // Limites
    //--------------------------------------

    raio =
        Math.max(

            4,

            Math.min(

                raio,

                14

            )

        );


    //--------------------------------------
    // Contadores
    //--------------------------------------

    let total =
        0;

    let escuros =
        0;


    //--------------------------------------
    // Região circular
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
            // Fora do círculo
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
            // Escuro
            //----------------------------------

            if(

                intensidade <

                ReaderConfig
                    .ANALISE
                    .LIMIAR_ESCURO

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
// Transformação geométrica
//==========================================================
//
// Não cria uma imagem nova.
//
// Apenas calcula onde uma coordenada virtual
// da folha está localizada na fotografia.
//==========================================================

function transformarCoordenadaReader(

    x,

    y,

    marcadores

){

    //--------------------------------------
    // Pontos da fotografia
    //--------------------------------------

    const src =
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
    // Sistema virtual
    //--------------------------------------

    const dst =
        cv.matFromArray(

            4,

            1,

            cv.CV_32FC2,

            [

                0, 0,

                1, 0,

                1, 1,

                0, 1

            ]

        );


    //--------------------------------------
    // Transformação
    //--------------------------------------

    const matriz =
        cv.getPerspectiveTransform(

            dst,

            src

        );


    //--------------------------------------
    // Ponto
    //--------------------------------------

    const ponto =
        cv.matFromArray(

            1,

            1,

            cv.CV_32FC2,

            [

                x,

                y

            ]

        );


    //--------------------------------------
    // Resultado
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

    src.delete();

    dst.delete();

    matriz.delete();

    ponto.delete();

    resultado.delete();


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return retorno;

}


//==========================================================
// Determina resposta
//==========================================================

function determinarRespostaReader(

    valores

){

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
    // Maior
    //--------------------------------------

    let maior =
        -1;


    let resposta =
        "?";


    //--------------------------------------
    // Procura
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
    // Limite
    //--------------------------------------

    if(

        maior <

        ReaderConfig
            .ANALISE
            .LIMIAR_PREENCHIMENTO

    ){

        resposta =
            "?";

    }


    //--------------------------------------
    // Retorno
    //--------------------------------------

    return resposta;

}


//==========================================================
// Erro
//==========================================================

function mostrarErroReader(

    mensagem

){

    const painel =
        criarPainelReader();


    painel.innerHTML =

        "<strong>Reader</strong>" +

        "<br><br>" +

        mensagem;

}


/* ==========================================================
   FIM DO readers.js
========================================================== */
