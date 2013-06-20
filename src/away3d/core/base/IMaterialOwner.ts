module away3d.core.base
{
	//import away3d.animators.IAnimator;
	//import away3d.materials.MaterialBase;

	/**
	 * IMaterialOwner provides an interface for objects that can use materials.
	 */
	export interface IMaterialOwner
	{
		/**
		 * The material with which to render the object.
		 */
        // TODO: imeplement MaterialBase
		//function get material() : MaterialBase;
		//function set material(value : MaterialBase) : void;

		/**
		 * The animation used by the material to assemble the vertex code.
		 */
        // TODO: imeplement IAnimator
		//function get animator() : IAnimator;	// in most cases, this will in fact be null

	}
}