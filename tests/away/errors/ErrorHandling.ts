///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/errors/ErrorHandling.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/errors/ErrorHandling.js
//------------------------------------------------------------------------------------------------


class ErrorHandlingTest
{

    constructor()
    {

        throw new away.errors.AbstractMethodError();

    }


}
var GL = null;//: WebGLRenderingContext;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    try
    {

        var test = new ErrorHandlingTest();

    } catch ( e )
    {

        console.log( e , e instanceof away.errors.Error );

    }

}
