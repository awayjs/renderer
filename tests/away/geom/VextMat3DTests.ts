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
        var v : away.geom.Vector3D = new away.geom.Vector3D();
        var m: away.geom.Matrix3D
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
                                        2, 1, 0, 8,
                                        4, 0, 1, 7,
                                        5, 8, 7, 1 ] );
        m.copyRawDataTo( r )
        i = m.invert();
        this.outputInvert( i , m.rawData , r ) ;

         m = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                         0, 1, 8, 0,
                                         4, 8, 1, 7,
                                         5, 0, 7, 1] );

        m.copyRawDataTo( r )
        i = m.invert();
        this.outputInvert( i , m.rawData , r ) ;

        m  = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                         0, 1, 8, 0,
                                         4, 8, 1, 2,
                                         5, 0, 2, 1] );

        m.copyRawDataTo( r )
        i = m.invert();
        this.outputInvert( i , m.rawData , r ) ;

        m  = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 1,
                                        5, 0, 1, 1] );


        m  = new away.geom.Matrix3D( [	1,2,3,4,
                                        5,6,7,8,
                                        9,10,1,12,
                                        13,14,15,16]);

        m.copyColumnTo( 0, v) ; console.log (v.toString() ) ;
        m.copyColumnTo( 1, v) ; console.log ( v.toString() ) ;
        m.copyColumnTo( 2, v) ; console.log ( v.toString() ) ;
        m.copyColumnTo( 3, v) ; console.log ( v.toString() ) ;

        v.w = v.x = v.y = v.z = 0;
        m.copyColumnFrom( 0  , v ); console.log (m.rawData ) ;
        v.w = v.x = v.y = v.z = 1;
        m.copyColumnFrom( 1  , v ); console.log ( m.rawData ) ;
        v.w = v.x = v.y = v.z = 2;
        m.copyColumnFrom( 2  , v ); console.log ( m.rawData ) ;
        v.w = v.x = v.y = v.z = 3;
        m.copyColumnFrom( 3  , v ); console.log ( m.rawData ) ;

        /*

          VextMat3DTests.ts:67
         [Vector3D] VextMat3DTests.ts:68
         [Vector3D]  VextMat3DTests.ts:69
         [Vector3D]  VextMat3DTests.ts:70





         Vector3D(1, 2, 3)
         (x:1 ,y:2, z3, w:4)

         Vector3D(5, 6, 7)
         (x:5 ,y:6, z7, w:8)

         Vector3D(9, 10, 1)
         (x:9 ,y:10, z1, w:12)

         Vector3D(13, 14, 15)
         (x:13 ,y:14, z15, w:16)

         [0, 0, 0, 0, 5, 6, 7, 8, 9, 10, 1, 12, 13, 14, 15, 16] VextMat3DTests.ts:73
          0, 0, 0, 0, 5, 6, 7, 8, 9, 10, 1, 12, 13, 14, 15, 16

         [0, 0, 0, 0, 1, 1, 1, 1, 9, 10, 1, 12, 13, 14, 15, 16] VextMat3DTests.ts:75
          0, 0, 0, 0, 1, 1, 1, 1, 9, 10, 1, 12, 13, 14, 15, 16

          0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 13, 14, 15, 16
         [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 13, 14, 15, 16] VextMat3DTests.ts:77

          0, 0, 0, 0 ,1, 1, 1, 1, 2, 2, 2, 2, 3, 3 , 3 ,3
         [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]

         */
        /*

         m.copyRowTo( 0, v) ; console.log ( v ) ;
         m.copyRowTo( 1, v) ; console.log ( v ) ;
         m.copyRowTo( 2, v) ; console.log ( v ) ;
         m.copyRowTo( 3, v) ; console.log ( v ) ;

         v.w = v.x = v.y = v.z = 0;
         m.copyRowFrom( 0  , v ); console.log (m.rawData ) ;
         v.w = v.x = v.y = v.z = 1;
         m.copyRowFrom( 1  , v ); console.log ( m.rawData ) ;
         v.w = v.x = v.y = v.z = 2;
         m.copyRowFrom( 2  , v ); console.log ( m.rawData ) ;
         v.w = v.x = v.y = v.z = 3;
         m.copyRowFrom( 3  , v ); console.log ( m.rawData ) ;

         [0, 2, 4, 5, 0, 7, 8, 9, 0, 0, 1, 7, 0, 8, 7, 1] VextMat3DTests.ts:73
         0, 2, 4, 5, 0, 7, 8, 9, 0, 0, 1, 7, 0, 8, 7, 1 // AS3

         [0, 1, 4, 5, 0, 1, 8, 9, 0, 1, 1, 7, 0, 1, 7, 1] VextMat3DTests.ts:75
         0, 1, 4, 5, 0, 1, 8, 9, 0, 1, 1, 7, 0, 1, 7, 1 // AS3

         [0, 1, 2, 5, 0, 1, 2, 9, 0, 1, 2, 7, 0, 1, 2, 1] VextMat3DTests.ts:77
         0, 1, 2, 5, 0, 1, 2, 9, 0, 1, 2, 7, 0, 1, 2, 1 // AS3

         [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]
         0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3 // AS3s


         */

        m  = new away.geom.Matrix3D( [	1,2,4,5,
            6,7,8,9,
            4,0,1,7,
            5,8,7,1]);

        m.copyRowTo( 0, v) ; console.log ( v ) ;
        m.copyRowTo( 1, v) ; console.log ( v ) ;
        m.copyRowTo( 2, v) ; console.log ( v ) ;
        m.copyRowTo( 3, v) ; console.log ( v ) ;


    }

    public outputInvert(success : boolean , data : Array , original : Array )
    {

        console.log( 'testInvert(' + success + ', new <Number> [' + data + '], new <Number> [' + original + ']);' ) ;

    }

    public output( data : Array , result : number )
    {

        console.log( 'testDeterminant( new <Number> [' + data + '], ' +  result + ');' ) ;

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


