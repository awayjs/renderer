///<reference path="../../_definitions.ts"/>

/**
 * @module away.pick
 */
module away.pick
{

	/**
	 * Options for setting a picking collider for entity objects. Used with the <code>RaycastPicker</code> picking object.
	 *
	 * @see away.entities.Entity#pickingCollider
	 * @see away.pick.RaycastPicker
	 *
	 * @class away.pick.PickingColliderType
	 */
	export class PickingColliderType
	{
		/**
		 * Default null collider that forces picker to only use entity bounds for hit calculations on an Entity
		 */
		public static BOUNDS_ONLY:IPickingCollider = null;

		/**
		 * Pure AS3 picking collider that returns the first encountered hit on an Entity. Useful for low poly meshes and applying to many mesh instances.
		 *
		 * @see away.pick.JSPickingCollider
		 */
		public static AS3_FIRST_ENCOUNTERED:IPickingCollider = new JSPickingCollider(false);

		/**
		 * Pure AS3 picking collider that returns the best (closest) hit on an Entity. Useful for low poly meshes and applying to many mesh instances.
		 *
		 * @see away.pick.JSPickingCollider
		 */
		public static AS3_BEST_HIT:IPickingCollider = new JSPickingCollider(true);
	}
}
