///<reference path="../../../lib/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.geom {

    export class VextMat3DTests
    {

        constructor()
        {

            var m:away.geom.Matrix3D = new away.geom.Matrix3D(    [ 1, 2, 3, 4,
                                                                    5, 6, 7, 8,
                                                                    9, 10, 11, 12,
                                                                    13, 14, 15, 16 ] );

            var v : away.geom.Vector3D = new away.geom.Vector3D();

            console.log('------------------------------------ copyColumnTo');// DONE OK

            m.copyColumnTo( 0 , v );console.log('copyColumnTo 0 ' , v );
            m.copyColumnTo( 1 , v );console.log('copyColumnTo 1 ' , v );
            m.copyColumnTo( 2 , v );console.log('copyColumnTo 2 ' , v );
            m.copyColumnTo( 3 , v );console.log('copyColumnTo 3 ' , v );

            console.log('------------------------------------ copyRowTo');// DONE OK

            var r : away.geom.Vector3D = new away.geom.Vector3D();

            m.copyRowTo( 0 , r );console.log('copyRowTo 0 ' , r );
            m.copyRowTo( 1 , r );console.log('copyRowTo 1 ' , r );
            m.copyRowTo( 2 , r );console.log('copyRowTo 2 ' , r );
            m.copyRowTo( 3 , r );console.log('copyRowTo 3 ' , r );

            console.log('------------------------------------ copyRowFrom'); // DONE OK

            m = new away.geom.Matrix3D([ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

            m.copyRowFrom( 0 , new away.geom.Vector3D( 16 , 15 , 14 , 13) ); console.log('copyRowFrom 0 ' , m.rawData );
            m.copyRowFrom( 1 , new away.geom.Vector3D( 12 , 11 , 10 ,  9) ); console.log('copyRowFrom 1 ' , m.rawData );
            m.copyRowFrom( 2 , new away.geom.Vector3D(  8 ,  7 ,  6 ,  5) ); console.log('copyRowFrom 2 ' , m.rawData );
            m.copyRowFrom( 3 , new away.geom.Vector3D(  4 ,  3 ,  2 ,  1) ); console.log('copyRowFrom 3 ' , m.rawData );

            console.log('------------------------------------ copyColumnFrom'); // DONE OK

            m = new away.geom.Matrix3D([ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

            m.copyColumnFrom( 0 , new away.geom.Vector3D( 16 , 15 , 14 , 13) ); console.log('copyColumnFrom 0 ' , m.rawData );
            m.copyColumnFrom( 1 , new away.geom.Vector3D( 12 , 11 , 10 ,  9) ); console.log('copyColumnFrom 1 ' , m.rawData );
            m.copyColumnFrom( 2 , new away.geom.Vector3D(  8 ,  7 ,  6 ,  5) ); console.log('copyColumnFrom 2 ' , m.rawData );
            m.copyColumnFrom( 3 , new away.geom.Vector3D(  4 ,  3 ,  2 ,  1) ); console.log('copyColumnFrom 3 ' , m.rawData );

            console.log('------------------------------------ Append'); // DONE OK

            m = new away.geom.Matrix3D( [ 1, 2, 3, 4,
                                          5, 6, 7, 8,
                                          9, 10, 11, 12,
                                          13, 14, 15, 16 ] );

            var s : away.geom.Matrix3D = new away.geom.Matrix3D( [    16 , 15 , 14 , 13 ,
                                                                      12 , 11 , 10 ,  9 ,
                                                                       8 ,  7 ,  6 ,  5 ,
                                                                       4 ,  3 ,  2 ,  1 ] );

            m.append( s );

            console.log('Append Result' , m.rawData );
            console.log('Appendee' ,      s.rawData );


            console.log('------------------------------------ Prepend'); // DONE OK

            m = new away.geom.Matrix3D( [   1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            s = new away.geom.Matrix3D( [    16 , 15 , 14 , 13 ,
                                             12 , 11 , 10 ,  9 ,
                                             8 ,  7 ,  6 ,  5 ,
                                             4 ,  3 ,  2 ,  1 ] );

            m.prepend( s );

            console.log('Prepend Result' , m.rawData );
            console.log('Prependee' ,      s.rawData );


            console.log('------------------------------------ Append Translation'); // DONE OK

            m = new away.geom.Matrix3D( [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            m.appendTranslation( 5 , 6 , 7 );
            console.log(' Append Translation' , m.rawData );


            console.log('------------------------------------ appendRotation'); // DONE OK - Pivot gives different result ( commented out for now )

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );


            var pivot : away.geom.Vector3D = new away.geom.Vector3D ( 7 , 8 ,9  );

            var axis : away.geom.Vector3D = new away.geom.Vector3D( 0 , 0 , 1 ); // checked for x,y,z;
            m.appendRotation( 45 , axis );//, pivot );
            console.log( 'appendRotation' , m.rawData );

            console.log('------------------------------------ appendScale'); // DONE OK

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            m.appendScale( 6 , 7 , 8 );
            console.log( 'appendScale' , m.rawData );

            console.log('------------------------------------ prepentScale'); // DONE OK

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            m.prependScale( 6 , 7 , 8 );
            console.log( 'prepentScale' , m.rawData );


            console.log('------------------------------------ clone'); // DONE OK

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );


            console.log( 'clone' , m.clone().rawData);

            console.log('------------------------------------ copyFrom'); // DONE OK

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            var cl : away.geom.Matrix3D = new away.geom.Matrix3D([ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            cl.copyFrom( m )

            console.log( 'copyFrom' , cl.rawData );


            console.log('------------------------------------ copyRawDataFrom'); // DONE ok - Offet / Traspose not implemented

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            m.copyRawDataFrom([ 16 , 15 , 14 , 13 , 12 , 11 , 10 ,  9 , 8 ,  7 ,  6 ,  5 , 4 ,  3 ,  2 ,  1 ] );

            console.log( 'copyRawDataFrom' , m.rawData );

            console.log('------------------------------------ copyRawDataTo'); // done OK

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            var result : number[] = new Array<number>( 9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9);

            console.log( 'result.length: ' , result.length  );

            m.copyRawDataTo( result , 1 , true );
            console.log( 'rawData' , m.rawData );
            console.log( 'copyRawDataTo' ,result );

            console.log('------------------------------------ transpose'); // DONE ok - Offet / Traspose not implemented

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            m.transpose()
            console.log( 'transpose' , m.rawData );


            console.log('------------------------------------ copyToMatrix3D'); // done ok

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            s = new away.geom.Matrix3D( [    16 , 15 , 14 , 13 ,
                12 , 11 , 10 ,  9 ,
                8 ,  7 ,  6 ,  5 ,
                4 ,  3 ,  2 ,  1 ] );

            m.copyToMatrix3D( s )
            console.log( 'copyToMatrix3D' , m.rawData );


            console.log('------------------------------------ decompose'); /// NOT WORKING

            m = new away.geom.Matrix3D( [ 1, 6, 0, 0,
                                          0, 1, 0, 0,
                                          0, 0, 1, 0,
                                          0, 0, 0, 1 ] );

            var resultDecompose : away.geom.Vector3D[] = m.decompose();
            console.log( 'copyToMatrix3D' , resultDecompose[0] );
            console.log( 'copyToMatrix3D' , resultDecompose[1] );
            console.log( 'copyToMatrix3D' , resultDecompose[2] );

            console.log('------------------------------------ determinant'); // WORKING ok - good

            m = new away.geom.Matrix3D( [   1, 2, 0, 6,
                                            2, 1, 0, 0,
                                            0, 0, 1, 3,
                                            6, 0, 3, 1 ] );

            console.log( 'determinant:' , m.determinant );

            m = new away.geom.Matrix3D( [   1, 2, 5, 6,
                                            2, 1, 0, 8,
                                            5, 0, 1, 3,
                                            6, 8, 3, 1 ] );

            console.log( 'determinant:' , m.determinant );

            m = new away.geom.Matrix3D( [   1, 0, 0, 0,
                                            0, 1, 0, 0,
                                            0, 0, 1, 0,
                                            0, 0, 0, 1 ] );

            console.log( 'determinant:' , m.determinant );

            console.log('------------------------------------ invert'); // WORKING ok - good

            m = new away.geom.Matrix3D( [   1, 2, 5, 6,
                                            2, 1, 0, 8,
                                            5, 0, 1, 3,
                                            6, 8, 3, 1 ] );

            var b : boolean;

            b = m.invert();
            console.log( 'invert:' , b , m.rawData );

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            b = m.invert();
            console.log( 'invert:' , b , m.rawData );

            console.log('------------------------------------ Prepend Rotation'); // OK Good

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            axis = new away.geom.Vector3D( 1 , 0 ,0 );
            m.prependRotation( 45 , axis );

            console.log( 'prependRotation:' , m.rawData );


            console.log('------------------------------------ prependTranslation'); // OK Good

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            m.prependTranslation( 5 , 10 , 15 );

            console.log( 'prependTranslation:' , m.rawData );


            console.log('------------------------------------ recompose'); // OK Good

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            var rVects : away.geom.Vector3D[] = new Array<away.geom.Vector3D>();
            rVects.push ( new away.geom.Vector3D( 5 , 1 , 3 ) );
            rVects.push ( new away.geom.Vector3D( 5 , 0 , 1 ) );
            rVects.push ( new away.geom.Vector3D( 2 , 1 , 3 ) );

            m.recompose( rVects )

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );

            rVects = new Array<away.geom.Vector3D>();
            rVects.push ( new away.geom.Vector3D( 1 , 2 , 9 ) );
            rVects.push ( new away.geom.Vector3D( 3 , 3 , 1 ) );
            rVects.push ( new away.geom.Vector3D( 8 , 1 , 8 ) );

            m.recompose( rVects )

            console.log( 'recompose:' , m.rawData );


            rVects = new Array<away.geom.Vector3D>();
            rVects.push ( new away.geom.Vector3D( 1 , 2 , 9 ) );
            rVects.push ( new away.geom.Vector3D( 3 , 3 , 1 ) );
            rVects.push ( new away.geom.Vector3D( 0 , 0 , 0 ) );

            var b : boolean = m.recompose( rVects )

            console.log( 'fail - recompose:' , m.rawData , b );

            console.log('------------------------------------ transformVector '); // IT WORKS !!!

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );


            var tVResult : away.geom.Vector3D = m.transformVector( new away.geom.Vector3D( 1,2,3 ));

            console.log( tVResult )


            console.log('------------------------------------ transformVector '); // IT WORKS !!!

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            var vout    : number[] = new Array<number>(0 , 1 , 2 , 3 , 4 , 5 );
            var vin     : number[] = new Array<number>(4,5,6);
            m.transformVectors( vin , vout );
            console.log( 'transformVector' , vout , vin )


            console.log('------------------------------------ transpose'); // IT WORKS !!!

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            m.transpose();
            console.log( 'transpose' , m.rawData );


            console.log('------------------------------------ getAxisRotation'); // internal class

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16 ] );

            //m.getAxisRotation(4 , 5 , 6 , 90 );
            //console.log( 'getAxisRotation' , m.rawData );

            console.log('------------------------------------ position'); // internal class

            m = new away.geom.Matrix3D(   [ 1, 2, 3, 4,
                                            5, 6, 7, 8,
                                            9, 10, 11, 12,
                                            13, 14, 15, 16 ] );


            var posVect : away.geom.Vector3D = new away.geom.Vector3D( 5 , 10 , 15 );

            m.position = posVect;

            console.log( 'set position' , m.rawData );
            console.log( 'get position' , m.position );


        }

        public testappend() : void
        {

            var v : away.geom.Vector3D = new away.geom.Vector3D( 0 , 1 , 1 )
            var v1 : away.geom.Vector3D = new away.geom.Vector3D( 1 , 0 , 1 )
            var v2 : away.geom.Vector3D = new away.geom.Vector3D( 7 , 8 , 0 )

            var t : away.geom.Matrix3D= new away.geom.Matrix3D( [   0, 10, 10, 1,
                10, 5, 10, 10,
                10, 10, 5, 10,
                1, 10, 10, 0 ] );

            var d : away.geom.Matrix3D= new away.geom.Matrix3D( [   1, 50, 1, 8,
                                                                    2, 5, 12, 9,
                                                                    30, 16, 35, 10,
                                                                    4, 18, 40, 11 ] );
            t.append( d  )

            console.log( t.rawData );

        }


        public testprependRotation() : void
        {

            var v : away.geom.Vector3D = new away.geom.Vector3D( 0 , 1 , 1 )
            var v1 : away.geom.Vector3D = new away.geom.Vector3D( 1 , 0 , 1 )
            var v2 : away.geom.Vector3D = new away.geom.Vector3D( 7 , 8 , 0 )

            var t : away.geom.Matrix3D= new away.geom.Matrix3D( [   0, 10, 10, 1,
                10, 5, 10, 10,
                10, 10, 5, 10,
                1, 10, 10, 0 ] );

            var d : away.geom.Matrix3D= new away.geom.Matrix3D( );
            t.prependRotation( 90 , v )//, v1  )

            console.log( t.rawData );

        }


        public testcopyToMatrix3D() : void
        {

            var v : away.geom.Vector3D = new away.geom.Vector3D( 0 , 2 , 3 )
            var v1 : away.geom.Vector3D = new away.geom.Vector3D( 4 , 0 , 6 )
            var v2 : away.geom.Vector3D = new away.geom.Vector3D( 7 , 8 , 0 )

            var t : away.geom.Matrix3D= new away.geom.Matrix3D( [   0, 10, 10, 1,
                10, 5, 10, 10,
                10, 10, 5, 10,
                1, 10, 10, 0 ] );

            var d : away.geom.Matrix3D= new away.geom.Matrix3D( );
            //t.copyToMatrix3D( d ) ;

            console.log( d.rawData );

        }

        public testDecompose() : void
        {

            console.log( '----------------------------------------------------------------------');
            console.log( 'testDecompose');
            var v : away.geom.Vector3D[] ;
            var m: away.geom.Matrix3D;
            var r : Array<number> = new Array<number> ( 16 ) ;

            for ( var c : number = 0 ; c < 10 ; c ++ )
            {


                m = new away.geom.Matrix3D( [   this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ),
                                                this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ),
                                                this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ),
                                                this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ), this.getRnd( -100 , 100 ) ] );


                m.copyRawDataTo( r );

                v = m.decompose();
                this.outputDecompose(m.rawData , r , v[0], v[1], v[2]);


            }

            /*

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
            */
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
            m.appendRotation( 90 , v );// , p );

            this.outputAppendRotation(m.rawData , r  , v , p );

            m = new away.geom.Matrix3D( [   1, 0, 4, 5,
                                            0, 1, 8, 0,
                                            4, 8, 1, 7,
                                            5, 0, 7, 1] );

            m.copyRawDataTo( r )
            m.appendRotation( 90 , v );//, p );
            this.outputAppendRotation(m.rawData , r , v , p );

            m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
                                            0, 1, 8, 0,
                                            4, 8, 1, 2,
                                            5, 0, 2, 1] );

            m.copyRawDataTo( r )
            m.appendRotation( 90 , v );//, p );
            this.outputAppendRotation(m.rawData , r , v , p );

            m  = new away.geom.Matrix3D( [  1, 0, 4, 5,
                                            0, 1, 8, 0,
                                            4, 8, 1, 1,
                                            5, 0, 1, 1] );

            m.copyRawDataTo( r )
            m.appendRotation( 90 , v );//, p );
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
}


