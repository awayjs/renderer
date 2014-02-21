///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.parsers {

    export class AWDShadowTest
    {

        private _view               : away.containers.View;
        private _token              : away.net.AssetLoaderToken;
        private _timer              : away.utils.RequestAnimationFrame;
        private lookAtPosition      : away.geom.Vector3D = new away.geom.Vector3D();
        private _awdMesh            : away.entities.Mesh;
        private _cameraController   : away.controllers.HoverController;
        private _move:boolean = false;
        private _lastPanAngle:number;
        private _lastTiltAngle:number;
        private _lastMouseX:number;
        private _lastMouseY:number;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            away.library.AssetLibrary.enableParser( away.parsers.AWDParser ) ;


	        this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/ShadowTest.awd') );

	        this._token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );
            this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , away.utils.Delegate.create(this, this.onAssetComplete) );

            this._view = new away.containers.View(new away.render.DefaultRenderer());
            this._view.camera.projection.far  = 5000;
	        this._view.camera.y = 100;

            this._timer = new away.utils.RequestAnimationFrame( this.render, this );


            this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 2000, 5);

            document.onmousedown = (event) => this.onMouseDown(event);
            document.onmouseup = (event) => this.onMouseUp(event);
            document.onmousemove = (event) => this.onMouseMove(event);
            document.onmousewheel = (event) => this.onMouseWheel(event);
            window.onresize = () => this.resize();

        }

        private resize( )
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }

        private render( dt : number ) //animate based on dt for firefox
        {

            if ( this._view.camera )
            {
                this._view.camera.lookAt( this.lookAtPosition ) ;


            }

            if ( this._awdMesh )
            {

                this._awdMesh.rotationY += 0.2;
            }
             this._view.render();

        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {
            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.AssetEvent.ASSET_COMPLETE' , away.library.AssetLibrary.getAsset(e.asset.name) );
            console.log( '------------------------------------------------------------------------------');
        }

        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e  );
            console.log( '------------------------------------------------------------------------------');

            var loader			: away.net.AssetLoader   	= <away.net.AssetLoader> e.target;
            var numAssets		: number 						= loader.baseDependency.assets.length;

            for( var i : number = 0; i < numAssets; ++i )
            {
                var asset: away.library.IAsset = loader.baseDependency.assets[ i ];

                switch ( asset.assetType )
                {
                    case away.library.AssetType.MESH:

                        this._awdMesh = <away.entities.Mesh> asset;
                        this._view.scene.addChild( this._awdMesh );
                        this.resize();

                        break;

	                case away.library.AssetType.LIGHT:

		                this._view.scene.addChild( <away.lights.LightBase> asset );

		                break;

                    case away.library.AssetType.MATERIAL:

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
        private onMouseWheel(event):void
        {
            this._cameraController.distance -= event.wheelDelta * 2;

            if (this._cameraController.distance < 100)
                this._cameraController.distance = 100;
            else if (this._cameraController.distance > 2000)
                this._cameraController.distance = 2000;
        }

    }

}