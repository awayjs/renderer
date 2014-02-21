///<reference path="../_definitions.ts"/>

module away.animators
{

	/**
	 * Provides an interface for data set classes that hold animation data for use in animator classes.
	 *
	 * @see away3d.animators.AnimatorBase
	 */
	export interface IAnimationSet
	{
		/**
		 * Check to determine whether a state is registered in the animation set under the given name.
		 *
		 * @param stateName The name of the animation state object to be checked.
		 */
		hasAnimation(name:string):boolean;

		/**
		 * Retrieves the animation state object registered in the animation data set under the given name.
		 *
		 * @param stateName The name of the animation state object to be retrieved.
		 */
		getAnimation(name:string):AnimationNodeBase;

		/**
		 * Indicates whether the properties of the animation data contained within the set combined with
		 * the vertex registers aslready in use on shading materials allows the animation data to utilise
		 * GPU calls.
		 */
		usesCPU:boolean; // GET

		/**
		 * Called by the material to reset the GPU indicator before testing whether register space in the shader
		 * is available for running GPU-based animation code.
		 *
		 * @private
		 */
		resetGPUCompatibility();

		/**
		 * Called by the animator to void the GPU indicator when register space in the shader
		 * is no longer available for running GPU-based animation code.
		 *
		 * @private
		 */
		cancelGPUCompatibility();

		/**
		 * Generates the AGAL Vertex code for the animation, tailored to the material pass's requirements.
		 *
		 * @param pass The MaterialPassBase object to whose vertex code the animation's code will be prepended.
		 * @sourceRegisters The animatable attribute registers of the material pass.
		 * @targetRegisters The animatable target registers of the material pass.
		 * @return The AGAL Vertex code that animates the vertex data.
		 *
		 * @private
		 */
		getAGALVertexCode(pass:away.materials.MaterialPassBase, sourceRegisters:string[], targetRegisters:string[], profile:string):string;

		/**
		 * Generates the AGAL Fragment code for the animation, tailored to the material pass's requirements.
		 *
		 * @param pass The MaterialPassBase object to whose vertex code the animation's code will be prepended.
		 * @return The AGAL Vertex code that animates the vertex data.
		 *
		 * @private
		 */
		getAGALFragmentCode(pass:away.materials.MaterialPassBase, shadedTarget:string, profile:string):string;

		/**
		 * Generates the extra AGAL Fragment code for the animation when UVs are required, tailored to the material pass's requirements.
		 *
		 * @param pass The MaterialPassBase object to whose vertex code the animation's code will be prepended.
		 * @param UVSource String representing the UV source register.
		 * @param UVTarget String representing the UV target register.
		 * @return The AGAL UV code that animates the UV data.
		 *
		 * @private
		 */
		getAGALUVCode(pass:away.materials.MaterialPassBase, UVSource:string, UVTarget:string):string;

		/**
		 * Resets any constants used in the creation of AGAL for the vertex and fragment shaders.
		 *
		 * @param pass The material pass currently being used to render the geometry.
		 *
		 * @private
		 */
		doneAGALCode(pass:away.materials.MaterialPassBase);

		/**
		 * Sets the GPU render state required by the animation that is independent of the rendered mesh.
		 *
		 * @param stageGL The proxy currently performing the rendering.
		 * @param pass The material pass currently being used to render the geometry.
		 *
		 * @private
		 */
		activate(stageGL:away.base.StageGL, pass:away.materials.MaterialPassBase)

		/**
		 * Clears the GPU render state that has been set by the current animation.
		 *
		 * @param stageGL The proxy currently performing the rendering.
		 * @param pass The material pass currently being used to render the geometry.
		 *
		 * @private
		 */
		deactivate(stageGL:away.base.StageGL, pass:away.materials.MaterialPassBase)
	}
}
