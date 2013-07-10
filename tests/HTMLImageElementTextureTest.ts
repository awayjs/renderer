///<reference path="../src/away/textures/HTMLImageElementTexture.ts" />
///<reference path="../src/away/net/IMGLoader.ts" />
///<reference path="../src/away/materials/utils/MipmapGenerator.ts" />
///<reference path="../src/away/display3D/Texture.ts" />
///<reference path="../src/away/display3D/TextureBase.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/HTMLImageElementTextureTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/HTMLImageElementTextureTest.js
//------------------------------------------------------------------------------------------------

class HTMLImageElementTextureTest
{

    private mipLoader       : away.net.IMGLoader;
    private target          : away.textures.HTMLImageElementTexture;
    private texture         : away.display3D.Texture;

    constructor()
    {

        //---------------------------------------
        // Load a PNG

        var mipUrlRequest = new away.net.URLRequest( 'URLLoaderTestData/1024x1024.png');
        this.mipLoader  = new away.net.IMGLoader();
        this.mipLoader.load( mipUrlRequest );
        this.mipLoader.addEventListener( away.events.Event.COMPLETE , this.mipImgLoaded , this );

    }

    private mipImgLoaded( e )
    {

        var loader : away.net.IMGLoader             = <away.net.IMGLoader > e.target;

        this.texture = new away.display3D.Texture( loader.width , loader.height );
        this.target = new away.textures.HTMLImageElementTexture( loader.image , false );

        away.materials.MipmapGenerator.generateHTMLImageElementMipMaps( this.target.htmlImageElement , <away.display3D.TextureBase> this.texture );

    }

}

var test: HTMLImageElementTextureTest;
window.onload = function ()
{

     test = new HTMLImageElementTextureTest();


}
