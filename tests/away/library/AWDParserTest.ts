///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.library {

    export class AWDParserTest //extends away.events.EventDispatcher
    {

        private _view    : away.containers.View3D;
        private token   : away.loaders.AssetLoaderToken;
        private _timer   : away.utils.RequestAnimationFrame;
        private _suzane : away.entities.Mesh;

        constructor()
        {



            away.Debug.LOG_PI_ERRORS = true;
            away.Debug.THROW_ERRORS = false;

            away.library.AssetLibrary.enableParser( away.loaders.AWDParser ) ;

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/suzanne.awd') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , this.onAssetComplete, this );

            this._view = new away.containers.View3D();
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

            if ( this._suzane )
            {

                this._suzane.rotationY += 1;

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

            var loader			: away.loaders.AssetLoader   	= <away.loaders.AssetLoader> e.target;
            var numAssets		: number 						= loader.baseDependency.assets.length;

            for( var i : number = 0; i < numAssets; ++i )
            {
                var asset: away.library.IAsset = loader.baseDependency.assets[ i ];

                switch ( asset.assetType )
                {
                    case away.library.AssetType.MESH:

                        var mesh : away.entities.Mesh = <away.entities.Mesh> asset;

                            mesh.scale( 600 );

                        this._suzane = mesh;

                        this._view.scene.addChild( mesh );
                        this._timer.start();

                        this.resize();

                        break;

                    case away.library.AssetType.GEOMETRY:
                        break;

                    case away.library.AssetType.MATERIAL:
                        break;

                }

            }


        }

    }

}