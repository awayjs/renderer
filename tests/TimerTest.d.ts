/**
* Base event class
* @class kurst.events.Event
*
* @author Karim Beyrouti
*/
declare module away.events {
    class Event {
        static COMPLETE: string;
        static OPEN: string;
        /**
        * Type of event
        * @property type
        * @type String
        */
        public type: string;
        /**
        * Reference to target object
        * @property target
        * @type Object
        */
        public target: Object;
        constructor(type: string);
        /**
        * Clones the current event.
        * @return An exact duplicate of the current event.
        */
        public clone(): Event;
    }
}
/**
* @module kurst.events
*/
declare module away.events {
    /**
    * Base class for dispatching events
    *
    * @class kurst.events.EventDispatcher
    *
    */
    class EventDispatcher {
        private listeners;
        private lFncLength;
        /**
        * Add an event listener
        * @method addEventListener
        * @param {String} Name of event to add a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        public addEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Remove an event listener
        * @method removeEventListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        public removeEventListener(type: string, listener: Function, target: Object): void;
        /**
        * Dispatch an event
        * @method dispatchEvent
        * @param {Event} Event to dispatch
        */
        public dispatchEvent(event: events.Event): void;
        /**
        * get Event Listener Index in array. Returns -1 if no listener is added
        * @method getEventListenerIndex
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        private getEventListenerIndex(type, listener, target);
        /**
        * check if an object has an event listener assigned to it
        * @method hasListener
        * @param {String} Name of event to remove a listener for
        * @param {Function} Callback function
        * @param {Object} Target object listener is added to
        */
        public hasEventListener(type: string, listener: Function, target: Object): boolean;
    }
}
declare module away.events {
    class TimerEvent extends events.Event {
        static TIMER: string;
        static TIMER_COMPLETE: string;
        constructor(type: string);
    }
}
declare module away.utils {
    class Timer extends away.events.EventDispatcher {
        static getTimer(): number;
        private _delay;
        private _repeatCount;
        private _currentCount;
        private _iid;
        private _running;
        constructor(delay: number, repeatCount?: number);
        public currentCount : number;
        public delay : number;
        public repeatCount : number;
        public reset(): void;
        public running : boolean;
        public start(): void;
        public stop(): void;
        private tick();
    }
}
declare class TimerTest {
    private oneSecondTimer;
    private repeatTenTimes;
    constructor();
    private repeatTenTimesEvent(e);
    private repeatTenTimesComplete(e);
    private onSecTimerEvent(e);
}
