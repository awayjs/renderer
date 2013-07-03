///<reference path="../events/EventDispatcher.ts" />
///<reference path="URLRequest.ts" />


module away.net {


    export class URLLoader extends away.events.EventDispatcher {

        private _XHR            : XMLHttpRequest;

        private _bytesLoaded    : number = 0;
        private _bytesTotal     : number = 0;

        private _data           : any;
        private _dataFormat     : string = 'text';

        constructor(){

            super();
            this.initXHR();

        }

        // Public
        /**
         *
         * @param request
         */
        public load( request : away.net.URLRequest ) : void
        {


        }
        /**
         *
         */
        public close( ) : void
        {


        }

        // Private

        private initXHR()
        {

            this._XHR = new XMLHttpRequest();

            this._XHR.onloadstart = ( event ) => this.onLoadStart( event ); // loadstart	- When the request starts.
            this._XHR.onprogress = ( event ) => this.onProgress( event );	// progress	    - While loading and sending data.
            this._XHR.onabort = ( event ) => this.onAbort( event );	        // abort	    - When the request has been aborted, either by invoking the abort() method or navigating away from the page.
            this._XHR.onerror = ( event ) => this.onLoadError( event )      // error	    - When the request has failed.
            this._XHR.onload = ( event ) => this.onLoadComplete( event )    // load	        - When the request has successfully completed.
            this._XHR.ontimeout	= ( event ) => this.onTimeOut( event )      // timeout	    - When the author specified timeout has passed before the request could complete.
            this._XHR.onloadend	= ( event ) => this.onLoadEnd( event )      // loadend	    - When the request has completed, regardless of whether or not it was successful.

        }

        // XMLHttpRequest - Event Handlers

        /**
         *
         * @param event
         */
        private onLoadEnd( event )
        {


        }
        /**
         *
         * @param event
         */
        private onTimeOut( event )
        {


        }
        /**
         *
         * @param event
         */
        private onAbort( event )
        {



        }
        /**
         *
          * @param event
         */
        private onProgress( event )
        {



        }
        /**
         *
         * @param event
         */
        private onLoadStart( event )
        {



        }
        /**
         *
         * @param event
         */
        private onLoadComplete( event )
        {



        }
        /**
         *
         * @param event
         */
        private onLoadError( event )
        {



        }


    }


}