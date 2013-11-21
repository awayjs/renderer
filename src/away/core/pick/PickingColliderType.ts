///<reference path="../../_definitions.ts"/>
module away.pick
{

	/**
	 * Options for setting a picking collider for entity objects. Used with the <code>RaycastPicker</code> picking object.
	 *
	 * @see away3d.entities.Entity#pickingCollider
	 * @see away3d.core.pick.RaycastPicker
	 */
	export class PickingColliderType
	{
		/**
		 * Default null collider that forces picker to only use entity bounds for hit calculations on an Entity
		 */
		public static BOUNDS_ONLY:away.pick.IPickingCollider = null;

		/**
		 * Pure AS3 picking collider that returns the first encountered hit on an Entity. Useful for low poly meshes and applying to many mesh instances.
		 *
		 * @see away3d.core.pick.AS3PickingCollider
		 */
		public static AS3_FIRST_ENCOUNTERED:away.pick.IPickingCollider = new away.pick.AS3PickingCollider(false);

		/**
		 * Pure AS3 picking collider that returns the best (closest) hit on an Entity. Useful for low poly meshes and applying to many mesh instances.
		 *
		 * @see away3d.core.pick.AS3PickingCollider
		 */
		public static AS3_BEST_HIT:away.pick.IPickingCollider = new away.pick.AS3PickingCollider(true);
	}
}
