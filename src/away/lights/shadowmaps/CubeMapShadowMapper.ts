///<reference path="../../_definitions.ts"/>

module away.lights
{
	import Scene					= away.containers.Scene;
	import Camera					= away.entities.Camera;
	import PerspectiveProjection	= away.projections.PerspectiveProjection;
	import DepthRenderer			= away.render.DepthRenderer;
	import RenderTexture			= away.textures.RenderTexture;
	import TextureProxyBase			= away.textures.TextureProxyBase;
	
	
	export class CubeMapShadowMapper extends ShadowMapperBase
	{
		private _depthCameras:Array<Camera>;
		private _projections:Array<PerspectiveProjection>;
		private _needsRender:Array<boolean>;

		constructor()
		{
			super();

			this._pDepthMapSize = 512;
			this._needsRender = new Array();
			this.initCameras();
		}

		private initCameras()
		{
			this._depthCameras = new Array();
			this._projections = new Array();
			
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
			var cam:Camera = new Camera();
			cam.rotationX = rotationX;
			cam.rotationY = rotationY;
			cam.rotationZ = rotationZ;
			cam.projection.near = .01;

			var projection:PerspectiveProjection = <PerspectiveProjection> cam.projection;
			projection.fieldOfView = 90;
			this._projections.push(projection);
			cam.projection._iAspectRatio = 1;
			this._depthCameras.push(cam);
		}

		//@override
		public pCreateDepthTexture():TextureProxyBase
		{
			throw new away.errors.PartialImplementationError();
			/*
			 return new RenderCubeTexture( this._depthMapSize );
			 */
		}

		//@override
		public pUpdateDepthProjection(viewCamera:Camera)
		{
			var light:PointLight = <PointLight>(this._pLight);
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
		public pDrawDepthMap(target:RenderTexture, scene:Scene, renderer:DepthRenderer)
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