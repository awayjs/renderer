var away;
(function (away) {
    (function (events) {
        var Event = (function () {
            function Event(type) {
                this.type = undefined;
                this.target = undefined;
                this.type = type;
            }
            Event.COMPLETE = 'Event_Complete';
            Event.OPEN = 'Event_Open';
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
    (function (events) {
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this.listeners = new Array();
            }
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

            EventDispatcher.prototype.removeEventListener = function (type, listener, target) {
                var index = this.getEventListenerIndex(type, listener, target);

                if (index !== -1) {
                    this.listeners[type].splice(index, 1);
                }
            };

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

            EventDispatcher.prototype.hasEventListener = function (type, listener, target) {
                return (this.getEventListenerIndex(type, listener, target) !== -1);
            };
            return EventDispatcher;
        })();
        events.EventDispatcher = EventDispatcher;

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
    (function (net) {
        var URLVariables = (function () {
            function URLVariables(source) {
                if (typeof source === "undefined") { source = null; }
                this._variables = new Object();
                if (source !== null) {
                    this.decode(source);
                }
            }
            URLVariables.prototype.decode = function (source) {
                source = source.split("+").join(" ");

                var tokens, re = /[?&]?([^=]+)=([^&]*)/g;

                while (tokens = re.exec(source)) {
                    this._variables[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
                }
            };

            URLVariables.prototype.toString = function () {
                return '';
            };

            Object.defineProperty(URLVariables.prototype, "variables", {
                get: function () {
                    return this._variables;
                },
                set: function (obj) {
                    this._variables = obj;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLVariables.prototype, "formData", {
                get: function () {
                    var fd = new FormData();

                    for (var s in this._variables) {
                        console.log(s, this._variables[s]);
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
    (function (net) {
        var URLRequest = (function () {
            function URLRequest(url) {
                if (typeof url === "undefined") { url = null; }
                this.contentType = 'application/x-www-form-urlencoded';
                this.method = away.net.URLRequestMethod.GET;
                this.async = true;
                this._url = url;
            }
            Object.defineProperty(URLRequest.prototype, "url", {
                get: function () {
                    return this._url;
                },
                set: function (value) {
                    this._url = value;
                },
                enumerable: true,
                configurable: true
            });

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
            URLLoaderDataFormat.BINARY = 'binary';
            URLLoaderDataFormat.TEXT = 'text';
            URLLoaderDataFormat.VARIABLES = 'variables';
            return URLLoaderDataFormat;
        })();
        net.URLLoaderDataFormat = URLLoaderDataFormat;
    })(away.net || (away.net = {}));
    var net = away.net;
})(away || (away = {}));
var away;
(function (away) {
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
            URLLoader.prototype.load = function (request) {
                this.initXHR();
                this._request = request;

                if (request.method === away.net.URLRequestMethod.POST) {
                    this.postRequest(request);
                } else {
                    this.getRequest(request);
                }
            };

            URLLoader.prototype.close = function () {
                this._XHR.abort();
                this.destroyXHR();
            };


            Object.defineProperty(URLLoader.prototype, "dataFormat", {
                get: function () {
                    return this._dataFormat;
                },
                set: function (format) {
                    if (format === away.net.URLLoaderDataFormat.BINARY || format === away.net.URLLoaderDataFormat.TEXT || format === away.net.URLLoaderDataFormat.VARIABLES) {
                        this._dataFormat = format;
                    } else {
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(URLLoader.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            URLLoader.prototype.getRequest = function (request) {
                this._XHR.open(request.method, request.url, request.async);
                this._XHR.send();
            };

            URLLoader.prototype.postRequest = function (request) {
                this._loadError = false;

                this._XHR.open(request.method, request.url, request.async);

                if (request.data != null) {
                    if (request.data instanceof away.net.URLVariables) {
                        var urlVars = request.data;

                        this._XHR.responseType = 'text';
                        this._XHR.send(urlVars.formData);
                    } else {
                        this._XHR.send();
                    }
                } else {
                    this._XHR.send();
                }
            };

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

            URLLoader.prototype.destroyXHR = function () {
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

            URLLoader.prototype.decodeURLVariables = function (source) {
                var result = new Object();

                source = source.split("+").join(" ");

                var tokens, re = /[?&]?([^=]+)=([^&]*)/g;

                while (tokens = re.exec(source)) {
                    result[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
                }

                return result;
            };

            URLLoader.prototype.onReadyStateChange = function (event) {
                if (this._XHR.readyState == 4) {
                    if (this._XHR.status == 404) {
                        this._loadError = true;
                        this.dispatchEvent(new away.events.IOErrorEvent(away.events.IOErrorEvent.IO_ERROR));
                    }
                }

                this.dispatchEvent(new away.events.HTTPStatusEvent(away.events.HTTPStatusEvent.HTTP_STATUS, this._XHR.status));
            };

            URLLoader.prototype.onLoadEnd = function (event) {
                if (this._loadError === true)
                    return;
            };

            URLLoader.prototype.onTimeOut = function (event) {
            };

            URLLoader.prototype.onAbort = function (event) {
            };

            URLLoader.prototype.onProgress = function (event) {
                var progressEvent = new away.events.ProgressEvent(away.events.ProgressEvent.PROGRESS);

                progressEvent.bytesLoaded = event.loaded;
                progressEvent.bytesLoaded = event.total;

                this.dispatchEvent(progressEvent);
            };

            URLLoader.prototype.onLoadStart = function (event) {
                this.dispatchEvent(new away.events.Event(away.events.Event.OPEN));
            };

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

                    case away.net.URLLoaderDataFormat.BINARY:
                        break;

                    default:
                        this._data = this._XHR.responseText;

                        break;
                }

                this.dispatchEvent(new away.events.Event(away.events.Event.COMPLETE));
            };

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
var LoaderTest = (function () {
    function LoaderTest() {
        this.urlLoaderPostURLVars = new away.net.URLLoader();
        this.urlLoaderPostURLVars.dataFormat = away.net.URLLoaderDataFormat.VARIABLES;

        var urlStr = 'fname=karim&lname=' + Math.floor(Math.random() * 100);
        var urlVars = new away.net.URLVariables(urlStr);

        var req = new away.net.URLRequest('URLLoaderTestData/saveData.php');
        req.method = away.net.URLRequestMethod.POST;
        req.data = urlVars;

        this.urlLoaderPostURLVars.addEventListener(away.events.Event.COMPLETE, this.postURLTestComplete, this);

        var csrReq = new away.net.URLRequest('URLLoaderTestData/airports.csv');

        this.urlLoaderGetCSV = new away.net.URLLoader();
        this.urlLoaderGetCSV.dataFormat = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderGetCSV.addEventListener(away.events.Event.COMPLETE, this.getCsvComplete, this);
        this.urlLoaderGetCSV.addEventListener(away.events.Event.OPEN, this.getCsvOpen, this);

        var errorReq = new away.net.URLRequest('URLLoaderTestData/generatingError');

        this.urlLoaderErrorTest = new away.net.URLLoader();
        this.urlLoaderErrorTest.dataFormat = away.net.URLLoaderDataFormat.TEXT;
        this.urlLoaderErrorTest.addEventListener(away.events.Event.COMPLETE, this.errorComplete, this);
        this.urlLoaderErrorTest.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.ioError, this);
        this.urlLoaderErrorTest.addEventListener(away.events.HTTPStatusEvent.HTTP_STATUS, this.httpStatusChange, this);

        var csrReq = new away.net.URLRequest('URLLoaderTestData/getUrlVars.php');

        this.urlLoaderGetURLVars = new away.net.URLLoader();
        this.urlLoaderGetURLVars.dataFormat = away.net.URLLoaderDataFormat.VARIABLES;
        this.urlLoaderGetURLVars.addEventListener(away.events.Event.COMPLETE, this.getURLVarsComplete, this);
        this.urlLoaderGetURLVars.load(csrReq);
    }
    LoaderTest.prototype.getURLVarsComplete = function (event) {
        var loader = event.target;
        console.log('getURLVarsComplete', loader.data);
    };

    LoaderTest.prototype.httpStatusChange = function (event) {
        console.log('httpStatusChange', event.status);
    };

    LoaderTest.prototype.ioError = function (event) {
        var loader = event.target;
        console.log('ioError');
    };

    LoaderTest.prototype.errorComplete = function (event) {
        var loader = event.target;
        console.log('errorComplete');
    };

    LoaderTest.prototype.postURLTestComplete = function (event) {
        var loader = event.target;
        console.log('postURLTestComplete', loader.data);
    };

    LoaderTest.prototype.getCsvComplete = function (event) {
        var loader = event.target;
        console.log('getCsvComplete');
    };

    LoaderTest.prototype.getCsvOpen = function (event) {
        var loader = event.target;
        console.log('getCsvOpen');
    };
    return LoaderTest;
})();

window.onload = function () {
    var test = new LoaderTest();
};
//@ sourceMappingURL=URLLoaderTests.js.map
