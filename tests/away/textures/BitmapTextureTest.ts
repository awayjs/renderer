///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/textures/BitmapTextureTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/textures/BitmapTextureTest.js
//------------------------------------------------------------------------------------------------

class BitmapTextureTest
{

    private mipLoader       : away.net.IMGLoader;
    private bitmapData      : away.display.BitmapData;
    private target          : away.textures.BitmapTexture;
    private texture         : away.display3D.Texture;

    constructor()
    {

        //---------------------------------------
        // Load a PNG

        var mipUrlRequest = new away.net.URLRequest( '../../assets/1024x1024.png');
        this.mipLoader  = new away.net.IMGLoader();
        this.mipLoader.load( mipUrlRequest );
        this.mipLoader.addEventListener( away.events.Event.COMPLETE , this.mipImgLoaded , this );

    }

    private mipImgLoaded( e )
    {

        var loader : away.net.IMGLoader     = <away.net.IMGLoader > e.target;
        var rect : away.geom.Rectangle      = new away.geom.Rectangle( 0 , 0 , this.mipLoader.width , this.mipLoader.height );

        this.bitmapData                     = new away.display.BitmapData( loader.width , loader.height );
        this.bitmapData.copyImage( this.mipLoader.image , rect ,  rect );

        this.texture        = new away.display3D.Texture( loader.width , loader.height );
        this.target         = new away.textures.BitmapTexture( this.bitmapData , true );//new away.textures.HTMLImageElementTexture( loader.image , false );

        away.Debug.log( 'bitmapData' , this.bitmapData );
        away.Debug.log( 'texture'    , this.texture );
        away.Debug.log( 'target'     , this.target );

    }

}

var GL = null;//: WebGLRenderingContext;
var test: BitmapTextureTest;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");
     test = new BitmapTextureTest();


}
