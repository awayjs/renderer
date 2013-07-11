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
    ///<reference path="../assets/IAsset.ts" />
    ///<reference path="../../events/AssetEvent.ts" />
    ///<reference path="../../errors/AbstractMethodError.ts" />
    ///<reference path="../../events/AssetEvent.ts" />
    ///<reference path="ConflictPrecedence.ts" />
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
    ///<reference path="../assets/IAsset.ts" />
    ///<reference path="ConflictStrategyBase.ts" />
    //<reference path="../../events/AssetEvent.ts" />
    //<reference path="../../errors/AbstractMethodError.ts" />
    //<reference path="../../events/AssetEvent.ts" />
    //<reference path="ConflictPrecedence.ts" />
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
    ///<reference path="../assets/IAsset.ts" />
    ///<reference path="ConflictStrategyBase.ts" />
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
    ///<reference path="../../errors/Error.ts" />
    ///<reference path="ConflictStrategyBase.ts" />
    ///<reference path="../assets/IAsset.ts" />
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
    ///<reference path="NumSuffixConflictStrategy.ts" />
    ///<reference path="IgnoreConflictStrategy.ts" />
    ///<reference path="ErrorConflictStrategy.ts" />
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
///<reference path="../src/away/library/naming/ConflictStrategyBase.ts" />
///<reference path="../src/away/library/naming/ConflictStrategy.ts" />
///<reference path="../src/away/library/naming/ErrorConflictStrategy.ts" />
///<reference path="../src/away/library/naming/NumSuffixConflictStrategy.ts" />
///<reference path="../src/away/library/naming/IgnoreConflictStrategy.ts" />
///<reference path="../src/away/library/naming/ConflictPrecedence.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/NamingTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/NamingTest.js
//------------------------------------------------------------------------------------------------
var NamingTest = (function () {
    function NamingTest() {
        this.csb = new away.library.ConflictStrategyBase();
        this.ecsb = new away.library.ErrorConflictStrategy();
        this.nscs = new away.library.NumSuffixConflictStrategy();
        this.cs = new away.library.ConflictStrategy();
        this.ics = new away.library.IgnoreConflictStrategy();
        this.cp = new away.library.ConflictPrecedence();
        away.library.ConflictStrategy.APPEND_NUM_SUFFIX;
        away.library.ConflictStrategy.IGNORE;
        away.library.ConflictStrategy.THROW_ERROR;
    }
    return NamingTest;
})();

var test;
window.onload = function () {
    test = new NamingTest();
};
//@ sourceMappingURL=NamingTest.js.map
