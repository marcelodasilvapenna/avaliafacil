/* ==========================================================
   opencv.js
   AvaliaFácil
   Versão 2.2

   Integração com readers.js

   Estratégia:
   - Não utiliza correção de perspectiva
   - Mantém a fotografia original
   - Detecta os quatro marcadores
   - Guarda imagem e marcadores
   - Envia imagem e marcadores para o readers.js
========================================================== */


//==========================================================
// Estado global do processamento
//==========================================================

let opencvCarregado = false;


//----------------------------------------------------------
// Imagem original carregada no OpenCV
//----------------------------------------------------------

let imagemAtual = null;


//----------------------------------------------------------
// Quatro marcadores encontrados
//----------------------------------------------------------

let marcadoresAtuais = [];


//==========================================================
// Inicialização do OpenCV
//==========================================================

function opencvPronto(){

    cv.onRuntimeInitialized = ()=>{

        opencvCarregado = true;

        atualizarStatus(
            "OpenCV carregado."
        );

        console.log("--------------------------------");
        console.log("OpenCV carregado.");
        console.log("--------------------------------");

    };

}


//==========================================================
// Limpa processamento anterior
//==========================================================

function limparImagemAtual(){

    //--------------------------------------
    // Libera imagem anterior
    //--------------------------------------

    if(imagemAtual){

        try{

            imagemAtual.delete();

        }

        catch(erro){

            console.warn(
                "Erro ao liberar imagem anterior:",
                erro
            );

        }

    }


    //--------------------------------------
    // Limpa referência
    //--------------------------------------

    imagemAtual = null;


    //--------------------------------------
    // Limpa marcadores
    //--------------------------------------

    marcadoresAtuais = [];


    console.log(
        "Processamento anterior liberado."
    );

}


//==========================================================
// Processamento principal
//==========================================================

function processarImagem(){

    try{

        //--------------------------------------
        // Verifica OpenCV
        //--------------------------------------

        if(!opencvCarregado){

            atualizarStatus(
                "OpenCV não carregado."
            );

            console.warn(
                "Tentativa de processar antes do OpenCV."
            );

            return;

        }


        //--------------------------------------
        // Componentes da página
        //--------------------------------------

        const img =
            document.getElementById("foto");


        const canvas =
            document.getElementById("canvas");


        //--------------------------------------
        // Verifica imagem
        //--------------------------------------

        if(!img){

            atualizarStatus(
                "Imagem não encontrada."
            );

            console.error(
                "Elemento #foto não encontrado."
            );

            return;

        }


        //--------------------------------------
        // Limpa processamento anterior
        //--------------------------------------

        limparImagemAtual();


        //--------------------------------------
        // Mostra a fotografia original
        //--------------------------------------
        //
        // A própria tag <img> mostra a foto.
        //
        // Não usamos cv.imshow() para exibição.
        //--------------------------------------

        img.style.display =
            "block";


        //--------------------------------------
        // Canvas não será utilizado
        //--------------------------------------

        if(canvas){

            canvas.style.display =
                "none";

        }


        //--------------------------------------
        // Status
        //--------------------------------------

        atualizarStatus(
            "Lendo imagem..."
        );


        //--------------------------------------
        // Carrega imagem no OpenCV
        //--------------------------------------

        imagemAtual =
            cv.imread(img);


        //--------------------------------------
        // Verifica tamanho
        //--------------------------------------

        if(

            !imagemAtual ||

            imagemAtual.cols <= 0 ||

            imagemAtual.rows <= 0

        ){

            atualizarStatus(
                "Imagem inválida."
            );

            limparImagemAtual();

            return;

        }


        //--------------------------------------
        // Diagnóstico
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "IMAGEM CARREGADA NO OPENCV"
        );

        console.log(
            "Largura:",
            imagemAtual.cols
        );

        console.log(
            "Altura:",
            imagemAtual.rows
        );

        console.log(
            "Canais:",
            imagemAtual.channels()
        );

        console.log("--------------------------------");


        //--------------------------------------
        // Detector
        //--------------------------------------

        atualizarStatus(
            "Detectando marcadores..."
        );


        const resultado =
            detectarMarcadores(
                imagemAtual
            );


        //--------------------------------------
        // Diagnóstico do detector
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "RETORNO DO DETECTOR"
        );
        console.log("--------------------------------");

        console.log(
            resultado
        );

        console.log(
            "Encontrado:",
            resultado.encontrado
        );

        console.log(
            "Marcadores:",
            resultado.marcadores.length
        );

        console.log(
            "Score:",
            resultado.score
        );

        console.log("--------------------------------");


        //--------------------------------------
        // Folha não encontrada
        //--------------------------------------

        if(

            !resultado ||

            !resultado.encontrado ||

            !resultado.marcadores ||

            resultado.marcadores.length !== 4

        ){

            //----------------------------------
            // Limpa estado
            //----------------------------------

            marcadoresAtuais = [];


            //----------------------------------
            // Status
            //----------------------------------

            atualizarStatus(
                "Folha não encontrada."
            );


            //----------------------------------
            // Mantém foto original
            //----------------------------------

            img.style.display =
                "block";


            if(canvas){

                canvas.style.display =
                    "none";

            }


            console.warn(
                "Detector não encontrou quatro marcadores."
            );


            return;

        }


        //--------------------------------------
        // Folha encontrada
        //--------------------------------------

        atualizarStatus(
            "Folha encontrada."
        );


        //--------------------------------------
        // Guarda marcadores
        //--------------------------------------

        marcadoresAtuais =
            resultado.marcadores.map(

                m=>({

                    cx: m.cx,

                    cy: m.cy,

                    area: m.area,

                    largura: m.largura,

                    altura: m.altura

                })

            );


        //--------------------------------------
        // Diagnóstico dos marcadores
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "MARCADORES ATUAIS"
        );
        console.log("--------------------------------");


        marcadoresAtuais.forEach(

            (m,index)=>{

                console.log(

                    "Marcador",
                    index + 1,
                    "| X:",
                    m.cx,
                    "| Y:",
                    m.cy,
                    "| Área:",
                    m.area,
                    "| L:",
                    m.largura,
                    "| A:",
                    m.altura

                );

            }

        );


        console.log("--------------------------------");


        //--------------------------------------
        // Mantém foto original
        //--------------------------------------

        img.style.display =
            "block";


        if(canvas){

            canvas.style.display =
                "none";

        }


        //--------------------------------------
        // Status
        //--------------------------------------

        atualizarStatus(
            "Foto pronta para leitura."
        );


        console.log("--------------------------------");
        console.log(
            "FOTO PRONTA PARA LEITURA"
        );
        console.log("--------------------------------");


        //--------------------------------------
        // Verifica Reader
        //--------------------------------------

        if(

            typeof lerRespostas !==
            "function"

        ){

            console.warn(
                "readers.js não foi carregado."
            );


            atualizarStatus(
                "Reader não encontrado."
            );


            return;

        }


        //--------------------------------------
        // Inicia Reader
        //--------------------------------------
        //
        // IMPORTANTE:
        //
        // Enviamos a imagem ORIGINAL.
        //
        // Não existe perspectiva aqui.
        //--------------------------------------

        atualizarStatus(
            "Lendo questão 1..."
        );


        console.log("--------------------------------");
        console.log(
            "INICIANDO READER"
        );
        console.log("--------------------------------");


        const respostas =
            lerRespostas(

                imagemAtual,

                marcadoresAtuais

            );


        //--------------------------------------
        // Resultado do Reader
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "RESULTADO DO READER"
        );
        console.log("--------------------------------");

        console.log(
            respostas
        );

        console.log("--------------------------------");


        //--------------------------------------
        // Resultado da questão 1
        //--------------------------------------

        if(

            respostas &&

            respostas[1] !== undefined

        ){

            atualizarStatus(

                "Questão 1 = " +

                respostas[1]

            );

        }

        else{

            atualizarStatus(
                "Questão 1 não identificada."
            );

        }


        //--------------------------------------
        // NÃO apagar imagemAtual aqui.
        //
        // O readers.js ainda pode precisar dela.
        //--------------------------------------

        console.log("--------------------------------");
        console.log(
            "READER FINALIZADO"
        );
        console.log("--------------------------------");


    }

    catch(erro){

        //--------------------------------------
        // Console
        //--------------------------------------

        console.error(
            "ERRO NO PROCESSAMENTO:",
            erro
        );


        //--------------------------------------
        // Limpa marcadores
        //--------------------------------------

        marcadoresAtuais = [];


        //--------------------------------------
        // Libera imagem
        //--------------------------------------

        if(imagemAtual){

            try{

                imagemAtual.delete();

            }

            catch(e){

                console.warn(
                    "Erro ao liberar imagem:",
                    e
                );

            }

        }


        imagemAtual = null;


        //--------------------------------------
        // Mensagem
        //--------------------------------------

        atualizarStatus(

            "Erro: " +

            erro.message

        );

    }

}


//==========================================================
// Função auxiliar
//==========================================================

function obterImagemAtual(){

    return imagemAtual;

}


//==========================================================
// Função auxiliar
//==========================================================

function obterMarcadoresAtuais(){

    return marcadoresAtuais;

}


/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
