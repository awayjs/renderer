///<reference path="../../../build/Away3D.next.d.ts" />


module demos.parsers {

    export class AWDShadowTest
    {

        private _view           : away.containers.View3D;
        private _token          : away.loaders.AssetLoaderToken;
        private _timer          : away.utils.RequestAnimationFrame;
        private lookAtPosition  : away.geom.Vector3D = new away.geom.Vector3D();
        private _cameraIncrement: number = 0;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            away.library.AssetLibrary.enableParser( away.loaders.AWDParser ) ;

	        this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/ShadowTest.awd') );

	        this._token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this._view = new away.containers.View3D();
            this._view.camera.lens.far  = 1000;
	        this._view.camera.y = 100;

            this._timer = new away.utils.RequestAnimationFrame( this.render, this );


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
                this._cameraIncrement += 0.01;
                this._view.camera.x = Math.cos( this._cameraIncrement ) * 400;
                this._view.camera.z = Math.sin( this._cameraIncrement ) * 400;

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

            var loader			: away.loaders.AssetLoader   	= <away.loaders.AssetLoader> e.target;
            var numAssets		: number 						= loader.baseDependency.assets.length;

            for( var i : number = 0; i < numAssets; ++i )
            {
                var asset: away.library.IAsset = loader.baseDependency.assets[ i ];

	            console.log ( asset.assetType  );
                switch ( asset.assetType )
                {
                    case away.library.AssetType.MESH:

                        var mesh : away.entities.Mesh = <away.entities.Mesh> asset;

                        this._view.scene.addChild( mesh );



                        this.resize();

                        break;

	                case away.library.AssetType.LIGHT:

		                this._view.scene.addChild( <away.lights.LightBase> asset );

		                break;

                    case away.library.AssetType.MATERIAL:

                        break;

                }

            }

	        /*
	        switch (ev.asset.assetType) {

			        obj = <away.lights.LightBase> ev.asset;
			        break;
		        case away.library.AssetType.CONTAINER:
			        obj = <away.containers.ObjectContainer3D> ev.asset;
			        break;
		        case away.library.AssetType.MESH:
			        obj = <away.entities.Mesh> ev.asset;
			        break;
			        //case away.library.AssetType.SKYBOX:
			        //    obj = <away.entities.SkyBox> ev.asset;
			        break;
			        //case away.library.AssetType.TEXTURE_PROJECTOR:
			        //    obj = <away.entities.TextureProjector> ev.asset;
			        break;
		        case away.library.AssetType.CAMERA:
			        obj = <away.cameras.Camera3D> ev.asset;
			        break;
		        case away.library.AssetType.SEGMENT_SET:
			        obj = <away.entities.SegmentSet> ev.asset;
			        break;
	        }
	        */
	        this._timer.start();


        }


    }

}