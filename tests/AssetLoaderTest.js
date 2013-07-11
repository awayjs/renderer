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
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return this._messsage;
                },
                set: /**
                *
                * @param value
                */
                function (value) {
                    this._messsage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Error.prototype, "name", {
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return this._name;
                },
                set: /**
                *
                * @param value
                */
                function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Error.prototype, "errorID", {
                get: /**
                *
                * @returns {number}
                */
                function () {
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
var away;
(function (away) {
    /**
    * Base event class
    * @class kurst.events.Event
    *
    * @author Karim Beyrouti
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

            Event.RESIZE = "resize";
            Event.CONTEXT3D_CREATE = "context3DCreate";
            Event.ERROR = "error";
            return Event;
        })();
        events.Event = Event;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var away;
(function (away) {
    ///<reference path="Event.ts" />
    (function (events) {
        var LoaderEvent = (function (_super) {
            __extends(LoaderEvent, _super);
            /**
            * Create a new LoaderEvent object.
            * @param type The event type.
            * @param resource The loaded or parsed resource.
            * @param url The url of the loaded resource.
            */
            function LoaderEvent(type, url, isDependency, errmsg) {
                if (typeof url === "undefined") { url = null; }
                if (typeof isDependency === "undefined") { isDependency = false; }
                if (typeof errmsg === "undefined") { errmsg = null; }
                _super.call(this, type);

                this._url = url;
                this._message = errmsg;
                this._isDependency = isDependency;
            }
            Object.defineProperty(LoaderEvent.prototype, "url", {
                get: /**
                * The url of the loaded resource.
                */
                function () {
                    return this._url;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LoaderEvent.prototype, "message", {
                get: /**
                * The error string on loadError.
                */
                function () {
                    return this._message;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LoaderEvent.prototype, "isDependency", {
                get: /**
                * Indicates whether the event occurred while loading a dependency, as opposed
                * to the base file. Dependencies can be textures or other files that are
                * referenced by the base file.
                */
                function () {
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
                return new LoaderEvent(this.type, this._url, this._isDependency, this._message);
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
var away;
(function (away) {
    /*
    * Author: mr.doob / https://github.com/mrdoob/eventdispatcher.js/
    * TypeScript Conversion : Karim Beyrouti ( karim@kurst.co.uk )
    */
    ///<reference path="Event.ts" />
    /**
    * @module kurst.events
    */
    (function (events) {
        /**
        * Base class for dispatching events
        *
        * @class kurst.events.EventDispatcher
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
            EventDispatcher.prototype.hasEventListener = function (type, listener, target) {
                return (this.getEventListenerIndex(type, listener, target) !== -1);
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
var away;
(function (away) {
    ///<reference path="Event.ts" />
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
                get: /**
                * Additional human-readable message. Usually supplied for ParserEvent.PARSE_ERROR events.
                */
                function () {
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
var away;
(function (away) {
    (function (loaders) {
        var AssetLoaderContext = (function () {
            /**
            * AssetLoaderContext provides configuration for the AssetLoader load() and parse() operations.
            * Use it to configure how (and if) dependencies are loaded, or to map dependency URLs to
            * embedded data.
            *
            * @see away3d.loading.AssetLoader
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
                get: /**
                * Defines whether dependencies (all files except the one at the URL given to the load() or
                * parseData() operations) should be automatically loaded. Defaults to true.
                */
                function () {
                    return this._includeDependencies;
                },
                set: function (val) {
                    this._includeDependencies = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "materialMode", {
                get: /**
                * MaterialMode defines, if the Parser should create SinglePass or MultiPass Materials
                * Options:
                * 0 (Default / undefined) - All Parsers will create SinglePassMaterials, but the AWD2.1parser will create Materials as they are defined in the file
                * 1 (Force SinglePass) - All Parsers create SinglePassMaterials
                * 2 (Force MultiPass) - All Parsers will create MultiPassMaterials
                *
                */
                function () {
                    return this._materialMode;
                },
                set: function (materialMode) {
                    this._materialMode = materialMode;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "dependencyBaseUrl", {
                get: /**
                * A base URL that will be prepended to all relative dependency URLs found in a loaded resource.
                * Absolute paths will not be affected by the value of this property.
                */
                function () {
                    return this._dependencyBaseUrl;
                },
                set: function (val) {
                    this._dependencyBaseUrl = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "overrideAbsolutePaths", {
                get: /**
                * Defines whether absolute paths (defined as paths that begin with a "/") should be overridden
                * with the dependencyBaseUrl defined in this context. If this is true, and the base path is
                * "base", /path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
                */
                function () {
                    return this._overrideAbsPath;
                },
                set: function (val) {
                    this._overrideAbsPath = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLoaderContext.prototype, "overrideFullURLs", {
                get: /**
                * Defines whether "full" URLs (defined as a URL that includes a scheme, e.g. http://) should be
                * overridden with the dependencyBaseUrl defined in this context. If this is true, and the base
                * path is "base", http://example.com/path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
                */
                function () {
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
            * @param newUrl The URL from which Away3D should load the resource instead.
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
        loaders.AssetLoaderContext = AssetLoaderContext;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="../AssetLoader.ts" />
    (function (loaders) {
        //import away3d.arcane;
        //import away3d.events.AssetEvent;
        //import away3d.events.LoaderEvent;
        //import away3d.loaders.AssetLoader;
        //import flash.events.Event;
        //import flash.events.EventDispatcher;
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
                return this._iLoader.hasEventListener(type, listener, target);
            };
            return AssetLoaderToken;
        })(away.events.EventDispatcher);
        loaders.AssetLoaderToken = AssetLoaderToken;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="Event.ts" />
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
var away;
(function (away) {
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
    ///<reference path="../events/EventDispatcher.ts" />
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
                get: /**
                *
                * @returns {Object}
                */
                function () {
                    return this._variables;
                },
                set: /**
                *
                * @returns {Object}
                */
                function (obj) {
                    this._variables = obj;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLVariables.prototype, "formData", {
                get: /**
                *
                * @returns {Object}
                */
                function () {
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
    ///<reference path="URLRequestMethod.ts" />
    ///<reference path="URLVariables.ts" />
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
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return this._url;
                },
                set: /**
                *
                * @param value
                */
                function (value) {
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
                this.method = null;
                this.async = null;
            };
            return URLRequest;
        })();
        net.URLRequest = URLRequest;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/Event.ts" />
    ///<reference path="../events/IOErrorEvent.ts" />
    ///<reference path="URLRequest.ts" />
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
                get: // Get / Set
                /**
                * Get reference to image if it is loaded
                * @returns {HTMLImageElement}
                */
                function () {
                    return this._image;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "loaded", {
                get: /**
                * Get image width. Returns null is image is not loaded
                * @returns {number}
                */
                function () {
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
                get: /**
                * Get image width. Returns null is image is not loaded
                * @returns {number}
                */
                function () {
                    if (this._image) {
                        return this._image.width;
                    }

                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "height", {
                get: /**
                * Get image height. Returns null is image is not loaded
                * @returns {number}
                */
                function () {
                    if (this._image) {
                        return this._image.height;
                    }

                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "request", {
                get: /**
                * return URL request used to load image
                * @returns {away.net.URLRequest}
                */
                function () {
                    return this._request;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IMGLoader.prototype, "name", {
                get: /**
                * get name of HTMLImageElement
                * @returns {string}
                */
                function () {
                    if (this._image) {
                        return this._image.name;
                    }

                    return this._name;
                },
                set: /**
                * set name of HTMLImageElement
                * @returns {string}
                */
                function (value) {
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
                    };
                    this._image.onerror = function (event) {
                        return _this.onError(event);
                    };
                    this._image.onload = function (event) {
                        return _this.onLoadComplete(event);
                    };
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
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
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="Point.ts" />
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
    /**
    * @author Gary Paluk
    * @created 6/29/13
    * @module away.geom
    */
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
                get: /**
                * [read-only] The length, magnitude, of the current Vector3D object from the origin (0,0,0) to the object's
                * x, y, and z coordinates.
                * @returns The length of the Vector3D
                */
                function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vector3D.prototype, "lengthSquared", {
                get: /**
                * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z
                * properties.
                * @returns The squared length of the vector
                */
                function () {
                    return (this.x * this.x + this.y * this.y + this.z + this.z);
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

            Vector3D.angleBetween = /**
            * [static] Returns the angle in radians between two vectors.
            */
            function (a, b) {
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
                return new Vector3D(src.x, src.y, src.z, src.w);
            };

            /**
            * Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another
            * Vector3D object.
            */
            Vector3D.prototype.crossProduct = function (a) {
                return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
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

            Vector3D.distance = /**
            * [static] Returns the distance between two Vector3D objects.
            */
            function (pt1, pt2) {
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
            return Vector3D;
        })();
        geom.Vector3D = Vector3D;
    })(away.geom || (away.geom = {}));
    var geom = away.geom;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="Error.ts" />
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
        })(errors.Error);
        errors.ArgumentError = ArgumentError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="Point.ts" />
    ///<reference path="Vector3D.ts" />
    ///<reference path="../errors/ArgumentError.ts" />
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
    ///<reference path="../net/IMGLoader.ts" />
    ///<reference path="../geom/Rectangle.ts" />
    ///<reference path="../geom/Point.ts" />
    ///<reference path="../geom/Matrix.ts" />
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
                this._locked = false;
                this._transparent = transparent;
                this._imageCanvas = document.createElement("canvas");
                this._imageCanvas.width = width;
                this._imageCanvas.height = height;
                this._context = this._imageCanvas.getContext("2d");
                this._rect = new away.geom.Rectangle(0, 0, width, height);

                if (fillColor) {
                    this.fillRect(this._rect, fillColor);
                }
            }
            // Public
            /*
            public draw ( source : BitmapData, matrix : away.geom.Matrix = null ) //, colorTransform, blendMode, clipRect, smoothing) {
            {
            
            var sourceMatrix : away.geom.Matrix     = ( matrix === null ) ? matrix : new  away.geom.Matrix();
            var sourceRect : away.geom.Rectangle    = new away.geom.Rectangle(0, 0, source.width, source.height);
            
            this._imageCanvas.width     = source.width;
            this._imageCanvas.height    = source.height;
            
            this._context.transform(
            sourceMatrix.a,
            sourceMatrix.b,
            sourceMatrix.c,
            sourceMatrix.d,
            sourceMatrix.tx,
            sourceMatrix.ty);
            
            this.copyPixels(source , source.rect , source.rect );
            }
            */
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
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };

            /**
            *
            * @param x
            * @param y
            * @param r
            * @param g
            * @param b
            * @param a
            */
            BitmapData.prototype.setPixel = function (x, y, r, g, b, a) {
                if (!this._locked) {
                    this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                }

                if (this._imageData) {
                    var index = (x + y * this._imageCanvas.width) * 4;

                    this._imageData.data[index + 0] = r;
                    this._imageData.data[index + 1] = g;
                    this._imageData.data[index + 2] = b;
                    this._imageData.data[index + 3] = a;
                }

                if (!this._locked) {
                    this._context.putImageData(this._imageData, 0, 0);
                    this._imageData = null;
                }
            };

            /**
            *
            * @param img
            * @param sourceRect
            * @param destRect
            */
            BitmapData.prototype.copyImage = function (img, sourceRect, destRect) {
                if (this._locked) {
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0);
                    }

                    this._context.drawImage(img, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._context.drawImage(img, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                }
            };

            /**
            *
            * @param bmpd
            * @param sourceRect
            * @param destRect
            */
            BitmapData.prototype.copyPixels = function (bmpd, sourceRect, destRect) {
                if (this._locked) {
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0);
                    }

                    this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
                }
            };

            /**
            *
            * @param rect
            * @param color
            */
            BitmapData.prototype.fillRect = function (rect, color) {
                if (this._locked) {
                    if (this._imageData) {
                        this._context.putImageData(this._imageData, 0, 0);
                    }

                    this._context.fillStyle = '#' + this.decimalToHex(color, 6);
                    this._context.fillRect(rect.x, rect.y, rect.width, rect.height);

                    if (this._imageData) {
                        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                    }
                } else {
                    this._context.fillStyle = '#' + this.decimalToHex(color, 6);
                    this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
                }
            };


            Object.defineProperty(BitmapData.prototype, "imageData", {
                get: /**
                *
                * @returns {ImageData}
                */
                function () {
                    return this._context.getImageData(0, 0, this._rect.width, this._rect.height);
                },
                set: // Get / Set
                /**
                *
                * @param {ImageData}
                */
                function (value) {
                    this._context.putImageData(value, 0, 0);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BitmapData.prototype, "width", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._imageCanvas.width;
                },
                set: /**
                *
                * @param {number}
                */
                function (value) {
                    this._rect.width = value;
                    this._imageCanvas.width = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapData.prototype, "height", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._imageCanvas.height;
                },
                set: /**
                *
                * @param {number}
                */
                function (value) {
                    this._rect.height = value;
                    this._imageCanvas.height = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(BitmapData.prototype, "rect", {
                get: /**
                *
                * @param {away.geom.Rectangle}
                */
                function () {
                    return this._rect;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BitmapData.prototype, "canvas", {
                get: /**
                *
                * @returns {HTMLCanvasElement}
                */
                function () {
                    return this._imageCanvas;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BitmapData.prototype, "context", {
                get: /**
                *
                * @returns {HTMLCanvasElement}
                */
                function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });

            // Private
            /**
            * convert decimal value to Hex
            */
            BitmapData.prototype.decimalToHex = function (d, padding) {
                // TODO - bitwise replacement would be better / Extract alpha component of 0xffffffff ( currently no support for alpha )
                var hex = d.toString(16).toUpperCase();
                padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

                while (hex.length < padding) {
                    hex = "0" + hex;
                }

                return hex;
            };
            return BitmapData;
        })();
        display.BitmapData = BitmapData;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="Event.ts" />
    ///<reference path="../library/assets/IAsset.ts" />
    (function (events) {
        //import away3d.library.assets.IAsset;
        //import flash.events.Event;
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
            AssetEvent.ENTITY_COMPLETE = "entityComplete";
            AssetEvent.SKYBOX_COMPLETE = "skyboxComplete";
            AssetEvent.CAMERA_COMPLETE = "cameraComplete";
            AssetEvent.MESH_COMPLETE = "meshComplete";
            AssetEvent.GEOMETRY_COMPLETE = "geometryComplete";
            AssetEvent.SKELETON_COMPLETE = "skeletonComplete";
            AssetEvent.SKELETON_POSE_COMPLETE = "skeletonPoseComplete";
            AssetEvent.CONTAINER_COMPLETE = "containerComplete";
            AssetEvent.TEXTURE_COMPLETE = "textureComplete";
            AssetEvent.TEXTURE_PROJECTOR_COMPLETE = "textureProjectorComplete";
            AssetEvent.MATERIAL_COMPLETE = "materialComplete";
            AssetEvent.ANIMATOR_COMPLETE = "animatorComplete";
            AssetEvent.ANIMATION_SET_COMPLETE = "animationSetComplete";
            AssetEvent.ANIMATION_STATE_COMPLETE = "animationStateComplete";
            AssetEvent.ANIMATION_NODE_COMPLETE = "animationNodeComplete";
            AssetEvent.STATE_TRANSITION_COMPLETE = "stateTransitionComplete";
            AssetEvent.SEGMENT_SET_COMPLETE = "segmentSetComplete";
            AssetEvent.LIGHT_COMPLETE = "lightComplete";
            AssetEvent.LIGHTPICKER_COMPLETE = "lightPickerComplete";
            AssetEvent.EFFECTMETHOD_COMPLETE = "effectMethodComplete";
            AssetEvent.SHADOWMAPMETHOD_COMPLETE = "shadowMapMethodComplete";

            AssetEvent.ASSET_RENAME = 'assetRename';
            AssetEvent.ASSET_CONFLICT_RESOLVED = 'assetConflictResolved';

            AssetEvent.TEXTURE_SIZE_ERROR = 'textureSizeError';
            return AssetEvent;
        })(away.events.Event);
        events.AssetEvent = AssetEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="Event.ts" />
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
var away;
(function (away) {
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/TimerEvent.ts" />
    ///<reference path="../errors/Error.ts" />
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
var away;
(function (away) {
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/TimerEvent.ts" />
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
var away;
(function (away) {
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="../../events/AssetEvent.ts" />
    ///<reference path="../../events/TimerEvent.ts" />
    ///<reference path="../../events/ParserEvent.ts" />
    ///<reference path="../../library/assets/IAsset.ts" />
    ///<reference path="../../library/assets/AssetType.ts" />
    ///<reference path="../../loaders/misc/ResourceDependency.ts" />
    ///<reference path="../../utils/Timer.ts" />
    ///<reference path="../../utils/getTimer.ts" />
    (function (loaders) {
        var ParserLoaderType = (function () {
            function ParserLoaderType() {
            }
            ParserLoaderType.URL_LOADER = 'ParserLoaderType_URLLoader';
            ParserLoaderType.IMG_LOADER = 'ParserLoaderType_IMGLoader';
            return ParserLoaderType;
        })();
        loaders.ParserLoaderType = ParserLoaderType;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../display/BitmapData.ts" />
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
var away;
(function (away) {
    ///<reference path="Error.ts" />
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
        })(errors.Error);
        errors.AbstractMethodError = AbstractMethodError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="../../display/BitmapData.ts" />
    ///<reference path="../../events/AssetEvent.ts" />
    ///<reference path="../../events/TimerEvent.ts" />
    ///<reference path="../../events/ParserEvent.ts" />
    ///<reference path="../../library/assets/IAsset.ts" />
    ///<reference path="../../library/assets/AssetType.ts" />
    ///<reference path="../../loaders/misc/ResourceDependency.ts" />
    ///<reference path="../../loaders/parsers/ParserLoaderType.ts" />
    ///<reference path="../../utils/Timer.ts" />
    ///<reference path="../../utils/getTimer.ts" />
    ///<reference path="../../utils/TextureUtils.ts" />
    ///<reference path="../../errors/AbstractMethodError.ts" />
    (function (loaders) {
        /**
        * <code>ParserBase</code> provides an abstract base class for objects that convert blocks of data to data structures
        * supported by Away3D.
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
        * @see away3d.loading.parsers.AssetLoader
        * @see away3d.loading.ResourceManager
        */
        var ParserBase = (function (_super) {
            __extends(ParserBase, _super);
            /**
            * Creates a new ParserBase object
            * @param format The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>, and should be provided by the concrete subtype.
            * @param loaderType The type of loader required by the parser
            *
            * @see away3d.loading.parsers.ParserDataFormat
            */
            function ParserBase(format, loaderType) {
                if (typeof loaderType === "undefined") { loaderType = null; }
                _super.call(this);
                this._loaderType = away.loaders.ParserLoaderType.URL_LOADER;

                if (loaderType) {
                    this._loaderType = loaderType;
                }

                this._materialMode = 0;
                this._dataFormat = format;
                this._dependencies = new Array();
            }
            ParserBase.supportsType = //----------------------------------------------------------------------------------------------------------------------------------------------------------------
            // TODO: add error checking for the following ( could cause a problem if this function is not implemented )
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------
            // Needs to be implemented in all Parsers (
            //<code>public static supportsType(extension : string) : boolean</code>
            //* Indicates whether or not a given file extension is supported by the parser.
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------
            function (extension) {
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
                get: /**
                * The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>.
                */
                function () {
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
                get: /**
                * A list of dependencies that need to be loaded and resolved for the object being parsed.
                */
                function () {
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
                        type_event = away.events.AssetEvent.LIGHTPICKER_COMPLETE;
                        break;
                    case away.library.AssetType.LIGHT:
                        type_name = 'light';
                        type_event = away.events.AssetEvent.LIGHT_COMPLETE;
                        break;
                    case away.library.AssetType.ANIMATOR:
                        type_name = 'animator';
                        type_event = away.events.AssetEvent.ANIMATOR_COMPLETE;
                        break;
                    case away.library.AssetType.ANIMATION_SET:
                        type_name = 'animationSet';
                        type_event = away.events.AssetEvent.ANIMATION_SET_COMPLETE;
                        break;
                    case away.library.AssetType.ANIMATION_STATE:
                        type_name = 'animationState';
                        type_event = away.events.AssetEvent.ANIMATION_STATE_COMPLETE;
                        break;
                    case away.library.AssetType.ANIMATION_NODE:
                        type_name = 'animationNode';
                        type_event = away.events.AssetEvent.ANIMATION_NODE_COMPLETE;
                        break;
                    case away.library.AssetType.STATE_TRANSITION:
                        type_name = 'stateTransition';
                        type_event = away.events.AssetEvent.STATE_TRANSITION_COMPLETE;
                        break;
                    case away.library.AssetType.TEXTURE:
                        type_name = 'texture';
                        type_event = away.events.AssetEvent.TEXTURE_COMPLETE;
                        break;
                    case away.library.AssetType.TEXTURE_PROJECTOR:
                        type_name = 'textureProjector';
                        type_event = away.events.AssetEvent.TEXTURE_PROJECTOR_COMPLETE;
                        break;
                    case away.library.AssetType.CONTAINER:
                        type_name = 'container';
                        type_event = away.events.AssetEvent.CONTAINER_COMPLETE;
                        break;
                    case away.library.AssetType.GEOMETRY:
                        type_name = 'geometry';
                        type_event = away.events.AssetEvent.GEOMETRY_COMPLETE;
                        break;
                    case away.library.AssetType.MATERIAL:
                        type_name = 'material';
                        type_event = away.events.AssetEvent.MATERIAL_COMPLETE;
                        break;
                    case away.library.AssetType.MESH:
                        type_name = 'mesh';
                        type_event = away.events.AssetEvent.MESH_COMPLETE;
                        break;
                    case away.library.AssetType.SKELETON:
                        type_name = 'skeleton';
                        type_event = away.events.AssetEvent.SKELETON_COMPLETE;
                        break;
                    case away.library.AssetType.SKELETON_POSE:
                        type_name = 'skelpose';
                        type_event = away.events.AssetEvent.SKELETON_POSE_COMPLETE;
                        break;
                    case away.library.AssetType.ENTITY:
                        type_name = 'entity';
                        type_event = away.events.AssetEvent.ENTITY_COMPLETE;
                        break;
                    case away.library.AssetType.SKYBOX:
                        type_name = 'skybox';
                        type_event = away.events.AssetEvent.SKYBOX_COMPLETE;
                        break;
                    case away.library.AssetType.CAMERA:
                        type_name = 'camera';
                        type_event = away.events.AssetEvent.CAMERA_COMPLETE;
                        break;
                    case away.library.AssetType.SEGMENT_SET:
                        type_name = 'segmentSet';
                        type_event = away.events.AssetEvent.SEGMENT_SET_COMPLETE;
                        break;
                    case away.library.AssetType.EFFECTS_METHOD:
                        type_name = 'effectsMethod';
                        type_event = away.events.AssetEvent.EFFECTMETHOD_COMPLETE;
                        break;
                    case away.library.AssetType.SHADOW_MAP_METHOD:
                        type_name = 'effectsMethod';
                        type_event = away.events.AssetEvent.SHADOWMAPMETHOD_COMPLETE;
                        break;
                    default:
                        throw new away.errors.Error('Unhandled asset type ' + asset.assetType + '. Report as bug!');
                        break;
                }
                ;

                if (!asset.name)
                    asset.name = type_name;

                this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.ASSET_COMPLETE, asset));
                this.dispatchEvent(new away.events.AssetEvent(type_event, asset));
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
                this._dependencies.push(new away.loaders.ResourceDependency(id, req, data, this, retrieveAsRawData, suppressErrorEvents));
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
                if (this._timer) {
                    this._timer.removeEventListener(away.events.TimerEvent.TIMER, this._pOnInterval, this);
                    this._timer.stop();
                }

                this._timer = null;
                this._parsingComplete = true;

                this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.PARSE_COMPLETE));
            };
            ParserBase.PARSING_DONE = true;

            ParserBase.MORE_TO_PARSE = false;
            return ParserBase;
        })(away.events.EventDispatcher);
        loaders.ParserBase = ParserBase;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="Event.ts" />
    (function (events) {
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
var away;
(function (away) {
    ///<reference path="Event.ts" />
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
var away;
(function (away) {
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
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/Event.ts" />
    ///<reference path="../events/IOErrorEvent.ts" />
    ///<reference path="../events/HTTPStatusEvent.ts" />
    ///<reference path="../events/ProgressEvent.ts" />
    ///<reference path="URLRequest.ts" />
    ///<reference path="URLLoaderDataFormat.ts" />
    ///<reference path="URLRequestMethod.ts" />
    ///<reference path="URLRequest.ts" />
    ///<reference path="../errors/Error.ts" />
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
                get: /**
                *
                * @returns {string}
                *      away.net.URLLoaderDataFormat
                */
                function () {
                    return this._dataFormat;
                },
                set: // Get / Set
                /**
                *
                * away.net.URLLoaderDataFormat.BINARY
                * away.net.URLLoaderDataFormat.TEXT
                * away.net.URLLoaderDataFormat.VARIABLES
                *
                * @param format
                */
                function (format) {
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
                get: /**
                *
                * @returns {*}
                */
                function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "bytesLoaded", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._bytesLoaded;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "bytesTotal", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._bytesTotal;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "request", {
                get: /**
                *
                * @returns {away.net.URLRequest}
                */
                function () {
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
                    this._XHR.send();
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
                            this._XHR.send(request.data);
                        } else {
                            this._XHR.send();
                        }
                    }
                } else {
                    this._XHR.send();
                }
            };

            /**
            *
            * @param error {XMLHttpRequestException}
            */
            URLLoader.prototype.handleXmlHttpRequestException = function (error/* <XMLHttpRequestException> */ ) {
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
                    };
                    this._XHR.onprogress = function (event) {
                        return _this.onProgress(event);
                    };
                    this._XHR.onabort = function (event) {
                        return _this.onAbort(event);
                    };
                    this._XHR.onerror = function (event) {
                        return _this.onLoadError(event);
                    };
                    this._XHR.onload = function (event) {
                        return _this.onLoadComplete(event);
                    };
                    this._XHR.ontimeout = function (event) {
                        return _this.onTimeOut(event);
                    };
                    this._XHR.onloadend = function (event) {
                        return _this.onLoadEnd(event);
                    };
                    this._XHR.onreadystatechange = function (event) {
                        return _this.onReadyStateChange(event);
                    };
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
            };

            /**
            * When the request has been aborted, either by invoking the abort() method or navigating away from the page.
            * @param event
            */
            URLLoader.prototype.onAbort = function (event) {
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
    (function (loaders) {
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
        loaders.ParserDataFormat = ParserDataFormat;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="ParserBase.ts" />
    ///<reference path="ParserDataFormat.ts" />
    ///<reference path="ParserLoaderType.ts" />
    ///<reference path="../../net/IMGLoader.ts" />
    (function (loaders) {
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
                _super.call(this, away.loaders.ParserDataFormat.IMAGE, away.loaders.ParserLoaderType.IMG_LOADER);
            }
            ImageParser.supportsType = /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            function (extension) {
                extension = extension.toLowerCase();
                return extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif" || extension == "bmp";
            };

            ImageParser.supportsData = /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            function (data) {
                if (data instanceof HTMLImageElement) {
                    return true;
                }

                return false;
            };

            /**
            * @inheritDoc
            */
            ImageParser.prototype._pProceedParsing = function () {
                if (this.data instanceof HTMLImageElement) {
                    // TODO: Implement Texture2D and add HTMLImageElement
                    var aAssetTest;

                    //this._pFinalizeAsset( aAssetTest , this._iFileName);
                    return away.loaders.ParserBase.PARSING_DONE;
                }

                return away.loaders.ParserBase.PARSING_DONE;
            };
            return ImageParser;
        })(away.loaders.ParserBase);
        loaders.ImageParser = ImageParser;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../net/URLRequest.ts" />
    ///<reference path="../../net/IMGLoader.ts" />
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="ISingleFileTSLoader.ts" />
    ///<reference path="../../events/Event.ts" />
    ///<reference path="../../events/IOErrorEvent.ts" />
    ///<reference path="../../events/Event.ts" />
    (function (loaders) {
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
                get: // Get / Set
                /**
                *
                * @returns {*}
                */
                function () {
                    return this._loader.image;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileImageLoader.prototype, "dataFormat", {
                get: /**
                *
                * @returns {*}
                */
                function () {
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
        loaders.SingleFileImageLoader = SingleFileImageLoader;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../net/URLRequest.ts" />
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="ISingleFileTSLoader.ts" />
    ///<reference path="../../events/Event.ts" />
    ///<reference path="../../net/URLLoader.ts" />
    (function (loaders) {
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
                get: // Get / Set
                /**
                *
                * @returns {*}
                */
                function () {
                    return this._loader.data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileURLLoader.prototype, "dataFormat", {
                get: /**
                *
                * @returns {*}
                */
                function () {
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
        loaders.SingleFileURLLoader = SingleFileURLLoader;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
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
    (function (loaders) {
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
        var SingleFileLoader = (function (_super) {
            __extends(SingleFileLoader, _super);
            // Constructor
            /**
            * Creates a new SingleFileLoader object.
            */
            function SingleFileLoader(materialMode) {
                if (typeof materialMode === "undefined") { materialMode = 0; }
                _super.call(this);
                this._materialMode = materialMode;
            }
            SingleFileLoader.enableParser = function (parser) {
                if (SingleFileLoader._parsers.indexOf(parser) < 0) {
                    SingleFileLoader._parsers.push(parser);
                }
            };

            SingleFileLoader.enableParsers = function (parsers) {
                var pc;

                for (var c = 0; c < parsers.length; c++) {
                    SingleFileLoader.enableParser(parsers[c]);
                }
            };

            Object.defineProperty(SingleFileLoader.prototype, "url", {
                get: // Get / Set
                function () {
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
                //var urlLoader   : away.net.URLLoader;
                var dataFormat;
                var loaderType = away.loaders.ParserLoaderType.URL_LOADER;

                this._loadAsRawData = loadAsRawData;
                this._req = urlRequest;

                this.decomposeFilename(this._req.url);

                if (this._loadAsRawData) {
                    // Always use binary for raw data loading
                    dataFormat = away.net.URLLoaderDataFormat.BINARY;
                } else {
                    if (parser) {
                        this._parser = parser;
                    }

                    if (!this._parser) {
                        this._parser = this.getParserFromSuffix();
                    }

                    console.log('SingleFileURLLoader.load._parser: ' + this._parser);

                    if (this._parser) {
                        switch (this._parser.dataFormat) {
                            case away.loaders.ParserDataFormat.BINARY:
                                dataFormat = away.net.URLLoaderDataFormat.BINARY;

                                break;

                            case away.loaders.ParserDataFormat.PLAIN_TEXT:
                                dataFormat = away.net.URLLoaderDataFormat.TEXT;

                                break;
                        }

                        switch (this._parser.loaderType) {
                            case away.loaders.ParserLoaderType.IMG_LOADER:
                                loaderType = away.loaders.ParserLoaderType.IMG_LOADER;

                                break;

                            case away.loaders.ParserLoaderType.URL_LOADER:
                                loaderType = away.loaders.ParserLoaderType.URL_LOADER;

                                break;
                        }
                    } else {
                        // Always use BINARY for unknown file formats. The thorough
                        // file type check will determine format after load, and if
                        // binary, a text load will have broken the file data.
                        dataFormat = away.net.URLLoaderDataFormat.BINARY;
                    }
                }

                console.log('SingleFileURLLoader.load.dataFormat:', dataFormat, 'ParserFormat: ', this._parser.dataFormat);
                console.log('SingleFileURLLoader.load.loaderType: ', loaderType);

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
                if (data.constructor === Function) {
                    data = new data();
                }

                if (parser)
                    this._parser = parser;

                this._req = req;

                this.parse(data);
            };

            Object.defineProperty(SingleFileLoader.prototype, "parser", {
                get: /**
                * A reference to the parser that will translate the loaded data into a usable resource.
                */
                function () {
                    return this._parser;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SingleFileLoader.prototype, "dependencies", {
                get: /**
                * A list of dependencies that need to be loaded and resolved for the loaded object.
                */
                function () {
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
                    case away.loaders.ParserLoaderType.IMG_LOADER:
                        loader = new away.loaders.SingleFileImageLoader();

                        break;

                    case away.loaders.ParserLoaderType.URL_LOADER:
                        loader = new away.loaders.SingleFileURLLoader();

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

                    console.log('SingleFileURLLoader.getParserFromSuffix.supportstype', supportstype);

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
                this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this._req.url, true));
            };

            /**
            * Called when loading of a file is complete
            */
            SingleFileLoader.prototype.handleUrlLoaderComplete = function (event) {
                var urlLoader = event.target;
                this.removeListeners(urlLoader);

                this._data = urlLoader.data;

                console.log('SingleFileURLLoader.handleUrlLoaderComplete', this._data.length);

                if (this._loadAsRawData) {
                    // No need to parse this data, which should be returned as is
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE));
                } else {
                    this.parse(this._data);
                }
            };

            /**
            * Initiates parsing of the loaded data.
            * @param data The data to be parsed.
            */
            SingleFileLoader.prototype.parse = function (data) {
                console.log('SingleFileURLLoader.parse', data);

                if (!this._parser) {
                    this._parser = this.getParserFromData(data);
                }

                if (this._parser) {
                    this._parser.addEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
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
                    this._parser.addEventListener(away.events.AssetEvent.MESH_COMPLETE, this.onAssetComplete, this);
                    this._parser.addEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this);
                    this._parser.addEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this);
                    this._parser.addEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete, this);

                    if (this._req && this._req.url) {
                        this._parser._iFileName = this._req.url;
                    }

                    this._parser.materialMode = this._materialMode;
                    this._parser.parseAsync(data);
                } else {
                    var msg = "No parser defined. To enable all parsers for auto-detection, use Parsers.enableAllBundled()";

                    //if(hasEventListener(LoaderEvent.LOAD_ERROR)){
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, "", true, msg));
                }
            };

            SingleFileLoader.prototype.onParseError = function (event) {
                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onReadyForDependencies = function (event) {
                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onAssetComplete = function (event) {
                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onTextureSizeError = function (event) {
                this.dispatchEvent(event.clone());
            };

            /**
            * Called when parsing is complete.
            */
            SingleFileLoader.prototype.onParseComplete = function (event) {
                this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.url));

                this._parser.removeEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
                this._parser.removeEventListener(away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete, this);
                this._parser.removeEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParseError, this);
                this._parser.removeEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                this._parser.removeEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.ANIMATION_SET_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.ANIMATION_STATE_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.ANIMATION_NODE_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.STATE_TRANSITION_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.TEXTURE_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.CONTAINER_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.GEOMETRY_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.MATERIAL_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.MESH_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this);
                this._parser.removeEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete, this);
            };
            SingleFileLoader._parsers = new Array(away.loaders.ImageParser);
            return SingleFileLoader;
        })(away.events.EventDispatcher);
        loaders.SingleFileLoader = SingleFileLoader;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="../../library/assets/IAsset.ts" />
    ///<reference path="../../loaders/parsers/ParserBase.ts" />
    ///<reference path="SingleFileLoader.ts" />
    ///<reference path="../../net/URLRequest.ts" />
    (function (loaders) {
        //import away3d.arcane;
        //import away3d.library.assets.IAsset;
        //import away3d.loaders.parsers.ParserBase;
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

                this._assets = new Array();
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
                get: /**
                * The data containing the dependency to be parsed, if the resource was already loaded.
                */
                function () {
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
                get: /**
                * The parser which is dependent on this ResourceDependency object.
                */
                function () {
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
        loaders.ResourceDependency = ResourceDependency;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../errors/Error.ts" />
    ///<reference path="../events/LoaderEvent.ts" />
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/ParserEvent.ts" />
    ///<reference path="misc/AssetLoaderContext.ts" />
    ///<reference path="misc/AssetLoaderToken.ts" />
    ///<reference path="misc/ResourceDependency.ts" />
    ///<reference path="misc/SingleFileLoader.ts" />
    ///<reference path="parsers/ParserBase.ts" />
    ///<reference path="../net/URLLoader.ts" />
    ///<reference path="../net/URLRequest.ts" />
    (function (loaders) {
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
                get: /**
                * Returns the base dependency of the loader
                */
                function () {
                    return this._baseDependency;
                },
                enumerable: true,
                configurable: true
            });

            AssetLoader.enableParser = /**
            * Enables a specific parser.
            * When no specific parser is set for a loading/parsing opperation,
            * loader3d can autoselect the correct parser to use.
            * A parser must have been enabled, to be considered when autoselecting the parser.
            *
            * @param parserClass The parser class to enable.
            *
            * @see away3d.loaders.parsers.Parsers
            */
            function (parserClass) {
                away.loaders.SingleFileLoader.enableParser(parserClass);
            };

            AssetLoader.enableParsers = /**
            * Enables a list of parsers.
            * When no specific parser is set for a loading/parsing opperation,
            * AssetLoader can autoselect the correct parser to use.
            * A parser must have been enabled, to be considered when autoselecting the parser.
            *
            * @param parserClasses A Vector of parser classes to enable.
            * @see away3d.loaders.parsers.Parsers
            */
            function (parserClasses) {
                away.loaders.SingleFileLoader.enableParsers(parserClasses);
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
                    this._token = new away.loaders.AssetLoaderToken(this);

                    this._uri = req.url = req.url.replace(/\\/g, "/");
                    this._context = context;
                    this._namespace = ns;

                    this._baseDependency = new away.loaders.ResourceDependency('', req, null, null);
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
                    this._token = new away.loaders.AssetLoaderToken(this);

                    this._uri = id;
                    this._context = context;
                    this._namespace = ns;

                    this._baseDependency = new loaders.ResourceDependency(id, null, data, null);
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
                    this._loadingDependency._iLoader.parser._iResumeParsingAfterDependencies();
                    this._stack.pop();
                } else if (this._stack.length) {
                    var prev = this._loadingDependency;

                    this._loadingDependency = this._stack.pop();

                    if (prev._iSuccess) {
                        prev.resolve();
                    }

                    this.retrieveNext(parser);
                } else {
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.RESOURCE_COMPLETE, this._uri));
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
                this._loadingDependency._iLoader = new away.loaders.SingleFileLoader(matMode);

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
                        this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this._loadingDependency.request.url, true));
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

                if (this._context && this._context._iHasMappingForUrl(url))
                    return this._context._iGetRemappedUrl(url);

                if (url == this._uri) {
                    return url;
                }

                // Absolute URL? Check if starts with slash or a URL
                // scheme definition (e.g. ftp://, http://, file://)
                scheme_re = new RegExp('/^[a-zA-Z]{3,4}:\/\//');

                if (url.charAt(0) == '/') {
                    if (this._context && this._context.overrideAbsolutePaths)
                        return this.joinUrl(this._context.dependencyBaseUrl, url); else
                        return url;
                } else if (scheme_re.test(url)) {
                    if (this._context && this._context.overrideFullURLs) {
                        var noscheme_url;

                        noscheme_url = url['replace'](scheme_re);

                        return this.joinUrl(this._context.dependencyBaseUrl, noscheme_url);
                    }
                }

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

                event = new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, this._uri, isDependency, event.message);

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

                if (handled) {
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
                }

                if (handled) {
                    this.dispose();
                    return;
                } else {
                    throw new Error(event.message);
                }
            };

            AssetLoader.prototype.onAssetComplete = function (event) {
                if (event.type == away.events.AssetEvent.ASSET_COMPLETE) {
                    if (this._loadingDependency) {
                        this._loadingDependency.assets.push(event.asset);
                    }

                    event.asset.resetAssetPath(event.asset.name, this._namespace);
                }

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

                this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.DEPENDENCY_COMPLETE, event.url));
                this.removeEventListeners(loader);

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
                loader.addEventListener(away.events.AssetEvent.ANIMATION_SET_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.ANIMATION_STATE_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.ANIMATION_NODE_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.STATE_TRANSITION_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.TEXTURE_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.CONTAINER_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.GEOMETRY_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.MATERIAL_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.MESH_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.ENTITY_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.SKELETON_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.AssetEvent.SKELETON_POSE_COMPLETE, this.onAssetComplete, this);
                loader.addEventListener(away.events.ParserEvent.READY_FOR_DEPENDENCIES, this.onReadyForDependencies, this);
                loader.addEventListener(away.events.ParserEvent.PARSE_ERROR, this.onParserError, this);
            };

            AssetLoader.prototype.removeEventListeners = function (loader) {
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
        loaders.AssetLoader = AssetLoader;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
///<reference path="../src/away/loaders/AssetLoader.ts"/>
//<reference path="../src/away/library/assets/IAsset.ts"/>
//<reference path="../src/away/loaders/misc/SingleFileLoader.ts"/>
//<reference path="../src/away/loaders/misc/AssetLoaderContext.ts"/>
//<reference path="../src/away/loaders/parsers/ParserBase.ts"/>
//<reference path="../src/away/loaders/parsers/ParserDataFormat.ts"/>
//<reference path="../src/away/loaders/misc/SingleFileImageLoader.ts"/>
//<reference path="../src/away/loaders/misc/SingleFileURLLoader.ts"/>
//<reference path="../src/away/textures/TextureProxyBase.ts"/>
//<reference path="../src/away/display3D/Context3D.ts"/>
//<reference path="../src/away/display/Stage3D.ts"/>
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/AssetLoaderTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/AssetLoaderTest.js
//------------------------------------------------------------------------------------------------
var tests;
(function (tests) {
    var AssetLoaderTest = (function () {
        function AssetLoaderTest() {
            this.urlRq = new away.net.URLRequest('URLLoaderTestData/2.png');
            this.assetLoader = new away.loaders.AssetLoader();

            this.token = this.assetLoader.load(this.urlRq);

            console.log('token', this.token);

            this.token.addEventListener(away.events.Event.COMPLETE, this.onComplete, this);
            this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
        }
        AssetLoaderTest.prototype.onComplete = function (e) {
            console.log('onComplete');
        };

        AssetLoaderTest.prototype.onAssetComplete = function (e) {
            console.log('--------------------------------------------------------------------------------');
            console.log('onAssetComplete');
            console.log('--------------------------------------------------------------------------------');
        };
        return AssetLoaderTest;
    })();
    tests.AssetLoaderTest = AssetLoaderTest;
})(tests || (tests = {}));

var GL = null;

window.onload = function () {
    var test = new tests.AssetLoaderTest();
    var canvas = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");
};
//@ sourceMappingURL=AssetLoaderTest.js.map
