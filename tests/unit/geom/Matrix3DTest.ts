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