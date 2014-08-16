///<reference path="../../build/stagegl-renderer.next.d.ts" />

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
	import AWDParser					= away.parsers.AWDParser;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class AWDParserTest
    {

        private _view:View;
        private _token:AssetLoaderToken;
        private _timer:RequestAnimationFrame;
        private _suzanne:Mesh;

        constructor()
        {
            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            AssetLibrary.enableParser(AWDParser) ;

            this._token = AssetLibrary.load(new URLRequest('assets/suzanne.awd'));
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
            if (this._suzanne)
                this._suzanne.rotationY += 1;

            this._view.render();
            this._view.camera.z = -2000;
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
            console.log('away.events.LoaderEvent.RESOURCE_COMPLETE' , event);
            console.log('------------------------------------------------------------------------------');

            var loader:AssetLoader = <AssetLoader> event.target;
            var numAssets:number = loader.baseDependency.assets.length;

            for(var i:number = 0; i < numAssets; ++i) {
                var asset:IAsset = loader.baseDependency.assets[i];

                switch (asset.assetType) {
                    case AssetType.MESH:

						this._suzanne = <Mesh> asset;
						this._suzanne.transform.scale = new Vector3D(600, 600, 600);

                        this._view.scene.addChild(this._suzanne);

                        break;

                    case AssetType.GEOMETRY:
                        break;

                    case AssetType.MATERIAL:
                        break;
                }
            }
        }
    }
}