///<reference path="../_definitions.ts"/>
module away.animators
{
	//import away3d.animators.nodes.*;
	//import away3d.animators.states.*;
	//import away3d.cameras.Camera3D;
	//import away3d.core.base.*;
	//import away3d.managers.*;
	//import away3d.entities.*;
	//import away3d.materials.passes.*;
	
	/**
	 * Provides an interface for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
	 *
	 * @see away3d.animators.IAnimationSet
	 */
	public interface IAnimator
	{
		/**
		 * Returns the animation data set in use by the animator.
		 */
		animationSet:away.animators.IAnimationSet; //GET
		
		/**
		 * Sets the GPU render state required by the animation that is dependent of the rendered object.
		 *
		 * @param stage3DProxy The Stage3DProxy object which is currently being used for rendering.
		 * @param renderable The object currently being rendered.
		 * @param vertexConstantOffset The first available vertex register to write data to if running on the gpu.
		 * @param vertexStreamOffset The first available vertex stream to write vertex data to if running on the gpu.
		 */
		setRenderState(stage3DProxy:away.managers.Stage3DProxy, renderable:away.base.IRenderable, vertexConstantOffset:number, vertexStreamOffset:number, camera:away.cameras.Camera3D)
		
		/**
		 * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
		 * Needs to be called if gpu code is potentially required.
		 */
		testGPUCompatibility(pass:away.materials.MaterialPassBase);
		
		/**
		 * Used by the mesh object to which the animator is applied, registers the owner for internal use.
		 *
		 * @private
		 */
		addOwner(mesh:away.entities.Mesh)
		
		/**
		 * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
		 *
		 * @private
		 */
		removeOwner(mesh:away.entities.Mesh)
		
		getAnimationState(node:AnimationNodeBase):away.animators.AnimationStateBase;
		
		getAnimationStateByName(name:string):away.animators.AnimationStateBase;
		
		/**
		 * Returns a shallow clone (re-using the same IAnimationSet) of this IAnimator.
		 */
		clone():away.animators.IAnimator;
		
		dispose();
	}
}
