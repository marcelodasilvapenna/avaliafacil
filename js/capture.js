/* ==========================================================
   capture.js
   AvaliaFácil
========================================================== */

//==========================================================
// Captura a imagem da câmera
//==========================================================

function capturarImagem(){

    atualizarStatus("Capturando imagem...");

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const foto = document.getElementById("foto");

    if(!video.srcObject){

        atualizarStatus("A câmera não está ativa.");

        return;

    }

    //------------------------------------------------------
    // Ajusta o canvas
    //------------------------------------------------------

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height

    );

    //------------------------------------------------------
    // Converte para imagem
    //------------------------------------------------------

    foto.src = canvas.toDataURL("image/jpeg",0.95);

    foto.onload = ()=>{

        atualizarStatus("Foto capturada.");

    };

    //------------------------------------------------------
    // Exibe a foto
    //------------------------------------------------------

    foto.style.display = "block";

    video.style.display = "none";

    canvas.style.display = "none";

    //------------------------------------------------------
    // Fecha câmera
    //------------------------------------------------------

    fecharCamera();

    //------------------------------------------------------
    // Botões
    //------------------------------------------------------

    document.getElementById(

        "btnCapturar"

    ).style.display="none";

    document.getElementById(

        "btnConfirmar"

    ).style.display="inline-block";

    document.getElementById(

        "btnNova"

    ).style.display="inline-block";

}

//==========================================================
// Reinicia a captura
//==========================================================

function novaCaptura(){

    const foto=document.getElementById("foto");

    const video=document.getElementById("video");

    foto.style.display="none";

    video.style.display="block";

    document.getElementById(

        "btnCapturar"

    ).style.display="inline-block";

    document.getElementById(

        "btnConfirmar"

    ).style.display="none";

    document.getElementById(

        "btnNova"

    ).style.display="none";

    abrirCamera();

}
