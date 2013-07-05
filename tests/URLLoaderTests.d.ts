/**
* Base event class
* @class kurst.events.Event
*
* @author Karim Beyrouti
*/
declare module away.events {
    class Event {
        static COMPLETE: string;
        static OPEN: string;
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
declare module away.events {
    class IOErrorEvent extends events.Event {
        static IO_ERROR: string;
        constructor(type: string);
    }
}
declare module away.events {
    class HTTPStatusEvent extends events.Event {
        static HTTP_STATUS: string;
        public status: number;
        constructor(type: string, status?: number);
    }
}
/**
* @module kurst.events
*/
declare module away.events {
    /**
    * Base class for dispatching events
    *
    * @class kurst.events.EventDispatcher
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
        /**
        * check if an object has an event listener assigned to it
        * @method hasListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        public hasEventListener(type: string, listener: Function, target: Object): boolean;
    }
}
declare module away.events {
    class ProgressEvent extends events.Event {
        static PROGRESS: string;
        public bytesLoaded: number;
        public bytesTotal: number;
        constructor(type: string);
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
declare class LoaderTest {
    private urlLoaderPostURLVars;
    private urlLoaderGetCSV;
    private urlLoaderErrorTest;
    private urlLoaderGetURLVars;
    private urlLoaderBinary;
    private urlLoaderBlob;
    private urlLoaderArrb;
    constructor();
    private arrayBufferLoaded(event);
    private blobFileLoaded(event);
    private createObjectURL(fileBlob);
    private binFileLoaded(event);
    private getURLVarsComplete(event);
    private httpStatusChange(event);
    private ioError(event);
    private errorComplete(event);
    private postURLTestComplete(event);
    private getCsvComplete(event);
    private getCsvOpen(event);
}
