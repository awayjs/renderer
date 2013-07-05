///<reference path="../src/away/utils/Timer.ts" />
///<reference path="../src/away/utils/getTimer.ts" />
///<reference path="../src/away/events/TimerEvent.ts" />
///<reference path="../src/away/events/Event.ts" />
///<reference path="../src/away/events/IOErrorEvent.ts" />
///<reference path="../src/away/net/IMGLoader.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/IMGLoaderTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/IMGLoaderTest.js
//------------------------------------------------------------------------------------------------

class IMGLoaderTest
{

    private pngLoader       : away.net.IMGLoader;
    private jpgLoader       : away.net.IMGLoader;
    private noAnImageLoader : away.net.IMGLoader;
    private wrongURLLoader  : away.net.IMGLoader;

    constructor()
    {

        //-----------------------------------------------------------------------------------------------
        // load a png
        //-----------------------------------------------------------------------------------------------

        var pngURLrq            = new away.net.URLRequest( 'URLLoaderTestData/2.png');

        this.pngLoader          = new away.net.IMGLoader();
        this.pngLoader.addEventListener( away.events.Event.COMPLETE , this.pngLoaderComplete , this );
        this.pngLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR , this.ioError , this );
        this.pngLoader.load( pngURLrq );

        //-----------------------------------------------------------------------------------------------
        // Load a jpg
        //-----------------------------------------------------------------------------------------------

        var jpgURLrq            = new away.net.URLRequest( 'URLLoaderTestData/1.jpg');

        this.jpgLoader          = new away.net.IMGLoader();
        this.jpgLoader.addEventListener( away.events.Event.COMPLETE , this.jpgLoaderComplete , this );
        this.jpgLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR , this.ioError , this );
        this.jpgLoader.load( jpgURLrq );

        //-----------------------------------------------------------------------------------------------
        // Load file of wrong format
        //-----------------------------------------------------------------------------------------------

        var notURLrq            = new away.net.URLRequest( 'URLLoaderTestData/data.txt');

        this.noAnImageLoader    = new away.net.IMGLoader();
        this.noAnImageLoader.addEventListener( away.events.Event.COMPLETE , this.noAnImageLoaderComplete , this );
        this.noAnImageLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR , this.ioError , this );
        this.noAnImageLoader.load( notURLrq )

        //-----------------------------------------------------------------------------------------------
        // Load image that does not exist
        //-----------------------------------------------------------------------------------------------

        var wrongURLrq            = new away.net.URLRequest( 'URLLoaderTestData/iDontExist.png');

        this.wrongURLLoader     = new away.net.IMGLoader();
        this.wrongURLLoader.addEventListener( away.events.Event.COMPLETE , this.wrongURLLoaderComplete , this );
        this.wrongURLLoader.addEventListener( away.events.IOErrorEvent.IO_ERROR , this.ioError , this );
        this.wrongURLLoader.load( wrongURLrq );
    }

    private pngLoaderComplete ( e : away.events.Event ) : void
    {

        this.logSuccessfullLoad( e );

        var div = document.getElementById( 'pngContainer' );
        var imgLoader : away.net.IMGLoader = <away.net.IMGLoader> e.target;
        div.appendChild( imgLoader.image );

    }

    private jpgLoaderComplete ( e : away.events.Event ) : void
    {

        this.logSuccessfullLoad( e );

        var div = document.getElementById( 'jpgContainer' );
        var imgLoader : away.net.IMGLoader = <away.net.IMGLoader> e.target;
        div.appendChild( imgLoader.image );

    }

    private noAnImageLoaderComplete ( e : away.events.Event ) : void
    {

        this.logSuccessfullLoad( e );

    }

    private wrongURLLoaderComplete ( e : away.events.Event ) : void
    {

        this.logSuccessfullLoad( e );

    }

    private logSuccessfullLoad( e : away.events.Event) : void
    {

        var imgLoader : away.net.IMGLoader = <away.net.IMGLoader> e.target;
        console.log( 'IMG.Event.Complete' , imgLoader.request.url );

    }

    private ioError ( e : away.events.IOErrorEvent ) : void
    {

        var imgLoader : away.net.IMGLoader = <away.net.IMGLoader> e.target;
        console.log( 'ioError' , imgLoader.request.url );

    }

    private abortError ( e : away.events.Event ) : void
    {

        var imgLoader : away.net.IMGLoader = <away.net.IMGLoader> e.target;
        console.log( 'abortError' , imgLoader.request.url );

    }


}

window.onload = function ()
{

    var test = new IMGLoaderTest();


}

