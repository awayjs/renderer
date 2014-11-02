import Geometry							= require("awayjs-display/lib/base/Geometry");

import IAnimationState					= require("awayjs-renderergl/lib/animators/states/IAnimationState");

/**
 * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
 *
 * @see away.animators.VertexAnimator
 */
interface IVertexAnimationState extends IAnimationState
{
	/**
	 * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	 */
	currentGeometry:Geometry; //GET

	/**
	 * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	 */
	nextGeometry:Geometry; //GET

	/**
	 * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	 * between the current geometry frame (0) and next geometry frame (1) of the animation.
	 */
	blendWeight:number; //GET
}

export = IVertexAnimationState;