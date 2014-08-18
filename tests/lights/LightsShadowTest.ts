///<reference path="../../build/stagegl-extensions.next.d.ts" />

module tests.lights
{
	import LightBase					= away.base.LightBase;
	import View							= away.containers.View;
	import HoverController				= away.controllers.HoverController;
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

    export class LightsShadowTest
    {

        private _view:View;
        private _token:AssetLoaderToken;
        private _timer:RequestAnimationFrame;
        private lookAtPosition:Vector3D = new Vector3D();
        private _awdMesh:Mesh;
        private _cameraController:HoverController;
        private _move:boolean = false;
        private _lastPanAngle:number;
        private _lastTiltAngle:number;
        private _lastMouseX:number;
        private _lastMouseY:number;

        constructor()
        {
            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            AssetLibrary.enableParser(AWDParser);

	        this._token = AssetLibrary.load(new URLRequest('assets/ShadowTest.awd'));

	        this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));
            this._token.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));

            this._view = new View(new DefaultRenderer());
            this._view.camera.projection.far = 5000;
	        this._view.camera.y = 100;

            this._timer = new RequestAnimationFrame(this.render, this);

            this._cameraController = new HoverController(this._view.camera, null, 45, 20, 2000, 5);

            document.onmousedown = (event:MouseEvent) => this.onMouseDown(event);
            document.onmouseup = (event:MouseEvent) => this.onMouseUp(event);
            document.onmousemove = (event:MouseEvent) => this.onMouseMove(event);
            document.onmousewheel = (event:MouseWheelEvent) => this.onMouseWheel(event);

            window.onresize = (event:UIEvent) => this.resize(event);
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
            if (this._view.camera)
                this._view.camera.lookAt(this.lookAtPosition);

            if (this._awdMesh)
                this._awdMesh.rotationY += 0.2;

             this._view.render();
        }

        public onAssetComplete(event:AssetEvent)
        {
            console.log('------------------------------------------------------------------------------');
            console.log('AssetEvent.ASSET_COMPLETE' , AssetLibrary.getAsset(event.asset.name));
            console.log('------------------------------------------------------------------------------');
        }

        public onResourceComplete(event:LoaderEvent)
        {

            console.log('------------------------------------------------------------------------------');
            console.log('LoaderEvent.RESOURCE_COMPLETE' , event);
            console.log('------------------------------------------------------------------------------');

            var loader:AssetLoader = <AssetLoader> event.target;
            var numAssets:number = loader.baseDependency.assets.length;

            for (var i:number = 0; i < numAssets; ++i) {
                var asset:IAsset = loader.baseDependency.assets[ i ];

                switch (asset.assetType) {
                    case AssetType.MESH:
                        this._awdMesh = <Mesh> asset;
                        this._view.scene.addChild(this._awdMesh);
                        this.resize();
                        break;

	                case AssetType.LIGHT:
		                this._view.scene.addChild(<LightBase> asset);
		                break;

                    case AssetType.MATERIAL:
                        break;

                }
            }

	        this._timer.start();
        }

        /**
         * Mouse down listener for navigation
         */
        private onMouseDown(event):void
        {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        }

        /**
         * Mouse up listener for navigation
         */
        private onMouseUp(event):void
        {
            this._move = false;
        }

        private onMouseMove(event)
        {
            if (this._move) {
                this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        }

        /**
         * Mouse wheel listener for navigation
         */
        private onMouseWheel(event:MouseWheelEvent):void
        {
            this._cameraController.distance -= event.wheelDelta * 2;

            if (this._cameraController.distance < 100)
                this._cameraController.distance = 100;
            else if (this._cameraController.distance > 2000)
                this._cameraController.distance = 2000;
        }
    }
}