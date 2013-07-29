/**
 * Created with JetBrains PhpStorm.
 * User: karimbeyrouti
 * Date: 29/07/2013
 * Time: 16:57
 * To change this template use File | Settings | File Templates.
 */



///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/geom/MatrixTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/geom/MatrixTest.js
//------------------------------------------------------------------------------------------------


class MatrixTest
{

    constructor()
    {
        var m: away.geom.Matrix3D


        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
                                        2, 1, 0, 8,
                                        4, 0, 1, 7,
                                        5, 8, 7, 1 ] );

        console.log( m.rawData, m.determinant ) ;

         m = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                         0, 1, 8, 0,
                                         4, 8, 1, 7,
                                         5, 0, 7, 1] );

        console.log( m.rawData, m.determinant ) ;

        m  = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                         0, 1, 8, 0,
                                         4, 8, 1, 2,
                                         5, 0, 2, 1] );

        console.log( m.rawData, m.determinant ) ;

        m  = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 1,
                                        5, 0, 1, 1] );

        console.log( m.rawData, m.determinant ) ;


    }

    public getRnd( max : number , min : number ) : number {

        return Math.floor(Math.random() * (max - min + 1)) + min;
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


