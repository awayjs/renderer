///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/library/AssetLibraryTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/library/AssetLibraryTest.js
//------------------------------------------------------------------------------------------------

module demos.materials
{

    export class CubeTextureDemo//extends away.events.EventDispatcher
    {

        private token   : away.loaders.AssetLoaderToken;
        private view    : away.containers.View3D;

        constructor()
        {

            this.view = new away.containers.View3D();
            away.library.AssetLibrary.enableParser( away.loaders.CubeTextureParser );

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/CubeTextureTest.cube') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , this.onResourceComplete , this );

            window.onresize         = () => this.resize();
            document.onmousedown    = () => this.mouseDown();

        }

        private mouseDown()
        {
        }

        private render()
        {
            this.view.render();
        }

        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader			: away.loaders.AssetLoader   	            = <away.loaders.AssetLoader> e.target;
            var cubeTexture     : away.textures.HTMLImageElementCubeTexture = <away.textures.HTMLImageElementCubeTexture> loader.baseDependency.assets[ 0 ];

            console.log( 'onResourceComplete' , loader , cubeTexture );

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
