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
    class ArgumentError extends Error {
        /**
        * Create a new ArgumentError.
        *
        * @param message An optional message to override the default error message.
        * @param id The id of the error.
        */
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    class CastError extends Error {
        constructor(message: string);
    }
}
declare module away.errors {
    /**
    * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
    * by a concrete subclass.
    */
    class PartialImplementationError extends Error {
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
    class AbstractMethodError extends Error {
        /**
        * Create a new AbstractMethodError.
        * @param message An optional message to override the default error message.
        * @param id The id of the error.
        */
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    class DocumentError extends Error {
        static DOCUMENT_DOES_NOT_EXIST: string;
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    /**
    * RangeError is thrown when an index is accessed out of range of the number of
    * available indices on an Array.
    */
    class RangeError extends Error {
        /**
        * Create a new RangeError.
        *
        * @param message An optional message to override the default error message.
        * @param id The id of the error.
        */
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
        public target: any;
        constructor(type: string);
        /**
        * Clones the current event.
        * @return An exact duplicate of the current event.
        */
        public clone(): Event;
    }
}
declare module away.events {
    /**
    * @class away.events.AssetEvent
    */
    class AssetEvent extends Event {
        /**
        *
        */
        static ASSET_COMPLETE: string;
        /**
        *
        */
        static ASSET_RENAME: string;
        /**
        *
        */
        static ASSET_CONFLICT_RESOLVED: string;
        /**
        *
        */
        static TEXTURE_SIZE_ERROR: string;
        private _asset;
        private _prevName;
        /**
        *
        */
        constructor(type: string, asset?: library.IAsset, prevName?: string);
        /**
        *
        */
        public asset : library.IAsset;
        /**
        *
        */
        public assetPrevName : string;
        /**
        *
        */
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    /**
    * @class away.events.CameraEvent
    */
    class CameraEvent extends Event {
        static PROJECTION_CHANGED: string;
        private _camera;
        constructor(type: string, camera: entities.Camera);
        public camera : entities.Camera;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class DisplayObjectEvent extends Event {
        static VISIBLITY_UPDATED: string;
        static SCENETRANSFORM_CHANGED: string;
        static SCENE_CHANGED: string;
        static POSITION_CHANGED: string;
        static ROTATION_CHANGED: string;
        static SCALE_CHANGED: string;
        public object: base.DisplayObject;
        constructor(type: string, object: base.DisplayObject);
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
        private target;
        constructor(target?: any);
        /**
        * Add an event listener
        * @method addEventListener
        * @param {String} Name of event to add a listener for
        * @param {Function} Callback function
        */
        public addEventListener(type: string, listener: Function): void;
        /**
        * Remove an event listener
        * @method removeEventListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        public removeEventListener(type: string, listener: Function): void;
        /**
        * Dispatch an event
        * @method dispatchEvent
        * @param {Event} Event to dispatch
        */
        public dispatchEvent(event: Event): void;
        /**
        * get Event Listener Index in array. Returns -1 if no listener is added
        * @method getEventListenerIndex
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        private getEventListenerIndex(type, listener);
        /**
        * check if an object has an event listener assigned to it
        * @method hasListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        public hasEventListener(type: string, listener?: Function): boolean;
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in a geometry object's state.
    *
    * @class away.events.GeometryEvent
    * @see away3d.core.base.Geometry
    */
    class GeometryEvent extends Event {
        /**
        * Dispatched when a TriangleSubGeometry was added to the dispatching Geometry.
        */
        static SUB_GEOMETRY_ADDED: string;
        /**
        * Dispatched when a TriangleSubGeometry was removed from the dispatching Geometry.
        */
        static SUB_GEOMETRY_REMOVED: string;
        static BOUNDS_INVALID: string;
        private _subGeometry;
        /**
        * Create a new GeometryEvent
        * @param type The event type.
        * @param subGeometry An optional TriangleSubGeometry object that is the subject of this event.
        */
        constructor(type: string, subGeometry?: base.SubGeometryBase);
        /**
        * The TriangleSubGeometry object that is the subject of this event, if appropriate.
        */
        public subGeometry : base.SubGeometryBase;
        /**
        * Clones the event.
        * @return An exact duplicate of the current object.
        */
        public clone(): Event;
    }
}
declare module away.events {
    /**
    * @class away.events.HTTPStatusEvent
    */
    class HTTPStatusEvent extends Event {
        static HTTP_STATUS: string;
        public status: number;
        constructor(type: string, status?: number);
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
        */
        addEventListener(type: string, listener: Function): any;
        /**
        * Remove an event listener
        * @method removeEventListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        */
        removeEventListener(type: string, listener: Function): any;
        /**
        * Dispatch an event
        * @method dispatchEvent
        * @param {Event} Event to dispatch
        */
        dispatchEvent(event: Event): any;
        /**
        * check if an object has an event listener assigned to it
        * @method hasListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        hasEventListener(type: string, listener?: Function): boolean;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class IOErrorEvent extends Event {
        static IO_ERROR: string;
        constructor(type: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class LightEvent extends Event {
        static CASTS_SHADOW_CHANGE: string;
        constructor(type: string);
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class LoaderEvent extends Event {
        /**
        * Dispatched when a resource and all of its dependencies is retrieved.
        */
        static RESOURCE_COMPLETE: string;
        private _url;
        private _content;
        private _assets;
        /**
        * Create a new LoaderEvent object.
        *
        * @param type The event type.
        * @param url The url of the loaded resource.
        * @param assets The assets of the loaded resource.
        */
        constructor(type: string, url?: string, content?: base.DisplayObject, assets?: library.IAsset[]);
        /**
        * The content returned if the resource has been loaded inside a <code>Loader</code> object.
        */
        public content : base.DisplayObject;
        /**
        * The url of the loaded resource.
        */
        public url : string;
        /**
        * The error string on loadError.
        */
        public assets : library.IAsset[];
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
    class ParserEvent extends Event {
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
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    /**
    * A MouseEvent is dispatched when a mouse event occurs over a mouseEnabled object in View.
    * TODO: we don't have screenZ data, tho this should be easy to implement
    */
    class MouseEvent extends Event {
        public _iAllowedToPropagate: boolean;
        public _iParentEvent: MouseEvent;
        /**
        * Defines the value of the type property of a mouseOver3d event object.
        */
        static MOUSE_OVER: string;
        /**
        * Defines the value of the type property of a mouseOut3d event object.
        */
        static MOUSE_OUT: string;
        /**
        * Defines the value of the type property of a mouseUp3d event object.
        */
        static MOUSE_UP: string;
        /**
        * Defines the value of the type property of a mouseDown3d event object.
        */
        static MOUSE_DOWN: string;
        /**
        * Defines the value of the type property of a mouseMove3d event object.
        */
        static MOUSE_MOVE: string;
        /**
        * Defines the value of the type property of a click3d event object.
        */
        static CLICK: string;
        /**
        * Defines the value of the type property of a doubleClick3d event object.
        */
        static DOUBLE_CLICK: string;
        /**
        * Defines the value of the type property of a mouseWheel3d event object.
        */
        static MOUSE_WHEEL: string;
        /**
        * The horizontal coordinate at which the event occurred in view coordinates.
        */
        public screenX: number;
        /**
        * The vertical coordinate at which the event occurred in view coordinates.
        */
        public screenY: number;
        /**
        * The view object inside which the event took place.
        */
        public view: containers.View;
        /**
        * The 3d object inside which the event took place.
        */
        public object: base.DisplayObject;
        /**
        * The material owner inside which the event took place.
        */
        public materialOwner: base.IMaterialOwner;
        /**
        * The material of the 3d element inside which the event took place.
        */
        public material: materials.MaterialBase;
        /**
        * The uv coordinate inside the draw primitive where the event took place.
        */
        public uv: geom.Point;
        /**
        * The index of the face where the event took place.
        */
        public index: number;
        /**
        * The index of the subGeometry where the event took place.
        */
        public subGeometryIndex: number;
        /**
        * The position in object space where the event took place
        */
        public localPosition: geom.Vector3D;
        /**
        * The normal in object space where the event took place
        */
        public localNormal: geom.Vector3D;
        /**
        * Indicates whether the Control key is active (true) or inactive (false).
        */
        public ctrlKey: boolean;
        /**
        * Indicates whether the Alt key is active (true) or inactive (false).
        */
        public altKey: boolean;
        /**
        * Indicates whether the Shift key is active (true) or inactive (false).
        */
        public shiftKey: boolean;
        /**
        * Indicates how many lines should be scrolled for each unit the user rotates the mouse wheel.
        */
        public delta: number;
        /**
        * Create a new MouseEvent object.
        * @param type The type of the MouseEvent.
        */
        constructor(type: string);
        /**
        * @inheritDoc
        */
        public bubbles : boolean;
        /**
        * @inheritDoc
        */
        public stopPropagation(): void;
        /**
        * @inheritDoc
        */
        public stopImmediatePropagation(): void;
        /**
        * Creates a copy of the MouseEvent object and sets the value of each property to match that of the original.
        */
        public clone(): Event;
        /**
        * The position in scene space where the event took place
        */
        public scenePosition : geom.Vector3D;
        /**
        * The normal in scene space where the event took place
        */
        public sceneNormal : geom.Vector3D;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class MaterialEvent extends Event {
        static SIZE_CHANGED: string;
        constructor(type: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class ProgressEvent extends Event {
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
    class ProjectionEvent extends Event {
        static MATRIX_CHANGED: string;
        private _projection;
        constructor(type: string, projection: projections.IProjection);
        public projection : projections.IProjection;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class RendererEvent extends Event {
        static VIEWPORT_UPDATED: string;
        static SCISSOR_UPDATED: string;
        constructor(type: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class SceneEvent extends Event {
        /**
        *
        */
        static ADDED_TO_SCENE: string;
        /**
        *
        */
        static REMOVED_FROM_SCENE: string;
        /**
        *
        */
        static PARTITION_CHANGED: string;
        /**
        *
        */
        public displayObject: base.DisplayObject;
        constructor(type: string, displayObject: base.DisplayObject);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class StageEvent extends Event {
        static CONTEXT_CREATED: string;
        static CONTEXT_DISPOSED: string;
        static CONTEXT_RECREATED: string;
        static VIEWPORT_UPDATED: string;
        constructor(type: string);
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in a sub geometry object's state.
    *
    * @class away.events.SubGeometryEvent
    * @see away3d.core.base.Geometry
    */
    class SubGeometryEvent extends Event {
        /**
        * Dispatched when a TriangleSubGeometry's index data has been updated.
        */
        static INDICES_UPDATED: string;
        /**
        * Dispatched when a TriangleSubGeometry's vertex data has been updated.
        */
        static VERTICES_UPDATED: string;
        private _dataType;
        /**
        * Create a new GeometryEvent
        * @param type The event type.
        * @param dataType An optional data type of the vertex data being updated.
        */
        constructor(type: string, dataType?: string);
        /**
        * The data type of the vertex data.
        */
        public dataType : string;
        /**
        * Clones the event.
        *
        * @return An exact duplicate of the current object.
        */
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class TimerEvent extends Event {
        static TIMER: string;
        static TIMER_COMPLETE: string;
        constructor(type: string);
    }
}
declare module away.utils {
    class ByteArrayBase {
        public position: number;
        public length: number;
        public _mode: string;
        static Base64Key: string;
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
        public readBase64String(count: number): string;
        static internalGetBase64String(count: any, getUnsignedByteFunc: any, self: any): string;
    }
}
declare module away.utils {
    class ByteArray extends ByteArrayBase {
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
    class ByteArrayBuffer extends ByteArrayBase {
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
    /**
    * Helper class for casting assets to usable objects
    */
    class Cast {
        private static _colorNames;
        private static _hexChars;
        private static _notClasses;
        private static _classes;
        static string(data: any): string;
        static byteArray(data: any): ByteArray;
        private static isHex(str);
        static tryColor(data: any): number;
        static color(data: any): number;
        static tryClass(name: string): any;
        static bitmapData(data: any): base.BitmapData;
        static bitmapTexture(data: any): textures.BitmapTexture;
    }
}
declare module away.utils {
    class CSS {
        static setElementSize(element: HTMLElement, width: number, height: number): void;
        static setElementWidth(element: HTMLElement, width: number): void;
        static setElementHeight(element: HTMLElement, height: number): void;
        static setElementX(element: HTMLElement, x: number): void;
        static setElementY(element: HTMLElement, y: number): void;
        static getElementVisibility(element: HTMLElement): boolean;
        static setElementVisibility(element: HTMLElement, visible: boolean): void;
        static setElementAlpha(element: HTMLElement, alpha: number): void;
        static setElementPosition(element: HTMLElement, x: number, y: number, absolute?: boolean): void;
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
    class Delegate {
        private _func;
        constructor(func?: Function);
        /**
        Creates a functions wrapper for the original function so that it runs
        in the provided context.
        @parameter obj Context in which to run the function.
        @paramater func Function to run.
        */
        static create(obj: Object, func: Function): Function;
        public createDelegate(obj: Object): Function;
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
        static isBitmapDataValid(bitmapData: base.BitmapData): boolean;
        static isHTMLImageElementValid(image: HTMLImageElement): boolean;
        static isDimensionValid(d: number): boolean;
        static isPowerOfTwo(value: number): boolean;
        static getBestPowerOf2(value: number): number;
    }
}
declare module away.utils {
    class Timer extends events.EventDispatcher {
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
/**
* A Box object is an area defined by its position, as indicated by its
* top-left-front corner point(<i>x</i>, <i>y</i>, <i>z</i>) and by its width,
* height and depth.
*
*
* <p>The <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
* <code>height</code> <code>depth</code> properties of the Box class are
* independent of each other; changing the value of one property has no effect
* on the others. However, the <code>right</code>, <code>bottom</code> and
* <code>back</code> properties are integrally related to those six
* properties. For example, if you change the value of the <code>right</code>
* property, the value of the <code>width</code> property changes; if you
* change the <code>bottom</code> property, the value of the
* <code>height</code> property changes. </p>
*
* <p>The following methods and properties use Box objects:</p>
*
* <ul>
*   <li>The <code>bounds</code> property of the DisplayObject class</li>
* </ul>
*
* <p>You can use the <code>new Box()</code> constructor to create a
* Box object.</p>
*
* <p><b>Note:</b> The Box class does not define a cubic Shape
* display object.
*/
declare module away.geom {
    class Box {
        private _depth;
        private _height;
        private _size;
        private _bottomRightBack;
        private _topLeftFront;
        private _width;
        /**
        * The height of the box, in pixels. Changing the <code>height</code> value
        * of a Box object has no effect on the <code>x</code>, <code>y</code>,
        * <code>z</code>, <code>depth</code> and <code>width</code> properties.
        */
        public height: number;
        /**
        * The width of the box, in pixels. Changing the <code>width</code> value
        * of a Box object has no effect on the <code>x</code>, <code>y</code>,
        * <code>z</code>, <code>depth</code> and <code>height</code> properties.
        */
        public width: number;
        /**
        * The deoth of the box, in pixels. Changing the <code>depth</code> value
        * of a Box object has no effect on the <code>x</code>, <code>y</code>,
        * <code>z</code>, <code>width</code> and <code>height</code> properties.
        */
        public depth: number;
        /**
        * The <i>x</i> coordinate of the top-left-front corner of the box.
        * Changing the value of the <code>x</code> property of a Box object has no
        * effect on the <code>y</code>, <code>z</code>, <code>width</code>,
        * <code>height</code> and <code>depth</code> properties.
        *
        * <p>The value of the <code>x</code> property is equal to the value of the
        * <code>left</code> property.</p>
        */
        public x: number;
        /**
        * The <i>y</i> coordinate of the top-left-front corner of the box.
        * Changing the value of the <code>y</code> property of a Box object has no
        * effect on the <code>x</code>, <code>z</code>, <code>width</code>,
        * <code>height</code> and <code>depth</code> properties.
        *
        * <p>The value of the <code>y</code> property is equal to the value of the
        * <code>top</code> property.</p>
        */
        public y: number;
        /**
        * The <i>y</i> coordinate of the top-left-front corner of the box.
        * Changing the value of the <code>z</code> property of a Box object has no
        * effect on the <code>x</code>, <code>y</code>, <code>width</code>,
        * <code>height</code> and <code>depth</code> properties.
        *
        * <p>The value of the <code>z</code> property is equal to the value of the
        * <code>front</code> property.</p>
        */
        public z: number;
        /**
        * The sum of the <code>z</code> and <code>height</code> properties.
        */
        public back : number;
        /**
        * The sum of the <code>y</code> and <code>height</code> properties.
        */
        public bottom : number;
        /**
        * The location of the Box object's bottom-right corner, determined by the
        * values of the <code>right</code> and <code>bottom</code> properties.
        */
        public bottomRightBack : Vector3D;
        /**
        * The <i>z</i> coordinate of the top-left-front corner of the box. Changing
        * the <code>front</code> property of a Box object has no effect on the
        * <code>x</code>, <code>y</code>, <code>width</code> and <code>height</code>
        * properties. However it does affect the <code>depth</code> property,
        * whereas changing the <code>z</code> value does <i>not</i> affect the
        * <code>depth</code> property.
        *
        * <p>The value of the <code>left</code> property is equal to the value of
        * the <code>x</code> property.</p>
        */
        public front : number;
        /**
        * The <i>x</i> coordinate of the top-left corner of the box. Changing the
        * <code>left</code> property of a Box object has no effect on the
        * <code>y</code> and <code>height</code> properties. However it does affect
        * the <code>width</code> property, whereas changing the <code>x</code> value
        * does <i>not</i> affect the <code>width</code> property.
        *
        * <p>The value of the <code>left</code> property is equal to the value of
        * the <code>x</code> property.</p>
        */
        public left : number;
        /**
        * The sum of the <code>x</code> and <code>width</code> properties.
        */
        public right : number;
        /**
        * The size of the Box object, expressed as a Vector3D object with the
        * values of the <code>width</code>, <code>height</code> and
        * <code>depth</code> properties.
        */
        public size : Vector3D;
        /**
        * The <i>y</i> coordinate of the top-left-front corner of the box. Changing
        * the <code>top</code> property of a Box object has no effect on the
        * <code>x</code> and <code>width</code> properties. However it does affect
        * the <code>height</code> property, whereas changing the <code>y</code>
        * value does <i>not</i> affect the <code>height</code> property.
        *
        * <p>The value of the <code>top</code> property is equal to the value of the
        * <code>y</code> property.</p>
        */
        public top : number;
        /**
        * The location of the Box object's top-left-front corner, determined by the
        * <i>x</i>, <i>y</i> and <i>z</i> coordinates of the point.
        */
        public topLeftFront : Vector3D;
        /**
        * Creates a new Box object with the top-left-front corner specified by the
        * <code>x</code>, <code>y</code> and <code>z</code> parameters and with the
        * specified <code>width</code>, <code>height</code> and <code>depth</code>
        * parameters. If you call this public without parameters, a box with
        * <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
        * <code>height</code> and <code>depth</code> properties set to 0 is created.
        *
        * @param x      The <i>x</i> coordinate of the top-left-front corner of the
        *               box.
        * @param y      The <i>y</i> coordinate of the top-left-front corner of the
        *               box.
        * @param z      The <i>z</i> coordinate of the top-left-front corner of the
        *               box.
        * @param width  The width of the box, in pixels.
        * @param height The height of the box, in pixels.
        * @param depth The depth of the box, in pixels.
        */
        constructor(x?: number, y?: number, z?: number, width?: number, height?: number, depth?: number);
        /**
        * Returns a new Box object with the same values for the <code>x</code>,
        * <code>y</code>, <code>z</code>, <code>width</code>, <code>height</code>
        * and <code>depth</code> properties as the original Box object.
        *
        * @return A new Box object with the same values for the <code>x</code>,
        *         <code>y</code>, <code>z</code>, <code>width</code>,
        *         <code>height</code> and <code>depth</code> properties as the
        *         original Box object.
        */
        public clone(): Box;
        /**
        * Determines whether the specified position is contained within the cubic
        * region defined by this Box object.
        *
        * @param x The <i>x</i> coordinate(horizontal component) of the position.
        * @param y The <i>y</i> coordinate(vertical component) of the position.
        * @param z The <i>z</i> coordinate(longitudinal component) of the position.
        * @return A value of <code>true</code> if the Box object contains the
        *         specified position; otherwise <code>false</code>.
        */
        public contains(x: number, y: number, z: number): boolean;
        /**
        * Determines whether the specified position is contained within the cubic
        * region defined by this Box object. This method is similar to the
        * <code>Box.contains()</code> method, except that it takes a Vector3D
        * object as a parameter.
        *
        * @param position The position, as represented by its <i>x</i>, <i>y</i> and
        *                 <i>z</i> coordinates.
        * @return A value of <code>true</code> if the Box object contains the
        *         specified position; otherwise <code>false</code>.
        */
        public containsPoint(position: Vector3D): boolean;
        /**
        * Determines whether the Box object specified by the <code>box</code>
        * parameter is contained within this Box object. A Box object is said to
        * contain another if the second Box object falls entirely within the
        * boundaries of the first.
        *
        * @param box The Box object being checked.
        * @return A value of <code>true</code> if the Box object that you specify
        *         is contained by this Box object; otherwise <code>false</code>.
        */
        public containsRect(box: Box): boolean;
        /**
        * Copies all of box data from the source Box object into the calling
        * Box object.
        *
        * @param sourceBox The Box object from which to copy the data.
        */
        public copyFrom(sourceBox: Box): void;
        /**
        * Determines whether the object specified in the <code>toCompare</code>
        * parameter is equal to this Box object. This method compares the
        * <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
        * <code>height</code> and <code>depth</code> properties of an object against
        * the same properties of this Box object.
        *
        * @param toCompare The box to compare to this Box object.
        * @return A value of <code>true</code> if the object has exactly the same
        *         values for the <code>x</code>, <code>y</code>, <code>z</code>,
        *         <code>width</code>, <code>height</code> and <code>depth</code>
        *         properties as this Box object; otherwise <code>false</code>.
        */
        public equals(toCompare: Box): boolean;
        /**
        * Increases the size of the Box object by the specified amounts, in
        * pixels. The center point of the Box object stays the same, and its
        * size increases to the left and right by the <code>dx</code> value, to
        * the top and the bottom by the <code>dy</code> value, and to
        * the front and the back by the <code>dz</code> value.
        *
        * @param dx The value to be added to the left and the right of the Box
        *           object. The following equation is used to calculate the new
        *           width and position of the box:
        * @param dy The value to be added to the top and the bottom of the Box
        *           object. The following equation is used to calculate the new
        *           height and position of the box:
        * @param dz The value to be added to the front and the back of the Box
        *           object. The following equation is used to calculate the new
        *           depth and position of the box:
        */
        public inflate(dx: number, dy: number, dz: number): void;
        /**
        * Increases the size of the Box object. This method is similar to the
        * <code>Box.inflate()</code> method except it takes a Vector3D object as
        * a parameter.
        *
        * <p>The following two code examples give the same result:</p>
        *
        * @param delta The <code>x</code> property of this Vector3D object is used to
        *              increase the horizontal dimension of the Box object.
        *              The <code>y</code> property is used to increase the vertical
        *              dimension of the Box object.
        *              The <code>z</code> property is used to increase the
        *              longitudinal dimension of the Box object.
        */
        public inflatePoint(delta: Vector3D): void;
        /**
        * If the Box object specified in the <code>toIntersect</code> parameter
        * intersects with this Box object, returns the area of intersection
        * as a Box object. If the boxes do not intersect, this method returns an
        * empty Box object with its properties set to 0.
        *
        * @param toIntersect The Box object to compare against to see if it
        *                    intersects with this Box object.
        * @return A Box object that equals the area of intersection. If the
        *         boxes do not intersect, this method returns an empty Box
        *         object; that is, a box with its <code>x</code>, <code>y</code>,
        *         <code>z</code>, <code>width</code>,  <code>height</code>, and
        *         <code>depth</code> properties set to 0.
        */
        public intersection(toIntersect: Box): Box;
        /**
        * Determines whether the object specified in the <code>toIntersect</code>
        * parameter intersects with this Box object. This method checks the
        * <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
        * <code>height</code>, and <code>depth</code> properties of the specified
        * Box object to see if it intersects with this Box object.
        *
        * @param toIntersect The Box object to compare against this Box object.
        * @return A value of <code>true</code> if the specified object intersects
        *         with this Box object; otherwise <code>false</code>.
        */
        public intersects(toIntersect: Box): boolean;
        /**
        * Determines whether or not this Box object is empty.
        *
        * @return A value of <code>true</code> if the Box object's width, height or
        *         depth is less than or equal to 0; otherwise <code>false</code>.
        */
        public isEmpty(): boolean;
        /**
        * Adjusts the location of the Box object, as determined by its
        * top-left-front corner, by the specified amounts.
        *
        * @param dx Moves the <i>x</i> value of the Box object by this amount.
        * @param dy Moves the <i>y</i> value of the Box object by this amount.
        * @param dz Moves the <i>z</i> value of the Box object by this amount.
        */
        public offset(dx: number, dy: number, dz: number): void;
        /**
        * Adjusts the location of the Box object using a Vector3D object as a
        * parameter. This method is similar to the <code>Box.offset()</code>
        * method, except that it takes a Vector3D object as a parameter.
        *
        * @param position A Vector3D object to use to offset this Box object.
        */
        public offsetPosition(position: Vector3D): void;
        /**
        * Sets all of the Box object's properties to 0. A Box object is empty if its
        * width, height or depth is less than or equal to 0.
        *
        * <p> This method sets the values of the <code>x</code>, <code>y</code>,
        * <code>z</code>, <code>width</code>, <code>height</code>, and
        * <code>depth</code> properties to 0.</p>
        *
        */
        public setEmpty(): void;
        /**
        * Sets the members of Box to the specified values
        *
        * @param xa      The <i>x</i> coordinate of the top-left-front corner of the
        *                box.
        * @param ya      The <i>y</i> coordinate of the top-left-front corner of the
        *                box.
        * @param yz      The <i>z</i> coordinate of the top-left-front corner of the
        *                box.
        * @param widtha  The width of the box, in pixels.
        * @param heighta The height of the box, in pixels.
        * @param deptha  The depth of the box, in pixels.
        */
        public setTo(xa: number, ya: number, za: number, widtha: number, heighta: number, deptha: number): void;
        /**
        * Builds and returns a string that lists the horizontal, vertical and
        * longitudinal positions and the width, height and depth of the Box object.
        *
        * @return A string listing the value of each of the following properties of
        *         the Box object: <code>x</code>, <code>y</code>, <code>z</code>,
        *         <code>width</code>, <code>height</code>, and <code>depth</code>.
        */
        public toString(): string;
        /**
        * Adds two boxes together to create a new Box object, by filling
        * in the horizontal, vertical and longitudinal space between the two boxes.
        *
        * <p><b>Note:</b> The <code>union()</code> method ignores boxes with
        * <code>0</code> as the height, width or depth value, such as: <code>var
        * box2:Box = new Box(300,300,300,50,50,0);</code></p>
        *
        * @param toUnion A Box object to add to this Box object.
        * @return A new Box object that is the union of the two boxes.
        */
        public union(toUnion: Box): Box;
    }
}
/**
* The ColorTransform class lets you adjust the color values in a display
* object. The color adjustment or <i>color transformation</i> can be applied
* to all four channels: red, green, blue, and alpha transparency.
*
* <p>When a ColorTransform object is applied to a display object, a new value
* for each color channel is calculated like this:</p>
*
* <ul>
*   <li>New red value = (old red value * <code>redMultiplier</code>) +
* <code>redOffset</code></li>
*   <li>New green value = (old green value * <code>greenMultiplier</code>) +
* <code>greenOffset</code></li>
*   <li>New blue value = (old blue value * <code>blueMultiplier</code>) +
* <code>blueOffset</code></li>
*   <li>New alpha value = (old alpha value * <code>alphaMultiplier</code>) +
* <code>alphaOffset</code></li>
* </ul>
*
* <p>If any of the color channel values is greater than 255 after the
* calculation, it is set to 255. If it is less than 0, it is set to 0.</p>
*
* <p>You can use ColorTransform objects in the following ways:</p>
*
* <ul>
*   <li>In the <code>colorTransform</code> parameter of the
* <code>colorTransform()</code> method of the BitmapData class</li>
*   <li>As the <code>colorTransform</code> property of a Transform object
* (which can be used as the <code>transform</code> property of a display
* object)</li>
* </ul>
*
* <p>You must use the <code>new ColorTransform()</code> constructor to create
* a ColorTransform object before you can call the methods of the
* ColorTransform object.</p>
*
* <p>Color transformations do not apply to the background color of a movie
* clip(such as a loaded SWF object). They apply only to graphics and symbols
* that are attached to the movie clip.</p>
*/
declare module away.geom {
    class ColorTransform {
        /**
        * A decimal value that is multiplied with the alpha transparency channel
        * value.
        *
        * <p>If you set the alpha transparency value of a display object directly by
        * using the <code>alpha</code> property of the DisplayObject instance, it
        * affects the value of the <code>alphaMultiplier</code> property of that
        * display object's <code>transform.colorTransform</code> property.</p>
        */
        public alphaMultiplier: number;
        /**
        * A number from -255 to 255 that is added to the alpha transparency channel
        * value after it has been multiplied by the <code>alphaMultiplier</code>
        * value.
        */
        public alphaOffset: number;
        /**
        * A decimal value that is multiplied with the blue channel value.
        */
        public blueMultiplier: number;
        /**
        * A number from -255 to 255 that is added to the blue channel value after it
        * has been multiplied by the <code>blueMultiplier</code> value.
        */
        public blueOffset: number;
        /**
        * A decimal value that is multiplied with the green channel value.
        */
        public greenMultiplier: number;
        /**
        * A number from -255 to 255 that is added to the green channel value after
        * it has been multiplied by the <code>greenMultiplier</code> value.
        */
        public greenOffset: number;
        /**
        * A decimal value that is multiplied with the red channel value.
        */
        public redMultiplier: number;
        /**
        * A number from -255 to 255 that is added to the red channel value after it
        * has been multiplied by the <code>redMultiplier</code> value.
        */
        public redOffset: number;
        /**
        * The RGB color value for a ColorTransform object.
        *
        * <p>When you set this property, it changes the three color offset values
        * (<code>redOffset</code>, <code>greenOffset</code>, and
        * <code>blueOffset</code>) accordingly, and it sets the three color
        * multiplier values(<code>redMultiplier</code>,
        * <code>greenMultiplier</code>, and <code>blueMultiplier</code>) to 0. The
        * alpha transparency multiplier and offset values do not change.</p>
        *
        * <p>When you pass a value for this property, use the format
        * 0x<i>RRGGBB</i>. <i>RR</i>, <i>GG</i>, and <i>BB</i> each consist of two
        * hexadecimal digits that specify the offset of each color component. The 0x
        * tells the ActionScript compiler that the number is a hexadecimal
        * value.</p>
        */
        public color : number;
        /**
        * Creates a ColorTransform object for a display object with the specified
        * color channel values and alpha values.
        *
        * @param redMultiplier   The value for the red multiplier, in the range from
        *                        0 to 1.
        * @param greenMultiplier The value for the green multiplier, in the range
        *                        from 0 to 1.
        * @param blueMultiplier  The value for the blue multiplier, in the range
        *                        from 0 to 1.
        * @param alphaMultiplier The value for the alpha transparency multiplier, in
        *                        the range from 0 to 1.
        * @param redOffset       The offset value for the red color channel, in the
        *                        range from -255 to 255.
        * @param greenOffset     The offset value for the green color channel, in
        *                        the range from -255 to 255.
        * @param blueOffset      The offset for the blue color channel value, in the
        *                        range from -255 to 255.
        * @param alphaOffset     The offset for alpha transparency channel value, in
        *                        the range from -255 to 255.
        */
        constructor(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number);
        /**
        * Concatenates the ColorTranform object specified by the <code>second</code>
        * parameter with the current ColorTransform object and sets the current
        * object as the result, which is an additive combination of the two color
        * transformations. When you apply the concatenated ColorTransform object,
        * the effect is the same as applying the <code>second</code> color
        * transformation after the <i>original</i> color transformation.
        *
        * @param second The ColorTransform object to be combined with the current
        *               ColorTransform object.
        */
        public concat(second: ColorTransform): void;
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
/**
* The Matrix class represents a transformation matrix that determines how to
* map points from one coordinate space to another. You can perform various
* graphical transformations on a display object by setting the properties of
* a Matrix object, applying that Matrix object to the <code>matrix</code>
* property of a Transform object, and then applying that Transform object as
* the <code>transform</code> property of the display object. These
* transformation functions include translation(<i>x</i> and <i>y</i>
* repositioning), rotation, scaling, and skewing.
*
* <p>Together these types of transformations are known as <i>affine
* transformations</i>. Affine transformations preserve the straightness of
* lines while transforming, so that parallel lines stay parallel.</p>
*
* <p>To apply a transformation matrix to a display object, you create a
* Transform object, set its <code>matrix</code> property to the
* transformation matrix, and then set the <code>transform</code> property of
* the display object to the Transform object. Matrix objects are also used as
* parameters of some methods, such as the following:</p>
*
* <ul>
*   <li>The <code>draw()</code> method of a BitmapData object</li>
*   <li>The <code>beginBitmapFill()</code> method,
* <code>beginGradientFill()</code> method, or
* <code>lineGradientStyle()</code> method of a Graphics object</li>
* </ul>
*
* <p>A transformation matrix object is a 3 x 3 matrix with the following
* contents:</p>
*
* <p>In traditional transformation matrixes, the <code>u</code>,
* <code>v</code>, and <code>w</code> properties provide extra capabilities.
* The Matrix class can only operate in two-dimensional space, so it always
* assumes that the property values <code>u</code> and <code>v</code> are 0.0,
* and that the property value <code>w</code> is 1.0. The effective values of
* the matrix are as follows:</p>
*
* <p>You can get and set the values of all six of the other properties in a
* Matrix object: <code>a</code>, <code>b</code>, <code>c</code>,
* <code>d</code>, <code>tx</code>, and <code>ty</code>.</p>
*
* <p>The Matrix class supports the four major types of transformations:
* translation, scaling, rotation, and skewing. You can set three of these
* transformations by using specialized methods, as described in the following
* table: </p>
*
* <p>Each transformation function alters the current matrix properties so
* that you can effectively combine multiple transformations. To do this, you
* call more than one transformation function before applying the matrix to
* its display object target(by using the <code>transform</code> property of
* that display object).</p>
*
* <p>Use the <code>new Matrix()</code> constructor to create a Matrix object
* before you can call the methods of the Matrix object.</p>
*/
declare module away.geom {
    class Matrix {
        /**
        * The value that affects the positioning of pixels along the <i>x</i> axis
        * when scaling or rotating an image.
        */
        public a: number;
        /**
        * The value that affects the positioning of pixels along the <i>y</i> axis
        * when rotating or skewing an image.
        */
        public b: number;
        /**
        * The value that affects the positioning of pixels along the <i>x</i> axis
        * when rotating or skewing an image.
        */
        public c: number;
        /**
        * The value that affects the positioning of pixels along the <i>y</i> axis
        * when scaling or rotating an image.
        */
        public d: number;
        /**
        * The distance by which to translate each point along the <i>x</i> axis.
        */
        public tx: number;
        /**
        * The distance by which to translate each point along the <i>y</i> axis.
        */
        public ty: number;
        /**
        * Creates a new Matrix object with the specified parameters. In matrix
        * notation, the properties are organized like this:
        *
        * <p>If you do not provide any parameters to the <code>new Matrix()</code>
        * constructor, it creates an <i>identity matrix</i> with the following
        * values:</p>
        *
        * <p>In matrix notation, the identity matrix looks like this:</p>
        *
        * @param a  The value that affects the positioning of pixels along the
        *           <i>x</i> axis when scaling or rotating an image.
        * @param b  The value that affects the positioning of pixels along the
        *           <i>y</i> axis when rotating or skewing an image.
        * @param c  The value that affects the positioning of pixels along the
        *           <i>x</i> axis when rotating or skewing an image.
        * @param d  The value that affects the positioning of pixels along the
        *           <i>y</i> axis when scaling or rotating an image..
        * @param tx The distance by which to translate each point along the <i>x</i>
        *           axis.
        * @param ty The distance by which to translate each point along the <i>y</i>
        *           axis.
        */
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
        * Returns a new Matrix object that is a clone of this matrix, with an exact
        * copy of the contained object.
        *
        * @return A Matrix object.
        */
        public clone(): Matrix;
        /**
        * Concatenates a matrix with the current matrix, effectively combining the
        * geometric effects of the two. In mathematical terms, concatenating two
        * matrixes is the same as combining them using matrix multiplication.
        *
        * <p>For example, if matrix <code>m1</code> scales an object by a factor of
        * four, and matrix <code>m2</code> rotates an object by 1.5707963267949
        * radians(<code>Math.PI/2</code>), then <code>m1.concat(m2)</code>
        * transforms <code>m1</code> into a matrix that scales an object by a factor
        * of four and rotates the object by <code>Math.PI/2</code> radians. </p>
        *
        * <p>This method replaces the source matrix with the concatenated matrix. If
        * you want to concatenate two matrixes without altering either of the two
        * source matrixes, first copy the source matrix by using the
        * <code>clone()</code> method, as shown in the Class Examples section.</p>
        *
        * @param matrix The matrix to be concatenated to the source matrix.
        */
        public concat(matrix: Matrix): void;
        /**
        * Copies a Vector3D object into specific column of the calling Matrix3D
        * object.
        *
        * @param column   The column from which to copy the data from.
        * @param vector3D The Vector3D object from which to copy the data.
        */
        public copyColumnFrom(column: number, vector3D: Vector3D): void;
        /**
        * Copies specific column of the calling Matrix object into the Vector3D
        * object. The w element of the Vector3D object will not be changed.
        *
        * @param column   The column from which to copy the data from.
        * @param vector3D The Vector3D object from which to copy the data.
        */
        public copyColumnTo(column: number, vector3D: Vector3D): void;
        /**
        * Copies all of the matrix data from the source Point object into the
        * calling Matrix object.
        *
        * @param sourceMatrix The Matrix object from which to copy the data.
        */
        public copyFrom(sourceMatrix: Matrix): void;
        /**
        * Copies a Vector3D object into specific row of the calling Matrix object.
        *
        * @param row      The row from which to copy the data from.
        * @param vector3D The Vector3D object from which to copy the data.
        */
        public copyRowFrom(row: number, vector3D: Vector3D): void;
        /**
        * Copies specific row of the calling Matrix object into the Vector3D object.
        * The w element of the Vector3D object will not be changed.
        *
        * @param row      The row from which to copy the data from.
        * @param vector3D The Vector3D object from which to copy the data.
        */
        public copyRowTo(row: number, vector3D: Vector3D): void;
        /**
        * Includes parameters for scaling, rotation, and translation. When applied
        * to a matrix it sets the matrix's values based on those parameters.
        *
        * <p>Using the <code>createBox()</code> method lets you obtain the same
        * matrix as you would if you applied the <code>identity()</code>,
        * <code>rotate()</code>, <code>scale()</code>, and <code>translate()</code>
        * methods in succession. For example, <code>mat1.createBox(2,2,Math.PI/4,
        * 100, 100)</code> has the same effect as the following:</p>
        *
        * @param scaleX   The factor by which to scale horizontally.
        * @param scaleY   The factor by which scale vertically.
        * @param rotation The amount to rotate, in radians.
        * @param tx       The number of pixels to translate(move) to the right
        *                 along the <i>x</i> axis.
        * @param ty       The number of pixels to translate(move) down along the
        *                 <i>y</i> axis.
        */
        public createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        /**
        * Creates the specific style of matrix expected by the
        * <code>beginGradientFill()</code> and <code>lineGradientStyle()</code>
        * methods of the Graphics class. Width and height are scaled to a
        * <code>scaleX</code>/<code>scaleY</code> pair and the
        * <code>tx</code>/<code>ty</code> values are offset by half the width and
        * height.
        *
        * <p>For example, consider a gradient with the following
        * characteristics:</p>
        *
        * <ul>
        *   <li><code>GradientType.LINEAR</code></li>
        *   <li>Two colors, green and blue, with the ratios array set to <code>[0,
        * 255]</code></li>
        *   <li><code>SpreadMethod.PAD</code></li>
        *   <li><code>InterpolationMethod.LINEAR_RGB</code></li>
        * </ul>
        *
        * <p>The following illustrations show gradients in which the matrix was
        * defined using the <code>createGradientBox()</code> method with different
        * parameter settings:</p>
        *
        * @param width    The width of the gradient box.
        * @param height   The height of the gradient box.
        * @param rotation The amount to rotate, in radians.
        * @param tx       The distance, in pixels, to translate to the right along
        *                 the <i>x</i> axis. This value is offset by half of the
        *                 <code>width</code> parameter.
        * @param ty       The distance, in pixels, to translate down along the
        *                 <i>y</i> axis. This value is offset by half of the
        *                 <code>height</code> parameter.
        */
        public createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        /**
        * Given a point in the pretransform coordinate space, returns the
        * coordinates of that point after the transformation occurs. Unlike the
        * standard transformation applied using the <code>transformPoint()</code>
        * method, the <code>deltaTransformPoint()</code> method's transformation
        * does not consider the translation parameters <code>tx</code> and
        * <code>ty</code>.
        *
        * @param point The point for which you want to get the result of the matrix
        *              transformation.
        * @return The point resulting from applying the matrix transformation.
        */
        public deltaTransformPoint(point: Point): Point;
        /**
        * Sets each matrix property to a value that causes a null transformation. An
        * object transformed by applying an identity matrix will be identical to the
        * original.
        *
        * <p>After calling the <code>identity()</code> method, the resulting matrix
        * has the following properties: <code>a</code>=1, <code>b</code>=0,
        * <code>c</code>=0, <code>d</code>=1, <code>tx</code>=0,
        * <code>ty</code>=0.</p>
        *
        * <p>In matrix notation, the identity matrix looks like this:</p>
        *
        */
        public identity(): void;
        /**
        * Performs the opposite transformation of the original matrix. You can apply
        * an inverted matrix to an object to undo the transformation performed when
        * applying the original matrix.
        */
        public invert(): void;
        /**
        * Returns a new Matrix object that is a clone of this matrix, with an exact
        * copy of the contained object.
        *
        * @param matrix The matrix for which you want to get the result of the matrix
        *               transformation.
        * @return A Matrix object.
        */
        public multiply(matrix: Matrix): Matrix;
        /**
        * Applies a rotation transformation to the Matrix object.
        *
        * <p>The <code>rotate()</code> method alters the <code>a</code>,
        * <code>b</code>, <code>c</code>, and <code>d</code> properties of the
        * Matrix object. In matrix notation, this is the same as concatenating the
        * current matrix with the following:</p>
        *
        * @param angle The rotation angle in radians.
        */
        public rotate(angle: number): void;
        /**
        * Applies a scaling transformation to the matrix. The <i>x</i> axis is
        * multiplied by <code>sx</code>, and the <i>y</i> axis it is multiplied by
        * <code>sy</code>.
        *
        * <p>The <code>scale()</code> method alters the <code>a</code> and
        * <code>d</code> properties of the Matrix object. In matrix notation, this
        * is the same as concatenating the current matrix with the following
        * matrix:</p>
        *
        * @param sx A multiplier used to scale the object along the <i>x</i> axis.
        * @param sy A multiplier used to scale the object along the <i>y</i> axis.
        */
        public scale(sx: number, sy: number): void;
        /**
        * Sets the members of Matrix to the specified values.
        *
        * @param a  The value that affects the positioning of pixels along the
        *           <i>x</i> axis when scaling or rotating an image.
        * @param b  The value that affects the positioning of pixels along the
        *           <i>y</i> axis when rotating or skewing an image.
        * @param c  The value that affects the positioning of pixels along the
        *           <i>x</i> axis when rotating or skewing an image.
        * @param d  The value that affects the positioning of pixels along the
        *           <i>y</i> axis when scaling or rotating an image..
        * @param tx The distance by which to translate each point along the <i>x</i>
        *           axis.
        * @param ty The distance by which to translate each point along the <i>y</i>
        *           axis.
        */
        public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
        * Returns a text value listing the properties of the Matrix object.
        *
        * @return A string containing the values of the properties of the Matrix
        *         object: <code>a</code>, <code>b</code>, <code>c</code>,
        *         <code>d</code>, <code>tx</code>, and <code>ty</code>.
        */
        public toString(): string;
        /**
        * Returns the result of applying the geometric transformation represented by
        * the Matrix object to the specified point.
        *
        * @param point The point for which you want to get the result of the Matrix
        *              transformation.
        * @return The point resulting from applying the Matrix transformation.
        */
        public transformPoint(point: Point): Point;
        /**
        * Translates the matrix along the <i>x</i> and <i>y</i> axes, as specified
        * by the <code>dx</code> and <code>dy</code> parameters.
        *
        * @param dx The amount of movement along the <i>x</i> axis to the right, in
        *           pixels.
        * @param dy The amount of movement down along the <i>y</i> axis, in pixels.
        */
        public translate(dx: number, dy: number): void;
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
        public appendRotation(degrees: number, axis: Vector3D): void;
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
        public copyColumnFrom(column: number, vector3D: Vector3D): void;
        /**
        * Copies specific column of the calling Matrix3D object into the Vector3D object.
        */
        public copyColumnTo(column: number, vector3D: Vector3D): void;
        /**
        * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
        */
        public copyFrom(sourceMatrix3D: Matrix3D): void;
        public copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        public copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        /**
        * Copies a Vector3D object into specific row of the calling Matrix3D object.
        */
        public copyRowFrom(row: number, vector3D: Vector3D): void;
        /**
        * Copies specific row of the calling Matrix3D object into the Vector3D object.
        */
        public copyRowTo(row: number, vector3D: Vector3D): void;
        /**
        * Copies this Matrix3D object into a destination Matrix3D object.
        */
        public copyToMatrix3D(dest: Matrix3D): void;
        /**
        * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
        */
        public decompose(orientationStyle?: string): Vector3D[];
        /**
        * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space
        * coordinate to another.
        */
        public deltaTransformVector(v: Vector3D): Vector3D;
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
        public prependRotation(degrees: number, axis: Vector3D): void;
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
        public recompose(components: Vector3D[]): boolean;
        public transformVector(v: Vector3D): Vector3D;
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
        public position : Vector3D;
        public toFixed(decimalPlace: number): string;
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
        static CALCULATION_MATRIX: Matrix3D;
        /**
        * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
        *
        * @param    quarternion    The quarterion object to convert.
        */
        static quaternion2matrix(quarternion: Quaternion, m?: Matrix3D): Matrix3D;
        /**
        * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
        * @param    m        The Matrix3D object to use to get the forward vector
        * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
        * @return            The forward vector
        */
        static getForward(m: Matrix3D, v?: Vector3D): Vector3D;
        /**
        * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
        * @param    m        The Matrix3D object to use to get the up vector
        * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
        * @return            The up vector
        */
        static getUp(m: Matrix3D, v?: Vector3D): Vector3D;
        /**
        * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
        * @param    m        The Matrix3D object to use to get the right vector
        * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
        * @return            The right vector
        */
        static getRight(m: Matrix3D, v?: Vector3D): Vector3D;
        /**
        * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
        */
        static compare(m1: Matrix3D, m2: Matrix3D): boolean;
        static lookAt(matrix: Matrix3D, pos: Vector3D, dir: Vector3D, up: Vector3D): void;
        static reflection(plane: Plane3D, target?: Matrix3D): Matrix3D;
        static transformVector(matrix: Matrix3D, vector: Vector3D, result?: Vector3D): Vector3D;
        static deltaTransformVector(matrix: Matrix3D, vector: Vector3D, result?: Vector3D): Vector3D;
        static getTranslation(transform: Matrix3D, result?: Vector3D): Vector3D;
        static deltaTransformVectors(matrix: Matrix3D, vin: number[], vout: number[]): void;
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
/**
* <p>The PerspectiveProjection class provides an easy way to assign or modify
* the perspective transformations of a display object and all of its
* children. For more complex or custom perspective transformations, use the
* Matrix3D class. While the PerspectiveProjection class provides basic
* three-dimensional presentation properties, the Matrix3D class provides more
* detailed control over the three-dimensional presentation of display objects.
* </p>
*
* <p>Projection is a way of representing a three-dimensional object in a
* two-dimensional space, like a cube projected onto a computer screen.
* Perspective projection uses a viewing frustum (a rectangular pyramid) to
* model and project a three-dimensional world and its objects on the screen.
* The viewing frustum becomes increasingly wider as it moves further from the
* origin of the viewpoint. The origin of the viewpoint could be a camera or
* the eyes of an observer facing the screen. The projected perspective
* produces the illusion of three dimensions with depth and distance, where
* the objects closer to the screen appear larger than the objects farther
* from the screen.</p>
*
* <p>A default PerspectiveProjection object is a framework defined for
* perspective transformation of the root object, based on the field of view
* and aspect ratio (dimensions) of the stage. The projection center, the
* vanishing point, is set to the center of the stage, which means the
* three-dimensional display objects disappear toward the center of the stage
* as they move back in the z axis. The default viewpoint is at point (0,0)
* looking down the positive z axis. The y-axis points down toward the bottom
* of the screen. You can gain access to the root display object's perspective
* projection settings and change the field of view and projection center
* properties of the perspectiveProjection property through the root object's
* <code>DisplayObject.transform</code> property.</p>
*
* <p>You can also set a different perspective projection setting for a
* display object through the parent's perspective projection. First, create a
* PerspectiveProjection object and set its <code>fieldOfView</code> and
* <code>projectionCenter</code> properties. Next, assign the
* PerspectiveProjection object to the parent display object using the
* <code>DisplayObject.transform</code> property. The specified projection
* matrix and transformation will then apply to all the display object's
* three-dimensional children.</p>
*
* <p>To modify a perspective projection of the stage or root object: use the
* <code>transform.matrix</code> property of the root display object to gain
* access to the PerspectiveProjection object. Or, apply different perspective
* projection properties to a display object by setting the perspective
* projection properties of the display object's parent. The child display
* object inherits the new properties. Specifically, create a
* PerspectiveProjection object and set its properties, then assign the
* PerspectiveProjection object to the <code>perspectiveProjection</code>
* property of the parent display object's <code>transform</code> property.
* The specified projection transformation then applies to all the display
* object's three-dimensional children.</p>
*
* <p>Since both PerspectiveProjection and Matrix3D objects perform
* perspective transformations, do not assign both to a display object at the
* same time. Use the PerspectiveProjection object for focal length and
* projection center changes. For more control over the perspective
* transformation, create a perspective projection Matrix3D object.</p>
*/
declare module away.geom {
    class PerspectiveProjection {
        private _matrix3D;
        /**
        * Specifies an angle, as a degree between 0 and 180, for the field of
        * view in three dimensions. This value determines how strong the
        * perspective transformation and distortion apply to a
        * three-dimensional display object with a non-zero z-coordinate.
        *
        * <p>A degree close to 0 means that the screen's two-dimensional x-
        * and y-coordinates are roughly the same as the three-dimensional x-,
        * y-, and z-coordinates with little or no distortion. In other words,
        * for a small angle, a display object moving down the z axis appears
        * to stay near the same size and moves little.</p>
        *
        * <p>A value close to 180 degrees results in a fisheye projection effect:
        * positions with a z value smaller than 0 are magnified, while
        * positions with a z value larger than 0 are minimized. With a large
        * angle, a display object moving down the z axis appears to change
        * size quickly and moves a great distance. If the field of view is
        * set to 0 or 180, nothing is seen on the screen.</p>
        */
        public fieldOfView: number;
        /**
        * The distance between the eye or the viewpoint's origin (0,0,0) and
        * the display object located in the z axis. During the perspective
        * transformation, the <code>focalLength</code> is calculated
        * dynamically using the angle of the field of view and the stage's
        * aspect ratio (stage width divided by stage height).
        *
        * @see away.geom.PerspectiveProjection#fieldOfView
        */
        public focalLength: number;
        /**
        * A two-dimensional point representing the center of the projection,
        * the vanishing point for the display object.
        *
        * <p>The <code>projectionCenter</code> property is an offset to the
        * default registration point that is the upper left of the stage,
        * point (0,0). The default projection transformation center is in the
        * middle of the stage, which means the three-dimensional display
        * objects disappear toward the center of the stage as they move
        * backwards in the z axis.</p>
        */
        public projectionCenter: Point;
        /**
        * Creates an instance of a PerspectiveProjection object.
        */
        constructor();
        /**
        * Returns the underlying Matrix3D object of the display object.
        *
        * <p>A display object, like the root object, can have a
        * PerspectiveProjection object without needing a Matrix3D property
        * defined for its transformations. In fact, use either a
        * PerspectiveProjection or a Matrix3D object to specify the
        * perspective transformation. If when using the PerspectiveProjection
        * object, a Matrix3D object was needed, the <code>toMatrix3D()</code>
        * method can retrieve the underlying Matrix3D object of the display
        * object. For example, the <code>toMatrix3D()</code> method can be
        * used with the <code>Utils3D.projectVectors()</code> method.</p>
        *
        * @see away.geom.Matrix3D
        */
        public toMatrix3D(): Matrix3D;
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
        public fromPoints(p0: Vector3D, p1: Vector3D, p2: Vector3D): void;
        /**
        * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
        * @param normal Vector3D
        * @param point  Vector3D
        */
        public fromNormalAndPoint(normal: Vector3D, point: Vector3D): void;
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
        public distance(p: Vector3D): number;
        /**
        * Classify a point against this Plane3D. (in front, back or intersecting)
        * @param p Vector3D
        * @return int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
        */
        public classifyPoint(p: Vector3D, epsilon?: number): number;
        public toString(): string;
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
/**
* The Point object represents a location in a two-dimensional coordinate
* system, where <i>x</i> represents the horizontal axis and <i>y</i>
* represents the vertical axis.
*
* <p>The following code creates a point at(0,0):</p>
*
* <p>Methods and properties of the following classes use Point objects:</p>
*
* <ul>
*   <li>BitmapData</li>
*   <li>DisplayObject</li>
*   <li>DisplayObjectContainer</li>
*   <li>DisplacementMapFilter</li>
*   <li>NativeWindow</li>
*   <li>Matrix</li>
*   <li>Rectangle</li>
* </ul>
*
* <p>You can use the <code>new Point()</code> constructor to create a Point
* object.</p>
*/
declare module away.geom {
    class Point {
        /**
        * The horizontal coordinate of the point. The default value is 0.
        */
        public x: number;
        /**
        * The vertical coordinate of the point. The default value is 0.
        */
        public y: number;
        /**
        * The length of the line segment from(0,0) to this point.
        */
        public length : number;
        /**
        * Creates a new point. If you pass no parameters to this method, a point is
        * created at(0,0).
        *
        * @param x The horizontal coordinate.
        * @param y The vertical coordinate.
        */
        constructor(x?: number, y?: number);
        /**
        * Adds the coordinates of another point to the coordinates of this point to
        * create a new point.
        *
        * @param v The point to be added.
        * @return The new point.
        */
        public add(v: Point): Point;
        /**
        * Creates a copy of this Point object.
        *
        * @return The new Point object.
        */
        public clone(): Point;
        public copyFrom(sourcePoint: Point): void;
        /**
        * Determines whether two points are equal. Two points are equal if they have
        * the same <i>x</i> and <i>y</i> values.
        *
        * @param toCompare The point to be compared.
        * @return A value of <code>true</code> if the object is equal to this Point
        *         object; <code>false</code> if it is not equal.
        */
        public equals(toCompare: Point): boolean;
        /**
        * Scales the line segment between(0,0) and the current point to a set
        * length.
        *
        * @param thickness The scaling value. For example, if the current point is
        *                 (0,5), and you normalize it to 1, the point returned is
        *                  at(0,1).
        */
        public normalize(thickness?: number): void;
        /**
        * Offsets the Point object by the specified amount. The value of
        * <code>dx</code> is added to the original value of <i>x</i> to create the
        * new <i>x</i> value. The value of <code>dy</code> is added to the original
        * value of <i>y</i> to create the new <i>y</i> value.
        *
        * @param dx The amount by which to offset the horizontal coordinate,
        *           <i>x</i>.
        * @param dy The amount by which to offset the vertical coordinate, <i>y</i>.
        */
        public offset(dx: number, dy: number): void;
        public setTo(xa: number, ya: number): void;
        /**
        * Subtracts the coordinates of another point from the coordinates of this
        * point to create a new point.
        *
        * @param v The point to be subtracted.
        * @return The new point.
        */
        public subtract(v: Point): Point;
        /**
        * Returns a string that contains the values of the <i>x</i> and <i>y</i>
        * coordinates. The string has the form <code>"(x=<i>x</i>,
        * y=<i>y</i>)"</code>, so calling the <code>toString()</code> method for a
        * point at 23,17 would return <code>"(x=23, y=17)"</code>.
        *
        * @return The string representation of the coordinates.
        */
        public toString(): string;
        /**
        * Returns the distance between <code>pt1</code> and <code>pt2</code>.
        *
        * @param pt1 The first point.
        * @param pt2 The second point.
        * @return The distance between the first and second points.
        */
        static distance(pt1: Point, pt2: Point): number;
        /**
        * Determines a point between two specified points. The parameter
        * <code>f</code> determines where the new interpolated point is located
        * relative to the two end points specified by parameters <code>pt1</code>
        * and <code>pt2</code>. The closer the value of the parameter <code>f</code>
        * is to <code>1.0</code>, the closer the interpolated point is to the first
        * point(parameter <code>pt1</code>). The closer the value of the parameter
        * <code>f</code> is to 0, the closer the interpolated point is to the second
        * point(parameter <code>pt2</code>).
        *
        * @param pt1 The first point.
        * @param pt2 The second point.
        * @param f   The level of interpolation between the two points. Indicates
        *            where the new point will be, along the line between
        *            <code>pt1</code> and <code>pt2</code>. If <code>f</code>=1,
        *            <code>pt1</code> is returned; if <code>f</code>=0,
        *            <code>pt2</code> is returned.
        * @return The new, interpolated point.
        */
        static interpolate(pt1: Point, pt2: Point, f: number): Point;
        /**
        * Converts a pair of polar coordinates to a Cartesian point coordinate.
        *
        * @param len   The length coordinate of the polar pair.
        * @param angle The angle, in radians, of the polar pair.
        * @return The Cartesian point.
        */
        static polar(len: number, angle: number): Point;
    }
}
declare module away.geom {
    class PoissonLookup {
        static _distributions: number[][];
        static initDistributions(): void;
        static getDistribution(n: number): number[];
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
        public multiplyVector(vector: Vector3D, target?: Quaternion): Quaternion;
        /**
        * Fills the quaternion object with values representing the given rotation around a vector.
        *
        * @param    axis    The axis around which to rotate
        * @param    angle    The angle in radians of the rotation.
        */
        public fromAxisAngle(axis: Vector3D, angle: number): void;
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
        public toEulerAngles(target?: Vector3D): Vector3D;
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
        public toMatrix3D(target?: Matrix3D): Matrix3D;
        /**
        * Extracts a quaternion rotation matrix out of a given Matrix3D object.
        * @param matrix The Matrix3D out of which the rotation will be extracted.
        */
        public fromMatrix(matrix: Matrix3D): void;
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
        public rotatePoint(vector: Vector3D, target?: Vector3D): Vector3D;
        /**
        * Copies the data from a quaternion into this instance.
        * @param q The quaternion to copy from.
        */
        public copyFrom(q: Quaternion): void;
    }
}
/**
* A Rectangle object is an area defined by its position, as indicated by its
* top-left corner point(<i>x</i>, <i>y</i>) and by its width and its height.
*
*
* <p>The <code>x</code>, <code>y</code>, <code>width</code>, and
* <code>height</code> properties of the Rectangle class are independent of
* each other; changing the value of one property has no effect on the others.
* However, the <code>right</code> and <code>bottom</code> properties are
* integrally related to those four properties. For example, if you change the
* value of the <code>right</code> property, the value of the
* <code>width</code> property changes; if you change the <code>bottom</code>
* property, the value of the <code>height</code> property changes. </p>
*
* <p>The following methods and properties use Rectangle objects:</p>
*
* <ul>
*   <li>The <code>applyFilter()</code>, <code>colorTransform()</code>,
* <code>copyChannel()</code>, <code>copyPixels()</code>, <code>draw()</code>,
* <code>fillRect()</code>, <code>generateFilterRect()</code>,
* <code>getColorBoundsRect()</code>, <code>getPixels()</code>,
* <code>merge()</code>, <code>paletteMap()</code>,
* <code>pixelDisolve()</code>, <code>setPixels()</code>, and
* <code>threshold()</code> methods, and the <code>rect</code> property of the
* BitmapData class</li>
*   <li>The <code>getBounds()</code> and <code>getRect()</code> methods, and
* the <code>scrollRect</code> and <code>scale9Grid</code> properties of the
* DisplayObject class</li>
*   <li>The <code>getCharBoundaries()</code> method of the TextField
* class</li>
*   <li>The <code>pixelBounds</code> property of the Transform class</li>
*   <li>The <code>bounds</code> parameter for the <code>startDrag()</code>
* method of the Sprite class</li>
*   <li>The <code>printArea</code> parameter of the <code>addPage()</code>
* method of the PrintJob class</li>
* </ul>
*
* <p>You can use the <code>new Rectangle()</code> constructor to create a
* Rectangle object.</p>
*
* <p><b>Note:</b> The Rectangle class does not define a rectangular Shape
* display object. To draw a rectangular Shape object onscreen, use the
* <code>drawRect()</code> method of the Graphics class.</p>
*/
declare module away.geom {
    class Rectangle {
        private _size;
        private _bottomRight;
        private _topLeft;
        /**
        * The height of the rectangle, in pixels. Changing the <code>height</code>
        * value of a Rectangle object has no effect on the <code>x</code>,
        * <code>y</code>, and <code>width</code> properties.
        */
        public height: number;
        /**
        * The width of the rectangle, in pixels. Changing the <code>width</code>
        * value of a Rectangle object has no effect on the <code>x</code>,
        * <code>y</code>, and <code>height</code> properties.
        */
        public width: number;
        /**
        * The <i>x</i> coordinate of the top-left corner of the rectangle. Changing
        * the value of the <code>x</code> property of a Rectangle object has no
        * effect on the <code>y</code>, <code>width</code>, and <code>height</code>
        * properties.
        *
        * <p>The value of the <code>x</code> property is equal to the value of the
        * <code>left</code> property.</p>
        */
        public x: number;
        /**
        * The <i>y</i> coordinate of the top-left corner of the rectangle. Changing
        * the value of the <code>y</code> property of a Rectangle object has no
        * effect on the <code>x</code>, <code>width</code>, and <code>height</code>
        * properties.
        *
        * <p>The value of the <code>y</code> property is equal to the value of the
        * <code>top</code> property.</p>
        */
        public y: number;
        /**
        * The sum of the <code>y</code> and <code>height</code> properties.
        */
        public bottom : number;
        /**
        * The location of the Rectangle object's bottom-right corner, determined by
        * the values of the <code>right</code> and <code>bottom</code> properties.
        */
        public bottomRight : Point;
        /**
        * The <i>x</i> coordinate of the top-left corner of the rectangle. Changing
        * the <code>left</code> property of a Rectangle object has no effect on the
        * <code>y</code> and <code>height</code> properties. However it does affect
        * the <code>width</code> property, whereas changing the <code>x</code> value
        * does <i>not</i> affect the <code>width</code> property.
        *
        * <p>The value of the <code>left</code> property is equal to the value of
        * the <code>x</code> property.</p>
        */
        public left : number;
        /**
        * The sum of the <code>x</code> and <code>width</code> properties.
        */
        public right : number;
        /**
        * The size of the Rectangle object, expressed as a Point object with the
        * values of the <code>width</code> and <code>height</code> properties.
        */
        public size : Point;
        /**
        * The <i>y</i> coordinate of the top-left corner of the rectangle. Changing
        * the <code>top</code> property of a Rectangle object has no effect on the
        * <code>x</code> and <code>width</code> properties. However it does affect
        * the <code>height</code> property, whereas changing the <code>y</code>
        * value does <i>not</i> affect the <code>height</code> property.
        *
        * <p>The value of the <code>top</code> property is equal to the value of the
        * <code>y</code> property.</p>
        */
        public top : number;
        /**
        * The location of the Rectangle object's top-left corner, determined by the
        * <i>x</i> and <i>y</i> coordinates of the point.
        */
        public topLeft : Point;
        /**
        * Creates a new Rectangle object with the top-left corner specified by the
        * <code>x</code> and <code>y</code> parameters and with the specified
        * <code>width</code> and <code>height</code> parameters. If you call this
        * public without parameters, a rectangle with <code>x</code>,
        * <code>y</code>, <code>width</code>, and <code>height</code> properties set
        * to 0 is created.
        *
        * @param x      The <i>x</i> coordinate of the top-left corner of the
        *               rectangle.
        * @param y      The <i>y</i> coordinate of the top-left corner of the
        *               rectangle.
        * @param width  The width of the rectangle, in pixels.
        * @param height The height of the rectangle, in pixels.
        */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
        * Returns a new Rectangle object with the same values for the
        * <code>x</code>, <code>y</code>, <code>width</code>, and
        * <code>height</code> properties as the original Rectangle object.
        *
        * @return A new Rectangle object with the same values for the
        *         <code>x</code>, <code>y</code>, <code>width</code>, and
        *         <code>height</code> properties as the original Rectangle object.
        */
        public clone(): Rectangle;
        /**
        * Determines whether the specified point is contained within the rectangular
        * region defined by this Rectangle object.
        *
        * @param x The <i>x</i> coordinate(horizontal position) of the point.
        * @param y The <i>y</i> coordinate(vertical position) of the point.
        * @return A value of <code>true</code> if the Rectangle object contains the
        *         specified point; otherwise <code>false</code>.
        */
        public contains(x: number, y: number): boolean;
        /**
        * Determines whether the specified point is contained within the rectangular
        * region defined by this Rectangle object. This method is similar to the
        * <code>Rectangle.contains()</code> method, except that it takes a Point
        * object as a parameter.
        *
        * @param point The point, as represented by its <i>x</i> and <i>y</i>
        *              coordinates.
        * @return A value of <code>true</code> if the Rectangle object contains the
        *         specified point; otherwise <code>false</code>.
        */
        public containsPoint(point: Point): boolean;
        /**
        * Determines whether the Rectangle object specified by the <code>rect</code>
        * parameter is contained within this Rectangle object. A Rectangle object is
        * said to contain another if the second Rectangle object falls entirely
        * within the boundaries of the first.
        *
        * @param rect The Rectangle object being checked.
        * @return A value of <code>true</code> if the Rectangle object that you
        *         specify is contained by this Rectangle object; otherwise
        *         <code>false</code>.
        */
        public containsRect(rect: Rectangle): boolean;
        /**
        * Copies all of rectangle data from the source Rectangle object into the
        * calling Rectangle object.
        *
        * @param sourceRect The Rectangle object from which to copy the data.
        */
        public copyFrom(sourceRect: Rectangle): void;
        /**
        * Determines whether the object specified in the <code>toCompare</code>
        * parameter is equal to this Rectangle object. This method compares the
        * <code>x</code>, <code>y</code>, <code>width</code>, and
        * <code>height</code> properties of an object against the same properties of
        * this Rectangle object.
        *
        * @param toCompare The rectangle to compare to this Rectangle object.
        * @return A value of <code>true</code> if the object has exactly the same
        *         values for the <code>x</code>, <code>y</code>, <code>width</code>,
        *         and <code>height</code> properties as this Rectangle object;
        *         otherwise <code>false</code>.
        */
        public equals(toCompare: Rectangle): boolean;
        /**
        * Increases the size of the Rectangle object by the specified amounts, in
        * pixels. The center point of the Rectangle object stays the same, and its
        * size increases to the left and right by the <code>dx</code> value, and to
        * the top and the bottom by the <code>dy</code> value.
        *
        * @param dx The value to be added to the left and the right of the Rectangle
        *           object. The following equation is used to calculate the new
        *           width and position of the rectangle:
        * @param dy The value to be added to the top and the bottom of the
        *           Rectangle. The following equation is used to calculate the new
        *           height and position of the rectangle:
        */
        public inflate(dx: number, dy: number): void;
        /**
        * Increases the size of the Rectangle object. This method is similar to the
        * <code>Rectangle.inflate()</code> method except it takes a Point object as
        * a parameter.
        *
        * <p>The following two code examples give the same result:</p>
        *
        * @param point The <code>x</code> property of this Point object is used to
        *              increase the horizontal dimension of the Rectangle object.
        *              The <code>y</code> property is used to increase the vertical
        *              dimension of the Rectangle object.
        */
        public inflatePoint(point: Point): void;
        /**
        * If the Rectangle object specified in the <code>toIntersect</code>
        * parameter intersects with this Rectangle object, returns the area of
        * intersection as a Rectangle object. If the rectangles do not intersect,
        * this method returns an empty Rectangle object with its properties set to
        * 0.
        *
        * @param toIntersect The Rectangle object to compare against to see if it
        *                    intersects with this Rectangle object.
        * @return A Rectangle object that equals the area of intersection. If the
        *         rectangles do not intersect, this method returns an empty
        *         Rectangle object; that is, a rectangle with its <code>x</code>,
        *         <code>y</code>, <code>width</code>, and <code>height</code>
        *         properties set to 0.
        */
        public intersection(toIntersect: Rectangle): Rectangle;
        /**
        * Determines whether the object specified in the <code>toIntersect</code>
        * parameter intersects with this Rectangle object. This method checks the
        * <code>x</code>, <code>y</code>, <code>width</code>, and
        * <code>height</code> properties of the specified Rectangle object to see if
        * it intersects with this Rectangle object.
        *
        * @param toIntersect The Rectangle object to compare against this Rectangle
        *                    object.
        * @return A value of <code>true</code> if the specified object intersects
        *         with this Rectangle object; otherwise <code>false</code>.
        */
        public intersects(toIntersect: Rectangle): boolean;
        /**
        * Determines whether or not this Rectangle object is empty.
        *
        * @return A value of <code>true</code> if the Rectangle object's width or
        *         height is less than or equal to 0; otherwise <code>false</code>.
        */
        public isEmpty(): boolean;
        /**
        * Adjusts the location of the Rectangle object, as determined by its
        * top-left corner, by the specified amounts.
        *
        * @param dx Moves the <i>x</i> value of the Rectangle object by this amount.
        * @param dy Moves the <i>y</i> value of the Rectangle object by this amount.
        */
        public offset(dx: number, dy: number): void;
        /**
        * Adjusts the location of the Rectangle object using a Point object as a
        * parameter. This method is similar to the <code>Rectangle.offset()</code>
        * method, except that it takes a Point object as a parameter.
        *
        * @param point A Point object to use to offset this Rectangle object.
        */
        public offsetPoint(point: Point): void;
        /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is
        * empty if its width or height is less than or equal to 0.
        *
        * <p> This method sets the values of the <code>x</code>, <code>y</code>,
        * <code>width</code>, and <code>height</code> properties to 0.</p>
        *
        */
        public setEmpty(): void;
        /**
        * Sets the members of Rectangle to the specified values
        *
        * @param xa      The <i>x</i> coordinate of the top-left corner of the
        *                rectangle.
        * @param ya      The <i>y</i> coordinate of the top-left corner of the
        *                rectangle.
        * @param widtha  The width of the rectangle, in pixels.
        * @param heighta The height of the rectangle, in pixels.
        */
        public setTo(xa: number, ya: number, widtha: number, heighta: number): void;
        /**
        * Builds and returns a string that lists the horizontal and vertical
        * positions and the width and height of the Rectangle object.
        *
        * @return A string listing the value of each of the following properties of
        *         the Rectangle object: <code>x</code>, <code>y</code>,
        *         <code>width</code>, and <code>height</code>.
        */
        public toString(): string;
        /**
        * Adds two rectangles together to create a new Rectangle object, by filling
        * in the horizontal and vertical space between the two rectangles.
        *
        * <p><b>Note:</b> The <code>union()</code> method ignores rectangles with
        * <code>0</code> as the height or width value, such as: <code>var
        * rect2:Rectangle = new Rectangle(300,300,50,0);</code></p>
        *
        * @param toUnion A Rectangle object to add to this Rectangle object.
        * @return A new Rectangle object that is the union of the two rectangles.
        */
        public union(toUnion: Rectangle): Rectangle;
    }
}
/**
* The Transform class provides access to color adjustment properties and two-
* or three-dimensional transformation objects that can be applied to a
* display object. During the transformation, the color or the orientation and
* position of a display object is adjusted(offset) from the current values
* or coordinates to new values or coordinates. The Transform class also
* collects data about color and two-dimensional matrix transformations that
* are applied to a display object and all of its parent objects. You can
* access these combined transformations through the
* <code>concatenatedColorTransform</code> and <code>concatenatedMatrix</code>
* properties.
*
* <p>To apply color transformations: create a ColorTransform object, set the
* color adjustments using the object's methods and properties, and then
* assign the <code>colorTransformation</code> property of the
* <code>transform</code> property of the display object to the new
* ColorTransformation object.</p>
*
* <p>To apply two-dimensional transformations: create a Matrix object, set
* the matrix's two-dimensional transformation, and then assign the
* <code>transform.matrix</code> property of the display object to the new
* Matrix object.</p>
*
* <p>To apply three-dimensional transformations: start with a
* three-dimensional display object. A three-dimensional display object has a
* <code>z</code> property value other than zero. You do not need to create
* the Matrix3D object. For all three-dimensional objects, a Matrix3D object
* is created automatically when you assign a <code>z</code> value to a
* display object. You can access the display object's Matrix3D object through
* the display object's <code>transform</code> property. Using the methods of
* the Matrix3D class, you can add to or modify the existing transformation
* settings. Also, you can create a custom Matrix3D object, set the custom
* Matrix3D object's transformation elements, and then assign the new Matrix3D
* object to the display object using the <code>transform.matrix</code>
* property.</p>
*
* <p>To modify a perspective projection of the stage or root object: use the
* <code>transform.matrix</code> property of the root display object to gain
* access to the PerspectiveProjection object. Or, apply different perspective
* projection properties to a display object by setting the perspective
* projection properties of the display object's parent. The child display
* object inherits the new properties. Specifically, create a
* PerspectiveProjection object and set its properties, then assign the
* PerspectiveProjection object to the <code>perspectiveProjection</code>
* property of the parent display object's <code>transform</code> property.
* The specified projection transformation then applies to all the display
* object's three-dimensional children.</p>
*
* <p>Since both PerspectiveProjection and Matrix3D objects perform
* perspective transformations, do not assign both to a display object at the
* same time. Use the PerspectiveProjection object for focal length and
* projection center changes. For more control over the perspective
* transformation, create a perspective projection Matrix3D object.</p>
*/
declare module away.geom {
    class Transform {
        private _displayObject;
        private _concatenatedColorTransform;
        private _concatenatedMatrix;
        private _pixelBounds;
        public _position: Vector3D;
        /**
        *
        */
        public backVector : Vector3D;
        /**
        * A ColorTransform object containing values that universally adjust the
        * colors in the display object.
        *
        * @throws TypeError The colorTransform is null when being set
        */
        public colorTransform: ColorTransform;
        /**
        * A ColorTransform object representing the combined color transformations
        * applied to the display object and all of its parent objects, back to the
        * root level. If different color transformations have been applied at
        * different levels, all of those transformations are concatenated into one
        * ColorTransform object for this property.
        */
        public concatenatedColorTransform : ColorTransform;
        /**
        * A Matrix object representing the combined transformation matrixes of the
        * display object and all of its parent objects, back to the root level. If
        * different transformation matrixes have been applied at different levels,
        * all of those matrixes are concatenated into one matrix for this property.
        * Also, for resizeable SWF content running in the browser, this property
        * factors in the difference between stage coordinates and window coordinates
        * due to window resizing. Thus, the property converts local coordinates to
        * window coordinates, which may not be the same coordinate space as that of
        * the Stage.
        */
        public concatenatedMatrix : Matrix;
        /**
        *
        */
        public downVector : Vector3D;
        /**
        *
        */
        public forwardVector : Vector3D;
        /**
        *
        */
        public leftVector : Vector3D;
        /**
        * A Matrix object containing values that alter the scaling, rotation, and
        * translation of the display object.
        *
        * <p>If the <code>matrix</code> property is set to a value(not
        * <code>null</code>), the <code>matrix3D</code> property is
        * <code>null</code>. And if the <code>matrix3D</code> property is set to a
        * value(not <code>null</code>), the <code>matrix</code> property is
        * <code>null</code>.</p>
        *
        * @throws TypeError The matrix is null when being set
        */
        public matrix: Matrix;
        /**
        * Provides access to the Matrix3D object of a three-dimensional display
        * object. The Matrix3D object represents a transformation matrix that
        * determines the display object's position and orientation. A Matrix3D
        * object can also perform perspective projection.
        *
        * <p>If the <code>matrix</code> property is set to a value(not
        * <code>null</code>), the <code>matrix3D</code> property is
        * <code>null</code>. And if the <code>matrix3D</code> property is set to a
        * value(not <code>null</code>), the <code>matrix</code> property is
        * <code>null</code>.</p>
        */
        public matrix3D : Matrix3D;
        /**
        * Provides access to the PerspectiveProjection object of a three-dimensional
        * display object. The PerspectiveProjection object can be used to modify the
        * perspective transformation of the stage or to assign a perspective
        * transformation to all the three-dimensional children of a display object.
        *
        * <p>Based on the field of view and aspect ratio(dimensions) of the stage,
        * a default PerspectiveProjection object is assigned to the root object.</p>
        */
        public perspectiveProjection: PerspectiveProjection;
        /**
        * A Rectangle object that defines the bounding rectangle of the display
        * object on the stage.
        */
        public pixelBounds : Rectangle;
        /**
        * Defines the position of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
        */
        public position : Vector3D;
        /**
        *
        */
        public rightVector : Vector3D;
        /**
        * Defines the rotation of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
        */
        public rotation : Vector3D;
        /**
        * Defines the scale of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
        */
        public scale : Vector3D;
        /**
        *
        */
        public upVector : Vector3D;
        constructor(displayObject: base.DisplayObject);
        /**
        * Returns a Matrix3D object, which can transform the space of a specified
        * display object in relation to the current display object's space. You can
        * use the <code>getRelativeMatrix3D()</code> method to move one
        * three-dimensional display object relative to another three-dimensional
        * display object.
        *
        * @param relativeTo The display object relative to which the transformation
        *                   occurs. To get a Matrix3D object relative to the stage,
        *                   set the parameter to the <code>root</code> or
        *                   <code>stage</code> object. To get the world-relative
        *                   matrix of the display object, set the parameter to a
        *                   display object that has a perspective transformation
        *                   applied to it.
        * @return A Matrix3D object that can be used to transform the space from the
        *         <code>relativeTo</code> display object to the current display
        *         object space.
        */
        public getRelativeMatrix3D(relativeTo: base.DisplayObject): Matrix3D;
        /**
        * Moves the 3d object forwards along it's local z axis
        *
        * @param    distance    The length of the movement
        */
        public moveForward(distance: number): void;
        /**
        * Moves the 3d object backwards along it's local z axis
        *
        * @param    distance    The length of the movement
        */
        public moveBackward(distance: number): void;
        /**
        * Moves the 3d object backwards along it's local x axis
        *
        * @param    distance    The length of the movement
        */
        public moveLeft(distance: number): void;
        /**
        * Moves the 3d object forwards along it's local x axis
        *
        * @param    distance    The length of the movement
        */
        public moveRight(distance: number): void;
        /**
        * Moves the 3d object forwards along it's local y axis
        *
        * @param    distance    The length of the movement
        */
        public moveUp(distance: number): void;
        /**
        * Moves the 3d object backwards along it's local y axis
        *
        * @param    distance    The length of the movement
        */
        public moveDown(distance: number): void;
    }
}
declare module away.geom {
    class UVTransform {
        private _uvMatrix;
        private _uvMatrixDirty;
        private _rotation;
        private _scaleU;
        private _scaleV;
        private _offsetU;
        private _offsetV;
        /**
        *
        */
        public offsetU : number;
        /**
        *
        */
        public offsetV : number;
        /**
        *
        */
        public rotation : number;
        /**
        *
        */
        public scaleU : number;
        /**
        *
        */
        public scaleV : number;
        /**
        *
        */
        public matrix : Matrix;
        constructor();
        /**
        * @private
        */
        private updateUVMatrix();
    }
}
/**
* The Vector3D class represents a point or a location in the three-dimensional
* space using the Cartesian coordinates x, y, and z. As in a two-dimensional
* space, the x property represents the horizontal axis and the y property
* represents the vertical axis. In three-dimensional space, the z property
* represents depth. The value of the x property increases as the object moves
* to the right. The value of the y property increases as the object moves
* down. The z property increases as the object moves farther from the point
* of view. Using perspective projection and scaling, the object is seen to be
* bigger when near and smaller when farther away from the screen. As in a
* right-handed three-dimensional coordinate system, the positive z-axis points
* away from the viewer and the value of the z property increases as the object
* moves away from the viewer's eye. The origin point (0,0,0) of the global
* space is the upper-left corner of the stage.
*
* <p>The Vector3D class can also represent a direction, an arrow pointing from
* the origin of the coordinates, such as (0,0,0), to an endpoint; or a
* floating-point component of an RGB (Red, Green, Blue) color model.</p>
*
* <p>Quaternion notation introduces a fourth element, the w property, which
* provides additional orientation information. For example, the w property can
* define an angle of rotation of a Vector3D object. The combination of the
* angle of rotation and the coordinates x, y, and z can determine the display
* object's orientation. Here is a representation of Vector3D elements in
* matrix notation:</p>
*/
declare module away.geom {
    class Vector3D {
        /**
        * The x axis defined as a Vector3D object with coordinates (1,0,0).
        */
        static X_AXIS: Vector3D;
        /**
        * The y axis defined as a Vector3D object with coordinates (0,1,0).
        */
        static Y_AXIS: Vector3D;
        /**
        * The z axis defined as a Vector3D object with coordinates (0,0,1).
        */
        static Z_AXIS: Vector3D;
        /**
        * The first element of a Vector3D object, such as the x coordinate of
        * a point in the three-dimensional space. The default value is 0.
        */
        public x: number;
        public y: number;
        /**
        * The third element of a Vector3D object, such as the y coordinate of
        * a point in the three-dimensional space. The default value is 0.
        */
        public z: number;
        /**
        * TThe fourth element of a Vector3D object (in addition to the x, y,
        * and z properties) can hold data such as the angle of rotation. The
        * default value is 0.
        *
        * <p>Quaternion notation employs an angle as the fourth element in
        * its calculation of three-dimensional rotation. The w property can
        * be used to define the angle of rotation about the Vector3D object.
        * The combination of the rotation angle and the coordinates (x,y,z)
        * determines the display object's orientation.</p>
        *
        * <p>In addition, the w property can be used as a perspective warp
        * factor for a projected three-dimensional position or as a projection
        * transform value in representing a three-dimensional coordinate
        * projected into the two-dimensional space. For example, you can
        * create a projection matrix using the <code>Matrix3D.rawData</code>
        * property, that, when applied to a Vector3D object, produces a
        * transform value in the Vector3D object's fourth element (the w
        * property). Dividing the Vector3D object's other elements by the
        * transform value then produces a projected Vector3D object. You can
        * use the <code>Vector3D.project()</code> method to divide the first
        * three elements of a Vector3D object by its fourth element.</p>
        */
        public w: number;
        /**
        * The length, magnitude, of the current Vector3D object from the
        * origin (0,0,0) to the object's x, y, and z coordinates. The w
        * property is ignored. A unit vector has a length or magnitude of
        * one.
        */
        public length : number;
        /**
        * The square of the length of the current Vector3D object, calculated
        * using the x, y, and z properties. The w property is ignored. Use the
        * <code>lengthSquared()</code> method whenever possible instead of the
        * slower <code>Math.sqrt()</code> method call of the
        * <code>Vector3D.length()</code> method.
        */
        public lengthSquared : number;
        /**
        * Creates an instance of a Vector3D object. If you do not specify a
        * parameter for the constructor, a Vector3D object is created with
        * the elements (0,0,0,0).
        *
        * @param x The first element, such as the x coordinate.
        * @param y The second element, such as the y coordinate.
        * @param z The third element, such as the z coordinate.
        * @param w An optional element for additional data such as the angle
        *          of rotation.
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        /**
        * Adds the value of the x, y, and z elements of the current Vector3D
        * object to the values of the x, y, and z elements of another Vector3D
        * object. The <code>add()</code> method does not change the current
        * Vector3D object. Instead, it returns a new Vector3D object with
        * the new values.
        *
        * <p>The result of adding two vectors together is a resultant vector.
        * One way to visualize the result is by drawing a vector from the
        * origin or tail of the first vector to the end or head of the second
        * vector. The resultant vector is the distance between the origin
        * point of the first vector and the end point of the second vector.
        * </p>
        */
        public add(a: Vector3D): Vector3D;
        /**
        * Returns the angle in radians between two vectors. The returned angle
        * is the smallest radian the first Vector3D object rotates until it
        * aligns with the second Vector3D object.
        *
        * <p>The <code>angleBetween()</code> method is a static method. You
        * can use it directly as a method of the Vector3D class.</p>
        *
        * <p>To convert a degree to a radian, you can use the following
        * formula:</p>
        *
        * <p><code>radian = Math.PI/180 * degree</code></p>
        *
        * @param a The first Vector3D object.
        * @param b The second Vector3D object.
        * @returns The angle between two Vector3D objects.
        */
        static angleBetween(a: Vector3D, b: Vector3D): number;
        /**
        * Returns a new Vector3D object that is an exact copy of the current
        * Vector3D object.
        *
        * @returns A new Vector3D object that is a copy of the current
        * Vector3D object.
        */
        public clone(): Vector3D;
        /**
        * Copies all of vector data from the source Vector3D object into the
        * calling Vector3D object.
        *
        * @param src The Vector3D object from which to copy the data.
        */
        public copyFrom(src: Vector3D): void;
        /**
        * Returns a new Vector3D object that is perpendicular (at a right
        * angle) to the current Vector3D and another Vector3D object. If the
        * returned Vector3D object's coordinates are (0,0,0), then the two
        * Vector3D objects are parallel to each other.
        *
        * <p>You can use the normalized cross product of two vertices of a
        * polygon surface with the normalized vector of the camera or eye
        * viewpoint to get a dot product. The value of the dot product can
        * identify whether a surface of a three-dimensional object is hidden
        * from the viewpoint.</p>
        *
        * @param a A second Vector3D object.
        * @returns A new Vector3D object that is perpendicular to the current
        *          Vector3D object and the Vector3D object specified as the
        *          parameter.
        */
        public crossProduct(a: Vector3D): Vector3D;
        /**
        * Decrements the value of the x, y, and z elements of the current
        * Vector3D object by the values of the x, y, and z elements of
        * specified Vector3D object. Unlike the
        * <code>Vector3D.subtract()</code> method, the
        * <code>decrementBy()</code> method changes the current Vector3D
        * object and does not return a new Vector3D object.
        *
        * @param a The Vector3D object containing the values to subtract from
        *          the current Vector3D object.
        */
        public decrementBy(a: Vector3D): void;
        /**
        * Returns the distance between two Vector3D objects. The
        * <code>distance()</code> method is a static method. You can use it
        * directly as a method of the Vector3D class to get the Euclidean
        * distance between two three-dimensional points.
        *
        * @param pt1 A Vector3D object as the first three-dimensional point.
        * @param pt2 A Vector3D object as the second three-dimensional point.
        * @returns The distance between two Vector3D objects.
        */
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        /**
        * If the current Vector3D object and the one specified as the
        * parameter are unit vertices, this method returns the cosine of the
        * angle between the two vertices. Unit vertices are vertices that
        * point to the same direction but their length is one. They remove the
        * length of the vector as a factor in the result. You can use the
        * <code>normalize()</code> method to convert a vector to a unit
        * vector.
        *
        * <p>The <code>dotProduct()</code> method finds the angle between two
        * vertices. It is also used in backface culling or lighting
        * calculations. Backface culling is a procedure for determining which
        * surfaces are hidden from the viewpoint. You can use the normalized
        * vertices from the camera, or eye, viewpoint and the cross product of
        * the vertices of a polygon surface to get the dot product. If the dot
        * product is less than zero, then the surface is facing the camera or
        * the viewer. If the two unit vertices are perpendicular to each
        * other, they are orthogonal and the dot product is zero. If the two
        * vertices are parallel to each other, the dot product is one.</p>
        *
        * @param a The second Vector3D object.
        * @returns A scalar which is the dot product of the current Vector3D
        *          object and the specified Vector3D object.
        *
        * @see away.geom.Vector3D#crossProduct()
        * @see away.geom.Vector3D#normalize()
        */
        public dotProduct(a: Vector3D): number;
        /**
        * Determines whether two Vector3D objects are equal by comparing the
        * x, y, and z elements of the current Vector3D object with a
        * specified Vector3D object. If the values of these elements are the
        * same, the two Vector3D objects are equal. If the second optional
        * parameter is set to true, all four elements of the Vector3D objects,
        * including the w property, are compared.
        */
        /**
        *
        * @param toCompare The Vector3D object to be compared with the current
        *                  Vector3D object.
        * @param allFour   An optional parameter that specifies whether the w
        *                  property of the Vector3D objects is used in the
        *                  comparison.
        * @returns A value of true if the specified Vector3D object is equal
        *          to the current Vector3D object; false if it is not equal.
        */
        public equals(toCompare: Vector3D, allFour?: boolean): boolean;
        /**
        * Increments the value of the x, y, and z elements of the current
        * Vector3D object by the values of the x, y, and z elements of a
        * specified Vector3D object. Unlike the <code>Vector3D.add()</code>
        * method, the <code>incrementBy()</code> method changes the current
        * Vector3D object and does not return a new Vector3D object.
        *
        * @param a The Vector3D object to be added to the current Vector3D
        *          object.
        */
        public incrementBy(a: Vector3D): void;
        /**
        * Compares the elements of the current Vector3D object with the
        * elements of a specified Vector3D object to determine whether they
        * are nearly equal. The two Vector3D objects are nearly equal if the
        * value of all the elements of the two vertices are equal, or the
        * result of the comparison is within the tolerance range. The
        * difference between two elements must be less than the number
        * specified as the tolerance parameter. If the third optional
        * parameter is set to <code>true</code>, all four elements of the
        * Vector3D objects, including the <code>w</code> property, are
        * compared. Otherwise, only the x, y, and z elements are included in
        * the comparison.
        */
        /**
        *
        * @param toCompare The Vector3D object to be compared with the current
        *                  Vector3D object.
        * @param tolerance A number determining the tolerance factor. If the
        *                  difference between the values of the Vector3D
        *                  element specified in the toCompare parameter and
        *                  the current Vector3D element is less than the
        *                  tolerance number, the two values are considered
        *                  nearly equal.
        * @param allFour   An optional parameter that specifies whether the w
        *                  property of the Vector3D objects is used in the
        *                  comparison.
        * @returns A value of true if the specified Vector3D object is nearly
        *          equal to the current Vector3D object; false if it is not
        *          equal.
        *
        * @see away.geom.Vector3D#equals()
        */
        public nearEquals(toCompare: Vector3D, tolerance: number, allFour?: boolean): boolean;
        /**
        * Sets the current Vector3D object to its inverse. The inverse object
        * is also considered the opposite of the original object. The value of
        * the x, y, and z properties of the current Vector3D object is changed
        * to -x, -y, and -z.
        */
        public negate(): void;
        /**
        * Converts a Vector3D object to a unit vector by dividing the first
        * three elements (x, y, z) by the length of the vector. Unit vertices
        * are vertices that have a direction but their length is one. They
        * simplify vector calculations by removing length as a factor.
        */
        /**
        * Scales the line segment between(0,0) and the current point to a set
        * length.
        *
        * @param thickness The scaling value. For example, if the current
        *                  Vector3D object is (0,3,4), and you normalize it to
        *                  1, the point returned is at(0,0.6,0.8).
        */
        public normalize(thickness?: number): void;
        /**
        * Divides the value of the <code>x</code>, <code>y</code>, and
        * <code>z</code> properties of the current Vector3D object by the
        * value of its <code>w</code> property.
        *
        * <p>If the current Vector3D object is the result of multiplying a
        * Vector3D object by a projection Matrix3D object, the w property can
        * hold the transform value. The <code>project()</code> method then can
        * complete the projection by dividing the elements by the
        * <code>w</code> property. Use the <code>Matrix3D.rawData</code>
        * property to create a projection Matrix3D object.</p>
        */
        public project(): void;
        /**
        * Scales the current Vector3D object by a scalar, a magnitude. The
        * Vector3D object's x, y, and z elements are multiplied by the scalar
        * number specified in the parameter. For example, if the vector is
        * scaled by ten, the result is a vector that is ten times longer. The
        * scalar can also change the direction of the vector. Multiplying the
        * vector by a negative number reverses its direction.
        *
        * @param s A multiplier (scalar) used to scale a Vector3D object.
        
        */
        public scaleBy(s: number): void;
        /**
        * Sets the members of Vector3D to the specified values
        *
        * @param xa The first element, such as the x coordinate.
        * @param ya The second element, such as the y coordinate.
        * @param za The third element, such as the z coordinate.
        */
        public setTo(xa: number, ya: number, za: number): void;
        /**
        * Subtracts the value of the x, y, and z elements of the current
        * Vector3D object from the values of the x, y, and z elements of
        * another Vector3D object. The <code>subtract()</code> method does not
        * change the current Vector3D object. Instead, this method returns a
        * new Vector3D object with the new values.
        *
        * @param a The Vector3D object to be subtracted from the current
        *          Vector3D object.
        * @returns A new Vector3D object that is the difference between the
        *          current Vector3D and the specified Vector3D object.
        *
        * @see away.geom.Vector3D#decrementBy()
        */
        public subtract(a: Vector3D): Vector3D;
        /**
        * Returns a string representation of the current Vector3D object. The
        * string contains the values of the x, y, and z properties.
        */
        public toString(): string;
    }
}
declare module away.bounds {
    class BoundingVolumeBase {
        public _aabb: geom.Box;
        public _pAabbPoints: number[];
        public _pAabbPointsDirty: boolean;
        public _pBoundingEntity: entities.IEntity;
        constructor();
        public aabb : geom.Box;
        public aabbPoints : number[];
        public boundingEntity : entities.IEntity;
        public nullify(): void;
        public disposeRenderable(): void;
        public fromVertices(vertices: number[]): void;
        /**
        * Updates the bounds to fit a Geometry object.
        *
        * @param geometry The Geometry object to be bounded.
        */
        public fromGeometry(geometry: base.Geometry): void;
        public fromSphere(center: geom.Vector3D, radius: number): void;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
        public overlaps(bounds: BoundingVolumeBase): boolean;
        public clone(): BoundingVolumeBase;
        public rayIntersection(position: geom.Vector3D, direction: geom.Vector3D, targetNormal: geom.Vector3D): number;
        public containsPoint(position: geom.Vector3D): boolean;
        public pUpdateAABBPoints(): void;
        public pUpdateBoundingEntity(): void;
        public pCreateBoundingEntity(): entities.IEntity;
        public classifyToPlane(plane: geom.Plane3D): number;
        public transformFrom(bounds: BoundingVolumeBase, matrix: geom.Matrix3D): void;
    }
}
declare module away.bounds {
    class NullBounds extends BoundingVolumeBase {
        private _alwaysIn;
        constructor(alwaysIn?: boolean);
        public clone(): BoundingVolumeBase;
        public pCreateBoundingEntity(): entities.IEntity;
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
        public fromSphere(center: geom.Vector3D, radius: number): void;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public classifyToPlane(plane: geom.Plane3D): number;
        public transformFrom(bounds: BoundingVolumeBase, matrix: geom.Matrix3D): void;
    }
}
declare module away.bounds {
    class BoundingSphere extends BoundingVolumeBase {
        private _radius;
        private _centerX;
        private _centerY;
        private _centerZ;
        constructor();
        public radius : number;
        public nullify(): void;
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
        public fromSphere(center: geom.Vector3D, radius: number): void;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public clone(): BoundingVolumeBase;
        public rayIntersection(position: geom.Vector3D, direction: geom.Vector3D, targetNormal: geom.Vector3D): number;
        public containsPoint(position: geom.Vector3D): boolean;
        public pUpdateBoundingEntity(): void;
        public pCreateBoundingEntity(): entities.IEntity;
        public classifyToPlane(plane: geom.Plane3D): number;
        public transformFrom(bounds: BoundingVolumeBase, matrix: geom.Matrix3D): void;
    }
}
declare module away.bounds {
    /**
    * AxisAlignedBoundingBox represents a bounding box volume that has its planes aligned to the local coordinate axes of the bounded object.
    * This is useful for most meshes.
    */
    class AxisAlignedBoundingBox extends BoundingVolumeBase {
        private _centerX;
        private _centerY;
        private _centerZ;
        private _halfExtentsX;
        private _halfExtentsY;
        private _halfExtentsZ;
        /**
        * Creates a new <code>AxisAlignedBoundingBox</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public nullify(): void;
        /**
        * @inheritDoc
        */
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
        public rayIntersection(position: geom.Vector3D, direction: geom.Vector3D, targetNormal: geom.Vector3D): number;
        /**
        * @inheritDoc
        */
        public containsPoint(position: geom.Vector3D): boolean;
        /**
        * @inheritDoc
        */
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        /**
        * @inheritDoc
        */
        public clone(): BoundingVolumeBase;
        public halfExtentsX : number;
        public halfExtentsY : number;
        public halfExtentsZ : number;
        /**
        * Finds the closest point on the bounding volume to another given point. This can be used for maximum error calculations for content within a given bound.
        * @param point The point for which to find the closest point on the bounding volume
        * @param target An optional Vector3D to store the result to prevent creating a new object.
        * @return
        */
        public closestPointToPoint(point: geom.Vector3D, target?: geom.Vector3D): geom.Vector3D;
        public pUpdateBoundingRenderable(): void;
        public pCreateBoundingEntity(): entities.IEntity;
        public classifyToPlane(plane: geom.Plane3D): number;
        public transformFrom(bounds: BoundingVolumeBase, matrix: geom.Matrix3D): void;
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
    /**
    * The URLLoader is used to load a single file, as part of a resource.
    *
    * While URLLoader can be used directly, e.g. to create a third-party asset
    * management system, it's recommended to use any of the classes Loader3D, AssetLoader
    * and AssetLibrary instead in most cases.
    *
    * @see AssetLoader
    * @see away.library.AssetLibrary
    */
    class URLLoader extends events.EventDispatcher {
        private _XHR;
        private _bytesLoaded;
        private _bytesTotal;
        private _dataFormat;
        private _loadError;
        private _request;
        private _data;
        private _loadStartEvent;
        private _loadErrorEvent;
        private _loadCompleteEvent;
        private _progressEvent;
        /**
        * Creates a new URLLoader object.
        */
        constructor();
        /**
        *
        */
        public url : string;
        /**
        *
        */
        public data : any;
        /**
        *
        * URLLoaderDataFormat.BINARY
        * URLLoaderDataFormat.TEXT
        * URLLoaderDataFormat.VARIABLES
        *
        * @param format
        */
        public dataFormat : string;
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
        * Load a resource from a file.
        *
        * @param request The URLRequest object containing the URL of the object to be loaded.
        */
        public load(request: URLRequest): void;
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
        * @param xhr
        * @param responseType
        */
        private setResponseType(xhr, responseType);
        /**
        *
        * @param request {URLRequest}
        */
        private getRequest(request);
        /**
        *
        * @param request {URLRequest}
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
declare module away.library {
    interface IAsset extends events.IEventDispatcher {
        name: string;
        id: number;
        assetNamespace: string;
        assetType: string;
        assetFullPath: string[];
        assetPathEquals(name: string, ns: string): boolean;
        resetAssetPath(name: string, ns: string, overrideOriginal?: boolean): void;
        dispose(): any;
    }
}
declare module away.library {
    class NamedAssetBase extends events.EventDispatcher {
        static ID_COUNT: number;
        private _originalName;
        private _namespace;
        private _name;
        private _id;
        private _full_path;
        static DEFAULT_NAMESPACE: string;
        constructor(name?: string);
        /**
        *
        */
        public assetType : string;
        /**
        * The original name used for this asset in the resource (e.g. file) in which
        * it was found. This may not be the same as <code>name</code>, which may
        * have changed due to of a name conflict.
        */
        public originalName : string;
        /**
        * A unique id for the asset, used to identify assets in an associative array
        */
        public id : number;
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
        static ANIMATION_NODE: string;
        static ANIMATION_SET: string;
        static ANIMATION_STATE: string;
        static ANIMATOR: string;
        static BILLBOARD: string;
        static CAMERA: string;
        static CONTAINER: string;
        static EFFECTS_METHOD: string;
        static GEOMETRY: string;
        static LINE_SEGMENT: string;
        static LIGHT: string;
        static LIGHT_PICKER: string;
        static MATERIAL: string;
        static MESH: string;
        static TRIANGLE_SUB_MESH: string;
        static LINE_SUB_MESH: string;
        static PRIMITIVE_PREFAB: string;
        static SHADOW_MAP_METHOD: string;
        static SKELETON: string;
        static SKELETON_POSE: string;
        static SKYBOX: string;
        static STATE_TRANSITION: string;
        static TEXTURE: string;
        static TEXTURE_PROJECTOR: string;
    }
}
declare module away.display {
    class ContextMode {
        static AUTO: string;
        static WEBGL: string;
        static FLASH: string;
        static NATIVE: string;
    }
}
/**
* @module away.base
*/
declare module away.display {
    /**
    *
    * @class away.base.IContext
    */
    interface IContext {
        container: HTMLElement;
        clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): any;
        configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): any;
        dispose(): any;
        present(): any;
        setScissorRectangle(rect: geom.Rectangle): any;
    }
}
/**
* A class that provides constant values for visual blend mode effects. These
* constants are used in the following:
* <ul>
*   <li> The <code>blendMode</code> property of the
* flash.display.DisplayObject class.</li>
*   <li> The <code>blendMode</code> parameter of the <code>draw()</code>
* method of the flash.display.BitmapData class</li>
* </ul>
*/
declare module away.base {
    class BlendMode {
        /**
        * Adds the values of the constituent colors of the display object to the
        * colors of its background, applying a ceiling of 0xFF. This setting is
        * commonly used for animating a lightening dissolve between two objects.
        *
        * <p>For example, if the display object has a pixel with an RGB value of
        * 0xAAA633, and the background pixel has an RGB value of 0xDD2200, the
        * resulting RGB value for the displayed pixel is 0xFFC833(because 0xAA +
        * 0xDD > 0xFF, 0xA6 + 0x22 = 0xC8, and 0x33 + 0x00 = 0x33).</p>
        */
        static ADD: string;
        /**
        * Applies the alpha value of each pixel of the display object to the
        * background. This requires the <code>blendMode</code> property of the
        * parent display object be set to
        * <code>away.base.BlendMode.LAYER</code>.
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static ALPHA: string;
        /**
        * Selects the darker of the constituent colors of the display object and the
        * colors of the background(the colors with the smaller values). This
        * setting is commonly used for superimposing type.
        *
        * <p>For example, if the display object has a pixel with an RGB value of
        * 0xFFCC33, and the background pixel has an RGB value of 0xDDF800, the
        * resulting RGB value for the displayed pixel is 0xDDCC00(because 0xFF >
        * 0xDD, 0xCC < 0xF8, and 0x33 > 0x00 = 33).</p>
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static DARKEN: string;
        /**
        * Compares the constituent colors of the display object with the colors of
        * its background, and subtracts the darker of the values of the two
        * constituent colors from the lighter value. This setting is commonly used
        * for more vibrant colors.
        *
        * <p>For example, if the display object has a pixel with an RGB value of
        * 0xFFCC33, and the background pixel has an RGB value of 0xDDF800, the
        * resulting RGB value for the displayed pixel is 0x222C33(because 0xFF -
        * 0xDD = 0x22, 0xF8 - 0xCC = 0x2C, and 0x33 - 0x00 = 0x33).</p>
        */
        static DIFFERENCE: string;
        /**
        * Erases the background based on the alpha value of the display object. This
        * process requires that the <code>blendMode</code> property of the parent
        * display object be set to <code>flash.display.BlendMode.LAYER</code>.
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static ERASE: string;
        /**
        * Adjusts the color of each pixel based on the darkness of the display
        * object. If the display object is lighter than 50% gray, the display object
        * and background colors are screened, which results in a lighter color. If
        * the display object is darker than 50% gray, the colors are multiplied,
        * which results in a darker color. This setting is commonly used for shading
        * effects.
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static HARDLIGHT: string;
        /**
        * Inverts the background.
        */
        static INVERT: string;
        /**
        * Forces the creation of a transparency group for the display object. This
        * means that the display object is precomposed in a temporary buffer before
        * it is processed further. The precomposition is done automatically if the
        * display object is precached by means of bitmap caching or if the display
        * object is a display object container that has at least one child object
        * with a <code>blendMode</code> setting other than <code>"normal"</code>.
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static LAYER: string;
        /**
        * Selects the lighter of the constituent colors of the display object and
        * the colors of the background(the colors with the larger values). This
        * setting is commonly used for superimposing type.
        *
        * <p>For example, if the display object has a pixel with an RGB value of
        * 0xFFCC33, and the background pixel has an RGB value of 0xDDF800, the
        * resulting RGB value for the displayed pixel is 0xFFF833(because 0xFF >
        * 0xDD, 0xCC < 0xF8, and 0x33 > 0x00 = 33).</p>
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static LIGHTEN: string;
        /**
        * Multiplies the values of the display object constituent colors by the
        * constituent colors of the background color, and normalizes by dividing by
        * 0xFF, resulting in darker colors. This setting is commonly used for
        * shadows and depth effects.
        *
        * <p>For example, if a constituent color(such as red) of one pixel in the
        * display object and the corresponding color of the pixel in the background
        * both have the value 0x88, the multiplied result is 0x4840. Dividing by
        * 0xFF yields a value of 0x48 for that constituent color, which is a darker
        * shade than the color of the display object or the color of the
        * background.</p>
        */
        static MULTIPLY: string;
        /**
        * The display object appears in front of the background. Pixel values of the
        * display object override the pixel values of the background. Where the
        * display object is transparent, the background is visible.
        */
        static NORMAL: string;
        /**
        * Adjusts the color of each pixel based on the darkness of the background.
        * If the background is lighter than 50% gray, the display object and
        * background colors are screened, which results in a lighter color. If the
        * background is darker than 50% gray, the colors are multiplied, which
        * results in a darker color. This setting is commonly used for shading
        * effects.
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static OVERLAY: string;
        /**
        * Multiplies the complement(inverse) of the display object color by the
        * complement of the background color, resulting in a bleaching effect. This
        * setting is commonly used for highlights or to remove black areas of the
        * display object.
        */
        static SCREEN: string;
        /**
        * Uses a shader to define the blend between objects.
        *
        * <p>Setting the <code>blendShader</code> property to a Shader instance
        * automatically sets the display object's <code>blendMode</code> property to
        * <code>BlendMode.SHADER</code>. If the <code>blendMode</code> property is
        * set to <code>BlendMode.SHADER</code> without first setting the
        * <code>blendShader</code> property, the <code>blendMode</code> property is
        * set to <code>BlendMode.NORMAL</code> instead. If the
        * <code>blendShader</code> property is set(which sets the
        * <code>blendMode</code> property to <code>BlendMode.SHADER</code>), then
        * later the value of the <code>blendMode</code> property is changed, the
        * blend mode can be reset to use the blend shader simply by setting the
        * <code>blendMode</code> property to <code>BlendMode.SHADER</code>. The
        * <code>blendShader</code> property does not need to be set again except to
        * change the shader that's used to define the blend mode.</p>
        *
        * <p>Not supported under GPU rendering.</p>
        */
        static SHADER: string;
        /**
        * Subtracts the values of the constituent colors in the display object from
        * the values of the background color, applying a floor of 0. This setting is
        * commonly used for animating a darkening dissolve between two objects.
        *
        * <p>For example, if the display object has a pixel with an RGB value of
        * 0xAA2233, and the background pixel has an RGB value of 0xDDA600, the
        * resulting RGB value for the displayed pixel is 0x338400(because 0xDD -
        * 0xAA = 0x33, 0xA6 - 0x22 = 0x84, and 0x00 - 0x33 < 0x00).</p>
        */
        static SUBTRACT: string;
    }
}
/**
*/
declare module away.base {
    class AlignmentMode {
        /**
        *
        */
        static REGISTRATION_POINT: string;
        /**
        *
        */
        static PIVOT_POINT: string;
    }
}
/**
*/
declare module away.base {
    class OrientationMode {
        /**
        *
        */
        static DEFAULT: string;
        /**
        *
        */
        static CAMERA_PLANE: string;
        /**
        *
        */
        static CAMERA_POSITION: string;
    }
}
declare module away.base {
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
        * @param rect
        * @param inputByteArray
        */
        public setPixels(rect: geom.Rectangle, inputByteArray: utils.ByteArray): void;
        /**
        *
        * @param x
        * @param y
        * @param color
        */
        public setPixel32(x: any, y: any, color: number): void;
        public setVector(rect: geom.Rectangle, inputVector: number[]): void;
        /**
        * Copy an HTMLImageElement or BitmapData object
        *
        * @param img {BitmapData} / {HTMLImageElement}
        * @param sourceRect - source rectange to copy from
        * @param destRect - destinatoin rectange to copy to
        */
        public drawImage(img: BitmapData, sourceRect: geom.Rectangle, destRect: geom.Rectangle): any;
        public drawImage(img: HTMLImageElement, sourceRect: geom.Rectangle, destRect: geom.Rectangle): any;
        private _drawImage(img, sourceRect, destRect);
        /**
        *
        * @param bmpd
        * @param sourceRect
        * @param destRect
        */
        public copyPixels(bmpd: BitmapData, sourceRect: geom.Rectangle, destRect: geom.Rectangle): any;
        public copyPixels(bmpd: HTMLImageElement, sourceRect: geom.Rectangle, destRect: geom.Rectangle): any;
        private _copyPixels(bmpd, sourceRect, destRect);
        /**
        *
        * @param rect
        * @param color
        */
        public fillRect(rect: geom.Rectangle, color: number): void;
        /**
        *
        * @param source
        * @param matrix
        */
        public draw(source: BitmapData, matrix?: geom.Matrix): any;
        public draw(source: HTMLImageElement, matrix?: geom.Matrix): any;
        private _draw(source, matrix);
        public copyChannel(sourceBitmap: BitmapData, sourceRect: geom.Rectangle, destPoint: geom.Point, sourceChannel: number, destChannel: number): void;
        public colorTransform(rect: geom.Rectangle, colorTransform: geom.ColorTransform): void;
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
        * @param {Rectangle}
        */
        public rect : geom.Rectangle;
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
declare module away.base {
    class BitmapDataChannel {
        static ALPHA: number;
        static BLUE: number;
        static GREEN: number;
        static RED: number;
    }
}
/**
* The CapsStyle class is an enumeration of constant values that specify the
* caps style to use in drawing lines. The constants are provided for use as
* values in the <code>caps</code> parameter of the
* <code>flash.display.Graphics.lineStyle()</code> method. You can specify the
* following three types of caps:
*/
declare module away.base {
    class CapsStyle {
        /**
        * Used to specify round caps in the <code>caps</code> parameter of the
        * <code>flash.display.Graphics.lineStyle()</code> method.
        */
        static ROUND: string;
        /**
        * Used to specify no caps in the <code>caps</code> parameter of the
        * <code>flash.display.Graphics.lineStyle()</code> method.
        */
        static NONE: string;
        /**
        * Used to specify square caps in the <code>caps</code> parameter of the
        * <code>flash.display.Graphics.lineStyle()</code> method.
        */
        static SQUARE: string;
    }
}
/**
* The DisplayObject class is the base class for all objects that can be
* placed on the display list. The display list manages all objects displayed
* in flash. Use the DisplayObjectContainer class to arrange the
* display objects in the display list. DisplayObjectContainer objects can
* have child display objects, while other display objects, such as Shape and
* TextField objects, are "leaf" nodes that have only parents and siblings, no
* children.
*
* <p>The DisplayObject class supports basic functionality like the <i>x</i>
* and <i>y</i> position of an object, as well as more advanced properties of
* the object such as its transformation matrix. </p>
*
* <p>DisplayObject is an abstract base class; therefore, you cannot call
* DisplayObject directly. Invoking <code>new DisplayObject()</code> throws an
* <code>ArgumentError</code> exception. </p>
*
* <p>All display objects inherit from the DisplayObject class.</p>
*
* <p>The DisplayObject class itself does not include any APIs for rendering
* content onscreen. For that reason, if you want create a custom subclass of
* the DisplayObject class, you will want to extend one of its subclasses that
* do have APIs for rendering content onscreen, such as the Shape, Sprite,
* Bitmap, SimpleButton, TextField, or MovieClip class.</p>
*
* <p>The DisplayObject class contains several broadcast events. Normally, the
* target of any particular event is a specific DisplayObject instance. For
* example, the target of an <code>added</code> event is the specific
* DisplayObject instance that was added to the display list. Having a single
* target restricts the placement of event listeners to that target and in
* some cases the target's ancestors on the display list. With broadcast
* events, however, the target is not a specific DisplayObject instance, but
* rather all DisplayObject instances, including those that are not on the
* display list. This means that you can add a listener to any DisplayObject
* instance to listen for broadcast events. In addition to the broadcast
* events listed in the DisplayObject class's Events table, the DisplayObject
* class also inherits two broadcast events from the EventDispatcher class:
* <code>activate</code> and <code>deactivate</code>.</p>
*
* <p>Some properties previously used in the ActionScript 1.0 and 2.0
* MovieClip, TextField, and Button classes(such as <code>_alpha</code>,
* <code>_height</code>, <code>_name</code>, <code>_width</code>,
* <code>_x</code>, <code>_y</code>, and others) have equivalents in the
* ActionScript 3.0 DisplayObject class that are renamed so that they no
* longer begin with the underscore(_) character.</p>
*
* <p>For more information, see the "Display Programming" chapter of the
* <i>ActionScript 3.0 Developer's Guide</i>.</p>
*
* @event added            Dispatched when a display object is added to the
*                         display list. The following methods trigger this
*                         event:
*                         <code>DisplayObjectContainer.addChild()</code>,
*                         <code>DisplayObjectContainer.addChildAt()</code>.
* @event addedToStage     Dispatched when a display object is added to the on
*                         stage display list, either directly or through the
*                         addition of a sub tree in which the display object
*                         is contained. The following methods trigger this
*                         event:
*                         <code>DisplayObjectContainer.addChild()</code>,
*                         <code>DisplayObjectContainer.addChildAt()</code>.
* @event enterFrame       [broadcast event] Dispatched when the playhead is
*                         entering a new frame. If the playhead is not
*                         moving, or if there is only one frame, this event
*                         is dispatched continuously in conjunction with the
*                         frame rate. This event is a broadcast event, which
*                         means that it is dispatched by all display objects
*                         with a listener registered for this event.
* @event exitFrame        [broadcast event] Dispatched when the playhead is
*                         exiting the current frame. All frame scripts have
*                         been run. If the playhead is not moving, or if
*                         there is only one frame, this event is dispatched
*                         continuously in conjunction with the frame rate.
*                         This event is a broadcast event, which means that
*                         it is dispatched by all display objects with a
*                         listener registered for this event.
* @event frameConstructed [broadcast event] Dispatched after the constructors
*                         of frame display objects have run but before frame
*                         scripts have run. If the playhead is not moving, or
*                         if there is only one frame, this event is
*                         dispatched continuously in conjunction with the
*                         frame rate. This event is a broadcast event, which
*                         means that it is dispatched by all display objects
*                         with a listener registered for this event.
* @event removed          Dispatched when a display object is about to be
*                         removed from the display list. Two methods of the
*                         DisplayObjectContainer class generate this event:
*                         <code>removeChild()</code> and
*                         <code>removeChildAt()</code>.
*
*                         <p>The following methods of a
*                         DisplayObjectContainer object also generate this
*                         event if an object must be removed to make room for
*                         the new object: <code>addChild()</code>,
*                         <code>addChildAt()</code>, and
*                         <code>setChildIndex()</code>. </p>
* @event removedFromStage Dispatched when a display object is about to be
*                         removed from the display list, either directly or
*                         through the removal of a sub tree in which the
*                         display object is contained. Two methods of the
*                         DisplayObjectContainer class generate this event:
*                         <code>removeChild()</code> and
*                         <code>removeChildAt()</code>.
*
*                         <p>The following methods of a
*                         DisplayObjectContainer object also generate this
*                         event if an object must be removed to make room for
*                         the new object: <code>addChild()</code>,
*                         <code>addChildAt()</code>, and
*                         <code>setChildIndex()</code>. </p>
* @event render           [broadcast event] Dispatched when the display list
*                         is about to be updated and rendered. This event
*                         provides the last opportunity for objects listening
*                         for this event to make changes before the display
*                         list is rendered. You must call the
*                         <code>invalidate()</code> method of the Stage
*                         object each time you want a <code>render</code>
*                         event to be dispatched. <code>Render</code> events
*                         are dispatched to an object only if there is mutual
*                         trust between it and the object that called
*                         <code>Stage.invalidate()</code>. This event is a
*                         broadcast event, which means that it is dispatched
*                         by all display objects with a listener registered
*                         for this event.
*
*                         <p><b>Note: </b>This event is not dispatched if the
*                         display is not rendering. This is the case when the
*                         content is either minimized or obscured. </p>
*/
declare module away.base {
    class DisplayObject extends library.NamedAssetBase implements IBitmapDrawable {
        private _loaderInfo;
        private _mouseX;
        private _mouseY;
        private _root;
        private _bounds;
        private _boundsVisible;
        private _depth;
        private _height;
        private _width;
        public _pScene: containers.Scene;
        public _pParent: containers.DisplayObjectContainer;
        public _pSceneTransform: geom.Matrix3D;
        public _pSceneTransformDirty: boolean;
        public _pIsEntity: boolean;
        private _explicitPartition;
        public _pImplicitPartition: partition.Partition;
        private _partitionNode;
        private _sceneTransformChanged;
        private _scenechanged;
        private _transform;
        private _matrix3D;
        private _matrix3DDirty;
        private _inverseSceneTransform;
        private _inverseSceneTransformDirty;
        private _scenePosition;
        private _scenePositionDirty;
        private _explicitVisibility;
        public _pImplicitVisibility: boolean;
        private _explicitMouseEnabled;
        public _pImplicitMouseEnabled: boolean;
        private _listenToSceneTransformChanged;
        private _listenToSceneChanged;
        private _positionDirty;
        private _rotationDirty;
        private _scaleDirty;
        private _positionChanged;
        private _rotationChanged;
        private _scaleChanged;
        private _rotationX;
        private _rotationY;
        private _rotationZ;
        private _eulers;
        private _flipY;
        private _listenToPositionChanged;
        private _listenToRotationChanged;
        private _listenToScaleChanged;
        private _zOffset;
        public _pScaleX: number;
        public _pScaleY: number;
        public _pScaleZ: number;
        private _x;
        private _y;
        private _z;
        private _pivot;
        private _orientationMatrix;
        private _pivotZero;
        private _pivotDirty;
        private _pos;
        private _rot;
        private _sca;
        private _transformComponents;
        public _pIgnoreTransform: boolean;
        private _shaderPickingDetails;
        public _pPickingCollisionVO: pick.PickingCollisionVO;
        public _pBounds: bounds.BoundingVolumeBase;
        public _pBoundsInvalid: boolean;
        private _worldBounds;
        private _worldBoundsInvalid;
        public _pPickingCollider: pick.IPickingCollider;
        public _pRenderables: pool.IRenderable[];
        public _iSourcePrefab: prefabs.PrefabBase;
        /**
        *
        */
        public alignmentMode: string;
        /**
        * Indicates the alpha transparency value of the object specified. Valid
        * values are 0(fully transparent) to 1(fully opaque). The default value is
        * 1. Display objects with <code>alpha</code> set to 0 <i>are</i> active,
        * even though they are invisible.
        */
        public alpha: number;
        /**
        * A value from the BlendMode class that specifies which blend mode to use. A
        * bitmap can be drawn internally in two ways. If you have a blend mode
        * enabled or an external clipping mask, the bitmap is drawn by adding a
        * bitmap-filled square shape to the vector render. If you attempt to set
        * this property to an invalid value, Flash runtimes set the value to
        * <code>BlendMode.NORMAL</code>.
        *
        * <p>The <code>blendMode</code> property affects each pixel of the display
        * object. Each pixel is composed of three constituent colors(red, green,
        * and blue), and each constituent color has a value between 0x00 and 0xFF.
        * Flash Player or Adobe AIR compares each constituent color of one pixel in
        * the movie clip with the corresponding color of the pixel in the
        * background. For example, if <code>blendMode</code> is set to
        * <code>BlendMode.LIGHTEN</code>, Flash Player or Adobe AIR compares the red
        * value of the display object with the red value of the background, and uses
        * the lighter of the two as the value for the red component of the displayed
        * color.</p>
        *
        * <p>The following table describes the <code>blendMode</code> settings. The
        * BlendMode class defines string values you can use. The illustrations in
        * the table show <code>blendMode</code> values applied to a circular display
        * object(2) superimposed on another display object(1).</p>
        */
        public blendMode: BlendMode;
        /**
        *
        */
        public bounds : bounds.BoundingVolumeBase;
        /**
        * If set to <code>true</code>, NME will use the software renderer to cache
        * an internal bitmap representation of the display object. For native targets,
        * this is often much slower than the default hardware renderer. When you
        * are using the Flash target, this caching may increase performance for display
        * objects that contain complex vector content.
        *
        * <p>All vector data for a display object that has a cached bitmap is drawn
        * to the bitmap instead of the main display. If
        * <code>cacheAsBitmapMatrix</code> is null or unsupported, the bitmap is
        * then copied to the main display as unstretched, unrotated pixels snapped
        * to the nearest pixel boundaries. Pixels are mapped 1 to 1 with the parent
        * object. If the bounds of the bitmap change, the bitmap is recreated
        * instead of being stretched.</p>
        *
        * <p>If <code>cacheAsBitmapMatrix</code> is non-null and supported, the
        * object is drawn to the off-screen bitmap using that matrix and the
        * stretched and/or rotated results of that rendering are used to draw the
        * object to the main display.</p>
        *
        * <p>No internal bitmap is created unless the <code>cacheAsBitmap</code>
        * property is set to <code>true</code>.</p>
        *
        * <p>After you set the <code>cacheAsBitmap</code> property to
        * <code>true</code>, the rendering does not change, however the display
        * object performs pixel snapping automatically. The animation speed can be
        * significantly faster depending on the complexity of the vector content.
        * </p>
        *
        * <p>The <code>cacheAsBitmap</code> property is automatically set to
        * <code>true</code> whenever you apply a filter to a display object(when
        * its <code>filter</code> array is not empty), and if a display object has a
        * filter applied to it, <code>cacheAsBitmap</code> is reported as
        * <code>true</code> for that display object, even if you set the property to
        * <code>false</code>. If you clear all filters for a display object, the
        * <code>cacheAsBitmap</code> setting changes to what it was last set to.</p>
        *
        * <p>A display object does not use a bitmap even if the
        * <code>cacheAsBitmap</code> property is set to <code>true</code> and
        * instead renders from vector data in the following cases:</p>
        *
        * <ul>
        *   <li>The bitmap is too large. In AIR 1.5 and Flash Player 10, the maximum
        * size for a bitmap image is 8,191 pixels in width or height, and the total
        * number of pixels cannot exceed 16,777,215 pixels.(So, if a bitmap image
        * is 8,191 pixels wide, it can only be 2,048 pixels high.) In Flash Player 9
        * and earlier, the limitation is is 2880 pixels in height and 2,880 pixels
        * in width.</li>
        *   <li>The bitmap fails to allocate(out of memory error). </li>
        * </ul>
        *
        * <p>The <code>cacheAsBitmap</code> property is best used with movie clips
        * that have mostly static content and that do not scale and rotate
        * frequently. With such movie clips, <code>cacheAsBitmap</code> can lead to
        * performance increases when the movie clip is translated(when its <i>x</i>
        * and <i>y</i> position is changed).</p>
        */
        public cacheAsBitmap: boolean;
        /**
        *
        */
        public castsShadows: boolean;
        /**
        * Indicates the depth of the display object, in pixels. The depth is
        * calculated based on the bounds of the content of the display object. When
        * you set the <code>depth</code> property, the <code>scaleZ</code> property
        * is adjusted accordingly, as shown in the following code:
        *
        * <p>Except for TextField and Video objects, a display object with no
        * content (such as an empty sprite) has a depth of 0, even if you try to
        * set <code>depth</code> to a different value.</p>
        */
        public depth : number;
        /**
        * Defines the rotation of the 3d object as a <code>Vector3D</code> object containing euler angles for rotation around x, y and z axis.
        */
        public eulers : geom.Vector3D;
        /**
        * An object that can contain any extra data.
        */
        public extra: Object;
        /**
        * Indicates the height of the display object, in pixels. The height is
        * calculated based on the bounds of the content of the display object. When
        * you set the <code>height</code> property, the <code>scaleY</code> property
        * is adjusted accordingly, as shown in the following code:
        *
        * <p>Except for TextField and Video objects, a display object with no
        * content (such as an empty sprite) has a height of 0, even if you try to
        * set <code>height</code> to a different value.</p>
        */
        public height : number;
        /**
        * Indicates the instance container index of the DisplayObject. The object can be
        * identified in the child list of its parent display object container by
        * calling the <code>getChildByIndex()</code> method of the display object
        * container.
        *
        * <p>If the DisplayObject has no parent container, index defaults to 0.</p>
        */
        public index : number;
        /**
        *
        */
        public inverseSceneTransform : geom.Matrix3D;
        /**
        *
        */
        public ignoreTransform : boolean;
        /**
        *
        */
        public isEntity : boolean;
        /**
        * Returns a LoaderInfo object containing information about loading the file
        * to which this display object belongs. The <code>loaderInfo</code> property
        * is defined only for the root display object of a SWF file or for a loaded
        * Bitmap(not for a Bitmap that is drawn with ActionScript). To find the
        * <code>loaderInfo</code> object associated with the SWF file that contains
        * a display object named <code>myDisplayObject</code>, use
        * <code>myDisplayObject.root.loaderInfo</code>.
        *
        * <p>A large SWF file can monitor its download by calling
        * <code>this.root.loaderInfo.addEventListener(Event.COMPLETE,
        * func)</code>.</p>
        */
        public loaderInfo : LoaderInfo;
        /**
        * The calling display object is masked by the specified <code>mask</code>
        * object. To ensure that masking works when the Stage is scaled, the
        * <code>mask</code> display object must be in an active part of the display
        * list. The <code>mask</code> object itself is not drawn. Set
        * <code>mask</code> to <code>null</code> to remove the mask.
        *
        * <p>To be able to scale a mask object, it must be on the display list. To
        * be able to drag a mask Sprite object(by calling its
        * <code>startDrag()</code> method), it must be on the display list. To call
        * the <code>startDrag()</code> method for a mask sprite based on a
        * <code>mouseDown</code> event being dispatched by the sprite, set the
        * sprite's <code>buttonMode</code> property to <code>true</code>.</p>
        *
        * <p>When display objects are cached by setting the
        * <code>cacheAsBitmap</code> property to <code>true</code> an the
        * <code>cacheAsBitmapMatrix</code> property to a Matrix object, both the
        * mask and the display object being masked must be part of the same cached
        * bitmap. Thus, if the display object is cached, then the mask must be a
        * child of the display object. If an ancestor of the display object on the
        * display list is cached, then the mask must be a child of that ancestor or
        * one of its descendents. If more than one ancestor of the masked object is
        * cached, then the mask must be a descendent of the cached container closest
        * to the masked object in the display list.</p>
        *
        * <p><b>Note:</b> A single <code>mask</code> object cannot be used to mask
        * more than one calling display object. When the <code>mask</code> is
        * assigned to a second display object, it is removed as the mask of the
        * first object, and that object's <code>mask</code> property becomes
        * <code>null</code>.</p>
        */
        public mask: DisplayObject;
        /**
        * Specifies whether this object receives mouse, or other user input,
        * messages. The default value is <code>true</code>, which means that by
        * default any InteractiveObject instance that is on the display list
        * receives mouse events or other user input events. If
        * <code>mouseEnabled</code> is set to <code>false</code>, the instance does
        * not receive any mouse events(or other user input events like keyboard
        * events). Any children of this instance on the display list are not
        * affected. To change the <code>mouseEnabled</code> behavior for all
        * children of an object on the display list, use
        * <code>flash.display.DisplayObjectContainer.mouseChildren</code>.
        *
        * <p> No event is dispatched by setting this property. You must use the
        * <code>addEventListener()</code> method to create interactive
        * functionality.</p>
        */
        public mouseEnabled : boolean;
        /**
        * Indicates the x coordinate of the mouse or user input device position, in
        * pixels.
        *
        * <p><b>Note</b>: For a DisplayObject that has been rotated, the returned x
        * coordinate will reflect the non-rotated object.</p>
        */
        public mouseX : number;
        /**
        * Indicates the y coordinate of the mouse or user input device position, in
        * pixels.
        *
        * <p><b>Note</b>: For a DisplayObject that has been rotated, the returned y
        * coordinate will reflect the non-rotated object.</p>
        */
        public mouseY : number;
        /**
        * Indicates the instance name of the DisplayObject. The object can be
        * identified in the child list of its parent display object container by
        * calling the <code>getChildByName()</code> method of the display object
        * container.
        *
        * @throws IllegalOperationError If you are attempting to set this property
        *                               on an object that was placed on the timeline
        *                               in the Flash authoring tool.
        */
        public name: string;
        /**
        *
        */
        public orientationMode: string;
        /**
        * Indicates the DisplayObjectContainer object that contains this display
        * object. Use the <code>parent</code> property to specify a relative path to
        * display objects that are above the current display object in the display
        * list hierarchy.
        *
        * <p>You can use <code>parent</code> to move up multiple levels in the
        * display list as in the following:</p>
        *
        * @throws SecurityError The parent display object belongs to a security
        *                       sandbox to which you do not have access. You can
        *                       avoid this situation by having the parent movie call
        *                       the <code>Security.allowDomain()</code> method.
        */
        public parent : containers.DisplayObjectContainer;
        /**
        *
        */
        public partition : partition.Partition;
        /**
        *
        */
        public partitionNode : partition.EntityNode;
        /**
        *
        */
        public pickingCollider : pick.IPickingCollider;
        /**
        * Defines the local point around which the object rotates.
        */
        public pivot : geom.Vector3D;
        /**
        * For a display object in a loaded SWF file, the <code>root</code> property
        * is the top-most display object in the portion of the display list's tree
        * structure represented by that SWF file. For a Bitmap object representing a
        * loaded image file, the <code>root</code> property is the Bitmap object
        * itself. For the instance of the main class of the first SWF file loaded,
        * the <code>root</code> property is the display object itself. The
        * <code>root</code> property of the Stage object is the Stage object itself.
        * The <code>root</code> property is set to <code>null</code> for any display
        * object that has not been added to the display list, unless it has been
        * added to a display object container that is off the display list but that
        * is a child of the top-most display object in a loaded SWF file.
        *
        * <p>For example, if you create a new Sprite object by calling the
        * <code>Sprite()</code> constructor method, its <code>root</code> property
        * is <code>null</code> until you add it to the display list(or to a display
        * object container that is off the display list but that is a child of the
        * top-most display object in a SWF file).</p>
        *
        * <p>For a loaded SWF file, even though the Loader object used to load the
        * file may not be on the display list, the top-most display object in the
        * SWF file has its <code>root</code> property set to itself. The Loader
        * object does not have its <code>root</code> property set until it is added
        * as a child of a display object for which the <code>root</code> property is
        * set.</p>
        */
        public root : containers.DisplayObjectContainer;
        /**
        * Indicates the rotation of the DisplayObject instance, in degrees, from its
        * original orientation. Values from 0 to 180 represent clockwise rotation;
        * values from 0 to -180 represent counterclockwise rotation. Values outside
        * this range are added to or subtracted from 360 to obtain a value within
        * the range. For example, the statement <code>my_video.rotation = 450</code>
        * is the same as <code> my_video.rotation = 90</code>.
        */
        public rotation: number;
        /**
        * Indicates the x-axis rotation of the DisplayObject instance, in degrees,
        * from its original orientation relative to the 3D parent container. Values
        * from 0 to 180 represent clockwise rotation; values from 0 to -180
        * represent counterclockwise rotation. Values outside this range are added
        * to or subtracted from 360 to obtain a value within the range.
        */
        public rotationX : number;
        /**
        * Indicates the y-axis rotation of the DisplayObject instance, in degrees,
        * from its original orientation relative to the 3D parent container. Values
        * from 0 to 180 represent clockwise rotation; values from 0 to -180
        * represent counterclockwise rotation. Values outside this range are added
        * to or subtracted from 360 to obtain a value within the range.
        */
        public rotationY : number;
        /**
        * Indicates the z-axis rotation of the DisplayObject instance, in degrees,
        * from its original orientation relative to the 3D parent container. Values
        * from 0 to 180 represent clockwise rotation; values from 0 to -180
        * represent counterclockwise rotation. Values outside this range are added
        * to or subtracted from 360 to obtain a value within the range.
        */
        public rotationZ : number;
        /**
        * The current scaling grid that is in effect. If set to <code>null</code>,
        * the entire display object is scaled normally when any scale transformation
        * is applied.
        *
        * <p>When you define the <code>scale9Grid</code> property, the display
        * object is divided into a grid with nine regions based on the
        * <code>scale9Grid</code> rectangle, which defines the center region of the
        * grid. The eight other regions of the grid are the following areas: </p>
        *
        * <ul>
        *   <li>The upper-left corner outside of the rectangle</li>
        *   <li>The area above the rectangle </li>
        *   <li>The upper-right corner outside of the rectangle</li>
        *   <li>The area to the left of the rectangle</li>
        *   <li>The area to the right of the rectangle</li>
        *   <li>The lower-left corner outside of the rectangle</li>
        *   <li>The area below the rectangle</li>
        *   <li>The lower-right corner outside of the rectangle</li>
        * </ul>
        *
        * <p>You can think of the eight regions outside of the center(defined by
        * the rectangle) as being like a picture frame that has special rules
        * applied to it when scaled.</p>
        *
        * <p>When the <code>scale9Grid</code> property is set and a display object
        * is scaled, all text and gradients are scaled normally; however, for other
        * types of objects the following rules apply:</p>
        *
        * <ul>
        *   <li>Content in the center region is scaled normally. </li>
        *   <li>Content in the corners is not scaled. </li>
        *   <li>Content in the top and bottom regions is scaled horizontally only.
        * Content in the left and right regions is scaled vertically only.</li>
        *   <li>All fills(including bitmaps, video, and gradients) are stretched to
        * fit their shapes.</li>
        * </ul>
        *
        * <p>If a display object is rotated, all subsequent scaling is normal(and
        * the <code>scale9Grid</code> property is ignored).</p>
        *
        * <p>For example, consider the following display object and a rectangle that
        * is applied as the display object's <code>scale9Grid</code>:</p>
        *
        * <p>A common use for setting <code>scale9Grid</code> is to set up a display
        * object to be used as a component, in which edge regions retain the same
        * width when the component is scaled.</p>
        *
        * @throws ArgumentError If you pass an invalid argument to the method.
        */
        public scale9Grid: geom.Rectangle;
        /**
        * Indicates the horizontal scale(percentage) of the object as applied from
        * the registration point. The default registration point is(0,0). 1.0
        * equals 100% scale.
        *
        * <p>Scaling the local coordinate system changes the <code>x</code> and
        * <code>y</code> property values, which are defined in whole pixels. </p>
        */
        public scaleX : number;
        /**
        * Indicates the vertical scale(percentage) of an object as applied from the
        * registration point of the object. The default registration point is(0,0).
        * 1.0 is 100% scale.
        *
        * <p>Scaling the local coordinate system changes the <code>x</code> and
        * <code>y</code> property values, which are defined in whole pixels. </p>
        */
        public scaleY : number;
        /**
        * Indicates the depth scale(percentage) of an object as applied from the
        * registration point of the object. The default registration point is(0,0).
        * 1.0 is 100% scale.
        *
        * <p>Scaling the local coordinate system changes the <code>x</code>,
        * <code>y</code> and <code>z</code> property values, which are defined in
        * whole pixels. </p>
        */
        public scaleZ : number;
        /**
        *
        */
        public scene : containers.Scene;
        /**
        *
        */
        public scenePosition : geom.Vector3D;
        public sceneTransform : geom.Matrix3D;
        /**
        * The scroll rectangle bounds of the display object. The display object is
        * cropped to the size defined by the rectangle, and it scrolls within the
        * rectangle when you change the <code>x</code> and <code>y</code> properties
        * of the <code>scrollRect</code> object.
        *
        * <p>The properties of the <code>scrollRect</code> Rectangle object use the
        * display object's coordinate space and are scaled just like the overall
        * display object. The corner bounds of the cropped window on the scrolling
        * display object are the origin of the display object(0,0) and the point
        * defined by the width and height of the rectangle. They are not centered
        * around the origin, but use the origin to define the upper-left corner of
        * the area. A scrolled display object always scrolls in whole pixel
        * increments. </p>
        *
        * <p>You can scroll an object left and right by setting the <code>x</code>
        * property of the <code>scrollRect</code> Rectangle object. You can scroll
        * an object up and down by setting the <code>y</code> property of the
        * <code>scrollRect</code> Rectangle object. If the display object is rotated
        * 90° and you scroll it left and right, the display object actually scrolls
        * up and down.</p>
        */
        public scrollRect: geom.Rectangle;
        /**
        *
        */
        public shaderPickingDetails : boolean;
        /**
        *
        */
        public boundsVisible : boolean;
        /**
        * An object with properties pertaining to a display object's matrix, color
        * transform, and pixel bounds. The specific properties  -  matrix,
        * colorTransform, and three read-only properties
        * (<code>concatenatedMatrix</code>, <code>concatenatedColorTransform</code>,
        * and <code>pixelBounds</code>)  -  are described in the entry for the
        * Transform class.
        *
        * <p>Each of the transform object's properties is itself an object. This
        * concept is important because the only way to set new values for the matrix
        * or colorTransform objects is to create a new object and copy that object
        * into the transform.matrix or transform.colorTransform property.</p>
        *
        * <p>For example, to increase the <code>tx</code> value of a display
        * object's matrix, you must make a copy of the entire matrix object, then
        * copy the new object into the matrix property of the transform object:</p>
        * <pre xml:space="preserve"><code> public myMatrix:Matrix =
        * myDisplayObject.transform.matrix; myMatrix.tx += 10;
        * myDisplayObject.transform.matrix = myMatrix; </code></pre>
        *
        * <p>You cannot directly set the <code>tx</code> property. The following
        * code has no effect on <code>myDisplayObject</code>: </p>
        * <pre xml:space="preserve"><code> myDisplayObject.transform.matrix.tx +=
        * 10; </code></pre>
        *
        * <p>You can also copy an entire transform object and assign it to another
        * display object's transform property. For example, the following code
        * copies the entire transform object from <code>myOldDisplayObj</code> to
        * <code>myNewDisplayObj</code>:</p>
        * <code>myNewDisplayObj.transform = myOldDisplayObj.transform;</code>
        *
        * <p>The resulting display object, <code>myNewDisplayObj</code>, now has the
        * same values for its matrix, color transform, and pixel bounds as the old
        * display object, <code>myOldDisplayObj</code>.</p>
        *
        * <p>Note that AIR for TV devices use hardware acceleration, if it is
        * available, for color transforms.</p>
        */
        public transform : geom.Transform;
        /**
        * Whether or not the display object is visible. Display objects that are not
        * visible are disabled. For example, if <code>visible=false</code> for an
        * InteractiveObject instance, it cannot be clicked.
        */
        public visible : boolean;
        /**
        * Indicates the width of the display object, in pixels. The width is
        * calculated based on the bounds of the content of the display object. When
        * you set the <code>width</code> property, the <code>scaleX</code> property
        * is adjusted accordingly, as shown in the following code:
        *
        * <p>Except for TextField and Video objects, a display object with no
        * content(such as an empty sprite) has a width of 0, even if you try to set
        * <code>width</code> to a different value.</p>
        */
        public width : number;
        /**
        *
        */
        public worldBounds : bounds.BoundingVolumeBase;
        /**
        * Indicates the <i>x</i> coordinate of the DisplayObject instance relative
        * to the local coordinates of the parent DisplayObjectContainer. If the
        * object is inside a DisplayObjectContainer that has transformations, it is
        * in the local coordinate system of the enclosing DisplayObjectContainer.
        * Thus, for a DisplayObjectContainer rotated 90° counterclockwise, the
        * DisplayObjectContainer's children inherit a coordinate system that is
        * rotated 90° counterclockwise. The object's coordinates refer to the
        * registration point position.
        */
        public x : number;
        /**
        * Indicates the <i>y</i> coordinate of the DisplayObject instance relative
        * to the local coordinates of the parent DisplayObjectContainer. If the
        * object is inside a DisplayObjectContainer that has transformations, it is
        * in the local coordinate system of the enclosing DisplayObjectContainer.
        * Thus, for a DisplayObjectContainer rotated 90° counterclockwise, the
        * DisplayObjectContainer's children inherit a coordinate system that is
        * rotated 90° counterclockwise. The object's coordinates refer to the
        * registration point position.
        */
        public y : number;
        /**
        * Indicates the z coordinate position along the z-axis of the DisplayObject
        * instance relative to the 3D parent container. The z property is used for
        * 3D coordinates, not screen or pixel coordinates.
        *
        * <p>When you set a <code>z</code> property for a display object to
        * something other than the default value of <code>0</code>, a corresponding
        * Matrix3D object is automatically created. for adjusting a display object's
        * position and orientation in three dimensions. When working with the
        * z-axis, the existing behavior of x and y properties changes from screen or
        * pixel coordinates to positions relative to the 3D parent container.</p>
        *
        * <p>For example, a child of the <code>_root</code> at position x = 100, y =
        * 100, z = 200 is not drawn at pixel location(100,100). The child is drawn
        * wherever the 3D projection calculation puts it. The calculation is:</p>
        *
        * <p><code>(x~~cameraFocalLength/cameraRelativeZPosition,
        * y~~cameraFocalLength/cameraRelativeZPosition)</code></p>
        */
        public z : number;
        /**
        *
        */
        public zOffset : number;
        /**
        * Creates a new <code>DisplayObject</code> instance.
        */
        constructor();
        /**
        *
        */
        public addEventListener(type: string, listener: Function): void;
        /**
        *
        */
        public clone(): DisplayObject;
        /**
        *
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public disposeAsset(): void;
        /**
        * Returns a rectangle that defines the area of the display object relative
        * to the coordinate system of the <code>targetCoordinateSpace</code> object.
        * Consider the following code, which shows how the rectangle returned can
        * vary depending on the <code>targetCoordinateSpace</code> parameter that
        * you pass to the method:
        *
        * <p><b>Note:</b> Use the <code>localToGlobal()</code> and
        * <code>globalToLocal()</code> methods to convert the display object's local
        * coordinates to display coordinates, or display coordinates to local
        * coordinates, respectively.</p>
        *
        * <p>The <code>getBounds()</code> method is similar to the
        * <code>getRect()</code> method; however, the Rectangle returned by the
        * <code>getBounds()</code> method includes any strokes on shapes, whereas
        * the Rectangle returned by the <code>getRect()</code> method does not. For
        * an example, see the description of the <code>getRect()</code> method.</p>
        *
        * @param targetCoordinateSpace The display object that defines the
        *                              coordinate system to use.
        * @return The rectangle that defines the area of the display object relative
        *         to the <code>targetCoordinateSpace</code> object's coordinate
        *         system.
        */
        public getBounds(targetCoordinateSpace: DisplayObject): geom.Rectangle;
        /**
        * Returns a rectangle that defines the boundary of the display object, based
        * on the coordinate system defined by the <code>targetCoordinateSpace</code>
        * parameter, excluding any strokes on shapes. The values that the
        * <code>getRect()</code> method returns are the same or smaller than those
        * returned by the <code>getBounds()</code> method.
        *
        * <p><b>Note:</b> Use <code>localToGlobal()</code> and
        * <code>globalToLocal()</code> methods to convert the display object's local
        * coordinates to Stage coordinates, or Stage coordinates to local
        * coordinates, respectively.</p>
        *
        * @param targetCoordinateSpace The display object that defines the
        *                              coordinate system to use.
        * @return The rectangle that defines the area of the display object relative
        *         to the <code>targetCoordinateSpace</code> object's coordinate
        *         system.
        */
        public getRect(targetCoordinateSpace: DisplayObject): geom.Rectangle;
        /**
        * Converts the <code>point</code> object from the Stage(global) coordinates
        * to the display object's(local) coordinates.
        *
        * <p>To use this method, first create an instance of the Point class. The
        * <i>x</i> and <i>y</i> values that you assign represent global coordinates
        * because they relate to the origin(0,0) of the main display area. Then
        * pass the Point instance as the parameter to the
        * <code>globalToLocal()</code> method. The method returns a new Point object
        * with <i>x</i> and <i>y</i> values that relate to the origin of the display
        * object instead of the origin of the Stage.</p>
        *
        * @param point An object created with the Point class. The Point object
        *              specifies the <i>x</i> and <i>y</i> coordinates as
        *              properties.
        * @return A Point object with coordinates relative to the display object.
        */
        public globalToLocal(point: geom.Point): geom.Point;
        /**
        * Converts a two-dimensional point from the Stage(global) coordinates to a
        * three-dimensional display object's(local) coordinates.
        *
        * <p>To use this method, first create an instance of the Point class. The x
        * and y values that you assign to the Point object represent global
        * coordinates because they are relative to the origin(0,0) of the main
        * display area. Then pass the Point object to the
        * <code>globalToLocal3D()</code> method as the <code>point</code> parameter.
        * The method returns three-dimensional coordinates as a Vector3D object
        * containing <code>x</code>, <code>y</code>, and <code>z</code> values that
        * are relative to the origin of the three-dimensional display object.</p>
        *
        * @param point A two dimensional Point object representing global x and y
        *              coordinates.
        * @return A Vector3D object with coordinates relative to the
        *         three-dimensional display object.
        */
        public globalToLocal3D(point: geom.Point): geom.Vector3D;
        /**
        * Evaluates the bounding box of the display object to see if it overlaps or
        * intersects with the bounding box of the <code>obj</code> display object.
        *
        * @param obj The display object to test against.
        * @return <code>true</code> if the bounding boxes of the display objects
        *         intersect; <code>false</code> if not.
        */
        public hitTestObject(obj: DisplayObject): boolean;
        /**
        * Evaluates the display object to see if it overlaps or intersects with the
        * point specified by the <code>x</code> and <code>y</code> parameters. The
        * <code>x</code> and <code>y</code> parameters specify a point in the
        * coordinate space of the Stage, not the display object container that
        * contains the display object(unless that display object container is the
        * Stage).
        *
        * @param x         The <i>x</i> coordinate to test against this object.
        * @param y         The <i>y</i> coordinate to test against this object.
        * @param shapeFlag Whether to check against the actual pixels of the object
        *                 (<code>true</code>) or the bounding box
        *                 (<code>false</code>).
        * @return <code>true</code> if the display object overlaps or intersects
        *         with the specified point; <code>false</code> otherwise.
        */
        public hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean;
        /**
        * @inheritDoc
        */
        public isIntersectingRay(rayPosition: geom.Vector3D, rayDirection: geom.Vector3D): boolean;
        /**
        * Converts a three-dimensional point of the three-dimensional display
        * object's(local) coordinates to a two-dimensional point in the Stage
        * (global) coordinates.
        *
        * <p>For example, you can only use two-dimensional coordinates(x,y) to draw
        * with the <code>display.Graphics</code> methods. To draw a
        * three-dimensional object, you need to map the three-dimensional
        * coordinates of a display object to two-dimensional coordinates. First,
        * create an instance of the Vector3D class that holds the x-, y-, and z-
        * coordinates of the three-dimensional display object. Then pass the
        * Vector3D object to the <code>local3DToGlobal()</code> method as the
        * <code>point3d</code> parameter. The method returns a two-dimensional Point
        * object that can be used with the Graphics API to draw the
        * three-dimensional object.</p>
        *
        * @param point3d A Vector3D object containing either a three-dimensional
        *                point or the coordinates of the three-dimensional display
        *                object.
        * @return A two-dimensional point representing a three-dimensional point in
        *         two-dimensional space.
        */
        public local3DToGlobal(point3d: geom.Vector3D): geom.Point;
        /**
        * Rotates the 3d object around to face a point defined relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
        *
        * @param    target        The vector defining the point to be looked at
        * @param    upAxis        An optional vector used to define the desired up orientation of the 3d object after rotation has occurred
        */
        public lookAt(target: geom.Vector3D, upAxis?: geom.Vector3D): void;
        /**
        * Converts the <code>point</code> object from the display object's(local)
        * coordinates to the Stage(global) coordinates.
        *
        * <p>This method allows you to convert any given <i>x</i> and <i>y</i>
        * coordinates from values that are relative to the origin(0,0) of a
        * specific display object(local coordinates) to values that are relative to
        * the origin of the Stage(global coordinates).</p>
        *
        * <p>To use this method, first create an instance of the Point class. The
        * <i>x</i> and <i>y</i> values that you assign represent local coordinates
        * because they relate to the origin of the display object.</p>
        *
        * <p>You then pass the Point instance that you created as the parameter to
        * the <code>localToGlobal()</code> method. The method returns a new Point
        * object with <i>x</i> and <i>y</i> values that relate to the origin of the
        * Stage instead of the origin of the display object.</p>
        *
        * @param point The name or identifier of a point created with the Point
        *              class, specifying the <i>x</i> and <i>y</i> coordinates as
        *              properties.
        * @return A Point object with coordinates relative to the Stage.
        */
        public localToGlobal(point: geom.Point): geom.Point;
        /**
        * Moves the 3d object directly to a point in space
        *
        * @param    dx        The amount of movement along the local x axis.
        * @param    dy        The amount of movement along the local y axis.
        * @param    dz        The amount of movement along the local z axis.
        */
        public moveTo(dx: number, dy: number, dz: number): void;
        /**
        * Moves the local point around which the object rotates.
        *
        * @param    dx        The amount of movement along the local x axis.
        * @param    dy        The amount of movement along the local y axis.
        * @param    dz        The amount of movement along the local z axis.
        */
        public movePivot(dx: number, dy: number, dz: number): void;
        /**
        * Rotates the 3d object around it's local x-axis
        *
        * @param    angle        The amount of rotation in degrees
        */
        public pitch(angle: number): void;
        /**
        *
        */
        public getRenderSceneTransform(camera: entities.Camera): geom.Matrix3D;
        /**
        * Rotates the 3d object around it's local z-axis
        *
        * @param    angle        The amount of rotation in degrees
        */
        public roll(angle: number): void;
        /**
        * Rotates the 3d object around an axis by a defined angle
        *
        * @param    axis        The vector defining the axis of rotation
        * @param    angle        The amount of rotation in degrees
        */
        public rotate(axis: geom.Vector3D, angle: number): void;
        /**
        * Rotates the 3d object directly to a euler angle
        *
        * @param    ax        The angle in degrees of the rotation around the x axis.
        * @param    ay        The angle in degrees of the rotation around the y axis.
        * @param    az        The angle in degrees of the rotation around the z axis.
        */
        public rotateTo(ax: number, ay: number, az: number): void;
        /**
        *
        */
        public removeEventListener(type: string, listener: Function): void;
        /**
        * Moves the 3d object along a vector by a defined length
        *
        * @param    axis        The vector defining the axis of movement
        * @param    distance    The length of the movement
        */
        public translate(axis: geom.Vector3D, distance: number): void;
        /**
        * Moves the 3d object along a vector by a defined length
        *
        * @param    axis        The vector defining the axis of movement
        * @param    distance    The length of the movement
        */
        public translateLocal(axis: geom.Vector3D, distance: number): void;
        /**
        * Rotates the 3d object around it's local y-axis
        *
        * @param    angle        The amount of rotation in degrees
        */
        public yaw(angle: number): void;
        /**
        * @internal
        */
        public _iController: controllers.ControllerBase;
        /**
        * @internal
        */
        public _iAssignedPartition : partition.Partition;
        /**
        * The transformation of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
        *
        * @internal
        */
        public _iMatrix3D : geom.Matrix3D;
        /**
        * @internal
        */
        public _iPickingCollisionVO : pick.PickingCollisionVO;
        /**
        * @internal
        */
        public iSetParent(value: containers.DisplayObjectContainer): void;
        /**
        * @protected
        */
        public pCreateDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        /**
        * @protected
        */
        public pInvalidateBounds(): void;
        /**
        * @protected
        */
        public pInvalidateSceneTransform(): void;
        /**
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        * @protected
        */
        public _pUpdateImplicitMouseEnabled(value: boolean): void;
        /**
        * @protected
        */
        public _pUpdateImplicitPartition(value: partition.Partition): void;
        /**
        * @protected
        */
        public _pUpdateImplicitVisibility(value: boolean): void;
        /**
        * @protected
        */
        public _pUpdateMatrix3D(): void;
        /**
        * @protected
        */
        public pUpdateSceneTransform(): void;
        public _iAddRenderable(renderable: pool.IRenderable): pool.IRenderable;
        public _iRemoveRenderable(renderable: pool.IRenderable): pool.IRenderable;
        /**
        * //TODO
        *
        * @param shortestCollisionDistance
        * @param findClosest
        * @returns {boolean}
        *
        * @internal
        */
        public _iTestCollision(shortestCollisionDistance: number, findClosest: boolean): boolean;
        /**
        *
        */
        public _iInternalUpdate(): void;
        /**
        * @internal
        */
        public _iIsVisible(): boolean;
        /**
        * @internal
        */
        public _iIsMouseEnabled(): boolean;
        /**
        * @internal
        */
        public _iSetScene(value: containers.Scene): void;
        /**
        * @protected
        */
        public _pUpdateScene(value: containers.Scene): void;
        /**
        * @private
        */
        private notifyPositionChanged();
        /**
        * @private
        */
        private notifyRotationChanged();
        /**
        * @private
        */
        private notifyScaleChanged();
        /**
        * @private
        */
        private notifySceneChange();
        /**
        * @private
        */
        private notifySceneTransformChange();
        /**
        * Invalidates the 3D transformation matrix, causing it to be updated upon the next request
        *
        * @private
        */
        private invalidateMatrix3D();
        /**
        * @private
        */
        private invalidatePartition();
        /**
        * @private
        */
        private invalidatePivot();
        /**
        * @private
        */
        private invalidatePosition();
        /**
        * @private
        */
        private invalidateRotation();
        /**
        * @private
        */
        private invalidateScale();
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    *
    * Geometry is a collection of SubGeometries, each of which contain the actual geometrical data such as vertices,
    * normals, uvs, etc. It also contains a reference to an animation class, which defines how the geometry moves.
    * A Geometry object is assigned to a Mesh, a scene graph occurence of the geometry, which in turn assigns
    * the SubGeometries to its respective TriangleSubMesh objects.
    *
    *
    *
    * @see away.core.base.SubGeometry
    * @see away.entities.Mesh
    *
    * @class away.base.Geometry
    */
    class Geometry extends library.NamedAssetBase implements library.IAsset {
        private _subGeometries;
        public assetType : string;
        /**
        * A collection of TriangleSubGeometry objects, each of which contain geometrical data such as vertices, normals, etc.
        */
        public subGeometries : SubGeometryBase[];
        public getSubGeometries(): SubGeometryBase[];
        /**
        * Creates a new Geometry object.
        */
        constructor();
        public applyTransformation(transform: geom.Matrix3D): void;
        /**
        * Adds a new TriangleSubGeometry object to the list.
        * @param subGeometry The TriangleSubGeometry object to be added.
        */
        public addSubGeometry(subGeometry: SubGeometryBase): void;
        /**
        * Removes a new TriangleSubGeometry object from the list.
        * @param subGeometry The TriangleSubGeometry object to be removed.
        */
        public removeSubGeometry(subGeometry: SubGeometryBase): void;
        /**
        * Clones the geometry.
        * @return An exact duplicate of the current Geometry object.
        */
        public clone(): Geometry;
        /**
        * Scales the geometry.
        * @param scale The amount by which to scale.
        */
        public scale(scale: number): void;
        /**
        * Clears all resources used by the Geometry object, including SubGeometries.
        */
        public dispose(): void;
        /**
        * Scales the uv coordinates (tiling)
        * @param scaleU The amount by which to scale on the u axis. Default is 1;
        * @param scaleV The amount by which to scale on the v axis. Default is 1;
        */
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public iInvalidateBounds(subGeom: SubGeometryBase): void;
    }
}
/**
* The GradientType class provides values for the <code>type</code> parameter
* in the <code>beginGradientFill()</code> and
* <code>lineGradientStyle()</code> methods of the flash.display.Graphics
* class.
*/
declare module away.base {
    class GradientType {
        /**
        * Value used to specify a linear gradient fill.
        */
        static LINEAR: string;
        /**
        * Value used to specify a radial gradient fill.
        */
        static RADIAL: string;
    }
}
/**
* The Graphics class contains a set of methods that you can use to create a
* vector shape. Display objects that support drawing include Sprite and Shape
* objects. Each of these classes includes a <code>graphics</code> property
* that is a Graphics object. The following are among those helper functions
* provided for ease of use: <code>drawRect()</code>,
* <code>drawRoundRect()</code>, <code>drawCircle()</code>, and
* <code>drawEllipse()</code>.
*
* <p>You cannot create a Graphics object directly from ActionScript code. If
* you call <code>new Graphics()</code>, an exception is thrown.</p>
*
* <p>The Graphics class is final; it cannot be subclassed.</p>
*/
declare module away.base {
    class Graphics {
        /**
        * Fills a drawing area with a bitmap image. The bitmap can be repeated or
        * tiled to fill the area. The fill remains in effect until you call the
        * <code>beginFill()</code>, <code>beginBitmapFill()</code>,
        * <code>beginGradientFill()</code>, or <code>beginShaderFill()</code>
        * method. Calling the <code>clear()</code> method clears the fill.
        *
        * <p>The application renders the fill whenever three or more points are
        * drawn, or when the <code>endFill()</code> method is called. </p>
        *
        * @param bitmap A transparent or opaque bitmap image that contains the bits
        *               to be displayed.
        * @param matrix A matrix object(of the flash.geom.Matrix class), which you
        *               can use to define transformations on the bitmap. For
        *               example, you can use the following matrix to rotate a bitmap
        *               by 45 degrees(pi/4 radians):
        * @param repeat If <code>true</code>, the bitmap image repeats in a tiled
        *               pattern. If <code>false</code>, the bitmap image does not
        *               repeat, and the edges of the bitmap are used for any fill
        *               area that extends beyond the bitmap.
        *
        *               <p>For example, consider the following bitmap(a 20 x
        *               20-pixel checkerboard pattern):</p>
        *
        *               <p>When <code>repeat</code> is set to <code>true</code>(as
        *               in the following example), the bitmap fill repeats the
        *               bitmap:</p>
        *
        *               <p>When <code>repeat</code> is set to <code>false</code>,
        *               the bitmap fill uses the edge pixels for the fill area
        *               outside the bitmap:</p>
        * @param smooth If <code>false</code>, upscaled bitmap images are rendered
        *               by using a nearest-neighbor algorithm and look pixelated. If
        *               <code>true</code>, upscaled bitmap images are rendered by
        *               using a bilinear algorithm. Rendering by using the nearest
        *               neighbor algorithm is faster.
        */
        public beginBitmapFill(bitmap: BitmapData, matrix?: geom.Matrix, repeat?: boolean, smooth?: boolean): void;
        /**
        * Specifies a simple one-color fill that subsequent calls to other Graphics
        * methods(such as <code>lineTo()</code> or <code>drawCircle()</code>) use
        * when drawing. The fill remains in effect until you call the
        * <code>beginFill()</code>, <code>beginBitmapFill()</code>,
        * <code>beginGradientFill()</code>, or <code>beginShaderFill()</code>
        * method. Calling the <code>clear()</code> method clears the fill.
        *
        * <p>The application renders the fill whenever three or more points are
        * drawn, or when the <code>endFill()</code> method is called.</p>
        *
        * @param color The color of the fill(0xRRGGBB).
        * @param alpha The alpha value of the fill(0.0 to 1.0).
        */
        public beginFill(color: number, alpha?: number): void;
        /**
        * Specifies a gradient fill used by subsequent calls to other Graphics
        * methods(such as <code>lineTo()</code> or <code>drawCircle()</code>) for
        * the object. The fill remains in effect until you call the
        * <code>beginFill()</code>, <code>beginBitmapFill()</code>,
        * <code>beginGradientFill()</code>, or <code>beginShaderFill()</code>
        * method. Calling the <code>clear()</code> method clears the fill.
        *
        * <p>The application renders the fill whenever three or more points are
        * drawn, or when the <code>endFill()</code> method is called. </p>
        *
        * @param type                A value from the GradientType class that
        *                            specifies which gradient type to use:
        *                            <code>GradientType.LINEAR</code> or
        *                            <code>GradientType.RADIAL</code>.
        * @param colors              An array of RGB hexadecimal color values used
        *                            in the gradient; for example, red is 0xFF0000,
        *                            blue is 0x0000FF, and so on. You can specify
        *                            up to 15 colors. For each color, specify a
        *                            corresponding value in the alphas and ratios
        *                            parameters.
        * @param alphas              An array of alpha values for the corresponding
        *                            colors in the colors array; valid values are 0
        *                            to 1. If the value is less than 0, the default
        *                            is 0. If the value is greater than 1, the
        *                            default is 1.
        * @param ratios              An array of color distribution ratios; valid
        *                            values are 0-255. This value defines the
        *                            percentage of the width where the color is
        *                            sampled at 100%. The value 0 represents the
        *                            left position in the gradient box, and 255
        *                            represents the right position in the gradient
        *                            box.
        * @param matrix              A transformation matrix as defined by the
        *                            flash.geom.Matrix class. The flash.geom.Matrix
        *                            class includes a
        *                            <code>createGradientBox()</code> method, which
        *                            lets you conveniently set up the matrix for use
        *                            with the <code>beginGradientFill()</code>
        *                            method.
        * @param spreadMethod        A value from the SpreadMethod class that
        *                            specifies which spread method to use, either:
        *                            <code>SpreadMethod.PAD</code>,
        *                            <code>SpreadMethod.REFLECT</code>, or
        *                            <code>SpreadMethod.REPEAT</code>.
        *
        *                            <p>For example, consider a simple linear
        *                            gradient between two colors:</p>
        *
        *                            <p>This example uses
        *                            <code>SpreadMethod.PAD</code> for the spread
        *                            method, and the gradient fill looks like the
        *                            following:</p>
        *
        *                            <p>If you use <code>SpreadMethod.REFLECT</code>
        *                            for the spread method, the gradient fill looks
        *                            like the following:</p>
        *
        *                            <p>If you use <code>SpreadMethod.REPEAT</code>
        *                            for the spread method, the gradient fill looks
        *                            like the following:</p>
        * @param interpolationMethod A value from the InterpolationMethod class that
        *                            specifies which value to use:
        *                            <code>InterpolationMethod.LINEAR_RGB</code> or
        *                            <code>InterpolationMethod.RGB</code>
        *
        *                            <p>For example, consider a simple linear
        *                            gradient between two colors(with the
        *                            <code>spreadMethod</code> parameter set to
        *                            <code>SpreadMethod.REFLECT</code>). The
        *                            different interpolation methods affect the
        *                            appearance as follows: </p>
        * @param focalPointRatio     A number that controls the location of the
        *                            focal point of the gradient. 0 means that the
        *                            focal point is in the center. 1 means that the
        *                            focal point is at one border of the gradient
        *                            circle. -1 means that the focal point is at the
        *                            other border of the gradient circle. A value
        *                            less than -1 or greater than 1 is rounded to -1
        *                            or 1. For example, the following example shows
        *                            a <code>focalPointRatio</code> set to 0.75:
        * @throws ArgumentError If the <code>type</code> parameter is not valid.
        */
        public beginGradientFill(type: GradientType, colors: number[], alphas: number[], ratios: number[], matrix?: geom.Matrix, spreadMethod?: string, interpolationMethod?: string, focalPointRatio?: number): void;
        /**
        * Clears the graphics that were drawn to this Graphics object, and resets
        * fill and line style settings.
        *
        */
        public clear(): void;
        /**
        * Copies all of drawing commands from the source Graphics object into the
        * calling Graphics object.
        *
        * @param sourceGraphics The Graphics object from which to copy the drawing
        *                       commands.
        */
        public copyFrom(sourceGraphics: Graphics): void;
        /**
        * Draws a cubic Bezier curve from the current drawing position to the
        * specified anchor point. Cubic Bezier curves consist of two anchor points
        * and two control points. The curve interpolates the two anchor points and
        * curves toward the two control points.
        *
        * The four points you use to draw a cubic Bezier curve with the
        * <code>cubicCurveTo()</code> method are as follows:
        *
        * <ul>
        *   <li>The current drawing position is the first anchor point. </li>
        *   <li>The anchorX and anchorY parameters specify the second anchor point.
        *   </li>
        *   <li>The <code>controlX1</code> and <code>controlY1</code> parameters
        *   specify the first control point.</li>
        *   <li>The <code>controlX2</code> and <code>controlY2</code> parameters
        *   specify the second control point.</li>
        * </ul>
        *
        * If you call the <code>cubicCurveTo()</code> method before calling the
        * <code>moveTo()</code> method, your curve starts at position (0, 0).
        *
        * If the <code>cubicCurveTo()</code> method succeeds, the Flash runtime sets
        * the current drawing position to (<code>anchorX</code>,
        * <code>anchorY</code>). If the <code>cubicCurveTo()</code> method fails,
        * the current drawing position remains unchanged.
        *
        * If your movie clip contains content created with the Flash drawing tools,
        * the results of calls to the <code>cubicCurveTo()</code> method are drawn
        * underneath that content.
        *
        * @param controlX1 Specifies the horizontal position of the first control
        *                  point relative to the registration point of the parent
        *                  display object.
        * @param controlY1 Specifies the vertical position of the first control
        *                  point relative to the registration point of the parent
        *                  display object.
        * @param controlX2 Specifies the horizontal position of the second control
        *                  point relative to the registration point of the parent
        *                  display object.
        * @param controlY2 Specifies the vertical position of the second control
        *                  point relative to the registration point of the parent
        *                  display object.
        * @param anchorX   Specifies the horizontal position of the anchor point
        *                  relative to the registration point of the parent display
        *                  object.
        * @param anchorY   Specifies the vertical position of the anchor point
        *                  relative to the registration point of the parent display
        *                  object.
        */
        public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        /**
        * Draws a curve using the current line style from the current drawing
        * position to(anchorX, anchorY) and using the control point that
        * (<code>controlX</code>, <code>controlY</code>) specifies. The current
        * drawing position is then set to(<code>anchorX</code>,
        * <code>anchorY</code>). If the movie clip in which you are drawing contains
        * content created with the Flash drawing tools, calls to the
        * <code>curveTo()</code> method are drawn underneath this content. If you
        * call the <code>curveTo()</code> method before any calls to the
        * <code>moveTo()</code> method, the default of the current drawing position
        * is(0, 0). If any of the parameters are missing, this method fails and the
        * current drawing position is not changed.
        *
        * <p>The curve drawn is a quadratic Bezier curve. Quadratic Bezier curves
        * consist of two anchor points and one control point. The curve interpolates
        * the two anchor points and curves toward the control point. </p>
        *
        * @param controlX A number that specifies the horizontal position of the
        *                 control point relative to the registration point of the
        *                 parent display object.
        * @param controlY A number that specifies the vertical position of the
        *                 control point relative to the registration point of the
        *                 parent display object.
        * @param anchorX  A number that specifies the horizontal position of the
        *                 next anchor point relative to the registration point of
        *                 the parent display object.
        * @param anchorY  A number that specifies the vertical position of the next
        *                 anchor point relative to the registration point of the
        *                 parent display object.
        */
        public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        /**
        * Draws a circle. Set the line style, fill, or both before you call the
        * <code>drawCircle()</code> method, by calling the <code>linestyle()</code>,
        * <code>lineGradientStyle()</code>, <code>beginFill()</code>,
        * <code>beginGradientFill()</code>, or <code>beginBitmapFill()</code>
        * method.
        *
        * @param x      The <i>x</i> location of the center of the circle relative
        *               to the registration point of the parent display object(in
        *               pixels).
        * @param y      The <i>y</i> location of the center of the circle relative
        *               to the registration point of the parent display object(in
        *               pixels).
        * @param radius The radius of the circle(in pixels).
        */
        public drawCircle(x: number, y: number, radius: number): void;
        /**
        * Draws an ellipse. Set the line style, fill, or both before you call the
        * <code>drawEllipse()</code> method, by calling the
        * <code>linestyle()</code>, <code>lineGradientStyle()</code>,
        * <code>beginFill()</code>, <code>beginGradientFill()</code>, or
        * <code>beginBitmapFill()</code> method.
        *
        * @param x      The <i>x</i> location of the top-left of the bounding-box of
        *               the ellipse relative to the registration point of the parent
        *               display object(in pixels).
        * @param y      The <i>y</i> location of the top left of the bounding-box of
        *               the ellipse relative to the registration point of the parent
        *               display object(in pixels).
        * @param width  The width of the ellipse(in pixels).
        * @param height The height of the ellipse(in pixels).
        */
        public drawEllipse(x: number, y: number, width: number, height: number): void;
        /**
        * Submits a series of IGraphicsData instances for drawing. This method
        * accepts a Vector containing objects including paths, fills, and strokes
        * that implement the IGraphicsData interface. A Vector of IGraphicsData
        * instances can refer to a part of a shape, or a complex fully defined set
        * of data for rendering a complete shape.
        *
        * <p> Graphics paths can contain other graphics paths. If the
        * <code>graphicsData</code> Vector includes a path, that path and all its
        * sub-paths are rendered during this operation. </p>
        *
        */
        public drawGraphicsData(graphicsData: IGraphicsData[]): void;
        /**
        * Submits a series of commands for drawing. The <code>drawPath()</code>
        * method uses vector arrays to consolidate individual <code>moveTo()</code>,
        * <code>lineTo()</code>, and <code>curveTo()</code> drawing commands into a
        * single call. The <code>drawPath()</code> method parameters combine drawing
        * commands with x- and y-coordinate value pairs and a drawing direction. The
        * drawing commands are values from the GraphicsPathCommand class. The x- and
        * y-coordinate value pairs are Numbers in an array where each pair defines a
        * coordinate location. The drawing direction is a value from the
        * GraphicsPathWinding class.
        *
        * <p> Generally, drawings render faster with <code>drawPath()</code> than
        * with a series of individual <code>lineTo()</code> and
        * <code>curveTo()</code> methods. </p>
        *
        * <p> The <code>drawPath()</code> method uses a uses a floating computation
        * so rotation and scaling of shapes is more accurate and gives better
        * results. However, curves submitted using the <code>drawPath()</code>
        * method can have small sub-pixel alignment errors when used in conjunction
        * with the <code>lineTo()</code> and <code>curveTo()</code> methods. </p>
        *
        * <p> The <code>drawPath()</code> method also uses slightly different rules
        * for filling and drawing lines. They are: </p>
        *
        * <ul>
        *   <li>When a fill is applied to rendering a path:
        * <ul>
        *   <li>A sub-path of less than 3 points is not rendered.(But note that the
        * stroke rendering will still occur, consistent with the rules for strokes
        * below.)</li>
        *   <li>A sub-path that isn't closed(the end point is not equal to the
        * begin point) is implicitly closed.</li>
        * </ul>
        * </li>
        *   <li>When a stroke is applied to rendering a path:
        * <ul>
        *   <li>The sub-paths can be composed of any number of points.</li>
        *   <li>The sub-path is never implicitly closed.</li>
        * </ul>
        * </li>
        * </ul>
        *
        * @param winding Specifies the winding rule using a value defined in the
        *                GraphicsPathWinding class.
        */
        public drawPath(commands: number[], data: number[], winding: GraphicsPathWinding): void;
        /**
        * Draws a rectangle. Set the line style, fill, or both before you call the
        * <code>drawRect()</code> method, by calling the <code>linestyle()</code>,
        * <code>lineGradientStyle()</code>, <code>beginFill()</code>,
        * <code>beginGradientFill()</code>, or <code>beginBitmapFill()</code>
        * method.
        *
        * @param x      A number indicating the horizontal position relative to the
        *               registration point of the parent display object(in pixels).
        * @param y      A number indicating the vertical position relative to the
        *               registration point of the parent display object(in pixels).
        * @param width  The width of the rectangle(in pixels).
        * @param height The height of the rectangle(in pixels).
        * @throws ArgumentError If the <code>width</code> or <code>height</code>
        *                       parameters are not a number
        *                      (<code>Number.NaN</code>).
        */
        public drawRect(x: number, y: number, width: number, height: number): void;
        /**
        * Draws a rounded rectangle. Set the line style, fill, or both before you
        * call the <code>drawRoundRect()</code> method, by calling the
        * <code>linestyle()</code>, <code>lineGradientStyle()</code>,
        * <code>beginFill()</code>, <code>beginGradientFill()</code>, or
        * <code>beginBitmapFill()</code> method.
        *
        * @param x             A number indicating the horizontal position relative
        *                      to the registration point of the parent display
        *                      object(in pixels).
        * @param y             A number indicating the vertical position relative to
        *                      the registration point of the parent display object
        *                     (in pixels).
        * @param width         The width of the round rectangle(in pixels).
        * @param height        The height of the round rectangle(in pixels).
        * @param ellipseWidth  The width of the ellipse used to draw the rounded
        *                      corners(in pixels).
        * @param ellipseHeight The height of the ellipse used to draw the rounded
        *                      corners(in pixels). Optional; if no value is
        *                      specified, the default value matches that provided
        *                      for the <code>ellipseWidth</code> parameter.
        * @throws ArgumentError If the <code>width</code>, <code>height</code>,
        *                       <code>ellipseWidth</code> or
        *                       <code>ellipseHeight</code> parameters are not a
        *                       number(<code>Number.NaN</code>).
        */
        public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        /**
        * Renders a set of triangles, typically to distort bitmaps and give them a
        * three-dimensional appearance. The <code>drawTriangles()</code> method maps
        * either the current fill, or a bitmap fill, to the triangle faces using a
        * set of(u,v) coordinates.
        *
        * <p> Any type of fill can be used, but if the fill has a transform matrix
        * that transform matrix is ignored. </p>
        *
        * <p> A <code>uvtData</code> parameter improves texture mapping when a
        * bitmap fill is used. </p>
        *
        * @param culling Specifies whether to render triangles that face in a
        *                specified direction. This parameter prevents the rendering
        *                of triangles that cannot be seen in the current view. This
        *                parameter can be set to any value defined by the
        *                TriangleCulling class.
        */
        public drawTriangles(vertices: number[], indices?: number[], uvtData?: number[], culling?: TriangleCulling): void;
        /**
        * Applies a fill to the lines and curves that were added since the last call
        * to the <code>beginFill()</code>, <code>beginGradientFill()</code>, or
        * <code>beginBitmapFill()</code> method. Flash uses the fill that was
        * specified in the previous call to the <code>beginFill()</code>,
        * <code>beginGradientFill()</code>, or <code>beginBitmapFill()</code>
        * method. If the current drawing position does not equal the previous
        * position specified in a <code>moveTo()</code> method and a fill is
        * defined, the path is closed with a line and then filled.
        *
        */
        public endFill(): void;
        /**
        * Specifies a bitmap to use for the line stroke when drawing lines.
        *
        * <p>The bitmap line style is used for subsequent calls to Graphics methods
        * such as the <code>lineTo()</code> method or the <code>drawCircle()</code>
        * method. The line style remains in effect until you call the
        * <code>lineStyle()</code> or <code>lineGradientStyle()</code> methods, or
        * the <code>lineBitmapStyle()</code> method again with different parameters.
        * </p>
        *
        * <p>You can call the <code>lineBitmapStyle()</code> method in the middle of
        * drawing a path to specify different styles for different line segments
        * within a path. </p>
        *
        * <p>Call the <code>lineStyle()</code> method before you call the
        * <code>lineBitmapStyle()</code> method to enable a stroke, or else the
        * value of the line style is <code>undefined</code>.</p>
        *
        * <p>Calls to the <code>clear()</code> method set the line style back to
        * <code>undefined</code>. </p>
        *
        * @param bitmap The bitmap to use for the line stroke.
        * @param matrix An optional transformation matrix as defined by the
        *               flash.geom.Matrix class. The matrix can be used to scale or
        *               otherwise manipulate the bitmap before applying it to the
        *               line style.
        * @param repeat Whether to repeat the bitmap in a tiled fashion.
        * @param smooth Whether smoothing should be applied to the bitmap.
        */
        public lineBitmapStyle(bitmap: BitmapData, matrix?: geom.Matrix, repeat?: boolean, smooth?: boolean): void;
        /**
        * Specifies a gradient to use for the stroke when drawing lines.
        *
        * <p>The gradient line style is used for subsequent calls to Graphics
        * methods such as the <code>lineTo()</code> methods or the
        * <code>drawCircle()</code> method. The line style remains in effect until
        * you call the <code>lineStyle()</code> or <code>lineBitmapStyle()</code>
        * methods, or the <code>lineGradientStyle()</code> method again with
        * different parameters. </p>
        *
        * <p>You can call the <code>lineGradientStyle()</code> method in the middle
        * of drawing a path to specify different styles for different line segments
        * within a path. </p>
        *
        * <p>Call the <code>lineStyle()</code> method before you call the
        * <code>lineGradientStyle()</code> method to enable a stroke, or else the
        * value of the line style is <code>undefined</code>.</p>
        *
        * <p>Calls to the <code>clear()</code> method set the line style back to
        * <code>undefined</code>. </p>
        *
        * @param type                A value from the GradientType class that
        *                            specifies which gradient type to use, either
        *                            GradientType.LINEAR or GradientType.RADIAL.
        * @param colors              An array of RGB hexadecimal color values used
        *                            in the gradient; for example, red is 0xFF0000,
        *                            blue is 0x0000FF, and so on. You can specify
        *                            up to 15 colors. For each color, specify a
        *                            corresponding value in the alphas and ratios
        *                            parameters.
        * @param alphas              An array of alpha values for the corresponding
        *                            colors in the colors array; valid values are 0
        *                            to 1. If the value is less than 0, the default
        *                            is 0. If the value is greater than 1, the
        *                            default is 1.
        * @param ratios              An array of color distribution ratios; valid
        *                            values are 0-255. This value defines the
        *                            percentage of the width where the color is
        *                            sampled at 100%. The value 0 represents the
        *                            left position in the gradient box, and 255
        *                            represents the right position in the gradient
        *                            box.
        * @param matrix              A transformation matrix as defined by the
        *                            flash.geom.Matrix class. The flash.geom.Matrix
        *                            class includes a
        *                            <code>createGradientBox()</code> method, which
        *                            lets you conveniently set up the matrix for use
        *                            with the <code>lineGradientStyle()</code>
        *                            method.
        * @param spreadMethod        A value from the SpreadMethod class that
        *                            specifies which spread method to use:
        * @param interpolationMethod A value from the InterpolationMethod class that
        *                            specifies which value to use. For example,
        *                            consider a simple linear gradient between two
        *                            colors(with the <code>spreadMethod</code>
        *                            parameter set to
        *                            <code>SpreadMethod.REFLECT</code>). The
        *                            different interpolation methods affect the
        *                            appearance as follows:
        * @param focalPointRatio     A number that controls the location of the
        *                            focal point of the gradient. The value 0 means
        *                            the focal point is in the center. The value 1
        *                            means the focal point is at one border of the
        *                            gradient circle. The value -1 means that the
        *                            focal point is at the other border of the
        *                            gradient circle. Values less than -1 or greater
        *                            than 1 are rounded to -1 or 1. The following
        *                            image shows a gradient with a
        *                            <code>focalPointRatio</code> of -0.75:
        */
        public lineGradientStyle(type: GradientType, colors: number[], alphas: number[], ratios: number[], matrix?: geom.Matrix, spreadMethod?: SpreadMethod, interpolationMethod?: InterpolationMethod, focalPointRatio?: number): void;
        /**
        * Specifies a line style used for subsequent calls to Graphics methods such
        * as the <code>lineTo()</code> method or the <code>drawCircle()</code>
        * method. The line style remains in effect until you call the
        * <code>lineGradientStyle()</code> method, the
        * <code>lineBitmapStyle()</code> method, or the <code>lineStyle()</code>
        * method with different parameters.
        *
        * <p>You can call the <code>lineStyle()</code> method in the middle of
        * drawing a path to specify different styles for different line segments
        * within the path.</p>
        *
        * <p><b>Note: </b>Calls to the <code>clear()</code> method set the line
        * style back to <code>undefined</code>.</p>
        *
        * <p><b>Note: </b>Flash Lite 4 supports only the first three parameters
        * (<code>thickness</code>, <code>color</code>, and <code>alpha</code>).</p>
        *
        * @param thickness    An integer that indicates the thickness of the line in
        *                     points; valid values are 0-255. If a number is not
        *                     specified, or if the parameter is undefined, a line is
        *                     not drawn. If a value of less than 0 is passed, the
        *                     default is 0. The value 0 indicates hairline
        *                     thickness; the maximum thickness is 255. If a value
        *                     greater than 255 is passed, the default is 255.
        * @param color        A hexadecimal color value of the line; for example,
        *                     red is 0xFF0000, blue is 0x0000FF, and so on. If a
        *                     value is not indicated, the default is 0x000000
        *                    (black). Optional.
        * @param alpha        A number that indicates the alpha value of the color
        *                     of the line; valid values are 0 to 1. If a value is
        *                     not indicated, the default is 1(solid). If the value
        *                     is less than 0, the default is 0. If the value is
        *                     greater than 1, the default is 1.
        * @param pixelHinting(Not supported in Flash Lite 4) A Boolean value that
        *                     specifies whether to hint strokes to full pixels. This
        *                     affects both the position of anchors of a curve and
        *                     the line stroke size itself. With
        *                     <code>pixelHinting</code> set to <code>true</code>,
        *                     line widths are adjusted to full pixel widths. With
        *                     <code>pixelHinting</code> set to <code>false</code>,
        *                     disjoints can appear for curves and straight lines.
        *                     For example, the following illustrations show how
        *                     Flash Player or Adobe AIR renders two rounded
        *                     rectangles that are identical, except that the
        *                     <code>pixelHinting</code> parameter used in the
        *                     <code>lineStyle()</code> method is set differently
        *                    (the images are scaled by 200%, to emphasize the
        *                     difference):
        *
        *                     <p>If a value is not supplied, the line does not use
        *                     pixel hinting.</p>
        * @param scaleMode   (Not supported in Flash Lite 4) A value from the
        *                     LineScaleMode class that specifies which scale mode to
        *                     use:
        *                     <ul>
        *                       <li> <code>LineScaleMode.NORMAL</code> - Always
        *                     scale the line thickness when the object is scaled
        *                    (the default). </li>
        *                       <li> <code>LineScaleMode.NONE</code> - Never scale
        *                     the line thickness. </li>
        *                       <li> <code>LineScaleMode.VERTICAL</code> - Do not
        *                     scale the line thickness if the object is scaled
        *                     vertically <i>only</i>. For example, consider the
        *                     following circles, drawn with a one-pixel line, and
        *                     each with the <code>scaleMode</code> parameter set to
        *                     <code>LineScaleMode.VERTICAL</code>. The circle on the
        *                     left is scaled vertically only, and the circle on the
        *                     right is scaled both vertically and horizontally:
        *                     </li>
        *                       <li> <code>LineScaleMode.HORIZONTAL</code> - Do not
        *                     scale the line thickness if the object is scaled
        *                     horizontally <i>only</i>. For example, consider the
        *                     following circles, drawn with a one-pixel line, and
        *                     each with the <code>scaleMode</code> parameter set to
        *                     <code>LineScaleMode.HORIZONTAL</code>. The circle on
        *                     the left is scaled horizontally only, and the circle
        *                     on the right is scaled both vertically and
        *                     horizontally:   </li>
        *                     </ul>
        * @param caps        (Not supported in Flash Lite 4) A value from the
        *                     CapsStyle class that specifies the type of caps at the
        *                     end of lines. Valid values are:
        *                     <code>CapsStyle.NONE</code>,
        *                     <code>CapsStyle.ROUND</code>, and
        *                     <code>CapsStyle.SQUARE</code>. If a value is not
        *                     indicated, Flash uses round caps.
        *
        *                     <p>For example, the following illustrations show the
        *                     different <code>capsStyle</code> settings. For each
        *                     setting, the illustration shows a blue line with a
        *                     thickness of 30(for which the <code>capsStyle</code>
        *                     applies), and a superimposed black line with a
        *                     thickness of 1(for which no <code>capsStyle</code>
        *                     applies): </p>
        * @param joints      (Not supported in Flash Lite 4) A value from the
        *                     JointStyle class that specifies the type of joint
        *                     appearance used at angles. Valid values are:
        *                     <code>JointStyle.BEVEL</code>,
        *                     <code>JointStyle.MITER</code>, and
        *                     <code>JointStyle.ROUND</code>. If a value is not
        *                     indicated, Flash uses round joints.
        *
        *                     <p>For example, the following illustrations show the
        *                     different <code>joints</code> settings. For each
        *                     setting, the illustration shows an angled blue line
        *                     with a thickness of 30(for which the
        *                     <code>jointStyle</code> applies), and a superimposed
        *                     angled black line with a thickness of 1(for which no
        *                     <code>jointStyle</code> applies): </p>
        *
        *                     <p><b>Note:</b> For <code>joints</code> set to
        *                     <code>JointStyle.MITER</code>, you can use the
        *                     <code>miterLimit</code> parameter to limit the length
        *                     of the miter.</p>
        * @param miterLimit  (Not supported in Flash Lite 4) A number that
        *                     indicates the limit at which a miter is cut off. Valid
        *                     values range from 1 to 255(and values outside that
        *                     range are rounded to 1 or 255). This value is only
        *                     used if the <code>jointStyle</code> is set to
        *                     <code>"miter"</code>. The <code>miterLimit</code>
        *                     value represents the length that a miter can extend
        *                     beyond the point at which the lines meet to form a
        *                     joint. The value expresses a factor of the line
        *                     <code>thickness</code>. For example, with a
        *                     <code>miterLimit</code> factor of 2.5 and a
        *                     <code>thickness</code> of 10 pixels, the miter is cut
        *                     off at 25 pixels.
        *
        *                     <p>For example, consider the following angled lines,
        *                     each drawn with a <code>thickness</code> of 20, but
        *                     with <code>miterLimit</code> set to 1, 2, and 4.
        *                     Superimposed are black reference lines showing the
        *                     meeting points of the joints:</p>
        *
        *                     <p>Notice that a given <code>miterLimit</code> value
        *                     has a specific maximum angle for which the miter is
        *                     cut off. The following table lists some examples:</p>
        */
        public lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: LineScaleMode, caps?: CapsStyle, joints?: JointStyle, miterLimit?: number): void;
        /**
        * Draws a line using the current line style from the current drawing
        * position to(<code>x</code>, <code>y</code>); the current drawing position
        * is then set to(<code>x</code>, <code>y</code>). If the display object in
        * which you are drawing contains content that was created with the Flash
        * drawing tools, calls to the <code>lineTo()</code> method are drawn
        * underneath the content. If you call <code>lineTo()</code> before any calls
        * to the <code>moveTo()</code> method, the default position for the current
        * drawing is(<i>0, 0</i>). If any of the parameters are missing, this
        * method fails and the current drawing position is not changed.
        *
        * @param x A number that indicates the horizontal position relative to the
        *          registration point of the parent display object(in pixels).
        * @param y A number that indicates the vertical position relative to the
        *          registration point of the parent display object(in pixels).
        */
        public lineTo(x: number, y: number): void;
        /**
        * Moves the current drawing position to(<code>x</code>, <code>y</code>). If
        * any of the parameters are missing, this method fails and the current
        * drawing position is not changed.
        *
        * @param x A number that indicates the horizontal position relative to the
        *          registration point of the parent display object(in pixels).
        * @param y A number that indicates the vertical position relative to the
        *          registration point of the parent display object(in pixels).
        */
        public moveTo(x: number, y: number): void;
    }
}
/**
* The GraphicsPathWinding class provides values for the
* <code>flash.display.GraphicsPath.winding</code> property and the
* <code>flash.display.Graphics.drawPath()</code> method to determine the
* direction to draw a path. A clockwise path is positively wound, and a
* counter-clockwise path is negatively wound:
*
* <p> When paths intersect or overlap, the winding direction determines the
* rules for filling the areas created by the intersection or overlap:</p>
*/
declare module away.base {
    class GraphicsPathWinding {
        static EVEN_ODD: string;
        static NON_ZERO: string;
    }
}
/**
* The IBitmapDrawable interface is implemented by objects that can be passed as the
* source parameter of the <code>draw()</code> method of the BitmapData class. These
* objects are of type BitmapData or DisplayObject.
*
* @see away.base.BitmapData#draw()
* @see away.base.BitmapData
* @see away.base.DisplayObject
*/
declare module away.base {
    interface IBitmapDrawable {
    }
}
/**
* This interface is used to define objects that can be used as parameters in the
* <code>away.base.Graphics</code> methods, including fills, strokes, and paths. Use
* the implementor classes of this interface to create and manage drawing property
* data, and to reuse the same data for different instances. Then, use the methods of
* the Graphics class to render the drawing objects.
*
* @see away.base.Graphics.drawGraphicsData()
* @see away.base.Graphics.readGraphicsData()
*/
declare module away.base {
    interface IGraphicsData {
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * IMaterialOwner provides an interface for objects that can use materials.
    *
    * @interface away.base.IMaterialOwner
    */
    interface IMaterialOwner extends library.IAsset {
        /**
        * The animation used by the material owner to assemble the vertex code.
        */
        animator: animators.IAnimator;
        /**
        * The material with which to render the object.
        */
        material: materials.MaterialBase;
        /**
        *
        */
        uvTransform: geom.UVTransform;
        /**
        *
        * @param renderable
        * @private
        */
        _iAddRenderable(renderable: pool.IRenderable): pool.IRenderable;
        /**
        *
        * @param renderable
        * @private
        */
        _iRemoveRenderable(renderable: pool.IRenderable): pool.IRenderable;
        /**
        *
        * @param renderer
        * @private
        */
        _iCollectRenderable(renderer: render.IRenderer): any;
    }
}
/**
* The InterpolationMethod class provides values for the
* <code>interpolationMethod</code> parameter in the
* <code>Graphics.beginGradientFill()</code> and
* <code>Graphics.lineGradientStyle()</code> methods. This parameter
* determines the RGB space to use when rendering the gradient.
*/
declare module away.base {
    class InterpolationMethod {
        /**
        * Specifies that the RGB interpolation method should be used. This means
        * that the gradient is rendered with exponential sRGB(standard RGB) space.
        * The sRGB space is a W3C-endorsed standard that defines a non-linear
        * conversion between red, green, and blue component values and the actual
        * intensity of the visible component color.
        *
        * <p>For example, consider a simple linear gradient between two colors(with
        * the <code>spreadMethod</code> parameter set to
        * <code>SpreadMethod.REFLECT</code>). The different interpolation methods
        * affect the appearance as follows: </p>
        */
        static LINEAR_RGB: string;
        /**
        * Specifies that the RGB interpolation method should be used. This means
        * that the gradient is rendered with exponential sRGB(standard RGB) space.
        * The sRGB space is a W3C-endorsed standard that defines a non-linear
        * conversion between red, green, and blue component values and the actual
        * intensity of the visible component color.
        *
        * <p>For example, consider a simple linear gradient between two colors(with
        * the <code>spreadMethod</code> parameter set to
        * <code>SpreadMethod.REFLECT</code>). The different interpolation methods
        * affect the appearance as follows: </p>
        */
        static RGB: string;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * ISubMesh is an interface for object SubMesh that is used to
    * apply a material to a SubGeometry class
    *
    * @class away.base.ISubMesh
    */
    interface ISubMesh extends IMaterialOwner {
        subGeometry: SubGeometryBase;
        parentMesh: entities.Mesh;
        _iIndex: number;
        _iInvalidateRenderableGeometry(): any;
        _iGetExplicitMaterial(): materials.MaterialBase;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * ISubMeshClass is an interface for the constructable class definition ISubMesh that is used to
    * apply a material to a SubGeometry class
    *
    * @class away.base.ISubMeshClass
    */
    interface ISubMeshClass {
        /**
        *
        */
        new(subGeometry: SubGeometryBase, parentMesh: entities.Mesh, material?: materials.MaterialBase): ISubMesh;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.TriangleSubGeometry
    */
    class SubGeometryBase extends library.NamedAssetBase {
        static VERTEX_DATA: string;
        public _pStrideOffsetDirty: boolean;
        public _pIndices: number[];
        public _pVertices: number[];
        private _numIndices;
        private _numTriangles;
        public _pNumVertices: number;
        public _pConcatenateArrays: boolean;
        private _indicesUpdated;
        public _pStride: Object;
        public _pOffset: Object;
        public _pUpdateStrideOffset(): void;
        public _pSubMeshClass: ISubMeshClass;
        public subMeshClass : ISubMeshClass;
        /**
        *
        */
        public concatenateArrays : boolean;
        /**
        * The raw index data that define the faces.
        */
        public indices : number[];
        /**
        *
        */
        public vertices : number[];
        /**
        * The total amount of triangles in the TriangleSubGeometry.
        */
        public numTriangles : number;
        public numVertices : number;
        /**
        *
        */
        constructor(concatenatedArrays: boolean);
        /**
        *
        */
        public getStride(dataType: string): any;
        /**
        *
        */
        public getOffset(dataType: string): any;
        public updateVertices(): void;
        /**
        *
        */
        public dispose(): void;
        /**
        * Updates the face indices of the TriangleSubGeometry.
        *
        * @param indices The face indices to upload.
        */
        public updateIndices(indices: number[]): void;
        /**
        * @protected
        */
        public pInvalidateBounds(): void;
        /**
        * The Geometry object that 'owns' this TriangleSubGeometry object.
        *
        * @private
        */
        public parentGeometry: Geometry;
        /**
        * Clones the current object
        * @return An exact duplicate of the current object.
        */
        public clone(): SubGeometryBase;
        public applyTransformation(transform: geom.Matrix3D): void;
        /**
        * Scales the geometry.
        * @param scale The amount by which to scale.
        */
        public scale(scale: number): void;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public getBoundingPositions(): number[];
        private notifyIndicesUpdate();
        public _pNotifyVerticesUpdate(): void;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * SubMeshBase wraps a TriangleSubGeometry as a scene graph instantiation. A SubMeshBase is owned by a Mesh object.
    *
    *
    * @see away.base.TriangleSubGeometry
    * @see away.entities.Mesh
    *
    * @class away.base.SubMeshBase
    */
    class SubMeshBase extends library.NamedAssetBase {
        public _pParentMesh: entities.Mesh;
        public _uvTransform: geom.UVTransform;
        public _iIndex: number;
        public _material: materials.MaterialBase;
        private _renderables;
        /**
        * The animator object that provides the state for the TriangleSubMesh's animation.
        */
        public animator : animators.IAnimator;
        /**
        * The material used to render the current TriangleSubMesh. If set to null, its parent Mesh's material will be used instead.
        */
        public material : materials.MaterialBase;
        /**
        * The scene transform object that transforms from model to world space.
        */
        public sceneTransform : geom.Matrix3D;
        /**
        * The entity that that initially provided the IRenderable to the render pipeline (ie: the owning Mesh object).
        */
        public parentMesh : entities.Mesh;
        /**
        *
        */
        public uvTransform : geom.UVTransform;
        /**
        * Creates a new SubMeshBase object
        */
        constructor();
        /**
        *
        */
        public dispose(): void;
        /**
        *
        * @param camera
        * @returns {away.geom.Matrix3D}
        */
        public getRenderSceneTransform(camera: entities.Camera): geom.Matrix3D;
        public _iAddRenderable(renderable: pool.IRenderable): pool.IRenderable;
        public _iRemoveRenderable(renderable: pool.IRenderable): pool.IRenderable;
        public _iInvalidateRenderableGeometry(): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
        public _iGetExplicitMaterial(): materials.MaterialBase;
    }
}
/**
* The JointStyle class is an enumeration of constant values that specify the
* joint style to use in drawing lines. These constants are provided for use
* as values in the <code>joints</code> parameter of the
* <code>flash.display.Graphics.lineStyle()</code> method. The method supports
* three types of joints: miter, round, and bevel, as the following example
* shows:
*/
declare module away.base {
    class JointStyle {
        /**
        * Specifies beveled joints in the <code>joints</code> parameter of the
        * <code>flash.display.Graphics.lineStyle()</code> method.
        */
        static BEVEL: string;
        /**
        * Specifies mitered joints in the <code>joints</code> parameter of the
        * <code>flash.display.Graphics.lineStyle()</code> method.
        */
        static MITER: string;
        /**
        * Specifies round joints in the <code>joints</code> parameter of the
        * <code>flash.display.Graphics.lineStyle()</code> method.
        */
        static ROUND: string;
    }
}
/**
* The LineScaleMode class provides values for the <code>scaleMode</code>
* parameter in the <code>Graphics.lineStyle()</code> method.
*/
declare module away.base {
    class LineScaleMode {
        /**
        * With this setting used as the <code>scaleMode</code> parameter of the
        * <code>lineStyle()</code> method, the thickness of the line scales
        * <i>only</i> vertically. For example, consider the following circles, drawn
        * with a one-pixel line, and each with the <code>scaleMode</code> parameter
        * set to <code>LineScaleMode.VERTICAL</code>. The circle on the left is
        * scaled only vertically, and the circle on the right is scaled both
        * vertically and horizontally.
        */
        static HORIZONTAL: string;
        /**
        * With this setting used as the <code>scaleMode</code> parameter of the
        * <code>lineStyle()</code> method, the thickness of the line never scales.
        */
        static NONE: string;
        /**
        * With this setting used as the <code>scaleMode</code> parameter of the
        * <code>lineStyle()</code> method, the thickness of the line always scales
        * when the object is scaled(the default).
        */
        static NORMAL: string;
        /**
        * With this setting used as the <code>scaleMode</code> parameter of the
        * <code>lineStyle()</code> method, the thickness of the line scales
        * <i>only</i> horizontally. For example, consider the following circles,
        * drawn with a one-pixel line, and each with the <code>scaleMode</code>
        * parameter set to <code>LineScaleMode.HORIZONTAL</code>. The circle on the
        * left is scaled only horizontally, and the circle on the right is scaled
        * both vertically and horizontally.
        */
        static VERTICAL: string;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.TriangleSubGeometry
    */
    class LineSubGeometry extends SubGeometryBase {
        static VERTEX_DATA: string;
        static START_POSITION_DATA: string;
        static END_POSITION_DATA: string;
        static THICKNESS_DATA: string;
        static COLOR_DATA: string;
        static POSITION_FORMAT: string;
        static COLOR_FORMAT: string;
        static THICKNESS_FORMAT: string;
        private _positionsDirty;
        private _boundingPositionDirty;
        private _thicknessDirty;
        private _colorsDirty;
        private _startPositions;
        private _endPositions;
        private _boundingPositions;
        private _thickness;
        private _startColors;
        private _endColors;
        private _numSegments;
        private _positionsUpdated;
        private _thicknessUpdated;
        private _colorUpdated;
        public _pUpdateStrideOffset(): void;
        /**
        *
        */
        public vertices : number[];
        /**
        *
        */
        public startPositions : number[];
        /**
        *
        */
        public endPositions : number[];
        /**
        *
        */
        public thickness : number[];
        /**
        *
        */
        public startColors : number[];
        /**
        *
        */
        public endColors : number[];
        /**
        * The total amount of segments in the TriangleSubGeometry.
        */
        public numSegments : number;
        /**
        *
        */
        constructor();
        public getBoundingPositions(): number[];
        /**
        *
        */
        public updatePositions(startValues: number[], endValues: number[]): void;
        /**
        * Updates the thickness.
        */
        public updateThickness(values: number[]): void;
        /**
        *
        */
        public updateColors(startValues: number[], endValues: number[]): void;
        /**
        *
        */
        public dispose(): void;
        /**
        * @protected
        */
        public pInvalidateBounds(): void;
        /**
        * The Geometry object that 'owns' this TriangleSubGeometry object.
        *
        * @private
        */
        public parentGeometry: Geometry;
        /**
        * Clones the current object
        * @return An exact duplicate of the current object.
        */
        public clone(): LineSubGeometry;
        public _pNotifyVerticesUpdate(): void;
        private notifyPositionsUpdate();
        private notifyThicknessUpdate();
        private notifyColorsUpdate();
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * LineSubMesh wraps a LineSubGeometry as a scene graph instantiation. A LineSubMesh is owned by a Mesh object.
    *
    *
    * @see away.base.LineSubGeometry
    * @see away.entities.Mesh
    *
    * @class away.base.LineSubMesh
    */
    class LineSubMesh extends SubMeshBase implements ISubMesh {
        private _subGeometry;
        /**
        *
        */
        public assetType : string;
        /**
        * The LineSubGeometry object which provides the geometry data for this LineSubMesh.
        */
        public subGeometry : LineSubGeometry;
        /**
        * Creates a new LineSubMesh object
        * @param subGeometry The LineSubGeometry object which provides the geometry data for this LineSubMesh.
        * @param parentMesh The Mesh object to which this LineSubMesh belongs.
        * @param material An optional material used to render this LineSubMesh.
        */
        constructor(subGeometry: LineSubGeometry, parentMesh: entities.Mesh, material?: materials.MaterialBase);
        /**
        *
        */
        public dispose(): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
    }
}
/**
* The LoaderInfo class provides information about a loaded SWF file or a
* loaded image file(JPEG, GIF, or PNG). LoaderInfo objects are available for
* any display object. The information provided includes load progress, the
* URLs of the loader and loaded content, the number of bytes total for the
* media, and the nominal height and width of the media.
*
* <p>You can access LoaderInfo objects in two ways: </p>
*
* <ul>
*   <li>The <code>contentLoaderInfo</code> property of a flash.display.Loader
* object -  The <code>contentLoaderInfo</code> property is always available
* for any Loader object. For a Loader object that has not called the
* <code>load()</code> or <code>loadBytes()</code> method, or that has not
* sufficiently loaded, attempting to access many of the properties of the
* <code>contentLoaderInfo</code> property throws an error.</li>
*   <li>The <code>loaderInfo</code> property of a display object. </li>
* </ul>
*
* <p>The <code>contentLoaderInfo</code> property of a Loader object provides
* information about the content that the Loader object is loading, whereas
* the <code>loaderInfo</code> property of a DisplayObject provides
* information about the root SWF file for that display object. </p>
*
* <p>When you use a Loader object to load a display object(such as a SWF
* file or a bitmap), the <code>loaderInfo</code> property of the display
* object is the same as the <code>contentLoaderInfo</code> property of the
* Loader object(<code>DisplayObject.loaderInfo =
* Loader.contentLoaderInfo</code>). Because the instance of the main class of
* the SWF file has no Loader object, the <code>loaderInfo</code> property is
* the only way to access the LoaderInfo for the instance of the main class of
* the SWF file.</p>
*
* <p>The following diagram shows the different uses of the LoaderInfo
* object - for the instance of the main class of the SWF file, for the
* <code>contentLoaderInfo</code> property of a Loader object, and for the
* <code>loaderInfo</code> property of a loaded object:</p>
*
* <p>When a loading operation is not complete, some properties of the
* <code>contentLoaderInfo</code> property of a Loader object are not
* available. You can obtain some properties, such as
* <code>bytesLoaded</code>, <code>bytesTotal</code>, <code>url</code>,
* <code>loaderURL</code>, and <code>applicationDomain</code>. When the
* <code>loaderInfo</code> object dispatches the <code>init</code> event, you
* can access all properties of the <code>loaderInfo</code> object and the
* loaded image or SWF file.</p>
*
* <p><b>Note:</b> All properties of LoaderInfo objects are read-only.</p>
*
* <p>The <code>EventDispatcher.dispatchEvent()</code> method is not
* applicable to LoaderInfo objects. If you call <code>dispatchEvent()</code>
* on a LoaderInfo object, an IllegalOperationError exception is thrown.</p>
*
* @event complete   Dispatched when data has loaded successfully. In other
*                   words, it is dispatched when all the content has been
*                   downloaded and the loading has finished. The
*                   <code>complete</code> event is always dispatched after
*                   the <code>init</code> event. The <code>init</code> event
*                   is dispatched when the object is ready to access, though
*                   the content may still be downloading.
* @event httpStatus Dispatched when a network request is made over HTTP and
*                   an HTTP status code can be detected.
* @event init       Dispatched when the properties and methods of a loaded
*                   SWF file are accessible and ready for use. The content,
*                   however, can still be downloading. A LoaderInfo object
*                   dispatches the <code>init</code> event when the following
*                   conditions exist:
*                   <ul>
*                     <li>All properties and methods associated with the
*                   loaded object and those associated with the LoaderInfo
*                   object are accessible.</li>
*                     <li>The constructors for all child objects have
*                   completed.</li>
*                     <li>All ActionScript code in the first frame of the
*                   loaded SWF's main timeline has been executed.</li>
*                   </ul>
*
*                   <p>For example, an <code>Event.INIT</code> is dispatched
*                   when the first frame of a movie or animation is loaded.
*                   The movie is then accessible and can be added to the
*                   display list. The complete movie, however, can take
*                   longer to download. The <code>Event.COMPLETE</code> is
*                   only dispatched once the full movie is loaded.</p>
*
*                   <p>The <code>init</code> event always precedes the
*                   <code>complete</code> event.</p>
* @event ioError    Dispatched when an input or output error occurs that
*                   causes a load operation to fail.
* @event open       Dispatched when a load operation starts.
* @event progress   Dispatched when data is received as the download
*                   operation progresses.
* @event unload     Dispatched by a LoaderInfo object whenever a loaded
*                   object is removed by using the <code>unload()</code>
*                   method of the Loader object, or when a second load is
*                   performed by the same Loader object and the original
*                   content is removed prior to the load beginning.
*/
declare module away.base {
    class LoaderInfo extends events.EventDispatcher {
        private _bytes;
        private _bytesLoaded;
        private _bytesTotal;
        private _content;
        private _contentType;
        private _loader;
        private _url;
        /**
        * The bytes associated with a LoaderInfo object.
        *
        * @throws SecurityError If the object accessing this API is prevented from
        *                       accessing the loaded object due to security
        *                       restrictions. This situation can occur, for
        *                       instance, when a Loader object attempts to access
        *                       the <code>contentLoaderInfo.content</code> property
        *                       and it is not granted security permission to access
        *                       the loaded content.
        *
        *                       <p>For more information related to security, see the
        *                       Flash Player Developer Center Topic: <a
        *                       href="http://www.adobe.com/go/devnet_security_en"
        *                       scope="external">Security</a>.</p>
        */
        public bytes : utils.ByteArray;
        /**
        * The number of bytes that are loaded for the media. When this number equals
        * the value of <code>bytesTotal</code>, all of the bytes are loaded.
        */
        public bytesLoaded : number;
        /**
        * The number of compressed bytes in the entire media file.
        *
        * <p>Before the first <code>progress</code> event is dispatched by this
        * LoaderInfo object's corresponding Loader object, <code>bytesTotal</code>
        * is 0. After the first <code>progress</code> event from the Loader object,
        * <code>bytesTotal</code> reflects the actual number of bytes to be
        * downloaded.</p>
        */
        public bytesTotal : number;
        /**
        * The loaded object associated with this LoaderInfo object.
        *
        * @throws SecurityError If the object accessing this API is prevented from
        *                       accessing the loaded object due to security
        *                       restrictions. This situation can occur, for
        *                       instance, when a Loader object attempts to access
        *                       the <code>contentLoaderInfo.content</code> property
        *                       and it is not granted security permission to access
        *                       the loaded content.
        *
        *                       <p>For more information related to security, see the
        *                       Flash Player Developer Center Topic: <a
        *                       href="http://www.adobe.com/go/devnet_security_en"
        *                       scope="external">Security</a>.</p>
        */
        public content : DisplayObject;
        /**
        * The MIME type of the loaded file. The value is <code>null</code> if not
        * enough of the file has loaded in order to determine the type. The
        * following list gives the possible values:
        * <ul>
        *   <li><code>"application/x-shockwave-flash"</code></li>
        *   <li><code>"image/jpeg"</code></li>
        *   <li><code>"image/gif"</code></li>
        *   <li><code>"image/png"</code></li>
        * </ul>
        */
        public contentType : string;
        /**
        * The Loader object associated with this LoaderInfo object. If this
        * LoaderInfo object is the <code>loaderInfo</code> property of the instance
        * of the main class of the SWF file, no Loader object is associated.
        *
        * @throws SecurityError If the object accessing this API is prevented from
        *                       accessing the Loader object because of security
        *                       restrictions. This can occur, for instance, when a
        *                       loaded SWF file attempts to access its
        *                       <code>loaderInfo.loader</code> property and it is
        *                       not granted security permission to access the
        *                       loading SWF file.
        *
        *                       <p>For more information related to security, see the
        *                       Flash Player Developer Center Topic: <a
        *                       href="http://www.adobe.com/go/devnet_security_en"
        *                       scope="external">Security</a>.</p>
        */
        public loader : containers.Loader;
        /**
        * The URL of the media being loaded.
        *
        * <p>Before the first <code>progress</code> event is dispatched by this
        * LoaderInfo object's corresponding Loader object, the value of the
        * <code>url</code> property might reflect only the initial URL specified in
        * the call to the <code>load()</code> method of the Loader object. After the
        * first <code>progress</code> event, the <code>url</code> property reflects
        * the media's final URL, after any redirects and relative URLs are
        * resolved.</p>
        *
        * <p>In some cases, the value of the <code>url</code> property is truncated;
        * see the <code>isURLInaccessible</code> property for details.</p>
        */
        public url : string;
    }
}
/**
* The PixelSnapping class is an enumeration of constant values for setting
* the pixel snapping options by using the <code>pixelSnapping</code> property
* of a Bitmap object.
*/
declare module away.base {
    class PixelSnapping {
        /**
        * A constant value used in the <code>pixelSnapping</code> property of a
        * Bitmap object to specify that the bitmap image is always snapped to the
        * nearest pixel, independent of any transformation.
        */
        static ALWAYS: string;
        /**
        * A constant value used in the <code>pixelSnapping</code> property of a
        * Bitmap object to specify that the bitmap image is snapped to the nearest
        * pixel if it is drawn with no rotation or skew and it is drawn at a scale
        * factor of 99.9% to 100.1%. If these conditions are satisfied, the image is
        * drawn at 100% scale, snapped to the nearest pixel. Internally, this
        * setting allows the image to be drawn as fast as possible by using the
        * vector renderer.
        */
        static AUTO: string;
        /**
        * A constant value used in the <code>pixelSnapping</code> property of a
        * Bitmap object to specify that no pixel snapping occurs.
        */
        static NEVER: string;
    }
}
/**
* The SpreadMethod class provides values for the <code>spreadMethod</code>
* parameter in the <code>beginGradientFill()</code> and
* <code>lineGradientStyle()</code> methods of the Graphics class.
*
* <p>The following example shows the same gradient fill using various spread
* methods:</p>
*/
declare module away.base {
    class SpreadMethod {
        /**
        * Specifies that the gradient use the <i>pad</i> spread method.
        */
        static PAD: string;
        /**
        * Specifies that the gradient use the <i>reflect</i> spread method.
        */
        static REFLECT: string;
        /**
        * Specifies that the gradient use the <i>repeat</i> spread method.
        */
        static REPEAT: string;
    }
}
declare module away.base {
    /**
    * Stage provides a proxy class to handle the creation and attachment of the Context
    * (and in turn the back buffer) it uses. Stage should never be created directly,
    * but requested through StageManager.
    *
    * @see away.managers.StageManager
    *
    */
    class Stage extends events.EventDispatcher {
        private _context;
        private _container;
        private _width;
        private _height;
        private _x;
        private _y;
        private _stageIndex;
        private _usesSoftwareRendering;
        private _profile;
        private _stageManager;
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
        private _initialised;
        constructor(container: HTMLCanvasElement, stageIndex: number, stageManager: managers.StageManager, forceSoftware?: boolean, profile?: string);
        /**
        * Requests a Context object to attach to the managed gl canvas.
        */
        public requestContext(forceSoftware?: boolean, profile?: string, mode?: string): void;
        /**
        * The width of the gl canvas
        */
        public width : number;
        /**
        * The height of the gl canvas
        */
        public height : number;
        /**
        * The x position of the gl canvas
        */
        public x : number;
        /**
        * The y position of the gl canvas
        */
        public y : number;
        public visible : boolean;
        public container : HTMLElement;
        /**
        * The Context object associated with the given stage object.
        */
        public context : display.IContext;
        private notifyViewportUpdated();
        private notifyEnterFrame();
        private notifyExitFrame();
        public profile : string;
        /**
        * Disposes the Stage object, freeing the Context attached to the Stage.
        */
        public dispose(): void;
        /**
        * Configures the back buffer associated with the Stage object.
        * @param backBufferWidth The width of the backbuffer.
        * @param backBufferHeight The height of the backbuffer.
        * @param antiAlias The amount of anti-aliasing to use.
        * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
        */
        public configureBackBuffer(backBufferWidth: number, backBufferHeight: number, antiAlias: number, enableDepthAndStencil: boolean): void;
        public enableDepthAndStencil : boolean;
        public renderTarget : textures.TextureProxyBase;
        public renderSurfaceSelector : number;
        public clear(): void;
        public addEventListener(type: string, listener: Function): void;
        /**
        * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch StageProxy out of automatic render mode.
        * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
        *
        * @param type The type of event.
        * @param listener The listener object to remove.
        * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
        */
        public removeEventListener(type: string, listener: Function): void;
        public scissorRect : geom.Rectangle;
        /**
        * The index of the Stage which is managed by this instance of StageProxy.
        */
        public stageIndex : number;
        /**
        * Indicates whether the Stage managed by this proxy is running in software mode.
        * Remember to wait for the CONTEXT_CREATED event before checking this property,
        * as only then will it be guaranteed to be accurate.
        */
        public usesSoftwareRendering : boolean;
        /**
        * The antiAliasing of the Stage.
        */
        public antiAlias : number;
        /**
        * A viewPort rectangle equivalent of the Stage size and position.
        */
        public viewPort : geom.Rectangle;
        /**
        * The background color of the Stage.
        */
        public color : number;
        /**
        * The freshly cleared state of the backbuffer before any rendering
        */
        public bufferClear : boolean;
        /**
        * Frees the Context associated with this StageProxy.
        */
        private freeContext();
        /**
        * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
        * Typically the proxy.ENTER_FRAME listener would render the layers for this Stage instance.
        */
        private onEnterFrame(event);
        public recoverFromDisposal(): boolean;
        private _callback(context);
    }
}
/**
* Defines codes for culling algorithms that determine which triangles not to
* render when drawing triangle paths.
*
* <p> The terms <code>POSITIVE</code> and <code>NEGATIVE</code> refer to the
* sign of a triangle's normal along the z-axis. The normal is a 3D vector
* that is perpendicular to the surface of the triangle. </p>
*
* <p> A triangle whose vertices 0, 1, and 2 are arranged in a clockwise order
* has a positive normal value. That is, its normal points in a positive
* z-axis direction, away from the current view point. When the
* <code>TriangleCulling.POSITIVE</code> algorithm is used, triangles with
* positive normals are not rendered. Another term for this is backface
* culling. </p>
*
* <p> A triangle whose vertices are arranged in a counter-clockwise order has
* a negative normal value. That is, its normal points in a negative z-axis
* direction, toward the current view point. When the
* <code>TriangleCulling.NEGATIVE</code> algorithm is used, triangles with
* negative normals will not be rendered. </p>
*/
declare module away.base {
    class TriangleCulling {
        /**
        * Specifies culling of all triangles facing toward the current view point.
        */
        static NEGATIVE: string;
        /**
        * Specifies no culling. All triangles in the path are rendered.
        */
        static NONE: string;
        /**
        * Specifies culling of all triangles facing away from the current view
        * point. This is also known as backface culling.
        */
        static POSITIVE: string;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.TriangleSubGeometry
    */
    class TriangleSubGeometry extends SubGeometryBase {
        static POSITION_DATA: string;
        static NORMAL_DATA: string;
        static TANGENT_DATA: string;
        static UV_DATA: string;
        static SECONDARY_UV_DATA: string;
        static JOINT_INDEX_DATA: string;
        static JOINT_WEIGHT_DATA: string;
        static POSITION_FORMAT: string;
        static NORMAL_FORMAT: string;
        static TANGENT_FORMAT: string;
        static UV_FORMAT: string;
        static SECONDARY_UV_FORMAT: string;
        private _positionsDirty;
        private _faceNormalsDirty;
        private _faceTangentsDirty;
        private _vertexNormalsDirty;
        private _vertexTangentsDirty;
        private _uvsDirty;
        private _secondaryUVsDirty;
        private _jointIndicesDirty;
        private _jointWeightsDirty;
        private _positions;
        private _vertexNormals;
        private _vertexTangents;
        private _uvs;
        private _secondaryUVs;
        private _jointIndices;
        private _jointWeights;
        private _useCondensedIndices;
        private _condensedJointIndices;
        private _condensedIndexLookUp;
        private _numCondensedJoints;
        private _jointsPerVertex;
        private _concatenateArrays;
        private _autoDeriveNormals;
        private _autoDeriveTangents;
        private _autoDeriveUVs;
        private _useFaceWeights;
        private _faceNormals;
        private _faceTangents;
        private _faceWeights;
        private _scaleU;
        private _scaleV;
        private _positionsUpdated;
        private _normalsUpdated;
        private _tangentsUpdated;
        private _uvsUpdated;
        private _secondaryUVsUpdated;
        private _jointIndicesUpdated;
        private _jointWeightsUpdated;
        /**
        *
        */
        public scaleU : number;
        /**
        *
        */
        public scaleV : number;
        /**
        * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
        * by condensing the number of joint index values required per mesh. Only applicable to
        * skeleton animations that utilise more than one mesh object. Defaults to false.
        */
        public useCondensedIndices : boolean;
        public _pUpdateStrideOffset(): void;
        /**
        *
        */
        public jointsPerVertex : number;
        /**
        * Defines whether a UV buffer should be automatically generated to contain dummy UV coordinates.
        * Set to true if a geometry lacks UV data but uses a material that requires it, or leave as false
        * in cases where UV data is explicitly defined or the material does not require UV data.
        */
        public autoDeriveUVs : boolean;
        /**
        * True if the vertex normals should be derived from the geometry, false if the vertex normals are set
        * explicitly.
        */
        public autoDeriveNormals : boolean;
        /**
        * True if the vertex tangents should be derived from the geometry, false if the vertex normals are set
        * explicitly.
        */
        public autoDeriveTangents : boolean;
        /**
        *
        */
        public vertices : number[];
        /**
        *
        */
        public positions : number[];
        /**
        *
        */
        public vertexNormals : number[];
        /**
        *
        */
        public vertexTangents : number[];
        /**
        * The raw data of the face normals, in the same order as the faces are listed in the index list.
        */
        public faceNormals : number[];
        /**
        * The raw data of the face tangets, in the same order as the faces are listed in the index list.
        */
        public faceTangents : number[];
        /**
        *
        */
        public uvs : number[];
        /**
        *
        */
        public secondaryUVs : number[];
        /**
        *
        */
        public jointIndices : number[];
        /**
        *
        */
        public jointWeights : number[];
        /**
        * Indicates whether or not to take the size of faces into account when auto-deriving vertex normals and tangents.
        */
        public useFaceWeights : boolean;
        public numCondensedJoints : number;
        public condensedIndexLookUp : number[];
        /**
        *
        */
        constructor(concatenatedArrays: boolean);
        public getBoundingPositions(): number[];
        /**
        *
        */
        public updatePositions(values: number[]): void;
        /**
        * Updates the vertex normals based on the geometry.
        */
        public updateVertexNormals(values: number[]): void;
        /**
        * Updates the vertex tangents based on the geometry.
        */
        public updateVertexTangents(values: number[]): void;
        /**
        * Updates the uvs based on the geometry.
        */
        public updateUVs(values: number[]): void;
        /**
        * Updates the secondary uvs based on the geometry.
        */
        public updateSecondaryUVs(values: number[]): void;
        /**
        * Updates the joint indices
        */
        public updateJointIndices(values: number[]): void;
        /**
        * Updates the joint weights.
        */
        public updateJointWeights(values: number[]): void;
        /**
        *
        */
        public dispose(): void;
        /**
        * Updates the face indices of the TriangleSubGeometry.
        *
        * @param indices The face indices to upload.
        */
        public updateIndices(indices: number[]): void;
        /**
        * Clones the current object
        * @return An exact duplicate of the current object.
        */
        public clone(): TriangleSubGeometry;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        /**
        * Scales the geometry.
        * @param scale The amount by which to scale.
        */
        public scale(scale: number): void;
        public applyTransformation(transform: geom.Matrix3D): void;
        /**
        * Updates the tangents for each face.
        */
        private updateFaceTangents();
        /**
        * Updates the normals for each face.
        */
        private updateFaceNormals();
        public _pNotifyVerticesUpdate(): void;
        private notifyPositionsUpdate();
        private notifyNormalsUpdate();
        private notifyTangentsUpdate();
        private notifyUVsUpdate();
        private notifySecondaryUVsUpdate();
        private notifyJointIndicesUpdate();
        private notifyJointWeightsUpdate();
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * TriangleSubMesh wraps a TriangleSubGeometry as a scene graph instantiation. A TriangleSubMesh is owned by a Mesh object.
    *
    *
    * @see away.base.TriangleSubGeometry
    * @see away.entities.Mesh
    *
    * @class away.base.TriangleSubMesh
    */
    class TriangleSubMesh extends SubMeshBase implements ISubMesh {
        private _subGeometry;
        /**
        *
        */
        public assetType : string;
        /**
        * The TriangleSubGeometry object which provides the geometry data for this TriangleSubMesh.
        */
        public subGeometry : TriangleSubGeometry;
        /**
        * Creates a new TriangleSubMesh object
        * @param subGeometry The TriangleSubGeometry object which provides the geometry data for this TriangleSubMesh.
        * @param parentMesh The Mesh object to which this TriangleSubMesh belongs.
        * @param material An optional material used to render this TriangleSubMesh.
        */
        constructor(subGeometry: TriangleSubGeometry, parentMesh: entities.Mesh, material?: materials.MaterialBase);
        /**
        *
        */
        public dispose(): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
    }
}
declare module away.textures {
    /**
    *
    */
    class TextureProxyBase extends library.NamedAssetBase implements library.IAsset {
        public _pSize: number;
        public _pFormat: string;
        private _hasMipmaps;
        private _generateMipmaps;
        private _textureData;
        /**
        *
        */
        constructor(generateMipmaps?: boolean);
        public size : number;
        public hasMipmaps : boolean;
        /**
        *
        * @returns {string}
        */
        public format : string;
        /**
        *
        * @returns {boolean}
        */
        public generateMipmaps : boolean;
        /**
        *
        * @returns {string}
        */
        public assetType : string;
        /**
        *
        */
        public invalidateContent(): void;
        /**
        *
        * @private
        */
        public invalidateSize(): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        public _iAddTextureData(textureData: pool.ITextureData): pool.ITextureData;
        public _iRemoveTextureData(textureData: pool.ITextureData): pool.ITextureData;
    }
}
declare module away.textures {
    class Texture2DBase extends TextureProxyBase {
        private _mipmapData;
        private _mipmapDataDirty;
        public _pWidth: number;
        public _pHeight: number;
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
        public size : number;
        constructor(generateMipmaps?: boolean);
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        *
        */
        public invalidateContent(): void;
        /**
        *
        * @param width
        * @param height
        * @private
        */
        public _pSetSize(width: number, height: number): void;
        public _iGetMipmapData(): base.BitmapData[];
        public _iGetTextureData(): any;
    }
}
declare module away.textures {
    class CubeTextureBase extends TextureProxyBase {
        public _mipmapDataArray: base.BitmapData[][];
        public _mipmapDataDirtyArray: boolean[];
        constructor(generateMipmaps?: boolean);
        /**
        *
        * @param width
        * @param height
        * @private
        */
        public _pSetSize(size: number): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        *
        */
        public invalidateContent(): void;
        public _iGetMipmapData(side: number): base.BitmapData[];
        public _iGetTextureData(side: number): any;
    }
}
declare module away.textures {
    class ImageTexture extends Texture2DBase {
        private _htmlImageElement;
        /**
        *
        * @param htmlImageElement
        * @param generateMipmaps
        */
        constructor(htmlImageElement: HTMLImageElement, generateMipmaps?: boolean);
        /**
        *
        */
        public htmlImageElement : HTMLImageElement;
        public _iGetTextureData(): HTMLImageElement;
    }
}
declare module away.textures {
    class BitmapTexture extends Texture2DBase {
        public _bitmapData: base.BitmapData;
        /**
        *
        * @returns {BitmapData}
        */
        public bitmapData : base.BitmapData;
        constructor(bitmapData: base.BitmapData, generateMipmaps?: boolean);
        public dispose(): void;
        public _iGetTextureData(): base.BitmapData;
    }
}
declare module away.textures {
    class RenderTexture extends Texture2DBase {
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
        constructor(width: number, height: number);
    }
}
declare module away.textures {
    class ImageCubeTexture extends CubeTextureBase {
        private _htmlImageElements;
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
        constructor(posX: HTMLImageElement, negX: HTMLImageElement, posY: HTMLImageElement, negY: HTMLImageElement, posZ: HTMLImageElement, negZ: HTMLImageElement, generateMipmaps?: boolean);
        private _testSize(value);
        public _iGetTextureData(side: number): HTMLImageElement;
    }
}
declare module away.textures {
    class BitmapCubeTexture extends CubeTextureBase {
        private _bitmapDatas;
        /**
        * The texture on the cube's right face.
        */
        public positiveX : base.BitmapData;
        /**
        * The texture on the cube's left face.
        */
        public negativeX : base.BitmapData;
        /**
        * The texture on the cube's top face.
        */
        public positiveY : base.BitmapData;
        /**
        * The texture on the cube's bottom face.
        */
        public negativeY : base.BitmapData;
        /**
        * The texture on the cube's far face.
        */
        public positiveZ : base.BitmapData;
        /**
        * The texture on the cube's near face.
        */
        public negativeZ : base.BitmapData;
        constructor(posX: base.BitmapData, negX: base.BitmapData, posY: base.BitmapData, negY: base.BitmapData, posZ: base.BitmapData, negZ: base.BitmapData, generateMipmaps?: boolean);
        /**
        *
        * @param value
        * @private
        */
        private _testSize(value);
        public dispose(): void;
        public _iGetTextureData(side: number): base.BitmapData;
    }
}
declare module away.textures {
    /**
    * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
    */
    class MipmapGenerator {
        private static _mipMaps;
        private static _mipMapUses;
        private static _matrix;
        private static _rect;
        private static _source;
        /**
        * Uploads a BitmapData with mip maps to a target Texture object.
        * @param source The source to upload.
        * @param target The target Texture to upload to.
        * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
        * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
        */
        static generateMipMaps(source: HTMLImageElement, output?: base.BitmapData[], alpha?: boolean): any;
        static generateMipMaps(source: base.BitmapData, output?: base.BitmapData[], alpha?: boolean): any;
        private static _getMipmapHolder(mipMapHolder, newW, newH);
        static freeMipMapHolder(mipMapHolder: base.BitmapData): void;
    }
}
declare module away.textures {
    /**
    * A convenience texture that encodes a specular map in the red channel, and the gloss map in the green channel, as expected by BasicSpecularMapMethod
    */
    class SpecularBitmapTexture extends BitmapTexture {
        private _specularMap;
        private _glossMap;
        constructor(specularMap?: base.BitmapData, glossMap?: base.BitmapData, generateMipmaps?: boolean);
        public specularMap : base.BitmapData;
        public glossMap : base.BitmapData;
        private _testSize();
        public _iGetTextureData(): base.BitmapData;
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
    class ParserBase extends events.EventDispatcher {
        public _iFileName: string;
        private _dataFormat;
        private _data;
        private _frameLimit;
        private _lastFrameTime;
        private _pOnIntervalDelegate;
        public _pContent: base.DisplayObject;
        static supportsType(extension: string): boolean;
        private _dependencies;
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
        public content : base.DisplayObject;
        /**
        * Creates a new ParserBase object
        * @param format The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>, and should be provided by the concrete subtype.
        *
        * @see away.loading.parsers.ParserDataFormat
        */
        constructor(format: string);
        /**
        * Validates a bitmapData loaded before assigning to a default BitmapMaterial
        */
        public isBitmapDataValid(bitmapData: base.BitmapData): boolean;
        public parsingFailure : boolean;
        public parsingPaused : boolean;
        public parsingComplete : boolean;
        public materialMode : number;
        public data : any;
        /**
        * The data format of the file data to be parsed. Options are <code>URLLoaderDataFormat.BINARY</code>, <code>URLLoaderDataFormat.ARRAY_BUFFER</code>, <code>URLLoaderDataFormat.BLOB</code>, <code>URLLoaderDataFormat.VARIABLES</code> or <code>URLLoaderDataFormat.TEXT</code>.
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
        public dependencies : ResourceDependency[];
        /**
        * Resolve a dependency when it's loaded. For example, a dependency containing an ImageResource would be assigned
        * to a Mesh instance as a BitmapMaterial, a scene graph object would be added to its intended parent. The
        * dependency should be a member of the dependencies property.
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependency(resourceDependency: ResourceDependency): void;
        /**
        * Resolve a dependency loading failure. Used by parser to eventually provide a default map
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
        /**
        * Resolve a dependency name
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependencyName(resourceDependency: ResourceDependency, asset: library.IAsset): string;
        public _iResumeParsingAfterDependencies(): void;
        public _pFinalizeAsset(asset: library.IAsset, name?: string): void;
        /**
        * Parse the next block of data.
        * @return Whether or not more data needs to be parsed. Can be <code>ParserBase.ParserBase.PARSING_DONE</code> or
        * <code>ParserBase.ParserBase.MORE_TO_PARSE</code>.
        */
        public _pProceedParsing(): boolean;
        public _pDieWithError(message?: string): void;
        public _pAddDependency(id: string, req: net.URLRequest, retrieveAsRawData?: boolean, data?: any, suppressErrorEvents?: boolean): ResourceDependency;
        public _pPauseAndRetrieveDependencies(): void;
        /**
        * Tests whether or not there is still time left for parsing within the maximum allowed time frame per session.
        * @return True if there is still time left, false if the maximum allotted time was exceeded and parsing should be interrupted.
        */
        public _pHasTime(): boolean;
        /**
        * Called when the parsing pause interval has passed and parsing can proceed.
        */
        public _pOnInterval(event?: events.TimerEvent): void;
        /**
        * Initializes the parsing of data.
        * @param frameLimit The maximum duration of a parsing session.
        */
        public _pStartParsing(frameLimit: number): void;
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
        public _pGetByteData(): utils.ByteArray;
    }
}
declare module away.parsers {
    /**
    * CubeTextureParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    class CubeTextureParser extends ParserBase {
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
        public _iResolveDependency(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
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
    * Texture2DParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    class Texture2DParser extends ParserBase {
        private _startedParsing;
        private _doneParsing;
        private _loadingImage;
        private _htmlImageElement;
        /**
        * Creates a new Texture2DParser object.
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
        public onLoadComplete(event: any): void;
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
    class ParserUtils {
        /**
        * Converts an ArrayBuffer to a base64 string
        *
        * @param image data as a ByteArray
        *
        * @return HTMLImageElement
        *
        */
        static arrayBufferToImage(data: ArrayBuffer): HTMLImageElement;
        /**
        * Converts an ByteArray to an Image - returns an HTMLImageElement
        *
        * @param image data as a ByteArray
        *
        * @return HTMLImageElement
        *
        */
        static byteArrayToImage(data: utils.ByteArray): HTMLImageElement;
        /**
        * Converts an Blob to an Image - returns an HTMLImageElement
        *
        * @param image data as a Blob
        *
        * @return HTMLImageElement
        *
        */
        static blobToImage(data: Blob): HTMLImageElement;
        /**
        * Returns a object as ByteArray, if possible.
        *
        * @param data The object to return as ByteArray
        *
        * @return The ByteArray or null
        *
        */
        static toByteArray(data: any): utils.ByteArray;
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
        private _request;
        private _assets;
        private _parser;
        private _parentParser;
        private _data;
        private _retrieveAsRawData;
        private _suppressAssetEvents;
        private _dependencies;
        public _iLoader: net.URLLoader;
        public _iSuccess: boolean;
        constructor(id: string, request: net.URLRequest, data: any, parser: ParserBase, parentParser: ParserBase, retrieveAsRawData?: boolean, suppressAssetEvents?: boolean);
        /**
        *
        */
        public id : string;
        /**
        *
        */
        public request : net.URLRequest;
        /**
        * The data containing the dependency to be parsed, if the resource was already loaded.
        */
        public data : any;
        /**
        *
        */
        public parser : ParserBase;
        /**
        * The parser which is dependent on this ResourceDependency object.
        */
        public parentParser : ParserBase;
        /**
        *
        */
        public retrieveAsRawData : boolean;
        /**
        *
        */
        public suppresAssetEvents : boolean;
        /**
        *
        */
        public assets : library.IAsset[];
        /**
        *
        */
        public dependencies : ResourceDependency[];
        /**
        * @private
        * Method to set data after having already created the dependency object, e.g. after load.
        */
        public _iSetData(data: any): void;
        /**
        * @private
        *
        */
        public _iSetParser(parser: ParserBase): void;
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
        public resolveName(asset: library.IAsset): string;
    }
}
declare module away.library {
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
declare module away.library {
    /**
    * AssetLoader can load any file format that away.supports (or for which a third-party parser
    * has been plugged in) and it's dependencies. Events are dispatched when assets are encountered
    * and for when the resource (or it's dependencies) have been loaded.
    *
    * The AssetLoader will not make assets available in any other way than through the dispatched
    * events. To store assets and make them available at any point from any module in an application,
    * use the AssetLibrary to load and manage assets.
    *
    * @see away.library.AssetLibrary
    */
    class AssetLoader extends events.EventDispatcher {
        private _context;
        private _token;
        private _uri;
        private _content;
        private _materialMode;
        private _errorHandlers;
        private _parseErrorHandlers;
        private _stack;
        private _baseDependency;
        private _currentDependency;
        private _namespace;
        private _onReadyForDependenciesDelegate;
        private _onParseCompleteDelegate;
        private _onParseErrorDelegate;
        private _onLoadCompleteDelegate;
        private _onLoadErrorDelegate;
        private _onTextureSizeErrorDelegate;
        private _onAssetCompleteDelegate;
        private static _parsers;
        /**
        * Enables a specific parser.
        * When no specific parser is set for a loading/parsing opperation,
        * loader3d can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parser The parser class to enable.
        *
        * @see away.parsers.Parsers
        */
        static enableParser(parser: any): void;
        /**
        * Enables a list of parsers.
        * When no specific parser is set for a loading/parsing opperation,
        * AssetLoader can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parsers A Vector of parser classes to enable.
        * @see away.parsers.Parsers
        */
        static enableParsers(parsers: Object[]): void;
        /**
        * Returns the base dependency of the loader
        */
        public baseDependency : parsers.ResourceDependency;
        /**
        * Create a new ResourceLoadSession object.
        */
        constructor(materialMode?: number);
        /**
        * Loads a file and (optionally) all of its dependencies.
        *
        * @param req The URLRequest object containing the URL of the file to be loaded.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public load(req: net.URLRequest, context?: AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): AssetLoaderToken;
        /**
        * Loads a resource from already loaded data.
        *
        * @param data The data object containing all resource information.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public loadData(data: any, id: string, context?: AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): AssetLoaderToken;
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
        private retrieveDependency(dependency);
        private joinUrl(base, end);
        private resolveDependencyUrl(dependency);
        private retrieveParserDependencies();
        private resolveParserDependencies();
        /**
        * Called when a single dependency loading failed, and pushes further dependencies onto the stack.
        * @param event
        */
        private onLoadError(event);
        /**
        * Called when a dependency parsing failed, and dispatches a <code>ParserEvent.PARSE_ERROR</code>
        * @param event
        */
        private onParseError(event);
        private onAssetComplete(event);
        private onReadyForDependencies(event);
        /**
        * Called when a single dependency was parsed, and pushes further dependencies onto the stack.
        * @param event
        */
        private onLoadComplete(event);
        /**
        * Called when parsing is complete.
        */
        private onParseComplete(event);
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
        /**
        * Guesses the parser to be used based on the file contents.
        * @param data The data to be parsed.
        * @param uri The url or id of the object to be parsed.
        * @return An instance of the guessed parser.
        */
        private getParserFromData(data);
        /**
        * Initiates parsing of the loaded dependency.
        *
        * @param The dependency to be parsed.
        */
        private parseDependency(dependency);
        /**
        * Guesses the parser to be used based on the file extension.
        * @return An instance of the guessed parser.
        */
        private getParserFromSuffix(url);
    }
}
declare module away.library {
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
    class AssetLoaderToken extends events.EventDispatcher {
        public _iLoader: AssetLoader;
        constructor(loader: AssetLoader);
        public addEventListener(type: string, listener: Function): void;
        public removeEventListener(type: string, listener: Function): void;
        public hasEventListener(type: string, listener?: Function): boolean;
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
    class AssetLibraryIterator {
        private _assets;
        private _filtered;
        private _idx;
        constructor(assets: IAsset[], assetTypeFilter: string, namespaceFilter: string, filterFunc: any);
        public currentAsset : IAsset;
        public numAssets : number;
        public next(): IAsset;
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
        public resolveConflict(changedAsset: IAsset, oldAsset: IAsset, assetsDictionary: Object, precedence: string): void;
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
        public _pUpdateNames(ns: string, nonConflictingName: string, oldAsset: IAsset, newAsset: IAsset, assetsDictionary: Object, precedence: string): void;
    }
}
declare module away.library {
    class NumSuffixConflictStrategy extends ConflictStrategyBase {
        private _separator;
        private _next_suffix;
        constructor(separator?: string);
        public resolveConflict(changedAsset: IAsset, oldAsset: IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): ConflictStrategyBase;
    }
}
declare module away.library {
    class IgnoreConflictStrategy extends ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: IAsset, oldAsset: IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): ConflictStrategyBase;
    }
}
declare module away.library {
    class ErrorConflictStrategy extends ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: IAsset, oldAsset: IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): ConflictStrategyBase;
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
        static APPEND_NUM_SUFFIX: ConflictStrategyBase;
        /**
        * Specifies that naming conflicts should be ignored. This is not recommended in most
        * cases, unless it can be 100% guaranteed that the application does not cause naming
        * conflicts in the library (i.e. when an app-level system is in place to prevent this.)
        */
        static IGNORE: ConflictStrategyBase;
        /**
        * Specifies that an error should be thrown if a naming conflict is discovered. Use this
        * to be 100% sure that naming conflicts never occur unnoticed, and when it's undesirable
        * to have the library automatically rename assets to avoid such conflicts.
        */
        static THROW_ERROR: ConflictStrategyBase;
    }
}
declare module away.library {
    /**
    * AssetLibraryBundle enforces a multiton pattern and is not intended to be instanced directly.
    * Its purpose is to create a container for 3D data management, both before and after parsing.
    * If you are interested in creating multiple library bundles, please use the <code>getInstance()</code> method.
    */
    class AssetLibraryBundle extends events.EventDispatcher {
        private _loadingSessions;
        private _strategy;
        private _strategyPreference;
        private _assets;
        private _assetDictionary;
        private _assetDictDirty;
        private _loadingSessionsGarbage;
        private _gcTimeoutIID;
        private _onAssetRenameDelegate;
        private _onAssetConflictResolvedDelegate;
        private _onResourceCompleteDelegate;
        private _onTextureSizeErrorDelegate;
        private _onAssetCompleteDelegate;
        private _onLoadErrorDelegate;
        private _onParseErrorDelegate;
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
        * @see naming.ConflictStrategy
        * @see AssetLibrary.conflictPrecedence
        */
        public conflictStrategy : ConflictStrategyBase;
        /**
        * Defines which asset should have precedence when resolving a naming conflict between
        * two assets of which one has just been renamed by the user or by a parser. By default
        * <code>ConflictPrecedence.FAVOR_NEW</code> is used, meaning that the newly renamed
        * asset will keep it's new name while the older asset gets renamed to not conflict.
        *
        * This property is ignored for conflict strategies that do not actually rename an
        * asset automatically, such as ConflictStrategy.IGNORE and ConflictStrategy.THROW_ERROR.
        *
        * @see away.library.ConflictPrecedence
        * @see away.library.ConflictStrategy
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
        * @see away.library.AssetType
        */
        public createIterator(assetTypeFilter?: string, namespaceFilter?: string, filterFunc?: any): AssetLibraryIterator;
        /**
        * Loads a file and (optionally) all of its dependencies.
        *
        * @param req The URLRequest object containing the URL of the file to be loaded.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        * @return A handle to the retrieved resource.
        */
        public load(req: net.URLRequest, context?: AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): AssetLoaderToken;
        /**
        * Loads a resource from existing data in memory.
        *
        * @param data The data object containing all resource information.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        * @return A handle to the retrieved resource.
        */
        public loadData(data: any, context?: AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): AssetLoaderToken;
        /**
        *
        */
        public getAsset(name: string, ns?: string): IAsset;
        /**
        * Adds an asset to the asset library, first making sure that it's name is unique
        * using the method defined by the <code>conflictStrategy</code> and
        * <code>conflictPrecedence</code> properties.
        */
        public addAsset(asset: IAsset): void;
        /**
        * Removes an asset from the library, and optionally disposes that asset by calling
        * it's disposeAsset() method (which for most assets is implemented as a default
        * version of that type's dispose() method.
        *
        * @param asset The asset which should be removed from this library.
        * @param dispose Defines whether the assets should also be disposed.
        */
        public removeAsset(asset: IAsset, dispose?: boolean): void;
        /**
        * Removes an asset which is specified using name and namespace.
        *
        * @param name The name of the asset to be removed.
        * @param ns The namespace to which the desired asset belongs.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see away.library.AssetLibrary.removeAsset()
        */
        public removeAssetByName(name: string, ns?: string, dispose?: boolean): IAsset;
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
        public stopAllLoadingSessions(): void;
        private rehashAssetDict();
        /**
        * Called when a an error occurs during loading.
        */
        private onLoadError(event);
        /**
        * Called when a an error occurs during parsing.
        */
        private onParseError(event);
        private onAssetComplete(event);
        private onTextureSizeError(event);
        /**
        * Called when the resource and all of its dependencies was retrieved.
        */
        private onResourceComplete(event);
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
        static getBundle(key?: string): AssetLibraryBundle;
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
        * @see AssetLibraryBundle.conflictStrategy
        */
        static conflictStrategy : ConflictStrategyBase;
        /**
        * Short-hand for conflictPrecedence property on default asset library bundle.
        *
        * @see AssetLibraryBundle.conflictPrecedence
        */
        static conflictPrecedence : string;
        /**
        * Short-hand for createIterator() method on default asset library bundle.
        *
        * @see AssetLibraryBundle.createIterator()
        */
        static createIterator(assetTypeFilter?: string, namespaceFilter?: string, filterFunc?: any): AssetLibraryIterator;
        /**
        * Short-hand for load() method on default asset library bundle.
        *
        * @see AssetLibraryBundle.load()
        */
        static load(req: net.URLRequest, context?: AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): AssetLoaderToken;
        /**
        * Short-hand for loadData() method on default asset library bundle.
        *
        * @see AssetLibraryBundle.loadData()
        */
        static loadData(data: any, context?: AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): AssetLoaderToken;
        static stopLoad(): void;
        /**
        * Short-hand for getAsset() method on default asset library bundle.
        *
        * @see AssetLibraryBundle.getAsset()
        */
        static getAsset(name: string, ns?: string): IAsset;
        /**
        * Short-hand for addEventListener() method on default asset library bundle.
        */
        static addEventListener(type: string, listener: Function): void;
        /**
        * Short-hand for removeEventListener() method on default asset library bundle.
        */
        static removeEventListener(type: string, listener: Function): void;
        /**
        * Short-hand for hasEventListener() method on default asset library bundle.
        
        public static hasEventListener(type:string):boolean
        {
        return AssetLibrary.getBundle().hasEventListener(type);
        }
        
        public static willTrigger(type:string):boolean
        {
        return getBundle().willTrigger(type);
        }
        */
        /**
        * Short-hand for addAsset() method on default asset library bundle.
        *
        * @see AssetLibraryBundle.addAsset()
        */
        static addAsset(asset: IAsset): void;
        /**
        * Short-hand for removeAsset() method on default asset library bundle.
        *
        * @param asset The asset which should be removed from the library.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see AssetLibraryBundle.removeAsset()
        */
        static removeAsset(asset: IAsset, dispose?: boolean): void;
        /**
        * Short-hand for removeAssetByName() method on default asset library bundle.
        *
        * @param name The name of the asset to be removed.
        * @param ns The namespace to which the desired asset belongs.
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see AssetLibraryBundle.removeAssetByName()
        */
        static removeAssetByName(name: string, ns?: string, dispose?: boolean): IAsset;
        /**
        * Short-hand for removeAllAssets() method on default asset library bundle.
        *
        * @param dispose Defines whether the assets should also be disposed.
        *
        * @see AssetLibraryBundle.removeAllAssets()
        */
        static removeAllAssets(dispose?: boolean): void;
        /**
        * Short-hand for removeNamespaceAssets() method on default asset library bundle.
        *
        * @see AssetLibraryBundle.removeNamespaceAssets()
        */
        static removeNamespaceAssets(ns?: string, dispose?: boolean): void;
    }
}
declare class AssetLibrarySingletonEnforcer {
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.EntityListItem
    */
    class EntityListItem {
        /**
        *
        */
        public entity: entities.IEntity;
        /**
        *
        */
        public next: EntityListItem;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.EntityListItemPool
    */
    class EntityListItemPool {
        private _pool;
        private _index;
        private _poolSize;
        /**
        *
        */
        constructor();
        /**
        *
        */
        public getItem(): EntityListItem;
        /**
        *
        */
        public freeAll(): void;
        public dispose(): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * IRenderable is an interface for classes that are used in the rendering pipeline to render the
    * contents of a partition
    *
    * @class away.render.IRenderable
    */
    interface IRenderable {
        /**
        *
        */
        next: IRenderable;
        /**
        *
        */
        materialId: number;
        /**
        *
        */
        materialOwner: base.IMaterialOwner;
        /**
        *
        */
        sourceEntity: entities.IEntity;
        /**
        *
        */
        renderOrderId: number;
        /**
        *
        */
        zIndex: number;
        /**
        *
        */
        dispose(): any;
        /**
        *
        */
        invalidateGeometry(): any;
        /**
        *
        */
        invalidateIndexData(): any;
        /**
        *
        */
        invalidateVertexData(dataType: string): any;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * IRenderableClass is an interface for the constructable class definition IRenderable that is used to
    * create renderable objects in the rendering pipeline to render the contents of a partition
    *
    * @class away.render.IRenderableClass
    */
    interface IRenderableClass {
        /**
        *
        */
        id: string;
        /**
        *
        */
        new(pool: RenderablePool, materialOwner: base.IMaterialOwner): IRenderable;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderablePool
    */
    class RenderablePool {
        private static _pools;
        private _pool;
        private _renderableClass;
        /**
        * //TODO
        *
        * @param renderableClass
        */
        constructor(renderableClass: IRenderableClass);
        /**
        * //TODO
        *
        * @param materialOwner
        * @returns IRenderable
        */
        public getItem(materialOwner: base.IMaterialOwner): IRenderable;
        /**
        * //TODO
        *
        * @param materialOwner
        */
        public disposeItem(materialOwner: base.IMaterialOwner): void;
        /**
        * //TODO
        *
        * @param renderableClass
        * @returns RenderablePool
        */
        static getPool(renderableClass: IRenderableClass): RenderablePool;
        /**
        * //TODO
        *
        * @param renderableClass
        */
        static disposePool(renderableClass: any): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * ITextureData is an interface for classes that are used in the rendering pipeline to render the
    * contents of a texture
    *
    * @class away.pool.ITextureData
    */
    interface ITextureData {
        /**
        *
        */
        dispose(): any;
        /**
        *
        */
        invalidate(): any;
    }
}
/**
* @module away.data
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class CSSRenderableBase implements IRenderable {
        /**
        *
        */
        private _pool;
        /**
        *
        */
        public next: CSSRenderableBase;
        /**
        *
        */
        public materialId: number;
        /**
        *
        */
        public renderOrderId: number;
        /**
        *
        */
        public zIndex: number;
        /**
        *
        */
        public cascaded: boolean;
        /**
        *
        */
        public renderSceneTransform: geom.Matrix3D;
        /**
        *
        */
        public sourceEntity: entities.IEntity;
        /**
        *
        */
        public materialOwner: base.IMaterialOwner;
        /**
        *
        */
        public htmlElement: HTMLElement;
        /**
        *
        * @param sourceEntity
        * @param material
        * @param animator
        */
        constructor(pool: RenderablePool, sourceEntity: entities.IEntity, materialOwner: base.IMaterialOwner);
        /**
        *
        */
        public dispose(): void;
        /**
        *
        */
        public invalidateGeometry(): void;
        /**
        *
        */
        public invalidateIndexData(): void;
        /**
        *
        */
        public invalidateVertexData(dataType: string): void;
    }
}
/**
* @module away.data
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class CSSBillboardRenderable extends CSSRenderableBase {
        static id: string;
        constructor(pool: RenderablePool, billboard: entities.Billboard);
    }
}
/**
* @module away.data
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class CSSLineSegmentRenderable extends CSSRenderableBase {
        static id: string;
        constructor(pool: RenderablePool, lineSegment: entities.LineSegment);
    }
}
/**
* @module away.data
*/
declare module away.pool {
    /**
    * @class away.pool.CSSSkyboxRenderable
    */
    class CSSSkyboxRenderable extends CSSRenderableBase {
        static id: string;
        constructor(pool: RenderablePool, skyBox: entities.Skybox);
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.ICollector
    */
    interface ICollector {
        /**
        *
        */
        camera: entities.Camera;
        /**
        *
        */
        scene: containers.Scene;
        /**
        *
        */
        numEntities: number;
        /**
        *
        */
        numInteractiveEntities: number;
        /**
        *
        */
        clear(): any;
        /**
        *
        */
        entityHead: any;
        /**
        *
        * @param node
        */
        enterNode(node: partition.NodeBase): boolean;
        /**
        *
        * @param entity
        */
        applyDirectionalLight(entity: entities.IEntity): any;
        /**
        *
        * @param entity
        */
        applyEntity(entity: entities.IEntity): any;
        /**
        *
        * @param entity
        */
        applyLightProbe(entity: entities.IEntity): any;
        /**
        *
        * @param entity
        */
        applyPointLight(entity: entities.IEntity): any;
        /**
        *
        * @param entity
        */
        applySkybox(entity: entities.IEntity): any;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.CollectorBase
    */
    class CollectorBase implements ICollector {
        public scene: containers.Scene;
        public _pEntityHead: pool.EntityListItem;
        public _pEntityListItemPool: pool.EntityListItemPool;
        public _pCamera: entities.Camera;
        private _customCullPlanes;
        private _cullPlanes;
        private _numCullPlanes;
        public _pNumEntities: number;
        public _pNumInteractiveEntities: number;
        constructor();
        /**
        *
        */
        public camera : entities.Camera;
        /**
        *
        */
        public cullPlanes : geom.Plane3D[];
        /**
        *
        */
        public entityHead : pool.EntityListItem;
        /**
        *
        */
        public numEntities : number;
        /**
        *
        */
        public numInteractiveEntities : number;
        /**
        *
        */
        public clear(): void;
        /**
        *
        * @param node
        * @returns {boolean}
        */
        public enterNode(node: partition.NodeBase): boolean;
        /**
        *
        * @param entity
        */
        public applyDirectionalLight(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyEntity(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyLightProbe(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyPointLight(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applySkybox(entity: entities.IEntity): void;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.EntityCollector
    */
    class EntityCollector extends CollectorBase {
        public _pSkybox: entities.Skybox;
        public _pLights: base.LightBase[];
        private _directionalLights;
        private _pointLights;
        private _lightProbes;
        public _pNumLights: number;
        private _numDirectionalLights;
        private _numPointLights;
        private _numLightProbes;
        /**
        *
        */
        public directionalLights : entities.DirectionalLight[];
        /**
        *
        */
        public lightProbes : entities.LightProbe[];
        /**
        *
        */
        public lights : base.LightBase[];
        /**
        *
        */
        public pointLights : entities.PointLight[];
        /**
        *
        */
        public skyBox : entities.Skybox;
        constructor();
        /**
        *
        * @param entity
        */
        public applyDirectionalLight(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyLightProbe(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyPointLight(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applySkybox(entity: entities.IEntity): void;
        /**
        *
        */
        public clear(): void;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * The RaycastCollector class is a traverser for scene partitions that collects all scene graph entities that are
    * considered intersecting with the defined ray.
    *
    * @see away.partition.Partition
    * @see away.entities.IEntity
    *
    * @class away.traverse.RaycastCollector
    */
    class RaycastCollector extends CollectorBase {
        private _rayPosition;
        private _rayDirection;
        public _iCollectionMark: number;
        /**
        * Provides the starting position of the ray.
        */
        public rayPosition : geom.Vector3D;
        /**
        * Provides the direction vector of the ray.
        */
        public rayDirection : geom.Vector3D;
        /**
        * Creates a new RaycastCollector object.
        */
        constructor();
        /**
        * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
        *
        * @param node The Partition3DNode object to frustum-test.
        */
        public enterNode(node: partition.NodeBase): boolean;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.CSSEntityCollector
    */
    class CSSEntityCollector extends CollectorBase implements ICollector {
        constructor();
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.ShadowCasterCollector
    */
    class ShadowCasterCollector extends CollectorBase {
        constructor();
        /**
        *
        */
        public enterNode(node: partition.NodeBase): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.NodeBase
    */
    class NodeBase {
        private _boundsChildrenVisible;
        private _explicitBoundsVisible;
        private _implicitBoundsVisible;
        public _iParent: NodeBase;
        public _pChildNodes: NodeBase[];
        public _pNumChildNodes: number;
        public _pBoundsPrimitive: entities.IEntity;
        public _iNumEntities: number;
        public _iCollectionMark: number;
        /**
        *
        */
        public boundsVisible : boolean;
        public boundsChildrenVisible : boolean;
        /**
        *
        */
        public parent : NodeBase;
        /**
        *
        * @protected
        */
        public _pNumEntities : number;
        /**
        *
        */
        constructor();
        /**
        *
        * @param planes
        * @param numPlanes
        * @returns {boolean}
        * @internal
        */
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
        /**
        *
        * @param rayPosition
        * @param rayDirection
        * @returns {boolean}
        */
        public isIntersectingRay(rayPosition: geom.Vector3D, rayDirection: geom.Vector3D): boolean;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
        /**
        *
        * @param entity
        * @returns {away.partition.NodeBase}
        */
        public findPartitionForEntity(entity: entities.IEntity): NodeBase;
        /**
        *
        * @param traverser
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @protected
        */
        public _pCreateBoundsPrimitive(): entities.IEntity;
        /**
        *
        * @param node
        * @internal
        */
        public iAddNode(node: NodeBase): void;
        /**
        *
        * @param node
        * @internal
        */
        public iRemoveNode(node: NodeBase): void;
        private _iUpdateImplicitBoundsVisible(value);
        /**
        * @internal
        */
        public _iIsBoundsVisible(): boolean;
        public _iUpdateEntityBounds(): void;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.NullNode
    */
    class NullNode {
        constructor();
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.Partition
    */
    class Partition {
        public _rootNode: NodeBase;
        private _updatesMade;
        private _updateQueue;
        constructor(rootNode: NodeBase);
        public rootNode : NodeBase;
        public traverse(traverser: traverse.ICollector): void;
        public iMarkForUpdate(entity: base.DisplayObject): void;
        public iRemoveEntity(entity: base.DisplayObject): void;
        private updateEntities();
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.EntityNode
    */
    class EntityNode extends NodeBase {
        private _entity;
        public _iUpdateQueueNext: EntityNode;
        constructor(entity: entities.IEntity);
        public entity : entities.IEntity;
        public removeFromParent(): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
        /**
        *
        * @param planes
        * @param numPlanes
        * @returns {boolean}
        */
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        * @inheritDoc
        */
        public isIntersectingRay(rayPosition: geom.Vector3D, rayDirection: geom.Vector3D): boolean;
        /**
        *
        * @protected
        */
        public _pCreateBoundsPrimitive(): entities.IEntity;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.CameraNode
    */
    class CameraNode extends EntityNode {
        constructor(camera: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.DirectionalLightNode
    */
    class DirectionalLightNode extends EntityNode {
        private _directionalLight;
        /**
        *
        * @param directionalLight
        */
        constructor(directionalLight: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.LightProbeNode
    */
    class LightProbeNode extends EntityNode {
        private _lightProbe;
        /**
        *
        * @param lightProbe
        */
        constructor(lightProbe: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.PointLightNode
    */
    class PointLightNode extends EntityNode {
        private _pointLight;
        /**
        *
        * @param pointLight
        */
        constructor(pointLight: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * SkyboxNode is a space partitioning leaf node that contains a Skybox object.
    *
    * @class away.partition.SkyboxNode
    */
    class SkyboxNode extends EntityNode {
        private _skyBox;
        /**
        * Creates a new SkyboxNode object.
        * @param skyBox The Skybox to be contained in the node.
        */
        constructor(skyBox: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @param planes
        * @param numPlanes
        * @returns {boolean}
        */
        public isInFrustum(planes: geom.Plane3D[], numPlanes: number): boolean;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Provides an interface for picking colliders that can be assigned to individual entities in a scene for specific picking behaviour.
    * Used with the <code>RaycastPicker</code> picking object.
    *
    * @see away.entities.Entity#pickingCollider
    * @see away.pick.RaycastPicker
    *
    * @interface away.pick.IPickingCollider
    */
    interface IPickingCollider {
        /**
        * Sets the position and direction of a picking ray in local coordinates to the entity.
        *
        * @param localDirection The position vector in local coordinates
        * @param localPosition The direction vector in local coordinates
        */
        setLocalRay(localPosition: geom.Vector3D, localDirection: geom.Vector3D): any;
        /**
        * Tests a <code>Billboard</code> object for a collision with the picking ray.
        *
        * @param entity The entity instance to be tested.
        * @param pickingCollisionVO The collision object used to store the collision results
        * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
        */
        testBillboardCollision(entity: entities.IEntity, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
        /**
        * Tests a <code>Mesh</code> object for a collision with the picking ray.
        *
        * @param entity The entity instance to be tested.
        * @param pickingCollisionVO The collision object used to store the collision results
        * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
        * @param findClosest
        */
        testMeshCollision(entity: entities.IEntity, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number, findClosest: boolean): boolean;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Provides an interface for picking objects that can pick 3d objects from a view or scene.
    *
    * @interface away.pick.IPicker
    */
    interface IPicker {
        /**
        * Gets the collision object from the screen coordinates of the picking ray.
        *
        * @param x The x coordinate of the picking ray in screen-space.
        * @param y The y coordinate of the picking ray in screen-space.
        * @param view The view on which the picking object acts.
        */
        getViewCollision(x: number, y: number, view: containers.View): PickingCollisionVO;
        /**
        * Gets the collision object from the scene position and direction of the picking ray.
        *
        * @param position The position of the picking ray in scene-space.
        * @param direction The direction of the picking ray in scene-space.
        * @param scene The scene on which the picking object acts.
        */
        getSceneCollision(position: geom.Vector3D, direction: geom.Vector3D, scene: containers.Scene): PickingCollisionVO;
        /**
        * Determines whether the picker takes account of the mouseEnabled properties of entities. Defaults to true.
        */
        onlyMouseEnabled: boolean;
        /**
        * Disposes memory used by the IPicker object
        */
        dispose(): any;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Value object for a picking collision returned by a picking collider. Created as unique objects on display objects
    *
    * @see away.base.DisplayObject#pickingCollisionVO
    * @see away.core.pick.IPickingCollider
    *
    * @class away.pick.PickingCollisionVO
    */
    class PickingCollisionVO {
        /**
        * The display object to which this collision object belongs.
        */
        public displayObject: base.DisplayObject;
        /**
        * The local position of the collision on the entity's surface.
        */
        public localPosition: geom.Vector3D;
        /**
        * The local normal vector at the position of the collision.
        */
        public localNormal: geom.Vector3D;
        /**
        * The uv coordinate at the position of the collision.
        */
        public uv: geom.Point;
        /**
        * The index of the face where the event took pl ace.
        */
        public index: number;
        /**
        * The starting position of the colliding ray in local coordinates.
        */
        public localRayPosition: geom.Vector3D;
        /**
        * The direction of the colliding ray in local coordinates.
        */
        public localRayDirection: geom.Vector3D;
        /**
        * The starting position of the colliding ray in scene coordinates.
        */
        public rayPosition: geom.Vector3D;
        /**
        * The direction of the colliding ray in scene coordinates.
        */
        public rayDirection: geom.Vector3D;
        /**
        * Determines if the ray position is contained within the entity bounds.
        *
        * @see away3d.entities.Entity#bounds
        */
        public rayOriginIsInsideBounds: boolean;
        /**
        * The distance along the ray from the starting position to the calculated intersection entry point with the entity.
        */
        public rayEntryDistance: number;
        /**
        * The material ownwer associated with a collision.
        */
        public materialOwner: base.IMaterialOwner;
        /**
        * Creates a new <code>PickingCollisionVO</code> object.
        *
        * @param entity The entity to which this collision object belongs.
        */
        constructor(displayObject: base.DisplayObject);
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Picks a 3d object from a view or scene by 3D raycast calculations.
    * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
    * then triggers an optional picking collider on individual entity objects to further determine the precise values of the picking ray collision.
    *
    * @class away.pick.RaycastPicker
    */
    class RaycastPicker implements IPicker {
        private _findClosestCollision;
        private _raycastCollector;
        private _ignoredEntities;
        private _onlyMouseEnabled;
        private _entities;
        private _numEntities;
        private _hasCollisions;
        /**
        * @inheritDoc
        */
        public onlyMouseEnabled : boolean;
        /**
        * Creates a new <code>RaycastPicker</code> object.
        *
        * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
        * or simply returns the first collision encountered. Defaults to false.
        */
        constructor(findClosestCollision?: boolean);
        /**
        * @inheritDoc
        */
        public getViewCollision(x: number, y: number, view: containers.View): PickingCollisionVO;
        /**
        * @inheritDoc
        */
        public getSceneCollision(rayPosition: geom.Vector3D, rayDirection: geom.Vector3D, scene: containers.Scene): PickingCollisionVO;
        public setIgnoreList(entities: any): void;
        private isIgnored(entity);
        private sortOnNearT(entity1, entity2);
        private getPickingCollisionVO(collector);
        private updateLocalPosition(pickingCollisionVO);
        public dispose(): void;
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * IRenderer is an interface for classes that are used in the rendering pipeline to render the
    * contents of a partition
    *
    * @class away.render.IRenderer
    */
    interface IRenderer extends events.IEventDispatcher {
        /**
        *
        */
        renderableSorter: sort.IEntitySorter;
        /**
        *
        */
        shareContext: boolean;
        /**
        *
        */
        x: number;
        /**
        *
        */
        y: number;
        /**
        *
        */
        width: number;
        /**
        *
        */
        height: number;
        /**
        *
        */
        viewPort: geom.Rectangle;
        /**
        *
        */
        scissorRect: geom.Rectangle;
        /**
        *
        * @param billboard
        */
        applyBillboard(billboard: entities.Billboard): any;
        /**
        *
        * @param triangleSubMesh
        */
        applyLineSubMesh(triangleSubMesh: base.LineSubMesh): any;
        /**
        *
        * @param triangleSubMesh
        */
        applyTriangleSubMesh(triangleSubMesh: base.TriangleSubMesh): any;
        /**
        *
        */
        dispose(): any;
        /**
        *
        * @param entityCollector
        */
        render(entityCollector: traverse.ICollector): any;
        /**
        * @internal
        */
        _iBackgroundR: number;
        /**
        * @internal
        */
        _iBackgroundG: number;
        /**
        * @internal
        */
        _iBackgroundB: number;
        /**
        * @internal
        */
        _iBackgroundAlpha: number;
        /**
        * @internal
        */
        _iCreateEntityCollector(): traverse.ICollector;
        _iRender(entityCollector: traverse.ICollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): any;
        _iRenderCascades(entityCollector: traverse.ICollector, target: textures.TextureProxyBase, numCascades: number, scissorRects: geom.Rectangle[], cameras: entities.Camera[]): any;
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
    * contents of a partition
    *
    * @class away.render.RendererBase
    */
    class CSSRendererBase extends events.EventDispatcher {
        private _billboardRenderablePool;
        private _lineSegmentRenderablePool;
        public _pCamera: entities.Camera;
        public _iEntryPoint: geom.Vector3D;
        public _pCameraForward: geom.Vector3D;
        private _backgroundR;
        private _backgroundG;
        private _backgroundB;
        private _backgroundAlpha;
        private _shareContext;
        public _pBackBufferInvalid: boolean;
        public _depthTextureInvalid: boolean;
        public _renderableHead: pool.CSSRenderableBase;
        public _width: number;
        public _height: number;
        private _viewPort;
        private _viewportDirty;
        private _scissorRect;
        private _scissorDirty;
        private _localPos;
        private _globalPos;
        private _scissorUpdated;
        private _viewPortUpdated;
        /**
        * A viewPort rectangle equivalent of the StageGL size and position.
        */
        public viewPort : geom.Rectangle;
        /**
        * A scissor rectangle equivalent of the view size and position.
        */
        public scissorRect : geom.Rectangle;
        /**
        *
        */
        public x : number;
        /**
        *
        */
        public y : number;
        /**
        *
        */
        public width : number;
        /**
        *
        */
        public height : number;
        /**
        *
        */
        public renderableSorter: sort.IEntitySorter;
        /**
        * Creates a new RendererBase object.
        */
        constructor(renderToTexture?: boolean, forceSoftware?: boolean, profile?: string);
        /**
        * The background color's red component, used when clearing.
        *
        * @private
        */
        public _iBackgroundR : number;
        /**
        * The background color's green component, used when clearing.
        *
        * @private
        */
        public _iBackgroundG : number;
        /**
        * The background color's blue component, used when clearing.
        *
        * @private
        */
        public _iBackgroundB : number;
        public shareContext : boolean;
        /**
        * Disposes the resources used by the RendererBase.
        */
        public dispose(): void;
        public render(entityCollector: traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param scissorRect
        */
        public _iRender(entityCollector: traverse.EntityCollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        public _iRenderCascades(entityCollector: traverse.ICollector, target: textures.TextureProxyBase, numCascades: number, scissorRects: geom.Rectangle[], cameras: entities.Camera[]): void;
        public pCollectRenderables(entityCollector: traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param scissorRect
        */
        public pExecuteRender(entityCollector: traverse.CSSEntityCollector, scissorRect?: geom.Rectangle): void;
        /**
        * Performs the actual drawing of dom objects to the target.
        *
        * @param entityCollector The EntityCollector object containing the potentially visible dom objects.
        */
        public pDraw(entityCollector: traverse.CSSEntityCollector): void;
        public _iBackgroundAlpha : number;
        /**
        *
        * @param billboard
        */
        public applyBillboard(billboard: entities.Billboard): void;
        /**
        *
        * @param lineSubMesh
        */
        public applyLineSubMesh(lineSubMesh: base.LineSubMesh): void;
        /**
        *
        * @param skybox
        */
        public applySkybox(skybox: entities.Skybox): void;
        /**
        *
        * @param triangleSubMesh
        */
        public applyTriangleSubMesh(triangleSubMesh: base.TriangleSubMesh): void;
        /**
        *
        * @param renderable
        * @private
        */
        private _applyRenderable(renderable);
        /**
        * @private
        */
        private notifyScissorUpdate();
        /**
        * @private
        */
        private notifyViewportUpdate();
        /**
        *
        */
        public updateGlobalPos(): void;
        public _iCreateEntityCollector(): traverse.ICollector;
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
    * materials assigned to them.
    *
    * @class away.render.DefaultRenderer
    */
    class CSSDefaultRenderer extends CSSRendererBase implements IRenderer {
        private _container;
        private _context;
        private _contextStyle;
        private _contextMatrix;
        private _activeMaterial;
        private _skyboxProjection;
        private _transform;
        /**
        * Creates a new CSSDefaultRenderer object.
        */
        constructor();
        /**
        *
        * @param entityCollector
        */
        public render(entityCollector: traverse.ICollector): void;
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: traverse.EntityCollector): void;
        /**
        * Updates the backbuffer properties.
        */
        public pUpdateBackBuffer(): void;
        /**
        * Draw the skybox if present.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawSkybox(entityCollector);
        /**
        * Draw a list of renderables.
        * @param renderables The renderables to draw.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawRenderables(item, entityCollector);
        public dispose(): void;
        public _iCreateEntityCollector(): traverse.ICollector;
    }
}
/**
* @module away.sort
*/
declare module away.sort {
    /**
    * @interface away.sort.IEntitySorter
    */
    interface IEntitySorter {
        sortBlendedRenderables(head: pool.IRenderable): pool.IRenderable;
        sortOpaqueRenderables(head: pool.IRenderable): pool.IRenderable;
    }
}
/**
* @module away.sort
*/
declare module away.sort {
    /**
    * @class away.sort.RenderableMergeSort
    */
    class RenderableMergeSort implements IEntitySorter {
        public sortBlendedRenderables(head: pool.IRenderable): pool.IRenderable;
        public sortOpaqueRenderables(head: pool.IRenderable): pool.IRenderable;
    }
}
/**
* The AntiAliasType class provides values for anti-aliasing in the
* away.text.TextField class.
*/
declare module away.text {
    class AntiAliasType {
        /**
        * Sets anti-aliasing to advanced anti-aliasing. Advanced anti-aliasing
        * allows font faces to be rendered at very high quality at small sizes. It
        * is best used with applications that have a lot of small text. Advanced
        * anti-aliasing is not recommended for very large fonts(larger than 48
        * points). This constant is used for the <code>antiAliasType</code> property
        * in the TextField class. Use the syntax
        * <code>AntiAliasType.ADVANCED</code>.
        */
        static ADVANCED: string;
        /**
        * Sets anti-aliasing to the anti-aliasing that is used in Flash Player 7 and
        * earlier. This setting is recommended for applications that do not have a
        * lot of text. This constant is used for the <code>antiAliasType</code>
        * property in the TextField class. Use the syntax
        * <code>AntiAliasType.NORMAL</code>.
        */
        static NORMAL: string;
    }
}
/**
* The GridFitType class defines values for grid fitting in the TextField class.
*/
declare module away.text {
    class GridFitType {
        /**
        * Doesn't set grid fitting. Horizontal and vertical lines in the glyphs are
        * not forced to the pixel grid. This constant is used in setting the
        * <code>gridFitType</code> property of the TextField class. This is often a
        * good setting for animation or for large font sizes. Use the syntax
        * <code>GridFitType.NONE</code>.
        */
        static NONE: string;
        /**
        * Fits strong horizontal and vertical lines to the pixel grid. This constant
        * is used in setting the <code>gridFitType</code> property of the TextField
        * class. This setting only works for left-justified text fields and acts
        * like the <code>GridFitType.SUBPIXEL</code> constant in static text. This
        * setting generally provides the best readability for left-aligned text. Use
        * the syntax <code>GridFitType.PIXEL</code>.
        */
        static PIXEL: string;
        /**
        * Fits strong horizontal and vertical lines to the sub-pixel grid on LCD
        * monitors. (Red, green, and blue are actual pixels on an LCD screen.) This
        * is often a good setting for right-aligned or center-aligned dynamic text,
        * and it is sometimes a useful tradeoff for animation vs. text quality. This
        * constant is used in setting the <code>gridFitType</code> property of the
        * TextField class. Use the syntax <code>GridFitType.SUBPIXEL</code>.
        */
        static SUBPIXEL: string;
    }
}
/**
* The TextFieldAutoSize class is an enumeration of constant values used in
* setting the <code>autoSize</code> property of the TextField class.
*/
declare module away.text {
    class TextFieldAutoSize {
        /**
        * Specifies that the text is to be treated as center-justified text. Any
        * resizing of a single line of a text field is equally distributed to both
        * the right and left sides.
        */
        static CENTER: string;
        /**
        * Specifies that the text is to be treated as left-justified text, meaning
        * that the left side of the text field remains fixed and any resizing of a
        * single line is on the right side.
        */
        static LEFT: string;
        /**
        * Specifies that no resizing is to occur.
        */
        static NONE: string;
        /**
        * Specifies that the text is to be treated as right-justified text, meaning
        * that the right side of the text field remains fixed and any resizing of a
        * single line is on the left side.
        */
        static RIGHT: string;
    }
}
/**
* The TextFieldType class is an enumeration of constant values used in setting the
* <code>type</code> property of the TextField class.
*
* @see away.entities.TextField#type
*/
declare module away.text {
    class TextFieldType {
        /**
        * Used to specify a <code>dynamic</code> TextField.
        */
        static DYNAMIC: string;
        /**
        * Used to specify an <code>input</code> TextField.
        */
        static INPUT: string;
    }
}
/**
* The TextFormat class represents character formatting information. Use the
* TextFormat class to create specific text formatting for text fields. You
* can apply text formatting to both static and dynamic text fields. The
* properties of the TextFormat class apply to device and embedded fonts.
* However, for embedded fonts, bold and italic text actually require specific
* fonts. If you want to display bold or italic text with an embedded font,
* you need to embed the bold and italic variations of that font.
*
* <p> You must use the constructor <code>new TextFormat()</code> to create a
* TextFormat object before setting its properties. When you apply a
* TextFormat object to a text field using the
* <code>TextField.defaultTextFormat</code> property or the
* <code>TextField.setTextFormat()</code> method, only its defined properties
* are applied. Use the <code>TextField.defaultTextFormat</code> property to
* apply formatting BEFORE you add text to the <code>TextField</code>, and the
* <code>setTextFormat()</code> method to add formatting AFTER you add text to
* the <code>TextField</code>. The TextFormat properties are <code>null</code>
* by default because if you don't provide values for the properties, Flash
* Player uses its own default formatting. The default formatting that Flash
* Player uses for each property(if property's value is <code>null</code>) is
* as follows:</p>
*
* <p>The default formatting for each property is also described in each
* property description.</p>
*/
declare module away.text {
    class TextFormat {
        /**
        * Indicates the alignment of the paragraph. Valid values are TextFormatAlign
        * constants.
        *
        * @default TextFormatAlign.LEFT
        * @throws ArgumentError The <code>align</code> specified is not a member of
        *                       flash.text.TextFormatAlign.
        */
        public align: string;
        /**
        * Indicates the block indentation in pixels. Block indentation is applied to
        * an entire block of text; that is, to all lines of the text. In contrast,
        * normal indentation(<code>TextFormat.indent</code>) affects only the first
        * line of each paragraph. If this property is <code>null</code>, the
        * TextFormat object does not specify block indentation(block indentation is
        * 0).
        */
        public blockIndent: number;
        /**
        * Specifies whether the text is boldface. The default value is
        * <code>null</code>, which means no boldface is used. If the value is
        * <code>true</code>, then the text is boldface.
        */
        public bold: boolean;
        /**
        * Indicates that the text is part of a bulleted list. In a bulleted list,
        * each paragraph of text is indented. To the left of the first line of each
        * paragraph, a bullet symbol is displayed. The default value is
        * <code>null</code>, which means no bulleted list is used.
        */
        public bullet: boolean;
        /**
        * Indicates the color of the text. A number containing three 8-bit RGB
        * components; for example, 0xFF0000 is red, and 0x00FF00 is green. The
        * default value is <code>null</code>, which means that Flash Player uses the
        * color black(0x000000).
        */
        public color: boolean;
        /**
        * The name of the font for text in this text format, as a string. The
        * default value is <code>null</code>, which means that Flash Player uses
        * Times New Roman font for the text.
        */
        public font: string;
        /**
        * Indicates the indentation from the left margin to the first character in
        * the paragraph. The default value is <code>null</code>, which indicates
        * that no indentation is used.
        */
        public indent: number;
        /**
        * Indicates whether text in this text format is italicized. The default
        * value is <code>null</code>, which means no italics are used.
        */
        public italic: boolean;
        /**
        * A Boolean value that indicates whether kerning is enabled
        * (<code>true</code>) or disabled(<code>false</code>). Kerning adjusts the
        * pixels between certain character pairs to improve readability, and should
        * be used only when necessary, such as with headings in large fonts. Kerning
        * is supported for embedded fonts only.
        *
        * <p>Certain fonts such as Verdana and monospaced fonts, such as Courier
        * New, do not support kerning.</p>
        *
        * <p>The default value is <code>null</code>, which means that kerning is not
        * enabled.</p>
        */
        public kerning: boolean;
        /**
        * An integer representing the amount of vertical space(called
        * <i>leading</i>) between lines. The default value is <code>null</code>,
        * which indicates that the amount of leading used is 0.
        */
        public leading: number;
        /**
        * The left margin of the paragraph, in pixels. The default value is
        * <code>null</code>, which indicates that the left margin is 0 pixels.
        */
        public leftMargin: number;
        /**
        * A number representing the amount of space that is uniformly distributed
        * between all characters. The value specifies the number of pixels that are
        * added to the advance after each character. The default value is
        * <code>null</code>, which means that 0 pixels of letter spacing is used.
        * You can use decimal values such as <code>1.75</code>.
        */
        public letterSpacing: number;
        /**
        * The right margin of the paragraph, in pixels. The default value is
        * <code>null</code>, which indicates that the right margin is 0 pixels.
        */
        public rightMargin: number;
        /**
        * The size in pixels of text in this text format. The default value is
        * <code>null</code>, which means that a size of 12 is used.
        */
        public size: number;
        /**
        * Specifies custom tab stops as an array of non-negative integers. Each tab
        * stop is specified in pixels. If custom tab stops are not specified
        * (<code>null</code>), the default tab stop is 4(average character width).
        */
        public tabStops: number[];
        /**
        * Indicates the target window where the hyperlink is displayed. If the
        * target window is an empty string, the text is displayed in the default
        * target window <code>_self</code>. You can choose a custom name or one of
        * the following four names: <code>_self</code> specifies the current frame
        * in the current window, <code>_blank</code> specifies a new window,
        * <code>_parent</code> specifies the parent of the current frame, and
        * <code>_top</code> specifies the top-level frame in the current window. If
        * the <code>TextFormat.url</code> property is an empty string or
        * <code>null</code>, you can get or set this property, but the property will
        * have no effect.
        */
        public target: string;
        /**
        * Indicates whether the text that uses this text format is underlined
        * (<code>true</code>) or not(<code>false</code>). This underlining is
        * similar to that produced by the <code><U></code> tag, but the latter is
        * not true underlining, because it does not skip descenders correctly. The
        * default value is <code>null</code>, which indicates that underlining is
        * not used.
        */
        public underline: boolean;
        /**
        * Indicates the target URL for the text in this text format. If the
        * <code>url</code> property is an empty string, the text does not have a
        * hyperlink. The default value is <code>null</code>, which indicates that
        * the text does not have a hyperlink.
        *
        * <p><b>Note:</b> The text with the assigned text format must be set with
        * the <code>htmlText</code> property for the hyperlink to work.</p>
        */
        public url: string;
        /**
        * Creates a TextFormat object with the specified properties. You can then
        * change the properties of the TextFormat object to change the formatting of
        * text fields.
        *
        * <p>Any parameter may be set to <code>null</code> to indicate that it is
        * not defined. All of the parameters are optional; any omitted parameters
        * are treated as <code>null</code>.</p>
        *
        * @param font        The name of a font for text as a string.
        * @param size        An integer that indicates the size in pixels.
        * @param color       The color of text using this text format. A number
        *                    containing three 8-bit RGB components; for example,
        *                    0xFF0000 is red, and 0x00FF00 is green.
        * @param bold        A Boolean value that indicates whether the text is
        *                    boldface.
        * @param italic      A Boolean value that indicates whether the text is
        *                    italicized.
        * @param underline   A Boolean value that indicates whether the text is
        *                    underlined.
        * @param url         The URL to which the text in this text format
        *                    hyperlinks. If <code>url</code> is an empty string, the
        *                    text does not have a hyperlink.
        * @param target      The target window where the hyperlink is displayed. If
        *                    the target window is an empty string, the text is
        *                    displayed in the default target window
        *                    <code>_self</code>. If the <code>url</code> parameter
        *                    is set to an empty string or to the value
        *                    <code>null</code>, you can get or set this property,
        *                    but the property will have no effect.
        * @param align       The alignment of the paragraph, as a TextFormatAlign
        *                    value.
        * @param leftMargin  Indicates the left margin of the paragraph, in pixels.
        * @param rightMargin Indicates the right margin of the paragraph, in pixels.
        * @param indent      An integer that indicates the indentation from the left
        *                    margin to the first character in the paragraph.
        * @param leading     A number that indicates the amount of leading vertical
        *                    space between lines.
        */
        constructor(font?: string, size?: number, color?: number, bold?: boolean, italic?: boolean, underline?: boolean, url?: string, target?: string, align?: string, leftMargin?: number, rightMargin?: number, indent?: number, leading?: number);
    }
}
/**
* The TextFormatAlign class provides values for text alignment in the
* TextFormat class.
*/
declare module away.text {
    class TextFormatAlign {
        /**
        * Constant; centers the text in the text field. Use the syntax
        * <code>TextFormatAlign.CENTER</code>.
        */
        public CENTER: string;
        /**
        * Constant; justifies text within the text field. Use the syntax
        * <code>TextFormatAlign.JUSTIFY</code>.
        */
        public JUSTIFY: string;
        /**
        * Constant; aligns text to the left within the text field. Use the syntax
        * <code>TextFormatAlign.LEFT</code>.
        */
        public LEFT: string;
        /**
        * Constant; aligns text to the right within the text field. Use the syntax
        * <code>TextFormatAlign.RIGHT</code>.
        */
        public RIGHT: string;
    }
}
/**
* A class that defines the Interactive mode of a text field object.
*
* @see away.entities.TextField#textInteractionMode
*/
declare module away.text {
    class TextInteractionMode {
        /**
        * The text field's default interaction mode is NORMAL and it varies across
        * platform. On Desktop, the normal mode implies that the text field is in
        * scrollable + selection mode. On Mobile platforms like Android, normal mode
        * implies that the text field can only be scrolled but the text can not be
        * selected.
        */
        static NORMAL: string;
        /**
        * On mobile platforms like Android, the text field starts in normal mode
        * (which implies scroll and non-selectable mode). The user can switch to
        * selection mode through the in-built context menu of the text field object.
        */
        static SELECTION: string;
    }
}
/**
* The TextLineMetrics class contains information about the text position and
* measurements of a line of text within a text field. All measurements are in
* pixels. Objects of this class are returned by the
* <code>away.entities.TextField.getLineMetrics()</code> method.
*/
declare module away.text {
    class TextLineMetrics {
        /**
        * The ascent value of the text is the length from the baseline to the top of
        * the line height in pixels.
        */
        public ascent: number;
        /**
        * The descent value of the text is the length from the baseline to the
        * bottom depth of the line in pixels.
        */
        public descent: number;
        /**
        * The height value of the text of the selected lines (not necessarily the
        * complete text) in pixels. The height of the text line does not include the
        * gutter height.
        */
        public height: number;
        /**
        * The leading value is the measurement of the vertical distance between the
        * lines of text.
        */
        public leading: number;
        /**
        * The width value is the width of the text of the selected lines (not
        * necessarily the complete text) in pixels. The width of the text line is
        * not the same as the width of the text field. The width of the text line is
        * relative to the text field width, minus the gutter width of 4 pixels
        * (2 pixels on each side).
        */
        public width: number;
        /**
        * The x value is the left position of the first character in pixels. This
        * value includes the margin, indent (if any), and gutter widths.
        */
        public x: number;
        /**
        * Creates a TextLineMetrics object. The TextLineMetrics object contains
        * information about the text metrics of a line of text in a text field.
        * Objects of this class are returned by the
        * away.entities.TextField.getLineMetrics() method.
        *
        * @param x           The left position of the first character in pixels.
        * @param width       The width of the text of the selected lines (not
        *                    necessarily the complete text) in pixels.
        * @param height      The height of the text of the selected lines (not
        *                    necessarily the complete text) in pixels.
        * @param ascent      The length from the baseline to the top of the line
        *                    height in pixels.
        * @param descent     The length from the baseline to the bottom depth of
        *                    the line in pixels.
        * @param leading     The measurement of the vertical distance between the
        *                    lines of text.
        */
        constructor(x?: number, width?: number, height?: number, ascent?: number, descent?: number, leading?: number);
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
/**
* The DisplayObjectContainer class is the base class for all objects that can
* serve as display object containers on the display list. The display list
* manages all objects displayed in the Flash runtimes. Use the
* DisplayObjectContainer class to arrange the display objects in the display
* list. Each DisplayObjectContainer object has its own child list for
* organizing the z-order of the objects. The z-order is the front-to-back
* order that determines which object is drawn in front, which is behind, and
* so on.
*
* <p>DisplayObject is an abstract base class; therefore, you cannot call
* DisplayObject directly. Invoking <code>new DisplayObject()</code> throws an
* <code>ArgumentError</code> exception.</p>
* The DisplayObjectContainer class is an abstract base class for all objects
* that can contain child objects. It cannot be instantiated directly; calling
* the <code>new DisplayObjectContainer()</code> constructor throws an
* <code>ArgumentError</code> exception.
*
* <p>For more information, see the "Display Programming" chapter of the
* <i>ActionScript 3.0 Developer's Guide</i>.</p>
*/
declare module away.containers {
    class DisplayObjectContainer extends base.DisplayObject implements library.IAsset {
        private _mouseChildren;
        private _children;
        public _iIsRoot: boolean;
        /**
        *
        */
        public assetType : string;
        /**
        * Determines whether or not the children of the object are mouse, or user
        * input device, enabled. If an object is enabled, a user can interact with
        * it by using a mouse or user input device. The default is
        * <code>true</code>.
        *
        * <p>This property is useful when you create a button with an instance of
        * the Sprite class(instead of using the SimpleButton class). When you use a
        * Sprite instance to create a button, you can choose to decorate the button
        * by using the <code>addChild()</code> method to add additional Sprite
        * instances. This process can cause unexpected behavior with mouse events
        * because the Sprite instances you add as children can become the target
        * object of a mouse event when you expect the parent instance to be the
        * target object. To ensure that the parent instance serves as the target
        * objects for mouse events, you can set the <code>mouseChildren</code>
        * property of the parent instance to <code>false</code>.</p>
        *
        * <p> No event is dispatched by setting this property. You must use the
        * <code>addEventListener()</code> method to create interactive
        * functionality.</p>
        */
        public mouseChildren : boolean;
        /**
        * Returns the number of children of this object.
        */
        public numChildren : number;
        /**
        * Determines whether the children of the object are tab enabled. Enables or
        * disables tabbing for the children of the object. The default is
        * <code>true</code>.
        *
        * <p><b>Note:</b> Do not use the <code>tabChildren</code> property with
        * Flex. Instead, use the
        * <code>mx.core.UIComponent.hasFocusableChildren</code> property.</p>
        *
        * @throws IllegalOperationError Calling this property of the Stage object
        *                               throws an exception. The Stage object does
        *                               not implement this property.
        */
        public tabChildren: boolean;
        /**
        * Calling the <code>new DisplayObjectContainer()</code> constructor throws
        * an <code>ArgumentError</code> exception. You <i>can</i>, however, call
        * constructors for the following subclasses of DisplayObjectContainer:
        * <ul>
        *   <li><code>new Loader()</code></li>
        *   <li><code>new Sprite()</code></li>
        *   <li><code>new MovieClip()</code></li>
        * </ul>
        */
        constructor();
        /**
        * Adds a child DisplayObject instance to this DisplayObjectContainer
        * instance. The child is added to the front(top) of all other children in
        * this DisplayObjectContainer instance.(To add a child to a specific index
        * position, use the <code>addChildAt()</code> method.)
        *
        * <p>If you add a child object that already has a different display object
        * container as a parent, the object is removed from the child list of the
        * other display object container. </p>
        *
        * <p><b>Note:</b> The command <code>stage.addChild()</code> can cause
        * problems with a published SWF file, including security problems and
        * conflicts with other loaded SWF files. There is only one Stage within a
        * Flash runtime instance, no matter how many SWF files you load into the
        * runtime. So, generally, objects should not be added to the Stage,
        * directly, at all. The only object the Stage should contain is the root
        * object. Create a DisplayObjectContainer to contain all of the items on the
        * display list. Then, if necessary, add that DisplayObjectContainer instance
        * to the Stage.</p>
        *
        * @param child The DisplayObject instance to add as a child of this
        *              DisplayObjectContainer instance.
        * @return The DisplayObject instance that you pass in the <code>child</code>
        *         parameter.
        * @throws ArgumentError Throws if the child is the same as the parent. Also
        *                       throws if the caller is a child(or grandchild etc.)
        *                       of the child being added.
        * @event added Dispatched when a display object is added to the display
        *              list.
        */
        public addChild(child: base.DisplayObject): base.DisplayObject;
        /**
        * Adds a child DisplayObject instance to this DisplayObjectContainer
        * instance. The child is added at the index position specified. An index of
        * 0 represents the back(bottom) of the display list for this
        * DisplayObjectContainer object.
        *
        * <p>For example, the following example shows three display objects, labeled
        * a, b, and c, at index positions 0, 2, and 1, respectively:</p>
        *
        * <p>If you add a child object that already has a different display object
        * container as a parent, the object is removed from the child list of the
        * other display object container. </p>
        *
        * @param child The DisplayObject instance to add as a child of this
        *              DisplayObjectContainer instance.
        * @param index The index position to which the child is added. If you
        *              specify a currently occupied index position, the child object
        *              that exists at that position and all higher positions are
        *              moved up one position in the child list.
        * @return The DisplayObject instance that you pass in the <code>child</code>
        *         parameter.
        * @throws ArgumentError Throws if the child is the same as the parent. Also
        *                       throws if the caller is a child(or grandchild etc.)
        *                       of the child being added.
        * @throws RangeError    Throws if the index position does not exist in the
        *                       child list.
        * @event added Dispatched when a display object is added to the display
        *              list.
        */
        public addChildAt(child: base.DisplayObject, index: number): base.DisplayObject;
        public addChildren(...childarray: base.DisplayObject[]): void;
        /**
        *
        */
        public clone(): base.DisplayObject;
        /**
        * Determines whether the specified display object is a child of the
        * DisplayObjectContainer instance or the instance itself. The search
        * includes the entire display list including this DisplayObjectContainer
        * instance. Grandchildren, great-grandchildren, and so on each return
        * <code>true</code>.
        *
        * @param child The child object to test.
        * @return <code>true</code> if the <code>child</code> object is a child of
        *         the DisplayObjectContainer or the container itself; otherwise
        *         <code>false</code>.
        */
        public contains(child: base.DisplayObject): boolean;
        /**
        *
        */
        public disposeWithChildren(): void;
        /**
        * Returns the child display object instance that exists at the specified
        * index.
        *
        * @param index The index position of the child object.
        * @return The child display object at the specified index position.
        * @throws RangeError    Throws if the index does not exist in the child
        *                       list.
        */
        public getChildAt(index: number): base.DisplayObject;
        /**
        * Returns the child display object that exists with the specified name. If
        * more that one child display object has the specified name, the method
        * returns the first object in the child list.
        *
        * <p>The <code>getChildAt()</code> method is faster than the
        * <code>getChildByName()</code> method. The <code>getChildAt()</code> method
        * accesses a child from a cached array, whereas the
        * <code>getChildByName()</code> method has to traverse a linked list to
        * access a child.</p>
        *
        * @param name The name of the child to return.
        * @return The child display object with the specified name.
        */
        public getChildByName(name: string): base.DisplayObject;
        /**
        * Returns the index position of a <code>child</code> DisplayObject instance.
        *
        * @param child The DisplayObject instance to identify.
        * @return The index position of the child display object to identify.
        * @throws ArgumentError Throws if the child parameter is not a child of this
        *                       object.
        */
        public getChildIndex(child: base.DisplayObject): number;
        /**
        * Returns an array of objects that lie under the specified point and are
        * children(or grandchildren, and so on) of this DisplayObjectContainer
        * instance. Any child objects that are inaccessible for security reasons are
        * omitted from the returned array. To determine whether this security
        * restriction affects the returned array, call the
        * <code>areInaccessibleObjectsUnderPoint()</code> method.
        *
        * <p>The <code>point</code> parameter is in the coordinate space of the
        * Stage, which may differ from the coordinate space of the display object
        * container(unless the display object container is the Stage). You can use
        * the <code>globalToLocal()</code> and the <code>localToGlobal()</code>
        * methods to convert points between these coordinate spaces.</p>
        *
        * @param point The point under which to look.
        * @return An array of objects that lie under the specified point and are
        *         children(or grandchildren, and so on) of this
        *         DisplayObjectContainer instance.
        */
        public getObjectsUnderPoint(point: geom.Point): base.DisplayObject[];
        /**
        * Removes the specified <code>child</code> DisplayObject instance from the
        * child list of the DisplayObjectContainer instance. The <code>parent</code>
        * property of the removed child is set to <code>null</code> , and the object
        * is garbage collected if no other references to the child exist. The index
        * positions of any display objects above the child in the
        * DisplayObjectContainer are decreased by 1.
        *
        * <p>The garbage collector reallocates unused memory space. When a variable
        * or object is no longer actively referenced or stored somewhere, the
        * garbage collector sweeps through and wipes out the memory space it used to
        * occupy if no other references to it exist.</p>
        *
        * @param child The DisplayObject instance to remove.
        * @return The DisplayObject instance that you pass in the <code>child</code>
        *         parameter.
        * @throws ArgumentError Throws if the child parameter is not a child of this
        *                       object.
        */
        public removeChild(child: base.DisplayObject): base.DisplayObject;
        /**
        * Removes a child DisplayObject from the specified <code>index</code>
        * position in the child list of the DisplayObjectContainer. The
        * <code>parent</code> property of the removed child is set to
        * <code>null</code>, and the object is garbage collected if no other
        * references to the child exist. The index positions of any display objects
        * above the child in the DisplayObjectContainer are decreased by 1.
        *
        * <p>The garbage collector reallocates unused memory space. When a variable
        * or object is no longer actively referenced or stored somewhere, the
        * garbage collector sweeps through and wipes out the memory space it used to
        * occupy if no other references to it exist.</p>
        *
        * @param index The child index of the DisplayObject to remove.
        * @return The DisplayObject instance that was removed.
        * @throws RangeError    Throws if the index does not exist in the child
        *                       list.
        * @throws SecurityError This child display object belongs to a sandbox to
        *                       which the calling object does not have access. You
        *                       can avoid this situation by having the child movie
        *                       call the <code>Security.allowDomain()</code> method.
        */
        public removeChildAt(index: number): base.DisplayObject;
        /**
        * Removes all <code>child</code> DisplayObject instances from the child list
        * of the DisplayObjectContainer instance. The <code>parent</code> property
        * of the removed children is set to <code>null</code>, and the objects are
        * garbage collected if no other references to the children exist.
        *
        * The garbage collector reallocates unused memory space. When a variable or
        * object is no longer actively referenced or stored somewhere, the garbage
        * collector sweeps through and wipes out the memory space it used to occupy
        * if no other references to it exist.
        *
        * @param beginIndex The beginning position. A value smaller than 0 throws a RangeError.
        * @param endIndex The ending position. A value smaller than 0 throws a RangeError.
        * @throws RangeError    Throws if the beginIndex or endIndex positions do
        *                       not exist in the child list.
        */
        public removeChildren(beginIndex?: number, endIndex?: number): void;
        /**
        * Changes the position of an existing child in the display object container.
        * This affects the layering of child objects. For example, the following
        * example shows three display objects, labeled a, b, and c, at index
        * positions 0, 1, and 2, respectively:
        *
        * <p>When you use the <code>setChildIndex()</code> method and specify an
        * index position that is already occupied, the only positions that change
        * are those in between the display object's former and new position. All
        * others will stay the same. If a child is moved to an index LOWER than its
        * current index, all children in between will INCREASE by 1 for their index
        * reference. If a child is moved to an index HIGHER than its current index,
        * all children in between will DECREASE by 1 for their index reference. For
        * example, if the display object container in the previous example is named
        * <code>container</code>, you can swap the position of the display objects
        * labeled a and b by calling the following code:</p>
        *
        * <p>This code results in the following arrangement of objects:</p>
        *
        * @param child The child DisplayObject instance for which you want to change
        *              the index number.
        * @param index The resulting index number for the <code>child</code> display
        *              object.
        * @throws ArgumentError Throws if the child parameter is not a child of this
        *                       object.
        * @throws RangeError    Throws if the index does not exist in the child
        *                       list.
        */
        public setChildIndex(child: base.DisplayObject, index: number): void;
        /**
        * Swaps the z-order (front-to-back order) of the two specified child
        * objects. All other child objects in the display object container remain in
        * the same index positions.
        *
        * @param child1 The first child object.
        * @param child2 The second child object.
        * @throws ArgumentError Throws if either child parameter is not a child of
        *                       this object.
        */
        public swapChildren(child1: base.DisplayObject, child2: base.DisplayObject): void;
        /**
        * Swaps the z-order(front-to-back order) of the child objects at the two
        * specified index positions in the child list. All other child objects in
        * the display object container remain in the same index positions.
        *
        * @param index1 The index position of the first child object.
        * @param index2 The index position of the second child object.
        * @throws RangeError If either index does not exist in the child list.
        */
        public swapChildrenAt(index1: number, index2: number): void;
        /**
        * @protected
        */
        public pInvalidateSceneTransform(): void;
        /**
        * @protected
        */
        public _pUpdateScene(value: Scene): void;
        /**
        * @protected
        */
        public _pUpdateImplicitMouseEnabled(value: boolean): void;
        /**
        * @protected
        */
        public _pUpdateImplicitVisibility(value: boolean): void;
        /**
        * @protected
        */
        public _pUpdateImplicitPartition(value: partition.Partition): void;
        /**
        * @private
        *
        * @param child
        */
        private removeChildInternal(child);
    }
}
declare module away.base {
    class LightBase extends containers.DisplayObjectContainer {
        private _color;
        private _colorR;
        private _colorG;
        private _colorB;
        private _ambientColor;
        private _ambient;
        public _iAmbientR: number;
        public _iAmbientG: number;
        public _iAmbientB: number;
        private _specular;
        public _iSpecularR: number;
        public _iSpecularG: number;
        public _iSpecularB: number;
        private _diffuse;
        public _iDiffuseR: number;
        public _iDiffuseG: number;
        public _iDiffuseB: number;
        private _castsShadows;
        private _shadowMapper;
        constructor();
        public castsShadows : boolean;
        public pCreateShadowMapper(): materials.ShadowMapperBase;
        public specular : number;
        public diffuse : number;
        public color : number;
        public ambient : number;
        public ambientColor : number;
        private updateAmbient();
        public iGetObjectProjectionMatrix(entity: entities.IEntity, camera: entities.Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public assetType : string;
        private updateSpecular();
        private updateDiffuse();
        public shadowMapper : materials.ShadowMapperBase;
    }
}
declare module away.projections {
    /**
    * Provides constant values for camera lens projection options use the the <code>coordinateSystem</code> property
    *
    * @see away.projections.PerspectiveLens#coordinateSystem
    */
    class CoordinateSystem {
        /**
        * Default option, projects to a left-handed coordinate system
        */
        static LEFT_HANDED: string;
        /**
        * Projects to a right-handed coordinate system
        */
        static RIGHT_HANDED: string;
    }
}
/**
* @module away.base
*/
declare module away.projections {
    /**
    * IMaterialOwner provides an interface for objects that can use materials.
    *
    * @interface away.base.IMaterialOwner
    */
    interface IProjection extends events.IEventDispatcher {
        coordinateSystem: string;
        frustumCorners: number[];
        matrix: geom.Matrix3D;
        near: number;
        originX: number;
        originY: number;
        far: number;
        _iAspectRatio: number;
        project(point3d: geom.Vector3D): geom.Vector3D;
        unproject(nX: number, nY: number, sZ: number): geom.Vector3D;
        _iUpdateScissorRect(x: number, y: number, width: number, height: number): any;
        _iUpdateViewport(x: number, y: number, width: number, height: number): any;
    }
}
declare module away.projections {
    class ProjectionBase extends events.EventDispatcher implements IProjection {
        public _pMatrix: geom.Matrix3D;
        public _pScissorRect: geom.Rectangle;
        public _pViewPort: geom.Rectangle;
        public _pNear: number;
        public _pFar: number;
        public _pAspectRatio: number;
        public _pMatrixInvalid: boolean;
        public _pFrustumCorners: number[];
        public _pCoordinateSystem: string;
        public _pOriginX: number;
        public _pOriginY: number;
        private _unprojection;
        private _unprojectionInvalid;
        constructor(coordinateSystem?: string);
        /**
        * The handedness of the coordinate system projection. The default is LEFT_HANDED.
        */
        public coordinateSystem : string;
        public frustumCorners : number[];
        public matrix : geom.Matrix3D;
        public near : number;
        public originX : number;
        public originY : number;
        public far : number;
        public project(point3d: geom.Vector3D): geom.Vector3D;
        public unprojectionMatrix : geom.Matrix3D;
        public unproject(nX: number, nY: number, sZ: number): geom.Vector3D;
        public clone(): ProjectionBase;
        public _iAspectRatio : number;
        public pInvalidateMatrix(): void;
        public pUpdateMatrix(): void;
        public _iUpdateScissorRect(x: number, y: number, width: number, height: number): void;
        public _iUpdateViewport(x: number, y: number, width: number, height: number): void;
    }
}
declare module away.projections {
    class PerspectiveProjection extends ProjectionBase {
        private _fieldOfView;
        private _focalLength;
        private _hFieldOfView;
        private _hFocalLength;
        private _preserveAspectRatio;
        private _preserveFocalLength;
        constructor(fieldOfView?: number, coordinateSystem?: string);
        /**
        *
        */
        public preserveAspectRatio : boolean;
        /**
        *
        */
        public preserveFocalLength : boolean;
        /**
        *
        */
        public fieldOfView : number;
        /**
        *
        */
        public focalLength : number;
        /**
        *
        */
        public hFieldOfView : number;
        /**
        *
        */
        public hFocalLength : number;
        public unproject(nX: number, nY: number, sZ: number): geom.Vector3D;
        public clone(): ProjectionBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.projections {
    class FreeMatrixProjection extends ProjectionBase {
        constructor();
        public near : number;
        public far : number;
        public iAspectRatio : number;
        public clone(): ProjectionBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.projections {
    class OrthographicProjection extends ProjectionBase {
        private _projectionHeight;
        private _xMax;
        private _yMax;
        constructor(projectionHeight?: number);
        public projectionHeight : number;
        public unproject(nX: number, nY: number, sZ: number): geom.Vector3D;
        public clone(): ProjectionBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.projections {
    class OrthographicOffCenterProjection extends ProjectionBase {
        private _minX;
        private _maxX;
        private _minY;
        private _maxY;
        constructor(minX: number, maxX: number, minY: number, maxY: number);
        public minX : number;
        public maxX : number;
        public minY : number;
        public maxY : number;
        public unproject(nX: number, nY: number, sZ: number): geom.Vector3D;
        public clone(): ProjectionBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.projections {
    class ObliqueNearPlaneProjection extends ProjectionBase {
        private _baseProjection;
        private _plane;
        private _onProjectionMatrixChangedDelegate;
        constructor(baseProjection: IProjection, plane: geom.Plane3D);
        public frustumCorners : number[];
        public near : number;
        public far : number;
        public iAspectRatio : number;
        public plane : geom.Plane3D;
        public baseProjection : IProjection;
        private onProjectionMatrixChanged(event);
        public pUpdateMatrix(): void;
    }
}
declare module away.entities {
    class Camera extends containers.DisplayObjectContainer implements IEntity {
        private _viewProjection;
        private _viewProjectionDirty;
        private _projection;
        private _frustumPlanes;
        private _frustumPlanesDirty;
        private _onProjectionMatrixChangedDelegate;
        constructor(projection?: projections.IProjection);
        public pCreateDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public assetType : string;
        private onProjectionMatrixChanged(event);
        public frustumPlanes : geom.Plane3D[];
        private updateFrustum();
        /**
        * @protected
        */
        public pInvalidateSceneTransform(): void;
        /**
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        *
        */
        public projection : projections.IProjection;
        /**
        *
        */
        public viewProjection : geom.Matrix3D;
        /**
        * Calculates the ray in scene space from the camera to the given normalized coordinates in screen space.
        *
        * @param nX The normalised x coordinate in screen space, -1 corresponds to the left edge of the viewport, 1 to the right.
        * @param nY The normalised y coordinate in screen space, -1 corresponds to the top edge of the viewport, 1 to the bottom.
        * @param sZ The z coordinate in screen space, representing the distance into the screen.
        * @return The ray from the camera to the scene space position of the given screen coordinates.
        */
        public getRay(nX: number, nY: number, sZ: number): geom.Vector3D;
        /**
        * Calculates the normalised position in screen space of the given scene position.
        *
        * @param point3d the position vector of the scene coordinates to be projected.
        * @return The normalised screen position of the given scene coordinates.
        */
        public project(point3d: geom.Vector3D): geom.Vector3D;
        /**
        * Calculates the scene position of the given normalized coordinates in screen space.
        *
        * @param nX The normalised x coordinate in screen space, minus the originX offset of the projection property.
        * @param nY The normalised y coordinate in screen space, minus the originY offset of the projection property.
        * @param sZ The z coordinate in screen space, representing the distance into the screen.
        * @return The scene position of the given screen coordinates.
        */
        public unproject(nX: number, nY: number, sZ: number): geom.Vector3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
    }
}
declare module away.materials {
    class ShadowMapperBase {
        public _pCasterCollector: traverse.ShadowCasterCollector;
        private _depthMap;
        public _pDepthMapSize: number;
        public _pLight: base.LightBase;
        private _explicitDepthMap;
        private _autoUpdateShadows;
        public _iShadowsInvalid: boolean;
        constructor();
        public pCreateCasterCollector(): traverse.ShadowCasterCollector;
        public autoUpdateShadows : boolean;
        public updateShadows(): void;
        public iSetDepthMap(depthMap: textures.TextureProxyBase): void;
        public light : base.LightBase;
        public depthMap : textures.TextureProxyBase;
        public depthMapSize : number;
        public dispose(): void;
        public pCreateDepthTexture(): textures.TextureProxyBase;
        public iRenderDepthMap(stage: base.Stage, entityCollector: traverse.EntityCollector, renderer: render.IRenderer): void;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        public pDrawDepthMap(target: textures.TextureProxyBase, scene: containers.Scene, renderer: render.IRenderer): void;
        public _pSetDepthMapSize(value: any): void;
    }
}
declare module away.materials {
    class CubeMapShadowMapper extends ShadowMapperBase {
        private _depthCameras;
        private _projections;
        private _needsRender;
        constructor();
        private initCameras();
        private addCamera(rotationX, rotationY, rotationZ);
        public pCreateDepthTexture(): textures.TextureProxyBase;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        public pDrawDepthMap(target: textures.RenderTexture, scene: containers.Scene, renderer: render.IRenderer): void;
    }
}
declare module away.materials {
    class DirectionalShadowMapper extends ShadowMapperBase {
        public _pOverallDepthCamera: entities.Camera;
        public _pLocalFrustum: number[];
        public _pLightOffset: number;
        public _pMatrix: geom.Matrix3D;
        public _pOverallDepthProjection: projections.FreeMatrixProjection;
        public _pSnap: number;
        public _pCullPlanes: geom.Plane3D[];
        public _pMinZ: number;
        public _pMaxZ: number;
        constructor();
        public snap : number;
        public lightOffset : number;
        public iDepthProjection : geom.Matrix3D;
        public depth : number;
        public pDrawDepthMap(target: textures.TextureProxyBase, scene: containers.Scene, renderer: render.IRenderer): void;
        public pUpdateCullPlanes(viewCamera: entities.Camera): void;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        public pUpdateProjectionFromFrustumCorners(viewCamera: entities.Camera, corners: number[], matrix: geom.Matrix3D): void;
    }
}
declare module away.materials {
    class CascadeShadowMapper extends DirectionalShadowMapper implements events.IEventDispatcher {
        public _pScissorRects: geom.Rectangle[];
        private _pScissorRectsInvalid;
        private _splitRatios;
        private _numCascades;
        private _depthCameras;
        private _depthLenses;
        private _texOffsetsX;
        private _texOffsetsY;
        private _changeDispatcher;
        private _nearPlaneDistances;
        constructor(numCascades?: number);
        public getSplitRatio(index: number): number;
        public setSplitRatio(index: number, value: number): void;
        public getDepthProjections(partition: number): geom.Matrix3D;
        private init();
        public _pSetDepthMapSize(value: number): void;
        private invalidateScissorRects();
        public numCascades : number;
        public pDrawDepthMap(target: textures.RenderTexture, scene: containers.Scene, renderer: render.IRenderer): void;
        private updateScissorRects();
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        private updateProjectionPartition(matrix, splitRatio, texOffsetX, texOffsetY);
        public addEventListener(type: string, listener: Function): void;
        public removeEventListener(type: string, listener: Function): void;
        public dispatchEvent(event: events.Event): void;
        public hasEventListener(type: string): boolean;
        public _iNearPlaneDistances : number[];
    }
}
declare module away.materials {
    class NearDirectionalShadowMapper extends DirectionalShadowMapper {
        private _coverageRatio;
        constructor(coverageRatio?: number);
        /**
        * A value between 0 and 1 to indicate the ratio of the view frustum that needs to be covered by the shadow map.
        */
        public coverageRatio : number;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
    }
}
declare module away.entities {
    interface IEntity extends library.IAsset {
        x: number;
        y: number;
        z: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        scaleX: number;
        scaleY: number;
        scaleZ: number;
        /**
        *
        */
        bounds: bounds.BoundingVolumeBase;
        /**
        *
        */
        castsShadows: boolean;
        /**
        *
        */
        inverseSceneTransform: geom.Matrix3D;
        /**
        *
        */
        partitionNode: partition.EntityNode;
        /**
        *
        */
        pickingCollider: pick.IPickingCollider;
        /**
        *
        */
        transform: geom.Transform;
        /**
        *
        */
        scene: containers.Scene;
        /**
        *
        */
        scenePosition: geom.Vector3D;
        /**
        *
        */
        sceneTransform: geom.Matrix3D;
        /**
        *
        */
        worldBounds: bounds.BoundingVolumeBase;
        /**
        *
        */
        zOffset: number;
        /**
        *
        */
        isIntersectingRay(rayPosition: geom.Vector3D, rayDirection: geom.Vector3D): boolean;
        /**
        *
        *
        * @param target
        * @param upAxis
        */
        lookAt(target: geom.Vector3D, upAxis?: geom.Vector3D): any;
        /**
        * @internal
        */
        _iPickingCollisionVO: pick.PickingCollisionVO;
        /**
        * @internal
        */
        _iController: controllers.ControllerBase;
        /**
        * @internal
        */
        _iAssignedPartition: partition.Partition;
        /**
        * //TODO
        *
        * @param shortestCollisionDistance
        * @param findClosest
        * @returns {boolean}
        *
        * @internal
        */
        _iTestCollision(shortestCollisionDistance: number, findClosest: boolean): boolean;
        /**
        * @internal
        */
        _iIsMouseEnabled(): boolean;
        /**
        * @internal
        */
        _iIsVisible(): boolean;
        _iInternalUpdate(): any;
        /**
        * The transformation matrix that transforms from model to world space, adapted with any special operations needed to render.
        * For example, assuring certain alignedness which is not inherent in the scene transform. By default, this would
        * return the scene transform.
        */
        getRenderSceneTransform(camera: Camera): geom.Matrix3D;
        /**
        *
        * @param renderer
        * @private
        */
        _iCollectRenderables(renderer: render.IRenderer): any;
    }
}
/**
* The Billboard class represents display objects that represent bitmap images.
* These can be images that you load with the <code>flash.Assets</code> or
* <code>flash.display.Loader</code> classes, or they can be images that you
* create with the <code>Billboard()</code> constructor.
*
* <p>The <code>Billboard()</code> constructor allows you to create a Billboard
* object that contains a reference to a BitmapData object. After you create a
* Billboard object, use the <code>addChild()</code> or <code>addChildAt()</code>
* method of the parent DisplayObjectContainer instance to place the bitmap on
* the display list.</p>
*
* <p>A Billboard object can share its BitmapData reference among several Billboard
* objects, independent of translation or rotation properties. Because you can
* create multiple Billboard objects that reference the same BitmapData object,
* multiple display objects can use the same complex BitmapData object without
* incurring the memory overhead of a BitmapData object for each display
* object instance.</p>
*
* <p>A BitmapData object can be drawn to the screen by a Billboard object in one
* of two ways: by using the default hardware renderer with a single hardware surface,
* or by using the slower software renderer when 3D acceleration is not available.</p>
*
* <p>If you would prefer to perform a batch rendering command, rather than using a
* single surface for each Billboard object, you can also draw to the screen using the
* <code>drawTiles()</code> or <code>drawTriangles()</code> methods which are
* available to <code>flash.display.Tilesheet</code> and <code>flash.display.Graphics
* objects.</code></p>
*
* <p><b>Note:</b> The Billboard class is not a subclass of the InteractiveObject
* class, so it cannot dispatch mouse events. However, you can use the
* <code>addEventListener()</code> method of the display object container that
* contains the Billboard object.</p>
*/
declare module away.entities {
    class Billboard extends base.DisplayObject implements IEntity, base.IMaterialOwner {
        private _animator;
        private _billboardWidth;
        private _billboardHeight;
        private _material;
        private _uvTransform;
        private onSizeChangedDelegate;
        /**
        * Defines the animator of the mesh. Act on the mesh's geometry. Defaults to null
        */
        public animator : animators.IAnimator;
        /**
        *
        */
        public assetType : string;
        /**
        * The BitmapData object being referenced.
        */
        public bitmapData: base.BitmapData;
        /**
        *
        */
        public billboardHeight : number;
        /**
        *
        */
        public billboardWidth : number;
        /**
        *
        */
        public material : materials.MaterialBase;
        /**
        * Controls whether or not the Billboard object is snapped to the nearest pixel.
        * This value is ignored in the native and HTML5 targets.
        * The PixelSnapping class includes possible values:
        * <ul>
        *   <li><code>PixelSnapping.NEVER</code> - No pixel snapping occurs.</li>
        *   <li><code>PixelSnapping.ALWAYS</code> - The image is always snapped to
        * the nearest pixel, independent of transformation.</li>
        *   <li><code>PixelSnapping.AUTO</code> - The image is snapped to the
        * nearest pixel if it is drawn with no rotation or skew and it is drawn at a
        * scale factor of 99.9% to 100.1%. If these conditions are satisfied, the
        * bitmap image is drawn at 100% scale, snapped to the nearest pixel.
        * When targeting Flash Player, this value allows the image to be drawn as fast
        * as possible using the internal vector renderer.</li>
        * </ul>
        */
        public pixelSnapping: string;
        /**
        * Controls whether or not the bitmap is smoothed when scaled. If
        * <code>true</code>, the bitmap is smoothed when scaled. If
        * <code>false</code>, the bitmap is not smoothed when scaled.
        */
        public smoothing: boolean;
        /**
        *
        */
        public uvTransform : geom.UVTransform;
        constructor(material: materials.MaterialBase, pixelSnapping?: string, smoothing?: boolean);
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        /**
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        * //TODO
        *
        * @param shortestCollisionDistance
        * @param findClosest
        * @returns {boolean}
        *
        * @internal
        */
        public _iTestCollision(shortestCollisionDistance: number, findClosest: boolean): boolean;
        /**
        * @private
        */
        private onSizeChanged(event);
        public _iCollectRenderables(renderer: render.IRenderer): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
    }
}
declare module away.entities {
    class DirectionalLight extends base.LightBase implements IEntity {
        private _direction;
        private _tmpLookAt;
        private _sceneDirection;
        private _projAABBPoints;
        constructor(xDir?: number, yDir?: number, zDir?: number);
        public sceneDirection : geom.Vector3D;
        public direction : geom.Vector3D;
        /**
        *
        * @returns {away.bounds.NullBounds}
        */
        public pCreateDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        /**
        *
        */
        public pUpdateBounds(): void;
        public pUpdateSceneTransform(): void;
        public pCreateShadowMapper(): materials.DirectionalShadowMapper;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public iGetObjectProjectionMatrix(entity: IEntity, camera: Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
    }
}
declare module away.entities {
    class LightProbe extends base.LightBase implements IEntity {
        private _diffuseMap;
        private _specularMap;
        constructor(diffuseMap: textures.CubeTextureBase, specularMap?: textures.CubeTextureBase);
        public diffuseMap : textures.CubeTextureBase;
        public specularMap : textures.CubeTextureBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public pUpdateBounds(): void;
        public pCreateDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(entity: IEntity, camera: Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
    }
}
declare module away.entities {
    /**
    * A Line Segment primitive.
    */
    class LineSegment extends base.DisplayObject implements IEntity, base.IMaterialOwner {
        private _animator;
        private _material;
        private _uvTransform;
        private onSizeChangedDelegate;
        public _startPosition: geom.Vector3D;
        public _endPosition: geom.Vector3D;
        public _halfThickness: number;
        /**
        * Defines the animator of the line segment. Act on the line segment's geometry. Defaults to null
        */
        public animator : animators.IAnimator;
        /**
        *
        */
        public assetType : string;
        /**
        *
        */
        public startPostion : geom.Vector3D;
        public startPosition : geom.Vector3D;
        /**
        *
        */
        public endPosition : geom.Vector3D;
        /**
        *
        */
        public material : materials.MaterialBase;
        /**
        *
        */
        public thickness : number;
        /**
        *
        */
        public uvTransform : geom.UVTransform;
        /**
        * Create a line segment
        *
        * @param startPosition Start position of the line segment
        * @param endPosition Ending position of the line segment
        * @param thickness Thickness of the line
        */
        constructor(material: materials.MaterialBase, startPosition: geom.Vector3D, endPosition: geom.Vector3D, thickness?: number);
        public dispose(): void;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        /**
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        * @private
        */
        private onSizeChanged(event);
        /**
        * @private
        */
        private notifyRenderableUpdate();
        public _iCollectRenderables(renderer: render.IRenderer): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
    }
}
declare module away.entities {
    /**
    * Mesh is an instance of a Geometry, augmenting it with a presence in the scene graph, a material, and an animation
    * state. It consists out of SubMeshes, which in turn correspond to SubGeometries. SubMeshes allow different parts
    * of the geometry to be assigned different materials.
    */
    class Mesh extends containers.DisplayObjectContainer implements IEntity {
        private _uvTransform;
        private _subMeshes;
        private _geometry;
        private _material;
        private _animator;
        private _castsShadows;
        private _shareAnimationGeometry;
        private _onGeometryBoundsInvalidDelegate;
        private _onSubGeometryAddedDelegate;
        private _onSubGeometryRemovedDelegate;
        /**
        * Defines the animator of the mesh. Act on the mesh's geometry.  Default value is <code>null</code>.
        */
        public animator : animators.IAnimator;
        /**
        *
        */
        public assetType : string;
        /**
        * Indicates whether or not the Mesh can cast shadows. Default value is <code>true</code>.
        */
        public castsShadows : boolean;
        /**
        * The geometry used by the mesh that provides it with its shape.
        */
        public geometry : base.Geometry;
        /**
        * The material with which to render the Mesh.
        */
        public material : materials.MaterialBase;
        /**
        * Indicates whether or not the mesh share the same animation geometry.
        */
        public shareAnimationGeometry : boolean;
        /**
        * The SubMeshes out of which the Mesh consists. Every SubMesh can be assigned a material to override the Mesh's
        * material.
        */
        public subMeshes : base.ISubMesh[];
        /**
        *
        */
        public uvTransform : geom.UVTransform;
        /**
        * Create a new Mesh object.
        *
        * @param geometry                    The geometry used by the mesh that provides it with its shape.
        * @param material    [optional]        The material with which to render the Mesh.
        */
        constructor(geometry: base.Geometry, material?: materials.MaterialBase);
        /**
        *
        */
        public bakeTransformations(): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * Disposes mesh including the animator and children. This is a merely a convenience method.
        * @return
        */
        public disposeWithAnimatorAndChildren(): void;
        /**
        * Clones this Mesh instance along with all it's children, while re-using the same
        * material, geometry and animation set. The returned result will be a copy of this mesh,
        * containing copies of all of it's children.
        *
        * Properties that are re-used (i.e. not cloned) by the new copy include name,
        * geometry, and material. Properties that are cloned or created anew for the copy
        * include subMeshes, children of the mesh, and the animator.
        *
        * If you want to copy just the mesh, reusing it's geometry and material while not
        * cloning it's children, the simplest way is to create a new mesh manually:
        *
        * <code>
        * var clone : Mesh = new Mesh(original.geometry, original.material);
        * </code>
        */
        public clone(): base.DisplayObject;
        /**
        * //TODO
        *
        * @param subGeometry
        * @returns {SubMeshBase}
        */
        public getSubMeshFromSubGeometry(subGeometry: base.TriangleSubGeometry): base.ISubMesh;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        /**
        * //TODO
        *
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        * //TODO
        *
        * @private
        */
        private onGeometryBoundsInvalid(event);
        /**
        * Called when a SubGeometry was added to the Geometry.
        *
        * @private
        */
        private onSubGeometryAdded(event);
        /**
        * Called when a SubGeometry was removed from the Geometry.
        *
        * @private
        */
        private onSubGeometryRemoved(event);
        /**
        * Adds a SubMeshBase wrapping a SubGeometry.
        *
        * @param subGeometry
        */
        private addSubMesh(subGeometry);
        /**
        * //TODO
        *
        * @param shortestCollisionDistance
        * @param findClosest
        * @returns {boolean}
        *
        * @internal
        */
        public _iTestCollision(shortestCollisionDistance: number, findClosest: boolean): boolean;
        /**
        *
        * @param renderer
        *
        * @internal
        */
        public _iCollectRenderables(renderer: render.IRenderer): void;
        public _iInvalidateRenderableGeometries(): void;
    }
}
declare module away.entities {
    class PointLight extends base.LightBase implements IEntity {
        public _pRadius: number;
        public _pFallOff: number;
        public _pFallOffFactor: number;
        constructor();
        public pCreateShadowMapper(): materials.CubeMapShadowMapper;
        public radius : number;
        public iFallOffFactor(): number;
        public fallOff : number;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public pUpdateBounds(): void;
        public pCreateDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(entity: IEntity, camera: Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
    }
}
/**
* This class is used to create lightweight shapes using the ActionScript
* drawing application program interface(API). The Shape class includes a
* <code>graphics</code> property, which lets you access methods from the
* Graphics class.
*
* <p>The Sprite class also includes a <code>graphics</code>property, and it
* includes other features not available to the Shape class. For example, a
* Sprite object is a display object container, whereas a Shape object is not
* (and cannot contain child display objects). For this reason, Shape objects
* consume less memory than Sprite objects that contain the same graphics.
* However, a Sprite object supports user input events, while a Shape object
* does not.</p>
*/
declare module away.entities {
    class Shape extends base.DisplayObject {
        private _graphics;
        /**
        * Specifies the Graphics object belonging to this Shape object, where vector
        * drawing commands can occur.
        */
        public graphics : base.Graphics;
        /**
        * Creates a new Shape object.
        */
        constructor();
    }
}
declare module away.entities {
    /**
    * A Skybox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
    * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
    * the sky box is always as large as possible without being clipped.
    */
    class Skybox extends base.DisplayObject implements IEntity, base.IMaterialOwner {
        private _uvTransform;
        private _material;
        private _animator;
        public animator : animators.IAnimator;
        /**
        *
        */
        public uvTransform : geom.UVTransform;
        /**
        * Create a new Skybox object.
        *
        * @param material	The material with which to render the Skybox.
        */
        constructor(material: materials.MaterialBase);
        /**
        * The material with which to render the Skybox.
        */
        public material : materials.MaterialBase;
        public assetType : string;
        /**
        * @protected
        */
        public pInvalidateBounds(): void;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.SkyboxNode;
        /**
        * @protected
        */
        public pCreateDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        /**
        * @protected
        */
        public pUpdateBounds(): void;
        public castsShadows : boolean;
        public _iCollectRenderables(renderer: render.IRenderer): void;
        public _iCollectRenderable(renderer: render.IRenderer): void;
    }
}
/**
* The TextField class is used to create display objects for text display and
* input. <ph outputclass="flexonly">You can use the TextField class to
* perform low-level text rendering. However, in Flex, you typically use the
* Label, Text, TextArea, and TextInput controls to process text. <ph
* outputclass="flashonly">You can give a text field an instance name in the
* Property inspector and use the methods and properties of the TextField
* class to manipulate it with ActionScript. TextField instance names are
* displayed in the Movie Explorer and in the Insert Target Path dialog box in
* the Actions panel.
*
* <p>To create a text field dynamically, use the <code>TextField()</code>
* constructor.</p>
*
* <p>The methods of the TextField class let you set, select, and manipulate
* text in a dynamic or input text field that you create during authoring or
* at runtime. </p>
*
* <p>ActionScript provides several ways to format your text at runtime. The
* TextFormat class lets you set character and paragraph formatting for
* TextField objects. You can apply Cascading Style Sheets(CSS) styles to
* text fields by using the <code>TextField.styleSheet</code> property and the
* StyleSheet class. You can use CSS to style built-in HTML tags, define new
* formatting tags, or apply styles. You can assign HTML formatted text, which
* optionally uses CSS styles, directly to a text field. HTML text that you
* assign to a text field can contain embedded media(movie clips, SWF files,
* GIF files, PNG files, and JPEG files). The text wraps around the embedded
* media in the same way that a web browser wraps text around media embedded
* in an HTML document. </p>
*
* <p>Flash Player supports a subset of HTML tags that you can use to format
* text. See the list of supported HTML tags in the description of the
* <code>htmlText</code> property.</p>
*
* @event change                    Dispatched after a control value is
*                                  modified, unlike the
*                                  <code>textInput</code> event, which is
*                                  dispatched before the value is modified.
*                                  Unlike the W3C DOM Event Model version of
*                                  the <code>change</code> event, which
*                                  dispatches the event only after the
*                                  control loses focus, the ActionScript 3.0
*                                  version of the <code>change</code> event
*                                  is dispatched any time the control
*                                  changes. For example, if a user types text
*                                  into a text field, a <code>change</code>
*                                  event is dispatched after every keystroke.
* @event link                      Dispatched when a user clicks a hyperlink
*                                  in an HTML-enabled text field, where the
*                                  URL begins with "event:". The remainder of
*                                  the URL after "event:" is placed in the
*                                  text property of the LINK event.
*
*                                  <p><b>Note:</b> The default behavior,
*                                  adding the text to the text field, occurs
*                                  only when Flash Player generates the
*                                  event, which in this case happens when a
*                                  user attempts to input text. You cannot
*                                  put text into a text field by sending it
*                                  <code>textInput</code> events.</p>
* @event scroll                    Dispatched by a TextField object
*                                  <i>after</i> the user scrolls.
* @event textInput                 Flash Player dispatches the
*                                  <code>textInput</code> event when a user
*                                  enters one or more characters of text.
*                                  Various text input methods can generate
*                                  this event, including standard keyboards,
*                                  input method editors(IMEs), voice or
*                                  speech recognition systems, and even the
*                                  act of pasting plain text with no
*                                  formatting or style information.
* @event textInteractionModeChange Flash Player dispatches the
*                                  <code>textInteractionModeChange</code>
*                                  event when a user changes the interaction
*                                  mode of a text field. for example on
*                                  Android, one can toggle from NORMAL mode
*                                  to SELECTION mode using context menu
*                                  options
*/
declare module away.entities {
    class TextField extends base.DisplayObject {
        private _bottomScrollV;
        private _caretIndex;
        private _length;
        private _maxScrollH;
        private _maxScrollV;
        private _numLines;
        private _selectionBeginIndex;
        private _selectionEndIndex;
        private _text;
        private _textHeight;
        private _textInteractionMode;
        private _textWidth;
        private _charBoundaries;
        private _charIndexAtPoint;
        private _firstCharInParagraph;
        private _imageReference;
        private _lineIndexAtPoint;
        private _lineIndexOfChar;
        private _lineLength;
        private _lineMetrics;
        private _lineOffset;
        private _lineText;
        private _paragraphLength;
        private _textFormat;
        /**
        * When set to <code>true</code> and the text field is not in focus, Flash
        * Player highlights the selection in the text field in gray. When set to
        * <code>false</code> and the text field is not in focus, Flash Player does
        * not highlight the selection in the text field.
        *
        * @default false
        */
        public alwaysShowSelection: boolean;
        /**
        * The type of anti-aliasing used for this text field. Use
        * <code>flash.text.AntiAliasType</code> constants for this property. You can
        * control this setting only if the font is embedded(with the
        * <code>embedFonts</code> property set to <code>true</code>). The default
        * setting is <code>flash.text.AntiAliasType.NORMAL</code>.
        *
        * <p>To set values for this property, use the following string values:</p>
        */
        public antiAliasType: text.AntiAliasType;
        /**
        * Controls automatic sizing and alignment of text fields. Acceptable values
        * for the <code>TextFieldAutoSize</code> constants:
        * <code>TextFieldAutoSize.NONE</code>(the default),
        * <code>TextFieldAutoSize.LEFT</code>, <code>TextFieldAutoSize.RIGHT</code>,
        * and <code>TextFieldAutoSize.CENTER</code>.
        *
        * <p>If <code>autoSize</code> is set to <code>TextFieldAutoSize.NONE</code>
        * (the default) no resizing occurs.</p>
        *
        * <p>If <code>autoSize</code> is set to <code>TextFieldAutoSize.LEFT</code>,
        * the text is treated as left-justified text, meaning that the left margin
        * of the text field remains fixed and any resizing of a single line of the
        * text field is on the right margin. If the text includes a line break(for
        * example, <code>"\n"</code> or <code>"\r"</code>), the bottom is also
        * resized to fit the next line of text. If <code>wordWrap</code> is also set
        * to <code>true</code>, only the bottom of the text field is resized and the
        * right side remains fixed.</p>
        *
        * <p>If <code>autoSize</code> is set to
        * <code>TextFieldAutoSize.RIGHT</code>, the text is treated as
        * right-justified text, meaning that the right margin of the text field
        * remains fixed and any resizing of a single line of the text field is on
        * the left margin. If the text includes a line break(for example,
        * <code>"\n" or "\r")</code>, the bottom is also resized to fit the next
        * line of text. If <code>wordWrap</code> is also set to <code>true</code>,
        * only the bottom of the text field is resized and the left side remains
        * fixed.</p>
        *
        * <p>If <code>autoSize</code> is set to
        * <code>TextFieldAutoSize.CENTER</code>, the text is treated as
        * center-justified text, meaning that any resizing of a single line of the
        * text field is equally distributed to both the right and left margins. If
        * the text includes a line break(for example, <code>"\n"</code> or
        * <code>"\r"</code>), the bottom is also resized to fit the next line of
        * text. If <code>wordWrap</code> is also set to <code>true</code>, only the
        * bottom of the text field is resized and the left and right sides remain
        * fixed.</p>
        *
        * @throws ArgumentError The <code>autoSize</code> specified is not a member
        *                       of flash.text.TextFieldAutoSize.
        */
        public autoSize: text.TextFieldAutoSize;
        /**
        * Specifies whether the text field has a background fill. If
        * <code>true</code>, the text field has a background fill. If
        * <code>false</code>, the text field has no background fill. Use the
        * <code>backgroundColor</code> property to set the background color of a
        * text field.
        *
        * @default false
        */
        public background: boolean;
        /**
        * The color of the text field background. The default value is
        * <code>0xFFFFFF</code>(white). This property can be retrieved or set, even
        * if there currently is no background, but the color is visible only if the
        * text field has the <code>background</code> property set to
        * <code>true</code>.
        */
        public backgroundColor: number;
        /**
        * Specifies whether the text field has a border. If <code>true</code>, the
        * text field has a border. If <code>false</code>, the text field has no
        * border. Use the <code>borderColor</code> property to set the border color.
        *
        * @default false
        */
        public border: boolean;
        /**
        * The color of the text field border. The default value is
        * <code>0x000000</code>(black). This property can be retrieved or set, even
        * if there currently is no border, but the color is visible only if the text
        * field has the <code>border</code> property set to <code>true</code>.
        */
        public borderColor: number;
        /**
        * An integer(1-based index) that indicates the bottommost line that is
        * currently visible in the specified text field. Think of the text field as
        * a window onto a block of text. The <code>scrollV</code> property is the
        * 1-based index of the topmost visible line in the window.
        *
        * <p>All the text between the lines indicated by <code>scrollV</code> and
        * <code>bottomScrollV</code> is currently visible in the text field.</p>
        */
        public bottomScrollV : number;
        /**
        * The index of the insertion point(caret) position. If no insertion point
        * is displayed, the value is the position the insertion point would be if
        * you restored focus to the field(typically where the insertion point last
        * was, or 0 if the field has not had focus).
        *
        * <p>Selection span indexes are zero-based(for example, the first position
        * is 0, the second position is 1, and so on).</p>
        */
        public caretIndex : number;
        /**
        * A Boolean value that specifies whether extra white space(spaces, line
        * breaks, and so on) in a text field with HTML text is removed. The default
        * value is <code>false</code>. The <code>condenseWhite</code> property only
        * affects text set with the <code>htmlText</code> property, not the
        * <code>text</code> property. If you set text with the <code>text</code>
        * property, <code>condenseWhite</code> is ignored.
        *
        * <p>If <code>condenseWhite</code> is set to <code>true</code>, use standard
        * HTML commands such as <code><BR></code> and <code><P></code> to place line
        * breaks in the text field.</p>
        *
        * <p>Set the <code>condenseWhite</code> property before setting the
        * <code>htmlText</code> property.</p>
        */
        public condenseWhite: boolean;
        /**
        * Specifies the format applied to newly inserted text, such as text entered
        * by a user or text inserted with the <code>replaceSelectedText()</code>
        * method.
        *
        * <p><b>Note:</b> When selecting characters to be replaced with
        * <code>setSelection()</code> and <code>replaceSelectedText()</code>, the
        * <code>defaultTextFormat</code> will be applied only if the text has been
        * selected up to and including the last character. Here is an example:</p>
        * <pre xml:space="preserve"> public my_txt:TextField new TextField();
        * my_txt.text = "Flash Macintosh version"; public my_fmt:TextFormat = new
        * TextFormat(); my_fmt.color = 0xFF0000; my_txt.defaultTextFormat = my_fmt;
        * my_txt.setSelection(6,15); // partial text selected - defaultTextFormat
        * not applied my_txt.setSelection(6,23); // text selected to end -
        * defaultTextFormat applied my_txt.replaceSelectedText("Windows version");
        * </pre>
        *
        * <p>When you access the <code>defaultTextFormat</code> property, the
        * returned TextFormat object has all of its properties defined. No property
        * is <code>null</code>.</p>
        *
        * <p><b>Note:</b> You can't set this property if a style sheet is applied to
        * the text field.</p>
        *
        * @throws Error This method cannot be used on a text field with a style
        *               sheet.
        */
        public defaultTextFormat: text.TextFormat;
        /**
        * Specifies whether the text field is a password text field. If the value of
        * this property is <code>true</code>, the text field is treated as a
        * password text field and hides the input characters using asterisks instead
        * of the actual characters. If <code>false</code>, the text field is not
        * treated as a password text field. When password mode is enabled, the Cut
        * and Copy commands and their corresponding keyboard shortcuts will not
        * function. This security mechanism prevents an unscrupulous user from using
        * the shortcuts to discover a password on an unattended computer.
        *
        * @default false
        */
        public displayAsPassword: boolean;
        /**
        * Specifies whether to render by using embedded font outlines. If
        * <code>false</code>, Flash Player renders the text field by using device
        * fonts.
        *
        * <p>If you set the <code>embedFonts</code> property to <code>true</code>
        * for a text field, you must specify a font for that text by using the
        * <code>font</code> property of a TextFormat object applied to the text
        * field. If the specified font is not embedded in the SWF file, the text is
        * not displayed.</p>
        *
        * @default false
        */
        public embedFonts: boolean;
        /**
        * The type of grid fitting used for this text field. This property applies
        * only if the <code>flash.text.AntiAliasType</code> property of the text
        * field is set to <code>flash.text.AntiAliasType.ADVANCED</code>.
        *
        * <p>The type of grid fitting used determines whether Flash Player forces
        * strong horizontal and vertical lines to fit to a pixel or subpixel grid,
        * or not at all.</p>
        *
        * <p>For the <code>flash.text.GridFitType</code> property, you can use the
        * following string values:</p>
        *
        * @default pixel
        */
        public gridFitType: text.GridFitType;
        /**
        * Contains the HTML representation of the text field contents.
        *
        * <p>Flash Player supports the following HTML tags:</p>
        *
        * <p>Flash Player and AIR also support explicit character codes, such as
        * &#38;(ASCII ampersand) and &#x20AC;(Unicode € symbol). </p>
        */
        public htmlText: string;
        /**
        * The number of characters in a text field. A character such as tab
        * (<code>\t</code>) counts as one character.
        */
        public length : number;
        /**
        * The maximum number of characters that the text field can contain, as
        * entered by a user. A script can insert more text than
        * <code>maxChars</code> allows; the <code>maxChars</code> property indicates
        * only how much text a user can enter. If the value of this property is
        * <code>0</code>, a user can enter an unlimited amount of text.
        *
        * @default 0
        */
        public maxChars: number;
        /**
        * The maximum value of <code>scrollH</code>.
        */
        public maxScrollH(): number;
        /**
        * The maximum value of <code>scrollV</code>.
        */
        public maxScrollV(): number;
        /**
        * A Boolean value that indicates whether Flash Player automatically scrolls
        * multiline text fields when the user clicks a text field and rolls the
        * mouse wheel. By default, this value is <code>true</code>. This property is
        * useful if you want to prevent mouse wheel scrolling of text fields, or
        * implement your own text field scrolling.
        */
        public mouseWheelEnabled: boolean;
        /**
        * Indicates whether field is a multiline text field. If the value is
        * <code>true</code>, the text field is multiline; if the value is
        * <code>false</code>, the text field is a single-line text field. In a field
        * of type <code>TextFieldType.INPUT</code>, the <code>multiline</code> value
        * determines whether the <code>Enter</code> key creates a new line(a value
        * of <code>false</code>, and the <code>Enter</code> key is ignored). If you
        * paste text into a <code>TextField</code> with a <code>multiline</code>
        * value of <code>false</code>, newlines are stripped out of the text.
        *
        * @default false
        */
        public multiline: boolean;
        /**
        * Defines the number of text lines in a multiline text field. If
        * <code>wordWrap</code> property is set to <code>true</code>, the number of
        * lines increases when text wraps.
        */
        public numLines : number;
        /**
        * Indicates the set of characters that a user can enter into the text field.
        * If the value of the <code>restrict</code> property is <code>null</code>,
        * you can enter any character. If the value of the <code>restrict</code>
        * property is an empty string, you cannot enter any character. If the value
        * of the <code>restrict</code> property is a string of characters, you can
        * enter only characters in the string into the text field. The string is
        * scanned from left to right. You can specify a range by using the hyphen
        * (-) character. Only user interaction is restricted; a script can put any
        * text into the text field. <ph outputclass="flashonly">This property does
        * not synchronize with the Embed font options in the Property inspector.
        *
        * <p>If the string begins with a caret(^) character, all characters are
        * initially accepted and succeeding characters in the string are excluded
        * from the set of accepted characters. If the string does not begin with a
        * caret(^) character, no characters are initially accepted and succeeding
        * characters in the string are included in the set of accepted
        * characters.</p>
        *
        * <p>The following example allows only uppercase characters, spaces, and
        * numbers to be entered into a text field:</p>
        * <pre xml:space="preserve"> my_txt.restrict = "A-Z 0-9"; </pre>
        *
        * <p>The following example includes all characters, but excludes lowercase
        * letters:</p>
        * <pre xml:space="preserve"> my_txt.restrict = "^a-z"; </pre>
        *
        * <p>You can use a backslash to enter a ^ or - verbatim. The accepted
        * backslash sequences are \-, \^ or \\. The backslash must be an actual
        * character in the string, so when specified in ActionScript, a double
        * backslash must be used. For example, the following code includes only the
        * dash(-) and caret(^):</p>
        * <pre xml:space="preserve"> my_txt.restrict = "\\-\\^"; </pre>
        *
        * <p>The ^ can be used anywhere in the string to toggle between including
        * characters and excluding characters. The following code includes only
        * uppercase letters, but excludes the uppercase letter Q:</p>
        * <pre xml:space="preserve"> my_txt.restrict = "A-Z^Q"; </pre>
        *
        * <p>You can use the <code>\u</code> escape sequence to construct
        * <code>restrict</code> strings. The following code includes only the
        * characters from ASCII 32(space) to ASCII 126(tilde).</p>
        * <pre xml:space="preserve"> my_txt.restrict = "\u0020-\u007E"; </pre>
        *
        * @default null
        */
        public restrict: string;
        /**
        * The current horizontal scrolling position. If the <code>scrollH</code>
        * property is 0, the text is not horizontally scrolled. This property value
        * is an integer that represents the horizontal position in pixels.
        *
        * <p>The units of horizontal scrolling are pixels, whereas the units of
        * vertical scrolling are lines. Horizontal scrolling is measured in pixels
        * because most fonts you typically use are proportionally spaced; that is,
        * the characters can have different widths. Flash Player performs vertical
        * scrolling by line because users usually want to see a complete line of
        * text rather than a partial line. Even if a line uses multiple fonts, the
        * height of the line adjusts to fit the largest font in use.</p>
        *
        * <p><b>Note: </b>The <code>scrollH</code> property is zero-based, not
        * 1-based like the <code>scrollV</code> vertical scrolling property.</p>
        */
        public scrollH: number;
        /**
        * The vertical position of text in a text field. The <code>scrollV</code>
        * property is useful for directing users to a specific paragraph in a long
        * passage, or creating scrolling text fields.
        *
        * <p>The units of vertical scrolling are lines, whereas the units of
        * horizontal scrolling are pixels. If the first line displayed is the first
        * line in the text field, scrollV is set to 1(not 0). Horizontal scrolling
        * is measured in pixels because most fonts are proportionally spaced; that
        * is, the characters can have different widths. Flash performs vertical
        * scrolling by line because users usually want to see a complete line of
        * text rather than a partial line. Even if there are multiple fonts on a
        * line, the height of the line adjusts to fit the largest font in use.</p>
        */
        public scrollV: number;
        /**
        * A Boolean value that indicates whether the text field is selectable. The
        * value <code>true</code> indicates that the text is selectable. The
        * <code>selectable</code> property controls whether a text field is
        * selectable, not whether a text field is editable. A dynamic text field can
        * be selectable even if it is not editable. If a dynamic text field is not
        * selectable, the user cannot select its text.
        *
        * <p>If <code>selectable</code> is set to <code>false</code>, the text in
        * the text field does not respond to selection commands from the mouse or
        * keyboard, and the text cannot be copied with the Copy command. If
        * <code>selectable</code> is set to <code>true</code>, the text in the text
        * field can be selected with the mouse or keyboard, and the text can be
        * copied with the Copy command. You can select text this way even if the
        * text field is a dynamic text field instead of an input text field. </p>
        *
        * @default true
        */
        public selectable: boolean;
        /**
        * The zero-based character index value of the first character in the current
        * selection. For example, the first character is 0, the second character is
        * 1, and so on. If no text is selected, this property is the value of
        * <code>caretIndex</code>.
        */
        public selectionBeginIndex : number;
        /**
        * The zero-based character index value of the last character in the current
        * selection. For example, the first character is 0, the second character is
        * 1, and so on. If no text is selected, this property is the value of
        * <code>caretIndex</code>.
        */
        public selectionEndIndex : number;
        /**
        * The sharpness of the glyph edges in this text field. This property applies
        * only if the <code>flash.text.AntiAliasType</code> property of the text
        * field is set to <code>flash.text.AntiAliasType.ADVANCED</code>. The range
        * for <code>sharpness</code> is a number from -400 to 400. If you attempt to
        * set <code>sharpness</code> to a value outside that range, Flash sets the
        * property to the nearest value in the range(either -400 or 400).
        *
        * @default 0
        */
        public sharpness: number;
        /**
        * Attaches a style sheet to the text field. For information on creating
        * style sheets, see the StyleSheet class and the <i>ActionScript 3.0
        * Developer's Guide</i>.
        *
        * <p>You can change the style sheet associated with a text field at any
        * time. If you change the style sheet in use, the text field is redrawn with
        * the new style sheet. You can set the style sheet to <code>null</code> or
        * <code>undefined</code> to remove the style sheet. If the style sheet in
        * use is removed, the text field is redrawn without a style sheet. </p>
        *
        * <p><b>Note:</b> If the style sheet is removed, the contents of both
        * <code>TextField.text</code> and <code> TextField.htmlText</code> change to
        * incorporate the formatting previously applied by the style sheet. To
        * preserve the original <code>TextField.htmlText</code> contents without the
        * formatting, save the value in a variable before removing the style
        * sheet.</p>
        */
        public styleSheet: StyleSheet;
        /**
        * A string that is the current text in the text field. Lines are separated
        * by the carriage return character(<code>'\r'</code>, ASCII 13). This
        * property contains unformatted text in the text field, without HTML tags.
        *
        * <p>To get the text in HTML form, use the <code>htmlText</code>
        * property.</p>
        */
        public text : string;
        /**
        * The color of the text in a text field, in hexadecimal format. The
        * hexadecimal color system uses six digits to represent color values. Each
        * digit has 16 possible values or characters. The characters range from 0-9
        * and then A-F. For example, black is <code>0x000000</code>; white is
        * <code>0xFFFFFF</code>.
        *
        * @default 0(0x000000)
        */
        public textColor: number;
        /**
        * The height of the text in pixels.
        */
        public textHeight : number;
        /**
        * The interaction mode property, Default value is
        * TextInteractionMode.NORMAL. On mobile platforms, the normal mode implies
        * that the text can be scrolled but not selected. One can switch to the
        * selectable mode through the in-built context menu on the text field. On
        * Desktop, the normal mode implies that the text is in scrollable as well as
        * selection mode.
        */
        public textInteractionMode : text.TextInteractionMode;
        /**
        * The width of the text in pixels.
        */
        public textWidth : number;
        /**
        * The thickness of the glyph edges in this text field. This property applies
        * only when <code>away.text.AntiAliasType</code> is set to
        * <code>away.text.AntiAliasType.ADVANCED</code>.
        *
        * <p>The range for <code>thickness</code> is a number from -200 to 200. If
        * you attempt to set <code>thickness</code> to a value outside that range,
        * the property is set to the nearest value in the range(either -200 or
        * 200).</p>
        *
        * @default 0
        */
        public thickness: number;
        /**
        * The type of the text field. Either one of the following TextFieldType
        * constants: <code>TextFieldType.DYNAMIC</code>, which specifies a dynamic
        * text field, which a user cannot edit, or <code>TextFieldType.INPUT</code>,
        * which specifies an input text field, which a user can edit.
        *
        * @default dynamic
        * @throws ArgumentError The <code>type</code> specified is not a member of
        *                       flash.text.TextFieldType.
        */
        public type: text.TextFieldType;
        /**
        * Specifies whether to copy and paste the text formatting along with the
        * text. When set to <code>true</code>, Flash Player copies and pastes
        * formatting(such as alignment, bold, and italics) when you copy and paste
        * between text fields. Both the origin and destination text fields for the
        * copy and paste procedure must have <code>useRichTextClipboard</code> set
        * to <code>true</code>. The default value is <code>false</code>.
        */
        public useRichTextClipboard: boolean;
        /**
        * A Boolean value that indicates whether the text field has word wrap. If
        * the value of <code>wordWrap</code> is <code>true</code>, the text field
        * has word wrap; if the value is <code>false</code>, the text field does not
        * have word wrap. The default value is <code>false</code>.
        */
        public wordWrap: boolean;
        /**
        * Creates a new TextField instance. After you create the TextField instance,
        * call the <code>addChild()</code> or <code>addChildAt()</code> method of
        * the parent DisplayObjectContainer object to add the TextField instance to
        * the display list.
        *
        * <p>The default size for a text field is 100 x 100 pixels.</p>
        */
        constructor();
        /**
        * Appends the string specified by the <code>newText</code> parameter to the
        * end of the text of the text field. This method is more efficient than an
        * addition assignment(<code>+=</code>) on a <code>text</code> property
        * (such as <code>someTextField.text += moreText</code>), particularly for a
        * text field that contains a significant amount of content.
        *
        * @param newText The string to append to the existing text.
        */
        public appendText(newText: string): void;
        /**
        * Returns a rectangle that is the bounding box of the character.
        *
        * @param charIndex The zero-based index value for the character(for
        *                  example, the first position is 0, the second position is
        *                  1, and so on).
        * @return A rectangle with <code>x</code> and <code>y</code> minimum and
        *         maximum values defining the bounding box of the character.
        */
        public getCharBoundaries(charIndex: number): geom.Rectangle;
        /**
        * Returns the zero-based index value of the character at the point specified
        * by the <code>x</code> and <code>y</code> parameters.
        *
        * @param x The <i>x</i> coordinate of the character.
        * @param y The <i>y</i> coordinate of the character.
        * @return The zero-based index value of the character(for example, the
        *         first position is 0, the second position is 1, and so on). Returns
        *         -1 if the point is not over any character.
        */
        public getCharIndexAtPoint(x: number, y: number): number;
        /**
        * Given a character index, returns the index of the first character in the
        * same paragraph.
        *
        * @param charIndex The zero-based index value of the character(for example,
        *                  the first character is 0, the second character is 1, and
        *                  so on).
        * @return The zero-based index value of the first character in the same
        *         paragraph.
        * @throws RangeError The character index specified is out of range.
        */
        public getFirstCharInParagraph(charIndex: number): number;
        /**
        * Returns a DisplayObject reference for the given <code>id</code>, for an
        * image or SWF file that has been added to an HTML-formatted text field by
        * using an <code><img></code> tag. The <code><img></code> tag is in the
        * following format:
        *
        * <p><pre xml:space="preserve"><code> <img src = 'filename.jpg' id =
        * 'instanceName' ></code></pre></p>
        *
        * @param id The <code>id</code> to match(in the <code>id</code> attribute
        *           of the <code><img></code> tag).
        * @return The display object corresponding to the image or SWF file with the
        *         matching <code>id</code> attribute in the <code><img></code> tag
        *         of the text field. For media loaded from an external source, this
        *         object is a Loader object, and, once loaded, the media object is a
        *         child of that Loader object. For media embedded in the SWF file,
        *         it is the loaded object. If no <code><img></code> tag with the
        *         matching <code>id</code> exists, the method returns
        *         <code>null</code>.
        */
        public getImageReference(id: string): base.DisplayObject;
        /**
        * Returns the zero-based index value of the line at the point specified by
        * the <code>x</code> and <code>y</code> parameters.
        *
        * @param x The <i>x</i> coordinate of the line.
        * @param y The <i>y</i> coordinate of the line.
        * @return The zero-based index value of the line(for example, the first
        *         line is 0, the second line is 1, and so on). Returns -1 if the
        *         point is not over any line.
        */
        public getLineIndexAtPoint(x: number, y: number): number;
        /**
        * Returns the zero-based index value of the line containing the character
        * specified by the <code>charIndex</code> parameter.
        *
        * @param charIndex The zero-based index value of the character(for example,
        *                  the first character is 0, the second character is 1, and
        *                  so on).
        * @return The zero-based index value of the line.
        * @throws RangeError The character index specified is out of range.
        */
        public getLineIndexOfChar(charIndex: number): number;
        /**
        * Returns the number of characters in a specific text line.
        *
        * @param lineIndex The line number for which you want the length.
        * @return The number of characters in the line.
        * @throws RangeError The line number specified is out of range.
        */
        public getLineLength(lineIndex: number): number;
        /**
        * Returns metrics information about a given text line.
        *
        * @param lineIndex The line number for which you want metrics information.
        * @return A TextLineMetrics object.
        * @throws RangeError The line number specified is out of range.
        */
        public getLineMetrics(lineIndex: number): text.TextLineMetrics;
        /**
        * Returns the character index of the first character in the line that the
        * <code>lineIndex</code> parameter specifies.
        *
        * @param lineIndex The zero-based index value of the line(for example, the
        *                  first line is 0, the second line is 1, and so on).
        * @return The zero-based index value of the first character in the line.
        * @throws RangeError The line number specified is out of range.
        */
        public getLineOffset(lineIndex: number): number;
        /**
        * Returns the text of the line specified by the <code>lineIndex</code>
        * parameter.
        *
        * @param lineIndex The zero-based index value of the line(for example, the
        *                  first line is 0, the second line is 1, and so on).
        * @return The text string contained in the specified line.
        * @throws RangeError The line number specified is out of range.
        */
        public getLineText(lineIndex: number): string;
        /**
        * Given a character index, returns the length of the paragraph containing
        * the given character. The length is relative to the first character in the
        * paragraph(as returned by <code>getFirstCharInParagraph()</code>), not to
        * the character index passed in.
        *
        * @param charIndex The zero-based index value of the character(for example,
        *                  the first character is 0, the second character is 1, and
        *                  so on).
        * @return Returns the number of characters in the paragraph.
        * @throws RangeError The character index specified is out of range.
        */
        public getParagraphLength(charIndex: number): number;
        /**
        * Returns a TextFormat object that contains formatting information for the
        * range of text that the <code>beginIndex</code> and <code>endIndex</code>
        * parameters specify. Only properties that are common to the entire text
        * specified are set in the resulting TextFormat object. Any property that is
        * <i>mixed</i>, meaning that it has different values at different points in
        * the text, has a value of <code>null</code>.
        *
        * <p>If you do not specify values for these parameters, this method is
        * applied to all the text in the text field. </p>
        *
        * <p>The following table describes three possible usages:</p>
        *
        * @return The TextFormat object that represents the formatting properties
        *         for the specified text.
        * @throws RangeError The <code>beginIndex</code> or <code>endIndex</code>
        *                    specified is out of range.
        */
        public getTextFormat(beginIndex?: number, endIndex?: number): text.TextFormat;
        /**
        * Replaces the current selection with the contents of the <code>value</code>
        * parameter. The text is inserted at the position of the current selection,
        * using the current default character format and default paragraph format.
        * The text is not treated as HTML.
        *
        * <p>You can use the <code>replaceSelectedText()</code> method to insert and
        * delete text without disrupting the character and paragraph formatting of
        * the rest of the text.</p>
        *
        * <p><b>Note:</b> This method does not work if a style sheet is applied to
        * the text field.</p>
        *
        * @param value The string to replace the currently selected text.
        * @throws Error This method cannot be used on a text field with a style
        *               sheet.
        */
        public replaceSelectedText(value: string): void;
        /**
        * Replaces the range of characters that the <code>beginIndex</code> and
        * <code>endIndex</code> parameters specify with the contents of the
        * <code>newText</code> parameter. As designed, the text from
        * <code>beginIndex</code> to <code>endIndex-1</code> is replaced.
        *
        * <p><b>Note:</b> This method does not work if a style sheet is applied to
        * the text field.</p>
        *
        * @param beginIndex The zero-based index value for the start position of the
        *                   replacement range.
        * @param endIndex   The zero-based index position of the first character
        *                   after the desired text span.
        * @param newText    The text to use to replace the specified range of
        *                   characters.
        * @throws Error This method cannot be used on a text field with a style
        *               sheet.
        */
        public replaceText(beginIndex: number, endIndex: number, newText: string): void;
        /**
        * Sets as selected the text designated by the index values of the first and
        * last characters, which are specified with the <code>beginIndex</code> and
        * <code>endIndex</code> parameters. If the two parameter values are the
        * same, this method sets the insertion point, as if you set the
        * <code>caretIndex</code> property.
        *
        * @param beginIndex The zero-based index value of the first character in the
        *                   selection(for example, the first character is 0, the
        *                   second character is 1, and so on).
        * @param endIndex   The zero-based index value of the last character in the
        *                   selection.
        */
        public setSelection(beginIndex: number, endIndex: number): void;
        /**
        * Applies the text formatting that the <code>format</code> parameter
        * specifies to the specified text in a text field. The value of
        * <code>format</code> must be a TextFormat object that specifies the desired
        * text formatting changes. Only the non-null properties of
        * <code>format</code> are applied to the text field. Any property of
        * <code>format</code> that is set to <code>null</code> is not applied. By
        * default, all of the properties of a newly created TextFormat object are
        * set to <code>null</code>.
        *
        * <p><b>Note:</b> This method does not work if a style sheet is applied to
        * the text field.</p>
        *
        * <p>The <code>setTextFormat()</code> method changes the text formatting
        * applied to a range of characters or to the entire body of text in a text
        * field. To apply the properties of format to all text in the text field, do
        * not specify values for <code>beginIndex</code> and <code>endIndex</code>.
        * To apply the properties of the format to a range of text, specify values
        * for the <code>beginIndex</code> and the <code>endIndex</code> parameters.
        * You can use the <code>length</code> property to determine the index
        * values.</p>
        *
        * <p>The two types of formatting information in a TextFormat object are
        * character level formatting and paragraph level formatting. Each character
        * in a text field can have its own character formatting settings, such as
        * font name, font size, bold, and italic.</p>
        *
        * <p>For paragraphs, the first character of the paragraph is examined for
        * the paragraph formatting settings for the entire paragraph. Examples of
        * paragraph formatting settings are left margin, right margin, and
        * indentation.</p>
        *
        * <p>Any text inserted manually by the user, or replaced by the
        * <code>replaceSelectedText()</code> method, receives the default text field
        * formatting for new text, and not the formatting specified for the text
        * insertion point. To set the default formatting for new text, use
        * <code>defaultTextFormat</code>.</p>
        *
        * @param format A TextFormat object that contains character and paragraph
        *               formatting information.
        * @throws Error      This method cannot be used on a text field with a style
        *                    sheet.
        * @throws RangeError The <code>beginIndex</code> or <code>endIndex</code>
        *                    specified is out of range.
        */
        public setTextFormat(format: text.TextFormat, beginIndex?: number, endIndex?: number): void;
        /**
        * Returns true if an embedded font is available with the specified
        * <code>fontName</code> and <code>fontStyle</code> where
        * <code>Font.fontType</code> is <code>flash.text.FontType.EMBEDDED</code>.
        * Starting with Flash Player 10, two kinds of embedded fonts can appear in a
        * SWF file. Normal embedded fonts are only used with TextField objects. CFF
        * embedded fonts are only used with the flash.text.engine classes. The two
        * types are distinguished by the <code>fontType</code> property of the
        * <code>Font</code> class, as returned by the <code>enumerateFonts()</code>
        * function.
        *
        * <p>TextField cannot use a font of type <code>EMBEDDED_CFF</code>. If
        * <code>embedFonts</code> is set to <code>true</code> and the only font
        * available at run time with the specified name and style is of type
        * <code>EMBEDDED_CFF</code>, Flash Player fails to render the text, as if no
        * embedded font were available with the specified name and style.</p>
        *
        * <p>If both <code>EMBEDDED</code> and <code>EMBEDDED_CFF</code> fonts are
        * available with the same name and style, the <code>EMBEDDED</code> font is
        * selected and text renders with the <code>EMBEDDED</code> font.</p>
        *
        * @param fontName  The name of the embedded font to check.
        * @param fontStyle Specifies the font style to check. Use
        *                  <code>flash.text.FontStyle</code>
        * @return <code>true</code> if a compatible embedded font is available,
        *         otherwise <code>false</code>.
        * @throws ArgumentError The <code>fontStyle</code> specified is not a member
        *                       of <code>flash.text.FontStyle</code>.
        */
        static isFontCompatible(fontName: string, fontStyle: string): boolean;
    }
}
declare module away.managers {
    /**
    * MouseManager enforces a singleton pattern and is not intended to be instanced.
    * it provides a manager class for detecting mouse hits on scene objects and sending out mouse events.
    */
    class MouseManager {
        private static _instance;
        private _viewLookup;
        public _iActiveDiv: HTMLDivElement;
        public _iUpdateDirty: boolean;
        public _iCollidingObject: pick.PickingCollisionVO;
        private _nullVector;
        private _previousCollidingObject;
        private _queuedEvents;
        private _mouseMoveEvent;
        private _mouseUp;
        private _mouseClick;
        private _mouseOut;
        private _mouseDown;
        private _mouseMove;
        private _mouseOver;
        private _mouseWheel;
        private _mouseDoubleClick;
        private onClickDelegate;
        private onDoubleClickDelegate;
        private onMouseDownDelegate;
        private onMouseMoveDelegate;
        private onMouseUpDelegate;
        private onMouseWheelDelegate;
        private onMouseOverDelegate;
        private onMouseOutDelegate;
        /**
        * Creates a new <code>MouseManager</code> object.
        */
        constructor();
        static getInstance(): MouseManager;
        public fireMouseEvents(forceMouseMove: boolean): void;
        public registerView(view: containers.View): void;
        public unregisterView(view: containers.View): void;
        private queueDispatch(event, sourceEvent, collider?);
        private onMouseMove(event);
        private onMouseOut(event);
        private onMouseOver(event);
        private onClick(event);
        private onDoubleClick(event);
        private onMouseDown(event);
        private onMouseUp(event);
        private onMouseWheel(event);
        private updateColliders(event);
    }
}
declare module away.managers {
    /**
    * The StageManager class provides a multiton object that handles management for Stage objects.
    *
    * @see away.base.Stage
    */
    class StageManager extends events.EventDispatcher {
        private static STAGE_MAX_QUANTITY;
        private _stages;
        private static _instance;
        private static _numStages;
        private _onContextCreatedDelegate;
        /**
        * Creates a new StageManager class.
        * @param stage The Stage object that contains the Stage objects to be managed.
        * @private
        */
        constructor(StageManagerSingletonEnforcer: StageManagerSingletonEnforcer);
        /**
        * Gets a StageManager instance for the given Stage object.
        * @param stage The Stage object that contains the Stage objects to be managed.
        * @return The StageManager instance for the given Stage object.
        */
        static getInstance(): StageManager;
        /**
        * Requests the Stage for the given index.
        *
        * @param index The index of the requested Stage.
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        * @param profile The compatibility profile, an enumeration of ContextProfile
        * @return The Stage for the given index.
        */
        public getStageAt(index: number, forceSoftware?: boolean, profile?: string, mode?: string): base.Stage;
        /**
        * Removes a Stage from the manager.
        * @param stage
        * @private
        */
        public iRemoveStage(stage: base.Stage): void;
        /**
        * Get the next available stage. An error is thrown if there are no StageProxies available
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        * @param profile The compatibility profile, an enumeration of ContextProfile
        * @return The allocated stage
        */
        public getFreeStage(forceSoftware?: boolean, profile?: string, mode?: string): base.Stage;
        /**
        * Checks if a new stage can be created and managed by the class.
        * @return true if there is one slot free for a new stage
        */
        public hasFreeStage : boolean;
        /**
        * Returns the amount of stage objects that can be created and managed by the class
        * @return the amount of free slots
        */
        public numSlotsFree : number;
        /**
        * Returns the amount of Stage objects currently managed by the class.
        * @return the amount of slots used
        */
        public numSlotsUsed : number;
        /**
        * The maximum amount of Stage objects that can be managed by the class
        */
        public numSlotsTotal : number;
        private onContextCreated(e);
    }
}
declare class StageManagerSingletonEnforcer {
}
/**
* The Loader class is used to load SWF files or image(JPG, PNG, or GIF)
* files. Use the <code>load()</code> method to initiate loading. The loaded
* display object is added as a child of the Loader object.
*
* <p>Use the URLLoader class to load text or binary data.</p>
*
* <p>The Loader class overrides the following methods that it inherits,
* because a Loader object can only have one child display object - the
* display object that it loads. Calling the following methods throws an
* exception: <code>addChild()</code>, <code>addChildAt()</code>,
* <code>removeChild()</code>, <code>removeChildAt()</code>, and
* <code>setChildIndex()</code>. To remove a loaded display object, you must
* remove the <i>Loader</i> object from its parent DisplayObjectContainer
* child array. </p>
*
* <p><b>Note:</b> The ActionScript 2.0 MovieClipLoader and LoadVars classes
* are not used in ActionScript 3.0. The Loader and URLLoader classes replace
* them.</p>
*
* <p>When you use the Loader class, consider the Flash Player and Adobe AIR
* security model: </p>
*
* <ul>
*   <li>You can load content from any accessible source. </li>
*   <li>Loading is not allowed if the calling SWF file is in a network
* sandbox and the file to be loaded is local. </li>
*   <li>If the loaded content is a SWF file written with ActionScript 3.0, it
* cannot be cross-scripted by a SWF file in another security sandbox unless
* that cross-scripting arrangement was approved through a call to the
* <code>System.allowDomain()</code> or the
* <code>System.allowInsecureDomain()</code> method in the loaded content
* file.</li>
*   <li>If the loaded content is an AVM1 SWF file(written using ActionScript
* 1.0 or 2.0), it cannot be cross-scripted by an AVM2 SWF file(written using
* ActionScript 3.0). However, you can communicate between the two SWF files
* by using the LocalConnection class.</li>
*   <li>If the loaded content is an image, its data cannot be accessed by a
* SWF file outside of the security sandbox, unless the domain of that SWF
* file was included in a URL policy file at the origin domain of the
* image.</li>
*   <li>Movie clips in the local-with-file-system sandbox cannot script movie
* clips in the local-with-networking sandbox, and the reverse is also
* prevented. </li>
*   <li>You cannot connect to commonly reserved ports. For a complete list of
* blocked ports, see "Restricting Networking APIs" in the <i>ActionScript 3.0
* Developer's Guide</i>. </li>
* </ul>
*
* <p>However, in AIR, content in the <code>application</code> security
* sandbox(content installed with the AIR application) are not restricted by
* these security limitations.</p>
*
* <p>For more information related to security, see the Flash Player Developer
* Center Topic: <a href="http://www.adobe.com/go/devnet_security_en"
* scope="external">Security</a>.</p>
*
* <p>When loading a SWF file from an untrusted source(such as a domain other
* than that of the Loader object's root SWF file), you may want to define a
* mask for the Loader object, to prevent the loaded content(which is a child
* of the Loader object) from drawing to portions of the Stage outside of that
* mask, as shown in the following code:</p>
*/
declare module away.containers {
    class Loader extends DisplayObjectContainer {
        private _loadingSessions;
        private _useAssetLib;
        private _assetLibId;
        private _onResourceCompleteDelegate;
        private _onAssetCompleteDelegate;
        private _content;
        private _contentLoaderInfo;
        /**
        * Contains the root display object of the SWF file or image(JPG, PNG, or
        * GIF) file that was loaded by using the <code>load()</code> or
        * <code>loadBytes()</code> methods.
        *
        * @throws SecurityError The loaded SWF file or image file belongs to a
        *                       security sandbox to which you do not have access.
        *                       For a loaded SWF file, you can avoid this situation
        *                       by having the file call the
        *                       <code>Security.allowDomain()</code> method or by
        *                       having the loading file specify a
        *                       <code>loaderContext</code> parameter with its
        *                       <code>securityDomain</code> property set to
        *                       <code>SecurityDomain.currentDomain</code> when you
        *                       call the <code>load()</code> or
        *                       <code>loadBytes()</code> method.
        */
        public content : base.DisplayObject;
        /**
        * Returns a LoaderInfo object corresponding to the object being loaded.
        * LoaderInfo objects are shared between the Loader object and the loaded
        * content object. The LoaderInfo object supplies loading progress
        * information and statistics about the loaded file.
        *
        * <p>Events related to the load are dispatched by the LoaderInfo object
        * referenced by the <code>contentLoaderInfo</code> property of the Loader
        * object. The <code>contentLoaderInfo</code> property is set to a valid
        * LoaderInfo object, even before the content is loaded, so that you can add
        * event listeners to the object prior to the load.</p>
        *
        * <p>To detect uncaught errors that happen in a loaded SWF, use the
        * <code>Loader.uncaughtErrorEvents</code> property, not the
        * <code>Loader.contentLoaderInfo.uncaughtErrorEvents</code> property.</p>
        */
        public contentLoaderInfo : base.LoaderInfo;
        /**
        * Creates a Loader object that you can use to load files, such as SWF, JPEG,
        * GIF, or PNG files. Call the <code>load()</code> method to load the asset
        * as a child of the Loader instance. You can then add the Loader object to
        * the display list(for instance, by using the <code>addChild()</code>
        * method of a DisplayObjectContainer instance). The asset appears on the
        * Stage as it loads.
        *
        * <p>You can also use a Loader instance "offlist," that is without adding it
        * to a display object container on the display list. In this mode, the
        * Loader instance might be used to load a SWF file that contains additional
        * modules of an application. </p>
        *
        * <p>To detect when the SWF file is finished loading, you can use the events
        * of the LoaderInfo object associated with the
        * <code>contentLoaderInfo</code> property of the Loader object. At that
        * point, the code in the module SWF file can be executed to initialize and
        * start the module. In the offlist mode, a Loader instance might also be
        * used to load a SWF file that contains components or media assets. Again,
        * you can use the LoaderInfo object event notifications to detect when the
        * components are finished loading. At that point, the application can start
        * using the components and media assets in the library of the SWF file by
        * instantiating the ActionScript 3.0 classes that represent those components
        * and assets.</p>
        *
        * <p>To determine the status of a Loader object, monitor the following
        * events that the LoaderInfo object associated with the
        * <code>contentLoaderInfo</code> property of the Loader object:</p>
        *
        * <ul>
        *   <li>The <code>open</code> event is dispatched when loading begins.</li>
        *   <li>The <code>ioError</code> or <code>securityError</code> event is
        * dispatched if the file cannot be loaded or if an error occured during the
        * load process. </li>
        *   <li>The <code>progress</code> event fires continuously while the file is
        * being loaded.</li>
        *   <li>The <code>complete</code> event is dispatched when a file completes
        * downloading, but before the loaded movie clip's methods and properties are
        * available. </li>
        *   <li>The <code>init</code> event is dispatched after the properties and
        * methods of the loaded SWF file are accessible, so you can begin
        * manipulating the loaded SWF file. This event is dispatched before the
        * <code>complete</code> handler. In streaming SWF files, the
        * <code>init</code> event can occur significantly earlier than the
        * <code>complete</code> event. For most purposes, use the <code>init</code>
        * handler.</li>
        * </ul>
        */
        constructor(useAssetLibrary?: boolean, assetLibraryId?: string);
        /**
        * Cancels a <code>load()</code> method operation that is currently in
        * progress for the Loader instance.
        *
        */
        public close(): void;
        /**
        * Loads a SWF, JPEG, progressive JPEG, unanimated GIF, or PNG file into an
        * object that is a child of this Loader object. If you load an animated GIF
        * file, only the first frame is displayed. As the Loader object can contain
        * only a single child, issuing a subsequent <code>load()</code> request
        * terminates the previous request, if still pending, and commences a new
        * load.
        *
        * <p><b>Note</b>: In AIR 1.5 and Flash Player 10, the maximum size for a
        * loaded image is 8,191 pixels in width or height, and the total number of
        * pixels cannot exceed 16,777,215 pixels.(So, if an loaded image is 8,191
        * pixels wide, it can only be 2,048 pixels high.) In Flash Player 9 and
        * earlier and AIR 1.1 and earlier, the limitation is 2,880 pixels in height
        * and 2,880 pixels in width.</p>
        *
        * <p>A SWF file or image loaded into a Loader object inherits the position,
        * rotation, and scale properties of the parent display objects of the Loader
        * object. </p>
        *
        * <p>Use the <code>unload()</code> method to remove movies or images loaded
        * with this method, or to cancel a load operation that is in progress.</p>
        *
        * <p>You can prevent a SWF file from using this method by setting the
        * <code>allowNetworking</code> parameter of the the <code>object</code> and
        * <code>embed</code> tags in the HTML page that contains the SWF
        * content.</p>
        *
        * <p>When you use this method, consider the Flash Player security model,
        * which is described in the Loader class description. </p>
        *
        * <p> In Flash Player 10 and later, if you use a multipart Content-Type(for
        * example "multipart/form-data") that contains an upload(indicated by a
        * "filename" parameter in a "content-disposition" header within the POST
        * body), the POST operation is subject to the security rules applied to
        * uploads:</p>
        *
        * <ul>
        *   <li>The POST operation must be performed in response to a user-initiated
        * action, such as a mouse click or key press.</li>
        *   <li>If the POST operation is cross-domain(the POST target is not on the
        * same server as the SWF file that is sending the POST request), the target
        * server must provide a URL policy file that permits cross-domain
        * access.</li>
        * </ul>
        *
        * <p>Also, for any multipart Content-Type, the syntax must be valid
        * (according to the RFC2046 standard). If the syntax appears to be invalid,
        * the POST operation is subject to the security rules applied to
        * uploads.</p>
        *
        * <p>For more information related to security, see the Flash Player
        * Developer Center Topic: <a
        * href="http://www.adobe.com/go/devnet_security_en"
        * scope="external">Security</a>.</p>
        *
        * @param request The absolute or relative URL of the SWF, JPEG, GIF, or PNG
        *                file to be loaded. A relative path must be relative to the
        *                main SWF file. Absolute URLs must include the protocol
        *                reference, such as http:// or file:///. Filenames cannot
        *                include disk drive specifications.
        * @param context A LoaderContext object, which has properties that define
        *                the following:
        *                <ul>
        *                  <li>Whether or not to check for the existence of a policy
        *                file upon loading the object</li>
        *                  <li>The ApplicationDomain for the loaded object</li>
        *                  <li>The SecurityDomain for the loaded object</li>
        *                  <li>The ImageDecodingPolicy for the loaded image
        *                object</li>
        *                </ul>
        *
        *                <p>If the <code>context</code> parameter is not specified
        *                or refers to a null object, the loaded content remains in
        *                its own security domain.</p>
        *
        *                <p>For complete details, see the description of the
        *                properties in the <a
        *                href="../system/LoaderContext.html">LoaderContext</a>
        *                class.</p>
        * @param ns      An optional namespace string under which the file is to be
        *                loaded, allowing the differentiation of two resources with
        *                identical assets.
        * @param parser  An optional parser object for translating the loaded data
        *                into a usable resource. If not provided, AssetLoader will
        *                attempt to auto-detect the file type.
        * @throws IOError               The <code>digest</code> property of the
        *                               <code>request</code> object is not
        *                               <code>null</code>. You should only set the
        *                               <code>digest</code> property of a URLRequest
        *                               object when calling the
        *                               <code>URLLoader.load()</code> method when
        *                               loading a SWZ file(an Adobe platform
        *                               component).
        * @throws IllegalOperationError If the <code>requestedContentParent</code>
        *                               property of the <code>context</code>
        *                               parameter is a <code>Loader</code>.
        * @throws IllegalOperationError If the <code>LoaderContext.parameters</code>
        *                               parameter is set to non-null and has some
        *                               values which are not Strings.
        * @throws SecurityError         The value of
        *                               <code>LoaderContext.securityDomain</code>
        *                               must be either <code>null</code> or
        *                               <code>SecurityDomain.currentDomain</code>.
        *                               This reflects the fact that you can only
        *                               place the loaded media in its natural
        *                               security sandbox or your own(the latter
        *                               requires a policy file).
        * @throws SecurityError         Local SWF files may not set
        *                               LoaderContext.securityDomain to anything
        *                               other than <code>null</code>. It is not
        *                               permitted to import non-local media into a
        *                               local sandbox, or to place other local media
        *                               in anything other than its natural sandbox.
        * @throws SecurityError         You cannot connect to commonly reserved
        *                               ports. For a complete list of blocked ports,
        *                               see "Restricting Networking APIs" in the
        *                               <i>ActionScript 3.0 Developer's Guide</i>.
        * @throws SecurityError         If the <code>applicationDomain</code> or
        *                               <code>securityDomain</code> properties of
        *                               the <code>context</code> parameter are from
        *                               a disallowed domain.
        * @throws SecurityError         If a local SWF file is attempting to use the
        *                               <code>securityDomain</code> property of the
        *                               <code>context</code> parameter.
        * @event asyncError    Dispatched by the <code>contentLoaderInfo</code>
        *                      object if the
        *                      <code>LoaderContext.requestedContentParent</code>
        *                      property has been specified and it is not possible to
        *                      add the loaded content as a child to the specified
        *                      DisplayObjectContainer. This could happen if the
        *                      loaded content is a
        *                      <code>flash.display.AVM1Movie</code> or if the
        *                      <code>addChild()</code> call to the
        *                      requestedContentParent throws an error.
        * @event complete      Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the file has completed loading. The
        *                      <code>complete</code> event is always dispatched
        *                      after the <code>init</code> event.
        * @event httpStatus    Dispatched by the <code>contentLoaderInfo</code>
        *                      object when a network request is made over HTTP and
        *                      Flash Player can detect the HTTP status code.
        * @event init          Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the properties and methods of the loaded
        *                      SWF file are accessible. The <code>init</code> event
        *                      always precedes the <code>complete</code> event.
        * @event ioError       Dispatched by the <code>contentLoaderInfo</code>
        *                      object when an input or output error occurs that
        *                      causes a load operation to fail.
        * @event open          Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the loading operation starts.
        * @event progress      Dispatched by the <code>contentLoaderInfo</code>
        *                      object as data is received while load operation
        *                      progresses.
        * @event securityError Dispatched by the <code>contentLoaderInfo</code>
        *                      object if a SWF file in the local-with-filesystem
        *                      sandbox attempts to load content in the
        *                      local-with-networking sandbox, or vice versa.
        * @event securityError Dispatched by the <code>contentLoaderInfo</code>
        *                      object if the
        *                      <code>LoaderContext.requestedContentParent</code>
        *                      property has been specified and the security sandbox
        *                      of the
        *                      <code>LoaderContext.requestedContentParent</code>
        *                      does not have access to the loaded SWF.
        * @event unload        Dispatched by the <code>contentLoaderInfo</code>
        *                      object when a loaded object is removed.
        */
        public load(request: net.URLRequest, context?: library.AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): library.AssetLoaderToken;
        /**
        * Loads from binary data stored in a ByteArray object.
        *
        * <p>The <code>loadBytes()</code> method is asynchronous. You must wait for
        * the "init" event before accessing the properties of a loaded object.</p>
        *
        * <p>When you use this method, consider the Flash Player security model,
        * which is described in the Loader class description. </p>
        *
        * @param bytes   A ByteArray object. The contents of the ByteArray can be
        *                any of the file formats supported by the Loader class: SWF,
        *                GIF, JPEG, or PNG.
        * @param context A LoaderContext object. Only the
        *                <code>applicationDomain</code> property of the
        *                LoaderContext object applies; the
        *                <code>checkPolicyFile</code> and
        *                <code>securityDomain</code> properties of the LoaderContext
        *                object do not apply.
        *
        *                <p>If the <code>context</code> parameter is not specified
        *                or refers to a null object, the content is loaded into the
        *                current security domain -  a process referred to as "import
        *                loading" in Flash Player security documentation.
        *                Specifically, if the loading SWF file trusts the remote SWF
        *                by incorporating the remote SWF into its code, then the
        *                loading SWF can import it directly into its own security
        *                domain.</p>
        *
        *                <p>For more information related to security, see the Flash
        *                Player Developer Center Topic: <a
        *                href="http://www.adobe.com/go/devnet_security_en"
        *                scope="external">Security</a>.</p>
        * @throws ArgumentError         If the <code>length</code> property of the
        *                               ByteArray object is not greater than 0.
        * @throws IllegalOperationError If the <code>checkPolicyFile</code> or
        *                               <code>securityDomain</code> property of the
        *                               <code>context</code> parameter are non-null.
        * @throws IllegalOperationError If the <code>requestedContentParent</code>
        *                               property of the <code>context</code>
        *                               parameter is a <code>Loader</code>.
        * @throws IllegalOperationError If the <code>LoaderContext.parameters</code>
        *                               parameter is set to non-null and has some
        *                               values which are not Strings.
        * @throws SecurityError         If the provided
        *                               <code>applicationDomain</code> property of
        *                               the <code>context</code> property is from a
        *                               disallowed domain.
        * @throws SecurityError         You cannot connect to commonly reserved
        *                               ports. For a complete list of blocked ports,
        *                               see "Restricting Networking APIs" in the
        *                               <i>ActionScript 3.0 Developer's Guide</i>.
        * @event asyncError    Dispatched by the <code>contentLoaderInfo</code>
        *                      object if the
        *                      <code>LoaderContext.requestedContentParent</code>
        *                      property has been specified and it is not possible to
        *                      add the loaded content as a child to the specified
        *                      DisplayObjectContainer. This could happen if the
        *                      loaded content is a
        *                      <code>flash.display.AVM1Movie</code> or if the
        *                      <code>addChild()</code> call to the
        *                      requestedContentParent throws an error.
        * @event complete      Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the operation is complete. The
        *                      <code>complete</code> event is always dispatched
        *                      after the <code>init</code> event.
        * @event init          Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the properties and methods of the loaded
        *                      data are accessible. The <code>init</code> event
        *                      always precedes the <code>complete</code> event.
        * @event ioError       Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the runtime cannot parse the data in the
        *                      byte array.
        * @event open          Dispatched by the <code>contentLoaderInfo</code>
        *                      object when the operation starts.
        * @event progress      Dispatched by the <code>contentLoaderInfo</code>
        *                      object as data is transfered in memory.
        * @event securityError Dispatched by the <code>contentLoaderInfo</code>
        *                      object if the
        *                      <code>LoaderContext.requestedContentParent</code>
        *                      property has been specified and the security sandbox
        *                      of the
        *                      <code>LoaderContext.requestedContentParent</code>
        *                      does not have access to the loaded SWF.
        * @event unload        Dispatched by the <code>contentLoaderInfo</code>
        *                      object when a loaded object is removed.
        */
        public loadData(data: any, context?: library.AssetLoaderContext, ns?: string, parser?: parsers.ParserBase): library.AssetLoaderToken;
        /**
        * Removes a child of this Loader object that was loaded by using the
        * <code>load()</code> method. The <code>property</code> of the associated
        * LoaderInfo object is reset to <code>null</code>. The child is not
        * necessarily destroyed because other objects might have references to it;
        * however, it is no longer a child of the Loader object.
        *
        * <p>As a best practice, before you unload a child SWF file, you should
        * explicitly close any streams in the child SWF file's objects, such as
        * LocalConnection, NetConnection, NetStream, and Sound objects. Otherwise,
        * audio in the child SWF file might continue to play, even though the child
        * SWF file was unloaded. To close streams in the child SWF file, add an
        * event listener to the child that listens for the <code>unload</code>
        * event. When the parent calls <code>Loader.unload()</code>, the
        * <code>unload</code> event is dispatched to the child. The following code
        * shows how you might do this:</p>
        * <pre xml:space="preserve"> public closeAllStreams(evt:Event) {
        * myNetStream.close(); mySound.close(); myNetConnection.close();
        * myLocalConnection.close(); }
        * myMovieClip.loaderInfo.addEventListener(Event.UNLOAD,
        * closeAllStreams);</pre>
        *
        */
        public unload(): void;
        /**
        * Enables a specific parser.
        * When no specific parser is set for a loading/parsing opperation,
        * loader3d can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parserClass The parser class to enable.
        * @see away.parsers.Parsers
        */
        static enableParser(parserClass: Object): void;
        /**
        * Enables a list of parsers.
        * When no specific parser is set for a loading/parsing opperation,
        * loader3d can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parserClasses A Vector of parser classes to enable.
        * @see away.parsers.Parsers
        */
        static enableParsers(parserClasses: Object[]): void;
        private removeListeners(dispatcher);
        private onAssetComplete(event);
        /**
        * Called when an error occurs during loading
        */
        private onLoadError(event);
        /**
        * Called when a an error occurs during parsing
        */
        private onParseError(event);
        /**
        * Called when the resource and all of its dependencies was retrieved.
        */
        private onResourceComplete(event);
    }
}
declare module away.containers {
    class Scene extends events.EventDispatcher {
        private _expandedPartitions;
        private _partitions;
        public _iSceneGraphRoot: DisplayObjectContainer;
        public _iCollectionMark: number;
        constructor();
        public traversePartitions(traverser: traverse.ICollector): void;
        public partition : partition.Partition;
        public contains(child: base.DisplayObject): boolean;
        public addChild(child: base.DisplayObject): base.DisplayObject;
        public removeChild(child: base.DisplayObject): void;
        public removeChildAt(index: number): void;
        public getChildAt(index: number): base.DisplayObject;
        public numChildren : number;
        /**
        * @internal
        */
        public iRegisterEntity(displayObject: base.DisplayObject): void;
        /**
        * @internal
        */
        public iRegisterPartition(partition: partition.Partition): void;
        /**
        * @internal
        */
        public iUnregisterEntity(displayObject: base.DisplayObject): void;
        /**
        * @internal
        */
        public iUnregisterPartition(partition: partition.Partition): void;
    }
}
declare module away.containers {
    class View {
        public _pScene: Scene;
        public _pCamera: entities.Camera;
        public _pEntityCollector: traverse.ICollector;
        public _pRenderer: render.IRenderer;
        private _aspectRatio;
        private _width;
        private _height;
        private _time;
        private _deltaTime;
        private _backgroundColor;
        private _backgroundAlpha;
        private _viewportDirty;
        private _scissorDirty;
        private _onScenePartitionChangedDelegate;
        private _onProjectionChangedDelegate;
        private _onViewportUpdatedDelegate;
        private _onScissorUpdatedDelegate;
        private _mouseManager;
        private _mousePicker;
        private _htmlElement;
        private _shareContext;
        public _pMouseX: number;
        public _pMouseY: number;
        constructor(renderer: render.IRenderer, scene?: Scene, camera?: entities.Camera);
        /**
        *
        * @param e
        */
        private onScenePartitionChanged(e);
        public layeredView: boolean;
        public mouseX : number;
        public mouseY : number;
        /**
        *
        */
        public htmlElement : HTMLDivElement;
        /**
        *
        */
        public renderer : render.IRenderer;
        /**
        *
        */
        public shareContext : boolean;
        /**
        *
        */
        public backgroundColor : number;
        /**
        *
        * @returns {number}
        */
        /**
        *
        * @param value
        */
        public backgroundAlpha : number;
        /**
        *
        * @returns {Camera3D}
        */
        /**
        * Set camera that's used to render the scene for this viewport
        */
        public camera : entities.Camera;
        /**
        *
        * @returns {away.containers.Scene3D}
        */
        /**
        * Set the scene that's used to render for this viewport
        */
        public scene : Scene;
        /**
        *
        * @returns {number}
        */
        public deltaTime : number;
        /**
        *
        */
        public width : number;
        /**
        *
        */
        public height : number;
        /**
        *
        */
        public mousePicker : pick.IPicker;
        /**
        *
        */
        public x : number;
        /**
        *
        */
        public y : number;
        /**
        *
        */
        public visible : boolean;
        /**
        *
        * @returns {number}
        */
        public renderedFacesCount : number;
        /**
        * Renders the view.
        */
        public render(): void;
        /**
        *
        */
        public pUpdateTime(): void;
        /**
        *
        */
        public dispose(): void;
        /**
        *
        */
        public iEntityCollector : traverse.ICollector;
        /**
        *
        */
        private onProjectionChanged(event);
        /**
        *
        */
        private onViewportUpdated(event);
        /**
        *
        */
        private onScissorUpdated(event);
        public project(point3d: geom.Vector3D): geom.Vector3D;
        public unproject(sX: number, sY: number, sZ: number): geom.Vector3D;
        public getRay(sX: number, sY: number, sZ: number): geom.Vector3D;
        public forceMouseMove: boolean;
        public updateCollider(): void;
    }
}
declare module away.controllers {
    class ControllerBase {
        public _pAutoUpdate: boolean;
        public _pTargetObject: base.DisplayObject;
        constructor(targetObject?: base.DisplayObject);
        public pNotifyUpdate(): void;
        public targetObject : base.DisplayObject;
        public autoUpdate : boolean;
        public update(interpolate?: boolean): void;
    }
}
declare module away.controllers {
    class LookAtController extends ControllerBase {
        public _pLookAtPosition: geom.Vector3D;
        public _pLookAtObject: base.DisplayObject;
        public _pOrigin: geom.Vector3D;
        private _onLookAtObjectChangedDelegate;
        constructor(targetObject?: base.DisplayObject, lookAtObject?: base.DisplayObject);
        public lookAtPosition : geom.Vector3D;
        public lookAtObject : base.DisplayObject;
        public update(interpolate?: boolean): void;
        private onLookAtObjectChanged(event);
    }
}
declare module away.controllers {
    /**
    * Extended camera used to hover round a specified target object.
    *
    * @see    away.containers.View
    */
    class HoverController extends LookAtController {
        public _iCurrentPanAngle: number;
        public _iCurrentTiltAngle: number;
        private _panAngle;
        private _tiltAngle;
        private _distance;
        private _minPanAngle;
        private _maxPanAngle;
        private _minTiltAngle;
        private _maxTiltAngle;
        private _steps;
        private _yFactor;
        private _wrapPanAngle;
        private _upAxis;
        /**
        * Fractional step taken each time the <code>hover()</code> method is called. Defaults to 8.
        *
        * Affects the speed at which the <code>tiltAngle</code> and <code>panAngle</code> resolve to their targets.
        *
        * @see    #tiltAngle
        * @see    #panAngle
        */
        public steps : number;
        /**
        * Rotation of the camera in degrees around the y axis. Defaults to 0.
        */
        public panAngle : number;
        /**
        * Elevation angle of the camera in degrees. Defaults to 90.
        */
        public tiltAngle : number;
        /**
        * Distance between the camera and the specified target. Defaults to 1000.
        */
        public distance : number;
        /**
        * Minimum bounds for the <code>panAngle</code>. Defaults to -Infinity.
        *
        * @see    #panAngle
        */
        public minPanAngle : number;
        /**
        * Maximum bounds for the <code>panAngle</code>. Defaults to Infinity.
        *
        * @see    #panAngle
        */
        public maxPanAngle : number;
        /**
        * Minimum bounds for the <code>tiltAngle</code>. Defaults to -90.
        *
        * @see    #tiltAngle
        */
        public minTiltAngle : number;
        /**
        * Maximum bounds for the <code>tiltAngle</code>. Defaults to 90.
        *
        * @see    #tiltAngle
        */
        public maxTiltAngle : number;
        /**
        * Fractional difference in distance between the horizontal camera orientation and vertical camera orientation. Defaults to 2.
        *
        * @see    #distance
        */
        public yFactor : number;
        /**
        * Defines whether the value of the pan angle wraps when over 360 degrees or under 0 degrees. Defaults to false.
        */
        public wrapPanAngle : boolean;
        /**
        * Creates a new <code>HoverController</code> object.
        */
        constructor(targetObject?: base.DisplayObject, lookAtObject?: base.DisplayObject, panAngle?: number, tiltAngle?: number, distance?: number, minTiltAngle?: number, maxTiltAngle?: number, minPanAngle?: number, maxPanAngle?: number, steps?: number, yFactor?: number, wrapPanAngle?: boolean);
        /**
        * Updates the current tilt angle and pan angle values.
        *
        * Values are calculated using the defined <code>tiltAngle</code>, <code>panAngle</code> and <code>steps</code> variables.
        *
        * @param interpolate   If the update to a target pan- or tiltAngle is interpolated. Default is true.
        *
        * @see    #tiltAngle
        * @see    #panAngle
        * @see    #steps
        */
        public update(interpolate?: boolean): void;
    }
}
declare module away.controllers {
    /**
    * Extended camera used to hover round a specified target object.
    *
    * @see    away3d.containers.View3D
    */
    class FirstPersonController extends ControllerBase {
        public _iCurrentPanAngle: number;
        public _iCurrentTiltAngle: number;
        private _panAngle;
        private _tiltAngle;
        private _minTiltAngle;
        private _maxTiltAngle;
        private _steps;
        private _walkIncrement;
        private _strafeIncrement;
        private _wrapPanAngle;
        public fly: boolean;
        /**
        * Fractional step taken each time the <code>hover()</code> method is called. Defaults to 8.
        *
        * Affects the speed at which the <code>tiltAngle</code> and <code>panAngle</code> resolve to their targets.
        *
        * @see    #tiltAngle
        * @see    #panAngle
        */
        public steps : number;
        /**
        * Rotation of the camera in degrees around the y axis. Defaults to 0.
        */
        public panAngle : number;
        /**
        * Elevation angle of the camera in degrees. Defaults to 90.
        */
        public tiltAngle : number;
        /**
        * Minimum bounds for the <code>tiltAngle</code>. Defaults to -90.
        *
        * @see    #tiltAngle
        */
        public minTiltAngle : number;
        /**
        * Maximum bounds for the <code>tiltAngle</code>. Defaults to 90.
        *
        * @see    #tiltAngle
        */
        public maxTiltAngle : number;
        /**
        * Defines whether the value of the pan angle wraps when over 360 degrees or under 0 degrees. Defaults to false.
        */
        public wrapPanAngle : boolean;
        /**
        * Creates a new <code>HoverController</code> object.
        */
        constructor(targetObject?: base.DisplayObject, panAngle?: number, tiltAngle?: number, minTiltAngle?: number, maxTiltAngle?: number, steps?: number, wrapPanAngle?: boolean);
        /**
        * Updates the current tilt angle and pan angle values.
        *
        * Values are calculated using the defined <code>tiltAngle</code>, <code>panAngle</code> and <code>steps</code> variables.
        *
        * @param interpolate   If the update to a target pan- or tiltAngle is interpolated. Default is true.
        *
        * @see    #tiltAngle
        * @see    #panAngle
        * @see    #steps
        */
        public update(interpolate?: boolean): void;
        public incrementWalk(val: number): void;
        public incrementStrafe(val: number): void;
    }
}
declare module away.controllers {
    /**
    * Controller used to follow behind an object on the XZ plane, with an optional
    * elevation (tiltAngle).
    *
    * @see    away3d.containers.View3D
    */
    class FollowController extends HoverController {
        constructor(targetObject?: base.DisplayObject, lookAtObject?: base.DisplayObject, tiltAngle?: number, distance?: number);
        public update(interpolate?: boolean): void;
    }
}
declare module away.controllers {
    /**
    * Uses spring physics to animate the target object towards a position that is
    * defined as the lookAtTarget object's position plus the vector defined by the
    * positionOffset property.
    */
    class SpringController extends LookAtController {
        private _velocity;
        private _dv;
        private _stretch;
        private _force;
        private _acceleration;
        private _desiredPosition;
        /**
        * Stiffness of the spring, how hard is it to extend. The higher it is, the more "fixed" the cam will be.
        * A number between 1 and 20 is recommended.
        */
        public stiffness: number;
        /**
        * Damping is the spring internal friction, or how much it resists the "boinggggg" effect. Too high and you'll lose it!
        * A number between 1 and 20 is recommended.
        */
        public damping: number;
        /**
        * Mass of the camera, if over 120 and it'll be very heavy to move.
        */
        public mass: number;
        /**
        * Offset of spring center from target in target object space, ie: Where the camera should ideally be in the target object space.
        */
        public positionOffset: geom.Vector3D;
        constructor(targetObject?: base.DisplayObject, lookAtObject?: base.DisplayObject, stiffness?: number, mass?: number, damping?: number);
        public update(interpolate?: boolean): void;
    }
}
declare module away.materials {
    /**
    * LightPickerBase provides an abstract base clase for light picker classes. These classes are responsible for
    * feeding materials with relevant lights. Usually, StaticLightPicker can be used, but LightPickerBase can be
    * extended to provide more application-specific dynamic selection of lights.
    *
    * @see StaticLightPicker
    */
    class LightPickerBase extends library.NamedAssetBase implements library.IAsset {
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumCastingPointLights: number;
        public _pNumCastingDirectionalLights: number;
        public _pNumLightProbes: number;
        public _pAllPickedLights: base.LightBase[];
        public _pPointLights: entities.PointLight[];
        public _pCastingPointLights: entities.PointLight[];
        public _pDirectionalLights: entities.DirectionalLight[];
        public _pCastingDirectionalLights: entities.DirectionalLight[];
        public _pLightProbes: entities.LightProbe[];
        public _pLightProbeWeights: number[];
        /**
        * Creates a new LightPickerBase object.
        */
        constructor();
        /**
        * Disposes resources used by the light picker.
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * The maximum amount of directional lights that will be provided.
        */
        public numDirectionalLights : number;
        /**
        * The maximum amount of point lights that will be provided.
        */
        public numPointLights : number;
        /**
        * The maximum amount of directional lights that cast shadows.
        */
        public numCastingDirectionalLights : number;
        /**
        * The amount of point lights that cast shadows.
        */
        public numCastingPointLights : number;
        /**
        * The maximum amount of light probes that will be provided.
        */
        public numLightProbes : number;
        /**
        * The collected point lights to be used for shading.
        */
        public pointLights : entities.PointLight[];
        /**
        * The collected directional lights to be used for shading.
        */
        public directionalLights : entities.DirectionalLight[];
        /**
        * The collected point lights that cast shadows to be used for shading.
        */
        public castingPointLights : entities.PointLight[];
        /**
        * The collected directional lights that cast shadows to be used for shading.
        */
        public castingDirectionalLights : entities.DirectionalLight[];
        /**
        * The collected light probes to be used for shading.
        */
        public lightProbes : entities.LightProbe[];
        /**
        * The weights for each light probe, defining their influence on the object.
        */
        public lightProbeWeights : number[];
        /**
        * A collection of all the collected lights.
        */
        public allPickedLights : base.LightBase[];
        /**
        * Updates set of lights for a given renderable and EntityCollector. Always call super.collectLights() after custom overridden code.
        */
        public collectLights(renderable: pool.IRenderable, entityCollector: traverse.ICollector): void;
        /**
        * Updates the weights for the light probes, based on the renderable's position relative to them.
        * @param renderable The renderble for which to calculate the light probes' influence.
        */
        private updateProbeWeights(renderable);
    }
}
declare module away.materials {
    /**
    * StaticLightPicker is a light picker that provides a static set of lights. The lights can be reassigned, but
    * if the configuration changes (number of directional lights, point lights, etc), a material recompilation may
    * occur.
    */
    class StaticLightPicker extends LightPickerBase {
        private _lights;
        private _onCastShadowChangeDelegate;
        /**
        * Creates a new StaticLightPicker object.
        * @param lights The lights to be used for shading.
        */
        constructor(lights: any);
        /**
        * The lights used for shading.
        */
        public lights : any[];
        /**
        * Remove configuration change listeners on the lights.
        */
        private clearListeners();
        /**
        * Notifies the material of a configuration change.
        */
        private onCastShadowChange(event);
        /**
        * Called when a directional light's shadow casting configuration changes.
        */
        private updateDirectionalCasting(light);
        /**
        * Called when a point light's shadow casting configuration changes.
        */
        private updatePointCasting(light);
    }
}
declare module away.materials {
    /**
    * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
    * a render call per required renderable.
    */
    interface IMaterialPass extends events.IEventDispatcher {
        /**
        *
        */
        _iPasses: IMaterialPass[];
        /**
        *
        */
        _iProgramids: number[];
        /**
        * The material to which this pass belongs.
        */
        material: MaterialBase;
        /**
        * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
        */
        writeDepth: boolean;
        /**
        * Defines whether any used textures should use mipmapping.
        */
        mipmap: boolean;
        /**
        * Defines whether smoothing should be applied to any used textures.
        */
        smooth: boolean;
        /**
        * Defines whether textures should be tiled.
        */
        repeat: boolean;
        /**
        * Defines whether or not the material should perform backface culling.
        */
        bothSides: boolean;
        /**
        * Returns the animation data set adding animations to the material.
        */
        animationSet: animators.IAnimationSet;
        /**
        * Specifies whether this pass renders to texture
        */
        renderToTexture: boolean;
        /**
        * Cleans up any resources used by the current object.
        * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
        */
        dispose(): any;
        /**
        * Sets up the animation state. This needs to be called before render()
        *
        * @private
        */
        iUpdateAnimationState(renderable: pool.IRenderable, stage: base.Stage, camera: entities.Camera): any;
        /**
        * Renders an object to the current render target.
        *
        * @private
        */
        iRender(renderable: pool.IRenderable, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): any;
        /**
        * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
        * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
        * @param stage The Stage object which is currently used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @private
        */
        iActivate(stage: base.Stage, camera: entities.Camera): any;
        /**
        * Clears the render state for the pass. This needs to be called before activating another pass.
        * @param stage The Stage used for rendering
        *
        * @private
        */
        iDeactivate(stage: base.Stage): any;
        /**
        * Marks the shader program as invalid, so it will be recompiled before the next render.
        *
        * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
        */
        iInvalidateShaderProgram(updateMaterial?: boolean): any;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see away.materials.LightPickerBase
        * @see away.materials.StaticLightPicker
        */
        lightPicker: LightPickerBase;
        /**
        * Indicates whether visible textures (or other pixels) used by this material have
        * already been premultiplied. Toggle this if you are seeing black halos around your
        * blended alpha edges.
        */
        alphaPremultiplied: boolean;
    }
}
declare module away.materials {
    /**
    * MaterialBase forms an abstract base class for any material.
    * A material consists of several passes, each of which constitutes at least one render call. Several passes could
    * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
    * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
    * subsurface scattering, or rendering a depth map for specialized self-shadowing).
    *
    * Away3D provides default materials trough SinglePassMaterialBase and TriangleMaterial, which use modular
    * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
    * shaders, or entire new material frameworks.
    */
    class MaterialBase extends library.NamedAssetBase implements library.IAsset {
        /**
        * An object to contain any extra data.
        */
        public extra: Object;
        /**
        * A value that can be used by materials that only work with a given type of renderer. The renderer can test the
        * classification to choose which render path to use. For example, a deferred material could set this value so
        * that the deferred renderer knows not to take the forward rendering path.
        *
        * @private
        */
        public _iClassification: string;
        /**
        * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
        *
        * @private
        */
        public _iMaterialId: number;
        /**
        * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
        *
        * @private
        */
        public _iRenderOrderId: number;
        public _iBaseScreenPassIndex: number;
        private _bothSides;
        private _animationSet;
        public _pScreenPassesInvalid: boolean;
        /**
        * A list of material owners, renderables or custom Entities.
        */
        private _owners;
        private _alphaPremultiplied;
        public _pBlendMode: string;
        private _numPasses;
        private _passes;
        public _pMipmap: boolean;
        private _smooth;
        private _repeat;
        public _pLightPicker: LightPickerBase;
        public _pHeight: number;
        public _pWidth: number;
        public _pRequiresBlending: boolean;
        private _onPassChangeDelegate;
        private _onLightChangeDelegate;
        /**
        * Creates a new MaterialBase object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        *
        */
        public height : number;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see LightPickerBase
        * @see StaticLightPicker
        */
        public lightPicker : LightPickerBase;
        /**
        * Indicates whether or not any used textures should use mipmapping. Defaults to true.
        */
        public mipmap : boolean;
        /**
        * Indicates whether or not any used textures should use smoothing.
        */
        public smooth : boolean;
        /**
        * Indicates whether or not any used textures should be tiled. If set to false, texture samples are clamped to
        * the texture's borders when the uv coordinates are outside the [0, 1] interval.
        */
        public repeat : boolean;
        /**
        * Cleans up resources owned by the material, including passes. Textures are not owned by the material since they
        * could be used by other materials and will not be disposed.
        */
        public dispose(): void;
        /**
        * Defines whether or not the material should cull triangles facing away from the camera.
        */
        public bothSides : boolean;
        /**
        * The blend mode to use when drawing this renderable. The following blend modes are supported:
        * <ul>
        * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
        * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
        * <li>BlendMode.MULTIPLY</li>
        * <li>BlendMode.ADD</li>
        * <li>BlendMode.ALPHA</li>
        * </ul>
        */
        public blendMode : string;
        /**
        * Indicates whether visible textures (or other pixels) used by this material have
        * already been premultiplied. Toggle this if you are seeing black halos around your
        * blended alpha edges.
        */
        public alphaPremultiplied : boolean;
        /**
        * Indicates whether or not the material requires alpha blending during rendering.
        */
        public requiresBlending : boolean;
        /**
        *
        */
        public width : number;
        /**
        * The amount of passes used by the material.
        *
        * @private
        */
        public _iNumPasses : number;
        /**
        * Indicates whether or not the pass with the given index renders to texture or not.
        * @param index The index of the pass.
        * @return True if the pass renders to texture, false otherwise.
        *
        * @internal
        */
        public iPassRendersToTexture(index: number): boolean;
        /**
        * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
        * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
        * @param index The index of the pass to activate.
        * @param stage The Stage object which is currently used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @private
        */
        public iActivatePass(index: number, stage: base.Stage, camera: entities.Camera): void;
        /**
        * Clears the render state for a pass. This needs to be called before activating another pass.
        * @param index The index of the pass to deactivate.
        * @param stage The Stage used for rendering
        *
        * @internal
        */
        public iDeactivatePass(index: number, stage: base.Stage): void;
        /**
        * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
        * @param index The index of the pass used to render the renderable.
        * @param renderable The IRenderable object to draw.
        * @param stage The Stage object used for rendering.
        * @param entityCollector The EntityCollector object that contains the visible scene data.
        * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
        * camera.viewProjection as it includes the scaling factors when rendering to textures.
        *
        * @internal
        */
        public iRenderPass(index: number, renderable: pool.IRenderable, stage: base.Stage, entityCollector: traverse.ICollector, viewProjection: geom.Matrix3D): void;
        /**
        * Mark an IMaterialOwner as owner of this material.
        * Assures we're not using the same material across renderables with different animations, since the
        * Programs depend on animation. This method needs to be called when a material is assigned.
        *
        * @param owner The IMaterialOwner that had this material assigned
        *
        * @internal
        */
        public iAddOwner(owner: base.IMaterialOwner): void;
        /**
        * Removes an IMaterialOwner as owner.
        * @param owner
        *
        * @internal
        */
        public iRemoveOwner(owner: base.IMaterialOwner): void;
        /**
        * A list of the IMaterialOwners that use this material
        *
        * @private
        */
        public iOwners : base.IMaterialOwner[];
        /**
        * Performs any processing that needs to occur before any of its passes are used.
        *
        * @private
        */
        public iUpdateMaterial(): void;
        /**
        * Deactivates the last pass of the material.
        *
        * @private
        */
        public iDeactivate(stage: base.Stage): void;
        /**
        * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
        * @param triggerPass The pass triggering the invalidation, if any. This is passed to prevent invalidating the
        * triggering pass, which would result in an infinite loop.
        *
        * @private
        */
        public iInvalidatePasses(triggerPass: IMaterialPass): void;
        /**
        * Removes a pass from the material.
        * @param pass The pass to be removed.
        */
        public pRemovePass(pass: IMaterialPass): void;
        /**
        * Removes all passes from the material
        */
        public pClearPasses(): void;
        /**
        * Adds a pass to the material
        * @param pass
        */
        public pAddPass(pass: IMaterialPass): void;
        /**
        * Adds any additional passes on which the given pass is dependent.
        * @param pass The pass that my need additional passes.
        */
        public pAddChildPassesFor(pass: IMaterialPass): void;
        /**
        * Listener for when a pass's shader code changes. It recalculates the render order id.
        */
        private onPassChange(event);
        /**
        * Flags that the screen passes have become invalid.
        */
        public pInvalidateScreenPasses(): void;
        /**
        * Called when the light picker's configuration changed.
        */
        private onLightsChange(event);
    }
}
declare module away.materials {
    /**
    * MaterialBase forms an abstract base class for any material.
    * A material consists of several passes, each of which constitutes at least one render call. Several passes could
    * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
    * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
    * subsurface scattering, or rendering a depth map for specialized self-shadowing).
    *
    * Away3D provides default materials trough SinglePassMaterialBase and MultiPassMaterialBase, which use modular
    * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
    * shaders, or entire new material frameworks.
    */
    class CSSMaterialBase extends MaterialBase {
        private _sizeChanged;
        private _imageElement;
        private _imageStyle;
        private _texture;
        public imageElement : HTMLImageElement;
        public imageStyle : MSStyleCSSProperties;
        /**
        * The texture object to use for the albedo colour.
        */
        public texture : textures.Texture2DBase;
        /**
        * Creates a new MaterialBase object.
        */
        constructor(texture?: textures.Texture2DBase, smooth?: boolean, repeat?: boolean);
        private notifySizeChanged();
    }
}
declare module away.prefabs {
    /**
    * PrefabBase is an abstract base class for prefabs, which are prebuilt display objects that allow easy cloning and updating
    */
    class PrefabBase extends library.NamedAssetBase {
        public _pObjects: base.DisplayObject[];
        /**
        * Creates a new PrefabBase object.
        */
        constructor();
        /**
        * Returns a display object generated from this prefab
        */
        public getNewObject(): base.DisplayObject;
        public _pCreateObject(): base.DisplayObject;
        public _iValidate(): void;
    }
}
declare module away.prefabs {
    /**
    * PrimitivePrefabBase is an abstract base class for polytope prefabs, which are simple pre-built geometric shapes
    */
    class PrimitivePrefabBase extends PrefabBase {
        public _geomDirty: boolean;
        public _uvDirty: boolean;
        private _material;
        private _geometry;
        private _subGeometry;
        private _geometryType;
        private _geometryTypeDirty;
        /**
        *
        */
        public assetType : string;
        /**
        *
        */
        public geometryType : string;
        public geometry : base.Geometry;
        /**
        * The material with which to render the primitive.
        */
        public material : materials.MaterialBase;
        /**
        * Creates a new PrimitivePrefabBase object.
        *
        * @param material The material with which to render the object
        */
        constructor(material?: materials.MaterialBase, geometryType?: string);
        /**
        * Builds the primitive's geometry when invalid. This method should not be called directly. The calling should
        * be triggered by the invalidateGeometry method (and in turn by updateGeometry).
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * Builds the primitive's uv coordinates when invalid. This method should not be called directly. The calling
        * should be triggered by the invalidateUVs method (and in turn by updateUVs).
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * Invalidates the primitive's geometry type, causing it to be updated when requested.
        */
        public invalidateGeometryType(): void;
        /**
        * Invalidates the primitive's geometry, causing it to be updated when requested.
        */
        public _pInvalidateGeometry(): void;
        /**
        * Invalidates the primitive's uv coordinates, causing them to be updated when requested.
        */
        public _pInvalidateUVs(): void;
        /**
        * Updates the subgeometry when invalid.
        */
        private updateGeometryType();
        /**
        * Updates the geometry when invalid.
        */
        private updateGeometry();
        /**
        * Updates the uv coordinates when invalid.
        */
        private updateUVs();
        public _iValidate(): void;
        public _pCreateObject(): base.DisplayObject;
    }
}
declare module away.prefabs {
    /**
    * A UV Cylinder primitive mesh.
    */
    class PrimitiveTorusPrefab extends PrimitivePrefabBase implements library.IAsset {
        private _radius;
        private _tubeRadius;
        private _segmentsR;
        private _segmentsT;
        private _yUp;
        private _numVertices;
        /**
        * The radius of the torus.
        */
        public radius : number;
        /**
        * The radius of the inner tube of the torus.
        */
        public tubeRadius : number;
        /**
        * Defines the number of horizontal segments that make up the torus. Defaults to 16.
        */
        public segmentsR : number;
        /**
        * Defines the number of vertical segments that make up the torus. Defaults to 8.
        */
        public segmentsT : number;
        /**
        * Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
        /**
        * Creates a new <code>Torus</code> object.
        * @param radius The radius of the torus.
        * @param tuebRadius The radius of the inner tube of the torus.
        * @param segmentsR Defines the number of horizontal segments that make up the torus.
        * @param segmentsT Defines the number of vertical segments that make up the torus.
        * @param yUp Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, tubeRadius?: number, segmentsR?: number, segmentsT?: number, yUp?: boolean);
        /**
        * @inheritDoc
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * @inheritDoc
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
    }
}
declare module away.prefabs {
    /**
    * A Cube primitive prefab.
    */
    class PrimitiveCubePrefab extends PrimitivePrefabBase implements library.IAsset {
        private _width;
        private _height;
        private _depth;
        private _tile6;
        private _segmentsW;
        private _segmentsH;
        private _segmentsD;
        /**
        * Creates a new Cube object.
        * @param width The size of the cube along its X-axis.
        * @param height The size of the cube along its Y-axis.
        * @param depth The size of the cube along its Z-axis.
        * @param segmentsW The number of segments that make up the cube along the X-axis.
        * @param segmentsH The number of segments that make up the cube along the Y-axis.
        * @param segmentsD The number of segments that make up the cube along the Z-axis.
        * @param tile6 The type of uv mapping to use. When true, a texture will be subdivided in a 2x3 grid, each used for a single face. When false, the entire image is mapped on each face.
        */
        constructor(width?: number, height?: number, depth?: number, segmentsW?: number, segmentsH?: number, segmentsD?: number, tile6?: boolean);
        /**
        * The size of the cube along its X-axis.
        */
        public width : number;
        /**
        * The size of the cube along its Y-axis.
        */
        public height : number;
        /**
        * The size of the cube along its Z-axis.
        */
        public depth : number;
        /**
        * The type of uv mapping to use. When false, the entire image is mapped on each face.
        * When true, a texture will be subdivided in a 3x2 grid, each used for a single face.
        * Reading the tiles from left to right, top to bottom they represent the faces of the
        * cube in the following order: bottom, top, back, left, front, right. This creates
        * several shared edges (between the top, front, left and right faces) which simplifies
        * texture painting.
        */
        public tile6 : boolean;
        /**
        * The number of segments that make up the cube along the X-axis. Defaults to 1.
        */
        public segmentsW : number;
        /**
        * The number of segments that make up the cube along the Y-axis. Defaults to 1.
        */
        public segmentsH : number;
        /**
        * The number of segments that make up the cube along the Z-axis. Defaults to 1.
        */
        public segmentsD : number;
        /**
        * @inheritDoc
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * @inheritDoc
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
    }
}
declare module away.prefabs {
    /**
    * A Plane primitive mesh.
    */
    class PrimitivePlanePrefab extends PrimitivePrefabBase implements library.IAsset {
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        private _width;
        private _height;
        private _doubleSided;
        /**
        * Creates a new Plane object.
        * @param width The width of the plane.
        * @param height The height of the plane.
        * @param segmentsW The number of segments that make up the plane along the X-axis.
        * @param segmentsH The number of segments that make up the plane along the Y or Z-axis.
        * @param yUp Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false).
        * @param doubleSided Defines whether the plane will be visible from both sides, with correct vertex normals.
        */
        constructor(width?: number, height?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean, doubleSided?: boolean);
        /**
        * The number of segments that make up the plane along the X-axis. Defaults to 1.
        */
        public segmentsW : number;
        /**
        * The number of segments that make up the plane along the Y or Z-axis, depending on whether yUp is true or
        * false, respectively. Defaults to 1.
        */
        public segmentsH : number;
        /**
        *  Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false). Defaults to true.
        */
        public yUp : boolean;
        /**
        * Defines whether the plane will be visible from both sides, with correct vertex normals (as opposed to bothSides on Material). Defaults to false.
        */
        public doubleSided : boolean;
        /**
        * The width of the plane.
        */
        public width : number;
        /**
        * The height of the plane.
        */
        public height : number;
        /**
        * @inheritDoc
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * @inheritDoc
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
    }
}
declare module away.prefabs {
    /**
    * A Capsule primitive mesh.
    */
    class PrimitiveCapsulePrefab extends PrimitivePrefabBase implements library.IAsset {
        private _radius;
        private _height;
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        private _numVertices;
        /**
        * The radius of the capsule.
        */
        public radius : number;
        /**
        * The height of the capsule.
        */
        public height : number;
        /**
        * Defines the number of horizontal segments that make up the capsule. Defaults to 16.
        */
        public segmentsW : number;
        /**
        * Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven.
        */
        public segmentsH : number;
        /**
        * Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
        /**
        * Creates a new Capsule object.
        * @param radius The radius of the capsule.
        * @param height The height of the capsule.
        * @param segmentsW Defines the number of horizontal segments that make up the capsule. Defaults to 16.
        * @param segmentsH Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven value.
        * @param yUp Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, height?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean);
        /**
        * @inheritDoc
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * @inheritDoc
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
    }
}
declare module away.prefabs {
    /**
    * A Cylinder primitive mesh.
    */
    class PrimitiveCylinderPrefab extends PrimitivePrefabBase implements library.IAsset {
        public _pBottomRadius: number;
        public _pSegmentsW: number;
        public _pSegmentsH: number;
        private _topRadius;
        private _height;
        private _topClosed;
        private _bottomClosed;
        private _surfaceClosed;
        private _yUp;
        private _numVertices;
        /**
        * The radius of the top end of the cylinder.
        */
        public topRadius : number;
        /**
        * The radius of the bottom end of the cylinder.
        */
        public bottomRadius : number;
        /**
        * The radius of the top end of the cylinder.
        */
        public height : number;
        /**
        * Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
        */
        public segmentsW : number;
        public setSegmentsW(value: number): void;
        /**
        * Defines the number of vertical segments that make up the cylinder. Defaults to 1.
        */
        public segmentsH : number;
        public setSegmentsH(value: number): void;
        /**
        * Defines whether the top end of the cylinder is closed (true) or open.
        */
        public topClosed : boolean;
        /**
        * Defines whether the bottom end of the cylinder is closed (true) or open.
        */
        public bottomClosed : boolean;
        /**
        * Defines whether the cylinder poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
        /**
        * Creates a new Cylinder object.
        * @param topRadius The radius of the top end of the cylinder.
        * @param bottomRadius The radius of the bottom end of the cylinder
        * @param height The radius of the bottom end of the cylinder
        * @param segmentsW Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
        * @param segmentsH Defines the number of vertical segments that make up the cylinder. Defaults to 1.
        * @param topClosed Defines whether the top end of the cylinder is closed (true) or open.
        * @param bottomClosed Defines whether the bottom end of the cylinder is closed (true) or open.
        * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(topRadius?: number, bottomRadius?: number, height?: number, segmentsW?: number, segmentsH?: number, topClosed?: boolean, bottomClosed?: boolean, surfaceClosed?: boolean, yUp?: boolean);
        /**
        * @inheritDoc
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * @inheritDoc
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
    }
}
declare module away.prefabs {
    /**
    * A UV Cone primitive mesh.
    */
    class PrimitiveConePrefab extends PrimitiveCylinderPrefab implements library.IAsset {
        /**
        * The radius of the bottom end of the cone.
        */
        public radius : number;
        /**
        * Creates a new Cone object.
        * @param radius The radius of the bottom end of the cone
        * @param height The height of the cone
        * @param segmentsW Defines the number of horizontal segments that make up the cone. Defaults to 16.
        * @param segmentsH Defines the number of vertical segments that make up the cone. Defaults to 1.
        * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, height?: number, segmentsW?: number, segmentsH?: number, closed?: boolean, yUp?: boolean);
    }
}
declare module away.prefabs {
    /**
    * A UV RegularPolygon primitive mesh.
    */
    class PrimitivePolygonPrefab extends PrimitiveCylinderPrefab implements library.IAsset {
        /**
        * The radius of the regular polygon.
        */
        public radius : number;
        /**
        * The number of sides of the regular polygon.
        */
        public sides : number;
        /**
        * The number of subdivisions from the edge to the center of the regular polygon.
        */
        public subdivisions : number;
        /**
        * Creates a new RegularPolygon disc object.
        * @param radius The radius of the regular polygon
        * @param sides Defines the number of sides of the regular polygon.
        * @param yUp Defines whether the regular polygon should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, sides?: number, yUp?: boolean);
    }
}
declare module away.prefabs {
    /**
    * A UV Sphere primitive mesh.
    */
    class PrimitiveSpherePrefab extends PrimitivePrefabBase implements library.IAsset {
        private _radius;
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        /**
        * The radius of the sphere.
        */
        public radius : number;
        /**
        * Defines the number of horizontal segments that make up the sphere. Defaults to 16.
        */
        public segmentsW : number;
        /**
        * Defines the number of vertical segments that make up the sphere. Defaults to 12.
        */
        public segmentsH : number;
        /**
        * Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
        /**
        * Creates a new Sphere object.
        *
        * @param radius The radius of the sphere.
        * @param segmentsW Defines the number of horizontal segments that make up the sphere.
        * @param segmentsH Defines the number of vertical segments that make up the sphere.
        * @param yUp Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean);
        /**
        * @inheritDoc
        */
        public _pBuildGeometry(target: base.SubGeometryBase, geometryType: string): void;
        /**
        * @inheritDoc
        */
        public _pBuildUVs(target: base.SubGeometryBase, geometryType: string): void;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for nodes in an animation blend tree.
    */
    class AnimationNodeBase extends library.NamedAssetBase implements library.IAsset {
        public _pStateClass: any;
        public stateClass : any;
        /**
        * Creates a new <code>AnimationNodeBase</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
    }
}
declare module away.animators {
    /**
    * Provides an interface for data set classes that hold animation data for use in animator classes.
    *
    * @see away3d.animators.AnimatorBase
    */
    interface IAnimationSet extends library.IAsset {
        /**
        * Check to determine whether a state is registered in the animation set under the given name.
        *
        * @param stateName The name of the animation state object to be checked.
        */
        hasAnimation(name: string): boolean;
        /**
        * Retrieves the animation state object registered in the animation data set under the given name.
        *
        * @param stateName The name of the animation state object to be retrieved.
        */
        getAnimation(name: string): AnimationNodeBase;
        /**
        * Indicates whether the properties of the animation data contained within the set combined with
        * the vertex registers aslready in use on shading materials allows the animation data to utilise
        * GPU calls.
        */
        usesCPU: boolean;
        /**
        * Called by the material to reset the GPU indicator before testing whether register space in the shader
        * is available for running GPU-based animation code.
        *
        * @private
        */
        resetGPUCompatibility(): any;
        /**
        * Called by the animator to void the GPU indicator when register space in the shader
        * is no longer available for running GPU-based animation code.
        *
        * @private
        */
        cancelGPUCompatibility(): any;
    }
}
declare module away.animators {
    /**
    * Provides an interface for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
    *
    * @see away.animators.IAnimationSet
    */
    interface IAnimator extends library.IAsset {
        /**
        *
        */
        animationSet: IAnimationSet;
        /**
        *
        */
        clone(): IAnimator;
        /**
        *
        */
        dispose(): any;
        /**
        * Used by the entity object to which the animator is applied, registers the owner for internal use.
        *
        * @private
        */
        addOwner(mesh: entities.IEntity): any;
        /**
        * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
        *
        * @private
        */
        removeOwner(mesh: entities.IEntity): any;
        /**
        * //TODO
        *
        * @param sourceSubGeometry
        */
        getRenderableSubGeometry(renderable: pool.IRenderable, sourceSubGeometry: base.SubGeometryBase): base.SubGeometryBase;
        /**
        *
        * @param pass
        */
        testGPUCompatibility(pass: materials.IMaterialPass): any;
    }
}
declare module away {
    class AwayJSCore extends events.EventDispatcher {
        constructor();
    }
}
