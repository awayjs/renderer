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
    ///<reference path="../_definitions.ts"/>
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (events) {
        var LightEvent = (function (_super) {
            __extends(LightEvent, _super);
            function LightEvent(type) {
                _super.call(this, type);
            }
            //@override
            LightEvent.prototype.clone = function () {
                return new away.events.LightEvent(this.type);
            };
            LightEvent.CASTS_SHADOW_CHANGE = "castsShadowChange";
            return LightEvent;
        })(away.events.Event);
        events.LightEvent = LightEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts" />
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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (events) {
        var Scene3DEvent = (function (_super) {
            __extends(Scene3DEvent, _super);
            function Scene3DEvent(type, objectContainer) {
                this.objectContainer3D = objectContainer;
                _super.call(this, type);
            }
            Object.defineProperty(Scene3DEvent.prototype, "target", {
                get: //@override
                function () {
                    return this.objectContainer3D;
                },
                enumerable: true,
                configurable: true
            });
            Scene3DEvent.ADDED_TO_SCENE = "addedToScene";
            Scene3DEvent.REMOVED_FROM_SCENE = "removedFromScene";
            Scene3DEvent.PARTITION_CHANGED = "partitionChanged";
            return Scene3DEvent;
        })(away.events.Event);
        events.Scene3DEvent = Scene3DEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (containers) {
        var Scene3D = (function (_super) {
            __extends(Scene3D, _super);
            function Scene3D() {
                _super.call(this);
                this._partitions = [];
                this._iSceneGraphRoot = new away.containers.ObjectContainer3D();

                this._iSceneGraphRoot.scene = this;
                this._iSceneGraphRoot._iIsRoot = true;
                this._iSceneGraphRoot.partition = new away.partition.Partition3D(new away.partition.NodeBase());
            }
            Scene3D.prototype.traversePartitions = function (traverser) {
                var i;
                var len = this._partitions.length;

                traverser.scene = this;

                while (i < len) {
                    this._partitions[i++].traverse(traverser);
                }
            };

            Object.defineProperty(Scene3D.prototype, "partition", {
                get: function () {
                    return this._iSceneGraphRoot.partition;
                },
                set: function (value) {
                    this._iSceneGraphRoot.partition = value;
                    this.dispatchEvent(new away.events.Scene3DEvent(away.events.Scene3DEvent.PARTITION_CHANGED, this._iSceneGraphRoot));
                },
                enumerable: true,
                configurable: true
            });


            Scene3D.prototype.contains = function (child) {
                return this._iSceneGraphRoot.contains(child);
            };

            Scene3D.prototype.addChild = function (child) {
                return this._iSceneGraphRoot.addChild(child);
            };
            return Scene3D;
        })(away.events.EventDispatcher);
        containers.Scene3D = Scene3D;
    })(away.containers || (away.containers = {}));
    var containers = away.containers;
})(away || (away = {}));
var away;
(function (away) {
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
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
    (function (display3D) {
        var VertexBuffer3D = (function () {
            function VertexBuffer3D(numVertices, data32PerVertex) {
                this._buffer = GL.createBuffer();
                this._numVertices = numVertices;
                this._data32PerVertex = data32PerVertex;
            }
            VertexBuffer3D.prototype.uploadFromArray = function (vertices, startVertex, numVertices) {
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
    ///<reference path="../_definitions.ts"/>
    (function (display3D) {
        var IndexBuffer3D = (function () {
            function IndexBuffer3D(numIndices) {
                this._buffer = GL.createBuffer();
                this._numIndices = numIndices;
            }
            IndexBuffer3D.prototype.uploadFromArray = function (data, startOffset, count) {
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts" />
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
    ///<reference path="../_definitions.ts"/>
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

            Texture.prototype.uploadFromBitmapData = function (data, miplevel) {
                if (typeof miplevel === "undefined") { miplevel = 0; }
                GL.texImage2D(GL.TEXTURE_2D, miplevel, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, data.imageData);
            };
            return Texture;
        })(display3D.TextureBase);
        display3D.Texture = Texture;
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
    ///<reference path="../_definitions.ts"/>
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
                away.Debug.log("===== clear =====");
                away.Debug.log("\tred: " + red);
                away.Debug.log("\tgreen: " + green);
                away.Debug.log("\tblue: " + blue);
                away.Debug.log("\talpha: " + alpha);
                away.Debug.log("\tdepth: " + depth);
                away.Debug.log("\tstencil: " + stencil);
                away.Debug.log("\tmask: " + mask);

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
                away.Debug.log("===== configureBackBuffer =====");
                away.Debug.log("\twidth: " + width);
                away.Debug.log("\theight: " + height);
                away.Debug.log("\tantiAlias: " + antiAlias);
                away.Debug.log("\tenableDepthAndStencil: " + enableDepthAndStencil);

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
            var texture: Texture = new away.display3D.CubeTexture( );
            this._textureList.push( texture );
            return texture;
            }*/
            Context3D.prototype.createIndexBuffer = function (numIndices) {
                away.Debug.log("===== createIndexBuffer =====");
                away.Debug.log("\tnumIndices: " + numIndices);
                var indexBuffer = new away.display3D.IndexBuffer3D(numIndices);
                this._indexBufferList.push(indexBuffer);
                return indexBuffer;
            };

            Context3D.prototype.createProgram = function () {
                away.Debug.log("===== createProgram =====");
                var program = new away.display3D.Program3D();
                this._programList.push(program);
                return program;
            };

            Context3D.prototype.createTexture = function (width, height, format, optimizeForRenderToTexture, streamingLevels) {
                if (typeof streamingLevels === "undefined") { streamingLevels = 0; }
                away.Debug.log("===== createTexture =====");
                away.Debug.log("\twidth: " + width);
                away.Debug.log("\theight: " + height);
                away.Debug.log("\tformat: " + format);
                away.Debug.log("\toptimizeForRenderToTexture: " + optimizeForRenderToTexture);
                away.Debug.log("\tstreamingLevels: " + streamingLevels);

                var texture = new away.display3D.Texture(width, height);
                this._textureList.push(texture);
                return texture;
            };

            Context3D.prototype.createVertexBuffer = function (numVertices, data32PerVertex) {
                away.Debug.log("===== createVertexBuffer =====");
                away.Debug.log("\tnumVertices: " + numVertices);
                away.Debug.log("\tdata32PerVertex: " + data32PerVertex);
                var vertexBuffer = new away.display3D.VertexBuffer3D(numVertices, data32PerVertex);
                this._vertexBufferList.push(vertexBuffer);
                return vertexBuffer;
            };

            Context3D.prototype.dispose = function () {
                away.Debug.log("===== dispose =====");
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
                away.Debug.log("===== drawTriangles =====");
                away.Debug.log("\tfirstIndex: " + firstIndex);
                away.Debug.log("\tnumTriangles: " + numTriangles);

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
                away.Debug.log("===== present =====");
                this._drawing = false;
                GL.useProgram(null);
            };

            //TODO Context3DBlendFactor
            Context3D.prototype.setBlendFactors = function (sourceFactor, destinationFactor) {
                away.Debug.log("===== setBlendFactors =====");
                away.Debug.log("\tsourceFactor: " + sourceFactor);
                away.Debug.log("\tdestinationFactor: " + destinationFactor);
                this._blendEnabled = true;
                this._blendSourceFactor = sourceFactor;
                this._blendDestinationFactor = destinationFactor;

                this.updateBlendStatus();
            };

            Context3D.prototype.setColorMask = function (red, green, blue, alpha) {
                away.Debug.log("===== setColorMask =====");
                GL.colorMask(red, green, blue, alpha);
            };

            Context3D.prototype.setCulling = function (triangleFaceToCull) {
                away.Debug.log("===== setCulling =====");
                away.Debug.log("\ttriangleFaceToCull: " + triangleFaceToCull);
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
                away.Debug.log("===== setDepthTest =====");
                away.Debug.log("\tdepthMask: " + depthMask);
                away.Debug.log("\tpassCompareMode: " + passCompareMode);
                GL.depthFunc(passCompareMode);
                GL.depthMask(depthMask);
            };

            Context3D.prototype.setProgram = function (program3D) {
                away.Debug.log("===== setProgram =====");

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
            
            }*/
            /*
            public setGLSLProgramConstantsFromByteArray
            
            */
            Context3D.prototype.setGLSLProgramConstantsFromMatrix = function (locationName, matrix, transposedMatrix) {
                if (typeof transposedMatrix === "undefined") { transposedMatrix = false; }
                away.Debug.log("===== setGLSLProgramConstantsFromMatrix =====");
                away.Debug.log("\tlocationName: " + locationName);
                away.Debug.log("\tmatrix: " + matrix.rawData);
                away.Debug.log("\ttransposedMatrix: " + transposedMatrix);

                var location = GL.getUniformLocation(this._currentProgram.glProgram, locationName);
                GL.uniformMatrix4fv(location, !transposedMatrix, new Float32Array(matrix.rawData));
            };

            Context3D.prototype.setGLSLProgramConstantsFromVector4 = function (locationName, data, startIndex) {
                if (typeof startIndex === "undefined") { startIndex = 0; }
                away.Debug.log("===== setGLSLProgramConstantsFromVector4 =====");
                away.Debug.log("\tlocationName: " + locationName);
                away.Debug.log("\tdata: " + data);
                away.Debug.log("\tstartIndex: " + startIndex);
                var location = GL.getUniformLocation(this._currentProgram.glProgram, locationName);
                GL.uniform4f(location, data[startIndex], data[startIndex + 1], data[startIndex + 2], data[startIndex + 3]);
            };

            Context3D.prototype.setScissorRectangle = function (rectangle) {
                away.Debug.log("===== setScissorRectangle =====");
                away.Debug.log("\trectangle: " + rectangle);
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
                away.Debug.log("===== setVertexBufferAt =====");
                away.Debug.log("\tindex: " + index);
                away.Debug.log("\tbufferOffset: " + bufferOffset);
                away.Debug.log("\tformat: " + format);

                var locationName = "va" + index;
                this.setGLSLVertexBufferAt(locationName, buffer, bufferOffset, format);
            };

            Context3D.prototype.setGLSLVertexBufferAt = function (locationName, buffer, bufferOffset, format) {
                if (typeof bufferOffset === "undefined") { bufferOffset = 0; }
                if (typeof format === "undefined") { format = null; }
                away.Debug.log("===== setGLSLVertexBufferAt =====");
                away.Debug.log("\tbuffer.length: " + buffer.numVertices);
                away.Debug.log("\tbuffer.data32PerVertex: " + buffer.data32PerVertex);
                away.Debug.log("\tlocationName: " + locationName);
                away.Debug.log("\tbufferOffset: " + bufferOffset);

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
                away.Debug.log("===== updateBlendStatus =====");
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
    ///<reference path="../_definitions.ts"/>
    (function (materials) {
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
        var MaterialBase = (function (_super) {
            __extends(MaterialBase, _super);
            //private var _depthCompareMode:string = Context3DCompareMode.LESS_EQUAL; TODO: Context3DCompareMode - Implement & integrate
            /**
            * Creates a new MaterialBase object.
            */
            function MaterialBase() {
                _super.call(this);
                this._blendMode = away.display.BlendMode.NORMAL;
                //private _passes:Vector.<MaterialPassBase>; // TODO: MaterialPassBase - Implement & integrate
                this._mipmap = true;
                this._smooth = true;

                this._owners = new Array();

                //_passes = new Vector.<MaterialPassBase>(); // TODO: MaterialPassBase - Implement & integrate
                //_depthPass = new DepthMapPass();// TODO: DepthMapPass - Implement & integrate
                //_distancePass = new DistanceMapPass();// TODO: DistanceMapPass - Implement & integrate
                //_depthPass.addEventListener(Event.CHANGE, onDepthPassChange);// TODO: DepthMapPass - Implement & integrate
                //_distancePass.addEventListener(Event.CHANGE, onDistancePassChange);// TODO: DistanceMapPass - Implement & integrate
                // Default to considering pre-multiplied textures while blending
                this.alphaPremultiplied = true;

                this._iUniqueId = away.materials.MaterialBase.MATERIAL_ID_COUNT++;
            }
            Object.defineProperty(MaterialBase.prototype, "assetType", {
                get: /**
                * @inheritDoc
                */
                function () {
                    return away.library.AssetType.MATERIAL;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MaterialBase.prototype, "mipmap", {
                get: /**
                * The light picker used by the material to provide lights to the material if it supports lighting.
                *
                * @see away3d.materials.lightpickers.LightPickerBase
                * @see away3d.materials.lightpickers.StaticLightPicker
                */
                // TODO: LightPickerBase - Implement & integrate
                /*
                public get lightPicker():LightPickerBase
                {
                return _lightPicker;
                }
                */
                // TODO: LightPickerBase - Implement & integrate
                /*
                public set lightPicker(value:LightPickerBase)
                {
                if (value != _lightPicker) {
                _lightPicker = value;
                var len:number = _passes.length;
                for (var i:number = 0; i < len; ++i)
                _passes[i].lightPicker = _lightPicker;
                }
                }
                */
                /**
                * Indicates whether or not any used textures should use mipmapping. Defaults to true.
                */
                function () {
                    return this._mipmap;
                },
                set: function (value) {
                    this._mipmap = value;

                    throw new away.errors.PartialImplementationError('MaterialPassBase');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(MaterialBase.prototype, "smooth", {
                get: /**
                * Indicates whether or not any used textures should use smoothing.
                */
                function () {
                    return this._smooth;
                },
                set: function (value) {
                    this._smooth = value;

                    throw new away.errors.PartialImplementationError('MaterialPassBase');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(MaterialBase.prototype, "repeat", {
                get: /**
                * The depth compare mode used to render the renderables using this material.
                *
                * @see flash.display3D.Context3DCompareMode
                */
                // TODO: Context3DCompareMode - Implement & integrate
                /*
                public get depthCompareMode():string
                {
                return this._depthCompareMode;
                }
                */
                // TODO: Context3DCompareMode - Implement & integrate
                /*
                public set depthCompareMode(value:string)
                {
                _depthCompareMode = value;
                }
                */
                /**
                * Indicates whether or not any used textures should be tiled. If set to false, texture samples are clamped to
                * the texture's borders when the uv coordinates are outside the [0, 1] interval.
                */
                function () {
                    return this._repeat;
                },
                set: function (value) {
                    this._repeat = value;

                    throw new away.errors.PartialImplementationError('MaterialPassBase');
                },
                enumerable: true,
                configurable: true
            });


            /**
            * Cleans up resources owned by the material, including passes. Textures are not owned by the material since they
            * could be used by other materials and will not be disposed.
            */
            MaterialBase.prototype.dispose = function () {
                var i;

                throw new away.errors.PartialImplementationError('DepthMapPass , DistanceMapPass');
            };

            Object.defineProperty(MaterialBase.prototype, "bothSides", {
                get: /**
                * Defines whether or not the material should cull triangles facing away from the camera.
                */
                function () {
                    return this._bothSides;
                },
                set: function (value) {
                    this._bothSides = value;

                    throw new away.errors.PartialImplementationError('DepthMapPass , DistanceMapPass');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(MaterialBase.prototype, "blendMode", {
                get: /**
                * The blend mode to use when drawing this renderable. The following blend modes are supported:
                * <ul>
                * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
                * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
                * <li>BlendMode.MULTIPLY</li>
                * <li>BlendMode.ADD</li>
                * <li>BlendMode.ALPHA</li>
                * </ul>
                */
                function () {
                    return this._blendMode;
                },
                set: function (value) {
                    this._blendMode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(MaterialBase.prototype, "alphaPremultiplied", {
                get: /**
                * Indicates whether visible textures (or other pixels) used by this material have
                * already been premultiplied. Toggle this if you are seeing black halos around your
                * blended alpha edges.
                */
                function () {
                    return this._alphaPremultiplied;
                },
                set: function (value) {
                    this._alphaPremultiplied = value;

                    throw new away.errors.PartialImplementationError('MaterialPassBase');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(MaterialBase.prototype, "requiresBlending", {
                get: /**
                * Indicates whether or not the material requires alpha blending during rendering.
                */
                function () {
                    return this._blendMode != away.display.BlendMode.NORMAL;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MaterialBase.prototype, "uniqueId", {
                get: /**
                * An id for this material used to sort the renderables by material, which reduces render state changes across
                * materials using the same Program3D.
                */
                function () {
                    return this._iUniqueId;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MaterialBase.prototype, "_iNumPasses", {
                get: /**
                * The amount of passes used by the material.
                *
                * @private
                */
                function () {
                    return this._numPasses;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MaterialBase.prototype, "_iOwners", {
                get: /**
                * Indicates that the depth pass uses transparency testing to discard pixels.
                *
                * @private
                */
                // TODO: DepthMapPass - Implement & integrate
                /*
                public _iHasDepthAlphaThreshold():boolean
                {
                
                return this._depthPass.alphaThreshold > 0;
                
                }
                */
                /**
                * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
                * depth or distances (fe: shadow maps, depth pre-pass).
                *
                * @param stage3DProxy The Stage3DProxy used for rendering.
                * @param camera The camera from which the scene is viewed.
                * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
                * is required for shadow cube maps.
                *
                * @private
                */
                // TODO: Stage3DProxy / Camera3D / DepthMapPass / DistanceMapPass - Implement & integrate
                /*
                public _iActivateForDepth(stage3DProxy:Stage3DProxy, camera:Camera3D, distanceBased:boolean = false) // ARCANE
                {
                this._distanceBasedDepthRender = distanceBased;
                
                if (distanceBased)
                {
                
                this._distancePass.activate(stage3DProxy, camera);
                
                }
                else
                {
                
                this._depthPass.activate(stage3DProxy, camera);
                
                }
                
                }
                //*/
                /**
                * Clears the render state for the depth pass.
                *
                * @param stage3DProxy The Stage3DProxy used for rendering.
                *
                * @private
                */
                //TODO: Stage3DProxy / DepthMapPass / DistanceMapPass - Implement & integrate
                /*
                public _iDeactivateForDepth(stage3DProxy:Stage3DProxy)
                {
                if (_distanceBasedDepthRender)
                _distancePass.deactivate(stage3DProxy);
                else
                _depthPass.deactivate(stage3DProxy);
                }
                */
                /**
                * Renders a renderable using the depth pass.
                *
                * @param renderable The IRenderable instance that needs to be rendered.
                * @param stage3DProxy The Stage3DProxy used for rendering.
                * @param camera The camera from which the scene is viewed.
                * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
                * camera.viewProjection as it includes the scaling factors when rendering to textures.
                *
                * @private
                */
                //TODO: Stage3DProxy / DepthMapPass / DistanceMapPass / IAnimationSet - Implement & integrate
                /*
                public _iRenderDepth(renderable:IRenderable, stage3DProxy:Stage3DProxy, camera:Camera3D, viewProjection:Matrix3D) // ARCANE
                {
                if (_distanceBasedDepthRender) {
                if (renderable.animator)
                _distancePass.updateAnimationState(renderable, stage3DProxy, camera);
                _distancePass.render(renderable, stage3DProxy, camera, viewProjection);
                } else {
                if (renderable.animator)
                _depthPass.updateAnimationState(renderable, stage3DProxy, camera);
                _depthPass.render(renderable, stage3DProxy, camera, viewProjection);
                }
                }
                */
                /**
                * Indicates whether or not the pass with the given index renders to texture or not.
                * @param index The index of the pass.
                * @return True if the pass renders to texture, false otherwise.
                *
                * @private
                */
                //TODO: MaterialPassBase - Implement & integrate
                /*
                public _iPassRendersToTexture(index:number):boolean
                {
                return _passes[index].renderToTexture;
                }
                */
                /**
                * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
                * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
                * @param index The index of the pass to activate.
                * @param stage3DProxy The Stage3DProxy object which is currently used for rendering.
                * @param camera The camera from which the scene is viewed.
                * @private
                */
                //TODO: MaterialPassBase - Implement & integrate
                /*
                public _iActivatePass(index:number, stage3DProxy:Stage3DProxy, camera:Camera3D) // ARCANE
                {
                this._passes[index].activate(stage3DProxy, camera);
                }
                */
                /**
                * Clears the render state for a pass. This needs to be called before activating another pass.
                * @param index The index of the pass to deactivate.
                * @param stage3DProxy The Stage3DProxy used for rendering
                *
                * @private
                */
                //TODO: MaterialPassBase - Implement & integrate
                /*
                public _iDeactivatePass(index:number, stage3DProxy:Stage3DProxy) // ARCANE
                {
                _passes[index].deactivate(stage3DProxy);
                }
                */
                /**
                * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
                * @param index The index of the pass used to render the renderable.
                * @param renderable The IRenderable object to draw.
                * @param stage3DProxy The Stage3DProxy object used for rendering.
                * @param entityCollector The EntityCollector object that contains the visible scene data.
                * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
                * camera.viewProjection as it includes the scaling factors when rendering to textures.
                */
                //TODO: MaterialPassBase / Stage3DProxy / EntityCollector / IAnimationSet - Implement & integrate
                /*
                arcane function renderPass(index:number, renderable:IRenderable, stage3DProxy:Stage3DProxy, entityCollector:EntityCollector, viewProjection:Matrix3D)
                {
                if (_lightPicker)
                _lightPicker.collectLights(renderable, entityCollector);
                
                var pass:MaterialPassBase = _passes[index];
                
                if (renderable.animator)
                pass.updateAnimationState(renderable, stage3DProxy, entityCollector.camera);
                
                pass.render(renderable, stage3DProxy, entityCollector.camera, viewProjection);
                }
                */
                //
                // MATERIAL MANAGEMENT
                //
                /**
                * Mark an IMaterialOwner as owner of this material.
                * Assures we're not using the same material across renderables with different animations, since the
                * Program3Ds depend on animation. This method needs to be called when a material is assigned.
                *
                * @param owner The IMaterialOwner that had this material assigned
                *
                * @private
                */
                /* TODO: IAnimationSet - implement and integrate
                public _iAddOwner(owner:away.base.IMaterialOwner) // ARCANE
                {
                _owners.push(owner);
                
                if (owner.animator) {
                if (_animationSet && owner.animator.animationSet != _animationSet)
                throw new Error("A Material instance cannot be shared across renderables with different animator libraries");
                else {
                if (_animationSet != owner.animator.animationSet) {
                _animationSet = owner.animator.animationSet;
                for (var i:number = 0; i < _numPasses; ++i)
                _passes[i].animationSet = _animationSet;
                _depthPass.animationSet = _animationSet;
                _distancePass.animationSet = _animationSet;
                invalidatePasses(null);
                }
                }
                }
                }
                */
                /**
                * Removes an IMaterialOwner as owner.
                * @param owner
                * @private
                */
                /* TODO: IAnimationSet - implement and integrate
                public _iRemoveOwner(owner:away.base.IMaterialOwner) // ARCANE
                {
                _owners.splice(_owners.indexOf(owner), 1);
                if (_owners.length == 0) {
                _animationSet = null;
                for (var i:number = 0; i < _numPasses; ++i)
                _passes[i].animationSet = _animationSet;
                _depthPass.animationSet = _animationSet;
                _distancePass.animationSet = _animationSet;
                invalidatePasses(null);
                }
                }
                */
                /**
                * A list of the IMaterialOwners that use this material
                *
                * @private
                */
                function () {
                    return this._owners;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Performs any processing that needs to occur before any of its passes are used.
            *
            * @private
            */
            MaterialBase.prototype._iUpdateMaterial = function (context) {
                throw new away.errors.AbstractMethodError();
            };
            MaterialBase.MATERIAL_ID_COUNT = 0;
            return MaterialBase;
        })(away.library.NamedAssetBase);
        materials.MaterialBase = MaterialBase;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (traverse) {
        var PartitionTraverser = (function () {
            function PartitionTraverser() {
            }
            PartitionTraverser.prototype.enterNode = function (node) {
                node = node;
                return true;
            };

            PartitionTraverser.prototype.applySkyBox = function (renderable) {
                throw new away.errors.AbstractMethodError();
            };

            PartitionTraverser.prototype.applyRenderable = function (renderable) {
                throw new away.errors.AbstractMethodError();
            };

            PartitionTraverser.prototype.applyUnknownLight = function (light) {
                throw new away.errors.AbstractMethodError();
            };

            /*
            public applyDirectionalLight(light:DirectionalLight)
            {
            throw new away.errors.AbstractMethodError();
            }
            
            public applyPointLight(light:PointLight)
            {
            throw new away.errors.AbstractMethodError();
            }
            
            public applyLightProbe(light:LightProbe)
            {
            throw new away.errors.AbstractMethodError();
            }
            */
            PartitionTraverser.prototype.applyEntity = function (entity) {
                throw new away.errors.AbstractMethodError();
            };

            Object.defineProperty(PartitionTraverser.prototype, "entryPoint", {
                get: function () {
                    return this._iEntryPoint;
                },
                enumerable: true,
                configurable: true
            });
            PartitionTraverser._iCollectionMark = 0;
            return PartitionTraverser;
        })();
        traverse.PartitionTraverser = PartitionTraverser;
    })(away.traverse || (away.traverse = {}));
    var traverse = away.traverse;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts"/>
    (function (primitives) {
        var Segment = (function () {
            function Segment(start, end, anchor, colorStart, colorEnd, thickness) {
                if (typeof colorStart === "undefined") { colorStart = 0x333333; }
                if (typeof colorEnd === "undefined") { colorEnd = 0x333333; }
                if (typeof thickness === "undefined") { thickness = 1; }
                this._index = -1;
                this._subSetIndex = -1;
                // TODO: not yet used: for CurveSegment support
                anchor = null;

                this._pThickness = thickness * 0.5;

                // TODO: add support for curve using anchor v1
                // Prefer removing v1 from this, and make Curve a separate class extending Segment? (- David)
                this._pStart = start;
                this._pEnd = end;
                this.startColor = colorStart;
                this.endColor = colorEnd;
            }
            Segment.prototype.updateSegment = function (start, end, anchor, colorStart, colorEnd, thickness) {
                if (typeof colorStart === "undefined") { colorStart = 0x333333; }
                if (typeof colorEnd === "undefined") { colorEnd = 0x333333; }
                if (typeof thickness === "undefined") { thickness = 1; }
                // TODO: not yet used: for CurveSegment support
                anchor = null;
                this._pStart = start;
                this._pEnd = end;

                if (this._startColor != colorStart) {
                    this.startColor = colorStart;
                }
                if (this._endColor != colorEnd) {
                    this.endColor = colorEnd;
                }
                this._pThickness = thickness * 0.5;
                this.update();
            };

            Object.defineProperty(Segment.prototype, "start", {
                get: function () {
                    return this._pStart;
                },
                set: function (value) {
                    this._pStart = value;
                    this.update();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Segment.prototype, "end", {
                get: function () {
                    return this._pEnd;
                },
                set: function (value) {
                    this._pEnd = value;
                    this.update();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Segment.prototype, "thickness", {
                get: function () {
                    return this._pThickness * 2;
                },
                set: function (value) {
                    this._pThickness = value * 0.5;
                    this.update();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Segment.prototype, "startColor", {
                get: function () {
                    return this._startColor;
                },
                set: function (color) {
                    this._pStartR = ((color >> 16) & 0xff) / 255;
                    this._pStartG = ((color >> 8) & 0xff) / 255;
                    this._pStartB = (color & 0xff) / 255;

                    this._startColor = color;

                    this.update();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Segment.prototype, "endColor", {
                get: function () {
                    return this._endColor;
                },
                set: function (color) {
                    this._pEndR = ((color >> 16) & 0xff) / 255;
                    this._pEndG = ((color >> 8) & 0xff) / 255;
                    this._pEndB = (color & 0xff) / 255;

                    this._endColor = color;

                    this.update();
                },
                enumerable: true,
                configurable: true
            });


            Segment.prototype.dispose = function () {
                this._pStart = null;
                this._pEnd = null;
            };

            Object.defineProperty(Segment.prototype, "iIndex", {
                get: function () {
                    return this._index;
                },
                set: function (ind) {
                    this._index = ind;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Segment.prototype, "iSubSetIndex", {
                get: function () {
                    return this._subSetIndex;
                },
                set: function (ind) {
                    this._subSetIndex = ind;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Segment.prototype, "iSegmentsBase", {
                set: function (segBase) {
                    this._pSegmentsBase = segBase;
                },
                enumerable: true,
                configurable: true
            });

            Segment.prototype.update = function () {
                if (!this._pSegmentsBase) {
                    return;
                }
                this._pSegmentsBase.iUpdateSegment(this);
            };
            return Segment;
        })();
        primitives.Segment = Segment;
    })(away.primitives || (away.primitives = {}));
    var primitives = away.primitives;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (bounds) {
        var BoundingVolumeBase = (function () {
            function BoundingVolumeBase() {
                this._pAabbPoints = [];
                this._pAabbPointsDirty = true;
                this._pMin = new away.geom.Vector3D();
                this._pMax = new away.geom.Vector3D();
            }
            Object.defineProperty(BoundingVolumeBase.prototype, "max", {
                get: function () {
                    return this._pMax;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BoundingVolumeBase.prototype, "min", {
                get: function () {
                    return this._pMin;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BoundingVolumeBase.prototype, "aabbPoints", {
                get: function () {
                    if (this._pAabbPointsDirty) {
                        this.pUpdateAABBPoints();
                    }
                    return this._pAabbPoints;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BoundingVolumeBase.prototype, "boundingRenderable", {
                get: function () {
                    if (!this._pBoundingRenderable) {
                        this._pBoundingRenderable = this.pCreateBoundingRenderable();
                        this.pUpdateBoundingRenderable();
                    }
                    return this._pBoundingRenderable;
                },
                enumerable: true,
                configurable: true
            });

            BoundingVolumeBase.prototype.nullify = function () {
                this._pMin.x = this._pMin.y = this._pMin.z = 0;
                this._pMax.x = this._pMax.y = this._pMax.z = 0;
                this._pAabbPointsDirty = true;

                if (this._pBoundingRenderable) {
                    this.pUpdateBoundingRenderable();
                }
            };

            BoundingVolumeBase.prototype.disposeRenderable = function () {
                if (this._pBoundingRenderable) {
                    this._pBoundingRenderable.dispose();
                }
                this._pBoundingRenderable = null;
            };

            BoundingVolumeBase.prototype.fromVertices = function (vertices) {
                var i;
                var len = vertices.length;
                var minX, minY, minZ;
                var maxX, maxY, maxZ;

                if (len == 0) {
                    this.nullify();
                    return;
                }

                var v;

                minX = maxX = vertices[i++];
                minY = maxY = vertices[i++];
                minZ = maxZ = vertices[i++];

                while (i < len) {
                    v = vertices[i++];
                    if (v < minX)
                        minX = v; else if (v > maxX)
                        maxX = v;
                    v = vertices[i++];
                    if (v < minY)
                        minY = v; else if (v > maxY)
                        maxY = v;
                    v = vertices[i++];
                    if (v < minZ)
                        minZ = v; else if (v > maxZ)
                        maxZ = v;
                }

                this.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
            };

            /* TODO
            public fromGeometry(geometry:Geometry):void
            {
            var subGeoms:Vector.<ISubGeometry> = geometry.subGeometries;
            var numSubGeoms:uint = subGeoms.length;
            var minX:Number, minY:Number, minZ:Number;
            var maxX:Number, maxY:Number, maxZ:Number;
            
            if (numSubGeoms > 0) {
            var j:uint = 0;
            minX = minY = minZ = Number.POSITIVE_INFINITY;
            maxX = maxY = maxZ = Number.NEGATIVE_INFINITY;
            
            while (j < numSubGeoms) {
            var subGeom:ISubGeometry = subGeoms[j++];
            var vertices:Vector.<Number> = subGeom.vertexData;
            var vertexDataLen:uint = vertices.length;
            var i:uint = subGeom.vertexOffset;
            var stride:uint = subGeom.vertexStride;
            
            while (i < vertexDataLen) {
            var v:Number = vertices[i];
            if (v < minX)
            minX = v;
            else if (v > maxX)
            maxX = v;
            v = vertices[i + 1];
            if (v < minY)
            minY = v;
            else if (v > maxY)
            maxY = v;
            v = vertices[i + 2];
            if (v < minZ)
            minZ = v;
            else if (v > maxZ)
            maxZ = v;
            i += stride;
            }
            }
            
            fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
            } else
            fromExtremes(0, 0, 0, 0, 0, 0);
            }
            */
            BoundingVolumeBase.prototype.fromSphere = function (center, radius) {
                this.fromExtremes(center.x - radius, center.y - radius, center.z - radius, center.x + radius, center.y + radius, center.z + radius);
            };

            BoundingVolumeBase.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
                this._pMin.x = minX;
                this._pMin.y = minY;
                this._pMin.z = minZ;
                this._pMax.x = maxX;
                this._pMax.y = maxY;
                this._pMax.z = maxZ;
                this._pAabbPointsDirty = true;

                if (this._pBoundingRenderable) {
                    this.pUpdateBoundingRenderable();
                }
            };

            BoundingVolumeBase.prototype.isInFrustum = function (planes, numPlanes) {
                throw new away.errors.AbstractMethodError();
            };

            BoundingVolumeBase.prototype.overlaps = function (bounds) {
                var min = bounds._pMin;
                var max = bounds._pMax;
                return this._pMax.x > min.x && this._pMin.x < max.x && this._pMax.y > min.y && this._pMin.y < max.y && this._pMax.z > min.z && this._pMin.z < max.z;
            };

            BoundingVolumeBase.prototype.clone = function () {
                throw new away.errors.AbstractMethodError();
            };

            BoundingVolumeBase.prototype.rayIntersection = function (position, direction, targetNormal) {
                position = position;
                direction = direction;
                targetNormal = targetNormal;
                return -1;
            };

            BoundingVolumeBase.prototype.containsPoint = function (position) {
                position = position;
                return false;
            };

            BoundingVolumeBase.prototype.pUpdateAABBPoints = function () {
                var maxX = this._pMax.x;
                var maxY = this._pMax.y;
                var maxZ = this._pMax.z;
                var minX = this._pMin.x;
                var minY = this._pMin.y;
                var minZ = this._pMin.z;

                this._pAabbPoints[0] = minX;
                this._pAabbPoints[1] = minY;
                this._pAabbPoints[2] = minZ;
                this._pAabbPoints[3] = maxX;
                this._pAabbPoints[4] = minY;
                this._pAabbPoints[5] = minZ;
                this._pAabbPoints[6] = minX;
                this._pAabbPoints[7] = maxY;
                this._pAabbPoints[8] = minZ;
                this._pAabbPoints[9] = maxX;
                this._pAabbPoints[10] = maxY;
                this._pAabbPoints[11] = minZ;
                this._pAabbPoints[12] = minX;
                this._pAabbPoints[13] = minY;
                this._pAabbPoints[14] = maxZ;
                this._pAabbPoints[15] = maxX;
                this._pAabbPoints[16] = minY;
                this._pAabbPoints[17] = maxZ;
                this._pAabbPoints[18] = minX;
                this._pAabbPoints[19] = maxY;
                this._pAabbPoints[20] = maxZ;
                this._pAabbPoints[21] = maxX;
                this._pAabbPoints[22] = maxY;
                this._pAabbPoints[23] = maxZ;
                this._pAabbPointsDirty = false;
            };

            BoundingVolumeBase.prototype.pUpdateBoundingRenderable = function () {
                throw new away.errors.AbstractMethodError();
            };

            BoundingVolumeBase.prototype.pCreateBoundingRenderable = function () {
                throw new away.errors.AbstractMethodError();
            };

            BoundingVolumeBase.prototype.classifyToPlane = function (plane) {
                throw new away.errors.AbstractMethodError();
            };

            BoundingVolumeBase.prototype.transformFrom = function (bounds, matrix) {
                throw new away.errors.AbstractMethodError();
            };
            return BoundingVolumeBase;
        })();
        bounds.BoundingVolumeBase = BoundingVolumeBase;
    })(away.bounds || (away.bounds = {}));
    var bounds = away.bounds;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (events) {
        var LensEvent = (function (_super) {
            __extends(LensEvent, _super);
            function LensEvent(type, lens) {
                _super.call(this, type);
                this._lens = lens;
            }
            Object.defineProperty(LensEvent.prototype, "lens", {
                get: function () {
                    return this._lens;
                },
                enumerable: true,
                configurable: true
            });
            LensEvent.MATRIX_CHANGED = "matrixChanged";
            return LensEvent;
        })(away.events.Event);
        events.LensEvent = LensEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts" />
    (function (cameras) {
        var LensBase = (function (_super) {
            __extends(LensBase, _super);
            function LensBase() {
                _super.call(this);
                this._pScissorRect = new away.geom.Rectangle();
                this._pViewPort = new away.geom.Rectangle();
                this._pNear = 20;
                this._pFar = 3000;
                this._pAspectRatio = 1;
                this._pMatrixInvalid = true;
                this._pFrustumCorners = [];
                this._unprojectionInvalid = true;
                this._pMatrix = new away.geom.Matrix3D();
            }
            Object.defineProperty(LensBase.prototype, "frustumCorners", {
                get: function () {
                    return this._pFrustumCorners;
                },
                set: function (frustumCorners) {
                    this._pFrustumCorners = frustumCorners;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LensBase.prototype, "matrix", {
                get: function () {
                    if (this._pMatrixInvalid) {
                        this.pUpdateMatrix();
                        this._pMatrixInvalid = false;
                    }
                    return this._pMatrix;
                },
                set: function (value) {
                    this._pMatrix = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LensBase.prototype, "near", {
                get: function () {
                    return this._pNear;
                },
                set: function (value) {
                    if (value == this._pNear) {
                        return;
                    }
                    this._pNear = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LensBase.prototype, "far", {
                get: function () {
                    return this._pFar;
                },
                set: function (value) {
                    if (value == this._pFar) {
                        return;
                    }
                    this._pFar = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            LensBase.prototype.project = function (point3d) {
                var v = this.matrix.transformVector(point3d);
                v.x = v.x / v.w;
                v.y = -v.y / v.w;

                //z is unaffected by transform
                v.z = point3d.z;

                return v;
            };

            Object.defineProperty(LensBase.prototype, "unprojectionMatrix", {
                get: function () {
                    if (this._unprojectionInvalid) {
                        if (!this._unprojection) {
                            this._unprojection = new away.geom.Matrix3D();
                        }
                        this._unprojection.copyFrom(this.matrix);
                        this._unprojection.invert();
                        this._unprojectionInvalid = false;
                    }
                    return this._unprojection;
                },
                enumerable: true,
                configurable: true
            });

            LensBase.prototype.unproject = function (nX, nY, sZ) {
                throw new away.errors.AbstractMethodError();
            };

            LensBase.prototype.clone = function () {
                throw new away.errors.AbstractMethodError();
            };

            Object.defineProperty(LensBase.prototype, "iAspectRatio", {
                get: function () {
                    return this._pAspectRatio;
                },
                set: function (value) {
                    if (this._pAspectRatio == value) {
                        return;
                    }
                    this._pAspectRatio = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            LensBase.prototype.pInvalidateMatrix = function () {
                this._pMatrixInvalid = true;
                this._unprojectionInvalid = true;
                this.dispatchEvent(new away.events.LensEvent(away.events.LensEvent.MATRIX_CHANGED, this));
            };

            LensBase.prototype.pUpdateMatrix = function () {
                throw new away.errors.AbstractMethodError();
            };

            LensBase.prototype.iUpdateScissorRect = function (x, y, width, height) {
                this._pScissorRect.x = x;
                this._pScissorRect.y = y;
                this._pScissorRect.width = width;
                this._pScissorRect.height = height;
                this.pInvalidateMatrix();
            };

            LensBase.prototype.iUpdateViewport = function (x, y, width, height) {
                this._pViewPort.x = x;
                this._pViewPort.y = y;
                this._pViewPort.width = width;
                this._pViewPort.height = height;
                this.pInvalidateMatrix();
            };
            return LensBase;
        })(away.events.EventDispatcher);
        cameras.LensBase = LensBase;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts" />
    (function (cameras) {
        var PerspectiveLens = (function (_super) {
            __extends(PerspectiveLens, _super);
            function PerspectiveLens(fieldOfView) {
                if (typeof fieldOfView === "undefined") { fieldOfView = 60; }
                _super.call(this);
                this.fieldOfView = fieldOfView;
            }
            Object.defineProperty(PerspectiveLens.prototype, "fieldOfView", {
                get: function () {
                    return this._fieldOfView;
                },
                set: function (value) {
                    if (value == this._fieldOfView) {
                        return;
                    }
                    this._fieldOfView = value;

                    this._focalLengthInv = Math.tan(this._fieldOfView * Math.PI / 360);
                    this._focalLength = 1 / this._focalLengthInv;

                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PerspectiveLens.prototype, "focalLength", {
                get: function () {
                    return this._focalLength;
                },
                set: function (value) {
                    if (value == this._focalLength) {
                        return;
                    }
                    this._focalLength = value;

                    this._focalLengthInv = 1 / this._focalLength;
                    this._fieldOfView = Math.atan(this._focalLengthInv) * 360 / Math.PI;

                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            //@override
            PerspectiveLens.prototype.unproject = function (nX, nY, sZ) {
                var v = new away.geom.Vector3D(nX, -nY, sZ, 1.0);

                v.x *= sZ;
                v.y *= sZ;
                v.z = sZ;
                v = this.unprojectionMatrix.transformVector(v);

                return v;
            };

            //@override
            PerspectiveLens.prototype.clone = function () {
                var clone = new PerspectiveLens(this._fieldOfView);
                clone._pNear = this._pNear;
                clone._pFar = this._pFar;
                clone._pAspectRatio = this._pAspectRatio;
                return clone;
            };

            //@override
            PerspectiveLens.prototype.pUpdateMatrix = function () {
                var raw = [];

                this._yMax = this._pNear * this._focalLengthInv;
                this._xMax = this._yMax * this._pAspectRatio;

                var left, right, top, bottom;

                if (this._pScissorRect.x == 0 && this._pScissorRect.y == 0 && this._pScissorRect.width == this._pViewPort.width && this._pScissorRect.height == this._pViewPort.height) {
                    // assume unscissored frustum
                    left = -this._xMax;
                    right = this._xMax;
                    top = -this._yMax;
                    bottom = this._yMax;

                    // assume unscissored frustum
                    raw[0] = this._pNear / this._xMax;
                    raw[5] = this._pNear / this._yMax;
                    raw[10] = this._pFar / (this._pFar - this._pNear);
                    raw[11] = 1;
                    raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[12] = raw[13] = raw[15] = 0;
                    raw[14] = -this._pNear * raw[10];
                } else {
                    // assume scissored frustum
                    var xWidth = this._xMax * (this._pViewPort.width / this._pScissorRect.width);
                    var yHgt = this._yMax * (this._pViewPort.height / this._pScissorRect.height);
                    var center = this._xMax * (this._pScissorRect.x * 2 - this._pViewPort.width) / this._pScissorRect.width + this._xMax;
                    var middle = -this._yMax * (this._pScissorRect.y * 2 - this._pViewPort.height) / this._pScissorRect.height - this._yMax;

                    left = center - xWidth;
                    right = center + xWidth;
                    top = middle - yHgt;
                    bottom = middle + yHgt;

                    raw[0] = 2 * this._pNear / (right - left);
                    raw[5] = 2 * this._pNear / (bottom - top);
                    raw[8] = (right + left) / (right - left);
                    raw[9] = (bottom + top) / (bottom - top);
                    raw[10] = (this._pFar + this._pNear) / (this._pFar - this._pNear);
                    raw[11] = 1;
                    raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[12] = raw[13] = raw[15] = 0;
                    raw[14] = -2 * this._pFar * this._pNear / (this._pFar - this._pNear);
                }

                this._pMatrix.copyRawDataFrom(raw);

                var yMaxFar = this._pFar * this._focalLengthInv;
                var xMaxFar = yMaxFar * this._pAspectRatio;

                this._pFrustumCorners[0] = this._pFrustumCorners[9] = left;
                this._pFrustumCorners[3] = this._pFrustumCorners[6] = right;
                this._pFrustumCorners[1] = this._pFrustumCorners[4] = top;
                this._pFrustumCorners[7] = this._pFrustumCorners[10] = bottom;

                this._pFrustumCorners[12] = this._pFrustumCorners[21] = -xMaxFar;
                this._pFrustumCorners[15] = this._pFrustumCorners[18] = xMaxFar;
                this._pFrustumCorners[13] = this._pFrustumCorners[16] = -yMaxFar;
                this._pFrustumCorners[19] = this._pFrustumCorners[22] = yMaxFar;

                this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
                this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;

                this._pMatrixInvalid = false;
            };
            return PerspectiveLens;
        })(away.cameras.LensBase);
        cameras.PerspectiveLens = PerspectiveLens;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts"/>
    (function (cameras) {
        var FreeMatrixLens = (function (_super) {
            __extends(FreeMatrixLens, _super);
            function FreeMatrixLens() {
                _super.call(this);
                this._pMatrix.copyFrom(new away.cameras.PerspectiveLens().matrix);
            }
            Object.defineProperty(FreeMatrixLens.prototype, "near", {
                set: //@override
                function (value) {
                    this._pNear = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FreeMatrixLens.prototype, "far", {
                set: //@override
                function (value) {
                    this._pFar = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FreeMatrixLens.prototype, "iAspectRatio", {
                set: //@override
                function (value) {
                    this._pAspectRatio = value;
                },
                enumerable: true,
                configurable: true
            });

            //@override
            FreeMatrixLens.prototype.clone = function () {
                var clone = new away.cameras.FreeMatrixLens();
                clone._pMatrix.copyFrom(this._pMatrix);
                clone._pNear = this._pNear;
                clone._pFar = this._pFar;
                clone._pAspectRatio = this._pAspectRatio;
                clone.pInvalidateMatrix();
                return clone;
            };

            //@override
            FreeMatrixLens.prototype.pUpdateMatrix = function () {
                this._pMatrixInvalid = false;
            };
            return FreeMatrixLens;
        })(away.cameras.LensBase);
        cameras.FreeMatrixLens = FreeMatrixLens;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts" />
    (function (cameras) {
        var OrthographicLens = (function (_super) {
            __extends(OrthographicLens, _super);
            function OrthographicLens(projectionHeight) {
                if (typeof projectionHeight === "undefined") { projectionHeight = 500; }
                _super.call(this);
                this._projectionHeight = projectionHeight;
            }
            Object.defineProperty(OrthographicLens.prototype, "projectionHeight", {
                get: function () {
                    return this._projectionHeight;
                },
                set: function (value) {
                    if (value == this._projectionHeight) {
                        return;
                    }
                    this._projectionHeight = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            //@override
            OrthographicLens.prototype.unproject = function (nX, nY, sZ) {
                var v = new away.geom.Vector3D(nX + this.matrix.rawData[12], -nY + this.matrix.rawData[13], sZ, 1.0);
                v = this.unprojectionMatrix.transformVector(v);

                //z is unaffected by transform
                v.z = sZ;

                return v;
            };

            //@override
            OrthographicLens.prototype.clone = function () {
                var clone = new away.cameras.OrthographicLens();
                clone._pNear = this._pNear;
                clone._pFar = this._pFar;
                clone._pAspectRatio = this._pAspectRatio;
                clone.projectionHeight = this._projectionHeight;
                return clone;
            };

            //@override
            OrthographicLens.prototype.pUpdateMatrix = function () {
                var raw = [];
                this._yMax = this._projectionHeight * .5;
                this._xMax = this._yMax * this._pAspectRatio;

                var left;
                var right;
                var top;
                var bottom;

                if (this._pScissorRect.x == 0 && this._pScissorRect.y == 0 && this._pScissorRect.width == this._pViewPort.width && this._pScissorRect.height == this._pViewPort.height) {
                    // assume symmetric frustum
                    left = -this._xMax;
                    right = this._xMax;
                    top = -this._yMax;
                    bottom = this._yMax;

                    raw[0] = 2 / (this._projectionHeight * this._pAspectRatio);
                    raw[5] = 2 / this._projectionHeight;
                    raw[10] = 1 / (this._pFar - this._pNear);
                    raw[14] = this._pNear / (this._pNear - this._pFar);
                    raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = raw[12] = raw[13] = 0;
                    raw[15] = 1;
                } else {
                    var xWidth = this._xMax * (this._pViewPort.width / this._pScissorRect.width);
                    var yHgt = this._yMax * (this._pViewPort.height / this._pScissorRect.height);
                    var center = this._xMax * (this._pScissorRect.x * 2 - this._pViewPort.width) / this._pScissorRect.width + this._xMax;
                    var middle = -this._yMax * (this._pScissorRect.y * 2 - this._pViewPort.height) / this._pScissorRect.height - this._yMax;

                    left = center - xWidth;
                    right = center + xWidth;
                    top = middle - yHgt;
                    bottom = middle + yHgt;

                    raw[0] = 2 * 1 / (right - left);
                    raw[5] = -2 * 1 / (top - bottom);
                    raw[10] = 1 / (this._pFar - this._pNear);

                    raw[12] = (right + left) / (right - left);
                    raw[13] = (bottom + top) / (bottom - top);
                    raw[14] = this._pNear / (this.near - this.far);

                    raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
                    raw[15] = 1;
                }

                this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pFrustumCorners[12] = this._pFrustumCorners[21] = left;
                this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pFrustumCorners[15] = this._pFrustumCorners[18] = right;
                this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pFrustumCorners[13] = this._pFrustumCorners[16] = top;
                this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pFrustumCorners[19] = this._pFrustumCorners[22] = bottom;
                this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
                this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;

                this._pMatrix.copyRawDataFrom(raw);

                this._pMatrixInvalid = false;
            };
            return OrthographicLens;
        })(away.cameras.LensBase);
        cameras.OrthographicLens = OrthographicLens;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts" />
    (function (cameras) {
        var OrthographicOffCenterLens = (function (_super) {
            __extends(OrthographicOffCenterLens, _super);
            function OrthographicOffCenterLens(minX, maxX, minY, maxY) {
                _super.call(this);
                this._minX = minX;
                this._maxX = maxX;
                this._minY = minY;
                this._maxY = maxY;
            }
            Object.defineProperty(OrthographicOffCenterLens.prototype, "minX", {
                get: function () {
                    return this._minX;
                },
                set: function (value) {
                    this._minX = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OrthographicOffCenterLens.prototype, "maxX", {
                get: function () {
                    return this._maxX;
                },
                set: function (value) {
                    this._maxX = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OrthographicOffCenterLens.prototype, "minY", {
                get: function () {
                    return this._minY;
                },
                set: function (value) {
                    this._minY = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OrthographicOffCenterLens.prototype, "maxY", {
                get: function () {
                    return this._maxY;
                },
                set: function (value) {
                    this._maxY = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            //@override
            OrthographicOffCenterLens.prototype.unproject = function (nX, nY, sZ) {
                var v = new away.geom.Vector3D(nX, -nY, sZ, 1.0);
                v = this.unprojectionMatrix.transformVector(v);

                //z is unaffected by transform
                v.z = sZ;

                return v;
            };

            //@override
            OrthographicOffCenterLens.prototype.clone = function () {
                var clone = new away.cameras.OrthographicOffCenterLens(this._minX, this._maxX, this._minY, this._maxY);
                clone._pNear = this._pNear;
                clone._pFar = this._pFar;
                clone._pAspectRatio = this._pAspectRatio;
                return clone;
            };

            //@override
            OrthographicOffCenterLens.prototype.pUpdateMatrix = function () {
                var raw = [];
                var w = 1 / (this._maxX - this._minX);
                var h = 1 / (this._maxY - this._minY);
                var d = 1 / (this._pFar - this._pNear);

                raw[0] = 2 * w;
                raw[5] = 2 * h;
                raw[10] = d;
                raw[12] = -(this._maxX + this._minX) * w;
                raw[13] = -(this._maxY + this._minY) * h;
                raw[14] = -this._pNear * d;
                raw[15] = 1;
                raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
                this._pMatrix.copyRawDataFrom(raw);

                this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pFrustumCorners[12] = this._pFrustumCorners[21] = this._minX;
                this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pFrustumCorners[15] = this._pFrustumCorners[18] = this._maxX;
                this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pFrustumCorners[13] = this._pFrustumCorners[16] = this._minY;
                this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pFrustumCorners[19] = this._pFrustumCorners[22] = this._maxY;
                this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
                this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;

                this._pMatrixInvalid = false;
            };
            return OrthographicOffCenterLens;
        })(away.cameras.LensBase);
        cameras.OrthographicOffCenterLens = OrthographicOffCenterLens;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts" />
    (function (cameras) {
        var PerspectiveOffCenterLens = (function (_super) {
            __extends(PerspectiveOffCenterLens, _super);
            function PerspectiveOffCenterLens(minAngleX, maxAngleX, minAngleY, maxAngleY) {
                if (typeof minAngleX === "undefined") { minAngleX = -40; }
                if (typeof maxAngleX === "undefined") { maxAngleX = 40; }
                if (typeof minAngleY === "undefined") { minAngleY = -40; }
                if (typeof maxAngleY === "undefined") { maxAngleY = 40; }
                _super.call(this);

                this.minAngleX = minAngleX;
                this.maxAngleX = maxAngleX;
                this.minAngleY = minAngleY;
                this.maxAngleY = maxAngleY;
            }
            Object.defineProperty(PerspectiveOffCenterLens.prototype, "minAngleX", {
                get: function () {
                    return this._minAngleX;
                },
                set: function (value) {
                    this._minAngleX = value;
                    this._tanMinX = Math.tan(this._minAngleX * Math.PI / 180);
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PerspectiveOffCenterLens.prototype, "maxAngleX", {
                get: function () {
                    return this._maxAngleX;
                },
                set: function (value) {
                    this._maxAngleX = value;
                    this._tanMaxX = Math.tan(this._maxAngleX * Math.PI / 180);
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PerspectiveOffCenterLens.prototype, "minAngleY", {
                get: function () {
                    return this._minAngleY;
                },
                set: function (value) {
                    this._minAngleY = value;
                    this._tanMinY = Math.tan(this._minAngleY * Math.PI / 180);
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PerspectiveOffCenterLens.prototype, "maxAngleY", {
                get: function () {
                    return this._maxAngleY;
                },
                set: function (value) {
                    this._maxAngleY = value;
                    this._tanMaxY = Math.tan(this._maxAngleY * Math.PI / 180);
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            //@override
            PerspectiveOffCenterLens.prototype.unproject = function (nX, nY, sZ) {
                var v = new away.geom.Vector3D(nX, -nY, sZ, 1.0);

                v.x *= sZ;
                v.y *= sZ;
                v = this.unprojectionMatrix.transformVector(v);

                //z is unaffected by transform
                v.z = sZ;

                return v;
            };

            //@override
            PerspectiveOffCenterLens.prototype.clone = function () {
                var clone = new away.cameras.PerspectiveOffCenterLens(this._minAngleX, this._maxAngleX, this._minAngleY, this._maxAngleY);
                clone._pNear = this._pNear;
                clone._pFar = this._pFar;
                clone._pAspectRatio = this._pAspectRatio;
                return clone;
            };

            //@override
            PerspectiveOffCenterLens.prototype.pUpdateMatrix = function () {
                var raw = [];

                this._minLengthX = this._pNear * this._tanMinX;
                this._maxLengthX = this._pNear * this._tanMaxX;
                this._minLengthY = this._pNear * this._tanMinY;
                this._maxLengthY = this._pNear * this._tanMaxY;

                var minLengthFracX = -this._minLengthX / (this._maxLengthX - this._minLengthX);
                var minLengthFracY = -this._minLengthY / (this._maxLengthY - this._minLengthY);

                var left;
                var right;
                var top;
                var bottom;

                // assume scissored frustum
                var center = -this._minLengthX * (this._pScissorRect.x + this._pScissorRect.width * minLengthFracX) / (this._pScissorRect.width * minLengthFracX);
                var middle = this._minLengthY * (this._pScissorRect.y + this._pScissorRect.height * minLengthFracY) / (this._pScissorRect.height * minLengthFracY);

                left = center - (this._maxLengthX - this._minLengthX) * (this._pViewPort.width / this._pScissorRect.width);
                right = center;
                top = middle;
                bottom = middle + (this._maxLengthY - this._minLengthY) * (this._pViewPort.height / this._pScissorRect.height);

                raw[0] = 2 * this._pNear / (right - left);
                raw[5] = 2 * this._pNear / (bottom - top);
                raw[8] = (right + left) / (right - left);
                raw[9] = (bottom + top) / (bottom - top);
                raw[10] = (this._pFar + this._pNear) / (this._pFar - this._pNear);
                raw[11] = 1;
                raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[12] = raw[13] = raw[15] = 0;
                raw[14] = -2 * this._pFar * this._pNear / (this._pFar - this._pNear);

                this._pMatrix.copyRawDataFrom(raw);

                this._minLengthX = this._pFar * this._tanMinX;
                this._maxLengthX = this._pFar * this._tanMaxX;
                this._minLengthY = this._pFar * this._tanMinY;
                this._maxLengthY = this._pFar * this._tanMaxY;

                this._pFrustumCorners[0] = this._pFrustumCorners[9] = left;
                this._pFrustumCorners[3] = this._pFrustumCorners[6] = right;
                this._pFrustumCorners[1] = this._pFrustumCorners[4] = top;
                this._pFrustumCorners[7] = this._pFrustumCorners[10] = bottom;

                this._pFrustumCorners[12] = this._pFrustumCorners[21] = this._minLengthX;
                this._pFrustumCorners[15] = this._pFrustumCorners[18] = this._maxLengthX;
                this._pFrustumCorners[13] = this._pFrustumCorners[16] = this._minLengthY;
                this._pFrustumCorners[19] = this._pFrustumCorners[22] = this._maxLengthY;

                this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
                this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;

                this._pMatrixInvalid = false;
            };
            return PerspectiveOffCenterLens;
        })(away.cameras.LensBase);
        cameras.PerspectiveOffCenterLens = PerspectiveOffCenterLens;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../../_definitions.ts" />
    (function (cameras) {
        var ObliqueNearPlaneLens = (function (_super) {
            __extends(ObliqueNearPlaneLens, _super);
            function ObliqueNearPlaneLens(baseLens, plane) {
                _super.call(this);
                this.baseLens = baseLens;
                this.plane = plane;
            }
            Object.defineProperty(ObliqueNearPlaneLens.prototype, "frustumCorners", {
                get: //@override
                function () {
                    return this._baseLens.frustumCorners;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObliqueNearPlaneLens.prototype, "near", {
                get: //@override
                function () {
                    return this._baseLens.near;
                },
                set: //@override
                function (value) {
                    this._baseLens.near = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObliqueNearPlaneLens.prototype, "far", {
                get: //@override
                function () {
                    return this._baseLens.far;
                },
                set: //@override
                function (value) {
                    this._baseLens.far = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObliqueNearPlaneLens.prototype, "iAspectRatio", {
                get: //@override
                function () {
                    return this._baseLens.iAspectRatio;
                },
                set: //@override
                function (value) {
                    this._baseLens.iAspectRatio = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObliqueNearPlaneLens.prototype, "plane", {
                get: function () {
                    return this._plane;
                },
                set: function (value) {
                    this._plane = value;
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObliqueNearPlaneLens.prototype, "baseLens", {
                set: function (value) {
                    if (this._baseLens) {
                        this._baseLens.removeEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);
                    }
                    this._baseLens = value;

                    if (this._baseLens) {
                        this._baseLens.addEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);
                    }
                    this.pInvalidateMatrix();
                },
                enumerable: true,
                configurable: true
            });

            ObliqueNearPlaneLens.prototype.onLensMatrixChanged = function (event) {
                this.pInvalidateMatrix();
            };

            //@override
            ObliqueNearPlaneLens.prototype.pUpdateMatrix = function () {
                this._pMatrix.copyFrom(this._baseLens.matrix);

                var cx = this._plane.a;
                var cy = this._plane.b;
                var cz = this._plane.c;
                var cw = -this._plane.d + .05;
                var signX = cx >= 0 ? 1 : -1;
                var signY = cy >= 0 ? 1 : -1;
                var p = new away.geom.Vector3D(signX, signY, 1, 1);
                var inverse = this._pMatrix.clone();
                inverse.invert();
                var q = inverse.transformVector(p);
                this._pMatrix.copyRowTo(3, p);
                var a = (q.x * p.x + q.y * p.y + q.z * p.z + q.w * p.w) / (cx * q.x + cy * q.y + cz * q.z + cw * q.w);
                this._pMatrix.copyRowFrom(2, new away.geom.Vector3D(cx * a, cy * a, cz * a, cw * a));
            };
            return ObliqueNearPlaneLens;
        })(away.cameras.LensBase);
        cameras.ObliqueNearPlaneLens = ObliqueNearPlaneLens;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (events) {
        var CameraEvent = (function (_super) {
            __extends(CameraEvent, _super);
            function CameraEvent(type, camera) {
                _super.call(this, type);
                this._camera = camera;
            }
            Object.defineProperty(CameraEvent.prototype, "camera", {
                get: function () {
                    return this._camera;
                },
                enumerable: true,
                configurable: true
            });
            CameraEvent.LENS_CHANGED = "lensChanged";
            return CameraEvent;
        })(away.events.Event);
        events.CameraEvent = CameraEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (bounds) {
        var NullBounds = (function (_super) {
            __extends(NullBounds, _super);
            function NullBounds(alwaysIn, renderable) {
                if (typeof alwaysIn === "undefined") { alwaysIn = true; }
                if (typeof renderable === "undefined") { renderable = null; }
                _super.call(this);
                this._alwaysIn = alwaysIn;
                this._renderable = renderable;
                this._pMax.x = this._pMax.y = this._pMax.z = Number.POSITIVE_INFINITY;
                this._pMin.x = this._pMin.y = this._pMin.z = this._alwaysIn ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            //@override
            NullBounds.prototype.clone = function () {
                return new away.bounds.NullBounds(this._alwaysIn);
            };

            //@override
            NullBounds.prototype.pCreateBoundingRenderable = function () {
                //return this._renderable || new away.primitives.WireframeSphere( 100, 16, 12, 0xffffff, 0.5 );
                return null;
            };

            //@override
            NullBounds.prototype.isInFrustum = function (planes, numPlanes) {
                planes = planes;
                numPlanes = numPlanes;
                return this._alwaysIn;
            };

            //@override
            /*
            public fromGeometry( geometry:away.base.Geometry )
            {
            }
            */
            //@override
            NullBounds.prototype.fromSphere = function (center, radius) {
            };

            //@override
            NullBounds.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
            };

            NullBounds.prototype.classifyToPlane = function (plane) {
                plane = plane;
                return away.math.PlaneClassification.INTERSECT;
            };

            //@override
            NullBounds.prototype.transformFrom = function (bounds, matrix) {
                matrix = matrix;
                var nullBounds = bounds;
                this._alwaysIn = nullBounds._alwaysIn;
            };
            return NullBounds;
        })(away.bounds.BoundingVolumeBase);
        bounds.NullBounds = NullBounds;
    })(away.bounds || (away.bounds = {}));
    var bounds = away.bounds;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (containers) {
        var ObjectContainer3D = (function (_super) {
            __extends(ObjectContainer3D, _super);
            function ObjectContainer3D() {
                _super.call(this);
                this._pSceneTransform = new away.geom.Matrix3D();
                this._pSceneTransformDirty = true;
                this._children = [];
                this._mouseChildren = true;
                this._inverseSceneTransform = new away.geom.Matrix3D();
                this._inverseSceneTransformDirty = true;
                this._scenePosition = new away.geom.Vector3D();
                this._scenePositionDirty = true;
                this._explicitVisibility = true;
                this._implicitVisibility = true;
                this._pIgnoreTransform = false;
            }
            ObjectContainer3D.prototype.getIgnoreTransform = function () {
                return this._pIgnoreTransform;
            };

            ObjectContainer3D.prototype.setIgnoreTransform = function (value) {
                this._pIgnoreTransform = value;
                this._pSceneTransformDirty = !value;
                this._inverseSceneTransformDirty = !value;
                this._scenePositionDirty = !value;

                if (value) {
                    this._pSceneTransform.identity();
                    this._scenePosition.setTo(0, 0, 0);
                }
            };

            Object.defineProperty(ObjectContainer3D.prototype, "iImplicitPartition", {
                get: function () {
                    return this._pImplicitPartition;
                },
                set: function (value) {
                    if (value == this._pImplicitPartition) {
                        return;
                    }

                    this.i;;
                    this.len = this._children.length;;
                    this.child;;

                    this._pImplicitPartition = value;

                    while (i < len) {
                        child = this._children[i++];
                        if (!child._pExplicitPartition) {
                            child._pImplicitPartition = value;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObjectContainer3D.prototype, "_iIsVisible", {
                get: function () {
                    return this._implicitVisibility && this._explicitVisibility;
                },
                enumerable: true,
                configurable: true
            });

            ObjectContainer3D.prototype.iSetParent = function (value) {
                this._pParent = value;

                throw new away.errors.PartialImplementationError();
                this.pUpdateMouseChildren();

                if (value == null) {
                    this.scene = null;
                    return;
                }

                this.notifySceneTransformChange();
                this.notifySceneChange();
            };

            ObjectContainer3D.prototype.notifySceneTransformChange = function () {
                if (this._pSceneTransformDirty || this._pIgnoreTransform) {
                    return;
                }

                this.pInvalidateSceneTransform();

                var i;
                var len = this._children.length;

                while (i < len) {
                    this._children[i++].notifySceneTransformChange();
                }

                if (this._listenToSceneTransformChanged) {
                    if (!this._sceneTransformChanged) {
                        this._sceneTransformChanged = new away.events.Object3DEvent(away.events.Object3DEvent.SCENETRANSFORM_CHANGED, this);
                    }
                    this.dispatchEvent(this._sceneTransformChanged);
                }
            };

            ObjectContainer3D.prototype.notifySceneChange = function () {
                this.notifySceneTransformChange();

                var i;
                var len = this._children.length;

                while (i < len) {
                    this._children[i++].notifySceneChange();
                }

                if (this._listenToSceneChanged) {
                    if (!this._scenechanged) {
                        this._scenechanged = new away.events.Object3DEvent(away.events.Object3DEvent.SCENE_CHANGED, this);
                    }
                    this.dispatchEvent(this._scenechanged);
                }
            };

            ObjectContainer3D.prototype.pUpdateMouseChildren = function () {
                throw new away.errors.PartialImplementationError();

                if (this._pParent && !this._pParent._iIsRoot) {
                    this._iAncestorsAllowMouseEnabled = this._pParent._iAncestorsAllowMouseEnabled && this._pParent.mouseChildren;
                } else {
                    this._iAncestorsAllowMouseEnabled = this.mouseChildren;
                }

                var len = this._children.length;
                for (var i = 0; i < len; ++i) {
                    this._children[i].pUpdateMouseChildren();
                }
            };

            Object.defineProperty(ObjectContainer3D.prototype, "mouseEnabled", {
                get: function () {
                    return this._pMouseEnabled;
                },
                set: function (value) {
                    this._pMouseEnabled = value;
                    this.pUpdateMouseChildren();
                },
                enumerable: true,
                configurable: true
            });


            // TODO override arcane function invalidateTransform():void
            ObjectContainer3D.prototype.pInvalidateSceneTransform = function () {
                this._pSceneTransformDirty = !this._pIgnoreTransform;
                this._inverseSceneTransformDirty = !this._pIgnoreTransform;
                this._scenePositionDirty = !this._pIgnoreTransform;
            };

            ObjectContainer3D.prototype.pUpdateSceneTransform = function () {
                if (this._pParent && !this._pParent._iIsRoot) {
                    this._pSceneTransform.copyFrom(this._pParent.sceneTransform);
                    this._pSceneTransform.prepend(this.transform);
                } else {
                    this._pSceneTransform.copyFrom(this.transform);
                }
                this._pSceneTransformDirty = false;
            };

            Object.defineProperty(ObjectContainer3D.prototype, "mouseChildren", {
                get: function () {
                    return this._mouseChildren;
                },
                set: function (value) {
                    this._mouseChildren = value;
                    this.pUpdateMouseChildren();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObjectContainer3D.prototype, "visible", {
                get: function () {
                    return this._explicitVisibility;
                },
                set: function (value) {
                    var len = this._children.length;

                    this._explicitVisibility = value;

                    for (var i = 0; i < len; ++i) {
                        this._children[i].updateImplicitVisibility();
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObjectContainer3D.prototype, "assetType", {
                get: function () {
                    return away.library.AssetType.CONTAINER;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "scenePosition", {
                get: function () {
                    if (this._scenePositionDirty) {
                        this.sceneTransform.copyColumnTo(3, this._scenePosition);
                        this._scenePositionDirty = false;
                    }
                    return this._scenePosition;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "minX", {
                get: function () {
                    var i;
                    var len = this._children.length;
                    var min = Number.POSITIVE_INFINITY;
                    var m;

                    while (i < len) {
                        var child = this._children[i++];
                        m = child.minX + child.x;
                        if (m < min) {
                            min = m;
                        }
                    }
                    return min;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "minY", {
                get: function () {
                    var i;
                    var len = this._children.length;
                    var min = Number.POSITIVE_INFINITY;
                    var m;

                    while (i < len) {
                        var child = this._children[i++];
                        m = child.minY + child.y;
                        if (m < min) {
                            min = m;
                        }
                    }
                    return min;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "minZ", {
                get: function () {
                    var i;
                    var len = this._children.length;
                    var min = Number.POSITIVE_INFINITY;
                    var m;

                    while (i < len) {
                        var child = this._children[i++];
                        m = child.minZ + child.z;
                        if (m < min) {
                            min = m;
                        }
                    }
                    return min;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "maxX", {
                get: function () {
                    var i;
                    var len = this._children.length;
                    var max = Number.NEGATIVE_INFINITY;
                    var m;

                    while (i < len) {
                        var child = this._children[i++];
                        m = child.maxX + child.x;
                        if (m > max) {
                            max = m;
                        }
                    }
                    return max;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "maxY", {
                get: function () {
                    var i;
                    var len = this._children.length;
                    var max = Number.NEGATIVE_INFINITY;
                    var m;

                    while (i < len) {
                        var child = this._children[i++];
                        m = child.maxY + child.y;
                        if (m > max) {
                            max = m;
                        }
                    }
                    return max;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "maxZ", {
                get: function () {
                    var i;
                    var len = this._children.length;
                    var max = Number.NEGATIVE_INFINITY;
                    var m;

                    while (i < len) {
                        var child = this._children[i++];
                        m = child.maxZ + child.z;
                        if (m > max) {
                            max = m;
                        }
                    }
                    return max;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "partition", {
                get: function () {
                    return this._pExplicitPartition;
                },
                set: function (value) {
                    this._pExplicitPartition = value;
                    this.iImplicitPartition = value ? value : (this._pParent ? this._pParent.iImplicitPartition : null);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ObjectContainer3D.prototype, "sceneTransform", {
                get: function () {
                    if (this._pSceneTransformDirty) {
                        this.pUpdateSceneTransform();
                    }
                    return this._pSceneTransform;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "scene", {
                get: function () {
                    return this._pScene;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "inverseSceneTransform", {
                get: //TODO public function set scene(value:Scene3D):void
                function () {
                    if (this._inverseSceneTransformDirty) {
                        this._inverseSceneTransform.copyFrom(this.sceneTransform);
                        this._inverseSceneTransform.invert();
                        this._inverseSceneTransformDirty = false;
                    }
                    return this._inverseSceneTransform;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ObjectContainer3D.prototype, "parent", {
                get: function () {
                    return this._pParent;
                },
                enumerable: true,
                configurable: true
            });

            ObjectContainer3D.prototype.contains = function (child) {
                return this._children.indexOf(child) >= 0;
            };

            ObjectContainer3D.prototype.addChild = function (child) {
                if (child == null) {
                    throw new away.errors.Error("Parameter child cannot be null.");
                }

                if (child._pParent) {
                    child._pParent.removeChild(child);
                }

                if (!child._pExplicitPartition) {
                    child.iImplicitPartition = this._pImplicitPartition;
                }

                child.iSetParent(this);
                child.scene = this._pScene;
                child.notifySceneTransformChange();
                child.pUpdateMouseChildren();
                child.updateImplicitVisibility();

                this._children.push(child);

                return child;
            };

            ObjectContainer3D.prototype.addChildren = function (childarray) {
                for (var child in childarray) {
                    this.addChild(child);
                }
            };

            ObjectContainer3D.prototype.removeChild = function (child) {
                if (child == null) {
                    throw new away.errors.Error("Parameter child cannot be null");
                }

                var childIndex = this._children.indexOf(child);

                if (childIndex == -1) {
                    throw new away.errors.Error("Parameter is not a child of the caller");
                }

                this.removeChildInternal(childIndex, child);
            };

            ObjectContainer3D.prototype.removeChildAt = function (index) {
                var child = this._children[index];
                this.removeChildInternal(index, child);
            };

            ObjectContainer3D.prototype.removeChildInternal = function (childIndex, child) {
                this._children.splice(childIndex, 1);
                child.iSetParent(null);

                if (!child._pExplicitPartition) {
                    child.iImplicitPartition = null;
                }
            };

            ObjectContainer3D.prototype.getChildAt = function (index) {
                return this._children[index];
            };

            Object.defineProperty(ObjectContainer3D.prototype, "numChildren", {
                get: function () {
                    return this._children.length;
                },
                enumerable: true,
                configurable: true
            });

            //@override
            ObjectContainer3D.prototype.lookAt = function (target, upAxis) {
                if (typeof upAxis === "undefined") { upAxis = null; }
                throw new away.errors.PartialImplementationError();

                //TODO super.lookAt( target, upAxis );
                this.notifySceneTransformChange();
            };

            //@override
            ObjectContainer3D.prototype.translateLocal = function (axis, distance) {
                throw new away.errors.PartialImplementationError();

                //TODO super.translateLocal( axis, distance );
                this.notifySceneTransformChange();
            };

            //@override
            ObjectContainer3D.prototype.dispose = function () {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            };

            ObjectContainer3D.prototype.disposeWithChildren = function () {
                this.dispose();
                while (this.numChildren > 0) {
                    this.getChildAt(0).dispose();
                }
            };

            //override
            /*
            public clone():away.base.Object3D
            {
            var clone:away.containers.ObjectContainer3D = new away.containers.ObjectContainer3D();
            clone.pivotPoint = pivotPoint;
            clone.transform = transform;
            clone.partition = partition;
            clone.name = name;
            
            var len:number = this._children.length;
            
            for(var i:number = 0; i < len; ++i)
            {
            clone.addChild(ObjectContainer3D(_children[i].clone()));
            }
            // todo: implement for all subtypes
            return clone;
            }
            */
            //@override
            ObjectContainer3D.prototype.rotate = function (axis, angle) {
                throw new away.errors.PartialImplementationError();

                //TODO super.rotate(axis, angle);
                this.notifySceneTransformChange();
            };

            //TODO override public function dispatchEvent(event:Event):Boolean
            ObjectContainer3D.prototype.updateImplicitVisibility = function () {
                var len = this._children.length;

                this._implicitVisibility = this._pParent._explicitVisibility && this._pParent._implicitVisibility;

                for (var i = 0; i < len; ++i) {
                    this._children[i].updateImplicitVisibility();
                }
            };
            return ObjectContainer3D;
        })(away.base.Object3D);
        containers.ObjectContainer3D = ObjectContainer3D;
    })(away.containers || (away.containers = {}));
    var containers = away.containers;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (entities) {
        var Entity = (function (_super) {
            __extends(Entity, _super);
            function Entity() {
                _super.call(this);
                this._pBoundsInvalid = true;
                this._worldBoundsInvalid = true;
                this._pBounds = this.pGetDefaultBoundingVolume();
                this._worldBounds = this.pGetDefaultBoundingVolume();
            }
            //@override
            Entity.prototype.setIgnoreTransform = function (value) {
                if (this._pScene) {
                }
                _super.prototype.setIgnoreTransform.call(this, value);
            };

            Object.defineProperty(Entity.prototype, "shaderPickingDetails", {
                get: function () {
                    return this._shaderPickingDetails;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "staticNode", {
                get: function () {
                    return this._iStaticNode;
                },
                set: function (value) {
                    this._iStaticNode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Entity.prototype, "pickingCollisionVO", {
                get: function () {
                    if (!this._iPickingCollisionVO) {
                        this._iPickingCollisionVO = new away.pick.PickingCollisionVO(this);
                    }
                    return this._iPickingCollisionVO;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.iCollidesBefore = function (shortestCollisionDistance, findClosest) {
                shortestCollisionDistance = shortestCollisionDistance;
                findClosest = findClosest;
                return true;
            };

            Object.defineProperty(Entity.prototype, "showBounds", {
                get: function () {
                    return this._showBounds;
                },
                set: function (value) {
                    if (value == this._showBounds) {
                        return;
                    }
                    this._showBounds = value;

                    if (this._showBounds) {
                        this.addBounds();
                    } else {
                        this.removeBounds();
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Entity.prototype, "minX", {
                get: //@override
                function () {
                    if (this._pBoundsInvalid) {
                        this.pUpdateBounds();
                    }
                    return this._pBounds.min.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "minY", {
                get: //@override
                function () {
                    if (this._pBoundsInvalid) {
                        this.pUpdateBounds();
                    }
                    return this._pBounds.min.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "minZ", {
                get: //@override
                function () {
                    if (this._pBoundsInvalid) {
                        this.pUpdateBounds();
                    }
                    return this._pBounds.min.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "maxX", {
                get: //@override
                function () {
                    if (this._pBoundsInvalid) {
                        this.pUpdateBounds();
                    }
                    return this._pBounds.max.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "maxY", {
                get: //@override
                function () {
                    if (this._pBoundsInvalid) {
                        this.pUpdateBounds();
                    }
                    return this._pBounds.max.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "maxZ", {
                get: //@override
                function () {
                    if (this._pBoundsInvalid) {
                        this.pUpdateBounds();
                    }
                    return this._pBounds.max.z;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.getBounds = function () {
                if (this._pBoundsInvalid) {
                    this.pUpdateBounds();
                }
                return this._pBounds;
            };

            Object.defineProperty(Entity.prototype, "bounds", {
                set: function (value) {
                    this.removeBounds();
                    this._pBounds = value;
                    this._worldBounds = value.clone();
                    this.pInvalidateBounds();
                    if (this._showBounds) {
                        this.addBounds();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "worldBounds", {
                get: function () {
                    if (this._worldBoundsInvalid) {
                        this.updateWorldBounds();
                    }
                    return this._worldBounds;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.updateWorldBounds = function () {
                this._worldBounds.transformFrom(this.bounds, this.sceneTransform);
                this._worldBoundsInvalid = false;
            };

            Object.defineProperty(Entity.prototype, "iImplicitPartition", {
                set: //@override
                function (value) {
                    if (value == this._pImplicitPartition) {
                        return;
                    }

                    if (this._pImplicitPartition) {
                        this.notifyPartitionUnassigned();
                    }
                    throw new away.errors.PartialImplementationError();

                    //TODO super.implicitPartition = value;
                    this.notifyPartitionAssigned();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "assetType", {
                get: /*
                //@override
                public set scene( value:Scene3D )
                {
                if(value == _scene)
                {
                return;
                }
                if( this._scene)
                {
                _scene.unregisterEntity( this );
                }
                // callback to notify object has been spawned. Casts to please FDT
                if ( value )
                {
                value.registerEntity(this);
                }
                super.scene = value;
                }
                */
                //@override
                function () {
                    return away.library.AssetType.ENTITY;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "pickingCollider", {
                get: function () {
                    return this._iPickingCollider;
                },
                set: function (value) {
                    this._iPickingCollider = value;
                },
                enumerable: true,
                configurable: true
            });


            Entity.prototype.getEntityPartitionNode = function () {
                if (!this._partitionNode) {
                    this._partitionNode = this.pCreateEntityPartitionNode();
                }
                return this._partitionNode;
            };

            /* TODO Implementation dependency : BoundingVolumeBase
            public isIntersectingRay( rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D ):boolean
            {
            var localRayPosition:away.geom.Vector3D = this.inverseSceneTransform.transformVector( rayPosition );
            var localRayDirection:away.geom.Vector3D = this.inverseSceneTransform.deltaTransformVector( rayDirection );
            
            
            if( !this._iPickingCollisionVO.localNormal )
            {
            this._iPickingCollisionVO.localNormal = new away.geom.Vector3D()
            }
            
            
            var rayEntryDistance:number = bounds.rayIntersection(localRayPosition, localRayDirection, this._iPickingCollisionVO.localNormal );
            
            if( rayEntryDistance < 0 )
            {
            return false;
            }
            
            this._iPickingCollisionVO.rayEntryDistance = rayEntryDistance;
            this._iPickingCollisionVO.localRayPosition = localRayPosition;
            this._iPickingCollisionVO.localRayDirection = localRayDirection;
            this._iPickingCollisionVO.rayPosition = rayPosition;
            this._iPickingCollisionVO.rayDirection = rayDirection;
            this._iPickingCollisionVO.rayOriginIsInsideBounds = rayEntryDistance == 0;
            
            return true;
            }
            //*/
            Entity.prototype.pCreateEntityPartitionNode = function () {
                throw new away.errors.AbstractMethodError();
            };

            Entity.prototype.pGetDefaultBoundingVolume = function () {
                // point lights should be using sphere bounds
                // directional lights should be using null bounds
                // TODO return new AxisAlignedBoundingBox();
                return null;
            };

            Entity.prototype.pUpdateBounds = function () {
                throw new away.errors.AbstractMethodError();
            };

            Entity.prototype.pInvalidateSceneTransform = function () {
                if (!this._pIgnoreTransform) {
                    _super.prototype.pInvalidateSceneTransform.call(this);
                    this._worldBoundsInvalid = true;
                    this.notifySceneBoundsInvalid();
                }
            };

            Entity.prototype.pInvalidateBounds = function () {
                this._pBoundsInvalid = true;
                this._worldBoundsInvalid = true;
                this.notifySceneBoundsInvalid();
            };

            /* TODO: implement dependency super.updateMouseChildren();
            public pUpdateMouseChildren():void
            {
            // If there is a parent and this child does not have a triangle collider, use its parent's triangle collider.
            
            if( this._pParent && !this.pickingCollider )
            {
            
            
            if ( this.pParent instanceof away.entities.Entity ) //if( this._pParent is Entity ) { // TODO: Test / validate
            {
            
            var parentEntity : away.entities.Entity =  <away.entities.Entity> this._pParent;
            
            var collider:away.pick.IPickingCollider = parentEntity.pickingCollider;
            if(collider)
            {
            
            this.pickingCollider = collider;
            
            }
            
            }
            }
            
            super.updateMouseChildren();
            }
            //*/
            Entity.prototype.notifySceneBoundsInvalid = function () {
                if (this._pScene) {
                }
            };

            Entity.prototype.notifyPartitionAssigned = function () {
                if (this._pScene) {
                }
            };

            Entity.prototype.notifyPartitionUnassigned = function () {
                if (this._pScene) {
                }
            };

            Entity.prototype.addBounds = function () {
                if (!this._boundsIsShown) {
                    this._boundsIsShown = true;
                }
            };

            Entity.prototype.removeBounds = function () {
                if (!this._boundsIsShown) {
                    this._boundsIsShown = false;
                }
            };

            Entity.prototype.iInternalUpdate = function () {
            };
            return Entity;
        })(away.containers.ObjectContainer3D);
        entities.Entity = Entity;
    })(away.entities || (away.entities = {}));
    var entities = away.entities;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (cameras) {
        var Camera3D = (function (_super) {
            __extends(Camera3D, _super);
            function Camera3D(lens) {
                if (typeof lens === "undefined") { lens = null; }
                _super.call(this);
                this._viewProjection = new away.geom.Matrix3D();
                this._viewProjectionDirty = true;
                this._frustumPlanesDirty = true;

                this._lens = lens || new away.cameras.PerspectiveLens();
                this._lens.addEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);

                this._frustumPlanes = [];

                for (var i = 0; i < 6; ++i) {
                    this._frustumPlanes[i] = new away.math.Plane3D();
                }
            }
            Camera3D.prototype.pGetDefaultBoundingVolume = function () {
                return new away.bounds.NullBounds();
            };

            Object.defineProperty(Camera3D.prototype, "assetType", {
                get: //@override
                function () {
                    return away.library.AssetType.CAMERA;
                },
                enumerable: true,
                configurable: true
            });

            Camera3D.prototype.onLensMatrixChanged = function (event) {
                this._viewProjectionDirty = true;
                this._frustumPlanesDirty = true;
                this.dispatchEvent(event);
            };

            Object.defineProperty(Camera3D.prototype, "frustumPlanes", {
                get: function () {
                    if (this._frustumPlanesDirty) {
                        this.updateFrustum();
                    }
                    return this._frustumPlanes;
                },
                enumerable: true,
                configurable: true
            });

            Camera3D.prototype.updateFrustum = function () {
                var a, b, c;

                //var d : Number;
                var c11, c12, c13, c14;
                var c21, c22, c23, c24;
                var c31, c32, c33, c34;
                var c41, c42, c43, c44;
                var p;
                var raw = [];
                var invLen;
                this.viewProjection.copyRawDataTo(raw);

                c11 = raw[0];
                c12 = raw[4];
                c13 = raw[8];
                c14 = raw[12];
                c21 = raw[1];
                c22 = raw[5];
                c23 = raw[9];
                c24 = raw[13];
                c31 = raw[2];
                c32 = raw[6];
                c33 = raw[10];
                c34 = raw[14];
                c41 = raw[3];
                c42 = raw[7];
                c43 = raw[11];
                c44 = raw[15];

                // left plane
                p = this._frustumPlanes[0];
                a = c41 + c11;
                b = c42 + c12;
                c = c43 + c13;
                invLen = 1 / Math.sqrt(a * a + b * b + c * c);
                p.a = a * invLen;
                p.b = b * invLen;
                p.c = c * invLen;
                p.d = -(c44 + c14) * invLen;

                // right plane
                p = this._frustumPlanes[1];
                a = c41 - c11;
                b = c42 - c12;
                c = c43 - c13;
                invLen = 1 / Math.sqrt(a * a + b * b + c * c);
                p.a = a * invLen;
                p.b = b * invLen;
                p.c = c * invLen;
                p.d = (c14 - c44) * invLen;

                // bottom
                p = this._frustumPlanes[2];
                a = c41 + c21;
                b = c42 + c22;
                c = c43 + c23;
                invLen = 1 / Math.sqrt(a * a + b * b + c * c);
                p.a = a * invLen;
                p.b = b * invLen;
                p.c = c * invLen;
                p.d = -(c44 + c24) * invLen;

                // top
                p = this._frustumPlanes[3];
                a = c41 - c21;
                b = c42 - c22;
                c = c43 - c23;
                invLen = 1 / Math.sqrt(a * a + b * b + c * c);
                p.a = a * invLen;
                p.b = b * invLen;
                p.c = c * invLen;
                p.d = (c24 - c44) * invLen;

                // near
                p = this._frustumPlanes[4];
                a = c31;
                b = c32;
                c = c33;
                invLen = 1 / Math.sqrt(a * a + b * b + c * c);
                p.a = a * invLen;
                p.b = b * invLen;
                p.c = c * invLen;
                p.d = -c34 * invLen;

                // far
                p = this._frustumPlanes[5];
                a = c41 - c31;
                b = c42 - c32;
                c = c43 - c33;
                invLen = 1 / Math.sqrt(a * a + b * b + c * c);
                p.a = a * invLen;
                p.b = b * invLen;
                p.c = c * invLen;
                p.d = (c34 - c44) * invLen;

                this._frustumPlanesDirty = false;
            };

            //@override
            Camera3D.prototype.pInvalidateSceneTransform = function () {
                _super.prototype.pInvalidateSceneTransform.call(this);

                this._viewProjectionDirty = true;
                this._frustumPlanesDirty = true;
            };

            //@override
            Camera3D.prototype.updateBounds = function () {
                this._pBounds.nullify();
                this._pBoundsInvalid = false;
            };

            //@override
            Camera3D.prototype.pCreateEntityPartitionNode = function () {
                return new away.partition.CameraNode(this);
            };

            Object.defineProperty(Camera3D.prototype, "lens", {
                get: function () {
                    return this._lens;
                },
                set: function (value) {
                    if (this._lens == value) {
                        return;
                    }
                    if (!value) {
                        throw new Error("Lens cannot be null!");
                    }
                    this._lens.removeEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);
                    this._lens = value;
                    this._lens.addEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);
                    this.dispatchEvent(new away.events.CameraEvent(away.events.CameraEvent.LENS_CHANGED, this));
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Camera3D.prototype, "viewProjection", {
                get: function () {
                    if (this._viewProjectionDirty) {
                        this._viewProjection.copyFrom(this.inverseSceneTransform);
                        this._viewProjection.append(this._lens.matrix);
                        this._viewProjectionDirty = false;
                    }
                    return this._viewProjection;
                },
                enumerable: true,
                configurable: true
            });
            return Camera3D;
        })(away.entities.Entity);
        cameras.Camera3D = Camera3D;
    })(away.cameras || (away.cameras = {}));
    var cameras = away.cameras;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (entities) {
        var SegmentSet = (function (_super) {
            __extends(SegmentSet, _super);
            function SegmentSet() {
                _super.call(this);
                this.LIMIT = 3 * 0xFFFF;

                this._subSetCount = 0;
                this._subSets = [];
                this.addSubSet();

                this._pSegments = new Object();
            }
            SegmentSet.prototype.addSegment = function (segment) {
                segment.iSegmentsBase = this;

                this._hasData = true;

                var subSetIndex = this._subSets.length - 1;
                var subSet = this._subSets[subSetIndex];

                if (subSet.vertices.length + 44 > this.LIMIT) {
                    subSet = this.addSubSet();
                    subSetIndex++;
                }

                segment.iIndex = subSet.vertices.length;
                segment.iSubSetIndex = subSetIndex;

                this.iUpdateSegment(segment);

                var index = subSet.lineCount << 2;

                subSet.indices.push(index, index + 1, index + 2, index + 3, index + 2, index + 1);
                subSet.numVertices = subSet.vertices.length / 11;
                subSet.numIndices = subSet.indices.length;
                subSet.lineCount++;

                var segRef = new SegRef();
                segRef.index = index;
                segRef.subSetIndex = subSetIndex;
                segRef.segment = segment;

                this._pSegments[this._indexSegments] = segRef;

                this._indexSegments++;
            };

            SegmentSet.prototype.removeSegmentByIndex = function (index, dispose) {
                if (typeof dispose === "undefined") { dispose = false; }
                var segRef;
                if (index >= this._indexSegments) {
                    return;
                }
                if (this._pSegments[index]) {
                    segRef = this._pSegments[index];
                } else {
                    return;
                }

                var subSet;
                if (!this._subSets[segRef.subSetIndex]) {
                    return;
                }

                var subSetIndex = segRef.subSetIndex;
                subSet = this._subSets[segRef.subSetIndex];

                var segment = segRef.segment;
                var indices = subSet.indices;

                var ind = index * 6;
                for (var i = ind; i < indices.length; ++i) {
                    indices[i] -= 4;
                }
                subSet.indices.splice(index * 6, 6);
                subSet.vertices.splice(index * 44, 44);
                subSet.numVertices = subSet.vertices.length / 11;
                subSet.numIndices = indices.length;
                subSet.vertexBufferDirty = true;
                subSet.indexBufferDirty = true;
                subSet.lineCount--;

                if (dispose) {
                    segment.dispose();
                    segment = null;
                } else {
                    segment.iIndex = -1;
                    segment.iSegmentsBase = null;
                }

                if (subSet.lineCount == 0) {
                    if (subSetIndex == 0) {
                        this._hasData = false;
                    } else {
                        subSet.dispose();
                        this._subSets[subSetIndex] = null;
                        this._subSets.splice(subSetIndex, 1);
                    }
                }

                this.reOrderIndices(subSetIndex, index);

                segRef = null;
                this._pSegments[this._indexSegments] = null;
                this._indexSegments--;
            };

            SegmentSet.prototype.removeSegment = function (segment, dispose) {
                if (typeof dispose === "undefined") { dispose = false; }
                if (segment.iIndex == -1) {
                    return;
                }
                this.removeSegmentByIndex(segment.iIndex / 44);
            };

            SegmentSet.prototype.removeAllSegments = function () {
                var subSet;
                for (var i = 0; i < this._subSetCount; ++i) {
                    subSet = this._subSets[i];
                    subSet.vertices = null;
                    subSet.indices = null;
                    if (subSet.vertexBuffer) {
                        subSet.vertexBuffer.dispose();
                    }
                    if (subSet.indexBuffer) {
                        subSet.indexBuffer.dispose();
                    }
                    subSet = null;
                }

                for (var segRef in this._pSegments) {
                    segRef = null;
                }
                this._pSegments = null;
                this._subSetCount = 0;

                //this._activeSubSet = null;
                this._indexSegments = 0;
                this._subSets = [];
                this._pSegments = new Object();

                this.addSubSet();

                this._hasData = false;
            };

            SegmentSet.prototype.getSegment = function (index) {
                if (index > this._indexSegments - 1) {
                    return null;
                }
                return this._pSegments[index].segment;
            };

            Object.defineProperty(SegmentSet.prototype, "segmentCount", {
                get: function () {
                    return this._indexSegments;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "iSubSetCount", {
                get: function () {
                    return this._subSetCount;
                },
                enumerable: true,
                configurable: true
            });

            SegmentSet.prototype.iUpdateSegment = function (segment) {
                var start = segment._pStart;
                var end = segment._pEnd;
                var startX = start.x, startY = start.y, startZ = start.z;
                var endX = end.x, endY = end.y, endZ = end.z;
                var startR = segment._pStartR, startG = segment._pStartG, startB = segment._pStartB;
                var endR = segment._pEndR, endG = segment._pEndG, endB = segment._pEndB;
                var index = segment.iIndex;
                var t = segment.thickness;

                var subSet = this._subSets[segment.iSubSetIndex];
                var vertices = subSet.vertices;

                vertices[index++] = startX;
                vertices[index++] = startY;
                vertices[index++] = startZ;
                vertices[index++] = endX;
                vertices[index++] = endY;
                vertices[index++] = endZ;
                vertices[index++] = t;
                vertices[index++] = startR;
                vertices[index++] = startG;
                vertices[index++] = startB;
                vertices[index++] = 1;

                vertices[index++] = endX;
                vertices[index++] = endY;
                vertices[index++] = endZ;
                vertices[index++] = startX;
                vertices[index++] = startY;
                vertices[index++] = startZ;
                vertices[index++] = -t;
                vertices[index++] = endR;
                vertices[index++] = endG;
                vertices[index++] = endB;
                vertices[index++] = 1;

                vertices[index++] = startX;
                vertices[index++] = startY;
                vertices[index++] = startZ;
                vertices[index++] = endX;
                vertices[index++] = endY;
                vertices[index++] = endZ;
                vertices[index++] = -t;
                vertices[index++] = startR;
                vertices[index++] = startG;
                vertices[index++] = startB;
                vertices[index++] = 1;

                vertices[index++] = endX;
                vertices[index++] = endY;
                vertices[index++] = endZ;
                vertices[index++] = startX;
                vertices[index++] = startY;
                vertices[index++] = startZ;
                vertices[index++] = t;
                vertices[index++] = endR;
                vertices[index++] = endG;
                vertices[index++] = endB;
                vertices[index++] = 1;

                subSet.vertexBufferDirty = true;

                this._pBoundsInvalid = true;
            };

            Object.defineProperty(SegmentSet.prototype, "hasData", {
                get: function () {
                    return this._hasData;
                },
                enumerable: true,
                configurable: true
            });

            /*
            public getIndexBuffer( stage3DProxy:away.managers.Stage3DProxy ):away.display3D.IndexBuffer3D
            {
            if( this._activeSubSet.indexContext3D != stage3DProxy.context3D || this._activeSubSet.indexBufferDirty )
            {
            this._activeSubSet.indexBuffer = stage3DProxy._context3D.createIndexBuffer( this._activeSubSet.numIndices );
            this._activeSubSet.indexBuffer.uploadFromVector( this._activeSubSet.indices, 0, this._activeSubSet.numIndices );
            this._activeSubSet.indexBufferDirty = false;
            this._activeSubSet.indexContext3D = stage3DProxy.context3D;
            }
            
            return this._activeSubSet.indexBuffer;
            }
            */
            /*
            public activateVertexBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy )
            {
            var subSet:SubSet = this._subSets[index];
            
            this._activeSubSet = subSet;
            this._numIndices = subSet.numIndices;
            
            var vertexBuffer:away.display3D.VertexBuffer3D = subSet.vertexBuffer;
            
            if (subSet.vertexContext3D != stage3DProxy.context3D || subSet.vertexBufferDirty) {
            subSet.vertexBuffer = stage3DProxy._context3D.createVertexBuffer(subSet.numVertices, 11);
            subSet.vertexBuffer.uploadFromVector(subSet.vertices, 0, subSet.numVertices);
            subSet.vertexBufferDirty = false;
            subSet.vertexContext3D = stage3DProxy.context3D;
            }
            
            var context3d:Context3D = stage3DProxy._context3D;
            context3d.setVertexBufferAt(0, vertexBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
            context3d.setVertexBufferAt(1, vertexBuffer, 3, Context3DVertexBufferFormat.FLOAT_3);
            context3d.setVertexBufferAt(2, vertexBuffer, 6, Context3DVertexBufferFormat.FLOAT_1);
            context3d.setVertexBufferAt(3, vertexBuffer, 7, Context3DVertexBufferFormat.FLOAT_4);
            }
            
            public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
            {
            }
            
            public activateVertexNormalBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy)
            {
            }
            
            public activateVertexTangentBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy )
            {
            }
            
            public activateSecondaryUVBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy)
            {
            }
            */
            SegmentSet.prototype.reOrderIndices = function (subSetIndex, index) {
                var segRef;

                for (var i = index; i < this._indexSegments - 1; ++i) {
                    segRef = this._pSegments[i + 1];
                    segRef.index = i;
                    if (segRef.subSetIndex == subSetIndex) {
                        segRef.segment.iIndex -= 44;
                    }
                    this._pSegments[i] = segRef;
                }
            };

            SegmentSet.prototype.addSubSet = function () {
                var subSet = new SubSet();
                this._subSets.push(subSet);

                subSet.vertices = [];
                subSet.numVertices = 0;
                subSet.indices = [];
                subSet.numIndices = 0;
                subSet.vertexBufferDirty = true;
                subSet.indexBufferDirty = true;
                subSet.lineCount = 0;

                this._subSetCount++;

                return subSet;
            };

            //@override
            SegmentSet.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.removeAllSegments();
                this._pSegments = null;

                //this._material = null;
                var subSet = this._subSets[0];
                subSet.vertices = null;
                subSet.indices = null;
                this._subSets = null;
            };

            Object.defineProperty(SegmentSet.prototype, "mouseEnabled", {
                get: //@override
                function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });

            //@override
            SegmentSet.prototype.pGetDefaultBoundingVolume = function () {
                //return new away.bounds.BoundingSphere();
                return null;
            };

            //@override
            SegmentSet.prototype.updateBounds = function () {
                var subSet;
                var len;
                var v;
                var index;

                var minX = Infinity;
                var minY = Infinity;
                var minZ = Infinity;
                var maxX = -Infinity;
                var maxY = -Infinity;
                var maxZ = -Infinity;
                var vertices;

                for (var i = 0; i < this._subSetCount; ++i) {
                    subSet = this._subSets[i];
                    index = 0;
                    vertices = subSet.vertices;
                    len = vertices.length;

                    if (len == 0) {
                        continue;
                    }

                    while (index < len) {
                        v = vertices[index++];
                        if (v < minX)
                            minX = v; else if (v > maxX)
                            maxX = v;

                        v = vertices[index++];
                        if (v < minY)
                            minY = v; else if (v > maxY)
                            maxY = v;

                        v = vertices[index++];
                        if (v < minZ)
                            minZ = v; else if (v > maxZ)
                            maxZ = v;

                        index += 8;
                    }
                }

                /*
                if (minX != Infinity)
                this._bounds.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
                
                else {
                var min:Number = .5;
                this._bounds.fromExtremes(-min, -min, -min, min, min, min);
                }
                */
                this._pBoundsInvalid = false;
            };

            Object.defineProperty(SegmentSet.prototype, "numTriangles", {
                get: //@override
                /*
                public iCreateEntityPartitionNode():EntityNode
                {
                return new RenderableNode(this);
                }*/
                function () {
                    return this._numIndices / 3;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "sourceEntity", {
                get: function () {
                    return this;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "castsShadows", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "uvTransform", {
                get: /*
                public get material():MaterialBase
                {
                return this._material;
                }
                
                public get animator():IAnimator
                {
                return this._animator;
                }
                
                public set material( value:MaterialBase )
                {
                if( value == this._material)
                {
                return;
                }
                if( this._material )
                {
                this._material.removeOwner(this);
                }
                this._material = value;
                if( this._material )
                {
                this._material.addOwner(this);
                }
                }
                */
                function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexData", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "indexData", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "UVData", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "numVertices", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexStride", {
                get: function () {
                    return 11;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexNormalData", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexTangentData", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexNormalOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "vertexTangentOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SegmentSet.prototype, "assetType", {
                get: //@override
                function () {
                    return away.library.AssetType.SEGMENT_SET;
                },
                enumerable: true,
                configurable: true
            });

            SegmentSet.prototype.getRenderSceneTransform = function (camera) {
                return this._pSceneTransform;
            };
            return SegmentSet;
        })(away.entities.Entity);
        entities.SegmentSet = SegmentSet;

        var SegRef = (function () {
            function SegRef() {
            }
            return SegRef;
        })();

        var SubSet = (function () {
            function SubSet() {
            }
            SubSet.prototype.dispose = function () {
                this.vertices = null;
                if (this.vertexBuffer) {
                    this.vertexBuffer.dispose();
                }
                if (this.indexBuffer) {
                    this.indexBuffer.dispose();
                }
            };
            return SubSet;
        })();
    })(away.entities || (away.entities = {}));
    var entities = away.entities;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (primitives) {
        var WireframePrimitiveBase = (function (_super) {
            __extends(WireframePrimitiveBase, _super);
            function WireframePrimitiveBase(color, thickness) {
                if (typeof color === "undefined") { color = 0xffffff; }
                if (typeof thickness === "undefined") { thickness = 1; }
                _super.call(this);
                this._geomDirty = true;
                if (thickness <= 0) {
                    thickness = 1;
                }
                this._color = color;
                this._thickness = thickness;
            }
            Object.defineProperty(WireframePrimitiveBase.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._color = value;

                    for (var segRef in this._pSegments) {
                        segRef.segment.startColor = segRef.segment.endColor = value;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(WireframePrimitiveBase.prototype, "thickness", {
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    this._thickness = value;

                    for (var segRef in this._pSegments) {
                        segRef.segment.thickness = segRef.segment.thickness = value;
                    }
                },
                enumerable: true,
                configurable: true
            });


            //@override
            WireframePrimitiveBase.prototype.removeAllSegments = function () {
                _super.prototype.removeAllSegments.call(this);
            };

            //@override
            WireframePrimitiveBase.prototype.getBounds = function () {
                if (this._geomDirty) {
                    this.updateGeometry();
                }
                return _super.prototype.getBounds.call(this);
            };

            WireframePrimitiveBase.prototype.pBuildGeometry = function () {
                throw new away.errors.AbstractMethodError();
            };

            WireframePrimitiveBase.prototype.pInvalidateGeometry = function () {
                this._geomDirty = true;
                this.pInvalidateBounds();
            };

            WireframePrimitiveBase.prototype.updateGeometry = function () {
                this.pBuildGeometry();
                this._geomDirty = false;
            };

            WireframePrimitiveBase.prototype.pUpdateOrAddSegment = function (index, v0, v1) {
                var segment;
                var s;
                var e;

                if ((segment = this.getSegment(index)) != null) {
                    s = segment.start;
                    e = segment.end;
                    s.x = v0.x;
                    s.y = v0.y;
                    s.z = v0.z;
                    e.x = v1.x;
                    e.y = v1.y;
                    e.z = v1.z;
                    segment.updateSegment(s, e, null, this._color, this._color, this._thickness);
                } else {
                    throw new away.errors.PartialImplementationError();
                }
            };

            //@override
            WireframePrimitiveBase.prototype.pUpdateMouseChildren = function () {
                throw new away.errors.PartialImplementationError();
            };
            return WireframePrimitiveBase;
        })(away.entities.SegmentSet);
        primitives.WireframePrimitiveBase = WireframePrimitiveBase;
    })(away.primitives || (away.primitives = {}));
    var primitives = away.primitives;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (partition) {
        var NodeBase = (function () {
            function NodeBase() {
                this._pChildNodes = [];
            }
            Object.defineProperty(NodeBase.prototype, "showDebugBounds", {
                get: function () {
                    return this._pDebugPrimitive != null;
                },
                set: function (value) {
                    if (this._pDebugPrimitive && value == true) {
                        return;
                    }

                    if (!this._pDebugPrimitive && value == false) {
                        return;
                    }

                    if (value) {
                        throw new away.errors.PartialImplementationError();
                        this._pDebugPrimitive = this.pCreateDebugBounds();
                    } else {
                        this._pDebugPrimitive.dispose();
                        this._pDebugPrimitive = null;
                    }

                    for (var i = 0; i < this._pNumChildNodes; ++i) {
                        this._pChildNodes[i].showDebugBounds = value;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NodeBase.prototype, "parent", {
                get: function () {
                    return this._iParent;
                },
                enumerable: true,
                configurable: true
            });

            NodeBase.prototype.iAddNode = function (node) {
                node._iParent = this;
                this._pNumEntities += node._pNumEntities;
                this._pChildNodes[this._pNumChildNodes++] = node;
                node.showDebugBounds = this._pDebugPrimitive != null;

                var numEntities = node._pNumEntities;
                node = this;

                do {
                    node._pNumEntities += numEntities;
                } while((node = node._iParent) != null);
            };

            NodeBase.prototype.iRemoveNode = function (node) {
                var index = this._pChildNodes.indexOf(node);
                this._pChildNodes[index] = this._pChildNodes[--this._pNumChildNodes];
                this._pChildNodes.pop();

                var numEntities = node._pNumEntities;
                node = this;

                do {
                    node._pNumEntities -= numEntities;
                } while((node = node._iParent) != null);
            };

            NodeBase.prototype.isInFrustum = function (planes, numPlanes) {
                planes = planes;
                numPlanes = numPlanes;
                return true;
            };

            NodeBase.prototype.isIntersectingRay = function (rayPosition, rayDirection) {
                rayPosition = rayPosition;
                rayDirection = rayDirection;
                return true;
            };

            NodeBase.prototype.findPartitionForEntity = function (entity) {
                entity = entity;
                return this;
            };

            NodeBase.prototype.acceptTraverser = function (traverser) {
                if (this._pNumEntities == 0 && !this._pDebugPrimitive) {
                    return;
                }
                if (traverser.enterNode(this)) {
                    var i;
                    while (i < this._pNumChildNodes) {
                        this._pChildNodes[i++].acceptTraverser(traverser);
                    }

                    if (this._pDebugPrimitive) {
                        traverser.applyRenderable(this._pDebugPrimitive);
                    }
                }
            };

            NodeBase.prototype.pCreateDebugBounds = function () {
                return null;
            };

            Object.defineProperty(NodeBase.prototype, "_pNumEntities", {
                get: function () {
                    return this._iNumEntities;
                },
                enumerable: true,
                configurable: true
            });

            NodeBase.prototype._pUpdateNumEntities = function (value) {
                var diff = value - this._pNumEntities;
                var node = this;

                do {
                    node._pNumEntities += diff;
                } while((node = node._iParent) != null);
            };
            return NodeBase;
        })();
        partition.NodeBase = NodeBase;
    })(away.partition || (away.partition = {}));
    var partition = away.partition;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (partition) {
        var NullNode = (function () {
            function NullNode() {
            }
            return NullNode;
        })();
        partition.NullNode = NullNode;
    })(away.partition || (away.partition = {}));
    var partition = away.partition;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (partition) {
        var Partition3D = (function () {
            function Partition3D(rootNode) {
                this._rootNode = rootNode || new away.partition.NullNode();
            }
            Object.defineProperty(Partition3D.prototype, "showDebugBounds", {
                get: function () {
                    return this._rootNode.showDebugBounds;
                },
                set: function (value) {
                    this._rootNode.showDebugBounds = value;
                },
                enumerable: true,
                configurable: true
            });


            Partition3D.prototype.traverse = function (traverser) {
                if (this._updatesMade) {
                    this.updateEntities();
                }
                ++away.traverse.PartitionTraverser._iCollectionMark;
                this._rootNode.acceptTraverser(traverser);
            };

            Partition3D.prototype.iMarkForUpdate = function (entity) {
                var node = entity.getEntityPartitionNode();
                var t = this._updateQueue;

                while (t) {
                    if (node == t) {
                        return;
                    }
                    t = t._iUpdateQueueNext;
                }

                node._iUpdateQueueNext = this._updateQueue;

                this._updateQueue = node;
                this._updatesMade = true;
            };

            Partition3D.prototype.iRemoveEntity = function (entity) {
                var node = entity.getEntityPartitionNode();
                var t;

                node.removeFromParent();

                if (node == this._updateQueue) {
                    this._updateQueue = node._iUpdateQueueNext;
                } else {
                    t = this._updateQueue;
                    while (t && t._iUpdateQueueNext != node) {
                        t = t._iUpdateQueueNext;
                    }
                    if (t) {
                        t._iUpdateQueueNext = node._iUpdateQueueNext;
                    }
                }

                node._iUpdateQueueNext = null;

                if (!this._updateQueue) {
                    this._updatesMade = false;
                }
            };

            Partition3D.prototype.updateEntities = function () {
                var node = this._updateQueue;
                var targetNode;
                var t;
                this._updateQueue = null;
                this._updatesMade = false;

                do {
                    targetNode = this._rootNode.findPartitionForEntity(node.entity);
                    if (node.parent != targetNode) {
                        if (node) {
                            node.removeFromParent();
                        }
                        targetNode.iAddNode(node);
                    }

                    t = node._iUpdateQueueNext;
                    node._iUpdateQueueNext = null;
                    node.entity.iInternalUpdate();
                } while((node = t) != null);
            };
            return Partition3D;
        })();
        partition.Partition3D = Partition3D;
    })(away.partition || (away.partition = {}));
    var partition = away.partition;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        /**
        * Value object for a picking collision returned by a picking collider. Created as unique objects on entities
        *
        * @see away3d.entities.Entity#pickingCollisionVO
        * @see away3d.core.pick.IPickingCollider
        */
        var PickingCollisionVO = (function () {
            /**
            * Creates a new <code>PickingCollisionVO</code> object.
            *
            * @param entity The entity to which this collision object belongs.
            */
            function PickingCollisionVO(entity) {
                this.entity = entity;
            }
            return PickingCollisionVO;
        })();
        pick.PickingCollisionVO = PickingCollisionVO;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (partition) {
        var EntityNode = (function (_super) {
            __extends(EntityNode, _super);
            function EntityNode(entity) {
                _super.call(this);
                this._entity = entity;
                this._iNumEntities = 1;
            }
            Object.defineProperty(EntityNode.prototype, "entity", {
                get: function () {
                    return this._entity;
                },
                enumerable: true,
                configurable: true
            });

            EntityNode.prototype.removeFromParent = function () {
                if (this._iParent) {
                    this._iParent.iRemoveNode(this);
                }
                this._iParent = null;
            };

            //@override
            EntityNode.prototype.isInFrustum = function (planes, numPlanes) {
                if (!this._entity._iIsVisible) {
                    return false;
                }
                return this._entity.worldBounds.isInFrustum(planes, numPlanes);
            };
            return EntityNode;
        })(partition.NodeBase);
        partition.EntityNode = EntityNode;
    })(away.partition || (away.partition = {}));
    var partition = away.partition;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (partition) {
        var CameraNode = (function (_super) {
            __extends(CameraNode, _super);
            function CameraNode(camera) {
                _super.call(this, camera);
            }
            //@override
            CameraNode.prototype.acceptTraverser = function (traverser) {
            };
            return CameraNode;
        })(away.partition.EntityNode);
        partition.CameraNode = CameraNode;
    })(away.partition || (away.partition = {}));
    var partition = away.partition;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    (function (partition) {
        var LightNode = (function (_super) {
            __extends(LightNode, _super);
            function LightNode(light) {
                _super.call(this, light);
                this._light = light;
            }
            Object.defineProperty(LightNode.prototype, "light", {
                get: function () {
                    return this._light;
                },
                enumerable: true,
                configurable: true
            });

            //@override
            LightNode.prototype.acceptTraverser = function (traverser) {
                if (traverser.enterNode(this)) {
                    _super.prototype.acceptTraverser.call(this, traverser);
                    traverser.applyUnknownLight(this._light);
                }
            };
            return LightNode;
        })(away.partition.EntityNode);
        partition.LightNode = LightNode;
    })(away.partition || (away.partition = {}));
    var partition = away.partition;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
        })(errors.Error);
        errors.PartialImplementationError = PartialImplementationError;
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (display) {
        var Stage3D = (function (_super) {
            __extends(Stage3D, _super);
            function Stage3D(canvas) {
                _super.call(this);
                this._canvas = canvas;
            }
            Stage3D.prototype.requestContext = function () {
                try  {
                    this._context3D = new away.display3D.Context3D(this._canvas);
                } catch (e) {
                    this.dispatchEvent(new away.events.Event(away.events.Event.ERROR));
                }

                if (this._context3D) {
                    this.dispatchEvent(new away.events.Event(away.events.Event.CONTEXT3D_CREATE));
                }
            };

            Object.defineProperty(Stage3D.prototype, "canvas", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3D.prototype, "context3D", {
                get: function () {
                    return this._context3D;
                },
                enumerable: true,
                configurable: true
            });
            return Stage3D;
        })(away.events.EventDispatcher);
        display.Stage3D = Stage3D;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
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
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
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
        })(errors.Error);
        errors.DocumentError = DocumentError;
    })(away.errors || (away.errors = {}));
    var errors = away.errors;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        /**
        * An abstract base class for all picking collider classes. It should not be instantiated directly.
        */
        var PickingColliderBase = (function () {
            function PickingColliderBase() {
            }
            PickingColliderBase.prototype._pPetCollisionNormal = function (indexData/*uint*/ , vertexData, triangleIndex) {
                var normal = new away.geom.Vector3D();
                var i0 = indexData[triangleIndex] * 3;
                var i1 = indexData[triangleIndex + 1] * 3;
                var i2 = indexData[triangleIndex + 2] * 3;
                var p0 = new away.geom.Vector3D(vertexData[i0], vertexData[i0 + 1], vertexData[i0 + 2]);
                var p1 = new away.geom.Vector3D(vertexData[i1], vertexData[i1 + 1], vertexData[i1 + 2]);
                var p2 = new away.geom.Vector3D(vertexData[i2], vertexData[i2 + 1], vertexData[i2 + 2]);
                var side0 = p1.subtract(p0);
                var side1 = p2.subtract(p0);
                normal = side0.crossProduct(side1);
                normal.normalize();
                return normal;
            };

            PickingColliderBase.prototype._pGetCollisionUV = function (indexData/*uint*/ , uvData, triangleIndex, v, w, u, uvOffset, uvStride) {
                var uv = new away.geom.Point();
                var uIndex = indexData[triangleIndex] * uvStride + uvOffset;
                var uv0 = new away.geom.Vector3D(uvData[uIndex], uvData[uIndex + 1]);
                uIndex = indexData[triangleIndex + 1] * uvStride + uvOffset;
                var uv1 = new away.geom.Vector3D(uvData[uIndex], uvData[uIndex + 1]);
                uIndex = indexData[triangleIndex + 2] * uvStride + uvOffset;
                var uv2 = new away.geom.Vector3D(uvData[uIndex], uvData[uIndex + 1]);
                uv.x = u * uv0.x + v * uv1.x + w * uv2.x;
                uv.y = u * uv0.y + v * uv1.y + w * uv2.y;
                return uv;
            };

            /* TODO: implement & integrate GeometryUtils, SubGeometry, SubMesh
            protected function getMeshSubgeometryIndex(subGeometry:SubGeometry):number
            {
            return GeometryUtils.getMeshSubgeometryIndex(subGeometry);
            }
            */
            /* TODO: implement & integrate
            protected function getMeshSubMeshIndex(subMesh:SubMesh):number
            {
            return GeometryUtils.getMeshSubMeshIndex(subMesh);
            }
            */
            /**
            * @inheritDoc
            */
            PickingColliderBase.prototype.setLocalRay = function (localPosition, localDirection) {
                this.rayPosition = localPosition;
                this.rayDirection = localDirection;
            };
            return PickingColliderBase;
        })();
        pick.PickingColliderBase = PickingColliderBase;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        /**
        * Pure AS3 picking collider for entity objects. Used with the <code>RaycastPicker</code> picking object.
        *
        * @see away3d.entities.Entity#pickingCollider
        * @see away3d.core.pick.RaycastPicker
        */
        var AS3PickingCollider = (function (_super) {
            __extends(AS3PickingCollider, _super);
            /**
            * Creates a new <code>AS3PickingCollider</code> object.
            *
            * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
            */
            function AS3PickingCollider(findClosestCollision) {
                if (typeof findClosestCollision === "undefined") { findClosestCollision = false; }
                _super.call(this);
                this._findClosestCollision = findClosestCollision;
            }
            return AS3PickingCollider;
        })(away.pick.PickingColliderBase);
        pick.AS3PickingCollider = AS3PickingCollider;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        /**
        * Options for setting a picking collider for entity objects. Used with the <code>RaycastPicker</code> picking object.
        *
        * @see away3d.entities.Entity#pickingCollider
        * @see away3d.core.pick.RaycastPicker
        */
        var PickingColliderType = (function () {
            function PickingColliderType() {
            }
            PickingColliderType.BOUNDS_ONLY = null;

            PickingColliderType.AS3_FIRST_ENCOUNTERED = new away.pick.AS3PickingCollider(false);

            PickingColliderType.AS3_BEST_HIT = new away.pick.AS3PickingCollider(true);
            return PickingColliderType;
        })();
        pick.PickingColliderType = PickingColliderType;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (containers) {
        var View3D = (function () {
            function View3D(scene, camera) {
                this._time = 0;
                this._deltaTime = 0;
                this._backgroundColor = 0x000000;
                this._backgroundAlpha = 1;
                this._depthTextureInvalid = true;
                //private _background:away.textures.Texture2DBase;
                //public _pStage3DProxy:away.managers.Stage3DProxy;
                this._pBackBufferInvalid = true;
                //public _pRttBufferManager:away.managers.RTTBufferManager;
                this._rightClickMenuEnabled = true;
                //private _menu0:away.ui.ContextMenuItem;
                //private _menu1:away.ui.ContextMenuItem;
                //private _viewContextMenu:away.ui.ContextMenu;
                this._pShareContext = false;
                this._scissorRectDirty = true;
                this._viewportDirty = true;
                this._layeredView = false;
                // TODO link to displaylist
                //this._profile = profile;
                this._pScene = scene || new containers.Scene3D();

                this._pScene.addEventListener(away.events.Scene3DEvent.PARTITION_CHANGED, this.onScenePartitionChanged, this);
                this._pCamera = camera || new away.cameras.Camera3D();
            }
            View3D.prototype.onScenePartitionChanged = function (e) {
                if (this._pCamera) {
                    this._pCamera.partition = this.scene.partition;
                }
            };

            Object.defineProperty(View3D.prototype, "scene", {
                get: /*
                public get rightClickMenuEnabled():Boolean
                {
                return this._rightClickMenuEnabled;
                }
                
                public set rightClickMenuEnabled( val:boolean )
                {
                this._rightClickMenuEnabled = val;
                this.updateRightClickMenu();
                }
                
                public get stage3DProxy():away.managers.Stage3DProxy
                {
                return this._stage3DProxy;
                }
                
                public set stage3DProxy( stage3DProxy:away.managers.Stage3DProxy )
                {
                if (this._stage3DProxy)
                {
                this._stage3DProxy.removeEventListener(away.events.Stage3DEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this );
                }
                
                this._stage3DProxy = stage3DProxy;
                this._stage3DProxy.addEventListener( away.events.Stage3DEvent.VIEWPORT_UPDATED, this.onViewportUpdated, this );
                this._renderer.stage3DProxy = this._depthRenderer.stage3DProxy = _stage3DProxy;
                this._globalPosDirty = true;
                this._backBufferInvalid = true;
                }
                
                public get forceMouseMove():boolean
                {
                return this._mouse3DManager.forceMouseMove;
                }
                
                public set forceMouseMove( value:boolean )
                {
                this._mouse3DManager.forceMouseMove = value;
                this._touch3DManager.forceTouchMove = value;
                }
                
                public get background():away.textures.Texture2DBase
                {
                return this._background;
                }
                
                public set background( value:away.textures.Texture2DBase )
                {
                this._background = value;
                this._renderer.background = _background;
                }
                
                public get layeredView():boolean
                {
                return this._layeredView;
                }
                
                public set layeredView( value:boolean )
                {
                this._layeredView = value;
                }
                
                private initHitField()
                {
                this._hitField = new away.display.Sprite();
                this._hitField.alpha = 0;
                this._hitField.doubleClickEnabled = true;
                this._hitField.graphics.beginFill( 0x000000 );
                this._hitField.graphics.drawRect( 0, 0, 100, 100 );
                this.addChild( this._hitField );
                }
                
                
                //TODO override public function get filters():Array
                //TODO override public function set filters(value:Array):void
                
                
                public get filters3d():Array
                {
                return this._filter3DRenderer ? this._filter3DRenderer.filters : null;
                }
                
                //TODO public set filters3d( value:Array )
                
                public get renderer():away.render.RendererBase
                {
                return this._renderer;
                }
                
                //TODO public function set renderer(value:RendererBase):void
                
                public get backgroundColor():number
                {
                return this._backgroundColor;
                }
                
                //TODO public function set backgroundColor(value:uint):void
                
                public get backgroundAlpha():number
                {
                return this._backgroundAlpha;
                }
                
                public function set backgroundAlpha(value:Number):void
                {
                if (value > 1)
                {
                value = 1;
                }
                else if (value < 0)
                {
                value = 0;
                }
                
                this._renderer.backgroundAlpha = value;
                this._backgroundAlpha = value;
                }
                
                public get camera():away.cameras.Camera3D
                {
                return this._camera;
                }
                
                //TODO public function set camera(camera:Camera3D):void
                */
                function () {
                    return this._pScene;
                },
                enumerable: true,
                configurable: true
            });
            return View3D;
        })();
        containers.View3D = View3D;
    })(away.containers || (away.containers = {}));
    var containers = away.containers;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
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
        * @see away3d.library.AssetLibrary.conflictStrategy
        * @see away3d.library.naming.ConflictStrategy
        * @see away3d.library.naming.IgnoreConflictStrategy
        * @see away3d.library.naming.ErrorConflictStrategy
        * @see away3d.library.naming.NumSuffixConflictStrategy
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
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
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
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (library) {
        //import away3d.library.assets.IAsset;
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
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (library) {
        //import away3d.library.assets.IAsset;
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
        * @see away3d.library.AssetLibrary.conflictPrecedence
        * @see away3d.library.AssetLibrary.conflictStrategy
        * @see away3d.library.naming.ConflictStrategy
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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
                this._assets = new Array();
                this._assetDictionary = new Object();
                this._loadingSessions = new Array();

                this.conflictStrategy = away.library.ConflictStrategy.IGNORE.create();
                this.conflictPrecedence = away.library.ConflictPrecedence.FAVOR_NEW;
            }
            AssetLibraryBundle.getInstance = /**
            * Returns an AssetLibraryBundle instance. If no key is given, returns the default bundle instance (which is
            * similar to using the AssetLibraryBundle as a singleton.) To keep several separated library bundles,
            * pass a string key to this method to define which bundle should be returned. This is
            * referred to as using the AssetLibrary as a multiton.
            *
            * @param key Defines which multiton instance should be returned.
            * @return An instance of the asset library
            */
            function (key) {
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
                away.loaders.SingleFileLoader.enableParser(parserClass);
            };

            /**
            *
            */
            AssetLibraryBundle.prototype.enableParsers = function (parserClasses) {
                away.loaders.SingleFileLoader.enableParsers(parserClasses);
            };

            Object.defineProperty(AssetLibraryBundle.prototype, "conflictStrategy", {
                get: /**
                * Defines which strategy should be used for resolving naming conflicts, when two library
                * assets are given the same name. By default, <code>ConflictStrategy.APPEND_NUM_SUFFIX</code>
                * is used which means that a numeric suffix is appended to one of the assets. The
                * <code>conflictPrecedence</code> property defines which of the two conflicting assets will
                * be renamed.
                *
                * @see away3d.library.naming.ConflictStrategy
                * @see away3d.library.AssetLibrary.conflictPrecedence
                */
                function () {
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
                get: /**
                * Defines which asset should have precedence when resolving a naming conflict between
                * two assets of which one has just been renamed by the user or by a parser. By default
                * <code>ConflictPrecedence.FAVOR_NEW</code> is used, meaning that the newly renamed
                * asset will keep it's new name while the older asset gets renamed to not conflict.
                *
                * This property is ignored for conflict strategies that do not actually rename an
                * asset automatically, such as ConflictStrategy.IGNORE and ConflictStrategy.THROW_ERROR.
                *
                * @see away3d.library.naming.ConflictPrecedence
                * @see away3d.library.naming.ConflictStrategy
                */
                function () {
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
            * @see away3d.library.assets.AssetType
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
                if (this._assetDictDirty) {
                    this.rehashAssetDict();
                }

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

                if (this._assets.indexOf(asset) >= 0) {
                    return;
                }

                old = this.getAsset(asset.name, asset.assetNamespace);
                ns = asset.assetNamespace || library.NamedAssetBase.DEFAULT_NAMESPACE;

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
            * @see away3d.library.AssetLibrary.removeAsset()
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
            * @see away3d.library.AssetLibrary.removeAsset()
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
                    ns = away.library.NamedAssetBase.DEFAULT_NAMESPACE;
                }

                for (var d = 0; d < old_assets.length; d++) {
                    asset = old_assets[d];

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
                var loader = new away.loaders.AssetLoader();

                if (!this._loadingSessions) {
                    this._loadingSessions = new Array();
                }

                this._loadingSessions.push(loader);

                loader.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceRetrieved, this);
                loader.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyRetrieved, this);
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
                var loader = new away.loaders.AssetLoader();

                if (!this._loadingSessions) {
                    this._loadingSessions = new Array();
                }

                this._loadingSessions.push(loader);

                loader.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, this.onResourceRetrieved, this);
                loader.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyRetrieved, this);
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
    ///<reference path="../../_definitions.ts"/>
    (function (library) {
        //import away3d.library.assets.IAsset;
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
                    this._filtered = new Array();

                    var l = this._assets.length;

                    for (var c = 0; c < l; c++) {
                        asset = this._assets[c];

                        if (assetTypeFilter && asset.assetType != assetTypeFilter)
                            continue;

                        if (namespaceFilter && asset.assetNamespace != namespaceFilter)
                            continue;

                        if (filterFunc != null && !filterFunc(asset))
                            continue;

                        this._filtered[idx++] = asset;
                    }
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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
                    //console.log( 'AssetLoader.retrieveNext - away.events.LoaderEvent.RESOURCE_COMPLETE');
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
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (library) {
        /**
        * Enumeration class for bundled conflict strategies. Set one of these values (or an
        * instance of a self-defined sub-class of ConflictStrategyBase) to the conflictStrategy
        * property on an AssetLibrary to define how that library resolves naming conflicts.
        *
        * The value of the <code>AssetLibrary.conflictPrecedence</code> property defines which
        * of the conflicting assets will get to keep it's name, and which is renamed (if any.)
        *
        * @see away3d.library.AssetLibrary.conflictStrategy
        * @see away3d.library.naming.ConflictStrategyBase
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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../../_definitions.ts"/>
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
    ///<reference path="../../_definitions.ts"/>
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
    (function (library) {
        var IDUtil = (function () {
            function IDUtil() {
            }
            IDUtil.createUID = /**
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
            function () {
                var uid = new Array(36);
                var index = 0;

                var i;
                var j;

                for (i = 0; i < 8; i++)
                    uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];

                for (i = 0; i < 3; i++) {
                    uid[index++] = 45;

                    for (j = 0; j < 4; j++)
                        uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];
                }

                uid[index++] = 45;

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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
            AssetLibrary.getBundle = //*/
            /**
            * Returns an AssetLibrary bundle instance. If no key is given, returns the default bundle (which is
            * similar to using the AssetLibraryBundle as a singleton). To keep several separated library bundles,
            * pass a string key to this method to define which bundle should be returned. This is
            * referred to as using the AssetLibraryBundle as a multiton.
            *
            * @param key Defines which multiton instance should be returned.
            * @return An instance of the asset library
            */
            function (key) {
                if (typeof key === "undefined") { key = 'default'; }
                return away.library.AssetLibraryBundle.getInstance(key);
            };

            AssetLibrary.enableParser = /**
            *
            */
            function (parserClass) {
                away.loaders.SingleFileLoader.enableParser(parserClass);
            };

            AssetLibrary.enableParsers = /**
            *
            */
            function (parserClasses) {
                away.loaders.SingleFileLoader.enableParsers(parserClasses);
            };

            Object.defineProperty(AssetLibrary, "conflictStrategy", {
                get: /**
                * Short-hand for conflictStrategy property on default asset library bundle.
                *
                * @see away3d.library.AssetLibraryBundle.conflictStrategy
                */
                function () {
                    return away.library.AssetLibrary.getBundle().conflictStrategy;
                },
                set: function (val) {
                    away.library.AssetLibrary.getBundle().conflictStrategy = val;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssetLibrary, "conflictPrecedence", {
                get: /**
                * Short-hand for conflictPrecedence property on default asset library bundle.
                *
                * @see away3d.library.AssetLibraryBundle.conflictPrecedence
                */
                function () {
                    return away.library.AssetLibrary.getBundle().conflictPrecedence;
                },
                set: function (val) {
                    away.library.AssetLibrary.getBundle().conflictPrecedence = val;
                },
                enumerable: true,
                configurable: true
            });


            AssetLibrary.createIterator = /**
            * Short-hand for createIterator() method on default asset library bundle.
            *
            * @see away3d.library.AssetLibraryBundle.createIterator()
            */
            function (assetTypeFilter, namespaceFilter, filterFunc) {
                if (typeof assetTypeFilter === "undefined") { assetTypeFilter = null; }
                if (typeof namespaceFilter === "undefined") { namespaceFilter = null; }
                if (typeof filterFunc === "undefined") { filterFunc = null; }
                return away.library.AssetLibrary.getBundle().createIterator(assetTypeFilter, namespaceFilter, filterFunc);
            };

            AssetLibrary.load = /**
            * Short-hand for load() method on default asset library bundle.
            *
            * @see away3d.library.AssetLibraryBundle.load()
            */
            function (req, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                return away.library.AssetLibrary.getBundle().load(req, context, ns, parser);
            };

            AssetLibrary.loadData = /**
            * Short-hand for loadData() method on default asset library bundle.
            *
            * @see away3d.library.AssetLibraryBundle.loadData()
            */
            function (data, context, ns, parser) {
                if (typeof context === "undefined") { context = null; }
                if (typeof ns === "undefined") { ns = null; }
                if (typeof parser === "undefined") { parser = null; }
                return away.library.AssetLibrary.getBundle().loadData(data, context, ns, parser);
            };

            AssetLibrary.stopLoad = function () {
                away.library.AssetLibrary.getBundle().stopAllLoadingSessions();
            };

            AssetLibrary.getAsset = /**
            * Short-hand for getAsset() method on default asset library bundle.
            *
            * @see away3d.library.AssetLibraryBundle.getAsset()
            */
            function (name, ns) {
                if (typeof ns === "undefined") { ns = null; }
                return away.library.AssetLibrary.getBundle().getAsset(name, ns);
            };

            AssetLibrary.addEventListener = /**
            * Short-hand for addEventListener() method on default asset library bundle.
            */
            function (type, listener, target) {
                away.library.AssetLibrary.getBundle().addEventListener(type, listener, target);
            };

            AssetLibrary.removeEventListener = /**
            * Short-hand for removeEventListener() method on default asset library bundle.
            */
            function (type, listener, target) {
                away.library.AssetLibrary.getBundle().removeEventListener(type, listener, target);
            };

            AssetLibrary.addAsset = /**
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
            * @see away3d.library.AssetLibraryBundle.addAsset()
            */
            function (asset) {
                away.library.AssetLibrary.getBundle().addAsset(asset);
            };

            AssetLibrary.removeAsset = /**
            * Short-hand for removeAsset() method on default asset library bundle.
            *
            * @param asset The asset which should be removed from the library.
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away3d.library.AssetLibraryBundle.removeAsset()
            */
            function (asset, dispose) {
                if (typeof dispose === "undefined") { dispose = true; }
                away.library.AssetLibrary.getBundle().removeAsset(asset, dispose);
            };

            AssetLibrary.removeAssetByName = /**
            * Short-hand for removeAssetByName() method on default asset library bundle.
            *
            * @param name The name of the asset to be removed.
            * @param ns The namespace to which the desired asset belongs.
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away3d.library.AssetLibraryBundle.removeAssetByName()
            */
            function (name, ns, dispose) {
                if (typeof ns === "undefined") { ns = null; }
                if (typeof dispose === "undefined") { dispose = true; }
                return away.library.AssetLibrary.getBundle().removeAssetByName(name, ns, dispose);
            };

            AssetLibrary.removeAllAssets = /**
            * Short-hand for removeAllAssets() method on default asset library bundle.
            *
            * @param dispose Defines whether the assets should also be disposed.
            *
            * @see away3d.library.AssetLibraryBundle.removeAllAssets()
            */
            function (dispose) {
                if (typeof dispose === "undefined") { dispose = true; }
                away.library.AssetLibrary.getBundle().removeAllAssets(dispose);
            };

            AssetLibrary.removeNamespaceAssets = /**
            * Short-hand for removeNamespaceAssets() method on default asset library bundle.
            *
            * @see away3d.library.AssetLibraryBundle.removeNamespaceAssets()
            */
            function (ns, dispose) {
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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../../_definitions.ts"/>
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
                return extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif";
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
                var asset;

                if (this.data instanceof HTMLImageElement) {
                    asset = new away.textures.HTMLImageElementTexture(this.data);

                    if (away.utils.TextureUtils.isHTMLImageElementValid(this.data)) {
                        this._pFinalizeAsset(asset, this._iFileName);
                    } else {
                        this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.TEXTURE_SIZE_ERROR, asset));
                    }

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
    ///<reference path="../../_definitions.ts"/>
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

                //console.log( 'SingleFileURLLoader.load.dataFormat:' , dataFormat , 'ParserFormat: ' , this._parser.dataFormat );
                //console.log( 'SingleFileURLLoader.load.loaderType: ' , loaderType );
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

                if (parser) {
                    this._parser = parser;
                }

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

                    //console.log( '------------------------------------------');
                    //console.log( i , currentParser );
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
                //console.log( 'SingleFileLoader.onAssetComplete' , event );
                this.dispatchEvent(event.clone());
            };

            SingleFileLoader.prototype.onTextureSizeError = function (event) {
                this.dispatchEvent(event.clone());
            };

            /**
            * Called when parsing is complete.
            */
            SingleFileLoader.prototype.onParseComplete = function (event) {
                //console.log( 'SingleFileLoader.onParseComplete' , event );
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
    ///<reference path="../../_definitions.ts"/>
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
    ///<reference path="../../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        //import away3d.arcane;
        //import away3d.cameras.*;
        //import away3d.containers.*;
        //import away3d.core.base.*;
        //import away3d.core.data.*;
        //import away3d.managers.*;
        //import away3d.core.math.*;
        //import away3d.core.traverse.*;
        //import away3d.entities.*;
        //import away3d.utils.GeometryUtils;
        //import flash.display.*;
        //import flash.display3D.*;
        //import flash.display3D.textures.*;
        //import flash.geom.*;
        //import com.adobe.utils.*;
        //use namespace arcane;
        /**
        * Picks a 3d object from a view or scene by performing a separate render pass on the scene around the area being picked using key color values,
        * then reading back the color value of the pixel in the render representing the picking ray. Requires multiple passes and readbacks for retriving details
        * on an entity that has its shaderPickingDetails property set to true.
        *
        * A read-back operation from any GPU is not a very efficient process, and the amount of processing used can vary significantly between different hardware.
        *
        * @see away3d.entities.Entity#shaderPickingDetails
        */
        // TODO: Dependencies needed to before implementing IPicker - EntityCollector
        var ShaderPicker = (function () {
            /**
            * Creates a new <code>ShaderPicker</code> object.
            */
            function ShaderPicker() {
                this._onlyMouseEnabled = true;
                this._interactives = new Array();
                this._localHitPosition = new away.geom.Vector3D();
                this._hitUV = new away.geom.Point();
                this._localHitNormal = new away.geom.Vector3D();
                this._rayPos = new away.geom.Vector3D();
                this._rayDir = new away.geom.Vector3D();
                this._id = new Array(4);
                this._viewportData = new Array(4);
                this._boundOffsetScale = new Array(8);
                this._boundOffsetScale[3] = 0;
                this._boundOffsetScale[7] = 1;
            }
            Object.defineProperty(ShaderPicker.prototype, "onlyMouseEnabled", {
                get: /**
                * @inheritDoc
                */
                function () {
                    return this._onlyMouseEnabled;
                },
                set: function (value) {
                    this._onlyMouseEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            // TODO implement dependency : EntityCollector
            // TODO: GLSL implementation / conversion
            ShaderPicker.prototype.getViewCollision = function (x, y, view) {
                throw new away.errors.PartialImplementationError('EntityCollector, Stage3dProxy');
                return null;
            };

            //*/
            /**
            * @inheritDoc
            */
            ShaderPicker.prototype.getSceneCollision = function (position, direction, scene) {
                return null;
            };

            /**
            * @inheritDoc
            */
            /* TODO: Implement dependency - EntityCollector
            // TODO: GLSL implementation / conversion
            protected function draw(entityCollector:EntityCollector, target:TextureBase)
            {
            var camera:Camera3D = entityCollector.camera;
            
            _context.clear(0, 0, 0, 1);
            _stage3DProxy.scissorRect = ShaderPicker.MOUSE_SCISSOR_RECT;
            
            _interactives.length = _interactiveId = 0;
            
            if (!_objectProgram3D)
            initObjectProgram3D();
            _context.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ZERO);
            _context.setDepthTest(true, Context3DCompareMode.LESS);
            _context.setProgram(_objectProgram3D);
            _context.setProgramConstantsFromVector(Context3DProgramType.VERTEX, 4, _viewportData, 1);
            drawRenderables(entityCollector.opaqueRenderableHead, camera);
            drawRenderables(entityCollector.blendedRenderableHead, camera);
            }
            */
            /**
            * Draw a list of renderables.
            * @param renderables The renderables to draw.
            * @param camera The camera for which to render.
            */
            /* TODO implement dependencies: RenderableListItem , Camera3D
            private drawRenderables(item:RenderableListItem, camera:Camera3D)
            {
            var matrix:Matrix3D = away3d.math.Matrix3DUtils.CALCULATION_MATRIX;
            var renderable:IRenderable;
            var viewProjection:Matrix3D = camera.viewProjection;
            
            while (item) {
            renderable = item.renderable;
            
            // it's possible that the renderable was already removed from the scene
            if (!renderable.sourceEntity.scene || (!renderable.mouseEnabled && _onlyMouseEnabled)) {
            item = item.next;
            continue;
            }
            
            _potentialFound = true;
            
            _context.setCulling(renderable.material.bothSides? Context3DTriangleFace.NONE : Context3DTriangleFace.BACK);
            
            _interactives[_interactiveId++] = renderable;
            // color code so that reading from bitmapdata will contain the correct value
            _id[1] = (_interactiveId >> 8)/255; // on green channel
            _id[2] = (_interactiveId & 0xff)/255; // on blue channel
            
            matrix.copyFrom(renderable.getRenderSceneTransform(camera));
            matrix.append(viewProjection);
            _context.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 0, matrix, true);
            _context.setProgramConstantsFromVector(Context3DProgramType.FRAGMENT, 0, _id, 1);
            renderable.activateVertexBuffer(0, _stage3DProxy);
            _context.drawTriangles(renderable.getIndexBuffer(_stage3DProxy), 0, renderable.numTriangles);
            
            item = item.next;
            }
            }
            */
            /* TODO implement dependencies: Camera3D
            private updateRay(camera:Camera3D)
            {
            _rayPos = camera.scenePosition;
            _rayDir = camera.getRay(_projX, _projY, 1);
            _rayDir.normalize();
            }
            */
            /**
            * Creates the Program3D that color-codes objects.
            */
            /* TODO AGAL <> GLSL conversion.
            private initObjectProgram3D()
            {
            var vertexCode:string;
            var fragmentCode:string;
            
            _objectProgram3D = _context.createProgram();
            
            vertexCode = "m44 vt0, va0, vc0			\n" +
            "mul vt1.xy, vt0.w, vc4.zw	\n" +
            "add vt0.xy, vt0.xy, vt1.xy	\n" +
            "mul vt0.xy, vt0.xy, vc4.xy	\n" +
            "mov op, vt0	\n";
            fragmentCode = "mov oc, fc0"; // write identifier
            
            _objectProgram3D.upload(new AGALMiniAssembler().assemble(Context3DProgramType.VERTEX, vertexCode),
            new AGALMiniAssembler().assemble(Context3DProgramType.FRAGMENT, fragmentCode));
            }
            */
            /**
            * Creates the Program3D that renders positions.
            */
            /* TODO AGAL <> GLSL conversion.
            private initTriangleProgram3D()
            {
            var vertexCode:string;
            var fragmentCode:string;
            
            this._triangleProgram3D = this._context.createProgram();
            
            // todo: add animation code
            vertexCode = "add vt0, va0, vc5 			\n" +
            "mul vt0, vt0, vc6 			\n" +
            "mov v0, vt0				\n" +
            "m44 vt0, va0, vc0			\n" +
            "mul vt1.xy, vt0.w, vc4.zw	\n" +
            "add vt0.xy, vt0.xy, vt1.xy	\n" +
            "mul vt0.xy, vt0.xy, vc4.xy	\n" +
            "mov op, vt0	\n";
            fragmentCode = "mov oc, v0"; // write identifier
            
            _triangleProgram3D.upload(new AGALMiniAssembler().assemble(Context3DProgramType.VERTEX, vertexCode),
            new AGALMiniAssembler().assemble(Context3DProgramType.FRAGMENT, fragmentCode));
            }
            */
            /**
            * Gets more detailed information about the hir position, if required.
            * @param camera The camera used to view the hit object.
            */
            /* TODO implement dependencies: Camera3D
            private getHitDetails(camera:Camera3D)
            {
            getApproximatePosition(camera);
            getPreciseDetails(camera);
            }
            */
            /**
            * Finds a first-guess approximate position about the hit position.
            * @param camera The camera used to view the hit object.
            */
            /* TODO implement dependencies: Camera3D
            private getApproximatePosition(camera:Camera3D)
            {
            var entity:Entity = _hitRenderable.sourceEntity;
            var col:number;
            var scX:number, scY:number, scZ:number;
            var offsX:number, offsY:number, offsZ:number;
            var localViewProjection:Matrix3D = away3d.math.Matrix3DUtils.CALCULATION_MATRIX;
            localViewProjection.copyFrom(_hitRenderable.getRenderSceneTransform(camera));
            localViewProjection.append(camera.viewProjection);
            if (!_triangleProgram3D)
            initTriangleProgram3D();
            
            _boundOffsetScale[4] = 1/(scX = entity.maxX - entity.minX);
            _boundOffsetScale[5] = 1/(scY = entity.maxY - entity.minY);
            _boundOffsetScale[6] = 1/(scZ = entity.maxZ - entity.minZ);
            _boundOffsetScale[0] = offsX = -entity.minX;
            _boundOffsetScale[1] = offsY = -entity.minY;
            _boundOffsetScale[2] = offsZ = -entity.minZ;
            
            _context.setProgram(_triangleProgram3D);
            _context.clear(0, 0, 0, 0, 1, 0, Context3DClearMask.DEPTH);
            _context.setScissorRectangle(ShaderPicker.MOUSE_SCISSOR_RECT);
            _context.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 0, localViewProjection, true);
            _context.setProgramConstantsFromVector(Context3DProgramType.VERTEX, 5, _boundOffsetScale, 2);
            _hitRenderable.activateVertexBuffer(0, _stage3DProxy);
            _context.drawTriangles(_hitRenderable.getIndexBuffer(_stage3DProxy), 0, _hitRenderable.numTriangles);
            _context.drawToBitmapData(_bitmapData);
            
            col = _bitmapData.getPixel(0, 0);
            
            _localHitPosition.x = ((col >> 16) & 0xff)*scX/255 - offsX;
            _localHitPosition.y = ((col >> 8) & 0xff)*scY/255 - offsY;
            _localHitPosition.z = (col & 0xff)*scZ/255 - offsZ;
            }
            */
            /**
            * Use the approximate position info to find the face under the mouse position from which we can derive the precise
            * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
            * @param camera The camera used to view the hit object.
            */
            /* TODO implement dependencies: Camera3D
            private getPreciseDetails(camera:Camera3D)
            {
            
            var subGeom:ISubGeometry = SubMesh(_hitRenderable).subGeometry;
            var indices:number[] = subGeom.indexData;
            var vertices:number[] = subGeom.vertexData;
            var len:number = indices.length;
            var x1:number, y1:number, z1:number;
            var x2:number, y2:number, z2:number;
            var x3:number, y3:number, z3:number;
            var i:number = 0, j:number = 1, k:number = 2;
            var t1:number, t2:number, t3:number;
            var v0x:number, v0y:number, v0z:number;
            var v1x:number, v1y:number, v1z:number;
            var v2x:number, v2y:number, v2z:number;
            var dot00:number, dot01:number, dot02:number, dot11:number, dot12:number;
            var s:number, t:number, invDenom:number;
            var uvs:number[] = subGeom.UVData;
            var normals:number[] = subGeom.faceNormals;
            var x:number = _localHitPosition.x, y:number = _localHitPosition.y, z:number = _localHitPosition.z;
            var u:number, v:number;
            var ui1:number, ui2:number, ui3:number;
            var s0x:number, s0y:number, s0z:number;
            var s1x:number, s1y:number, s1z:number;
            var nl:number;
            var stride:number = subGeom.vertexStride;
            var vertexOffset:number = subGeom.vertexOffset;
            
            updateRay(camera);
            
            while (i < len) {
            t1 = vertexOffset + indices[i]*stride;
            t2 = vertexOffset + indices[j]*stride;
            t3 = vertexOffset + indices[k]*stride;
            x1 = vertices[t1];
            y1 = vertices[t1 + 1];
            z1 = vertices[t1 + 2];
            x2 = vertices[t2];
            y2 = vertices[t2 + 1];
            z2 = vertices[t2 + 2];
            x3 = vertices[t3];
            y3 = vertices[t3 + 1];
            z3 = vertices[t3 + 2];
            
            // if within bounds
            if (!(    (x < x1 && x < x2 && x < x3) ||
            (y < y1 && y < y2 && y < y3) ||
            (z < z1 && z < z2 && z < z3) ||
            (x > x1 && x > x2 && x > x3) ||
            (y > y1 && y > y2 && y > y3) ||
            (z > z1 && z > z2 && z > z3))) {
            
            // calculate barycentric coords for approximated position
            v0x = x3 - x1;
            v0y = y3 - y1;
            v0z = z3 - z1;
            v1x = x2 - x1;
            v1y = y2 - y1;
            v1z = z2 - z1;
            v2x = x - x1;
            v2y = y - y1;
            v2z = z - z1;
            dot00 = v0x*v0x + v0y*v0y + v0z*v0z;
            dot01 = v0x*v1x + v0y*v1y + v0z*v1z;
            dot02 = v0x*v2x + v0y*v2y + v0z*v2z;
            dot11 = v1x*v1x + v1y*v1y + v1z*v1z;
            dot12 = v1x*v2x + v1y*v2y + v1z*v2z;
            invDenom = 1/(dot00*dot11 - dot01*dot01);
            s = (dot11*dot02 - dot01*dot12)*invDenom;
            t = (dot00*dot12 - dot01*dot02)*invDenom;
            
            // if inside the current triangle, fetch details hit information
            if (s >= 0 && t >= 0 && (s + t) <= 1) {
            
            // this is def the triangle, now calculate precise coords
            getPrecisePosition(_hitRenderable.inverseSceneTransform, normals[i], normals[i + 1], normals[i + 2], x1, y1, z1);
            
            v2x = _localHitPosition.x - x1;
            v2y = _localHitPosition.y - y1;
            v2z = _localHitPosition.z - z1;
            
            s0x = x2 - x1; // s0 = p1 - p0
            s0y = y2 - y1;
            s0z = z2 - z1;
            s1x = x3 - x1; // s1 = p2 - p0
            s1y = y3 - y1;
            s1z = z3 - z1;
            _localHitNormal.x = s0y*s1z - s0z*s1y; // n = s0 x s1
            _localHitNormal.y = s0z*s1x - s0x*s1z;
            _localHitNormal.z = s0x*s1y - s0y*s1x;
            nl = 1/Math.sqrt(
            _localHitNormal.x*_localHitNormal.x +
            _localHitNormal.y*_localHitNormal.y +
            _localHitNormal.z*_localHitNormal.z
            ); // normalize n
            _localHitNormal.x *= nl;
            _localHitNormal.y *= nl;
            _localHitNormal.z *= nl;
            
            dot02 = v0x*v2x + v0y*v2y + v0z*v2z;
            dot12 = v1x*v2x + v1y*v2y + v1z*v2z;
            s = (dot11*dot02 - dot01*dot12)*invDenom;
            t = (dot00*dot12 - dot01*dot02)*invDenom;
            
            ui1 = indices[i] << 1;
            ui2 = indices[j] << 1;
            ui3 = indices[k] << 1;
            
            u = uvs[ui1];
            v = uvs[ui1 + 1];
            _hitUV.x = u + t*(uvs[ui2] - u) + s*(uvs[ui3] - u);
            _hitUV.y = v + t*(uvs[ui2 + 1] - v) + s*(uvs[ui3 + 1] - v);
            
            _faceIndex = i;
            _subGeometryIndex = GeometryUtils.getMeshSubMeshIndex(SubMesh(_hitRenderable));
            
            return;
            }
            }
            
            i += 3;
            j += 3;
            k += 3;
            }
            }
            */
            /**
            * Finds the precise hit position by unprojecting the screen coordinate back unto the hit face's plane and
            * calculating the intersection point.
            * @param camera The camera used to render the object.
            * @param invSceneTransform The inverse scene transformation of the hit object.
            * @param nx The x-coordinate of the face's plane normal.
            * @param ny The y-coordinate of the face plane normal.
            * @param nz The z-coordinate of the face plane normal.
            * @param px The x-coordinate of a point on the face's plane (ie a face vertex)
            * @param py The y-coordinate of a point on the face's plane (ie a face vertex)
            * @param pz The z-coordinate of a point on the face's plane (ie a face vertex)
            */
            ShaderPicker.prototype.getPrecisePosition = function (invSceneTransform, nx, ny, nz, px, py, pz) {
                // calculate screen ray and find exact intersection position with triangle
                var rx, ry, rz;
                var ox, oy, oz;
                var t;
                var raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
                var cx = this._rayPos.x, cy = this._rayPos.y, cz = this._rayPos.z;

                // unprojected projection point, gives ray dir in cam space
                ox = this._rayDir.x;
                oy = this._rayDir.y;
                oz = this._rayDir.z;

                // transform ray dir and origin (cam pos) to object space
                invSceneTransform.copyRawDataTo(raw);
                rx = raw[0] * ox + raw[4] * oy + raw[8] * oz;
                ry = raw[1] * ox + raw[5] * oy + raw[9] * oz;
                rz = raw[2] * ox + raw[6] * oy + raw[10] * oz;

                ox = raw[0] * cx + raw[4] * cy + raw[8] * cz + raw[12];
                oy = raw[1] * cx + raw[5] * cy + raw[9] * cz + raw[13];
                oz = raw[2] * cx + raw[6] * cy + raw[10] * cz + raw[14];

                t = ((px - ox) * nx + (py - oy) * ny + (pz - oz) * nz) / (rx * nx + ry * ny + rz * nz);

                this._localHitPosition.x = ox + rx * t;
                this._localHitPosition.y = oy + ry * t;
                this._localHitPosition.z = oz + rz * t;
            };

            ShaderPicker.prototype.dispose = function () {
                this._bitmapData.dispose();
                if (this._triangleProgram3D) {
                    this._triangleProgram3D.dispose();
                }

                if (this._objectProgram3D) {
                    this._objectProgram3D.dispose();
                }

                this._triangleProgram3D = null;
                this._objectProgram3D = null;
                this._bitmapData = null;
                this._hitRenderable = null;
                this._hitEntity = null;
            };
            ShaderPicker.MOUSE_SCISSOR_RECT = new away.geom.Rectangle(0, 0, 1, 1);
            return ShaderPicker;
        })();
        pick.ShaderPicker = ShaderPicker;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        //import flash.geom.Vector3D;
        //import away3d.arcane;
        //import away3d.containers.Scene3D;
        //import away3d.containers.View3D;
        //import away3d.core.data.EntityListItem;
        //import away3d.core.traverse.EntityCollector;
        //import away3d.core.traverse.RaycastCollector;
        //import away3d.entities.Entity;
        //use namespace arcane;
        /**
        * Picks a 3d object from a view or scene by 3D raycast calculations.
        * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
        * then triggers an optional picking collider on individual entity objects to further determine the precise values of the picking ray collision.
        */
        // TODO: Dependencies needed to before implementing IPicker - EntityListItem, EntityCollector
        var RaycastPicker = (function () {
            /**
            * Creates a new <code>RaycastPicker</code> object.
            *
            * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
            * or simply returns the first collision encountered Defaults to false.
            */
            function RaycastPicker(findClosestCollision) {
                //private var _raycastCollector:RaycastCollector = new RaycastCollector(); // TODO Implement Dependency: RaycastCollector
                this._ignoredEntities = [];
                this._onlyMouseEnabled = true;
                this._findClosestCollision = findClosestCollision;
                this._entities = new Array();
            }
            Object.defineProperty(RaycastPicker.prototype, "onlyMouseEnabled", {
                get: /**
                * @inheritDoc
                */
                function () {
                    return this._onlyMouseEnabled;
                },
                set: function (value) {
                    this._onlyMouseEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            //TODO Implement Dependency: EntityListItem, EntityCollector
            RaycastPicker.prototype.getViewCollision = function (x, y, view) {
                throw new away.errors.PartialImplementationError('EntityListItem, EntityCollector');
                return null;
            };

            //*/
            /**
            * @inheritDoc
            */
            //* TODO Implement Dependency: EntityListItem, EntityCollector
            RaycastPicker.prototype.getSceneCollision = function (position, direction, scene) {
                throw new away.errors.PartialImplementationError('EntityListItem, EntityCollector');
                return null;
            };

            //*/
            /* TODO: Implement Dependency: Entity.isIntersectingRay
            public getEntityCollision(position:away.geom.Vector3D, direction:away.geom.Vector3D, entities:away.entities.Entity[] ):away.pick.PickingCollisionVO
            {
            
            
            position = position; // TODO: remove ?
            direction = direction;
            
            this._numEntities = 0;
            
            var entity:away.entities.Entity;
            var l : number = entities.length;
            
            
            for ( var c : number = 0 ; c < l ; c ++ )
            {
            
            entity = entities[c];
            
            if (entity.isIntersectingRay(position, direction))
            {
            
            this._entities[this._numEntities++] = entity;
            
            }
            
            
            }
            
            return this.getPickingCollisionVO();
            
            }
            //*/
            RaycastPicker.prototype.setIgnoreList = function (entities) {
                this._ignoredEntities = entities;
            };

            RaycastPicker.prototype.isIgnored = function (entity) {
                if (this._onlyMouseEnabled && (!entity._iAncestorsAllowMouseEnabled || !entity.mouseEnabled)) {
                    return true;
                }

                var ignoredEntity;

                var l = this._ignoredEntities.length;

                for (var c = 0; c < l; c++) {
                    ignoredEntity = this._ignoredEntities[c];

                    if (ignoredEntity == entity) {
                        return true;
                    }
                }

                return false;
            };

            RaycastPicker.prototype.sortOnNearT = function (entity1, entity2) {
                return entity1.pickingCollisionVO.rayEntryDistance > entity2.pickingCollisionVO.rayEntryDistance ? 1 : -1;
            };

            RaycastPicker.prototype.getPickingCollisionVO = function () {
                // trim before sorting
                this._entities.length = this._numEntities;

                // Sort entities from closest to furthest.
                this._entities = this._entities.sort(this.sortOnNearT);

                // ---------------------------------------------------------------------
                // Evaluate triangle collisions when needed.
                // Replaces collision data provided by bounds collider with more precise data.
                // ---------------------------------------------------------------------
                var shortestCollisionDistance = Number.MAX_VALUE;
                var bestCollisionVO;
                var pickingCollisionVO;
                var entity;
                var i;

                for (i = 0; i < this._numEntities; ++i) {
                    entity = this._entities[i];
                    pickingCollisionVO = entity._iPickingCollisionVO;
                    if (entity.pickingCollider) {
                        if ((bestCollisionVO == null || pickingCollisionVO.rayEntryDistance < bestCollisionVO.rayEntryDistance) && entity.iCollidesBefore(shortestCollisionDistance, this._findClosestCollision)) {
                            shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
                            bestCollisionVO = pickingCollisionVO;
                            if (!this._findClosestCollision) {
                                this.updateLocalPosition(pickingCollisionVO);
                                return pickingCollisionVO;
                            }
                        }
                    } else if (bestCollisionVO == null || pickingCollisionVO.rayEntryDistance < bestCollisionVO.rayEntryDistance) {
                        if (!pickingCollisionVO.rayOriginIsInsideBounds) {
                            this.updateLocalPosition(pickingCollisionVO);
                            return pickingCollisionVO;
                        }
                    }
                }

                return bestCollisionVO;
            };

            RaycastPicker.prototype.updateLocalPosition = function (pickingCollisionVO) {
                var collisionPos = (pickingCollisionVO.localPosition == null) ? new away.geom.Vector3D() : pickingCollisionVO.localPosition;

                //var collisionPos:away.geom.Vector3D = pickingCollisionVO.localPosition ||= new away.geom.Vector3D();
                var rayDir = pickingCollisionVO.localRayDirection;
                var rayPos = pickingCollisionVO.localRayPosition;
                var t = pickingCollisionVO.rayEntryDistance;
                collisionPos.x = rayPos.x + t * rayDir.x;
                collisionPos.y = rayPos.y + t * rayDir.y;
                collisionPos.z = rayPos.z + t * rayDir.z;
            };

            RaycastPicker.prototype.dispose = function () {
            };
            return RaycastPicker;
        })();
        pick.RaycastPicker = RaycastPicker;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (pick) {
        /**
        * Options for the different 3D object picking approaches available in Away3D. Can be used for automatic mouse picking on the view.
        *
        * @see away3d.containers.View3D#mousePicker
        */
        var PickingType = (function () {
            function PickingType() {
            }
            PickingType.SHADER = new away.pick.ShaderPicker();

            PickingType.RAYCAST_FIRST_ENCOUNTERED = new away.pick.RaycastPicker(false);

            PickingType.RAYCAST_BEST_HIT = new away.pick.RaycastPicker(true);
            return PickingType;
        })();
        pick.PickingType = PickingType;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (events) {
        //import away3d.arcane;
        //import away3d.containers.ObjectContainer3D;
        //import away3d.containers.View3D;
        //import away3d.core.base.IRenderable;
        //import away3d.materials.MaterialBase;
        //import flash.events.Event;
        //import flash.geom.Point;
        //import flash.geom.Vector3D;
        //use namespace arcane;
        /**
        * A MouseEvent3D is dispatched when a mouse event occurs over a mouseEnabled object in View3D.
        * todo: we don't have screenZ data, tho this should be easy to implement
        */
        var MouseEvent3D = (function (_super) {
            __extends(MouseEvent3D, _super);
            /**
            * Create a new MouseEvent3D object.
            * @param type The type of the MouseEvent3D.
            */
            function MouseEvent3D(type) {
                _super.call(this, type);
                // Private.
                this._iAllowedToPropagate = true;
            }
            Object.defineProperty(MouseEvent3D.prototype, "bubbles", {
                get: /**
                * @inheritDoc
                */
                function () {
                    var doesBubble = this._iAllowedToPropagate;
                    this._iAllowedToPropagate = true;

                    // Don't bubble if propagation has been stopped.
                    return doesBubble;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            MouseEvent3D.prototype.stopPropagation = function () {
                this._iAllowedToPropagate = false;

                if (this._iParentEvent) {
                    this._iParentEvent.stopPropagation();
                }
            };

            /**
            * @inheritDoc
            */
            MouseEvent3D.prototype.stopImmediatePropagation = function () {
                this._iAllowedToPropagate = false;

                if (this._iParentEvent) {
                    this._iParentEvent.stopImmediatePropagation();
                }
            };

            /**
            * Creates a copy of the MouseEvent3D object and sets the value of each property to match that of the original.
            */
            MouseEvent3D.prototype.clone = function () {
                var result = new away.events.MouseEvent3D(this.type);

                /* TODO: Debug / test - look into isDefaultPrevented
                if (isDefaultPrevented())
                result.preventDefault();
                */
                result.screenX = this.screenX;
                result.screenY = this.screenY;

                result.view = this.view;
                result.object = this.object;
                result.renderable = this.renderable;
                result.material = this.material;
                result.uv = this.uv;
                result.localPosition = this.localPosition;
                result.localNormal = this.localNormal;
                result.index = this.index;
                result.subGeometryIndex = this.subGeometryIndex;
                result.delta = this.delta;

                result.ctrlKey = this.ctrlKey;
                result.shiftKey = this.shiftKey;

                result._iParentEvent = this;
                result._iAllowedToPropagate = this._iAllowedToPropagate;

                return result;
            };

            Object.defineProperty(MouseEvent3D.prototype, "scenePosition", {
                get: /**
                * The position in scene space where the event took place
                */
                function () {
                    if (this.object instanceof away.containers.ObjectContainer3D) {
                        this.objContainer = this.object;;
                        return objContainer.sceneTransform.transformVector(this.localPosition);
                    } else {
                        return this.localPosition;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MouseEvent3D.prototype, "sceneNormal", {
                get: /**
                * The normal in scene space where the event took place
                */
                function () {
                    if (this.object instanceof away.containers.ObjectContainer3D) {
                        this.objContainer = this.object;;
                        this.sceneNormal = objContainer.sceneTransform.deltaTransformVector(this.localNormal);;

                        sceneNormal.normalize();

                        return sceneNormal;
                    } else {
                        return this.localNormal;
                    }
                },
                enumerable: true,
                configurable: true
            });
            MouseEvent3D.MOUSE_OVER = "mouseOver3d";

            MouseEvent3D.MOUSE_OUT = "mouseOut3d";

            MouseEvent3D.MOUSE_UP = "mouseUp3d";

            MouseEvent3D.MOUSE_DOWN = "mouseDown3d";

            MouseEvent3D.MOUSE_MOVE = "mouseMove3d";

            MouseEvent3D.CLICK = "click3d";

            MouseEvent3D.DOUBLE_CLICK = "doubleClick3d";

            MouseEvent3D.MOUSE_WHEEL = "mouseWheel3d";
            return MouseEvent3D;
        })(events.Event);
        events.MouseEvent3D = MouseEvent3D;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (managers) {
        //import away3d.arcane;
        //import away3d.debug.Debug;
        //import away3d.events.Stage3DEvent;
        //import flash.display.Shape;
        //import flash.display.Stage3D;
        //import flash.display3D.Context3D;
        //import flash.display3D.Context3DClearMask;
        //import flash.display3D.Context3DRenderMode;
        //import flash.display3D.Program3D;
        //import flash.display3D.textures.TextureBase;
        //import flash.events.Event;
        //import flash.events.EventDispatcher;
        //import flash.geom.Rectangle;
        //use namespace arcane;
        //[Event(name="enterFrame", type="flash.events.Event")]
        //[Event(name="exitFrame", type="flash.events.Event")]
        /**
        * Stage3DProxy provides a proxy class to manage a single Stage3D instance as well as handling the creation and
        * attachment of the Context3D (and in turn the back buffer) is uses. Stage3DProxy should never be created directly,
        * but requested through Stage3DManager.
        *
        * @see away3d.core.managers.Stage3DProxy
        *
        * todo: consider moving all creation methods (createVertexBuffer etc) in here, so that disposal can occur here
        * along with the context, instead of scattered throughout the framework
        */
        var Stage3DProxy = (function (_super) {
            __extends(Stage3DProxy, _super);
            /**
            * Creates a Stage3DProxy object. This method should not be called directly. Creation of Stage3DProxy objects should
            * be handled by Stage3DManager.
            * @param stage3DIndex The index of the Stage3D to be proxied.
            * @param stage3D The Stage3D to be proxied.
            * @param stage3DManager
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            */
            function Stage3DProxy(stage3DIndex, stage3D, stage3DManager, forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                _super.call(this);
                this._iStage3DIndex = -1;

                this._iStage3DIndex = stage3DIndex;
                this._stage3D = stage3D;

                // TODO: dependency required ( stage3d.x , stage3d.y, stage3d.visible );
                //this._stage3D.x = 0;
                //this._stage3D.y = 0;
                //this._stage3D.visible = true;
                this._stage3DManager = stage3DManager;
                this._viewPort = new away.geom.Rectangle();
                this._enableDepthAndStencil = true;

                // whatever happens, be sure this has highest priority
                this._stage3D.addEventListener(away.events.Event.CONTEXT3D_CREATE, this.onContext3DUpdate, this);
                this.requestContext(forceSoftware, this.profile);
            }
            //private _touch3DManager:Touch3DManager; //TODO: imeplement dependency Touch3DManager
            Stage3DProxy.prototype.notifyViewportUpdated = function () {
                if (this._viewportDirty) {
                    return;
                }

                this._viewportDirty = true;

                // TODO - reinstate optimisation after testing
                //if (!this.hasEventListener(away.events.Stage3DEvent.VIEWPORT_UPDATED))
                //return;
                //TODO: investigate bug causing coercion error
                //if (!_viewportUpdated)
                this._viewportUpdated = new away.events.Stage3DEvent(away.events.Stage3DEvent.VIEWPORT_UPDATED);
                this.dispatchEvent(this._viewportUpdated);
            };

            Stage3DProxy.prototype.notifyEnterFrame = function () {
                if (!this._enterFrame) {
                    this._enterFrame = new away.events.Event(away.events.Event.ENTER_FRAME);
                }

                this.dispatchEvent(this._enterFrame);
            };

            Stage3DProxy.prototype.notifyExitFrame = function () {
                if (!this._exitFrame)
                    this._exitFrame = new away.events.Event(away.events.Event.EXIT_FRAME);

                this.dispatchEvent(this._exitFrame);
            };

            Object.defineProperty(Stage3DProxy.prototype, "profile", {
                get: function () {
                    return this._profile;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Disposes the Stage3DProxy object, freeing the Context3D attached to the Stage3D.
            */
            Stage3DProxy.prototype.dispose = function () {
                this._stage3DManager.iRemoveStage3DProxy(this);
                this._stage3D.removeEventListener(away.events.Event.CONTEXT3D_CREATE, this.onContext3DUpdate, this);
                this.freeContext3D();
                this._stage3D = null;
                this._stage3DManager = null;
                this._iStage3DIndex = -1;
            };

            /**
            * Configures the back buffer associated with the Stage3D object.
            * @param backBufferWidth The width of the backbuffer.
            * @param backBufferHeight The height of the backbuffer.
            * @param antiAlias The amount of anti-aliasing to use.
            * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
            */
            Stage3DProxy.prototype.configureBackBuffer = function (backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil) {
                var oldWidth = this._backBufferWidth;
                var oldHeight = this._backBufferHeight;

                this._backBufferWidth = this._viewPort.width = backBufferWidth;
                this._backBufferHeight = this._viewPort.height = backBufferHeight;

                if (oldWidth != this._backBufferWidth || oldHeight != this._backBufferHeight)
                    this.notifyViewportUpdated();

                this._antiAlias = antiAlias;
                this._enableDepthAndStencil = enableDepthAndStencil;

                if (this._iContext3D)
                    this._iContext3D.configureBackBuffer(backBufferWidth, backBufferHeight, antiAlias, enableDepthAndStencil);
            };

            Object.defineProperty(Stage3DProxy.prototype, "enableDepthAndStencil", {
                get: /*
                * Indicates whether the depth and stencil buffer is used
                */
                function () {
                    return this._enableDepthAndStencil;
                },
                set: function (enableDepthAndStencil) {
                    this._enableDepthAndStencil = enableDepthAndStencil;
                    this._backBufferDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "renderTarget", {
                get: function () {
                    return this._renderTarget;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "renderSurfaceSelector", {
                get: function () {
                    return this._renderSurfaceSelector;
                },
                enumerable: true,
                configurable: true
            });

            Stage3DProxy.prototype.setRenderTarget = function (target, enableDepthAndStencil, surfaceSelector) {
                if (typeof enableDepthAndStencil === "undefined") { enableDepthAndStencil = false; }
                if (typeof surfaceSelector === "undefined") { surfaceSelector = 0; }
                if (this._renderTarget == target && surfaceSelector == this._renderSurfaceSelector && this._enableDepthAndStencil == enableDepthAndStencil) {
                    return;
                }

                this._renderTarget = target;
                this._renderSurfaceSelector = surfaceSelector;
                this._enableDepthAndStencil = enableDepthAndStencil;

                away.Debug.throwPIR('Stage3DProxy', 'setRenderTarget', 'away.display3D.Context3D: setRenderToTexture , setRenderToBackBuffer');
            };

            /*
            * Clear and reset the back buffer when using a shared context
            */
            Stage3DProxy.prototype.clear = function () {
                if (!this._iContext3D)
                    return;

                if (this._backBufferDirty) {
                    this.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);
                    this._backBufferDirty = false;
                }

                this._iContext3D.clear((this._color & 0xff000000) >>> 24, (this._color & 0xff0000) >>> 16, (this._color & 0xff00) >>> 8, this._color & 0xff);

                /*
                this._iContext3D.clear(
                ((this._color >> 16) & 0xff)/255.0,
                ((this._color >> 8) & 0xff)/255.0,
                (this._color & 0xff)/255.0,
                ((this._color >> 24) & 0xff)/255.0);
                */
                this._bufferClear = true;
            };

            /*
            * Display the back rendering buffer
            */
            Stage3DProxy.prototype.present = function () {
                if (!this._iContext3D)
                    return;

                this._iContext3D.present();

                this._activeProgram3D = null;

                if (this._mouse3DManager)
                    this._mouse3DManager.fireMouseEvents();
            };

            /**
            * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an event. Special case for enterframe and exitframe events - will switch Stage3DProxy into automatic render mode.
            * You can register event listeners on all nodes in the display list for a specific type of event, phase, and priority.
            *
            * @param type The type of event.
            * @param listener The listener function that processes the event.
            * @param useCapture Determines whether the listener works in the capture phase or the target and bubbling phases. If useCapture is set to true, the listener processes the event only during the capture phase and not in the target or bubbling phase. If useCapture is false, the listener processes the event only during the target or bubbling phase. To listen for the event in all three phases, call addEventListener twice, once with useCapture set to true, then again with useCapture set to false.
            * @param priority The priority level of the event listener. The priority is designated by a signed 32-bit integer. The higher the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1. If two or more listeners share the same priority, they are processed in the order in which they were added. The default priority is 0.
            * @param useWeakReference Determines whether the reference to the listener is strong or weak. A strong reference (the default) prevents your listener from being garbage-collected. A weak reference does not.
            */
            //public override function addEventListener(type:string, listener, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false)
            Stage3DProxy.prototype.addEventListener = function (type, listener, target) {
                _super.prototype.addEventListener.call(this, type, listener, target);

                away.Debug.throwPIR('Stage3DProxy', 'addEventListener', 'EnterFrame, ExitFrame');

                if ((type == away.events.Event.ENTER_FRAME || type == away.events.Event.EXIT_FRAME)) {
                }
            };

            /**
            * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch Stage3DProxy out of automatic render mode.
            * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
            *
            * @param type The type of event.
            * @param listener The listener object to remove.
            * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
            */
            Stage3DProxy.prototype.removeEventListener = function (type, listener, target) {
                _super.prototype.removeEventListener.call(this, type, listener, target);

                away.Debug.throwPIR('Stage3DProxy', 'removeEventListener', 'EnterFrame, ExitFrame');

                if (!this.hasEventListener(away.events.Event.ENTER_FRAME, this.onEnterFrame, this) && !this.hasEventListener(away.events.Event.EXIT_FRAME, this.onEnterFrame, this)) {
                }
            };

            Object.defineProperty(Stage3DProxy.prototype, "scissorRect", {
                get: function () {
                    return this._scissorRect;
                },
                set: function (value) {
                    this._scissorRect = value;
                    this._iContext3D.setScissorRectangle(this._scissorRect);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "stage3DIndex", {
                get: /**
                * The index of the Stage3D which is managed by this instance of Stage3DProxy.
                */
                function () {
                    return this._iStage3DIndex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "stage3D", {
                get: /**
                * The base Stage3D object associated with this proxy.
                */
                function () {
                    return this._stage3D;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "context3D", {
                get: /**
                * The Context3D object associated with the given Stage3D object.
                */
                function () {
                    return this._iContext3D;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "driverInfo", {
                get: /**
                * The driver information as reported by the Context3D object (if any)
                */
                function () {
                    away.Debug.throwPIR('Stage3DProxy', 'driverInfo', 'Context3D.driverInfo()');

                    return null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "usesSoftwareRendering", {
                get: /**
                * Indicates whether the Stage3D managed by this proxy is running in software mode.
                * Remember to wait for the CONTEXT3D_CREATED event before checking this property,
                * as only then will it be guaranteed to be accurate.
                */
                function () {
                    return this._usesSoftwareRendering;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "x", {
                get: /**
                * The x position of the Stage3D.
                */
                function () {
                    away.Debug.throwPIR('Stage3DProxy', 'get x', 'Stage3D.x');

                    return 0;
                },
                set: function (value) {
                    away.Debug.throwPIR('Stage3DProxy', 'set x', 'Stage3D.x');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "y", {
                get: /**
                * The y position of the Stage3D.
                */
                function () {
                    away.Debug.throwPIR('Stage3DProxy', 'get x', 'Stage3D.y');
                    return 0;
                },
                set: function (value) {
                    away.Debug.throwPIR('Stage3DProxy', 'set x', 'Stage3D.y');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "width", {
                get: /**
                * The width of the Stage3D.
                */
                function () {
                    return this._backBufferWidth;
                },
                set: function (width) {
                    if (this._viewPort.width == width)
                        return;

                    this._backBufferWidth = this._viewPort.width = width;
                    this._backBufferDirty = true;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "height", {
                get: /**
                * The height of the Stage3D.
                */
                function () {
                    return this._backBufferHeight;
                },
                set: function (height) {
                    if (this._viewPort.height == height)
                        return;

                    this._backBufferHeight = this._viewPort.height = height;
                    this._backBufferDirty = true;

                    this.notifyViewportUpdated();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "antiAlias", {
                get: /**
                * The antiAliasing of the Stage3D.
                */
                function () {
                    return this._antiAlias;
                },
                set: function (antiAlias) {
                    this._antiAlias = antiAlias;
                    this._backBufferDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "viewPort", {
                get: /**
                * A viewPort rectangle equivalent of the Stage3D size and position.
                */
                function () {
                    this._viewportDirty = false;

                    return this._viewPort;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DProxy.prototype, "color", {
                get: /**
                * The background color of the Stage3D.
                */
                function () {
                    return this._color;
                },
                set: function (color) {
                    this._color = color;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "visible", {
                get: /**
                * The visibility of the Stage3D.
                */
                function () {
                    away.Debug.throwPIR('Stage3DProxy', 'get visible', 'Stage3D.visible');
                    return null;
                },
                set: function (value) {
                    away.Debug.throwPIR('Stage3DProxy', 'set visible', 'Stage3D.visible');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "bufferClear", {
                get: /**
                * The freshly cleared state of the backbuffer before any rendering
                */
                function () {
                    return this._bufferClear;
                },
                set: function (newBufferClear) {
                    this._bufferClear = newBufferClear;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Stage3DProxy.prototype, "mouse3DManager", {
                get: /*
                * Access to fire mouseevents across multiple layered view3D instances
                */
                function () {
                    return this._mouse3DManager;
                },
                set: function (value) {
                    this._mouse3DManager = value;
                },
                enumerable: true,
                configurable: true
            });


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
            * Frees the Context3D associated with this Stage3DProxy.
            */
            Stage3DProxy.prototype.freeContext3D = function () {
                if (this._iContext3D) {
                    away.Debug.throwPIR('Stage3DProxy', 'freeContext3D', 'Context3D.dispose()');

                    //this._context3D.dispose();
                    this.dispatchEvent(new away.events.Stage3DEvent(away.events.Stage3DEvent.CONTEXT3D_DISPOSED));
                }

                this._iContext3D = null;
            };

            /*
            * Called whenever the Context3D is retrieved or lost.
            * @param event The event dispatched.
            */
            Stage3DProxy.prototype.onContext3DUpdate = function (event) {
                if (this._stage3D.context3D) {
                    var hadContext = (this._iContext3D != null);
                    this._iContext3D = this._stage3D.context3D;

                    away.Debug.log('Stage3DProxy', 'onContext3DUpdate this._stage3D.context3D: ', this._stage3D.context3D);

                    // todo: implement dependency Context3D.enableErrorChecking, Context3D.driverInfo
                    away.Debug.throwPIR('Stage3DProxy', 'onContext3DUpdate', 'Context3D.enableErrorChecking, Context3D.driverInfo');

                    if (this._backBufferWidth && this._backBufferHeight) {
                        this._iContext3D.configureBackBuffer(this._backBufferWidth, this._backBufferHeight, this._antiAlias, this._enableDepthAndStencil);
                    }

                    // Dispatch the appropriate event depending on whether context was
                    // created for the first time or recreated after a device loss.
                    this.dispatchEvent(new away.events.Stage3DEvent(hadContext ? away.events.Stage3DEvent.CONTEXT3D_RECREATED : away.events.Stage3DEvent.CONTEXT3D_CREATED));
                } else {
                    throw new Error("Rendering context lost!");
                }
            };

            /**
            * Requests a Context3D object to attach to the managed Stage3D.
            */
            Stage3DProxy.prototype.requestContext = function (forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                if (this._usesSoftwareRendering != null) {
                    this._usesSoftwareRendering = forceSoftware;
                }

                this._profile = profile;

                // Updated to work with current JS <> AS3 Display3D System
                this._stage3D.requestContext();

                // Throw PartialImplementationError to flag this function as changed
                away.Debug.throwPIR('Stage3DProxy', 'requestContext', 'Context3DRenderMode');
            };

            /**
            * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
            * Typically the proxy.ENTER_FRAME listener would render the layers for this Stage3D instance.
            */
            Stage3DProxy.prototype.onEnterFrame = function (event) {
                if (!this._iContext3D) {
                    return;
                }

                // Clear the stage3D instance
                this.clear();

                //notify the enterframe listeners
                this.notifyEnterFrame();

                // Call the present() to render the frame
                this.present();

                //notify the exitframe listeners
                this.notifyExitFrame();
            };

            Stage3DProxy.prototype.recoverFromDisposal = function () {
                if (!this._iContext3D) {
                    return false;
                }

                away.Debug.throwPIR('Stage3DProxy', 'recoverFromDisposal', 'Context3D.driverInfo');

                /*
                if (this._iContext3D.driverInfo == "Disposed")
                {
                this._iContext3D = null;
                this.dispatchEvent(new away.events.Stage3DEvent(away.events.Stage3DEvent.CONTEXT3D_DISPOSED));
                return false;
                
                }
                */
                return true;
            };

            Stage3DProxy.prototype.clearDepthBuffer = function () {
                if (!this._iContext3D) {
                    return;
                }

                this._iContext3D.clear(0, 0, 0, 1, 1, 0, away.display3D.Context3DClearMask.DEPTH);
            };
            return Stage3DProxy;
        })(away.events.EventDispatcher);
        managers.Stage3DProxy = Stage3DProxy;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (display) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage(width, height) {
                if (typeof width === "undefined") { width = 640; }
                if (typeof height === "undefined") { height = 480; }
                _super.call(this);
                if (!document) {
                    throw new away.errors.DocumentError("A root document object does not exist.");
                }

                this.initStage3DObjects();
                this.resize(width, height);
            }
            Stage.prototype.resize = function (width, height) {
                this._stageHeight = height;
                this._stageWidth = width;

                for (var i = 0; i < Stage.STAGE3D_MAX_QUANTITY; ++i) {
                    away.utils.CSS.setCanvasSize(this.stage3Ds[i].canvas, width, height);
                    away.utils.CSS.setCanvasPosition(this.stage3Ds[i].canvas, 0, 0, true);
                }
                this.dispatchEvent(new away.events.Event(away.events.Event.RESIZE));
            };

            Stage.prototype.getStage3DAt = function (index) {
                if (0 <= index && index < Stage.STAGE3D_MAX_QUANTITY) {
                    return this.stage3Ds[index];
                }
                throw new away.errors.ArgumentError("Index is out of bounds [0.." + Stage.STAGE3D_MAX_QUANTITY + "]");
            };

            Stage.prototype.initStage3DObjects = function () {
                this.stage3Ds = [];
                for (var i = 0; i < Stage.STAGE3D_MAX_QUANTITY; ++i) {
                    var canvas = this.createHTMLCanvasElement();
                    this.addChildHTMLElement(canvas);
                    this.stage3Ds.push(new away.display.Stage3D(canvas));
                }
            };

            Stage.prototype.createHTMLCanvasElement = function () {
                return document.createElement("canvas");
            };

            Stage.prototype.addChildHTMLElement = function (canvas) {
                document.body.appendChild(canvas);
            };
            Stage.STAGE3D_MAX_QUANTITY = 8;
            return Stage;
        })(away.events.EventDispatcher);
        display.Stage = Stage;
    })(away.display || (away.display = {}));
    var display = away.display;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    // Reference note: http://www.w3schools.com/jsref/dom_obj_event.asp
    (function (managers) {
        //import away3d.arcane;
        //import away3d.containers.ObjectContainer3D;
        //import away3d.containers.View3D;
        //import away3d.core.pick.IPicker;
        //import away3d.core.pick.PickingCollisionVO;
        //import away3d.core.pick.PickingType;
        //import away3d.events.MouseEvent3D;
        //import flash.display.DisplayObject;
        //import flash.display.DisplayObjectContainer;
        //import flash.display.Stage;
        //import flash.events.MouseEvent;
        //import flash.geom.Vector3D;
        //import flash.utils.Dictionary;
        //use namespace arcane;
        /**
        * Mouse3DManager enforces a singleton pattern and is not intended to be instanced.
        * it provides a manager class for detecting 3D mouse hits on View3D objects and sending out 3D mouse events.
        */
        var Mouse3DManager = (function () {
            /**
            * Creates a new <code>Mouse3DManager</code> object.
            */
            function Mouse3DManager() {
                this._updateDirty = true;
                this._nullVector = new away.geom.Vector3D();
                this._mousePicker = away.pick.PickingType.RAYCAST_FIRST_ENCOUNTERED;
                this._childDepth = 0;
                if (!Mouse3DManager._view3Ds) {
                    Mouse3DManager._view3Ds = new Object();
                    Mouse3DManager._view3DLookup = new Array();
                }
            }
            // ---------------------------------------------------------------------
            // Interface.
            // ---------------------------------------------------------------------
            // TODO: required dependency stage3DProxy
            Mouse3DManager.prototype.updateCollider = function (view) {
                throw new away.errors.PartialImplementationError('stage3DProxy');
            };

            Mouse3DManager.prototype.fireMouseEvents = function () {
                throw new away.errors.PartialImplementationError('View3D().layeredView');
            };

            Mouse3DManager.prototype.addViewLayer = function (view) {
                throw new away.errors.PartialImplementationError('Stage3DProxy, Stage, DisplayObjectContainer ( as3 / native ) ');
            };

            Mouse3DManager.prototype.enableMouseListeners = function (view) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.disableMouseListeners = function (view) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.dispose = function () {
                this._mousePicker.dispose();
            };

            // ---------------------------------------------------------------------
            // Private.
            // ---------------------------------------------------------------------
            Mouse3DManager.prototype.queueDispatch = function (event, sourceEvent, collider) {
                if (typeof collider === "undefined") { collider = null; }
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.reThrowEvent = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent - AS3 <> JS Conversion');
            };

            Mouse3DManager.prototype.hasKey = function (view) {
                for (var v in Mouse3DManager._view3Ds) {
                    if (v === view) {
                        return true;
                    }
                }

                return false;
            };

            Mouse3DManager.prototype.traverseDisplayObjects = function (container) {
                throw new away.errors.PartialImplementationError('DisplayObjectContainer ( as3 / native ) as3 <> JS Conversion');
            };

            // ---------------------------------------------------------------------
            // Listeners.
            // ---------------------------------------------------------------------
            Mouse3DManager.prototype.onMouseMove = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.onMouseOut = function (event) {
                this._activeView = null;

                if (Mouse3DManager._pCollidingObject) {
                    this.queueDispatch(Mouse3DManager._mouseOut, event, Mouse3DManager._pCollidingObject);
                }

                this._updateDirty = true;

                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.onMouseOver = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.onClick = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.onDoubleClick = function (event) {
                if (Mouse3DManager._pCollidingObject) {
                    this.queueDispatch(Mouse3DManager._mouseDoubleClick, event);
                } else {
                    this.reThrowEvent(event);
                }

                this._updateDirty = true;
            };

            Mouse3DManager.prototype.onMouseDown = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.onMouseUp = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Mouse3DManager.prototype.onMouseWheel = function (event) {
                throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
            };

            Object.defineProperty(Mouse3DManager.prototype, "forceMouseMove", {
                get: // ---------------------------------------------------------------------
                // Getters & setters.
                // ---------------------------------------------------------------------
                function () {
                    return this._forceMouseMove;
                },
                set: function (value) {
                    this._forceMouseMove = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Mouse3DManager.prototype, "mousePicker", {
                get: function () {
                    return this._mousePicker;
                },
                set: function (value) {
                    this._mousePicker = value;
                },
                enumerable: true,
                configurable: true
            });

            Mouse3DManager._viewCount = 0;

            Mouse3DManager._queuedEvents = new Array();

            Mouse3DManager._mouseUp = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_UP);
            Mouse3DManager._mouseClick = new away.events.MouseEvent3D(away.events.MouseEvent3D.CLICK);
            Mouse3DManager._mouseOut = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_OUT);
            Mouse3DManager._mouseDown = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_DOWN);
            Mouse3DManager._mouseMove = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_MOVE);
            Mouse3DManager._mouseOver = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_OVER);
            Mouse3DManager._mouseWheel = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_WHEEL);
            Mouse3DManager._mouseDoubleClick = new away.events.MouseEvent3D(away.events.MouseEvent3D.DOUBLE_CLICK);

            Mouse3DManager._previousCollidingView = -1;
            Mouse3DManager._collidingView = -1;
            return Mouse3DManager;
        })();
        managers.Mouse3DManager = Mouse3DManager;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (events) {
        //import flash.events.Event;
        var Stage3DEvent = (function (_super) {
            __extends(Stage3DEvent, _super);
            function Stage3DEvent(type) {
                _super.call(this, type);
            }
            Stage3DEvent.CONTEXT3D_CREATED = "Context3DCreated";
            Stage3DEvent.CONTEXT3D_DISPOSED = "Context3DDisposed";
            Stage3DEvent.CONTEXT3D_RECREATED = "Context3DRecreated";
            Stage3DEvent.VIEWPORT_UPDATED = "ViewportUpdated";
            return Stage3DEvent;
        })(events.Event);
        events.Stage3DEvent = Stage3DEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (managers) {
        //import away3d.arcane;
        //import flash.display.Stage;
        //import flash.utils.Dictionary;
        //use namespace arcane;
        /**
        * The Stage3DManager class provides a multiton object that handles management for Stage3D objects. Stage3D objects
        * should not be requested directly, but are exposed by a Stage3DProxy.
        *
        * @see away3d.core.managers.Stage3DProxy
        */
        var Stage3DManager = (function () {
            /**
            * Creates a new Stage3DManager class.
            * @param stage The Stage object that contains the Stage3D objects to be managed.
            * @private
            */
            function Stage3DManager(stage, Stage3DManagerSingletonEnforcer) {
                if (!Stage3DManagerSingletonEnforcer) {
                    throw new Error("This class is a multiton and cannot be instantiated manually. Use Stage3DManager.getInstance instead.");
                }

                this._stage = stage;

                if (!Stage3DManager._stageProxies) {
                    Stage3DManager._stageProxies = new Array(this._stage.stage3Ds.length);
                }
            }
            Stage3DManager.getInstance = /**
            * Gets a Stage3DManager instance for the given Stage object.
            * @param stage The Stage object that contains the Stage3D objects to be managed.
            * @return The Stage3DManager instance for the given Stage object.
            */
            function (stage) {
                var stage3dManager = Stage3DManager.getStage3DManagerByStageRef(stage);

                if (stage3dManager == null) {
                    stage3dManager = new away.managers.Stage3DManager(stage, new Stage3DManagerSingletonEnforcer());

                    var stageInstanceData = new Stage3DManagerInstanceData();
                    stageInstanceData.stage = stage;
                    stageInstanceData.stage3DManager = stage3dManager;

                    Stage3DManager._instances.push(stageInstanceData);
                }

                return stage3dManager;
            };

            Stage3DManager.getStage3DManagerByStageRef = /**
            *
            * @param stage
            * @returns {  away.managers.Stage3DManager }
            * @constructor
            */
            function (stage) {
                if (Stage3DManager._instances == null) {
                    Stage3DManager._instances = new Array();
                }

                var l = Stage3DManager._instances.length;
                var s;

                for (var c = 0; c < l; c++) {
                    s = Stage3DManager._instances[c];

                    if (s.stage == stage) {
                        return s.stage3DManager;
                    }
                }

                return null;
            };

            /**
            * Requests the Stage3DProxy for the given index.
            * @param index The index of the requested Stage3D.
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            * @param profile The compatibility profile, an enumeration of Context3DProfile
            * @return The Stage3DProxy for the given index.
            */
            Stage3DManager.prototype.getStage3DProxy = function (index, forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                if (!Stage3DManager._stageProxies[index]) {
                    Stage3DManager._numStageProxies++;
                    Stage3DManager._stageProxies[index] = new away.managers.Stage3DProxy(index, this._stage.stage3Ds[index], this, forceSoftware, profile);
                }

                return Stage3DManager._stageProxies[index];
            };

            /**
            * Removes a Stage3DProxy from the manager.
            * @param stage3DProxy
            * @private
            */
            Stage3DManager.prototype.iRemoveStage3DProxy = function (stage3DProxy) {
                Stage3DManager._numStageProxies--;
                Stage3DManager._stageProxies[stage3DProxy._iStage3DIndex] = null;
            };

            /**
            * Get the next available stage3DProxy. An error is thrown if there are no Stage3DProxies available
            * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
            * @param profile The compatibility profile, an enumeration of Context3DProfile
            * @return The allocated stage3DProxy
            */
            Stage3DManager.prototype.getFreeStage3DProxy = function (forceSoftware, profile) {
                if (typeof forceSoftware === "undefined") { forceSoftware = false; }
                if (typeof profile === "undefined") { profile = "baseline"; }
                var i;
                var len = Stage3DManager._stageProxies.length;

                while (i < len) {
                    if (!Stage3DManager._stageProxies[i]) {
                        this.getStage3DProxy(i, forceSoftware, profile);

                        away.Debug.throwPIR('Stage3DManager', 'getFreeStage3DProxy', 'Stage.stageWidth , Stage.stageHeight ');

                        //throw new away.errors.PartialImplementationError( 'Stage.stageWidth , Stage.stageHeight ');
                        //Stage3DManager._stageProxies[i].width = this._stage.stageWidth;
                        //Stage3DManager._stageProxies[i].height = this._stage.stageHeight;
                        return Stage3DManager._stageProxies[i];
                    }

                    ++i;
                }

                throw new Error("Too many Stage3D instances used!");
                return null;
            };

            Object.defineProperty(Stage3DManager.prototype, "hasFreeStage3DProxy", {
                get: /**
                * Checks if a new stage3DProxy can be created and managed by the class.
                * @return true if there is one slot free for a new stage3DProxy
                */
                function () {
                    return Stage3DManager._numStageProxies < Stage3DManager._stageProxies.length ? true : false;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DManager.prototype, "numProxySlotsFree", {
                get: /**
                * Returns the amount of stage3DProxy objects that can be created and managed by the class
                * @return the amount of free slots
                */
                function () {
                    return Stage3DManager._stageProxies.length - Stage3DManager._numStageProxies;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DManager.prototype, "numProxySlotsUsed", {
                get: /**
                * Returns the amount of Stage3DProxy objects currently managed by the class.
                * @return the amount of slots used
                */
                function () {
                    return Stage3DManager._numStageProxies;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Stage3DManager.prototype, "numProxySlotsTotal", {
                get: /**
                * Returns the maximum amount of Stage3DProxy objects that can be managed by the class
                * @return the maximum amount of Stage3DProxy objects that can be managed by the class
                */
                function () {
                    return Stage3DManager._stageProxies.length;
                },
                enumerable: true,
                configurable: true
            });
            Stage3DManager._numStageProxies = 0;
            return Stage3DManager;
        })();
        managers.Stage3DManager = Stage3DManager;
    })(away.managers || (away.managers = {}));
    var managers = away.managers;
})(away || (away = {}));

var Stage3DManagerInstanceData = (function () {
    function Stage3DManagerInstanceData() {
    }
    return Stage3DManagerInstanceData;
})();

var Stage3DManagerSingletonEnforcer = (function () {
    function Stage3DManagerSingletonEnforcer() {
    }
    return Stage3DManagerSingletonEnforcer;
})();
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
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
    ///<reference path="../_definitions.ts"/>
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts"/>
    (function (utils) {
        var PerspectiveMatrix3D = (function (_super) {
            __extends(PerspectiveMatrix3D, _super);
            function PerspectiveMatrix3D(v) {
                if (typeof v === "undefined") { v = null; }
                _super.call(this, v);
            }
            PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
                var yScale = 1 / Math.tan(fieldOfViewY / 2);
                var xScale = yScale / aspectRatio;
                this.copyRawDataFrom([
                    xScale,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    yScale,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    zFar / (zFar - zNear),
                    1.0,
                    0.0,
                    0.0,
                    (zNear * zFar) / (zNear - zFar),
                    0.0
                ]);
            };
            return PerspectiveMatrix3D;
        })(away.geom.Matrix3D);
        utils.PerspectiveMatrix3D = PerspectiveMatrix3D;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
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
                get: // Get / Set
                /**
                *
                * @returns {boolean}
                */
                function () {
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
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    var Debug = (function () {
        function Debug() {
        }
        Debug.throwPIR = function (clss, fnc, msg) {
            Debug.logPIR('PartialImplementationError ' + clss, fnc, msg);

            if (Debug.THROW_ERRORS) {
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
        return Debug;
    })();
    away.Debug = Debug;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts" />
    (function (base) {
        var SubGeometryBase = (function () {
            function SubGeometryBase() {
                this._faceNormalsDirty = true;
                this._faceTangentsDirty = true;
                this._indexBuffer = new Array(8);
                this._indexBufferContext = new Array(8);
                this._indicesInvalid = new Array(8);
                this._autoDeriveVertexNormals = true;
                this._autoDeriveVertexTangents = true;
                this._autoGenerateUVs = false;
                this._useFaceWeights = false;
                this._vertexNormalsDirty = true;
                this._vertexTangentsDirty = true;
                this._scaleU = 1;
                this._scaleV = 1;
                this._uvsDirty = true;
            }
            Object.defineProperty(SubGeometryBase.prototype, "autoGenerateDummyUVs", {
                get: /**
                * Defines whether a UV buffer should be automatically generated to contain dummy UV coordinates.
                * Set to true if a geometry lacks UV data but uses a material that requires it, or leave as false
                * in cases where UV data is explicitly defined or the material does not require UV data.
                */
                function () {
                    return this._autoGenerateUVs;
                },
                set: function (value) {
                    this._autoGenerateUVs = value;
                    this._uvsDirty = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubGeometryBase.prototype, "autoDeriveVertexNormals", {
                get: /**
                * True if the vertex normals should be derived from the geometry, false if the vertex normals are set
                * explicitly.
                */
                function () {
                    return this._autoDeriveVertexNormals;
                },
                set: function (value) {
                    this._autoDeriveVertexNormals = value;
                    this._vertexNormalsDirty = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubGeometryBase.prototype, "useFaceWeights", {
                get: /**
                * Indicates whether or not to take the size of faces into account when auto-deriving vertex normals and tangents.
                */
                function () {
                    return this._useFaceWeights;
                },
                set: function (value) {
                    this._useFaceWeights = value;

                    if (this._autoDeriveVertexNormals) {
                        this._vertexNormalsDirty = true;
                    }

                    if (this._autoDeriveVertexTangents) {
                        this._vertexTangentsDirty = true;
                    }

                    this._faceNormalsDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubGeometryBase.prototype, "numTriangles", {
                get: /**
                * The total amount of triangles in the SubGeometry.
                */
                function () {
                    return this._numTriangles;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Retrieves the VertexBuffer3D object that contains triangle indices.
            * @param context The Context3D for which we request the buffer
            * @return The VertexBuffer3D object that contains triangle indices.
            */
            SubGeometryBase.prototype.getIndexBuffer = function (stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (!this._indexBuffer[contextIndex] || this._indexBufferContext[contextIndex] != context) {
                    this._indexBuffer[contextIndex] = context.createIndexBuffer(this._numIndices);
                    this._indexBufferContext[contextIndex] = context;
                    this._indicesInvalid[contextIndex] = true;
                }

                if (this._indicesInvalid[contextIndex]) {
                    this._indexBuffer[contextIndex].uploadFromArray(this._indices, 0, this._numIndices);
                    this._indicesInvalid[contextIndex] = false;
                }

                return this._indexBuffer[contextIndex];
            };

            /**
            * Updates the tangents for each face.
            */
            SubGeometryBase.prototype.pUpdateFaceTangents = function () {
                var i;
                var index1, index2, index3;
                var len = this._indices.length;
                var ui, vi;
                var v0;
                var dv1, dv2;
                var denom;
                var x0, y0, z0;
                var dx1, dy1, dz1;
                var dx2, dy2, dz2;
                var cx, cy, cz;
                var vertices = this._vertexData;
                var uvs = this.UVData;
                var posStride = this.vertexStride;
                var posOffset = this.vertexOffset;
                var texStride = this.UVStride;
                var texOffset = this.UVOffset;

                if (this._faceTangents == null) {
                    this._faceTangents = new Array(this._indices.length);
                }

                while (i < len) {
                    index1 = this._indices[i];
                    index2 = this._indices[i + 1];
                    index3 = this._indices[i + 2];

                    ui = texOffset + index1 * texStride + 1;
                    v0 = uvs[ui];
                    ui = texOffset + index2 * texStride + 1;
                    dv1 = uvs[ui] - v0;
                    ui = texOffset + index3 * texStride + 1;
                    dv2 = uvs[ui] - v0;

                    vi = posOffset + index1 * posStride;
                    x0 = vertices[vi];
                    y0 = vertices[(vi + 1)];
                    z0 = vertices[(vi + 2)];
                    vi = posOffset + index2 * posStride;
                    dx1 = vertices[(vi)] - x0;
                    dy1 = vertices[(vi + 1)] - y0;
                    dz1 = vertices[(vi + 2)] - z0;
                    vi = posOffset + index3 * posStride;
                    dx2 = vertices[(vi)] - x0;
                    dy2 = vertices[(vi + 1)] - y0;
                    dz2 = vertices[(vi + 2)] - z0;

                    cx = dv2 * dx1 - dv1 * dx2;
                    cy = dv2 * dy1 - dv1 * dy2;
                    cz = dv2 * dz1 - dv1 * dz2;
                    denom = 1 / Math.sqrt(cx * cx + cy * cy + cz * cz);

                    this._faceTangents[i++] = denom * cx;
                    this._faceTangents[i++] = denom * cy;
                    this._faceTangents[i++] = denom * cz;
                }

                this._faceTangentsDirty = false;
            };

            /**
            * Updates the normals for each face.
            */
            SubGeometryBase.prototype.updateFaceNormals = function () {
                var i, j, k;
                var index;
                var len = this._indices.length;
                var x1, x2, x3;
                var y1, y2, y3;
                var z1, z2, z3;
                var dx1, dy1, dz1;
                var dx2, dy2, dz2;
                var cx, cy, cz;
                var d;
                var vertices = this._vertexData;
                var posStride = this.vertexStride;
                var posOffset = this.vertexOffset;

                if (this._faceNormals == null) {
                    this._faceNormals = new Array(len);
                }

                if (this._useFaceWeights) {
                    if (this._faceWeights == null) {
                        this._faceWeights = new Array(len / 3);
                    }
                }

                while (i < len) {
                    index = posOffset + this._indices[i++] * posStride;
                    x1 = vertices[index];
                    y1 = vertices[index + 1];
                    z1 = vertices[index + 2];
                    index = posOffset + this._indices[i++] * posStride;
                    x2 = vertices[index];
                    y2 = vertices[index + 1];
                    z2 = vertices[index + 2];
                    index = posOffset + this._indices[i++] * posStride;
                    x3 = vertices[index];
                    y3 = vertices[index + 1];
                    z3 = vertices[index + 2];
                    dx1 = x3 - x1;
                    dy1 = y3 - y1;
                    dz1 = z3 - z1;
                    dx2 = x2 - x1;
                    dy2 = y2 - y1;
                    dz2 = z2 - z1;
                    cx = dz1 * dy2 - dy1 * dz2;
                    cy = dx1 * dz2 - dz1 * dx2;
                    cz = dy1 * dx2 - dx1 * dy2;
                    d = Math.sqrt(cx * cx + cy * cy + cz * cz);

                    if (this._useFaceWeights) {
                        var w = d * 10000;

                        if (w < 1) {
                            w = 1;
                        }

                        this._faceWeights[k++] = w;
                    }

                    d = 1 / d;

                    this._faceNormals[j++] = cx * d;
                    this._faceNormals[j++] = cy * d;
                    this._faceNormals[j++] = cz * d;
                }

                this._faceNormalsDirty = false;
            };

            /**
            * Updates the vertex normals based on the geometry.
            */
            SubGeometryBase.prototype.pUpdateVertexNormals = function (target) {
                if (this._faceNormalsDirty) {
                    this.updateFaceNormals();
                }

                var v1;
                var f1 = 0, f2 = 1, f3 = 2;
                var lenV = this._vertexData.length;
                var normalStride = this.vertexNormalStride;
                var normalOffset = this.vertexNormalOffset;

                if (target == null) {
                    target = new Array(lenV);
                }

                v1 = normalOffset;

                while (v1 < lenV) {
                    target[v1] = 0.0;
                    target[v1 + 1] = 0.0;
                    target[v1 + 2] = 0.0;
                    v1 += normalStride;
                }

                var i, k;
                var lenI = this._indices.length;
                var index;
                var weight;

                while (i < lenI) {
                    weight = this._useFaceWeights ? this._faceWeights[k++] : 1;
                    index = normalOffset + this._indices[i++] * normalStride;
                    target[index++] += this._faceNormals[f1] * weight;
                    target[index++] += this._faceNormals[f2] * weight;
                    target[index] += this._faceNormals[f3] * weight;
                    index = normalOffset + this._indices[i++] * normalStride;
                    target[index++] += this._faceNormals[f1] * weight;
                    target[index++] += this._faceNormals[f2] * weight;
                    target[index] += this._faceNormals[f3] * weight;
                    index = normalOffset + this._indices[i++] * normalStride;
                    target[index++] += this._faceNormals[f1] * weight;
                    target[index++] += this._faceNormals[f2] * weight;
                    target[index] += this._faceNormals[f3] * weight;
                    f1 += 3;
                    f2 += 3;
                    f3 += 3;
                }

                v1 = normalOffset;
                while (v1 < lenV) {
                    var vx = target[v1];
                    var vy = target[v1 + 1];
                    var vz = target[v1 + 2];
                    var d = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
                    target[v1] = vx * d;
                    target[v1 + 1] = vy * d;
                    target[v1 + 2] = vz * d;
                    v1 += normalStride;
                }

                this._vertexNormalsDirty = false;

                return target;
            };

            /**
            * Updates the vertex tangents based on the geometry.
            */
            SubGeometryBase.prototype.pUpdateVertexTangents = function (target) {
                if (this._faceTangentsDirty) {
                    this.pUpdateFaceTangents();
                }

                var i;
                var lenV = this._vertexData.length;
                var tangentStride = this.vertexTangentStride;
                var tangentOffset = this.vertexTangentOffset;

                if (target == null) {
                    target = new Array(lenV);
                }

                i = tangentOffset;

                while (i < lenV) {
                    target[i] = 0.0;
                    target[i + 1] = 0.0;
                    target[i + 2] = 0.0;
                    i += tangentStride;
                }

                var k;
                var lenI = this._indices.length;
                var index;
                var weight;
                var f1 = 0, f2 = 1, f3 = 2;

                i = 0;

                while (i < lenI) {
                    weight = this._useFaceWeights ? this._faceWeights[k++] : 1;
                    index = tangentOffset + this._indices[i++] * tangentStride;
                    target[index++] += this._faceTangents[f1] * weight;
                    target[index++] += this._faceTangents[f2] * weight;
                    target[index] += this._faceTangents[f3] * weight;
                    index = tangentOffset + this._indices[i++] * tangentStride;
                    target[index++] += this._faceTangents[f1] * weight;
                    target[index++] += this._faceTangents[f2] * weight;
                    target[index] += this._faceTangents[f3] * weight;
                    index = tangentOffset + this._indices[i++] * tangentStride;
                    target[index++] += this._faceTangents[f1] * weight;
                    target[index++] += this._faceTangents[f2] * weight;
                    target[index] += this._faceTangents[f3] * weight;
                    f1 += 3;
                    f2 += 3;
                    f3 += 3;
                }

                i = tangentOffset;
                while (i < lenV) {
                    var vx = target[i];
                    var vy = target[i + 1];
                    var vz = target[i + 2];
                    var d = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
                    target[i] = vx * d;
                    target[i + 1] = vy * d;
                    target[i + 2] = vz * d;
                    i += tangentStride;
                }

                this._vertexTangentsDirty = false;

                return target;
            };

            SubGeometryBase.prototype.dispose = function () {
                this.pDisposeIndexBuffers(this._indexBuffer);
                this._indices = null;
                this._indexBufferContext = null;
                this._faceNormals = null;
                this._faceWeights = null;
                this._faceTangents = null;
                this._vertexData = null;
            };

            Object.defineProperty(SubGeometryBase.prototype, "indexData", {
                get: /**
                * The raw index data that define the faces.
                *
                * @private
                */
                function () {
                    return this._indices;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the face indices of the SubGeometry.
            * @param indices The face indices to upload.
            */
            SubGeometryBase.prototype.updateIndexData = function (indices/*uint*/ ) {
                this._indices = indices;
                this._numIndices = indices.length;

                var numTriangles = this._numIndices / 3;

                if (this._numTriangles != numTriangles) {
                    this.pDisposeIndexBuffers(this._indexBuffer);
                }

                this._numTriangles = numTriangles;

                this.pInvalidateBuffers(this._indicesInvalid);

                this._faceNormalsDirty = true;

                if (this._autoDeriveVertexNormals) {
                    this._vertexNormalsDirty = true;
                }

                if (this._autoDeriveVertexTangents) {
                    this._vertexTangentsDirty = true;
                }
            };

            /**
            * Disposes all buffers in a given vector.
            * @param buffers The vector of buffers to dispose.
            */
            SubGeometryBase.prototype.pDisposeIndexBuffers = function (buffers) {
                for (var i = 0; i < 8; ++i) {
                    if (buffers[i]) {
                        buffers[i].dispose();
                        buffers[i] = null;
                    }
                }
            };

            /**
            * Disposes all buffers in a given vector.
            * @param buffers The vector of buffers to dispose.
            */
            SubGeometryBase.prototype.pDisposeVertexBuffers = function (buffers) {
                for (var i = 0; i < 8; ++i) {
                    if (buffers[i]) {
                        buffers[i].dispose();
                        buffers[i] = null;
                    }
                }
            };

            Object.defineProperty(SubGeometryBase.prototype, "autoDeriveVertexTangents", {
                get: /**
                * True if the vertex tangents should be derived from the geometry, false if the vertex normals are set
                * explicitly.
                */
                function () {
                    return this._autoDeriveVertexTangents;
                },
                set: function (value) {
                    this._autoDeriveVertexTangents = value;

                    this._vertexTangentsDirty = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubGeometryBase.prototype, "faceNormals", {
                get: /**
                * The raw data of the face normals, in the same order as the faces are listed in the index list.
                *
                * @private
                */
                function () {
                    if (this._faceNormalsDirty) {
                        this.updateFaceNormals();
                    }

                    return this._faceNormals;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Invalidates all buffers in a vector, causing them the update when they are first requested.
            * @param buffers The vector of buffers to invalidate.
            */
            SubGeometryBase.prototype.pInvalidateBuffers = function (invalid) {
                for (var i = 0; i < 8; ++i) {
                    invalid[i] = true;
                }
            };

            Object.defineProperty(SubGeometryBase.prototype, "UVStride", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexData", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexPositionData", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexNormalData", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexTangentData", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "UVData", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexStride", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexNormalStride", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexTangentStride", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexOffset", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexNormalOffset", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "vertexTangentOffset", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "UVOffset", {
                get: function () {
                    throw new away.errors.AbstractMethodError();
                },
                enumerable: true,
                configurable: true
            });

            SubGeometryBase.prototype.pInvalidateBounds = function () {
                if (this._parentGeometry) {
                    var me = this;
                    this._parentGeometry.iInvalidateBounds(me);
                }
            };

            Object.defineProperty(SubGeometryBase.prototype, "parentGeometry", {
                get: /**
                * The Geometry object that 'owns' this SubGeometry object.
                *
                * @private
                */
                function () {
                    return this._parentGeometry;
                },
                set: function (value) {
                    this._parentGeometry = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubGeometryBase.prototype, "scaleU", {
                get: /**
                * Scales the uv coordinates
                * @param scaleU The amount by which to scale on the u axis. Default is 1;
                * @param scaleV The amount by which to scale on the v axis. Default is 1;
                */
                function () {
                    return this._scaleU;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometryBase.prototype, "scaleV", {
                get: function () {
                    return this._scaleV;
                },
                enumerable: true,
                configurable: true
            });

            SubGeometryBase.prototype.scaleUV = function (scaleU, scaleV) {
                if (typeof scaleU === "undefined") { scaleU = 1; }
                if (typeof scaleV === "undefined") { scaleV = 1; }
                var offset = this.UVOffset;
                var stride = this.UVStride;
                var uvs = this.UVData;
                var len = uvs.length;
                var ratioU = scaleU / this._scaleU;
                var ratioV = scaleV / this._scaleV;

                for (var i = offset; i < len; i += stride) {
                    uvs[i] *= ratioU;
                    uvs[i + 1] *= ratioV;
                }

                this._scaleU = scaleU;
                this._scaleV = scaleV;
            };

            /**
            * Scales the geometry.
            * @param scale The amount by which to scale.
            */
            SubGeometryBase.prototype.scale = function (scale) {
                var vertices = this.UVData;
                var len = vertices.length;
                var offset = this.vertexOffset;
                var stride = this.vertexStride;

                for (var i = offset; i < len; i += stride) {
                    vertices[i] *= scale;
                    vertices[i + 1] *= scale;
                    vertices[i + 2] *= scale;
                }
            };

            SubGeometryBase.prototype.applyTransformation = function (transform) {
                var vertices = this._vertexData;
                var normals = this.vertexNormalData;
                var tangents = this.vertexTangentData;
                var posStride = this.vertexStride;
                var normalStride = this.vertexNormalStride;
                var tangentStride = this.vertexTangentStride;
                var posOffset = this.vertexOffset;
                var normalOffset = this.vertexNormalOffset;
                var tangentOffset = this.vertexTangentOffset;
                var len = vertices.length / posStride;
                var i, i1, i2;
                var vector = new away.geom.Vector3D();

                var bakeNormals = normals != null;
                var bakeTangents = tangents != null;
                var invTranspose;

                if (bakeNormals || bakeTangents) {
                    invTranspose = transform.clone();
                    invTranspose.invert();
                    invTranspose.transpose();
                }

                var vi0 = posOffset;
                var ni0 = normalOffset;
                var ti0 = tangentOffset;

                for (i = 0; i < len; ++i) {
                    i1 = vi0 + 1;
                    i2 = vi0 + 2;

                    // bake position
                    vector.x = vertices[vi0];
                    vector.y = vertices[i1];
                    vector.z = vertices[i2];
                    vector = transform.transformVector(vector);
                    vertices[vi0] = vector.x;
                    vertices[i1] = vector.y;
                    vertices[i2] = vector.z;
                    vi0 += posStride;

                    if (bakeNormals) {
                        i1 = ni0 + 1;
                        i2 = ni0 + 2;
                        vector.x = normals[ni0];
                        vector.y = normals[i1];
                        vector.z = normals[i2];
                        vector = invTranspose.deltaTransformVector(vector);
                        vector.normalize();
                        normals[ni0] = vector.x;
                        normals[i1] = vector.y;
                        normals[i2] = vector.z;
                        ni0 += normalStride;
                    }

                    if (bakeTangents) {
                        i1 = ti0 + 1;
                        i2 = ti0 + 2;
                        vector.x = tangents[ti0];
                        vector.y = tangents[i1];
                        vector.z = tangents[i2];
                        vector = invTranspose.deltaTransformVector(vector);
                        vector.normalize();
                        tangents[ti0] = vector.x;
                        tangents[i1] = vector.y;
                        tangents[i2] = vector.z;
                        ti0 += tangentStride;
                    }
                }
            };

            SubGeometryBase.prototype.pUpdateDummyUVs = function (target) {
                this._uvsDirty = false;

                var idx, uvIdx;
                var stride = this.UVStride;
                var skip = stride - 2;
                var len = this._vertexData.length / this.vertexStride * stride;

                if (!target) {
                    target = new Array();
                }

                //target.fixed = false;
                target.length = len;

                //target.fixed = true;
                idx = this.UVOffset;
                uvIdx = 0;

                while (idx < len) {
                    target[idx++] = uvIdx * .5;
                    target[idx++] = 1.0 - (uvIdx & 1);
                    idx += skip;

                    if (++uvIdx == 3)
                        uvIdx = 0;
                }

                return target;
            };
            return SubGeometryBase;
        })();
        base.SubGeometryBase = SubGeometryBase;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (events) {
        /**
        * Dispatched to notify changes in a geometry object's state.
        *
        * @see away3d.core.base.Geometry
        */
        var GeometryEvent = (function (_super) {
            __extends(GeometryEvent, _super);
            /**
            * Create a new GeometryEvent
            * @param type The event type.
            * @param subGeometry An optional SubGeometry object that is the subject of this event.
            */
            function GeometryEvent(type, subGeometry) {
                if (typeof subGeometry === "undefined") { subGeometry = null; }
                _super.call(this, type);
                this._subGeometry = subGeometry;
            }
            Object.defineProperty(GeometryEvent.prototype, "subGeometry", {
                get: /**
                * The SubGeometry object that is the subject of this event, if appropriate.
                */
                function () {
                    return this._subGeometry;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Clones the event.
            * @return An exact duplicate of the current object.
            */
            GeometryEvent.prototype.clone = function () {
                return new GeometryEvent(this.type, this._subGeometry);
            };
            GeometryEvent.SUB_GEOMETRY_ADDED = "SubGeometryAdded";

            GeometryEvent.SUB_GEOMETRY_REMOVED = "SubGeometryRemoved";

            GeometryEvent.BOUNDS_INVALID = "BoundsInvalid";
            return GeometryEvent;
        })(away.events.Event);
        events.GeometryEvent = GeometryEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (base) {
        var CompactSubGeometry = (function (_super) {
            __extends(CompactSubGeometry, _super);
            function CompactSubGeometry() {
                _super.call(this);
                this._vertexDataInvalid = Array(8);
                this._vertexBuffer = new Array(8);
                this._bufferContext = new Array(8);

                this._autoDeriveVertexNormals = false;
                this._autoDeriveVertexTangents = false;
            }
            Object.defineProperty(CompactSubGeometry.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the vertex data. All vertex properties are contained in a single Vector, and the order is as follows:
            * 0 - 2: vertex position X, Y, Z
            * 3 - 5: normal X, Y, Z
            * 6 - 8: tangent X, Y, Z
            * 9 - 10: U V
            * 11 - 12: Secondary U V
            */
            CompactSubGeometry.prototype.updateData = function (data) {
                if (this._autoDeriveVertexNormals) {
                    this._vertexNormalsDirty = true;
                }

                if (this._autoDeriveVertexTangents) {
                    this._vertexTangentsDirty = true;
                }

                this._faceNormalsDirty = true;
                this._faceTangentsDirty = true;
                this._isolatedVertexPositionDataDirty = true;

                this._vertexData = data;
                var numVertices = this._vertexData.length / 13;

                if (numVertices != this._numVertices) {
                    this.pDisposeVertexBuffers(this._vertexBuffer);
                }

                this._numVertices = numVertices;

                if (this._numVertices == 0) {
                    throw new Error("Bad data: geometry can't have zero triangles");
                }

                this.pInvalidateBuffers(this._vertexDataInvalid);
                this.pInvalidateBounds();
            };

            CompactSubGeometry.prototype.activateVertexBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (contextIndex != this._contextIndex) {
                    this.pUpdateActiveBuffer(contextIndex);
                }

                if (!this._activeBuffer || this._activeContext != context) {
                    this.pCreateBuffer(contextIndex, context);
                }

                if (this._activeDataInvalid) {
                    this.pUploadData(contextIndex);
                }

                context.setVertexBufferAt(index, this._activeBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            };

            CompactSubGeometry.prototype.activateUVBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (this._uvsDirty && this._autoGenerateUVs) {
                    this._vertexData = this.pUpdateDummyUVs(this._vertexData);

                    this.pInvalidateBuffers(this._vertexDataInvalid);
                }

                if (contextIndex != this._contextIndex) {
                    this.pUpdateActiveBuffer(contextIndex);
                }

                if (!this._activeBuffer || this._activeContext != context) {
                    this.pCreateBuffer(contextIndex, context);
                }

                if (this._activeDataInvalid) {
                    this.pUploadData(contextIndex);
                }

                context.setVertexBufferAt(index, this._activeBuffer, 9, away.display3D.Context3DVertexBufferFormat.FLOAT_2);
            };

            CompactSubGeometry.prototype.activateSecondaryUVBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (contextIndex != this._contextIndex) {
                    this.pUpdateActiveBuffer(contextIndex);
                }

                if (!this._activeBuffer || this._activeContext != context) {
                    this.pCreateBuffer(contextIndex, context);
                }

                if (this._activeDataInvalid) {
                    this.pUploadData(contextIndex);
                }

                context.setVertexBufferAt(index, this._activeBuffer, 11, away.display3D.Context3DVertexBufferFormat.FLOAT_2);
            };

            CompactSubGeometry.prototype.pUploadData = function (contextIndex) {
                this._activeBuffer.uploadFromArray(this._vertexData, 0, this._numVertices);
                this._vertexDataInvalid[contextIndex] = this._activeDataInvalid = false;
            };

            CompactSubGeometry.prototype.activateVertexNormalBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (contextIndex != this._contextIndex) {
                    this.pUpdateActiveBuffer(contextIndex);
                }

                if (!this._activeBuffer || this._activeContext != context) {
                    this.pCreateBuffer(contextIndex, context);
                }

                if (this._activeDataInvalid) {
                    this.pUploadData(contextIndex);
                }

                context.setVertexBufferAt(index, this._activeBuffer, 3, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            };

            CompactSubGeometry.prototype.activateVertexTangentBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (contextIndex != this._contextIndex) {
                    this.pUpdateActiveBuffer(contextIndex);
                }

                if (!this._activeBuffer || this._activeContext != context) {
                    this.pCreateBuffer(contextIndex, context);
                }

                if (this._activeDataInvalid) {
                    this.pUploadData(contextIndex);
                }

                context.setVertexBufferAt(index, this._activeBuffer, 6, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            };

            CompactSubGeometry.prototype.pCreateBuffer = function (contextIndex, context) {
                this._vertexBuffer[contextIndex] = this._activeBuffer = context.createVertexBuffer(this._numVertices, 13);
                this._bufferContext[contextIndex] = this._activeContext = context;
                this._vertexDataInvalid[contextIndex] = this._activeDataInvalid = true;
            };

            CompactSubGeometry.prototype.pUpdateActiveBuffer = function (contextIndex) {
                this._contextIndex = contextIndex;
                this._activeDataInvalid = this._vertexDataInvalid[contextIndex];
                this._activeBuffer = this._vertexBuffer[contextIndex];
                this._activeContext = this._bufferContext[contextIndex];
            };

            Object.defineProperty(CompactSubGeometry.prototype, "vertexData", {
                get: function () {
                    if (this._autoDeriveVertexNormals && this._vertexNormalsDirty) {
                        this._vertexData = this.pUpdateVertexNormals(this._vertexData);
                    }

                    if (this._autoDeriveVertexTangents && this._vertexTangentsDirty) {
                        this._vertexData = this.pUpdateVertexTangents(this._vertexData);
                    }

                    if (this._uvsDirty && this._autoGenerateUVs) {
                        this._vertexData = this.pUpdateDummyUVs(this._vertexData);
                    }

                    return this._vertexData;
                },
                enumerable: true,
                configurable: true
            });

            CompactSubGeometry.prototype.pUpdateVertexNormals = function (target) {
                this.pInvalidateBuffers(this._vertexDataInvalid);
                return _super.prototype.pUpdateVertexNormals.call(this, target);
            };

            CompactSubGeometry.prototype.pUpdateVertexTangents = function (target) {
                if (this._vertexNormalsDirty) {
                    this._vertexData = this.pUpdateVertexNormals(this._vertexData);
                }

                this.pInvalidateBuffers(this._vertexDataInvalid);

                return _super.prototype.pUpdateVertexTangents.call(this, target);
            };

            Object.defineProperty(CompactSubGeometry.prototype, "vertexNormalData", {
                get: function () {
                    if (this._autoDeriveVertexNormals && this._vertexNormalsDirty) {
                        this._vertexData = this.pUpdateVertexNormals(this._vertexData);
                    }

                    return this._vertexData;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "vertexTangentData", {
                get: function () {
                    if (this._autoDeriveVertexTangents && this._vertexTangentsDirty) {
                        this._vertexData = this.pUpdateVertexTangents(this._vertexData);
                    }

                    return this._vertexData;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "UVData", {
                get: function () {
                    if (this._uvsDirty && this._autoGenerateUVs) {
                        this._vertexData = this.pUpdateDummyUVs(this._vertexData);
                        this.pInvalidateBuffers(this._vertexDataInvalid);
                    }

                    return this._vertexData;
                },
                enumerable: true,
                configurable: true
            });

            CompactSubGeometry.prototype.applyTransformation = function (transform) {
                _super.prototype.applyTransformation.call(this, transform);
                this.pInvalidateBuffers(this._vertexDataInvalid);
            };

            CompactSubGeometry.prototype.scale = function (scale) {
                _super.prototype.scale.call(this, scale);
                this.pInvalidateBuffers(this._vertexDataInvalid);
            };

            CompactSubGeometry.prototype.clone = function () {
                var clone = new away.base.CompactSubGeometry();

                clone._autoDeriveVertexNormals = this._autoDeriveVertexNormals;
                clone._autoDeriveVertexTangents = this._autoDeriveVertexTangents;

                clone.updateData(this._vertexData.concat());
                clone.updateIndexData(this._indices.concat());

                return clone;
            };

            CompactSubGeometry.prototype.scaleUV = function (scaleU, scaleV) {
                if (typeof scaleU === "undefined") { scaleU = 1; }
                if (typeof scaleV === "undefined") { scaleV = 1; }
                _super.prototype.scaleUV.call(this, scaleU, scaleV);

                this.pInvalidateBuffers(this._vertexDataInvalid);
            };

            Object.defineProperty(CompactSubGeometry.prototype, "vertexStride", {
                get: function () {
                    return 13;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "vertexNormalStride", {
                get: function () {
                    return 13;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "vertexTangentStride", {
                get: function () {
                    return 13;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "UVStride", {
                get: function () {
                    return 13;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "secondaryUVStride", {
                get: function () {
                    return 13;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "vertexOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "vertexNormalOffset", {
                get: function () {
                    return 3;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "vertexTangentOffset", {
                get: function () {
                    return 6;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "UVOffset", {
                get: function () {
                    return 9;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CompactSubGeometry.prototype, "secondaryUVOffset", {
                get: function () {
                    return 11;
                },
                enumerable: true,
                configurable: true
            });

            CompactSubGeometry.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.pDisposeVertexBuffers(this._vertexBuffer);
                this._vertexBuffer = null;
            };

            CompactSubGeometry.prototype.pDisposeVertexBuffers = function (buffers) {
                _super.prototype.pDisposeVertexBuffers.call(this, buffers);
                this._activeBuffer = null;
            };

            CompactSubGeometry.prototype.pInvalidateBuffers = function (invalid) {
                _super.prototype.pInvalidateBuffers.call(this, invalid);
                this._activeDataInvalid = true;
            };

            CompactSubGeometry.prototype.cloneWithSeperateBuffers = function () {
                var clone = new away.base.SubGeometry();

                clone.updateVertexData(this._isolatedVertexPositionData ? this._isolatedVertexPositionData : this._isolatedVertexPositionData = this.stripBuffer(0, 3));
                clone.autoDeriveVertexNormals = this._autoDeriveVertexNormals;
                clone.autoDeriveVertexTangents = this._autoDeriveVertexTangents;

                if (!this._autoDeriveVertexNormals) {
                    clone.updateVertexNormalData(this.stripBuffer(3, 3));
                }

                if (!this._autoDeriveVertexTangents) {
                    clone.updateVertexTangentData(this.stripBuffer(6, 3));
                }

                clone.updateUVData(this.stripBuffer(9, 2));
                clone.updateSecondaryUVData(this.stripBuffer(11, 2));
                clone.updateIndexData(this.indexData.concat());

                return clone;
            };

            Object.defineProperty(CompactSubGeometry.prototype, "vertexPositionData", {
                get: function () {
                    if (this._isolatedVertexPositionDataDirty || !this._isolatedVertexPositionData) {
                        this._isolatedVertexPositionData = this.stripBuffer(0, 3);
                        this._isolatedVertexPositionDataDirty = false;
                    }

                    return this._isolatedVertexPositionData;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Isolate and returns a Vector.Number of a specific buffer type
            *
            * - stripBuffer(0, 3), return only the vertices
            * - stripBuffer(3, 3): return only the normals
            * - stripBuffer(6, 3): return only the tangents
            * - stripBuffer(9, 2): return only the uv's
            * - stripBuffer(11, 2): return only the secondary uv's
            */
            CompactSubGeometry.prototype.stripBuffer = function (offset, numEntries) {
                var data = new Array(this._numVertices * numEntries);
                var i = 0, j = offset;
                var skip = 13 - numEntries;

                for (var v = 0; v < this._numVertices; ++v) {
                    for (var k = 0; k < numEntries; ++k) {
                        data[i++] = this._vertexData[j++];
                    }

                    j += skip;
                }

                return data;
            };

            CompactSubGeometry.prototype.fromVectors = function (verts, uvs, normals, tangents) {
                var vertLen = verts.length / 3 * 13;

                var index = 0;
                var v = 0;
                var n = 0;
                var t = 0;
                var u = 0;

                var data = new Array(vertLen);

                while (index < vertLen) {
                    data[index++] = verts[v++];
                    data[index++] = verts[v++];
                    data[index++] = verts[v++];

                    if (normals && normals.length) {
                        data[index++] = normals[n++];
                        data[index++] = normals[n++];
                        data[index++] = normals[n++];
                    } else {
                        data[index++] = 0;
                        data[index++] = 0;
                        data[index++] = 0;
                    }

                    if (tangents && tangents.length) {
                        data[index++] = tangents[t++];
                        data[index++] = tangents[t++];
                        data[index++] = tangents[t++];
                    } else {
                        data[index++] = 0;
                        data[index++] = 0;
                        data[index++] = 0;
                    }

                    if (uvs && uvs.length) {
                        data[index++] = uvs[u];
                        data[index++] = uvs[u + 1];

                        // use same secondary uvs as primary
                        data[index++] = uvs[u++];
                        data[index++] = uvs[u++];
                    } else {
                        data[index++] = 0;
                        data[index++] = 0;
                        data[index++] = 0;
                        data[index++] = 0;
                    }
                }

                this.autoDeriveVertexNormals = !(normals && normals.length);
                this.autoDeriveVertexTangents = !(tangents && tangents.length);
                this.autoGenerateDummyUVs = !(uvs && uvs.length);
                this.updateData(data);
            };
            return CompactSubGeometry;
        })(away.base.SubGeometryBase);
        base.CompactSubGeometry = CompactSubGeometry;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (base) {
        /**
        * Geometry is a collection of SubGeometries, each of which contain the actual geometrical data such as vertices,
        * normals, uvs, etc. It also contains a reference to an animation class, which defines how the geometry moves.
        * A Geometry object is assigned to a Mesh, a scene graph occurence of the geometry, which in turn assigns
        * the SubGeometries to its respective SubMesh objects.
        *
        *
        *
        * @see away3d.core.base.SubGeometry
        * @see away3d.scenegraph.Mesh
        */
        var Geometry = (function (_super) {
            __extends(Geometry, _super);
            /**
            * Creates a new Geometry object.
            */
            function Geometry() {
                _super.call(this);

                this._subGeometries = new Array();
            }
            Object.defineProperty(Geometry.prototype, "assetType", {
                get: function () {
                    return away.library.AssetType.GEOMETRY;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Geometry.prototype, "subGeometries", {
                get: /**
                * A collection of SubGeometry objects, each of which contain geometrical data such as vertices, normals, etc.
                */
                function () {
                    return this._subGeometries;
                },
                enumerable: true,
                configurable: true
            });

            Geometry.prototype.applyTransformation = function (transform) {
                var len = this._subGeometries.length;
                for (var i = 0; i < len; ++i) {
                    this._subGeometries[i].applyTransformation(transform);
                }
            };

            /**
            * Adds a new SubGeometry object to the list.
            * @param subGeometry The SubGeometry object to be added.
            */
            Geometry.prototype.addSubGeometry = function (subGeometry) {
                this._subGeometries.push(subGeometry);

                subGeometry.parentGeometry = this;

                // TODO: add hasEventListener optimisation;
                //if (hasEventListener(GeometryEvent.SUB_GEOMETRY_ADDED))
                this.dispatchEvent(new away.events.GeometryEvent(away.events.GeometryEvent.SUB_GEOMETRY_ADDED, subGeometry));

                this.iInvalidateBounds(subGeometry);
            };

            /**
            * Removes a new SubGeometry object from the list.
            * @param subGeometry The SubGeometry object to be removed.
            */
            Geometry.prototype.removeSubGeometry = function (subGeometry) {
                this._subGeometries.splice(this._subGeometries.indexOf(subGeometry), 1);

                subGeometry.parentGeometry = null;

                // TODO: add hasEventListener optimisation;
                //if (hasEventListener(GeometryEvent.SUB_GEOMETRY_REMOVED))
                this.dispatchEvent(new away.events.GeometryEvent(away.events.GeometryEvent.SUB_GEOMETRY_REMOVED, subGeometry));

                this.iInvalidateBounds(subGeometry);
            };

            /**
            * Clones the geometry.
            * @return An exact duplicate of the current Geometry object.
            */
            Geometry.prototype.clone = function () {
                var clone = new Geometry();
                var len = this._subGeometries.length;

                for (var i = 0; i < len; ++i) {
                    clone.addSubGeometry(this._subGeometries[i].clone());
                }

                return clone;
            };

            /**
            * Scales the geometry.
            * @param scale The amount by which to scale.
            */
            Geometry.prototype.scale = function (scale) {
                var numSubGeoms = this._subGeometries.length;
                for (var i = 0; i < numSubGeoms; ++i) {
                    this._subGeometries[i].scale(scale);
                }
            };

            /**
            * Clears all resources used by the Geometry object, including SubGeometries.
            */
            Geometry.prototype.dispose = function () {
                var numSubGeoms = this._subGeometries.length;

                for (var i = 0; i < numSubGeoms; ++i) {
                    var subGeom = this._subGeometries[0];
                    this.removeSubGeometry(subGeom);
                    subGeom.dispose();
                }
            };

            /**
            * Scales the uv coordinates (tiling)
            * @param scaleU The amount by which to scale on the u axis. Default is 1;
            * @param scaleV The amount by which to scale on the v axis. Default is 1;
            */
            Geometry.prototype.scaleUV = function (scaleU, scaleV) {
                if (typeof scaleU === "undefined") { scaleU = 1; }
                if (typeof scaleV === "undefined") { scaleV = 1; }
                var numSubGeoms = this._subGeometries.length;

                for (var i = 0; i < numSubGeoms; ++i) {
                    this._subGeometries[i].scaleUV(scaleU, scaleV);
                }
            };

            /**
            * Updates the SubGeometries so all vertex data is represented in different buffers.
            * Use this for compatibility with Pixel Bender and PBPickingCollider
            */
            Geometry.prototype.convertToSeparateBuffers = function () {
                var subGeom;
                var numSubGeoms = this._subGeometries.length;
                var _removableCompactSubGeometries = new Array();

                for (var i = 0; i < numSubGeoms; ++i) {
                    subGeom = this._subGeometries[i];

                    if (subGeom instanceof away.base.SubGeometry) {
                        continue;
                    }

                    _removableCompactSubGeometries.push(subGeom);

                    this.addSubGeometry(subGeom.cloneWithSeperateBuffers());
                }

                var l = _removableCompactSubGeometries.length;
                var s;

                for (var c = 0; c < l; c++) {
                    s = _removableCompactSubGeometries[c];
                    this.removeSubGeometry(s);
                    s.dispose();
                }
            };

            Geometry.prototype.iValidate = function () {
            };

            Geometry.prototype.iInvalidateBounds = function (subGeom) {
                //if (hasEventListener(GeometryEvent.BOUNDS_INVALID))
                this.dispatchEvent(new away.events.GeometryEvent(away.events.GeometryEvent.BOUNDS_INVALID, subGeom));
            };
            return Geometry;
        })(away.library.NamedAssetBase);
        base.Geometry = Geometry;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../_definitions.ts"/>
    (function (base) {
        //import away3d.arcane;
        //import away3d.managers.Stage3DProxy;
        //import flash.display3D.Context3D;
        //import flash.display3D.Context3DVertexBufferFormat;
        //import flash.display3D.VertexBuffer3D;
        //import flash.geom.Matrix3D;
        //use namespace arcane;
        /**
        * The SubGeometry class is a collections of geometric data that describes a triangle mesh. It is owned by a
        * Geometry instance, and wrapped by a SubMesh in the scene graph.
        * Several SubGeometries are grouped so they can be rendered with different materials, but still represent a single
        * object.
        *
        * @see away3d.core.base.Geometry
        * @see away3d.core.base.SubMesh
        */
        var SubGeometry = (function (_super) {
            __extends(SubGeometry, _super);
            /**
            * Creates a new SubGeometry object.
            */
            function SubGeometry() {
                _super.call(this);
                this._verticesInvalid = new Array(8);
                this._uvsInvalid = new Array(8);
                this._secondaryUvsInvalid = new Array(8);
                this._normalsInvalid = new Array(8);
                this._tangentsInvalid = new Array(8);
                // buffers:
                this._vertexBuffer = new Array(8);
                this._uvBuffer = new Array(8);
                this._secondaryUvBuffer = new Array(8);
                this._vertexNormalBuffer = new Array(8);
                this._vertexTangentBuffer = new Array(8);
                // buffer dirty flags, per context:
                this._vertexBufferContext = new Array(8);
                this._uvBufferContext = new Array(8);
                this._secondaryUvBufferContext = new Array(8);
                this._vertexNormalBufferContext = new Array(8);
                this._vertexTangentBufferContext = new Array(8);
            }
            Object.defineProperty(SubGeometry.prototype, "numVertices", {
                get: /**
                * The total amount of vertices in the SubGeometry.
                */
                function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            SubGeometry.prototype.activateVertexBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (!this._vertexBuffer[contextIndex] || this._vertexBufferContext[contextIndex] != context) {
                    this._vertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 3);
                    this._vertexBufferContext[contextIndex] = context;
                    this._verticesInvalid[contextIndex] = true;
                }
                if (this._verticesInvalid[contextIndex]) {
                    this._vertexBuffer[contextIndex].uploadFromArray(this._vertexData, 0, this._numVertices);
                    this._verticesInvalid[contextIndex] = false;
                }

                context.setVertexBufferAt(index, this._vertexBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            };

            /**
            * @inheritDoc
            */
            SubGeometry.prototype.activateUVBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (this._autoGenerateUVs && this._uvsDirty) {
                    this._uvs = this.pUpdateDummyUVs(this._uvs);
                }

                if (!this._uvBuffer[contextIndex] || this._uvBufferContext[contextIndex] != context) {
                    this._uvBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 2);
                    this._uvBufferContext[contextIndex] = context;
                    this._uvsInvalid[contextIndex] = true;
                }

                if (this._uvsInvalid[contextIndex]) {
                    this._uvBuffer[contextIndex].uploadFromArray(this._uvs, 0, this._numVertices);
                    this._uvsInvalid[contextIndex] = false;
                }

                context.setVertexBufferAt(index, this._uvBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_2);
            };

            /**
            * @inheritDoc
            */
            SubGeometry.prototype.activateSecondaryUVBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (!this._secondaryUvBuffer[contextIndex] || this._secondaryUvBufferContext[contextIndex] != context) {
                    this._secondaryUvBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 2);
                    this._secondaryUvBufferContext[contextIndex] = context;
                    this._secondaryUvsInvalid[contextIndex] = true;
                }

                if (this._secondaryUvsInvalid[contextIndex]) {
                    this._secondaryUvBuffer[contextIndex].uploadFromArray(this._secondaryUvs, 0, this._numVertices);
                    this._secondaryUvsInvalid[contextIndex] = false;
                }

                context.setVertexBufferAt(index, this._secondaryUvBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_2);
            };

            /**
            * Retrieves the VertexBuffer3D object that contains vertex normals.
            * @param context The Context3D for which we request the buffer
            * @return The VertexBuffer3D object that contains vertex normals.
            */
            SubGeometry.prototype.activateVertexNormalBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (this._autoDeriveVertexNormals && this._vertexNormalsDirty) {
                    this._vertexNormals = this.pUpdateVertexNormals(this._vertexNormals);
                }

                if (!this._vertexNormalBuffer[contextIndex] || this._vertexNormalBufferContext[contextIndex] != context) {
                    this._vertexNormalBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 3);
                    this._vertexNormalBufferContext[contextIndex] = context;
                    this._normalsInvalid[contextIndex] = true;
                }
                if (this._normalsInvalid[contextIndex]) {
                    this._vertexNormalBuffer[contextIndex].uploadFromArray(this._vertexNormals, 0, this._numVertices);
                    this._normalsInvalid[contextIndex] = false;
                }

                context.setVertexBufferAt(index, this._vertexNormalBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            };

            /**
            * Retrieves the VertexBuffer3D object that contains vertex tangents.
            * @param context The Context3D for which we request the buffer
            * @return The VertexBuffer3D object that contains vertex tangents.
            */
            SubGeometry.prototype.activateVertexTangentBuffer = function (index, stage3DProxy) {
                var contextIndex = stage3DProxy._iStage3DIndex;
                var context = stage3DProxy._iContext3D;

                if (this._vertexTangentsDirty) {
                    this._vertexTangents = this.pUpdateVertexTangents(this._vertexTangents);
                }

                if (!this._vertexTangentBuffer[contextIndex] || this._vertexTangentBufferContext[contextIndex] != context) {
                    this._vertexTangentBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 3);
                    this._vertexTangentBufferContext[contextIndex] = context;
                    this._tangentsInvalid[contextIndex] = true;
                }

                if (this._tangentsInvalid[contextIndex]) {
                    this._vertexTangentBuffer[contextIndex].uploadFromArray(this._vertexTangents, 0, this._numVertices);
                    this._tangentsInvalid[contextIndex] = false;
                }

                context.setVertexBufferAt(index, this._vertexTangentBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            };

            SubGeometry.prototype.applyTransformation = function (transform) {
                _super.prototype.applyTransformation.call(this, transform);
                this.pInvalidateBuffers(this._verticesInvalid);
                this.pInvalidateBuffers(this._normalsInvalid);
                this.pInvalidateBuffers(this._tangentsInvalid);
            };

            /**
            * Clones the current object
            * @return An exact duplicate of the current object.
            */
            SubGeometry.prototype.clone = function () {
                var clone = new away.base.SubGeometry();

                clone.updateVertexData(this._vertexData.concat());
                clone.updateUVData(this._uvs.concat());
                clone.updateIndexData(this._indices.concat());

                if (this._secondaryUvs) {
                    clone.updateSecondaryUVData(this._secondaryUvs.concat());
                }

                if (!this._autoDeriveVertexNormals) {
                    clone.updateVertexNormalData(this._vertexNormals.concat());
                }

                if (!this._autoDeriveVertexTangents) {
                    clone.updateVertexTangentData(this._vertexTangents.concat());
                }

                return clone;
            };

            /**
            * @inheritDoc
            */
            SubGeometry.prototype.scale = function (scale) {
                _super.prototype.scale.call(this, scale);
                this.pInvalidateBuffers(this._verticesInvalid);
            };

            /**
            * @inheritDoc
            */
            SubGeometry.prototype.scaleUV = function (scaleU, scaleV) {
                if (typeof scaleU === "undefined") { scaleU = 1; }
                if (typeof scaleV === "undefined") { scaleV = 1; }
                _super.prototype.scaleUV.call(this, scaleU, scaleV);
                this.pInvalidateBuffers(this._uvsInvalid);
            };

            /**
            * Clears all resources used by the SubGeometry object.
            */
            SubGeometry.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.pDisposeAllVertexBuffers();
                this._vertexBuffer = null;
                this._vertexNormalBuffer = null;
                this._uvBuffer = null;
                this._secondaryUvBuffer = null;
                this._vertexTangentBuffer = null;
                this._indexBuffer = null;
                this._uvs = null;
                this._secondaryUvs = null;
                this._vertexNormals = null;
                this._vertexTangents = null;
                this._vertexBufferContext = null;
                this._uvBufferContext = null;
                this._secondaryUvBufferContext = null;
                this._vertexNormalBufferContext = null;
                this._vertexTangentBufferContext = null;
            };

            SubGeometry.prototype.pDisposeAllVertexBuffers = function () {
                this.pDisposeVertexBuffers(this._vertexBuffer);
                this.pDisposeVertexBuffers(this._vertexNormalBuffer);
                this.pDisposeVertexBuffers(this._uvBuffer);
                this.pDisposeVertexBuffers(this._secondaryUvBuffer);
                this.pDisposeVertexBuffers(this._vertexTangentBuffer);
            };

            Object.defineProperty(SubGeometry.prototype, "vertexData", {
                get: /**
                * The raw vertex position data.
                */
                function () {
                    return this._vertexData;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "vertexPositionData", {
                get: function () {
                    return this._vertexData;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the vertex data of the SubGeometry.
            * @param vertices The new vertex data to upload.
            */
            SubGeometry.prototype.updateVertexData = function (vertices) {
                if (this._autoDeriveVertexNormals) {
                    this._vertexNormalsDirty = true;
                }

                if (this._autoDeriveVertexTangents) {
                    this._vertexTangentsDirty = true;
                }

                this._faceNormalsDirty = true;

                this._vertexData = vertices;

                var numVertices = vertices.length / 3;

                if (numVertices != this._numVertices) {
                    this.pDisposeAllVertexBuffers();
                }

                this._numVertices = numVertices;

                this.pInvalidateBuffers(this._verticesInvalid);

                this.pInvalidateBounds();
            };

            Object.defineProperty(SubGeometry.prototype, "UVData", {
                get: /**
                * The raw texture coordinate data.
                */
                function () {
                    if (this._uvsDirty && this._autoGenerateUVs) {
                        this._uvs = this.pUpdateDummyUVs(this._uvs);
                    }

                    return this._uvs;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "secondaryUVData", {
                get: function () {
                    return this._secondaryUvs;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the uv coordinates of the SubGeometry.
            * @param uvs The uv coordinates to upload.
            */
            SubGeometry.prototype.updateUVData = function (uvs) {
                if (this._autoDeriveVertexTangents) {
                    this._vertexTangentsDirty = true;
                }

                this._faceTangentsDirty = true;
                this._uvs = uvs;
                this.pInvalidateBuffers(this._uvsInvalid);
            };

            SubGeometry.prototype.updateSecondaryUVData = function (uvs) {
                this._secondaryUvs = uvs;
                this.pInvalidateBuffers(this._secondaryUvsInvalid);
            };

            Object.defineProperty(SubGeometry.prototype, "vertexNormalData", {
                get: /**
                * The raw vertex normal data.
                */
                function () {
                    if (this._autoDeriveVertexNormals && this._vertexNormalsDirty) {
                        this._vertexNormals = this.pUpdateVertexNormals(this._vertexNormals);
                    }

                    return this._vertexNormals;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the vertex normals of the SubGeometry. When updating the vertex normals like this,
            * autoDeriveVertexNormals will be set to false and vertex normals will no longer be calculated automatically.
            * @param vertexNormals The vertex normals to upload.
            */
            SubGeometry.prototype.updateVertexNormalData = function (vertexNormals) {
                this._vertexNormalsDirty = false;
                this._autoDeriveVertexNormals = (vertexNormals == null);
                this._vertexNormals = vertexNormals;
                this.pInvalidateBuffers(this._normalsInvalid);
            };

            Object.defineProperty(SubGeometry.prototype, "vertexTangentData", {
                get: /**
                * The raw vertex tangent data.
                *
                * @private
                */
                function () {
                    if (this._autoDeriveVertexTangents && this._vertexTangentsDirty) {
                        this._vertexTangents = this.pUpdateVertexTangents(this._vertexTangents);
                    }

                    return this._vertexTangents;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the vertex tangents of the SubGeometry. When updating the vertex tangents like this,
            * autoDeriveVertexTangents will be set to false and vertex tangents will no longer be calculated automatically.
            * @param vertexTangents The vertex tangents to upload.
            */
            SubGeometry.prototype.updateVertexTangentData = function (vertexTangents) {
                this._vertexTangentsDirty = false;
                this._autoDeriveVertexTangents = (vertexTangents == null);
                this._vertexTangents = vertexTangents;
                this.pInvalidateBuffers(this._tangentsInvalid);
            };

            SubGeometry.prototype.fromVectors = function (vertices, uvs, normals, tangents) {
                this.updateVertexData(vertices);
                this.updateUVData(uvs);
                this.updateVertexNormalData(normals);
                this.updateVertexTangentData(tangents);
            };

            SubGeometry.prototype.pUpdateVertexNormals = function (target) {
                this.pInvalidateBuffers(this._normalsInvalid);
                return _super.prototype.pUpdateVertexNormals.call(this, target);
            };

            SubGeometry.prototype.pUpdateVertexTangents = function (target) {
                if (this._vertexNormalsDirty) {
                    this._vertexNormals = this.pUpdateVertexNormals(this._vertexNormals);
                }

                this.pInvalidateBuffers(this._tangentsInvalid);

                return _super.prototype.pUpdateVertexTangents.call(this, target);
            };

            SubGeometry.prototype.pUpdateDummyUVs = function (target) {
                this.pInvalidateBuffers(this._uvsInvalid);
                return _super.prototype.pUpdateDummyUVs.call(this, target);
            };

            SubGeometry.prototype.pDisposeForStage3D = function (stage3DProxy) {
                var index = stage3DProxy._iStage3DIndex;
                if (this._vertexBuffer[index]) {
                    this._vertexBuffer[index].dispose();
                    this._vertexBuffer[index] = null;
                }
                if (this._uvBuffer[index]) {
                    this._uvBuffer[index].dispose();
                    this._uvBuffer[index] = null;
                }
                if (this._secondaryUvBuffer[index]) {
                    this._secondaryUvBuffer[index].dispose();
                    this._secondaryUvBuffer[index] = null;
                }
                if (this._vertexNormalBuffer[index]) {
                    this._vertexNormalBuffer[index].dispose();
                    this._vertexNormalBuffer[index] = null;
                }
                if (this._vertexTangentBuffer[index]) {
                    this._vertexTangentBuffer[index].dispose();
                    this._vertexTangentBuffer[index] = null;
                }
                if (this._indexBuffer[index]) {
                    this._indexBuffer[index].dispose();
                    this._indexBuffer[index] = null;
                }
            };

            Object.defineProperty(SubGeometry.prototype, "vertexStride", {
                get: function () {
                    return 3;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "vertexTangentStride", {
                get: function () {
                    return 3;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "vertexNormalStride", {
                get: function () {
                    return 3;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "UVStride", {
                get: function () {
                    return 2;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "secondaryUVStride", {
                get: function () {
                    return 2;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "vertexOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "vertexNormalOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "vertexTangentOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "UVOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubGeometry.prototype, "secondaryUVOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            SubGeometry.prototype.cloneWithSeperateBuffers = function () {
                var obj = this.clone();
                return obj;
            };
            return SubGeometry;
        })(away.base.SubGeometryBase);
        base.SubGeometry = SubGeometry;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (controllers) {
        var ControllerBase = (function () {
            function ControllerBase(targetObject) {
                if (typeof targetObject === "undefined") { targetObject = null; }
                this._pAutoUpdate = true;
                this.targetObject = targetObject;
            }
            ControllerBase.prototype.pNotifyUpdate = function () {
                if (this._pTargetObject && this._pTargetObject.iImplicitPartition && this._pAutoUpdate) {
                    this._pTargetObject.iImplicitPartition.iMarkForUpdate(this._pTargetObject);
                }
            };

            Object.defineProperty(ControllerBase.prototype, "targetObject", {
                get: function () {
                    return this._pTargetObject;
                },
                set: function (val) {
                    if (this._pTargetObject == val) {
                        return;
                    }

                    if (this._pTargetObject && this._pAutoUpdate) {
                        this._pTargetObject._iController = null;
                    }
                    this._pTargetObject = val;

                    if (this._pTargetObject && this._pAutoUpdate) {
                        this._pTargetObject._iController = this;
                    }
                    this.pNotifyUpdate();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ControllerBase.prototype, "autoUpdate", {
                get: function () {
                    return this._pAutoUpdate;
                },
                set: function (val) {
                    if (this._pAutoUpdate == val) {
                        return;
                    }
                    this._pAutoUpdate = val;

                    if (this._pTargetObject) {
                        if (this._pTargetObject) {
                            this._pTargetObject._iController = this;
                        } else {
                            this._pTargetObject._iController = null;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });


            ControllerBase.prototype.update = function (interpolate) {
                if (typeof interpolate === "undefined") { interpolate = true; }
                throw new away.errors.AbstractMethodError();
            };
            return ControllerBase;
        })();
        controllers.ControllerBase = ControllerBase;
    })(away.controllers || (away.controllers = {}));
    var controllers = away.controllers;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (controllers) {
        var LookAtController = (function (_super) {
            __extends(LookAtController, _super);
            function LookAtController(targetObject, lookAtObject) {
                if (typeof targetObject === "undefined") { targetObject = null; }
                if (typeof lookAtObject === "undefined") { lookAtObject = null; }
                _super.call(this, targetObject);
                this._pOrigin = new away.geom.Vector3D(0.0, 0.0, 0.0);
                if (lookAtObject) {
                    this.lookAtObject = lookAtObject;
                } else {
                    this.lookAtPosition = new away.geom.Vector3D();
                }
            }
            Object.defineProperty(LookAtController.prototype, "lookAtPosition", {
                get: function () {
                    return this._pLookAtPosition;
                },
                set: function (val) {
                    if (this._pLookAtObject) {
                        this._pLookAtObject.removeEventListener(away.events.Object3DEvent.SCENETRANSFORM_CHANGED, this.onLookAtObjectChanged, this);
                        this._pLookAtObject = null;
                    }

                    this._pLookAtPosition = val;
                    this.pNotifyUpdate();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LookAtController.prototype, "lookAtObject", {
                get: function () {
                    return this._pLookAtObject;
                },
                set: function (val) {
                    if (this._pLookAtPosition) {
                        this._pLookAtPosition = null;
                    }

                    if (this._pLookAtObject == val) {
                        return;
                    }

                    if (this._pLookAtObject) {
                        this._pLookAtObject.removeEventListener(away.events.Object3DEvent.SCENETRANSFORM_CHANGED, this.onLookAtObjectChanged, this);
                    }
                    this._pLookAtObject = val;

                    if (this._pLookAtObject) {
                        this._pLookAtObject.addEventListener(away.events.Object3DEvent.SCENETRANSFORM_CHANGED, this.onLookAtObjectChanged, this);
                    }

                    this.pNotifyUpdate();
                },
                enumerable: true,
                configurable: true
            });


            //@override
            LookAtController.prototype.update = function (interpolate) {
                if (typeof interpolate === "undefined") { interpolate = true; }
                interpolate = interpolate;

                if (this._pTargetObject) {
                    if (this._pLookAtPosition) {
                        this._pTargetObject.lookAt(this._pLookAtPosition);
                    } else if (this._pLookAtObject) {
                        this._pTargetObject.lookAt(this._pLookAtObject.scene ? this._pLookAtObject.scenePosition : this._pLookAtObject.position);
                    }
                }
            };

            LookAtController.prototype.onLookAtObjectChanged = function (event) {
                this.pNotifyUpdate();
            };
            return LookAtController;
        })(away.controllers.ControllerBase);
        controllers.LookAtController = LookAtController;
    })(away.controllers || (away.controllers = {}));
    var controllers = away.controllers;
})(away || (away = {}));
var away;
(function (away) {
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../_definitions.ts" />
    (function (lights) {
        var LightBase = (function (_super) {
            __extends(LightBase, _super);
            // TODO private _shadowMapper:ShadowMapperBase;
            function LightBase() {
                _super.call(this);
                this._color = 0xffffff;
                this._colorR = 1;
                this._colorG = 1;
                this._colorB = 1;
                this._ambientColor = 0xffffff;
                this._ambient = 0;
                this._iAmbientR = 0;
                this._iAmbientG = 0;
                this._iAmbientB = 0;
                this._specular = 1;
                this._iSpecularR = 1;
                this._iSpecularG = 1;
                this._iSpecularB = 1;
                this._diffuse = 1;
                this._iDiffuseR = 1;
                this._iDiffuseG = 1;
                this._iDiffuseB = 1;
            }
            Object.defineProperty(LightBase.prototype, "castsShadows", {
                get: function () {
                    return this._castsShadows;
                },
                set: function (value) {
                    if (this._castsShadows == value) {
                        return;
                    }

                    this._castsShadows = value;

                    throw new away.errors.PartialImplementationError();

                    /*
                    if( value )
                    {
                    _shadowMapper ||= createShadowMapper();
                    _shadowMapper.light = this;
                    } else {
                    _shadowMapper.dispose();
                    _shadowMapper = null;
                    }
                    */
                    this.dispatchEvent(new away.events.LightEvent(away.events.LightEvent.CASTS_SHADOW_CHANGE));
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LightBase.prototype, "specular", {
                get: //TODO implement pCreateShadowMapper
                /*
                protected pCreateShadowMapper():ShadowMapperBase
                {
                throw new AbstractMethodError();
                }
                */
                function () {
                    return this._specular;
                },
                set: function (value) {
                    if (value < 0) {
                        value = 0;
                    }
                    this._specular = value;
                    this.updateSpecular();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LightBase.prototype, "diffuse", {
                get: function () {
                    return this._diffuse;
                },
                set: function (value) {
                    if (value < 0) {
                        value = 0;
                    }
                    this._diffuse = value;
                    this.updateDiffuse();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LightBase.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._color = value;
                    this._colorR = ((this._color >> 16) & 0xff) / 0xff;
                    this._colorG = ((this._color >> 8) & 0xff) / 0xff;
                    this._colorB = (this._color & 0xff) / 0xff;
                    this.updateDiffuse();
                    this.updateSpecular();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LightBase.prototype, "ambient", {
                get: function () {
                    return this._ambient;
                },
                set: function (value) {
                    if (value < 0) {
                        value = 0;
                    } else if (value > 1) {
                        value = 1;
                    }
                    this._ambient = value;
                    this.updateAmbient();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LightBase.prototype, "ambientColor", {
                get: function () {
                    return this._ambientColor;
                },
                set: function (value) {
                    this._ambientColor = value;
                    this.updateAmbient();
                },
                enumerable: true,
                configurable: true
            });


            LightBase.prototype.updateAmbient = function () {
                this._iAmbientR = ((this._ambientColor >> 16) & 0xff) / 0xff * this._ambient;
                this._iAmbientG = ((this._ambientColor >> 8) & 0xff) / 0xff * this._ambient;
                this._iAmbientB = (this._ambientColor & 0xff) / 0xff * this._ambient;
            };

            LightBase.prototype.iGetObjectProjectionMatrix = function (renderable, target) {
                if (typeof target === "undefined") { target = null; }
                throw new away.errors.AbstractMethodError();
            };

            //@override
            LightBase.prototype.pCreateEntityPartitionNode = function () {
                return new away.partition.LightNode(this);
            };

            Object.defineProperty(LightBase.prototype, "assetType", {
                get: //@override
                function () {
                    return away.library.AssetType.LIGHT;
                },
                enumerable: true,
                configurable: true
            });

            LightBase.prototype.updateSpecular = function () {
                this._iSpecularR = this._colorR * this._specular;
                this._iSpecularG = this._colorG * this._specular;
                this._iSpecularB = this._colorB * this._specular;
            };

            LightBase.prototype.updateDiffuse = function () {
                this._iDiffuseR = this._colorR * this._diffuse;
                this._iDiffuseG = this._colorG * this._diffuse;
                this._iDiffuseB = this._colorB * this._diffuse;
            };
            return LightBase;
        })(away.entities.Entity);
        lights.LightBase = LightBase;
    })(away.lights || (away.lights = {}));
    var lights = away.lights;
})(away || (away = {}));
///<reference path="../../../src/away/_definitions.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/utils/TimerTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/utils/TimerTest.js
//------------------------------------------------------------------------------------------------
var TimerTest = (function () {
    function TimerTest() {
        this.oneSecondTimer = new away.utils.Timer(1000);
        this.oneSecondTimer.addEventListener(away.events.TimerEvent.TIMER, this.onSecTimerEvent, this);
        this.oneSecondTimer.start();

        this.repeatTenTimes = new away.utils.Timer(100, 10);
        this.repeatTenTimes.addEventListener(away.events.TimerEvent.TIMER, this.repeatTenTimesEvent, this);
        this.repeatTenTimes.addEventListener(away.events.TimerEvent.TIMER_COMPLETE, this.repeatTenTimesComplete, this);
        this.repeatTenTimes.start();
    }
    TimerTest.prototype.repeatTenTimesEvent = function (e) {
        var t = e.target;
        console.log('repeatTenTimesEvent', t.currentCount);
    };

    TimerTest.prototype.repeatTenTimesComplete = function (e) {
        var t = e.target;
        console.log('repeatTenTimesComplete', t.currentCount);
    };

    TimerTest.prototype.onSecTimerEvent = function (e) {
        console.log('onSecTimerEvent, tick');
        console.log('getTimer() : ', away.utils.getTimer());
    };
    return TimerTest;
})();

var GL = null;

window.onload = function () {
    var canvas = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    var test = new TimerTest();
};
//@ sourceMappingURL=TimerTest.js.map
