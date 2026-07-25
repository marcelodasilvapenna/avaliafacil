/* ==================================================
   AvaliaFácil v0.2
   camera.js
================================================== */

let stream = null;

/**
 * Atualiza a mensagem de status.
 */
function atualizarStatus(texto) {
    const mensagem = document.getElementById("mensagem");
    if (mensagem) {
        mensagem.textContent = texto;
    }
}

/**
 * Abre a câmera do dispositivo.
 */
async function abrirCamera() {

    const video = document.getElementById("video");

    try {

        atualizarStatus("Solicitando acesso à câmera...");

        stream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: {
                    ideal: "environment"
                },
                width: {
                    ideal: 1920
                },
                height: {
                    ideal: 1080
                }
            },

            audio: false

        });

        video.srcObject = stream;

        video.onloadedmetadata = () => {

            video.play();

            atualizarStatus("Câmera pronta.");

            document.getElementById("btnCapturar").disabled = false;

        };

    }
    catch (erro) {

        console.error(erro);

        atualizarStatus("Não foi possível acessar a câmera.");

        alert(
            "Erro ao acessar a câmera.\n\n" +
            "Verifique se o navegador possui permissão."
        );

    }

}

/**
 * Fecha a câmera.
 */
function fecharCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());

    stream = null;

    atualizarStatus("Câmera desligada.");

}

/**
 * Reinicia a câmera.
 */
async function reiniciarCamera() {

    fecharCamera();

    await abrirCamera();

}