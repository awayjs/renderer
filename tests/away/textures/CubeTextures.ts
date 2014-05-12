///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.textures
{
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import Skybox						= away.entities.Skybox;
	import LoaderEvent					= away.events.LoaderEvent;
	import Vector3D						= away.geom.Vector3D;
	import AssetLibrary					= away.library.AssetLibrary;
	import DirectionalLight				= away.lights.DirectionalLight;
	import SkyboxMaterial				= away.materials.SkyboxMaterial;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import AssetLoader					= away.net.AssetLoader;
	import AssetLoaderToken				= away.net.AssetLoaderToken;
	import URLLoader					= away.net.URLLoader;
	import URLRequest					= away.net.URLRequest;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ImageCubeTexture				= away.textures.ImageCubeTexture;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

	export class CubeTextures
	{
		private _lightPicker:StaticLightPicker;
		private _view:View;
		private _timer:RequestAnimationFrame;
		private _skyboxCubeTexture:ImageCubeTexture;

        private _torus:PrimitiveTorusPrefab;
        private _torusMesh:Mesh;
        private _skyboxMaterial:SkyboxMaterial;

        private _skybox:Skybox;

		constructor()
		{
			away.Debug.LOG_PI_ERRORS    = false;
			away.Debug.THROW_ERRORS     = false;

			this._view = new View(new DefaultRenderer());
			this._view.camera.z = -500;
			this._view.camera.y	= 250;
			this._view.camera.rotationX = 20;
			this._view.camera.projection.near = 0.5;
			this._view.camera.projection.far = 14000;
			this._view.backgroundColor = 0x2c2c32;

			var token:AssetLoaderToken = AssetLibrary.load( new URLRequest('assets/CubeTextureTest.cube'));
			token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

			window.onresize = (event:UIEvent) => this.onResize(event);

			this.onResize();

			this._timer = new away.utils.RequestAnimationFrame(this.render, this);
			this._timer.start();
		}

		public onResourceComplete(event:LoaderEvent)
		{
			var loader:AssetLoader = <AssetLoader> event.target;

			switch(event.url) {
				case 'assets/CubeTextureTest.cube':
					this._skyboxCubeTexture = <ImageCubeTexture> loader.baseDependency.assets[0];
					this._skyboxMaterial = new SkyboxMaterial(this._skyboxCubeTexture);

					this._torus = new PrimitiveTorusPrefab();
					this._torus.material = this._skyboxMaterial;

					this._torusMesh = <Mesh> this._torus.getNewObject();
					this._view.scene.addChild(this._torusMesh);

					this._skybox = new Skybox(this._skyboxMaterial);
					this._view.scene.addChild(this._skybox);

					break;
			}
		}

		private render(dt:number)
		{
            this._view.camera.rotationY += 0.01 * dt;
			this._view.render();
		}

		public onResize(event:UIEvent = null)
		{
			this._view.y = 0;
			this._view.x = 0;
			this._view.width = window.innerWidth;
			this._view.height = window.innerHeight;
		}
	}
}
