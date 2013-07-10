///<reference path="../../net/URLRequest.ts" />
///<reference path="../../net/IMGLoader.ts" />
///<reference path="../../events/EventDispatcher.ts" />
///<reference path="ISingleFileTSLoader.ts" />
///<reference path="../../events/Event.ts" />
///<reference path="../../events/IOErrorEvent.ts" />
///<reference path="../../events/Event.ts" />

module away.loaders
{

    export class SingleFileImageLoader extends away.events.EventDispatcher implements away.loaders.ISingleFileTSLoader
    {

        private _loader         : away.net.IMGLoader;
        private _data           : any;
        private _dataFormat     : string ; // Not used in this implementation

        constructor ()
        {

            super();
            this.initLoader();

        }

        // Public

        /**
         *
         * @param req
         */
        public load( req : away.net.URLRequest )
        {

            this._loader.load( req );

        }

        /**
         *
         */
        public dispose() : void
        {

            this.disposeLoader();
            this._data = null;


        }

        // Get / Set

        /**
         *
         * @returns {*}
         */
        public get data() : HTMLImageElement
        {

            return this._loader.image;

        }
        /**
         *
         * @returns {*}
         */
        public get dataFormat() : string
        {

            return this._dataFormat;

        }
        public set dataFormat( value : string )
        {

            this._dataFormat = value;

        }

        // Private

        /**
         *
         */
        private initLoader() : void
        {


            if ( ! this._loader )
            {

                this._loader = new away.net.IMGLoader();
                this._loader.addEventListener( away.events.Event.COMPLETE , this.onLoadComplete , this );
                this._loader.addEventListener( away.events.IOErrorEvent.IO_ERROR, this.onLoadError , this );

            }

        }

        /**
         *
         */
        private disposeLoader() : void
        {

            if ( this._loader )
            {

                this._loader.dispose();
                this._loader.removeEventListener( away.events.Event.COMPLETE , this.onLoadComplete , this );
                this._loader.removeEventListener( away.events.IOErrorEvent.IO_ERROR, this.onLoadError , this );
                this._loader = null

            }

        }

        // Events

        /**
         *
         * @param event
         */
        private onLoadComplete( event : away.events.Event ) : void
        {

            this.dispatchEvent( event );

        }

        /**
         *
         * @param event
         */
        private onLoadError( event : away.events.IOErrorEvent ) : void
        {

            this.dispatchEvent( event );

        }

    }

}