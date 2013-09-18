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
			console.log( m1.rawData );
			
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
		
		public appendRotation():void
		{
			
		}
		
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

		public decompose():void
		{

            var scope : any = this;
            function testDecomposeResults (result : away.geom.Vector3D[] , fromFlash : away.geom.Vector3D[] , decimalPlaces : number = 5 ) : void
            {

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

            //--------------------------------------------------------------------------------------------------------

            /*
            matrix = new away.geom.Matrix3D ( );
            result = matrix.decompose();

            fromFlash = [
                ,
                ,
            ];

            this.testDecomposeResults( result , fromFlash );
















            [77,73,51,-95,86,-57,-48,-55,-26,1,-76,-59,-35,-80,-14,23]
             new away.geom.Vector3D(-35, -80, -14)
             new away.geom.Vector3D(-2.492260217666626, -0.4480576515197754, 0.7587378025054932)
             new away.geom.Vector3D(117.72425079345703, 122.14283752441406, 74.67543029785156)

            [-70,85,-76,43,5,-68,76,-16,-49,18,-94,-35,70,-39,-96,87]
             new away.geom.Vector3D(70, -39, -96)
             new away.geom.Vector3D(2.6026899814605713, 0.6041160821914673, 2.259720802307129)
             new away.geom.Vector3D(133.79461669921875, 50.326255798339844, 58.36058044433594)

            [33,51,-33,-47,-10,-25,37,-62,-51,-51,-17,-87,12,80,80,-74]
            Vector3D(12, 80, 80)
            Vector3D(2.4511656761169434, 0.49764707684516907, 0.996491551399231)
            Vector3D(69.13031005859375, 46.90091323852539, 130.15431213378906)
                  */
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
		
		public recompose():void
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
	}
}