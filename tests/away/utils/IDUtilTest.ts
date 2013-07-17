///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/utils/IDUtilTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/utils/IDUtilTest.js
//------------------------------------------------------------------------------------------------

class IDUtilTest
{


    constructor()
    {
        console.log( away.library.IDUtil.createUID() );
    }


}

var GL = null;//: WebGLRenderingContext;
var test: IDUtilTest;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");
    test = new IDUtilTest();

}



