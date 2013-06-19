/**
 * @module away3d.events
 */
module away3d.events {

    /**
     * Base class for dispatching events
     *
     * @class away3d.events.EventDispatcher
     *
     */
    export class EventDispatcher{

        private listeners   : Object[] = new Array<Object>();
        private lFncLength  : number;
        /**
         * Add an event listener
         * @method addEventListener
         * @param {String} Name of event to add a listener for
         * @param {Function} Callback function
         */
        public addEventListener ( type : string , listener : Function ) {

            if ( this.listeners[ type ] === undefined ) {

                this.listeners[ type ] = new Array<Function>();//Function[];

            }

            if ( this.listeners[ type ].indexOf( listener ) === - 1 ) {

                this.listeners[ type ].push( listener );

            }

        }
        /**
         * Remove an event listener
         * @method removeEventListener
         * @param {String} Name of event to remove a listener for
         * @param {Function} Callback function
         */
        public removeEventListener ( type : string , listener : Function ) {

            var index = this.listeners[ type ].indexOf( listener );

            if ( index !== - 1 ) {

                this.listeners[ type ].splice( index, 1 );

            }

        }
        /**
         * Dispatch an event
         * @method dispatchEvent
         * @param {Event} Event to dispatch
         */
        public dispatchEvent ( event : Event ) {

            var listenerArray : Function[] = <Function[]> this.listeners[ event.type ];

            if ( listenerArray !== undefined ) {

                this.lFncLength     = listenerArray.length;
                event.target        = this;

                for ( var i = 0, l = this.lFncLength; i < l; i ++ ) {

                    listenerArray[ i ].call( this, event );

                }
            }

        }

    }

    /**
     * Base event class
     * @class kurst.events.Event
     */
    export class Event {
        /**
         * Type of event
         * @property type
         * @type String
         */
        public type     : string = undefined;
        /**
         * Reference to target object
         * @property target
         * @type Object
         */
        public target   : Object = undefined;

        constructor( type : string ) {

            this.type = type;

        }

    }

}