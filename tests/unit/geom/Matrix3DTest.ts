/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />
///<reference path="../tsUnit.ts" />

module tests.unit.geom
{

	export class Matrix3DTest extends tests.unit.tsUnit.TestClass
	{

        constructor()
        {
            super();
        }

		public construct():void
		{
			var m:away.geom.Matrix3D = new away.geom.Matrix3D();
			this.areIdentical( m.rawData[0], 1 );
			this.areIdentical( m.rawData[1], 0 );
			this.areIdentical( m.rawData[2], 0 );
			this.areIdentical( m.rawData[3], 0 );
			this.areIdentical( m.rawData[4], 0 );
			this.areIdentical( m.rawData[5], 1 );
			this.areIdentical( m.rawData[6], 0 );
			this.areIdentical( m.rawData[7], 0 );
			this.areIdentical( m.rawData[8], 0 );
			this.areIdentical( m.rawData[9], 0 );
			this.areIdentical( m.rawData[10], 1 );
			this.areIdentical( m.rawData[11], 0 );
			this.areIdentical( m.rawData[12], 0 );
			this.areIdentical( m.rawData[13], 0 );
			this.areIdentical( m.rawData[14], 0 );
			this.areIdentical( m.rawData[15], 1 );
			
			var r:number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
			m = new away.geom.Matrix3D( r );
			this.areIdentical( m.rawData[0], 0 );
			this.areIdentical( m.rawData[1], 1 );
			this.areIdentical( m.rawData[2], 2 );
			this.areIdentical( m.rawData[3], 3 );
			this.areIdentical( m.rawData[4], 4 );
			this.areIdentical( m.rawData[5], 5 );
			this.areIdentical( m.rawData[6], 6 );
			this.areIdentical( m.rawData[7], 7 );
			this.areIdentical( m.rawData[8], 8 );
			this.areIdentical( m.rawData[9], 9 );
			this.areIdentical( m.rawData[10], 10 );
			this.areIdentical( m.rawData[11], 11 );
			this.areIdentical( m.rawData[12], 12 );
			this.areIdentical( m.rawData[13], 13 );
			this.areIdentical( m.rawData[14], 14 );
			this.areIdentical( m.rawData[15], 15 );
		}
		
		public append():void
		{
			var r1:number[] = [ 1, 5, 6, 4, 8, 9, 1, 2, 3, 7, 8, 9, 1, 3, 5, 6 ];
			var r2:number[] = [ 6, 5, 3, 1, 9, 8, 7, 3, 2, 1, 9, 8, 4, 6, 5, 1 ];
			var m1:away.geom.Matrix3D = new away.geom.Matrix3D( r1 );
			var m2:away.geom.Matrix3D = new away.geom.Matrix3D( r2 );
			
			m1.append( m2 );

			this.areIdentical( m1.rawData[0], 79 );
			this.areIdentical( m1.rawData[1], 75 );
			this.areIdentical( m1.rawData[2], 112 );
			this.areIdentical( m1.rawData[3], 68 );
			this.areIdentical( m1.rawData[4], 139 );
			this.areIdentical( m1.rawData[5], 125 );
			this.areIdentical( m1.rawData[6], 106 );
			this.areIdentical( m1.rawData[7], 45 );
			this.areIdentical( m1.rawData[8], 133 );
			this.areIdentical( m1.rawData[9], 133 );
			this.areIdentical( m1.rawData[10], 175 );
			this.areIdentical( m1.rawData[11], 97 );
			this.areIdentical( m1.rawData[12], 67 );
			this.areIdentical( m1.rawData[13], 70 );
			this.areIdentical( m1.rawData[14], 99 );
			this.areIdentical( m1.rawData[15], 56 );
		}
        /*
		
		public appendRotation():void
		{
			
		}
		  */
		public appendScale():void
		{
			var m:away.geom.Matrix3D = new away.geom.Matrix3D();
			m.appendScale( 10, 20, 30 );
			this.areIdentical( m.rawData[0], 10 );
			this.areIdentical( m.rawData[1], 0 );
			this.areIdentical( m.rawData[2], 0 );
			this.areIdentical( m.rawData[3], 0 );
			this.areIdentical( m.rawData[4], 0 );
			this.areIdentical( m.rawData[5], 20 );
			this.areIdentical( m.rawData[6], 0 );
			this.areIdentical( m.rawData[7], 0 );
			this.areIdentical( m.rawData[8], 0 );
			this.areIdentical( m.rawData[9], 0 );
			this.areIdentical( m.rawData[10], 30 );
			this.areIdentical( m.rawData[11], 0 );
			this.areIdentical( m.rawData[12], 0 );
			this.areIdentical( m.rawData[13], 0 );
			this.areIdentical( m.rawData[14], 0 );
			this.areIdentical( m.rawData[15], 1 );
		}

        /*
		public appendTranslation():void
		{
			
		}
		
		public clone():void
		{
			
		}
		
		public copyColumnFrom():void
		{
			
		}
		
		public copyColumnTo():void
		{
			
		}
		
		public copyFrom():void
		{
			
		}
		
		public copyRawDataFrom():void
		{
			
		}
		
		public copyRawDataTo():void
		{
			
		}
		
		public copyRowFrom():void
		{
			
		}
		
		public copyRowTo():void
		{
			
		}
		
		public copyToMatrix3D():void
		{
			
		}
        */

		public decompose():void
		{

            var scope : any = this;
            function testDecomposeResults (result : away.geom.Vector3D[] , fromFlash : away.geom.Vector3D[] , decimalPlaces : number = 5 ) : void
            {

                console.log( '-----testDecomposeResults-------' );
                console.log( 'fromFlash' , fromFlash);
                console.log( 'result' , result);


                for ( var c : number = 0 ; c < result.length ;c ++ )
                {

                    var rV : away.geom.Vector3D = result[c];
                    var tV : away.geom.Vector3D = fromFlash[c];

                    scope.areIdentical( rV.x.toFixed( decimalPlaces ) , tV.x.toFixed( decimalPlaces ) );
                    scope.areIdentical( rV.y.toFixed( decimalPlaces ) , tV.y.toFixed( decimalPlaces ) );
                    scope.areIdentical( rV.z.toFixed( decimalPlaces ) , tV.z.toFixed( decimalPlaces ) );

                }
            }

            var matrix      : away.geom.Matrix3D;
            var result      : away.geom.Vector3D[];
            var fromFlash   : away.geom.Vector3D[];

            var roundToDecimalPlaces : number = 5;

            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D ( [-62,-85,-11,-49,-30,-83,29,28,69,56,59,-4,72,-10,1,-32] );
            result = matrix.decompose();

            fromFlash = [
                new away.geom.Vector3D(72, -10, 1),
                new away.geom.Vector3D(0.6877229809761047, 0.10417498648166656, -2.2009902000427246),
                new away.geom.Vector3D(105.78279876708984, 46.84969711303711, 35.2751579284668)];

            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );

            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D ( [-72,-67,-47,51,59,-95,-50,-41,-34,35,73,-39,70,38,-80,-38] );
            fromFlash = [   new away.geom.Vector3D(70, 38, -80),
                            new away.geom.Vector3D(-0.5345425605773926, 0.44579410552978516, -2.3921501636505127),
                            new away.geom.Vector3D(109.00458526611328, 117.02401733398438, 56.71113204956055) ];

            result = matrix.decompose();
            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );


            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D ( [-93,19,-22,45,72,40,98,33,58,9,-7,-3,12,-82,-57,-33] );
            result = matrix.decompose();

            fromFlash = [ new away.geom.Vector3D(12, -82, -57),
                new away.geom.Vector3D(2.2739412784576416, 0.22775036096572876, 2.9400649070739746),
                new away.geom.Vector3D(97.4371566772461, 98.60648345947266, 28.360416412353516),
            ];

            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );

            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D ([53,34,80,90,-54,62,-69,13,81,1,-5,-20,74,55,3,-97] );
            result = matrix.decompose();

            fromFlash = [  new away.geom.Vector3D(74, 55, 3),
                new away.geom.Vector3D(-2.514647960662842, -0.903968870639801, 0.5703833103179932),
                new away.geom.Vector3D(101.80864715576172, 88.63056945800781, 72.43721771240234),
            ];

            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );



            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D ( [-75,-82,-19,99,-54,-10,-38,53,-56,-76,84,19,-92,-4,-3,28] );
            result = matrix.decompose();

            fromFlash = [  new away.geom.Vector3D(-92, -4, -3),
                new away.geom.Vector3D(-0.5934032201766968, 0.16933956742286682, -2.311638116836548),
                new away.geom.Vector3D(112.73863220214844, 64.54290771484375, 120.96671295166016),
            ];

            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );


            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D (  [82,1,82,74,72,-38,7,15,78,-36,-2,74,66,27,-77,-73]);
            result = matrix.decompose();

            fromFlash = [ new away.geom.Vector3D(66, 27, -77) ,
                new away.geom.Vector3D(-2.5401413440704346, -0.7853608727455139, 0.012194517999887466),
                new away.geom.Vector3D(115.9698257446289, 60.70291519165039, 60.81679153442383),
            ];

            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );


            //--------------------------------------------------------------------------------------------------------

            matrix = new away.geom.Matrix3D ( [91,77,71,-8,-67,53,51,94,27,-48,-21,-3,-82,-46,-50,26]);
            result = matrix.decompose();

            fromFlash = [ new away.geom.Vector3D(-82, -46, -50),
                new away.geom.Vector3D(0.5039752125740051, -0.5371845960617065, 0.7022569179534912),
                new away.geom.Vector3D(138.7479705810547, 98.96748352050781, 18.558963775634766)
            ];

            testDecomposeResults( result , fromFlash , roundToDecimalPlaces );

		}

        public recompose():void
        {

            var scope : any = this;
            function testRecomposeResults (result : number[] , as3Result : number[] , decimalPlaces : number = 5 ) : void
            {

                for ( var c : number = 0 ; c < result.length ;c ++ )
                {

                    var value       : number= result[c];
                    var as3Value    : number = as3Result[c];

                    console.log( value.toFixed( decimalPlaces ) , as3Value.toFixed( decimalPlaces ) );
                    scope.areIdentical( value.toFixed( decimalPlaces ) , as3Value.toFixed( decimalPlaces ) );

                }
            }

            var matrix                  : away.geom.Matrix3D;
            var as3Result               : number[];
            var vArray                  : Array<away.geom.Vector3D>;//[];
            var roundToDecimalPlaces    : number = 5;
            var vS 	                    : away.geom.Vector3D;// = new Vector3D( 0 , 2 , 3 ) // 2 - Scale
            var vR 	                    : away.geom.Vector3D;// = new Vector3D( 7 , 8 , 0 ) // 1 - Rotation
            var vT 	                    : away.geom.Vector3D;// = new Vector3D( 4 , 0 , 6 ) // 0 - Transform

            //---------------------------------------------------------------------------------------------

            as3Result = [0,0,0,0,1.299990177154541,1.5078045129776,-0.1911831498146057,0,2.237638235092163,-1.9709597826004028,-0.32907840609550476,0,4,0,6,1];
            matrix = new away.geom.Matrix3D( [  0, 10, 10, 1,
                                                10, 5, 10, 10,
                                                10, 10, 5, 10,
                                                1, 10, 10, 0 ]);

            vS 	= new away.geom.Vector3D( 0 , 2 , 3 ) // 2 - Scale
            vR 	= new away.geom.Vector3D( 7 , 8 , 0 ) // 1 - Rotation
            vT 	= new away.geom.Vector3D( 4 , 0 , 6 ) // 0 - Transform

            vArray = new Array<away.geom.Vector3D>( vT , vR , vS );

            matrix.recompose( vArray );

            testRecomposeResults( matrix.rawData , as3Result , roundToDecimalPlaces );

            //---------------------------------------------------------------------------------------------

            as3Result = [-0.22484508156776428,0.4912954568862915,-0.8414709568023682,0,-1.571915864944458,0.838008463382721,0.9092973470687866,0,1.7278404235839844,2.2907590866088867,0.8757796883583069,0,2,1,5,1];
            matrix = new away.geom.Matrix3D( [  0, 20, 20, 1,
                20, 5, 20, 20,
                20, 20, 5, 10,
                1, 20, 20, 0 ]);

            vS 	= new away.geom.Vector3D( 1 , 2 , 3 ) // 2 - Scale
            vR 	= new away.geom.Vector3D( 1 , 1 , 2 ) // 1 - Rotation
            vT 	= new away.geom.Vector3D( 2 , 1 , 5 ) // 0 - Transform

            vArray = new Array<away.geom.Vector3D>( vT , vR , vS );

            matrix.recompose( vArray );

            testRecomposeResults( matrix.rawData , as3Result , roundToDecimalPlaces );

            //---------------------------------------------------------------------------------------------

            as3Result = [1.361820101737976,-0.39629805088043213,4.794621467590332,0,3.085038185119629,-4.98231315612793,-1.288057565689087,0,5.6930437088012695,3.860661506652832,-1.2978979349136353,0,3,4,5,1];
            matrix = new away.geom.Matrix3D( [  0, 2, 2, 1,
                                                2, 5, 2, 2,
                                                2, 2, 5, 2,
                                                1, 2, 2, 0 ]);

            vS 	= new away.geom.Vector3D( 5 , 6 , 7 ) // 2 - Scale
            vR 	= new away.geom.Vector3D( 4 , 5 , 6 ) // 1 - Rotation
            vT 	= new away.geom.Vector3D( 3 , 4 , 5 ) // 0 - Transform

            vArray = new Array<away.geom.Vector3D>( vT , vR , vS );

            matrix.recompose( vArray );

            testRecomposeResults( matrix.rawData , as3Result , roundToDecimalPlaces );

        }

		public deltaTransformVector():void
		{
			var rawData:number[] = [ 1, 5, 6, 4, 8, 9, 1, 2, 3, 7, 8, 9, 1, 3, 5, 6 ];
			var m:away.geom.Matrix3D = new away.geom.Matrix3D( /*rawData*/ );
			var v:away.geom.Vector3D = new away.geom.Vector3D( 8, 4, 6 );
			
			var res:away.geom.Vector3D = m.deltaTransformVector( v );
			this.areIdentical( res.x, v.x );
			this.areIdentical( res.y, v.y );
			this.areIdentical( res.z, v.z );
		}
		
		public identity():void
		{
			var rawData:number[] = [ 1, 5, 6, 4, 8, 9, 1, 2, 3, 7, 8, 9, 1, 3, 5, 6 ];
			var m:away.geom.Matrix3D = new away.geom.Matrix3D( rawData );
			m.identity();
			
			this.areIdentical( m.rawData[0], 1 );
			this.areIdentical( m.rawData[1], 0 );
			this.areIdentical( m.rawData[2], 0 );
			this.areIdentical( m.rawData[3], 0 );
			this.areIdentical( m.rawData[4], 0 );
			this.areIdentical( m.rawData[5], 1 );
			this.areIdentical( m.rawData[6], 0 );
			this.areIdentical( m.rawData[7], 0 );
			this.areIdentical( m.rawData[8], 0 );
			this.areIdentical( m.rawData[9], 0 );
			this.areIdentical( m.rawData[10], 1 );
			this.areIdentical( m.rawData[11], 0 );
			this.areIdentical( m.rawData[12], 0 );
			this.areIdentical( m.rawData[13], 0 );
			this.areIdentical( m.rawData[14], 0 );
			this.areIdentical( m.rawData[15], 1 );
		}

        public interpolate():void
        {
            var scope : any = this;
            function testInterpolateResults (result : number[] , as3Result : number[] , decimalPlaces : number = 5 ) : void
            {

                console.log( '------' );
                console.log( 'testInterpolateResults - TS :' , result );
                console.log( 'testInterpolateResults - AS3:' , as3Result );

                for ( var c : number = 0 ; c < result.length ;c ++ )
                {

                    var value       : number= result[c];
                    var as3Value    : number = as3Result[c];


                    scope.areIdentical( value.toFixed( decimalPlaces ) , as3Value.toFixed( decimalPlaces ) );

                }
            }

            var roundToDecimalPlaces    : number = 5;

            var percent     : number;
            var as3Result   : number[];

            var thisMat : away.geom.Matrix3D;
            var result 	: away.geom.Matrix3D;
            var toMat 	: away.geom.Matrix3D;


            thisMat  = new away.geom.Matrix3D( [    0, 10, 10, 1,
                                                    10, 5, 10, 10,
                                                    10, 10, 5, 10,
                                                    1, 10, 10, 0 ] );

            toMat = new away.geom.Matrix3D( [   	10, 20, 20, 10,
                                                    20, 50, 20, 20,
                                                    20, 20, 50, 20,
                                                    10, 20, 20, 10 ] );

            percent 	= 0;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,1,10,10,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces );

            percent 	= 0.1;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,1.899999976158142,11,11,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.2;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,2.799999952316284,12,12,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.3;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,3.700000047683716,13,13,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.4;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,4.599999904632568,14,14,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.5;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,5.5,15,15,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.6;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,6.400000095367432,16,16,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.7;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,7.300000190734863,17,17,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.8;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,8.199999809265137,18,18,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

            percent 	= 0.9;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,9.100000381469727,19,19,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result, roundToDecimalPlaces);

            percent 	= 1;
            as3Result  	= [1,0,0,0,0,1,0,0,0,0,1,0,10,20,20,1];
            result      = away.geom.Matrix3D.interpolate(thisMat , toMat , percent );
            testInterpolateResults( result.rawData , as3Result , roundToDecimalPlaces);

        }

        /*
		public interpolate():void
		{
			// static
		}
		
		public interpolateTo():void
		{
			
		}
		
		public invert():void
		{
			
		}
		
		public pointAt():void
		{
			
		}
		
		public prepend():void
		{
			
		}
		
		public prependRotation():void
		{
			
		}
		
		public prependScale():void
		{
			
		}
		
		public prependTranslation():void
		{
			
		}

		
		public transformVector():void
		{
			
		}
		
		public transformVectors():void
		{
			
		}
		
		public transpose():void
		{
			
		}
		
		public getAxisRotation():void
		{
			
		}
		
		public determinant():void
		{
			
		}
		
		public position():void
		{
			
		}
		*/
	}
}