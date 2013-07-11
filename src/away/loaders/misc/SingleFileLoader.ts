///<reference path="../../events/EventDispatcher.ts" />
///<reference path="../../events/Event.ts" />
///<reference path="../../events/IOErrorEvent.ts" />
///<reference path="../../events/HTTPStatusEvent.ts" />
///<reference path="../../events/ProgressEvent.ts" />
///<reference path="../../events/LoaderEvent.ts" />
///<reference path="../../net/URLRequest.ts" />
///<reference path="../../net/URLLoaderDataFormat.ts" />
///<reference path="../../net/URLRequestMethod.ts" />
///<reference path="../../net/URLRequest.ts" />
///<reference path="../../net/URLLoader.ts" />
///<reference path="../../loaders/parsers/ParserBase.ts" />
///<reference path="../../loaders/parsers/ParserDataFormat.ts" />
///<reference path="../../loaders/parsers/ImageParser.ts" />
///<reference path="ISingleFileTSLoader.ts" />
///<reference path="SingleFileImageLoader.ts" />
///<reference path="SingleFileURLLoader.ts" />


module away.loaders
{

	/**
	 * The SingleFileLoader is used to load a single file, as part of a resource.
	 *
	 * While SingleFileLoader can be used directly, e.g. to create a third-party asset 
	 * management system, it's recommended to use any of the classes Loader3D, AssetLoader
	 * and AssetLibrary instead in most cases.
	 *
	 * @see away3d.loading.Loader3D
	 * @see away3d.loading.AssetLoader
	 * @see away3d.loading.AssetLibrary
	 */
	export class SingleFileLoader extends away.events.EventDispatcher
	{
		private _parser         : away.loaders.ParserBase;
		private _req            : away.net.URLRequest;
		private _fileExtension  : string;
		private _fileName       : string;
		private _loadAsRawData  : boolean;
		private _materialMode   : number;
		private _data           : any;
        //private _loader         : ISingleFileTSLoader;

        // Static

		// Image parser only parser that is added by default, to save file size.
        //private static _parsers : Vector.<Class> = Vector.<Class>([ ImageParser ]);
        private static _parsers : any[] = new Array<any>( away.loaders.ImageParser );/* TODO: Add ImageParser as Default */

        public static enableParser(parser : Object ) : void
        {
            if (SingleFileLoader._parsers.indexOf(parser) < 0)
            {

                SingleFileLoader._parsers.push(parser);

            }

        }

        public static enableParsers(parsers : Object[] ) : void
        {
            var pc : Object;

            for( var c : number = 0 ; c < parsers.length ; c ++ )
            {
                SingleFileLoader.enableParser( parsers[ c ] );

            }

        }

        // Constructor

		/**
		 * Creates a new SingleFileLoader object.
		 */
		constructor(materialMode:number=0)
		{

            super();
			this._materialMode=materialMode;
		}

        // Get / Set
		
		public get url() : string
		{

			return this._req ? this._req.url : '';
		}
		
		public get data() : any
		{
			return this._data;
		}
		
		public get loadAsRawData() : boolean
		{
			return this._loadAsRawData;
		}

        // Public

		/**
		 * Load a resource from a file.
		 * 
		 * @param urlRequest The URLRequest object containing the URL of the object to be loaded.
		 * @param parser An optional parser object that will translate the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
		 */
		public load(urlRequest : away.net.URLRequest, parser : ParserBase = null, loadAsRawData : boolean = false) : void
		{
			//var urlLoader   : away.net.URLLoader;
			var dataFormat  : string;
            var loaderType  : string    = away.loaders.ParserLoaderType.URL_LOADER;// Default to URLLoader;

			this._loadAsRawData         = loadAsRawData;
			this._req                   = urlRequest;

			this.decomposeFilename( this._req.url );

			if ( this._loadAsRawData ) {

				// Always use binary for raw data loading
				dataFormat = away.net.URLLoaderDataFormat.BINARY;

			}
			else
            {

				if (parser)
                {

                    this._parser = parser;

                }
				
				if ( ! this._parser )
                {

                    this._parser = this.getParserFromSuffix();

                }

                console.log( 'SingleFileURLLoader.load._parser: ' + this._parser );

				if (this._parser)
                {

                    //--------------------------------------------
                    // Data Format

                    switch ( this._parser.dataFormat )
                    {

                        case away.loaders.ParserDataFormat.BINARY:

                            dataFormat = away.net.URLLoaderDataFormat.BINARY;

                            break;


                        case away.loaders.ParserDataFormat.PLAIN_TEXT:

                            dataFormat = away.net.URLLoaderDataFormat.TEXT;

                            break;

                    }

                    //--------------------------------------------
                    // Loader Type

                    switch ( this._parser.loaderType )
                    {

                        case away.loaders.ParserLoaderType.IMG_LOADER:

                            loaderType = away.loaders.ParserLoaderType.IMG_LOADER;

                            break;


                        case away.loaders.ParserLoaderType.URL_LOADER:

                            loaderType = away.loaders.ParserLoaderType.URL_LOADER;

                            break;

                    }
					
				}
                else
                {

					// Always use BINARY for unknown file formats. The thorough
					// file type check will determine format after load, and if
					// binary, a text load will have broken the file data.
					dataFormat = away.net.URLLoaderDataFormat.BINARY;

				}
			}

            console.log( 'SingleFileURLLoader.load.dataFormat:' , dataFormat , 'ParserFormat: ' , this._parser.dataFormat );
            console.log( 'SingleFileURLLoader.load.loaderType: ' , loaderType );

            var loader : away.loaders.ISingleFileTSLoader = this.getLoader( loaderType );
                loader.dataFormat = dataFormat;
                loader.addEventListener(away.events.Event.COMPLETE, this.handleUrlLoaderComplete , this );
                loader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.handleUrlLoaderError , this );
                loader.load( urlRequest );

		}
		
		/**
		 * Loads a resource from already loaded data.
		 * @param data The data to be parsed. Depending on the parser type, this can be a ByteArray, String or XML.
		 * @param uri The identifier (url or id) of the object to be loaded, mainly used for resource management.
		 * @param parser An optional parser object that will translate the data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
		 */
		public parseData(data : any, parser : away.loaders.ParserBase = null, req : away.net.URLRequest = null) : void
		{

            if ( data.constructor === Function ) // TODO: Validate
            {

                data = new data();

            }

			if (parser)
				this._parser = parser;
			
			this._req = req;
			
			this.parse(data);

		}
		
		/**
		 * A reference to the parser that will translate the loaded data into a usable resource.
		 */
		public get parser() : away.loaders.ParserBase
		{
			return this._parser;

		}
		
		/**
		 * A list of dependencies that need to be loaded and resolved for the loaded object.
		 */

		public get dependencies() : away.loaders.ResourceDependency[]
		{
			return this._parser? this._parser.dependencies : new Array<away.loaders.ResourceDependency>();
		}

        // Private

        /**
         *
         * @param loaderType
         */
        private getLoader( loaderType : string ) : away.loaders.ISingleFileTSLoader
        {

            var loader : ISingleFileTSLoader;

            switch ( loaderType )
            {

                case away.loaders.ParserLoaderType.IMG_LOADER :

                    loader = new away.loaders.SingleFileImageLoader();

                    break;

                case away.loaders.ParserLoaderType.URL_LOADER:

                    loader = new away.loaders.SingleFileURLLoader();

                    break;

            }

            return loader;

        }

		/**
		 * Splits a url string into base and extension.
		 * @param url The url to be decomposed.
		 */
		private decomposeFilename(url : string) : void
		{
			
			// Get rid of query string if any and extract suffix
			var base    : string    = (url.indexOf('?')>0)? url.split('?')[0] : url;
			var i       : number    = base.lastIndexOf('.');
			this._fileExtension     = base.substr(i + 1).toLowerCase();
			this._fileName          = base.substr(0, i);

		}
		
		/**
		 * Guesses the parser to be used based on the file extension.
		 * @return An instance of the guessed parser.
		 */
		private getParserFromSuffix() : ParserBase
		{
			var len : number = SingleFileLoader._parsers.length;

			// go in reverse order to allow application override of default parser added in Away3D proper
			for (var i : number = len-1; i >= 0; i--){

                var currentParser : away.loaders.ParserBase = SingleFileLoader._parsers[i];
                var supportstype : boolean                  = SingleFileLoader._parsers[i].supportsType(this._fileExtension);

                console.log( 'SingleFileURLLoader.getParserFromSuffix.supportstype' , supportstype );

                if (SingleFileLoader._parsers[i]['supportsType'](this._fileExtension)){

                    return new SingleFileLoader._parsers[i]();


                }

            }

			return null;

		}
		/**
		 * Guesses the parser to be used based on the file contents.
		 * @param data The data to be parsed.
		 * @param uri The url or id of the object to be parsed.
		 * @return An instance of the guessed parser.
		 */
		private getParserFromData(data : any) : away.loaders.ParserBase
		{
			var len : number = SingleFileLoader._parsers.length;
			
			// go in reverse order to allow application override of default parser added in Away3D proper
			for (var i : number = len-1; i >= 0; i--)
				if (SingleFileLoader._parsers[i].supportsData(data))
					return new SingleFileLoader._parsers[i]();
			
			return null;
		}
		
		/**
		 * Cleanups
		 */
		private removeListeners(urlLoader:away.loaders.ISingleFileTSLoader) : void
		{
			urlLoader.removeEventListener(away.events.Event.COMPLETE, this.handleUrlLoaderComplete , this );
			urlLoader.removeEventListener(away.events.IOErrorEvent.IO_ERROR, this.handleUrlLoaderError , this );
		}

        // Events
		
		/**
		 * Called when loading of a file has failed
		 */
		private handleUrlLoaderError(event:away.events.IOErrorEvent) : void
		{
			var urlLoader : away.loaders.ISingleFileTSLoader = <away.loaders.ISingleFileTSLoader> event.target;
			this.removeListeners(urlLoader);
			
			//if(this.hasEventListener(away.events.LoaderEvent.LOAD_ERROR , this.handleUrlLoaderError , this ))
				this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this._req.url, true ) ) ;//, event.text));
		}
		
		/**
		 * Called when loading of a file is complete
		 */
		private handleUrlLoaderComplete(event : away.events.Event) : void
		{

			var urlLoader : away.loaders.ISingleFileTSLoader = <away.loaders.ISingleFileTSLoader> event.target;
			this.removeListeners( urlLoader );
			
			this._data = urlLoader.data;

            console.log( 'SingleFileURLLoader.handleUrlLoaderComplete' , this._data.length );
			
			if (this._loadAsRawData)
            {

				// No need to parse this data, which should be returned as is
				this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE));

			}
			else
            {

				this.parse(this._data);

			}
		}
		
		/**
		 * Initiates parsing of the loaded data.
		 * @param data The data to be parsed.
		 */
		private parse(data : any) : void
		{

            console.log( 'SingleFileURLLoader.parse' , data );

			// If no parser has been defined, try to find one by letting
			// all plugged in parsers inspect the actual data.
			if ( ! this._parser )
            {

				this._parser = this.getParserFromData(data);

			}
			
			if( this._parser )
            {

				this._parser.addEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies , this);
                this._parser.addEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParseError, this);
                this._parser.addEventListener(away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                this._parser.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.ANIMATION_SET_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.ANIMATION_STATE_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.ANIMATION_NODE_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.STATE_TRANSITION_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.TEXTURE_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.CONTAINER_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.GEOMETRY_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.MATERIAL_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.MESH_COMPLETE,this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this);
                this._parser.addEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete, this);
				
				if (this._req && this._req.url)
                {

                    this._parser._iFileName = this._req.url;

                }

				this._parser.materialMode=this._materialMode;
                this._parser.parseAsync(data);

			}
            else
            {

				var msg:string = "No parser defined. To enable all parsers for auto-detection, use Parsers.enableAllBundled()";

				//if(hasEventListener(LoaderEvent.LOAD_ERROR)){
					this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, "", true, msg) );
				//} else{
				//	throw new Error(msg);
				//}
			}
		}
		
		private onParseError(event : away.events.ParserEvent) : void
		{
				this.dispatchEvent( event.clone() );
		}
		
		private onReadyForDependencies(event : away.events.ParserEvent) : void
		{
			this.dispatchEvent( event.clone() );
		}
		
		private onAssetComplete(event : away.events.AssetEvent) : void
		{
			this.dispatchEvent( event.clone() ) ;
		}

		private onTextureSizeError(event : away.events.AssetEvent) : void
		{
			this.dispatchEvent( event.clone() );
		}
		
		/**
		 * Called when parsing is complete.
		 */
		private onParseComplete(event : away.events.ParserEvent) : void
		{

			this.dispatchEvent( new away.events.LoaderEvent( away.events.LoaderEvent.DEPENDENCY_COMPLETE , this.url ) );//dispatch in front of removing listeners to allow any remaining asset events to propagate
			
			this._parser.removeEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies , this );
            this._parser.removeEventListener(away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete, this );
            this._parser.removeEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParseError, this );
            this._parser.removeEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this );
            this._parser.removeEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.ANIMATION_SET_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.ANIMATION_STATE_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.ANIMATION_NODE_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.STATE_TRANSITION_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.TEXTURE_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.CONTAINER_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.GEOMETRY_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.MATERIAL_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.MESH_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this );
            this._parser.removeEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete , this );

		}

	}

}
