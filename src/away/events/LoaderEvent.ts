///<reference path="../_definitions.ts"/>

/**
 * @module away.events
 */
module away.events
{	
	export class LoaderEvent extends away.events.Event
	{
        /**
         * Dispatched when loading of a asset failed.
         * Such as wrong parser type, unsupported extensions, parsing errors, malformated or unsupported 3d file etc..
         */
        public static LOAD_ERROR : string = "loadError";

        /**
         * Dispatched when a resource and all of its dependencies is retrieved.
         */
        public static RESOURCE_COMPLETE : string = "resourceComplete";

        /**
         * Dispatched when a resource's dependency is retrieved and resolved.
         */
        public static DEPENDENCY_COMPLETE : string = "dependencyComplete";

        private _url                : string;
        private _assets             : away.library.IAsset[];
        private _message            : string;
        private _isDependency       : boolean;
        private _isDefaultPrevented : boolean;

        /**
         * Create a new LoaderEvent object.
         * @param type The event type.
         * @param resource The loaded or parsed resource.
         * @param url The url of the loaded resource.
         */
        constructor( type : string, url : string = null, assets : away.library.IAsset[] = null, isDependency : boolean = false, errmsg : string = null )
		{
			super(type);

            this._url           = url;
            this._assets        = assets;
            this._message       = errmsg;
            this._isDependency  = isDependency;

		}
        /**
         * The url of the loaded resource.
         */
        public get url ( ) : string
        {

            return this._url;

        }

        /**
         * The error string on loadError.
         */
        public get assets() : away.library.IAsset[]
        {
            return this._assets;
        }

        /**
         * The error string on loadError.
         */
        public get message() : string
        {
            return this._message;
        }

        /**
         * Indicates whether the event occurred while loading a dependency, as opposed
         * to the base file. Dependencies can be textures or other files that are
         * referenced by the base file.
         */
        public get isDependency() : boolean
        {
            return this._isDependency;
        }

        /**
         * Clones the current event.
         * @return An exact duplicate of the current event.
         */
        public clone() : away.events.Event
        {
            return <away.events.Event> new LoaderEvent(this.type, this._url, this._assets, this._isDependency, this._message);

        }

    }

}