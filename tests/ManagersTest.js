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

    // add to list extend d,b

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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../events/Event.ts" />
    ///<reference path="../containers/ObjectContainer3D.ts" />
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
    ///<reference path="../events/EventDispatcher.ts" />
    ///<reference path="../events/Scene3DEvent.ts" />
    ///<reference path="ObjectContainer3D.ts" />
    ///<reference path="../traverse/PartitionTraverser.ts" />
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
    ///<reference path="Error.ts" />
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
    ///<reference path="../../def/js.d.ts"/>
    ///<reference path="TextureBase.ts"/>
    ///<reference path="../display/BitmapData.ts"/>
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
    ///<reference path="../library/assets/NamedAssetBase.ts"/>
    ///<reference path="../library/assets/IAsset.ts"/>
    ///<reference path="../library/assets/AssetType.ts"/>
    ///<reference path="../base/IMaterialOwner.ts"/>
    ///<reference path="../display/BlendMode.ts"/>
    ///<reference path="../errors/PartialImplementationError.ts"/>
    ///<reference path="../errors/AbstractMethodError.ts"/>
    ///<reference path="../events/Event.ts"/>
    ///<reference path="../display3D/Context3D.ts"/>
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
    ///<reference path="../entities/Entity.ts" />
    ///<reference path="../errors/AbstractMethodError.ts" />
    ///<reference path="../containers/Scene3D.ts" />
    ///<reference path="../partition/NodeBase.ts" />
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../base/IRenderable.ts" />
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

            /*
            public applyUnknownLight(light:LightBase)
            {
            throw new away.errors.AbstractMethodError();
            }
            
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
    ///<reference path="../../entities/SegmentSet.ts" />
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
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../errors/AbstractMethodError.ts" />
    ///<reference path="../primitives/WireframePrimitiveBase.ts" />
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
    ///<reference path="Event.ts" />
    ///<reference path="../cameras/lenses/LensBase.ts" />
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
    ///<reference path="../../events/EventDispatcher.ts" />
    ///<reference path="../../geom/Rectangle.ts" />
    ///<reference path="../../geom/Matrix3D.ts" />
    ///<reference path="../../geom/Vector3D.ts" />
    ///<reference path="../../events/LensEvent.ts" />
    ///<reference path="../../errors/AbstractMethodError.ts" />
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
    ///<reference path="../../cameras/lenses/LensBase.ts" />
    ///<reference path="../../geom/Vector3D.ts" />
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
    ///<reference path="Event.ts" />
    ///<reference path="../cameras/Camera3D.ts" />
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
    ///<reference path="../primitives/WireframePrimitiveBase.ts" />
    ///<reference path="../math/PlaneClassification.ts" />
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
    ///<reference path="EntityNode.ts" />
    ///<reference path="../library/assets/AssetType.ts" />
    ///<reference path="../traverse/PartitionTraverser.ts" />
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
    ///<reference path="../cameras/lenses/LensBase.ts" />
    ///<reference path="../cameras/lenses/PerspectiveLens.ts" />
    ///<reference path="../math/Plane3D.ts" />
    ///<reference path="../entities/Entity.ts" />
    ///<reference path="../events/LensEvent.ts" />
    ///<reference path="../events/CameraEvent.ts" />
    ///<reference path="../bounds/NullBounds.ts" />
    ///<reference path="../library/assets/AssetType.ts" />
    ///<reference path="../partition/EntityNode.ts" />
    ///<reference path="../partition/CameraNode.ts" />
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
    ///<reference path="Entity.ts" />
    ///<reference path="../base/IRenderable.ts" />
    ///<reference path="../primitives/data/Segment.ts" />
    ///<reference path="../bounds/BoundingVolumeBase.ts" />
    ///<reference path="../library/assets/AssetType.ts" />
    ///<reference path="../cameras/Camera3D.ts" />
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
    ///<reference path="../entities/SegmentSet.ts" />
    ///<reference path="../bounds/BoundingVolumeBase.ts" />
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
    ///<reference path="../entities/Entity.ts" />
    ///<reference path="../math/Plane3D.ts" />
    ///<reference path="../traverse/PartitionTraverser.ts" />
    ///<reference path="../primitives/WireframePrimitiveBase.ts" />
    ///<reference path="../errors/PartialImplementationError.ts" />
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
    ///<reference path="../entities/Entity.ts" />
    ///<reference path="../partition/EntityNode.ts" />
    ///<reference path="../partition/NodeBase.ts" />
    ///<reference path="../partition/NullNode.ts" />
    ///<reference path="../traverse/PartitionTraverser.ts" />
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
    /**
    * ...
    * @author Gary Paluk - http://www.plugin.io
    */
    ///<reference path="../base/Object3D.ts" />
    ///<reference path="../geom/Matrix3D.ts" />
    ///<reference path="../library/assets/AssetType.ts" />
    ///<reference path="../events/Object3DEvent.ts" />
    ///<reference path="../partition/Partition3D.ts" />
    ///<reference path="../errors/PartialImplementationError.ts" />
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
    ///<reference path="../entities/Entity.ts" />
    ///<reference path="../geom/Vector3D.ts" />
    ///<reference path="../geom/Point.ts" />
    ///<reference path="../base/IRenderable.ts" />
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
    ///<reference path="../partition/EntityNode.ts" />
    ///<reference path="../containers/ObjectContainer3D.ts" />
    ///<reference path="../library/assets/AssetType.ts" />
    ///<reference path="../errors/AbstractMethodError.ts" />
    ///<reference path="../pick/IPickingCollider.ts" />
    ///<reference path="../pick/PickingCollisionVO.ts" />
    ///<reference path="../bounds/BoundingVolumeBase.ts" />
    ///<reference path="../errors/PartialImplementationError.ts" />
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
    ///<reference path="../entities/Entity.ts" />
    ///<reference path="NodeBase.ts" />
    ///<reference path="../math/Plane3D.ts" />
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
///<reference path="../src/away/partition/EntityNode.ts" />
///<reference path="../src/away/entities/Entity.ts" />
//<reference path="../errors/AbstractMethodError.ts" />
//<reference path="../src/away/containers/Scene3D.ts" />
//<reference path="../partition/NodeBase.ts" />
///<reference path="../src/away/partition/EntityNode.ts" />
//<reference path="../geom/Vector3D.ts" />
//<reference path="../base/IRenderable.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/ManagersTest.js
//------------------------------------------------------------------------------------------------
var ManagersTest = (function () {
    //private stage       : away.display.Stage;
    //private sManager    : away.managers.Stage3DManager;
    //private sProxy      : away.managers.Stage3DProxy;
    function ManagersTest() {
        var e = new away.entities.Entity();
    }
    return ManagersTest;
})();

var GL = null;
var test;
window.onload = function () {
    var canvas = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    test = new ManagersTest();
};
//@ sourceMappingURL=ManagersTest.js.map

//run through list and set all exteds