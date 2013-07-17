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

            Event.ENTER_FRAME = 'enterframe';
            Event.EXIT_FRAME = 'exitframe';

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
            //todo: hasEventListener - relax check by not requiring target in param
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

            Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
                if (typeof index === "undefined") { index = 0; }
                if (typeof transpose === "undefined") { transpose = false; }
                //TODO fully implement
                vector = this.rawData.splice(0);
            };

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

            Matrix3D.prototype.transformVector = function (v) {
                var x = v.x;
                var y = v.y;
                var z = v.z;
                return new away.geom.Vector3D((x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12]), (x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13]), (x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14]), 1);
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
    (function (math) {
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
        math.MathConsts = MathConsts;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../geom/Matrix3D.ts" />
    ///<reference path="../math/MathConsts.ts" />
    (function (math) {
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
                get: /**
                * Returns the magnitude of the quaternion object.
                */
                function () {
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
                var rawData = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
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
                // todo: this isn't right, doesn't take into account transforms
                //var v:away.geom.Vector3D = matrix.decompose(Orientation3D.QUATERNION)[1];
                var v = matrix.decompose()[1];
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
        math.Quaternion = Quaternion;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    (function (math) {
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
        math.PlaneClassification = PlaneClassification;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../math/PlaneClassification.ts" />
    ///<reference path="../geom/Vector3D.ts" />
    (function (math) {
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
                if (this.d != this.d)
                    return away.math.PlaneClassification.FRONT;

                var len;
                if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS)
                    len = this.a * p.x - this.d; else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS)
                    len = this.b * p.y - this.d; else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS)
                    len = this.c * p.z - this.d; else
                    len = this.a * p.x + this.b * p.y + this.c * p.z - this.d;

                if (len < -epsilon)
                    return away.math.PlaneClassification.BACK; else if (len > epsilon)
                    return away.math.PlaneClassification.FRONT; else
                    return away.math.PlaneClassification.INTERSECT;
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
        math.Plane3D = Plane3D;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../geom/Matrix3D.ts" />
    ///<reference path="../math/Quaternion.ts" />
    ///<reference path="../math/Plane3D.ts" />
    (function (math) {
        //import flash.geom.*;
        /**
        * away3d.math.Matrix3DUtils provides additional Matrix3D math functions.
        */
        var Matrix3DUtils = (function () {
            function Matrix3DUtils() {
            }
            Matrix3DUtils.quaternion2matrix = /**
            * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
            *
            * @param    quarternion    The quarterion object to convert.
            */
            function (quarternion, m) {
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

                var raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
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

            Matrix3DUtils.getForward = /**
            * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the forward vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The forward vector
            */
            function (m, v) {
                if (typeof v === "undefined") { v = null; }
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(2, v);
                v.normalize();

                return v;
            };

            Matrix3DUtils.getUp = /**
            * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the up vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The up vector
            */
            function (m, v) {
                if (typeof v === "undefined") { v = null; }
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(1, v);
                v.normalize();

                return v;
            };

            Matrix3DUtils.getRight = /**
            * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
            * @param    m        The Matrix3D object to use to get the right vector
            * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
            * @return            The right vector
            */
            function (m, v) {
                if (typeof v === "undefined") { v = null; }
                if (v === null) {
                    v = new away.geom.Vector3D(0.0, 0.0, 0.0);
                }

                m.copyColumnTo(0, v);
                v.normalize();

                return v;
            };

            Matrix3DUtils.lookAt = /**
            * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
            */
            /* TODO: implement - dependent on Matrix3D.copyRawDataTo
            public static compare(m1:away.geom.Matrix3D, m2:away.geom.Matrix3D):boolean
            {
            var r1:number[] = away.math.Matrix3DUtils.Matrix3DUtils.RAW_DATA_CONTAINER;
            var r2:number[] = m2.rawData;
            m1.copyRawDataTo(r1);
            
            for (var i:number = 0; i < 16; ++i) {
            if (r1[i] != r2[i])
            return false;
            }
            
            return true;
            }
            */
            function (matrix, pos, dir, up) {
                var dirN;
                var upN;
                var lftN;
                var raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;

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
                if (target === null) {
                    target = new away.geom.Matrix3D();
                }

                var a = plane.a, b = plane.b, c = plane.c, d = plane.d;
                var rawData = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
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
        math.Matrix3DUtils = Matrix3DUtils;
    })(away.math || (away.math = {}));
    var math = away.math;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../events/Event.ts" />
    ///<reference path="../base/Object3D.ts" />
    (function (events) {
        var Object3DEvent = (function (_super) {
            __extends(Object3DEvent, _super);
            function Object3DEvent(type, object) {
                _super.call(this, type);
                this.object = object;
            }
            Object3DEvent.VISIBLITY_UPDATED = "visiblityUpdated";
            Object3DEvent.SCENETRANSFORM_CHANGED = "scenetransformChanged";
            Object3DEvent.SCENE_CHANGED = "sceneChanged";
            Object3DEvent.POSITION_CHANGED = "positionChanged";
            Object3DEvent.ROTATION_CHANGED = "rotationChanged";
            Object3DEvent.SCALE_CHANGED = "scaleChanged";
            return Object3DEvent;
        })(events.Event);
        events.Object3DEvent = Object3DEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../library/assets/NamedAssetBase.ts" />
    ///<reference path="../geom/Matrix3D.ts" />
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../math/MathConsts.ts" />
    ///<reference path="../math/Matrix3DUtils.ts" />
    ///<reference path="../events/Object3DEvent.ts" />
    (function (base) {
        //import away3d.arcane;
        //import away3d.controllers.*;
        //import away3d.core.math.*;
        //import away3d.events.*;
        //import away3d.library.assets.*;
        //import flash.geom.Matrix3D;
        //import flash.geom.Vector3D;
        //use namespace arcane;
        /**
        * Dispatched when the position of the 3d object changes.
        *
        * @eventType away3d.events.Object3DEvent
        */
        //[Event(name="positionChanged", type="away3d.events.Object3DEvent")]
        /**
        * Dispatched when the scale of the 3d object changes.
        *
        * @eventType away3d.events.Object3DEvent
        */
        //[Event(name="scaleChanged", type="away3d.events.Object3DEvent")]
        /**
        * Dispatched when the rotation of the 3d object changes.
        *
        * @eventType away3d.events.Object3DEvent
        */
        //[Event(name="rotationChanged", type="away3d.events.Object3DEvent")]
        /**
        * Object3D provides a base class for any 3D object that has a (local) transformation.<br/><br/>
        *
        * Standard Transform:
        * <ul>
        *     <li> The standard order for transformation is [parent transform] * (Translate+Pivot) * (Rotate) * (-Pivot) * (Scale) * [child transform] </li>
        *     <li> This is the order of matrix multiplications, left-to-right. </li>
        *     <li> The order of transformation is right-to-left, however!
        *          (Scale) happens before (-Pivot) happens before (Rotate) happens before (Translate+Pivot)
        *          with no pivot, the above transform works out to [parent transform] * Translate * Rotate * Scale * [child transform]
        *          (Scale) happens before (Rotate) happens before (Translate) </li>
        *     <li> This is based on code in updateTransform and ObjectContainer3D.updateSceneTransform(). </li>
        *     <li> Matrix3D prepend = operator on rhs - e.g. transform' = transform * rhs; </li>
        *     <li> Matrix3D append =  operator on lhr - e.g. transform' = lhs * transform; </li>
        * </ul>
        *
        * To affect Scale:
        * <ul>
        *     <li> set scaleX/Y/Z directly, or call scale(delta) </li>
        * </ul>
        *
        * To affect Pivot:
        * <ul>
        *     <li> set pivotPoint directly, or call movePivot() </li>
        * </ul>
        *
        * To affect Rotate:
        * <ul>
        *    <li> set rotationX/Y/Z individually (using degrees), set eulers [all 3 angles] (using radians), or call rotateTo()</li>
        *    <li> call pitch()/yaw()/roll()/rotate() to add an additional rotation *before* the current transform.
        *         rotationX/Y/Z will be reset based on these operations. </li>
        * </ul>
        *
        * To affect Translate (post-rotate translate):
        *
        * <ul>
        *    <li> set x/y/z/position or call moveTo(). </li>
        *    <li> call translate(), which modifies x/y/z based on a delta vector. </li>
        *    <li> call moveForward()/moveBackward()/moveLeft()/moveRight()/moveUp()/moveDown()/translateLocal() to add an
        *         additional translate *before* the current transform. x/y/z will be reset based on these operations. </li>
        * </ul>
        */
        var Object3D = (function (_super) {
            __extends(Object3D, _super);
            /**
            * Creates an Object3D object.
            */
            function Object3D() {
                _super.call(this);
                /** @private */
                // TODO: implement
                //public _iController:ControllerBase; // Arcane
                this._smallestNumber = 0.0000000000000000000001;
                this._transformDirty = true;
                //*/
                this._rotationX = 0;
                this._rotationY = 0;
                this._rotationZ = 0;
                this._eulers = new away.geom.Vector3D();
                this._flipY = new away.geom.Matrix3D();
                this._zOffset = 0;
                this._transform = new away.geom.Matrix3D();
                this._scaleX = 1;
                this._scaleY = 1;
                this._scaleZ = 1;
                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._pivotPoint = new away.geom.Vector3D();
                this._pivotZero = true;
                this._pos = new away.geom.Vector3D();
                this._rot = new away.geom.Vector3D();
                this._sca = new away.geom.Vector3D();

                // Cached vector of transformation components used when
                // recomposing the transform matrix in updateTransform()
                this._transformComponents = new Array(3);

                this._transformComponents[0] = this._pos;
                this._transformComponents[1] = this._rot;
                this._transformComponents[2] = this._sca;

                this._transform.identity();

                this._flipY.appendScale(1, -1, 1);
            }
            Object3D.prototype.invalidatePivot = function () {
                this._pivotZero = (this._pivotPoint.x == 0) && (this._pivotPoint.y == 0) && (this._pivotPoint.z == 0);
                this._iInvalidateTransform();
            };

            Object3D.prototype.invalidatePosition = function () {
                if (this._positionDirty)
                    return;

                this._positionDirty = true;

                this._iInvalidateTransform();

                if (this._listenToPositionChanged)
                    this.notifyPositionChanged();
            };

            Object3D.prototype.notifyPositionChanged = function () {
                if (!this._positionChanged) {
                    this._positionChanged = new away.events.Object3DEvent(away.events.Object3DEvent.POSITION_CHANGED, this);
                }
                this.dispatchEvent(this._positionChanged);
            };

            Object3D.prototype.addEventListener = function (type, listener, target) {
                _super.prototype.addEventListener.call(this, type, listener, target);

                switch (type) {
                    case away.events.Object3DEvent.POSITION_CHANGED:
                        this._listenToPositionChanged = true;
                        break;
                    case away.events.Object3DEvent.ROTATION_CHANGED:
                        this._listenToRotationChanged = true;
                        break;
                    case away.events.Object3DEvent.SCALE_CHANGED:
                        this._listenToRotationChanged = true;
                        break;
                }
            };

            //*/
            //* TODO implement
            Object3D.prototype.removeEventListener = function (type, listener, target) {
                _super.prototype.removeEventListener.call(this, type, listener, target);

                if (this.hasEventListener(type, listener, target))
                    return;

                switch (type) {
                    case away.events.Object3DEvent.POSITION_CHANGED:
                        this._listenToPositionChanged = false;
                        break;

                    case away.events.Object3DEvent.ROTATION_CHANGED:
                        this._listenToRotationChanged = false;
                        break;

                    case away.events.Object3DEvent.SCALE_CHANGED:
                        this._listenToScaleChanged = false;
                        break;
                }
            };

            //*/
            Object3D.prototype.invalidateRotation = function () {
                if (this._rotationDirty) {
                    return;
                }

                this._rotationDirty = true;

                this._iInvalidateTransform();

                if (this._listenToRotationChanged)
                    this.notifyRotationChanged();
            };

            Object3D.prototype.notifyRotationChanged = function () {
                if (!this._rotationChanged)
                    this._rotationChanged = new away.events.Object3DEvent(away.events.Object3DEvent.ROTATION_CHANGED, this);

                this.dispatchEvent(this._rotationChanged);
            };

            Object3D.prototype.invalidateScale = function () {
                if (this._scaleDirty) {
                    return;
                }

                this._scaleDirty = true;

                this._iInvalidateTransform();

                if (this._listenToScaleChanged)
                    this.notifyScaleChanged();
            };

            Object3D.prototype.notifyScaleChanged = function () {
                if (!this._scaleChanged)
                    this._scaleChanged = new away.events.Object3DEvent(away.events.Object3DEvent.SCALE_CHANGED, this);

                this.dispatchEvent(this._scaleChanged);
            };

            Object.defineProperty(Object3D.prototype, "x", {
                get: /**
                * Defines the x coordinate of the 3d object relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    return this._x;
                },
                set: function (val) {
                    if (this._x == val) {
                        return;
                    }

                    this._x = val;
                    this.invalidatePosition();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "y", {
                get: /**
                * Defines the y coordinate of the 3d object relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    return this._y;
                },
                set: function (val) {
                    if (this._y == val) {
                        return;
                    }

                    this._y = val;
                    this.invalidatePosition();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "z", {
                get: /**
                * Defines the z coordinate of the 3d object relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    return this._z;
                },
                set: function (val) {
                    if (this._z == val) {
                        return;
                    }

                    this._z = val;
                    this.invalidatePosition();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "rotationX", {
                get: /**
                * Defines the euler angle of rotation of the 3d object around the x-axis, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    return this._rotationX * away.math.MathConsts.RADIANS_TO_DEGREES;
                },
                set: function (val) {
                    if (this.rotationX == val) {
                        return;
                    }

                    this._rotationX = val * away.math.MathConsts.DEGREES_TO_RADIANS;
                    this.invalidateRotation();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "rotationY", {
                get: /**
                * Defines the euler angle of rotation of the 3d object around the y-axis, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    return this._rotationY * away.math.MathConsts.RADIANS_TO_DEGREES;
                },
                set: function (val) {
                    if (this.rotationY == val) {
                        return;
                    }

                    this._rotationY = val * away.math.MathConsts.DEGREES_TO_RADIANS;

                    this.invalidateRotation();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "rotationZ", {
                get: /**
                * Defines the euler angle of rotation of the 3d object around the z-axis, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    return this._rotationZ * away.math.MathConsts.RADIANS_TO_DEGREES;
                },
                set: function (val) {
                    if (this.rotationZ == val) {
                        return;
                    }

                    this._rotationZ = val * away.math.MathConsts.DEGREES_TO_RADIANS;

                    this.invalidateRotation();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "scaleX", {
                get: /**
                * Defines the scale of the 3d object along the x-axis, relative to local coordinates.
                */
                function () {
                    return this._scaleX;
                },
                set: function (val) {
                    if (this._scaleX == val) {
                        return;
                    }

                    this._scaleX = val;

                    this.invalidateScale();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "scaleY", {
                get: /**
                * Defines the scale of the 3d object along the y-axis, relative to local coordinates.
                */
                function () {
                    return this._scaleY;
                },
                set: function (val) {
                    if (this._scaleY == val) {
                        return;
                    }

                    this._scaleY = val;

                    this.invalidateScale();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "scaleZ", {
                get: /**
                * Defines the scale of the 3d object along the z-axis, relative to local coordinates.
                */
                function () {
                    return this._scaleZ;
                },
                set: function (val) {
                    if (this._scaleZ == val) {
                        return;
                    }

                    this._scaleZ = val;
                    this.invalidateScale();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "eulers", {
                get: /**
                * Defines the rotation of the 3d object as a <code>Vector3D</code> object containing euler angles for rotation around x, y and z axis.
                */
                function () {
                    this._eulers.x = this._rotationX * away.math.MathConsts.RADIANS_TO_DEGREES;
                    this._eulers.y = this._rotationY * away.math.MathConsts.RADIANS_TO_DEGREES;
                    this._eulers.z = this._rotationZ * away.math.MathConsts.RADIANS_TO_DEGREES;

                    return this._eulers;
                },
                set: function (value) {
                    this._rotationX = value.x * away.math.MathConsts.DEGREES_TO_RADIANS;
                    this._rotationY = value.y * away.math.MathConsts.DEGREES_TO_RADIANS;
                    this._rotationZ = value.z * away.math.MathConsts.DEGREES_TO_RADIANS;

                    this.invalidateRotation();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "transform", {
                get: /**
                * The transformation of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    if (this._transformDirty) {
                        this._pUpdateTransform();
                    }

                    return this._transform;
                },
                set: function (val) {
                    if (!val.rawData[0]) {
                        this.raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;;
                        val.copyRawDataTo(raw);
                        raw[0] = this._smallestNumber;
                        val.copyRawDataFrom(raw);
                    }

                    //*/
                    this.elements = val.decompose();;
                    this.vec;;

                    vec = elements[0];

                    if (this._x != vec.x || this._y != vec.y || this._z != vec.z) {
                        this._x = vec.x;
                        this._y = vec.y;
                        this._z = vec.z;

                        this.invalidatePosition();
                    }

                    vec = elements[1];

                    if (this._rotationX != vec.x || this._rotationY != vec.y || this._rotationZ != vec.z) {
                        this._rotationX = vec.x;
                        this._rotationY = vec.y;
                        this._rotationZ = vec.z;

                        this.invalidateRotation();
                    }

                    vec = elements[2];

                    if (this._scaleX != vec.x || this._scaleY != vec.y || this._scaleZ != vec.z) {
                        this._scaleX = vec.x;
                        this._scaleY = vec.y;
                        this._scaleZ = vec.z;

                        this.invalidateScale();
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "pivotPoint", {
                get: /**
                * Defines the local point around which the object rotates.
                */
                function () {
                    return this._pivotPoint;
                },
                set: function (pivot) {
                    this._pivotPoint = pivot.clone();

                    this.invalidatePivot();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "position", {
                get: /**
                * Defines the position of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
                */
                function () {
                    this._transform.copyColumnTo(3, this._pos);

                    return this._pos.clone();
                },
                set: function (value) {
                    this._x = value.x;
                    this._y = value.y;
                    this._z = value.z;

                    this.invalidatePosition();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Object3D.prototype, "forwardVector", {
                get: /**
                *
                */
                function () {
                    return away.math.Matrix3DUtils.getForward(this.transform);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "rightVector", {
                get: /**
                *
                */
                function () {
                    return away.math.Matrix3DUtils.getRight(this.transform);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "upVector", {
                get: /**
                *
                */
                function () {
                    return away.math.Matrix3DUtils.getUp(this.transform);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "backVector", {
                get: /**
                *
                */
                function () {
                    this.director = away.math.Matrix3DUtils.getForward(this.transform);;
                    director.negate();

                    return director;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "leftVector", {
                get: /**
                *
                */
                function () {
                    this.director = away.math.Matrix3DUtils.getRight(this.transform);;
                    director.negate();

                    return director;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Object3D.prototype, "downVector", {
                get: /**
                *
                */
                function () {
                    this.director = away.math.Matrix3DUtils.getUp(this.transform);;
                    director.negate();

                    return director;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Appends a uniform scale to the current transformation.
            * @param value The amount by which to scale.
            */
            Object3D.prototype.scale = function (value) {
                this._scaleX *= value;
                this._scaleY *= value;
                this._scaleZ *= value;

                this.invalidateScale();
            };

            /**
            * Moves the 3d object forwards along it's local z axis
            *
            * @param    distance    The length of the movement
            */
            /* TODO: implement
            public moveForward(distance:number)
            {
            translateLocal(Vector3D.Z_AXIS, distance);
            }
            */
            /**
            * Moves the 3d object backwards along it's local z axis
            *
            * @param    distance    The length of the movement
            */
            /* TODO: implement
            public moveBackward(distance:number)
            {
            translateLocal(Vector3D.Z_AXIS, -distance);
            }
            */
            /**
            * Moves the 3d object backwards along it's local x axis
            *
            * @param    distance    The length of the movement
            */
            /* TODO: implement
            public moveLeft(distance:number)
            {
            translateLocal(Vector3D.X_AXIS, -distance);
            }
            */
            /**
            * Moves the 3d object forwards along it's local x axis
            *
            * @param    distance    The length of the movement
            */
            /* TODO: implement
            public moveRight(distance:number)
            {
            translateLocal(Vector3D.X_AXIS, distance);
            }
            */
            /**
            * Moves the 3d object forwards along it's local y axis
            *
            * @param    distance    The length of the movement
            */
            /* TODO: implement
            public moveUp(distance:number)
            {
            translateLocal(Vector3D.Y_AXIS, distance);
            }
            */
            /**
            * Moves the 3d object backwards along it's local y axis
            *
            * @param    distance    The length of the movement
            */
            /* TODO: implement
            public moveDown(distance:number)
            {
            translateLocal(Vector3D.Y_AXIS, -distance);
            }
            */
            /**
            * Moves the 3d object directly to a point in space
            *
            * @param    dx        The amount of movement along the local x axis.
            * @param    dy        The amount of movement along the local y axis.
            * @param    dz        The amount of movement along the local z axis.
            */
            Object3D.prototype.moveTo = function (dx, dy, dz) {
                if (this._x == dx && this._y == dy && this._z == dz) {
                    return;
                }

                this._x = dx;
                this._y = dy;
                this._z = dz;

                this.invalidatePosition();
            };

            /**
            * Moves the local point around which the object rotates.
            *
            * @param    dx        The amount of movement along the local x axis.
            * @param    dy        The amount of movement along the local y axis.
            * @param    dz        The amount of movement along the local z axis.
            */
            Object3D.prototype.movePivot = function (dx, dy, dz) {
                if (this._pivotPoint == null) {
                    this._pivotPoint = new away.geom.Vector3D();
                }

                this._pivotPoint.x += dx;
                this._pivotPoint.y += dy;
                this._pivotPoint.z += dz;

                this.invalidatePivot();
            };

            /**
            * Moves the 3d object along a vector by a defined length
            *
            * @param    axis        The vector defining the axis of movement
            * @param    distance    The length of the movement
            */
            Object3D.prototype.translate = function (axis, distance) {
                var x = axis.x, y = axis.y, z = axis.z;
                var len = distance / Math.sqrt(x * x + y * y + z * z);

                this._x += x * len;
                this._y += y * len;
                this._z += z * len;

                this.invalidatePosition();
            };

            /**
            * Moves the 3d object along a vector by a defined length
            *
            * @param    axis        The vector defining the axis of movement
            * @param    distance    The length of the movement
            */
            Object3D.prototype.translateLocal = function (axis, distance) {
                var x = axis.x, y = axis.y, z = axis.z;
                var len = distance / Math.sqrt(x * x + y * y + z * z);

                this.transform.prependTranslation(x * len, y * len, z * len);

                this._transform.copyColumnTo(3, this._pos);

                this._x = this._pos.x;
                this._y = this._pos.y;
                this._z = this._pos.z;

                this.invalidatePosition();
            };

            /**
            * Rotates the 3d object around it's local x-axis
            *
            * @param    angle        The amount of rotation in degrees
            */
            /* TODO: implement
            public pitch(angle:number)
            {
            rotate(Vector3D.X_AXIS, angle);
            }
            */
            /**
            * Rotates the 3d object around it's local y-axis
            *
            * @param    angle        The amount of rotation in degrees
            */
            /* TODO: implement
            public yaw(angle:number)
            {
            rotate(Vector3D.Y_AXIS, angle);
            }
            */
            /**
            * Rotates the 3d object around it's local z-axis
            *
            * @param    angle        The amount of rotation in degrees
            */
            /* TODO: implement
            public roll(angle:number)
            {
            rotate(Vector3D.Z_AXIS, angle);
            }
            */
            //* TODO: implement
            Object3D.prototype.clone = function () {
                var clone = new away.base.Object3D();
                clone.pivotPoint = this.pivotPoint;
                clone.transform = this.transform;
                clone.name = name;

                // todo: implement for all subtypes
                return clone;
            };

            //*/
            /**
            * Rotates the 3d object directly to a euler angle
            *
            * @param    ax        The angle in degrees of the rotation around the x axis.
            * @param    ay        The angle in degrees of the rotation around the y axis.
            * @param    az        The angle in degrees of the rotation around the z axis.
            */
            Object3D.prototype.rotateTo = function (ax, ay, az) {
                this._rotationX = ax * away.math.MathConsts.DEGREES_TO_RADIANS;
                this._rotationY = ay * away.math.MathConsts.DEGREES_TO_RADIANS;
                this._rotationZ = az * away.math.MathConsts.DEGREES_TO_RADIANS;

                this.invalidateRotation();
            };

            /**
            * Rotates the 3d object around an axis by a defined angle
            *
            * @param    axis        The vector defining the axis of rotation
            * @param    angle        The amount of rotation in degrees
            */
            Object3D.prototype.rotate = function (axis, angle) {
                this.transform.prependRotation(angle, axis);
                this.transform = this.transform;
            };

            /**
            * Rotates the 3d object around to face a point defined relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
            *
            * @param    target        The vector defining the point to be looked at
            * @param    upAxis        An optional vector used to define the desired up orientation of the 3d object after rotation has occurred
            */
            /* TODO: implement
            public lookAt(target:away.geom.Vector3D, upAxis:away.geom.Vector3D = null)
            {
            var yAxis:away.geom.Vector3D, zAxis:away.geom.Vector3D, xAxis:away.geom.Vector3D;
            var raw:number[];
            
            
            if ( upAxis == null)
            {
            
            upAxis = away.geom.Vector3D.Y_AXIS;
            
            }
            
            
            zAxis = target.subtract(position);
            zAxis.normalize();
            
            xAxis = upAxis.crossProduct(zAxis);
            xAxis.normalize();
            
            if (xAxis.length < .05)
            xAxis = upAxis.crossProduct(Vector3D.Z_AXIS);
            
            yAxis = zAxis.crossProduct(xAxis);
            
            raw = away3d.math.Matrix3DUtils.RAW_DATA_CONTAINER;
            
            raw[uint(0)] = _scaleX*xAxis.x;
            raw[uint(1)] = _scaleX*xAxis.y;
            raw[uint(2)] = _scaleX*xAxis.z;
            raw[uint(3)] = 0;
            
            raw[uint(4)] = _scaleY*yAxis.x;
            raw[uint(5)] = _scaleY*yAxis.y;
            raw[uint(6)] = _scaleY*yAxis.z;
            raw[uint(7)] = 0;
            
            raw[uint(8)] = _scaleZ*zAxis.x;
            raw[uint(9)] = _scaleZ*zAxis.y;
            raw[uint(10)] = _scaleZ*zAxis.z;
            raw[uint(11)] = 0;
            
            raw[uint(12)] = _x;
            raw[uint(13)] = _y;
            raw[uint(14)] = _z;
            raw[uint(15)] = 1;
            
            _transform.copyRawDataFrom(raw);
            
            transform = transform;
            
            if (zAxis.z < 0) {
            rotationY = (180 - rotationY);
            rotationX -= 180;
            rotationZ -= 180;
            }
            }
            //*/
            /**
            * Cleans up any resources used by the current object.
            */
            //* TODO: implement
            Object3D.prototype.dispose = function () {
            };

            //*/
            /**
            * @inheritDoc
            */
            //* TODO: implement
            Object3D.prototype.disposeAsset = function () {
                this.dispose();
            };

            //*/
            /**
            * Invalidates the transformation matrix, causing it to be updated upon the next request
            */
            Object3D.prototype._iInvalidateTransform = function () {
                this._transformDirty = true;
            };

            Object3D.prototype._pUpdateTransform = function () {
                this._pos.x = this._x;
                this._pos.y = this._y;
                this._pos.z = this._z;

                this._rot.x = this._rotationX;
                this._rot.y = this._rotationY;
                this._rot.z = this._rotationZ;

                this._sca.x = this._scaleX;
                this._sca.y = this._scaleY;
                this._sca.z = this._scaleZ;

                this._transform.recompose(this._transformComponents);

                if (!this._pivotZero) {
                    this._transform.prependTranslation(-this._pivotPoint.x, -this._pivotPoint.y, -this._pivotPoint.z);
                    this._transform.appendTranslation(this._pivotPoint.x, this._pivotPoint.y, this._pivotPoint.z);
                }

                this._transformDirty = false;
                this._positionDirty = false;
                this._rotationDirty = false;
                this._scaleDirty = false;
            };

            Object.defineProperty(Object3D.prototype, "zOffset", {
                get: function () {
                    return this._zOffset;
                },
                set: function (value) {
                    this._zOffset = value;
                },
                enumerable: true,
                configurable: true
            });

            return Object3D;
        })(away.library.NamedAssetBase);
        base.Object3D = Object3D;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
///<reference path="../src/away/base/Object3D.ts" />
///<reference path="../src/away/math/MathConsts.ts" />
///<reference path="../src/away/math/Quaternion.ts" />
///<reference path="../src/away/math/Matrix3DUtils.ts" />
///<reference path="../src/away/math/Plane3D.ts" />
///<reference path="../src/away/geom/Matrix3D.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/Object3DTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/Object3DTest.js
//------------------------------------------------------------------------------------------------
var Object3DTest = (function () {
    function Object3DTest() {
        var q = new away.math.Quaternion();
        var m = new away.geom.Matrix3D();

        this.obj = new away.base.Object3D();

        this.obj.x = 100;
        this.obj.y = 100;
        this.obj.z = 100;

        this.obj.scaleX = 1;
        this.obj.scaleY = 2;
        this.obj.scaleZ = 3;

        console.log(this.obj.transform);

        away.math.Matrix3DUtils;
    }
    return Object3DTest;
})();

var test;
window.onload = function () {
    test = new Object3DTest();
};
//@ sourceMappingURL=Object3DTest.js.map
