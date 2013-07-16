

///<reference path="../_definitions.ts"/>

module away.loaders
{
	//import away3d.*;
	//import away3d.events.*;
	//import away3d.loaders.misc.*;
	//import away3d.loaders.parsers.*;
	
	//import flash.events.*;
	//import flash.net.*;
	
	//use namespace arcane;
	
	/**
	 * Dispatched when any asset finishes parsing. Also see specific events for each
	 * individual asset type (meshes, materials et c.)
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="assetComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when a full resource (including dependencies) finishes loading.
	 *
	 * @eventType away3d.events.LoaderEvent
	 */
	//[Event(name="resourceComplete", type="away3d.events.LoaderEvent")]
	
	
	/**
	 * Dispatched when a single dependency (which may be the main file of a resource)
	 * finishes loading.
	 *
	 * @eventType away3d.events.LoaderEvent
	 */
	//[Event(name="dependencyComplete", type="away3d.events.LoaderEvent")]
	
	
	/**
	 * Dispatched when an error occurs during loading. I
	 *
	 * @eventType away3d.events.LoaderEvent
	 */
	//[Event(name="loadError", type="away3d.events.LoaderEvent")]
	
	
	/**
	 * Dispatched when an error occurs during parsing.
	 *
	 * @eventType away3d.events.ParserEvent
	 */
	//[Event(name="parseError", type="away3d.events.ParserEvent")]
	
	
	/**
	 * Dispatched when a skybox asset has been costructed from a ressource.
	 * 
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="skyboxComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a camera3d asset has been costructed from a ressource.
	 * 
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="cameraComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a mesh asset has been costructed from a ressource.
	 * 
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="meshComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a geometry asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="geometryComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a skeleton asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="skeletonComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a skeleton pose asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="skeletonPoseComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a container asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="containerComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a texture asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="textureComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when a texture projector asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="textureProjectorComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when a material asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="materialComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when a animator asset has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="animatorComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an animation set has been constructed from a group of animation state resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="animationSetComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an animation state has been constructed from a group of animation node resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="animationStateComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an animation node has been constructed from a resource.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="animationNodeComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an animation state transition has been constructed from a group of animation node resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="stateTransitionComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an light asset has been constructed from a resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="lightComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an light picker asset has been constructed from a resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="lightPickerComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an effect method asset has been constructed from a resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="effectMethodComplete", type="away3d.events.AssetEvent")]
	
	
	/**
	 * Dispatched when an shadow map method asset has been constructed from a resources.
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="shadowMapMethodComplete", type="away3d.events.AssetEvent")]
	
	/**
	 * Dispatched when an image asset dimensions are not a power of 2
	 *
	 * @eventType away3d.events.AssetEvent
	 */
	//[Event(name="textureSizeError", type="away3d.events.AssetEvent")]
	
	/**
	 * AssetLoader can load any file format that Away3D supports (or for which a third-party parser
	 * has been plugged in) and it's dependencies. Events are dispatched when assets are encountered
	 * and for when the resource (or it's dependencies) have been loaded.
	 *
	 * The AssetLoader will not make assets available in any other way than through the dispatched
	 * events. To store assets and make them available at any point from any module in an application,
	 * use the AssetLibrary to load and manage assets.
	 *
	 * @see away3d.loading.Loader3D
	 * @see away3d.loading.AssetLibrary
	 */
	export class AssetLoader extends away.events.EventDispatcher
	{
		private _context:away.loaders.AssetLoaderContext;
		private _token:away.loaders.AssetLoaderToken;
		private _uri:string;
		
		private _errorHandlers:Function[];//Vector.<Function>;
		private _parseErrorHandlers:Function[];//Vector.<Function>;
		
		private _stack:away.loaders.ResourceDependency[];//Vector.<ResourceDependency>;
		private _baseDependency:away.loaders.ResourceDependency;
		private _loadingDependency:away.loaders.ResourceDependency;
		private _namespace:string;
		
		/**
		 * Returns the base dependency of the loader
		 */
		public get baseDependency():away.loaders.ResourceDependency
		{
			return this._baseDependency;
		}
		
		/**
		 * Create a new ResourceLoadSession object.
		 */
		constructor()
		{
            super();

			this._stack                 = new Array<away.loaders.ResourceDependency>();
            this._errorHandlers         = new Array<Function>();
            this._parseErrorHandlers    = new Array<Function>();
		}
		
		/**
		 * Enables a specific parser. 
		 * When no specific parser is set for a loading/parsing opperation, 
		 * loader3d can autoselect the correct parser to use.
		 * A parser must have been enabled, to be considered when autoselecting the parser.
		 *
		 * @param parserClass The parser class to enable.
		 * 
		 * @see away3d.loaders.parsers.Parsers
		 */
		public static enableParser( parserClass )
		{
			away.loaders.SingleFileLoader.enableParser( parserClass );
		}
		
		/**
		 * Enables a list of parsers. 
		 * When no specific parser is set for a loading/parsing opperation, 
		 * AssetLoader can autoselect the correct parser to use.
		 * A parser must have been enabled, to be considered when autoselecting the parser.
		 *
		 * @param parserClasses A Vector of parser classes to enable.
		 * @see away3d.loaders.parsers.Parsers
		 */

		public static enableParsers(parserClasses : Object[])
		{

			away.loaders.SingleFileLoader.enableParsers(parserClasses);

		}
		
		/**
		 * Loads a file and (optionally) all of its dependencies.
		 *
		 * @param req The URLRequest object containing the URL of the file to be loaded.
		 * @param context An optional context object providing additional parameters for loading
		 * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
		 * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
		 */
		public load(req:away.net.URLRequest, context:away.loaders.AssetLoaderContext = null, ns:string = null, parser:away.loaders.ParserBase = null):away.loaders.AssetLoaderToken
		{
			if ( ! this._token ) {

				this._token = new away.loaders.AssetLoaderToken(this);
				
				this._uri       = req.url = req.url.replace(/\\/g, "/");
				this._context   = context;
				this._namespace = ns;
				
				this._baseDependency = new away.loaders.ResourceDependency( '' , req , null , null );
				this.retrieveDependency( this._baseDependency , parser );
				
				return this._token;
			}
			
			// TODO: Throw error (already loading)
			return null;
		}
		
		/**
		 * Loads a resource from already loaded data.
		 *
		 * @param data The data object containing all resource information.
		 * @param context An optional context object providing additional parameters for loading
		 * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
		 * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
		 */
		public loadData(data: any , id:string , context:away.loaders.AssetLoaderContext = null, ns:string = null, parser:away.loaders.ParserBase = null):away.loaders.AssetLoaderToken
		{
			if (!this._token) {
				this._token = new away.loaders.AssetLoaderToken(this);
				
				this._uri = id;
                this._context = context;
                this._namespace = ns;

                this._baseDependency = new ResourceDependency(id, null, data, null);
                this.retrieveDependency(this._baseDependency, parser);
				
				return this._token;
			}
			
			// TODO: Throw error (already loading)
			return null;
		}
		
		/**
		 * Recursively retrieves the next to-be-loaded and parsed dependency on the stack, or pops the list off the
		 * stack when complete and continues on the top set.
		 * @param parser The parser that will translate the data into a usable resource.
		 */
		private retrieveNext(parser:away.loaders.ParserBase = null)
		{
			if (this._loadingDependency.dependencies.length) {

				var dep:ResourceDependency = this._loadingDependency.dependencies.pop();

                this._stack.push(this._loadingDependency);
                this.retrieveDependency(dep);

			} else if (this._loadingDependency._iLoader.parser && this._loadingDependency._iLoader.parser.parsingPaused) {

                this._loadingDependency._iLoader.parser._iResumeParsingAfterDependencies();//resumeParsingAfterDependencies();
                this._stack.pop();

			} else if (this._stack.length) {

				var prev:away.loaders.ResourceDependency = this._loadingDependency;

                this._loadingDependency = this._stack.pop();
				
				if (prev._iSuccess)
                {

                    prev.resolve();

                }

				this.retrieveNext(parser);

			}
            else
            {

                //console.log( 'AssetLoader.retrieveNext - away.events.LoaderEvent.RESOURCE_COMPLETE');
                this.dispatchEvent( new away.events.LoaderEvent( away.events.LoaderEvent.RESOURCE_COMPLETE , this._uri ));

            }

		}
		
		/**
		 * Retrieves a single dependency.
		 * @param parser The parser that will translate the data into a usable resource.
		 */
		private retrieveDependency(dependency:away.loaders.ResourceDependency, parser:away.loaders.ParserBase = null)
		{
			var data    : any;
			var matMode : number = 0;

			if ( this._context && this._context.materialMode != 0 )
            {

                matMode = this._context.materialMode;

            }

			this._loadingDependency             = dependency;
			this._loadingDependency._iLoader    = new away.loaders.SingleFileLoader(matMode);

			this.addEventListeners( this._loadingDependency._iLoader ) ;
			
			// Get already loaded (or mapped) data if available
			data = this._loadingDependency.data;

			if (this._context && this._loadingDependency.request && this._context._iHasDataForUrl(this._loadingDependency.request.url))
            {

                data = this._context._iGetDataForUrl(this._loadingDependency.request.url);

            }

			
			if (data)
            {
				if ( this._loadingDependency.retrieveAsRawData)
                {
					// No need to parse. The parent parser is expecting this
					// to be raw data so it can be passed directly.

					this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this._loadingDependency.request.url, true));
					this._loadingDependency._iSetData( data );
                    this._loadingDependency.resolve();
					
					// Move on to next dependency
					this.retrieveNext();

				}
                else
                {

                    this._loadingDependency._iLoader.parseData( data , parser , this._loadingDependency.request );

                }

			}
            else
            {
				// Resolve URL and start loading
				dependency.request.url = this.resolveDependencyUrl(dependency);
				this._loadingDependency._iLoader.load(dependency.request, parser, this._loadingDependency.retrieveAsRawData);

			}
		}
		
		private joinUrl(base:string, end:string):string
		{
			if (end.charAt(0) == '/')
            {

                end = end.substr(1);

            }

			
			if (base.length == 0)
            {

                return end;

            }

			
			if (base.charAt(base.length - 1) == '/')
            {

                base = base.substr(0, base.length - 1);

            }

			return base.concat('/', end);

		}
		
		private resolveDependencyUrl(dependency:away.loaders.ResourceDependency):string
		{
			var scheme_re:RegExp;
			var base:string;
			var url:string = dependency.request.url;
			
			// Has the user re-mapped this URL?
			if (this._context && this._context._iHasMappingForUrl(url))
				return this._context._iGetRemappedUrl( url );
			
			// This is the "base" dependency, i.e. the actual requested asset.
			// We will not try to resolve this since the user can probably be 
			// thrusted to know this URL better than our automatic resolver. :)
			if (url == this._uri)
            {

                return url;

            }



			// Absolute URL? Check if starts with slash or a URL
			// scheme definition (e.g. ftp://, http://, file://)
			scheme_re = new RegExp('/^[a-zA-Z]{3,4}:\/\//');

			if (url.charAt(0) == '/') {
				if (this._context && this._context.overrideAbsolutePaths)
					return this.joinUrl( this._context.dependencyBaseUrl, url);
				else
					return url;
			} else if (scheme_re.test(url)) {
				// If overriding full URLs, get rid of scheme (e.g. "http://")
				// and replace with the dependencyBaseUrl defined by user.
				if (this._context && this._context.overrideFullURLs) {
					var noscheme_url:string;
					
					noscheme_url = url['replace'](scheme_re);

					return this.joinUrl(this._context.dependencyBaseUrl, noscheme_url);
				}
			}
			
			// Since not absolute, just get rid of base file name to find it's
			// folder and then concatenate dynamic URL
			if (this._context && this._context.dependencyBaseUrl) {
				base = this._context.dependencyBaseUrl;
				return this.joinUrl(base, url);
			} else {
				base = this._uri.substring(0, this._uri.lastIndexOf('/') + 1);
				return this.joinUrl(base, url);
			}
		}
		
		private retrieveLoaderDependencies(loader:SingleFileLoader)
		{
			if (!this._loadingDependency) {
				//loader.parser = null;
				//loader = null;
				return;
			}
			var i:number, len:number = loader.dependencies.length;
			
			for (i = 0; i < len; i++)
            {

                this._loadingDependency.dependencies[i] = loader.dependencies[i];

            }

			
			// Since more dependencies might be added eventually, empty this
			// list so that the same dependency isn't retrieved more than once.
			loader.dependencies.length = 0;
			
			this._stack.push(this._loadingDependency);
			
			this.retrieveNext();
		}
		
		/**
		 * Called when a single dependency loading failed, and pushes further dependencies onto the stack.
		 * @param event
		 */
		private onRetrievalFailed(event:away.events.LoaderEvent)
		{
			var handled:boolean;
			var isDependency:boolean = (this._loadingDependency != this._baseDependency);
			var loader:SingleFileLoader = <away.loaders.SingleFileLoader> event.target;//TODO: keep on eye on this one
			
			this.removeEventListeners(loader);
			
			event = new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this._uri, isDependency, event.message);

            // TODO: JS / AS3 Change - debug this code with a fine tooth combe

			//if (this.hasEventListener( away.events.LoaderEvent.LOAD_ERROR , this )) {
				this.dispatchEvent(event);
				handled = true;
			//} else {

				// TO - Away - Consider not doing this even when AssetLoader does
				// have it's own LOAD_ERROR listener
				var i:number, len:number = this._errorHandlers.length;
				for (i = 0; i < len; i++)
                {
					var handlerFunction = this._errorHandlers[i];

					handled  = handled || <boolean> handlerFunction(event);

				}

			//}
			
			if (handled) {

                //if (isDependency && ! event.isDefaultPrevented()) {
				if ( isDependency ) { // TODO: JS / AS3 Change - we don't have isDefaultPrevented - so will this work

					this._loadingDependency.resolveFailure();
					this.retrieveNext();

				} else {
					// Either this was the base file (last left in the stack) or
					// default behavior was prevented by the handlers, and hence
					// there is nothing more to do than clean up and bail.
					this.dispose();
					return;
				}
			}
            else
            {

				// Error event was not handled by listeners directly on AssetLoader or
				// on any of the subscribed loaders (in the list of error handlers.)
				throw new away.errors.Error(event.message);

			}
		}
		
		/**
		 * Called when a dependency parsing failed, and dispatches a <code>ParserEvent.PARSE_ERROR</code>
		 * @param event
		 */
		private onParserError(event : away.events.ParserEvent)
		{
			var handled:boolean;

			var isDependency:boolean = (this._loadingDependency != this._baseDependency);

			var loader:SingleFileLoader = <away.loaders.SingleFileLoader>event.target;
			
			this.removeEventListeners(loader);
			
			event = new away.events.ParserEvent(away.events.ParserEvent.PARSE_ERROR, event.message);

            // TODO: keep on eye on this / debug - JS / AS3 Change

			//if (this.hasEventListener(away.events.ParserEvent.PARSE_ERROR)) {
				this.dispatchEvent(event);
				handled = true;
			//} else {
				// TODO: Consider not doing this even when AssetLoader does
				// have it's own LOAD_ERROR listener
				var i:number, len:number = this._parseErrorHandlers.length;

				for (i = 0; i < len; i++) {
					var handlerFunction = this._parseErrorHandlers[i];

                    handled  = handled || <boolean> handlerFunction(event);

					//handled ||= Boolean(handlerFunction(event));
				}
			//}
			
			if (handled) {
				this.dispose();
				return;
			} else {
				// Error event was not handled by listeners directly on AssetLoader or
				// on any of the subscribed loaders (in the list of error handlers.)
				throw new Error(event.message);
			}
		}
		
		private onAssetComplete(event:away.events.AssetEvent)
		{
			// Event is dispatched twice per asset (once as generic ASSET_COMPLETE,
			// and once as type-specific, e.g. MESH_COMPLETE.) Do this only once.
			if (event.type == away.events.AssetEvent.ASSET_COMPLETE) {
				
				// Add loaded asset to list of assets retrieved as part
				// of the current dependency. This list will be inspected
				// by the parent parser when dependency is resolved
				if (this._loadingDependency)
                {

                    this._loadingDependency.assets.push(event.asset);

                }

				event.asset.resetAssetPath(event.asset.name, this._namespace);

			}

            //console.log( 'AssetLoader.onAssetComplete suppresAssetEvents:' , this._loadingDependency.suppresAssetEvents , event );

			if (!this._loadingDependency.suppresAssetEvents)
            {

                this.dispatchEvent(event.clone());

            }

		}
		
		private onReadyForDependencies(event:away.events.ParserEvent)
		{
			var loader:SingleFileLoader = <away.loaders.SingleFileLoader> event.target; // was event.currentTarget / TODO: AS3 <> JS functionality change - keep on eye on this
			
			if (this._context && !this._context.includeDependencies)
            {

                loader.parser._iResumeParsingAfterDependencies();
            }
			else
            {

                this.retrieveLoaderDependencies(loader);

            }

		}
		
		/**
		 * Called when a single dependency was parsed, and pushes further dependencies onto the stack.
		 * @param event
		 */
		private onRetrievalComplete(event:away.events.LoaderEvent)
		{
            var loader:SingleFileLoader = <away.loaders.SingleFileLoader> event.target;
            //var loader:SingleFileLoader = SingleFileLoader(event.target);
			
			// Resolve this dependency
			this._loadingDependency._iSetData( loader.data );
            this._loadingDependency._iSuccess = true;
			
			this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, event.url));
			this.removeEventListeners(loader);
			
			// Retrieve any last dependencies remaining on this loader, or
			// if none exists, just move on.
			if (loader.dependencies.length && (!this._context || this._context.includeDependencies))
            { //context may be null

				this.retrieveLoaderDependencies(loader);

			}
            else
            {

                this.retrieveNext();

            }

		}
		
		/**
		 * Called when an image is too large or it's dimensions are not a power of 2
		 * @param event
		 */
		private onTextureSizeError(event:away.events.AssetEvent)
		{
			event.asset.name = this._loadingDependency.resolveName(event.asset);
			this.dispatchEvent(event);

		}
		
		private addEventListeners(loader:SingleFileLoader)
		{
			loader.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onRetrievalComplete , this );
			loader.addEventListener(away.events.LoaderEvent.LOAD_ERROR, this.onRetrievalFailed, this );
			loader.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this );
			loader.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.ANIMATION_SET_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.ANIMATION_STATE_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.ANIMATION_NODE_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.STATE_TRANSITION_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.TEXTURE_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.CONTAINER_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.GEOMETRY_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.MATERIAL_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.MESH_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete, this );
			loader.addEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this );
			loader.addEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParserError, this );
		}
		
		private removeEventListeners(loader:SingleFileLoader)
		{
			loader.removeEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
			loader.removeEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onRetrievalComplete, this);
			loader.removeEventListener(away.events.LoaderEvent.LOAD_ERROR, this.onRetrievalFailed, this);
			loader.removeEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
			loader.removeEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.ANIMATION_SET_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.ANIMATION_STATE_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.ANIMATION_NODE_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.STATE_TRANSITION_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.TEXTURE_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.CONTAINER_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.GEOMETRY_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.MATERIAL_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.MESH_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete, this);
			loader.removeEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParserError, this);
		}
		
		public stop()
		{
			this.dispose();
		}
		
		private dispose()
		{
			this._errorHandlers = null;
            this._parseErrorHandlers = null;
            this._context = null;
            this._token = null;
            this._stack = null;
			
			if (this._loadingDependency && this._loadingDependency._iLoader)
            {

                this.removeEventListeners(this._loadingDependency._iLoader);

            }

            this._loadingDependency = null;

		}
		
		/**
		 * @private
		 * This method is used by other loader classes (e.g. Loader3D and AssetLibraryBundle) to
		 * add error event listeners to the AssetLoader instance. This system is used instead of
		 * the regular EventDispatcher system so that the AssetLibrary error handler can be sure
		 * that if hasEventListener() returns true, it's client code that's listening for the
		 * event. Secondly, functions added as error handler through this custom method are
		 * expected to return a boolean value indicating whether the event was handled (i.e.
		 * whether they in turn had any client code listening for the event.) If no handlers
		 * return true, the AssetLoader knows that the event wasn't handled and will throw an RTE.
		 */
		
		public _iAddParseErrorHandler(handler)
		{

			if (this._parseErrorHandlers.indexOf(handler) < 0)
            {

                this._parseErrorHandlers.push(handler);

            }

		
		}
		
		public _iAddErrorHandler(handler)
		{

			if (this._errorHandlers.indexOf(handler) < 0)
            {

                this._errorHandlers.push(handler);

            }


		}
	}
}
