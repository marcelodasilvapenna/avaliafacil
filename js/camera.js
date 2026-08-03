/* ==========================================================
   camera.js
   AvaliaFácil
   Controle da câmera
========================================================== */

let streamCamera = null;

//==========================================================
// Atualiza mensagem na tela
//==========================================================

function atualizarStatus(texto){

    const mensagem = document.getElementById("mensagem");

    if(mensagem){

        mensagem.textContent = texto;

    }

    console.log(texto);

}

//==========================================================
// Abre a câmera
//==========================================================

async function abrirCamera(){

    try{

        atualizarStatus("Solicitando acesso à câmera...");

        const video = document.getElementById("video");

        streamCamera = await navigator.mediaDevices.getUserMedia({

            video:{

                facingMode:"environment",

                width:{ideal:1920},

                height:{ideal:1080}

            },

            audio:false

        });

        video.srcObject = streamCamera;

        await video.play();

        document.getElementById("btnCapturar").disabled = false;

        atualizarStatus("Câmera pronta.");

    }

    catch(erro){

        console.error(erro);

        atualizarStatus("Não foi possível acessar a câmera.");

    }

}

//==========================================================
// Fecha a câmera
//==========================================================

function fecharCamera(){

    if(!streamCamera){

        return;

    }

    streamCamera.getTracks().forEach(track=>{

        track.stop();

    });

    streamCamera = null;

    atualizarStatus("Câmera encerrada.");

}
