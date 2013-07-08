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
    ///<reference path="getTimer.ts" />
    (function (utils) {
        var RequestAnimationFrame = (function () {
            function RequestAnimationFrame(callback, callbackContext) {
                var _this = this;
                this._active = false;
                this._argsArray = new Array();
                this._callback = callback;
                this._callbackContext = callbackContext;

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
            */
            RequestAnimationFrame.prototype.start = function () {
                this._prevTime = away.utils.getTimer();
                this._active = true;
                window.requestAnimationFrame(this._rafUpdateFunction);
            };

            /**
            *
            */
            RequestAnimationFrame.prototype.stop = function () {
                this._active = false;
            };

            Object.defineProperty(RequestAnimationFrame.prototype, "active", {
                get: // Get / Set
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
                this._currentTime = away.utils.getTimer();
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
//<reference path="../src/away/utils/Timer.ts" />
//<reference path="../src/away/utils/getTimer.ts" />
///<reference path="../src/away/utils/RequestAnimationFrame.ts" />
//<reference path="../src/away/events/TimerEvent.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/RequestAnimationFrameTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/RequestAnimationFrameTest.js
//------------------------------------------------------------------------------------------------
var RequestAnimationFrameTest = (function () {
    function RequestAnimationFrameTest() {
        var _this = this;
        this.requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
        this.requestAnimationFrameTimer.start();

        document.onmousedown = function (e) {
            return _this.onMouseDown(e);
        };
    }
    RequestAnimationFrameTest.prototype.onMouseDown = function (e) {
        console.log('mouseDown');

        if (this.requestAnimationFrameTimer.active) {
            this.requestAnimationFrameTimer.stop();
        } else {
            this.requestAnimationFrameTimer.start();
        }
    };

    RequestAnimationFrameTest.prototype.tick = function (dt) {
        console.log('tick');
    };
    return RequestAnimationFrameTest;
})();

window.onload = function () {
    var test = new RequestAnimationFrameTest();
};
//@ sourceMappingURL=RequestAnimationFrameTest.js.map
