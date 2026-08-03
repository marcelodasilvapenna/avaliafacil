/* ==========================================================
   app.js
   AvaliaFácil
========================================================== */

window.addEventListener(

    "load",

    iniciarAplicacao

);

//==========================================================

function iniciarAplicacao(){

    atualizarStatus(

        "Sistema iniciado."

    );

    configurarBotoes();

}

//==========================================================

function configurarBotoes(){

    //------------------------------------------------------
    // Abrir câmera
    //------------------------------------------------------

    const btnCamera = document.getElementById(

        "btnCamera"

    );

    if(btnCamera){

        btnCamera.addEventListener(

            "click",

            abrirCamera

        );

    }

    //------------------------------------------------------
    // Capturar
    //------------------------------------------------------

    const btnCapturar = document.getElementById(

        "btnCapturar"

    );

    if(btnCapturar){

        btnCapturar.addEventListener(

            "click",

            ()=>{

                capturarImagem();

            }

        );

    }

    //------------------------------------------------------
    // Confirmar foto
    //------------------------------------------------------

    const btnConfirmar = document.getElementById(

        "btnConfirmar"

    );

    if(btnConfirmar){

        btnConfirmar.addEventListener(

            "click",

            ()=>{

                processarImagem();

            }

        );

    }

    //------------------------------------------------------
    // Nova foto
    //------------------------------------------------------

    const btnNova = document.getElementById(

        "btnNova"

    );

    if(btnNova){

        btnNova.addEventListener(

            "click",

            ()=>{

                location.reload();

            }

        );

    }

}
