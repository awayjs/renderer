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
            return Event;
        })();
        events.Event = Event;
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="Event.ts" />
    (function (events) {
        var AwayEvent = (function (_super) {
            __extends(AwayEvent, _super);
            function AwayEvent(type, message) {
                if (typeof message === "undefined") { message = ""; }
                _super.call(this, type);
                this.message = message;
            }
            AwayEvent.CONTEXT3D_CREATE = "context3DCreate";
            AwayEvent.ERROR = "context3DERROR";
            return AwayEvent;
        })(away.events.Event);
        events.AwayEvent = AwayEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
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
    (function (net) {
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

                if (this._request) {
                    this._request.dispose();
                }

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
    ///<reference path="Event.ts" />
    ///<reference path="../loaders/parsers/ParserBase.ts" />
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
    ///<reference path="../library/assets/IAsset.ts" />
    ///<reference path="../loaders/parsers/ParserBase.ts" />
    ///<reference path="../loaders/SingleFileLoader.ts" />
    ///<reference path="../net/URLRequest.ts" />
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
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/TimerEvent.ts" />
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
                    throw new Error("Delay is negative or not a number");
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
    ///<reference path="../../loaders/ResourceDependency.ts" />
    ///<reference path="../../utils/Timer.ts" />
    ///<reference path="../../utils/getTimer.ts" />
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
            *
            * @see away3d.loading.parsers.ParserDataFormat
            */
            function ParserBase(format) {
                _super.call(this);

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
                //TODO: Throw error ?
                return false;
            };


            Object.defineProperty(ParserBase.prototype, "parsingFailure", {
                get: function () {
                    return this._parsingFailure;
                },
                set: /**
                * Validates a bitmapData loaded before assigning to a default BitmapMaterial
                */
                /* TODO: implement
                public isBitmapDataValid(bitmapData: BitmapData) : boolean
                {
                var isValid:boolean = TextureUtils.isBitmapDataValid(bitmapData);
                if(!isValid) trace(">> Bitmap loaded is not having power of 2 dimensions or is higher than 2048");
                
                return isValid;
                }
                */
                function (b) {
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
            };

            /**
            * Resolve a dependency loading failure. Used by parser to eventually provide a default map
            *
            * @param resourceDependency The dependency to be resolved.
            */
            ParserBase.prototype._iResolveDependencyFailure = function (resourceDependency) {
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
                //TODO: Throw  - throw new AbstractMethodError();
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
    (function (loaders) {
        /**
        * An enumeration providing values to describe the data format of parsed data.
        */
        var ParserDataFormat = (function () {
            function ParserDataFormat() {
            }
            ParserDataFormat.BINARY = "binary";

            ParserDataFormat.PLAIN_TEXT = "plainText";
            return ParserDataFormat;
        })();
        loaders.ParserDataFormat = ParserDataFormat;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/Event.ts" />
    ///<reference path="../events/IOErrorEvent.ts" />
    ///<reference path="../events/HTTPStatusEvent.ts" />
    ///<reference path="../events/ProgressEvent.ts" />
    ///<reference path="../events/AwayEvent.ts" />
    ///<reference path="../events/LoaderEvent.ts" />
    ///<reference path="../net/URLRequest.ts" />
    ///<reference path="../net/URLLoaderDataFormat.ts" />
    ///<reference path="../net/URLRequestMethod.ts" />
    ///<reference path="../net/URLRequest.ts" />
    ///<reference path="../net/URLLoader.ts" />
    ///<reference path="../loaders/parsers/ParserBase.ts" />
    ///<reference path="../loaders/parsers/ParserDataFormat.ts" />
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
            /**
            * Creates a new SingleFileLoader object.
            */
            function SingleFileLoader(materialMode) {
                if (typeof materialMode === "undefined") { materialMode = 0; }
                _super.call(this);
                this._materialMode = materialMode;
            }
            Object.defineProperty(SingleFileLoader.prototype, "url", {
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

            SingleFileLoader.enableParser = function (parser) {
                if (this._parsers.indexOf(parser) < 0) {
                    this._parsers.push(parser);
                }
            };

            SingleFileLoader.enableParsers = function (parsers) {
                var pc;

                for (var c = 0; c < parsers.length; c++) {
                    this.enableParser(parsers[c]);
                }
            };

            /**
            * Load a resource from a file.
            *
            * @param urlRequest The URLRequest object containing the URL of the object to be loaded.
            * @param parser An optional parser object that will translate the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
            */
            SingleFileLoader.prototype.load = function (urlRequest, parser, loadAsRawData) {
                if (typeof parser === "undefined") { parser = null; }
                if (typeof loadAsRawData === "undefined") { loadAsRawData = false; }
                var urlLoader;
                var dataFormat;

                this._loadAsRawData = loadAsRawData;
                this._req = urlRequest;
                this.decomposeFilename(this._req.url);

                if (this._loadAsRawData) {
                    // Always use binary for raw data loading
                    dataFormat = away.net.URLLoaderDataFormat.BINARY;
                } else {
                    if (parser)
                        this._parser = parser;

                    if (!this._parser)
                        this._parser = this.getParserFromSuffix();

                    if (this._parser) {
                        switch (this._parser.dataFormat) {
                            case away.loaders.ParserDataFormat.BINARY:
                                dataFormat = away.net.URLLoaderDataFormat.BINARY;
                                break;
                            case away.loaders.ParserDataFormat.PLAIN_TEXT:
                                dataFormat = away.net.URLLoaderDataFormat.TEXT;
                                break;
                        }
                    } else {
                        // Always use BINARY for unknown file formats. The thorough
                        // file type check will determine format after load, and if
                        // binary, a text load will have broken the file data.
                        dataFormat = away.net.URLLoaderDataFormat.BINARY;
                    }
                }

                urlLoader = new away.net.URLLoader();
                urlLoader.dataFormat = dataFormat;
                urlLoader.addEventListener(away.events.Event.COMPLETE, this.handleUrlLoaderComplete, this);
                urlLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.handleUrlLoaderError, this);
                urlLoader.load(urlRequest);
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
                    if (SingleFileLoader._parsers[i]['supportsType'](this._fileExtension))
                        return new SingleFileLoader._parsers[i]();
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

                    if (this._req && this._req.url)
                        this._parser._iFileName = this._req.url;
                    this._parser.materialMode = this._materialMode;
                    this._parser.parseAsync(data);
                } else {
                    var msg = "No parser defined. To enable all parsers for auto-detection, use Parsers.enableAllBundled()";

                    //if(hasEventListener(LoaderEvent.LOAD_ERROR)){
                    this.dispatchEvent(new away.events.LoaderEvent(away.events.LoaderEvent.LOAD_ERROR, "", true, msg));
                }
            };

            SingleFileLoader.prototype.onParseError = function (event) {
                //if(this.hasEventListener(away.events.ParserEvent.PARSE_ERROR , this ))
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
            SingleFileLoader._parsers = new Array();
            return SingleFileLoader;
        })(away.events.EventDispatcher);
        loaders.SingleFileLoader = SingleFileLoader;
    })(away.loaders || (away.loaders = {}));
    var loaders = away.loaders;
})(away || (away = {}));
//<reference path="../src/away/events/Event.ts" />
//<reference path="../src/away/events/IOErrorEvent.ts" />
//<reference path="../src/away/events/HTTPStatusEvent.ts" />
//<reference path="../src/away/net/URLLoader.ts" />
//<reference path="../src/away/net/URLRequest.ts" />
//<reference path="../src/away/net/URLVariables.ts" />
//<reference path="../src/away/net/URLRequestMethod.ts" />
///<reference path="../src/away/library/assets/IAsset.ts"/>
///<reference path="../src/away/loaders/SingleFileLoader.ts"/>
///<reference path="../src/away/loaders/parsers/ParserBase.ts"/>
///<reference path="../src/away/loaders/parsers/ParserDataFormat.ts"/>
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/SimpleLoaderTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/SimpleLoaderTest.js
//------------------------------------------------------------------------------------------------
var tests;
(function (tests) {
    var SimpleLoaderTest = (function () {
        function SimpleLoaderTest() {
            this.iAssetTest = new tests.IAssetTest();
            //------------------------------------------------------------------------------------------
            // Simple Loader - instantiated to validate against compiler - needs test implementation ( and a parser )
            //------------------------------------------------------------------------------------------
            this.simpleLoader = new away.loaders.SingleFileLoader(1);

            //------------------------------------------------------------------------------------------
            // Parser Base - instantiated to validate against compiler
            //------------------------------------------------------------------------------------------
            this.parserBase = new away.loaders.ParserBase(away.loaders.ParserDataFormat.PLAIN_TEXT);

            //------------------------------------------------------------------------------------------
            // IAsset - Interface Test
            //------------------------------------------------------------------------------------------
            this.iAssetTest.name = 'Karim Beyrouti';
            this.iAssetTest.id = '555555+';
            this.iAssetTest.dispose();

            var iTest = this.iAssetTest;

            console.log(iTest.name);
            console.log(iTest.id);
        }
        return SimpleLoaderTest;
    })();
    tests.SimpleLoaderTest = SimpleLoaderTest;

    //*
    // Test implmentatoin for IAsset
    var IAssetTest = (function () {
        function IAssetTest() {
        }
        Object.defineProperty(IAssetTest.prototype, "id", {
            get: function () {
                return this._id;
            },
            set: function (value) {
                this._id = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IAssetTest.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IAssetTest.prototype, "assetNamespace", {
            get: function () {
                return this._assetNamespace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IAssetTest.prototype, "assetType", {
            get: function () {
                return this._assetType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IAssetTest.prototype, "assetFullPath", {
            get: function () {
                return this._assetFullPath;
            },
            enumerable: true,
            configurable: true
        });
        IAssetTest.prototype.assetPathEquals = function (name, ns) {
            return true;
        };
        IAssetTest.prototype.resetAssetPath = function (name, ns, overrideOriginal) {
        };
        IAssetTest.prototype.dispose = function () {
        };
        return IAssetTest;
    })();
    tests.IAssetTest = IAssetTest;
})(tests || (tests = {}));
window.onload = function () {
    var test = new tests.SimpleLoaderTest();
};
//@ sourceMappingURL=SimpleLoaderTest.js.map
