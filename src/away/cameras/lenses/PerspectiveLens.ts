/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../_definitions.ts" />

module away.cameras
{
	export class PerspectiveLens extends away.cameras.LensBase
	{
		
		private _fieldOfView:number;
		private _focalLength:number;
		private _focalLengthInv:number;
		private _yMax:number;
		private _xMax:number;
		
		constructor( fieldOfView:number = 60 )
		{
			super();
			this.fieldOfView = fieldOfView;
		}
		
		public get fieldOfView():number
		{
			return this._fieldOfView;
		}
		
		public set fieldOfView( value:number )
		{
			if ( value == this._fieldOfView )
			{
				return;
			}
			this._fieldOfView = value;
			
			this._focalLengthInv = Math.tan( this._fieldOfView * Math.PI/360 );
			this._focalLength = 1 / this._focalLengthInv;
			
			this.pInvalidateMatrix();
		}
		
		public get focalLength():number
		{
			return this._focalLength;
		}
		
		public set focalLength( value:number )
		{
			if ( value == this._focalLength )
			{
				return;
			}
			this._focalLength = value;
			
			this._focalLengthInv = 1/this._focalLength;
			this._fieldOfView = Math.atan( this._focalLengthInv ) * 360/Math.PI;
			
			this.pInvalidateMatrix();
		}
		
		//@override
		public unproject( nX:number, nY:number, sZ:number):away.geom.Vector3D
		{
			var v:away.geom.Vector3D = new away.geom.Vector3D( nX, -nY, sZ, 1.0 );
			
			v.x *= sZ;
			v.y *= sZ;
			v.z = sZ;
			v = this.unprojectionMatrix.transformVector( v );
			
			return v;
		}
		
		//@override
		public clone():away.cameras.LensBase
		{
			var clone:PerspectiveLens = new PerspectiveLens( this._fieldOfView );
			clone._pNear = this._pNear;
			clone._pFar = this._pFar;
			clone._pAspectRatio = this._pAspectRatio;
			return clone;
		}
		
		//@override
		public pUpdateMatrix()
		{
			var raw:number[] = [];
			
			this._yMax = this._pNear * this._focalLengthInv;
			this._xMax = this._yMax * this._pAspectRatio;
			
			var left:number, right:number, top:number, bottom:number;
			
			if( this._pScissorRect.x == 0 && this._pScissorRect.y == 0 && this._pScissorRect.width == this._pViewPort.width && this._pScissorRect.height == this._pViewPort.height )
			{
				// assume unscissored frustum
				left = -this._xMax;
				right = this._xMax;
				top = -this._yMax;
				bottom = this._yMax;
				// assume unscissored frustum
				raw[0] = this._pNear/this._xMax;
                raw[5] = this._pNear/this._yMax;
				raw[10] = this._pFar/(this._pFar - this._pNear);
				raw[11] = 1;
				raw[1] = raw[2] = raw[3] = raw[4] =
					raw[6] = raw[7] = raw[8] = raw[9] =
					raw[12] = raw[13] = raw[15] = 0;
				raw[14] = -this._pNear*raw[10];
			} else {
				// assume scissored frustum
				var xWidth:number = this._xMax*(this._pViewPort.width/this._pScissorRect.width);
				var yHgt:number = this._yMax*(this._pViewPort.height/this._pScissorRect.height);
				var center:number = this._xMax*(this._pScissorRect.x*2 - this._pViewPort.width)/this._pScissorRect.width + this._xMax;
				var middle:number = -this._yMax*(this._pScissorRect.y*2 - this._pViewPort.height)/this._pScissorRect.height - this._yMax;
				
				left = center - xWidth;
				right = center + xWidth;
				top = middle - yHgt;
				bottom = middle + yHgt;
				
				raw[0] = 2*this._pNear/(right - left);
				raw[5] = 2*this._pNear/(bottom - top);
				raw[8] = (right + left)/(right - left);
				raw[9] = (bottom + top)/(bottom - top);
				raw[10] = (this._pFar + this._pNear)/(this._pFar - this._pNear);
				raw[11] = 1;
				raw[1] = raw[2] = raw[3] = raw[4] =
					raw[6] = raw[7] = raw[12] = raw[13] = raw[15] = 0;
				raw[14] = -2*this._pFar*this._pNear/(this._pFar - this._pNear);
			}
			
			this._pMatrix.copyRawDataFrom( raw );
			
			var yMaxFar:number = this._pFar * this._focalLengthInv;
			var xMaxFar:number = yMaxFar * this._pAspectRatio;
			
			this._pFrustumCorners[0] = this._pFrustumCorners[9] = left;
			this._pFrustumCorners[3] = this._pFrustumCorners[6] = right;
			this._pFrustumCorners[1] = this._pFrustumCorners[4] = top;
			this._pFrustumCorners[7] = this._pFrustumCorners[10] = bottom;
			
			this._pFrustumCorners[12] = this._pFrustumCorners[21] = -xMaxFar;
			this._pFrustumCorners[15] = this._pFrustumCorners[18] = xMaxFar;
			this._pFrustumCorners[13] = this._pFrustumCorners[16] = -yMaxFar;
			this._pFrustumCorners[19] = this._pFrustumCorners[22] = yMaxFar;
			
			this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
			this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
			
			this._pMatrixInvalid = false;


		}
	}
}