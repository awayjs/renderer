///<reference path="../src/away/display/BitmapData.ts" />
///<reference path="../src/away/net/IMGLoader.ts" />


//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/BitmapDataTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/BitmapDataTest.js
//------------------------------------------------------------------------------------------------

class BitmapDataTest
{

    private bitmapData  : away.display.BitmapData;

    private bitmapDataB  : away.display.BitmapData;

    private imgLoader   : away.net.IMGLoader;
    private urlRequest  : away.net.URLRequest;

    constructor()
    {

        this.urlRequest = new away.net.URLRequest( 'URLLoaderTestData/256x256.png');
        this.imgLoader  = new away.net.IMGLoader();
        this.imgLoader.load( this.urlRequest );
        this.imgLoader.addEventListener( away.events.Event.COMPLETE , this.imgLoaded , this );
        this.imgLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.imgLoadedError , this );

        this.bitmapData = new away.display.BitmapData( 256 ,  256 , true );
        document.body.appendChild( this.bitmapData.canvas );

        this.bitmapDataB = new away.display.BitmapData( 256 ,  256 , true , 0x0000ff );

        this.bitmapDataB.canvas.style.position = 'absolute';
        this.bitmapDataB.canvas.style.left = '540px';
        document.body.appendChild( this.bitmapDataB.canvas );

        document.onmousedown = ( e ) => this.onMouseDown( e );
    }

    private onMouseDown( e )
    {

        if ( this.bitmapData.width === 512 )
        {

            if ( this.imgLoader.loaded )
            {

                this.bitmapData.width  = 256;
                this.bitmapData.height = 256;
                var r : away.geom.Rectangle = new away.geom.Rectangle( 0 , 0 , this.imgLoader.width , this.imgLoader.height );
                this.bitmapData.copyImage( this.imgLoader.image , r ,  r );

                var rb : away.geom.Rectangle = this.bitmapData.rect.clone();
                    rb.width = rb.width * 2;
                    rb.height = rb.height * 2;

                this.bitmapDataB.copyPixels( this.bitmapData , this.bitmapData.rect , rb );

            }
            else
            {

                this.bitmapData.width  = 256;
                this.bitmapData.height = 256;
                this.bitmapData.fillRect( this.bitmapData.rect , 0xff0000 );
            }

        }
        else
        {

            this.bitmapData.width  = 512;
            this.bitmapData.height = 512;
            this.bitmapData.fillRect( this.bitmapData.rect , 0x00ff00 );

            this.bitmapDataB.copyPixels( this.bitmapData , this.bitmapDataB.rect , this.bitmapDataB.rect );

        }


    }

    private imgLoadedError( e : away.events.IOErrorEvent )
    {

        console.log( 'error');

    }

    private imgLoaded( e : away.events.Event )
    {

        this.bitmapData.copyImage( this.imgLoader.image , new away.geom.Rectangle( 0 , 0 , this.imgLoader.width , this.imgLoader.height ) ,new away.geom.Rectangle( 0 , 0 , this.imgLoader.width  / 2, this.imgLoader.height / 2 ));

    }

}

window.onload = function ()
{

    var test = new BitmapDataTest();


}

