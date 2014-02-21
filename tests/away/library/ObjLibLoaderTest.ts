///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.library {

    export class ObjLibLoaderTest //extends away.events.EventDispatcher
    {

        private height : number = 0;

        private token   : away.net.AssetLoaderToken;
        private view    : away.containers.View;
        private raf     : away.utils.RequestAnimationFrame;
        private mesh    : away.entities.Mesh;

        constructor()
        {

            away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;


            this.view                  = new away.containers.View(new away.render.DefaultRenderer());
            this.raf                    = new away.utils.RequestAnimationFrame( this.render , this );

            away.library.AssetLibrary.enableParser( away.parsers.OBJParser ) ;

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/t800.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE , away.utils.Delegate.create(this, this.onAssetComplete) );

        }

        private render()
        {

            console.log( 'render');
            //*
            if( this.mesh )
            {
                this.mesh.rotationY += 1;
            }

            this.view.render();
            //*/
        }

        public onAssetComplete ( e : away.events.AssetEvent )
        {

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.AssetEvent.ASSET_COMPLETE' , e.asset.name , away.library.AssetLibrary.getAsset(e.asset.name) );
            console.log( '------------------------------------------------------------------------------');



            /*
            this.mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset(e.asset.name);

            this.view.scene.addChild( this.mesh );

            //this.render();

            document.onmousedown = () => this.render();
              */
            //this.raf.start();

            /*
            var htmlImageElementTexture : away.textures.HTMLImageElementTexture = <away.textures.HTMLImageElementTexture> away.library.AssetLibrary.getAsset(e.asset.name);

            document.body.appendChild( htmlImageElementTexture.htmlImageElement );

            htmlImageElementTexture.htmlImageElement.style.position = 'absolute';
            htmlImageElementTexture.htmlImageElement.style.top = this.height + 'px';


            this.height += ( htmlImageElementTexture.htmlImageElement.height + 10 ) ;
            */

        }
        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader : away.net.AssetLoader = <away.net.AssetLoader> e.target;

            console.log( '------------------------------------------------------------------------------');
            console.log( 'away.events.LoaderEvent.RESOURCE_COMPLETE' , e  );
            console.log( '------------------------------------------------------------------------------');

            console.log( away.library.AssetLibrary.getAsset( 'Mesh_g0' ) ) ;

            this.mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset( 'Mesh_g0' );
            this.mesh.y = -200;
            this.mesh.transform.scale = new away.geom.Vector3D( 4, 4, 4 );

            this.view.scene.addChild( this.mesh );

            document.onmousedown = () => this.render();
            window.onresize = () => this.resize();


            this.raf.start();

            this.resize();

        }

        public resize()
        {
            this.view.y         = 0;
            this.view.x         = 0;

            this.view.width     = window.innerWidth;
            this.view.height    = window.innerHeight;


        }

    }

}
