///<reference path="../src/away/library/AssetLibraryBundle.ts"/>



//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class AssetLibraryTest //extends away.events.EventDispatcher
    {



        constructor()
        {

        }

    }


}

var GL = null;//: WebGLRenderingContext;

window.onload = function ()
{

    var test = new tests.AssetLibraryTest();
    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

}

