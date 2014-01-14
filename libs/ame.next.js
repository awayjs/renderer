///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (errors) {
        var Error = (function () {
            function Error(message, id, _name) {
                if (typeof message === "undefined") { message = ''; }
                if (typeof id === "undefined") { id = 0; }
                if (typeof _name === "undefined") { _name = ''; }
                this._errorID = 0;
                this._messsage = '';
                this._name = '';
                this._messsage = message;
                this._name = name;
                this._errorID = id;
            }
            Object.defineProperty(Error.prototype, "message", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this._messsage;
                },
                /**
                *
                * @param value
                */
                set: function (value) {
                    this._messsage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Error.prototype, "name", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this._name;
                },
                /**
                *
                * @param value
                */
                set: function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Error.prototype, "errorID", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._errorID;
                },
                enumerable: true,
                configurable: true
            });
            return Error;
        })();
        errors.Error = Error;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var away;
(function (away) {
    (function (errors) {
        /**
        * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
        * by a concrete subclass.
        */
        var ArgumentError = (function (_super) {
            __extends(ArgumentError, _super);
            /**
            * Create a new AbstractMethodError.
            * @param message An optional message to override the default error message.
            * @param id The id of the error.
            */
            function ArgumentError(message, id) {
                if (typeof message === "undefined") { message = null; }
                if (typeof id === "undefined") { id = 0; }
                _super.call(this, message || "ArgumentError", id);
            }
            return ArgumentError;
        })(away.errors.Error);
        errors.ArgumentError = ArgumentError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (errors) {
        /**
        * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
        * by a concrete subclass.
        */
        var PartialImplementationError = (function (_super) {
            __extends(PartialImplementationError, _super);
            /**
            * Create a new AbstractMethodError.
            * @param message An optional message to override the default error message.
            * @param id The id of the error.
            */
            function PartialImplementationError(dependency, id) {
                if (typeof dependency === "undefined") { dependency = ''; }
                if (typeof id === "undefined") { id = 0; }
                _super.call(this, "PartialImplementationError - this function is in development. Required Dependency: " + dependency, id);
            }
            return PartialImplementationError;
        })(away.errors.Error);
        errors.PartialImplementationError = PartialImplementationError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (errors) {
        /**
        * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
        * by a concrete subclass.
        */
        var AbstractMethodError = (function (_super) {
            __extends(AbstractMethodError, _super);
            /**
            * Create a new AbstractMethodError.
            * @param message An optional message to override the default error message.
            * @param id The id of the error.
            */
            function AbstractMethodError(message, id) {
                if (typeof message === "undefined") { message = null; }
                if (typeof id === "undefined") { id = 0; }
                _super.call(this, message || "An abstract method was called! Either an instance of an abstract class was created, or an abstract method was not overridden by the subclass.", id);
            }
            return AbstractMethodError;
        })(away.errors.Error);
        errors.AbstractMethodError = AbstractMethodError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (errors) {
        var DocumentError = (function (_super) {
            __extends(DocumentError, _super);
            function DocumentError(message, id) {
                if (typeof message === "undefined") { message = "DocumentError"; }
                if (typeof id === "undefined") { id = 0; }
                _super.call(this, message, id);
            }
            DocumentError.DOCUMENT_DOES_NOT_EXIST = "documentDoesNotExist";
            return DocumentError;
        })(away.errors.Error);
        errors.DocumentError = DocumentError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * Base event class
    * @class away.events.Event
    */
    (function (events) {
        var Event = (function () {
            function Event(type) {
                /**
                * Type of event
                * @property type
                * @type String
                */
                this.type = undefined;
                /**
                * Reference to target object
                * @property target
                * @type Object
                */
                this.target = undefined;
                this.type = type;
            }
            /**
            * Clones the current event.
            * @return An exact duplicate of the current event.
            */
            Event.prototype.clone = function () {
                return new Event(this.type);
            };
            Event.COMPLETE = 'Event_Complete';
            Event.OPEN = 'Event_Open';

            Event.ENTER_FRAME = 'enterframe';
            Event.EXIT_FRAME = 'exitframe';

            Event.RESIZE = "resize";
            Event.CONTEXTGL_CREATE = "contextGLCreate";
            Event.ERROR = "error";
            Event.CHANGE = "change";
            return Event;
        })();
        events.Event = Event;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        /**
        * Base class for dispatching events
        *
        * @class away.events.EventDispatcher
        *
        */
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this.listeners = new Array();
            }
            /**
            * Add an event listener
            * @method addEventListener
            * @param {String} Name of event to add a listener for
            * @param {Function} Callback function
            * @param {Object} Target object listener is added to
            */
            EventDispatcher.prototype.addEventListener = function (type, listener, target) {
                if (this.listeners[type] === undefined) {
                    this.listeners[type] = new Array();
                }

                if (this.getEventListenerIndex(type, listener, target) === -1) {
                    var d = new EventData();
                    d.listener = listener;
                    d.type = type;
                    d.target = target;

                    this.listeners[type].push(d);
                }
            };

            /**
            * Remove an event listener
            * @method removeEventListener
            * @param {String} Name of event to remove a listener for
            * @param {Function} Callback function
            * @param {Object} Target object listener is added to
            */
            EventDispatcher.prototype.removeEventListener = function (type, listener, target) {
                var index = this.getEventListenerIndex(type, listener, target);

                if (index !== -1) {
                    this.listeners[type].splice(index, 1);
                }
            };

            /**
            * Dispatch an event
            * @method dispatchEvent
            * @param {Event} Event to dispatch
            */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var listenerArray = this.listeners[event.type];

                if (listenerArray !== undefined) {
                    this.lFncLength = listenerArray.length;
                    event.target = this;

                    var eventData;

                    for (var i = 0, l = this.lFncLength; i < l; i++) {
                        eventData = listenerArray[i];
                        eventData.listener.call(eventData.target, event);
                    }
                }
            };

            /**
            * get Event Listener Index in array. Returns -1 if no listener is added
            * @method getEventListenerIndex
            * @param {String} Name of event to remove a listener for
            * @param {Function} Callback function
            * @param {Object} Target object listener is added to
            */
            EventDispatcher.prototype.getEventListenerIndex = function (type, listener, target) {
                if (this.listeners[type] !== undefined) {
                    var a = this.listeners[type];
                    var l = a.length;
                    var d;

                    for (var c = 0; c < l; c++) {
                        d = a[c];

                        if (target == d.target && listener == d.listener) {
                            return c;
                        }
                    }
                }

                return -1;
            };

            /**
            * check if an object has an event listener assigned to it
            * @method hasListener
            * @param {String} Name of event to remove a listener for
            * @param {Function} Callback function
            * @param {Object} Target object listener is added to
            */
            //todo: hasEventListener - relax check by not requiring target in param
            EventDispatcher.prototype.hasEventListener = function (type, listener, target) {
                if (this.listeners != null && target != null) {
                    return (this.getEventListenerIndex(type, listener, target) !== -1);
                } else {
                    if (this.listeners[type] !== undefined) {
                        var a = this.listeners[type];
                        return (a.length > 0);
                    }

                    return false;
                }

                return false;
            };
            return EventDispatcher;
        })();
        events.EventDispatcher = EventDispatcher;

        /**
        * Event listener data container
        */
        var EventData = (function () {
            function EventData() {
            }
            return EventData;
        })();
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        var IOErrorEvent = (function (_super) {
            __extends(IOErrorEvent, _super);
            function IOErrorEvent(type) {
                _super.call(this, type);
            }
            IOErrorEvent.IO_ERROR = "IOErrorEvent_IO_ERROR";
            return IOErrorEvent;
        })(away.events.Event);
        events.IOErrorEvent = IOErrorEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (events) {
        /**
        * @class away.events.HTTPStatusEvent
        */
        var HTTPStatusEvent = (function (_super) {
            __extends(HTTPStatusEvent, _super);
            function HTTPStatusEvent(type, status) {
                if (typeof status === "undefined") { status = null; }
                _super.call(this, type);

                this.status = status;
            }
            HTTPStatusEvent.HTTP_STATUS = "HTTPStatusEvent_HTTP_STATUS";
            return HTTPStatusEvent;
        })(away.events.Event);
        events.HTTPStatusEvent = HTTPStatusEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        //import flash.events.Event;
        var ParserEvent = (function (_super) {
            __extends(ParserEvent, _super);
            function ParserEvent(type, message) {
                if (typeof message === "undefined") { message = ''; }
                _super.call(this, type);

                this._message = message;
            }
            Object.defineProperty(ParserEvent.prototype, "message", {
                /**
                * Additional human-readable message. Usually supplied for ParserEvent.PARSE_ERROR events.
                */
                get: function () {
                    return this._message;
                },
                enumerable: true,
                configurable: true
            });

            ParserEvent.prototype.clone = function () {
                return new away.events.ParserEvent(this.type, this.message);
            };
            ParserEvent.PARSE_COMPLETE = 'parseComplete';

            ParserEvent.PARSE_ERROR = 'parseError';

            ParserEvent.READY_FOR_DEPENDENCIES = 'readyForDependencies';
            return ParserEvent;
        })(away.events.Event);
        events.ParserEvent = ParserEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        var ProgressEvent = (function (_super) {
            __extends(ProgressEvent, _super);
            function ProgressEvent(type) {
                _super.call(this, type);
            }
            ProgressEvent.PROGRESS = "ProgressEvent_progress";
            return ProgressEvent;
        })(away.events.Event);
        events.ProgressEvent = ProgressEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        var LoaderEvent = (function (_super) {
            __extends(LoaderEvent, _super);
            /**
            * Create a new LoaderEvent object.
            * @param type The event type.
            * @param resource The loaded or parsed resource.
            * @param url The url of the loaded resource.
            */
            function LoaderEvent(type, url, assets, isDependency, errmsg) {
                if (typeof url === "undefined") { url = null; }
                if (typeof assets === "undefined") { assets = null; }
                if (typeof isDependency === "undefined") { isDependency = false; }
                if (typeof errmsg === "undefined") { errmsg = null; }
                _super.call(this, type);

                this._url = url;
                this._assets = assets;
                this._message = errmsg;
                this._isDependency = isDependency;
            }
            Object.defineProperty(LoaderEvent.prototype, "url", {
                /**
                * The url of the loaded resource.
                */
                get: function () {
                    return this._url;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LoaderEvent.prototype, "assets", {
                /**
                * The error string on loadError.
                */
                get: function () {
                    return this._assets;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LoaderEvent.prototype, "message", {
                /**
                * The error string on loadError.
                */
                get: function () {
                    return this._message;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LoaderEvent.prototype, "isDependency", {
                /**
                * Indicates whether the event occurred while loading a dependency, as opposed
                * to the base file. Dependencies can be textures or other files that are
                * referenced by the base file.
                */
                get: function () {
                    return this._isDependency;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Clones the current event.
            * @return An exact duplicate of the current event.
            */
            LoaderEvent.prototype.clone = function () {
                return new LoaderEvent(this.type, this._url, this._assets, this._isDependency, this._message);
            };
            LoaderEvent.LOAD_ERROR = "loadError";

            LoaderEvent.RESOURCE_COMPLETE = "resourceComplete";

            LoaderEvent.DEPENDENCY_COMPLETE = "dependencyComplete";
            return LoaderEvent;
        })(away.events.Event);
        events.LoaderEvent = LoaderEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (events) {
        //import away.library.assets.IAsset;
        //import flash.events.Event;
        /**
        * @class away.events.AssetEvent
        */
        var AssetEvent = (function (_super) {
            __extends(AssetEvent, _super);
            function AssetEvent(type, asset, prevName) {
                if (typeof asset === "undefined") { asset = null; }
                if (typeof prevName === "undefined") { prevName = null; }
                _super.call(this, type);

                this._asset = asset;
                this._prevName = prevName || (this._asset ? this._asset.name : null);
            }
            Object.defineProperty(AssetEvent.prototype, "asset", {
                get: function () {
                    return this._asset;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssetEvent.prototype, "assetPrevName", {
                get: function () {
                    return this._prevName;
                },
                enumerable: true,
                configurable: true
            });

            AssetEvent.prototype.clone = function () {
                return new away.events.AssetEvent(this.type, this.asset, this.assetPrevName);
            };
            AssetEvent.ASSET_COMPLETE = "assetComplete";
            AssetEvent.ASSET_RENAME = 'assetRename';
            AssetEvent.ASSET_CONFLICT_RESOLVED = 'assetConflictResolved';

            AssetEvent.TEXTURE_SIZE_ERROR = 'textureSizeError';
            return AssetEvent;
        })(away.events.Event);
        events.AssetEvent = AssetEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        var TimerEvent = (function (_super) {
            __extends(TimerEvent, _super);
            function TimerEvent(type) {
                _super.call(this, type);
            }
            TimerEvent.TIMER = "timer";
            TimerEvent.TIMER_COMPLETE = "timerComplete";
            return TimerEvent;
        })(away.events.Event);
        events.TimerEvent = TimerEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.events
    */
    (function (events) {
        //import flash.events.Event;
        var StageGLEvent = (function (_super) {
            __extends(StageGLEvent, _super);
            function StageGLEvent(type) {
                _super.call(this, type); //, bubbles, cancelable);
            }
            StageGLEvent.CONTEXTGL_CREATED = "ContextGLCreated";
            StageGLEvent.CONTEXTGL_DISPOSED = "ContextGLDisposed";
            StageGLEvent.CONTEXTGL_RECREATED = "ContextGLRecreated";
            StageGLEvent.VIEWPORT_UPDATED = "ViewportUpdated";
            return StageGLEvent;
        })(away.events.Event);
        events.StageGLEvent = StageGLEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
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
        var ParserBase = (function (_super) {
            __extends(ParserBase, _super);
            /* Protected */
            /**
            * Creates a new ParserBase object
            * @param format The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>, and should be provided by the concrete subtype.
            * @param loaderType The type of loader required by the parser
            *
            * @see away.loading.parsers.ParserDataFormat
            */
            function ParserBase(format, loaderType) {
                if (typeof loaderType === "undefined") { loaderType = null; }
                _super.call(this);
                this._loaderType = away.parsers.ParserLoaderType.URL_LOADER;

                if (loaderType) {
                    this._loaderType = loaderType;
                }

                this._materialMode = 0;
                this._dataFormat = format;
                this._dependencies = new Array();
            }
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------
            // TODO: add error checking for the following ( could cause a problem if this function is not implemented )
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------
            // Needs to be implemented in all Parsers (
            //<code>public static supportsType(extension : string) : boolean</code>
            //* Indicates whether or not a given file extension is supported by the parser.
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------
            ParserBase.supportsType = function (extension) {
                throw new away.errors.AbstractMethodError();
                return false;
            };

            /**
            * Validates a bitmapData loaded before assigning to a default BitmapMaterial
            */
            ParserBase.prototype.isBitmapDataValid = function (bitmapData) {
                var isValid = away.utils.TextureUtils.isBitmapDataValid(bitmapData);

                if (!isValid) {
                    console.log(">> Bitmap loaded is not having power of 2 dimensions or is higher than 2048");
                }

                return isValid;
            };


            Object.defineProperty(ParserBase.prototype, "parsingFailure", {
                get: function () {
                    return this._parsingFailure;
                },
                set: function (b) {
                    this._parsingFailure = b;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParserBase.prototype, "parsingPaused", {
                get: function () {
                    return this._parsingPaused;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParserBase.prototype, "parsingComplete", {
                get: function () {
                    return this._parsingComplete;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParserBase.prototype, "materialMode", {
                get: function () {
                    return this._materialMode;
                },
                set: function (newMaterialMode) {
                    this._materialMode = newMaterialMode;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParserBase.prototype, "loaderType", {
                get: function () {
                    return this._loaderType;
                },
                set: function (value) {
                    this._loaderType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParserBase.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParserBase.prototype, "dataFormat", {
                /**
                * The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>.
                */
                get: function () {
                    return this._dataFormat;
                },
                enumerable: true,
                configurable: true
            });

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
            ParserBase.prototype.parseAsync = function (data, frameLimit) {
                if (typeof frameLimit === "undefined") { frameLimit = 30; }
                this._data = data;
                this.startParsing(frameLimit);
            };

            Object.defineProperty(ParserBase.prototype, "dependencies", {
                /**
                * A list of dependencies that need to be loaded and resolved for the object being parsed.
                */
                get: function () {
                    return this._dependencies;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Resolve a dependency when it's loaded. For example, a dependency containing an ImageResource would be assigned
            * to a Mesh instance as a BitmapMaterial, a scene graph object would be added to its intended parent. The
            * dependency should be a member of the dependencies property.
            *
            * @param resourceDependency The dependency to be resolved.
            */
            ParserBase.prototype._iResolveDependency = function (resourceDependency) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            * Resolve a dependency loading failure. Used by parser to eventually provide a default map
            *
            * @param resourceDependency The dependency to be resolved.
            */
            ParserBase.prototype._iResolveDependencyFailure = function (resourceDependency) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            * Resolve a dependency name
            *
            * @param resourceDependency The dependency to be resolved.
            */
            ParserBase.prototype._iResolveDependencyName = function (resourceDependency, asset) {
                return asset.name;
            };

            ParserBase.prototype._iResumeParsingAfterDependencies = function () {
                this._parsingPaused = false;

                if (this._timer) {
                    this._timer.start();
                }
            };

            ParserBase.prototype._pFinalizeAsset = function (asset, name) {
                if (typeof name === "undefined") { name = null; }
                var type_event;
                var type_name;

                if (name != null) {
                    asset.name = name;
                }

                switch (asset.assetType) {
                    case away.library.AssetType.LIGHT_PICKER:
                        type_name = 'lightPicker';
                        break;
                    case away.library.AssetType.LIGHT:
                        type_name = 'light';
                        break;
                    case away.library.AssetType.ANIMATOR:
                        type_name = 'animator';
                        break;
                    case away.library.AssetType.ANIMATION_SET:
                        type_name = 'animationSet';
                        break;
                    case away.library.AssetType.ANIMATION_STATE:
                        type_name = 'animationState';
                        break;
                    case away.library.AssetType.ANIMATION_NODE:
                        type_name = 'animationNode';
                        break;
                    case away.library.AssetType.STATE_TRANSITION:
                        type_name = 'stateTransition';
                        break;
                    case away.library.AssetType.TEXTURE:
                        type_name = 'texture';
                        break;
                    case away.library.AssetType.TEXTURE_PROJECTOR:
                        type_name = 'textureProjector';
                        break;
                    case away.library.AssetType.CONTAINER:
                        type_name = 'container';
                        break;
                    case away.library.AssetType.GEOMETRY:
                        type_name = 'geometry';
                        break;
                    case away.library.AssetType.MATERIAL:
                        type_name = 'material';
                        break;
                    case away.library.AssetType.MESH:
                        type_name = 'mesh';
                        break;
                    case away.library.AssetType.SKELETON:
                        type_name = 'skeleton';
                        break;
                    case away.library.AssetType.SKELETON_POSE:
                        type_name = 'skelpose';
                        break;
                    case away.library.AssetType.ENTITY:
                        type_name = 'entity';
                        break;
                    case away.library.AssetType.SKYBOX:
                        type_name = 'skybox';
                        break;
                    case away.library.AssetType.CAMERA:
                        type_name = 'camera';
                        break;
                    case away.library.AssetType.SEGMENT_SET:
                        type_name = 'segmentSet';
                        break;
                    case away.library.AssetType.EFFECTS_METHOD:
                        type_name = 'effectsMethod';
                        break;
                    case away.library.AssetType.SHADOW_MAP_METHOD:
                        type_name = 'effectsMethod';
                        break;
                    default:
                        throw new away.errors.Error('Unhandled asset type ' + asset.assetType + '. Report as bug!');
                        break;
                }
                ;

                //console.log( 'ParserBase' , '_pFinalizeAsset.type_event: ' ,  type_event );
                // If the asset has no name, give it
                // a per-type default name.
                if (!asset.name)
                    asset.name = type_name;

                this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.ASSET_COMPLETE, asset));
            };

            /**
            * Parse the next block of data.
            * @return Whether or not more data needs to be parsed. Can be <code>ParserBase.ParserBase.PARSING_DONE</code> or
            * <code>ParserBase.ParserBase.MORE_TO_PARSE</code>.
            */
            ParserBase.prototype._pProceedParsing = function () {
                throw new away.errors.AbstractMethodError();
                return true;
            };

            ParserBase.prototype._pDieWithError = function (message) {
                if (typeof message === "undefined") { message = 'Unknown parsing error'; }
                if (this._timer) {
                    this._timer.removeEventListener(away.events.TimerEvent.TIMER, this._pOnInterval, this);
                    this._timer.stop();
                    this._timer = null;
                }

                this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.PARSE_ERROR, message));
            };

            ParserBase.prototype._pAddDependency = function (id, req, retrieveAsRawData, data, suppressErrorEvents) {
                if (typeof retrieveAsRawData === "undefined") { retrieveAsRawData = false; }
                if (typeof data === "undefined") { data = null; }
                if (typeof suppressErrorEvents === "undefined") { suppressErrorEvents = false; }
                var dependency = new away.parsers.ResourceDependency(id, req, data, this, retrieveAsRawData, suppressErrorEvents);
                this._dependencies.push(dependency);

                return dependency;
            };

            ParserBase.prototype._pPauseAndRetrieveDependencies = function () {
                if (this._timer) {
                    this._timer.stop();
                }

                this._parsingPaused = true;
                this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.READY_FOR_DEPENDENCIES));
            };

            /**
            * Tests whether or not there is still time left for parsing within the maximum allowed time frame per session.
            * @return True if there is still time left, false if the maximum allotted time was exceeded and parsing should be interrupted.
            */
            ParserBase.prototype._pHasTime = function () {
                return ((away.utils.getTimer() - this._lastFrameTime) < this._frameLimit);
            };

            /**
            * Called when the parsing pause interval has passed and parsing can proceed.
            */
            ParserBase.prototype._pOnInterval = function (event) {
                if (typeof event === "undefined") { event = null; }
                this._lastFrameTime = away.utils.getTimer();

                if (this._pProceedParsing() && !this._parsingFailure) {
                    this._pFinishParsing();
                }
            };

            /**
            * Initializes the parsing of data.
            * @param frameLimit The maximum duration of a parsing session.
            */
            ParserBase.prototype.startParsing = function (frameLimit) {
                this._frameLimit = frameLimit;
                this._timer = new away.utils.Timer(this._frameLimit, 0);
                this._timer.addEventListener(away.events.TimerEvent.TIMER, this._pOnInterval, this);
                this._timer.start();
            };

            /**
            * Finish parsing the data.
            */
            ParserBase.prototype._pFinishParsing = function () {
                //console.log( 'ParserBase._pFinishParsing');
                if (this._timer) {
                    this._timer.removeEventListener(away.events.TimerEvent.TIMER, this._pOnInterval, this);
                    this._timer.stop();
                }

                this._timer = null;
                this._parsingComplete = true;

                this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.PARSE_COMPLETE));
            };

            /**
            *
            * @returns {string}
            * @private
            */
            ParserBase.prototype._pGetTextData = function () {
                return away.parsers.ParserUtils.toString(this._data);
            };

            /**
            *
            * @returns {string}
            * @private
            */
            ParserBase.prototype._pGetByteData = function () {
                return away.parsers.ParserUtils.toByteArray(this._data);
            };
            ParserBase.PARSING_DONE = true;

            ParserBase.MORE_TO_PARSE = false;
            return ParserBase;
        })(away.events.EventDispatcher);
        parsers.ParserBase = ParserBase;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts" />
var away;
(function (away) {
    (function (parsers) {
        /**
        * CubeTextureParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
        * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
        * exception cases.
        */
        var CubeTextureParser = (function (_super) {
            __extends(CubeTextureParser, _super);
            /**
            * Creates a new CubeTextureParser object.
            * @param uri The url or id of the data or file to be parsed.
            * @param extra The holder for extra contextual data that the parser might need.
            */
            function CubeTextureParser() {
                _super.call(this, away.parsers.ParserDataFormat.PLAIN_TEXT, away.parsers.ParserLoaderType.URL_LOADER);
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            CubeTextureParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "cube";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            CubeTextureParser.supportsData = function (data) {
                try  {
                    var obj = JSON.parse(data);

                    if (obj) {
                        return true;
                    }
                    return false;
                } catch (e) {
                    return false;
                }

                return false;
            };

            /**
            * @inheritDoc
            */
            CubeTextureParser.prototype._iResolveDependency = function (resourceDependency) {
            };

            /**
            * @inheritDoc
            */
            CubeTextureParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
            };

            /**
            * @inheritDoc
            */
            CubeTextureParser.prototype._pProceedParsing = function () {
                if (this._imgDependencyDictionary != null) {
                    var asset = new away.textures.HTMLImageElementCubeTexture(this._getHTMLImageElement(CubeTextureParser.posX), this._getHTMLImageElement(CubeTextureParser.negX), this._getHTMLImageElement(CubeTextureParser.posY), this._getHTMLImageElement(CubeTextureParser.negY), this._getHTMLImageElement(CubeTextureParser.posZ), this._getHTMLImageElement(CubeTextureParser.negZ));

                    //clear dictionary
                    this._imgDependencyDictionary = null;

                    asset.name = this._iFileName;

                    this._pFinalizeAsset(asset, this._iFileName);

                    return away.parsers.ParserBase.PARSING_DONE;
                }

                try  {
                    var json = JSON.parse(this.data);
                    var data = json.data;
                    var rec;

                    if (data.length != 6) {
                        this._pDieWithError('CubeTextureParser: Error - cube texture should have exactly 6 images');
                    }

                    if (json) {
                        this._imgDependencyDictionary = new Object();

                        for (var c = 0; c < data.length; c++) {
                            rec = data[c];
                            this._imgDependencyDictionary[rec.id] = this._pAddDependency(rec.id, new away.net.URLRequest(rec.image.toString()), true);
                        }

                        if (!this._validateCubeData()) {
                            this._pDieWithError("CubeTextureParser: JSON data error - cubes require id of:   \n" + CubeTextureParser.posX + ', ' + CubeTextureParser.negX + ',  \n' + CubeTextureParser.posY + ', ' + CubeTextureParser.negY + ',  \n' + CubeTextureParser.posZ + ', ' + CubeTextureParser.negZ);

                            return away.parsers.ParserBase.PARSING_DONE;
                        }

                        this._pPauseAndRetrieveDependencies();

                        return away.parsers.ParserBase.MORE_TO_PARSE;
                    }
                } catch (e) {
                    this._pDieWithError('CubeTexturePaser Error parsing JSON');
                }

                return away.parsers.ParserBase.PARSING_DONE;
            };

            CubeTextureParser.prototype._validateCubeData = function () {
                return (this._imgDependencyDictionary[CubeTextureParser.posX] != null && this._imgDependencyDictionary[CubeTextureParser.negX] != null && this._imgDependencyDictionary[CubeTextureParser.posY] != null && this._imgDependencyDictionary[CubeTextureParser.negY] != null && this._imgDependencyDictionary[CubeTextureParser.posZ] != null && this._imgDependencyDictionary[CubeTextureParser.negZ] != null);
            };

            CubeTextureParser.prototype._getHTMLImageElement = function (name) {
                var dependency = this._imgDependencyDictionary[name];

                if (dependency) {
                    return dependency.data;
                }

                return null;
            };
            CubeTextureParser.posX = 'posX';
            CubeTextureParser.negX = 'negX';
            CubeTextureParser.posY = 'posY';
            CubeTextureParser.negY = 'negY';
            CubeTextureParser.posZ = 'posZ';
            CubeTextureParser.negZ = 'negZ';
            return CubeTextureParser;
        })(away.parsers.ParserBase);
        parsers.CubeTextureParser = CubeTextureParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        /**
        * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
        * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
        * exception cases.
        */
        var ImageParser = (function (_super) {
            __extends(ImageParser, _super);
            //private var _loader           : Loader;
            /**
            * Creates a new ImageParser object.
            * @param uri The url or id of the data or file to be parsed.
            * @param extra The holder for extra contextual data that the parser might need.
            */
            function ImageParser() {
                _super.call(this, away.parsers.ParserDataFormat.IMAGE, away.parsers.ParserLoaderType.IMG_LOADER);
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            ImageParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            ImageParser.supportsData = function (data) {
                if (data instanceof HTMLImageElement)
                    return true;

                if (!(data instanceof away.utils.ByteArray))
                    return false;

                var ba = data;
                ba.position = 0;

                if (ba.readUnsignedShort() == 0xffd8)
                    return true;

                ba.position = 0;
                if (ba.readShort() == 0x424D)
                    return true;

                ba.position = 1;
                if (ba.readUTFBytes(3) == 'PNG')
                    return true;

                ba.position = 0;
                if (ba.readUTFBytes(3) == 'GIF' && ba.readShort() == 0x3839 && ba.readByte() == 0x61)
                    return true;

                ba.position = 0;
                if (ba.readUTFBytes(3) == 'ATF')
                    return true;

                return false;
            };

            /**
            * @inheritDoc
            */
            ImageParser.prototype._pProceedParsing = function () {
                var asset;
                var sizeError = false;

                if (this.data instanceof HTMLImageElement) {
                    if (away.utils.TextureUtils.isHTMLImageElementValid(this.data)) {
                        asset = new away.textures.HTMLImageElementTexture(this.data, false);
                        this._pFinalizeAsset(asset, this._iFileName);
                    } else {
                        sizeError = true;
                    }
                } else if (this.data instanceof away.utils.ByteArray) {
                    var ba = this.data;
                    ba.position = 0;
                    var htmlImageElement = away.parsers.ParserUtils.byteArrayToImage(this.data);

                    if (away.utils.TextureUtils.isHTMLImageElementValid(htmlImageElement)) {
                        asset = new away.textures.HTMLImageElementTexture(htmlImageElement, false);
                        this._pFinalizeAsset(asset, this._iFileName);
                    } else {
                        sizeError = true;
                    }
                }

                if (sizeError == true) {
                    //				asset = <away.textures.Texture2DBase> new away.textures.BitmapTexture(away.materials.DefaultMaterialManager.createCheckeredBitmapData(), false);
                    //				this._pFinalizeAsset(<away.library.IAsset> asset, this._iFileName);
                    //				this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.TEXTURE_SIZE_ERROR, <away.library.IAsset> asset));
                }

                return away.parsers.ParserBase.PARSING_DONE;
            };
            return ImageParser;
        })(away.parsers.ParserBase);
        parsers.ImageParser = ImageParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        /**
        * An enumeration providing values to describe the data format of parsed data.
        */
        var ParserDataFormat = (function () {
            function ParserDataFormat() {
            }
            ParserDataFormat.BINARY = "binary";

            ParserDataFormat.PLAIN_TEXT = "plainText";

            ParserDataFormat.IMAGE = "image";
            return ParserDataFormat;
        })();
        parsers.ParserDataFormat = ParserDataFormat;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var ParserLoaderType = (function () {
            function ParserLoaderType() {
            }
            ParserLoaderType.URL_LOADER = 'ParserLoaderType_URLLoader';
            ParserLoaderType.IMG_LOADER = 'ParserLoaderType_IMGLoader';
            return ParserLoaderType;
        })();
        parsers.ParserLoaderType = ParserLoaderType;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var ParserUtils = (function () {
            function ParserUtils() {
            }
            /**
            * Converts an ByteArray to an Image - returns an HTMLImageElement
            *
            * @param image data as a ByteArray
            *
            * @return HTMLImageElement
            *
            */
            ParserUtils.byteArrayToImage = function (data) {
                var byteStr = '';
                var bytes = new Uint8Array(data.arraybytes);
                var len = bytes.byteLength;

                for (var i = 0; i < len; i++) {
                    byteStr += String.fromCharCode(bytes[i]);
                }

                var base64Image = window.btoa(byteStr);
                var str = 'data:image/png;base64,' + base64Image;
                var img = new Image();
                img.src = str;

                return img;
            };

            /**
            * Returns a object as ByteArray, if possible.
            *
            * @param data The object to return as ByteArray
            *
            * @return The ByteArray or null
            *
            */
            ParserUtils.toByteArray = function (data) {
                var b = new away.utils.ByteArray();
                b.setArrayBuffer(data);
                return b;
            };

            /**
            * Returns a object as String, if possible.
            *
            * @param data The object to return as String
            * @param length The length of the returned String
            *
            * @return The String or null
            *
            */
            ParserUtils.toString = function (data, length) {
                if (typeof length === "undefined") { length = 0; }
                if (typeof data === 'string')
                    ;
                 {
                    var s = data;

                    if (s['substr'] != null) {
                        return s.substr(0, s.length);
                    }
                }

                if (data instanceof away.utils.ByteArray) {
                    var ba = data;
                    ba.position = 0;
                    return ba.readUTFBytes(Math.min(ba.getBytesAvailable(), length));
                }

                return null;
                /*
                var ba:ByteArray;
                
                length ||= uint.MAX_VALUE;
                
                if (data is String)
                return String(data).substr(0, length);
                
                ba = toByteArray(data);
                if (ba) {
                ba.position = 0;
                return ba.readUTFBytes(Math.min(ba.bytesAvailable, length));
                }
                
                return null;
                
                */
            };
            return ParserUtils;
        })();
        parsers.ParserUtils = ParserUtils;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        //import away.arcane;
        //import away.library.assets.IAsset;
        //import away.loaders.parsers.ParserBase;
        //import flash.net.URLRequest;
        //use namespace arcane;
        /**
        * ResourceDependency represents the data required to load, parse and resolve additional files ("dependencies")
        * required by a parser, used by ResourceLoadSession.
        *
        */
        var ResourceDependency = (function () {
            function ResourceDependency(id, req, data, parentParser, retrieveAsRawData, suppressAssetEvents) {
                if (typeof retrieveAsRawData === "undefined") { retrieveAsRawData = false; }
                if (typeof suppressAssetEvents === "undefined") { suppressAssetEvents = false; }
                this._id = id;
                this._req = req;
                this._parentParser = parentParser;
                this._data = data;
                this._retrieveAsRawData = retrieveAsRawData;
                this._suppressAssetEvents = suppressAssetEvents;

                this._assets = new Array(); //new Vector.<IAsset>();
                this._dependencies = new Array();
            }
            Object.defineProperty(ResourceDependency.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceDependency.prototype, "assets", {
                get: function () {
                    return this._assets;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceDependency.prototype, "dependencies", {
                get: function () {
                    return this._dependencies;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceDependency.prototype, "request", {
                get: function () {
                    return this._req;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceDependency.prototype, "retrieveAsRawData", {
                get: function () {
                    return this._retrieveAsRawData;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceDependency.prototype, "suppresAssetEvents", {
                get: function () {
                    return this._suppressAssetEvents;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceDependency.prototype, "data", {
                /**
                * The data containing the dependency to be parsed, if the resource was already loaded.
                */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @private
            * Method to set data after having already created the dependency object, e.g. after load.
            */
            ResourceDependency.prototype._iSetData = function (data) {
                this._data = data;
            };

            Object.defineProperty(ResourceDependency.prototype, "parentParser", {
                /**
                * The parser which is dependent on this ResourceDependency object.
                */
                get: function () {
                    return this._parentParser;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Resolve the dependency when it's loaded with the parent parser. For example, a dependency containing an
            * ImageResource would be assigned to a Mesh instance as a BitmapMaterial, a scene graph object would be added
            * to its intended parent. The dependency should be a member of the dependencies property.
            */
            ResourceDependency.prototype.resolve = function () {
                if (this._parentParser)
                    this._parentParser._iResolveDependency(this);
            };

            /**
            * Resolve a dependency failure. For example, map loading failure from a 3d file
            */
            ResourceDependency.prototype.resolveFailure = function () {
                if (this._parentParser)
                    this._parentParser._iResolveDependencyFailure(this);
            };

            /**
            * Resolve the dependencies name
            */
            ResourceDependency.prototype.resolveName = function (asset) {
                if (this._parentParser)
                    return this._parentParser._iResolveDependencyName(this, asset);
                return asset.name;
            };
            return ResourceDependency;
        })();
        parsers.ResourceDependency = ResourceDependency;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        var IDUtil = (function () {
            function IDUtil() {
            }
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
            IDUtil.createUID = function () {
                var uid = new Array(36);
                var index = 0;

                var i;
                var j;

                for (i = 0; i < 8; i++)
                    uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];

                for (i = 0; i < 3; i++) {
                    uid[index++] = 45; // charCode for "-"

                    for (j = 0; j < 4; j++)
                        uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];
                }

                uid[index++] = 45; // charCode for "-"

                var time = new Date().getTime();

                // Note: time is the number of milliseconds since 1970,
                // which is currently more than one trillion.
                // We use the low 8 hex digits of this number in the UID.
                // Just in case the system clock has been reset to
                // Jan 1-4, 1970 (in which case this number could have only
                // 1-7 hex digits), we pad on the left with 7 zeros
                // before taking the low digits.
                var timeString = ("0000000" + time.toString(16).toUpperCase()).substr(-8);

                for (i = 0; i < 8; i++)
                    uid[index++] = timeString.charCodeAt(i);

                for (i = 0; i < 4; i++)
                    uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];

                return String.fromCharCode.apply(null, uid);
            };
            IDUtil.ALPHA_CHAR_CODES = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70];
            return IDUtil;
        })();
        library.IDUtil = IDUtil;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        var NamedAssetBase = (function (_super) {
            __extends(NamedAssetBase, _super);
            function NamedAssetBase(name) {
                if (typeof name === "undefined") { name = null; }
                _super.call(this);

                if (name == null)
                    name = 'null';

                this._name = name;
                this._originalName = name;

                this.updateFullPath();
            }
            Object.defineProperty(NamedAssetBase.prototype, "originalName", {
                /**
                * The original name used for this asset in the resource (e.g. file) in which
                * it was found. This may not be the same as <code>name</code>, which may
                * have changed due to of a name conflict.
                */
                get: function () {
                    return this._originalName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(NamedAssetBase.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (newID) {
                    this._id = newID;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NamedAssetBase.prototype, "assetType", {
                get: function () {
                    return this._assetType;
                },
                set: function (type) {
                    this._assetType = type;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NamedAssetBase.prototype, "name", {
                get: function () {
                    return this._name;
                },
                set: function (val) {
                    var prev;

                    prev = this._name;
                    this._name = val;

                    if (this._name == null) {
                        this._name = 'null';
                    }

                    this.updateFullPath();

                    //if (hasEventListener(AssetEvent.ASSET_RENAME))
                    this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.ASSET_RENAME, this, prev));
                },
                enumerable: true,
                configurable: true
            });


            NamedAssetBase.prototype.dispose = function () {
                throw new away.errors.AbstractMethodError();
            };

            Object.defineProperty(NamedAssetBase.prototype, "assetNamespace", {
                get: function () {
                    return this._namespace;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(NamedAssetBase.prototype, "assetFullPath", {
                get: function () {
                    return this._full_path;
                },
                enumerable: true,
                configurable: true
            });

            NamedAssetBase.prototype.assetPathEquals = function (name, ns) {
                return (this._name == name && (!ns || this._namespace == ns));
            };

            NamedAssetBase.prototype.resetAssetPath = function (name, ns, overrideOriginal) {
                if (typeof ns === "undefined") { ns = null; }
                if (typeof overrideOriginal === "undefined") { overrideOriginal = true; }
                this._name = name ? name : 'null';
                this._namespace = ns ? ns : NamedAssetBase.DEFAULT_NAMESPACE;

                if (overrideOriginal) {
                    this._originalName = this._name;
                }

                this.updateFullPath();
            };

            NamedAssetBase.prototype.updateFullPath = function () {
                this._full_path = [this._namespace, this._name];
            };
            NamedAssetBase.DEFAULT_NAMESPACE = 'default';
            return NamedAssetBase;
        })(away.events.EventDispatcher);
        library.NamedAssetBase = NamedAssetBase;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
var away;
(function (away) {
    (function (library) {
        var AssetType = (function () {
            function AssetType() {
            }
            AssetType.ENTITY = 'entity';
            AssetType.SKYBOX = 'skybox';
            AssetType.CAMERA = 'camera';
            AssetType.SEGMENT_SET = 'segmentSet';
            AssetType.MESH = 'mesh';
            AssetType.GEOMETRY = 'geometry';
            AssetType.SKELETON = 'skeleton';
            AssetType.SKELETON_POSE = 'skeletonPose';
            AssetType.CONTAINER = 'container';
            AssetType.TEXTURE = 'texture';
            AssetType.TEXTURE_PROJECTOR = 'textureProjector';
            AssetType.MATERIAL = 'material';
            AssetType.ANIMATION_SET = 'animationSet';
            AssetType.ANIMATION_STATE = 'animationState';
            AssetType.ANIMATION_NODE = 'animationNode';
            AssetType.ANIMATOR = 'animator';
            AssetType.STATE_TRANSITION = 'stateTransition';
            AssetType.LIGHT = 'light';
            AssetType.LIGHT_PICKER = 'lightPicker';
            AssetType.SHADOW_MAP_METHOD = 'shadowMapMethod';
            AssetType.EFFECTS_METHOD = 'effectsMethod';
            return AssetType;
        })();
        library.AssetType = AssetType;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        //import away.library.assets.IAsset;
        var AssetLibraryIterator = (function () {
            function AssetLibraryIterator(assets, assetTypeFilter, namespaceFilter, filterFunc) {
                this._assets = assets;
                this.filter(assetTypeFilter, namespaceFilter, filterFunc);
            }
            Object.defineProperty(AssetLibraryIterator.prototype, "currentAsset", {
                get: function () {
                    // Return current, or null if no current
                    return (this._idx < this._filtered.length) ? this._filtered[this._idx] : null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssetLibraryIterator.prototype, "numAssets", {
                get: function () {
                    return this._filtered.length;
                },
                enumerable: true,
                configurable: true
            });

            AssetLibraryIterator.prototype.next = function () {
                var next = null;

                if (this._idx < this._filtered.length)
                    next = this._filtered[this._idx];

                this._idx++;

                return next;
            };

            AssetLibraryIterator.prototype.reset = function () {
                this._idx = 0;
            };

            AssetLibraryIterator.prototype.setIndex = function (index) {
                this._idx = index;
            };

            AssetLibraryIterator.prototype.filter = function (assetTypeFilter, namespaceFilter, filterFunc) {
                if (assetTypeFilter || namespaceFilter) {
                    var idx;
                    var asset;

                    idx = 0;
                    this._filtered = new Array(); //new Vector.<IAsset>;

                    var l = this._assets.length;

                    for (var c = 0; c < l; c++) {
                        asset = this._assets[c];

                        // Skip this assets if filtering on type and this is wrong type
                        if (assetTypeFilter && asset.assetType != assetTypeFilter)
                            continue;

                        // Skip this asset if filtering on namespace and this is wrong namespace
                        if (namespaceFilter && asset.assetNamespace != namespaceFilter)
                            continue;

                        // Skip this asset if a filter func has been provided and it returns false
                        if (filterFunc != null && !filterFunc(asset))
                            continue;

                        this._filtered[idx++] = asset;
                    }
                    /*
                    for each (asset in _assets) {
                    // Skip this assets if filtering on type and this is wrong type
                    if (assetTypeFilter && asset.assetType != assetTypeFilter)
                    continue;
                    
                    // Skip this asset if filtering on namespace and this is wrong namespace
                    if (namespaceFilter && asset.assetNamespace != namespaceFilter)
                    continue;
                    
                    // Skip this asset if a filter func has been provided and it returns false
                    if (filterFunc != null && !filterFunc(asset))
                    continue;
                    
                    _filtered[idx++] = asset;
                    }
                    */
                } else {
                    this._filtered = this._assets;
                }
            };
            return AssetLibraryIterator;
        })();
        library.AssetLibraryIterator = AssetLibraryIterator;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
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
        var ConflictStrategyBase = (function () {
            function ConflictStrategyBase() {
            }
            /**
            * Resolve a naming conflict between two assets. Must be implemented by concrete strategy
            * classes.
            */
            ConflictStrategyBase.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            * Create instance of this conflict strategy. Used internally by the AssetLibrary to
            * make sure the same strategy instance is not used in all AssetLibrary instances, which
            * would break any state caching that happens inside the strategy class.
            */
            ConflictStrategyBase.prototype.create = function () {
                throw new away.errors.AbstractMethodError();
            };

            /**
            * Provided as a convenience method for all conflict strategy classes, as a way to finalize
            * the conflict resolution by applying the new names and dispatching the correct events.
            */
            ConflictStrategyBase.prototype._pUpdateNames = function (ns, nonConflictingName, oldAsset, newAsset, assetsDictionary, precedence) {
                var loser_prev_name;
                var winner;
                var loser;

                winner = (precedence === away.library.ConflictPrecedence.FAVOR_NEW) ? newAsset : oldAsset;
                loser = (precedence === away.library.ConflictPrecedence.FAVOR_NEW) ? oldAsset : newAsset;

                loser_prev_name = loser.name;

                assetsDictionary[winner.name] = winner;
                assetsDictionary[nonConflictingName] = loser;
                loser.resetAssetPath(nonConflictingName, ns, false);

                loser.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.ASSET_CONFLICT_RESOLVED, loser, loser_prev_name));
            };
            return ConflictStrategyBase;
        })();
        library.ConflictStrategyBase = ConflictStrategyBase;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        var NumSuffixConflictStrategy = (function (_super) {
            __extends(NumSuffixConflictStrategy, _super);
            function NumSuffixConflictStrategy(separator) {
                if (typeof separator === "undefined") { separator = '.'; }
                _super.call(this);

                this._separator = separator;
                this._next_suffix = {};
            }
            NumSuffixConflictStrategy.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
                var orig;
                var new_name;
                var base;
                var suffix;

                orig = changedAsset.name;

                if (orig.indexOf(this._separator) >= 0) {
                    // Name has an ocurrence of the separator, so get base name and suffix,
                    // unless suffix is non-numerical, in which case revert to zero and
                    // use entire name as base
                    base = orig.substring(0, orig.lastIndexOf(this._separator));
                    suffix = parseInt(orig.substring(base.length - 1));

                    if (isNaN(suffix)) {
                        base = orig;
                        suffix = 0;
                    }
                } else {
                    base = orig;
                    suffix = 0;
                }

                if (suffix == 0 && this._next_suffix.hasOwnProperty(base)) {
                    suffix = this._next_suffix[base];
                }

                do {
                    suffix++;

                    new_name = base.concat(this._separator, suffix.toString());
                } while(assetsDictionary.hasOwnProperty(new_name));

                this._next_suffix[base] = suffix;
                this._pUpdateNames(oldAsset.assetNamespace, new_name, oldAsset, changedAsset, assetsDictionary, precedence);
            };

            NumSuffixConflictStrategy.prototype.create = function () {
                return new away.library.NumSuffixConflictStrategy(this._separator);
            };
            return NumSuffixConflictStrategy;
        })(away.library.ConflictStrategyBase);
        library.NumSuffixConflictStrategy = NumSuffixConflictStrategy;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        //import away.library.assets.IAsset;
        var IgnoreConflictStrategy = (function (_super) {
            __extends(IgnoreConflictStrategy, _super);
            function IgnoreConflictStrategy() {
                _super.call(this);
            }
            IgnoreConflictStrategy.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
                // Do nothing, ignore the fact that there is a conflict.
                return;
            };

            IgnoreConflictStrategy.prototype.create = function () {
                return new away.library.IgnoreConflictStrategy();
            };
            return IgnoreConflictStrategy;
        })(away.library.ConflictStrategyBase);
        library.IgnoreConflictStrategy = IgnoreConflictStrategy;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        //import away.library.assets.IAsset;
        var ErrorConflictStrategy = (function (_super) {
            __extends(ErrorConflictStrategy, _super);
            function ErrorConflictStrategy() {
                _super.call(this);
            }
            ErrorConflictStrategy.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
                throw new away.errors.Error('Asset name collision while AssetLibrary.namingStrategy set to AssetLibrary.THROW_ERROR. Asset path: ' + changedAsset.assetFullPath);
            };

            ErrorConflictStrategy.prototype.create = function () {
                return new ErrorConflictStrategy();
            };
            return ErrorConflictStrategy;
        })(away.library.ConflictStrategyBase);
        library.ErrorConflictStrategy = ErrorConflictStrategy;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
var away;
(function (away) {
    (function (library) {
        /**
        * Enumaration class for precedence when resolving naming conflicts in the library.
        *
        * @see away.library.AssetLibrary.conflictPrecedence
        * @see away.library.AssetLibrary.conflictStrategy
        * @see away.library.naming.ConflictStrategy
        */
        var ConflictPrecedence = (function () {
            function ConflictPrecedence() {
            }
            ConflictPrecedence.FAVOR_OLD = 'favorOld';

            ConflictPrecedence.FAVOR_NEW = 'favorNew';
            return ConflictPrecedence;
        })();
        library.ConflictPrecedence = ConflictPrecedence;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
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
        var ConflictStrategy = (function () {
            function ConflictStrategy() {
            }
            ConflictStrategy.APPEND_NUM_SUFFIX = new away.library.NumSuffixConflictStrategy();

            ConflictStrategy.IGNORE = new away.library.IgnoreConflictStrategy();

            ConflictStrategy.THROW_ERROR = new away.library.ErrorConflictStrategy();
            return ConflictStrategy;
        })();
        library.ConflictStrategy = ConflictStrategy;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        /**
        * AssetLibraryBundle enforces a multiton pattern and is not intended to be instanced directly.
        * Its purpose is to create a container for 3D data management, both before and after parsing.
        * If you are interested in creating multiple library bundles, please use the <code>getInstance()</code> method.
        */
        var AssetLibraryBundle = (function (_super) {
            __extends(AssetLibraryBundle, _super);
            /**
            * Creates a new <code>AssetLibraryBundle</code> object.
            *
            * @param me A multiton enforcer for the AssetLibraryBundle ensuring it cannnot be instanced.
            */
            function AssetLibraryBundle(me) {
                _super.call(this);
                this._loadingSessionsGarbage = new Array();

                //me = me;
                this._assets = new Array(); //new Vector.<IAsset>;
                this._assetDictionary = new Object();
                this._loadingSessions = new Array();

                this.conflictStrategy = away.library.ConflictStrategy.IGNORE.create();
                this.conflictPrecedence = away.library.ConflictPrecedence.FAVOR_NEW;
            }
            /**
            * Returns an AssetLibraryBundle instance. If no key is given, returns the default bundle instance (which is
            * similar to using the AssetLibraryBundle as a singleton.) To keep several separated library bundles,
            * pass a string key to this method to define which bundle should be returned. This is
            * referred to as using the AssetLibrary as a multiton.
            *
            * @param key Defines which multiton instance should be returned.
            * @return An instance of the asset library
            */
            AssetLibraryBundle.getInstance = function (key) {
                if (typeof key === "undefined") { key = 'default'; }
                if (!key) {
                    key = 'default';
                }

                if (!away.library.AssetLibrary._iInstances.hasOwnProperty(key)) {
                    away.library.AssetLibrary._iInstances[key] = new away.library.AssetLibraryBundle(new AssetLibraryBundleSingletonEnforcer());
                }

                return away.library.AssetLibrary._iInstances[key];
            };

            /**
            *
            */
            AssetLibraryBundle.prototype.enableParser = function (parserClass) {
                away.net.SingleFileLoader.enableParser(parserClass);
            };

            /**
            *
            */
            AssetLibraryBundle.prototype.enableParsers = function (parserClasses) {
                away.net.SingleFileLoader.enableParsers(parserClasses);
            };

            Object.defineProperty(AssetLibraryBundle.prototype, "conflictStrategy", {
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
                get: function () {
                    return this._strategy;
                },
                set: function (val) {
                    if (!val) {
                        throw new away.errors.Error('namingStrategy must not be null. To ignore naming, use AssetLibrary.IGNORE');
                    }

                    this._strategy = val.create();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLibraryBundle.prototype, "conflictPrecedence", {
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
                get: function () {
                    return this._strategyPreference;
                },
                set: function (val) {
                    this._strategyPreference = val;
                },
                enumerable: true,
                configurable: true
            });


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
            AssetLibraryBundle.prototype.createIterator = function (assetTypeFilter, namespaceFilter, filterFunc) {
                if (typeof assetTypeFilter === "undefined") { assetTypeFilter = null; }
                if (typeof namespaceFilter === "undefined") { namespaceFilter = null; }
                if (typeof filterFunc === "undefined") { filterFunc = null; }
                return new away.library.AssetLibraryIterator(this._assets, assetTypeFilter, namespaceFilter, filterFunc);
            };

            /**
            * Loads a file and (optionally) all of its dependencies.
            *
            * @param req The URLRequest object containing the URL of the file to be loaded.
            * @param context An optional context object providing additional parameters for loading
            * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
            * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            AssetLibraryBundle.prototype.load = function (req, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                return this.loadResource(req, context, ns, parser);
            };

            /**
            * Loads a resource from existing data in memory.
            *
            * @param data The data object containing all resource information.
            * @param context An optional context object providing additional parameters for loading
            * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
            * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            AssetLibraryBundle.prototype.loadData = function (data, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                return this.parseResource(data, context, ns, parser);
            };

            /**
            *
            */
            AssetLibraryBundle.prototype.getAsset = function (name, ns) {
                if (typeof ns === "undefined") { ns = null; }
                //var asset : IAsset;
                if (this._assetDictDirty) {
                    this.rehashAssetDict();
                }

                //ns ||= NamedAssetBase.DEFAULT_NAMESPACE;
                if (ns == null) {
                    ns = away.library.NamedAssetBase.DEFAULT_NAMESPACE;
                }

                if (!this._assetDictionary.hasOwnProperty(ns)) {
                    return null;
                }

                return this._assetDictionary[ns][name];
            };

            /**
            * Adds an asset to the asset library, first making sure that it's name is unique
            * using the method defined by the <code>conflictStrategy</code> and
            * <code>conflictPrecedence</code> properties.
            */
            AssetLibraryBundle.prototype.addAsset = function (asset) {
                var ns;
                var old;

                // Bail if asset has already been added.
                if (this._assets.indexOf(asset) >= 0) {
                    return;
                }

                old = this.getAsset(asset.name, asset.assetNamespace);
                ns = asset.assetNamespace || away.library.NamedAssetBase.DEFAULT_NAMESPACE;

                if (old != null) {
                    this._strategy.resolveConflict(asset, old, this._assetDictionary[ns], this._strategyPreference);
                }

                //create unique-id (for now this is used in AwayBuilder only
                asset.id = away.library.IDUtil.createUID();

                // Add it
                this._assets.push(asset);

                if (!this._assetDictionary.hasOwnProperty(ns)) {
                    this._assetDictionary[ns] = new Object();
                }

                this._assetDictionary[ns][asset.name] = asset;

                asset.addEventListener(away.events.AssetEvent.ASSET_RENAME, this.onAssetRename, this);
                asset.addEventListener(away.events.AssetEvent.ASSET_CONFLICT_RESOLVED, this.onAssetConflictResolved, this);
            };

            /**
            * Removes an asset from the library, and optionally disposes that asset by calling
            * it's disposeAsset() method (which for most assets is implemented as a default
            * version of that type's dispose() method.
            *
            * @param asset The asset which should be removed from this library.
            * @param dispose Defines whether the assets should also be disposed.
            */
            AssetLibraryBundle.prototype.removeAsset = function (asset, dispose) {
                if (typeof dispose === "undefined") { dispose = true; }
                var idx;

                this.removeAssetFromDict(asset);

                asset.removeEventListener(away.events.AssetEvent.ASSET_RENAME, this.onAssetRename, this);
                asset.removeEventListener(away.events.AssetEvent.ASSET_CONFLICT_RESOLVED, this.onAssetConflictResolved, this);

                idx = this._assets.indexOf(asset);
                if (idx >= 0) {
                    this._assets.splice(idx, 1);
                }

                if (dispose) {
                    asset.dispose();
                }
            };

            /**
            * Removes an asset which is specified using name and namespace.
            *
            * @param name The name of the asset to be removed.
            * @param ns The namespace to which the desired asset belongs.
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away.library.AssetLibrary.removeAsset()
            */
            AssetLibraryBundle.prototype.removeAssetByName = function (name, ns, dispose) {
                if (typeof ns === "undefined") { ns = null; }
                if (typeof dispose === "undefined") { dispose = true; }
                var asset = this.getAsset(name, ns);

                if (asset) {
                    this.removeAsset(asset, dispose);
                }

                return asset;
            };

            /**
            * Removes all assets from the asset library, optionally disposing them as they
            * are removed.
            *
            * @param dispose Defines whether the assets should also be disposed.
            */
            AssetLibraryBundle.prototype.removeAllAssets = function (dispose) {
                if (typeof dispose === "undefined") { dispose = true; }
                if (dispose) {
                    var asset;

                    for (var c = 0; c < this._assets.length; c++) {
                        asset = this._assets[c];
                        asset.dispose();
                    }
                    /*
                    for each (asset in _assets)
                    asset.dispose();
                    */
                }

                this._assets.length = 0;
                this.rehashAssetDict();
            };

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
            AssetLibraryBundle.prototype.removeNamespaceAssets = function (ns, dispose) {
                if (typeof ns === "undefined") { ns = null; }
                if (typeof dispose === "undefined") { dispose = true; }
                var idx = 0;
                var asset;
                var old_assets;

                // Empty the assets vector after having stored a copy of it.
                // The copy will be filled with all assets which weren't removed.
                old_assets = this._assets.concat();
                this._assets.length = 0;

                if (ns == null) {
                    ns = away.library.NamedAssetBase.DEFAULT_NAMESPACE; //ns ||= NamedAssetBase.DEFAULT_NAMESPACE;
                }

                for (var d = 0; d < old_assets.length; d++) {
                    asset = old_assets[d];

                    // Remove from dict if in the supplied namespace. If not,
                    // transfer over to the new vector.
                    if (asset.assetNamespace == ns) {
                        if (dispose) {
                            asset.dispose();
                        }

                        // Remove asset from dictionary, but don't try to auto-remove
                        // the namespace, which will trigger an unnecessarily expensive
                        // test that is not needed since we know that the namespace
                        // will be empty when loop finishes.
                        this.removeAssetFromDict(asset, false);
                    } else {
                        this._assets[idx++] = asset;
                    }
                }

                /*
                for each (asset in old_assets) {
                // Remove from dict if in the supplied namespace. If not,
                // transfer over to the new vector.
                if (asset.assetNamespace == ns) {
                if (dispose)
                asset.dispose();
                
                // Remove asset from dictionary, but don't try to auto-remove
                // the namespace, which will trigger an unnecessarily expensive
                // test that is not needed since we know that the namespace
                // will be empty when loop finishes.
                removeAssetFromDict(asset, false);
                } else
                _assets[idx++] = asset;
                
                }
                */
                // Remove empty namespace
                if (this._assetDictionary.hasOwnProperty(ns)) {
                    delete this._assetDictionary[ns];
                }
            };

            AssetLibraryBundle.prototype.removeAssetFromDict = function (asset, autoRemoveEmptyNamespace) {
                if (typeof autoRemoveEmptyNamespace === "undefined") { autoRemoveEmptyNamespace = true; }
                if (this._assetDictDirty) {
                    this.rehashAssetDict();
                }

                if (this._assetDictionary.hasOwnProperty(asset.assetNamespace)) {
                    if (this._assetDictionary[asset.assetNamespace].hasOwnProperty(asset.name)) {
                        delete this._assetDictionary[asset.assetNamespace][asset.name];
                    }

                    if (autoRemoveEmptyNamespace) {
                        var key;
                        var empty = true;

                        for (key in this._assetDictionary[asset.assetNamespace]) {
                            empty = false;
                            break;
                        }

                        if (empty) {
                            delete this._assetDictionary[asset.assetNamespace];
                        }
                    }
                }
            };

            /**
            * Loads a yet unloaded resource file from the given url.
            */
            AssetLibraryBundle.prototype.loadResource = function (req, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                var loader = new away.net.AssetLoader();

                if (!this._loadingSessions) {
                    this._loadingSessions = new Array();
                }

                this._loadingSessions.push(loader);

                loader.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceRetrieved, this);
                loader.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyRetrieved, this);
                loader.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                loader.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                // Error are handled separately (see documentation for addErrorHandler)
                loader._iAddErrorHandler(this.onDependencyRetrievingError);
                loader._iAddParseErrorHandler(this.onDependencyRetrievingParseError);

                return loader.load(req, context, ns, parser);
            };

            AssetLibraryBundle.prototype.stopAllLoadingSessions = function () {
                var i;

                if (!this._loadingSessions) {
                    this._loadingSessions = new Array();
                }

                var length = this._loadingSessions.length;

                for (i = 0; i < length; i++) {
                    this.killLoadingSession(this._loadingSessions[i]);
                }

                this._loadingSessions = null;
            };

            /**
            * Retrieves an unloaded resource parsed from the given data.
            * @param data The data to be parsed.
            * @param id The id that will be assigned to the resource. This can later also be used by the getResource method.
            * @param ignoreDependencies Indicates whether or not dependencies should be ignored or loaded.
            * @param parser An optional parser object that will translate the data into a usable resource.
            * @return A handle to the retrieved resource.
            */
            AssetLibraryBundle.prototype.parseResource = function (data, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                var loader = new away.net.AssetLoader();

                if (!this._loadingSessions) {
                    this._loadingSessions = new Array();
                }

                this._loadingSessions.push(loader);

                loader.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceRetrieved, this);
                loader.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyRetrieved, this);
                loader.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                loader.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                // Error are handled separately (see documentation for addErrorHandler)
                loader._iAddErrorHandler(this.onDependencyRetrievingError);
                loader._iAddParseErrorHandler(this.onDependencyRetrievingParseError);

                return loader.loadData(data, '', context, ns, parser);
            };

            AssetLibraryBundle.prototype.rehashAssetDict = function () {
                var asset;

                this._assetDictionary = {};

                var l = this._assets.length;

                for (var c = 0; c < l; c++) {
                    asset = this._assets[c];

                    if (!this._assetDictionary.hasOwnProperty(asset.assetNamespace)) {
                        this._assetDictionary[asset.assetNamespace] = {};
                    }

                    this._assetDictionary[asset.assetNamespace][asset.name] = asset;
                }

                this._assetDictDirty = false;
            };

            /**
            * Called when a dependency was retrieved.
            */
            AssetLibraryBundle.prototype.onDependencyRetrieved = function (event) {
                //if (hasEventListener(LoaderEvent.DEPENDENCY_COMPLETE))
                this.dispatchEvent(event);
            };

            /**
            * Called when a an error occurs during dependency retrieving.
            */
            AssetLibraryBundle.prototype.onDependencyRetrievingError = function (event) {
                if (this.hasEventListener(away.events.LoaderEvent.LOAD_ERROR, this.onDependencyRetrievingError, this)) {
                    this.dispatchEvent(event);
                    return true;
                } else {
                    return false;
                }
            };

            /**
            * Called when a an error occurs during parsing.
            */
            AssetLibraryBundle.prototype.onDependencyRetrievingParseError = function (event) {
                if (this.hasEventListener(away.events.ParserEvent.PARSE_ERROR, this.onDependencyRetrievingParseError, this)) {
                    this.dispatchEvent(event);
                    return true;
                } else {
                    return false;
                }
            };

            AssetLibraryBundle.prototype.onAssetComplete = function (event) {
                //console.log( 'AssetLibraryBundle.onAssetComplete ' , event );
                // Only add asset to library the first time.
                if (event.type == away.events.AssetEvent.ASSET_COMPLETE) {
                    this.addAsset(event.asset);
                }

                this.dispatchEvent(event.clone());
            };

            AssetLibraryBundle.prototype.onTextureSizeError = function (event) {
                this.dispatchEvent(event.clone());
            };

            /**
            * Called when the resource and all of its dependencies was retrieved.
            */
            AssetLibraryBundle.prototype.onResourceRetrieved = function (event) {
                var _this = this;
                var loader = event.target;

                this.dispatchEvent(event.clone());

                var index = this._loadingSessions.indexOf(loader);
                this._loadingSessions.splice(index, 1);

                // Add loader to a garbage array - for a collection sweep and kill
                this._loadingSessionsGarbage.push(loader);
                this._gcTimeoutIID = setTimeout(function () {
                    _this.loadingSessionGC();
                }, 100);
            };

            AssetLibraryBundle.prototype.loadingSessionGC = function () {
                var loader;

                while (this._loadingSessionsGarbage.length > 0) {
                    loader = this._loadingSessionsGarbage.pop();
                    this.killLoadingSession(loader);
                }

                clearTimeout(this._gcTimeoutIID);
                this._gcTimeoutIID = null;
            };

            AssetLibraryBundle.prototype.killLoadingSession = function (loader) {
                loader.removeEventListener(away.events.LoaderEvent.LOAD_ERROR, this.onDependencyRetrievingError, this);
                loader.removeEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceRetrieved, this);
                loader.removeEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyRetrieved, this);
                loader.removeEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                loader.removeEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
                loader.stop();
            };

            /**
            * Called when unespected error occurs
            */
            /*
            private onResourceError() : void
            {
            var msg:string = "Unexpected parser error";
            if(hasEventListener(LoaderEvent.DEPENDENCY_ERROR)){
            var re:LoaderEvent = new LoaderEvent(LoaderEvent.DEPENDENCY_ERROR, "");
            dispatchEvent(re);
            } else{
            throw new Error(msg);
            }
            }
            */
            AssetLibraryBundle.prototype.onAssetRename = function (ev) {
                var asset = ev.target;
                var old = this.getAsset(asset.assetNamespace, asset.name);

                if (old != null) {
                    this._strategy.resolveConflict(asset, old, this._assetDictionary[asset.assetNamespace], this._strategyPreference);
                } else {
                    var dict = this._assetDictionary[ev.asset.assetNamespace];

                    if (dict == null) {
                        return;
                    }

                    dict[ev.assetPrevName] = null;
                    dict[ev.asset.name] = ev.asset;
                }
            };

            AssetLibraryBundle.prototype.onAssetConflictResolved = function (ev) {
                this.dispatchEvent(ev.clone());
            };
            return AssetLibraryBundle;
        })(away.events.EventDispatcher);
        library.AssetLibraryBundle = AssetLibraryBundle;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));

// singleton enforcer
var AssetLibraryBundleSingletonEnforcer = (function () {
    function AssetLibraryBundleSingletonEnforcer() {
    }
    return AssetLibraryBundleSingletonEnforcer;
})();
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (library) {
        /**
        * AssetLibrary enforces a singleton pattern and is not intended to be instanced.
        * It's purpose is to allow access to the default library bundle through a set of static shortcut methods.
        * If you are interested in creating multiple library bundles, please use the <code>getBundle()</code> method.
        */
        var AssetLibrary = (function () {
            /**
            * Creates a new <code>AssetLibrary</code> object.
            *
            * @param se A singleton enforcer for the AssetLibrary ensuring it cannnot be instanced.
            */
            //*
            function AssetLibrary(se) {
                se = se;
            }
            //*/
            /**
            * Returns an AssetLibrary bundle instance. If no key is given, returns the default bundle (which is
            * similar to using the AssetLibraryBundle as a singleton). To keep several separated library bundles,
            * pass a string key to this method to define which bundle should be returned. This is
            * referred to as using the AssetLibraryBundle as a multiton.
            *
            * @param key Defines which multiton instance should be returned.
            * @return An instance of the asset library
            */
            AssetLibrary.getBundle = function (key) {
                if (typeof key === "undefined") { key = 'default'; }
                return away.library.AssetLibraryBundle.getInstance(key);
            };

            /**
            *
            */
            AssetLibrary.enableParser = function (parserClass) {
                away.net.SingleFileLoader.enableParser(parserClass);
            };

            /**
            *
            */
            AssetLibrary.enableParsers = function (parserClasses) {
                away.net.SingleFileLoader.enableParsers(parserClasses);
            };

            Object.defineProperty(AssetLibrary, "conflictStrategy", {
                /**
                * Short-hand for conflictStrategy property on default asset library bundle.
                *
                * @see away.library.AssetLibraryBundle.conflictStrategy
                */
                get: function () {
                    return away.library.AssetLibrary.getBundle().conflictStrategy;
                },
                set: function (val) {
                    away.library.AssetLibrary.getBundle().conflictStrategy = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLibrary, "conflictPrecedence", {
                /**
                * Short-hand for conflictPrecedence property on default asset library bundle.
                *
                * @see away.library.AssetLibraryBundle.conflictPrecedence
                */
                get: function () {
                    return away.library.AssetLibrary.getBundle().conflictPrecedence;
                },
                set: function (val) {
                    away.library.AssetLibrary.getBundle().conflictPrecedence = val;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * Short-hand for createIterator() method on default asset library bundle.
            *
            * @see away.library.AssetLibraryBundle.createIterator()
            */
            AssetLibrary.createIterator = function (assetTypeFilter, namespaceFilter, filterFunc) {
                if (typeof assetTypeFilter === "undefined") { assetTypeFilter = null; }
                if (typeof namespaceFilter === "undefined") { namespaceFilter = null; }
                if (typeof filterFunc === "undefined") { filterFunc = null; }
                return away.library.AssetLibrary.getBundle().createIterator(assetTypeFilter, namespaceFilter, filterFunc);
            };

            /**
            * Short-hand for load() method on default asset library bundle.
            *
            * @see away.library.AssetLibraryBundle.load()
            */
            AssetLibrary.load = function (req, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                return away.library.AssetLibrary.getBundle().load(req, context, ns, parser);
            };

            /**
            * Short-hand for loadData() method on default asset library bundle.
            *
            * @see away.library.AssetLibraryBundle.loadData()
            */
            AssetLibrary.loadData = function (data, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                return away.library.AssetLibrary.getBundle().loadData(data, context, ns, parser);
            };

            AssetLibrary.stopLoad = function () {
                away.library.AssetLibrary.getBundle().stopAllLoadingSessions();
            };

            /**
            * Short-hand for getAsset() method on default asset library bundle.
            *
            * @see away.library.AssetLibraryBundle.getAsset()
            */
            AssetLibrary.getAsset = function (name, ns) {
                if (typeof ns === "undefined") { ns = null; }
                return away.library.AssetLibrary.getBundle().getAsset(name, ns);
            };

            /**
            * Short-hand for addEventListener() method on default asset library bundle.
            */
            AssetLibrary.addEventListener = function (type, listener, target) {
                away.library.AssetLibrary.getBundle().addEventListener(type, listener, target);
            };

            /**
            * Short-hand for removeEventListener() method on default asset library bundle.
            */
            AssetLibrary.removeEventListener = function (type, listener, target) {
                away.library.AssetLibrary.getBundle().removeEventListener(type, listener, target);
            };

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
            AssetLibrary.addAsset = function (asset) {
                away.library.AssetLibrary.getBundle().addAsset(asset);
            };

            /**
            * Short-hand for removeAsset() method on default asset library bundle.
            *
            * @param asset The asset which should be removed from the library.
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away.library.AssetLibraryBundle.removeAsset()
            */
            AssetLibrary.removeAsset = function (asset, dispose) {
                if (typeof dispose === "undefined") { dispose = true; }
                away.library.AssetLibrary.getBundle().removeAsset(asset, dispose);
            };

            /**
            * Short-hand for removeAssetByName() method on default asset library bundle.
            *
            * @param name The name of the asset to be removed.
            * @param ns The namespace to which the desired asset belongs.
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away.library.AssetLibraryBundle.removeAssetByName()
            */
            AssetLibrary.removeAssetByName = function (name, ns, dispose) {
                if (typeof ns === "undefined") { ns = null; }
                if (typeof dispose === "undefined") { dispose = true; }
                return away.library.AssetLibrary.getBundle().removeAssetByName(name, ns, dispose);
            };

            /**
            * Short-hand for removeAllAssets() method on default asset library bundle.
            *
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away.library.AssetLibraryBundle.removeAllAssets()
            */
            AssetLibrary.removeAllAssets = function (dispose) {
                if (typeof dispose === "undefined") { dispose = true; }
                away.library.AssetLibrary.getBundle().removeAllAssets(dispose);
            };

            /**
            * Short-hand for removeNamespaceAssets() method on default asset library bundle.
            *
            * @see away.library.AssetLibraryBundle.removeNamespaceAssets()
            */
            AssetLibrary.removeNamespaceAssets = function (ns, dispose) {
                if (typeof ns === "undefined") { ns = null; }
                if (typeof dispose === "undefined") { dispose = true; }
                away.library.AssetLibrary.getBundle().removeNamespaceAssets(ns, dispose);
            };
            AssetLibrary._iInstances = {};
            return AssetLibrary;
        })();
        library.AssetLibrary = AssetLibrary;
    })(away.library || (away.library = {}));
    var library = away.library;
})(away || (away = {}));

// singleton enforcer
var AssetLibrarySingletonEnforcer = (function () {
    function AssetLibrarySingletonEnforcer() {
    }
    return AssetLibrarySingletonEnforcer;
})();
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (display) {
        /**
        *
        */
        var BitmapData = (function () {
            /**
            *
            * @param width
            * @param height
            * @param transparent
            * @param fillColor
            */
            function BitmapData(width, height, transparent, fillColor) {
                if (typeof transparent === "undefined") { transparent = true; }
                if (typeof fillColor === "undefined") { fillColor = null; }
                this._alpha = 1;
                this._locked = false;
                this._transparent = transparent;
                this._imageCanvas = document.createElement("canvas");
                this._imageCanvas.width = width;
                this._imageCanvas.height = height;
                this._context = this._imageCanvas.getContext("2d");
                this._rect = new away.geom.Rectangle(0, 0, width, height);

                if (fillColor != null) {
                    if (this._transparent) {
                        this._alpha = away.utils.ColorUtils.float32ColorToARGB(fillColor)[0] / 255;
                    } else {
                        this._alpha = 1;
                    }

                    this.fillRect(this._rect, fillColor);
                }
            }
            /**
            *
            */
            BitmapData.prototype.dispose = function () {
                this._context = null;
                this._imageCanvas = null;
                this._imageData = null;
                this._rect = null;
                this._transparent = null;
                this._locked = null;
            };

            /**
            *
            */
            BitmapData.prototype.lock = function () {
                this._locked = true;
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
            };

            /**
            *
            */
            BitmapData.prototype.unlock = function () {
                this._locked = false;

                if (this._imageData) {
                    this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
                    this._imageData = null;
                }
            };

            /**
            *
            * @param x
            * @param y
            * @param color
            */
            BitmapData.prototype.getPixel = function (x, y) {
                var r;
                var g;
                var b;
                var a;

                if (!this._locked) {
                    var pixelData = this._context.getImageData(x, y, 1, 1);

                    r = pixelData.data[0];
                    g = pixelData.data[1];
                    b = pixelData.data[2];
                    a = pixelData.data[3];
                } else {
                    var index = (x + y * this._imageCanvas.width) * 4;

                    if (!this._imageData)
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

                    r = this._imageData.data[index + 0];
                    g = this._imageData.data[index + 1];
                    b = this._imageData.data[index + 2];
                    a = this._imageData.data[index + 3];
                }

                if (!this._locked) {
                    this._imageData = null;
                }

                return (a << 24) | (r << 16) | (g << 8) | b;
            };

            /**
            *
            * @param x
            * @param y
            * @param color
            */
            BitmapData.prototype.setPixel = function (x, y, color) {
                var argb = away.utils.ColorUtils.float32ColorToARGB(color);

                if (!this._locked) {
                    this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                }

                if (this._imageData) {
                    var index = (x + y * this._imageCanvas.width) * 4;

                    this._imageData.data[index + 0] = argb[1];
                    this._imageData.data[index + 1] = argb[2];
                    this._imageData.data[index + 2] = argb[3];
                    this._imageData.data[index + 3] = 255;
                }

                if (!this._locked) {
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };

            /**
            *
            * @param x
            * @param y
            * @param color
            */
            BitmapData.prototype.setPixel32 = function (x, y, color) {
                var argb = away.utils.ColorUtils.float32ColorToARGB(color);

                if (!this._locked) {
                    this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                }

                if (this._imageData) {
                    var index = (x + y * this._imageCanvas.width) * 4;

                    this._imageData.data[index + 0] = argb[1];
                    this._imageData.data[index + 1] = argb[2];
                    this._imageData.data[index + 2] = argb[3];
                    this._imageData.data[index + 3] = argb[0];
                }

                if (!this._locked) {
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };

            BitmapData.prototype.setVector = function (rect, inputVector) {
                if (!this._locked) {
                    this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                }

                if (this._imageData) {
                    var i, j, index, argb;
                    for (i = 0; i < rect.width; ++i) {
                        for (j = 0; j < rect.height; ++j) {
                            argb = away.utils.ColorUtils.float32ColorToARGB(inputVector[i + j * rect.width]);
                            index = (i + rect.x + (j + rect.y) * this._imageCanvas.width) * 4;

                            this._imageData.data[index + 0] = argb[1];
                            this._imageData.data[index + 1] = argb[2];
                            this._imageData.data[index + 2] = argb[3];
                            this._imageData.data[index + 3] = argb[0];
                        }
                    }
                }

                if (!this._locked) {
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };

            BitmapData.prototype.drawImage = function (img, sourceRect, destRect) {
                if (this._locked) {
                    // If canvas is locked:
                    //
                    //      1) copy image data back to canvas
                    //      2) draw object
                    //      3) read _imageData back out
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
                    }

                    this._drawImage(img, sourceRect, destRect);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._drawImage(img, sourceRect, destRect);
                }
            };

            BitmapData.prototype._drawImage = function (img, sourceRect, destRect) {
                if (img instanceof away.display.BitmapData) {
                    this._context.drawImage(img.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                } else if (img instanceof HTMLImageElement) {
                    this._context.drawImage(img, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                }
            };

            BitmapData.prototype.copyPixels = function (bmpd, sourceRect, destRect) {
                if (this._locked) {
                    // If canvas is locked:
                    //
                    //      1) copy image data back to canvas
                    //      2) draw object
                    //      3) read _imageData back out
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
                    }

                    this._copyPixels(bmpd, sourceRect, destRect);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._copyPixels(bmpd, sourceRect, destRect);
                }
            };

            BitmapData.prototype._copyPixels = function (bmpd, sourceRect, destRect) {
                if (bmpd instanceof away.display.BitmapData) {
                    this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                } else if (bmpd instanceof HTMLImageElement) {
                    this._context.drawImage(bmpd, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                }
            };

            /**
            *
            * @param rect
            * @param color
            */
            BitmapData.prototype.fillRect = function (rect, color) {
                if (this._locked) {
                    // If canvas is locked:
                    //
                    //      1) copy image data back to canvas
                    //      2) apply fill
                    //      3) read _imageData back out
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
                    }

                    this._context.fillStyle = this.hexToRGBACSS(color);
                    this._context.fillRect(rect.x, rect.y, rect.width, rect.height);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._context.fillStyle = this.hexToRGBACSS(color);
                    this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
                }
            };

            BitmapData.prototype.draw = function (source, matrix) {
                if (this._locked) {
                    // If canvas is locked:
                    //
                    //      1) copy image data back to canvas
                    //      2) draw object
                    //      3) read _imageData back out
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
                    }

                    this._draw(source, matrix);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._draw(source, matrix);
                }
            };

            BitmapData.prototype._draw = function (source, matrix) {
                if (source instanceof away.display.BitmapData) {
                    this._context.save();

                    if (matrix != null)
                        this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);

                    this._context.drawImage(source.canvas, 0, 0);
                    this._context.restore();
                } else if (source instanceof HTMLImageElement) {
                    this._context.save();

                    if (matrix != null)
                        this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);

                    this._context.drawImage(source, 0, 0);
                    this._context.restore();
                }
            };

            BitmapData.prototype.copyChannel = function (sourceBitmap, sourceRect, destPoint, sourceChannel, destChannel) {
                var imageData = sourceBitmap.imageData;

                if (!this._locked) {
                    this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                }

                if (this._imageData) {
                    var sourceData = sourceBitmap.imageData.data;
                    var destData = this._imageData.data;

                    var sourceOffset = Math.round(Math.log(sourceChannel) / Math.log(2));
                    var destOffset = Math.round(Math.log(destChannel) / Math.log(2));

                    var i, j, sourceIndex, destIndex;
                    for (i = 0; i < sourceRect.width; ++i) {
                        for (j = 0; j < sourceRect.height; ++j) {
                            sourceIndex = (i + sourceRect.x + (j + sourceRect.y) * sourceBitmap.width) * 4;
                            destIndex = (i + destPoint.x + (j + destPoint.y) * this.width) * 4;

                            destData[destIndex + destOffset] = sourceData[sourceIndex + sourceOffset];
                        }
                    }
                }

                if (!this._locked) {
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };

            BitmapData.prototype.colorTransform = function (rect, colorTransform) {
                if (!this._locked) {
                    this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                }

                if (this._imageData) {
                    var data = this._imageData.data;

                    var i, j, index;
                    for (i = 0; i < rect.width; ++i) {
                        for (j = 0; j < rect.height; ++j) {
                            index = (i + rect.x + (j + rect.y) * this.width) * 4;

                            data[index] = data[index] * colorTransform.redMultiplier + colorTransform.redOffset;
                            data[index + 1] = data[index + 1] * colorTransform.greenMultiplier + colorTransform.greenOffset;
                            data[index + 2] = data[index + 2] * colorTransform.blueMultiplier + colorTransform.blueOffset;
                            data[index + 3] = data[index + 3] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
                        }
                    }
                }

                if (!this._locked) {
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };


            Object.defineProperty(BitmapData.prototype, "imageData", {
                /**
                *
                * @returns {ImageData}
                */
                get: function () {
                    return this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                },
                /**
                *
                * @param {ImageData}
                */
                set: function (value) {
                    this._context.putImageData(value, 0, 0);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BitmapData.prototype, "width", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._imageCanvas.width;
                },
                /**
                *
                * @param {number}
                */
                set: function (value) {
                    this._rect.width = value;
                    this._imageCanvas.width = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapData.prototype, "height", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._imageCanvas.height;
                },
                /**
                *
                * @param {number}
                */
                set: function (value) {
                    this._rect.height = value;
                    this._imageCanvas.height = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapData.prototype, "rect", {
                /**
                *
                * @param {away.geom.Rectangle}
                */
                get: function () {
                    return this._rect;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BitmapData.prototype, "canvas", {
                /**
                *
                * @returns {HTMLCanvasElement}
                */
                get: function () {
                    return this._imageCanvas;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BitmapData.prototype, "context", {
                /**
                *
                * @returns {HTMLCanvasElement}
                */
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });

            // Private
            /**
            * convert decimal value to Hex
            */
            BitmapData.prototype.hexToRGBACSS = function (d) {
                var argb = away.utils.ColorUtils.float32ColorToARGB(d);

                if (this._transparent == false) {
                    argb[0] = 1;

                    return 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',' + argb[0] + ')';
                }

                return 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',' + argb[0] / 255 + ')';
            };
            return BitmapData;
        })();
        display.BitmapData = BitmapData;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (display) {
        var BitmapDataChannel = (function () {
            function BitmapDataChannel() {
            }
            BitmapDataChannel.ALPHA = 8;
            BitmapDataChannel.BLUE = 4;
            BitmapDataChannel.GREEN = 2;
            BitmapDataChannel.RED = 1;
            return BitmapDataChannel;
        })();
        display.BitmapDataChannel = BitmapDataChannel;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (display) {
        var BlendMode = (function () {
            function BlendMode() {
            }
            BlendMode.ADD = "add";
            BlendMode.ALPHA = "alpha";
            BlendMode.DARKEN = "darken";
            BlendMode.DIFFERENCE = "difference";
            BlendMode.ERASE = "erase";
            BlendMode.HARDLIGHT = "hardlight";
            BlendMode.INVERT = "invert";
            BlendMode.LAYER = "layer";
            BlendMode.LIGHTEN = "lighten";
            BlendMode.MULTIPLY = "multiply";
            BlendMode.NORMAL = "normal";
            BlendMode.OVERLAY = "overlay";
            BlendMode.SCREEN = "screen";
            BlendMode.SHADER = "shader";
            BlendMode.SUBTRACT = "subtract";
            return BlendMode;
        })();
        display.BlendMode = BlendMode;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (display) {
        var StageGL = (function (_super) {
            __extends(StageGL, _super);
            function StageGL(canvas) {
                _super.call(this);
                this._canvas = canvas;
            }
            StageGL.prototype.requestContext = function (aglslContext) {
                if (typeof aglslContext === "undefined") { aglslContext = false; }
                try  {
                    if (aglslContext) {
                        this._contextGL = new away.displayGL.AGLSLContextGL(this._canvas);
                    } else {
                        this._contextGL = new away.displayGL.ContextGL(this._canvas);
                    }
                } catch (e) {
                    this.dispatchEvent(new away.events.Event(away.events.Event.ERROR));
                }

                if (this._contextGL) {
                    this.dispatchEvent(new away.events.Event(away.events.Event.CONTEXTGL_CREATE));
                }
            };


            Object.defineProperty(StageGL.prototype, "width", {
                get: function () {
                    return this._width;
                },
                set: function (v) {
                    this._width = v;
                    away.utils.CSS.setCanvasWidth(this._canvas, v);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "height", {
                get: function () {
                    return this._height;
                },
                set: function (v) {
                    this._height = v;
                    away.utils.CSS.setCanvasHeight(this._canvas, v);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "x", {
                get: function () {
                    return this._x;
                },
                set: function (v) {
                    this._x = v;
                    away.utils.CSS.setCanvasX(this._canvas, v);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "y", {
                get: function () {
                    return this._y;
                },
                set: function (v) {
                    this._y = v;
                    away.utils.CSS.setCanvasY(this._canvas, v);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGL.prototype, "visible", {
                get: function () {
                    return away.utils.CSS.getCanvasVisibility(this._canvas);
                },
                set: function (v) {
                    away.utils.CSS.setCanvasVisibility(this._canvas, v);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "canvas", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGL.prototype, "contextGL", {
                get: function () {
                    return this._contextGL;
                },
                enumerable: true,
                configurable: true
            });
            return StageGL;
        })(away.events.EventDispatcher);
        display.StageGL = StageGL;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (display) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage(width, height) {
                if (typeof width === "undefined") { width = 640; }
                if (typeof height === "undefined") { height = 480; }
                _super.call(this);

                // Move ( to Sprite ) / possibly remove:
                if (!document) {
                    throw new away.errors.DocumentError("A root document object does not exist.");
                }

                this.initStageGLObjects();
                this.resize(width, height);
            }
            Stage.prototype.resize = function (width, height) {
                this._stageHeight = height;
                this._stageWidth = width;

                var s3d;

                for (var i = 0; i < Stage.STAGEGL_MAX_QUANTITY; ++i) {
                    s3d = this.stageGLs[i];
                    s3d.width = width;
                    s3d.height = height;
                    s3d.x = 0;
                    s3d.y = 0;
                    //away.utils.CSS.setCanvasSize( this.stageGLs[ i ].canvas, width, height );
                    //away.utils.CSS.setCanvasPosition( this.stageGLs[ i ].canvas, 0, 0, true );
                }
                this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));
            };

            Stage.prototype.getStageGLAt = function (index) {
                if (0 <= index && index < Stage.STAGEGL_MAX_QUANTITY) {
                    return this.stageGLs[index];
                }
                throw new away.errors.ArgumentError("Index is out of bounds [0.." + Stage.STAGEGL_MAX_QUANTITY + "]");
            };

            Stage.prototype.initStageGLObjects = function () {
                this.stageGLs = [];

                for (var i = 0; i < Stage.STAGEGL_MAX_QUANTITY; ++i) {
                    var canvas = this.createHTMLCanvasElement();
                    var stageGL = new away.display.StageGL(canvas);
                    stageGL.addEventListener(away.events.Event.CONTEXTGL_CREATE, this.onContextCreated, this);

                    this.stageGLs.push(stageGL);
                }
            };

            Stage.prototype.onContextCreated = function (e) {
                var stageGL = e.target;
                this.addChildHTMLElement(stageGL.canvas);
            };

            Stage.prototype.createHTMLCanvasElement = function () {
                return document.createElement("canvas");
            };

            Stage.prototype.addChildHTMLElement = function (canvas) {
                document.body.appendChild(canvas);
            };

            Object.defineProperty(Stage.prototype, "stageWidth", {
                get: function () {
                    return this._stageWidth;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage.prototype, "stageHeight", {
                get: function () {
                    return this._stageHeight;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage.prototype, "rect", {
                get: function () {
                    return new away.geom.Rectangle(0, 0, this._stageWidth, this._stageHeight);
                },
                enumerable: true,
                configurable: true
            });
            Stage.STAGEGL_MAX_QUANTITY = 8;
            return Stage;
        })(away.events.EventDispatcher);
        display.Stage = Stage;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var ContextGLClearMask = (function () {
            function ContextGLClearMask() {
            }
            ContextGLClearMask.COLOR = 8 << 11;
            ContextGLClearMask.DEPTH = 8 << 5;
            ContextGLClearMask.STENCIL = 8 << 7;
            ContextGLClearMask.ALL = ContextGLClearMask.COLOR | ContextGLClearMask.DEPTH | ContextGLClearMask.STENCIL;
            return ContextGLClearMask;
        })();
        displayGL.ContextGLClearMask = ContextGLClearMask;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var VertexBuffer = (function () {
            function VertexBuffer(gl, numVertices, data32PerVertex) {
                this._gl = gl;
                this._buffer = this._gl.createBuffer();
                this._numVertices = numVertices;
                this._data32PerVertex = data32PerVertex;
            }
            VertexBuffer.prototype.uploadFromArray = function (vertices, startVertex, numVertices) {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);

                //console.log( "** WARNING upload not fully implemented, startVertex & numVertices not considered." );
                // TODO add offsets , startVertex, numVertices * this._data32PerVertex
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
            };

            Object.defineProperty(VertexBuffer.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBuffer.prototype, "data32PerVertex", {
                get: function () {
                    return this._data32PerVertex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBuffer.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });

            VertexBuffer.prototype.dispose = function () {
                this._gl.deleteBuffer(this._buffer);
            };
            return VertexBuffer;
        })();
        displayGL.VertexBuffer = VertexBuffer;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var IndexBuffer = (function () {
            function IndexBuffer(gl, numIndices) {
                this._gl = gl;
                this._buffer = this._gl.createBuffer();
                this._numIndices = numIndices;
            }
            IndexBuffer.prototype.uploadFromArray = function (data, startOffset, count) {
                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);

                // TODO add index offsets
                this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this._gl.STATIC_DRAW);
            };

            IndexBuffer.prototype.dispose = function () {
                this._gl.deleteBuffer(this._buffer);
            };

            Object.defineProperty(IndexBuffer.prototype, "numIndices", {
                get: function () {
                    return this._numIndices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IndexBuffer.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            return IndexBuffer;
        })();
        displayGL.IndexBuffer = IndexBuffer;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var Program = (function () {
            function Program(gl) {
                this._gl = gl;
                this._program = this._gl.createProgram();
            }
            Program.prototype.upload = function (vertexProgram, fragmentProgram) {
                this._vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
                this._fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);

                this._gl.shaderSource(this._vertexShader, vertexProgram);
                this._gl.compileShader(this._vertexShader);

                if (!this._gl.getShaderParameter(this._vertexShader, this._gl.COMPILE_STATUS)) {
                    alert(this._gl.getShaderInfoLog(this._vertexShader));
                    return null;
                }

                this._gl.shaderSource(this._fragmentShader, fragmentProgram);
                this._gl.compileShader(this._fragmentShader);

                if (!this._gl.getShaderParameter(this._fragmentShader, this._gl.COMPILE_STATUS)) {
                    alert(this._gl.getShaderInfoLog(this._fragmentShader));
                    return null;
                }

                this._gl.attachShader(this._program, this._vertexShader);
                this._gl.attachShader(this._program, this._fragmentShader);
                this._gl.linkProgram(this._program);

                if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
                    alert("Could not link the program."); //TODO throw errors
                }
            };

            Program.prototype.dispose = function () {
                this._gl.deleteProgram(this._program);
            };

            Program.prototype.focusProgram = function () {
                this._gl.useProgram(this._program);
            };

            Object.defineProperty(Program.prototype, "glProgram", {
                get: function () {
                    return this._program;
                },
                enumerable: true,
                configurable: true
            });
            return Program;
        })();
        displayGL.Program = Program;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var SamplerState = (function () {
            function SamplerState() {
                this.wrap = 0;
                this.filter = 0;
                this.mipfilter = 0;
            }
            return SamplerState;
        })();
        displayGL.SamplerState = SamplerState;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLTextureFormat = (function () {
            function ContextGLTextureFormat() {
            }
            ContextGLTextureFormat.BGRA = "bgra";
            ContextGLTextureFormat.BGRA_PACKED = "bgraPacked4444";
            ContextGLTextureFormat.BGR_PACKED = "bgrPacked565";
            ContextGLTextureFormat.COMPRESSED = "compressed";
            ContextGLTextureFormat.COMPRESSED_ALPHA = "compressedAlpha";
            return ContextGLTextureFormat;
        })();
        displayGL.ContextGLTextureFormat = ContextGLTextureFormat;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var TextureBase = (function () {
            function TextureBase(gl) {
                this.textureType = "";
                this._gl = gl;
            }
            TextureBase.prototype.dispose = function () {
                throw "Abstract method must be overridden.";
            };
            return TextureBase;
        })();
        displayGL.TextureBase = TextureBase;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(gl, width, height) {
                _super.call(this, gl);
                this.textureType = "texture2d";
                this._width = width;
                this._height = height;

                this._glTexture = this._gl.createTexture();
            }
            Texture.prototype.dispose = function () {
                this._gl.deleteTexture(this._glTexture);
            };

            Object.defineProperty(Texture.prototype, "width", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Texture.prototype, "height", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Texture.prototype, "frameBuffer", {
                get: function () {
                    return this._frameBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Texture.prototype.uploadFromHTMLImageElement = function (image, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                this._gl.bindTexture(this._gl.TEXTURE_2D, this._glTexture);

                //this._gl.pixelStorei( this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._gl.ZERO );
                this._gl.texImage2D(this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            };

            Texture.prototype.uploadFromBitmapData = function (data, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                this._gl.bindTexture(this._gl.TEXTURE_2D, this._glTexture);

                //this._gl.pixelStorei( this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._gl.ZERO );
                this._gl.texImage2D(this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            };

            Object.defineProperty(Texture.prototype, "glTexture", {
                get: function () {
                    return this._glTexture;
                },
                enumerable: true,
                configurable: true
            });

            Texture.prototype.generateFromRenderBuffer = function (data) {
                this._frameBuffer = this._gl.createFramebuffer();
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
                this._frameBuffer.width = this._width;
                this._frameBuffer.height = this._height;

                this._gl.bindTexture(this._gl.TEXTURE_2D, this._glTexture);

                //this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
                //this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_NEAREST);
                //this._gl.generateMipmap(this._gl.TEXTURE_2D);
                //this._gl.texImage2D( this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
                this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._width, this._height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);

                var renderBuffer = this._gl.createRenderbuffer();
                this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, renderBuffer);
                this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);

                this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._glTexture, 0);
                this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, renderBuffer);

                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
                this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            };

            Texture.prototype.generateMipmaps = function () {
                //this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
                //this._gl.generateMipmap(this._gl.TEXTURE_2D);
                //this._gl.bindTexture( this._gl.TEXTURE_2D, null );
            };
            return Texture;
        })(away.displayGL.TextureBase);
        displayGL.Texture = Texture;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var CubeTexture = (function (_super) {
            __extends(CubeTexture, _super);
            function CubeTexture(gl, size) {
                _super.call(this, gl);
                this.textureType = "textureCube";
                this._size = size;
                this._texture = this._gl.createTexture();
            }
            CubeTexture.prototype.dispose = function () {
                this._gl.deleteTexture(this._texture);
            };

            CubeTexture.prototype.uploadFromHTMLImageElement = function (image, side, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);

                switch (side) {
                    case 0:
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);

                        break;
                    case 1:
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_NEGATIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
                        break;
                    case 2:
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
                        break;
                    case 3:
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
                        break;
                    case 4:
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
                        break;
                    case 5:
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
                        break;
                    default:
                        throw "unknown side type";
                }

                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
            };

            CubeTexture.prototype.uploadFromBitmapData = function (data, side, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                switch (side) {
                    case 0:
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                        break;
                    case 1:
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_NEGATIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                        break;
                    case 2:
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                        break;
                    case 3:
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                        break;
                    case 4:
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                        break;
                    case 5:
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._texture);
                        this._gl.texImage2D(this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData);
                        this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                        break;
                    default:
                        throw "unknown side type";
                }
            };

            Object.defineProperty(CubeTexture.prototype, "size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CubeTexture.prototype, "glTexture", {
                get: function () {
                    return this._texture;
                },
                enumerable: true,
                configurable: true
            });
            return CubeTexture;
        })(away.displayGL.TextureBase);
        displayGL.CubeTexture = CubeTexture;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLTriangleFace = (function () {
            function ContextGLTriangleFace() {
            }
            ContextGLTriangleFace.BACK = "back";
            ContextGLTriangleFace.FRONT = "front";
            ContextGLTriangleFace.FRONT_AND_BACK = "frontAndBack";
            ContextGLTriangleFace.NONE = "none";
            return ContextGLTriangleFace;
        })();
        displayGL.ContextGLTriangleFace = ContextGLTriangleFace;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var ContextGLVertexBufferFormat = (function () {
            function ContextGLVertexBufferFormat() {
            }
            ContextGLVertexBufferFormat.BYTES_4 = "bytes4";
            ContextGLVertexBufferFormat.FLOAT_1 = "float1";
            ContextGLVertexBufferFormat.FLOAT_2 = "float2";
            ContextGLVertexBufferFormat.FLOAT_3 = "float3";
            ContextGLVertexBufferFormat.FLOAT_4 = "float4";
            return ContextGLVertexBufferFormat;
        })();
        displayGL.ContextGLVertexBufferFormat = ContextGLVertexBufferFormat;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var ContextGLProgramType = (function () {
            function ContextGLProgramType() {
            }
            ContextGLProgramType.FRAGMENT = "fragment";
            ContextGLProgramType.VERTEX = "vertex";
            return ContextGLProgramType;
        })();
        displayGL.ContextGLProgramType = ContextGLProgramType;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLBlendFactor = (function () {
            function ContextGLBlendFactor() {
            }
            ContextGLBlendFactor.DESTINATION_ALPHA = "destinationAlpha";
            ContextGLBlendFactor.DESTINATION_COLOR = "destinationColor";
            ContextGLBlendFactor.ONE = "one";
            ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA = "oneMinusDestinationAlpha";
            ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR = "oneMinusDestinationColor";
            ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA = "oneMinusSourceAlpha";
            ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR = "oneMinusSourceColor";
            ContextGLBlendFactor.SOURCE_ALPHA = "sourceAlpha";
            ContextGLBlendFactor.SOURCE_COLOR = "sourceColor";
            ContextGLBlendFactor.ZERO = "zero";
            return ContextGLBlendFactor;
        })();
        displayGL.ContextGLBlendFactor = ContextGLBlendFactor;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLCompareMode = (function () {
            function ContextGLCompareMode() {
            }
            ContextGLCompareMode.ALWAYS = "always";
            ContextGLCompareMode.EQUAL = "equal";
            ContextGLCompareMode.GREATER = "greater";
            ContextGLCompareMode.GREATER_EQUAL = "greaterEqual";
            ContextGLCompareMode.LESS = "less";
            ContextGLCompareMode.LESS_EQUAL = "lessEqual";
            ContextGLCompareMode.NEVER = "never";
            ContextGLCompareMode.NOT_EQUAL = "notEqual";
            return ContextGLCompareMode;
        })();
        displayGL.ContextGLCompareMode = ContextGLCompareMode;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLMipFilter = (function () {
            function ContextGLMipFilter() {
            }
            ContextGLMipFilter.MIPLINEAR = "miplinear";
            ContextGLMipFilter.MIPNEAREST = "mipnearest";
            ContextGLMipFilter.MIPNONE = "mipnone";
            return ContextGLMipFilter;
        })();
        displayGL.ContextGLMipFilter = ContextGLMipFilter;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLProfile = (function () {
            function ContextGLProfile() {
            }
            ContextGLProfile.BASELINE = "baseline";
            ContextGLProfile.BASELINE_CONSTRAINED = "baselineConstrained";
            ContextGLProfile.BASELINE_EXTENDED = "baselineExtended";
            return ContextGLProfile;
        })();
        displayGL.ContextGLProfile = ContextGLProfile;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLStencilAction = (function () {
            function ContextGLStencilAction() {
            }
            ContextGLStencilAction.DECREMENT_SATURATE = "decrementSaturate";
            ContextGLStencilAction.DECREMENT_WRAP = "decrementWrap";
            ContextGLStencilAction.INCREMENT_SATURATE = "incrementSaturate";
            ContextGLStencilAction.INCREMENT_WRAP = "incrementWrap";
            ContextGLStencilAction.INVERT = "invert";
            ContextGLStencilAction.KEEP = "keep";
            ContextGLStencilAction.SET = "set";
            ContextGLStencilAction.ZERO = "zero";
            return ContextGLStencilAction;
        })();
        displayGL.ContextGLStencilAction = ContextGLStencilAction;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (displayGL) {
        var ContextGLTextureFilter = (function () {
            function ContextGLTextureFilter() {
            }
            ContextGLTextureFilter.LINEAR = "linear";
            ContextGLTextureFilter.NEAREST = "nearest";
            return ContextGLTextureFilter;
        })();
        displayGL.ContextGLTextureFilter = ContextGLTextureFilter;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var ContextGLWrapMode = (function () {
            function ContextGLWrapMode() {
            }
            ContextGLWrapMode.CLAMP = "clamp";
            ContextGLWrapMode.REPEAT = "repeat";
            return ContextGLWrapMode;
        })();
        displayGL.ContextGLWrapMode = ContextGLWrapMode;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var ContextGL = (function () {
            function ContextGL(canvas) {
                this._currentWrap = 0;
                this._currentFilter = 0;
                this._currentMipFilter = 0;
                this._indexBufferList = [];
                this._vertexBufferList = [];
                this._textureList = [];
                this._programList = [];
                this._samplerStates = [];
                try  {
                    this._gl = canvas.getContext("experimental-webgl", { premultipliedAlpha: false, alpha: false });
                    if (!this._gl) {
                        this._gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: false });
                    }
                } catch (e) {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
                }

                if (this._gl) {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
                } else {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
                    alert("WebGL is not available.");
                }

                for (var i = 0; i < ContextGL.MAX_SAMPLERS; ++i) {
                    this._samplerStates[i] = new away.displayGL.SamplerState();
                    this._samplerStates[i].wrap = this._gl.REPEAT;
                    this._samplerStates[i].filter = this._gl.LINEAR;
                    this._samplerStates[i].mipfilter = 0;
                }
            }
            ContextGL.prototype.gl = function () {
                return this._gl;
            };

            ContextGL.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
                if (typeof red === "undefined") { red = 0; }
                if (typeof green === "undefined") { green = 0; }
                if (typeof blue === "undefined") { blue = 0; }
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof depth === "undefined") { depth = 1; }
                if (typeof stencil === "undefined") { stencil = 0; }
                if (typeof mask === "undefined") { mask = away.displayGL.ContextGLClearMask.ALL; }
                if (!this._drawing) {
                    this.updateBlendStatus();
                    this._drawing = true;
                }
                this._gl.clearColor(red, green, blue, alpha);
                this._gl.clearDepth(depth);
                this._gl.clearStencil(stencil);
                this._gl.clear(mask);
            };

            ContextGL.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
                if (enableDepthAndStencil) {
                    this._gl.enable(this._gl.STENCIL_TEST);
                    this._gl.enable(this._gl.DEPTH_TEST);
                }

                this._gl.viewport['width'] = width;
                this._gl.viewport['height'] = height;

                this._gl.viewport(0, 0, width, height);
            };

            ContextGL.prototype.createCubeTexture = function (size, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                var texture = new away.displayGL.CubeTexture(this._gl, size);
                this._textureList.push(texture);
                return texture;
            };

            ContextGL.prototype.createIndexBuffer = function (numIndices) {
                var indexBuffer = new away.displayGL.IndexBuffer(this._gl, numIndices);
                this._indexBufferList.push(indexBuffer);
                return indexBuffer;
            };

            ContextGL.prototype.createProgram = function () {
                var program = new away.displayGL.Program(this._gl);
                this._programList.push(program);
                return program;
            };

            ContextGL.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                //TODO streaming
                var texture = new away.displayGL.Texture(this._gl, width, height);
                this._textureList.push(texture);
                return texture;
            };

            ContextGL.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                var vertexBuffer = new away.displayGL.VertexBuffer(this._gl, numVertices, data32PerVertex);
                this._vertexBufferList.push(vertexBuffer);
                return vertexBuffer;
            };

            ContextGL.prototype.dispose = function () {
                var i;
                for (i = 0; i < this._indexBufferList.length; ++i) {
                    this._indexBufferList[i].dispose();
                }
                this._indexBufferList = null;

                for (i = 0; i < this._vertexBufferList.length; ++i) {
                    this._vertexBufferList[i].dispose();
                }
                this._vertexBufferList = null;

                for (i = 0; i < this._textureList.length; ++i) {
                    this._textureList[i].dispose();
                }
                this._textureList = null;

                for (i = 0; i < this._programList.length; ++i) {
                    this._programList[i].dispose();
                }

                for (i = 0; i < this._samplerStates.length; ++i) {
                    this._samplerStates[i] = null;
                }

                this._programList = null;
            };

            ContextGL.prototype.drawToBitmapData = function (destination) {
                throw new away.errors.PartialImplementationError();
            };

            ContextGL.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
                if (typeof firstIndex === "undefined") { firstIndex = 0; }
                if (typeof numTriangles === "undefined") { numTriangles = -1; }
                if (!this._drawing) {
                    throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";
                }

                var numIndices = 0;

                if (numTriangles == -1) {
                    numIndices = indexBuffer.numIndices;
                } else {
                    numIndices = numTriangles * 3;
                }

                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
                this._gl.drawElements(this._gl.TRIANGLES, numIndices, this._gl.UNSIGNED_SHORT, firstIndex);
            };

            ContextGL.prototype.present = function () {
                this._drawing = false;
                //this._gl.useProgram( null );
            };

            ContextGL.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
                this._blendEnabled = true;

                switch (sourceFactor) {
                    case away.displayGL.ContextGLBlendFactor.ONE:
                        this._blendSourceFactor = this._gl.ONE;
                        break;
                    case away.displayGL.ContextGLBlendFactor.DESTINATION_ALPHA:
                        this._blendSourceFactor = this._gl.DST_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.DESTINATION_COLOR:
                        this._blendSourceFactor = this._gl.DST_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE:
                        this._blendSourceFactor = this._gl.ONE;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA:
                        this._blendSourceFactor = this._gl.ONE_MINUS_DST_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR:
                        this._blendSourceFactor = this._gl.ONE_MINUS_DST_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA:
                        this._blendSourceFactor = this._gl.ONE_MINUS_SRC_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR:
                        this._blendSourceFactor = this._gl.ONE_MINUS_SRC_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.SOURCE_ALPHA:
                        this._blendSourceFactor = this._gl.SRC_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.SOURCE_COLOR:
                        this._blendSourceFactor = this._gl.SRC_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ZERO:
                        this._blendSourceFactor = this._gl.ZERO;
                        break;
                    default:
                        throw "Unknown blend source factor";
                        break;
                }

                switch (destinationFactor) {
                    case away.displayGL.ContextGLBlendFactor.ONE:
                        this._blendDestinationFactor = this._gl.ONE;
                        break;
                    case away.displayGL.ContextGLBlendFactor.DESTINATION_ALPHA:
                        this._blendDestinationFactor = this._gl.DST_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.DESTINATION_COLOR:
                        this._blendDestinationFactor = this._gl.DST_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE:
                        this._blendDestinationFactor = this._gl.ONE;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_DESTINATION_ALPHA:
                        this._blendDestinationFactor = this._gl.ONE_MINUS_DST_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_DESTINATION_COLOR:
                        this._blendDestinationFactor = this._gl.ONE_MINUS_DST_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA:
                        this._blendDestinationFactor = this._gl.ONE_MINUS_SRC_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR:
                        this._blendDestinationFactor = this._gl.ONE_MINUS_SRC_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.SOURCE_ALPHA:
                        this._blendDestinationFactor = this._gl.SRC_ALPHA;
                        break;
                    case away.displayGL.ContextGLBlendFactor.SOURCE_COLOR:
                        this._blendDestinationFactor = this._gl.SRC_COLOR;
                        break;
                    case away.displayGL.ContextGLBlendFactor.ZERO:
                        this._blendDestinationFactor = this._gl.ZERO;
                        break;
                    default:
                        throw "Unknown blend destination factor";
                        break;
                }

                this.updateBlendStatus();
            };

            ContextGL.prototype.setColorMask = function (red, green, blue, alpha) {
                this._gl.colorMask(red, green, blue, alpha);
            };

            ContextGL.prototype.setCulling = function (triangleFaceToCull) {
                if (triangleFaceToCull == away.displayGL.ContextGLTriangleFace.NONE) {
                    this._gl.disable(this._gl.CULL_FACE);
                } else {
                    this._gl.enable(this._gl.CULL_FACE);
                    switch (triangleFaceToCull) {
                        case away.displayGL.ContextGLTriangleFace.FRONT:
                            this._gl.cullFace(this._gl.BACK);
                            break;
                        case away.displayGL.ContextGLTriangleFace.BACK:
                            this._gl.cullFace(this._gl.FRONT);
                            break;
                        case away.displayGL.ContextGLTriangleFace.FRONT_AND_BACK:
                            this._gl.cullFace(this._gl.FRONT_AND_BACK);
                            break;
                        default:
                            throw "Unknown ContextGLTriangleFace type.";
                    }
                }
            };

            // TODO ContextGLCompareMode
            ContextGL.prototype.setDepthTest = function (depthMask, passCompareMode) {
                switch (passCompareMode) {
                    case away.displayGL.ContextGLCompareMode.ALWAYS:
                        this._gl.depthFunc(this._gl.ALWAYS);
                        break;
                    case away.displayGL.ContextGLCompareMode.EQUAL:
                        this._gl.depthFunc(this._gl.EQUAL);
                        break;
                    case away.displayGL.ContextGLCompareMode.GREATER:
                        this._gl.depthFunc(this._gl.GREATER);
                        break;
                    case away.displayGL.ContextGLCompareMode.GREATER_EQUAL:
                        this._gl.depthFunc(this._gl.GEQUAL);
                        break;
                    case away.displayGL.ContextGLCompareMode.LESS:
                        this._gl.depthFunc(this._gl.LESS);
                        break;
                    case away.displayGL.ContextGLCompareMode.LESS_EQUAL:
                        this._gl.depthFunc(this._gl.LEQUAL);
                        break;
                    case away.displayGL.ContextGLCompareMode.NEVER:
                        this._gl.depthFunc(this._gl.NEVER);
                        break;
                    case away.displayGL.ContextGLCompareMode.NOT_EQUAL:
                        this._gl.depthFunc(this._gl.NOTEQUAL);
                        break;
                    default:
                        throw "Unknown ContextGLCompareMode type.";
                        break;
                }
                this._gl.depthMask(depthMask);
            };

            ContextGL.prototype.setProgram = function (program) {
                //TODO decide on construction/reference resposibilities
                this._currentProgram = program;
                program.focusProgram();
            };

            ContextGL.prototype.getUniformLocationNameFromAgalRegisterIndex = function (programType, firstRegister) {
                switch (programType) {
                    case away.displayGL.ContextGLProgramType.VERTEX:
                        return "vc";
                        break;
                    case away.displayGL.ContextGLProgramType.FRAGMENT:
                        return "fc";
                        break;
                    default:
                        throw "Program Type " + programType + " not supported";
                }
            };

            /*
            public setProgramConstantsFromByteArray
            */
            ContextGL.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                var locationName = this.getUniformLocationNameFromAgalRegisterIndex(programType, firstRegister);
                this.setGLSLProgramConstantsFromMatrix(locationName, matrix, transposedMatrix);
            };

            ContextGL.prototype.setProgramConstantsFromArray = function (programType, firstRegister, data, numRegisters) {
                if (typeof numRegisters === "undefined") { numRegisters = -1; }
                for (var i = 0; i < numRegisters; ++i) {
                    var currentIndex = i * 4;
                    var locationName = this.getUniformLocationNameFromAgalRegisterIndex(programType, firstRegister + i) + (i + firstRegister);

                    this.setGLSLProgramConstantsFromArray(locationName, data, currentIndex);
                }
            };

            /*
            public setGLSLProgramConstantsFromByteArray
            
            */
            ContextGL.prototype.setGLSLProgramConstantsFromMatrix = function (locationName, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                var location = this._gl.getUniformLocation(this._currentProgram.glProgram, locationName);
                this._gl.uniformMatrix4fv(location, !transposedMatrix, new Float32Array(matrix.rawData));
            };

            ContextGL.prototype.setGLSLProgramConstantsFromArray = function (locationName, data, startIndex) {
                if (typeof startIndex === "undefined") { startIndex = 0; }
                var location = this._gl.getUniformLocation(this._currentProgram.glProgram, locationName);
                this._gl.uniform4f(location, data[startIndex], data[startIndex + 1], data[startIndex + 2], data[startIndex + 3]);
            };

            ContextGL.prototype.setScissorRectangle = function (rectangle) {
                if (!rectangle) {
                    this._gl.disable(this._gl.SCISSOR_TEST);
                    return;
                }

                this._gl.enable(this._gl.SCISSOR_TEST);
                this._gl.scissor(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            };

            ContextGL.prototype.setTextureAt = function (sampler, texture) {
                var locationName = "fs" + sampler;
                this.setGLSLTextureAt(locationName, texture, sampler);
            };

            ContextGL.prototype.setGLSLTextureAt = function (locationName, texture, textureIndex) {
                if (!texture) {
                    this._gl.activeTexture(this._gl.TEXTURE0 + (textureIndex));
                    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
                    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                    return;
                }

                switch (textureIndex) {
                    case 0:
                        this._gl.activeTexture(this._gl.TEXTURE0);
                        break;
                    case 1:
                        this._gl.activeTexture(this._gl.TEXTURE1);
                        break;
                    case 2:
                        this._gl.activeTexture(this._gl.TEXTURE2);
                        break;
                    case 3:
                        this._gl.activeTexture(this._gl.TEXTURE3);
                        break;
                    case 4:
                        this._gl.activeTexture(this._gl.TEXTURE4);
                        break;
                    case 5:
                        this._gl.activeTexture(this._gl.TEXTURE5);
                        break;
                    case 6:
                        this._gl.activeTexture(this._gl.TEXTURE6);
                        break;
                    case 7:
                        this._gl.activeTexture(this._gl.TEXTURE7);
                        break;
                    default:
                        throw "Texture " + textureIndex + " is out of bounds.";
                }

                var location = this._gl.getUniformLocation(this._currentProgram.glProgram, locationName);

                if (texture.textureType == "texture2d") {
                    this._gl.bindTexture(this._gl.TEXTURE_2D, texture.glTexture);
                    this._gl.uniform1i(location, textureIndex);
                    var samplerState = this._samplerStates[textureIndex];

                    if (samplerState.wrap != this._currentWrap) {
                        //this._currentWrap = samplerState.wrap;
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, samplerState.wrap);
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, samplerState.wrap);
                    }

                    if (samplerState.filter != this._currentFilter) {
                        //this._currentFilter = samplerState.filter;
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, samplerState.filter);
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, samplerState.filter);
                    }

                    if (samplerState.mipfilter != this._currentMipFilter) {
                        //this._currentMipFilter = samplerState.mipfilter;
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, samplerState.mipfilter);
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, samplerState.mipfilter);
                    }
                    //this._gl.bindTexture( this._gl.TEXTURE_2D, null );
                } else if (texture.textureType == "textureCube") {
                    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, texture.glTexture);
                    this._gl.uniform1i(location, textureIndex);
                    var samplerState = this._samplerStates[textureIndex];

                    if (samplerState.wrap != this._currentWrap) {
                        //this._currentWrap = samplerState.wrap;
                        this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_S, samplerState.wrap);
                        this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_T, samplerState.wrap);
                    }

                    if (samplerState.filter != this._currentFilter) {
                        //this._currentFilter = samplerState.filter;
                        this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_MIN_FILTER, samplerState.filter);
                        this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_MAG_FILTER, samplerState.filter);
                    }

                    if (samplerState.mipfilter != this._currentMipFilter) {
                        //this._currentMipFilter = samplerState.mipfilter;
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, samplerState.mipfilter);
                        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, samplerState.mipfilter);
                    }
                    //this._gl.bindTexture( this._gl.TEXTURE_CUBE_MAP, null );
                }
            };

            ContextGL.prototype.setSamplerStateAt = function (sampler, wrap, filter, mipfilter) {
                var glWrap = 0;
                var glFilter = 0;
                var glMipFilter = 0;

                switch (wrap) {
                    case away.displayGL.ContextGLWrapMode.REPEAT:
                        glWrap = this._gl.REPEAT;
                        break;
                    case away.displayGL.ContextGLWrapMode.CLAMP:
                        glWrap = this._gl.CLAMP_TO_EDGE;
                        break;
                    default:
                        throw "Wrap is not supported: " + wrap;
                }

                switch (filter) {
                    case away.displayGL.ContextGLTextureFilter.LINEAR:
                        glFilter = this._gl.LINEAR;
                        break;
                    case away.displayGL.ContextGLTextureFilter.NEAREST:
                        glFilter = this._gl.NEAREST;
                        break;
                    default:
                        throw "Filter is not supported " + filter;
                }

                switch (mipfilter) {
                    case away.displayGL.ContextGLMipFilter.MIPNEAREST:
                        glMipFilter = this._gl.NEAREST_MIPMAP_NEAREST;
                        break;
                    case away.displayGL.ContextGLMipFilter.MIPLINEAR:
                        glMipFilter = this._gl.LINEAR_MIPMAP_LINEAR;
                        break;
                    case away.displayGL.ContextGLMipFilter.MIPNONE:
                        glMipFilter = this._gl.NONE;
                        break;
                    default:
                        throw "MipFilter is not supported " + mipfilter;
                }

                if (0 <= sampler && sampler < ContextGL.MAX_SAMPLERS) {
                    this._samplerStates[sampler].wrap = glWrap;
                    this._samplerStates[sampler].filter = glFilter;
                    this._samplerStates[sampler].mipfilter = glMipFilter;
                } else {
                    throw "Sampler is out of bounds.";
                }
            };

            ContextGL.prototype.setVertexBufferAt = function (index, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                var locationName = "va" + index;
                this.setGLSLVertexBufferAt(locationName, buffer, bufferOffset, format);
            };

            ContextGL.prototype.setGLSLVertexBufferAt = function (locationName, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                //if ( buffer == null )return;
                var location = this._currentProgram ? this._gl.getAttribLocation(this._currentProgram.glProgram, locationName) : -1;
                if (!buffer) {
                    if (location > -1) {
                        this._gl.disableVertexAttribArray(location);
                    }
                    return;
                }

                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer.glBuffer);

                var dimension;
                var type = this._gl.FLOAT;
                var numBytes = 4;

                switch (format) {
                    case away.displayGL.ContextGLVertexBufferFormat.BYTES_4:
                        dimension = 4;
                        break;
                    case away.displayGL.ContextGLVertexBufferFormat.FLOAT_1:
                        dimension = 1;
                        break;
                    case away.displayGL.ContextGLVertexBufferFormat.FLOAT_2:
                        dimension = 2;
                        break;
                    case away.displayGL.ContextGLVertexBufferFormat.FLOAT_3:
                        dimension = 3;
                        break;
                    case away.displayGL.ContextGLVertexBufferFormat.FLOAT_4:
                        dimension = 4;
                        break;
                    default:
                        throw "Buffer format " + format + " is not supported.";
                }

                this._gl.enableVertexAttribArray(location);
                this._gl.vertexAttribPointer(location, dimension, type, false, buffer.data32PerVertex * numBytes, bufferOffset * numBytes);
            };

            ContextGL.prototype.setRenderToTexture = function (target, enableDepthAndStencil, antiAlias, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof antiAlias === "undefined") { antiAlias = 0; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                var frameBuffer = target.frameBuffer;
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer);

                if (enableDepthAndStencil) {
                    this._gl.enable(this._gl.STENCIL_TEST);
                    this._gl.enable(this._gl.DEPTH_TEST);
                }

                this._gl.viewport['width'] = frameBuffer.width;
                this._gl.viewport['height'] = frameBuffer.height;

                this._gl.viewport(0, 0, frameBuffer.width, frameBuffer.height);
            };

            ContextGL.prototype.setRenderToBackBuffer = function () {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            };

            ContextGL.prototype.updateBlendStatus = function () {
                if (this._blendEnabled) {
                    this._gl.enable(this._gl.BLEND);
                    this._gl.blendEquation(this._gl.FUNC_ADD);
                    this._gl.blendFunc(this._blendSourceFactor, this._blendDestinationFactor);
                } else {
                    this._gl.disable(this._gl.BLEND);
                }
            };
            ContextGL.MAX_SAMPLERS = 8;

            ContextGL.modulo = 0;
            return ContextGL;
        })();
        displayGL.ContextGL = ContextGL;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (displayGL) {
        var AGLSLContextGL = (function (_super) {
            __extends(AGLSLContextGL, _super);
            function AGLSLContextGL(canvas) {
                _super.call(this, canvas);
                this._yFlip = -1;
            }
            //@override
            AGLSLContextGL.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                /*
                console.log( "======== setProgramConstantsFromMatrix ========" );
                console.log( "programType       >>> " + programType );
                console.log( "firstRegister     >>> " + firstRegister );
                console.log( "matrix            >>> " + matrix.rawData );
                console.log( "transposedMatrix  >>> " + transposedMatrix );
                */
                var d = matrix.rawData;
                if (transposedMatrix) {
                    this.setProgramConstantsFromArray(programType, firstRegister, [d[0], d[4], d[8], d[12]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 1, [d[1], d[5], d[9], d[13]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 2, [d[2], d[6], d[10], d[14]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 3, [d[3], d[7], d[11], d[15]], 1);
                } else {
                    this.setProgramConstantsFromArray(programType, firstRegister, [d[0], d[1], d[2], d[3]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 1, [d[4], d[5], d[6], d[7]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 2, [d[8], d[9], d[10], d[11]], 1);
                    this.setProgramConstantsFromArray(programType, firstRegister + 3, [d[12], d[13], d[14], d[15]], 1);
                }
            };

            //@override
            AGLSLContextGL.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
                if (typeof firstIndex === "undefined") { firstIndex = 0; }
                if (typeof numTriangles === "undefined") { numTriangles = -1; }
                /*
                console.log( "======= drawTriangles ========" );
                console.log( indexBuffer );
                console.log( "firstIndex: " +  firstIndex );
                console.log( "numTriangles:" + numTriangles );
                */
                var location = this._gl.getUniformLocation(this._currentProgram.glProgram, "yflip");
                this._gl.uniform1f(location, this._yFlip);
                _super.prototype.drawTriangles.call(this, indexBuffer, firstIndex, numTriangles);
            };

            //@override
            AGLSLContextGL.prototype.setCulling = function (triangleFaceToCull) {
                _super.prototype.setCulling.call(this, triangleFaceToCull);

                switch (triangleFaceToCull) {
                    case away.displayGL.ContextGLTriangleFace.FRONT:
                        this._yFlip = -1;
                        break;
                    case away.displayGL.ContextGLTriangleFace.BACK:
                        this._yFlip = 1; // checked
                        break;
                    case away.displayGL.ContextGLTriangleFace.FRONT_AND_BACK:
                        this._yFlip = 1;
                        break;
                    case away.displayGL.ContextGLTriangleFace.NONE:
                        this._yFlip = 1; // checked
                        break;
                    default:
                        throw "Unknown culling mode " + triangleFaceToCull + ".";
                        break;
                }
            };
            return AGLSLContextGL;
        })(away.displayGL.ContextGL);
        displayGL.AGLSLContextGL = AGLSLContextGL;
    })(away.displayGL || (away.displayGL = {}));
    var displayGL = away.displayGL;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        var ColorTransform = (function () {
            function ColorTransform(inRedMultiplier, inGreenMultiplier, inBlueMultiplier, inAlphaMultiplier, inRedOffset, inGreenOffset, inBlueOffset, inAlphaOffset) {
                if (typeof inRedMultiplier === "undefined") { inRedMultiplier = 1.0; }
                if (typeof inGreenMultiplier === "undefined") { inGreenMultiplier = 1.0; }
                if (typeof inBlueMultiplier === "undefined") { inBlueMultiplier = 1.0; }
                if (typeof inAlphaMultiplier === "undefined") { inAlphaMultiplier = 1.0; }
                if (typeof inRedOffset === "undefined") { inRedOffset = 0.0; }
                if (typeof inGreenOffset === "undefined") { inGreenOffset = 0.0; }
                if (typeof inBlueOffset === "undefined") { inBlueOffset = 0.0; }
                if (typeof inAlphaOffset === "undefined") { inAlphaOffset = 0.0; }
                this.redMultiplier = inRedMultiplier;
                this.greenMultiplier = inGreenMultiplier;
                this.blueMultiplier = inBlueMultiplier;
                this.alphaMultiplier = inAlphaMultiplier;
                this.redOffset = inRedOffset;
                this.greenOffset = inGreenOffset;
                this.blueOffset = inBlueOffset;
                this.alphaOffset = inAlphaOffset;
            }
            ColorTransform.prototype.concat = function (second) {
                this.redMultiplier += second.redMultiplier;
                this.greenMultiplier += second.greenMultiplier;
                this.blueMultiplier += second.blueMultiplier;
                this.alphaMultiplier += second.alphaMultiplier;
            };

            Object.defineProperty(ColorTransform.prototype, "color", {
                get: function () {
                    return ((this.redOffset << 16) | (this.greenOffset << 8) | this.blueOffset);
                },
                set: function (value) {
                    var argb = away.utils.ColorUtils.float32ColorToARGB(value);

                    this.redOffset = argb[1]; //(value >> 16) & 0xFF;
                    this.greenOffset = argb[2]; //(value >> 8) & 0xFF;
                    this.blueOffset = argb[3]; //value & 0xFF;

                    this.redMultiplier = 0;
                    this.greenMultiplier = 0;
                    this.blueMultiplier = 0;
                },
                enumerable: true,
                configurable: true
            });

            return ColorTransform;
        })();
        geom.ColorTransform = ColorTransform;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        var Matrix = (function () {
            function Matrix(a, b, c, d, tx, ty) {
                if (typeof a === "undefined") { a = 1; }
                if (typeof b === "undefined") { b = 0; }
                if (typeof c === "undefined") { c = 0; }
                if (typeof d === "undefined") { d = 1; }
                if (typeof tx === "undefined") { tx = 0; }
                if (typeof ty === "undefined") { ty = 0; }
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            }
            /**
            *
            * @returns {away.geom.Matrix}
            */
            Matrix.prototype.clone = function () {
                return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
            };

            /**
            *
            * @param m
            */
            Matrix.prototype.concat = function (m) {
                var a1 = this.a * m.a + this.b * m.c;
                this.b = this.a * m.b + this.b * m.d;
                this.a = a1;

                var c1 = this.c * m.a + this.d * m.c;
                this.d = this.c * m.b + this.d * m.d;

                this.c = c1;

                var tx1 = this.tx * m.a + this.ty * m.c + m.tx;
                this.ty = this.tx * m.b + this.ty * m.d + m.ty;
                this.tx = tx1;
            };

            /**
            *
            * @param column
            * @param vector3D
            */
            Matrix.prototype.copyColumnFrom = function (column, vector3D) {
                if (column > 2) {
                    throw "Column " + column + " out of bounds (2)";
                } else if (column == 0) {
                    this.a = vector3D.x;
                    this.c = vector3D.y;
                } else if (column == 1) {
                    this.b = vector3D.x;
                    this.d = vector3D.y;
                } else {
                    this.tx = vector3D.x;
                    this.ty = vector3D.y;
                }
            };

            /**
            *
            * @param column
            * @param vector3D
            */
            Matrix.prototype.copyColumnTo = function (column, vector3D) {
                if (column > 2) {
                    throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 2]");
                } else if (column == 0) {
                    vector3D.x = this.a;
                    vector3D.y = this.c;
                    vector3D.z = 0;
                } else if (column == 1) {
                    vector3D.x = this.b;
                    vector3D.y = this.d;
                    vector3D.z = 0;
                } else {
                    vector3D.x = this.tx;
                    vector3D.y = this.ty;
                    vector3D.z = 1;
                }
            };

            /**
            *
            * @param other
            */
            Matrix.prototype.copyFrom = function (other) {
                this.a = other.a;
                this.b = other.b;
                this.c = other.c;
                this.d = other.d;
                this.tx = other.tx;
                this.ty = other.ty;
            };

            /**
            *
            * @param row
            * @param vector3D
            */
            Matrix.prototype.copyRowFrom = function (row, vector3D) {
                if (row > 2) {
                    throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
                } else if (row == 0) {
                    this.a = vector3D.x;
                    this.c = vector3D.y;
                } else if (row == 1) {
                    this.b = vector3D.x;
                    this.d = vector3D.y;
                } else {
                    this.tx = vector3D.x;
                    this.ty = vector3D.y;
                }
            };

            /**
            *
            * @param row
            * @param vector3D
            */
            Matrix.prototype.copyRowTo = function (row, vector3D) {
                if (row > 2) {
                    throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
                } else if (row == 0) {
                    vector3D.x = this.a;
                    vector3D.y = this.b;
                    vector3D.z = this.tx;
                } else if (row == 1) {
                    vector3D.x = this.c;
                    vector3D.y = this.d;
                    vector3D.z = this.ty;
                } else {
                    vector3D.setTo(0, 0, 1);
                }
            };

            /**
            *
            * @param scaleX
            * @param scaleY
            * @param rotation
            * @param tx
            * @param ty
            */
            Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
                if (typeof rotation === "undefined") { rotation = 0; }
                if (typeof tx === "undefined") { tx = 0; }
                if (typeof ty === "undefined") { ty = 0; }
                this.a = scaleX;
                this.d = scaleY;
                this.b = rotation;
                this.tx = tx;
                this.ty = ty;
            };

            /**
            *
            * @param width
            * @param height
            * @param rotation
            * @param tx
            * @param ty
            */
            Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
                if (typeof rotation === "undefined") { rotation = 0; }
                if (typeof tx === "undefined") { tx = 0; }
                if (typeof ty === "undefined") { ty = 0; }
                this.a = width / 1638.4;
                this.d = height / 1638.4;

                if (rotation != 0.0) {
                    var cos = Math.cos(rotation);
                    var sin = Math.sin(rotation);

                    this.b = sin * this.d;
                    this.c = -sin * this.a;
                    this.a *= cos;
                    this.d *= cos;
                } else {
                    this.b = this.c = 0;
                }

                this.tx = tx + width / 2;
                this.ty = ty + height / 2;
            };

            /**
            *
            * @param point
            * @returns {away.geom.Point}
            */
            Matrix.prototype.deltaTransformPoint = function (point) {
                return new away.geom.Point(point.x * this.a + point.y * this.c, point.x * this.b + point.y * this.d);
            };

            /**
            *
            */
            Matrix.prototype.identity = function () {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            };

            /**
            *
            * @returns {away.geom.Matrix}
            */
            Matrix.prototype.invert = function () {
                var norm = this.a * this.d - this.b * this.c;

                if (norm == 0) {
                    this.a = this.b = this.c = this.d = 0;
                    this.tx = -this.tx;
                    this.ty = -this.ty;
                } else {
                    norm = 1.0 / norm;
                    var a1 = this.d * norm;
                    this.d = this.a * norm;
                    this.a = a1;
                    this.b *= -norm;
                    this.c *= -norm;

                    var tx1 = -this.a * this.tx - this.c * this.ty;
                    this.ty = -this.b * this.tx - this.d * this.ty;
                    this.tx = tx1;
                }

                return this;
            };

            /**
            *
            * @param m
            * @returns {away.geom.Matrix}
            */
            Matrix.prototype.mult = function (m) {
                var result = new Matrix();

                result.a = this.a * m.a + this.b * m.c;
                result.b = this.a * m.b + this.b * m.d;
                result.c = this.c * m.a + this.d * m.c;
                result.d = this.c * m.b + this.d * m.d;

                result.tx = this.tx * m.a + this.ty * m.c + m.tx;
                result.ty = this.tx * m.b + this.ty * m.d + m.ty;

                return result;
            };

            /**
            *
            * @param angle
            */
            Matrix.prototype.rotate = function (angle) {
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);

                var a1 = this.a * cos - this.b * sin;
                this.b = this.a * sin + this.b * cos;
                this.a = a1;

                var c1 = this.c * cos - this.d * sin;
                this.d = this.c * sin + this.d * cos;
                this.c = c1;

                var tx1 = this.tx * cos - this.ty * sin;
                this.ty = this.tx * sin + this.ty * cos;
                this.tx = tx1;
            };

            /**
            *
            * @param x
            * @param y
            */
            Matrix.prototype.scale = function (x, y) {
                this.a *= x;
                this.b *= y;

                this.c *= x;
                this.d *= y;

                this.tx *= x;
                this.ty *= y;
            };

            /**
            *
            * @param angle
            * @param scale
            */
            Matrix.prototype.setRotation = function (angle, scale) {
                if (typeof scale === "undefined") { scale = 1; }
                this.a = Math.cos(angle) * scale;
                this.c = Math.sin(angle) * scale;
                this.b = -this.c;
                this.d = this.a;
            };

            /**
            *
            * @param a
            * @param b
            * @param c
            * @param d
            * @param tx
            * @param ty
            */
            Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            };

            /**
            *
            * @returns {string}
            */
            Matrix.prototype.toString = function () {
                return "[Matrix] (a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
            };

            /**
            *
            * @param point
            * @returns {away.geom.Point}
            */
            Matrix.prototype.transformPoint = function (point) {
                return new away.geom.Point(point.x * this.a + point.y * this.c + this.tx, point.x * this.b + point.y * this.d + this.ty);
            };

            /**
            *
            * @param x
            * @param y
            */
            Matrix.prototype.translate = function (x, y) {
                this.tx += x;
                this.ty += y;
            };
            return Matrix;
        })();
        geom.Matrix = Matrix;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        var Matrix3D = (function () {
            /**
            * Creates a Matrix3D object.
            */
            function Matrix3D(v) {
                if (typeof v === "undefined") { v = null; }
                if (v != null && v.length == 16) {
                    this.rawData = v.concat();
                } else {
                    this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                }
            }
            /**
            * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
            */
            Matrix3D.prototype.append = function (lhs) {
                // Initial Tests - OK
                var m111 = this.rawData[0], m121 = this.rawData[4], m131 = this.rawData[8], m141 = this.rawData[12], m112 = this.rawData[1], m122 = this.rawData[5], m132 = this.rawData[9], m142 = this.rawData[13], m113 = this.rawData[2], m123 = this.rawData[6], m133 = this.rawData[10], m143 = this.rawData[14], m114 = this.rawData[3], m124 = this.rawData[7], m134 = this.rawData[11], m144 = this.rawData[15], m211 = lhs.rawData[0], m221 = lhs.rawData[4], m231 = lhs.rawData[8], m241 = lhs.rawData[12], m212 = lhs.rawData[1], m222 = lhs.rawData[5], m232 = lhs.rawData[9], m242 = lhs.rawData[13], m213 = lhs.rawData[2], m223 = lhs.rawData[6], m233 = lhs.rawData[10], m243 = lhs.rawData[14], m214 = lhs.rawData[3], m224 = lhs.rawData[7], m234 = lhs.rawData[11], m244 = lhs.rawData[15];

                this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
                this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
                this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
                this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;

                this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
                this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
                this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
                this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;

                this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
                this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
                this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
                this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;

                this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
                this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
                this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
                this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
            };

            /**
            * Appends an incremental rotation to a Matrix3D object.
            */
            Matrix3D.prototype.appendRotation = function (degrees, axis) {
                // Initial Tests - OK
                var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);

                /*
                if (pivotPoint != null)
                {
                var p:Vector3D = pivotPoint;
                m.appendTranslation( p.x, p.y, p.z );
                }
                */
                this.append(m);
            };

            /**
            * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
                // Initial Tests - OK
                this.append(new Matrix3D([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zScale, 0.0, 0.0, 0.0, 0.0, 1.0]));
            };

            /**
            * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.appendTranslation = function (x, y, z) {
                // Initial Tests - OK
                this.rawData[12] += x;
                this.rawData[13] += y;
                this.rawData[14] += z;
            };

            /**
            * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
            */
            Matrix3D.prototype.clone = function () {
                // Initial Tests - OK
                return new Matrix3D(this.rawData.slice(0));
            };

            /**
            * Copies a Vector3D object into specific column of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
                switch (column) {
                    case 0:
                        this.rawData[0] = vector3D.x;
                        this.rawData[1] = vector3D.y;
                        this.rawData[2] = vector3D.z;
                        this.rawData[3] = vector3D.w;
                        break;
                    case 1:
                        this.rawData[4] = vector3D.x;
                        this.rawData[5] = vector3D.y;
                        this.rawData[6] = vector3D.z;
                        this.rawData[7] = vector3D.w;
                        break;
                    case 2:
                        this.rawData[8] = vector3D.x;
                        this.rawData[9] = vector3D.y;
                        this.rawData[10] = vector3D.z;
                        this.rawData[11] = vector3D.w;
                        break;
                    case 3:
                        this.rawData[12] = vector3D.x;
                        this.rawData[13] = vector3D.y;
                        this.rawData[14] = vector3D.z;
                        this.rawData[15] = vector3D.w;
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies specific column of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
                switch (column) {
                    case 0:
                        vector3D.x = this.rawData[0];
                        vector3D.y = this.rawData[1];
                        vector3D.z = this.rawData[2];
                        vector3D.w = this.rawData[3];
                        break;
                    case 1:
                        vector3D.x = this.rawData[4];
                        vector3D.y = this.rawData[5];
                        vector3D.z = this.rawData[6];
                        vector3D.w = this.rawData[7];
                        break;
                    case 2:
                        vector3D.x = this.rawData[8];
                        vector3D.y = this.rawData[9];
                        vector3D.z = this.rawData[10];
                        vector3D.w = this.rawData[11];
                        break;
                    case 3:
                        vector3D.x = this.rawData[12];
                        vector3D.y = this.rawData[13];
                        vector3D.z = this.rawData[14];
                        vector3D.w = this.rawData[15];
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
            */
            Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
                // Initial Tests - OK
                var l = sourceMatrix3D.rawData.length;

                for (var c = 0; c < l; c++) {
                    this.rawData[c] = sourceMatrix3D.rawData[c];
                }
                //this.rawData = sourceMatrix3D.rawData.slice( 0 );
            };

            Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                // Initial Tests - OK
                if (transpose) {
                    this.transpose();
                }

                var l = vector.length - index;
                for (var c = 0; c < l; c++) {
                    this.rawData[c] = vector[c + index];
                }

                if (transpose) {
                    this.transpose();
                }
            };

            Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                // Initial Tests - OK
                if (transpose) {
                    this.transpose();
                }

                var l = this.rawData.length;
                for (var c = 0; c < l; c++) {
                    vector[c + index] = this.rawData[c];
                }

                if (transpose) {
                    this.transpose();
                }
            };

            /**
            * Copies a Vector3D object into specific row of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
                switch (row) {
                    case 0:
                        this.rawData[0] = vector3D.x;
                        this.rawData[4] = vector3D.y;
                        this.rawData[8] = vector3D.z;
                        this.rawData[12] = vector3D.w;
                        break;
                    case 1:
                        this.rawData[1] = vector3D.x;
                        this.rawData[5] = vector3D.y;
                        this.rawData[9] = vector3D.z;
                        this.rawData[13] = vector3D.w;
                        break;
                    case 2:
                        this.rawData[2] = vector3D.x;
                        this.rawData[6] = vector3D.y;
                        this.rawData[10] = vector3D.z;
                        this.rawData[14] = vector3D.w;
                        break;
                    case 3:
                        this.rawData[3] = vector3D.x;
                        this.rawData[7] = vector3D.y;
                        this.rawData[11] = vector3D.z;
                        this.rawData[15] = vector3D.w;
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies specific row of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyRowTo = function (row, vector3D) {
                switch (row) {
                    case 0:
                        vector3D.x = this.rawData[0];
                        vector3D.y = this.rawData[4];
                        vector3D.z = this.rawData[8];
                        vector3D.w = this.rawData[12];
                        break;
                    case 1:
                        vector3D.x = this.rawData[1];
                        vector3D.y = this.rawData[5];
                        vector3D.z = this.rawData[9];
                        vector3D.w = this.rawData[13];
                        break;
                    case 2:
                        vector3D.x = this.rawData[2];
                        vector3D.y = this.rawData[6];
                        vector3D.z = this.rawData[10];
                        vector3D.w = this.rawData[14];
                        break;
                    case 3:
                        vector3D.x = this.rawData[3];
                        vector3D.y = this.rawData[7];
                        vector3D.z = this.rawData[11];
                        vector3D.w = this.rawData[15];
                        break;
                    default:
                        throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies this Matrix3D object into a destination Matrix3D object.
            */
            Matrix3D.prototype.copyToMatrix3D = function (dest) {
                // Initial Tests - OK
                dest.rawData = this.rawData.slice(0);
            };

            // TODO orientationStyle:string = "eulerAngles"
            /**
            * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
            */
            Matrix3D.prototype.decompose = function (orientationStyle) {
                if (typeof orientationStyle === "undefined") { orientationStyle = "eulerAngles"; }
                var q;

                // Initial Tests - Not OK
                var vec = [];
                var m = this.clone();
                var mr = m.rawData;

                var pos = new away.geom.Vector3D(mr[12], mr[13], mr[14]);
                mr[12] = 0;
                mr[13] = 0;
                mr[14] = 0;

                var scale = new away.geom.Vector3D();

                scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
                scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
                scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);

                if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0) {
                    scale.z = -scale.z;
                }

                mr[0] /= scale.x;
                mr[1] /= scale.x;
                mr[2] /= scale.x;
                mr[4] /= scale.y;
                mr[5] /= scale.y;
                mr[6] /= scale.y;
                mr[8] /= scale.z;
                mr[9] /= scale.z;
                mr[10] /= scale.z;

                var rot = new away.geom.Vector3D();

                switch (orientationStyle) {
                    case away.geom.Orientation3D.AXIS_ANGLE:
                        rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);

                        var len = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
                        rot.x = (mr[6] - mr[9]) / len;
                        rot.y = (mr[8] - mr[2]) / len;
                        rot.z = (mr[1] - mr[4]) / len;

                        break;
                    case away.geom.Orientation3D.QUATERNION:
                        var tr = mr[0] + mr[5] + mr[10];

                        if (tr > 0) {
                            rot.w = Math.sqrt(1 + tr) / 2;

                            rot.x = (mr[6] - mr[9]) / (4 * rot.w);
                            rot.y = (mr[8] - mr[2]) / (4 * rot.w);
                            rot.z = (mr[1] - mr[4]) / (4 * rot.w);
                        } else if ((mr[0] > mr[5]) && (mr[0] > mr[10])) {
                            rot.x = Math.sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;

                            rot.w = (mr[6] - mr[9]) / (4 * rot.x);
                            rot.y = (mr[1] + mr[4]) / (4 * rot.x);
                            rot.z = (mr[8] + mr[2]) / (4 * rot.x);
                        } else if (mr[5] > mr[10]) {
                            rot.y = Math.sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;

                            rot.x = (mr[1] + mr[4]) / (4 * rot.y);
                            rot.w = (mr[8] - mr[2]) / (4 * rot.y);
                            rot.z = (mr[6] + mr[9]) / (4 * rot.y);
                        } else {
                            rot.z = Math.sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;

                            rot.x = (mr[8] + mr[2]) / (4 * rot.z);
                            rot.y = (mr[6] + mr[9]) / (4 * rot.z);
                            rot.w = (mr[1] - mr[4]) / (4 * rot.z);
                        }

                        break;
                    case away.geom.Orientation3D.EULER_ANGLES:
                        rot.y = Math.asin(-mr[2]);

                        //var cos:number = Math.cos(rot.y);
                        if (mr[2] != 1 && mr[2] != -1) {
                            rot.x = Math.atan2(mr[6], mr[10]);
                            rot.z = Math.atan2(mr[1], mr[0]);
                        } else {
                            rot.z = 0;
                            rot.x = Math.atan2(mr[4], mr[5]);
                        }

                        break;
                }

                vec.push(pos);
                vec.push(rot);
                vec.push(scale);

                return vec;
            };

            /**
            * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space
            * coordinate to another.
            */
            Matrix3D.prototype.deltaTransformVector = function (v) {
                var x = v.x, y = v.y, z = v.z;
                return new away.geom.Vector3D((x * this.rawData[0] + y * this.rawData[1] + z * this.rawData[2] + this.rawData[3]), (x * this.rawData[4] + y * this.rawData[5] + z * this.rawData[6] + this.rawData[7]), (x * this.rawData[8] + y * this.rawData[9] + z * this.rawData[10] + this.rawData[11]), 0);
            };

            /**
            * Converts the current matrix to an identity or unit matrix.
            */
            Matrix3D.prototype.identity = function () {
                this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            };

            /**
            * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
            */
            Matrix3D.interpolate = function (thisMat, toMat, percent) {
                var m = new Matrix3D();
                for (var i = 0; i < 16; ++i) {
                    m.rawData[i] = thisMat.rawData[i] + (toMat.rawData[i] - thisMat.rawData[i]) * percent;
                }
                return m;
            };

            /**
            * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
            */
            Matrix3D.prototype.interpolateTo = function (toMat, percent) {
                for (var i = 0; i < 16; ++i) {
                    this.rawData[i] = this.rawData[i] + (toMat.rawData[i] - this.rawData[i]) * percent;
                }
            };

            /**
            * Inverts the current matrix.
            */
            Matrix3D.prototype.invert = function () {
                // Initial Tests - OK
                var d = this.determinant;
                var invertable = Math.abs(d) > 0.00000000001;

                if (invertable) {
                    d = 1 / d;
                    var m11 = this.rawData[0];
                    var m21 = this.rawData[4];
                    var m31 = this.rawData[8];
                    var m41 = this.rawData[12];
                    var m12 = this.rawData[1];
                    var m22 = this.rawData[5];
                    var m32 = this.rawData[9];
                    var m42 = this.rawData[13];
                    var m13 = this.rawData[2];
                    var m23 = this.rawData[6];
                    var m33 = this.rawData[10];
                    var m43 = this.rawData[14];
                    var m14 = this.rawData[3];
                    var m24 = this.rawData[7];
                    var m34 = this.rawData[11];
                    var m44 = this.rawData[15];

                    this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
                    this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
                    this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
                    this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
                    this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
                    this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
                    this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
                    this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
                    this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
                    this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
                    this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
                    this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
                    this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
                    this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
                    this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
                    this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
                }
                return invertable;
            };

            /* TODO implement pointAt
            public pointAt( pos:Vector3D, at:Vector3D = null, up:Vector3D = null )
            {
            }
            */
            /**
            * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
            */
            Matrix3D.prototype.prepend = function (rhs) {
                // Initial Tests - OK
                var m111 = rhs.rawData[0], m121 = rhs.rawData[4], m131 = rhs.rawData[8], m141 = rhs.rawData[12], m112 = rhs.rawData[1], m122 = rhs.rawData[5], m132 = rhs.rawData[9], m142 = rhs.rawData[13], m113 = rhs.rawData[2], m123 = rhs.rawData[6], m133 = rhs.rawData[10], m143 = rhs.rawData[14], m114 = rhs.rawData[3], m124 = rhs.rawData[7], m134 = rhs.rawData[11], m144 = rhs.rawData[15], m211 = this.rawData[0], m221 = this.rawData[4], m231 = this.rawData[8], m241 = this.rawData[12], m212 = this.rawData[1], m222 = this.rawData[5], m232 = this.rawData[9], m242 = this.rawData[13], m213 = this.rawData[2], m223 = this.rawData[6], m233 = this.rawData[10], m243 = this.rawData[14], m214 = this.rawData[3], m224 = this.rawData[7], m234 = this.rawData[11], m244 = this.rawData[15];

                this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
                this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
                this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
                this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;

                this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
                this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
                this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
                this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;

                this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
                this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
                this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
                this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;

                this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
                this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
                this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
                this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
            };

            /**
            * Prepends an incremental rotation to a Matrix3D object.
            */
            Matrix3D.prototype.prependRotation = function (degrees, axis) {
                // Initial Tests - OK
                var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);

                /*
                if ( pivotPoint != null )
                {
                var p:Vector3D = pivotPoint;
                m.appendTranslation( p.x, p.y, p.z );
                }
                */
                this.prepend(m);
            };

            /**
            * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
                // Initial Tests - OK
                this.prepend(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
            };

            /**
            * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.prependTranslation = function (x, y, z) {
                // Initial Tests - OK
                var m = new Matrix3D();
                m.position = new away.geom.Vector3D(x, y, z);
                this.prepend(m);
            };

            // TODO orientationStyle
            /**
            * Sets the transformation matrix's translation, rotation, and scale settings.
            */
            Matrix3D.prototype.recompose = function (components) {
                // Initial Tests - OK
                if (components.length < 3)
                    return false;

                //components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
                this.identity();
                this.appendScale(components[2].x, components[2].y, components[2].z);

                var angle;
                angle = -components[1].x;
                this.append(new Matrix3D([1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 0]));
                angle = -components[1].y;
                this.append(new Matrix3D([Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 0]));
                angle = -components[1].z;
                this.append(new Matrix3D([Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]));

                this.position = components[0];
                this.rawData[15] = 1;

                return true;
            };

            Matrix3D.prototype.transformVector = function (v) {
                // Initial Tests - OK
                var x = v.x;
                var y = v.y;
                var z = v.z;
                return new away.geom.Vector3D((x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12]), (x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13]), (x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14]), (x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11] + this.rawData[15]));
            };

            /**
            * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
            */
            Matrix3D.prototype.transformVectors = function (vin, vout) {
                // Initial Tests - OK
                var i = 0;
                var x = 0, y = 0, z = 0;

                while (i + 3 <= vin.length) {
                    x = vin[i];
                    y = vin[i + 1];
                    z = vin[i + 2];
                    vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
                    vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
                    vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
                    i += 3;
                }
            };

            /**
            * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
            */
            Matrix3D.prototype.transpose = function () {
                // Initial Tests - OK
                var oRawData = this.rawData.slice(0);

                this.rawData[1] = oRawData[4];
                this.rawData[2] = oRawData[8];
                this.rawData[3] = oRawData[12];
                this.rawData[4] = oRawData[1];
                this.rawData[6] = oRawData[9];
                this.rawData[7] = oRawData[13];
                this.rawData[8] = oRawData[2];
                this.rawData[9] = oRawData[6];
                this.rawData[11] = oRawData[14];
                this.rawData[12] = oRawData[3];
                this.rawData[13] = oRawData[7];
                this.rawData[14] = oRawData[11];
            };

            Matrix3D.getAxisRotation = function (x, y, z, degrees) {
                // internal class use by rotations which have been tested
                var m = new Matrix3D();

                var rad = degrees * (Math.PI / 180);
                var c = Math.cos(rad);
                var s = Math.sin(rad);
                var t = 1 - c;
                var tmp1, tmp2;

                m.rawData[0] = c + x * x * t;
                m.rawData[5] = c + y * y * t;
                m.rawData[10] = c + z * z * t;

                tmp1 = x * y * t;
                tmp2 = z * s;
                m.rawData[1] = tmp1 + tmp2;
                m.rawData[4] = tmp1 - tmp2;
                tmp1 = x * z * t;
                tmp2 = y * s;
                m.rawData[8] = tmp1 + tmp2;
                m.rawData[2] = tmp1 - tmp2;
                tmp1 = y * z * t;
                tmp2 = x * s;
                m.rawData[9] = tmp1 - tmp2;
                m.rawData[6] = tmp1 + tmp2;

                return m;
            };

            Object.defineProperty(Matrix3D.prototype, "determinant", {
                /**
                * [read-only] A Number that determines whether a matrix is invertible.
                */
                get: function () {
                    // Initial Tests - OK
                    return ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Matrix3D.prototype, "position", {
                /**
                * A Vector3D object that holds the position, the 3D coordinate (x,y,z) of a display object within the
                * transformation's frame of reference.
                */
                get: function () {
                    // Initial Tests - OK
                    return new away.geom.Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
                },
                set: function (value) {
                    // Initial Tests - OK
                    this.rawData[12] = value.x;
                    this.rawData[13] = value.y;
                    this.rawData[14] = value.z;
                },
                enumerable: true,
                configurable: true
            });

            return Matrix3D;
        })();
        geom.Matrix3D = Matrix3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (geom) {
        /**
        * A Quaternion object which can be used to represent rotations.
        */
        var Orientation3D = (function () {
            function Orientation3D() {
            }
            Orientation3D.AXIS_ANGLE = "axisAngle";
            Orientation3D.EULER_ANGLES = "eulerAngles";
            Orientation3D.QUATERNION = "quaternion";
            return Orientation3D;
        })();
        geom.Orientation3D = Orientation3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        var Point = (function () {
            function Point(x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                this.x = x;
                this.y = y;
            }
            return Point;
        })();
        geom.Point = Point;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (geom) {
        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof width === "undefined") { width = 0; }
                if (typeof height === "undefined") { height = 0; }
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            Object.defineProperty(Rectangle.prototype, "left", {
                get: function () {
                    return this.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Rectangle.prototype, "right", {
                get: function () {
                    return this.x + this.width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Rectangle.prototype, "top", {
                get: function () {
                    return this.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Rectangle.prototype, "bottom", {
                get: function () {
                    return this.y + this.height;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Rectangle.prototype, "topLeft", {
                get: function () {
                    return new away.geom.Point(this.x, this.y);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Rectangle.prototype, "bottomRight", {
                get: function () {
                    return new away.geom.Point(this.x + this.width, this.y + this.height);
                },
                enumerable: true,
                configurable: true
            });

            Rectangle.prototype.clone = function () {
                return new Rectangle(this.x, this.y, this.width, this.height);
            };
            return Rectangle;
        })();
        geom.Rectangle = Rectangle;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        var Vector3D = (function () {
            /**
            * Creates an instance of a Vector3D object.
            */
            function Vector3D(x, y, z, w) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (typeof w === "undefined") { w = 0; }
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Object.defineProperty(Vector3D.prototype, "length", {
                /**
                * [read-only] The length, magnitude, of the current Vector3D object from the origin (0,0,0) to the object's
                * x, y, and z coordinates.
                * @returns The length of the Vector3D
                */
                get: function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3D.prototype, "lengthSquared", {
                /**
                * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z
                * properties.
                * @returns The squared length of the vector
                */
                get: function () {
                    return (this.x * this.x + this.y * this.y + this.z * this.z);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Adds the value of the x, y, and z elements of the current Vector3D object to the values of the x, y, and z
            * elements of another Vector3D object.
            */
            Vector3D.prototype.add = function (a) {
                return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
            };

            /**
            * [static] Returns the angle in radians between two vectors.
            */
            Vector3D.angleBetween = function (a, b) {
                return Math.acos(a.dotProduct(b) / (a.length * b.length));
            };

            /**
            * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
            */
            Vector3D.prototype.clone = function () {
                return new Vector3D(this.x, this.y, this.z, this.w);
            };

            /**
            * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
            */
            Vector3D.prototype.copyFrom = function (src) {
                this.x = src.x;
                this.y = src.y;
                this.z = src.z;
                this.w = src.w;
                //return new Vector3D(src.x, src.y, src.z, src.w);
            };

            /**
            * Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another
            * Vector3D object.
            */
            Vector3D.prototype.crossProduct = function (a) {
                return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x, 1);
            };

            /**
            * Decrements the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
            * and z elements of specified Vector3D object.
            */
            Vector3D.prototype.decrementBy = function (a) {
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
            };

            /**
            * [static] Returns the distance between two Vector3D objects.
            */
            Vector3D.distance = function (pt1, pt2) {
                var x = (pt1.x - pt2.x);
                var y = (pt1.y - pt2.y);
                var z = (pt1.z - pt2.z);
                return Math.sqrt(x * x + y * y + z * z);
            };

            /**
            * If the current Vector3D object and the one specified as the parameter are unit vertices, this method returns
            * the cosine of the angle between the two vertices.
            */
            Vector3D.prototype.dotProduct = function (a) {
                return this.x * a.x + this.y * a.y + this.z * a.z;
            };

            /**
            * Determines whether two Vector3D objects are equal by comparing the x, y, and z elements of the current
            * Vector3D object with a specified Vector3D object.
            */
            Vector3D.prototype.equals = function (cmp, allFour) {
                if (typeof allFour === "undefined") { allFour = false; }
                return (this.x == cmp.x && this.y == cmp.y && this.z == cmp.z && (!allFour || this.w == cmp.w));
            };

            /**
            * Increments the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
            * and z elements of a specified Vector3D object.
            */
            Vector3D.prototype.incrementBy = function (a) {
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
            };

            /**
            * Compares the elements of the current Vector3D object with the elements of a specified Vector3D object to
            * determine whether they are nearly equal.
            */
            Vector3D.prototype.nearEquals = function (cmp, epsilon, allFour) {
                if (typeof allFour === "undefined") { allFour = true; }
                return ((Math.abs(this.x - cmp.x) < epsilon) && (Math.abs(this.y - cmp.y) < epsilon) && (Math.abs(this.z - cmp.z) < epsilon) && (!allFour || Math.abs(this.w - cmp.w) < epsilon));
            };

            /**
            * Sets the current Vector3D object to its inverse.
            */
            Vector3D.prototype.negate = function () {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
            };

            /**
            * Converts a Vector3D object to a unit vector by dividing the first three elements (x, y, z) by the length of
            * the vector.
            */
            Vector3D.prototype.normalize = function () {
                var invLength = 1 / this.length;
                if (invLength != 0) {
                    this.x *= invLength;
                    this.y *= invLength;
                    this.z *= invLength;
                    return;
                }
                throw "Cannot divide by zero.";
            };

            /**
            * Divides the value of the x, y, and z properties of the current Vector3D object by the value of its w
            * property.
            */
            Vector3D.prototype.project = function () {
                this.x /= this.w;
                this.y /= this.w;
                this.z /= this.w;
            };

            /**
            * Scales the current Vector3D object by a scalar, a magnitude.
            */
            Vector3D.prototype.scaleBy = function (s) {
                this.x *= s;
                this.y *= s;
                this.z *= s;
            };

            /**
            * Sets the members of Vector3D to the specified values
            */
            Vector3D.prototype.setTo = function (xa, ya, za) {
                this.x = xa;
                this.y = ya;
                this.z = za;
            };

            /**
            * Subtracts the value of the x, y, and z elements of the current Vector3D object from the values of the x, y,
            * and z elements of another Vector3D object.
            */
            Vector3D.prototype.subtract = function (a) {
                return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
            };

            /**
            * Returns a string representation of the current Vector3D object.
            */
            Vector3D.prototype.toString = function () {
                return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z" + this.z + ", w:" + this.w + ")";
            };
            Vector3D.X_AXIS = new Vector3D(1, 0, 0);
            Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
            Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
            return Vector3D;
        })();
        geom.Vector3D = Vector3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        /**
        * MathConsts provides some commonly used mathematical constants
        */
        var MathConsts = (function () {
            function MathConsts() {
            }
            MathConsts.RADIANS_TO_DEGREES = 180 / Math.PI;

            MathConsts.DEGREES_TO_RADIANS = Math.PI / 180;
            return MathConsts;
        })();
        geom.MathConsts = MathConsts;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        //import flash.geom.Matrix3D;
        //import flash.geom.Orientation3D;
        //import flash.geom.Vector3D;
        /**
        * A Quaternion object which can be used to represent rotations.
        */
        var Quaternion = (function () {
            /**
            * Creates a new Quaternion object.
            * @param x The x value of the quaternion.
            * @param y The y value of the quaternion.
            * @param z The z value of the quaternion.
            * @param w The w value of the quaternion.
            */
            function Quaternion(x, y, z, w) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (typeof w === "undefined") { w = 1; }
                /**
                * The x value of the quaternion.
                */
                this.x = 0;
                /**
                * The y value of the quaternion.
                */
                this.y = 0;
                /**
                * The z value of the quaternion.
                */
                this.z = 0;
                /**
                * The w value of the quaternion.
                */
                this.w = 1;
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
            Object.defineProperty(Quaternion.prototype, "magnitude", {
                /**
                * Returns the magnitude of the quaternion object.
                */
                get: function () {
                    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Fills the quaternion object with the result from a multiplication of two quaternion objects.
            *
            * @param    qa    The first quaternion in the multiplication.
            * @param    qb    The second quaternion in the multiplication.
            */
            Quaternion.prototype.multiply = function (qa, qb) {
                var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
                var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;

                this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                this.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                this.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            };

            Quaternion.prototype.multiplyVector = function (vector, target) {
                if (typeof target === "undefined") { target = null; }
                //target ||= new Quaternion();
                if (target === null) {
                    target = new Quaternion();
                }

                var x2 = vector.x;
                var y2 = vector.y;
                var z2 = vector.z;

                target.w = -this.x * x2 - this.y * y2 - this.z * z2;
                target.x = this.w * x2 + this.y * z2 - this.z * y2;
                target.y = this.w * y2 - this.x * z2 + this.z * x2;
                target.z = this.w * z2 + this.x * y2 - this.y * x2;

                return target;
            };

            /**
            * Fills the quaternion object with values representing the given rotation around a vector.
            *
            * @param    axis    The axis around which to rotate
            * @param    angle    The angle in radians of the rotation.
            */
            Quaternion.prototype.fromAxisAngle = function (axis, angle) {
                var sin_a = Math.sin(angle / 2);
                var cos_a = Math.cos(angle / 2);

                this.x = axis.x * sin_a;
                this.y = axis.y * sin_a;
                this.z = axis.z * sin_a;
                this.w = cos_a;

                this.normalize();
            };

            /**
            * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
            * @param qa The first quaternion to interpolate.
            * @param qb The second quaternion to interpolate.
            * @param t The interpolation weight, a value between 0 and 1.
            */
            Quaternion.prototype.slerp = function (qa, qb, t) {
                var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
                var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
                var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

                // shortest direction
                if (dot < 0) {
                    dot = -dot;
                    w2 = -w2;
                    x2 = -x2;
                    y2 = -y2;
                    z2 = -z2;
                }

                if (dot < 0.95) {
                    // interpolate angle linearly
                    var angle = Math.acos(dot);
                    var s = 1 / Math.sin(angle);
                    var s1 = Math.sin(angle * (1 - t)) * s;
                    var s2 = Math.sin(angle * t) * s;
                    this.w = w1 * s1 + w2 * s2;
                    this.x = x1 * s1 + x2 * s2;
                    this.y = y1 * s1 + y2 * s2;
                    this.z = z1 * s1 + z2 * s2;
                } else {
                    // nearly identical angle, interpolate linearly
                    this.w = w1 + t * (w2 - w1);
                    this.x = x1 + t * (x2 - x1);
                    this.y = y1 + t * (y2 - y1);
                    this.z = z1 + t * (z2 - z1);
                    var len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                    this.w *= len;
                    this.x *= len;
                    this.y *= len;
                    this.z *= len;
                }
            };

            /**
            * Linearly interpolates between two quaternions.
            * @param qa The first quaternion to interpolate.
            * @param qb The second quaternion to interpolate.
            * @param t The interpolation weight, a value between 0 and 1.
            */
            Quaternion.prototype.lerp = function (qa, qb, t) {
                var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
                var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
                var len;

                // shortest direction
                if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
                    w2 = -w2;
                    x2 = -x2;
                    y2 = -y2;
                    z2 = -z2;
                }

                this.w = w1 + t * (w2 - w1);
                this.x = x1 + t * (x2 - x1);
                this.y = y1 + t * (y2 - y1);
                this.z = z1 + t * (z2 - z1);

                len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
                this.w *= len;
                this.x *= len;
                this.y *= len;
                this.z *= len;
            };

            /**
            * Fills the quaternion object with values representing the given euler rotation.
            *
            * @param    ax        The angle in radians of the rotation around the ax axis.
            * @param    ay        The angle in radians of the rotation around the ay axis.
            * @param    az        The angle in radians of the rotation around the az axis.
            */
            Quaternion.prototype.fromEulerAngles = function (ax, ay, az) {
                var halfX = ax * .5, halfY = ay * .5, halfZ = az * .5;
                var cosX = Math.cos(halfX), sinX = Math.sin(halfX);
                var cosY = Math.cos(halfY), sinY = Math.sin(halfY);
                var cosZ = Math.cos(halfZ), sinZ = Math.sin(halfZ);

                this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
                this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
                this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
                this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
            };

            /**
            * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
            * @param target An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
            * @return The Vector3D containing the Euler angles.
            */
            Quaternion.prototype.toEulerAngles = function (target) {
                if (typeof target === "undefined") { target = null; }
                //target ||= new away.geom.Vector3D();
                if (target === null) {
                    target = new away.geom.Vector3D();
                }

                target.x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
                target.y = Math.asin(2 * (this.w * this.y - this.z * this.x));
                target.z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));

                return target;
            };

            /**
            * Normalises the quaternion object.
            */
            Quaternion.prototype.normalize = function (val) {
                if (typeof val === "undefined") { val = 1; }
                var mag = val / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

                this.x *= mag;
                this.y *= mag;
                this.z *= mag;
                this.w *= mag;
            };

            /**
            * Used to trace the values of a quaternion.
            *
            * @return A string representation of the quaternion object.
            */
            Quaternion.prototype.toString = function () {
                return "{x:" + this.x + " y:" + this.y + " z:" + this.z + " w:" + this.w + "}";
            };

            /**
            * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
            * @param target An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
            * @return A Matrix3D object representing an equivalent rotation.
            */
            Quaternion.prototype.toMatrix3D = function (target) {
                if (typeof target === "undefined") { target = null; }
                var rawData = away.geom.Matrix3DUtils.RAW_DATA_CONTAINER;
                var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
                var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
                var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;

                rawData[0] = xx - yy - zz + ww;
                rawData[4] = xy2 - zw2;
                rawData[8] = xz2 + yw2;
                rawData[12] = 0;
                rawData[1] = xy2 + zw2;
                rawData[5] = -xx + yy - zz + ww;
                rawData[9] = yz2 - xw2;
                rawData[13] = 0;
                rawData[2] = xz2 - yw2;
                rawData[6] = yz2 + xw2;
                rawData[10] = -xx - yy + zz + ww;
                rawData[14] = 0;
                rawData[3] = 0.0;
                rawData[7] = 0.0;
                rawData[11] = 0;
                rawData[15] = 1;

                if (!target)
                    return new away.geom.Matrix3D(rawData);

                target.copyRawDataFrom(rawData);

                return target;
            };

            /**
            * Extracts a quaternion rotation matrix out of a given Matrix3D object.
            * @param matrix The Matrix3D out of which the rotation will be extracted.
            */
            Quaternion.prototype.fromMatrix = function (matrix) {
                var v = matrix.decompose(away.geom.Orientation3D.QUATERNION)[1];
                this.x = v.x;
                this.y = v.y;
                this.z = v.z;
                this.w = v.w;
            };

            /**
            * Converts the quaternion to a Vector.&lt;Number&gt; matrix representation of a rotation equivalent to this quaternion.
            * @param target The Vector.&lt;Number&gt; to contain the raw matrix data.
            * @param exclude4thRow If true, the last row will be omitted, and a 4x3 matrix will be generated instead of a 4x4.
            */
            Quaternion.prototype.toRawData = function (target, exclude4thRow) {
                if (typeof exclude4thRow === "undefined") { exclude4thRow = false; }
                var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
                var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
                var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;

                target[0] = xx - yy - zz + ww;
                target[1] = xy2 - zw2;
                target[2] = xz2 + yw2;
                target[4] = xy2 + zw2;
                target[5] = -xx + yy - zz + ww;
                target[6] = yz2 - xw2;
                target[8] = xz2 - yw2;
                target[9] = yz2 + xw2;
                target[10] = -xx - yy + zz + ww;
                target[3] = target[7] = target[11] = 0;

                if (!exclude4thRow) {
                    target[12] = target[13] = target[14] = 0;
                    target[15] = 1;
                }
            };

            /**
            * Clones the quaternion.
            * @return An exact duplicate of the current Quaternion.
            */
            Quaternion.prototype.clone = function () {
                return new Quaternion(this.x, this.y, this.z, this.w);
            };

            /**
            * Rotates a point.
            * @param vector The Vector3D object to be rotated.
            * @param target An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
            * @return A Vector3D object containing the rotated point.
            */
            Quaternion.prototype.rotatePoint = function (vector, target) {
                if (typeof target === "undefined") { target = null; }
                var x1, y1, z1, w1;
                var x2 = vector.x, y2 = vector.y, z2 = vector.z;

                //target ||= new away.geom.Vector3D();
                if (target === null) {
                    target = new away.geom.Vector3D();
                }

                // p*q'
                w1 = -this.x * x2 - this.y * y2 - this.z * z2;
                x1 = this.w * x2 + this.y * z2 - this.z * y2;
                y1 = this.w * y2 - this.x * z2 + this.z * x2;
                z1 = this.w * z2 + this.x * y2 - this.y * x2;

                target.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
                target.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
                target.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;

                return target;
            };

            /**
            * Copies the data from a quaternion into this instance.
            * @param q The quaternion to copy from.
            */
            Quaternion.prototype.copyFrom = function (q) {
                this.x = q.x;
                this.y = q.y;
                this.z = q.z;
                this.w = q.w;
            };
            return Quaternion;
        })();
        geom.Quaternion = Quaternion;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (geom) {
        var PlaneClassification = (function () {
            function PlaneClassification() {
            }
            PlaneClassification.BACK = 0;
            PlaneClassification.FRONT = 1;

            PlaneClassification.IN = 0;
            PlaneClassification.OUT = 1;
            PlaneClassification.INTERSECT = 2;
            return PlaneClassification;
        })();
        geom.PlaneClassification = PlaneClassification;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (geom) {
        var Plane3D = (function () {
            /**
            * Create a Plane3D with ABCD coefficients
            */
            function Plane3D(a, b, c, d) {
                if (typeof a === "undefined") { a = 0; }
                if (typeof b === "undefined") { b = 0; }
                if (typeof c === "undefined") { c = 0; }
                if (typeof d === "undefined") { d = 0; }
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;

                if (a == 0 && b == 0) {
                    this._iAlignment = Plane3D.ALIGN_XY_AXIS;
                } else if (b == 0 && c == 0) {
                    this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
                } else if (a == 0 && c == 0) {
                    this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
                } else {
                    this._iAlignment = Plane3D.ALIGN_ANY;
                }
            }
            /**
            * Fills this Plane3D with the coefficients from 3 points in 3d space.
            * @param p0 Vector3D
            * @param p1 Vector3D
            * @param p2 Vector3D
            */
            Plane3D.prototype.fromPoints = function (p0, p1, p2) {
                var d1x = p1.x - p0.x;
                var d1y = p1.y - p0.y;
                var d1z = p1.z - p0.z;

                var d2x = p2.x - p0.x;
                var d2y = p2.y - p0.y;
                var d2z = p2.z - p0.z;

                this.a = d1y * d2z - d1z * d2y;
                this.b = d1z * d2x - d1x * d2z;
                this.c = d1x * d2y - d1y * d2x;
                this.d = this.a * p0.x + this.b * p0.y + this.c * p0.z;

                // not using epsilon, since a plane is infinite and a small incorrection can grow very large
                if (this.a == 0 && this.b == 0) {
                    this._iAlignment = Plane3D.ALIGN_XY_AXIS;
                } else if (this.b == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
                } else if (this.a == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
                } else {
                    this._iAlignment = Plane3D.ALIGN_ANY;
                }
            };

            /**
            * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
            * @param normal Vector3D
            * @param point  Vector3D
            */
            Plane3D.prototype.fromNormalAndPoint = function (normal, point) {
                this.a = normal.x;
                this.b = normal.y;
                this.c = normal.z;
                this.d = this.a * point.x + this.b * point.y + this.c * point.z;
                if (this.a == 0 && this.b == 0) {
                    this._iAlignment = Plane3D.ALIGN_XY_AXIS;
                } else if (this.b == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
                } else if (this.a == 0 && this.c == 0) {
                    this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
                } else {
                    this._iAlignment = Plane3D.ALIGN_ANY;
                }
            };

            /**
            * Normalize this Plane3D
            * @return Plane3D This Plane3D.
            */
            Plane3D.prototype.normalize = function () {
                var len = 1 / Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
                this.a *= len;
                this.b *= len;
                this.c *= len;
                this.d *= len;
                return this;
            };

            /**
            * Returns the signed distance between this Plane3D and the point p.
            * @param p Vector3D
            * @returns Number
            */
            Plane3D.prototype.distance = function (p) {
                if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS) {
                    return this.a * p.x - this.d;
                } else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS) {
                    return this.b * p.y - this.d;
                } else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS) {
                    return this.c * p.z - this.d;
                } else {
                    return this.a * p.x + this.b * p.y + this.c * p.z - this.d;
                }
            };

            /**
            * Classify a point against this Plane3D. (in front, back or intersecting)
            * @param p Vector3D
            * @return int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
            */
            Plane3D.prototype.classifyPoint = function (p, epsilon) {
                if (typeof epsilon === "undefined") { epsilon = 0.01; }
                // check NaN
                if (this.d != this.d)
                    return away.geom.PlaneClassification.FRONT;

                var len;
                if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS)
                    len = this.a * p.x - this.d;
                else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS)
                    len = this.b * p.y - this.d;
                else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS)
                    len = this.c * p.z - this.d;
                else
                    len = this.a * p.x + this.b * p.y + this.c * p.z - this.d;

                if (len < -epsilon)
                    return away.geom.PlaneClassification.BACK;
                else if (len > epsilon)
                    return away.geom.PlaneClassification.FRONT;
                else
                    return away.geom.PlaneClassification.INTERSECT;
            };

            Plane3D.prototype.toString = function () {
                return "Plane3D [a:" + this.a + ", b:" + this.b + ", c:" + this.c + ", d:" + this.d + "]";
            };
            Plane3D.ALIGN_ANY = 0;
            Plane3D.ALIGN_XY_AXIS = 1;
            Plane3D.ALIGN_YZ_AXIS = 2;
            Plane3D.ALIGN_XZ_AXIS = 3;
            return Plane3D;
        })();
        geom.Plane3D = Plane3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (geom) {
        //import flash.geom.*;
        /**
        * away.geom.Matrix3DUtils provides additional Matrix3D functions.
        */
        var Matrix3DUtils = (function () {
            function Matrix3DUtils() {
            }
            /**
            * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
            *
            * @param    quarternion    The quarterion object to convert.
            */
            Matrix3DUtils.quaternion2matrix = function (quarternion, m) {
                if (typeof m === "undefined") { m = null; }
                var x = quarternion.x;
                var y = quarternion.y;
                var z = quarternion.z;
                var w = quarternion.w;

                var xx = x * x;
                var xy = x * y;
                var xz = x * z;
                var xw = x * w;

                var yy = y * y;
                var yz = y * z;
                var yw = y * w;

                var zz = z * z;
                var zw = z * w;

                var raw = away.geom.Matrix3DUtils.RAW_DATA_CONTAINER;
                raw[0] = 1 - 2 * (yy + zz);
                raw[1] = 2 * (xy + zw);
                raw[2] = 2 * (xz - yw);
                raw[4] = 2 * (xy - zw);
                raw[5] = 1 - 2 * (xx + zz);
                raw[6] = 2 * (yz + xw);
                raw[8] = 2 * (xz + yw);
                raw[9] = 2 * (yz - xw);
                raw[10] = 1 - 2 * (xx + yy);
                raw[3] = raw[7] = raw[11] = raw[12] = raw[13] = raw[14] = 0;
                raw[15] = 1;

                if (m) {
                    m.copyRawDataFrom(raw);
                    return m;
                } else
                    return new away.geom.Matrix3D(raw);
            };

            /**
            * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the forward vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The forward vector
            */
            Matrix3DUtils.getForward = function (m, v) {
                if (typeof v === "undefined") { v = null; }
                //v ||= new away.geom.Vector3D(0.0, 0.0, 0.0);
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(2, v);
                v.normalize();

                return v;
            };

            /**
            * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the up vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The up vector
            */
            Matrix3DUtils.getUp = function (m, v) {
                if (typeof v === "undefined") { v = null; }
                //v ||= new away.geom.Vector3D(0.0, 0.0, 0.0);
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(1, v);
                v.normalize();

                return v;
            };

            /**
            * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the right vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The right vector
            */
            Matrix3DUtils.getRight = function (m, v) {
                if (typeof v === "undefined") { v = null; }
                //v ||= new Vector3D(0.0, 0.0, 0.0);
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(0, v);
                v.normalize();

                return v;
            };

            /**
            * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
            */
            Matrix3DUtils.compare = function (m1, m2) {
                var r1 = away.geom.Matrix3DUtils.RAW_DATA_CONTAINER;
                var r2 = m2.rawData;
                m1.copyRawDataTo(r1);

                for (var i = 0; i < 16; ++i) {
                    if (r1[i] != r2[i])
                        return false;
                }

                return true;
            };

            Matrix3DUtils.lookAt = function (matrix, pos, dir, up) {
                var dirN;
                var upN;
                var lftN;
                var raw = away.geom.Matrix3DUtils.RAW_DATA_CONTAINER;

                lftN = dir.crossProduct(up);
                lftN.normalize();

                upN = lftN.crossProduct(dir);
                upN.normalize();
                dirN = dir.clone();
                dirN.normalize();

                raw[0] = lftN.x;
                raw[1] = upN.x;
                raw[2] = -dirN.x;
                raw[3] = 0.0;

                raw[4] = lftN.y;
                raw[5] = upN.y;
                raw[6] = -dirN.y;
                raw[7] = 0.0;

                raw[8] = lftN.z;
                raw[9] = upN.z;
                raw[10] = -dirN.z;
                raw[11] = 0.0;

                raw[12] = -lftN.dotProduct(pos);
                raw[13] = -upN.dotProduct(pos);
                raw[14] = dirN.dotProduct(pos);
                raw[15] = 1.0;

                matrix.copyRawDataFrom(raw);
            };

            Matrix3DUtils.reflection = function (plane, target) {
                if (typeof target === "undefined") { target = null; }
                //target ||= new Matrix3D();
                if (target === null) {
                    target = new away.geom.Matrix3D();
                }

                var a = plane.a, b = plane.b, c = plane.c, d = plane.d;
                var rawData = away.geom.Matrix3DUtils.RAW_DATA_CONTAINER;
                var ab2 = -2 * a * b;
                var ac2 = -2 * a * c;
                var bc2 = -2 * b * c;

                // reflection matrix
                rawData[0] = 1 - 2 * a * a;
                rawData[4] = ab2;
                rawData[8] = ac2;
                rawData[12] = -2 * a * d;
                rawData[1] = ab2;
                rawData[5] = 1 - 2 * b * b;
                rawData[9] = bc2;
                rawData[13] = -2 * b * d;
                rawData[2] = ac2;
                rawData[6] = bc2;
                rawData[10] = 1 - 2 * c * c;
                rawData[14] = -2 * c * d;
                rawData[3] = 0;
                rawData[7] = 0;
                rawData[11] = 0;
                rawData[15] = 1;
                target.copyRawDataFrom(rawData);

                return target;
            };
            Matrix3DUtils.RAW_DATA_CONTAINER = new Array(16);

            Matrix3DUtils.CALCULATION_MATRIX = new away.geom.Matrix3D();
            return Matrix3DUtils;
        })();
        geom.Matrix3DUtils = Matrix3DUtils;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (geom) {
        var PoissonLookup = (function () {
            function PoissonLookup() {
            }
            PoissonLookup.initDistributions = function () {
                // precalculated for best control
                this._distributions = new Array();
                this._distributions[0] = new Array(0.3082841, 0.4320919);
                this._distributions[1] = new Array(0.3082841, 0.4320919, -0.2274942, -0.6640266);
                this._distributions[2] = new Array(0.8742689, 0.0009265686, -0.6864116, -0.5536607, -0.2325206, 0.7678371);
                this._distributions[3] = new Array(0.3913446, -0.7084417, -0.7511101, -0.5935929, -0.2323436, 0.5320091, 0.8435315, 0.5035911);
                this._distributions[4] = new Array(0.2122471, -0.5771395, -0.8543506, -0.1763534, 0.5189021, 0.8323698, -0.3616908, 0.5865368, 0.9523004, -0.04948437);
                this._distributions[5] = new Array(0.5791035, 0.3496495, 0.2959551, -0.6006749, -0.2419119, -0.06879545, -0.7403072, 0.6110353, -0.04555973, 0.8059174, -0.5275017, -0.737129);
                this._distributions[6] = new Array(0.06941478, 0.8519508, -0.7441907, 0.2426432, 0.6439992, -0.2405252, -0.1007523, -0.2327587, -0.6427067, -0.7248485, 0.8050759, 0.5492936, 0.3573822, -0.8824506);
                this._distributions[7] = new Array(0.8509863, 0.4452587, -0.09507271, 0.2073005, 0.1706571, -0.6434793, 0.8029777, -0.2718274, -0.4401725, 0.8196304, 0.2715359, 0.8598521, -0.8121575, -0.006447683, -0.6486837, -0.7237598);
                this._distributions[8] = new Array(0.6951686, -0.2680728, -0.04933243, 0.3710589, 0.6592212, 0.3661054, -0.01579228, -0.6909603, -0.3275101, -0.1756866, 0.3811549, 0.9218544, -0.216032, 0.9755028, -0.7065172, 0.3355389, -0.6579109, -0.6798355);
                this._distributions[9] = new Array(0.6181276, -0.09790418, -0.2537868, -0.5570995, -0.1964931, 0.3459414, 0.3474613, -0.8885581, 0.5135743, 0.5753114, -0.9549091, 0.1480672, -0.8711916, -0.4293123, -0.6928071, 0.6190156, -0.13369, 0.8892705, 0.0548224, -0.1246777);
                this._distributions[10] = new Array(0.4853027, -0.5080479, -0.1331675, -0.506597, 0.139575, 0.01316885, 0.803486, -0.07568797, 0.5240274, 0.4883182, -0.4334005, 0.1207938, -0.7794577, -0.3985141, 0.1576432, -0.9861221, -0.3712867, 0.6959021, 0.1517378, 0.9847429, -0.9762396, 0.1661073);
                this._distributions[11] = new Array(-0.2790166, -0.01252619, 0.3389016, 0.3921154, 0.2408341, -0.313211, -0.8151779, -0.3898362, -0.6347761, 0.3486495, 0.09471484, -0.7722448, -0.1385674, 0.6364574, 0.2456331, 0.9295807, -0.3864306, -0.8247881, 0.6111673, -0.7164014, 0.8287669, 0.05466961, 0.837706, 0.5415626);
                this._distributions[12] = new Array(0.056417, 0.3185693, -0.8245888, 0.1882799, 0.8575996, 0.1136829, 0.1070375, 0.875332, 0.4076743, -0.06000621, -0.4311306, 0.7239349, 0.2677574, -0.538472, -0.08486642, -0.2083647, -0.888989, -0.3906443, -0.4768958, -0.6664082, 0.09334993, -0.9861541, 0.808736, -0.455949, 0.5889823, 0.7660807);
                this._distributions[13] = new Array(-0.2681346, -0.3955857, -0.1315102, -0.8852947, -0.5143692, 0.09551838, 0.4344836, -0.546945, -0.8620899, -0.3813288, 0.1650431, 0.02034803, -0.1543657, 0.3842218, -0.828457, 0.5376903, -0.6145, -0.7818927, -0.2639062, 0.8784655, 0.1912684, 0.9720125, 0.3135219, 0.5224229, 0.7850655, 0.4592297, 0.7465045, -0.1368916);
                this._distributions[14] = new Array(0.4241029, 0.695281, 0.150511, -0.02304107, -0.2482675, 0.9120338, 0.8057325, 0.2622084, -0.2445909, 0.2765962, 0.8588713, -0.1772072, 0.3117845, -0.4385471, -0.3923851, -0.3298936, -0.1751254, -0.7405846, 0.6926506, -0.684163, -0.9304563, -0.3254691, -0.8533293, 0.1523024, 0.2510415, -0.917345, -0.6239773, -0.7105472, -0.6104624, 0.6041355);
                this._distributions[15] = new Array(0.5844554, 0.06651045, 0.1343258, 0.6756578, 0.3799674, -0.6301104, 0.5590436, 0.7940555, 0.09574714, 0.02262517, 0.8697868, 0.393301, 0.003945862, -0.421735, 0.9043913, -0.2432393, -0.4844007, 0.7190998, -0.3201078, 0.2972371, -0.3852352, -0.6341155, -0.5413069, -0.09223081, -0.8468984, -0.5126905, 0.004156174, -0.8633173, -0.9681889, -0.03305046, -0.846509, 0.4414353);
                this._distributions[16] = new Array(0.4506488, 0.657668, 0.4621297, 0.07441051, -0.2782125, 0.6201044, 0.9750003, 0.09110117, 0.1019436, 0.2986514, 0.03457398, 0.9631706, 0.542098, -0.5505635, 0.8675668, 0.4938077, -0.5414361, 0.2655292, -0.7941836, 0.6003053, -0.09847672, -0.1001604, -0.9316511, -0.08572888, 0.07286467, -0.611899, -0.5232627, -0.4082253, -0.5481608, -0.827938, -0.1551939, -0.9621193, 0.9220031, -0.3315949);
                this._distributions[17] = new Array(0.197908, -0.4697656, -0.4474689, -0.3428435, 0.8529873, -0.2228634, 0.6022478, -0.5469642, 0.2545276, -0.931133, -0.1507547, -0.7855865, -0.07606658, 0.1011628, 0.3046715, 0.2785755, 0.4698432, -0.1064076, 0.6831254, 0.4152522, 0.1374381, 0.8363233, -0.2166121, 0.6682042, 0.5511393, 0.7996449, -0.4278994, 0.28836, -0.8875198, 0.2181732, -0.8772842, -0.2818254, -0.7000262, 0.5762185, -0.6062385, -0.7439126);
                this._distributions[18] = new Array(0.6645703, -0.05678739, 0.5720971, 0.4533803, -0.07660709, 0.08802763, 0.5163431, -0.4426552, 0.1163455, -0.3404382, -0.4004807, -0.5046007, 0.2932099, -0.8201418, -0.5322125, 0.03834766, -0.1490209, -0.8817304, -0.8000439, -0.3509448, 0.5260983, 0.8421043, 0.1197811, 0.6963812, 0.9498612, 0.3122156, -0.9285746, 0.02120355, -0.6670724, 0.7217396, 0.9155889, -0.3510147, -0.271941, 0.4727852, 0.318879, 0.1634057, -0.2686755, 0.9253026);
                this._distributions[19] = new Array(0.5064292, 0.422527, 0.8935515, -0.06610427, 0.1199719, 0.175568, 0.403388, -0.2003276, 0.1657927, 0.8154403, 0.9301245, 0.2929218, -0.1644068, 0.6201534, 0.7113559, -0.6589743, -0.3364046, -0.1799502, 0.02109996, -0.392765, -0.382213, 0.3219992, -0.9201946, 0.1207967, -0.726185, 0.4291916, -0.7443482, -0.2480059, -0.5147594, 0.7418784, 0.1935272, -0.7406143, -0.3643523, -0.5559214, -0.7147766, -0.6326278, -0.2524151, -0.9096627, 0.5161405, 0.7908453);
                this._distributions[20] = new Array(0.7921003, -0.3032096, 0.5992879, -0.009052323, 0.2538549, -0.1872749, 0.7053444, 0.3677175, 0.5417761, -0.8170255, 0.9749611, 0.1210478, 0.1969143, -0.6117041, -0.1824499, -0.4634196, -0.1181338, -0.8668742, -0.3050112, -0.1352596, -0.4409327, -0.7082354, -0.03225285, 0.1171548, 0.3113096, 0.3250439, -0.8166144, -0.463995, -0.01014475, 0.4715334, -0.6868284, 0.05091889, -0.4011163, 0.2717285, -0.06756835, 0.8307694, -0.7938535, 0.4352129, -0.4663842, 0.7165329, 0.559729, 0.8093995);
                this._distributions[21] = new Array(0.07832243, 0.426151, -0.3856795, 0.5799953, 0.01970797, 0.06706189, 0.4822682, 0.3014512, -0.1532982, 0.87485, -0.4959527, 0.07888043, 0.260601, -0.2304784, 0.4996209, 0.7167382, 0.585986, -0.04265174, -0.7679967, 0.5509416, -0.9041753, 0.1802134, -0.8407655, -0.4442826, -0.2058258, -0.2636995, -0.4984115, -0.5928579, 0.2926032, -0.7886473, -0.06933882, -0.621177, 0.578115, -0.4813387, 0.8981777, -0.3291056, 0.1942733, 0.9255584, 0.8084362, 0.5066984, 0.9920095, 0.03103104, -0.2403206, -0.9389018);
                this._distributions[22] = new Array(-0.5691095, 0.1014316, -0.7788262, 0.384012, -0.8253665, -0.1645582, -0.1830993, 0.002997211, -0.2555013, -0.4177977, -0.6640869, -0.4794711, -0.2351242, 0.5850121, 0.02436554, 0.2825883, 0.006061143, -0.8200245, 0.1618791, -0.3063331, -0.3765897, -0.7249815, 0.6092919, -0.6769328, -0.5956934, 0.6957655, 0.5383642, 0.4522677, -0.1489165, 0.9125596, 0.4167473, 0.1335986, 0.1898309, 0.5874342, 0.2288171, 0.9624356, 0.7540846, -0.07672304, 0.8986252, 0.2788797, 0.3555991, -0.9262139, 0.8454325, -0.4027667, 0.4945236, -0.2935512);
                this._distributions[23] = new Array(-0.4481403, -0.3758374, -0.8877251, 0.08739938, 0.05015831, -0.1339983, -0.4070427, -0.8534173, 0.1019274, -0.5503222, -0.445998, 0.1997541, -0.8686263, -0.2788867, -0.7695944, -0.6033704, -0.05515742, -0.885711, -0.7714347, 0.5790485, 0.3466263, -0.8799297, 0.4487582, -0.5321087, -0.2461368, 0.6053771, -0.05568117, 0.2457351, -0.4668669, 0.8523816, 0.8103387, -0.4255538, 0.4054182, -0.175663, -0.2802011, -0.08920153, 0.2665959, 0.382935, 0.555679, 0.1621837, 0.105246, 0.8420411, 0.6921161, 0.6902903, 0.880946, 0.2483067, 0.9699264, -0.1021767);
                this._distributions[24] = new Array(-0.1703323, -0.3119385, 0.2916039, -0.2988263, -0.008472982, -0.9277695, -0.7730271, -0.3277904, 0.3440474, -0.6815342, -0.2910278, 0.03461745, -0.6764899, -0.657078, -0.3505501, -0.7311988, -0.03478927, 0.3258755, -0.6048835, 0.159423, 0.2035525, 0.02212214, 0.5116573, 0.2226856, 0.6664805, -0.2500189, 0.7147882, -0.6609634, 0.03030632, -0.5763278, -0.2516585, 0.6116219, -0.9434413, -0.0116792, 0.9061816, 0.2491155, 0.182867, 0.6076167, 0.286593, 0.9485695, -0.5992439, 0.6970096, -0.2082874, 0.9416641, 0.9880044, -0.1541709, -0.9122881, 0.331555, 0.7324886, 0.6725098);
                this._distributions[25] = new Array(0.3869598, -0.04974834, 0.7168844, -0.0693711, -0.07166742, 0.1725325, 0.4599592, 0.3232779, 0.5872094, -0.4198674, 0.2442266, -0.625667, 0.1254557, 0.4500048, -0.2290154, -0.1803567, 0.890583, 0.3373493, 0.1256081, 0.7853789, -0.2676466, 0.5305805, -0.7063224, 0.252168, -0.3989835, 0.1189921, 0.09617215, -0.2451447, 0.6302541, 0.6085876, 0.9380925, -0.3234899, 0.5086241, -0.8573482, 0.03576187, -0.9876697, -0.0876712, -0.6365195, -0.5276513, 0.823456, -0.6935764, -0.2240411, -0.5212318, -0.5383121, -0.2116208, 0.9639363, -0.9840096, 0.02743555, -0.3991577, -0.8994547, -0.7830126, 0.614068);
                this._distributions[26] = new Array(-0.8366601, 0.4464895, -0.5917366, -0.02073906, -0.9845258, 0.1635625, -0.3097973, 0.4379579, -0.5478154, 0.7173221, -0.1685888, 0.9261969, 0.01503595, 0.6046097, 0.4452421, 0.5449086, 0.0315687, 0.1944619, 0.3753404, 0.8688548, 0.4143643, 0.1396648, 0.8711032, 0.4304703, 0.7328773, 0.1461501, 0.6374492, -0.3521495, 0.145613, -0.1341466, 0.9040975, -0.135123, -0.7839059, -0.5450199, -0.516019, -0.3320859, -0.206158, -0.4431106, -0.9703014, -0.2368356, -0.2473119, -0.0864351, 0.2130725, -0.4604077, -0.003726701, -0.7122303, -0.4072131, -0.6833169, 0.1632999, -0.9776646, 0.4686888, -0.680495, -0.2293511, -0.9509777);
                this._distributions[27] = new Array(0.107311, -0.1311369, -0.4194764, -0.3148777, 0.6171439, -0.2745973, 0.2796618, 0.1937153, -0.09106886, 0.4180236, 0.6044006, 0.05577846, 0.02927299, -0.6738263, -0.2580845, 0.1179939, -0.09023564, -0.3830024, 0.3570953, -0.5000587, 0.81591, -0.5518309, 0.9300217, -0.1257987, 0.4904627, -0.8381903, -0.3163182, -0.8632009, 0.1137595, -0.9875998, 0.8390043, 0.3538185, 0.2149114, 0.4993694, 0.5191584, 0.3833552, 0.5002763, 0.7061465, -0.2567276, 0.9068756, -0.5197366, 0.3467845, 0.03668867, 0.9734009, -0.5347553, 0.66747, -0.9028882, 0.1023768, -0.8967977, 0.412834, -0.5821944, 0.0426479, -0.8032165, -0.2397038, -0.5597343, -0.6358021);
                this._distributions[28] = new Array(-0.6562496, -0.1781036, -0.9301494, 0.1185208, -0.3861143, -0.4153562, -0.1560799, -0.1099607, -0.5587025, 0.395218, -0.5322112, -0.699701, -0.5008639, 0.08726846, -0.970524, -0.1963461, -0.813577, -0.5185111, -0.1644458, 0.298, -0.3216791, 0.639982, 0.3315373, 0.3339162, 0.2383235, -0.00105722, 0.1137828, 0.5450742, -0.01899921, 0.8798413, 0.2849685, 0.8255596, 0.6974412, 0.2123175, 0.7588523, 0.5470437, 0.5102502, -0.1687844, 0.5853448, 0.8033476, 0.2590716, -0.5262504, 0.5607718, -0.6342825, 0.8666443, -0.1491841, 0.8341052, -0.4935003, -0.1568441, -0.6634066, 0.2512113, -0.8769391, -0.2559827, -0.9572457, -0.01928852, -0.3966542, -0.750667, 0.6409678);
                this._distributions[29] = new Array(0.3454786, -0.04837726, 0.2649553, 0.2406852, 0.5599093, -0.3839145, -0.1111814, -0.05502108, 0.7586042, -0.05818377, 0.2519488, -0.4665135, -0.1264972, 0.2602723, -0.08766216, -0.3671907, 0.6428129, 0.3999204, -0.6105871, -0.1246869, -0.4589451, -0.7646643, -0.03021116, -0.7899352, -0.6036922, -0.4293956, -0.2481938, 0.6534185, 0.102798, 0.6784465, -0.6392644, 0.4821358, -0.6789002, 0.1779133, -0.9140783, -0.1989647, -0.9262617, 0.3381507, 0.4794891, -0.8093274, 0.3959447, 0.668478, 0.9602883, 0.2272305, -0.123672, 0.9210883, 0.2375148, 0.9523395, -0.52898, 0.7973378, -0.382433, 0.1228794, 0.695015, 0.6948439, 0.7530277, -0.6458191, 0.8777987, -0.3272956, 0.2318525, -0.962768);
                this._distributions[30] = new Array(0.4518921, -0.1146195, 0.4720805, -0.4238748, 0.3655423, 0.1806341, 0.1589939, -0.23568, 0.7673324, -0.5149941, 0.01163658, 0.09045836, 0.7010971, 0.1245747, 0.7518286, -0.1855433, 0.4960719, 0.4601022, 0.2566979, -0.6308268, -0.0654714, -0.5126389, -0.1823319, -0.1343282, -0.1464312, 0.4883236, -0.3858738, 0.203523, 0.1484799, 0.4432284, -0.477109, -0.116241, 0.2719092, 0.7208626, 0.9104174, 0.3578536, -0.5956199, 0.7662588, -0.6996251, 0.3678654, -0.2514512, 0.9251933, 0.1275825, -0.9478135, -0.204608, -0.8611552, 0.4264838, -0.877443, 0.9854161, 0.05521112, 0.5912951, 0.7997434, 0.1140349, 0.982093, -0.9324368, -0.2094094, -0.42436, -0.6441524, -0.6722705, -0.3554261, -0.7844236, 0.08587621);
                this._distributions[31] = new Array(-0.4206714, -0.5613642, -0.8733016, -0.3373051, -0.1046226, -0.2902999, -0.1318562, -0.8434365, 0.1145093, -0.5962623, -0.4965627, -0.1873259, -0.5011808, -0.8546229, -0.7165636, -0.5743566, 0.1090901, 0.2017643, 0.3404809, -0.220455, -0.1989015, 0.2372122, -0.4538706, 0.0979171, 0.4514146, -0.572846, 0.2314168, -0.8514503, -0.4247236, 0.5650803, -0.943347, 0.04514639, -0.1309718, 0.5221877, -0.7004157, 0.4561877, 0.6306441, 0.04448673, 0.4301621, 0.5766876, 0.1078042, 0.7245752, 0.3875354, 0.2794483, 0.702876, -0.2924213, 0.7360667, -0.6210318, 0.7486517, 0.6531103, 0.4898235, 0.8591025, 0.6549174, 0.3854057, -0.2596106, 0.7916998, 0.9251194, -0.05296265, -0.5620695, 0.820877, -0.01228026, 0.9937211, 0.9612103, 0.2628758);
            };

            PoissonLookup.getDistribution = function (n /*int*/ ) {
                if (!this._distributions)
                    this.initDistributions();

                if (n < 2 || n > 32)
                    return null;

                return this._distributions[n - 1];
            };
            return PoissonLookup;
        })();
        geom.PoissonLookup = PoissonLookup;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (net) {
        var AssetLoaderContext = (function () {
            /**
            * AssetLoaderContext provides configuration for the AssetLoader load() and parse() operations.
            * Use it to configure how (and if) dependencies are loaded, or to map dependency URLs to
            * embedded data.
            *
            * @see away.loading.AssetLoader
            */
            function AssetLoaderContext(includeDependencies, dependencyBaseUrl) {
                if (typeof includeDependencies === "undefined") { includeDependencies = true; }
                if (typeof dependencyBaseUrl === "undefined") { dependencyBaseUrl = null; }
                this._includeDependencies = includeDependencies;
                this._dependencyBaseUrl = dependencyBaseUrl || '';
                this._embeddedDataByUrl = {};
                this._remappedUrls = {};
                this._materialMode = AssetLoaderContext.UNDEFINED;
            }
            Object.defineProperty(AssetLoaderContext.prototype, "includeDependencies", {
                /**
                * Defines whether dependencies (all files except the one at the URL given to the load() or
                * parseData() operations) should be automatically loaded. Defaults to true.
                */
                get: function () {
                    return this._includeDependencies;
                },
                set: function (val) {
                    this._includeDependencies = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "materialMode", {
                /**
                * MaterialMode defines, if the Parser should create SinglePass or MultiPass Materials
                * Options:
                * 0 (Default / undefined) - All Parsers will create SinglePassMaterials, but the AWD2.1parser will create Materials as they are defined in the file
                * 1 (Force SinglePass) - All Parsers create SinglePassMaterials
                * 2 (Force MultiPass) - All Parsers will create MultiPassMaterials
                *
                */
                get: function () {
                    return this._materialMode;
                },
                set: function (materialMode) {
                    this._materialMode = materialMode;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "dependencyBaseUrl", {
                /**
                * A base URL that will be prepended to all relative dependency URLs found in a loaded resource.
                * Absolute paths will not be affected by the value of this property.
                */
                get: function () {
                    return this._dependencyBaseUrl;
                },
                set: function (val) {
                    this._dependencyBaseUrl = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "overrideAbsolutePaths", {
                /**
                * Defines whether absolute paths (defined as paths that begin with a "/") should be overridden
                * with the dependencyBaseUrl defined in this context. If this is true, and the base path is
                * "base", /path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
                */
                get: function () {
                    return this._overrideAbsPath;
                },
                set: function (val) {
                    this._overrideAbsPath = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "overrideFullURLs", {
                /**
                * Defines whether "full" URLs (defined as a URL that includes a scheme, e.g. http://) should be
                * overridden with the dependencyBaseUrl defined in this context. If this is true, and the base
                * path is "base", http://example.com/path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
                */
                get: function () {
                    return this._overrideFullUrls;
                },
                set: function (val) {
                    this._overrideFullUrls = val;
                },
                enumerable: true,
                configurable: true
            });


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
            AssetLoaderContext.prototype.mapUrl = function (originalUrl, newUrl) {
                this._remappedUrls[originalUrl] = newUrl;
            };

            /**
            * Map a URL to embedded data, so that instead of trying to load a dependency from the URL at
            * which it's referenced, the dependency data will be retrieved straight from the memory instead.
            *
            * @param originalUrl The original URL which is referenced in the loaded resource.
            * @param data The embedded data. Can be ByteArray or a class which can be used to create a bytearray.
            */
            AssetLoaderContext.prototype.mapUrlToData = function (originalUrl, data) {
                this._embeddedDataByUrl[originalUrl] = data;
            };

            /**
            * @private
            * Defines whether embedded data has been mapped to a particular URL.
            */
            AssetLoaderContext.prototype._iHasDataForUrl = function (url) {
                return this._embeddedDataByUrl.hasOwnProperty(url);
            };

            /**
            * @private
            * Returns embedded data for a particular URL.
            */
            AssetLoaderContext.prototype._iGetDataForUrl = function (url) {
                return this._embeddedDataByUrl[url];
            };

            /**
            * @private
            * Defines whether a replacement URL has been mapped to a particular URL.
            */
            AssetLoaderContext.prototype._iHasMappingForUrl = function (url) {
                return this._remappedUrls.hasOwnProperty(url);
            };

            /**
            * @private
            * Returns new (replacement) URL for a particular original URL.
            */
            AssetLoaderContext.prototype._iGetRemappedUrl = function (originalUrl) {
                return this._remappedUrls[originalUrl];
            };
            AssetLoaderContext.UNDEFINED = 0;
            AssetLoaderContext.SINGLEPASS_MATERIALS = 1;
            AssetLoaderContext.MULTIPASS_MATERIALS = 2;
            return AssetLoaderContext;
        })();
        net.AssetLoaderContext = AssetLoaderContext;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (net) {
        //import away.*;
        //import away.events.*;
        //import away.loaders.misc.*;
        //import away.loaders.parsers.*;
        //import flash.events.*;
        //import flash.net.*;
        //use namespace arcane;
        /**
        * Dispatched when any asset finishes parsing. Also see specific events for each
        * individual asset type (meshes, materials et c.)
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="assetComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a full resource (including dependencies) finishes loading.
        *
        * @eventType away.events.LoaderEvent
        */
        //[Event(name="resourceComplete", type="away3d.events.LoaderEvent")]
        /**
        * Dispatched when a single dependency (which may be the main file of a resource)
        * finishes loading.
        *
        * @eventType away.events.LoaderEvent
        */
        //[Event(name="dependencyComplete", type="away3d.events.LoaderEvent")]
        /**
        * Dispatched when an error occurs during loading. I
        *
        * @eventType away.events.LoaderEvent
        */
        //[Event(name="loadError", type="away3d.events.LoaderEvent")]
        /**
        * Dispatched when an error occurs during parsing.
        *
        * @eventType away.events.ParserEvent
        */
        //[Event(name="parseError", type="away3d.events.ParserEvent")]
        /**
        * Dispatched when a skybox asset has been costructed from a ressource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="skyboxComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a camera3d asset has been costructed from a ressource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="cameraComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a mesh asset has been costructed from a ressource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="meshComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a geometry asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="geometryComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a skeleton asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="skeletonComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a skeleton pose asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="skeletonPoseComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a container asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="containerComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a texture asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="textureComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a texture projector asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="textureProjectorComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a material asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="materialComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a animator asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animatorComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation set has been constructed from a group of animation state resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animationSetComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation state has been constructed from a group of animation node resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animationStateComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation node has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animationNodeComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation state transition has been constructed from a group of animation node resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="stateTransitionComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an light asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="lightComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an light picker asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="lightPickerComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an effect method asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="effectMethodComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an shadow map method asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="shadowMapMethodComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an image asset dimensions are not a power of 2
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="textureSizeError", type="away3d.events.AssetEvent")]
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
        var AssetLoader = (function (_super) {
            __extends(AssetLoader, _super);
            /**
            * Create a new ResourceLoadSession object.
            */
            function AssetLoader() {
                _super.call(this);

                this._stack = new Array();
                this._errorHandlers = new Array();
                this._parseErrorHandlers = new Array();
            }
            Object.defineProperty(AssetLoader.prototype, "baseDependency", {
                /**
                * Returns the base dependency of the loader
                */
                get: function () {
                    return this._baseDependency;
                },
                enumerable: true,
                configurable: true
            });

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
            AssetLoader.enableParser = function (parserClass) {
                away.net.SingleFileLoader.enableParser(parserClass);
            };

            /**
            * Enables a list of parsers.
            * When no specific parser is set for a loading/parsing opperation,
            * AssetLoader can autoselect the correct parser to use.
            * A parser must have been enabled, to be considered when autoselecting the parser.
            *
            * @param parserClasses A Vector of parser classes to enable.
            * @see away.loaders.parsers.Parsers
            */
            AssetLoader.enableParsers = function (parserClasses) {
                away.net.SingleFileLoader.enableParsers(parserClasses);
            };

            /**
            * Loads a file and (optionally) all of its dependencies.
            *
            * @param req The URLRequest object containing the URL of the file to be loaded.
            * @param context An optional context object providing additional parameters for loading
            * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
            * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            AssetLoader.prototype.load = function (req, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                if (!this._token) {
                    this._token = new away.net.AssetLoaderToken(this);

                    this._uri = req.url = req.url.replace(/\\/g, "/");
                    this._context = context;
                    this._namespace = ns;

                    this._baseDependency = new away.parsers.ResourceDependency('', req, null, null);
                    this.retrieveDependency(this._baseDependency, parser);

                    return this._token;
                }

                // TODO: Throw error (already loading)
                return null;
            };

            /**
            * Loads a resource from already loaded data.
            *
            * @param data The data object containing all resource information.
            * @param context An optional context object providing additional parameters for loading
            * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
            * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            AssetLoader.prototype.loadData = function (data, id, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                if (!this._token) {
                    this._token = new away.net.AssetLoaderToken(this);

                    this._uri = id;
                    this._context = context;
                    this._namespace = ns;

                    this._baseDependency = new away.parsers.ResourceDependency(id, null, data, null);
                    this.retrieveDependency(this._baseDependency, parser);

                    return this._token;
                }

                // TODO: Throw error (already loading)
                return null;
            };

            /**
            * Recursively retrieves the next to-be-loaded and parsed dependency on the stack, or pops the list off the
            * stack when complete and continues on the top set.
            * @param parser The parser that will translate the data into a usable resource.
            */
            AssetLoader.prototype.retrieveNext = function (parser) {
                if (typeof parser === "undefined") { parser = null; }
                if (this._loadingDependency.dependencies.length) {
                    var dep = this._loadingDependency.dependencies.pop();

                    this._stack.push(this._loadingDependency);
                    this.retrieveDependency(dep);
                } else if (this._loadingDependency._iLoader.parser && this._loadingDependency._iLoader.parser.parsingPaused) {
                    this._loadingDependency._iLoader.parser._iResumeParsingAfterDependencies(); //resumeParsingAfterDependencies();
                    this._stack.pop();
                } else if (this._stack.length) {
                    var prev = this._loadingDependency;

                    this._loadingDependency = this._stack.pop();

                    if (prev._iSuccess) {
                        prev.resolve();
                    }

                    this.retrieveNext(parser);
                } else {
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.RESOURCE_COMPLETE, this._uri, this._baseDependency.assets));
                }
            };

            /**
            * Retrieves a single dependency.
            * @param parser The parser that will translate the data into a usable resource.
            */
            AssetLoader.prototype.retrieveDependency = function (dependency, parser) {
                if (typeof parser === "undefined") { parser = null; }
                var data;
                var matMode = 0;

                if (this._context && this._context.materialMode != 0) {
                    matMode = this._context.materialMode;
                }

                this._loadingDependency = dependency;
                this._loadingDependency._iLoader = new away.net.SingleFileLoader(matMode);

                this.addEventListeners(this._loadingDependency._iLoader);

                // Get already loaded (or mapped) data if available
                data = this._loadingDependency.data;

                if (this._context && this._loadingDependency.request && this._context._iHasDataForUrl(this._loadingDependency.request.url)) {
                    data = this._context._iGetDataForUrl(this._loadingDependency.request.url);
                }

                if (data) {
                    if (this._loadingDependency.retrieveAsRawData) {
                        // No need to parse. The parent parser is expecting this
                        // to be raw data so it can be passed directly.
                        this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this._loadingDependency.request.url, this._baseDependency.assets, true));
                        this._loadingDependency._iSetData(data);
                        this._loadingDependency.resolve();

                        // Move on to next dependency
                        this.retrieveNext();
                    } else {
                        this._loadingDependency._iLoader.parseData(data, parser, this._loadingDependency.request);
                    }
                } else {
                    // Resolve URL and start loading
                    dependency.request.url = this.resolveDependencyUrl(dependency);
                    this._loadingDependency._iLoader.load(dependency.request, parser, this._loadingDependency.retrieveAsRawData);
                }
            };

            AssetLoader.prototype.joinUrl = function (base, end) {
                if (end.charAt(0) == '/') {
                    end = end.substr(1);
                }

                if (base.length == 0) {
                    return end;
                }

                if (base.charAt(base.length - 1) == '/') {
                    base = base.substr(0, base.length - 1);
                }

                return base.concat('/', end);
            };

            AssetLoader.prototype.resolveDependencyUrl = function (dependency) {
                var scheme_re;
                var base;
                var url = dependency.request.url;

                // Has the user re-mapped this URL?
                if (this._context && this._context._iHasMappingForUrl(url))
                    return this._context._iGetRemappedUrl(url);

                // This is the "base" dependency, i.e. the actual requested asset.
                // We will not try to resolve this since the user can probably be
                // thrusted to know this URL better than our automatic resolver. :)
                if (url == this._uri) {
                    return url;
                }

                // Absolute URL? Check if starts with slash or a URL
                // scheme definition (e.g. ftp://, http://, file://)
                scheme_re = new RegExp('/^[a-zA-Z]{3,4}:\/\//');

                if (url.charAt(0) == '/') {
                    if (this._context && this._context.overrideAbsolutePaths)
                        return this.joinUrl(this._context.dependencyBaseUrl, url);
                    else
                        return url;
                } else if (scheme_re.test(url)) {
                    // If overriding full URLs, get rid of scheme (e.g. "http://")
                    // and replace with the dependencyBaseUrl defined by user.
                    if (this._context && this._context.overrideFullURLs) {
                        var noscheme_url;

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
            };

            AssetLoader.prototype.retrieveLoaderDependencies = function (loader) {
                if (!this._loadingDependency) {
                    //loader.parser = null;
                    //loader = null;
                    return;
                }
                var i, len = loader.dependencies.length;

                for (i = 0; i < len; i++) {
                    this._loadingDependency.dependencies[i] = loader.dependencies[i];
                }

                // Since more dependencies might be added eventually, empty this
                // list so that the same dependency isn't retrieved more than once.
                loader.dependencies.length = 0;

                this._stack.push(this._loadingDependency);

                this.retrieveNext();
            };

            /**
            * Called when a single dependency loading failed, and pushes further dependencies onto the stack.
            * @param event
            */
            AssetLoader.prototype.onRetrievalFailed = function (event) {
                var handled;
                var isDependency = (this._loadingDependency != this._baseDependency);
                var loader = event.target;

                this.removeEventListeners(loader);

                event = new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this._uri, this._baseDependency.assets, isDependency, event.message);

                // TODO: JS / AS3 Change - debug this code with a fine tooth combe
                //if (this.hasEventListener( away.events.LoaderEvent.LOAD_ERROR , this )) {
                this.dispatchEvent(event);
                handled = true;

                //} else {
                // TO - Away - Consider not doing this even when AssetLoader does
                // have it's own LOAD_ERROR listener
                var i, len = this._errorHandlers.length;
                for (i = 0; i < len; i++) {
                    var handlerFunction = this._errorHandlers[i];

                    handled = handled || handlerFunction(event);
                }

                //}
                if (handled) {
                    //if (isDependency && ! event.isDefaultPrevented()) {
                    if (isDependency) {
                        this._loadingDependency.resolveFailure();
                        this.retrieveNext();
                    } else {
                        // Either this was the base file (last left in the stack) or
                        // default behavior was prevented by the handlers, and hence
                        // there is nothing more to do than clean up and bail.
                        this.dispose();
                        return;
                    }
                } else {
                    throw new away.errors.Error(event.message);
                }
            };

            /**
            * Called when a dependency parsing failed, and dispatches a <code>ParserEvent.PARSE_ERROR</code>
            * @param event
            */
            AssetLoader.prototype.onParserError = function (event) {
                var handled;

                var isDependency = (this._loadingDependency != this._baseDependency);

                var loader = event.target;

                this.removeEventListeners(loader);

                event = new away.events.ParserEvent(away.events.ParserEvent.PARSE_ERROR, event.message);

                // TODO: keep on eye on this / debug - JS / AS3 Change
                //if (this.hasEventListener(away.events.ParserEvent.PARSE_ERROR)) {
                this.dispatchEvent(event);
                handled = true;

                //} else {
                // TODO: Consider not doing this even when AssetLoader does
                // have it's own LOAD_ERROR listener
                var i, len = this._parseErrorHandlers.length;

                for (i = 0; i < len; i++) {
                    var handlerFunction = this._parseErrorHandlers[i];

                    handled = handled || handlerFunction(event);
                    //handled ||= Boolean(handlerFunction(event));
                }

                //}
                if (handled) {
                    this.dispose();
                    return;
                } else {
                    throw new Error(event.message);
                }
            };

            AssetLoader.prototype.onAssetComplete = function (event) {
                // Event is dispatched twice per asset (once as generic ASSET_COMPLETE,
                // and once as type-specific, e.g. MESH_COMPLETE.) Do this only once.
                if (event.type == away.events.AssetEvent.ASSET_COMPLETE) {
                    // Add loaded asset to list of assets retrieved as part
                    // of the current dependency. This list will be inspected
                    // by the parent parser when dependency is resolved
                    if (this._loadingDependency) {
                        this._loadingDependency.assets.push(event.asset);
                    }

                    event.asset.resetAssetPath(event.asset.name, this._namespace);
                }

                //console.log( 'AssetLoader.onAssetComplete suppresAssetEvents:' , this._loadingDependency.suppresAssetEvents , event );
                if (!this._loadingDependency.suppresAssetEvents) {
                    this.dispatchEvent(event.clone());
                }
            };

            AssetLoader.prototype.onReadyForDependencies = function (event) {
                var loader = event.target;

                if (this._context && !this._context.includeDependencies) {
                    loader.parser._iResumeParsingAfterDependencies();
                } else {
                    this.retrieveLoaderDependencies(loader);
                }
            };

            /**
            * Called when a single dependency was parsed, and pushes further dependencies onto the stack.
            * @param event
            */
            AssetLoader.prototype.onRetrievalComplete = function (event) {
                var loader = event.target;

                //var loader:SingleFileLoader = SingleFileLoader(event.target);
                // Resolve this dependency
                this._loadingDependency._iSetData(loader.data);
                this._loadingDependency._iSuccess = true;

                this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, event.url, this._baseDependency.assets));
                this.removeEventListeners(loader);

                // Retrieve any last dependencies remaining on this loader, or
                // if none exists, just move on.
                if (loader.dependencies.length && (!this._context || this._context.includeDependencies)) {
                    this.retrieveLoaderDependencies(loader);
                } else {
                    this.retrieveNext();
                }
            };

            /**
            * Called when an image is too large or it's dimensions are not a power of 2
            * @param event
            */
            AssetLoader.prototype.onTextureSizeError = function (event) {
                event.asset.name = this._loadingDependency.resolveName(event.asset);
                this.dispatchEvent(event);
            };

            AssetLoader.prototype.addEventListeners = function (loader) {
                loader.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onRetrievalComplete, this);
                loader.addEventListener(away.events.LoaderEvent.LOAD_ERROR, this.onRetrievalFailed, this);
                loader.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                loader.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                loader.addEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
                loader.addEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParserError, this);
            };

            AssetLoader.prototype.removeEventListeners = function (loader) {
                loader.removeEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
                loader.removeEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onRetrievalComplete, this);
                loader.removeEventListener(away.events.LoaderEvent.LOAD_ERROR, this.onRetrievalFailed, this);
                loader.removeEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                loader.removeEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                loader.removeEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParserError, this);
            };

            AssetLoader.prototype.stop = function () {
                this.dispose();
            };

            AssetLoader.prototype.dispose = function () {
                this._errorHandlers = null;
                this._parseErrorHandlers = null;
                this._context = null;
                this._token = null;
                this._stack = null;

                if (this._loadingDependency && this._loadingDependency._iLoader) {
                    this.removeEventListeners(this._loadingDependency._iLoader);
                }

                this._loadingDependency = null;
            };

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
            AssetLoader.prototype._iAddParseErrorHandler = function (handler) {
                if (this._parseErrorHandlers.indexOf(handler) < 0) {
                    this._parseErrorHandlers.push(handler);
                }
            };

            AssetLoader.prototype._iAddErrorHandler = function (handler) {
                if (this._errorHandlers.indexOf(handler) < 0) {
                    this._errorHandlers.push(handler);
                }
            };
            return AssetLoader;
        })(away.events.EventDispatcher);
        net.AssetLoader = AssetLoader;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (net) {
        //import away.arcane;
        //import away.events.AssetEvent;
        //import away.events.LoaderEvent;
        //import away.loaders.AssetLoader;
        //import flash.events.Event;
        //import flash.events.EventDispatcher;
        //use namespace arcane;
        /**
        * Dispatched when any asset finishes parsing. Also see specific events for each
        * individual asset type (meshes, materials et c.)
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="assetComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a full resource (including dependencies) finishes loading.
        *
        * @eventType away.events.LoaderEvent
        */
        //[Event(name="resourceComplete", type="away3d.events.LoaderEvent")]
        /**
        * Dispatched when a single dependency (which may be the main file of a resource)
        * finishes loading.
        *
        * @eventType away.events.LoaderEvent
        */
        //[Event(name="dependencyComplete", type="away3d.events.LoaderEvent")]
        /**
        * Dispatched when an error occurs during loading. I
        *
        * @eventType away.events.LoaderEvent
        */
        //[Event(name="loadError", type="away3d.events.LoaderEvent")]
        /**
        * Dispatched when an error occurs during parsing.
        *
        * @eventType away.events.ParserEvent
        */
        //[Event(name="parseError", type="away3d.events.ParserEvent")]
        /**
        * Dispatched when a skybox asset has been costructed from a ressource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="skyboxComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a camera3d asset has been costructed from a ressource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="cameraComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a mesh asset has been costructed from a ressource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="meshComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a geometry asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="geometryComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a skeleton asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="skeletonComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a skeleton pose asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="skeletonPoseComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a container asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="containerComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a texture asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="textureComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a texture projector asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="textureProjectorComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a material asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="materialComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when a animator asset has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animatorComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation set has been constructed from a group of animation state resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animationSetComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation state has been constructed from a group of animation node resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animationStateComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation node has been constructed from a resource.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="animationNodeComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an animation state transition has been constructed from a group of animation node resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="stateTransitionComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an light asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="lightComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an light picker asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="lightPickerComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an effect method asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="effectMethodComplete", type="away3d.events.AssetEvent")]
        /**
        * Dispatched when an shadow map method asset has been constructed from a resources.
        *
        * @eventType away.events.AssetEvent
        */
        //[Event(name="shadowMapMethodComplete", type="away3d.events.AssetEvent")]
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
        var AssetLoaderToken = (function (_super) {
            __extends(AssetLoaderToken, _super);
            function AssetLoaderToken(loader) {
                _super.call(this);

                this._iLoader = loader;
            }
            AssetLoaderToken.prototype.addEventListener = function (type, listener, target) {
                this._iLoader.addEventListener(type, listener, target);
            };

            AssetLoaderToken.prototype.removeEventListener = function (type, listener, target) {
                this._iLoader.removeEventListener(type, listener, target);
            };

            AssetLoaderToken.prototype.hasEventListener = function (type, listener, target) {
                if (typeof listener === "undefined") { listener = null; }
                if (typeof target === "undefined") { target = null; }
                return this._iLoader.hasEventListener(type, listener, target);
            };
            return AssetLoaderToken;
        })(away.events.EventDispatcher);
        net.AssetLoaderToken = AssetLoaderToken;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
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
        var SingleFileLoader = (function (_super) {
            __extends(SingleFileLoader, _super);
            /**
            * Creates a new SingleFileLoader object.
            */
            function SingleFileLoader(materialMode) {
                if (typeof materialMode === "undefined") { materialMode = 0; }
                _super.call(this);
                this._materialMode = materialMode;
                this._assets = new Array();
            }
            SingleFileLoader.enableParser = function (parser) {
                if (SingleFileLoader._parsers.indexOf(parser) < 0)
                    SingleFileLoader._parsers.push(parser);
            };

            SingleFileLoader.enableParsers = function (parsers) {
                for (var c = 0; c < parsers.length; c++)
                    SingleFileLoader.enableParser(parsers[c]);
            };

            Object.defineProperty(SingleFileLoader.prototype, "url", {
                // Get / Set
                get: function () {
                    return this._req ? this._req.url : '';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileLoader.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileLoader.prototype, "loadAsRawData", {
                get: function () {
                    return this._loadAsRawData;
                },
                enumerable: true,
                configurable: true
            });

            // Public
            /**
            * Load a resource from a file.
            *
            * @param urlRequest The URLRequest object containing the URL of the object to be loaded.
            * @param parser An optional parser object that will translate the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            SingleFileLoader.prototype.load = function (urlRequest, parser, loadAsRawData) {
                if (typeof parser === "undefined") { parser = null; }
                if (typeof loadAsRawData === "undefined") { loadAsRawData = false; }
                //var urlLoader   : URLLoader;
                var dataFormat;
                var loaderType = away.parsers.ParserLoaderType.URL_LOADER;

                this._loadAsRawData = loadAsRawData;
                this._req = urlRequest;

                this.decomposeFilename(this._req.url);

                if (this._loadAsRawData) {
                    // Always use binary and IMGLoader for raw data loading
                    dataFormat = away.net.URLLoaderDataFormat.BINARY;
                    loaderType = away.parsers.ParserLoaderType.IMG_LOADER;
                } else {
                    if (parser)
                        this._parser = parser;

                    if (!this._parser)
                        this._parser = this.getParserFromSuffix();

                    if (this._parser) {
                        switch (this._parser.dataFormat) {
                            case away.parsers.ParserDataFormat.BINARY:
                                dataFormat = away.net.URLLoaderDataFormat.ARRAY_BUFFER;

                                break;

                            case away.parsers.ParserDataFormat.PLAIN_TEXT:
                                dataFormat = away.net.URLLoaderDataFormat.TEXT;
                                break;
                        }

                        switch (this._parser.loaderType) {
                            case away.parsers.ParserLoaderType.IMG_LOADER:
                                loaderType = away.parsers.ParserLoaderType.IMG_LOADER;
                                break;

                            case away.parsers.ParserLoaderType.URL_LOADER:
                                loaderType = away.parsers.ParserLoaderType.URL_LOADER;
                                break;
                        }
                    } else {
                        // Always use BINARY for unknown file formats. The thorough
                        // file type check will determine format after load, and if
                        // binary, a text load will have broken the file data.
                        dataFormat = away.net.URLLoaderDataFormat.BINARY;
                    }
                }

                var loader = this.getLoader(loaderType);
                loader.dataFormat = dataFormat;
                loader.addEventListener(away.events.Event.COMPLETE, this.handleUrlLoaderComplete, this);
                loader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.handleUrlLoaderError, this);
                loader.load(urlRequest);
            };

            /**
            * Loads a resource from already loaded data.
            * @param data The data to be parsed. Depending on the parser type, this can be a ByteArray, String or XML.
            * @param uri The identifier (url or id) of the object to be loaded, mainly used for resource management.
            * @param parser An optional parser object that will translate the data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            SingleFileLoader.prototype.parseData = function (data, parser, req) {
                if (typeof parser === "undefined") { parser = null; }
                if (typeof req === "undefined") { req = null; }
                if (data.constructor === Function)
                    data = new data();

                if (parser)
                    this._parser = parser;

                this._req = req;
                this.parse(data);
            };

            Object.defineProperty(SingleFileLoader.prototype, "parser", {
                /**
                * A reference to the parser that will translate the loaded data into a usable resource.
                */
                get: function () {
                    return this._parser;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileLoader.prototype, "dependencies", {
                /**
                * A list of dependencies that need to be loaded and resolved for the loaded object.
                */
                get: function () {
                    return this._parser ? this._parser.dependencies : new Array();
                },
                enumerable: true,
                configurable: true
            });

            // Private
            /**
            *
            * @param loaderType
            */
            SingleFileLoader.prototype.getLoader = function (loaderType) {
                var loader;

                switch (loaderType) {
                    case away.parsers.ParserLoaderType.IMG_LOADER:
                        loader = new away.net.SingleFileImageLoader();
                        break;

                    case away.parsers.ParserLoaderType.URL_LOADER:
                        loader = new away.net.SingleFileURLLoader();
                        break;
                }

                return loader;
            };

            /**
            * Splits a url string into base and extension.
            * @param url The url to be decomposed.
            */
            SingleFileLoader.prototype.decomposeFilename = function (url) {
                // Get rid of query string if any and extract suffix
                var base = (url.indexOf('?') > 0) ? url.split('?')[0] : url;
                var i = base.lastIndexOf('.');
                this._fileExtension = base.substr(i + 1).toLowerCase();
                this._fileName = base.substr(0, i);
            };

            /**
            * Guesses the parser to be used based on the file extension.
            * @return An instance of the guessed parser.
            */
            SingleFileLoader.prototype.getParserFromSuffix = function () {
                var len = SingleFileLoader._parsers.length;

                for (var i = len - 1; i >= 0; i--) {
                    var currentParser = SingleFileLoader._parsers[i];
                    var supportstype = SingleFileLoader._parsers[i].supportsType(this._fileExtension);

                    if (SingleFileLoader._parsers[i]['supportsType'](this._fileExtension)) {
                        return new SingleFileLoader._parsers[i]();
                    }
                }

                return null;
            };

            /**
            * Guesses the parser to be used based on the file contents.
            * @param data The data to be parsed.
            * @param uri The url or id of the object to be parsed.
            * @return An instance of the guessed parser.
            */
            SingleFileLoader.prototype.getParserFromData = function (data) {
                var len = SingleFileLoader._parsers.length;

                for (var i = len - 1; i >= 0; i--)
                    if (SingleFileLoader._parsers[i].supportsData(data))
                        return new SingleFileLoader._parsers[i]();

                return null;
            };

            /**
            * Cleanups
            */
            SingleFileLoader.prototype.removeListeners = function (urlLoader) {
                urlLoader.removeEventListener(away.events.Event.COMPLETE, this.handleUrlLoaderComplete, this);
                urlLoader.removeEventListener(away.events.IOErrorEvent.IO_ERROR, this.handleUrlLoaderError, this);
            };

            // Events
            /**
            * Called when loading of a file has failed
            */
            SingleFileLoader.prototype.handleUrlLoaderError = function (event) {
                var urlLoader = event.target;
                this.removeListeners(urlLoader);

                //if(this.hasEventListener(away.events.LoaderEvent.LOAD_ERROR , this.handleUrlLoaderError , this ))
                this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this.url, this._assets)); //, event.text));
            };

            /**
            * Called when loading of a file is complete
            */
            SingleFileLoader.prototype.handleUrlLoaderComplete = function (event) {
                var urlLoader = event.target;
                this.removeListeners(urlLoader);

                this._data = urlLoader.data;

                if (this._loadAsRawData) {
                    // No need to parse this data, which should be returned as is
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.url, this._assets));
                } else {
                    this.parse(this._data);
                }
            };

            /**
            * Initiates parsing of the loaded data.
            * @param data The data to be parsed.
            */
            SingleFileLoader.prototype.parse = function (data) {
                // If no parser has been defined, try to find one by letting
                // all plugged in parsers inspect the actual data.
                if (!this._parser) {
                    this._parser = this.getParserFromData(data);
                }

                if (this._parser) {
                    this._parser.addEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
                    this._parser.addEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParseError, this);
                    this._parser.addEventListener(away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete, this);
                    this._parser.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                    this._parser.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);

                    if (this._req && this._req.url) {
                        this._parser._iFileName = this._req.url;
                    }

                    this._parser.materialMode = this._materialMode;
                    this._parser.parseAsync(data);
                } else {
                    var msg = "No parser defined. To enable all parsers for auto-detection, use Parsers.enableAllBundled()";

                    //if(hasEventListener(LoaderEvent.LOAD_ERROR)){
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this.url, this._assets, true, msg));
                    //} else{
                    //	throw new Error(msg);
                    //}
                }
            };

            SingleFileLoader.prototype.onParseError = function (event) {
                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onReadyForDependencies = function (event) {
                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onAssetComplete = function (event) {
                // Event is dispatched twice per asset (once as generic ASSET_COMPLETE,
                // and once as type-specific, e.g. MESH_COMPLETE.) Do this only once.
                if (event.type == away.events.AssetEvent.ASSET_COMPLETE)
                    this._assets.push(event.asset);

                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onTextureSizeError = function (event) {
                this.dispatchEvent(event.clone());
            };

            /**
            * Called when parsing is complete.
            */
            SingleFileLoader.prototype.onParseComplete = function (event) {
                this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.url, this._assets)); //dispatch in front of removing listeners to allow any remaining asset events to propagate

                this._parser.removeEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
                this._parser.removeEventListener(away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete, this);
                this._parser.removeEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParseError, this);
                this._parser.removeEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                this._parser.removeEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
            };
            SingleFileLoader._parsers = new Array(away.parsers.ImageParser, away.parsers.CubeTextureParser);
            return SingleFileLoader;
        })(away.events.EventDispatcher);
        net.SingleFileLoader = SingleFileLoader;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (net) {
        var SingleFileImageLoader = (function (_super) {
            __extends(SingleFileImageLoader, _super);
            function SingleFileImageLoader() {
                _super.call(this);
                this.initLoader();
            }
            // Public
            /**
            *
            * @param req
            */
            SingleFileImageLoader.prototype.load = function (req) {
                this._loader.load(req);
            };

            /**
            *
            */
            SingleFileImageLoader.prototype.dispose = function () {
                this.disposeLoader();
                this._data = null;
            };

            Object.defineProperty(SingleFileImageLoader.prototype, "data", {
                // Get / Set
                /**
                *
                * @returns {*}
                */
                get: function () {
                    return this._loader.image;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileImageLoader.prototype, "dataFormat", {
                /**
                *
                * @returns {*}
                */
                get: function () {
                    return this._dataFormat;
                },
                set: function (value) {
                    this._dataFormat = value;
                },
                enumerable: true,
                configurable: true
            });


            // Private
            /**
            *
            */
            SingleFileImageLoader.prototype.initLoader = function () {
                if (!this._loader) {
                    this._loader = new away.net.IMGLoader();
                    this._loader.addEventListener(away.events.Event.COMPLETE, this.onLoadComplete, this);
                    this._loader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                }
            };

            /**
            *
            */
            SingleFileImageLoader.prototype.disposeLoader = function () {
                if (this._loader) {
                    this._loader.dispose();
                    this._loader.removeEventListener(away.events.Event.COMPLETE, this.onLoadComplete, this);
                    this._loader.removeEventListener(away.events.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                    this._loader = null;
                }
            };

            // Events
            /**
            *
            * @param event
            */
            SingleFileImageLoader.prototype.onLoadComplete = function (event) {
                this.dispatchEvent(event);
            };

            /**
            *
            * @param event
            */
            SingleFileImageLoader.prototype.onLoadError = function (event) {
                this.dispatchEvent(event);
            };
            return SingleFileImageLoader;
        })(away.events.EventDispatcher);
        net.SingleFileImageLoader = SingleFileImageLoader;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        var SingleFileURLLoader = (function (_super) {
            __extends(SingleFileURLLoader, _super);
            function SingleFileURLLoader() {
                _super.call(this);
                this.initLoader();
            }
            // Public
            /**
            *
            * @param req
            */
            SingleFileURLLoader.prototype.load = function (req) {
                this._loader.load(req);
            };

            /**
            *
            */
            SingleFileURLLoader.prototype.dispose = function () {
                this.disposeLoader();
                this._data = null;
            };

            Object.defineProperty(SingleFileURLLoader.prototype, "data", {
                // Get / Set
                /**
                *
                * @returns {*}
                */
                get: function () {
                    return this._loader.data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileURLLoader.prototype, "dataFormat", {
                /**
                *
                * @returns {*}
                */
                get: function () {
                    return this._loader.dataFormat;
                },
                set: function (value) {
                    this._loader.dataFormat = value;
                },
                enumerable: true,
                configurable: true
            });


            // Private
            /**
            *
            */
            SingleFileURLLoader.prototype.initLoader = function () {
                if (!this._loader) {
                    this._loader = new away.net.URLLoader();
                    this._loader.addEventListener(away.events.Event.COMPLETE, this.onLoadComplete, this);
                    this._loader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                }
            };

            /**
            *
            */
            SingleFileURLLoader.prototype.disposeLoader = function () {
                if (this._loader) {
                    this._loader.dispose();
                    this._loader.removeEventListener(away.events.Event.COMPLETE, this.onLoadComplete, this);
                    this._loader.removeEventListener(away.events.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                    this._loader = null;
                }
            };

            // Events
            /**
            *
            * @param event
            */
            SingleFileURLLoader.prototype.onLoadComplete = function (event) {
                this.dispatchEvent(event);
            };

            /**
            *
            * @param event
            */
            SingleFileURLLoader.prototype.onLoadError = function (event) {
                this.dispatchEvent(event);
            };
            return SingleFileURLLoader;
        })(away.events.EventDispatcher);
        net.SingleFileURLLoader = SingleFileURLLoader;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        /**
        *
        */
        var URLRequest = (function () {
            /**
            
            * @param url
            */
            function URLRequest(url) {
                if (typeof url === "undefined") { url = null; }
                /**
                *
                * away.net.URLRequestMethod.GET
                * away.net.URLRequestMethod.POST
                *
                * @type {string}
                */
                this.method = away.net.URLRequestMethod.GET;
                /**
                * Use asynchronous XMLHttpRequest
                * @type {boolean}
                */
                this.async = true;
                this._url = url;
            }
            Object.defineProperty(URLRequest.prototype, "url", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this._url;
                },
                /**
                *
                * @param value
                */
                set: function (value) {
                    this._url = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * dispose
            */
            URLRequest.prototype.dispose = function () {
                this.data = null;
                this._url = null;
            };
            return URLRequest;
        })();
        net.URLRequest = URLRequest;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        // TODO: implement / test cross domain policy
        var IMGLoader = (function (_super) {
            __extends(IMGLoader, _super);
            function IMGLoader(imageName) {
                if (typeof imageName === "undefined") { imageName = ''; }
                _super.call(this);
                this._name = '';
                this._loaded = false;
                this._name = imageName;
                this.initImage();
            }
            // Public
            /**
            * load an image
            * @param request {away.net.URLRequest}
            */
            IMGLoader.prototype.load = function (request) {
                this._loaded = false;
                this._request = request;

                if (this._crossOrigin) {
                    if (this._image['crossOrigin'] != null) {
                        this._image['crossOrigin'] = this._crossOrigin;
                    }
                }

                this._image.src = this._request.url;
            };

            /**
            *
            */
            IMGLoader.prototype.dispose = function () {
                if (this._image) {
                    this._image.onabort = null;
                    this._image.onerror = null;
                    this._image.onload = null;
                    this._image = null;
                }

                if (this._request) {
                    this._request = null;
                }
            };

            Object.defineProperty(IMGLoader.prototype, "image", {
                // Get / Set
                /**
                * Get reference to image if it is loaded
                * @returns {HTMLImageElement}
                */
                get: function () {
                    return this._image;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "loaded", {
                /**
                * Get image width. Returns null is image is not loaded
                * @returns {number}
                */
                get: function () {
                    return this._loaded;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "crossOrigin", {
                get: function () {
                    return this._crossOrigin;
                },
                set: function (value) {
                    this._crossOrigin = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(IMGLoader.prototype, "width", {
                /**
                * Get image width. Returns null is image is not loaded
                * @returns {number}
                */
                get: function () {
                    if (this._image) {
                        return this._image.width;
                    }

                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "height", {
                /**
                * Get image height. Returns null is image is not loaded
                * @returns {number}
                */
                get: function () {
                    if (this._image) {
                        return this._image.height;
                    }

                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "request", {
                /**
                * return URL request used to load image
                * @returns {away.net.URLRequest}
                */
                get: function () {
                    return this._request;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "name", {
                /**
                * get name of HTMLImageElement
                * @returns {string}
                */
                get: function () {
                    if (this._image) {
                        return this._image.name;
                    }

                    return this._name;
                },
                /**
                * set name of HTMLImageElement
                * @returns {string}
                */
                set: function (value) {
                    if (this._image) {
                        this._image.name = value;
                    }

                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });


            // Private
            /**
            * intialise the image object
            */
            IMGLoader.prototype.initImage = function () {
                var _this = this;
                if (!this._image) {
                    this._image = new Image();
                    this._image.onabort = function (event) {
                        return _this.onAbort(event);
                    }; //Loading of an image is interrupted
                    this._image.onerror = function (event) {
                        return _this.onError(event);
                    }; //An error occurs when loading an image
                    this._image.onload = function (event) {
                        return _this.onLoadComplete(event);
                    }; //image is finished loading
                    this._image.name = this._name;
                }
            };

            // Image - event handlers
            /**
            * Loading of an image is interrupted
            * @param event
            */
            IMGLoader.prototype.onAbort = function (event) {
                this.dispatchEvent(new away.events.Event(away.events.IOErrorEvent.IO_ERROR));
            };

            /**
            * An error occured when loading the image
            * @param event
            */
            IMGLoader.prototype.onError = function (event) {
                this.dispatchEvent(new away.events.Event(away.events.IOErrorEvent.IO_ERROR));
            };

            /**
            * image is finished loading
            * @param event
            */
            IMGLoader.prototype.onLoadComplete = function (event) {
                this._loaded = true;
                this.dispatchEvent(new away.events.Event(away.events.Event.COMPLETE));
            };
            return IMGLoader;
        })(away.events.EventDispatcher);
        net.IMGLoader = IMGLoader;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        var URLLoaderDataFormat = (function () {
            function URLLoaderDataFormat() {
            }
            URLLoaderDataFormat.TEXT = 'text';

            URLLoaderDataFormat.VARIABLES = 'variables';

            URLLoaderDataFormat.BLOB = 'blob';

            URLLoaderDataFormat.ARRAY_BUFFER = 'arraybuffer';

            URLLoaderDataFormat.BINARY = 'binary';
            return URLLoaderDataFormat;
        })();
        net.URLLoaderDataFormat = URLLoaderDataFormat;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        var URLRequestMethod = (function () {
            function URLRequestMethod() {
            }
            URLRequestMethod.POST = 'POST';

            URLRequestMethod.GET = 'GET';
            return URLRequestMethod;
        })();
        net.URLRequestMethod = URLRequestMethod;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        // TODO: implement / test cross domain policy
        var URLLoader = (function (_super) {
            __extends(URLLoader, _super);
            function URLLoader() {
                _super.call(this);
                this._bytesLoaded = 0;
                this._bytesTotal = 0;
                this._dataFormat = away.net.URLLoaderDataFormat.TEXT;
                this._loadError = false;
            }
            // Public
            /**
            *
            * @param request {away.net.URLRequest}
            */
            URLLoader.prototype.load = function (request) {
                this.initXHR();
                this._request = request;

                if (request.method === away.net.URLRequestMethod.POST) {
                    this.postRequest(request);
                } else {
                    this.getRequest(request);
                }
            };

            /**
            *
            */
            URLLoader.prototype.close = function () {
                this._XHR.abort();
                this.disposeXHR();
            };

            /**
            *
            */
            URLLoader.prototype.dispose = function () {
                if (this._XHR) {
                    this._XHR.abort();
                }

                this.disposeXHR();

                this._data = null;
                this._dataFormat = null;
                this._bytesLoaded = null;
                this._bytesTotal = null;

                /*
                if( this._request )
                {
                
                this._request.dispose();
                
                }
                */
                this._request = null;
            };


            Object.defineProperty(URLLoader.prototype, "dataFormat", {
                /**
                *
                * @returns {string}
                *      away.net.URLLoaderDataFormat
                */
                get: function () {
                    return this._dataFormat;
                },
                // Get / Set
                /**
                *
                * away.net.URLLoaderDataFormat.BINARY
                * away.net.URLLoaderDataFormat.TEXT
                * away.net.URLLoaderDataFormat.VARIABLES
                *
                * @param format
                */
                set: function (format) {
                    if (format === away.net.URLLoaderDataFormat.BLOB || format === away.net.URLLoaderDataFormat.ARRAY_BUFFER || format === away.net.URLLoaderDataFormat.BINARY || format === away.net.URLLoaderDataFormat.TEXT || format === away.net.URLLoaderDataFormat.VARIABLES) {
                        this._dataFormat = format;
                    } else {
                        throw new away.errors.Error('URLLoader error: incompatible dataFormat');
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "data", {
                /**
                *
                * @returns {*}
                */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "bytesLoaded", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._bytesLoaded;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "bytesTotal", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._bytesTotal;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "request", {
                /**
                *
                * @returns {away.net.URLRequest}
                */
                get: function () {
                    return this._request;
                },
                enumerable: true,
                configurable: true
            });

            // Private
            /**
            *
            * @param xhr
            * @param responseType
            */
            URLLoader.prototype.setResponseType = function (xhr, responseType) {
                switch (responseType) {
                    case away.net.URLLoaderDataFormat.ARRAY_BUFFER:
                    case away.net.URLLoaderDataFormat.BLOB:
                    case away.net.URLLoaderDataFormat.TEXT:
                        xhr.responseType = responseType;

                        break;

                    case away.net.URLLoaderDataFormat.VARIABLES:
                        xhr.responseType = away.net.URLLoaderDataFormat.TEXT;

                        break;

                    case away.net.URLLoaderDataFormat.BINARY:
                        xhr.responseType = '';

                        break;
                }
            };

            /**
            *
            * @param request {away.net.URLRequest}
            */
            URLLoader.prototype.getRequest = function (request) {
                try  {
                    this._XHR.open(request.method, request.url, request.async);
                    this.setResponseType(this._XHR, this._dataFormat);
                    this._XHR.send(); // No data to send
                } catch (e) {
                    this.handleXmlHttpRequestException(e);
                }
            };

            /**
            *
            * @param request {away.net.URLRequest}
            */
            URLLoader.prototype.postRequest = function (request) {
                this._loadError = false;

                this._XHR.open(request.method, request.url, request.async);

                if (request.data != null) {
                    if (request.data instanceof away.net.URLVariables) {
                        var urlVars = request.data;

                        try  {
                            this._XHR.responseType = 'text';
                            this._XHR.send(urlVars.formData);
                        } catch (e) {
                            this.handleXmlHttpRequestException(e);
                        }
                    } else {
                        this.setResponseType(this._XHR, this._dataFormat);

                        if (request.data) {
                            this._XHR.send(request.data); // TODO: Test
                        } else {
                            this._XHR.send(); // no data to send
                        }
                    }
                } else {
                    this._XHR.send(); // No data to send
                }
            };

            /**
            *
            * @param error {XMLHttpRequestException}
            */
            URLLoader.prototype.handleXmlHttpRequestException = function (error /* <XMLHttpRequestException> */ ) {
                switch (error.code) {
                    case 101:
                        break;
                }
            };

            /**
            *
            */
            URLLoader.prototype.initXHR = function () {
                var _this = this;
                if (!this._XHR) {
                    this._XHR = new XMLHttpRequest();

                    this._XHR.onloadstart = function (event) {
                        return _this.onLoadStart(event);
                    }; // loadstart	        - When the request starts.
                    this._XHR.onprogress = function (event) {
                        return _this.onProgress(event);
                    }; // progress	            - While loading and sending data.
                    this._XHR.onabort = function (event) {
                        return _this.onAbort(event);
                    }; // abort	            - When the request has been aborted, either by invoking the abort() method or navigating away from the page.
                    this._XHR.onerror = function (event) {
                        return _this.onLoadError(event);
                    }; // error	            - When the request has failed.
                    this._XHR.onload = function (event) {
                        return _this.onLoadComplete(event);
                    }; // load	                - When the request has successfully completed.
                    this._XHR.ontimeout = function (event) {
                        return _this.onTimeOut(event);
                    }; // timeout	            - When the author specified timeout has passed before the request could complete.
                    this._XHR.onloadend = function (event) {
                        return _this.onLoadEnd(event);
                    }; // loadend	            - When the request has completed, regardless of whether or not it was successful.
                    this._XHR.onreadystatechange = function (event) {
                        return _this.onReadyStateChange(event);
                    }; // onreadystatechange   - When XHR state changes
                }
            };

            /**
            *
            */
            URLLoader.prototype.disposeXHR = function () {
                if (this._XHR !== null) {
                    this._XHR.onloadstart = null;
                    this._XHR.onprogress = null;
                    this._XHR.onabort = null;
                    this._XHR.onerror = null;
                    this._XHR.onload = null;
                    this._XHR.ontimeout = null;
                    this._XHR.onloadend = null;
                    this._XHR = null;
                }
            };

            /**
            *
            * @param source
            */
            URLLoader.prototype.decodeURLVariables = function (source) {
                var result = new Object();

                source = source.split("+").join(" ");

                var tokens, re = /[?&]?([^=]+)=([^&]*)/g;

                while (tokens = re.exec(source)) {
                    result[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
                }

                return result;
            };

            // XMLHttpRequest - Event Handlers
            /**
            * When XHR state changes
            * @param event
            */
            URLLoader.prototype.onReadyStateChange = function (event) {
                if (this._XHR.readyState == 4) {
                    if (this._XHR.status == 404) {
                        this._loadError = true;
                        this.dispatchEvent(new away.events.IOErrorEvent(away.events.IOErrorEvent.IO_ERROR));
                    }

                    this.dispatchEvent(new away.events.HTTPStatusEvent(away.events.HTTPStatusEvent.HTTP_STATUS, this._XHR.status));
                }
            };

            /**
            * When the request has completed, regardless of whether or not it was successful.
            * @param event
            */
            URLLoader.prototype.onLoadEnd = function (event) {
                if (this._loadError === true)
                    return;
            };

            /**
            * When the author specified timeout has passed before the request could complete.
            * @param event
            */
            URLLoader.prototype.onTimeOut = function (event) {
                //TODO: Timeout not currently implemented ( also not part of AS3 API )
            };

            /**
            * When the request has been aborted, either by invoking the abort() method or navigating away from the page.
            * @param event
            */
            URLLoader.prototype.onAbort = function (event) {
                // TODO: investigate whether this needs to be an IOError
            };

            /**
            * While loading and sending data.
            * @param event
            */
            URLLoader.prototype.onProgress = function (event) {
                this._bytesTotal = event.total;
                this._bytesLoaded = event.loaded;

                var progressEvent = new away.events.ProgressEvent(away.events.ProgressEvent.PROGRESS);
                progressEvent.bytesLoaded = this._bytesLoaded;
                progressEvent.bytesTotal = this._bytesTotal;
                this.dispatchEvent(progressEvent);
            };

            /**
            * When the request starts.
            * @param event
            */
            URLLoader.prototype.onLoadStart = function (event) {
                this.dispatchEvent(new away.events.Event(away.events.Event.OPEN));
            };

            /**
            * When the request has successfully completed.
            * @param event
            */
            URLLoader.prototype.onLoadComplete = function (event) {
                if (this._loadError === true)
                    return;

                switch (this._dataFormat) {
                    case away.net.URLLoaderDataFormat.TEXT:
                        this._data = this._XHR.responseText;

                        break;

                    case away.net.URLLoaderDataFormat.VARIABLES:
                        this._data = this.decodeURLVariables(this._XHR.responseText);

                        break;

                    case away.net.URLLoaderDataFormat.BLOB:
                    case away.net.URLLoaderDataFormat.ARRAY_BUFFER:
                    case away.net.URLLoaderDataFormat.BINARY:
                        this._data = this._XHR.response;

                        break;

                    default:
                        this._data = this._XHR.responseText;

                        break;
                }

                this.dispatchEvent(new away.events.Event(away.events.Event.COMPLETE));
            };

            /**
            * When the request has failed. ( due to network issues ).
            * @param event
            */
            URLLoader.prototype.onLoadError = function (event) {
                this._loadError = true;
                this.dispatchEvent(new away.events.IOErrorEvent(away.events.IOErrorEvent.IO_ERROR));
            };
            return URLLoader;
        })(away.events.EventDispatcher);
        net.URLLoader = URLLoader;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (net) {
        var URLVariables = (function () {
            /**
            *
            * @param source
            */
            function URLVariables(source) {
                if (typeof source === "undefined") { source = null; }
                this._variables = new Object();
                if (source !== null) {
                    this.decode(source);
                }
            }
            /**
            *
            * @param source
            */
            URLVariables.prototype.decode = function (source) {
                source = source.split("+").join(" ");

                var tokens, re = /[?&]?([^=]+)=([^&]*)/g;

                while (tokens = re.exec(source)) {
                    this._variables[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
                }
            };

            /**
            *
            * @returns {string}
            */
            URLVariables.prototype.toString = function () {
                return '';
            };

            Object.defineProperty(URLVariables.prototype, "variables", {
                /**
                *
                * @returns {Object}
                */
                get: function () {
                    return this._variables;
                },
                /**
                *
                * @returns {Object}
                */
                set: function (obj) {
                    this._variables = obj;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLVariables.prototype, "formData", {
                /**
                *
                * @returns {Object}
                */
                get: function () {
                    var fd = new FormData();

                    for (var s in this._variables) {
                        fd.append(s, this._variables[s]);
                    }

                    return fd;
                },
                enumerable: true,
                configurable: true
            });

            return URLVariables;
        })();
        net.URLVariables = URLVariables;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (ui) {
        var Keyboard = (function () {
            function Keyboard() {
            }
            Keyboard.A = 65;

            Keyboard.ALTERNATE = 18;

            Keyboard.AUDIO = 0x01000017;

            Keyboard.B = 66;

            Keyboard.BACK = 0x01000016;

            Keyboard.BACKQUOTE = 192;

            Keyboard.BACKSLASH = 220;

            Keyboard.BACKSPACE = 8;

            Keyboard.BLUE = 0x01000003;

            Keyboard.C = 67;

            Keyboard.CAPS_LOCK = 20;

            Keyboard.CHANNEL_DOWN = 0x01000005;

            Keyboard.CHANNEL_UP = 0x01000005;

            Keyboard.COMMA = 188;

            Keyboard.COMMAND = 15;

            Keyboard.CONTROL = 17;

            Keyboard.D = 68;

            Keyboard.DELETE = 46;

            Keyboard.DOWN = 40;

            Keyboard.DVR = 0x01000019;

            Keyboard.E = 69;

            Keyboard.END = 35;

            Keyboard.ENTER = 13;

            Keyboard.EQUAL = 187;

            Keyboard.ESCAPE = 27;

            Keyboard.EXIT = 0x01000015;

            Keyboard.F = 70;

            Keyboard.F1 = 112;

            Keyboard.F10 = 121;

            Keyboard.F11 = 122;

            Keyboard.F12 = 123;

            Keyboard.F13 = 124;

            Keyboard.F14 = 125;

            Keyboard.F15 = 126;

            Keyboard.F2 = 113;

            Keyboard.F3 = 114;

            Keyboard.F4 = 115;

            Keyboard.F5 = 116;

            Keyboard.F6 = 117;

            Keyboard.F7 = 118;

            Keyboard.F8 = 119;

            Keyboard.F9 = 120;

            Keyboard.FAST_FORWARD = 0x0100000A;

            Keyboard.G = 71;

            Keyboard.GREEN = 0x01000001;

            Keyboard.GUIDE = 0x01000014;

            Keyboard.H = 72;

            Keyboard.HELP = 0x0100001D;

            Keyboard.HOME = 36;

            Keyboard.I = 73;

            Keyboard.INFO = 0x01000013;

            Keyboard.INPUT = 0x0100001B;

            Keyboard.INSERT = 45;

            Keyboard.J = 74;

            Keyboard.K = 75;

            Keyboard.KEYNAME_BEGIN = "Begin";

            Keyboard.KEYNAME_BREAK = "Break";

            Keyboard.KEYNAME_CLEARDISPLAY = "ClrDsp";

            Keyboard.KEYNAME_CLEARLINE = "ClrLn";

            Keyboard.KEYNAME_DELETE = "Delete";

            Keyboard.KEYNAME_DELETECHAR = "DelChr";

            Keyboard.KEYNAME_DELETELINE = "DelLn";

            Keyboard.KEYNAME_DOWNARROW = "Down";

            Keyboard.KEYNAME_END = "End";

            Keyboard.KEYNAME_EXECUTE = "Exec";

            Keyboard.KEYNAME_F1 = "F1";

            Keyboard.KEYNAME_F10 = "F10";

            Keyboard.KEYNAME_F11 = "F11";

            Keyboard.KEYNAME_F12 = "F12";

            Keyboard.KEYNAME_F13 = "F13";

            Keyboard.KEYNAME_F14 = "F14";

            Keyboard.KEYNAME_F15 = "F15";

            Keyboard.KEYNAME_F16 = "F16";

            Keyboard.KEYNAME_F17 = "F17";

            Keyboard.KEYNAME_F18 = "F18";

            Keyboard.KEYNAME_F19 = "F19";

            Keyboard.KEYNAME_F2 = "F2";

            Keyboard.KEYNAME_F20 = "F20";

            Keyboard.KEYNAME_F21 = "F21";

            Keyboard.KEYNAME_F22 = "F22";

            Keyboard.KEYNAME_F23 = "F23";

            Keyboard.KEYNAME_F24 = "F24";

            Keyboard.KEYNAME_F25 = "F25";

            Keyboard.KEYNAME_F26 = "F26";

            Keyboard.KEYNAME_F27 = "F27";

            Keyboard.KEYNAME_F28 = "F28";

            Keyboard.KEYNAME_F29 = "F29";

            Keyboard.KEYNAME_F3 = "F3";

            Keyboard.KEYNAME_F30 = "F30";

            Keyboard.KEYNAME_F31 = "F31";

            Keyboard.KEYNAME_F32 = "F32";

            Keyboard.KEYNAME_F33 = "F33";

            Keyboard.KEYNAME_F34 = "F34";

            Keyboard.KEYNAME_F35 = "F35";

            Keyboard.KEYNAME_F4 = "F4";

            Keyboard.KEYNAME_F5 = "F5";

            Keyboard.KEYNAME_F6 = "F6";

            Keyboard.KEYNAME_F7 = "F7";

            Keyboard.KEYNAME_F8 = "F8";

            Keyboard.KEYNAME_F9 = "F9";

            Keyboard.KEYNAME_FIND = "Find";

            Keyboard.KEYNAME_HELP = "Help";

            Keyboard.KEYNAME_HOME = "Home";

            Keyboard.KEYNAME_INSERT = "Insert";

            Keyboard.KEYNAME_INSERTCHAR = "InsChr";

            Keyboard.KEYNAME_INSERTLINE = "LnsLn";

            Keyboard.KEYNAME_LEFTARROW = "Left";

            Keyboard.KEYNAME_MENU = "Menu";

            Keyboard.KEYNAME_MODESWITCH = "ModeSw";

            Keyboard.KEYNAME_NEXT = "Next";

            Keyboard.KEYNAME_PAGEDOWN = "PgDn";

            Keyboard.KEYNAME_PAGEUP = "PgUp";

            Keyboard.KEYNAME_PAUSE = "Pause";

            Keyboard.KEYNAME_PREV = "Prev";

            Keyboard.KEYNAME_PRINT = "Print";

            Keyboard.KEYNAME_PRINTSCREEN = "PrntScrn";

            Keyboard.KEYNAME_REDO = "Redo";

            Keyboard.KEYNAME_RESET = "Reset";

            Keyboard.KEYNAME_RIGHTARROW = "Right";

            Keyboard.KEYNAME_SCROLLLOCK = "ScrlLck";

            Keyboard.KEYNAME_SELECT = "Select";

            Keyboard.KEYNAME_STOP = "Stop";

            Keyboard.KEYNAME_SYSREQ = "SysReq";

            Keyboard.KEYNAME_SYSTEM = "Sys";

            Keyboard.KEYNAME_UNDO = "Undo";

            Keyboard.KEYNAME_UPARROW = "Up";

            Keyboard.KEYNAME_USER = "User";

            Keyboard.L = 76;

            Keyboard.LAST = 0x01000011;

            Keyboard.LEFT = 37;

            Keyboard.LEFTBRACKET = 219;

            Keyboard.LIVE = 0x01000010;

            Keyboard.M = 77;

            Keyboard.MASTER_SHELL = 0x0100001E;

            Keyboard.MENU = 0x01000012;

            Keyboard.MINUS = 189;

            Keyboard.N = 78;

            Keyboard.NEXT = 0x0100000E;

            Keyboard.NUMBER_0 = 48;

            Keyboard.NUMBER_1 = 49;

            Keyboard.NUMBER_2 = 50;

            Keyboard.NUMBER_3 = 51;

            Keyboard.NUMBER_4 = 52;

            Keyboard.NUMBER_5 = 53;

            Keyboard.NUMBER_6 = 54;

            Keyboard.NUMBER_7 = 55;

            Keyboard.NUMBER_8 = 56;

            Keyboard.NUMBER_9 = 57;

            Keyboard.NUMPAD = 21;

            Keyboard.NUMPAD_0 = 96;

            Keyboard.NUMPAD_1 = 97;

            Keyboard.NUMPAD_2 = 98;

            Keyboard.NUMPAD_3 = 99;

            Keyboard.NUMPAD_4 = 100;

            Keyboard.NUMPAD_5 = 101;

            Keyboard.NUMPAD_6 = 102;

            Keyboard.NUMPAD_7 = 103;

            Keyboard.NUMPAD_8 = 104;

            Keyboard.NUMPAD_9 = 105;

            Keyboard.NUMPAD_ADD = 107;

            Keyboard.NUMPAD_DECIMAL = 110;

            Keyboard.NUMPAD_DIVIDE = 111;

            Keyboard.NUMPAD_ENTER = 108;

            Keyboard.NUMPAD_MULTIPLY = 106;

            Keyboard.NUMPAD_SUBTRACT = 109;

            Keyboard.O = 79;

            Keyboard.P = 80;

            Keyboard.PAGE_DOWN = 34;

            Keyboard.PAGE_UP = 33;

            Keyboard.PAUSE = 0x01000008;

            Keyboard.PERIOD = 190;

            Keyboard.PLAY = 0x01000007;

            Keyboard.PREVIOUS = 0x0100000F;

            Keyboard.Q = 81;

            Keyboard.QUOTE = 222;

            Keyboard.R = 82;

            Keyboard.RECORD = 0x01000006;

            Keyboard.RED = 0x01000000;

            Keyboard.REWIND = 0x0100000B;

            Keyboard.RIGHT = 39;

            Keyboard.RIGHTBRACKET = 221;

            Keyboard.S = 83;

            Keyboard.SEARCH = 0x0100001F;

            Keyboard.SEMICOLON = 186;

            Keyboard.SETUP = 0x0100001C;

            Keyboard.SHIFT = 16;

            Keyboard.SKIP_BACKWARD = 0x0100000D;

            Keyboard.SKIP_FORWARD = 0x0100000C;

            Keyboard.SLASH = 191;

            Keyboard.SPACE = 32;

            Keyboard.STOP = 0x01000009;

            Keyboard.SUBTITLE = 0x01000018;

            Keyboard.T = 84;

            Keyboard.TAB = 9;

            Keyboard.U = 85;

            Keyboard.UP = 38;

            Keyboard.V = 86;

            Keyboard.VOD = 0x0100001A;

            Keyboard.W = 87;

            Keyboard.X = 88;

            Keyboard.Y = 89;

            Keyboard.YELLOW = 0x01000002;

            Keyboard.Z = 90;
            return Keyboard;
        })();
        ui.Keyboard = Keyboard;
    })(away.ui || (away.ui = {}));
    var ui = away.ui;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        var RTTBufferManager = (function (_super) {
            __extends(RTTBufferManager, _super);
            function RTTBufferManager(se, stageGLProxy) {
                _super.call(this);
                this._viewWidth = -1;
                this._viewHeight = -1;
                this._textureWidth = -1;
                this._textureHeight = -1;
                this._buffersInvalid = true;

                if (!se) {
                    throw new Error("No cheating the multiton!");
                }

                this._renderToTextureRect = new away.geom.Rectangle();

                this._stageGLProxy = stageGLProxy;
            }
            RTTBufferManager.getInstance = function (stageGLProxy) {
                if (!stageGLProxy)
                    throw new Error("stageGLProxy key cannot be null!");

                if (RTTBufferManager._instances == null) {
                    RTTBufferManager._instances = new Array();
                }

                var rttBufferManager = RTTBufferManager.getRTTBufferManagerFromStageGLProxy(stageGLProxy);

                if (rttBufferManager == null) {
                    rttBufferManager = new away.managers.RTTBufferManager(new SingletonEnforcer(), stageGLProxy);

                    var vo = new RTTBufferManagerVO();

                    vo.stage3dProxy = stageGLProxy;
                    vo.rttbfm = rttBufferManager;

                    RTTBufferManager._instances.push(vo);
                }

                return rttBufferManager;
            };

            RTTBufferManager.getRTTBufferManagerFromStageGLProxy = function (stageGLProxy) {
                var l = RTTBufferManager._instances.length;
                var r;

                for (var c = 0; c < l; c++) {
                    r = RTTBufferManager._instances[c];

                    if (r.stage3dProxy === stageGLProxy) {
                        return r.rttbfm;
                    }
                }

                return null;
            };

            RTTBufferManager.deleteRTTBufferManager = function (stageGLProxy) {
                var l = RTTBufferManager._instances.length;
                var r;

                for (var c = 0; c < l; c++) {
                    r = RTTBufferManager._instances[c];

                    if (r.stage3dProxy === stageGLProxy) {
                        RTTBufferManager._instances.splice(c, 1);
                        return;
                    }
                }
            };

            Object.defineProperty(RTTBufferManager.prototype, "textureRatioX", {
                get: function () {
                    if (this._buffersInvalid) {
                        this.updateRTTBuffers();
                    }

                    return this._textureRatioX;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "textureRatioY", {
                get: function () {
                    if (this._buffersInvalid) {
                        this.updateRTTBuffers();
                    }

                    return this._textureRatioY;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "viewWidth", {
                get: function () {
                    return this._viewWidth;
                },
                set: function (value) {
                    if (value == this._viewWidth) {
                        return;
                    }

                    this._viewWidth = value;

                    this._buffersInvalid = true;

                    this._textureWidth = away.utils.TextureUtils.getBestPowerOf2(this._viewWidth);

                    if (this._textureWidth > this._viewWidth) {
                        this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth) * .5);
                        this._renderToTextureRect.width = this._viewWidth;
                    } else {
                        this._renderToTextureRect.x = 0;
                        this._renderToTextureRect.width = this._textureWidth;
                    }

                    this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(RTTBufferManager.prototype, "viewHeight", {
                get: function () {
                    return this._viewHeight;
                },
                set: function (value) {
                    if (value == this._viewHeight) {
                        return;
                    }

                    this._viewHeight = value;

                    this._buffersInvalid = true;

                    this._textureHeight = away.utils.TextureUtils.getBestPowerOf2(this._viewHeight);

                    if (this._textureHeight > this._viewHeight) {
                        this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight) * .5);
                        this._renderToTextureRect.height = this._viewHeight;
                    } else {
                        this._renderToTextureRect.y = 0;
                        this._renderToTextureRect.height = this._textureHeight;
                    }

                    this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(RTTBufferManager.prototype, "renderToTextureVertexBuffer", {
                get: function () {
                    if (this._buffersInvalid) {
                        this.updateRTTBuffers();
                    }

                    return this._renderToTextureVertexBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "renderToScreenVertexBuffer", {
                get: function () {
                    if (this._buffersInvalid) {
                        this.updateRTTBuffers();
                    }

                    return this._renderToScreenVertexBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "indexBuffer", {
                get: function () {
                    return this._indexBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "renderToTextureRect", {
                get: function () {
                    if (this._buffersInvalid) {
                        this.updateRTTBuffers();
                    }

                    return this._renderToTextureRect;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "textureWidth", {
                get: function () {
                    return this._textureWidth;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RTTBufferManager.prototype, "textureHeight", {
                get: function () {
                    return this._textureHeight;
                },
                enumerable: true,
                configurable: true
            });

            RTTBufferManager.prototype.dispose = function () {
                RTTBufferManager.deleteRTTBufferManager(this._stageGLProxy);

                if (this._indexBuffer) {
                    this._indexBuffer.dispose();
                    this._renderToScreenVertexBuffer.dispose();
                    this._renderToTextureVertexBuffer.dispose();
                    this._renderToScreenVertexBuffer = null;
                    this._renderToTextureVertexBuffer = null;
                    this._indexBuffer = null;
                }
            };

            // todo: place all this in a separate model, since it's used all over the place
            // maybe it even has a place in the core (together with screenRect etc)?
            // needs to be stored per view of course
            RTTBufferManager.prototype.updateRTTBuffers = function () {
                var context = this._stageGLProxy._iContextGL;
                var textureVerts;
                var screenVerts;

                var x;
                var y;

                if (this._renderToTextureVertexBuffer == null) {
                    this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 5);
                }

                if (this._renderToScreenVertexBuffer == null) {
                    this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 5);
                }

                if (!this._indexBuffer) {
                    this._indexBuffer = context.createIndexBuffer(6);

                    this._indexBuffer.uploadFromArray([2, 1, 0, 3, 2, 0], 0, 6);
                }

                this._textureRatioX = x = Math.min(this._viewWidth / this._textureWidth, 1);
                this._textureRatioY = y = Math.min(this._viewHeight / this._textureHeight, 1);

                var u1 = (1 - x) * .5;
                var u2 = (x + 1) * .5;
                var v1 = (y + 1) * .5;
                var v2 = (1 - y) * .5;

                // last element contains indices for data per vertex that can be passed to the vertex shader if necessary (ie: frustum corners for deferred rendering)
                textureVerts = [-x, -y, u1, v1, 0, x, -y, u2, v1, 1, x, y, u2, v2, 2, -x, y, u1, v2, 3];

                screenVerts = [-1, -1, u1, v1, 0, 1, -1, u2, v1, 1, 1, 1, u2, v2, 2, -1, 1, u1, v2, 3];

                this._renderToTextureVertexBuffer.uploadFromArray(textureVerts, 0, 4);
                this._renderToScreenVertexBuffer.uploadFromArray(screenVerts, 0, 4);

                this._buffersInvalid = false;
            };
            return RTTBufferManager;
        })(away.events.EventDispatcher);
        managers.RTTBufferManager = RTTBufferManager;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));

var RTTBufferManagerVO = (function () {
    function RTTBufferManagerVO() {
    }
    return RTTBufferManagerVO;
})();

var SingletonEnforcer = (function () {
    function SingletonEnforcer() {
    }
    return SingletonEnforcer;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        //import away.arcane;
        //import away.debug.Debug;
        //import away.events.StageGLEvent;
        //import flash.display.Shape;
        //import flash.display.StageGL;
        //import flash.displayGL.ContextGL;
        //import flash.displayGL.ContextGLClearMask;
        //import flash.displayGL.ContextGLRenderMode;
        //import flash.displayGL.Program;
        //import flash.displayGL.textures.TextureBase;
        //import flash.events.Event;
        //import flash.events.EventDispatcher;
        //import flash.geom.Rectangle;
        //use namespace arcane;
        //[Event(name="enterFrame", type="flash.events.Event")]
        //[Event(name="exitFrame", type="flash.events.Event")]
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
        var StageGLProxy = (function (_super) {
            __extends(StageGLProxy, _super);
            /**
            * Creates a StageGLProxy object. This method should not be called directly. Creation of StageGLProxy objects should
            * be handled by StageGLManager.
            * @param stageGLIndex The index of the StageGL to be proxied.
            * @param stageGL The StageGL to be proxied.
            * @param stageGLManager
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            */
            function StageGLProxy(stageGLIndex, stageGL, stageGLManager, forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                _super.call(this);
                this._iStageGLIndex = -1;
                this._antiAlias = 0;
                //private var _activeVertexBuffers : Vector.<VertexBuffer> = new Vector.<VertexBuffer>(8, true);
                //private var _activeTextures : Vector.<TextureBase> = new Vector.<TextureBase>(8, true);
                this._renderTarget = null;
                this._renderSurfaceSelector = 0;

                this._iStageGLIndex = stageGLIndex;
                this._stageGL = stageGL;

                this._stageGL.x = 0;
                this._stageGL.y = 0;
                this._stageGL.visible = true;
                this._stageGLManager = stageGLManager;
                this._viewPort = new away.geom.Rectangle();
                this._enableDepthAndStencil = true;

                // whatever happens, be sure this has highest priority
                this._stageGL.addEventListener(away.events.Event.CONTEXTGL_CREATE, this.onContextGLUpdate, this); //, false, 1000, false);
                this.requestContext(forceSoftware, this.profile);
            }
            //private _mouse3DManager:away.managers.Mouse3DManager;
            //private _touch3DManager:Touch3DManager; //TODO: imeplement dependency Touch3DManager
            StageGLProxy.prototype.notifyViewportUpdated = function () {
                if (this._viewportDirty) {
                    return;
                }

                this._viewportDirty = true;

                //if (!this.hasEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED))
                //return;
                //if (!_viewportUpdated)
                this._viewportUpdated = new away.events.StageGLEvent(away.events.StageGLEvent.VIEWPORT_UPDATED);
                this.dispatchEvent(this._viewportUpdated);
            };

            StageGLProxy.prototype.notifyEnterFrame = function () {
                //if (!hasEventListener(Event.ENTER_FRAME))
                //return;
                if (!this._enterFrame) {
                    this._enterFrame = new away.events.Event(away.events.Event.ENTER_FRAME);
                }

                this.dispatchEvent(this._enterFrame);
            };

            StageGLProxy.prototype.notifyExitFrame = function () {
                //if (!hasEventListener(Event.EXIT_FRAME))
                //return;
                if (!this._exitFrame)
                    this._exitFrame = new away.events.Event(away.events.Event.EXIT_FRAME);

                this.dispatchEvent(this._exitFrame);
            };

            Object.defineProperty(StageGLProxy.prototype, "profile", {
                get: function () {
                    return this._profile;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Disposes the StageGLProxy object, freeing the ContextGL attached to the StageGL.
            */
            StageGLProxy.prototype.dispose = function () {
                this._stageGLManager.iRemoveStageGLProxy(this);
                this._stageGL.removeEventListener(away.events.Event.CONTEXTGL_CREATE, this.onContextGLUpdate, this);
                this.freeContextGL();
                this._stageGL = null;
                this._stageGLManager = null;
                this._iStageGLIndex = -1;
            };

            /**
            * Configures the back buffer associated with the StageGL object.
            * @param backBufferWidth The width of the backbuffer.
            * @param backBufferHeight The height of the backbuffer.
            * @param antiAlias The amount of anti-aliasing to use.
            * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
            */
            StageGLProxy.prototype.configureBackBuffer = function (backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil) {
                var oldWidth = this._backBufferWidth;
                var oldHeight = this._backBufferHeight;

                this._backBufferWidth = this._viewPort.width = backBufferWidth;
                this._backBufferHeight = this._viewPort.height = backBufferHeight;

                if (oldWidth != this._backBufferWidth || oldHeight != this._backBufferHeight)
                    this.notifyViewportUpdated();

                this._antiAlias = antiAlias;
                this._enableDepthAndStencil = enableDepthAndStencil;

                if (this._iContextGL)
                    this._iContextGL.configureBackBuffer(backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil);

                this._stageGL.width = backBufferWidth;
                this._stageGL.height = backBufferHeight;
            };

            Object.defineProperty(StageGLProxy.prototype, "enableDepthAndStencil", {
                /*
                * Indicates whether the depth and stencil buffer is used
                */
                get: function () {
                    return this._enableDepthAndStencil;
                },
                set: function (enableDepthAndStencil) {
                    this._enableDepthAndStencil = enableDepthAndStencil;
                    this._backBufferDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "renderTarget", {
                get: function () {
                    return this._renderTarget;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "renderSurfaceSelector", {
                get: function () {
                    return this._renderSurfaceSelector;
                },
                enumerable: true,
                configurable: true
            });

            StageGLProxy.prototype.setRenderTarget = function (target, enableDepthAndStencil, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                if (this._renderTarget === target && surfaceSelector == this._renderSurfaceSelector && this._enableDepthAndStencil == enableDepthAndStencil) {
                    return;
                }

                this._renderTarget = target;
                this._renderSurfaceSelector = surfaceSelector;
                this._enableDepthAndStencil = enableDepthAndStencil;

                if (target) {
                    this._iContextGL.setRenderToTexture(target, enableDepthAndStencil, this._antiAlias, surfaceSelector);
                } else {
                    this._iContextGL.setRenderToBackBuffer();
                    this.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);
                }
            };

            /*
            * Clear and reset the back buffer when using a shared context
            */
            StageGLProxy.prototype.clear = function () {
                if (!this._iContextGL)
                    return;

                if (this._backBufferDirty) {
                    this.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);
                    this._backBufferDirty = false;
                }

                this._iContextGL.clear((this._color & 0xff000000) >>> 24, (this._color & 0xff0000) >>> 16, (this._color & 0xff00) >>> 8, this._color & 0xff);

                this._bufferClear = true;
            };

            /*
            * Display the back rendering buffer
            */
            StageGLProxy.prototype.present = function () {
                if (!this._iContextGL)
                    return;

                this._iContextGL.present();

                this._activeProgram = null;
                //if (this._mouse3DManager)
                //	this._mouse3DManager.fireMouseEvents();
            };

            /**
            * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event. Special case for enterframe and exitframe events - will switch StageGLProxy into automatic render mode.
            * You can register event listeners on all nodes in the display list for a specific type of event, phase, and priority.
            *
            * @param type The type of event.
            * @param listener The listener function that processes the event.
            * @param useCapture Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false.
            * @param priority The priority level of the event listener. The priority is designated by a signed 32-bit integer. The higher the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they are processed in the order in which they were added. The default priority is 0.
            * @param useWeakReference Determines whether the reference to the listener is strong or weak. A strong reference (the default) prevents your listener from being garbage-collected. A weak reference does not.
            */
            //public override function addEventListener(type:string, listener, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false)
            StageGLProxy.prototype.addEventListener = function (type, listener, target) {
                _super.prototype.addEventListener.call(this, type, listener, target); //useCapture, priority, useWeakReference);
                //away.Debug.throwPIR( 'StageGLProxy' , 'addEventListener' ,  'EnterFrame, ExitFrame');
                //if ((type == away.events.Event.ENTER_FRAME || type == away.events.Event.EXIT_FRAME) ){//&& ! this._frameEventDriver.hasEventListener(Event.ENTER_FRAME)){
                //_frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);
                //}
                /* Original code
                if ((type == Event.ENTER_FRAME || type == Event.EXIT_FRAME) && ! _frameEventDriver.hasEventListener(Event.ENTER_FRAME)){
                
                _frameEventDriver.addEventListener(Event.ENTER_FRAME, onEnterFrame, useCapture, priority, useWeakReference);
                
                
                }
                */
            };

            /**
            * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch StageGLProxy out of automatic render mode.
            * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
            *
            * @param type The type of event.
            * @param listener The listener object to remove.
            * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
            */
            StageGLProxy.prototype.removeEventListener = function (type, listener, target) {
                _super.prototype.removeEventListener.call(this, type, listener, target);
                //away.Debug.throwPIR( 'StageGLProxy' , 'removeEventListener' ,  'EnterFrame, ExitFrame');
                /*
                // Remove the main rendering listener if no EnterFrame listeners remain
                if (    ! this.hasEventListener(away.events.Event.ENTER_FRAME , this.onEnterFrame , this )
                &&  ! this.hasEventListener(away.events.Event.EXIT_FRAME , this.onEnterFrame , this) ) //&& _frameEventDriver.hasEventListener(Event.ENTER_FRAME))
                {
                
                //_frameEventDriver.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame, this );
                
                }
                */
            };

            Object.defineProperty(StageGLProxy.prototype, "scissorRect", {
                get: function () {
                    return this._scissorRect;
                },
                set: function (value) {
                    this._scissorRect = value;
                    this._iContextGL.setScissorRectangle(this._scissorRect);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "stageGLIndex", {
                /**
                * The index of the StageGL which is managed by this instance of StageGLProxy.
                */
                get: function () {
                    return this._iStageGLIndex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "stageGL", {
                /**
                * The base StageGL object associated with this proxy.
                */
                get: function () {
                    return this._stageGL;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "contextGL", {
                /**
                * The ContextGL object associated with the given StageGL object.
                */
                get: function () {
                    return this._iContextGL;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "usesSoftwareRendering", {
                /**
                * Indicates whether the StageGL managed by this proxy is running in software mode.
                * Remember to wait for the CONTEXTGL_CREATED event before checking this property,
                * as only then will it be guaranteed to be accurate.
                */
                get: function () {
                    return this._usesSoftwareRendering;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "x", {
                /**
                * The x position of the StageGL.
                */
                get: function () {
                    return this._stageGL.x;
                },
                set: function (value) {
                    if (this._viewPort.x == value)
                        return;

                    this._stageGL.x = this._viewPort.x = value;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "y", {
                /**
                * The y position of the StageGL.
                */
                get: function () {
                    return this._stageGL.y;
                },
                set: function (value) {
                    if (this._viewPort.y == value)
                        return;

                    this._stageGL.y = this._viewPort.y = value;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "canvas", {
                /**
                *
                * @returns {HTMLCanvasElement}
                */
                get: function () {
                    return this._stageGL.canvas;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "width", {
                /**
                * The width of the StageGL.
                */
                get: function () {
                    return this._backBufferWidth;
                },
                set: function (width) {
                    if (this._viewPort.width == width)
                        return;

                    this._stageGL.width = this._backBufferWidth = this._viewPort.width = width;
                    this._backBufferDirty = true;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "height", {
                /**
                * The height of the StageGL.
                */
                get: function () {
                    return this._backBufferHeight;
                },
                set: function (height) {
                    if (this._viewPort.height == height)
                        return;

                    this._stageGL.height = this._backBufferHeight = this._viewPort.height = height;
                    this._backBufferDirty = true;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "antiAlias", {
                /**
                * The antiAliasing of the StageGL.
                */
                get: function () {
                    return this._antiAlias;
                },
                set: function (antiAlias) {
                    this._antiAlias = antiAlias;
                    this._backBufferDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "viewPort", {
                /**
                * A viewPort rectangle equivalent of the StageGL size and position.
                */
                get: function () {
                    this._viewportDirty = false;

                    return this._viewPort;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLProxy.prototype, "color", {
                /**
                * The background color of the StageGL.
                */
                get: function () {
                    return this._color;
                },
                set: function (color) {
                    this._color = color;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "visible", {
                /**
                * The visibility of the StageGL.
                */
                get: function () {
                    return this._stageGL.visible;
                },
                set: function (value) {
                    this._stageGL.visible = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(StageGLProxy.prototype, "bufferClear", {
                /**
                * The freshly cleared state of the backbuffer before any rendering
                */
                get: function () {
                    return this._bufferClear;
                },
                set: function (newBufferClear) {
                    this._bufferClear = newBufferClear;
                },
                enumerable: true,
                configurable: true
            });


            /*
            * Access to fire mouseevents across multiple layered view3D instances
            */
            //		public get mouse3DManager():Mouse3DManager
            //		{
            //			return this._mouse3DManager;
            //		}
            //
            //		public set mouse3DManager(value:Mouse3DManager)
            //		{
            //			this._mouse3DManager = value;
            //		}
            /* TODO: implement dependency Touch3DManager
            public get touch3DManager():Touch3DManager
            {
            return _touch3DManager;
            }
            
            public set touch3DManager(value:Touch3DManager)
            {
            _touch3DManager = value;
            }
            */
            /**
            * Frees the ContextGL associated with this StageGLProxy.
            */
            StageGLProxy.prototype.freeContextGL = function () {
                if (this._iContextGL) {
                    this._iContextGL.dispose();
                    this.dispatchEvent(new away.events.StageGLEvent(away.events.StageGLEvent.CONTEXTGL_DISPOSED));
                }

                this._iContextGL = null;
            };

            /*
            * Called whenever the ContextGL is retrieved or lost.
            * @param event The event dispatched.
            */
            StageGLProxy.prototype.onContextGLUpdate = function (event) {
                if (this._stageGL.contextGL) {
                    var hadContext = (this._iContextGL != null);
                    this._iContextGL = this._stageGL.contextGL;

                    // Only configure back buffer if width and height have been set,
                    // which they may not have been if View3D.render() has yet to be
                    // invoked for the first time.
                    if (this._backBufferWidth && this._backBufferHeight) {
                        this._iContextGL.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);
                    }

                    // Dispatch the appropriate event depending on whether context was
                    // created for the first time or recreated after a device loss.
                    this.dispatchEvent(new away.events.StageGLEvent(hadContext ? away.events.StageGLEvent.CONTEXTGL_RECREATED : away.events.StageGLEvent.CONTEXTGL_CREATED));
                } else {
                    throw new Error("Rendering context lost!");
                }
            };

            /**
            * Requests a ContextGL object to attach to the managed StageGL.
            */
            StageGLProxy.prototype.requestContext = function (forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                // If forcing software, we can be certain that the
                // returned ContextGL will be running software mode.
                // If not, we can't be sure and should stick to the
                // old value (will likely be same if re-requesting.)
                if (this._usesSoftwareRendering != null) {
                    this._usesSoftwareRendering = forceSoftware;
                }

                this._profile = profile;

                // Updated to work with current JS <> AS3 DisplayGL System
                this._stageGL.requestContext(true);
            };

            /**
            * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
            * Typically the proxy.ENTER_FRAME listener would render the layers for this StageGL instance.
            */
            StageGLProxy.prototype.onEnterFrame = function (event) {
                if (!this._iContextGL) {
                    return;
                }

                // Clear the stageGL instance
                this.clear();

                //notify the enterframe listeners
                this.notifyEnterFrame();

                // Call the present() to render the frame
                this.present();

                //notify the exitframe listeners
                this.notifyExitFrame();
            };

            StageGLProxy.prototype.recoverFromDisposal = function () {
                if (!this._iContextGL) {
                    return false;
                }

                //away.Debug.throwPIR( 'StageGLProxy' , 'recoverFromDisposal' , '' );
                /*
                if (this._iContextGL.driverInfo == "Disposed")
                {
                this._iContextGL = null;
                this.dispatchEvent(new away.events.StageGLEvent(away.events.StageGLEvent.CONTEXTGL_DISPOSED));
                return false;
                
                }
                */
                return true;
            };

            StageGLProxy.prototype.clearDepthBuffer = function () {
                if (!this._iContextGL) {
                    return;
                }

                this._iContextGL.clear(0, 0, 0, 1, 1, 0, away.displayGL.ContextGLClearMask.DEPTH);
            };
            return StageGLProxy;
        })(away.events.EventDispatcher);
        managers.StageGLProxy = StageGLProxy;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (managers) {
        //import away.arcane;
        //import flash.display.Stage;
        //import flash.utils.Dictionary;
        //use namespace arcane;
        /**
        * The StageGLManager class provides a multiton object that handles management for StageGL objects. StageGL objects
        * should not be requested directly, but are exposed by a StageGLProxy.
        *
        * @see away.core.managers.StageGLProxy
        */
        var StageGLManager = (function () {
            /**
            * Creates a new StageGLManager class.
            * @param stage The Stage object that contains the StageGL objects to be managed.
            * @private
            */
            function StageGLManager(stage, StageGLManagerSingletonEnforcer) {
                if (!StageGLManagerSingletonEnforcer) {
                    throw new Error("This class is a multiton and cannot be instantiated manually. Use StageGLManager.getInstance instead.");
                }

                this._stage = stage;

                if (!StageGLManager._stageProxies) {
                    StageGLManager._stageProxies = new Array(this._stage.stageGLs.length); //, true);
                }
            }
            /**
            * Gets a StageGLManager instance for the given Stage object.
            * @param stage The Stage object that contains the StageGL objects to be managed.
            * @return The StageGLManager instance for the given Stage object.
            */
            StageGLManager.getInstance = function (stage) {
                var stage3dManager = StageGLManager.getStageGLManagerByStageRef(stage);

                if (stage3dManager == null) {
                    stage3dManager = new away.managers.StageGLManager(stage, new StageGLManagerSingletonEnforcer());

                    var stageInstanceData = new StageGLManagerInstanceData();
                    stageInstanceData.stage = stage;
                    stageInstanceData.stageGLManager = stage3dManager;

                    StageGLManager._instances.push(stageInstanceData);
                }

                return stage3dManager;
            };

            /**
            *
            * @param stage
            * @returns {  away.managers.StageGLManager }
            * @constructor
            */
            StageGLManager.getStageGLManagerByStageRef = function (stage) {
                if (StageGLManager._instances == null) {
                    StageGLManager._instances = new Array();
                }

                var l = StageGLManager._instances.length;
                var s;

                for (var c = 0; c < l; c++) {
                    s = StageGLManager._instances[c];

                    if (s.stage == stage) {
                        return s.stageGLManager;
                    }
                }

                return null;
            };

            /**
            * Requests the StageGLProxy for the given index.
            * @param index The index of the requested StageGL.
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            * @param profile The compatibility profile, an enumeration of ContextGLProfile
            * @return The StageGLProxy for the given index.
            */
            StageGLManager.prototype.getStageGLProxy = function (index, forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                if (!StageGLManager._stageProxies[index]) {
                    StageGLManager._numStageProxies++;
                    StageGLManager._stageProxies[index] = new away.managers.StageGLProxy(index, this._stage.stageGLs[index], this, forceSoftware, profile);
                }

                return StageGLManager._stageProxies[index];
            };

            /**
            * Removes a StageGLProxy from the manager.
            * @param stageGLProxy
            * @private
            */
            StageGLManager.prototype.iRemoveStageGLProxy = function (stageGLProxy) {
                StageGLManager._numStageProxies--;
                StageGLManager._stageProxies[stageGLProxy._iStageGLIndex] = null;
            };

            /**
            * Get the next available stageGLProxy. An error is thrown if there are no StageGLProxies available
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            * @param profile The compatibility profile, an enumeration of ContextGLProfile
            * @return The allocated stageGLProxy
            */
            StageGLManager.prototype.getFreeStageGLProxy = function (forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                var i = 0;
                var len = StageGLManager._stageProxies.length;

                while (i < len) {
                    if (!StageGLManager._stageProxies[i]) {
                        this.getStageGLProxy(i, forceSoftware, profile);

                        StageGLManager._stageProxies[i].width = this._stage.stageWidth;
                        StageGLManager._stageProxies[i].height = this._stage.stageHeight;

                        return StageGLManager._stageProxies[i];
                    }

                    ++i;
                }

                throw new Error("Too many StageGL instances used!");
                return null;
            };

            Object.defineProperty(StageGLManager.prototype, "hasFreeStageGLProxy", {
                /**
                * Checks if a new stageGLProxy can be created and managed by the class.
                * @return true if there is one slot free for a new stageGLProxy
                */
                get: function () {
                    return StageGLManager._numStageProxies < StageGLManager._stageProxies.length ? true : false;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLManager.prototype, "numProxySlotsFree", {
                /**
                * Returns the amount of stageGLProxy objects that can be created and managed by the class
                * @return the amount of free slots
                */
                get: function () {
                    return StageGLManager._stageProxies.length - StageGLManager._numStageProxies;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLManager.prototype, "numProxySlotsUsed", {
                /**
                * Returns the amount of StageGLProxy objects currently managed by the class.
                * @return the amount of slots used
                */
                get: function () {
                    return StageGLManager._numStageProxies;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(StageGLManager.prototype, "numProxySlotsTotal", {
                /**
                * Returns the maximum amount of StageGLProxy objects that can be managed by the class
                * @return the maximum amount of StageGLProxy objects that can be managed by the class
                */
                get: function () {
                    return StageGLManager._stageProxies.length;
                },
                enumerable: true,
                configurable: true
            });
            StageGLManager._numStageProxies = 0;
            return StageGLManager;
        })();
        managers.StageGLManager = StageGLManager;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));

var StageGLManagerInstanceData = (function () {
    function StageGLManagerInstanceData() {
    }
    return StageGLManagerInstanceData;
})();

var StageGLManagerSingletonEnforcer = (function () {
    function StageGLManagerSingletonEnforcer() {
    }
    return StageGLManagerSingletonEnforcer;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var TextureProxyBase = (function (_super) {
            __extends(TextureProxyBase, _super);
            function TextureProxyBase() {
                _super.call(this);
                this._format = away.displayGL.ContextGLTextureFormat.BGRA;
                this._hasMipmaps = false;

                this._textures = new Array(8); //_textures = new Vector.<TextureBase>(8);
                this._dirty = new Array(8); //_dirty = new Vector.<ContextGL>(8);
            }
            Object.defineProperty(TextureProxyBase.prototype, "hasMipMaps", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this._hasMipmaps;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "format", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this._format;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "assetType", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return away.library.AssetType.TEXTURE;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "width", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._pWidth;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "height", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._pHeight;
                },
                enumerable: true,
                configurable: true
            });

            TextureProxyBase.prototype.getTextureForStageGL = function (stageGLProxy) {
                var contextIndex = stageGLProxy._iStageGLIndex;

                var tex = this._textures[contextIndex];

                var context = stageGLProxy._iContextGL;

                if (!tex || this._dirty[contextIndex] != context) {
                    this._textures[contextIndex] = tex = this.pCreateTexture(context);
                    this._dirty[contextIndex] = context;
                    this.pUploadContent(tex); //_pUploadContent
                }

                return tex;
            };

            /**
            *
            * @param texture
            * @private
            */
            TextureProxyBase.prototype.pUploadContent = function (texture) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            *
            * @param width
            * @param height
            * @private
            */
            TextureProxyBase.prototype.pSetSize = function (width, height) {
                if (this._pWidth != width || this._pHeight != height) {
                    this.pInvalidateSize();
                }

                this._pWidth = width;
                this._pHeight = height;
            };

            /**
            *
            */
            TextureProxyBase.prototype.invalidateContent = function () {
                for (var i = 0; i < 8; ++i) {
                    this._dirty[i] = null;
                }
            };

            /**
            *
            * @private
            */
            TextureProxyBase.prototype.pInvalidateSize = function () {
                var tex;
                for (var i = 0; i < 8; ++i) {
                    tex = this._textures[i];

                    if (tex) {
                        tex.dispose();

                        this._textures[i] = null;
                        this._dirty[i] = null;
                    }
                }
            };

            /**
            *
            * @param context
            * @private
            */
            TextureProxyBase.prototype.pCreateTexture = function (context) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            * @inheritDoc
            */
            TextureProxyBase.prototype.dispose = function () {
                for (var i = 0; i < 8; ++i) {
                    if (this._textures[i]) {
                        this._textures[i].dispose();
                    }
                }
            };
            return TextureProxyBase;
        })(away.library.NamedAssetBase);
        textures.TextureProxyBase = TextureProxyBase;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        //use namespace arcane;
        var Texture2DBase = (function (_super) {
            __extends(Texture2DBase, _super);
            function Texture2DBase() {
                _super.call(this);
            }
            Texture2DBase.prototype.pCreateTexture = function (context) {
                return context.createTexture(this.width, this.height, away.displayGL.ContextGLTextureFormat.BGRA, false);
            };
            return Texture2DBase;
        })(away.textures.TextureProxyBase);
        textures.Texture2DBase = Texture2DBase;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var HTMLImageElementTexture = (function (_super) {
            __extends(HTMLImageElementTexture, _super);
            function HTMLImageElementTexture(htmlImageElement, generateMipmaps) {
                if (typeof generateMipmaps === "undefined") { generateMipmaps = true; }
                _super.call(this);

                this._htmlImageElement = htmlImageElement;
                this._generateMipmaps = generateMipmaps;
            }
            Object.defineProperty(HTMLImageElementTexture.prototype, "htmlImageElement", {
                get: function () {
                    return this._htmlImageElement;
                },
                set: function (value) {
                    if (value == this._htmlImageElement) {
                        return;
                    }

                    if (!away.utils.TextureUtils.isHTMLImageElementValid(value)) {
                        throw new away.errors.Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
                    }

                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._htmlImageElement = value;

                    if (this._generateMipmaps) {
                        this.getMipMapHolder();
                    }
                },
                enumerable: true,
                configurable: true
            });


            HTMLImageElementTexture.prototype.pUploadContent = function (texture) {
                if (this._generateMipmaps) {
                    away.textures.MipmapGenerator.generateHTMLImageElementMipMaps(this._htmlImageElement, texture, this._mipMapHolder, true);
                } else {
                    var tx = texture;
                    tx.uploadFromHTMLImageElement(this._htmlImageElement, 0);
                }
            };

            HTMLImageElementTexture.prototype.getMipMapHolder = function () {
                var newW = this._htmlImageElement.width;
                var newH = this._htmlImageElement.height;

                if (this._mipMapHolder) {
                    if (this._mipMapHolder.width == newW && this._htmlImageElement.height == newH) {
                        return;
                    }

                    this.freeMipMapHolder();
                }

                if (!HTMLImageElementTexture._mipMaps[newW]) {
                    HTMLImageElementTexture._mipMaps[newW] = [];
                    HTMLImageElementTexture._mipMapUses[newW] = [];
                }

                if (!HTMLImageElementTexture._mipMaps[newW][newH]) {
                    this._mipMapHolder = HTMLImageElementTexture._mipMaps[newW][newH] = new away.display.BitmapData(newW, newH, true);
                    HTMLImageElementTexture._mipMapUses[newW][newH] = 1;
                } else {
                    HTMLImageElementTexture._mipMapUses[newW][newH] = HTMLImageElementTexture._mipMapUses[newW][newH] + 1;
                    this._mipMapHolder = HTMLImageElementTexture._mipMaps[newW][newH];
                }
            };

            HTMLImageElementTexture.prototype.freeMipMapHolder = function () {
                var holderWidth = this._mipMapHolder.width;
                var holderHeight = this._mipMapHolder.height;

                if (--HTMLImageElementTexture._mipMapUses[holderWidth][holderHeight] == 0) {
                    HTMLImageElementTexture._mipMaps[holderWidth][holderHeight].dispose();
                    HTMLImageElementTexture._mipMaps[holderWidth][holderHeight] = null;
                }
            };

            HTMLImageElementTexture.prototype.dispose = function () {
                _super.prototype.dispose.call(this);

                if (this._mipMapHolder) {
                    this.freeMipMapHolder();
                }
            };
            HTMLImageElementTexture._mipMaps = [];
            HTMLImageElementTexture._mipMapUses = [];
            return HTMLImageElementTexture;
        })(away.textures.Texture2DBase);
        textures.HTMLImageElementTexture = HTMLImageElementTexture;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var BitmapTexture = (function (_super) {
            __extends(BitmapTexture, _super);
            function BitmapTexture(bitmapData, generateMipmaps) {
                if (typeof generateMipmaps === "undefined") { generateMipmaps = true; }
                _super.call(this);

                this.bitmapData = bitmapData;
                this._generateMipmaps = generateMipmaps;
            }
            Object.defineProperty(BitmapTexture.prototype, "bitmapData", {
                get: function () {
                    return this._bitmapData;
                },
                set: function (value) {
                    if (value == this._bitmapData) {
                        return;
                    }

                    if (!away.utils.TextureUtils.isBitmapDataValid(value)) {
                        throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
                    }

                    this.invalidateContent();

                    this.pSetSize(value.width, value.height);

                    this._bitmapData = value;

                    if (this._generateMipmaps) {
                        this.getMipMapHolder();
                    }
                },
                enumerable: true,
                configurable: true
            });


            BitmapTexture.prototype.pUploadContent = function (texture) {
                if (this._generateMipmaps) {
                    away.textures.MipmapGenerator.generateMipMaps(this._bitmapData, texture, this._mipMapHolder, true);
                } else {
                    var tx = texture;
                    tx.uploadFromBitmapData(this._bitmapData, 0);
                }
            };

            BitmapTexture.prototype.getMipMapHolder = function () {
                var newW, newH;

                newW = this._bitmapData.width;
                newH = this._bitmapData.height;

                if (this._mipMapHolder) {
                    if (this._mipMapHolder.width == newW && this._bitmapData.height == newH) {
                        return;
                    }

                    this.freeMipMapHolder();
                }

                if (!BitmapTexture._mipMaps[newW]) {
                    BitmapTexture._mipMaps[newW] = [];
                    BitmapTexture._mipMapUses[newW] = [];
                }

                if (!BitmapTexture._mipMaps[newW][newH]) {
                    this._mipMapHolder = BitmapTexture._mipMaps[newW][newH] = new away.display.BitmapData(newW, newH, true);
                    BitmapTexture._mipMapUses[newW][newH] = 1;
                } else {
                    BitmapTexture._mipMapUses[newW][newH] = BitmapTexture._mipMapUses[newW][newH] + 1;
                    this._mipMapHolder = BitmapTexture._mipMaps[newW][newH];
                }
            };

            BitmapTexture.prototype.freeMipMapHolder = function () {
                var holderWidth = this._mipMapHolder.width;
                var holderHeight = this._mipMapHolder.height;

                if (--BitmapTexture._mipMapUses[holderWidth][holderHeight] == 0) {
                    BitmapTexture._mipMaps[holderWidth][holderHeight].dispose();
                    BitmapTexture._mipMaps[holderWidth][holderHeight] = null;
                }
            };

            BitmapTexture.prototype.dispose = function () {
                _super.prototype.dispose.call(this);

                if (this._mipMapHolder) {
                    this.freeMipMapHolder();
                }
            };
            BitmapTexture._mipMaps = [];
            BitmapTexture._mipMapUses = [];
            return BitmapTexture;
        })(away.textures.Texture2DBase);
        textures.BitmapTexture = BitmapTexture;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var CubeTextureBase = (function (_super) {
            __extends(CubeTextureBase, _super);
            function CubeTextureBase() {
                _super.call(this);
            }
            Object.defineProperty(CubeTextureBase.prototype, "size", {
                get: function () {
                    //TODO replace this with this._pWidth (requires change in super class to reflect the protected declaration)
                    return this.width;
                },
                enumerable: true,
                configurable: true
            });

            //@override
            CubeTextureBase.prototype.pCreateTexture = function (context) {
                return context.createCubeTexture(this.width, away.displayGL.ContextGLTextureFormat.BGRA, false);
            };
            return CubeTextureBase;
        })(away.textures.TextureProxyBase);
        textures.CubeTextureBase = CubeTextureBase;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var RenderTexture = (function (_super) {
            __extends(RenderTexture, _super);
            function RenderTexture(width, height) {
                _super.call(this);
                this.pSetSize(width, height);
            }
            Object.defineProperty(RenderTexture.prototype, "width", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._pWidth;
                },
                set: function (value) {
                    if (value == this._pWidth) {
                        return;
                    }

                    if (!away.utils.TextureUtils.isDimensionValid(value))
                        throw new Error("Invalid size: Width and height must be power of 2 and cannot exceed 2048");

                    this.invalidateContent();
                    this.pSetSize(value, this._pHeight);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(RenderTexture.prototype, "height", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this._pHeight;
                },
                set: function (value) {
                    if (value == this._pHeight) {
                        return;
                    }

                    if (!away.utils.TextureUtils.isDimensionValid(value)) {
                        throw new Error("Invalid size: Width and height must be power of 2 and cannot exceed 2048");
                    }

                    this.invalidateContent();
                    this.pSetSize(this._pWidth, value);
                },
                enumerable: true,
                configurable: true
            });


            RenderTexture.prototype.pUploadContent = function (texture) {
                // fake data, to complete texture for sampling
                var bmp = new away.display.BitmapData(this.width, this.height, false, 0xff0000);

                //(<away.displayGL.Texture> texture).uploadFromBitmapData(bmp, 0);
                //away.materials.MipmapGenerator.generateMipMaps(bmp, texture);
                texture.generateFromRenderBuffer(bmp);
                bmp.dispose();
            };

            RenderTexture.prototype.pCreateTexture = function (context) {
                return context.createTexture(this.width, this.height, away.displayGL.ContextGLTextureFormat.BGRA, true);
            };
            return RenderTexture;
        })(away.textures.Texture2DBase);
        textures.RenderTexture = RenderTexture;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var HTMLImageElementCubeTexture = (function (_super) {
            __extends(HTMLImageElementCubeTexture, _super);
            function HTMLImageElementCubeTexture(posX, negX, posY, negY, posZ, negZ) {
                _super.call(this);
                this._useMipMaps = false;

                this._bitmapDatas = new Array(6);
                this.testSize(this._bitmapDatas[0] = posX);
                this.testSize(this._bitmapDatas[1] = negX);
                this.testSize(this._bitmapDatas[2] = posY);
                this.testSize(this._bitmapDatas[3] = negY);
                this.testSize(this._bitmapDatas[4] = posZ);
                this.testSize(this._bitmapDatas[5] = negZ);

                this.pSetSize(posX.width, posX.height);
            }
            Object.defineProperty(HTMLImageElementCubeTexture.prototype, "positiveX", {
                /**
                * The texture on the cube's right face.
                */
                get: function () {
                    return this._bitmapDatas[0];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[0] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(HTMLImageElementCubeTexture.prototype, "negativeX", {
                /**
                * The texture on the cube's left face.
                */
                get: function () {
                    return this._bitmapDatas[1];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[1] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(HTMLImageElementCubeTexture.prototype, "positiveY", {
                /**
                * The texture on the cube's top face.
                */
                get: function () {
                    return this._bitmapDatas[2];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[2] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(HTMLImageElementCubeTexture.prototype, "negativeY", {
                /**
                * The texture on the cube's bottom face.
                */
                get: function () {
                    return this._bitmapDatas[3];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[3] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(HTMLImageElementCubeTexture.prototype, "positiveZ", {
                /**
                * The texture on the cube's far face.
                */
                get: function () {
                    return this._bitmapDatas[4];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[4] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(HTMLImageElementCubeTexture.prototype, "negativeZ", {
                /**
                * The texture on the cube's near face.
                */
                get: function () {
                    return this._bitmapDatas[5];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[5] = value;
                },
                enumerable: true,
                configurable: true
            });


            HTMLImageElementCubeTexture.prototype.testSize = function (value) {
                if (value.width != value.height)
                    throw new Error("BitmapData should have equal width and height!");
                if (!away.utils.TextureUtils.isHTMLImageElementValid(value))
                    throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
            };

            HTMLImageElementCubeTexture.prototype.pUploadContent = function (texture) {
                for (var i = 0; i < 6; ++i) {
                    if (this._useMipMaps) {
                        //away.materials.MipmapGenerator.generateMipMaps(this._bitmapDatas[i], texture, null, false, i);
                    } else {
                        var tx = texture;
                        tx.uploadFromHTMLImageElement(this._bitmapDatas[i], i, 0);
                    }
                }
            };
            return HTMLImageElementCubeTexture;
        })(away.textures.CubeTextureBase);
        textures.HTMLImageElementCubeTexture = HTMLImageElementCubeTexture;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        var BitmapCubeTexture = (function (_super) {
            __extends(BitmapCubeTexture, _super);
            function BitmapCubeTexture(posX, negX, posY, negY, posZ, negZ) {
                _super.call(this);
                this._useMipMaps = false;

                this._bitmapDatas = new Array(6);
                this.testSize(this._bitmapDatas[0] = posX);
                this.testSize(this._bitmapDatas[1] = negX);
                this.testSize(this._bitmapDatas[2] = posY);
                this.testSize(this._bitmapDatas[3] = negY);
                this.testSize(this._bitmapDatas[4] = posZ);
                this.testSize(this._bitmapDatas[5] = negZ);

                this.pSetSize(posX.width, posX.height);
            }
            Object.defineProperty(BitmapCubeTexture.prototype, "positiveX", {
                /**
                * The texture on the cube's right face.
                */
                get: function () {
                    return this._bitmapDatas[0];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[0] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapCubeTexture.prototype, "negativeX", {
                /**
                * The texture on the cube's left face.
                */
                get: function () {
                    return this._bitmapDatas[1];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[1] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapCubeTexture.prototype, "positiveY", {
                /**
                * The texture on the cube's top face.
                */
                get: function () {
                    return this._bitmapDatas[2];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[2] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapCubeTexture.prototype, "negativeY", {
                /**
                * The texture on the cube's bottom face.
                */
                get: function () {
                    return this._bitmapDatas[3];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[3] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapCubeTexture.prototype, "positiveZ", {
                /**
                * The texture on the cube's far face.
                */
                get: function () {
                    return this._bitmapDatas[4];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[4] = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapCubeTexture.prototype, "negativeZ", {
                /**
                * The texture on the cube's near face.
                */
                get: function () {
                    return this._bitmapDatas[5];
                },
                set: function (value) {
                    this.testSize(value);
                    this.invalidateContent();
                    this.pSetSize(value.width, value.height);
                    this._bitmapDatas[5] = value;
                },
                enumerable: true,
                configurable: true
            });


            BitmapCubeTexture.prototype.testSize = function (value) {
                if (value.width != value.height)
                    throw new Error("BitmapData should have equal width and height!");
                if (!away.utils.TextureUtils.isBitmapDataValid(value))
                    throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
            };

            BitmapCubeTexture.prototype.pUploadContent = function (texture) {
                for (var i = 0; i < 6; ++i) {
                    if (this._useMipMaps) {
                        //away.materials.MipmapGenerator.generateMipMaps(this._bitmapDatas[i], texture, null, false, i);
                    } else {
                        var tx = texture;
                        tx.uploadFromBitmapData(this._bitmapDatas[i], i, 0);
                    }
                }
            };
            return BitmapCubeTexture;
        })(away.textures.CubeTextureBase);
        textures.BitmapCubeTexture = BitmapCubeTexture;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (textures) {
        //import flash.display.*;
        //import flash.displayGL.textures.CubeTexture;
        //import flash.displayGL.textures.Texture;
        //import flash.displayGL.textures.TextureBase;
        //import flash.geom.*;
        /**
        * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
        */
        var MipmapGenerator = (function () {
            function MipmapGenerator() {
            }
            /**
            * Uploads a BitmapData with mip maps to a target Texture object.
            * @param source
            * @param target The target Texture to upload to.
            * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
            * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
            */
            MipmapGenerator.generateHTMLImageElementMipMaps = function (source, target, mipmap, alpha, side) {
                if (typeof mipmap === "undefined") { mipmap = null; }
                if (typeof alpha === "undefined") { alpha = false; }
                if (typeof side === "undefined") { side = -1; }
                MipmapGenerator._rect.width = source.width;
                MipmapGenerator._rect.height = source.height;

                MipmapGenerator._source = new away.display.BitmapData(source.width, source.height, alpha);
                MipmapGenerator._source.drawImage(source, MipmapGenerator._rect, MipmapGenerator._rect);

                MipmapGenerator.generateMipMaps(MipmapGenerator._source, target, mipmap);

                MipmapGenerator._source.dispose();
                MipmapGenerator._source = null;
            };

            /**
            * Uploads a BitmapData with mip maps to a target Texture object.
            * @param source The source BitmapData to upload.
            * @param target The target Texture to upload to.
            * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
            * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
            */
            MipmapGenerator.generateMipMaps = function (source, target, mipmap, alpha, side) {
                if (typeof mipmap === "undefined") { mipmap = null; }
                if (typeof alpha === "undefined") { alpha = false; }
                if (typeof side === "undefined") { side = -1; }
                var w = source.width;
                var h = source.height;
                var regen = mipmap != null;
                var i;

                if (!mipmap) {
                    mipmap = new away.display.BitmapData(w, h, alpha);
                }

                MipmapGenerator._rect.width = w;
                MipmapGenerator._rect.height = h;

                var tx;

                while (w >= 1 || h >= 1) {
                    if (alpha) {
                        mipmap.fillRect(MipmapGenerator._rect, 0);
                    }

                    MipmapGenerator._matrix.a = MipmapGenerator._rect.width / source.width;
                    MipmapGenerator._matrix.d = MipmapGenerator._rect.height / source.height;

                    mipmap.width = MipmapGenerator._rect.width;
                    mipmap.height = MipmapGenerator._rect.height;
                    mipmap.copyPixels(source, source.rect, MipmapGenerator._rect);

                    //console.log( target instanceof away.displayGL.Texture , mipmap.width , mipmap.height );
                    if (target instanceof away.displayGL.Texture) {
                        tx = target;
                        tx.uploadFromBitmapData(mipmap, i++);
                    } else {
                        away.Debug.throwPIR('MipMapGenerator', 'generateMipMaps', 'Dependency: CubeTexture');
                        // TODO: implement cube texture upload;
                        //CubeTexture(target).uploadFromBitmapData(mipmap, side, i++);
                    }

                    w >>= 1;
                    h >>= 1;

                    MipmapGenerator._rect.width = w > 1 ? w : 1;
                    MipmapGenerator._rect.height = h > 1 ? h : 1;
                }

                if (!regen) {
                    mipmap.dispose();
                }
            };
            MipmapGenerator._matrix = new away.geom.Matrix();
            MipmapGenerator._rect = new away.geom.Rectangle();
            return MipmapGenerator;
        })();
        textures.MipmapGenerator = MipmapGenerator;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        var ByteArrayBase = (function () {
            function ByteArrayBase() {
                this.position = 0;
                this.length = 0;
                this._mode = "";
                this.Base64Key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            }
            ByteArrayBase.prototype.writeByte = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readByte = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeUnsignedByte = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readUnsignedByte = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeUnsignedShort = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readUnsignedShort = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeUnsignedInt = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readUnsignedInt = function () {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.writeFloat = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.toFloatBits = function (x) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.readFloat = function (b) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.fromFloatBits = function (x) {
                throw "Virtual method";
            };

            ByteArrayBase.prototype.getBytesAvailable = function () {
                throw new away.errors.AbstractMethodError('ByteArrayBase, getBytesAvailable() not implemented ');
            };

            ByteArrayBase.prototype.toString = function () {
                return "[ByteArray] ( " + this._mode + " ) position=" + this.position + " length=" + this.length;
            };

            ByteArrayBase.prototype.compareEqual = function (other, count) {
                if (count == undefined || count > this.length - this.position)
                    count = this.length - this.position;
                if (count > other.length - other.position)
                    count = other.length - other.position;
                var co0 = count;
                var r = true;
                while (r && count >= 4) {
                    count -= 4;
                    if (this.readUnsignedInt() != other.readUnsignedInt())
                        r = false;
                }
                while (r && count >= 1) {
                    count--;
                    if (this.readUnsignedByte() != other.readUnsignedByte())
                        r = false;
                }
                var c0;
                this.position -= (c0 - count);
                other.position -= (c0 - count);
                return r;
            };

            ByteArrayBase.prototype.writeBase64String = function (s) {
                for (var i = 0; i < s.length; i++) {
                    var v = s.charAt(i);
                }
            };

            ByteArrayBase.prototype.dumpToConsole = function () {
                var oldpos = this.position;
                this.position = 0;
                var nstep = 8;

                function asHexString(x, digits) {
                    var lut = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
                    var sh = "";
                    for (var d = 0; d < digits; d++) {
                        sh = lut[(x >> (d << 2)) & 0xf] + sh;
                    }
                    return sh;
                }

                for (var i = 0; i < this.length; i += nstep) {
                    var s = asHexString(i, 4) + ":";
                    for (var j = 0; j < nstep && i + j < this.length; j++) {
                        s += " " + asHexString(this.readUnsignedByte(), 2);
                    }
                    console.log(s);
                }
                this.position = oldpos;
            };

            ByteArrayBase.prototype.internalGetBase64String = function (count, getUnsignedByteFunc, self) {
                var r = "";
                var b0, b1, b2, enc1, enc2, enc3, enc4;
                var base64Key = this.Base64Key;
                while (count >= 3) {
                    b0 = getUnsignedByteFunc.apply(self);
                    b1 = getUnsignedByteFunc.apply(self);
                    b2 = getUnsignedByteFunc.apply(self);
                    enc1 = b0 >> 2;
                    enc2 = ((b0 & 3) << 4) | (b1 >> 4);
                    enc3 = ((b1 & 15) << 2) | (b2 >> 6);
                    enc4 = b2 & 63;
                    r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + base64Key.charAt(enc4);
                    count -= 3;
                }

                // pad
                if (count == 2) {
                    b0 = getUnsignedByteFunc.apply(self);
                    b1 = getUnsignedByteFunc.apply(self);
                    enc1 = b0 >> 2;
                    enc2 = ((b0 & 3) << 4) | (b1 >> 4);
                    enc3 = ((b1 & 15) << 2);
                    r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + "=";
                } else if (count == 1) {
                    b0 = getUnsignedByteFunc.apply(self);
                    enc1 = b0 >> 2;
                    enc2 = ((b0 & 3) << 4);
                    r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + "==";
                }
                return r;
            };
            return ByteArrayBase;
        })();
        utils.ByteArrayBase = ByteArrayBase;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        var ByteArray = (function (_super) {
            __extends(ByteArray, _super);
            function ByteArray() {
                _super.call(this);
                this.maxlength = 0;
                this._mode = "Typed array";
                this.maxlength = 4;
                this.arraybytes = new ArrayBuffer(this.maxlength);
                this.unalignedarraybytestemp = new ArrayBuffer(16);
            }
            ByteArray.prototype.ensureWriteableSpace = function (n) {
                this.ensureSpace(n + this.position);
            };

            ByteArray.prototype.setArrayBuffer = function (aBuffer) {
                this.ensureSpace(aBuffer.byteLength);

                this.length = aBuffer.byteLength;

                var inInt8AView = new Int8Array(aBuffer);
                var localInt8View = new Int8Array(this.arraybytes, 0, this.length);

                localInt8View.set(inInt8AView);

                this.position = 0;
            };

            ByteArray.prototype.getBytesAvailable = function () {
                return (this.length) - (this.position);
            };

            ByteArray.prototype.ensureSpace = function (n) {
                if (n > this.maxlength) {
                    var newmaxlength = (n + 255) & (~255);
                    var newarraybuffer = new ArrayBuffer(newmaxlength);
                    var view = new Uint8Array(this.arraybytes, 0, this.length);
                    var newview = new Uint8Array(newarraybuffer, 0, this.length);
                    newview.set(view); // memcpy
                    this.arraybytes = newarraybuffer;
                    this.maxlength = newmaxlength;
                }
            };

            ByteArray.prototype.writeByte = function (b) {
                this.ensureWriteableSpace(1);
                var view = new Int8Array(this.arraybytes);
                view[this.position++] = (~~b); // ~~ is cast to int in js...
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readByte = function () {
                if (this.position >= this.length) {
                    throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
                }
                var view = new Int8Array(this.arraybytes);

                return view[this.position++];
            };

            ByteArray.prototype.readBytes = function (bytes, offset, length) {
                if (typeof offset === "undefined") { offset = 0; }
                if (typeof length === "undefined") { length = 0; }
                if (length == null) {
                    length = bytes.length;
                }

                bytes.ensureWriteableSpace(offset + length);

                var byteView = new Int8Array(bytes.arraybytes);
                var localByteView = new Int8Array(this.arraybytes);

                byteView.set(localByteView.subarray(this.position, this.position + length), offset);

                this.position += length;

                if (length + offset > bytes.length) {
                    bytes.length += (length + offset) - bytes.length;
                }
            };

            ByteArray.prototype.writeUnsignedByte = function (b) {
                this.ensureWriteableSpace(1);
                var view = new Uint8Array(this.arraybytes);
                view[this.position++] = (~~b) & 0xff; // ~~ is cast to int in js...
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readUnsignedByte = function () {
                if (this.position >= this.length) {
                    throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
                }
                var view = new Uint8Array(this.arraybytes);
                return view[this.position++];
            };

            ByteArray.prototype.writeUnsignedShort = function (b) {
                this.ensureWriteableSpace(2);
                if ((this.position & 1) == 0) {
                    var view = new Uint16Array(this.arraybytes);
                    view[this.position >> 1] = (~~b) & 0xffff; // ~~ is cast to int in js...
                } else {
                    var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                    view[0] = (~~b) & 0xffff;
                    var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                    view2.set(view3);
                }
                this.position += 2;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readUTFBytes = function (len) {
                var value = "";
                var max = this.position + len;
                var data = new DataView(this.arraybytes);

                while (this.position < max) {
                    var c = data.getUint8(this.position++);

                    if (c < 0x80) {
                        if (c == 0)
                            break;
                        value += String.fromCharCode(c);
                    } else if (c < 0xE0) {
                        value += String.fromCharCode(((c & 0x3F) << 6) | (data.getUint8(this.position++) & 0x7F));
                    } else if (c < 0xF0) {
                        var c2 = data.getUint8(this.position++);
                        value += String.fromCharCode(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (data.getUint8(this.position++) & 0x7F));
                    } else {
                        var c2 = data.getUint8(this.position++);
                        var c3 = data.getUint8(this.position++);

                        value += String.fromCharCode(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (data.getUint8(this.position++) & 0x7F));
                    }
                }

                return value;
            };

            ByteArray.prototype.readInt = function () {
                var data = new DataView(this.arraybytes);
                var int = data.getInt32(this.position, true);

                this.position += 4;

                return int;
            };

            ByteArray.prototype.readShort = function () {
                var data = new DataView(this.arraybytes);
                var short = data.getInt16(this.position, true);

                this.position += 2;
                return short;
            };

            ByteArray.prototype.readDouble = function () {
                var data = new DataView(this.arraybytes);
                var double = data.getFloat64(this.position, true);

                this.position += 8;
                return double;
            };

            ByteArray.prototype.readUnsignedShort = function () {
                if (this.position > this.length + 2) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                if ((this.position & 1) == 0) {
                    var view = new Uint16Array(this.arraybytes);
                    var pa = this.position >> 1;
                    this.position += 2;
                    return view[pa];
                } else {
                    var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                    var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                    view3.set(view2);
                    this.position += 2;
                    return view[0];
                }
            };

            ByteArray.prototype.writeUnsignedInt = function (b) {
                this.ensureWriteableSpace(4);
                if ((this.position & 3) == 0) {
                    var view = new Uint32Array(this.arraybytes);
                    view[this.position >> 2] = (~~b) & 0xffffffff; // ~~ is cast to int in js...
                } else {
                    var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                    view[0] = (~~b) & 0xffffffff;
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view2.set(view3);
                }
                this.position += 4;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readUnsignedInt = function () {
                if (this.position > this.length + 4) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                if ((this.position & 3) == 0) {
                    var view = new Uint32Array(this.arraybytes);
                    var pa = this.position >> 2;
                    this.position += 4;
                    return view[pa];
                } else {
                    var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view3.set(view2);
                    this.position += 4;
                    return view[0];
                }
            };

            ByteArray.prototype.writeFloat = function (b) {
                this.ensureWriteableSpace(4);
                if ((this.position & 3) == 0) {
                    var view = new Float32Array(this.arraybytes);
                    view[this.position >> 2] = b;
                } else {
                    var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                    view[0] = b;
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view2.set(view3);
                }
                this.position += 4;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArray.prototype.readFloat = function () {
                if (this.position > this.length + 4) {
                    throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
                }
                if ((this.position & 3) == 0) {
                    var view = new Float32Array(this.arraybytes);
                    var pa = this.position >> 2;
                    this.position += 4;
                    return view[pa];
                } else {
                    var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                    var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                    var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                    view3.set(view2);
                    this.position += 4;
                    return view[0];
                }
            };
            return ByteArray;
        })(away.utils.ByteArrayBase);
        utils.ByteArray = ByteArray;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        var ByteArrayBuffer = (function (_super) {
            __extends(ByteArrayBuffer, _super);
            function ByteArrayBuffer() {
                _super.call(this);
                this._bytes = [];
                this._mode = "Array";
            }
            ByteArrayBuffer.prototype.writeByte = function (b) {
                var bi = ~~b;
                this._bytes[this.position++] = bi;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArrayBuffer.prototype.readByte = function () {
                if (this.position >= this.length) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                return this._bytes[this.position++];
            };

            ByteArrayBuffer.prototype.writeUnsignedByte = function (b) {
                var bi = ~~b;
                this._bytes[this.position++] = bi & 0xff;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArrayBuffer.prototype.readUnsignedByte = function () {
                if (this.position >= this.length) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                return this._bytes[this.position++];
            };

            ByteArrayBuffer.prototype.writeUnsignedShort = function (b) {
                var bi = ~~b;
                this._bytes[this.position++] = bi & 0xff;
                this._bytes[this.position++] = (bi >> 8) & 0xff;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArrayBuffer.prototype.readUnsignedShort = function () {
                if (this.position + 2 > this.length) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                var r = this._bytes[this.position] | (this._bytes[this.position + 1] << 8);
                this.position += 2;
                return r;
            };

            ByteArrayBuffer.prototype.writeUnsignedInt = function (b) {
                var bi = ~~b;
                this._bytes[this.position++] = bi & 0xff;
                this._bytes[this.position++] = (bi >>> 8) & 0xff;
                this._bytes[this.position++] = (bi >>> 16) & 0xff;
                this._bytes[this.position++] = (bi >>> 24) & 0xff;
                if (this.position > this.length) {
                    this.length = this.position;
                }
            };

            ByteArrayBuffer.prototype.readUnsignedInt = function () {
                if (this.position + 4 > this.length) {
                    throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
                }
                var r = this._bytes[this.position] | (this._bytes[this.position + 1] << 8) | (this._bytes[this.position + 2] << 16) | (this._bytes[this.position + 3] << 24);
                this.position += 4;
                return r >>> 0;
            };

            ByteArrayBuffer.prototype.writeFloat = function (b) {
                // this is crazy slow and silly, but as a fallback...
                this.writeUnsignedInt(this.toFloatBits(Number(b)));
            };

            ByteArrayBuffer.prototype.toFloatBits = function (x) {
                // don't handle inf/nan yet
                // special case zero
                if (x == 0) {
                    return 0;
                }

                // remove the sign, after this we only deal with positive numbers
                var sign = 0;
                if (x < 0) {
                    x = -x;
                    sign = 1;
                } else {
                    sign = 0;
                }

                // a float value is now defined as: x = (1+(mantissa*2^-23))*(2^(exponent-127))
                var exponent = Math.log(x) / Math.log(2);
                exponent = Math.floor(exponent);
                x = x * Math.pow(2, 23 - exponent); // normalize to 24 bits
                var mantissa = Math.floor(x) - 0x800000;
                exponent = exponent + 127;
                return ((sign << 31) >>> 0) | (exponent << 23) | mantissa;
            };

            ByteArrayBuffer.prototype.readFloat = function (b) {
                return this.fromFloatBits(this.readUnsignedInt());
            };

            ByteArrayBuffer.prototype.fromFloatBits = function (x) {
                if (x == 0) {
                    return 0;
                }
                var exponent = (x >>> 23) & 0xff;
                var mantissa = (x & 0x7fffff) | 0x800000;
                var y = Math.pow(2, (exponent - 127) - 23) * mantissa;
                if (x >>> 31 != 0) {
                    y = -y;
                }
                return y;
            };
            return ByteArrayBuffer;
        })(away.utils.ByteArrayBase);
        utils.ByteArrayBuffer = ByteArrayBuffer;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
var away;
(function (away) {
    (function (utils) {
        var ColorUtils = (function () {
            function ColorUtils() {
            }
            ColorUtils.float32ColorToARGB = function (float32Color) {
                var a = (float32Color & 0xff000000) >>> 24;
                var r = (float32Color & 0xff0000) >>> 16;
                var g = (float32Color & 0xff00) >>> 8;
                var b = float32Color & 0xff;
                var result = [a, r, g, b];

                return result;
            };

            ColorUtils.componentToHex = function (c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            };

            ColorUtils.RGBToHexString = function (argb) {
                return "#" + ColorUtils.componentToHex(argb[1]) + ColorUtils.componentToHex(argb[2]) + ColorUtils.componentToHex(argb[3]);
            };

            ColorUtils.ARGBToHexString = function (argb) {
                return "#" + ColorUtils.componentToHex(argb[0]) + ColorUtils.componentToHex(argb[1]) + ColorUtils.componentToHex(argb[2]) + ColorUtils.componentToHex(argb[3]);
            };
            return ColorUtils;
        })();
        utils.ColorUtils = ColorUtils;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (utils) {
        var CSS = (function () {
            function CSS() {
            }
            CSS.setCanvasSize = function (canvas, width, height) {
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                canvas.width = width;
                canvas.height = height;
            };

            CSS.setCanvasWidth = function (canvas, width) {
                canvas.style.width = width + "px";
                canvas.width = width;
            };

            CSS.setCanvasHeight = function (canvas, height) {
                canvas.style.height = height + "px";
                canvas.height = height;
            };

            CSS.setCanvasX = function (canvas, x) {
                canvas.style.position = 'absolute';
                canvas.style.left = x + "px";
            };

            CSS.setCanvasY = function (canvas, y) {
                canvas.style.position = 'absolute';
                canvas.style.top = y + "px";
            };

            CSS.getCanvasVisibility = function (canvas) {
                return canvas.style.visibility == 'visible';
            };

            CSS.setCanvasVisibility = function (canvas, visible) {
                if (visible) {
                    canvas.style.visibility = 'visible';
                } else {
                    canvas.style.visibility = 'hidden';
                }
            };

            CSS.setCanvasAlpha = function (canvas, alpha) {
                var context = canvas.getContext("2d");
                context.globalAlpha = alpha;
            };

            CSS.setCanvasPosition = function (canvas, x, y, absolute) {
                if (typeof absolute === "undefined") { absolute = false; }
                if (absolute) {
                    canvas.style.position = "absolute";
                } else {
                    canvas.style.position = "relative";
                }

                canvas.style.left = x + "px";
                canvas.style.top = y + "px";
            };
            return CSS;
        })();
        utils.CSS = CSS;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    var Debug = (function () {
        function Debug() {
        }
        Debug.breakpoint = function () {
            away.Debug['break']();
        };

        Debug.throwPIROnKeyWordOnly = function (str, enable) {
            if (typeof enable === "undefined") { enable = true; }
            if (!enable) {
                away.Debug.keyword = null;
            } else {
                away.Debug.keyword = str;
            }
        };

        Debug.throwPIR = function (clss, fnc, msg) {
            Debug.logPIR('PartialImplementationError ' + clss, fnc, msg);

            if (Debug.THROW_ERRORS) {
                if (away.Debug.keyword) {
                    var e = clss + fnc + msg;

                    if (e.indexOf(away.Debug.keyword) == -1) {
                        return;
                    }
                }

                throw new away.errors.PartialImplementationError(clss + '.' + fnc + ': ' + msg);
            }
        };

        Debug.logPIR = function (clss, fnc, msg) {
            if (typeof msg === "undefined") { msg = ''; }
            if (Debug.LOG_PI_ERRORS) {
                console.log(clss + '.' + fnc + ': ' + msg);
            }
        };

        Debug.log = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if (Debug.ENABLE_LOG) {
                console.log.apply(console, arguments);
            }
        };
        Debug.THROW_ERRORS = true;
        Debug.ENABLE_LOG = true;
        Debug.LOG_PI_ERRORS = true;

        Debug.keyword = null;
        return Debug;
    })();
    away.Debug = Debug;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        //[native(cls="TimerClass", gc="exact", instance="TimerObject", methods="auto")]
        //[Event(name="timerComplete", type="flash.events.TimerEvent")]
        //[Event(name="timer", type="flash.events.TimerEvent")]
        function getTimer() {
            // number milliseconds of 1970/01/01
            // this different to AS3 implementation which gets the number of milliseconds
            // since instance of Flash player was initialised
            return Date.now();
        }
        utils.getTimer = getTimer;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        var RequestAnimationFrame = (function () {
            function RequestAnimationFrame(callback, callbackContext) {
                var _this = this;
                this._active = false;
                this._argsArray = new Array();
                this._getTimer = away.utils.getTimer;

                this.setCallback(callback, callbackContext);

                this._rafUpdateFunction = function () {
                    if (_this._active) {
                        _this._tick();
                    }
                };

                this._argsArray.push(this._dt);
            }
            // Public
            /**
            *
            * @param callback
            * @param callbackContext
            */
            RequestAnimationFrame.prototype.setCallback = function (callback, callbackContext) {
                this._callback = callback;
                this._callbackContext = callbackContext;
            };

            /**
            *
            */
            RequestAnimationFrame.prototype.start = function () {
                this._prevTime = this._getTimer();
                this._active = true;

                if (window['mozRequestAnimationFrame']) {
                    window.requestAnimationFrame = window['mozRequestAnimationFrame'];
                } else if (window['webkitRequestAnimationFrame']) {
                    window.requestAnimationFrame = window['webkitRequestAnimationFrame'];
                } else if (window['oRequestAnimationFrame']) {
                    window.requestAnimationFrame = window['oRequestAnimationFrame'];
                }

                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(this._rafUpdateFunction);
                }
            };

            /**
            *
            */
            RequestAnimationFrame.prototype.stop = function () {
                this._active = false;
            };

            Object.defineProperty(RequestAnimationFrame.prototype, "active", {
                // Get / Set
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this._active;
                },
                enumerable: true,
                configurable: true
            });

            // Private
            /**
            *
            * @private
            */
            RequestAnimationFrame.prototype._tick = function () {
                this._currentTime = this._getTimer();
                this._dt = this._currentTime - this._prevTime;
                this._argsArray[0] = this._dt;
                this._callback.apply(this._callbackContext, this._argsArray);

                window.requestAnimationFrame(this._rafUpdateFunction);

                this._prevTime = this._currentTime;
            };
            return RequestAnimationFrame;
        })();
        utils.RequestAnimationFrame = RequestAnimationFrame;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (utils) {
        //import flash.display.BitmapData;
        var TextureUtils = (function () {
            function TextureUtils() {
            }
            TextureUtils.isBitmapDataValid = function (bitmapData) {
                if (bitmapData == null) {
                    return true;
                }

                return TextureUtils.isDimensionValid(bitmapData.width) && TextureUtils.isDimensionValid(bitmapData.height);
            };

            TextureUtils.isHTMLImageElementValid = function (image) {
                if (image == null) {
                    return true;
                }

                return TextureUtils.isDimensionValid(image.width) && TextureUtils.isDimensionValid(image.height);
            };

            TextureUtils.isDimensionValid = function (d) {
                return d >= 1 && d <= TextureUtils.MAX_SIZE && TextureUtils.isPowerOfTwo(d);
            };

            TextureUtils.isPowerOfTwo = function (value) {
                return value ? ((value & -value) == value) : false;
            };

            TextureUtils.getBestPowerOf2 = function (value) {
                var p = 1;

                while (p < value)
                    p <<= 1;

                if (p > TextureUtils.MAX_SIZE)
                    p = TextureUtils.MAX_SIZE;

                return p;
            };
            TextureUtils.MAX_SIZE = 2048;
            return TextureUtils;
        })();
        utils.TextureUtils = TextureUtils;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        //[native(cls="TimerClass", gc="exact", instance="TimerObject", methods="auto")]
        //[Event(name="timerComplete", type="flash.events.TimerEvent")]
        //[Event(name="timer", type="flash.events.TimerEvent")]
        var Timer = (function (_super) {
            __extends(Timer, _super);
            function Timer(delay, repeatCount) {
                if (typeof repeatCount === "undefined") { repeatCount = 0; }
                _super.call(this);
                this._repeatCount = 0;
                this._currentCount = 0;
                this._running = false;

                this._delay = delay;
                this._repeatCount = repeatCount;

                if (isNaN(delay) || delay < 0) {
                    throw new away.errors.Error("Delay is negative or not a number");
                }
            }
            Object.defineProperty(Timer.prototype, "currentCount", {
                get: function () {
                    return this._currentCount;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Timer.prototype, "delay", {
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = value;

                    if (this._running) {
                        this.stop();
                        this.start();
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Timer.prototype, "repeatCount", {
                get: function () {
                    return this._repeatCount;
                },
                set: function (value) {
                    this._repeatCount = value;
                },
                enumerable: true,
                configurable: true
            });


            Timer.prototype.reset = function () {
                if (this._running) {
                    this.stop();
                }

                this._currentCount = 0;
            };

            Object.defineProperty(Timer.prototype, "running", {
                get: function () {
                    return this._running;
                },
                enumerable: true,
                configurable: true
            });

            Timer.prototype.start = function () {
                var _this = this;
                this._running = true;
                clearInterval(this._iid);
                this._iid = setInterval(function () {
                    return _this.tick();
                }, this._delay);
            };

            Timer.prototype.stop = function () {
                this._running = false;
                clearInterval(this._iid);
            };

            Timer.prototype.tick = function () {
                this._currentCount++;

                if ((this._repeatCount > 0) && this._currentCount >= this._repeatCount) {
                    this.stop();
                    this.dispatchEvent(new away.events.TimerEvent(away.events.TimerEvent.TIMER));
                    this.dispatchEvent(new away.events.TimerEvent(away.events.TimerEvent.TIMER_COMPLETE));
                } else {
                    this.dispatchEvent(new away.events.TimerEvent(away.events.TimerEvent.TIMER));
                }
            };
            return Timer;
        })(away.events.EventDispatcher);
        utils.Timer = Timer;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Sampler = (function () {
        function Sampler() {
            this.lodbias = 0;
            this.dim = 0;
            this.readmode = 0;
            this.special = 0;
            this.wrap = 0;
            this.mipmap = 0;
            this.filter = 0;
        }
        return Sampler;
    })();
    aglsl.Sampler = Sampler;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Token = (function () {
        function Token() {
            this.dest = new aglsl.Destination();
            this.opcode = 0;
            this.a = new aglsl.Destination();
            this.b = new aglsl.Destination();
        }
        return Token;
    })();
    aglsl.Token = Token;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Header = (function () {
        function Header() {
            this.progid = 0;
            this.version = 0;
            this.type = "";
        }
        return Header;
    })();
    aglsl.Header = Header;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var OpLUT = (function () {
        function OpLUT(s, flags, dest, a, b, matrixwidth, matrixheight, ndwm, scaler, dm, lod) {
            this.s = s;
            this.flags = flags;
            this.dest = dest;
            this.a = a;
            this.b = b;
            this.matrixwidth = matrixwidth;
            this.matrixheight = matrixheight;
            this.ndwm = ndwm;
            this.scalar = scaler;
            this.dm = dm;
            this.lod = lod;
        }
        return OpLUT;
    })();
    aglsl.OpLUT = OpLUT;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Description = (function () {
        function Description() {
            this.regread = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            this.regwrite = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            this.hasindirect = false;
            this.writedepth = false;
            this.hasmatrix = false;
            this.samplers = [];
            // added due to dynamic assignment 3*0xFFFFFFuuuu
            this.tokens = [];
            this.header = new aglsl.Header();
        }
        return Description;
    })();
    aglsl.Description = Description;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Destination = (function () {
        function Destination() {
            this.mask = 0;
            this.regnum = 0;
            this.regtype = 0;
            this.dim = 0;
        }
        return Destination;
    })();
    aglsl.Destination = Destination;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var ContextGL = (function () {
        function ContextGL() {
            this.enableErrorChecking = false;
            this.resources = [];
            this.driverInfo = "Call getter function instead";
        }
        ContextGL.maxvertexconstants = 128;
        ContextGL.maxfragconstants = 28;
        ContextGL.maxtemp = 8;
        ContextGL.maxstreams = 8;
        ContextGL.maxtextures = 8;
        ContextGL.defaultsampler = new aglsl.Sampler();
        return ContextGL;
    })();
    aglsl.ContextGL = ContextGL;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var Mapping = (function () {
        function Mapping() {
        }
        Mapping.agal2glsllut = [
            new aglsl.OpLUT("%dest = %cast(%a);\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a + %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a - %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a * %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a / %b);\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(1.0) / %a;\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(min(%a,%b));\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(max(%a,%b));\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(fract(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(sqrt(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(inversesqrt(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(pow(abs(%a),%b));\n", 0, true, true, true, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(log2(abs(%a)));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(exp2(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(normalize(vec3( %a ) ));\n", 0, true, true, false, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(sin(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(cos(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(cross(vec3(%a),vec3(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec3(%a),vec3(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", 0, true, true, true, null, null, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(abs(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(%a * -1.0);\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(clamp(%a,0.0,1.0));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec3(%a),vec3(%b)));\n", null, true, true, true, 3, 3, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", null, true, true, true, 4, 4, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dot(vec4(%a),vec4(%b)));\n", null, true, true, true, 4, 3, true, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dFdx(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(dFdx(%a));\n", 0, true, true, false, null, null, null, null, null, null),
            new aglsl.OpLUT("if (float(%a)==float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("if (float(%a)!=float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("if (float(%a)>=float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("if (float(%a)<float(%b)) {;\n", 0, false, true, true, null, null, null, true, null, null), new aglsl.OpLUT("} else {;\n", 0, false, false, false, null, null, null, null, null, null), new aglsl.OpLUT("};\n", 0, false, false, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null), new aglsl.OpLUT(null, null, null, null, false, null, null, null, null, null, null),
            new aglsl.OpLUT("%dest = %cast(texture%texdimLod(%b,%texsize(%a)).%dm);\n", null, true, true, true, null, null, null, null, true, null), new aglsl.OpLUT("if ( float(%a)<0.0 ) discard;\n", null, false, true, false, null, null, null, true, null, null), new aglsl.OpLUT("%dest = %cast(texture%texdim(%b,%texsize(%a)%lod).%dm);\n", null, true, true, true, null, null, true, null, true, true), new aglsl.OpLUT("%dest = %cast(greaterThanEqual(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new aglsl.OpLUT("%dest = %cast(lessThan(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new aglsl.OpLUT("%dest = %cast(sign(%a));\n", 0, true, true, false, null, null, null, null, null, null), new aglsl.OpLUT("%dest = %cast(equal(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null), new aglsl.OpLUT("%dest = %cast(notEqual(%a,%b).%dm);\n", 0, true, true, true, null, null, true, null, true, null)
        ];
        return Mapping;
    })();
    aglsl.Mapping = Mapping;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Opcode = (function () {
            function Opcode(dest, aformat, asize, bformat, bsize, opcode, simple, horizontal, fragonly, matrix) {
                this.a = new aglsl.assembler.FS();
                this.b = new aglsl.assembler.FS();
                this.flags = new aglsl.assembler.Flags();

                this.dest = dest;
                this.a.format = aformat;
                this.a.size = asize;
                this.b.format = bformat;
                this.b.size = bsize;
                this.opcode = opcode;
                this.flags.simple = simple;
                this.flags.horizontal = horizontal;
                this.flags.fragonly = fragonly;
                this.flags.matrix = matrix;
            }
            return Opcode;
        })();
        assembler.Opcode = Opcode;

        var FS = (function () {
            function FS() {
            }
            return FS;
        })();
        assembler.FS = FS;

        var Flags = (function () {
            function Flags() {
            }
            return Flags;
        })();
        assembler.Flags = Flags;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var OpcodeMap = (function () {
            function OpcodeMap() {
            }
            Object.defineProperty(OpcodeMap, "map", {
                get: function () {
                    if (!OpcodeMap._map) {
                        OpcodeMap._map = new Array();
                        OpcodeMap._map['mov'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x00, true, null, null, null);
                        OpcodeMap._map['add'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x01, true, null, null, null);
                        OpcodeMap._map['sub'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x02, true, null, null, null);
                        OpcodeMap._map['mul'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x03, true, null, null, null);
                        OpcodeMap._map['div'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x04, true, null, null, null);
                        OpcodeMap._map['rcp'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x05, true, null, null, null);
                        OpcodeMap._map['min'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x06, true, null, null, null);
                        OpcodeMap._map['max'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x07, true, null, null, null);
                        OpcodeMap._map['frc'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x08, true, null, null, null);
                        OpcodeMap._map['sqt'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x09, true, null, null, null);
                        OpcodeMap._map['rsq'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0a, true, null, null, null);
                        OpcodeMap._map['pow'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x0b, true, null, null, null);
                        OpcodeMap._map['log'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0c, true, null, null, null);
                        OpcodeMap._map['exp'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0d, true, null, null, null);
                        OpcodeMap._map['nrm'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0e, true, null, null, null);
                        OpcodeMap._map['sin'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x0f, true, null, null, null);
                        OpcodeMap._map['cos'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x10, true, null, null, null);
                        OpcodeMap._map['crs'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x11, true, true, null, null);
                        OpcodeMap._map['dp3'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x12, true, true, null, null);
                        OpcodeMap._map['dp4'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x13, true, true, null, null);
                        OpcodeMap._map['abs'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x14, true, null, null, null);
                        OpcodeMap._map['neg'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x15, true, null, null, null);
                        OpcodeMap._map['sat'] = new aglsl.assembler.Opcode("vector", "vector", 4, "none", 0, 0x16, true, null, null, null);

                        OpcodeMap._map['ted'] = new aglsl.assembler.Opcode("vector", "vector", 4, "sampler", 1, 0x26, true, null, true, null);
                        OpcodeMap._map['kil'] = new aglsl.assembler.Opcode("none", "scalar", 1, "none", 0, 0x27, true, null, true, null);
                        OpcodeMap._map['tex'] = new aglsl.assembler.Opcode("vector", "vector", 4, "sampler", 1, 0x28, true, null, true, null);

                        OpcodeMap._map['m33'] = new aglsl.assembler.Opcode("vector", "matrix", 3, "vector", 3, 0x17, true, null, null, true);
                        OpcodeMap._map['m44'] = new aglsl.assembler.Opcode("vector", "matrix", 4, "vector", 4, 0x18, true, null, null, true);
                        OpcodeMap._map['m43'] = new aglsl.assembler.Opcode("vector", "matrix", 3, "vector", 4, 0x19, true, null, null, true);

                        OpcodeMap._map['sge'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x29, true, null, null, null);
                        OpcodeMap._map['slt'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2a, true, null, null, null);
                        OpcodeMap._map['sgn'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2b, true, null, null, null);
                        OpcodeMap._map['seq'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2c, true, null, null, null);
                        OpcodeMap._map['sne'] = new aglsl.assembler.Opcode("vector", "vector", 4, "vector", 4, 0x2d, true, null, null, null);
                    }

                    return OpcodeMap._map;
                },
                enumerable: true,
                configurable: true
            });
            return OpcodeMap;
        })();
        assembler.OpcodeMap = OpcodeMap;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Part = (function () {
            function Part(name, version) {
                if (typeof name === "undefined") { name = null; }
                if (typeof version === "undefined") { version = null; }
                this.name = "";
                this.version = 0;
                this.name = name;
                this.version = version;
                this.data = new away.utils.ByteArray();
            }
            return Part;
        })();
        assembler.Part = Part;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Reg = (function () {
            function Reg(code, desc) {
                this.code = code;
                this.desc = desc;
            }
            return Reg;
        })();
        assembler.Reg = Reg;

        var RegMap = (function () {
            /*
            public static va:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x00, "vertex attribute" );
            public static fc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x01, "fragment constant" );
            public static vc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x01, "vertex constant" );
            public static ft:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x02, "fragment temporary" );
            public static vt:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x02, "vertex temporary" );
            public static vo:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "vertex output" );
            public static op:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "vertex output" );
            public static fd:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment depth output" );
            public static fo:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment output" );
            public static oc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment output" );
            public static v: aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying" );
            public static vi:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying output" );
            public static fi:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying input" );
            public static fs:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x05, "sampler" );
            */
            function RegMap() {
            }
            Object.defineProperty(RegMap, "map", {
                get: function () {
                    if (!RegMap._map) {
                        RegMap._map = new Array();
                        RegMap._map['va'] = new aglsl.assembler.Reg(0x00, "vertex attribute");
                        RegMap._map['fc'] = new aglsl.assembler.Reg(0x01, "fragment constant");
                        RegMap._map['vc'] = new aglsl.assembler.Reg(0x01, "vertex constant");
                        RegMap._map['ft'] = new aglsl.assembler.Reg(0x02, "fragment temporary");
                        RegMap._map['vt'] = new aglsl.assembler.Reg(0x02, "vertex temporary");
                        RegMap._map['vo'] = new aglsl.assembler.Reg(0x03, "vertex output");
                        RegMap._map['op'] = new aglsl.assembler.Reg(0x03, "vertex output");
                        RegMap._map['fd'] = new aglsl.assembler.Reg(0x03, "fragment depth output");
                        RegMap._map['fo'] = new aglsl.assembler.Reg(0x03, "fragment output");
                        RegMap._map['oc'] = new aglsl.assembler.Reg(0x03, "fragment output");
                        RegMap._map['v'] = new aglsl.assembler.Reg(0x04, "varying");
                        RegMap._map['vi'] = new aglsl.assembler.Reg(0x04, "varying output");
                        RegMap._map['fi'] = new aglsl.assembler.Reg(0x04, "varying input");
                        RegMap._map['fs'] = new aglsl.assembler.Reg(0x05, "sampler");
                    }

                    return RegMap._map;
                },
                enumerable: true,
                configurable: true
            });
            return RegMap;
        })();
        assembler.RegMap = RegMap;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var Sampler = (function () {
            function Sampler(shift, mask, value) {
                this.shift = shift;
                this.mask = mask;
                this.value = value;
            }
            return Sampler;
        })();
        assembler.Sampler = Sampler;

        var SamplerMap = (function () {
            /*
            public static map =     [ new aglsl.assembler.Sampler( 8, 0xf, 0 ),
            new aglsl.assembler.Sampler( 8, 0xf, 5 ),
            new aglsl.assembler.Sampler( 8, 0xf, 4 ),
            new aglsl.assembler.Sampler( 8, 0xf, 1 ),
            new aglsl.assembler.Sampler( 8, 0xf, 2 ),
            new aglsl.assembler.Sampler( 8, 0xf, 1 ),
            new aglsl.assembler.Sampler( 8, 0xf, 2 ),
            
            // dimension
            new aglsl.assembler.Sampler( 12, 0xf, 0 ),
            new aglsl.assembler.Sampler( 12, 0xf, 1 ),
            new aglsl.assembler.Sampler( 12, 0xf, 2 ),
            
            // special
            new aglsl.assembler.Sampler( 16, 1, 1 ),
            new aglsl.assembler.Sampler( 16, 4, 4 ),
            
            // repeat
            new aglsl.assembler.Sampler( 20, 0xf, 0 ),
            new aglsl.assembler.Sampler( 20, 0xf, 1 ),
            new aglsl.assembler.Sampler( 20, 0xf, 1 ),
            
            // mip
            new aglsl.assembler.Sampler( 24, 0xf, 0 ),
            new aglsl.assembler.Sampler( 24, 0xf, 0 ),
            new aglsl.assembler.Sampler( 24, 0xf, 1 ),
            new aglsl.assembler.Sampler( 24, 0xf, 2 ),
            
            // filter
            new aglsl.assembler.Sampler( 28, 0xf, 0 ),
            new aglsl.assembler.Sampler( 28, 0xf, 1 ) ]
            */
            /*
            public static rgba: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 0 );
            public static rg: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 5 );
            public static r: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 4 );
            public static compressed: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 1 );
            public static compressed_alpha: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 2 );
            public static dxt1: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 1 );
            public static dxt5: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 2 );
            
            // dimension
            public static sampler2d: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 0 );
            public static cube: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 1 );
            public static sampler3d: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 2 );
            
            // special
            public static centroid: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 16, 1, 1 );
            public static ignoresampler: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 16, 4, 4 );
            
            // repeat
            public static clamp: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 0 );
            public static repeat: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 1 );
            public static wrap: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 1 );
            
            // mip
            public static nomip: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 0 );
            public static mipnone: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 0 );
            public static mipnearest: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 1 );
            public static miplinear: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 2 );
            
            // filter
            public static nearest: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 28, 0xf, 0 );
            public static linear: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 28, 0xf, 1 );
            */
            function SamplerMap() {
            }
            Object.defineProperty(SamplerMap, "map", {
                get: function () {
                    if (!SamplerMap._map) {
                        SamplerMap._map = new Array();
                        SamplerMap._map['rgba'] = new aglsl.assembler.Sampler(8, 0xf, 0);
                        SamplerMap._map['rg'] = new aglsl.assembler.Sampler(8, 0xf, 5);
                        SamplerMap._map['r'] = new aglsl.assembler.Sampler(8, 0xf, 4);
                        SamplerMap._map['compressed'] = new aglsl.assembler.Sampler(8, 0xf, 1);
                        SamplerMap._map['compressed_alpha'] = new aglsl.assembler.Sampler(8, 0xf, 2);
                        SamplerMap._map['dxt1'] = new aglsl.assembler.Sampler(8, 0xf, 1);
                        SamplerMap._map['dxt5'] = new aglsl.assembler.Sampler(8, 0xf, 2);

                        // dimension
                        SamplerMap._map['2d'] = new aglsl.assembler.Sampler(12, 0xf, 0);
                        SamplerMap._map['cube'] = new aglsl.assembler.Sampler(12, 0xf, 1);
                        SamplerMap._map['3d'] = new aglsl.assembler.Sampler(12, 0xf, 2);

                        // special
                        SamplerMap._map['centroid'] = new aglsl.assembler.Sampler(16, 1, 1);
                        SamplerMap._map['ignoresampler'] = new aglsl.assembler.Sampler(16, 4, 4);

                        // repeat
                        SamplerMap._map['clamp'] = new aglsl.assembler.Sampler(20, 0xf, 0);
                        SamplerMap._map['repeat'] = new aglsl.assembler.Sampler(20, 0xf, 1);
                        SamplerMap._map['wrap'] = new aglsl.assembler.Sampler(20, 0xf, 1);

                        // mip
                        SamplerMap._map['nomip'] = new aglsl.assembler.Sampler(24, 0xf, 0);
                        SamplerMap._map['mipnone'] = new aglsl.assembler.Sampler(24, 0xf, 0);
                        SamplerMap._map['mipnearest'] = new aglsl.assembler.Sampler(24, 0xf, 1);
                        SamplerMap._map['miplinear'] = new aglsl.assembler.Sampler(24, 0xf, 2);

                        // filter
                        SamplerMap._map['nearest'] = new aglsl.assembler.Sampler(28, 0xf, 0);
                        SamplerMap._map['linear'] = new aglsl.assembler.Sampler(28, 0xf, 1);
                    }

                    return SamplerMap._map;
                },
                enumerable: true,
                configurable: true
            });
            return SamplerMap;
        })();
        assembler.SamplerMap = SamplerMap;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    (function (assembler) {
        var AGALMiniAssembler = (function () {
            function AGALMiniAssembler() {
                this.r = {};
                this.cur = new aglsl.assembler.Part();
            }
            AGALMiniAssembler.prototype.assemble = function (source, ext_part, ext_version) {
                if (typeof ext_part === "undefined") { ext_part = null; }
                if (typeof ext_version === "undefined") { ext_version = null; }
                if (!ext_version) {
                    ext_version = 1;
                }

                if (ext_part) {
                    this.addHeader(ext_part, ext_version);
                }

                var lines = source.replace(/[\f\n\r\v]+/g, "\n").split("\n");

                for (var i in lines) {
                    this.processLine(lines[i], i);
                }

                return this.r;
            };

            AGALMiniAssembler.prototype.processLine = function (line, linenr) {
                var startcomment = line.search("//");
                if (startcomment != -1) {
                    line = line.slice(0, startcomment);
                }
                line = line.replace(/^\s+|\s+$/g, ""); // remove outer space
                if (!(line.length > 0)) {
                    return;
                }
                var optsi = line.search(/<.*>/g);
                var opts = null;
                if (optsi != -1) {
                    opts = line.slice(optsi).match(/([\w\.\-\+]+)/gi);
                    line = line.slice(0, optsi);
                }

                // get opcode/command
                var tokens = line.match(/([\w\.\+\[\]]+)/gi);
                if (!tokens || tokens.length < 1) {
                    if (line.length >= 3) {
                        console.log("Warning: bad line " + linenr + ": " + line);
                    }
                    return;
                }

                switch (tokens[0]) {
                    case "part":
                        this.addHeader(tokens[1], Number(tokens[2]));
                        break;
                    case "endpart":
                        if (!this.cur) {
                            throw "Unexpected endpart";
                        }
                        this.cur.data.position = 0;
                        this.cur = null;
                        return;
                    default:
                        if (!this.cur) {
                            console.log("Warning: bad line " + linenr + ": " + line + " (Outside of any part definition)");
                            return;
                        }
                        if (this.cur.name == "comment") {
                            return;
                        }
                        var op = aglsl.assembler.OpcodeMap.map[tokens[0]];
                        if (!op) {
                            throw "Bad opcode " + tokens[0] + " " + linenr + ": " + line;
                        }

                        // console.log( 'AGALMiniAssembler' , 'op' , op );
                        this.emitOpcode(this.cur, op.opcode);
                        var ti = 1;
                        if (op.dest && op.dest != "none") {
                            if (!this.emitDest(this.cur, tokens[ti++], op.dest)) {
                                throw "Bad destination register " + tokens[ti - 1] + " " + linenr + ": " + line;
                            }
                        } else {
                            this.emitZeroDword(this.cur);
                        }

                        if (op.a && op.a.format != "none") {
                            if (!this.emitSource(this.cur, tokens[ti++], op.a))
                                throw "Bad source register " + tokens[ti - 1] + " " + linenr + ": " + line;
                        } else {
                            this.emitZeroQword(this.cur);
                        }

                        if (op.b && op.b.format != "none") {
                            if (op.b.format == "sampler") {
                                if (!this.emitSampler(this.cur, tokens[ti++], op.b, opts)) {
                                    throw "Bad sampler register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                }
                            } else {
                                if (!this.emitSource(this.cur, tokens[ti++], op.b)) {
                                    throw "Bad source register " + tokens[ti - 1] + " " + linenr + ": " + line;
                                }
                            }
                        } else {
                            this.emitZeroQword(this.cur);
                        }
                        break;
                }
            };

            AGALMiniAssembler.prototype.emitHeader = function (pr) {
                pr.data.writeUnsignedByte(0xa0); // tag version
                pr.data.writeUnsignedInt(pr.version);
                if (pr.version >= 0x10) {
                    pr.data.writeUnsignedByte(0); // align, for higher versions
                }
                pr.data.writeUnsignedByte(0xa1); // tag program id
                switch (pr.name) {
                    case "fragment":
                        pr.data.writeUnsignedByte(1);
                        break;
                    case "vertex":
                        pr.data.writeUnsignedByte(0);
                        break;
                    case "cpu":
                        pr.data.writeUnsignedByte(2);
                        break;
                    default:
                        pr.data.writeUnsignedByte(0xff);
                        break;
                }
            };

            AGALMiniAssembler.prototype.emitOpcode = function (pr, opcode) {
                pr.data.writeUnsignedInt(opcode);
                //console.log ( "Emit opcode: ", opcode );
            };

            AGALMiniAssembler.prototype.emitZeroDword = function (pr) {
                pr.data.writeUnsignedInt(0);
            };

            AGALMiniAssembler.prototype.emitZeroQword = function (pr) {
                pr.data.writeUnsignedInt(0);
                pr.data.writeUnsignedInt(0);
            };

            AGALMiniAssembler.prototype.emitDest = function (pr, token, opdest) {
                //console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'RegMap.map' , RegMap.map);
                var reg = token.match(/([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i);

                // console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'reg' , reg , reg[1] , RegMap.map[reg[1]] );
                // console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'RegMap.map[reg[1]]' , RegMap.map[reg[1]] , 'bool' , !RegMap.map[reg[1]] ) ;
                if (!aglsl.assembler.RegMap.map[reg[1]])
                    return false;
                var em = { num: reg[2] ? reg[2] : 0, code: aglsl.assembler.RegMap.map[reg[1]].code, mask: this.stringToMask(reg[3]) };
                pr.data.writeUnsignedShort(em.num);
                pr.data.writeUnsignedByte(em.mask);
                pr.data.writeUnsignedByte(em.code);

                //console.log ( "  Emit dest: ", em );
                return true;
            };

            AGALMiniAssembler.prototype.stringToMask = function (s) {
                if (!s)
                    return 0xf;
                var r = 0;
                if (s.indexOf("x") != -1)
                    r |= 1;
                if (s.indexOf("y") != -1)
                    r |= 2;
                if (s.indexOf("z") != -1)
                    r |= 4;
                if (s.indexOf("w") != -1)
                    r |= 8;
                return r;
            };

            AGALMiniAssembler.prototype.stringToSwizzle = function (s) {
                if (!s) {
                    return 0xe4;
                }
                var chartoindex = { x: 0, y: 1, z: 2, w: 3 };
                var sw = 0;

                if (s.charAt(0) != ".") {
                    throw "Missing . for swizzle";
                }

                if (s.length > 1) {
                    sw |= chartoindex[s.charAt(1)];
                }

                if (s.length > 2) {
                    sw |= chartoindex[s.charAt(2)] << 2;
                } else {
                    sw |= (sw & 3) << 2;
                }

                if (s.length > 3) {
                    sw |= chartoindex[s.charAt(3)] << 4;
                } else {
                    sw |= (sw & (3 << 2)) << 2;
                }

                if (s.length > 4) {
                    sw |= chartoindex[s.charAt(4)] << 6;
                } else {
                    sw |= (sw & (3 << 4)) << 2;
                }

                return sw;
            };

            AGALMiniAssembler.prototype.emitSampler = function (pr, token, opsrc, opts) {
                var reg = token.match(/fs(\d*)/i);
                if (!reg || !reg[1]) {
                    return false;
                }
                pr.data.writeUnsignedShort(parseInt(reg[1]));
                pr.data.writeUnsignedByte(0); // bias
                pr.data.writeUnsignedByte(0);

                /*
                pr.data.writeUnsignedByte ( 0x5 );
                pr.data.writeUnsignedByte ( 0 );   // readmode, dim
                pr.data.writeUnsignedByte ( 0 );   // special, wrap
                pr.data.writeUnsignedByte ( 0 );   // mip, filter
                */
                var samplerbits = 0x5;
                var sampleroptset = 0;
                for (var i = 0; i < opts.length; i++) {
                    var o = aglsl.assembler.SamplerMap.map[opts[i].toLowerCase()];

                    //console.log( 'AGALMiniAssembler' , 'emitSampler' , 'SampleMap opt:' , o , '<-------- WATCH FOR THIS');
                    if (o) {
                        if (((sampleroptset >> o.shift) & o.mask) != 0) {
                            console.log("Warning, duplicate sampler option");
                        }
                        sampleroptset |= o.mask << o.shift;
                        samplerbits &= ~(o.mask << o.shift);
                        samplerbits |= o.value << o.shift;
                    } else {
                        console.log("Warning, unknown sampler option: ", opts[i]);
                        // todo bias
                    }
                }
                pr.data.writeUnsignedInt(samplerbits);
                return true;
            };

            AGALMiniAssembler.prototype.emitSource = function (pr, token, opsrc) {
                var indexed = token.match(/vc\[(v[tcai])(\d+)\.([xyzw])([\+\-]\d+)?\](\.[xyzw]{1,4})?/i);
                var reg;
                if (indexed) {
                    if (!aglsl.assembler.RegMap.map[indexed[1]]) {
                        return false;
                    }
                    var selindex = { x: 0, y: 1, z: 2, w: 3 };
                    var em = { num: indexed[2] | 0, code: aglsl.assembler.RegMap.map[indexed[1]].code, swizzle: this.stringToSwizzle(indexed[5]), select: selindex[indexed[3]], offset: indexed[4] | 0 };
                    pr.data.writeUnsignedShort(em.num);
                    pr.data.writeByte(em.offset);
                    pr.data.writeUnsignedByte(em.swizzle);
                    pr.data.writeUnsignedByte(0x1); // constant reg
                    pr.data.writeUnsignedByte(em.code);
                    pr.data.writeUnsignedByte(em.select);
                    pr.data.writeUnsignedByte(1 << 7);
                } else {
                    reg = token.match(/([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i); // g1: regname, g2:regnum, g3:swizzle
                    if (!aglsl.assembler.RegMap.map[reg[1]]) {
                        return false;
                    }
                    var em = { num: reg[2] | 0, code: aglsl.assembler.RegMap.map[reg[1]].code, swizzle: this.stringToSwizzle(reg[3]) };
                    pr.data.writeUnsignedShort(em.num);
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(em.swizzle);
                    pr.data.writeUnsignedByte(em.code);
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(0);
                    pr.data.writeUnsignedByte(0);
                    //console.log ( "  Emit source: ", em, pr.data.length );
                }
                return true;
            };

            AGALMiniAssembler.prototype.addHeader = function (partname, version) {
                if (!version) {
                    version = 1;
                }
                if (this.r[partname] == undefined) {
                    this.r[partname] = new aglsl.assembler.Part(partname, version);
                    this.emitHeader(this.r[partname]);
                } else if (this.r[partname].version != version) {
                    throw "Multiple versions for part " + partname;
                }
                this.cur = this.r[partname];
            };
            return AGALMiniAssembler;
        })();
        assembler.AGALMiniAssembler = AGALMiniAssembler;
    })(aglsl.assembler || (aglsl.assembler = {}));
    var assembler = aglsl.assembler;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var AGALTokenizer = (function () {
        function AGALTokenizer() {
        }
        AGALTokenizer.prototype.decribeAGALByteArray = function (bytes) {
            var header = new aglsl.Header();

            if (bytes.readUnsignedByte() != 0xa0) {
                throw "Bad AGAL: Missing 0xa0 magic byte.";
            }

            header.version = bytes.readUnsignedInt();
            if (header.version >= 0x10) {
                bytes.readUnsignedByte();
                header.version >>= 1;
            }
            if (bytes.readUnsignedByte() != 0xa1) {
                throw "Bad AGAL: Missing 0xa1 magic byte.";
            }

            header.progid = bytes.readUnsignedByte();
            switch (header.progid) {
                case 1:
                    header.type = "fragment";
                    break;
                case 0:
                    header.type = "vertex";
                    break;
                case 2:
                    header.type = "cpu";
                    break;
                default:
                    header.type = "";
                    break;
            }

            var desc = new aglsl.Description();
            var tokens = [];
            while (bytes.position < bytes.length) {
                var token = new aglsl.Token();

                token.opcode = bytes.readUnsignedInt();
                var lutentry = aglsl.Mapping.agal2glsllut[token.opcode];
                if (!lutentry) {
                    throw "Opcode not valid or not implemented yet: " + token.opcode;
                }
                if (lutentry.matrixheight) {
                    desc.hasmatrix = true;
                }
                if (lutentry.dest) {
                    token.dest.regnum = bytes.readUnsignedShort();
                    token.dest.mask = bytes.readUnsignedByte();
                    token.dest.regtype = bytes.readUnsignedByte();
                    desc.regwrite[token.dest.regtype][token.dest.regnum] |= token.dest.mask;
                } else {
                    token.dest = null;
                    bytes.readUnsignedInt();
                }
                if (lutentry.a) {
                    this.readReg(token.a, 1, desc, bytes);
                } else {
                    token.a = null;
                    bytes.readUnsignedInt();
                    bytes.readUnsignedInt();
                }
                if (lutentry.b) {
                    this.readReg(token.b, lutentry.matrixheight | 0, desc, bytes);
                } else {
                    token.b = null;
                    bytes.readUnsignedInt();
                    bytes.readUnsignedInt();
                }
                tokens.push(token);
            }
            desc.header = header;
            desc.tokens = tokens;

            return desc;
        };

        AGALTokenizer.prototype.readReg = function (s, mh, desc, bytes) {
            s.regnum = bytes.readUnsignedShort();
            s.indexoffset = bytes.readByte();
            s.swizzle = bytes.readUnsignedByte();
            s.regtype = bytes.readUnsignedByte();
            desc.regread[s.regtype][s.regnum] = 0xf; // sould be swizzle to mask? should be |=
            if (s.regtype == 0x5) {
                // sampler
                s.lodbiad = s.indexoffset;
                s.indexoffset = undefined;
                s.swizzle = undefined;

                // sampler
                s.readmode = bytes.readUnsignedByte();
                s.dim = s.readmode >> 4;
                s.readmode &= 0xf;
                s.special = bytes.readUnsignedByte();
                s.wrap = s.special >> 4;
                s.special &= 0xf;
                s.mipmap = bytes.readUnsignedByte();
                s.filter = s.mipmap >> 4;
                s.mipmap &= 0xf;
                desc.samplers[s.regnum] = s;
            } else {
                s.indexregtype = bytes.readUnsignedByte();
                s.indexselect = bytes.readUnsignedByte();
                s.indirectflag = bytes.readUnsignedByte();
            }
            if (s.indirectflag) {
                desc.hasindirect = true;
            }
            if (!s.indirectflag && mh) {
                for (var mhi = 0; mhi < mh; mhi++) {
                    desc.regread[s.regtype][s.regnum + mhi] = desc.regread[s.regtype][s.regnum];
                }
            }
        };
        return AGALTokenizer;
    })();
    aglsl.AGALTokenizer = AGALTokenizer;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var AGLSLParser = (function () {
        function AGLSLParser() {
        }
        AGLSLParser.prototype.parse = function (desc) {
            var header = "";
            var body = "";

            header += "precision highp float;\n";
            var tag = desc.header.type[0];

            // declare uniforms
            if (desc.header.type == "vertex") {
                header += "uniform float yflip;\n";
            }
            if (!desc.hasindirect) {
                for (var i = 0; i < desc.regread[0x1].length; i++) {
                    if (desc.regread[0x1][i]) {
                        header += "uniform vec4 " + tag + "c" + i + ";\n";
                    }
                }
            } else {
                header += "uniform vec4 " + tag + "carrr[" + aglsl.ContextGL.maxvertexconstants + "];\n"; // use max const count instead
            }

            for (var i = 0; i < desc.regread[0x2].length || i < desc.regwrite[0x2].length; i++) {
                if (desc.regread[0x2][i] || desc.regwrite[0x2][i]) {
                    header += "vec4 " + tag + "t" + i + ";\n";
                }
            }

            for (var i = 0; i < desc.regread[0x0].length; i++) {
                if (desc.regread[0x0][i]) {
                    header += "attribute vec4 va" + i + ";\n";
                }
            }

            for (var i = 0; i < desc.regread[0x4].length || i < desc.regwrite[0x4].length; i++) {
                if (desc.regread[0x4][i] || desc.regwrite[0x4][i]) {
                    header += "varying vec4 vi" + i + ";\n";
                }
            }

            // declare samplers
            var samptype = ["2D", "Cube", "3D", ""];
            for (var i = 0; i < desc.samplers.length; i++) {
                if (desc.samplers[i]) {
                    header += "uniform sampler" + samptype[desc.samplers[i].dim & 3] + " fs" + i + ";\n";
                }
            }

            // extra gl fluff: setup position and depth adjust temps
            if (desc.header.type == "vertex") {
                header += "vec4 outpos;\n";
            }
            if (desc.writedepth) {
                header += "vec4 tmp_FragDepth;\n";
            }

            //if ( desc.hasmatrix )
            //    header += "vec4 tmp_matrix;\n";
            // start body of code
            body += "void main() {\n";

            for (var i = 0; i < desc.tokens.length; i++) {
                var lutentry = aglsl.Mapping.agal2glsllut[desc.tokens[i].opcode];
                if (!lutentry) {
                    throw "Opcode not valid or not implemented yet: ";
                    /*+token.opcode;*/
                }
                var sublines = lutentry.matrixheight || 1;

                for (var sl = 0; sl < sublines; sl++) {
                    var line = "  " + lutentry.s;
                    if (desc.tokens[i].dest) {
                        if (lutentry.matrixheight) {
                            if (((desc.tokens[i].dest.mask >> sl) & 1) != 1) {
                                continue;
                            }
                            var destregstring = this.regtostring(desc.tokens[i].dest.regtype, desc.tokens[i].dest.regnum, desc, tag);
                            var destcaststring = "float";
                            var destmaskstring = ["x", "y", "z", "w"][sl];
                            destregstring += "." + destmaskstring;
                        } else {
                            var destregstring = this.regtostring(desc.tokens[i].dest.regtype, desc.tokens[i].dest.regnum, desc, tag);
                            var destcaststring;
                            var destmaskstring;
                            if (desc.tokens[i].dest.mask != 0xf) {
                                var ndest = 0;
                                destmaskstring = "";
                                if (desc.tokens[i].dest.mask & 1) {
                                    ndest++;
                                    destmaskstring += "x";
                                }
                                if (desc.tokens[i].dest.mask & 2) {
                                    ndest++;
                                    destmaskstring += "y";
                                }
                                if (desc.tokens[i].dest.mask & 4) {
                                    ndest++;
                                    destmaskstring += "z";
                                }
                                if (desc.tokens[i].dest.mask & 8) {
                                    ndest++;
                                    destmaskstring += "w";
                                }
                                destregstring += "." + destmaskstring;
                                switch (ndest) {
                                    case 1:
                                        destcaststring = "float";
                                        break;
                                    case 2:
                                        destcaststring = "vec2";
                                        break;
                                    case 3:
                                        destcaststring = "vec3";
                                        break;
                                    default:
                                        throw "Unexpected destination mask";
                                }
                            } else {
                                destcaststring = "vec4";
                                destmaskstring = "xyzw";
                            }
                        }
                        line = line.replace("%dest", destregstring);
                        line = line.replace("%cast", destcaststring);
                        line = line.replace("%dm", destmaskstring);
                    }
                    var dwm = 0xf;
                    if (!lutentry.ndwm && lutentry.dest && desc.tokens[i].dest) {
                        dwm = desc.tokens[i].dest.mask;
                    }
                    if (desc.tokens[i].a) {
                        line = line.replace("%a", this.sourcetostring(desc.tokens[i].a, 0, dwm, lutentry.scalar, desc, tag));
                    }
                    if (desc.tokens[i].b) {
                        line = line.replace("%b", this.sourcetostring(desc.tokens[i].b, sl, dwm, lutentry.scalar, desc, tag));
                        if (desc.tokens[i].b.regtype == 0x5) {
                            // sampler dim
                            var texdim = ["2D", "Cube", "3D"][desc.tokens[i].b.dim];
                            var texsize = ["vec2", "vec3", "vec3"][desc.tokens[i].b.dim];
                            line = line.replace("%texdim", texdim);
                            line = line.replace("%texsize", texsize);
                            var texlod = "";
                            line = line.replace("%lod", texlod);
                        }
                    }
                    body += line;
                }
            }

            // adjust z from opengl range of -1..1 to 0..1 as in d3d, this also enforces a left handed coordinate system
            if (desc.header.type == "vertex") {
                body += "  gl_Position = vec4(outpos.x, yflip*outpos.y, outpos.z*2.0 - outpos.w, outpos.w);\n";
            }

            // clamp fragment depth
            if (desc.writedepth) {
                body += "  gl_FragDepth = clamp(tmp_FragDepth,0.0,1.0);\n";
            }

            // close main
            body += "}\n";

            return header + body;
        };

        AGLSLParser.prototype.regtostring = function (regtype, regnum, desc, tag) {
            switch (regtype) {
                case 0x0:
                    return "va" + regnum;
                case 0x1:
                    if (desc.hasindirect && desc.header.type == "vertex") {
                        return "vcarrr[" + regnum + "]";
                    } else {
                        return tag + "c" + regnum;
                    }
                case 0x2:
                    return tag + "t" + regnum;
                case 0x3:
                    return desc.header.type == "vertex" ? "outpos" : "gl_FragColor";
                case 0x4:
                    return "vi" + regnum;
                case 0x5:
                    return "fs" + regnum;
                case 0x6:
                    return "tmp_FragDepth";
                default:
                    throw "Unknown register type";
            }
        };

        AGLSLParser.prototype.sourcetostring = function (s, subline, dwm, isscalar, desc, tag) {
            var swiz = ["x", "y", "z", "w"];
            var r;

            if (s.indirectflag) {
                r = "vcarrr[int(" + this.regtostring(s.indexregtype, s.regnum, desc, tag) + "." + swiz[s.indexselect] + ")";
                var realofs = subline + s.indexoffset;
                if (realofs < 0)
                    r += realofs.toString();
                if (realofs > 0)
                    r += "+" + realofs.toString();
                r += "]";
            } else {
                r = this.regtostring(s.regtype, s.regnum + subline, desc, tag);
            }

            // samplers never add swizzle
            if (s.regtype == 0x5) {
                return r;
            }

            // scalar, first component only
            if (isscalar) {
                return r + "." + swiz[(s.swizzle >> 0) & 3];
            }

            // identity
            if (s.swizzle == 0xe4 && dwm == 0xf) {
                return r;
            }

            // with destination write mask folded in
            r += ".";
            if (dwm & 1)
                r += swiz[(s.swizzle >> 0) & 3];
            if (dwm & 2)
                r += swiz[(s.swizzle >> 2) & 3];
            if (dwm & 4)
                r += swiz[(s.swizzle >> 4) & 3];
            if (dwm & 8)
                r += swiz[(s.swizzle >> 6) & 3];
            return r;
        };
        return AGLSLParser;
    })();
    aglsl.AGLSLParser = AGLSLParser;
})(aglsl || (aglsl = {}));
///<reference path="../away/_definitions.ts" />
var aglsl;
(function (aglsl) {
    var AGLSLCompiler = (function () {
        function AGLSLCompiler() {
        }
        AGLSLCompiler.prototype.compile = function (programType, source) {
            var agalMiniAssembler = new aglsl.assembler.AGALMiniAssembler();
            var tokenizer = new aglsl.AGALTokenizer();

            var data;
            var concatSource;
            switch (programType) {
                case "vertex":
                    concatSource = "part vertex 1\n" + source + "endpart";
                    agalMiniAssembler.assemble(concatSource);
                    data = agalMiniAssembler.r['vertex'].data;
                    break;
                case "fragment":
                    concatSource = "part fragment 1\n" + source + "endpart";
                    agalMiniAssembler.assemble(concatSource);
                    data = agalMiniAssembler.r['fragment'].data;
                    break;
                default:
                    throw "Unknown ContextGLProgramType";
            }

            var description = tokenizer.decribeAGALByteArray(data);

            var parser = new aglsl.AGLSLParser();
            this.glsl = parser.parse(description);

            return this.glsl;
        };
        return AGLSLCompiler;
    })();
    aglsl.AGLSLCompiler = AGLSLCompiler;
})(aglsl || (aglsl = {}));
///<reference path="away/_definitions.ts"/>
away.Debug.THROW_ERRORS = false;
away.Debug.LOG_PI_ERRORS = false;

var away;
(function (away) {
    var AME = (function (_super) {
        __extends(AME, _super);
        function AME() {
            _super.call(this);
        }
        return AME;
    })(away.events.EventDispatcher);
    away.AME = AME;
})(away || (away = {}));
//# sourceMappingURL=ame.next.js.map
