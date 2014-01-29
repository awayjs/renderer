///<reference path="../../_definitions.ts" />

module away.lights
{
	export class DirectionalShadowMapper extends away.lights.ShadowMapperBase
	{

		public _pOverallDepthCamera:away.cameras.Camera3D;
		public _pLocalFrustum:number[];

		public _pLightOffset:number = 10000;
		public _pMatrix:away.geom.Matrix3D;
		public _pOverallDepthLens:away.cameras.FreeMatrixLens;
		public _pSnap:number = 64;

		public _pCullPlanes:away.geom.Plane3D[];
		public _pMinZ:number;
		public _pMaxZ:number;

		constructor()
		{
			super();
			this._pCullPlanes = [];
			this._pOverallDepthLens = new away.cameras.FreeMatrixLens();
			this._pOverallDepthCamera = new away.cameras.Camera3D(this._pOverallDepthLens);
			this._pLocalFrustum = [];
			this._pMatrix = new away.geom.Matrix3D();
		}

		public get snap():number
		{
			return this._pSnap;
		}

		public set snap(value:number)
		{
			this._pSnap = value;
		}

		public get lightOffset():number
		{
			return this._pLightOffset;
		}

		public set lightOffset(value:number)
		{
			this._pLightOffset = value;
		}

		//@arcane
		public get iDepthProjection():away.geom.Matrix3D
		{
			return this._pOverallDepthCamera.viewProjection;
		}

		//@arcane
		public get depth():number
		{
			return this._pMaxZ - this._pMinZ;
		}

		//@override
		public pDrawDepthMap(target:away.gl.TextureBase, scene:away.containers.Scene3D, renderer:away.render.DepthRenderer)
		{
			this._pCasterCollector.camera = this._pOverallDepthCamera;
			this._pCasterCollector.cullPlanes = this._pCullPlanes;
			this._pCasterCollector.clear();
			scene.traversePartitions(this._pCasterCollector);
			renderer.iRender(this._pCasterCollector, target);
			this._pCasterCollector.cleanUp();
		}

		//@protected
		public pUpdateCullPlanes(viewCamera:away.cameras.Camera3D)
		{
			var lightFrustumPlanes:away.geom.Plane3D[] = this._pOverallDepthCamera.frustumPlanes;
			var viewFrustumPlanes:away.geom.Plane3D[] = viewCamera.frustumPlanes;
			this._pCullPlanes.length = 4;

			this._pCullPlanes[0] = lightFrustumPlanes[0];
			this._pCullPlanes[1] = lightFrustumPlanes[1];
			this._pCullPlanes[2] = lightFrustumPlanes[2];
			this._pCullPlanes[3] = lightFrustumPlanes[3];

			var light:away.lights.DirectionalLight = <away.lights.DirectionalLight> this._pLight;
			var dir:away.geom.Vector3D = light.sceneDirection;
			var dirX:number = dir.x;
			var dirY:number = dir.y;
			var dirZ:number = dir.z;
			var j:number = 4;
			for (var i:number = 0; i < 6; ++i) {
				var plane:away.geom.Plane3D = viewFrustumPlanes[i];
				if (plane.a*dirX + plane.b*dirY + plane.c*dirZ < 0) {
					this._pCullPlanes[j++] = plane;
				}
			}
		}

		//@override
		public pUpdateDepthProjection(viewCamera:away.cameras.Camera3D)
		{
			this.pUpdateProjectionFromFrustumCorners(viewCamera, viewCamera.lens.frustumCorners, this._pMatrix);
			this._pOverallDepthLens.matrix = this._pMatrix;
			this.pUpdateCullPlanes(viewCamera);
		}

		public pUpdateProjectionFromFrustumCorners(viewCamera:away.cameras.Camera3D, corners:number[], matrix:away.geom.Matrix3D)
		{
			var raw:number[] = [];
			var dir:away.geom.Vector3D;
			var x:number, y:number, z:number;
			var minX:number, minY:number;
			var maxX:number, maxY:number;
			var i:number;

			var light:away.lights.DirectionalLight = <away.lights.DirectionalLight> this._pLight;
			dir = light.sceneDirection;
			this._pOverallDepthCamera.transform = this._pLight.sceneTransform;
			x = Math.floor((viewCamera.x - dir.x*this._pLightOffset)/this._pSnap)*this._pSnap;
			y = Math.floor((viewCamera.y - dir.y*this._pLightOffset)/this._pSnap)*this._pSnap;
			z = Math.floor((viewCamera.z - dir.z*this._pLightOffset)/this._pSnap)*this._pSnap;
			this._pOverallDepthCamera.x = x;
			this._pOverallDepthCamera.y = y;
			this._pOverallDepthCamera.z = z;

			this._pMatrix.copyFrom(this._pOverallDepthCamera.inverseSceneTransform);
			this._pMatrix.prepend(viewCamera.sceneTransform);
			this._pMatrix.transformVectors(corners, this._pLocalFrustum);

			minX = maxX = this._pLocalFrustum[0];
			minY = maxY = this._pLocalFrustum[1];
			this._pMaxZ = this._pLocalFrustum[2];

			i = 3;
			while (i < 24) {
				x = this._pLocalFrustum[i];
				y = this._pLocalFrustum[i + 1];
				z = this._pLocalFrustum[i + 2];
				if (x < minX)
					minX = x;
				if (x > maxX)
					maxX = x;
				if (y < minY)
					minY = y;
				if (y > maxY)
					maxY = y;
				if (z > this._pMaxZ)
					this._pMaxZ = z;
				i += 3;
			}
			this._pMinZ = 1;

			var w:number = maxX - minX;
			var h:number = maxY - minY;
			var d:number = 1/(this._pMaxZ - this._pMinZ);

			if (minX < 0) {
				minX -= this._pSnap; // because int() rounds up for < 0
			}
			if (minY < 0) {
				minY -= this._pSnap;
			}
			minX = Math.floor(minX/this._pSnap)*this._pSnap;
			minY = Math.floor(minY/this._pSnap)*this._pSnap;

			var snap2:number = 2*this._pSnap;
			w = Math.floor(w/snap2 + 2)*snap2;
			h = Math.floor(h/snap2 + 2)*snap2;

			maxX = minX + w;
			maxY = minY + h;

			w = 1/w;
			h = 1/h;

			raw[0] = 2*w;
			raw[5] = 2*h;
			raw[10] = d;
			raw[12] = -(maxX + minX)*w;
			raw[13] = -(maxY + minY)*h;
			raw[14] = -this._pMinZ*d;
			raw[15] = 1;
			raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;

			matrix.copyRawDataFrom(raw);
		}
	}
}