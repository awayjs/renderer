/**
 * Base event class
 * @class kurst.events.Event
 *
 * @author Karim Beyrouti
 */
module away.events
{
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