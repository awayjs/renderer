var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (geom) {
        var VextMat3DTests = (function () {
            function VextMat3DTests() {
                var m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var v = new away.geom.Vector3D();

                console.log('------------------------------------ copyColumnTo');

                m.copyColumnTo(0, v);
                console.log('copyColumnTo 0 ', v);
                m.copyColumnTo(1, v);
                console.log('copyColumnTo 1 ', v);
                m.copyColumnTo(2, v);
                console.log('copyColumnTo 2 ', v);
                m.copyColumnTo(3, v);
                console.log('copyColumnTo 3 ', v);

                console.log('------------------------------------ copyRowTo');

                var r = new away.geom.Vector3D();

                m.copyRowTo(0, r);
                console.log('copyRowTo 0 ', r);
                m.copyRowTo(1, r);
                console.log('copyRowTo 1 ', r);
                m.copyRowTo(2, r);
                console.log('copyRowTo 2 ', r);
                m.copyRowTo(3, r);
                console.log('copyRowTo 3 ', r);

                console.log('------------------------------------ copyRowFrom');

                m = new away.geom.Matrix3D([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

                m.copyRowFrom(0, new away.geom.Vector3D(16, 15, 14, 13));
                console.log('copyRowFrom 0 ', m.rawData);
                m.copyRowFrom(1, new away.geom.Vector3D(12, 11, 10, 9));
                console.log('copyRowFrom 1 ', m.rawData);
                m.copyRowFrom(2, new away.geom.Vector3D(8, 7, 6, 5));
                console.log('copyRowFrom 2 ', m.rawData);
                m.copyRowFrom(3, new away.geom.Vector3D(4, 3, 2, 1));
                console.log('copyRowFrom 3 ', m.rawData);

                console.log('------------------------------------ copyColumnFrom');

                m = new away.geom.Matrix3D([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

                m.copyColumnFrom(0, new away.geom.Vector3D(16, 15, 14, 13));
                console.log('copyColumnFrom 0 ', m.rawData);
                m.copyColumnFrom(1, new away.geom.Vector3D(12, 11, 10, 9));
                console.log('copyColumnFrom 1 ', m.rawData);
                m.copyColumnFrom(2, new away.geom.Vector3D(8, 7, 6, 5));
                console.log('copyColumnFrom 2 ', m.rawData);
                m.copyColumnFrom(3, new away.geom.Vector3D(4, 3, 2, 1));
                console.log('copyColumnFrom 3 ', m.rawData);

                console.log('------------------------------------ Append');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var s = new away.geom.Matrix3D([
                    16,
                    15,
                    14,
                    13,
                    12,
                    11,
                    10,
                    9,
                    8,
                    7,
                    6,
                    5,
                    4,
                    3,
                    2,
                    1
                ]);

                m.append(s);

                console.log('Append Result', m.rawData);
                console.log('Appendee', s.rawData);

                console.log('------------------------------------ Prepend');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                s = new away.geom.Matrix3D([
                    16,
                    15,
                    14,
                    13,
                    12,
                    11,
                    10,
                    9,
                    8,
                    7,
                    6,
                    5,
                    4,
                    3,
                    2,
                    1
                ]);

                m.prepend(s);

                console.log('Prepend Result', m.rawData);
                console.log('Prependee', s.rawData);

                console.log('------------------------------------ Append Translation');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.appendTranslation(5, 6, 7);
                console.log(' Append Translation', m.rawData);

                console.log('------------------------------------ appendRotation');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var pivot = new away.geom.Vector3D(7, 8, 9);

                var axis = new away.geom.Vector3D(0, 0, 1);
                m.appendRotation(45, axis);
                console.log('appendRotation', m.rawData);

                console.log('------------------------------------ appendScale');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.appendScale(6, 7, 8);
                console.log('appendScale', m.rawData);

                console.log('------------------------------------ prepentScale');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.prependScale(6, 7, 8);
                console.log('prepentScale', m.rawData);

                console.log('------------------------------------ clone');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                console.log('clone', m.clone().rawData);

                console.log('------------------------------------ copyFrom');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var cl = new away.geom.Matrix3D([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                cl.copyFrom(m);

                console.log('copyFrom', cl.rawData);

                console.log('------------------------------------ copyRawDataFrom');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.copyRawDataFrom([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

                console.log('copyRawDataFrom', m.rawData);

                console.log('------------------------------------ copyRawDataTo');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var result = new Array(9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9);

                console.log('result.length: ', result.length);

                m.copyRawDataTo(result, 1, true);
                console.log('rawData', m.rawData);
                console.log('copyRawDataTo', result);

                console.log('------------------------------------ transpose');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.transpose();
                console.log('transpose', m.rawData);

                console.log('------------------------------------ copyToMatrix3D');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                s = new away.geom.Matrix3D([
                    16,
                    15,
                    14,
                    13,
                    12,
                    11,
                    10,
                    9,
                    8,
                    7,
                    6,
                    5,
                    4,
                    3,
                    2,
                    1
                ]);

                m.copyToMatrix3D(s);
                console.log('copyToMatrix3D', m.rawData);

                console.log('------------------------------------ decompose');

                m = new away.geom.Matrix3D([
                    1,
                    6,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]);

                var resultDecompose = m.decompose();
                console.log('copyToMatrix3D', resultDecompose[0]);
                console.log('copyToMatrix3D', resultDecompose[1]);
                console.log('copyToMatrix3D', resultDecompose[2]);

                console.log('------------------------------------ determinant');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    0,
                    6,
                    2,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    3,
                    6,
                    0,
                    3,
                    1
                ]);

                console.log('determinant:', m.determinant);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    5,
                    6,
                    2,
                    1,
                    0,
                    8,
                    5,
                    0,
                    1,
                    3,
                    6,
                    8,
                    3,
                    1
                ]);

                console.log('determinant:', m.determinant);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]);

                console.log('determinant:', m.determinant);

                console.log('------------------------------------ invert');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    5,
                    6,
                    2,
                    1,
                    0,
                    8,
                    5,
                    0,
                    1,
                    3,
                    6,
                    8,
                    3,
                    1
                ]);

                var b;

                b = m.invert();
                console.log('invert:', b, m.rawData);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                b = m.invert();
                console.log('invert:', b, m.rawData);

                console.log('------------------------------------ Prepend Rotation');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                axis = new away.geom.Vector3D(1, 0, 0);
                m.prependRotation(45, axis);

                console.log('prependRotation:', m.rawData);

                console.log('------------------------------------ prependTranslation');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.prependTranslation(5, 10, 15);

                console.log('prependTranslation:', m.rawData);

                console.log('------------------------------------ recompose');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var rVects = new Array();
                rVects.push(new away.geom.Vector3D(5, 1, 3));
                rVects.push(new away.geom.Vector3D(5, 0, 1));
                rVects.push(new away.geom.Vector3D(2, 1, 3));

                m.recompose(rVects);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                rVects = new Array();
                rVects.push(new away.geom.Vector3D(1, 2, 9));
                rVects.push(new away.geom.Vector3D(3, 3, 1));
                rVects.push(new away.geom.Vector3D(8, 1, 8));

                m.recompose(rVects);

                console.log('recompose:', m.rawData);

                rVects = new Array();
                rVects.push(new away.geom.Vector3D(1, 2, 9));
                rVects.push(new away.geom.Vector3D(3, 3, 1));
                rVects.push(new away.geom.Vector3D(0, 0, 0));

                var b = m.recompose(rVects);

                console.log('fail - recompose:', m.rawData, b);

                console.log('------------------------------------ transformVector ');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var tVResult = m.transformVector(new away.geom.Vector3D(1, 2, 3));

                console.log(tVResult);

                console.log('------------------------------------ transformVector ');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var vout = new Array(0, 1, 2, 3, 4, 5);
                var vin = new Array(4, 5, 6);
                m.transformVectors(vin, vout);
                console.log('transformVector', vout, vin);

                console.log('------------------------------------ transpose');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.transpose();
                console.log('transpose', m.rawData);

                console.log('------------------------------------ getAxisRotation');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                //m.getAxisRotation(4 , 5 , 6 , 90 );
                //console.log( 'getAxisRotation' , m.rawData );
                console.log('------------------------------------ position');

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                var posVect = new away.geom.Vector3D(5, 10, 15);

                m.position = posVect;

                console.log('set position', m.rawData);
                console.log('get position', m.position);
            }
            VextMat3DTests.prototype.testappend = function () {
                var v = new away.geom.Vector3D(0, 1, 1);
                var v1 = new away.geom.Vector3D(1, 0, 1);
                var v2 = new away.geom.Vector3D(7, 8, 0);

                var t = new away.geom.Matrix3D([
                    0,
                    10,
                    10,
                    1,
                    10,
                    5,
                    10,
                    10,
                    10,
                    10,
                    5,
                    10,
                    1,
                    10,
                    10,
                    0
                ]);

                var d = new away.geom.Matrix3D([
                    1,
                    50,
                    1,
                    8,
                    2,
                    5,
                    12,
                    9,
                    30,
                    16,
                    35,
                    10,
                    4,
                    18,
                    40,
                    11
                ]);
                t.append(d);

                console.log(t.rawData);
            };

            VextMat3DTests.prototype.testprependRotation = function () {
                var v = new away.geom.Vector3D(0, 1, 1);
                var v1 = new away.geom.Vector3D(1, 0, 1);
                var v2 = new away.geom.Vector3D(7, 8, 0);

                var t = new away.geom.Matrix3D([
                    0,
                    10,
                    10,
                    1,
                    10,
                    5,
                    10,
                    10,
                    10,
                    10,
                    5,
                    10,
                    1,
                    10,
                    10,
                    0
                ]);

                var d = new away.geom.Matrix3D();
                t.prependRotation(90, v);

                console.log(t.rawData);
            };

            VextMat3DTests.prototype.testcopyToMatrix3D = function () {
                var v = new away.geom.Vector3D(0, 2, 3);
                var v1 = new away.geom.Vector3D(4, 0, 6);
                var v2 = new away.geom.Vector3D(7, 8, 0);

                var t = new away.geom.Matrix3D([
                    0,
                    10,
                    10,
                    1,
                    10,
                    5,
                    10,
                    10,
                    10,
                    10,
                    5,
                    10,
                    1,
                    10,
                    10,
                    0
                ]);

                var d = new away.geom.Matrix3D();

                //t.copyToMatrix3D( d ) ;
                console.log(d.rawData);
            };

            VextMat3DTests.prototype.testDecompose = function () {
                console.log('----------------------------------------------------------------------');
                console.log('testDecompose');
                var v;
                var m;
                var r = new Array(16);

                for (var c = 0; c < 10; c++) {
                    m = new away.geom.Matrix3D([
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100),
                        this.getRnd(-100, 100)
                    ]);

                    m.copyRawDataTo(r);

                    v = m.decompose();
                    this.outputDecompose(m.rawData, r, v[0], v[1], v[2]);
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
                console.log('private function testDecompose( result : Vector.<Number> , original : Vector.<Number> , a1 : Vector3D , a2 : Vector3D  , a3 : Vector3D )');
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
            };

            VextMat3DTests.prototype.outputDecompose = function (result, original, a1, a2, a3) {
                var a1 = 'new Vector3D( ' + a1.x + ' , ' + a1.y + ' , ' + a1.z + ' )';
                var a2 = 'new Vector3D( ' + a2.x + ' , ' + a2.y + ' , ' + a2.z + ' )';
                var a3 = 'new Vector3D( ' + a3.x + ' , ' + a3.y + ' , ' + a3.z + ' )';

                console.log('testDecompose( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a1 + ' , ' + a2 + ' , ' + a3 + ' );');
            };

            VextMat3DTests.prototype.testPosition = function () {
                console.log('----------------------------------------------------------------------');
                console.log('testPosition');
                var v = new away.geom.Vector3D(1, 2, 3);
                var p = new away.geom.Vector3D(2, 2, 2);
                var pos;

                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    4,
                    5,
                    2,
                    1,
                    0,
                    8,
                    4,
                    0,
                    1,
                    7,
                    5,
                    8,
                    7,
                    1
                ]);
                m.copyRawDataTo(r);
                m.position = v;
                pos = m.position;
                this.outputPosition(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    7,
                    5,
                    0,
                    7,
                    1
                ]);
                m.copyRawDataTo(r);
                m.position = v;
                pos = m.position;
                this.outputPosition(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    2,
                    5,
                    0,
                    2,
                    1
                ]);
                m.copyRawDataTo(r);
                m.position = v;
                pos = m.position;
                this.outputPosition(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    1,
                    5,
                    0,
                    1,
                    1
                ]);
                m.copyRawDataTo(r);
                m.position = v;
                pos = m.position;
                this.outputPosition(m.rawData, r, v);

                console.log('//------------------------------------------------------------ AS3');
                console.log('private function testPosition( result : Vector.<Number> , original : Vector.<Number> , t : Vector3D )');
                console.log('{');
                console.log('    var m : Matrix3D = new Matrix3D( original );');
                console.log('    m.position = t;');
                console.log('    var p : Vector3D = m.position;');
                console.log('    trace( "TSResult: " , result );');
                console.log('    trace( "ASResult: " , m.rawData );');
                console.log('    trace( "Pos: " ,p );');
                console.log('}');
            };
            VextMat3DTests.prototype.outputPosition = function (result, original, posResult) {
                var a = 'new Vector3D( ' + posResult.x + ' , ' + posResult.y + ' , ' + posResult.z + ' )';

                console.log('testPosition( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ');');
            };

            VextMat3DTests.prototype.testAppendScale = function () {
                console.log('----------------------------------------------------------------------');
                console.log('testAppendScale');
                var v = new away.geom.Vector3D(1, 2, 3);
                var p = new away.geom.Vector3D(2, 2, 2);

                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    4,
                    5,
                    2,
                    1,
                    0,
                    8,
                    4,
                    0,
                    1,
                    7,
                    5,
                    8,
                    7,
                    1
                ]);
                m.copyRawDataTo(r);
                m.appendScale(v.x, v.y, v.z);

                this.outputAppendScale(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    7,
                    5,
                    0,
                    7,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendScale(v.x, v.y, v.z);
                this.outputAppendScale(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    2,
                    5,
                    0,
                    2,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendScale(v.x, v.y, v.z);
                this.outputAppendScale(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    1,
                    5,
                    0,
                    1,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendScale(v.x, v.y, v.z);
                this.outputAppendScale(m.rawData, r, v);

                console.log('//------------------------------------------------------------ AS3');
                console.log('private function testAppendScale( result : Vector.<Number> , original : Vector.<Number> , t : Vector3D )');
                console.log('{');
                console.log('    var m : Matrix3D = new Matrix3D( original );');
                console.log('    m.appendScale( t.x , t.y , t.z );');
                console.log('    trace( "TSResult: " , result );');
                console.log('    trace( "ASResult: " , m.rawData );');
                console.log('}');
            };

            VextMat3DTests.prototype.outputAppendScale = function (result, original, v) {
                var a = 'new Vector3D( ' + v.x + ' , ' + v.y + ' , ' + v.z + ' )';

                console.log('testAppendScale( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ');');
            };

            VextMat3DTests.prototype.testAppendTranslation = function () {
                console.log('----------------------------------------------------------------------');
                console.log('testAppendTranslation');
                var v = new away.geom.Vector3D(1, 2, 3);
                var p = new away.geom.Vector3D(2, 2, 2);

                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    4,
                    5,
                    2,
                    1,
                    0,
                    8,
                    4,
                    0,
                    1,
                    7,
                    5,
                    8,
                    7,
                    1
                ]);
                m.copyRawDataTo(r);
                m.appendTranslation(v.x, v.y, v.z);

                this.outputAppendTranslation(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    7,
                    5,
                    0,
                    7,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendTranslation(v.x, v.y, v.z);
                this.outputAppendTranslation(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    2,
                    5,
                    0,
                    2,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendTranslation(v.x, v.y, v.z);
                this.outputAppendTranslation(m.rawData, r, v);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    1,
                    5,
                    0,
                    1,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendTranslation(v.x, v.y, v.z);
                this.outputAppendTranslation(m.rawData, r, v);

                console.log('//------------------------------------------------------------ AS3');
                console.log('private function testAppendTranslation( result : Vector.<Number> , original : Vector.<Number> , t : Vector3D )');
                console.log('{');
                console.log('    var m : Matrix3D = new Matrix3D( original );');
                console.log('    m.appendTranslation( t.x , t.y , t.z );');
                console.log('    trace( "TSResult: " , result );');
                console.log('    trace( "ASResult: " , m.rawData );');
                console.log('}');
            };

            VextMat3DTests.prototype.outputAppendTranslation = function (result, original, v) {
                //var axis  : number[] = new Array<number>( axis.x , axis.y , axis.z );
                //var pivot : number[] = new Array<number>( pivot.x , pivot.y , pivot.z );
                var a = 'new Vector3D( ' + v.x + ' , ' + v.y + ' , ' + v.z + ' )';

                console.log('testAppendTranslation( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ');');
            };

            VextMat3DTests.prototype.testAppendRotation = function () {
                console.log('----------------------------------------------------------------------');
                console.log('testAppendRotation');

                var v = new away.geom.Vector3D(1, 2, 3);
                var p = new away.geom.Vector3D(2, 2, 2);

                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    4,
                    5,
                    2,
                    1,
                    0,
                    8,
                    4,
                    0,
                    1,
                    7,
                    5,
                    8,
                    7,
                    1
                ]);
                m.copyRawDataTo(r);
                m.appendRotation(90, v);

                this.outputAppendRotation(m.rawData, r, v, p);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    7,
                    5,
                    0,
                    7,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendRotation(90, v);
                this.outputAppendRotation(m.rawData, r, v, p);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    2,
                    5,
                    0,
                    2,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendRotation(90, v);
                this.outputAppendRotation(m.rawData, r, v, p);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    1,
                    5,
                    0,
                    1,
                    1
                ]);

                m.copyRawDataTo(r);
                m.appendRotation(90, v);
                this.outputAppendRotation(m.rawData, r, v, p);

                console.log('//------------------------------------------------------------ AS3');
                console.log('private function testAppendRotation( result : Vector.<Number> , original : Vector.<Number> , axis : Vector3D , pivot : Vector3D )');
                console.log('{');
                console.log('    var m : Matrix3D = new Matrix3D( original );');
                console.log('    m.appendRotation( 90 , axis , pivot );');
                console.log('    trace( "TSResult: " , result );');
                console.log('    trace( "ASResult: " , m.rawData );');
                console.log('}');
            };

            VextMat3DTests.prototype.testInvert = function () {
                var v = new away.geom.Vector3D();
                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    4,
                    5,
                    2,
                    1,
                    0,
                    8,
                    4,
                    0,
                    1,
                    7,
                    5,
                    8,
                    7,
                    1
                ]);
                m.copyRawDataTo(r);
                i = m.invert();
                this.outputInvert(i, m.rawData, r);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    7,
                    5,
                    0,
                    7,
                    1
                ]);

                m.copyRawDataTo(r);
                i = m.invert();
                this.outputInvert(i, m.rawData, r);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    2,
                    5,
                    0,
                    2,
                    1
                ]);

                m.copyRawDataTo(r);
                i = m.invert();
                this.outputInvert(i, m.rawData, r);
            };

            VextMat3DTests.prototype.testCopyRowTo = function () {
                var v = new away.geom.Vector3D();
                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    4,
                    0,
                    1,
                    7,
                    5,
                    8,
                    7,
                    1
                ]);

                m.copyRowTo(0, v);
                console.log(v);
                m.copyRowTo(1, v);
                console.log(v);
                m.copyRowTo(2, v);
                console.log(v);
                m.copyRowTo(3, v);
                console.log(v);
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
            };
            VextMat3DTests.prototype.testCopyColumnTo = function () {
                var v = new away.geom.Vector3D();
                var m;
                var i;
                var r = new Array(16);

                m = new away.geom.Matrix3D([
                    1,
                    0,
                    4,
                    5,
                    0,
                    1,
                    8,
                    0,
                    4,
                    8,
                    1,
                    1,
                    5,
                    0,
                    1,
                    1
                ]);

                m = new away.geom.Matrix3D([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    1,
                    12,
                    13,
                    14,
                    15,
                    16
                ]);

                m.copyColumnTo(0, v);
                console.log(v.toString());
                m.copyColumnTo(1, v);
                console.log(v.toString());
                m.copyColumnTo(2, v);
                console.log(v.toString());
                m.copyColumnTo(3, v);
                console.log(v.toString());

                v.w = v.x = v.y = v.z = 0;
                m.copyColumnFrom(0, v);
                console.log(m.rawData);
                v.w = v.x = v.y = v.z = 1;
                m.copyColumnFrom(1, v);
                console.log(m.rawData);
                v.w = v.x = v.y = v.z = 2;
                m.copyColumnFrom(2, v);
                console.log(m.rawData);
                v.w = v.x = v.y = v.z = 3;
                m.copyColumnFrom(3, v);
                console.log(m.rawData);
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
            };

            VextMat3DTests.prototype.outputAppendRotation = function (result, original, axis, pivot) {
                //var axis  : number[] = new Array<number>( axis.x , axis.y , axis.z );
                //var pivot : number[] = new Array<number>( pivot.x , pivot.y , pivot.z );
                var a = 'new Vector3D( ' + axis.x + ' , ' + axis.y + ' , ' + axis.z + ' )';
                var p = 'new Vector3D( ' + pivot.x + ' , ' + pivot.y + ' , ' + pivot.z + ' )';

                console.log('testAppendRotation( new <Number> [' + result + '], new <Number> [' + original + '] , ' + a + ' , ' + p + ');');
            };

            VextMat3DTests.prototype.outputInvert = function (success, data, original) {
                console.log('testInvert(' + success + ', new <Number> [' + data + '], new <Number> [' + original + ']);');
            };

            VextMat3DTests.prototype.output = function (data, result) {
                console.log('testDeterminant( new <Number> [' + data + '], ' + result + ');');
            };

            VextMat3DTests.prototype.getRnd = function (max, min) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            return VextMat3DTests;
        })();
        geom.VextMat3DTests = VextMat3DTests;
    })(tests.geom || (tests.geom = {}));
    var geom = tests.geom;
})(tests || (tests = {}));
//# sourceMappingURL=VextMat3DTests.js.map
