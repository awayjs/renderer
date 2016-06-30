import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {SkeletonBinaryLERPState}			from "../../animators/states/SkeletonBinaryLERPState";

/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
export class SkeletonBinaryLERPNode extends AnimationNodeBase
{
	/**
	 * Defines input node A to use for the blended output.
	 */
	public inputA:AnimationNodeBase;

	/**
	 * Defines input node B to use for the blended output.
	 */
	public inputB:AnimationNodeBase;

	/**
	 * Creates a new <code>SkeletonBinaryLERPNode</code> object.
	 */
	constructor()
	{
		super();

		this._pStateClass = SkeletonBinaryLERPState;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):SkeletonBinaryLERPState
	{
		return <SkeletonBinaryLERPState> animator.getAnimationState(this);
	}
}