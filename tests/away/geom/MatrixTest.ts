///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/geom/MatrixTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/geom/MatrixTest.js
//------------------------------------------------------------------------------------------------


class MatrixTest
{

    private ma : away.geom.Matrix = new away.geom.Matrix( 10 , 11, 12 , 13 , 14 , 15);
    private mb : away.geom.Matrix = new away.geom.Matrix( 0 , 1, 2 , 3 , 4 , 5);

    constructor()
    {

        this.ma.concat( this.mb );
        console.log( this.ma );

    }


}

var GL = null;//: WebGLRenderingContext;

window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    try
    {

        var test = new MatrixTest();

    }
    catch ( e )
    {

        console.log( e );

    }


}

