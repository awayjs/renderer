///<reference path="../../../build/Away3D.next.d.ts" />

module tests.library {

    export class AWDParserTestEnvMap
    {

        private _view       : away.containers.View;
        private token       : away.net.AssetLoaderToken;
        private _timer      : away.utils.RequestAnimationFrame;
        private _torus      : away.entities.Mesh;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            away.library.AssetLibrary.enableParser( away.parsers.AWDParser ) ;

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/awd/EnvMapTest.awd') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , away.utils.Delegate.create(this, this.onAssetComplete) );

            this._view = new away.containers.View(new away.render.DefaultRenderer());
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

            if ( this._torus )
            {

                this._torus.rotationY += 1;

            }

            this._view.render();
            this._view.camera.z = -2000;
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

                console.log(  asset.assetType );

                switch ( asset.assetType )
                {

                    case away.library.AssetType.SKYBOX:

                        var skybox : away.entities.Skybox= <away.entities.Skybox> asset;
                        this._view.scene.addChild( skybox );
                        break;

                    case away.library.AssetType.MESH:

                        var mesh : away.entities.Mesh = this._torus = <away.entities.Mesh> asset;
                        this._view.scene.addChild( mesh );

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