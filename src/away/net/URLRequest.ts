///<reference path="URLRequestMethod.ts" />
///<reference path="URLVariables.ts" />
module away.net {

    /**
     *
     */
    export class URLRequest
    {

        //public authenticate     : boolean = false;
        //public cacheResponse    : boolean = true;
        //public idleTimeout      : number;
        //public requestHeader    : Array;
        //public userAgent        : string;

        /*
         * The MIME content type of the content in the the data property.
         * @type {string}
         */
        //public contentType      : string = 'application/x-www-form-urlencoded'; //Note: Not used for now.

        /**
         * Object containing data to be transmited with URL Request ( URL Variables / binary / string )
         *
         */
        public data             : any;

        /**
         *
         * away.net.URLRequestMethod.GET
         * away.net.URLRequestMethod.POST
         *
         * @type {string}
         */
        public method           : string = away.net.URLRequestMethod.GET;

        /**
         * Use asynchronous XMLHttpRequest
         * @type {boolean}
         */
        public async            : boolean = true;

        /**
         *
         */
        private _url            : string;

        /**

         * @param url
         */
        constructor( url : string = null )
        {

            this._url = url;

        }

        /**
         *
         * @returns {string}
         */
        public get url() : string
        {

            return this._url;

        }

        /**
         *
         * @param value
         */
        public set url( value : string )
        {

            this._url = value;

        }
    }
}