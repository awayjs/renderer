///<reference path="../../build/stagegl-extensions.next.d.ts" />

module tests.parsers
{
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import AssetEvent					= away.events.AssetEvent;
	import LoaderEvent					= away.events.LoaderEvent;
	import Vector3D						= away.geom.Vector3D;
	import AssetLibrary					= away.library.AssetLibrary;
	import AssetLoader					= away.library.AssetLoader;
	import AssetLoaderToken				= away.library.AssetLoaderToken;
	import AssetType					= away.library.AssetType;
	import IAsset						= away.library.IAsset;
	import URLRequest					= away.net.URLRequest;
	import OBJParser					= away.parsers.OBJParser;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class ObjParserTest
    {
		private _view:View;
		private _token:AssetLoaderToken;
		private _timer:RequestAnimationFrame;
        private _t800:Mesh;

        constructor()
        {
			away.Debug.LOG_PI_ERRORS = true;
			away.Debug.THROW_ERRORS = false;

			AssetLibrary.enableParser(OBJParser) ;

			this._token = AssetLibrary.load(new URLRequest('assets/t800.obj'));
			this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));
			this._token.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));

			this._view = new View(new DefaultRenderer());
			this._timer = new RequestAnimationFrame(this.render, this);

			window.onresize = (event:UIEvent) => this.resize(event);

			this._timer.start();
			this.resize();
        }

		private resize(event:UIEvent = null)
		{
			this._view.y = 0;
			this._view.x = 0;
			this._view.width = window.innerWidth;
			this._view.height = window.innerHeight;
		}

		private render(dt:number) //animate based on dt for firefox
		{
			if (this._t800)
				this._t800.rotationY += 1;

			this._view.render();
		}

		public onAssetComplete(event:AssetEvent)
		{
			console.log('------------------------------------------------------------------------------');
			console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
			console.log('------------------------------------------------------------------------------');
		}

		public onResourceComplete(event:LoaderEvent)
		{
            console.log('------------------------------------------------------------------------------');
            console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event);
            console.log('------------------------------------------------------------------------------');

            console.log(AssetLibrary.getAsset('Mesh_g0'));

            this._t800 = <Mesh> AssetLibrary.getAsset('Mesh_g0');
            this._t800.y = -200;
            this._t800.transform.scale = new Vector3D(4, 4, 4);

			this._view.scene.addChild(this._t800);
        }
    }
}
