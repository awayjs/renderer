///<reference path="../_definitions.ts"/>

module away.events
{
	/**
	 * Dispatched to notify changes in an animator's state.
	 */
	export class AnimatorEvent extends Event
	{
		/**
		 * Defines the value of the type property of a start event object.
		 */
		public static START:string = "start";

		/**
		 * Defines the value of the type property of a stop event object.
		 */
		public static STOP:string = "stop";

		/**
		 * Defines the value of the type property of a cycle complete event object.
		 */
		public static CYCLE_COMPLETE:string = "cycle_complete";

		private _animator:away.animators.AnimatorBase;

		/**
		 * Create a new <code>AnimatorEvent</code> object.
		 *
		 * @param type The event type.
		 * @param animator The animator object that is the subject of this event.
		 */
		constructor(type:string, animator:away.animators.AnimatorBase)
		{
			super(type);
			this._animator = animator;
		}

		public get animator():away.animators.AnimatorBase
		{
			return this._animator;
		}

		/**
		 * Clones the event.
		 *
		 * @return An exact duplicate of the current event object.
		 */
		public clone():Event
		{
			return new AnimatorEvent(this.type, this._animator);
		}
	}
}
