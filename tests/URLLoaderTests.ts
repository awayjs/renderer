/**
 * ...
 * @author Gary Paluk - http://www.plugin.io / Karim Beyrouti - http://kurst.co.uk
 */

///<reference path="../src/away/events/Event.ts" />
///<reference path="../src/away/events/IOErrorEvent.ts" />
///<reference path="../src/away/events/HTTPStatusEvent.ts" />
///<reference path="../src/away/net/URLLoader.ts" />
///<reference path="../src/away/net/URLRequest.ts" />
///<reference path="../src/away/net/URLVariables.ts" />
///<reference path="../src/away/net/URLRequestMethod.ts" />

class LoaderTest //extends away.events.EventDispatcher
{

    private urlLoaderPostURLVars        : away.net.URLLoader;
    private urlLoaderGetCSV             : away.net.URLLoader;
    private urlLoaderErrorTest          : away.net.URLLoader;
    private urlLoaderGetURLVars         : away.net.URLLoader;
    private urlLoaderBinary            : away.net.URLLoader;

    constructor()
    {

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // POST URL Variables to PHP script
        //---------------------------------------------------------------------------------------------------------------------------------------------------------

        this.urlLoaderPostURLVars               = new away.net.URLLoader();
        this.urlLoaderPostURLVars.dataFormat    = away.net.URLLoaderDataFormat.VARIABLES;

        var urlStr : string     = 'fname=karim&lname=' + Math.floor( Math.random() * 100 );
        var urlVars             = new away.net.URLVariables( urlStr );

        var req                 = new away.net.URLRequest( 'URLLoaderTestData/saveData.php' );
            req.method          = away.net.URLRequestMethod.POST;
            req.data            = urlVars;

        this.urlLoaderPostURLVars.addEventListener( away.events.Event.COMPLETE , this.postURLTestComplete , this );
        this.urlLoaderPostURLVars.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.ioError, this );
        this.urlLoaderPostURLVars.load( req );

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // GET CSV File
        //---------------------------------------------------------------------------------------------------------------------------------------------------------

        var csrReq = new away.net.URLRequest( 'URLLoaderTestData/airports.csv' );

        this.urlLoaderGetCSV                    = new away.net.URLLoader();
        this.urlLoaderGetCSV.dataFormat         = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderGetCSV.addEventListener( away.events.Event.COMPLETE , this.getCsvComplete , this );
        this.urlLoaderGetCSV.addEventListener( away.events.Event.OPEN, this.getCsvOpen , this );
        this.urlLoaderGetCSV.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.ioError, this );
        this.urlLoaderGetCSV.load( csrReq );

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // ERROR test - load a non-existing object
        //---------------------------------------------------------------------------------------------------------------------------------------------------------

        var errorReq = new away.net.URLRequest( 'URLLoaderTestData/generatingError' );

        this.urlLoaderErrorTest                    = new away.net.URLLoader();
        this.urlLoaderErrorTest.dataFormat         = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderErrorTest.addEventListener( away.events.Event.COMPLETE , this.errorComplete , this );
        this.urlLoaderErrorTest.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.ioError, this );
        this.urlLoaderErrorTest.addEventListener( away.events.HTTPStatusEvent.HTTP_STATUS, this.httpStatusChange, this );
        this.urlLoaderErrorTest.load( errorReq );

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // GET URL Vars - get URL variables
        //---------------------------------------------------------------------------------------------------------------------------------------------------------

        var csrReq = new away.net.URLRequest( 'URLLoaderTestData/getUrlVars.php' );

        this.urlLoaderGetURLVars                    = new away.net.URLLoader();
        this.urlLoaderGetURLVars.dataFormat         = away.net.URLLoaderDataFormat.VARIABLES;
        this.urlLoaderGetURLVars.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.ioError, this );
        this.urlLoaderGetURLVars.addEventListener( away.events.Event.COMPLETE , this.getURLVarsComplete , this );
        this.urlLoaderGetURLVars.load( csrReq );

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // LOAD Binary file
        //---------------------------------------------------------------------------------------------------------------------------------------------------------

        var binReq = new away.net.URLRequest( 'URLLoaderTestData/suzanne.awd' );

        this.urlLoaderBinary                    = new away.net.URLLoader(  );
        this.urlLoaderBinary.dataFormat         = away.net.URLLoaderDataFormat.BINARY;
        this.urlLoaderBinary.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.ioError, this );
        this.urlLoaderBinary.addEventListener( away.events.Event.COMPLETE , this.binFileLoaded , this );
        this.urlLoaderBinary.load( binReq );

    }

    private binFileLoaded( event : away.events.Event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.binFileLoaded' , loader.data.length );

    }

    private getURLVarsComplete( event : away.events.Event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.getURLVarsComplete' , loader.data );


    }

    private httpStatusChange( event : away.events.HTTPStatusEvent ) : void
    {

        console.log( 'LoaderTest.httpStatusChange' , event.status );

    }

    private ioError( event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.ioError' , loader.request.url );

    }

    private errorComplete( event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.errorComplete' );//, loader.data );

    }

    private postURLTestComplete( event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.postURLTestComplete' , loader.data );

    }

    private getCsvComplete( event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.getCsvComplete' );//, loader.data );

    }

    private getCsvOpen( event ) : void
    {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'LoaderTest.getCsvOpen' );

    }

}

window.onload = function ()
{

    var test = new LoaderTest();

}

