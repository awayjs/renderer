/// <reference path="ref/webgl.d.ts" />
/// <reference path="ref/js.d.ts" />
declare module away.errors {
    class Error {
        private _errorID;
        private _messsage;
        private _name;
        constructor(message?: string, id?: number, _name?: string);
        /**
        *
        * @returns {string}
        */
        /**
        *
        * @param value
        */
        public message : string;
        /**
        *
        * @returns {string}
        */
        /**
        *
        * @param value
        */
        public name : string;
        /**
        *
        * @returns {number}
        */
        public errorID : number;
    }
}
declare module away.errors {
    /**
    * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
    * by a concrete subclass.
    */
    class ArgumentError extends errors.Error {
        /**
        * Create a new AbstractMethodError.
        * @param message An optional message to override the default error message.
        * @param id The id of the error.
        */
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    /**
    * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
    * by a concrete subclass.
    */
    class PartialImplementationError extends errors.Error {
        /**
        * Create a new AbstractMethodError.
        * @param message An optional message to override the default error message.
        * @param id The id of the error.
        */
        constructor(dependency?: string, id?: number);
    }
}
declare module away.errors {
    /**
    * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
    * by a concrete subclass.
    */
    class AbstractMethodError extends errors.Error {
        /**
        * Create a new AbstractMethodError.
        * @param message An optional message to override the default error message.
        * @param id The id of the error.
        */
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    class DocumentError extends errors.Error {
        static DOCUMENT_DOES_NOT_EXIST: string;
        constructor(message?: string, id?: number);
    }
}
/**
* Base event class
* @class away.events.Event
*/
declare module away.events {
    class Event {
        static COMPLETE: string;
        static OPEN: string;
        static ENTER_FRAME: string;
        static EXIT_FRAME: string;
        static RESIZE: string;
        static CONTEXTGL_CREATE: string;
        static ERROR: string;
        static CHANGE: string;
        /**
        * Type of event
        * @property type
        * @type String
        */
        public type: string;
        /**
        * Reference to target object
        * @property target
        * @type Object
        */
        public target: Object;
        constructor(type: string);
        /**
        * Clones the current event.
        * @return An exact duplicate of the current event.
        */
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    /**
    * Base class for dispatching events
    *
    * @class away.events.EventDispatcher
    *
    */
    class EventDispatcher {
        private listeners;
        private lFncLength;
        /**
        * Add an event listener
        * @method addEventListener
        * @param {String} Name of event to add a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        public addEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Remove an event listener
        * @method removeEventListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        public removeEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Dispatch an event
        * @method dispatchEvent
        * @param {Event} Event to dispatch
        */
        public dispatchEvent(event: events.Event): void;
        /**
        * get Event Listener Index in array. Returns -1 if no listener is added
        * @method getEventListenerIndex
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        private getEventListenerIndex(type, listener, target);
        public hasEventListener(type: string, listener?: Function, target?: Object): boolean;
    }
}
/**
* @module away.events
*/
declare module away.events {
    /**
    * Base interface for dispatching events
    *
    * @interface away.events.IEventDispatcher
    *
    */
    interface IEventDispatcher {
        /**
        * Add an event listener
        * @method addEventListener
        * @param {String} Name of event to add a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        addEventListener(type: string, listener: Function, target: Object): any;
        /**
        * Remove an event listener
        * @method removeEventListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        removeEventListener(type: string, listener: Function, target: Object): any;
        /**
        * Dispatch an event
        * @method dispatchEvent
        * @param {Event} Event to dispatch
        */
        dispatchEvent(event: events.Event): any;
        hasEventListener(type: string, listener?: Function, target?: Object): boolean;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class IOErrorEvent extends events.Event {
        static IO_ERROR: string;
        constructor(type: string);
    }
}
declare module away.events {
    /**
    * @class away.events.HTTPStatusEvent
    */
    class HTTPStatusEvent extends events.Event {
        static HTTP_STATUS: string;
        public status: number;
        constructor(type: string, status?: number);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class ParserEvent extends events.Event {
        private _message;
        /**
        * Dispatched when parsing of an asset completed.
        */
        static PARSE_COMPLETE: string;
        /**
        * Dispatched when an error occurs while parsing the data (e.g. because it's
        * incorrectly formatted.)
        */
        static PARSE_ERROR: string;
        /**
        * Dispatched when a parser is ready to have dependencies retrieved and resolved.
        * This is an internal event that should rarely (if ever) be listened for by
        * external classes.
        */
        static READY_FOR_DEPENDENCIES: string;
        constructor(type: string, message?: string);
        /**
        * Additional human-readable message. Usually supplied for ParserEvent.PARSE_ERROR events.
        */
        public message : string;
        public clone(): events.Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class ProgressEvent extends events.Event {
        static PROGRESS: string;
        public bytesLoaded: number;
        public bytesTotal: number;
        constructor(type: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class LoaderEvent extends events.Event {
        /**
        * Dispatched when loading of a asset failed.
        * Such as wrong parser type, unsupported extensions, parsing errors, malformated or unsupported 3d file etc..
        */
        static LOAD_ERROR: string;
        /**
        * Dispatched when a resource and all of its dependencies is retrieved.
        */
        static RESOURCE_COMPLETE: string;
        /**
        * Dispatched when a resource's dependency is retrieved and resolved.
        */
        static DEPENDENCY_COMPLETE: string;
        private _url;
        private _assets;
        private _message;
        private _isDependency;
        private _isDefaultPrevented;
        /**
        * Create a new LoaderEvent object.
        * @param type The event type.
        * @param resource The loaded or parsed resource.
        * @param url The url of the loaded resource.
        */
        constructor(type: string, url?: string, assets?: away.library.IAsset[], isDependency?: boolean, errmsg?: string);
        /**
        * The url of the loaded resource.
        */
        public url : string;
        /**
        * The error string on loadError.
        */
        public assets : away.library.IAsset[];
        /**
        * The error string on loadError.
        */
        public message : string;
        /**
        * Indicates whether the event occurred while loading a dependency, as opposed
        * to the base file. Dependencies can be textures or other files that are
        * referenced by the base file.
        */
        public isDependency : boolean;
        /**
        * Clones the current event.
        * @return An exact duplicate of the current event.
        */
        public clone(): events.Event;
    }
}
declare module away.events {
    /**
    * @class away.events.AssetEvent
    */
    class AssetEvent extends events.Event {
        static ASSET_COMPLETE: string;
        static ASSET_RENAME: string;
        static ASSET_CONFLICT_RESOLVED: string;
        static TEXTURE_SIZE_ERROR: string;
        private _asset;
        private _prevName;
        constructor(type: string, asset?: away.library.IAsset, prevName?: string);
        public asset : away.library.IAsset;
        public assetPrevName : string;
        public clone(): events.Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class TimerEvent extends events.Event {
        static TIMER: string;
        static TIMER_COMPLETE: string;
        constructor(type: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class StageGLEvent extends events.Event {
        static CONTEXTGL_CREATED: string;
        static CONTEXTGL_DISPOSED: string;
        static CONTEXTGL_RECREATED: string;
        static VIEWPORT_UPDATED: string;
        constructor(type: string);
    }
}
declare module away.parsers {
    /**
    * <code>ParserBase</code> provides an abstract base class for objects that convert blocks of data to data structures
    * supported by away.
    *
    * If used by <code>AssetLoader</code> to automatically determine the parser type, two public static methods should
    * be implemented, with the following signatures:
    *
    * <code>public static supportsType(extension : string) : boolean</code>
    * Indicates whether or not a given file extension is supported by the parser.
    *
    * <code>public static supportsData(data : *) : boolean</code>
    * Tests whether a data block can be parsed by the parser.
    *
    * Furthermore, for any concrete subtype, the method <code>initHandle</code> should be overridden to immediately
    * create the object that will contain the parsed data. This allows <code>ResourceManager</code> to return an object
    * handle regardless of whether the object was loaded or not.
    *
    * @see away.net.AssetLoader
    */
    class ParserBase extends away.events.EventDispatcher {
        public _iFileName: string;
        private _dataFormat;
        private _data;
        private _frameLimit;
        private _lastFrameTime;
        static supportsType(extension: string): boolean;
        private _dependencies;
        private _loaderType;
        private _parsingPaused;
        private _parsingComplete;
        private _parsingFailure;
        private _timer;
        private _materialMode;
        /**
        * Returned by <code>proceedParsing</code> to indicate no more parsing is needed.
        */
        static PARSING_DONE: boolean;
        /**
        * Returned by <code>proceedParsing</code> to indicate more parsing is needed, allowing asynchronous parsing.
        */
        static MORE_TO_PARSE: boolean;
        /**
        * Creates a new ParserBase object
        * @param format The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>, and should be provided by the concrete subtype.
        * @param loaderType The type of loader required by the parser
        *
        * @see away.loading.parsers.ParserDataFormat
        */
        constructor(format: string, loaderType?: string);
        /**
        * Validates a bitmapData loaded before assigning to a default BitmapMaterial
        */
        public isBitmapDataValid(bitmapData: away.display.BitmapData): boolean;
        public parsingFailure : boolean;
        public parsingPaused : boolean;
        public parsingComplete : boolean;
        public materialMode : number;
        public loaderType : string;
        public data : any;
        /**
        * The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>.
        */
        public dataFormat : string;
        /**
        * Parse data (possibly containing bytearry, plain text or BitmapAsset) asynchronously, meaning that
        * the parser will periodically stop parsing so that the AVM may proceed to the
        * next frame.
        *
        * @param data The untyped data object in which the loaded data resides.
        * @param frameLimit number of milliseconds of parsing allowed per frame. The
        * actual time spent on a frame can exceed this number since time-checks can
        * only be performed between logical sections of the parsing procedure.
        */
        public parseAsync(data: any, frameLimit?: number): void;
        /**
        * A list of dependencies that need to be loaded and resolved for the object being parsed.
        */
        public dependencies : parsers.ResourceDependency[];
        /**
        * Resolve a dependency when it's loaded. For example, a dependency containing an ImageResource would be assigned
        * to a Mesh instance as a BitmapMaterial, a scene graph object would be added to its intended parent. The
        * dependency should be a member of the dependencies property.
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependency(resourceDependency: parsers.ResourceDependency): void;
        /**
        * Resolve a dependency loading failure. Used by parser to eventually provide a default map
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependencyFailure(resourceDependency: parsers.ResourceDependency): void;
        /**
        * Resolve a dependency name
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependencyName(resourceDependency: parsers.ResourceDependency, asset: away.library.IAsset): string;
        public _iResumeParsingAfterDependencies(): void;
        public _pFinalizeAsset(asset: away.library.IAsset, name?: string): void;
        /**
        * Parse the next block of data.
        * @return Whether or not more data needs to be parsed. Can be <code>ParserBase.ParserBase.PARSING_DONE</code> or
        * <code>ParserBase.ParserBase.MORE_TO_PARSE</code>.
        */
        public _pProceedParsing(): boolean;
        public _pDieWithError(message?: string): void;
        public _pAddDependency(id: string, req: away.net.URLRequest, retrieveAsRawData?: boolean, data?: any, suppressErrorEvents?: boolean): parsers.ResourceDependency;
        public _pPauseAndRetrieveDependencies(): void;
        /**
        * Tests whether or not there is still time left for parsing within the maximum allowed time frame per session.
        * @return True if there is still time left, false if the maximum allotted time was exceeded and parsing should be interrupted.
        */
        public _pHasTime(): boolean;
        /**
        * Called when the parsing pause interval has passed and parsing can proceed.
        */
        public _pOnInterval(event?: away.events.TimerEvent): void;
        /**
        * Initializes the parsing of data.
        * @param frameLimit The maximum duration of a parsing session.
        */
        private startParsing(frameLimit);
        /**
        * Finish parsing the data.
        */
        public _pFinishParsing(): void;
        /**
        *
        * @returns {string}
        * @private
        */
        public _pGetTextData(): string;
        /**
        *
        * @returns {string}
        * @private
        */
        public _pGetByteData(): away.utils.ByteArray;
    }
}
declare module away.parsers {
    /**
    * CubeTextureParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    class CubeTextureParser extends parsers.ParserBase {
        private static posX;
        private static negX;
        private static posY;
        private static negY;
        private static posZ;
        private static negZ;
        private _imgDependencyDictionary;
        /**
        * Creates a new CubeTextureParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        constructor();
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _iResolveDependency(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        private _validateCubeData();
        private _getHTMLImageElement(name);
    }
}
declare module away.parsers {
    /**
    * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    class ImageParser extends parsers.ParserBase {
        private _startedParsing;
        private _doneParsing;
        /**
        * Creates a new ImageParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        constructor();
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
    }
}
declare module away.parsers {
    /**
    * An enumeration providing values to describe the data format of parsed data.
    */
    class ParserDataFormat {
        /**
        * Describes the format of a binary file.
        */
        static BINARY: string;
        /**
        * Describes the format of a plain text file.
        */
        static PLAIN_TEXT: string;
        /**
        * Describes the format of an image file
        */
        static IMAGE: string;
    }
}
declare module away.parsers {
    class ParserLoaderType {
        static URL_LOADER: string;
        static IMG_LOADER: string;
    }
}
declare module away.parsers {
    class ParserUtils {
        /**
        * Converts an ByteArray to an Image - returns an HTMLImageElement
        *
        * @param image data as a ByteArray
        *
        * @return HTMLImageElement
        *
        */
        static byteArrayToImage(data: away.utils.ByteArray): HTMLImageElement;
        /**
        * Returns a object as ByteArray, if possible.
        *
        * @param data The object to return as ByteArray
        *
        * @return The ByteArray or null
        *
        */
        static toByteArray(data: any): away.utils.ByteArray;
        /**
        * Returns a object as String, if possible.
        *
        * @param data The object to return as String
        * @param length The length of the returned String
        *
        * @return The String or null
        *
        */
        static toString(data: any, length?: number): string;
    }
}
declare module away.parsers {
    /**
    * ResourceDependency represents the data required to load, parse and resolve additional files ("dependencies")
    * required by a parser, used by ResourceLoadSession.
    *
    */
    class ResourceDependency {
        private _id;
        private _req;
        private _assets;
        private _parentParser;
        private _data;
        private _retrieveAsRawData;
        private _suppressAssetEvents;
        private _dependencies;
        public _iLoader: away.net.SingleFileLoader;
        public _iSuccess: boolean;
        constructor(id: string, req: away.net.URLRequest, data: any, parentParser: parsers.ParserBase, retrieveAsRawData?: boolean, suppressAssetEvents?: boolean);
        public id : string;
        public assets : away.library.IAsset[];
        public dependencies : ResourceDependency[];
        public request : away.net.URLRequest;
        public retrieveAsRawData : boolean;
        public suppresAssetEvents : boolean;
        /**
        * The data containing the dependency to be parsed, if the resource was already loaded.
        */
        public data : any;
        /**
        * @private
        * Method to set data after having already created the dependency object, e.g. after load.
        */
        public _iSetData(data: any): void;
        /**
        * The parser which is dependent on this ResourceDependency object.
        */
        public parentParser : parsers.ParserBase;
        /**
        * Resolve the dependency when it's loaded with the parent parser. For example, a dependency containing an
        * ImageResource would be assigned to a Mesh instance as a BitmapMaterial, a scene graph object would be added
        * to its intended parent. The dependency should be a member of the dependencies property.
        */
        public resolve(): void;
        /**
        * Resolve a dependency failure. For example, map loading failure from a 3d file
        */
        public resolveFailure(): void;
        /**
        * Resolve the dependencies name
        */
        public resolveName(asset: away.library.IAsset): string;
    }
}
declare module away.library {
    interface IAsset extends away.events.IEventDispatcher {
        name: string;
        id: string;
        assetNamespace: string;
        assetType: string;
        assetFullPath: string[];
        assetPathEquals(name: string, ns: string): boolean;
        resetAssetPath(name: string, ns: string, overrideOriginal?: boolean): void;
        dispose(): any;
    }
}
declare module away.library {
    class IDUtil {
        /**
        *  @private
        *  Char codes for 0123456789ABCDEF
        */
        private static ALPHA_CHAR_CODES;
        /**
        *  Generates a UID (unique identifier) based on ActionScript's
        *  pseudo-random number generator and the current time.
        *
        *  <p>The UID has the form
        *  <code>"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"</code>
        *  where X is a hexadecimal digit (0-9, A-F).</p>
        *
        *  <p>This UID will not be truly globally unique; but it is the best
        *  we can do without player support for UID generation.</p>
        *
        *  @return The newly-generated UID.
        *
        *  @langversion 3.0
        *  @playerversion Flash 9
        *  @playerversion AIR 1.1
        *  @productversion Flex 3
        */
        static createUID(): string;
    }
}
declare module away.library {
    class NamedAssetBase extends away.events.EventDispatcher implements library.IAsset {
        private _originalName;
        private _namespace;
        private _name;
        private _id;
        private _full_path;
        private _assetType;
        static DEFAULT_NAMESPACE: string;
        constructor(name?: string);
        /**
        * The original name used for this asset in the resource (e.g. file) in which
        * it was found. This may not be the same as <code>name</code>, which may
        * have changed due to of a name conflict.
        */
        public originalName : string;
        public id : string;
        public assetType : string;
        public name : string;
        public dispose(): void;
        public assetNamespace : string;
        public assetFullPath : string[];
        public assetPathEquals(name: string, ns: string): boolean;
        public resetAssetPath(name: string, ns?: string, overrideOriginal?: boolean): void;
        private updateFullPath();
    }
}
declare module away.library {
    class AssetType {
        static ENTITY: string;
        static SKYBOX: string;
        static CAMERA: string;
        static SEGMENT_SET: string;
        static MESH: string;
        static GEOMETRY: string;
        static SKELETON: string;
        static SKELETON_POSE: string;
        static CONTAINER: string;
        static TEXTURE: string;
        static TEXTURE_PROJECTOR: string;
        static MATERIAL: string;
        static ANIMATION_SET: string;
        static ANIMATION_STATE: string;
        static ANIMATION_NODE: string;
        static ANIMATOR: string;
        static STATE_TRANSITION: string;
        static LIGHT: string;
        static LIGHT_PICKER: string;
        static SHADOW_MAP_METHOD: string;
        static EFFECTS_METHOD: string;
    }
}
declare module away.library {
    class AssetLibraryIterator {
        private _assets;
        private _filtered;
        private _idx;
        constructor(assets: library.IAsset[], assetTypeFilter: string, namespaceFilter: string, filterFunc: any);
        public currentAsset : library.IAsset;
        public numAssets : number;
        public next(): library.IAsset;
        public reset(): void;
        public setIndex(index: number): void;
        private filter(assetTypeFilter, namespaceFilter, filterFunc);
    }
}
declare module away.library {
    /**
    * Abstract base class for naming conflict resolution classes. Extend this to create a
    * strategy class which the asset library can use to resolve asset naming conflicts, or
    * use one of the bundled concrete strategy classes:
    *
    * <ul>
    *   <li>IgnoreConflictStrategy (ConflictStrategy.IGNORE)</li>
    *   <li>ErrorConflictStrategy (ConflictStrategy.THROW_ERROR)</li>
    *   <li>NumSuffixConflictStrategy (ConflictStrategy.APPEND_NUM_SUFFIX)</li>
    * </ul>
    *
    * @see away.library.AssetLibrary.conflictStrategy
    * @see away.library.ConflictStrategy
    * @see away.library.IgnoreConflictStrategy
    * @see away.library.ErrorConflictStrategy
    * @see away.library.NumSuffixConflictStrategy
    */
    class ConflictStrategyBase {
        constructor();
        /**
        * Resolve a naming conflict between two assets. Must be implemented by concrete strategy
        * classes.
        */
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        /**
        * Create instance of this conflict strategy. Used internally by the AssetLibrary to
        * make sure the same strategy instance is not used in all AssetLibrary instances, which
        * would break any state caching that happens inside the strategy class.
        */
        public create(): ConflictStrategyBase;
        /**
        * Provided as a convenience method for all conflict strategy classes, as a way to finalize
        * the conflict resolution by applying the new names and dispatching the correct events.
        */
        public _pUpdateNames(ns: string, nonConflictingName: string, oldAsset: library.IAsset, newAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
    }
}
declare module away.library {
    class NumSuffixConflictStrategy extends library.ConflictStrategyBase {
        private _separator;
        private _next_suffix;
        constructor(separator?: string);
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): library.ConflictStrategyBase;
    }
}
declare module away.library {
    class IgnoreConflictStrategy extends library.ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): library.ConflictStrategyBase;
    }
}
declare module away.library {
    class ErrorConflictStrategy extends library.ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): library.ConflictStrategyBase;
    }
}
declare module away.library {
    /**
    * Enumaration class for precedence when resolving naming conflicts in the library.
    *
    * @see away.library.AssetLibrary.conflictPrecedence
    * @see away.library.AssetLibrary.conflictStrategy
    * @see away.library.naming.ConflictStrategy
    */
    class ConflictPrecedence {
        /**
        * Signals that in a conflict, the previous owner of the conflicting name
        * should be favored (and keep it's name) and that the newly renamed asset
        * is reverted to a non-conflicting name.
        */
        static FAVOR_OLD: string;
        /**
        * Signales that in a conflict, the newly renamed asset is favored (and keeps
        * it's newly defined name) and that the previous owner of that name gets
        * renamed to a non-conflicting name.
        */
        static FAVOR_NEW: string;
    }
}
declare module away.library {
    /**
    * Enumeration class for bundled conflict strategies. Set one of these values (or an
    * instance of a self-defined sub-class of ConflictStrategyBase) to the conflictStrategy
    * property on an AssetLibrary to define how that library resolves naming conflicts.
    *
    * The value of the <code>AssetLibrary.conflictPrecedence</code> property defines which
    * of the conflicting assets will get to keep it's name, and which is renamed (if any.)
    *
    * @see away.library.AssetLibrary.conflictStrategy
    * @see away.library.naming.ConflictStrategyBase
    */
    class ConflictStrategy {
        /**
        * Specifies that in case of a naming conflict, one of the assets will be renamed and
        * a numeric suffix appended to the base name.
        */
        static APPEND_NUM_SUFFIX: library.ConflictStrategyBase;
        /**
        * Specifies that naming conflicts should be ignored. This is not recommended in most
        * cases, unless it can be 100% guaranteed that the application does not cause naming
        * conflicts in the library (i.e. when an app-level system is in place to prevent this.)
        */
        static IGNORE: library.ConflictStrategyBase;
        /**
        * Specifies that an error should be thrown if a naming conflict is discovered. Use this
        * to be 100% sure that naming conflicts never occur unnoticed, and when it's undesirable
        * to have the library automatically rename assets to avoid such conflicts.
        */
        static THROW_ERROR: library.ConflictStrategyBase;
    }
}
declare module away.library {
    /**
    * AssetLibraryBundle enforces a multiton pattern and is not intended to be instanced directly.
    * Its purpose is to create a container for 3D data management, both before and after parsing.
    * If you are interested in creating multiple library bundles, please use the <code>getInstance()</code> method.
    */
    class AssetLibraryBundle extends away.events.EventDispatcher {
        private _loadingSessions;
        private _strategy;
        private _strategyPreference;
        private _assets;
        private _assetDictionary;
        private _assetDictDirty;
        private _loadingSessionsGarbage;
        private _gcTimeoutIID;
        /**
        * Creates a new <code>AssetLibraryBundle</code> object.
        *
        * @param me A multiton enforcer for the AssetLibraryBundle ensuring it cannnot be instanced.
        */
        constructor(me: AssetLibraryBundleSingletonEnforcer);
        /**
        * Returns an AssetLibraryBundle instance. If no key is given, returns the default bundle instance (which is
        * similar to using the AssetLibraryBundle as a singleton.) To keep several separated library bundles,
        * pass a string key to this method to define which bundle should be returned. This is
        * referred to as using the AssetLibrary as a multiton.
        *
        * @param key Defines which multiton instance should be returned.
        * @return An instance of the asset library
        */
        static getInstance(key?: string): AssetLibraryBundle;
        /**
        *
        */
        public enableParser(parserClass: Object): void;
        /**
        *
        */
        public enableParsers(parserClasses: Object[]): void;
        /**
        * Defines which strategy should be used for resolving naming conflicts, when two library
        * assets are given the same name. By default, <code>ConflictStrategy.APPEND_NUM_SUFFIX</code>
        * is used which means that a numeric suffix is appended to one of the assets. The
        * <code>conflictPrecedence</code> property defines which of the two conflicting assets will
        * be renamed.
        *
        * @see away.library.naming.ConflictStrategy
        * @see away.library.AssetLibrary.conflictPrecedence
        */
        public conflictStrategy : library.ConflictStrategyBase;
        /**
        * Defines which asset should have precedence when resolving a naming conflict between
        * two assets of which one has just been renamed by the user or by a parser. By default
        * <code>ConflictPrecedence.FAVOR_NEW</code> is used, meaning that the newly renamed
        * asset will keep it's new name while the older asset gets renamed to not conflict.
        *
        * This property is ignored for conflict strategies that do not actually rename an
        * asset automatically, such as ConflictStrategy.IGNORE and ConflictStrategy.THROW_ERROR.
        *
        * @see away.library.naming.ConflictPrecedence
        * @see away.library.naming.ConflictStrategy
        */
        public conflictPrecedence : string;
        /**
        * Create an AssetLibraryIterator instance that can be used to iterate over the assets
        * in this asset library instance. The iterator can filter assets on asset type and/or
        * namespace. A "null" filter value means no filter of that type is used.
        *
        * @param assetTypeFilter Asset type to filter on (from the AssetType enum class.) Use
        * null to not filter on asset type.
        * @param namespaceFilter Namespace to filter on. Use null to not filter on namespace.
        * @param filterFunc Callback function to use when deciding whether an asset should be
        * included in the iteration or not. This needs to be a function that takes a single
        * parameter of type IAsset and returns a boolean where true means it should be included.
        *
        * @see away.library.assets.AssetType
        */
        public createIterator(assetTypeFilter?: string, namespaceFilter?: string, filterFunc?: any): library.AssetLibraryIterator;
        /**
        * Loads a file and (optionally) all of its dependencies.
        *
        * @param req The URLRequest object containing the URL of the file to be loaded.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public load(req: away.net.URLRequest, context?: away.net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): away.net.AssetLoaderToken;
        /**
        * Loads a resource from existing data in memory.
        *
        * @param data The data object containing all resource information.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public loadData(data: any, context?: away.net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): away.net.AssetLoaderToken;
        /**
        *
        */
        public getAsset(name: string, ns?: string): library.IAsset;
        /**
        * Adds an asset to the asset library, first making sure that it's name is unique
        * using the method defined by the <code>conflictStrategy</code> and
        * <code>conflictPrecedence</code> properties.
        */
        public addAsset(asset: library.IAsset): void;
        /**
        * Removes an asset from the library, and optionally disposes that asset by calling
        * it's disposeAsset() method (which for most assets is implemented as a default
        * version of that type's dispose() method.
        *
        * @param asset The asset which should be removed from this library.
        * @param dispose Defines whether the assets should also be disposed.
        */
        public removeAsset(asset: library.IAsset, dispose?: boolean): void;
        /**
        * Removes an asset which is specified using name and namespace.
        *
        * @param name The name of the asset to be removed.
        * @param ns The namespace to which the desired asset belongs.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see away.library.AssetLibrary.removeAsset()
        */
        public removeAssetByName(name: string, ns?: string, dispose?: boolean): library.IAsset;
        /**
        * Removes all assets from the asset library, optionally disposing them as they
        * are removed.
        *
        * @param dispose Defines whether the assets should also be disposed.
        */
        public removeAllAssets(dispose?: boolean): void;
        /**
        * Removes all assets belonging to a particular namespace (null for default)
        * from the asset library, and optionall disposes them by calling their
        * disposeAsset() method.
        *
        * @param ns The namespace from which all assets should be removed.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see away.library.AssetLibrary.removeAsset()
        */
        public removeNamespaceAssets(ns?: string, dispose?: boolean): void;
        private removeAssetFromDict(asset, autoRemoveEmptyNamespace?);
        /**
        * Loads a yet unloaded resource file from the given url.
        */
        private loadResource(req, context?, ns?, parser?);
        public stopAllLoadingSessions(): void;
        /**
        * Retrieves an unloaded resource parsed from the given data.
        * @param data The data to be parsed.
        * @param id The id that will be assigned to the resource. This can later also be used by the getResource method.
        * @param ignoreDependencies Indicates whether or not dependencies should be ignored or loaded.
        * @param parser An optional parser object that will translate the data into a usable resource.
        * @return A handle to the retrieved resource.
        */
        private parseResource(data, context?, ns?, parser?);
        private rehashAssetDict();
        /**
        * Called when a dependency was retrieved.
        */
        private onDependencyRetrieved(event);
        /**
        * Called when a an error occurs during dependency retrieving.
        */
        private onDependencyRetrievingError(event);
        /**
        * Called when a an error occurs during parsing.
        */
        private onDependencyRetrievingParseError(event);
        private onAssetComplete(event);
        private onTextureSizeError(event);
        /**
        * Called when the resource and all of its dependencies was retrieved.
        */
        private onResourceRetrieved(event);
        private loadingSessionGC();
        private killLoadingSession(loader);
        private onAssetRename(ev);
        private onAssetConflictResolved(ev);
    }
}
declare class AssetLibraryBundleSingletonEnforcer {
}
declare module away.library {
    /**
    * AssetLibrary enforces a singleton pattern and is not intended to be instanced.
    * It's purpose is to allow access to the default library bundle through a set of static shortcut methods.
    * If you are interested in creating multiple library bundles, please use the <code>getBundle()</code> method.
    */
    class AssetLibrary {
        static _iInstances: Object;
        constructor(se: AssetLibrarySingletonEnforcer);
        /**
        * Returns an AssetLibrary bundle instance. If no key is given, returns the default bundle (which is
        * similar to using the AssetLibraryBundle as a singleton). To keep several separated library bundles,
        * pass a string key to this method to define which bundle should be returned. This is
        * referred to as using the AssetLibraryBundle as a multiton.
        *
        * @param key Defines which multiton instance should be returned.
        * @return An instance of the asset library
        */
        static getBundle(key?: string): library.AssetLibraryBundle;
        /**
        *
        */
        static enableParser(parserClass: any): void;
        /**
        *
        */
        static enableParsers(parserClasses: Object[]): void;
        /**
        * Short-hand for conflictStrategy property on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.conflictStrategy
        */
        static conflictStrategy : library.ConflictStrategyBase;
        /**
        * Short-hand for conflictPrecedence property on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.conflictPrecedence
        */
        static conflictPrecedence : string;
        /**
        * Short-hand for createIterator() method on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.createIterator()
        */
        static createIterator(assetTypeFilter?: string, namespaceFilter?: string, filterFunc?: any): library.AssetLibraryIterator;
        /**
        * Short-hand for load() method on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.load()
        */
        static load(req: away.net.URLRequest, context?: away.net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): away.net.AssetLoaderToken;
        /**
        * Short-hand for loadData() method on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.loadData()
        */
        static loadData(data: any, context?: away.net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): away.net.AssetLoaderToken;
        static stopLoad(): void;
        /**
        * Short-hand for getAsset() method on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.getAsset()
        */
        static getAsset(name: string, ns?: string): library.IAsset;
        /**
        * Short-hand for addEventListener() method on default asset library bundle.
        */
        static addEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Short-hand for removeEventListener() method on default asset library bundle.
        */
        static removeEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Short-hand for hasEventListener() method on default asset library bundle.
        
        public static hasEventListener(type:string):boolean
        {
        return away.library.AssetLibrary.getBundle().hasEventListener(type);
        }
        
        public static willTrigger(type:string):boolean
        {
        return getBundle().willTrigger(type);
        }
        */
        /**
        * Short-hand for addAsset() method on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.addAsset()
        */
        static addAsset(asset: library.IAsset): void;
        /**
        * Short-hand for removeAsset() method on default asset library bundle.
        *
        * @param asset The asset which should be removed from the library.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see away.library.AssetLibraryBundle.removeAsset()
        */
        static removeAsset(asset: library.IAsset, dispose?: boolean): void;
        /**
        * Short-hand for removeAssetByName() method on default asset library bundle.
        *
        * @param name The name of the asset to be removed.
        * @param ns The namespace to which the desired asset belongs.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see away.library.AssetLibraryBundle.removeAssetByName()
        */
        static removeAssetByName(name: string, ns?: string, dispose?: boolean): library.IAsset;
        /**
        * Short-hand for removeAllAssets() method on default asset library bundle.
        *
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see away.library.AssetLibraryBundle.removeAllAssets()
        */
        static removeAllAssets(dispose?: boolean): void;
        /**
        * Short-hand for removeNamespaceAssets() method on default asset library bundle.
        *
        * @see away.library.AssetLibraryBundle.removeNamespaceAssets()
        */
        static removeNamespaceAssets(ns?: string, dispose?: boolean): void;
    }
}
declare class AssetLibrarySingletonEnforcer {
}
declare module away.display {
    /**
    *
    */
    class BitmapData {
        private _imageCanvas;
        private _context;
        private _imageData;
        private _rect;
        private _transparent;
        private _alpha;
        private _locked;
        /**
        *
        * @param width
        * @param height
        * @param transparent
        * @param fillColor
        */
        constructor(width: number, height: number, transparent?: boolean, fillColor?: number);
        /**
        *
        */
        public dispose(): void;
        /**
        *
        */
        public lock(): void;
        /**
        *
        */
        public unlock(): void;
        /**
        *
        * @param x
        * @param y
        * @param color
        */
        public getPixel(x: any, y: any): number;
        /**
        *
        * @param x
        * @param y
        * @param color
        */
        public setPixel(x: any, y: any, color: number): void;
        /**
        *
        * @param x
        * @param y
        * @param color
        */
        public setPixel32(x: any, y: any, color: number): void;
        public setVector(rect: away.geom.Rectangle, inputVector: number[]): void;
        /**
        * Copy an HTMLImageElement or BitmapData object
        *
        * @param img {BitmapData} / {HTMLImageElement}
        * @param sourceRect - source rectange to copy from
        * @param destRect - destinatoin rectange to copy to
        */
        public drawImage(img: BitmapData, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        public drawImage(img: HTMLImageElement, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        private _drawImage(img, sourceRect, destRect);
        /**
        *
        * @param bmpd
        * @param sourceRect
        * @param destRect
        */
        public copyPixels(bmpd: BitmapData, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        public copyPixels(bmpd: HTMLImageElement, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        private _copyPixels(bmpd, sourceRect, destRect);
        /**
        *
        * @param rect
        * @param color
        */
        public fillRect(rect: away.geom.Rectangle, color: number): void;
        /**
        *
        * @param source
        * @param matrix
        */
        public draw(source: BitmapData, matrix?: away.geom.Matrix): any;
        public draw(source: HTMLImageElement, matrix?: away.geom.Matrix): any;
        private _draw(source, matrix);
        public copyChannel(sourceBitmap: BitmapData, sourceRect: away.geom.Rectangle, destPoint: away.geom.Point, sourceChannel: number, destChannel: number): void;
        public colorTransform(rect: away.geom.Rectangle, colorTransform: away.geom.ColorTransform): void;
        /**
        *
        * @returns {ImageData}
        */
        /**
        *
        * @param {ImageData}
        */
        public imageData : ImageData;
        /**
        *
        * @returns {number}
        */
        /**
        *
        * @param {number}
        */
        public width : number;
        /**
        *
        * @returns {number}
        */
        /**
        *
        * @param {number}
        */
        public height : number;
        /**
        *
        * @param {away.geom.Rectangle}
        */
        public rect : away.geom.Rectangle;
        /**
        *
        * @returns {HTMLCanvasElement}
        */
        public canvas : HTMLCanvasElement;
        /**
        *
        * @returns {HTMLCanvasElement}
        */
        public context : CanvasRenderingContext2D;
        /**
        * convert decimal value to Hex
        */
        private hexToRGBACSS(d);
    }
}
declare module away.display {
    class BitmapDataChannel {
        static ALPHA: number;
        static BLUE: number;
        static GREEN: number;
        static RED: number;
    }
}
declare module away.display {
    class BlendMode {
        static ADD: string;
        static ALPHA: string;
        static DARKEN: string;
        static DIFFERENCE: string;
        static ERASE: string;
        static HARDLIGHT: string;
        static INVERT: string;
        static LAYER: string;
        static LIGHTEN: string;
        static MULTIPLY: string;
        static NORMAL: string;
        static OVERLAY: string;
        static SCREEN: string;
        static SHADER: string;
        static SUBTRACT: string;
    }
}
declare module away.display {
    class StageGL extends away.events.EventDispatcher {
        private _contextGL;
        private _canvas;
        private _width;
        private _height;
        private _x;
        private _y;
        constructor(canvas: HTMLCanvasElement);
        public requestContext(aglslContext?: boolean): void;
        public width : number;
        public height : number;
        public x : number;
        public y : number;
        public visible : boolean;
        public canvas : HTMLCanvasElement;
        public contextGL : away.displayGL.ContextGL;
    }
}
declare module away.display {
    class Stage extends away.events.EventDispatcher {
        private static STAGEGL_MAX_QUANTITY;
        public stageGLs: display.StageGL[];
        private _stageHeight;
        private _stageWidth;
        constructor(width?: number, height?: number);
        public resize(width: number, height: number): void;
        public getStageGLAt(index: number): display.StageGL;
        public initStageGLObjects(): void;
        private onContextCreated(e);
        private createHTMLCanvasElement();
        private addChildHTMLElement(canvas);
        public stageWidth : number;
        public stageHeight : number;
        public rect : away.geom.Rectangle;
    }
}
declare module away.displayGL {
    class ContextGLClearMask {
        static COLOR: number;
        static DEPTH: number;
        static STENCIL: number;
        static ALL: number;
    }
}
declare module away.displayGL {
    class VertexBuffer {
        private _gl;
        private _numVertices;
        private _data32PerVertex;
        private _buffer;
        constructor(gl: WebGLRenderingContext, numVertices: number, data32PerVertex: number);
        public uploadFromArray(vertices: number[], startVertex: number, numVertices: number): void;
        public numVertices : number;
        public data32PerVertex : number;
        public glBuffer : WebGLBuffer;
        public dispose(): void;
    }
}
declare module away.displayGL {
    class IndexBuffer {
        private _gl;
        private _numIndices;
        private _buffer;
        constructor(gl: WebGLRenderingContext, numIndices: number);
        public uploadFromArray(data: number[], startOffset: number, count: number): void;
        public dispose(): void;
        public numIndices : number;
        public glBuffer : WebGLBuffer;
    }
}
declare module away.displayGL {
    class Program {
        private _gl;
        private _program;
        private _vertexShader;
        private _fragmentShader;
        constructor(gl: WebGLRenderingContext);
        public upload(vertexProgram: string, fragmentProgram: string): any;
        public dispose(): void;
        public focusProgram(): void;
        public glProgram : WebGLProgram;
    }
}
declare module away.displayGL {
    class SamplerState {
        public wrap: number;
        public filter: number;
        public mipfilter: number;
    }
}
declare module away.displayGL {
    class ContextGLTextureFormat {
        static BGRA: string;
        static BGRA_PACKED: string;
        static BGR_PACKED: string;
        static COMPRESSED: string;
        static COMPRESSED_ALPHA: string;
    }
}
declare module away.displayGL {
    class TextureBase {
        public textureType: string;
        public _gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext);
        public dispose(): void;
    }
}
declare module away.displayGL {
    class Texture extends displayGL.TextureBase {
        public textureType: string;
        private _width;
        private _height;
        private _frameBuffer;
        private _glTexture;
        constructor(gl: WebGLRenderingContext, width: number, height: number);
        public dispose(): void;
        public width : number;
        public height : number;
        public frameBuffer : WebGLFramebuffer;
        public uploadFromHTMLImageElement(image: HTMLImageElement, miplevel?: number): void;
        public uploadFromBitmapData(data: away.display.BitmapData, miplevel?: number): void;
        public glTexture : WebGLTexture;
        public generateFromRenderBuffer(data: away.display.BitmapData): void;
        public generateMipmaps(): void;
    }
}
declare module away.displayGL {
    class CubeTexture extends displayGL.TextureBase {
        public textureType: string;
        private _texture;
        private _size;
        constructor(gl: WebGLRenderingContext, size: number);
        public dispose(): void;
        public uploadFromHTMLImageElement(image: HTMLImageElement, side: number, miplevel?: number): void;
        public uploadFromBitmapData(data: away.display.BitmapData, side: number, miplevel?: number): void;
        public size : number;
        public glTexture : WebGLTexture;
    }
}
declare module away.displayGL {
    class ContextGLTriangleFace {
        static BACK: string;
        static FRONT: string;
        static FRONT_AND_BACK: string;
        static NONE: string;
    }
}
declare module away.displayGL {
    class ContextGLVertexBufferFormat {
        static BYTES_4: string;
        static FLOAT_1: string;
        static FLOAT_2: string;
        static FLOAT_3: string;
        static FLOAT_4: string;
    }
}
declare module away.displayGL {
    class ContextGLProgramType {
        static FRAGMENT: string;
        static VERTEX: string;
    }
}
declare module away.displayGL {
    class ContextGLBlendFactor {
        static DESTINATION_ALPHA: string;
        static DESTINATION_COLOR: string;
        static ONE: string;
        static ONE_MINUS_DESTINATION_ALPHA: string;
        static ONE_MINUS_DESTINATION_COLOR: string;
        static ONE_MINUS_SOURCE_ALPHA: string;
        static ONE_MINUS_SOURCE_COLOR: string;
        static SOURCE_ALPHA: string;
        static SOURCE_COLOR: string;
        static ZERO: string;
    }
}
declare module away.displayGL {
    class ContextGLCompareMode {
        static ALWAYS: string;
        static EQUAL: string;
        static GREATER: string;
        static GREATER_EQUAL: string;
        static LESS: string;
        static LESS_EQUAL: string;
        static NEVER: string;
        static NOT_EQUAL: string;
    }
}
declare module away.displayGL {
    class ContextGLMipFilter {
        static MIPLINEAR: string;
        static MIPNEAREST: string;
        static MIPNONE: string;
    }
}
declare module away.displayGL {
    class ContextGLProfile {
        static BASELINE: string;
        static BASELINE_CONSTRAINED: string;
        static BASELINE_EXTENDED: string;
    }
}
declare module away.displayGL {
    class ContextGLStencilAction {
        static DECREMENT_SATURATE: string;
        static DECREMENT_WRAP: string;
        static INCREMENT_SATURATE: string;
        static INCREMENT_WRAP: string;
        static INVERT: string;
        static KEEP: string;
        static SET: string;
        static ZERO: string;
    }
}
declare module away.displayGL {
    class ContextGLTextureFilter {
        static LINEAR: string;
        static NEAREST: string;
    }
}
declare module away.displayGL {
    class ContextGLWrapMode {
        static CLAMP: string;
        static REPEAT: string;
    }
}
declare module away.displayGL {
    class ContextGL {
        private _drawing;
        private _blendEnabled;
        private _blendSourceFactor;
        private _blendDestinationFactor;
        private _currentWrap;
        private _currentFilter;
        private _currentMipFilter;
        private _indexBufferList;
        private _vertexBufferList;
        private _textureList;
        private _programList;
        private _samplerStates;
        static MAX_SAMPLERS: number;
        public _gl: WebGLRenderingContext;
        public _currentProgram: displayGL.Program;
        constructor(canvas: HTMLCanvasElement);
        public gl(): WebGLRenderingContext;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createCubeTexture(size: number, format: displayGL.ContextGLTextureFormat, optimizeForRenderToTexture: boolean, streamingLevels?: number): displayGL.CubeTexture;
        public createIndexBuffer(numIndices: number): displayGL.IndexBuffer;
        public createProgram(): displayGL.Program;
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): displayGL.Texture;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): displayGL.VertexBuffer;
        public dispose(): void;
        public drawToBitmapData(destination: away.display.BitmapData): void;
        public drawTriangles(indexBuffer: displayGL.IndexBuffer, firstIndex?: number, numTriangles?: number): void;
        public present(): void;
        public setBlendFactors(sourceFactor: string, destinationFactor: string): void;
        public setColorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
        public setCulling(triangleFaceToCull: string): void;
        public setDepthTest(depthMask: boolean, passCompareMode: string): void;
        public setProgram(program: displayGL.Program): void;
        private getUniformLocationNameFromAgalRegisterIndex(programType, firstRegister);
        public setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: away.geom.Matrix3D, transposedMatrix?: boolean): void;
        static modulo: number;
        public setProgramConstantsFromArray(programType: string, firstRegister: number, data: number[], numRegisters?: number): void;
        public setGLSLProgramConstantsFromMatrix(locationName: string, matrix: away.geom.Matrix3D, transposedMatrix?: boolean): void;
        public setGLSLProgramConstantsFromArray(locationName: string, data: number[], startIndex?: number): void;
        public setScissorRectangle(rectangle: away.geom.Rectangle): void;
        public setTextureAt(sampler: number, texture: displayGL.TextureBase): void;
        public setGLSLTextureAt(locationName: string, texture: displayGL.TextureBase, textureIndex: number): void;
        public setSamplerStateAt(sampler: number, wrap: string, filter: string, mipfilter: string): void;
        public setVertexBufferAt(index: number, buffer: displayGL.VertexBuffer, bufferOffset?: number, format?: string): void;
        public setGLSLVertexBufferAt(locationName: any, buffer: displayGL.VertexBuffer, bufferOffset?: number, format?: string): void;
        public setRenderToTexture(target: displayGL.TextureBase, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number): void;
        public setRenderToBackBuffer(): void;
        private updateBlendStatus();
    }
}
declare module away.displayGL {
    class AGLSLContextGL extends displayGL.ContextGL {
        private _yFlip;
        constructor(canvas: HTMLCanvasElement);
        public setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: away.geom.Matrix3D, transposedMatrix?: boolean): void;
        public drawTriangles(indexBuffer: displayGL.IndexBuffer, firstIndex?: number, numTriangles?: number): void;
        public setCulling(triangleFaceToCull: string): void;
    }
}
declare module away.geom {
    class ColorTransform {
        public alphaMultiplier: number;
        public alphaOffset: number;
        public blueMultiplier: number;
        public blueOffset: number;
        public greenMultiplier: number;
        public greenOffset: number;
        public redMultiplier: number;
        public redOffset: number;
        constructor(inRedMultiplier?: number, inGreenMultiplier?: number, inBlueMultiplier?: number, inAlphaMultiplier?: number, inRedOffset?: number, inGreenOffset?: number, inBlueOffset?: number, inAlphaOffset?: number);
        public concat(second: ColorTransform): void;
        public color : number;
    }
}
declare module away.geom {
    class Matrix {
        public a: number;
        public b: number;
        public c: number;
        public d: number;
        public tx: number;
        public ty: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
        *
        * @returns {away.geom.Matrix}
        */
        public clone(): Matrix;
        /**
        *
        * @param m
        */
        public concat(m: Matrix): void;
        /**
        *
        * @param column
        * @param vector3D
        */
        public copyColumnFrom(column: number, vector3D: geom.Vector3D): void;
        /**
        *
        * @param column
        * @param vector3D
        */
        public copyColumnTo(column: number, vector3D: geom.Vector3D): void;
        /**
        *
        * @param other
        */
        public copyFrom(other: Matrix): void;
        /**
        *
        * @param row
        * @param vector3D
        */
        public copyRowFrom(row: number, vector3D: geom.Vector3D): void;
        /**
        *
        * @param row
        * @param vector3D
        */
        public copyRowTo(row: number, vector3D: geom.Vector3D): void;
        /**
        *
        * @param scaleX
        * @param scaleY
        * @param rotation
        * @param tx
        * @param ty
        */
        public createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        /**
        *
        * @param width
        * @param height
        * @param rotation
        * @param tx
        * @param ty
        */
        public createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        /**
        *
        * @param point
        * @returns {away.geom.Point}
        */
        public deltaTransformPoint(point: geom.Point): geom.Point;
        /**
        *
        */
        public identity(): void;
        /**
        *
        * @returns {away.geom.Matrix}
        */
        public invert(): Matrix;
        /**
        *
        * @param m
        * @returns {away.geom.Matrix}
        */
        public mult(m: Matrix): Matrix;
        /**
        *
        * @param angle
        */
        public rotate(angle: number): void;
        /**
        *
        * @param x
        * @param y
        */
        public scale(x: number, y: number): void;
        /**
        *
        * @param angle
        * @param scale
        */
        public setRotation(angle: number, scale?: number): void;
        /**
        *
        * @param a
        * @param b
        * @param c
        * @param d
        * @param tx
        * @param ty
        */
        public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
        *
        * @returns {string}
        */
        public toString(): string;
        /**
        *
        * @param point
        * @returns {away.geom.Point}
        */
        public transformPoint(point: geom.Point): geom.Point;
        /**
        *
        * @param x
        * @param y
        */
        public translate(x: number, y: number): void;
    }
}
declare module away.geom {
    class Matrix3D {
        /**
        * A Vector of 16 Numbers, where every four elements is a column of a 4x4 matrix.
        *
        * <p>An exception is thrown if the rawData property is set to a matrix that is not invertible. The Matrix3D
        * object must be invertible. If a non-invertible matrix is needed, create a subclass of the Matrix3D object.</p>
        */
        public rawData: number[];
        /**
        * Creates a Matrix3D object.
        */
        constructor(v?: number[]);
        /**
        * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
        */
        public append(lhs: Matrix3D): void;
        /**
        * Appends an incremental rotation to a Matrix3D object.
        */
        public appendRotation(degrees: number, axis: geom.Vector3D): void;
        /**
        * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
        */
        public appendScale(xScale: number, yScale: number, zScale: number): void;
        /**
        * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
        */
        public appendTranslation(x: number, y: number, z: number): void;
        /**
        * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
        */
        public clone(): Matrix3D;
        /**
        * Copies a Vector3D object into specific column of the calling Matrix3D object.
        */
        public copyColumnFrom(column: number, vector3D: geom.Vector3D): void;
        /**
        * Copies specific column of the calling Matrix3D object into the Vector3D object.
        */
        public copyColumnTo(column: number, vector3D: geom.Vector3D): void;
        /**
        * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
        */
        public copyFrom(sourceMatrix3D: Matrix3D): void;
        public copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        public copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        /**
        * Copies a Vector3D object into specific row of the calling Matrix3D object.
        */
        public copyRowFrom(row: number, vector3D: geom.Vector3D): void;
        /**
        * Copies specific row of the calling Matrix3D object into the Vector3D object.
        */
        public copyRowTo(row: number, vector3D: geom.Vector3D): void;
        /**
        * Copies this Matrix3D object into a destination Matrix3D object.
        */
        public copyToMatrix3D(dest: Matrix3D): void;
        /**
        * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
        */
        public decompose(orientationStyle?: string): geom.Vector3D[];
        /**
        * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space
        * coordinate to another.
        */
        public deltaTransformVector(v: geom.Vector3D): geom.Vector3D;
        /**
        * Converts the current matrix to an identity or unit matrix.
        */
        public identity(): void;
        /**
        * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
        */
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        /**
        * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
        */
        public interpolateTo(toMat: Matrix3D, percent: number): void;
        /**
        * Inverts the current matrix.
        */
        public invert(): boolean;
        /**
        * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
        */
        public prepend(rhs: Matrix3D): void;
        /**
        * Prepends an incremental rotation to a Matrix3D object.
        */
        public prependRotation(degrees: number, axis: geom.Vector3D): void;
        /**
        * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
        */
        public prependScale(xScale: number, yScale: number, zScale: number): void;
        /**
        * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
        */
        public prependTranslation(x: number, y: number, z: number): void;
        /**
        * Sets the transformation matrix's translation, rotation, and scale settings.
        */
        public recompose(components: geom.Vector3D[]): boolean;
        public transformVector(v: geom.Vector3D): geom.Vector3D;
        /**
        * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
        */
        public transformVectors(vin: number[], vout: number[]): void;
        /**
        * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
        */
        public transpose(): void;
        static getAxisRotation(x: number, y: number, z: number, degrees: number): Matrix3D;
        /**
        * [read-only] A Number that determines whether a matrix is invertible.
        */
        public determinant : number;
        /**
        * A Vector3D object that holds the position, the 3D coordinate (x,y,z) of a display object within the
        * transformation's frame of reference.
        */
        public position : geom.Vector3D;
    }
}
declare module away.geom {
    /**
    * A Quaternion object which can be used to represent rotations.
    */
    class Orientation3D {
        static AXIS_ANGLE: string;
        static EULER_ANGLES: string;
        static QUATERNION: string;
    }
}
declare module away.geom {
    class Point {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
    }
}
declare module away.geom {
    class Rectangle {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        public left : number;
        public right : number;
        public top : number;
        public bottom : number;
        public topLeft : geom.Point;
        public bottomRight : geom.Point;
        public clone(): Rectangle;
    }
}
declare module away.geom {
    class Vector3D {
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        /**
        * The first element of a Vector3D object, such as the x coordinate of a point in the three-dimensional space.
        */
        public x: number;
        public y: number;
        /**
        * The third element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
        */
        public z: number;
        /**
        * The fourth element of a Vector3D object (in addition to the x, y, and z properties) can hold data such as
        * the angle of rotation.
        */
        public w: number;
        /**
        * Creates an instance of a Vector3D object.
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        /**
        * [read-only] The length, magnitude, of the current Vector3D object from the origin (0,0,0) to the object's
        * x, y, and z coordinates.
        * @returns The length of the Vector3D
        */
        public length : number;
        /**
        * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z
        * properties.
        * @returns The squared length of the vector
        */
        public lengthSquared : number;
        /**
        * Adds the value of the x, y, and z elements of the current Vector3D object to the values of the x, y, and z
        * elements of another Vector3D object.
        */
        public add(a: Vector3D): Vector3D;
        /**
        * [static] Returns the angle in radians between two vectors.
        */
        static angleBetween(a: Vector3D, b: Vector3D): number;
        /**
        * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
        */
        public clone(): Vector3D;
        /**
        * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
        */
        public copyFrom(src: Vector3D): void;
        /**
        * Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another
        * Vector3D object.
        */
        public crossProduct(a: Vector3D): Vector3D;
        /**
        * Decrements the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
        * and z elements of specified Vector3D object.
        */
        public decrementBy(a: Vector3D): void;
        /**
        * [static] Returns the distance between two Vector3D objects.
        */
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        /**
        * If the current Vector3D object and the one specified as the parameter are unit vertices, this method returns
        * the cosine of the angle between the two vertices.
        */
        public dotProduct(a: Vector3D): number;
        /**
        * Determines whether two Vector3D objects are equal by comparing the x, y, and z elements of the current
        * Vector3D object with a specified Vector3D object.
        */
        public equals(cmp: Vector3D, allFour?: boolean): boolean;
        /**
        * Increments the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
        * and z elements of a specified Vector3D object.
        */
        public incrementBy(a: Vector3D): void;
        /**
        * Compares the elements of the current Vector3D object with the elements of a specified Vector3D object to
        * determine whether they are nearly equal.
        */
        public nearEquals(cmp: Vector3D, epsilon: number, allFour?: boolean): boolean;
        /**
        * Sets the current Vector3D object to its inverse.
        */
        public negate(): void;
        /**
        * Converts a Vector3D object to a unit vector by dividing the first three elements (x, y, z) by the length of
        * the vector.
        */
        public normalize(): void;
        /**
        * Divides the value of the x, y, and z properties of the current Vector3D object by the value of its w
        * property.
        */
        public project(): void;
        /**
        * Scales the current Vector3D object by a scalar, a magnitude.
        */
        public scaleBy(s: number): void;
        /**
        * Sets the members of Vector3D to the specified values
        */
        public setTo(xa: number, ya: number, za: number): void;
        /**
        * Subtracts the value of the x, y, and z elements of the current Vector3D object from the values of the x, y,
        * and z elements of another Vector3D object.
        */
        public subtract(a: Vector3D): Vector3D;
        /**
        * Returns a string representation of the current Vector3D object.
        */
        public toString(): string;
    }
}
declare module away.geom {
    /**
    * MathConsts provides some commonly used mathematical constants
    */
    class MathConsts {
        /**
        * The amount to multiply with when converting radians to degrees.
        */
        static RADIANS_TO_DEGREES: number;
        /**
        * The amount to multiply with when converting degrees to radians.
        */
        static DEGREES_TO_RADIANS: number;
    }
}
declare module away.geom {
    /**
    * A Quaternion object which can be used to represent rotations.
    */
    class Quaternion {
        /**
        * The x value of the quaternion.
        */
        public x: number;
        /**
        * The y value of the quaternion.
        */
        public y: number;
        /**
        * The z value of the quaternion.
        */
        public z: number;
        /**
        * The w value of the quaternion.
        */
        public w: number;
        /**
        * Creates a new Quaternion object.
        * @param x The x value of the quaternion.
        * @param y The y value of the quaternion.
        * @param z The z value of the quaternion.
        * @param w The w value of the quaternion.
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        /**
        * Returns the magnitude of the quaternion object.
        */
        public magnitude : number;
        /**
        * Fills the quaternion object with the result from a multiplication of two quaternion objects.
        *
        * @param    qa    The first quaternion in the multiplication.
        * @param    qb    The second quaternion in the multiplication.
        */
        public multiply(qa: Quaternion, qb: Quaternion): void;
        public multiplyVector(vector: geom.Vector3D, target?: Quaternion): Quaternion;
        /**
        * Fills the quaternion object with values representing the given rotation around a vector.
        *
        * @param    axis    The axis around which to rotate
        * @param    angle    The angle in radians of the rotation.
        */
        public fromAxisAngle(axis: geom.Vector3D, angle: number): void;
        /**
        * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
        * @param qa The first quaternion to interpolate.
        * @param qb The second quaternion to interpolate.
        * @param t The interpolation weight, a value between 0 and 1.
        */
        public slerp(qa: Quaternion, qb: Quaternion, t: number): void;
        /**
        * Linearly interpolates between two quaternions.
        * @param qa The first quaternion to interpolate.
        * @param qb The second quaternion to interpolate.
        * @param t The interpolation weight, a value between 0 and 1.
        */
        public lerp(qa: Quaternion, qb: Quaternion, t: number): void;
        /**
        * Fills the quaternion object with values representing the given euler rotation.
        *
        * @param    ax        The angle in radians of the rotation around the ax axis.
        * @param    ay        The angle in radians of the rotation around the ay axis.
        * @param    az        The angle in radians of the rotation around the az axis.
        */
        public fromEulerAngles(ax: number, ay: number, az: number): void;
        /**
        * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
        * @param target An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
        * @return The Vector3D containing the Euler angles.
        */
        public toEulerAngles(target?: geom.Vector3D): geom.Vector3D;
        /**
        * Normalises the quaternion object.
        */
        public normalize(val?: number): void;
        /**
        * Used to trace the values of a quaternion.
        *
        * @return A string representation of the quaternion object.
        */
        public toString(): string;
        /**
        * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
        * @param target An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
        * @return A Matrix3D object representing an equivalent rotation.
        */
        public toMatrix3D(target?: geom.Matrix3D): geom.Matrix3D;
        /**
        * Extracts a quaternion rotation matrix out of a given Matrix3D object.
        * @param matrix The Matrix3D out of which the rotation will be extracted.
        */
        public fromMatrix(matrix: geom.Matrix3D): void;
        /**
        * Converts the quaternion to a Vector.&lt;Number&gt; matrix representation of a rotation equivalent to this quaternion.
        * @param target The Vector.&lt;Number&gt; to contain the raw matrix data.
        * @param exclude4thRow If true, the last row will be omitted, and a 4x3 matrix will be generated instead of a 4x4.
        */
        public toRawData(target: number[], exclude4thRow?: boolean): void;
        /**
        * Clones the quaternion.
        * @return An exact duplicate of the current Quaternion.
        */
        public clone(): Quaternion;
        /**
        * Rotates a point.
        * @param vector The Vector3D object to be rotated.
        * @param target An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
        * @return A Vector3D object containing the rotated point.
        */
        public rotatePoint(vector: geom.Vector3D, target?: geom.Vector3D): geom.Vector3D;
        /**
        * Copies the data from a quaternion into this instance.
        * @param q The quaternion to copy from.
        */
        public copyFrom(q: Quaternion): void;
    }
}
declare module away.geom {
    class PlaneClassification {
        static BACK: number;
        static FRONT: number;
        static IN: number;
        static OUT: number;
        static INTERSECT: number;
    }
}
declare module away.geom {
    class Plane3D {
        /**
        * The A coefficient of this plane. (Also the x dimension of the plane normal)
        */
        public a: number;
        /**
        * The B coefficient of this plane. (Also the y dimension of the plane normal)
        */
        public b: number;
        /**
        * The C coefficient of this plane. (Also the z dimension of the plane normal)
        */
        public c: number;
        /**
        * The D coefficient of this plane. (Also the inverse dot product between normal and point)
        */
        public d: number;
        public _iAlignment: number;
        static ALIGN_ANY: number;
        static ALIGN_XY_AXIS: number;
        static ALIGN_YZ_AXIS: number;
        static ALIGN_XZ_AXIS: number;
        /**
        * Create a Plane3D with ABCD coefficients
        */
        constructor(a?: number, b?: number, c?: number, d?: number);
        /**
        * Fills this Plane3D with the coefficients from 3 points in 3d space.
        * @param p0 Vector3D
        * @param p1 Vector3D
        * @param p2 Vector3D
        */
        public fromPoints(p0: geom.Vector3D, p1: geom.Vector3D, p2: geom.Vector3D): void;
        /**
        * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
        * @param normal Vector3D
        * @param point  Vector3D
        */
        public fromNormalAndPoint(normal: geom.Vector3D, point: geom.Vector3D): void;
        /**
        * Normalize this Plane3D
        * @return Plane3D This Plane3D.
        */
        public normalize(): Plane3D;
        /**
        * Returns the signed distance between this Plane3D and the point p.
        * @param p Vector3D
        * @returns Number
        */
        public distance(p: geom.Vector3D): number;
        /**
        * Classify a point against this Plane3D. (in front, back or intersecting)
        * @param p Vector3D
        * @return int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
        */
        public classifyPoint(p: geom.Vector3D, epsilon?: number): number;
        public toString(): string;
    }
}
declare module away.geom {
    /**
    * away.geom.Matrix3DUtils provides additional Matrix3D functions.
    */
    class Matrix3DUtils {
        /**
        * A reference to a Vector to be used as a temporary raw data container, to prevent object creation.
        */
        static RAW_DATA_CONTAINER: number[];
        static CALCULATION_MATRIX: geom.Matrix3D;
        /**
        * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
        *
        * @param    quarternion    The quarterion object to convert.
        */
        static quaternion2matrix(quarternion: geom.Quaternion, m?: geom.Matrix3D): geom.Matrix3D;
        /**
        * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
        * @param    m        The Matrix3D object to use to get the forward vector
        * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
        * @return            The forward vector
        */
        static getForward(m: geom.Matrix3D, v?: geom.Vector3D): geom.Vector3D;
        /**
        * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
        * @param    m        The Matrix3D object to use to get the up vector
        * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
        * @return            The up vector
        */
        static getUp(m: geom.Matrix3D, v?: geom.Vector3D): geom.Vector3D;
        /**
        * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
        * @param    m        The Matrix3D object to use to get the right vector
        * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
        * @return            The right vector
        */
        static getRight(m: geom.Matrix3D, v?: geom.Vector3D): geom.Vector3D;
        /**
        * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
        */
        static compare(m1: geom.Matrix3D, m2: geom.Matrix3D): boolean;
        static lookAt(matrix: geom.Matrix3D, pos: geom.Vector3D, dir: geom.Vector3D, up: geom.Vector3D): void;
        static reflection(plane: geom.Plane3D, target?: geom.Matrix3D): geom.Matrix3D;
    }
}
declare module away.geom {
    class PoissonLookup {
        static _distributions: number[][];
        static initDistributions(): void;
        static getDistribution(n: number): number[];
    }
}
declare module away.net {
    class AssetLoaderContext {
        static UNDEFINED: number;
        static SINGLEPASS_MATERIALS: number;
        static MULTIPASS_MATERIALS: number;
        private _includeDependencies;
        private _dependencyBaseUrl;
        private _embeddedDataByUrl;
        private _remappedUrls;
        private _materialMode;
        private _overrideAbsPath;
        private _overrideFullUrls;
        /**
        * AssetLoaderContext provides configuration for the AssetLoader load() and parse() operations.
        * Use it to configure how (and if) dependencies are loaded, or to map dependency URLs to
        * embedded data.
        *
        * @see away.loading.AssetLoader
        */
        constructor(includeDependencies?: boolean, dependencyBaseUrl?: string);
        /**
        * Defines whether dependencies (all files except the one at the URL given to the load() or
        * parseData() operations) should be automatically loaded. Defaults to true.
        */
        public includeDependencies : boolean;
        /**
        * MaterialMode defines, if the Parser should create SinglePass or MultiPass Materials
        * Options:
        * 0 (Default / undefined) - All Parsers will create SinglePassMaterials, but the AWD2.1parser will create Materials as they are defined in the file
        * 1 (Force SinglePass) - All Parsers create SinglePassMaterials
        * 2 (Force MultiPass) - All Parsers will create MultiPassMaterials
        *
        */
        public materialMode : number;
        /**
        * A base URL that will be prepended to all relative dependency URLs found in a loaded resource.
        * Absolute paths will not be affected by the value of this property.
        */
        public dependencyBaseUrl : string;
        /**
        * Defines whether absolute paths (defined as paths that begin with a "/") should be overridden
        * with the dependencyBaseUrl defined in this context. If this is true, and the base path is
        * "base", /path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
        */
        public overrideAbsolutePaths : boolean;
        /**
        * Defines whether "full" URLs (defined as a URL that includes a scheme, e.g. http://) should be
        * overridden with the dependencyBaseUrl defined in this context. If this is true, and the base
        * path is "base", http://example.com/path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
        */
        public overrideFullURLs : boolean;
        /**
        * Map a URL to another URL, so that files that are referred to by the original URL will instead
        * be loaded from the new URL. Use this when your file structure does not match the one that is
        * expected by the loaded file.
        *
        * @param originalUrl The original URL which is referenced in the loaded resource.
        * @param newUrl The URL from which away.should load the resource instead.
        *
        * @see mapUrlToData()
        */
        public mapUrl(originalUrl: string, newUrl: string): void;
        /**
        * Map a URL to embedded data, so that instead of trying to load a dependency from the URL at
        * which it's referenced, the dependency data will be retrieved straight from the memory instead.
        *
        * @param originalUrl The original URL which is referenced in the loaded resource.
        * @param data The embedded data. Can be ByteArray or a class which can be used to create a bytearray.
        */
        public mapUrlToData(originalUrl: string, data: any): void;
        /**
        * @private
        * Defines whether embedded data has been mapped to a particular URL.
        */
        public _iHasDataForUrl(url: string): boolean;
        /**
        * @private
        * Returns embedded data for a particular URL.
        */
        public _iGetDataForUrl(url: string): any;
        /**
        * @private
        * Defines whether a replacement URL has been mapped to a particular URL.
        */
        public _iHasMappingForUrl(url: string): boolean;
        /**
        * @private
        * Returns new (replacement) URL for a particular original URL.
        */
        public _iGetRemappedUrl(originalUrl: string): string;
    }
}
declare module away.net {
    /**
    * AssetLoader can load any file format that away.supports (or for which a third-party parser
    * has been plugged in) and it's dependencies. Events are dispatched when assets are encountered
    * and for when the resource (or it's dependencies) have been loaded.
    *
    * The AssetLoader will not make assets available in any other way than through the dispatched
    * events. To store assets and make them available at any point from any module in an application,
    * use the AssetLibrary to load and manage assets.
    *
    * @see away.loading.Loader3D
    * @see away.loading.AssetLibrary
    */
    class AssetLoader extends away.events.EventDispatcher {
        private _context;
        private _token;
        private _uri;
        private _errorHandlers;
        private _parseErrorHandlers;
        private _stack;
        private _baseDependency;
        private _loadingDependency;
        private _namespace;
        /**
        * Returns the base dependency of the loader
        */
        public baseDependency : away.parsers.ResourceDependency;
        /**
        * Create a new ResourceLoadSession object.
        */
        constructor();
        /**
        * Enables a specific parser.
        * When no specific parser is set for a loading/parsing opperation,
        * loader3d can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parserClass The parser class to enable.
        *
        * @see away.loaders.parsers.Parsers
        */
        static enableParser(parserClass: any): void;
        /**
        * Enables a list of parsers.
        * When no specific parser is set for a loading/parsing opperation,
        * AssetLoader can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parserClasses A Vector of parser classes to enable.
        * @see away.loaders.parsers.Parsers
        */
        static enableParsers(parserClasses: Object[]): void;
        /**
        * Loads a file and (optionally) all of its dependencies.
        *
        * @param req The URLRequest object containing the URL of the file to be loaded.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public load(req: net.URLRequest, context?: net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): net.AssetLoaderToken;
        /**
        * Loads a resource from already loaded data.
        *
        * @param data The data object containing all resource information.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public loadData(data: any, id: string, context?: net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): net.AssetLoaderToken;
        /**
        * Recursively retrieves the next to-be-loaded and parsed dependency on the stack, or pops the list off the
        * stack when complete and continues on the top set.
        * @param parser The parser that will translate the data into a usable resource.
        */
        private retrieveNext(parser?);
        /**
        * Retrieves a single dependency.
        * @param parser The parser that will translate the data into a usable resource.
        */
        private retrieveDependency(dependency, parser?);
        private joinUrl(base, end);
        private resolveDependencyUrl(dependency);
        private retrieveLoaderDependencies(loader);
        /**
        * Called when a single dependency loading failed, and pushes further dependencies onto the stack.
        * @param event
        */
        private onRetrievalFailed(event);
        /**
        * Called when a dependency parsing failed, and dispatches a <code>ParserEvent.PARSE_ERROR</code>
        * @param event
        */
        private onParserError(event);
        private onAssetComplete(event);
        private onReadyForDependencies(event);
        /**
        * Called when a single dependency was parsed, and pushes further dependencies onto the stack.
        * @param event
        */
        private onRetrievalComplete(event);
        /**
        * Called when an image is too large or it's dimensions are not a power of 2
        * @param event
        */
        private onTextureSizeError(event);
        private addEventListeners(loader);
        private removeEventListeners(loader);
        public stop(): void;
        private dispose();
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
        public _iAddParseErrorHandler(handler: any): void;
        public _iAddErrorHandler(handler: any): void;
    }
}
declare module away.net {
    /**
    * Instances of this class are returned as tokens by loading operations
    * to provide an object on which events can be listened for in cases where
    * the actual asset loader is not directly available (e.g. when using the
    * AssetLibrary to perform the load.)
    *
    * By listening for events on this class instead of directly on the
    * AssetLibrary, one can distinguish different loads from each other.
    *
    * The token will dispatch all events that the original AssetLoader dispatches,
    * while not providing an interface to obstruct the load and is as such a
    * safer return value for loader wrappers than the loader itself.
    */
    class AssetLoaderToken extends away.events.EventDispatcher {
        public _iLoader: net.AssetLoader;
        constructor(loader: net.AssetLoader);
        public addEventListener(type: string, listener: Function, target: Object): void;
        public removeEventListener(type: string, listener: Function, target: Object): void;
        public hasEventListener(type: string, listener?: Function, target?: Object): boolean;
    }
}
declare module away.net {
    /**
    * Interface between SingleFileLoader, and a TypeScript / JavaScript system. JS Does not gracefully convert loaded ByteArrays, BufferArrays, or Blobs to
    * Bitmaps. ]
    *
    * So we have two Types of loaders which need a common interface :
    *
    *      IMGLoader ( for images )
    *      URLLoader ( for data - XMLHttpRequest: text / variables / blobs / Array Buffers / binary data )
    *
    * Which kind of loader a Parser is going to require will need to be specified in ParserBase.
    *
    */
    interface ISingleFileTSLoader extends away.events.IEventDispatcher {
        data: any;
        dataFormat: string;
        load(rep: net.URLRequest): void;
        dispose(): void;
    }
}
declare module away.net {
    /**
    * The SingleFileLoader is used to load a single file, as part of a resource.
    *
    * While SingleFileLoader can be used directly, e.g. to create a third-party asset
    * management system, it's recommended to use any of the classes Loader3D, AssetLoader
    * and AssetLibrary instead in most cases.
    *
    * @see AssetLoader
    * @see away.library.AssetLibrary
    */
    class SingleFileLoader extends away.events.EventDispatcher {
        private _parser;
        private _assets;
        private _req;
        private _fileExtension;
        private _fileName;
        private _loadAsRawData;
        private _materialMode;
        private _data;
        private static _parsers;
        static enableParser(parser: Object): void;
        static enableParsers(parsers: Object[]): void;
        /**
        * Creates a new SingleFileLoader object.
        */
        constructor(materialMode?: number);
        public url : string;
        public data : any;
        public loadAsRawData : boolean;
        /**
        * Load a resource from a file.
        *
        * @param urlRequest The URLRequest object containing the URL of the object to be loaded.
        * @param parser An optional parser object that will translate the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public load(urlRequest: net.URLRequest, parser?: away.parsers.ParserBase, loadAsRawData?: boolean): void;
        /**
        * Loads a resource from already loaded data.
        * @param data The data to be parsed. Depending on the parser type, this can be a ByteArray, String or XML.
        * @param uri The identifier (url or id) of the object to be loaded, mainly used for resource management.
        * @param parser An optional parser object that will translate the data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public parseData(data: any, parser?: away.parsers.ParserBase, req?: net.URLRequest): void;
        /**
        * A reference to the parser that will translate the loaded data into a usable resource.
        */
        public parser : away.parsers.ParserBase;
        /**
        * A list of dependencies that need to be loaded and resolved for the loaded object.
        */
        public dependencies : away.parsers.ResourceDependency[];
        /**
        *
        * @param loaderType
        */
        private getLoader(loaderType);
        /**
        * Splits a url string into base and extension.
        * @param url The url to be decomposed.
        */
        private decomposeFilename(url);
        /**
        * Guesses the parser to be used based on the file extension.
        * @return An instance of the guessed parser.
        */
        private getParserFromSuffix();
        /**
        * Guesses the parser to be used based on the file contents.
        * @param data The data to be parsed.
        * @param uri The url or id of the object to be parsed.
        * @return An instance of the guessed parser.
        */
        private getParserFromData(data);
        /**
        * Cleanups
        */
        private removeListeners(urlLoader);
        /**
        * Called when loading of a file has failed
        */
        private handleUrlLoaderError(event);
        /**
        * Called when loading of a file is complete
        */
        private handleUrlLoaderComplete(event);
        /**
        * Initiates parsing of the loaded data.
        * @param data The data to be parsed.
        */
        private parse(data);
        private onParseError(event);
        private onReadyForDependencies(event);
        private onAssetComplete(event);
        private onTextureSizeError(event);
        /**
        * Called when parsing is complete.
        */
        private onParseComplete(event);
    }
}
declare module away.net {
    class SingleFileImageLoader extends away.events.EventDispatcher implements net.ISingleFileTSLoader {
        private _loader;
        private _data;
        private _dataFormat;
        constructor();
        /**
        *
        * @param req
        */
        public load(req: net.URLRequest): void;
        /**
        *
        */
        public dispose(): void;
        /**
        *
        * @returns {*}
        */
        public data : HTMLImageElement;
        /**
        *
        * @returns {*}
        */
        public dataFormat : string;
        /**
        *
        */
        private initLoader();
        /**
        *
        */
        private disposeLoader();
        /**
        *
        * @param event
        */
        private onLoadComplete(event);
        /**
        *
        * @param event
        */
        private onLoadError(event);
    }
}
declare module away.net {
    class SingleFileURLLoader extends away.events.EventDispatcher implements net.ISingleFileTSLoader {
        private _loader;
        private _data;
        constructor();
        /**
        *
        * @param req
        */
        public load(req: net.URLRequest): void;
        /**
        *
        */
        public dispose(): void;
        /**
        *
        * @returns {*}
        */
        public data : HTMLImageElement;
        /**
        *
        * @returns {*}
        */
        public dataFormat : string;
        /**
        *
        */
        private initLoader();
        /**
        *
        */
        private disposeLoader();
        /**
        *
        * @param event
        */
        private onLoadComplete(event);
        /**
        *
        * @param event
        */
        private onLoadError(event);
    }
}
declare module away.net {
    /**
    *
    */
    class URLRequest {
        /**
        * Object containing data to be transmited with URL Request ( URL Variables / binary / string )
        *
        */
        public data: any;
        /**
        *
        * away.net.URLRequestMethod.GET
        * away.net.URLRequestMethod.POST
        *
        * @type {string}
        */
        public method: string;
        /**
        * Use asynchronous XMLHttpRequest
        * @type {boolean}
        */
        public async: boolean;
        /**
        *
        */
        private _url;
        /**
        
        * @param url
        */
        constructor(url?: string);
        /**
        *
        * @returns {string}
        */
        /**
        *
        * @param value
        */
        public url : string;
        /**
        * dispose
        */
        public dispose(): void;
    }
}
declare module away.net {
    class IMGLoader extends away.events.EventDispatcher {
        private _image;
        private _request;
        private _name;
        private _loaded;
        private _crossOrigin;
        constructor(imageName?: string);
        /**
        * load an image
        * @param request {away.net.URLRequest}
        */
        public load(request: net.URLRequest): void;
        /**
        *
        */
        public dispose(): void;
        /**
        * Get reference to image if it is loaded
        * @returns {HTMLImageElement}
        */
        public image : HTMLImageElement;
        /**
        * Get image width. Returns null is image is not loaded
        * @returns {number}
        */
        public loaded : boolean;
        public crossOrigin : string;
        /**
        * Get image width. Returns null is image is not loaded
        * @returns {number}
        */
        public width : number;
        /**
        * Get image height. Returns null is image is not loaded
        * @returns {number}
        */
        public height : number;
        /**
        * return URL request used to load image
        * @returns {away.net.URLRequest}
        */
        public request : net.URLRequest;
        /**
        * get name of HTMLImageElement
        * @returns {string}
        */
        /**
        * set name of HTMLImageElement
        * @returns {string}
        */
        public name : string;
        /**
        * intialise the image object
        */
        private initImage();
        /**
        * Loading of an image is interrupted
        * @param event
        */
        private onAbort(event);
        /**
        * An error occured when loading the image
        * @param event
        */
        private onError(event);
        /**
        * image is finished loading
        * @param event
        */
        private onLoadComplete(event);
    }
}
declare module away.net {
    class URLLoaderDataFormat {
        /**
        * TEXT
        * @type {string}
        */
        static TEXT: string;
        /**
        * Variables / Value Pairs
        * @type {string}
        */
        static VARIABLES: string;
        /**
        *
        * @type {string}
        */
        static BLOB: string;
        /**
        *
        * @type {string}
        */
        static ARRAY_BUFFER: string;
        /**
        *
        * @type {string}
        */
        static BINARY: string;
    }
}
declare module away.net {
    class URLRequestMethod {
        /**
        *
        * @type {string}
        */
        static POST: string;
        /**
        *
        * @type {string}
        */
        static GET: string;
    }
}
declare module away.net {
    class URLLoader extends away.events.EventDispatcher {
        private _XHR;
        private _bytesLoaded;
        private _bytesTotal;
        private _data;
        private _dataFormat;
        private _request;
        private _loadError;
        constructor();
        /**
        *
        * @param request {away.net.URLRequest}
        */
        public load(request: net.URLRequest): void;
        /**
        *
        */
        public close(): void;
        /**
        *
        */
        public dispose(): void;
        /**
        *
        * @returns {string}
        *      away.net.URLLoaderDataFormat
        */
        /**
        *
        * away.net.URLLoaderDataFormat.BINARY
        * away.net.URLLoaderDataFormat.TEXT
        * away.net.URLLoaderDataFormat.VARIABLES
        *
        * @param format
        */
        public dataFormat : string;
        /**
        *
        * @returns {*}
        */
        public data : any;
        /**
        *
        * @returns {number}
        */
        public bytesLoaded : number;
        /**
        *
        * @returns {number}
        */
        public bytesTotal : number;
        /**
        *
        * @returns {away.net.URLRequest}
        */
        public request : net.URLRequest;
        /**
        *
        * @param xhr
        * @param responseType
        */
        private setResponseType(xhr, responseType);
        /**
        *
        * @param request {away.net.URLRequest}
        */
        private getRequest(request);
        /**
        *
        * @param request {away.net.URLRequest}
        */
        private postRequest(request);
        /**
        *
        * @param error {XMLHttpRequestException}
        */
        private handleXmlHttpRequestException(error);
        /**
        *
        */
        private initXHR();
        /**
        *
        */
        private disposeXHR();
        /**
        *
        * @param source
        */
        public decodeURLVariables(source: string): Object;
        /**
        * When XHR state changes
        * @param event
        */
        private onReadyStateChange(event);
        /**
        * When the request has completed, regardless of whether or not it was successful.
        * @param event
        */
        private onLoadEnd(event);
        /**
        * When the author specified timeout has passed before the request could complete.
        * @param event
        */
        private onTimeOut(event);
        /**
        * When the request has been aborted, either by invoking the abort() method or navigating away from the page.
        * @param event
        */
        private onAbort(event);
        /**
        * While loading and sending data.
        * @param event
        */
        private onProgress(event);
        /**
        * When the request starts.
        * @param event
        */
        private onLoadStart(event);
        /**
        * When the request has successfully completed.
        * @param event
        */
        private onLoadComplete(event);
        /**
        * When the request has failed. ( due to network issues ).
        * @param event
        */
        private onLoadError(event);
    }
}
declare module away.net {
    class URLVariables {
        private _variables;
        /**
        *
        * @param source
        */
        constructor(source?: string);
        /**
        *
        * @param source
        */
        public decode(source: string): void;
        /**
        *
        * @returns {string}
        */
        public toString(): string;
        /**
        *
        * @returns {Object}
        */
        /**
        *
        * @returns {Object}
        */
        public variables : Object;
        /**
        *
        * @returns {Object}
        */
        public formData : FormData;
    }
}
declare module away.ui {
    class Keyboard {
        /**
        * Constant associated with the key code value for the A key (65).
        */
        static A: number;
        /**
        * Constant associated with the key code value for the Alternate (Option) key  (18).
        */
        static ALTERNATE: number;
        /**
        * Select the audio mode
        */
        static AUDIO: number;
        /**
        * Constant associated with the key code value for the B key (66).
        */
        static B: number;
        /**
        * Return to previous page in application
        */
        static BACK: number;
        /**
        * Constant associated with the key code value for the ` key (192).
        */
        static BACKQUOTE: number;
        /**
        * Constant associated with the key code value for the \ key (220).
        */
        static BACKSLASH: number;
        /**
        * Constant associated with the key code value for the Backspace key (8).
        */
        static BACKSPACE: number;
        /**
        * Blue function key button
        */
        static BLUE: number;
        /**
        * Constant associated with the key code value for the C key (67).
        */
        static C: number;
        /**
        * Constant associated with the key code value for the Caps Lock key (20).
        */
        static CAPS_LOCK: number;
        /**
        * Channel down
        */
        static CHANNEL_DOWN: number;
        /**
        * Channel up
        */
        static CHANNEL_UP: number;
        /**
        * Constant associated with the key code value for the , key (188).
        */
        static COMMA: number;
        /**
        * Constant associated with the Mac command key (15). This constant is
        * currently only used for setting menu key equivalents.
        */
        static COMMAND: number;
        /**
        * Constant associated with the key code value for the Control key (17).
        */
        static CONTROL: number;
        /**
        * An array containing all the defined key name constants.
        */
        static CharCodeStrings: any[];
        /**
        * Constant associated with the key code value for the D key (68).
        */
        static D: number;
        /**
        * Constant associated with the key code value for the Delete key (46).
        */
        static DELETE: number;
        /**
        * Constant associated with the key code value for the Down Arrow key (40).
        */
        static DOWN: number;
        /**
        * Engage DVR application mode
        */
        static DVR: number;
        /**
        * Constant associated with the key code value for the E key (69).
        */
        static E: number;
        /**
        * Constant associated with the key code value for the End key (35).
        */
        static END: number;
        /**
        * Constant associated with the key code value for the Enter key (13).
        */
        static ENTER: number;
        /**
        * Constant associated with the key code value for the = key (187).
        */
        static EQUAL: number;
        /**
        * Constant associated with the key code value for the Escape key (27).
        */
        static ESCAPE: number;
        /**
        * Exits current application mode
        */
        static EXIT: number;
        /**
        * Constant associated with the key code value for the F key (70).
        */
        static F: number;
        /**
        * Constant associated with the key code value for the F1 key (112).
        */
        static F1: number;
        /**
        * Constant associated with the key code value for the F10 key (121).
        */
        static F10: number;
        /**
        * Constant associated with the key code value for the F11 key (122).
        */
        static F11: number;
        /**
        * Constant associated with the key code value for the F12 key (123).
        */
        static F12: number;
        /**
        * Constant associated with the key code value for the F13 key (124).
        */
        static F13: number;
        /**
        * Constant associated with the key code value for the F14 key (125).
        */
        static F14: number;
        /**
        * Constant associated with the key code value for the F15 key (126).
        */
        static F15: number;
        /**
        * Constant associated with the key code value for the F2 key (113).
        */
        static F2: number;
        /**
        * Constant associated with the key code value for the F3 key (114).
        */
        static F3: number;
        /**
        * Constant associated with the key code value for the F4 key (115).
        */
        static F4: number;
        /**
        * Constant associated with the key code value for the F5 key (116).
        */
        static F5: number;
        /**
        * Constant associated with the key code value for the F6 key (117).
        */
        static F6: number;
        /**
        * Constant associated with the key code value for the F7 key (118).
        */
        static F7: number;
        /**
        * Constant associated with the key code value for the F8 key (119).
        */
        static F8: number;
        /**
        * Constant associated with the key code value for the F9 key (120).
        */
        static F9: number;
        /**
        * Engage fast-forward transport mode
        */
        static FAST_FORWARD: number;
        /**
        * Constant associated with the key code value for the G key (71).
        */
        static G: number;
        /**
        * Green function key button
        */
        static GREEN: number;
        /**
        * Engage program guide
        */
        static GUIDE: number;
        /**
        * Constant associated with the key code value for the H key (72).
        */
        static H: number;
        /**
        * Engage help application or context-sensitive help
        */
        static HELP: number;
        /**
        * Constant associated with the key code value for the Home key (36).
        */
        static HOME: number;
        /**
        * Constant associated with the key code value for the I key (73).
        */
        static I: number;
        /**
        * Info button
        */
        static INFO: number;
        /**
        * Cycle input
        */
        static INPUT: number;
        /**
        * Constant associated with the key code value for the Insert key (45).
        */
        static INSERT: number;
        /**
        * Constant associated with the key code value for the J key (74).
        */
        static J: number;
        /**
        * Constant associated with the key code value for the K key (75).
        */
        static K: number;
        /**
        * The Begin key
        */
        static KEYNAME_BEGIN: string;
        /**
        * The Break key
        */
        static KEYNAME_BREAK: string;
        /**
        * The Clear Display key
        */
        static KEYNAME_CLEARDISPLAY: string;
        /**
        * The Clear Line key
        */
        static KEYNAME_CLEARLINE: string;
        /**
        * The Delete key
        */
        static KEYNAME_DELETE: string;
        /**
        * The Delete Character key
        */
        static KEYNAME_DELETECHAR: string;
        /**
        * The Delete Line key
        */
        static KEYNAME_DELETELINE: string;
        /**
        * The down arrow
        */
        static KEYNAME_DOWNARROW: string;
        /**
        * The End key
        */
        static KEYNAME_END: string;
        /**
        * The Execute key
        */
        static KEYNAME_EXECUTE: string;
        /**
        * The F1 key
        */
        static KEYNAME_F1: string;
        /**
        * The F10 key
        */
        static KEYNAME_F10: string;
        /**
        * The F11 key
        */
        static KEYNAME_F11: string;
        /**
        * The F12 key
        */
        static KEYNAME_F12: string;
        /**
        * The F13 key
        */
        static KEYNAME_F13: string;
        /**
        * The F14 key
        */
        static KEYNAME_F14: string;
        /**
        * The F15 key
        */
        static KEYNAME_F15: string;
        /**
        * The F16 key
        */
        static KEYNAME_F16: string;
        /**
        * The F17 key
        */
        static KEYNAME_F17: string;
        /**
        * The F18 key
        */
        static KEYNAME_F18: string;
        /**
        * The F19 key
        */
        static KEYNAME_F19: string;
        /**
        * The F2 key
        */
        static KEYNAME_F2: string;
        /**
        * The F20 key
        */
        static KEYNAME_F20: string;
        /**
        * The F21 key
        */
        static KEYNAME_F21: string;
        /**
        * The F22 key
        */
        static KEYNAME_F22: string;
        /**
        * The F23 key
        */
        static KEYNAME_F23: string;
        /**
        * The F24 key
        */
        static KEYNAME_F24: string;
        /**
        * The F25 key
        */
        static KEYNAME_F25: string;
        /**
        * The F26 key
        */
        static KEYNAME_F26: string;
        /**
        * The F27 key
        */
        static KEYNAME_F27: string;
        /**
        * The F28 key
        */
        static KEYNAME_F28: string;
        /**
        * The F29 key
        */
        static KEYNAME_F29: string;
        /**
        * The F3 key
        */
        static KEYNAME_F3: string;
        /**
        * The F30 key
        */
        static KEYNAME_F30: string;
        /**
        * The F31 key
        */
        static KEYNAME_F31: string;
        /**
        * The F32 key
        */
        static KEYNAME_F32: string;
        /**
        * The F33 key
        */
        static KEYNAME_F33: string;
        /**
        * The F34 key
        */
        static KEYNAME_F34: string;
        /**
        * The F35 key
        */
        static KEYNAME_F35: string;
        /**
        * The F4 key
        */
        static KEYNAME_F4: string;
        /**
        * The F5 key
        */
        static KEYNAME_F5: string;
        /**
        * The F6 key
        */
        static KEYNAME_F6: string;
        /**
        * The F7 key
        */
        static KEYNAME_F7: string;
        /**
        * The F8 key
        */
        static KEYNAME_F8: string;
        /**
        * The F9 key
        */
        static KEYNAME_F9: string;
        /**
        * The Find key
        */
        static KEYNAME_FIND: string;
        /**
        * The Help key
        */
        static KEYNAME_HELP: string;
        /**
        * The Home key
        */
        static KEYNAME_HOME: string;
        /**
        * The Insert key
        */
        static KEYNAME_INSERT: string;
        /**
        * The Insert Character key
        */
        static KEYNAME_INSERTCHAR: string;
        /**
        * The Insert Line key
        */
        static KEYNAME_INSERTLINE: string;
        /**
        * The left arrow
        */
        static KEYNAME_LEFTARROW: string;
        /**
        * The Menu key
        */
        static KEYNAME_MENU: string;
        /**
        * The Mode Switch key
        */
        static KEYNAME_MODESWITCH: string;
        /**
        * The Next key
        */
        static KEYNAME_NEXT: string;
        /**
        * The Page Down key
        */
        static KEYNAME_PAGEDOWN: string;
        /**
        * The Page Up key
        */
        static KEYNAME_PAGEUP: string;
        /**
        * The Pause key
        */
        static KEYNAME_PAUSE: string;
        /**
        * The Previous key
        */
        static KEYNAME_PREV: string;
        /**
        * The PRINT key
        */
        static KEYNAME_PRINT: string;
        /**
        * The PRINT Screen
        */
        static KEYNAME_PRINTSCREEN: string;
        /**
        * The Redo key
        */
        static KEYNAME_REDO: string;
        /**
        * The Reset key
        */
        static KEYNAME_RESET: string;
        /**
        * The right arrow
        */
        static KEYNAME_RIGHTARROW: string;
        /**
        * The Scroll Lock key
        */
        static KEYNAME_SCROLLLOCK: string;
        /**
        * The Select key
        */
        static KEYNAME_SELECT: string;
        /**
        * The Stop key
        */
        static KEYNAME_STOP: string;
        /**
        * The System Request key
        */
        static KEYNAME_SYSREQ: string;
        /**
        * The System key
        */
        static KEYNAME_SYSTEM: string;
        /**
        * The Undo key
        */
        static KEYNAME_UNDO: string;
        /**
        * The up arrow
        */
        static KEYNAME_UPARROW: string;
        /**
        * The User key
        */
        static KEYNAME_USER: string;
        /**
        * Constant associated with the key code value for the L key (76).
        */
        static L: number;
        /**
        * Watch last channel or show watched
        */
        static LAST: number;
        /**
        * Constant associated with the key code value for the Left Arrow key (37).
        */
        static LEFT: number;
        /**
        * Constant associated with the key code value for the [ key (219).
        */
        static LEFTBRACKET: number;
        /**
        * Return to live [position in broadcast]
        */
        static LIVE: number;
        /**
        * Constant associated with the key code value for the M key (77).
        */
        static M: number;
        /**
        * Engage "Master Shell" e.g. TiVo or other vendor button
        */
        static MASTER_SHELL: number;
        /**
        * Engage menu
        */
        static MENU: number;
        /**
        * Constant associated with the key code value for the - key (189).
        */
        static MINUS: number;
        /**
        * Constant associated with the key code value for the N key (78).
        */
        static N: number;
        /**
        * Skip to next track or chapter
        */
        static NEXT: number;
        /**
        * Constant associated with the key code value for the 0 key (48).
        */
        static NUMBER_0: number;
        /**
        * Constant associated with the key code value for the 1 key (49).
        */
        static NUMBER_1: number;
        /**
        * Constant associated with the key code value for the 2 key (50).
        */
        static NUMBER_2: number;
        /**
        * Constant associated with the key code value for the 3 key (51).
        */
        static NUMBER_3: number;
        /**
        * Constant associated with the key code value for the 4 key (52).
        */
        static NUMBER_4: number;
        /**
        * Constant associated with the key code value for the 5 key (53).
        */
        static NUMBER_5: number;
        /**
        * Constant associated with the key code value for the 6 key (54).
        */
        static NUMBER_6: number;
        /**
        * Constant associated with the key code value for the 7 key (55).
        */
        static NUMBER_7: number;
        /**
        * Constant associated with the key code value for the 8 key (56).
        */
        static NUMBER_8: number;
        /**
        * Constant associated with the key code value for the 9 key (57).
        */
        static NUMBER_9: number;
        /**
        * Constant associated with the pseudo-key code for the the number pad (21). Use to set numpad modifier on key equivalents
        */
        static NUMPAD: number;
        /**
        * Constant associated with the key code value for the number 0 key on the number pad (96).
        */
        static NUMPAD_0: number;
        /**
        * Constant associated with the key code value for the number 1 key on the number pad (97).
        */
        static NUMPAD_1: number;
        /**
        * Constant associated with the key code value for the number 2 key on the number pad (98).
        */
        static NUMPAD_2: number;
        /**
        * Constant associated with the key code value for the number 3 key on the number pad (99).
        */
        static NUMPAD_3: number;
        /**
        * Constant associated with the key code value for the number 4 key on the number pad (100).
        */
        static NUMPAD_4: number;
        /**
        * Constant associated with the key code value for the number 5 key on the number pad (101).
        */
        static NUMPAD_5: number;
        /**
        * Constant associated with the key code value for the number 6 key on the number pad (102).
        */
        static NUMPAD_6: number;
        /**
        * Constant associated with the key code value for the number 7 key on the number pad (103).
        */
        static NUMPAD_7: number;
        /**
        * Constant associated with the key code value for the number 8 key on the number pad (104).
        */
        static NUMPAD_8: number;
        /**
        * Constant associated with the key code value for the number 9 key on the number pad (105).
        */
        static NUMPAD_9: number;
        /**
        * Constant associated with the key code value for the addition key on the number pad (107).
        */
        static NUMPAD_ADD: number;
        /**
        * Constant associated with the key code value for the decimal key on the number pad (110).
        */
        static NUMPAD_DECIMAL: number;
        /**
        * Constant associated with the key code value for the division key on the number pad (111).
        */
        static NUMPAD_DIVIDE: number;
        /**
        * Constant associated with the key code value for the Enter key on the number pad (108).
        */
        static NUMPAD_ENTER: number;
        /**
        * Constant associated with the key code value for the multiplication key on the number pad (106).
        */
        static NUMPAD_MULTIPLY: number;
        /**
        * Constant associated with the key code value for the subtraction key on the number pad (109).
        */
        static NUMPAD_SUBTRACT: number;
        /**
        * Constant associated with the key code value for the O key (79).
        */
        static O: number;
        /**
        * Constant associated with the key code value for the P key (80).
        */
        static P: number;
        /**
        * Constant associated with the key code value for the Page Down key (34).
        */
        static PAGE_DOWN: number;
        /**
        * Constant associated with the key code value for the Page Up key (33).
        */
        static PAGE_UP: number;
        /**
        * Engage pause transport mode
        */
        static PAUSE: number;
        /**
        * Constant associated with the key code value for the . key (190).
        */
        static PERIOD: number;
        /**
        * Engage play transport mode
        */
        static PLAY: number;
        /**
        * Skip to previous track or chapter
        */
        static PREVIOUS: number;
        /**
        * Constant associated with the key code value for the Q key (81).
        */
        static Q: number;
        /**
        * Constant associated with the key code value for the ' key (222).
        */
        static QUOTE: number;
        /**
        * Constant associated with the key code value for the R key (82).
        */
        static R: number;
        /**
        * Record item or engage record transport mode
        */
        static RECORD: number;
        /**
        * Red function key button
        */
        static RED: number;
        /**
        * Engage rewind transport mode
        */
        static REWIND: number;
        /**
        * Constant associated with the key code value for the Right Arrow key (39).
        */
        static RIGHT: number;
        /**
        * Constant associated with the key code value for the ] key (221).
        */
        static RIGHTBRACKET: number;
        /**
        * Constant associated with the key code value for the S key (83).
        */
        static S: number;
        /**
        * Search button
        */
        static SEARCH: number;
        /**
        * Constant associated with the key code value for the ; key (186).
        */
        static SEMICOLON: number;
        /**
        * Engage setup application or menu
        */
        static SETUP: number;
        /**
        * Constant associated with the key code value for the Shift key (16).
        */
        static SHIFT: number;
        /**
        * Quick skip backward (usually 7-10 seconds)
        */
        static SKIP_BACKWARD: number;
        /**
        * Quick skip ahead (usually 30 seconds)
        */
        static SKIP_FORWARD: number;
        /**
        * Constant associated with the key code value for the / key (191).
        */
        static SLASH: number;
        /**
        * Constant associated with the key code value for the Spacebar (32).
        */
        static SPACE: number;
        /**
        * Engage stop transport mode
        */
        static STOP: number;
        /**
        * Toggle subtitles
        */
        static SUBTITLE: number;
        /**
        * Constant associated with the key code value for the T key (84).
        */
        static T: number;
        /**
        * Constant associated with the key code value for the Tab key (9).
        */
        static TAB: number;
        /**
        * Constant associated with the key code value for the U key (85).
        */
        static U: number;
        /**
        * Constant associated with the key code value for the Up Arrow key (38).
        */
        static UP: number;
        /**
        * Constant associated with the key code value for the V key (86).
        */
        static V: number;
        /**
        * Engage video-on-demand
        */
        static VOD: number;
        /**
        * Constant associated with the key code value for the W key (87).
        */
        static W: number;
        /**
        * Constant associated with the key code value for the X key (88).
        */
        static X: number;
        /**
        * Constant associated with the key code value for the Y key (89).
        */
        static Y: number;
        /**
        * Yellow function key button
        */
        static YELLOW: number;
        /**
        * Constant associated with the key code value for the Z key (90).
        */
        static Z: number;
    }
}
declare module away.managers {
    class RTTBufferManager extends away.events.EventDispatcher {
        private static _instances;
        private _renderToTextureVertexBuffer;
        private _renderToScreenVertexBuffer;
        private _indexBuffer;
        private _stageGLProxy;
        private _viewWidth;
        private _viewHeight;
        private _textureWidth;
        private _textureHeight;
        private _renderToTextureRect;
        private _buffersInvalid;
        private _textureRatioX;
        private _textureRatioY;
        constructor(se: SingletonEnforcer, stageGLProxy: managers.StageGLProxy);
        static getInstance(stageGLProxy: managers.StageGLProxy): RTTBufferManager;
        private static getRTTBufferManagerFromStageGLProxy(stageGLProxy);
        private static deleteRTTBufferManager(stageGLProxy);
        public textureRatioX : number;
        public textureRatioY : number;
        public viewWidth : number;
        public viewHeight : number;
        public renderToTextureVertexBuffer : away.displayGL.VertexBuffer;
        public renderToScreenVertexBuffer : away.displayGL.VertexBuffer;
        public indexBuffer : away.displayGL.IndexBuffer;
        public renderToTextureRect : away.geom.Rectangle;
        public textureWidth : number;
        public textureHeight : number;
        public dispose(): void;
        private updateRTTBuffers();
    }
}
declare class RTTBufferManagerVO {
    constructor();
    public stage3dProxy: away.managers.StageGLProxy;
    public rttbfm: away.managers.RTTBufferManager;
}
declare class SingletonEnforcer {
}
declare module away.managers {
    /**
    * StageGLProxy provides a proxy class to manage a single StageGL instance as well as handling the creation and
    * attachment of the ContextGL (and in turn the back buffer) is uses. StageGLProxy should never be created directly,
    * but requested through StageGLManager.
    *
    * @see away.managers.StageGLProxy
    *
    * todo: consider moving all creation methods (createVertexBuffer etc) in here, so that disposal can occur here
    * along with the context, instead of scattered throughout the framework
    */
    class StageGLProxy extends away.events.EventDispatcher {
        public _iContextGL: away.displayGL.ContextGL;
        public _iStageGLIndex: number;
        private _usesSoftwareRendering;
        private _profile;
        private _stageGL;
        private _activeProgram;
        private _stageGLManager;
        private _backBufferWidth;
        private _backBufferHeight;
        private _antiAlias;
        private _enableDepthAndStencil;
        private _contextRequested;
        private _renderTarget;
        private _renderSurfaceSelector;
        private _scissorRect;
        private _color;
        private _backBufferDirty;
        private _viewPort;
        private _enterFrame;
        private _exitFrame;
        private _viewportUpdated;
        private _viewportDirty;
        private _bufferClear;
        private notifyViewportUpdated();
        private notifyEnterFrame();
        private notifyExitFrame();
        /**
        * Creates a StageGLProxy object. This method should not be called directly. Creation of StageGLProxy objects should
        * be handled by StageGLManager.
        * @param stageGLIndex The index of the StageGL to be proxied.
        * @param stageGL The StageGL to be proxied.
        * @param stageGLManager
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        */
        constructor(stageGLIndex: number, stageGL: away.display.StageGL, stageGLManager: managers.StageGLManager, forceSoftware?: boolean, profile?: string);
        public profile : string;
        /**
        * Disposes the StageGLProxy object, freeing the ContextGL attached to the StageGL.
        */
        public dispose(): void;
        /**
        * Configures the back buffer associated with the StageGL object.
        * @param backBufferWidth The width of the backbuffer.
        * @param backBufferHeight The height of the backbuffer.
        * @param antiAlias The amount of anti-aliasing to use.
        * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
        */
        public configureBackBuffer(backBufferWidth: number, backBufferHeight: number, antiAlias: number, enableDepthAndStencil: boolean): void;
        public enableDepthAndStencil : boolean;
        public renderTarget : away.displayGL.TextureBase;
        public renderSurfaceSelector : number;
        public setRenderTarget(target: away.displayGL.TextureBase, enableDepthAndStencil?: boolean, surfaceSelector?: number): void;
        public clear(): void;
        public present(): void;
        public addEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch StageGLProxy out of automatic render mode.
        * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
        *
        * @param type The type of event.
        * @param listener The listener object to remove.
        * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
        */
        public removeEventListener(type: string, listener: Function, target: Object): void;
        public scissorRect : away.geom.Rectangle;
        /**
        * The index of the StageGL which is managed by this instance of StageGLProxy.
        */
        public stageGLIndex : number;
        /**
        * The base StageGL object associated with this proxy.
        */
        public stageGL : away.display.StageGL;
        /**
        * The ContextGL object associated with the given StageGL object.
        */
        public contextGL : away.displayGL.ContextGL;
        /**
        * Indicates whether the StageGL managed by this proxy is running in software mode.
        * Remember to wait for the CONTEXTGL_CREATED event before checking this property,
        * as only then will it be guaranteed to be accurate.
        */
        public usesSoftwareRendering : boolean;
        /**
        * The x position of the StageGL.
        */
        public x : number;
        /**
        * The y position of the StageGL.
        */
        public y : number;
        /**
        *
        * @returns {HTMLCanvasElement}
        */
        public canvas : HTMLCanvasElement;
        /**
        * The width of the StageGL.
        */
        public width : number;
        /**
        * The height of the StageGL.
        */
        public height : number;
        /**
        * The antiAliasing of the StageGL.
        */
        public antiAlias : number;
        /**
        * A viewPort rectangle equivalent of the StageGL size and position.
        */
        public viewPort : away.geom.Rectangle;
        /**
        * The background color of the StageGL.
        */
        public color : number;
        /**
        * The visibility of the StageGL.
        */
        public visible : boolean;
        /**
        * The freshly cleared state of the backbuffer before any rendering
        */
        public bufferClear : boolean;
        /**
        * Frees the ContextGL associated with this StageGLProxy.
        */
        private freeContextGL();
        private onContextGLUpdate(event);
        /**
        * Requests a ContextGL object to attach to the managed StageGL.
        */
        private requestContext(forceSoftware?, profile?);
        /**
        * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
        * Typically the proxy.ENTER_FRAME listener would render the layers for this StageGL instance.
        */
        private onEnterFrame(event);
        public recoverFromDisposal(): boolean;
        public clearDepthBuffer(): void;
    }
}
declare module away.managers {
    /**
    * The StageGLManager class provides a multiton object that handles management for StageGL objects. StageGL objects
    * should not be requested directly, but are exposed by a StageGLProxy.
    *
    * @see away.core.managers.StageGLProxy
    */
    class StageGLManager {
        private static _instances;
        private static _stageProxies;
        private static _numStageProxies;
        private _stage;
        /**
        * Creates a new StageGLManager class.
        * @param stage The Stage object that contains the StageGL objects to be managed.
        * @private
        */
        constructor(stage: away.display.Stage, StageGLManagerSingletonEnforcer: StageGLManagerSingletonEnforcer);
        /**
        * Gets a StageGLManager instance for the given Stage object.
        * @param stage The Stage object that contains the StageGL objects to be managed.
        * @return The StageGLManager instance for the given Stage object.
        */
        static getInstance(stage: away.display.Stage): StageGLManager;
        /**
        *
        * @param stage
        * @returns {  away.managers.StageGLManager }
        * @constructor
        */
        private static getStageGLManagerByStageRef(stage);
        /**
        * Requests the StageGLProxy for the given index.
        * @param index The index of the requested StageGL.
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        * @param profile The compatibility profile, an enumeration of ContextGLProfile
        * @return The StageGLProxy for the given index.
        */
        public getStageGLProxy(index: number, forceSoftware?: boolean, profile?: string): managers.StageGLProxy;
        /**
        * Removes a StageGLProxy from the manager.
        * @param stageGLProxy
        * @private
        */
        public iRemoveStageGLProxy(stageGLProxy: managers.StageGLProxy): void;
        /**
        * Get the next available stageGLProxy. An error is thrown if there are no StageGLProxies available
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        * @param profile The compatibility profile, an enumeration of ContextGLProfile
        * @return The allocated stageGLProxy
        */
        public getFreeStageGLProxy(forceSoftware?: boolean, profile?: string): managers.StageGLProxy;
        /**
        * Checks if a new stageGLProxy can be created and managed by the class.
        * @return true if there is one slot free for a new stageGLProxy
        */
        public hasFreeStageGLProxy : boolean;
        /**
        * Returns the amount of stageGLProxy objects that can be created and managed by the class
        * @return the amount of free slots
        */
        public numProxySlotsFree : number;
        /**
        * Returns the amount of StageGLProxy objects currently managed by the class.
        * @return the amount of slots used
        */
        public numProxySlotsUsed : number;
        /**
        * Returns the maximum amount of StageGLProxy objects that can be managed by the class
        * @return the maximum amount of StageGLProxy objects that can be managed by the class
        */
        public numProxySlotsTotal : number;
    }
}
declare class StageGLManagerInstanceData {
    public stage: away.display.Stage;
    public stageGLManager: away.managers.StageGLManager;
}
declare class StageGLManagerSingletonEnforcer {
}
declare module away.textures {
    class TextureProxyBase extends away.library.NamedAssetBase implements away.library.IAsset {
        private _format;
        private _hasMipmaps;
        private _textures;
        private _dirty;
        public _pWidth: number;
        public _pHeight: number;
        constructor();
        /**
        *
        * @returns {boolean}
        */
        public hasMipMaps : boolean;
        /**
        *
        * @returns {string}
        */
        public format : string;
        /**
        *
        * @returns {string}
        */
        public assetType : string;
        /**
        *
        * @returns {number}
        */
        public width : number;
        /**
        *
        * @returns {number}
        */
        public height : number;
        public getTextureForStageGL(stageGLProxy: away.managers.StageGLProxy): away.displayGL.TextureBase;
        /**
        *
        * @param texture
        * @private
        */
        public pUploadContent(texture: away.displayGL.TextureBase): void;
        /**
        *
        * @param width
        * @param height
        * @private
        */
        public pSetSize(width: number, height: number): void;
        /**
        *
        */
        public invalidateContent(): void;
        /**
        *
        * @private
        */
        public pInvalidateSize(): void;
        /**
        *
        * @param context
        * @private
        */
        public pCreateTexture(context: away.displayGL.ContextGL): away.displayGL.TextureBase;
        /**
        * @inheritDoc
        */
        public dispose(): void;
    }
}
declare module away.textures {
    class Texture2DBase extends textures.TextureProxyBase {
        constructor();
        public pCreateTexture(context: away.displayGL.ContextGL): away.displayGL.TextureBase;
    }
}
declare module away.textures {
    class HTMLImageElementTexture extends textures.Texture2DBase {
        private static _mipMaps;
        private static _mipMapUses;
        private _htmlImageElement;
        private _generateMipmaps;
        private _mipMapHolder;
        constructor(htmlImageElement: HTMLImageElement, generateMipmaps?: boolean);
        public htmlImageElement : HTMLImageElement;
        public pUploadContent(texture: away.displayGL.TextureBase): void;
        private getMipMapHolder();
        private freeMipMapHolder();
        public dispose(): void;
    }
}
declare module away.textures {
    class BitmapTexture extends textures.Texture2DBase {
        private static _mipMaps;
        private static _mipMapUses;
        private _bitmapData;
        private _mipMapHolder;
        private _generateMipmaps;
        constructor(bitmapData: away.display.BitmapData, generateMipmaps?: boolean);
        public bitmapData : away.display.BitmapData;
        public pUploadContent(texture: away.displayGL.TextureBase): void;
        private getMipMapHolder();
        private freeMipMapHolder();
        public dispose(): void;
    }
}
declare module away.textures {
    class CubeTextureBase extends textures.TextureProxyBase {
        constructor();
        public size : number;
        public pCreateTexture(context: away.displayGL.ContextGL): away.displayGL.TextureBase;
    }
}
declare module away.textures {
    class RenderTexture extends textures.Texture2DBase {
        constructor(width: number, height: number);
        /**
        *
        * @returns {number}
        */
        public width : number;
        /**
        *
        * @returns {number}
        */
        public height : number;
        public pUploadContent(texture: away.displayGL.TextureBase): void;
        public pCreateTexture(context: away.displayGL.ContextGL): away.displayGL.TextureBase;
    }
}
declare module away.textures {
    class HTMLImageElementCubeTexture extends textures.CubeTextureBase {
        private _bitmapDatas;
        private _useMipMaps;
        constructor(posX: HTMLImageElement, negX: HTMLImageElement, posY: HTMLImageElement, negY: HTMLImageElement, posZ: HTMLImageElement, negZ: HTMLImageElement);
        /**
        * The texture on the cube's right face.
        */
        public positiveX : HTMLImageElement;
        /**
        * The texture on the cube's left face.
        */
        public negativeX : HTMLImageElement;
        /**
        * The texture on the cube's top face.
        */
        public positiveY : HTMLImageElement;
        /**
        * The texture on the cube's bottom face.
        */
        public negativeY : HTMLImageElement;
        /**
        * The texture on the cube's far face.
        */
        public positiveZ : HTMLImageElement;
        /**
        * The texture on the cube's near face.
        */
        public negativeZ : HTMLImageElement;
        private testSize(value);
        public pUploadContent(texture: away.displayGL.TextureBase): void;
    }
}
declare module away.textures {
    class BitmapCubeTexture extends textures.CubeTextureBase {
        private _bitmapDatas;
        private _useMipMaps;
        constructor(posX: away.display.BitmapData, negX: away.display.BitmapData, posY: away.display.BitmapData, negY: away.display.BitmapData, posZ: away.display.BitmapData, negZ: away.display.BitmapData);
        /**
        * The texture on the cube's right face.
        */
        public positiveX : away.display.BitmapData;
        /**
        * The texture on the cube's left face.
        */
        public negativeX : away.display.BitmapData;
        /**
        * The texture on the cube's top face.
        */
        public positiveY : away.display.BitmapData;
        /**
        * The texture on the cube's bottom face.
        */
        public negativeY : away.display.BitmapData;
        /**
        * The texture on the cube's far face.
        */
        public positiveZ : away.display.BitmapData;
        /**
        * The texture on the cube's near face.
        */
        public negativeZ : away.display.BitmapData;
        private testSize(value);
        public pUploadContent(texture: away.displayGL.TextureBase): void;
    }
}
declare module away.textures {
    /**
    * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
    */
    class MipmapGenerator {
        private static _matrix;
        private static _rect;
        private static _source;
        /**
        * Uploads a BitmapData with mip maps to a target Texture object.
        * @param source
        * @param target The target Texture to upload to.
        * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
        * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
        */
        static generateHTMLImageElementMipMaps(source: HTMLImageElement, target: away.displayGL.TextureBase, mipmap?: away.display.BitmapData, alpha?: boolean, side?: number): void;
        /**
        * Uploads a BitmapData with mip maps to a target Texture object.
        * @param source The source BitmapData to upload.
        * @param target The target Texture to upload to.
        * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
        * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
        */
        static generateMipMaps(source: away.display.BitmapData, target: away.displayGL.TextureBase, mipmap?: away.display.BitmapData, alpha?: boolean, side?: number): void;
    }
}
declare module away.utils {
    class ByteArrayBase {
        public position: number;
        public length: number;
        public _mode: string;
        public Base64Key: string;
        constructor();
        public writeByte(b: number): void;
        public readByte(): number;
        public writeUnsignedByte(b: number): void;
        public readUnsignedByte(): number;
        public writeUnsignedShort(b: number): void;
        public readUnsignedShort(): number;
        public writeUnsignedInt(b: number): void;
        public readUnsignedInt(): number;
        public writeFloat(b: number): void;
        public toFloatBits(x: number): void;
        public readFloat(b: number): void;
        public fromFloatBits(x: number): void;
        public getBytesAvailable(): number;
        public toString(): string;
        public compareEqual(other: any, count: any): boolean;
        public writeBase64String(s: string): void;
        public dumpToConsole(): void;
        public internalGetBase64String(count: any, getUnsignedByteFunc: any, self: any): string;
    }
}
declare module away.utils {
    class ByteArray extends utils.ByteArrayBase {
        public maxlength: number;
        public arraybytes: any;
        public unalignedarraybytestemp: any;
        constructor();
        public ensureWriteableSpace(n: number): void;
        public setArrayBuffer(aBuffer: ArrayBuffer): void;
        public getBytesAvailable(): number;
        public ensureSpace(n: number): void;
        public writeByte(b: number): void;
        public readByte(): number;
        public readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        public writeUnsignedByte(b: number): void;
        public readUnsignedByte(): number;
        public writeUnsignedShort(b: number): void;
        public readUTFBytes(len: number): string;
        public readInt(): number;
        public readShort(): number;
        public readDouble(): number;
        public readUnsignedShort(): number;
        public writeUnsignedInt(b: number): void;
        public readUnsignedInt(): number;
        public writeFloat(b: number): void;
        public readFloat(): number;
    }
}
declare module away.utils {
    class ByteArrayBuffer extends utils.ByteArrayBase {
        public _bytes: number[];
        constructor();
        public writeByte(b: number): void;
        public readByte(): number;
        public writeUnsignedByte(b: number): void;
        public readUnsignedByte(): number;
        public writeUnsignedShort(b: number): void;
        public readUnsignedShort(): number;
        public writeUnsignedInt(b: number): void;
        public readUnsignedInt(): number;
        public writeFloat(b: number): void;
        public toFloatBits(x: number): number;
        public readFloat(b: number): number;
        public fromFloatBits(x: number): number;
    }
}
declare module away.utils {
    class ColorUtils {
        static float32ColorToARGB(float32Color: number): number[];
        private static componentToHex(c);
        static RGBToHexString(argb: number[]): string;
        static ARGBToHexString(argb: number[]): string;
    }
}
declare module away.utils {
    class CSS {
        static setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number): void;
        static setCanvasWidth(canvas: HTMLCanvasElement, width: number): void;
        static setCanvasHeight(canvas: HTMLCanvasElement, height: number): void;
        static setCanvasX(canvas: HTMLCanvasElement, x: number): void;
        static setCanvasY(canvas: HTMLCanvasElement, y: number): void;
        static getCanvasVisibility(canvas: HTMLCanvasElement): boolean;
        static setCanvasVisibility(canvas: HTMLCanvasElement, visible: boolean): void;
        static setCanvasAlpha(canvas: HTMLCanvasElement, alpha: number): void;
        static setCanvasPosition(canvas: HTMLCanvasElement, x: number, y: number, absolute?: boolean): void;
    }
}
declare module away {
    class Debug {
        static THROW_ERRORS: boolean;
        static ENABLE_LOG: boolean;
        static LOG_PI_ERRORS: boolean;
        private static keyword;
        static breakpoint(): void;
        static throwPIROnKeyWordOnly(str: string, enable?: boolean): void;
        static throwPIR(clss: string, fnc: string, msg: string): void;
        private static logPIR(clss, fnc, msg?);
        static log(...args: any[]): void;
    }
}
declare module away.utils {
    function getTimer(): number;
}
declare module away.utils {
    class RequestAnimationFrame {
        private _callback;
        private _callbackContext;
        private _active;
        private _rafUpdateFunction;
        private _prevTime;
        private _dt;
        private _currentTime;
        private _argsArray;
        private _getTimer;
        constructor(callback: Function, callbackContext: Object);
        /**
        *
        * @param callback
        * @param callbackContext
        */
        public setCallback(callback: Function, callbackContext: Object): void;
        /**
        *
        */
        public start(): void;
        /**
        *
        */
        public stop(): void;
        /**
        *
        * @returns {boolean}
        */
        public active : boolean;
        /**
        *
        * @private
        */
        private _tick();
    }
}
declare module away.utils {
    class TextureUtils {
        private static MAX_SIZE;
        static isBitmapDataValid(bitmapData: away.display.BitmapData): boolean;
        static isHTMLImageElementValid(image: HTMLImageElement): boolean;
        static isDimensionValid(d: number): boolean;
        static isPowerOfTwo(value: number): boolean;
        static getBestPowerOf2(value: number): number;
    }
}
declare module away.utils {
    class Timer extends away.events.EventDispatcher {
        private _delay;
        private _repeatCount;
        private _currentCount;
        private _iid;
        private _running;
        constructor(delay: number, repeatCount?: number);
        public currentCount : number;
        public delay : number;
        public repeatCount : number;
        public reset(): void;
        public running : boolean;
        public start(): void;
        public stop(): void;
        private tick();
    }
}
declare module aglsl {
    class Sampler {
        public lodbias: number;
        public dim: number;
        public readmode: number;
        public special: number;
        public wrap: number;
        public mipmap: number;
        public filter: number;
        constructor();
    }
}
declare module aglsl {
    class Token {
        public dest: aglsl.Destination;
        public opcode: number;
        public a: aglsl.Destination;
        public b: aglsl.Destination;
        constructor();
    }
}
declare module aglsl {
    class Header {
        public progid: number;
        public version: number;
        public type: string;
        constructor();
    }
}
declare module aglsl {
    class OpLUT {
        public s: string;
        public flags: number;
        public dest: boolean;
        public a: boolean;
        public b: boolean;
        public matrixwidth: number;
        public matrixheight: number;
        public ndwm: boolean;
        public scalar: boolean;
        public dm: boolean;
        public lod: boolean;
        constructor(s: string, flags: number, dest: boolean, a: boolean, b: boolean, matrixwidth: number, matrixheight: number, ndwm: boolean, scaler: boolean, dm: boolean, lod: boolean);
    }
}
declare module aglsl {
    class Description {
        public regread: any[];
        public regwrite: any[];
        public hasindirect: boolean;
        public writedepth: boolean;
        public hasmatrix: boolean;
        public samplers: any[];
        public tokens: aglsl.Token[];
        public header: aglsl.Header;
        constructor();
    }
}
declare module aglsl {
    class Destination {
        public mask: number;
        public regnum: number;
        public regtype: number;
        public dim: number;
        constructor();
    }
}
declare module aglsl {
    class ContextGL {
        public enableErrorChecking: boolean;
        public resources: any[];
        public driverInfo: string;
        static maxvertexconstants: number;
        static maxfragconstants: number;
        static maxtemp: number;
        static maxstreams: number;
        static maxtextures: number;
        static defaultsampler: aglsl.Sampler;
        constructor();
    }
}
declare module aglsl {
    class Mapping {
        static agal2glsllut: aglsl.OpLUT[];
    }
}
declare module aglsl.assembler {
    class Opcode {
        public dest: string;
        public a: FS;
        public b: FS;
        public opcode: number;
        public flags: Flags;
        constructor(dest: string, aformat: string, asize: number, bformat: string, bsize: number, opcode: number, simple: boolean, horizontal: boolean, fragonly: boolean, matrix: boolean);
    }
    class FS {
        public format: string;
        public size: number;
    }
    class Flags {
        public simple: boolean;
        public horizontal: boolean;
        public fragonly: boolean;
        public matrix: boolean;
    }
}
declare module aglsl.assembler {
    class OpcodeMap {
        private static _map;
        static map : Object[];
        constructor();
    }
}
declare module aglsl.assembler {
    class Part {
        public name: string;
        public version: number;
        public data: away.utils.ByteArray;
        constructor(name?: string, version?: number);
    }
}
declare module aglsl.assembler {
    class Reg {
        public code: number;
        public desc: string;
        constructor(code: number, desc: string);
    }
    class RegMap {
        private static _map;
        static map : any[];
        constructor();
    }
}
declare module aglsl.assembler {
    class Sampler {
        public shift: number;
        public mask: number;
        public value: number;
        constructor(shift: number, mask: number, value: number);
    }
    class SamplerMap {
        private static _map;
        static map : Object[];
        constructor();
    }
}
declare module aglsl.assembler {
    class AGALMiniAssembler {
        public r: Object;
        public cur: assembler.Part;
        constructor();
        public assemble(source: string, ext_part?: any, ext_version?: any): Object;
        private processLine(line, linenr);
        public emitHeader(pr: assembler.Part): void;
        public emitOpcode(pr: assembler.Part, opcode: any): void;
        public emitZeroDword(pr: assembler.Part): void;
        public emitZeroQword(pr: any): void;
        public emitDest(pr: any, token: any, opdest: any): boolean;
        public stringToMask(s: string): number;
        public stringToSwizzle(s: any): number;
        public emitSampler(pr: assembler.Part, token: any, opsrc: any, opts: any): boolean;
        public emitSource(pr: any, token: any, opsrc: any): boolean;
        public addHeader(partname: any, version: any): void;
    }
}
declare module aglsl {
    class AGALTokenizer {
        constructor();
        public decribeAGALByteArray(bytes: away.utils.ByteArray): aglsl.Description;
        public readReg(s: any, mh: any, desc: any, bytes: any): void;
    }
}
declare module aglsl {
    class AGLSLParser {
        public parse(desc: aglsl.Description): string;
        public regtostring(regtype: number, regnum: number, desc: aglsl.Description, tag: any): string;
        public sourcetostring(s: any, subline: any, dwm: any, isscalar: any, desc: any, tag: any): string;
    }
}
declare module aglsl {
    class AGLSLCompiler {
        public glsl: string;
        public compile(programType: string, source: string): string;
    }
}
declare module away {
    class AME extends away.events.EventDispatcher {
        constructor();
    }
}
