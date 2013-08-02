/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts" />

module away.cameras
{
	export class Camera3D extends away.entities.Entity
	{
		
		private _viewProjection:away.geom.Matrix3D = new away.geom.Matrix3D();
		private _viewProjectionDirty:Boolean = true;
		private _lens:LensBase;
		private _frustumPlanes:away.math.Plane3D[];
		private _frustumPlanesDirty:Boolean = true;
		
		constructor( lens:LensBase = null )
		{
			super();
			
			this._lens = lens || new away.cameras.PerspectiveLens();
			this._lens.addEventListener( away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this );
			
			this._frustumPlanes = [];
			
			for( var i:number = 0; i < 6; ++i )
			{
				this._frustumPlanes[i] = new away.math.Plane3D();
			}

            this.z = -1000;

		}
		
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.NullBounds();
		}
		
		//@override
		public get assetType():string
		{
			return away.library.AssetType.CAMERA;
		}
		
		private onLensMatrixChanged( event:away.events.LensEvent )
		{
			this._viewProjectionDirty = true;
			this._frustumPlanesDirty = true;
			this.dispatchEvent(event);
		}
		
		public get frustumPlanes():away.math.Plane3D[]
		{
			if( this._frustumPlanesDirty )
			{
				this.updateFrustum();
			}
			return this._frustumPlanes;
		}
		
		private updateFrustum()
		{
			var a:number, b:number, c:number;
			//var d : Number;
			var c11:number, c12:number, c13:number, c14:number;
			var c21:number, c22:number, c23:number, c24:number;
			var c31:number, c32:number, c33:number, c34:number;
			var c41:number, c42:number, c43:number, c44:number;
			var p:away.math.Plane3D;
			var raw:number[] = new Array<number>(16);;//new Array(16 );away.utils.Matrix3DUtils.RAW_DATA_CONTAINER;//[];
			var invLen:number;
            this.viewProjection.copyRawDataTo( raw );

			c11 = raw[0];
			c12 = raw[4];
			c13 = raw[8];
			c14 = raw[12];
			c21 = raw[1];
			c22 = raw[5];
			c23 = raw[9];
			c24 = raw[13];
			c31 = raw[2];
			c32 = raw[6];
			c33 = raw[10];
			c34 = raw[14];
			c41 = raw[3];
			c42 = raw[7];
			c43 = raw[11];
			c44 = raw[15];
			
			// left plane
			p = this._frustumPlanes[0];
			a = c41 + c11;
			b = c42 + c12;
			c = c43 + c13;
			invLen = 1/Math.sqrt(a*a + b*b + c*c);
			p.a = a*invLen;
			p.b = b*invLen;
			p.c = c*invLen;
			p.d = -(c44 + c14)*invLen;
			
			// right plane
			p = this._frustumPlanes[1];
			a = c41 - c11;
			b = c42 - c12;
			c = c43 - c13;
			invLen = 1/Math.sqrt(a*a + b*b + c*c);
			p.a = a*invLen;
			p.b = b*invLen;
			p.c = c*invLen;
			p.d = (c14 - c44)*invLen;
			
			// bottom
			p = this._frustumPlanes[2];
			a = c41 + c21;
			b = c42 + c22;
			c = c43 + c23;
			invLen = 1/Math.sqrt(a*a + b*b + c*c);
			p.a = a*invLen;
			p.b = b*invLen;
			p.c = c*invLen;
			p.d = -(c44 + c24)*invLen;
			
			// top
			p = this._frustumPlanes[3];
			a = c41 - c21;
			b = c42 - c22;
			c = c43 - c23;
			invLen = 1/Math.sqrt(a*a + b*b + c*c);
			p.a = a*invLen;
			p.b = b*invLen;
			p.c = c*invLen;
			p.d = (c24 - c44)*invLen;
			
			// near
			p = this._frustumPlanes[4];
			a = c31;
			b = c32;
			c = c33;
			invLen = 1/Math.sqrt(a*a + b*b + c*c);
			p.a = a*invLen;
			p.b = b*invLen;
			p.c = c*invLen;
			p.d = -c34*invLen;
			
			// far
			p = this._frustumPlanes[5];
			a = c41 - c31;
			b = c42 - c32;
			c = c43 - c33;
			invLen = 1/Math.sqrt(a*a + b*b + c*c);
			p.a = a*invLen;
			p.b = b*invLen;
			p.c = c*invLen;
			p.d = (c34 - c44)*invLen;
			
			this._frustumPlanesDirty = false;

		}
		
		//@override
		public pInvalidateSceneTransform()
		{
			super.pInvalidateSceneTransform();
			
			this._viewProjectionDirty = true;
			this._frustumPlanesDirty = true;
		}
		
		//@override
		public pUpdateBounds()
		{
			this._pBounds.nullify();
			this._pBoundsInvalid = false;
		}
		
		//@override
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.CameraNode( this );
		}
		
		public get lens():away.cameras.LensBase
		{
			return this._lens;
		}
		
		public set lens( value:away.cameras.LensBase )
		{
			if( this._lens == value )
			{
				return;
			}
			if(!value)
			{
				throw new Error("Lens cannot be null!");
			}
			this._lens.removeEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this );
			this._lens = value;
			this._lens.addEventListener( away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this );
			this.dispatchEvent( new away.events.CameraEvent( away.events.CameraEvent.LENS_CHANGED, this ));
		}
		
		public get viewProjection():away.geom.Matrix3D
		{
			if( this._viewProjectionDirty)
			{

				this._viewProjection.copyFrom( this.inverseSceneTransform );
				this._viewProjection.append( this._lens.matrix );
				this._viewProjectionDirty = false;

			}
			return this._viewProjection;
		}

        /**
         * Calculates the ray in scene space from the camera to the given normalized coordinates in screen space.
         *
         * @param nX The normalised x coordinate in screen space, -1 corresponds to the left edge of the viewport, 1 to the right.
         * @param nY The normalised y coordinate in screen space, -1 corresponds to the top edge of the viewport, 1 to the bottom.
         * @param sZ The z coordinate in screen space, representing the distance into the screen.
         * @return The ray from the camera to the scene space position of the given screen coordinates.
         */
        public getRay(nX:number, nY:number, sZ:number):away.geom.Vector3D
        {
            return this.sceneTransform.deltaTransformVector(this._lens.unproject(nX, nY, sZ));
        }

        /**
         * Calculates the normalised position in screen space of the given scene position.
         *
         * @param point3d the position vector of the scene coordinates to be projected.
         * @return The normalised screen position of the given scene coordinates.
         */
        public project(point3d:away.geom.Vector3D):away.geom.Vector3D
        {
            return this._lens.project( this.inverseSceneTransform.transformVector(point3d));
        }

        /**
         * Calculates the scene position of the given normalized coordinates in screen space.
         *
         * @param nX The normalised x coordinate in screen space, -1 corresponds to the left edge of the viewport, 1 to the right.
         * @param nY The normalised y coordinate in screen space, -1 corresponds to the top edge of the viewport, 1 to the bottom.
         * @param sZ The z coordinate in screen space, representing the distance into the screen.
         * @return The scene position of the given screen coordinates.
         */
        public unproject(nX:number, nY:number, sZ:number):away.geom.Vector3D
        {
            return this.sceneTransform.transformVector(this._lens.unproject(nX, nY, sZ));
        }

	}
}