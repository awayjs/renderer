///<reference path="../_definitions.ts"/>

/**
 * @module away.events
 */
module away.events
{

	/**
	 * Base class for dispatching events
	 *
	 * @class away.events.EventDispatcher
	 *
	 */
	export class EventDispatcher
	{

		private listeners:Object[] = new Array<Object>();
		private lFncLength:number;

		/**
		 * Add an event listener
		 * @method addEventListener
		 * @param {String} Name of event to add a listener for
		 * @param {Function} Callback function
		 * @param {Object} Target object listener is added to
		 */
		public addEventListener(type:string, listener:Function, target:Object)
		{

			if (this.listeners[ type ] === undefined) {

				this.listeners[ type ] = new Array<EventData>();

			}

			if (this.getEventListenerIndex(type, listener, target) === -1) {

				var d:EventData = new EventData();
				d.listener = listener;
				d.type = type;
				d.target = target;

				this.listeners[ type ].push(d);

			}

		}

		/**
		 * Remove an event listener
		 * @method removeEventListener
		 * @param {String} Name of event to remove a listener for
		 * @param {Function} Callback function
		 * @param {Object} Target object listener is added to
		 */
		public removeEventListener(type:string, listener:Function, target:Object)
		{

			var index:number = this.getEventListenerIndex(type, listener, target);

			if (index !== -1) {

				this.listeners[ type ].splice(index, 1);

			}

		}

		/**
		 * Dispatch an event
		 * @method dispatchEvent
		 * @param {Event} Event to dispatch
		 */
		public dispatchEvent(event:Event)
		{

			var listenerArray:Array<EventData> = this.listeners[ event.type ];

			if (listenerArray !== undefined) {

				this.lFncLength = listenerArray.length;
				event.target = this;

				var eventData:EventData;

				for (var i = 0, l = this.lFncLength; i < l; i++) {

					eventData = listenerArray[i];
					eventData.listener.call(eventData.target, event);

				}
			}

		}

		/**
		 * get Event Listener Index in array. Returns -1 if no listener is added
		 * @method getEventListenerIndex
		 * @param {String} Name of event to remove a listener for
		 * @param {Function} Callback function
		 * @param {Object} Target object listener is added to
		 */
		private getEventListenerIndex(type:string, listener:Function, target:Object):number
		{

			if (this.listeners[ type ] !== undefined) {

				var a:Array<EventData> = this.listeners[ type ];
				var l:number = a.length;
				var d:EventData;

				for (var c:number = 0; c < l; c++) {

					d = a[c];

					if (target == d.target && listener == d.listener) {

						return c;

					}

				}


			}

			return -1;

		}

		/**
		 * check if an object has an event listener assigned to it
		 * @method hasListener
		 * @param {String} Name of event to remove a listener for
		 * @param {Function} Callback function
		 * @param {Object} Target object listener is added to
		 */

			//todo: hasEventListener - relax check by not requiring target in param

		public hasEventListener(type:string, listener?:Function, target?:Object):boolean
		{

			if (this.listeners != null && target != null) {

				return ( this.getEventListenerIndex(type, listener, target) !== -1 );

			} else {

				if (this.listeners[ type ] !== undefined) {

					var a:Array<EventData> = this.listeners[ type ];
					return ( a.length > 0 );

				}

				return false;


			}

			return false;

		}


	}
	/**
	 * Event listener data container
	 */
	class EventData
	{

		public listener:Function;
		public target:Object;
		public type:string;

	}

}