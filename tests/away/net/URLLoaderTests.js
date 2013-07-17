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
            Event.CHANGE = "change";
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
/**
* ...
* @author Gary Paluk - http://www.plugin.io / Karim Beyrouti - http://kurst.co.uk
*/
///<reference path="../src/away/events/Event.ts" />
///<reference path="../src/away/events/IOErrorEvent.ts" />
///<reference path="../src/away/events/HTTPStatusEvent.ts" />
///<reference path="../src/away/net/URLLoader.ts" />
///<reference path="../src/away/net/URLRequest.ts" />
///<reference path="../src/away/net/URLVariables.ts" />
///<reference path="../src/away/net/URLRequestMethod.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/URLLoaderTests.ts --target ES5 --comments --out $ProjectFileDir$/tests/URLLoaderTests.js
//------------------------------------------------------------------------------------------------
var LoaderTest = (function () {
    function LoaderTest() {
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // POST URL Variables to PHP script
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        this.urlLoaderPostURLVars = new away.net.URLLoader();
        this.urlLoaderPostURLVars.dataFormat = away.net.URLLoaderDataFormat.VARIABLES;

        var urlStr = 'fname=karim&lname=' + Math.floor(Math.random() * 100);
        var urlVars = new away.net.URLVariables(urlStr);

        var req = new away.net.URLRequest('URLLoaderTestData/saveData.php');
        req.method = away.net.URLRequestMethod.POST;
        req.data = urlVars;

        this.urlLoaderPostURLVars.addEventListener(away.events.Event.COMPLETE, this.postURLTestComplete, this);
        this.urlLoaderPostURLVars.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
        this.urlLoaderPostURLVars.load(req);

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // GET CSV File
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        var csrReq = new away.net.URLRequest('URLLoaderTestData/airports.csv');

        this.urlLoaderGetCSV = new away.net.URLLoader();
        this.urlLoaderGetCSV.dataFormat = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderGetCSV.addEventListener(away.events.Event.COMPLETE, this.getCsvComplete, this);
        this.urlLoaderGetCSV.addEventListener(away.events.Event.OPEN, this.getCsvOpen, this);
        this.urlLoaderGetCSV.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
        this.urlLoaderGetCSV.load(csrReq);

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // ERROR test - load a non-existing object
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        var errorReq = new away.net.URLRequest('URLLoaderTestData/generatingError');

        this.urlLoaderErrorTest = new away.net.URLLoader();
        this.urlLoaderErrorTest.dataFormat = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderErrorTest.addEventListener(away.events.Event.COMPLETE, this.errorComplete, this);
        this.urlLoaderErrorTest.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
        this.urlLoaderErrorTest.addEventListener(away.events.HTTPStatusEvent.HTTP_STATUS, this.httpStatusChange, this);
        this.urlLoaderErrorTest.load(errorReq);

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // GET URL Vars - get URL variables
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        var csrReq = new away.net.URLRequest('URLLoaderTestData/getUrlVars.php');

        this.urlLoaderGetURLVars = new away.net.URLLoader();
        this.urlLoaderGetURLVars.dataFormat = away.net.URLLoaderDataFormat.VARIABLES;
        this.urlLoaderGetURLVars.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
        this.urlLoaderGetURLVars.addEventListener(away.events.Event.COMPLETE, this.getURLVarsComplete, this);
        this.urlLoaderGetURLVars.load(csrReq);

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // LOAD Binary file
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        var binReq = new away.net.URLRequest('URLLoaderTestData/suzanne.awd');

        this.urlLoaderBinary = new away.net.URLLoader();
        this.urlLoaderBinary.dataFormat = away.net.URLLoaderDataFormat.BINARY;
        this.urlLoaderBinary.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
        this.urlLoaderBinary.addEventListener(away.events.Event.COMPLETE, this.binFileLoaded, this);
        this.urlLoaderBinary.load(binReq);

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // LOAD Blob file
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        var blobReq = new away.net.URLRequest('URLLoaderTestData/2.png');

        this.urlLoaderBlob = new away.net.URLLoader();
        this.urlLoaderBlob.dataFormat = away.net.URLLoaderDataFormat.BLOB;
        this.urlLoaderBlob.addEventListener(away.events.Event.COMPLETE, this.blobFileLoaded, this);
        this.urlLoaderBlob.load(blobReq);

        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        // ARRAY_BUFFER Test
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        var arrBReq = new away.net.URLRequest('URLLoaderTestData/1.jpg');

        this.urlLoaderArrb = new away.net.URLLoader();
        this.urlLoaderArrb.dataFormat = away.net.URLLoaderDataFormat.ARRAY_BUFFER;
        this.urlLoaderArrb.addEventListener(away.events.Event.COMPLETE, this.arrayBufferLoaded, this);
        this.urlLoaderArrb.load(arrBReq);
    }
    LoaderTest.prototype.arrayBufferLoaded = function (event) {
        var arrayBuffer = this.urlLoaderArrb.data;
        var byteArray = new Uint8Array(arrayBuffer);

        console.log('LoaderTest.arrayBufferLoaded', byteArray[1]);

        for (var i = 0; i < byteArray.byteLength; i++) {
        }
    };

    LoaderTest.prototype.blobFileLoaded = function (event) {
        var blob = new Blob([this.urlLoaderBlob.data], { type: 'image/png' });
        var img = document.createElement('img');
        img.src = this.createObjectURL(blob);
        img.onload = function (e) {
            window['URL']['revokeObjectURL'](img.src);
        };

        console.log('LoaderTest.blobFileLoaded', blob);

        document.body.appendChild(img);
    };

    LoaderTest.prototype.createObjectURL = function (fileBlob) {
        if (window['URL']) {
            if (window['URL']['createObjectURL']) {
                return window['URL']['createObjectURL'](fileBlob);
            }
        } else {
            if (window['webkitURL']) {
                return window['webkitURL']['createObjectURL'](fileBlob);
            }
        }

        return null;
    };

    LoaderTest.prototype.binFileLoaded = function (event) {
        var loader = event.target;
        console.log('LoaderTest.binFileLoaded', loader.data.length);
    };

    LoaderTest.prototype.getURLVarsComplete = function (event) {
        var loader = event.target;
        console.log('LoaderTest.getURLVarsComplete', loader.data);
    };

    LoaderTest.prototype.httpStatusChange = function (event) {
        console.log('LoaderTest.httpStatusChange', event.status);
    };

    LoaderTest.prototype.ioError = function (event) {
        var loader = event.target;
        console.log('LoaderTest.ioError', loader.request.url);
    };

    LoaderTest.prototype.errorComplete = function (event) {
        var loader = event.target;
        console.log('LoaderTest.errorComplete');
    };

    LoaderTest.prototype.postURLTestComplete = function (event) {
        var loader = event.target;
        console.log('LoaderTest.postURLTestComplete', loader.data);
    };

    LoaderTest.prototype.getCsvComplete = function (event) {
        var loader = event.target;
        console.log('LoaderTest.getCsvComplete');
    };

    LoaderTest.prototype.getCsvOpen = function (event) {
        var loader = event.target;
        console.log('LoaderTest.getCsvOpen');
    };
    return LoaderTest;
})();

window.onload = function () {
    var test = new LoaderTest();
};
//@ sourceMappingURL=URLLoaderTests.js.map
