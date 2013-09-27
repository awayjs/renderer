///<reference path="../../_definitions.ts"/>
module away.net {


    export class URLVariables
    {

        private _variables : Object = new Object();

        /**
         *
         * @param source
         */
        constructor( source : string = null )
        {

            if ( source !== null )
            {

                this.decode( source );

            }


        }
        /**
         *
         * @param source
         */
        public decode( source : string ) : void
        {

            source = source.split("+").join(" ");

            var tokens, re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(source)) {

                this._variables[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);

            }

        }
        /**
         *
         * @returns {string}
         */
        public toString() : string
        {

            return '';
        }
        /**
         *
         * @returns {Object}
         */
        public get variables() : Object
        {

            return this._variables;

        }
        /**
         *
         * @returns {Object}
         */
        public get formData() : FormData
        {

            var fd : FormData = new FormData();

            for ( var s in this._variables )
            {

                fd.append( s , this._variables[s] );

            }

            return fd;


        }
        /**
         *
         * @returns {Object}
         */
        public set variables( obj : Object )
        {

            this._variables = obj;

        }


    }


}