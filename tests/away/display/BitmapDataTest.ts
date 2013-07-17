///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/display/BitmapDataTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/display/BitmapDataTest.js
//------------------------------------------------------------------------------------------------

class BitmapDataTest
{

    private bitmapData  : away.display.BitmapData;
    private bitmapDataB : away.display.BitmapData;
    private imgLoader   : away.net.IMGLoader;
    private urlRequest  : away.net.URLRequest;

    constructor()
    {

        //---------------------------------------
        // Load a PNG

        this.urlRequest = new away.net.URLRequest( '../../assets/256x256.png');
        this.imgLoader  = new away.net.IMGLoader();
        this.imgLoader.load( this.urlRequest );
        this.imgLoader.addEventListener( away.events.Event.COMPLETE , this.imgLoaded , this );
        this.imgLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.imgLoadedError , this );

        //---------------------------------------
        // BitmapData Object - 1
        this.bitmapData = new away.display.BitmapData( 256 ,  256 , true );
        document.body.appendChild( this.bitmapData.canvas );

        //---------------------------------------
        // BitmapData Object - 2
        this.bitmapDataB = new away.display.BitmapData( 256 ,  256 , true , 0x0000ff );
        this.bitmapDataB.canvas.style.position = 'absolute';
        this.bitmapDataB.canvas.style.left = '540px';
        document.body.appendChild( this.bitmapDataB.canvas );

        //---------------------------------------
        // BitmapData - setPixel test
        console['time']("bitmapdata"); // start setPixel operation benchmark ( TypeScript does not support console.time - so hacking it in ) .

        this.bitmapDataB.lock();

        for (var i = 0; i < 10000; i++) {
            var x = Math.random() * this.bitmapDataB.width | 0; // |0 to truncate to Int32
            var y = Math.random() * this.bitmapDataB.height | 0;
            var r = Math.random() * 256 | 0;
            var g = Math.random() * 256 | 0;
            var b = Math.random() * 256 | 0;
            this.bitmapDataB.setPixel(x, y, r, g, b, 255); // 255 opaque
        }

        this.bitmapDataB.unlock();
        console['timeEnd']("bitmapdata"); // benchmark the setPixel operation

        document.onmousedown = ( e ) => this.onMouseDown( e );

    }

    private onMouseDown( e )
    {

        if ( this.bitmapData.width === 512 ) // Test to toggle resize of bitmapData
        {

            if ( this.imgLoader.loaded ) // If image is loaded copy that to the BitmapData object
            {

                this.bitmapDataB.lock(); // Lock bitmap - speeds up setPixelOperations

                //---------------------------------------
                // Resize BitmapData
                this.bitmapData.width  = 256;
                this.bitmapData.height = 256;

                //---------------------------------------
                // copy loaded image to first BitmapData

                var rect : away.geom.Rectangle = new away.geom.Rectangle( 0 , 0 , this.imgLoader.width , this.imgLoader.height );
                this.bitmapData.copyImage( this.imgLoader.image , rect ,  rect );

                //---------------------------------------
                // copy image into second bitmap data ( and scale it up 2X )
                rect.width = rect.width * 2;
                rect.height = rect.height * 2;

                this.bitmapDataB.copyPixels( this.bitmapData , this.bitmapData.rect , rect );

                //---------------------------------------
                // draw random pixels

                for (var d = 0; d < 1000; d++) {
                    var x = Math.random() * this.bitmapDataB.width | 0; // |0 to truncate to Int32
                    var y = Math.random() * this.bitmapDataB.height | 0;
                    var r = Math.random() * 256 | 0;
                    var g = Math.random() * 256 | 0;
                    var b = Math.random() * 256 | 0;
                    this.bitmapDataB.setPixel(x, y, r, g, b, 255); // 255 opaque
                }

                this.bitmapDataB.unlock(); // Unlock bitmapdata

            }
            else
            {

                //---------------------------------------
                // image is not loaded - fill bitmapdata with red
                this.bitmapData.width  = 256;
                this.bitmapData.height = 256;
                this.bitmapData.fillRect( this.bitmapData.rect , 0xff0000 );
            }

        }
        else
        {

            //---------------------------------------
            // resize bitmapdata;

            this.bitmapData.lock();

            this.bitmapData.width  = 512;
            this.bitmapData.height = 512;
            this.bitmapData.fillRect( this.bitmapData.rect , 0x00ff00 ); // fill it green

            for (var d = 0; d < 1000; d++) {
                var x = Math.random() * this.bitmapData.width | 0; // |0 to truncate to Int32
                var y = Math.random() * this.bitmapData.height | 0;
                var r = Math.random() * 256 | 0;
                var g = Math.random() * 256 | 0;
                var b = Math.random() * 256 | 0;
                this.bitmapData.setPixel(x, y, r, g, b, 255); // 255 opaque
            }

            this.bitmapData.unlock();
            //---------------------------------------
            // copy bitmapdata

            var targetRect          = this.bitmapDataB.rect.clone();
                targetRect.width    = targetRect.width / 2;
                targetRect.height   = targetRect.height / 2;

            this.bitmapDataB.copyPixels( this.bitmapData , this.bitmapDataB.rect ,  targetRect ); // copy first bitmapdata object into the second one

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

var GL = null;//: WebGLRenderingContext;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");
    var test = new BitmapDataTest();

}


