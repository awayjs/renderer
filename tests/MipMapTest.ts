///<reference path="../src/away/display/BitmapData.ts" />
///<reference path="../src/away/net/IMGLoader.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/MipMapTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/MipMapTest.js
//------------------------------------------------------------------------------------------------

class BitmapDataTest
{

    private mipLoader       : away.net.IMGLoader;
    private mipBitmapSource : away.display.BitmapData;
    private mipBitmapTarget : away.display.BitmapData;

    constructor()
    {
        //---------------------------------------
        // Load a PNG

        var mipUrlRequest = new away.net.URLRequest( 'URLLoaderTestData/1024x1024.png');
        this.mipLoader  = new away.net.IMGLoader();
        this.mipLoader.load( mipUrlRequest );
        this.mipLoader.addEventListener( away.events.Event.COMPLETE , this.mipImgLoaded , this );

        document.onmousedown = ( e ) => this.onMouseDown( e );


    }

    private mipImgLoaded( e )
    {

        var loader : away.net.IMGLoader             = <away.net.IMGLoader > e.target;

        this.mipBitmapSource                        = new away.display.BitmapData( 1024 , 1024 , true , 0xff0000 );
        this.mipBitmapSource.copyImage( loader.image , this.mipBitmapSource.rect , this.mipBitmapSource.rect );
        this.mipBitmapSource.canvas.style.position  = 'absolute';
        this.mipBitmapSource.canvas.style.left      = '0px';
        this.mipBitmapSource.canvas.style.top       = '1030px';

        document.body.appendChild( this.mipBitmapSource.canvas );

        this.mipBitmapTarget = new away.display.BitmapData( 1024 , 1024 , true , 0xff0000 );
        this.mipBitmapTarget.canvas.style.position  = 'absolute';
        this.mipBitmapTarget.canvas.style.left      = '0px';
        this.mipBitmapTarget.canvas.style.top       = '0px';

        document.body.appendChild( this.mipBitmapTarget.canvas );

        this._rect.width    = this.mipBitmapSource.width;
        this._rect.height   = this.mipBitmapSource.height;

        this.w = this.mipBitmapSource.width;
        this.h = this.mipBitmapSource.height;

    }

    private onMouseDown( e )
    {

        this.generateMipMap( this.mipBitmapSource ,  this.mipBitmapTarget );

    }


    private _rect : away.geom.Rectangle = new away.geom.Rectangle();
    private _matrix : away.geom.Matrix = new away.geom.Matrix();
    private w : number;
    private h : number;

    public generateMipMap( source : away.display.BitmapData , mipmap : away.display.BitmapData = null, alpha:boolean = false, side:number = -1)
    {

        var i:number;

        var regen:boolean = mipmap != null;



        if ( (this.w >= 1 ) || (this.h >= 1) )
        {

            console.log ( 'generateMipMap: ' + this.w , this.h );

            if (alpha){

                mipmap.fillRect(this._rect, 0);

            }

            this._matrix.a = this._rect.width / source.width;
            this._matrix.d = this._rect.height / source.height;

            mipmap.width = this.w;
            mipmap.height= this.h;

            mipmap.copyPixels( source , source.rect , new away.geom.Rectangle( 0 , 0 , this.w , this.h ) );

            this.w >>= 1;
            this.h >>= 1;

            this._rect.width = this.w > 1? this.w : 1;
            this._rect.height = this.h > 1? this.h : 1;
        }

        if ( ! regen )
        {

            mipmap.dispose();

        }
    }

}

window.onload = function ()
{

    var test = new BitmapDataTest();


}

