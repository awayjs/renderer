///<reference path="URLRequestMethod.ts" />
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

        public contentType      : string = 'application/x-www-form-urlencoded'; //The MIME content type of the content in the the data property.
        public data             : Object;                                       // Object containing data to be transmited with URL Request ( URL Variables / binary / string )
        public method           : string = away.net.URLRequestMethod.GET;
        private _url            : string;

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