///<reference path="../../_definitions.ts"/>

module away.lights
{
	export class CubeMapShadowMapper extends away.lights.ShadowMapperBase
	{

		private _depthCameras:Array<away.entities.Camera>;
		private _projections:Array<away.projections.PerspectiveProjection>;
		private _needsRender:Array<boolean>;

		constructor()
		{
			super();

			this._pDepthMapSize = 512;
			this._needsRender = [];
			this.initCameras();
		}

		private initCameras()
		{
			this._depthCameras = [];
			this._projections = [];
			// posX, negX, posY, negY, posZ, negZ
			this.addCamera(0, 90, 0);
			this.addCamera(0, -90, 0);
			this.addCamera(-90, 0, 0);
			this.addCamera(90, 0, 0);
			this.addCamera(0, 0, 0);
			this.addCamera(0, 180, 0);
		}

		private addCamera(rotationX:number, rotationY:number, rotationZ:number)
		{
			var cam:away.entities.Camera = new away.entities.Camera();
			cam.rotationX = rotationX;
			cam.rotationY = rotationY;
			cam.rotationZ = rotationZ;
			cam.projection.near = .01;

			var projection:away.projections.PerspectiveProjection = <away.projections.PerspectiveProjection> cam.projection;
			projection.fieldOfView = 90;
			this._projections.push(projection);
			cam.projection.iAspectRatio = 1;
			this._depthCameras.push(cam);
		}

		//@override
		public pCreateDepthTexture():away.textures.TextureProxyBase
		{
			throw new away.errors.PartialImplementationError();
			/*
			 return new away.textures.RenderCubeTexture( this._depthMapSize );
			 */
		}

		//@override
		public pUpdateDepthProjection(viewCamera:away.entities.Camera)
		{
			var light:away.lights.PointLight = <away.lights.PointLight>(this._pLight);
			var maxDistance:number = light._pFallOff;
			var pos:away.geom.Vector3D = this._pLight.scenePosition;

			// todo: faces outside frustum which are pointing away from camera need not be rendered!
			for (var i:number = 0; i < 6; ++i) {
				this._projections[i].far = maxDistance;
				this._depthCameras[i].transform.position = pos;
				this._needsRender[i] = true;
			}
		}

		//@override
		public pDrawDepthMap(target:away.gl.TextureBase, scene:away.containers.Scene, renderer:away.render.DepthRenderer)
		{
			for (var i:number = 0; i < 6; ++i) {
				if (this._needsRender[i]) {
					this._pCasterCollector.camera = this._depthCameras[i];
					this._pCasterCollector.clear();
					scene.traversePartitions(this._pCasterCollector);
					renderer._iRender(this._pCasterCollector, target, null, i)
				}
			}
		}

	}
}