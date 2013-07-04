/**
 * Base event class
 * @class kurst.events.Event
 *
 * @author Karim Beyrouti
 */
module away.events
{
	export class Event {

        public static COMPLETE  : string = 'Event_Complete';
        public static OPEN      : string = 'Event_Open';

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
		
        constructor( type : string )
        {
            this.type = type;
        }

        /**
         * Clones the current event.
         * @return An exact duplicate of the current event.
         */
        public clone() : Event
        {
            return new Event( this.type );
        }

	}

}