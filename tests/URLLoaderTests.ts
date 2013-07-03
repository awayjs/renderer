/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
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

    constructor()
    {

        //---------------------------------------------------
        // POST URL Variable ( test )
        this.urlLoaderPostURLVars               = new away.net.URLLoader();
        this.urlLoaderPostURLVars.dataFormat    = away.net.URLLoaderDataFormat.VARIABLES;

        var urlStr : string     = 'fname=karim&lname=' + Math.floor( Math.random() * 100 );
        var urlVars             = new away.net.URLVariables( urlStr );

        var req                 = new away.net.URLRequest( 'URLLoaderTestData/saveData.php' );
            req.method          = away.net.URLRequestMethod.POST;
            req.data            = urlVars;

        this.urlLoaderPostURLVars.addEventListener( away.events.Event.COMPLETE , this.postURLTestComplete , this );
        //this.urlLoaderPostURLVars.load( req );

        //---------------------------------------------------
        // GET CSV File

        var csrReq              = new away.net.URLRequest( 'URLLoaderTestData/airports.csv' );

        this.urlLoaderGetCSV                    = new away.net.URLLoader();
        this.urlLoaderGetCSV.dataFormat         = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderGetCSV.addEventListener( away.events.Event.COMPLETE , this.getCsvComplete , this );
        this.urlLoaderGetCSV.addEventListener( away.events.Event.OPEN, this.getCsvOpen , this );
        //this.urlLoaderGetCSV.load( csrReq );

        //---------------------------------------------------
        // ERROR test

        var errorReq              = new away.net.URLRequest( 'URLLoaderTestData/generatingError' );

        this.urlLoaderErrorTest                    = new away.net.URLLoader();
        this.urlLoaderErrorTest.dataFormat         = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderErrorTest.addEventListener( away.events.Event.COMPLETE , this.errorComplete , this );
        this.urlLoaderErrorTest.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.ioError, this );
        this.urlLoaderErrorTest.addEventListener( away.events.HTTPStatusEvent.HTTP_STATUS, this.httpStatusChange, this );
        //this.urlLoaderErrorTest.load( errorReq );

        //---------------------------------------------------
        // GET URL Vars

        var csrReq              = new away.net.URLRequest( 'URLLoaderTestData/getUrlVars.php' );

        this.urlLoaderGetURLVars                    = new away.net.URLLoader();
        this.urlLoaderGetURLVars.dataFormat         = away.net.URLLoaderDataFormat.VARIABLES;
        this.urlLoaderGetURLVars.addEventListener( away.events.Event.COMPLETE , this.getURLVarsComplete , this );
        this.urlLoaderGetURLVars.load( csrReq );

    }

    private getURLVarsComplete( event : away.events.Event ) : void {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'getURLVarsComplete' , loader.data );

    }

    private httpStatusChange( event : away.events.HTTPStatusEvent ) : void {

        console.log( 'httpStatusChange' , event.status );

    }

    private ioError( event ) : void {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'ioError' );

    }

    private errorComplete( event ) : void {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'errorComplete' );//, loader.data );

    }

    private postURLTestComplete( event ) : void {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'postURLTestComplete' , loader.data );

    }

    private getCsvComplete( event ) : void {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'getCsvComplete' );//, loader.data );

    }

    private getCsvOpen( event ) : void {

        var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
        console.log( 'getCsvOpen' );

    }

}

window.onload = function () {

    var test = new LoaderTest();

}

