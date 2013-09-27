///<reference path="../../_definitions.ts" />

module away.cameras
{
	export class OrthographicLens extends away.cameras.LensBase
	{
		
		private _projectionHeight:number;
		private _xMax:number;
		private _yMax:number;

		constructor( projectionHeight:number = 500 )
		{
			super();
			this._projectionHeight = projectionHeight;
		}
		
		public get projectionHeight():number
		{
			return this._projectionHeight;
		}
		
		public set projectionHeight( value:number )
		{
			if( value == this._projectionHeight )
			{
				return;
			}
			this._projectionHeight = value;
			this.pInvalidateMatrix();
		}
		
		//@override
		public unproject( nX:number, nY:number, sZ:number):away.geom.Vector3D
		{
			var v:away.geom.Vector3D = new away.geom.Vector3D( nX + this.matrix.rawData[12], -nY + this.matrix.rawData[13], sZ, 1.0);
			v = this.unprojectionMatrix.transformVector(v);
			
			//z is unaffected by transform
			v.z = sZ;
			
			return v;
		}
		
		//@override
		public clone():away.cameras.LensBase
		{
			var clone:away.cameras.OrthographicLens = new away.cameras.OrthographicLens();
			clone._pNear = this._pNear;
			clone._pFar = this._pFar;
			clone._pAspectRatio = this._pAspectRatio;
			clone.projectionHeight = this._projectionHeight;
			return clone;
		}
		
		//@override
		public pUpdateMatrix()
		{
			var raw:number[] = [];
			this._yMax = this._projectionHeight*.5;
			this._xMax = this._yMax*this._pAspectRatio;
			
			var left:number;
			var right:number;
			var top:number;
			var bottom:number;
			
			if( this._pScissorRect.x == 0 && this._pScissorRect.y == 0 && this._pScissorRect.width == this._pViewPort.width && this._pScissorRect.height == this._pViewPort.height) {
				// assume symmetric frustum
				
				left = -this._xMax;
				right = this._xMax;
				top = -this._yMax;
				bottom = this._yMax;
				
				raw[0] = 2/(this._projectionHeight*this._pAspectRatio);
				raw[5] = 2/this._projectionHeight;
				raw[10] = 1/(this._pFar - this._pNear);
				raw[14] = this._pNear/(this._pNear - this._pFar);
				raw[1] = raw[2] = raw[3] = raw[4] =
				raw[6] = raw[7] = raw[8] = raw[9] =
				raw[11] = raw[12] = raw[13] = 0;
				raw[15] = 1;
				
			} else {
				
				var xWidth:number = this._xMax*(this._pViewPort.width/this._pScissorRect.width);
				var yHgt:number = this._yMax*(this._pViewPort.height/this._pScissorRect.height);
				var center:number = this._xMax*(this._pScissorRect.x*2 - this._pViewPort.width)/this._pScissorRect.width + this._xMax;
				var middle:number = -this._yMax*(this._pScissorRect.y*2 - this._pViewPort.height)/this._pScissorRect.height - this._yMax;
				
				left = center - xWidth;
				right = center + xWidth;
				top = middle - yHgt;
				bottom = middle + yHgt;
				
				raw[0] = 2*1/(right - left);
				raw[5] = -2*1/(top - bottom);
				raw[10] = 1/(this._pFar - this._pNear);
				
				raw[12] = (right + left)/(right - left);
				raw[13] = (bottom + top)/(bottom - top);
				raw[14] = this._pNear/(this.near - this.far);
				
				raw[1] = raw[2] = raw[3] = raw[4] =
				raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
				raw[15] = 1;
			}

			this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pFrustumCorners[12] = this._pFrustumCorners[21] = left;
			this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pFrustumCorners[15] = this._pFrustumCorners[18] = right;
			this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pFrustumCorners[13] = this._pFrustumCorners[16] = top;
			this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pFrustumCorners[19] = this._pFrustumCorners[22] = bottom;
			this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
			this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
			
			this._pMatrix.copyRawDataFrom(raw);

			this._pMatrixInvalid = false;
		}
	}
}