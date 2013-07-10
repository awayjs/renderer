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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    (function (display3D) {
        var TextureBase = (function () {
            function TextureBase() {
                this._glTexture = GL.createTexture();
            }
            TextureBase.prototype.dispose = function () {
                GL.deleteTexture(this._glTexture);
            };

            Object.defineProperty(TextureBase.prototype, "glTexture", {
                get: function () {
                    return this._glTexture;
                },
                enumerable: true,
                configurable: true
            });
            return TextureBase;
        })();
        display3D.TextureBase = TextureBase;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    ///<reference path="TextureBase.ts"/>
    (function (display3D) {
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(width, height) {
                _super.call(this);
                this._width = width;
                this._height = height;

                GL.bindTexture(GL.TEXTURE_2D, this.glTexture);
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
            }
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

            Texture.prototype.uploadFromHTMLImageElement = function (image, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                GL.texImage2D(GL.TEXTURE_2D, miplevel, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
            };
            return Texture;
        })(display3D.TextureBase);
        display3D.Texture = Texture;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../display/BitmapData.ts" />
    ///<reference path="../../geom/Matrix.ts" />
    ///<reference path="../../geom/Rectangle.ts" />
    ///<reference path="../../display3D/TextureBase.ts" />
    ///<reference path="../../display3D/Texture.ts" />
    (function (materials) {
        //import flash.display.*;
        //import flash.display3D.textures.CubeTexture;
        //import flash.display3D.textures.Texture;
        //import flash.display3D.textures.TextureBase;
        //import flash.geom.*;
        /**
        * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
        */
        var MipmapGenerator = (function () {
            function MipmapGenerator() {
            }
            MipmapGenerator.generateHTMLImageElementMipMaps = /**
            * Uploads a BitmapData with mip maps to a target Texture object.
            * @param source
            * @param target The target Texture to upload to.
            * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
            * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
            */
            function (source, target, mipmap, alpha, side) {
                if (typeof mipmap === "undefined") { mipmap = null; }
                if (typeof alpha === "undefined") { alpha = false; }
                if (typeof side === "undefined") { side = -1; }
                MipmapGenerator._rect.width = source.width;
                MipmapGenerator._rect.height = source.height;

                MipmapGenerator._source = new away.display.BitmapData(source.width, source.height, alpha);
                MipmapGenerator._source.copyImage(source, MipmapGenerator._rect, MipmapGenerator._rect);

                MipmapGenerator.generateMipMaps(MipmapGenerator._source, target, mipmap);

                MipmapGenerator._source.dispose();
                MipmapGenerator._source = null;
            };

            MipmapGenerator.generateMipMaps = /**
            * Uploads a BitmapData with mip maps to a target Texture object.
            * @param source The source BitmapData to upload.
            * @param target The target Texture to upload to.
            * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
            * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
            */
            function (source, target, mipmap, alpha, side) {
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

                    if (target instanceof away.display3D.Texture) {
                        tx = target;

                        mipmap.imageData;
                    } else {
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
        materials.MipmapGenerator = MipmapGenerator;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
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
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="../../events/AssetEvent.ts" />
    ///<reference path="../../library/assets/IAsset.ts" />
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
                get: /**
                * The original name used for this asset in the resource (e.g. file) in which
                * it was found. This may not be the same as <code>name</code>, which may
                * have changed due to of a name conflict.
                */
                function () {
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    (function (display3D) {
        var Context3DClearMask = (function () {
            function Context3DClearMask() {
            }
            Context3DClearMask.COLOR = 8 << 11;
            Context3DClearMask.DEPTH = 8 << 5;
            Context3DClearMask.STENCIL = 8 << 7;
            Context3DClearMask.ALL = Context3DClearMask.COLOR | Context3DClearMask.DEPTH | Context3DClearMask.STENCIL;
            return Context3DClearMask;
        })();
        display3D.Context3DClearMask = Context3DClearMask;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    (function (display3D) {
        var VertexBuffer3D = (function () {
            function VertexBuffer3D(numVertices, data32PerVertex) {
                this._buffer = GL.createBuffer();
                this._numVertices = numVertices;
                this._data32PerVertex = data32PerVertex;
            }
            VertexBuffer3D.prototype.upload = function (vertices, startVertex, numVertices) {
                GL.bindBuffer(GL.ARRAY_BUFFER, this._buffer);
                console.log("** WARNING upload not fully implemented, startVertex & numVertices not considered.");

                // TODO add offsets , startVertex, numVertices * this._data32PerVertex
                GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
            };

            Object.defineProperty(VertexBuffer3D.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBuffer3D.prototype, "data32PerVertex", {
                get: function () {
                    return this._data32PerVertex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexBuffer3D.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });

            VertexBuffer3D.prototype.dispose = function () {
                GL.deleteBuffer(this._buffer);
            };
            return VertexBuffer3D;
        })();
        display3D.VertexBuffer3D = VertexBuffer3D;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    (function (display3D) {
        var IndexBuffer3D = (function () {
            function IndexBuffer3D(numIndices) {
                this._buffer = GL.createBuffer();
                this._numIndices = numIndices;
            }
            IndexBuffer3D.prototype.upload = function (data, startOffset, count) {
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this._buffer);

                // TODO add index offsets
                GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), GL.STATIC_DRAW);
            };

            IndexBuffer3D.prototype.dispose = function () {
                GL.deleteBuffer(this._buffer);
            };

            Object.defineProperty(IndexBuffer3D.prototype, "numIndices", {
                get: function () {
                    return this._numIndices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(IndexBuffer3D.prototype, "glBuffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            return IndexBuffer3D;
        })();
        display3D.IndexBuffer3D = IndexBuffer3D;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    (function (display3D) {
        var Program3D = (function () {
            function Program3D() {
                this._program = GL.createProgram();
            }
            Program3D.prototype.upload = function (vertexProgram, fragmentProgram) {
                this._vertexShader = GL.createShader(GL.VERTEX_SHADER);
                this._fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

                GL.shaderSource(this._vertexShader, vertexProgram);
                GL.compileShader(this._vertexShader);

                if (!GL.getShaderParameter(this._vertexShader, GL.COMPILE_STATUS)) {
                    alert(GL.getShaderInfoLog(this._vertexShader));
                    return null;
                }

                GL.shaderSource(this._fragmentShader, fragmentProgram);
                GL.compileShader(this._fragmentShader);

                if (!GL.getShaderParameter(this._fragmentShader, GL.COMPILE_STATUS)) {
                    alert(GL.getShaderInfoLog(this._fragmentShader));
                    return null;
                }

                GL.attachShader(this._program, this._vertexShader);
                GL.attachShader(this._program, this._fragmentShader);
                GL.linkProgram(this._program);

                if (!GL.getProgramParameter(this._program, GL.LINK_STATUS)) {
                    alert("Could not link the program.");
                }
            };

            Program3D.prototype.dispose = function () {
                GL.deleteProgram(this._program);
            };

            Program3D.prototype.focusProgram = function () {
                GL.useProgram(this._program);
            };

            Object.defineProperty(Program3D.prototype, "glProgram", {
                get: function () {
                    return this._program;
                },
                enumerable: true,
                configurable: true
            });
            return Program3D;
        })();
        display3D.Program3D = Program3D;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="Vector3D.ts" />
    ///<reference path="../errors/ArgumentError.ts" />
    (function (geom) {
        var Matrix3D = (function () {
            /**
            * Creates a Matrix3D object.
            */
            function Matrix3D(v) {
                if (typeof v === "undefined") { v = null; }
                if (v != null && v.length == 16) {
                    this.rawData = v;
                } else {
                    this.rawData = [
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1
                    ];
                }
            }
            /**
            * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
            */
            Matrix3D.prototype.append = function (lhs) {
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
            Matrix3D.prototype.appendRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);

                if (pivotPoint != null) {
                    var p = pivotPoint;
                    m.appendTranslation(p.x, p.y, p.z);
                }

                this.append(m);
            };

            /**
            * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
                this.append(new Matrix3D([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zScale, 0.0, 0.0, 0.0, 0.0, 1.0]));
            };

            /**
            * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.appendTranslation = function (x, y, z) {
                this.rawData[12] += x;
                this.rawData[13] += y;
                this.rawData[14] += z;
            };

            /**
            * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
            */
            Matrix3D.prototype.clone = function () {
                return new Matrix3D(this.rawData.slice(0));
            };

            /**
            * Copies a Vector3D object into specific column of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
                switch (column) {
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
                        throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies specific column of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
                switch (column) {
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
                        throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
            */
            Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
                this.rawData = sourceMatrix3D.rawData.slice(0);
            };

            Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                //TODO fully implement
                this.rawData = vector.splice(0);
            };

            /* TODO implement copyRawDataTo
            public copyRawDataTo( vector:number[], index:number = 0, transpose:boolean = false )
            {
            }
            */
            /**
            * Copies a Vector3D object into specific row of the calling Matrix3D object.
            */
            Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
                switch (row) {
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
                        throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies specific row of the calling Matrix3D object into the Vector3D object.
            */
            Matrix3D.prototype.copyRowTo = function (row, vector3D) {
                switch (row) {
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
                        throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
                }
            };

            /**
            * Copies this Matrix3D object into a destination Matrix3D object.
            */
            Matrix3D.prototype.copyToMatrix3D = function (dest) {
                dest.rawData = this.rawData.slice(0);
            };

            // TODO orientationStyle:string = "eulerAngles"
            /**
            * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
            */
            Matrix3D.prototype.decompose = function () {
                var vec = [];
                var m = this.clone();
                var mr = m.rawData;

                var pos = new geom.Vector3D(mr[12], mr[13], mr[14]);
                mr[12] = 0;
                mr[13] = 0;
                mr[14] = 0;

                var scale = new geom.Vector3D();

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

                var rot = new geom.Vector3D();
                rot.y = Math.asin(-mr[2]);
                var cos = Math.cos(rot.y);

                if (cos > 0) {
                    rot.x = Math.atan2(mr[6], mr[10]);
                    rot.z = Math.atan2(mr[1], mr[0]);
                } else {
                    rot.z = 0;
                    rot.x = Math.atan2(mr[4], mr[5]);
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
                return new geom.Vector3D((x * this.rawData[0] + y * this.rawData[1] + z * this.rawData[2] + this.rawData[3]), (x * this.rawData[4] + y * this.rawData[5] + z * this.rawData[6] + this.rawData[7]), (x * this.rawData[8] + y * this.rawData[9] + z * this.rawData[10] + this.rawData[11]), 0);
            };

            /**
            * Converts the current matrix to an identity or unit matrix.
            */
            Matrix3D.prototype.identity = function () {
                this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            };

            Matrix3D.interpolate = /**
            * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
            */
            function (thisMat, toMat, percent) {
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
                var d = this.determinant;
                var invertable = Math.abs(d) > 0.00000000001;

                if (invertable) {
                    d = -1 / d;
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
            Matrix3D.prototype.prependRotation = function (degrees, axis, pivotPoint) {
                if (typeof pivotPoint === "undefined") { pivotPoint = null; }
                var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);
                if (pivotPoint != null) {
                    var p = pivotPoint;
                    m.appendTranslation(p.x, p.y, p.z);
                }
                this.prepend(m);
            };

            /**
            * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
            */
            Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
                this.prepend(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
            };

            /**
            * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
            */
            Matrix3D.prototype.prependTranslation = function (x, y, z) {
                var m = new Matrix3D();
                m.position = new geom.Vector3D(x, y, z);
                this.prepend(m);
            };

            // TODO orientationStyle
            /**
            * Sets the transformation matrix's translation, rotation, and scale settings.
            */
            Matrix3D.prototype.recompose = function (components) {
                if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0)
                    return false;

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

            /**
            * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
            */
            Matrix3D.prototype.transformVectors = function (vin, vout) {
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
                var m = new Matrix3D();

                var a1 = new geom.Vector3D(x, y, z);
                var rad = -degrees * (Math.PI / 180);
                var c = Math.cos(rad);
                var s = Math.sin(rad);
                var t = 1.0 - c;

                m.rawData[0] = c + a1.x * a1.x * t;
                m.rawData[5] = c + a1.y * a1.y * t;
                m.rawData[10] = c + a1.z * a1.z * t;

                var tmp1 = a1.x * a1.y * t;
                var tmp2 = a1.z * s;
                m.rawData[4] = tmp1 + tmp2;
                m.rawData[1] = tmp1 - tmp2;
                tmp1 = a1.x * a1.z * t;
                tmp2 = a1.y * s;
                m.rawData[8] = tmp1 - tmp2;
                m.rawData[2] = tmp1 + tmp2;
                tmp1 = a1.y * a1.z * t;
                tmp2 = a1.x * s;
                m.rawData[9] = tmp1 + tmp2;
                m.rawData[6] = tmp1 - tmp2;

                return m;
            };

            Object.defineProperty(Matrix3D.prototype, "determinant", {
                get: /**
                * [read-only] A Number that determines whether a matrix is invertible.
                */
                function () {
                    return -1 * ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Matrix3D.prototype, "position", {
                get: /**
                * A Vector3D object that holds the position, the 3D coordinate (x,y,z) of a display object within the
                * transformation's frame of reference.
                */
                function () {
                    return new geom.Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
                },
                set: function (value) {
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
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (display3D) {
        var Context3DTextureFormat = (function () {
            function Context3DTextureFormat() {
            }
            Context3DTextureFormat.BGRA = "bgra";
            Context3DTextureFormat.BGRA_PACKED = "bgraPacked4444";
            Context3DTextureFormat.BGR_PACKED = "bgrPacked565";
            Context3DTextureFormat.COMPRESSED = "compressed";
            Context3DTextureFormat.COMPRESSED_ALPHA = "compressedAlpha";
            return Context3DTextureFormat;
        })();
        display3D.Context3DTextureFormat = Context3DTextureFormat;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (display3D) {
        var Context3DTriangleFace = (function () {
            function Context3DTriangleFace() {
            }
            Context3DTriangleFace.BACK = "back";
            Context3DTriangleFace.FRONT = "front";
            Context3DTriangleFace.FRONT_AND_BACK = "frontAndBack";
            Context3DTriangleFace.NONE = "none";
            return Context3DTriangleFace;
        })();
        display3D.Context3DTriangleFace = Context3DTriangleFace;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (display3D) {
        var Context3DVertexBufferFormat = (function () {
            function Context3DVertexBufferFormat() {
            }
            Context3DVertexBufferFormat.BYTES_4 = "bytes4";
            Context3DVertexBufferFormat.FLOAT_1 = "float1";
            Context3DVertexBufferFormat.FLOAT_2 = "float2";
            Context3DVertexBufferFormat.FLOAT_3 = "float3";
            Context3DVertexBufferFormat.FLOAT_4 = "float4";
            return Context3DVertexBufferFormat;
        })();
        display3D.Context3DVertexBufferFormat = Context3DVertexBufferFormat;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (display3D) {
        var Context3DProgramType = (function () {
            function Context3DProgramType() {
            }
            Context3DProgramType.FRAGMENT = "fragment";
            Context3DProgramType.VERTEX = "vertex";
            return Context3DProgramType;
        })();
        display3D.Context3DProgramType = Context3DProgramType;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../def/webgl.d.ts"/>
    ///<reference path="Context3DClearMask.ts"/>
    ///<reference path="VertexBuffer3D.ts"/>
    ///<reference path="IndexBuffer3D.ts"/>
    ///<reference path="Program3D.ts"/>
    ///<reference path="../geom/Matrix3D.ts"/>
    ///<reference path="../geom/Rectangle.ts"/>
    ///<reference path="Context3DTextureFormat.ts"/>
    ///<reference path="Texture.ts"/>
    ///<reference path="Context3DTriangleFace.ts"/>
    ///<reference path="Context3DVertexBufferFormat.ts"/>
    ///<reference path="Context3DProgramType.ts"/>
    (function (display3D) {
        var Context3D = (function () {
            function Context3D(canvas) {
                this._indexBufferList = [];
                this._vertexBufferList = [];
                this._textureList = [];
                this._programList = [];
                try  {
                    GL = canvas.getContext("experimental-webgl");
                    if (!GL) {
                        GL = canvas.getContext("webgl");
                    }
                } catch (e) {
                }

                if (GL) {
                } else {
                    //this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
                    alert("WebGL is not available.");
                }
            }
            Context3D.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
                if (typeof red === "undefined") { red = 0; }
                if (typeof green === "undefined") { green = 0; }
                if (typeof blue === "undefined") { blue = 0; }
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof depth === "undefined") { depth = 1; }
                if (typeof stencil === "undefined") { stencil = 0; }
                if (typeof mask === "undefined") { mask = display3D.Context3DClearMask.ALL; }
                console.log("===== clear =====");
                console.log("\tred: " + red);
                console.log("\tgreen: " + green);
                console.log("\tblue: " + blue);
                console.log("\talpha: " + alpha);
                console.log("\tdepth: " + depth);
                console.log("\tstencil: " + stencil);
                console.log("\tmask: " + mask);

                if (!this._drawing) {
                    this.updateBlendStatus();
                    this._drawing = true;
                }
                GL.clearColor(red, green, blue, alpha);
                GL.clearDepth(depth);
                GL.clearStencil(stencil);
                GL.clear(mask);
            };

            Context3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = true; }
                console.log("===== configureBackBuffer =====");
                console.log("\twidth: " + width);
                console.log("\theight: " + height);
                console.log("\tantiAlias: " + antiAlias);
                console.log("\tenableDepthAndStencil: " + enableDepthAndStencil);

                if (enableDepthAndStencil) {
                    GL.enable(GL.STENCIL_TEST);
                    GL.enable(GL.DEPTH_TEST);
                }

                // TODO add antialias (seems to be a webgl bug)
                // TODO set webgl / canvas dimensions
                GL.viewport.width = width;
                GL.viewport.height = height;
            };

            /*
            public function createCubeTexture( size:number, format:Context3DTextureFormat, optimizeForRenderToTexture:boolean, streamingLevels:number = 0 ):CubeTexture
            {
            var texture = new nme.display3D.textures.CubeTexture (GL.createTexture (), size);     // TODO use format, optimizeForRenderToTexture and  streamingLevels?
            texturesCreated.push(texture);
            return texture;
            }*/
            Context3D.prototype.createIndexBuffer = function (numIndices) {
                console.log("===== createIndexBuffer =====");
                console.log("\tnumIndices: " + numIndices);
                var indexBuffer = new away.display3D.IndexBuffer3D(numIndices);
                this._indexBufferList.push(indexBuffer);
                return indexBuffer;
            };

            Context3D.prototype.createProgram = function () {
                console.log("===== createProgram =====");
                var program = new away.display3D.Program3D();
                this._programList.push(program);
                return program;
            };

            Context3D.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                console.log("===== createTexture =====");
                console.log("\twidth: " + width);
                console.log("\theight: " + height);
                console.log("\tformat: " + format);
                console.log("\toptimizeForRenderToTexture: " + optimizeForRenderToTexture);
                console.log("\tstreamingLevels: " + streamingLevels);

                var texture = new away.display3D.Texture(width, height);
                this._textureList.push(texture);
                return texture;
            };

            Context3D.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                console.log("===== createVertexBuffer =====");
                console.log("\tnumVertices: " + numVertices);
                console.log("\tdata32PerVertex: " + data32PerVertex);
                var vertexBuffer = new away.display3D.VertexBuffer3D(numVertices, data32PerVertex);
                this._vertexBufferList.push(vertexBuffer);
                return vertexBuffer;
            };

            Context3D.prototype.dispose = function () {
                console.log("===== dispose =====");
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
                this._programList = null;
            };

            /*
            public function drawToBitmapData(destination:BitmapData)
            {
            // TODO
            }
            */
            Context3D.prototype.drawTriangles = function (indexBuffer, firstIndex, numTriangles) {
                if (typeof firstIndex === "undefined") { firstIndex = 0; }
                if (typeof numTriangles === "undefined") { numTriangles = -1; }
                console.log("===== drawTriangles =====");
                console.log("\tfirstIndex: " + firstIndex);
                console.log("\tnumTriangles: " + numTriangles);

                if (!this._drawing) {
                    throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";
                }
                var numIndices = 0;

                if (numTriangles == -1) {
                    numIndices = indexBuffer.numIndices;
                } else {
                    numIndices = numTriangles * 3;
                }

                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
                GL.drawElements(GL.TRIANGLES, numIndices, GL.UNSIGNED_SHORT, firstIndex);
            };

            Context3D.prototype.present = function () {
                console.log("===== present =====");
                this._drawing = false;
                GL.useProgram(null);
            };

            //TODO Context3DBlendFactor
            Context3D.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
                console.log("===== setBlendFactors =====");
                console.log("\tsourceFactor: " + sourceFactor);
                console.log("\tdestinationFactor: " + destinationFactor);
                this._blendEnabled = true;
                this._blendSourceFactor = sourceFactor;
                this._blendDestinationFactor = destinationFactor;

                this.updateBlendStatus();
            };

            Context3D.prototype.setColorMask = function (red, green, blue, alpha) {
                console.log("===== setColorMask =====");
                GL.colorMask(red, green, blue, alpha);
            };

            Context3D.prototype.setCulling = function (triangleFaceToCull) {
                console.log("===== setCulling =====");
                console.log("\ttriangleFaceToCull: " + triangleFaceToCull);
                if (triangleFaceToCull == display3D.Context3DTriangleFace.NONE) {
                    GL.disable(GL.CULL_FACE);
                } else {
                    GL.enable(GL.CULL_FACE);
                    switch (triangleFaceToCull) {
                        case display3D.Context3DTriangleFace.FRONT:
                            GL.cullFace(GL.FRONT);
                            break;
                        case display3D.Context3DTriangleFace.BACK:
                            GL.cullFace(GL.BACK);
                            break;
                        case display3D.Context3DTriangleFace.FRONT_AND_BACK:
                            GL.cullFace(GL.FRONT_AND_BACK);
                            break;
                        default:
                            throw "Unknown Context3DTriangleFace type.";
                    }
                }
            };

            // TODO Context3DCompareMode
            Context3D.prototype.setDepthTest = function (depthMask, passCompareMode) {
                console.log("===== setDepthTest =====");
                console.log("\tdepthMask: " + depthMask);
                console.log("\tpassCompareMode: " + passCompareMode);
                GL.depthFunc(passCompareMode);
                GL.depthMask(depthMask);
            };

            Context3D.prototype.setProgram = function (program3D) {
                console.log("===== setProgram =====");

                //TODO decide on construction/reference resposibilities
                this._currentProgram = program3D;
                program3D.focusProgram();
            };

            Context3D.prototype.getUniformLocationNameFromAgalRegisterIndex = function (programType, firstRegister) {
                switch (programType) {
                    case display3D.Context3DProgramType.VERTEX:
                        return "vc";
                        break;
                    case display3D.Context3DProgramType.FRAGMENT:
                        return "fc";
                        break;
                    default:
                        throw "Program Type " + programType + " not supported";
                }
            };

            /*
            public setProgramConstantsFromByteArray
            */
            Context3D.prototype.setProgramConstantsFromMatrix = function (programType, firstRegister, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                var locationName = this.getUniformLocationNameFromAgalRegisterIndex(programType, firstRegister);
                this.setGLSLProgramConstantsFromMatrix(locationName, matrix, transposedMatrix);
            };

            /*
            public setProgramConstantsFromVector(programType:string, firstRegister:number, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false )
            {
            throw "fu";
            }*/
            /*
            public setGLSLProgramConstantsFromByteArray
            
            */
            Context3D.prototype.setGLSLProgramConstantsFromMatrix = function (locationName, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                console.log("===== setGLSLProgramConstantsFromMatrix =====");
                console.log("\tlocationName: " + locationName);
                console.log("\tmatrix: " + matrix.rawData);
                console.log("\ttransposedMatrix: " + transposedMatrix);

                var location = GL.getUniformLocation(this._currentProgram.glProgram, locationName);
                GL.uniformMatrix4fv(location, !transposedMatrix, new Float32Array(matrix.rawData));
            };

            Context3D.prototype.setGLSLProgramConstantsFromVector4 = function (locationName, data, startIndex) {
                if (typeof startIndex === "undefined") { startIndex = 0; }
                console.log("===== setGLSLProgramConstantsFromVector4 =====");
                console.log("\tlocationName: " + locationName);
                console.log("\tdata: " + data);
                console.log("\tstartIndex: " + startIndex);
                var location = GL.getUniformLocation(this._currentProgram.glProgram, locationName);
                GL.uniform4f(location, data[startIndex], data[startIndex + 1], data[startIndex + 2], data[startIndex + 3]);
            };

            Context3D.prototype.setScissorRectangle = function (rectangle) {
                console.log("===== setScissorRectangle =====");
                console.log("\trectangle: " + rectangle);
                GL.scissor(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            };

            Context3D.prototype.setGLSLTextureAt = function (locationName, texture, textureIndex) {
                var location = GL.getUniformLocation(this._currentProgram.glProgram, locationName);
                switch (textureIndex) {
                    case 0:
                        GL.activeTexture(GL.TEXTURE0);
                        break;
                    case 1:
                        GL.activeTexture(GL.TEXTURE1);
                        break;
                    case 2:
                        GL.activeTexture(GL.TEXTURE2);
                        break;
                    case 3:
                        GL.activeTexture(GL.TEXTURE3);
                        break;
                    case 4:
                        GL.activeTexture(GL.TEXTURE4);
                        break;
                    case 5:
                        GL.activeTexture(GL.TEXTURE5);
                        break;
                    case 6:
                        GL.activeTexture(GL.TEXTURE6);
                        break;
                    case 7:
                        GL.activeTexture(GL.TEXTURE7);
                        break;
                    default:
                        throw "Texture " + textureIndex + " is out of bounds.";
                }

                GL.bindTexture(GL.TEXTURE_2D, texture.glTexture);
                GL.uniform1i(location, textureIndex);

                // TODO create something like setSamplerStateAt(....
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
            };

            Context3D.prototype.setVertexBufferAt = function (index, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                console.log("===== setVertexBufferAt =====");
                console.log("\tindex: " + index);
                console.log("\tbufferOffset: " + bufferOffset);
                console.log("\tformat: " + format);

                var locationName = "va" + index;
                this.setGLSLVertexBufferAt(locationName, buffer, bufferOffset, format);
            };

            Context3D.prototype.setGLSLVertexBufferAt = function (locationName, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                console.log("===== setGLSLVertexBufferAt =====");
                console.log("\tbuffer.length: " + buffer.numVertices);
                console.log("\tbuffer.data32PerVertex: " + buffer.data32PerVertex);
                console.log("\tlocationName: " + locationName);
                console.log("\tbufferOffset: " + bufferOffset);

                var location = GL.getAttribLocation(this._currentProgram.glProgram, locationName);

                GL.bindBuffer(GL.ARRAY_BUFFER, buffer.glBuffer);

                var dimension;
                var type = GL.FLOAT;
                var numBytes = 4;

                switch (format) {
                    case display3D.Context3DVertexBufferFormat.BYTES_4:
                        dimension = 4;
                        break;
                    case display3D.Context3DVertexBufferFormat.FLOAT_1:
                        dimension = 1;
                        break;
                    case display3D.Context3DVertexBufferFormat.FLOAT_2:
                        dimension = 2;
                        break;
                    case display3D.Context3DVertexBufferFormat.FLOAT_3:
                        dimension = 3;
                        break;
                    case display3D.Context3DVertexBufferFormat.FLOAT_4:
                        dimension = 4;
                        break;
                    default:
                        throw "Buffer format " + format + " is not supported.";
                }

                GL.enableVertexAttribArray(location);
                GL.vertexAttribPointer(location, dimension, type, false, buffer.data32PerVertex * numBytes, bufferOffset * numBytes);
            };

            Context3D.prototype.updateBlendStatus = function () {
                console.log("===== updateBlendStatus =====");
                if (this._blendEnabled) {
                    GL.enable(GL.BLEND);
                    GL.blendEquation(GL.FUNC_ADD);
                    GL.blendFunc(this._blendSourceFactor, this._blendDestinationFactor);
                } else {
                    GL.disable(GL.BLEND);
                }
            };
            return Context3D;
        })();
        display3D.Context3D = Context3D;
    })(away.display3D || (away.display3D = {}));
    var display3D = away.display3D;
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
    ///<reference path="../library/assets/IAsset.ts" />
    ///<reference path="../library/assets/NamedAssetBase.ts" />
    ///<reference path="../library/assets/AssetType.ts" />
    ///<reference path="../display3D/Context3D.ts" />
    ///<reference path="../display3D/TextureBase.ts" />
    ///<reference path="../display3D/Context3DTextureFormat.ts" />
    ///<reference path="../errors/AbstractMethodError.ts" />
    (function (textures) {
        var TextureProxyBase = (function (_super) {
            __extends(TextureProxyBase, _super);
            function TextureProxyBase() {
                _super.call(this);
                this._format = away.display3D.Context3DTextureFormat.BGRA;
                this._hasMipmaps = true;

                this._textures = new Array(8);
                this._dirty = new Array(8);
            }
            Object.defineProperty(TextureProxyBase.prototype, "hasMipMaps", {
                get: /**
                *
                * @returns {boolean}
                */
                function () {
                    return this._hasMipmaps;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "format", {
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return this._format;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "assetType", {
                get: /**
                *
                * @returns {string}
                */
                function () {
                    return away.library.AssetType.TEXTURE;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "width", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TextureProxyBase.prototype, "height", {
                get: /**
                *
                * @returns {number}
                */
                function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });

            /* TODO: implement Stage3DProxy
            public getTextureForStage3D(stage3DProxy : Stage3DProxy) : TextureBase
            {
            var contextIndex : number = stage3DProxy._stage3DIndex;
            var tex : TextureBase = _textures[contextIndex];
            var context : Context3D = stage3DProxy._context3D;
            
            if (!tex || _dirty[contextIndex] != context) {
            _textures[contextIndex] = tex = createTexture(context);
            _dirty[contextIndex] = context;
            uploadContent(tex);//_pUploadContent
            }
            
            return tex;
            }
            */
            /**
            *
            * @param texture
            * @private
            */
            TextureProxyBase.prototype._pUploadContent = function (texture) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            *
            * @param width
            * @param height
            * @private
            */
            TextureProxyBase.prototype._pSetSize = function (width, height) {
                if (this._width != width || this._height != height) {
                    this._pInvalidateSize();
                }

                this._width = width;
                this._height = height;
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
            TextureProxyBase.prototype._pInvalidateSize = function () {
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
            TextureProxyBase.prototype._pCreateTexture = function (context) {
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
var away;
(function (away) {
    ///<reference path="../library/assets/IAsset.ts" />
    ///<reference path="../library/assets/NamedAssetBase.ts" />
    ///<reference path="../display3D/Context3D.ts" />
    ///<reference path="../display3D/TextureBase.ts" />
    ///<reference path="../display3D/Context3DTextureFormat.ts" />
    ///<reference path="../errors/AbstractMethodError.ts" />
    ///<reference path="TextureProxyBase.ts" />
    (function (textures) {
        //use namespace arcane;
        var Texture2DBase = (function (_super) {
            __extends(Texture2DBase, _super);
            function Texture2DBase() {
                _super.call(this);
            }
            Texture2DBase.prototype._pCreateTexture = function (context) {
                return context.createTexture(this.width, this.height, away.display3D.Context3DTextureFormat.BGRA, false);
            };
            return Texture2DBase;
        })(away.textures.TextureProxyBase);
        textures.Texture2DBase = Texture2DBase;
    })(away.textures || (away.textures = {}));
    var textures = away.textures;
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
    //<reference path="../library/assets/IAsset.ts" />
    ///<reference path="../display3D/TextureBase.ts" />
    ///<reference path="../display3D/Texture.ts" />
    ///<reference path="../textures/Texture2DBase.ts" />
    ///<reference path="../errors/AbstractMethodError.ts" />
    ///<reference path="../display/BitmapData.ts" />
    ///<reference path="../materials/utils/MipmapGenerator.ts" />
    ///<reference path="../utils/TextureUtils.ts" />
    ///<reference path="../errors/Error.ts" />
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
                    this._pSetSize(value.width, value.height);
                    this._htmlImageElement = value;

                    if (this._generateMipmaps) {
                        this.getMipMapHolder();
                    }
                },
                enumerable: true,
                configurable: true
            });


            HTMLImageElementTexture.prototype._pUploadContent = function (texture) {
                if (this._generateMipmaps) {
                    away.materials.MipmapGenerator.generateHTMLImageElementMipMaps(this._htmlImageElement, texture, this._mipMapHolder, true);
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
///<reference path="../src/away/display/BitmapData.ts" />
///<reference path="../src/away/net/IMGLoader.ts" />
///<reference path="../src/away/materials/utils/MipmapGenerator.ts" />
///<reference path="../src/away/display3D/TextureBase.ts" /
///<reference path="../src/away/textures/HTMLImageElementTexture.ts" />
///<reference path="../src/away/utils/TextureUtils.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/MipMapTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/MipMapTest.js
//------------------------------------------------------------------------------------------------
var MipMapTest = (function () {
    function MipMapTest() {
        var _this = this;
        this._rect = new away.geom.Rectangle();
        this._matrix = new away.geom.Matrix();
        //---------------------------------------
        // Load a PNG
        var mipUrlRequest = new away.net.URLRequest('URLLoaderTestData/1024x1024.png');
        this.mipLoader = new away.net.IMGLoader();
        this.mipLoader.load(mipUrlRequest);
        this.mipLoader.addEventListener(away.events.Event.COMPLETE, this.mipImgLoaded, this);

        document.onmousedown = function (e) {
            return _this.onMouseDown(e);
        };
    }
    MipMapTest.prototype.mipImgLoaded = function (e) {
        alert('Each click will generate a level of MipMap');

        var loader = e.target;

        this.sourceBitmap = new away.display.BitmapData(1024, 1024, true, 0xff0000);
        this.sourceBitmap.copyImage(loader.image, this.sourceBitmap.rect, this.sourceBitmap.rect);
        this.sourceBitmap.canvas.style.position = 'absolute';
        this.sourceBitmap.canvas.style.left = '0px';
        this.sourceBitmap.canvas.style.top = '1030px';

        //document.body.appendChild( this.sourceBitmap.canvas );
        this.mipMap = new away.display.BitmapData(1024, 1024, true, 0xff0000);
        this.mipMap.canvas.style.position = 'absolute';
        this.mipMap.canvas.style.left = '0px';
        this.mipMap.canvas.style.top = '0px';

        document.body.appendChild(this.mipMap.canvas);

        this._rect.width = this.sourceBitmap.width;
        this._rect.height = this.sourceBitmap.height;

        this.w = this.sourceBitmap.width;
        this.h = this.sourceBitmap.height;
    };

    MipMapTest.prototype.onMouseDown = function (e) {
        this.generateMipMap(this.sourceBitmap, this.mipMap);
    };

    MipMapTest.prototype.generateMipMap = function (source, mipmap, alpha, side) {
        if (typeof mipmap === "undefined") { mipmap = null; }
        if (typeof alpha === "undefined") { alpha = false; }
        if (typeof side === "undefined") { side = -1; }
        var c = this.w;
        var i;

        console['time']('MipMap' + c);

        if ((this.w >= 1) || (this.h >= 1)) {
            if (alpha) {
                mipmap.fillRect(this._rect, 0);
            }

            this._matrix.a = this._rect.width / source.width;
            this._matrix.d = this._rect.height / source.height;

            mipmap.width = this.w;
            mipmap.height = this.h;
            mipmap.copyPixels(source, source.rect, new away.geom.Rectangle(0, 0, this.w, this.h));

            this.w >>= 1;
            this.h >>= 1;

            this._rect.width = this.w > 1 ? this.w : 1;
            this._rect.height = this.h > 1 ? this.h : 1;
        }

        console.log('away.utils.TextureUtils.isBitmapDataValid: ', away.utils.TextureUtils.isBitmapDataValid(mipmap));

        console['timeEnd']('MipMap' + c);
    };
    return MipMapTest;
})();

window.onload = function () {
    var test = new MipMapTest();
};
//@ sourceMappingURL=MipMapTest.js.map
