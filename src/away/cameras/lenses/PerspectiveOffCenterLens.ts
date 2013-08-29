/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../_definitions.ts" />

module away.cameras
{
	export class PerspectiveOffCenterLens extends away.cameras.LensBase
	{
		
		private _minAngleX:number;
		private _minLengthX:number;
		private _tanMinX:number;
		private _maxAngleX:number;
		private _maxLengthX:number;
		private _tanMaxX:number;
		private _minAngleY:number;
		private _minLengthY:number;
		private _tanMinY:number;
		private _maxAngleY:number;
		private _maxLengthY:number;
		private _tanMaxY:number;
		
		constructor( minAngleX:number = -40, maxAngleX:number = 40, minAngleY:number = -40, maxAngleY:number = 40 )
		{
			super();
			
			this.minAngleX = minAngleX;
			this.maxAngleX = maxAngleX;
			this.minAngleY = minAngleY;
			this.maxAngleY = maxAngleY;
		}
		
		public get minAngleX():number
		{
			return this._minAngleX;
		}
		
		public set minAngleX(value:number)
		{
			this._minAngleX = value;
			this._tanMinX = Math.tan( this._minAngleX*Math.PI/180 );
			this.pInvalidateMatrix();
		}
		
		public get maxAngleX():number
		{
			return this._maxAngleX;
		}
		
		public set maxAngleX(value:number)
		{
			this._maxAngleX = value;
			this._tanMaxX = Math.tan(this._maxAngleX*Math.PI/180);
			this.pInvalidateMatrix();
		}
		
		public get minAngleY():number
		{
			return this._minAngleY;
		}
		
		public set minAngleY(value:number)
		{
			this._minAngleY = value;
			this._tanMinY = Math.tan(this._minAngleY*Math.PI/180);
			this.pInvalidateMatrix();
		}
		
		public get maxAngleY():number
		{
			return this._maxAngleY;
		}
		
		public set maxAngleY(value:number)
		{
			this._maxAngleY = value;
			this._tanMaxY = Math.tan(this._maxAngleY*Math.PI/180);
			this.pInvalidateMatrix();
		}
		
		//@override
		public unproject(nX:number, nY:number, sZ:number):away.geom.Vector3D
		{
			var v:away.geom.Vector3D = new away.geom.Vector3D(nX, -nY, sZ, 1.0);
			
			v.x *= sZ;
			v.y *= sZ;
			v = this.unprojectionMatrix.transformVector(v);
			//z is unaffected by transform
			v.z = sZ;
			
			return v;
		}
		
		//@override
		public clone():away.cameras.LensBase
		{
			var clone:away.cameras.PerspectiveOffCenterLens = new away.cameras.PerspectiveOffCenterLens( this._minAngleX, this._maxAngleX, this._minAngleY, this._maxAngleY );
			clone._pNear = this._pNear;
			clone._pFar = this._pFar;
			clone._pAspectRatio = this._pAspectRatio;
			return clone;
		}
		
		//@override
		public pUpdateMatrix()
		{
			var raw:number[] = [];
			
			this._minLengthX = this._pNear*this._tanMinX;
			this._maxLengthX = this._pNear*this._tanMaxX;
			this._minLengthY = this._pNear*this._tanMinY;
			this._maxLengthY = this._pNear*this._tanMaxY;
			
			var minLengthFracX:number = -this._minLengthX/(this._maxLengthX - this._minLengthX);
			var minLengthFracY:number = -this._minLengthY/(this._maxLengthY - this._minLengthY);
			
			var left:number;
			var right:number;
			var top:number;
			var bottom:number;
			
			// assume scissored frustum
			var center:number = -this._minLengthX*(this._pScissorRect.x + this._pScissorRect.width*minLengthFracX)/(this._pScissorRect.width*minLengthFracX);
			var middle:number = this._minLengthY*(this._pScissorRect.y + this._pScissorRect.height*minLengthFracY)/(this._pScissorRect.height*minLengthFracY);
			
			left = center - (this._maxLengthX - this._minLengthX)*(this._pViewPort.width/this._pScissorRect.width);
			right = center;
			top = middle;
			bottom = middle + (this._maxLengthY - this._minLengthY)*(this._pViewPort.height/this._pScissorRect.height);
			
			raw[0] = 2*this._pNear/(right - left);
			raw[5] = 2*this._pNear/(bottom - top);
			raw[8] = (right + left)/(right - left);
			raw[9] = (bottom + top)/(bottom - top);
			raw[10] = (this._pFar + this._pNear)/(this._pFar - this._pNear);
			raw[11] = 1;
			raw[1] = raw[2] = raw[3] = raw[4] =
				raw[6] = raw[7] = raw[12] = raw[13] = raw[15] = 0;
			raw[14] = -2*this._pFar*this._pNear/(this._pFar - this._pNear);
			
			this._pMatrix.copyRawDataFrom(raw);

            //---------------------------------------------------------------------------------
            // HACK ! - Need to find real solution for flipping scene on Z axis
            this._pMatrix.appendRotation( 180 , new away.geom.Vector3D( 0 , 0 , 1 ));
            //---------------------------------------------------------------------------------

			this._minLengthX = this._pFar*this._tanMinX;
			this._maxLengthX = this._pFar*this._tanMaxX;
			this._minLengthY = this._pFar*this._tanMinY;
			this._maxLengthY = this._pFar*this._tanMaxY;
			
			this._pFrustumCorners[0] = this._pFrustumCorners[9] = left;
			this._pFrustumCorners[3] = this._pFrustumCorners[6] = right;
			this._pFrustumCorners[1] = this._pFrustumCorners[4] = top;
			this._pFrustumCorners[7] = this._pFrustumCorners[10] = bottom;
			
			this._pFrustumCorners[12] = this._pFrustumCorners[21] = this._minLengthX;
			this._pFrustumCorners[15] = this._pFrustumCorners[18] = this._maxLengthX;
			this._pFrustumCorners[13] = this._pFrustumCorners[16] = this._minLengthY;
			this._pFrustumCorners[19] = this._pFrustumCorners[22] = this._maxLengthY;
			
			this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
			this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
			
			this._pMatrixInvalid = false;
		}
		
	}
}