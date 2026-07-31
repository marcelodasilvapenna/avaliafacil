/* ===========================================
   opencv.js
   Motor principal do processamento
   Compatível com detector.js v3.0
=========================================== */

let opencvCarregado = false;

//==================================================
// Inicialização do OpenCV
//==================================================

function opencvPronto() {

    cv.onRuntimeInitialized = () => {

        opencvCarregado = true;

        atualizarStatus("OpenCV carregado.");

        console.log("OpenCV pronto.");

    };

}

//==================================================
// Processa a imagem capturada
//==================================================

function processarImagem() {

    if (!opencvCarregado) {

        alert("OpenCV ainda não foi carregado.");
        return;

    }

    atualizarStatus("Processando imagem...");

    const img = document.getElementById("foto");

    if (!img || !img.complete || img.naturalWidth === 0) {

        atualizarStatus("Nenhuma imagem carregada.");
        return;

    }

    //----------------------------------------------
    // Lê a imagem
    //----------------------------------------------

    let src = cv.imread(img);

    //----------------------------------------------
    // Detector de marcadores
    //----------------------------------------------

    let resultado;

    try {

        resultado = detectarMarcadores(src);

    } catch (erro) {

        console.error(erro);

        atualizarStatus("Erro durante o processamento.");

        src.delete();

        return;

    }

    //----------------------------------------------
    // Desenha marcadores encontrados
    //----------------------------------------------

    if (resultado.encontrado) {

        atualizarStatus("Folha encontrada.");

        resultado.marcadores.forEach(m => {

            cv.circle(

                src,

                new cv.Point(m.cx, m.cy),

                12,

                new cv.Scalar(255, 0, 0, 255),

                4

            );

        });

        console.log("Marcadores:", resultado.marcadores);
        console.log("Score:", resultado.score);

    } else {

        atualizarStatus("Folha não encontrada.");

    }

    //----------------------------------------------
    // Exibe imagem processada
    //----------------------------------------------

    cv.imshow("canvas", src);

    //----------------------------------------------
    // Libera memória
    //----------------------------------------------

    src.delete();

}
