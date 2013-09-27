
///<reference path="../../_definitions.ts"/>

module away.lights
{
	export class CubeMapShadowMapper extends away.lights.ShadowMapperBase
	{
		
		private _depthCameras:away.cameras.Camera3D[];
		private _lenses:away.cameras.PerspectiveLens[];
		private _needsRender:boolean[];
		
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
			this._lenses = [];
			// posX, negX, posY, negY, posZ, negZ
			this.addCamera(0, 90, 0);
			this.addCamera(0, -90, 0);
			this.addCamera(-90, 0, 0);
			this.addCamera(90, 0, 0);
			this.addCamera(0, 0, 0);
			this.addCamera(0, 180, 0);
		}
		
		private addCamera( rotationX:number, rotationY:number, rotationZ:number )
		{
			var cam:away.cameras.Camera3D = new away.cameras.Camera3D();
			cam.rotationX = rotationX;
			cam.rotationY = rotationY;
			cam.rotationZ = rotationZ;
			cam.lens.near = .01;
			
			var lens: away.cameras.PerspectiveLens = <away.cameras.PerspectiveLens> cam.lens;
			lens.fieldOfView = 90;
			this._lenses.push(lens);
			cam.lens.iAspectRatio = 1;
			this._depthCameras.push( cam );
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
		public pUpdateDepthProjection( viewCamera:away.cameras.Camera3D )
		{
			var light:away.lights.PointLight =  <away.lights.PointLight>(this._pLight);
			var maxDistance:number = light._pFallOff;
			var pos:away.geom.Vector3D = this._pLight.scenePosition;
			
			// todo: faces outside frustum which are pointing away from camera need not be rendered!
			for( var i:number = 0; i < 6; ++i ) {
				this._lenses[i].far = maxDistance;
				this._depthCameras[i].position = pos;
				this._needsRender[i] = true;
			}
		}
		
		//@override
		public pDrawDepthMap( target:away.display3D.TextureBase, scene:away.containers.Scene3D, renderer:away.render.DepthRenderer )
		{
			for( var i:number = 0; i < 6; ++i )
			{
				if( this._needsRender[i] )
				{

					this._pCasterCollector.camera = this._depthCameras[i];
					this._pCasterCollector.clear();
					scene.traversePartitions(this._pCasterCollector );
					renderer.iRender( this._pCasterCollector, target, null, i );
					this._pCasterCollector.cleanUp();
				}
			}
		}

	}
}