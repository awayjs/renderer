///<reference path="../../_definitions.ts"/>
/**
 * @module away.pick
 */
module away.pick
{

	/**
	 * Options for the different 3D object picking approaches available in Away3D. Can be used for automatic mouse picking on the view.
	 *
	 * @see away3d.containers.View#mousePicker
	 *
	 * @class away.pick.PickingType
	 */
	export class PickingType
	{
		/**
		 * Uses a render pass to pick objects based on a key color that is read back into the engine.
		 * Performance can be variable on some GPUs.
		 */
		public static SHADER:IPicker = new ShaderPicker();

		/**
		 * Uses AS3 and Pixel Bender to pick objects based on ray intersection. Returns the hit on the first encountered Entity.
		 */
		public static RAYCAST_FIRST_ENCOUNTERED:IPicker = new RaycastPicker(false);

		/**
		 * Uses AS3 and Pixel Bender to pick objects based on ray intersection. Returns the best (closest) hit on an Entity.
		 */
		public static RAYCAST_BEST_HIT:IPicker = new RaycastPicker(true);
	}
}
