///<reference path="../../../lib/Away3D.next.d.ts" />

module tests.textures
{
    export class BitmapTextureTest
    {

        private mipLoader       : away.net.IMGLoader;
        private bitmapData      : away.display.BitmapData;
        private target          : away.textures.BitmapTexture;
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

            var loader  : away.net.IMGLoader        = <away.net.IMGLoader > e.target;
            var rect    : away.geom.Rectangle       = new away.geom.Rectangle( 0 , 0 , this.mipLoader.width , this.mipLoader.height );

            console.log( 'away.events.Event.COMPLETE' , loader );

            this.bitmapData                         = new away.display.BitmapData( loader.width , loader.height );
            this.bitmapData.drawImage( this.mipLoader.image , rect ,  rect );

            this.target                             = new away.textures.BitmapTexture( this.bitmapData , true );//new away.textures.HTMLImageElementTexture( loader.image , false );

            away.Debug.log( 'away.display.BitmapData'           , this.bitmapData );
            away.Debug.log( 'away.textures.BitmapTexture'       , this.target );

        }

    }
}
