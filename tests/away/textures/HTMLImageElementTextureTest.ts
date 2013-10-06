///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.textures
{

    export class HTMLImageElementTextureTest
    {

        private mipLoader       : away.net.IMGLoader;
        private target          : away.textures.HTMLImageElementTexture;
        private texture         : away.display3D.Texture;

        constructor()
        {

            //---------------------------------------
            // Load a PNG

            var mipUrlRequest = new away.net.URLRequest( 'assets/1024x1024.png');
            this.mipLoader  = new away.net.IMGLoader();
            this.mipLoader.load( mipUrlRequest );
            this.mipLoader.addEventListener( away.events.Event.COMPLETE , this.mipImgLoaded , this );

        }

        private mipImgLoaded( e )
        {

            var stage       : away.display.Stage        = new away.display.Stage();
            var stage3D     : away.display.Stage3D      = stage.getStage3DAt( 0 );
            var context3D   : away.display3D.Context3D  = new away.display3D.Context3D( stage3D.canvas );
            var loader      : away.net.IMGLoader        = <away.net.IMGLoader > e.target;

            console.log( 'away.events.Event.COMPLETE' , loader );

            this.texture    = new away.display3D.Texture( context3D._gl , loader.width , loader.height );
            this.target     = new away.textures.HTMLImageElementTexture( loader.image , false );

            console.log( 'away.display3D.Texture - Created' , this.texture );
            console.log( 'away.textures.HTMLImageElementTexture - Created' , this.target );

            away.materials.MipmapGenerator.generateHTMLImageElementMipMaps( this.target.htmlImageElement , <away.display3D.TextureBase> this.texture );

        }

    }

}
