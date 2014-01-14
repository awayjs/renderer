///<reference path="../_definitions.ts"/>
module away.events
{

	/**
	 * Dispatched to notify changes in a geometry object's state.
	 *
	 * @class away.events.GeometryEvent
	 * @see away3d.core.base.Geometry
	 */
	export class GeometryEvent extends away.events.Event
	{
		/**
		 * Dispatched when a SubGeometry was added from the dispatching Geometry.
		 */
		public static SUB_GEOMETRY_ADDED:string = "SubGeometryAdded";

		/**
		 * Dispatched when a SubGeometry was removed from the dispatching Geometry.
		 */
		public static SUB_GEOMETRY_REMOVED:string = "SubGeometryRemoved";

		public static BOUNDS_INVALID:string = "BoundsInvalid";

		private _subGeometry:away.base.ISubGeometry;

		/**
		 * Create a new GeometryEvent
		 * @param type The event type.
		 * @param subGeometry An optional SubGeometry object that is the subject of this event.
		 */
		constructor(type:string, subGeometry:away.base.ISubGeometry = null)
		{
			super(type) //, false, false);
			this._subGeometry = subGeometry;
		}

		/**
		 * The SubGeometry object that is the subject of this event, if appropriate.
		 */
		public get subGeometry():away.base.ISubGeometry
		{
			return this._subGeometry;
		}

		/**
		 * Clones the event.
		 * @return An exact duplicate of the current object.
		 */
		public clone():Event
		{
			return new GeometryEvent(this.type, this._subGeometry);
		}
	}
}
