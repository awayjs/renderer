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

        //this.testAppendRotation();
        //this.testAppendTranslation();
        //this.testAppendScale();
        //this.testPosition();
        this.testDecompose();



    }


    public testDecompose() : void
    {

        console.log( '----------------------------------------------------------------------');
        console.log( 'testDecompose');
        var v : away.geom.Vector3D[] ;
        var m: away.geom.Matrix3D;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
            2, 1, 0, 8,
            4, 0, 1, 7,
            5, 8, 7, 1 ] );
        m.copyRawDataTo( r );

        v = m.decompose();
        this.outputDecompose(m.rawData , r , v[0], v[1], v[2]);

        m = new away.geom.Matrix3D( [   1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 7,
            5, 0, 7, 1] );
        m.copyRawDataTo( r );
        v = m.decompose();
        this.outputDecompose(m.rawData , r , v[0], v[1], v[2]);

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 2,
            5, 0, 2, 1] );
        m.copyRawDataTo( r );
        v = m.decompose();
        this.outputDecompose(m.rawData , r , v[0], v[1], v[2]);

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 1,
            5, 0, 1, 1] );
        m.copyRawDataTo( r );
        v = m.decompose();
        this.outputDecompose(m.rawData , r , v[0], v[1], v[2]);

        console.log('//------------------------------------------------------------ AS3');
        console.log( 'private function testDecompose( result : Vector.<Number> , original : Vector.<Number> , a1 : Vector3D , a2 : Vector3D  , a3 : Vector3D )' );
        console.log('{');
        console.log('    var m 		: Matrix3D = new Matrix3D( original );');
        console.log('    var result 	: Vector.<Vector3D> = m.decompose();');
        console.log("   trace('0----------------------------------------');");
        console.log("   trace( r[0])");
        console.log("   trace( a1 )");
        console.log("   trace('1--------------------');");
        console.log("   trace( r[1])");
        console.log("   trace( a2 )");
        console.log("   trace('2--------------------');");
        console.log("   trace( r[2])");
        console.log("   trace( a3 )");
        console.log("   trace('--------------------');");
        console.log("   trace( 'TSResult: ' , result );");
        console.log("   trace( 'ASResult: ' , m.rawData );");
        console.log("   trace( 'original: ' , original );");
        console.log("   trace('--------------------');");
        console.log('}');


    }

    public outputDecompose(result : number[] , original : number[] , a1 : away.geom.Vector3D , a2 : away.geom.Vector3D , a3 : away.geom.Vector3D)
    {

        var a1 : string = 'new Vector3D( ' + a1.x + ' , ' + a1.y + ' , ' + a1.z + ' )';
        var a2 : string = 'new Vector3D( ' + a2.x + ' , ' + a2.y + ' , ' + a2.z + ' )';
        var a3 : string = 'new Vector3D( ' + a3.x + ' , ' + a3.y + ' , ' + a3.z + ' )';


        console.log( 'testDecompose( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a1 + ' , '+ a2 + ' , ' + a3 + ' );' ) ;


    }

    public testPosition() : void
    {

        console.log( '----------------------------------------------------------------------');
        console.log( 'testPosition');
        var v : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 );
        var p : away.geom.Vector3D = new away.geom.Vector3D( 2 , 2 , 2 );
        var pos : away.geom.Vector3D;

        var m: away.geom.Matrix3D;
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
                                        2, 1, 0, 8,
                                        4, 0, 1, 7,
                                        5, 8, 7, 1 ] );
        m.copyRawDataTo( r );
        m.position = v;
        pos = m.position;
        this.outputPosition(m.rawData , r  , v  );

        m = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 7,
                                        5, 0, 7, 1] );
        m.copyRawDataTo( r );
        m.position = v;
        pos = m.position;
        this.outputPosition(m.rawData , r  , v  );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 2,
                                        5, 0, 2, 1] );
        m.copyRawDataTo( r );
        m.position = v;
        pos = m.position;
        this.outputPosition(m.rawData , r  , v  );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 1,
                                        5, 0, 1, 1] );
        m.copyRawDataTo( r );
        m.position = v;
        pos = m.position;
        this.outputPosition(m.rawData , r  , v  );

        console.log('//------------------------------------------------------------ AS3');
        console.log( 'private function testPosition( result : Vector.<Number> , original : Vector.<Number> , t : Vector3D )' );
        console.log('{');
        console.log('    var m : Matrix3D = new Matrix3D( original );');
        console.log('    m.position = t;');
        console.log('    var p : Vector3D = m.position;');
        console.log('    trace( "TSResult: " , result );');
        console.log('    trace( "ASResult: " , m.rawData );');
        console.log('    trace( "Pos: " ,p );');
        console.log('}');

    }
    public outputPosition(result : number[] , original : number[] , posResult : away.geom.Vector3D )
    {

        var a : string = 'new Vector3D( ' + posResult.x + ' , ' + posResult.y + ' , ' + posResult.z + ' )';

        console.log( 'testPosition( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ');' ) ;

    }


    public testAppendScale() : void
    {

        console.log( '----------------------------------------------------------------------');
        console.log( 'testAppendScale');
        var v : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 );
        var p : away.geom.Vector3D = new away.geom.Vector3D( 2 , 2 , 2 );

        var m: away.geom.Matrix3D;
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
            2, 1, 0, 8,
            4, 0, 1, 7,
            5, 8, 7, 1 ] );
        m.copyRawDataTo( r );
        m.appendScale(v.x , v.y , v.z ) ;

        this.outputAppendScale(m.rawData , r  , v  );

        m = new away.geom.Matrix3D( [   1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 7,
            5, 0, 7, 1] );

        m.copyRawDataTo( r )
        m.appendScale(v.x , v.y , v.z ) ;
        this.outputAppendScale(m.rawData , r , v );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 2,
            5, 0, 2, 1] );

        m.copyRawDataTo( r )
        m.appendScale(v.x , v.y , v.z ) ;
        this.outputAppendScale(m.rawData , r , v  );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 1,
            5, 0, 1, 1] );

        m.copyRawDataTo( r )
        m.appendScale(v.x , v.y , v.z ) ;
        this.outputAppendScale(m.rawData , r, v  );

        console.log('//------------------------------------------------------------ AS3');
        console.log( 'private function testAppendScale( result : Vector.<Number> , original : Vector.<Number> , t : Vector3D )' );
        console.log('{');
        console.log('    var m : Matrix3D = new Matrix3D( original );');
        console.log('    m.appendScale( t.x , t.y , t.z );');
        console.log('    trace( "TSResult: " , result );');
        console.log('    trace( "ASResult: " , m.rawData );');
        console.log('}');
    }


    public outputAppendScale(result : number[] , original : number[] , v : away.geom.Vector3D )
    {

        var a : string = 'new Vector3D( ' + v.x + ' , ' + v.y + ' , ' + v.z + ' )';

        console.log( 'testAppendScale( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ');' ) ;

    }

    public testAppendTranslation() : void
    {

        console.log( '----------------------------------------------------------------------');
        console.log( 'testAppendTranslation');
        var v : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 );
        var p : away.geom.Vector3D = new away.geom.Vector3D( 2 , 2 , 2 );

        var m: away.geom.Matrix3D;
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
            2, 1, 0, 8,
            4, 0, 1, 7,
            5, 8, 7, 1 ] );
        m.copyRawDataTo( r );
        m.appendTranslation(v.x , v.y , v.z ) ;

        this.outputAppendTranslation(m.rawData , r  , v  );

        m = new away.geom.Matrix3D( [   1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 7,
            5, 0, 7, 1] );

        m.copyRawDataTo( r )
        m.appendTranslation(v.x , v.y , v.z ) ;
        this.outputAppendTranslation(m.rawData , r , v );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 2,
            5, 0, 2, 1] );

        m.copyRawDataTo( r )
        m.appendTranslation(v.x , v.y , v.z ) ;
        this.outputAppendTranslation(m.rawData , r , v  );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
            0, 1, 8, 0,
            4, 8, 1, 1,
            5, 0, 1, 1] );

        m.copyRawDataTo( r )
        m.appendTranslation(v.x , v.y , v.z ) ;
        this.outputAppendTranslation(m.rawData , r, v  );

        console.log('//------------------------------------------------------------ AS3');
        console.log( 'private function testAppendTranslation( result : Vector.<Number> , original : Vector.<Number> , t : Vector3D )' );
        console.log('{');
        console.log('    var m : Matrix3D = new Matrix3D( original );');
        console.log('    m.appendTranslation( t.x , t.y , t.z );');
        console.log('    trace( "TSResult: " , result );');
        console.log('    trace( "ASResult: " , m.rawData );');
        console.log('}');
    }

    public outputAppendTranslation(result : number[] , original : number[] , v : away.geom.Vector3D )
    {

        //var axis  : number[] = new Array<number>( axis.x , axis.y , axis.z );
        //var pivot : number[] = new Array<number>( pivot.x , pivot.y , pivot.z );

        var a : string = 'new Vector3D( ' + v.x + ' , ' + v.y + ' , ' + v.z + ' )';

        console.log( 'testAppendTranslation( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ');' ) ;

    }

    public testAppendRotation() : void
    {

        console.log( '----------------------------------------------------------------------');
        console.log( 'testAppendRotation');

        var v : away.geom.Vector3D = new away.geom.Vector3D( 1 , 2 , 3 );
        var p : away.geom.Vector3D = new away.geom.Vector3D( 2 , 2 , 2 );

        var m: away.geom.Matrix3D;
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m = new away.geom.Matrix3D( [   1, 2, 4, 5,
                                        2, 1, 0, 8,
                                        4, 0, 1, 7,
                                        5, 8, 7, 1 ] );
        m.copyRawDataTo( r );
        m.appendRotation( 90 , v , p );

        this.outputAppendRotation(m.rawData , r  , v , p );

        m = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 7,
                                        5, 0, 7, 1] );

        m.copyRawDataTo( r )
        m.appendRotation( 90 , v , p );
        this.outputAppendRotation(m.rawData , r , v , p );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 2,
                                        5, 0, 2, 1] );

        m.copyRawDataTo( r )
        m.appendRotation( 90 , v , p );
        this.outputAppendRotation(m.rawData , r , v , p );

        m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
                                        0, 1, 8, 0,
                                        4, 8, 1, 1,
                                        5, 0, 1, 1] );

        m.copyRawDataTo( r )
        m.appendRotation( 90 , v , p );
        this.outputAppendRotation(m.rawData , r, v , p  );

        console.log('//------------------------------------------------------------ AS3');
        console.log( 'private function testAppendRotation( result : Vector.<Number> , original : Vector.<Number> , axis : Vector3D , pivot : Vector3D )' );
        console.log('{');
        console.log('    var m : Matrix3D = new Matrix3D( original );');
        console.log('    m.appendRotation( 90 , axis , pivot );');
        console.log('    trace( "TSResult: " , result );');
        console.log('    trace( "ASResult: " , m.rawData );');
        console.log('}');
    }

    public testInvert() : void
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



    }

    public testCopyRowTo()
    {

        var v : away.geom.Vector3D = new away.geom.Vector3D();
        var m: away.geom.Matrix3D
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

        m  = new away.geom.Matrix3D( [	1,2,4,5,
            6,7,8,9,
            4,0,1,7,
            5,8,7,1]);

        m.copyRowTo( 0, v) ; console.log ( v ) ;
        m.copyRowTo( 1, v) ; console.log ( v ) ;
        m.copyRowTo( 2, v) ; console.log ( v ) ;
        m.copyRowTo( 3, v) ; console.log ( v ) ;



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


    }
    public testCopyColumnTo()
    {

        var v : away.geom.Vector3D = new away.geom.Vector3D();
        var m: away.geom.Matrix3D
        var i : boolean;
        var r : Array<number> = new Array<number> ( 16 ) ;

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

    }

    public outputAppendRotation(result : number[] , original : number[] , axis : away.geom.Vector3D , pivot : away.geom.Vector3D )
    {

        //var axis  : number[] = new Array<number>( axis.x , axis.y , axis.z );
        //var pivot : number[] = new Array<number>( pivot.x , pivot.y , pivot.z );

        var a : string = 'new Vector3D( ' + axis.x + ' , ' + axis.y + ' , ' + axis.z + ' )';
        var p : string = 'new Vector3D( ' + pivot.x + ' , ' + pivot.y + ' , ' + pivot.z + ' )';

        console.log( 'testAppendRotation( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ' , ' + p + ');' ) ;

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


