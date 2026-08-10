/* ==========================================================
   readers.js
   AvaliaFácil

   Versão 0.3

   PRIMEIRO TESTE REAL DO LEITOR

   - Não corrige a perspectiva da imagem
   - Usa os quatro marcadores como referência
   - Localiza as bolhas diretamente na fotografia
   - Testa somente a questão 1
   - Alternativas A, B, C, D e E
   - Mostra o diagnóstico NA TELA DO CELULAR
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
        // Posição vertical da questão 1
        //----------------------------------
        //
        // Referência:
        //
        // 0 = linha dos marcadores superiores
        // 1 = linha dos marcadores inferiores
        //
        //----------------------------------

        Y: 0.295,


        //----------------------------------
        // Posição horizontal das colunas
        //----------------------------------
        //
        // Cada valor representa a posição
        // da alternativa A.
        //----------------------------------

        COLUNAS: [

            0.000,   // questões 1-10

            0.290,   // questões 11-20

            0.575,   // questões 21-30

            0.880    // questões 31-40

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
        // Raio relativo ao tamanho da folha
        //----------------------------------

        RAIO_RELATIVO: 0.010,


        //----------------------------------
        // Limite de intensidade
        //----------------------------------

        LIMIAR_ESCURO: 150,


        //----------------------------------
        // Percentual mínimo
        //----------------------------------

        LIMIAR_PREENCHIMENTO: 0.18

    }

};


//==========================================================
// Estado
//==========================================================

let readerUltimaResposta = null;


//==========================================================
// Cria área de diagnóstico na tela
//==========================================================

function criarPainelReader(){

    let painel =
        document.getElementById(
            "reader-diagnostico"
        );


    //--------------------------------------
    // Já existe?
    //--------------------------------------

    if(painel){

        return painel;

    }


    //--------------------------------------
    // Cria painel
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


    if(status && status.parentNode){

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
    // Formata valor
    //--------------------------------------

    function formatar(valor){

        return valor
            .toFixed(3)
            .replace(".", ",");

    }


    //--------------------------------------
    // Resultado
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
    // Diagnóstico das posições
    //--------------------------------------

    if(pontos){

        html +=
            "<hr>";


        html +=
            "<small>Posições detectadas</small>";


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
// Entrada principal
//==========================================================

function lerRespostas(

    imagem,

    marcadores

){

    console.log(
        "Reader iniciado."
    );


    //--------------------------------------
    // Limpa painel anterior
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
    // Ordena marcadores
    //--------------------------------------

    const pontos =
        ordenarMarcadores(
            marcadores
        );


    //--------------------------------------
    // Lê questão 1
    //--------------------------------------

    const resultado =
        lerQuestao1(

            imagem,

            pontos

        );


    //--------------------------------------
    // Guarda
    //--------------------------------------

    readerUltimaResposta =
        resultado.resposta;


    //--------------------------------------
    // Mostra na tela
    //--------------------------------------

    mostrarDiagnosticoReader(

        resultado.valores,

        resultado.resposta,

        resultado.pontos

    );


    //--------------------------------------
    // Retorno compatível com opencv.js
    //--------------------------------------

    return {

        1: resultado.resposta

    };

}


//==========================================================
// Ordena os marcadores
//==========================================================

function ordenarMarcadores(

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
    // Dois superiores
    //--------------------------------------

    const superiores =
        lista
            .slice(0,2)
            .sort(
                (a,b)=>a.cx-b.cx
            );


    //--------------------------------------
    // Dois inferiores
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

function lerQuestao1(

    imagem,

    marcadores

){

    //--------------------------------------
    // Y da questão 1
    //--------------------------------------

    const y =
        ReaderConfig
            .QUESTAO1
            .Y;


    //--------------------------------------
    // X da primeira coluna
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
    // Coordenadas
    //--------------------------------------

    const pontos = {

        A:
            transformarCoordenada(

                xBase,

                y,

                marcadores

            ),

        B:
            transformarCoordenada(

                xBase + espacamento,

                y,

                marcadores

            ),

        C:
            transformarCoordenada(

                xBase +
                espacamento * 2,

                y,

                marcadores

            ),

        D:
            transformarCoordenada(

                xBase +
                espacamento * 3,

                y,

                marcadores

            ),

        E:
            transformarCoordenada(

                xBase +
                espacamento * 4,

                y,

                marcadores

            )

    };


    //--------------------------------------
    // Mede
    //--------------------------------------

    const valores = {

        A:
            medirBolha(
                imagem,
                pontos.A,
                marcadores
            ),

        B:
            medirBolha(
                imagem,
                pontos.B,
                marcadores
            ),

        C:
            medirBolha(
                imagem,
                pontos.C,
                marcadores
            ),

        D:
            medirBolha(
                imagem,
                pontos.D,
                marcadores
            ),

        E:
            medirBolha(
                imagem,
                pontos.E,
                marcadores
            )

    };


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

    return {

        resposta: resposta,

        valores: valores,

        pontos: pontos

    };

}


//==========================================================
// Mede o interior de uma bolha
//==========================================================

function medirBolha(

    imagem,

    ponto,

    marcadores

){

    //--------------------------------------
    // Verifica ponto
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
    // Raio proporcional
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
    // Percorre círculo
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
            // Verifica imagem
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
    // Percentual
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
// IMPORTANTE:
//
// Não criamos uma nova imagem.
//
// Apenas usamos a transformação matemática
// para descobrir onde está a bolha na foto.
//==========================================================

function transformarCoordenada(

    x,

    y,

    marcadores

){

    //--------------------------------------
    // Pontos reais da fotografia
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
    //
    // Os centros dos marcadores representam:
    //
    // TL = 0,0
    // TR = 1,0
    // BR = 1,1
    // BL = 0,1
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
    // Matriz
    //--------------------------------------

    const matriz =
        cv.getPerspectiveTransform(

            dst,

            src

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

function determinarResposta(

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
    // Sem preenchimento suficiente
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
