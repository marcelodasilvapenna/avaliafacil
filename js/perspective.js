/* ==========================================================
   perspective.js
   AvaliaFácil
   Correção de Perspectiva v2.0
========================================================== */

//==========================================================
// Configuração da folha corrigida
//==========================================================

const PerspectiveConfig = {

    // A4 em alta resolução
    LARGURA: 1654,

    ALTURA: 2339

};

//==========================================================
// Corrige a perspectiva da folha
//==========================================================

function corrigirPerspectiva(src, marcadores){

    console.log("================================");
    console.log("CORREÇÃO DE PERSPECTIVA");
    console.log("================================");

    //------------------------------------------------------
    // Validação
    //------------------------------------------------------

    if(!src){

        console.log("Imagem inválida.");

        return null;

    }

    if(!marcadores){

        console.log("Marcadores inexistentes.");

        return null;

    }

    if(marcadores.length !== 4){

        console.log(

            "Quantidade incorreta de marcadores:",

            marcadores.length

        );

        return null;

    }

    console.log(

        "Quatro marcadores confirmados."

    );

    //------------------------------------------------------
    // Ordena os marcadores
    //------------------------------------------------------

    const pontos = ordenarMarcadores(

        marcadores

    );

    console.log(

        "Marcadores ordenados."

    );

    //------------------------------------------------------
    // Continua na Parte 2...
      //------------------------------------------------------
    // Pontos de origem
    //------------------------------------------------------

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

    //------------------------------------------------------
    // Pontos de destino
    //------------------------------------------------------

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

    console.log("Pontos de origem criados.");
    console.log("Pontos de destino criados.");

    //------------------------------------------------------
    // Matriz de transformação
    //------------------------------------------------------

    const matriz = cv.getPerspectiveTransform(

        srcTri,

        dstTri

    );

    console.log("Matriz calculada.");

    //------------------------------------------------------
    // Imagem de saída
    //------------------------------------------------------

    const folha = new cv.Mat();

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

    console.log("Perspectiva corrigida.");

    //------------------------------------------------------
    // Continua na Parte 3...
      //------------------------------------------------------
    // Libera memória
    //------------------------------------------------------

    srcTri.delete();

    dstTri.delete();

    matriz.delete();

    console.log("Memória liberada.");

    //------------------------------------------------------
    // Exibe a folha corrigida
    //------------------------------------------------------

    const canvas = document.getElementById("canvas");

    if(canvas){

        cv.imshow(

            "canvas",

            folha

        );

    }

    console.log("Folha exibida.");

    //------------------------------------------------------
    // Diagnóstico
    //------------------------------------------------------

    console.log(

        "Largura:",

        folha.cols

    );

    console.log(

        "Altura:",

        folha.rows

    );

    console.log("================================");
    console.log("PERSPECTIVA CONCLUÍDA");
    console.log("================================");

    //------------------------------------------------------
    // Retorna a folha corrigida
    //------------------------------------------------------

    return folha;

}
//==========================================================
// Cria um ponto OpenCV
//==========================================================

function criarPonto(x,y){

    return new cv.Point(

        x,

        y

    );

}

//==========================================================
// Exibe os marcadores para depuração
//==========================================================

function mostrarMarcadores(marcadores){

    console.log("----------------------------");
    console.log("MARCADORES");

    marcadores.forEach((m,i)=>{

        console.log(

            i,

            "x:",

            Math.round(m.cx),

            "y:",

            Math.round(m.cy)

        );

    });

    console.log("----------------------------");

}

//==========================================================
// Verifica se os quatro marcadores existem
//==========================================================

function validarMarcadores(marcadores){

    if(!Array.isArray(marcadores)){

        console.log("Marcadores inválidos.");

        return false;

    }

    if(marcadores.length!==4){

        console.log(

            "Quantidade incorreta:",

            marcadores.length

        );

        return false;

    }

    for(const marcador of marcadores){

        if(

            marcador.cx===undefined ||

            marcador.cy===undefined

        ){

            console.log(

                "Marcador incompleto."

            );

            return false;

        }

    }

    return true;

}

//==========================================================
// Informações da folha
//==========================================================

function informarFolha(folha){

    console.log("----------------------------");
    console.log("FOLHA CORRIGIDA");
    console.log("----------------------------");

    console.log(

        "Largura:",

        folha.cols

    );

    console.log(

        "Altura:",

        folha.rows

    );

    console.log("----------------------------");

}


