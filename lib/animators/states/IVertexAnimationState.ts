import {Graphics}							from "@awayjs/display/lib/graphics/Graphics";

import {IAnimationState}					from "../../animators/states/IAnimationState";

/**
 * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
 *
 * @see away.animators.VertexAnimator
 */
export interface IVertexAnimationState extends IAnimationState
{
	/**
	 * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	 */
	currentGraphics:Graphics; //GET

	/**
	 * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	 */
	nextGraphics:Graphics; //GET

	/**
	 * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	 * between the current geometry frame (0) and next geometry frame (1) of the animation.
	 */
	blendWeight:number; //GET
}