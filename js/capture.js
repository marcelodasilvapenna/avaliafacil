/* ==================================================
   AvaliaFácil v0.2
   capture.js
================================================== */

/**
 * Captura um quadro do vídeo e transforma em imagem.
 */
function capturarFoto() {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const foto = document.getElementById("foto");

    const contexto = canvas.getContext("2d");

    // Ajusta o tamanho do canvas ao vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Copia a imagem do vídeo
    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Converte para imagem
    const imagem = canvas.toDataURL("image/jpeg", 0.95);

    foto.src = imagem;

    // Exibe a foto
    foto.style.display = "block";

    // Esconde o vídeo
    video.style.display = "none";

    // Exibe os botões corretos
    document.getElementById("btnCapturar").style.display = "none";
    document.getElementById("btnConfirmar").style.display = "inline-block";
    document.getElementById("btnNova").style.display = "inline-block";

    atualizarStatus("Foto capturada.");
}

/**
 * Confirma a foto.
 * Nas próximas versões esta função fará
 * a leitura do gabarito.
 */
function confirmarFoto() {

    atualizarStatus("Foto confirmada.");

    alert(
        "Na próxima versão começaremos\n" +
        "a localizar automaticamente a folha."
    );

}

/**
 * Descarta a foto e volta para a câmera.
 */
function novaFoto() {

    const video = document.getElementById("video");
    const foto = document.getElementById("foto");

    foto.style.display = "none";

    video.style.display = "block";

    document.getElementById("btnCapturar").style.display = "inline-block";
    document.getElementById("btnConfirmar").style.display = "none";
    document.getElementById("btnNova").style.display = "none";

    atualizarStatus("Pronto para uma nova captura.");

}