/* ==========================================================
   perspective.js
   AvaliaFácil
   Correção de Perspectiva v3.0
   Parte 1 de 3
========================================================== */

//==========================================================
// Configuração
//==========================================================

const PerspectiveConfig={

    // Tamanho da folha A4

    LARGURA:1654,

    ALTURA:2339

};

//==========================================================
// Corrige a perspectiva
//==========================================================

function corrigirPerspectiva(src,marcadores){

    console.log("================================");
    console.log("PERSPECTIVE");
    console.log("================================");

    //--------------------------------------
    // Imagem válida
    //--------------------------------------

    if(!src){

        console.log("Imagem inválida.");

        return null;

    }

    //--------------------------------------
    // Marcadores
    //--------------------------------------

    if(!marcadores){

        console.log("Marcadores inexistentes.");

        return null;

    }

    if(marcadores.length!==4){

        console.log(

            "Quantidade incorreta:",

            marcadores.length

        );

        return null;

    }

    atualizarStatus(

        "Corrigindo perspectiva..."

    );

    //--------------------------------------
    // O detector já entrega
    // os marcadores ordenados.
    //--------------------------------------

    const pontos = marcadores;

    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log("Marcadores:");

    pontos.forEach((p,i)=>{

        console.log(

            i,

            p.cx,

            p.cy

        );

    });

    //--------------------------------------
    // Pontos de origem
    //--------------------------------------

    const srcTri = cv.matFromArray(

        4,

        1,

        cv.CV_32FC2,

        [

            pontos[0].cx,
            pontos[0].cy,

            pontos[1].cx,
            pontos[1].cy,

            pontos[2].cx,
            pontos[2].cy,

            pontos[3].cx,
            pontos[3].cy

        ]

    );

    //--------------------------------------
    // Continua na Parte 2
    //--------------------------------------
/* ==========================================================
   perspective.js
   AvaliaFácil
   Correção de Perspectiva v3.0
   Parte 2 de 3
========================================================== */

    //--------------------------------------
    // Pontos de destino
    //--------------------------------------

    const dstTri = cv.matFromArray(

        4,

        1,

        cv.CV_32FC2,

        [

            0,
            0,

            PerspectiveConfig.LARGURA-1,
            0,

            PerspectiveConfig.LARGURA-1,
            PerspectiveConfig.ALTURA-1,

            0,
            PerspectiveConfig.ALTURA-1

        ]

    );

    console.log("Pontos de destino criados.");

    //--------------------------------------
    // Matriz
    //--------------------------------------

    const matriz = cv.getPerspectiveTransform(

        srcTri,

        dstTri

    );

    if(!matriz){

        console.log("Erro ao criar matriz.");

        atualizarStatus(

            "Erro na matriz."

        );

        srcTri.delete();

        dstTri.delete();

        return null;

    }

    console.log("Matriz criada.");

    //--------------------------------------
    // Imagem corrigida
    //--------------------------------------

    const folha = new cv.Mat();

    console.log("Executando warpPerspective...");

    cv.warpPerspective(

        src,

        folha,

        matriz,

        new cv.Size(

            PerspectiveConfig.LARGURA,

            PerspectiveConfig.ALTURA

        ),

        cv.INTER_LINEAR,

        cv.BORDER_CONSTANT,

        new cv.Scalar(

            255,

            255,

            255,

            255

        )

    );

    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log(

        "Folha criada:",

        folha.cols,

        "x",

        folha.rows

    );

    if(

        folha.cols===0 ||

        folha.rows===0

    ){

        console.log(

            "Folha inválida."

        );

        atualizarStatus(

            "Erro na perspectiva."

        );

        srcTri.delete();

        dstTri.delete();

        matriz.delete();

        folha.delete();

        return null;

    }

    console.log(

        "Perspective OK."

    );

    //--------------------------------------
    // Continua na Parte 3
    //--------------------------------------
   /* ==========================================================
   perspective.js
   AvaliaFácil
   Correção de Perspectiva v3.0
   Parte 3 de 3
========================================================== */

    //--------------------------------------
    // Libera memória
    //--------------------------------------

    srcTri.delete();

    dstTri.delete();

    matriz.delete();

    console.log("Memória liberada.");

    //--------------------------------------
    // Exibe a folha corrigida
    //--------------------------------------

    const canvas = document.getElementById("canvas");

    if(canvas){

        cv.imshow(

            "canvas",

            folha

        );

    }

    atualizarStatus(

        "Perspectiva concluída."

    );

    //--------------------------------------
    // Diagnóstico
    //--------------------------------------

    console.log("--------------------------------");
    console.log("FOLHA CORRIGIDA");
    console.log("--------------------------------");

    console.log(

        "Largura:",

        folha.cols

    );

    console.log(

        "Altura:",

        folha.rows

    );

    console.log("--------------------------------");
    console.log("PERSPECTIVA CONCLUÍDA");
    console.log("--------------------------------");

    //--------------------------------------
    // Retorno
    //--------------------------------------

    return folha;

}

//==========================================================
// Verifica os marcadores
//==========================================================

function validarMarcadores(marcadores){

    if(!Array.isArray(marcadores)){

        return false;

    }

    if(marcadores.length!==4){

        return false;

    }

    for(const marcador of marcadores){

        if(

            marcador.cx===undefined ||

            marcador.cy===undefined

        ){

            return false;

        }

    }

    return true;

}

//==========================================================
// Informações da folha
//==========================================================

function informarFolha(folha){

    console.log("--------------------------------");

    console.log("FOLHA");

    console.log("--------------------------------");

    console.log(

        "Largura:",

        folha.cols

    );

    console.log(

        "Altura:",

        folha.rows

    );

    console.log("--------------------------------");

}

/* ==========================================================
   FIM DO ARQUIVO
========================================================== */
