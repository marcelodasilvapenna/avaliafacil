/* ==========================================================
   opencv.js
   AvaliaFácil
   Versão 2.1

   Estratégia:
   - Não utiliza correção de perspectiva
   - Mantém a fotografia original
   - Detecta os quatro marcadores
   - Guarda imagem e marcadores para o readers.js
========================================================== */


//==========================================================
// Estado global do processamento
//==========================================================

let opencvCarregado = false;


// Imagem original carregada no OpenCV
let imagemAtual = null;


// Quatro marcadores encontrados
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
        // Não usamos cv.imshow().
        //
        // A própria tag <img> continua exibindo
        // a fotografia capturada.
        //--------------------------------------

        img.style.display =
            "block";


        //--------------------------------------
        // Canvas não será utilizado nesta etapa
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
            // Mantém foto original visível
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
        // Diagnóstico dos quatro marcadores
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
        // Verifica novamente a imagem
        //--------------------------------------

        if(!imagemAtual){

            atualizarStatus(
                "Imagem foi perdida durante o processamento."
            );

            return;

        }


        //--------------------------------------
        // IMPORTANTE
        //
        // Não fazemos:
        //
        // corrigirPerspectiva()
        //
        // Não fazemos:
        //
        // cv.imshow()
        //
        // Não desenhamos marcadores sobre
        // a imagem original.
        //--------------------------------------


        //--------------------------------------
        // Foto continua sendo mostrada
        // pela própria tag <img>
        //--------------------------------------

        img.style.display =
            "block";


        if(canvas){

            canvas.style.display =
                "none";

        }


        //--------------------------------------
        // Resultado
        //--------------------------------------

        atualizarStatus(
            "Foto pronta para leitura."
        );


        console.log("--------------------------------");
        console.log(
            "FOTO PRONTA PARA LEITURA"
        );
        console.log("--------------------------------");

        console.log(
            "imagemAtual:",
            imagemAtual.cols,
            "x",
            imagemAtual.rows
        );

        console.log(
            "marcadoresAtuais:",
            marcadoresAtuais.length
        );

        console.log("--------------------------------");


        //--------------------------------------
        // Não iniciamos o reader ainda
        //--------------------------------------
        //
        // Na próxima etapa teremos:
        //
        // lerRespostas(
        //     imagemAtual,
        //     marcadoresAtuais
        // );
        //
        //--------------------------------------


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
        // Estado
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
// Função auxiliar para o futuro readers.js
//==========================================================

function obterImagemAtual(){

    return imagemAtual;

}


//==========================================================
// Função auxiliar para o futuro readers.js
//==========================================================

function obterMarcadoresAtuais(){

    return marcadoresAtuais;

}


/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
