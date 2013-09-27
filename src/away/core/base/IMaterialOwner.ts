///<reference path="../../_definitions.ts"/>
/**
 * @module away.base
 */
module away.base
{
    /**
     *
	 * IMaterialOwner provides an interface for objects that can use materials.
     *
     * @interface away.base.IMaterialOwner
	 */
	export interface IMaterialOwner
	{
		/**
		 * The material with which to render the object.
		 */
		material:away.materials.MaterialBase; // GET / SET

		/**
		 * The animation used by the material to assemble the vertex code.
		 */
		animator:away.animators.IAnimator; // in most cases, this will in fact be null
	}
}
