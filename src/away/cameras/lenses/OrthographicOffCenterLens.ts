/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../_definitions.ts" />

module away.cameras
{
	export class OrthographicOffCenterLens extends away.cameras.LensBase
	{
		
		private _minX:number;
		private _maxX:number;
		private _minY:number;
		private _maxY:number;
		
		constructor( minX:number, maxX:number, minY:number, maxY:number )
		{
			super();
			this._minX = minX;
			this._maxX = maxX;
			this._minY = minY;
			this._maxY = maxY;
		}
		
		public get minX():number
		{
			return this._minX;
		}
		
		public set minX(value:number)
		{
			this._minX = value;
			this.pInvalidateMatrix();
		}
		
		public get maxX():number
		{
			return this._maxX;
		}
		
		public set maxX(value:number)
		{
			this._maxX = value;
			this.pInvalidateMatrix();
		}
		
		public get minY():number
		{
			return this._minY;
		}
		
		public set minY(value:number)
		{
			this._minY = value;
			this.pInvalidateMatrix();
		}
		
		public get maxY():number
		{
			return this._maxY;
		}
		
		public set maxY(value:number)
		{
			this._maxY = value;
			this.pInvalidateMatrix();
		}
		
		//@override
		public unproject( nX:number, nY:number, sZ:number ):away.geom.Vector3D
		{
			var v:away.geom.Vector3D = new away.geom.Vector3D(nX, -nY, sZ, 1.0);
			v = this.unprojectionMatrix.transformVector(v);
			//z is unaffected by transform
			v.z = sZ;
			
			return v;
		}
		
		//@override
		public clone():away.cameras.LensBase
		{
			var clone:away.cameras.OrthographicOffCenterLens = new away.cameras.OrthographicOffCenterLens(this._minX, this._maxX, this._minY, this._maxY);
			clone._pNear = this._pNear;
			clone._pFar = this._pFar;
			clone._pAspectRatio = this._pAspectRatio;
			return clone;
		}
		
		//@override
		public pUpdateMatrix()
		{
			var raw:number[] = [];
			var w:number = 1/(this._maxX - this._minX);
			var h:number = 1/(this._maxY - this._minY);
			var d:number = 1/(this._pFar - this._pNear);
			
			raw[0] = 2*w;
			raw[5] = 2*h;
			raw[10] = d;
			raw[12] = -(this._maxX + this._minX)*w;
			raw[13] = -(this._maxY + this._minY)*h;
			raw[14] = -this._pNear*d;
			raw[15] = 1;
			raw[1] = raw[2] = raw[3] = raw[4] =
				raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
			this._pMatrix.copyRawDataFrom(raw);
			
			this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pFrustumCorners[12] = this._pFrustumCorners[21] = this._minX;
			this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pFrustumCorners[15] = this._pFrustumCorners[18] = this._maxX;
			this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pFrustumCorners[13] = this._pFrustumCorners[16] = this._minY;
			this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pFrustumCorners[19] = this._pFrustumCorners[22] = this._maxY;
			this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
			this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
			
			this._pMatrixInvalid = false;
		}
	}
}