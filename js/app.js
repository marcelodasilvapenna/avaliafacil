/* ==================================================
   AvaliaFácil v0.2
   app.js
================================================== */

window.addEventListener("load", iniciarSistema);

function iniciarSistema() {

    const btnCamera = document.getElementById("btnCamera");
    const btnCapturar = document.getElementById("btnCapturar");
    const btnConfirmar = document.getElementById("btnConfirmar");
    const btnNova = document.getElementById("btnNova");

    btnCamera.addEventListener("click", abrirCamera);

    btnCapturar.addEventListener("click", capturarFoto);

    btnConfirmar.addEventListener("click", confirmarFoto);

    btnNova.addEventListener("click", novaFoto);

    atualizarStatus("Clique em 'Abrir câmera'.");

    console.log("AvaliaFácil v0.2 iniciado.");

}