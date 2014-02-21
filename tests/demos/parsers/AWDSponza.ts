///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.parsers {

    export class AWDSponza
    {

        private _view           : away.containers.View;
        private _token          : away.net.AssetLoaderToken;
        private _timer          : away.utils.RequestAnimationFrame;
        private _suzane         : away.entities.Mesh;
        private _lightPicker    : away.materials.StaticLightPicker;
        private lookAtPosition  : away.geom.Vector3D = new away.geom.Vector3D();
        private _cameraIncrement: number = 0;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            away.library.AssetLibrary.enableParser( away.parsers.AWDParser ) ;

            this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/sponza/sponza_lights_textures_u.awd') );
	        //


            this._token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );
            this._token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , away.utils.Delegate.create(this, this.onAssetComplete) );

            this._view = new away.containers.View(new away.render.DefaultRenderer());
            this._view.camera.projection.far  = 6000;
	        this._view.camera.y = 100;

            this._timer = new away.utils.RequestAnimationFrame( this.render, this );


            window.onresize = () => this.resize();

        }

        private resize( )
        {

            this._view.width     = 720;//window.innerWidth;
            this._view.height    = 480;//window.innerHeight;

            this._view.x         = ( window.innerWidth - this._view.width ) / 2;
            this._view.y         = ( window.innerHeight - this._view.height ) / 2;;
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

            var loader			: away.net.AssetLoader   	= <away.net.AssetLoader> e.target;
            var numAssets		: number 						= loader.baseDependency.assets.length;

            for( var i : number = 0; i < numAssets; ++i )
            {
                var asset: away.library.IAsset = loader.baseDependency.assets[ i ];

                switch ( asset.assetType )
                {
                    case away.library.AssetType.MESH:

                        var mesh : away.entities.Mesh = <away.entities.Mesh> asset;
                        this._view.scene.addChild( mesh );

                        break;

                    case away.library.AssetType.LIGHT:

                        //this._view.scene.addChild( <away.lights.LightBase> asset );

                        break;

                    case away.library.AssetType.GEOMETRY:
                        break;

                    case away.library.AssetType.MATERIAL:

                        break;

                }

            }

	        this._timer.start();
            this.resize();

        }


    }

}