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
        var IMGLoader = (function (_super) {
            __extends(IMGLoader, _super);
            function IMGLoader(imageName) {
                if (typeof imageName === "undefined") { imageName = ''; }
                _super.call(this);
                this._name = '';
                this._loaded = false;
                this._name = imageName;
            }
            // Public
            /**
            * load an image
            * @param request {away.net.URLRequest}
            */
            IMGLoader.prototype.load = function (request) {
                this._loaded = false;
                this.initImage();
                this._request = request;
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
                    this._request.dispose();
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
    ///<reference path="../net/IMGLoader.ts" />
    ///<reference path="../geom/Rectangle.ts" />
    ///<reference path="../geom/Point.ts" />
    (function (display) {
        /**
        *
        */
        var BitmapData = (function () {
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
                this._context.drawImage(img, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
            };

            /**
            *
            * @param bmpd
            * @param sourceRect
            * @param destRect
            */
            BitmapData.prototype.copyPixels = function (bmpd, sourceRect, destRect) {
                this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
            };

            /**
            *
            * @param rect
            * @param color
            */
            BitmapData.prototype.fillRect = function (rect, color) {
                this._context.fillStyle = '#' + this.decimalToHex(color, 6);
                this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
            };

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
///<reference path="../src/away/display/BitmapData.ts" />
///<reference path="../src/away/net/IMGLoader.ts" />
///<reference path="../src/def/console.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/BitmapDataTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/BitmapDataTest.js
//------------------------------------------------------------------------------------------------
var BitmapDataTest = (function () {
    function BitmapDataTest() {
        var _this = this;
        // Load a PNG
        this.urlRequest = new away.net.URLRequest('URLLoaderTestData/256x256.png');
        this.imgLoader = new away.net.IMGLoader();
        this.imgLoader.load(this.urlRequest);
        this.imgLoader.addEventListener(away.events.Event.COMPLETE, this.imgLoaded, this);
        this.imgLoader.addEventListener(away.events.IOErrorEvent.IO_ERROR, this.imgLoadedError, this);

        // BitmapData Object - 1
        this.bitmapData = new away.display.BitmapData(256, 256, true);
        document.body.appendChild(this.bitmapData.canvas);

        // BitmapData Object - 2
        this.bitmapDataB = new away.display.BitmapData(256, 256, true, 0x0000ff);
        this.bitmapDataB.canvas.style.position = 'absolute';
        this.bitmapDataB.canvas.style.left = '540px';
        document.body.appendChild(this.bitmapDataB.canvas);

        // BitmapData - setPixel test
        console['time']("bitmapdata");

        this.bitmapDataB.lock();

        for (var i = 0; i < 10000; i++) {
            var x = Math.random() * this.bitmapDataB.width | 0;
            var y = Math.random() * this.bitmapDataB.height | 0;
            var r = Math.random() * 256 | 0;
            var g = Math.random() * 256 | 0;
            var b = Math.random() * 256 | 0;
            this.bitmapDataB.setPixel(x, y, r, g, b, 255);
        }

        this.bitmapDataB.unlock();
        console['timeEnd']("bitmapdata");

        document.onmousedown = function (e) {
            return _this.onMouseDown(e);
        };
    }
    BitmapDataTest.prototype.onMouseDown = function (e) {
        if (this.bitmapData.width === 512) {
            if (this.imgLoader.loaded) {
                // Resize BitmapData
                this.bitmapData.width = 256;
                this.bitmapData.height = 256;

                // copy image into first bitmapdata
                var rect = new away.geom.Rectangle(0, 0, this.imgLoader.width, this.imgLoader.height);
                this.bitmapData.copyImage(this.imgLoader.image, rect, rect);

                // copy image into second bitmap data ( and scale it up 2X )
                rect.width = rect.width * 2;
                rect.height = rect.height * 2;

                this.bitmapDataB.copyPixels(this.bitmapData, this.bitmapData.rect, rect);

                this.bitmapDataB.lock();

                for (var d = 0; d < 10000; d++) {
                    var x = Math.random() * this.bitmapDataB.width | 0;
                    var y = Math.random() * this.bitmapDataB.height | 0;
                    var r = Math.random() * 256 | 0;
                    var g = Math.random() * 256 | 0;
                    var b = Math.random() * 256 | 0;
                    this.bitmapDataB.setPixel(x, y, r, g, b, 255);
                }

                this.bitmapDataB.unlock();
            } else {
                // image is not loaded - fill bitmapdata with red
                this.bitmapData.width = 256;
                this.bitmapData.height = 256;
                this.bitmapData.fillRect(this.bitmapData.rect, 0xff0000);
            }
        } else {
            // resize bitmapdata;
            this.bitmapData.width = 512;
            this.bitmapData.height = 512;
            this.bitmapData.fillRect(this.bitmapData.rect, 0x00ff00);

            this.bitmapDataB.copyPixels(this.bitmapData, this.bitmapDataB.rect, this.bitmapDataB.rect);
        }
    };

    BitmapDataTest.prototype.imgLoadedError = function (e) {
        console.log('error');
    };

    BitmapDataTest.prototype.imgLoaded = function (e) {
        this.bitmapData.copyImage(this.imgLoader.image, new away.geom.Rectangle(0, 0, this.imgLoader.width, this.imgLoader.height), new away.geom.Rectangle(0, 0, this.imgLoader.width / 2, this.imgLoader.height / 2));
    };
    return BitmapDataTest;
})();

window.onload = function () {
    var test = new BitmapDataTest();
};
//@ sourceMappingURL=BitmapDataTest.js.map
