import {AnimationNodeBase} from "@awayjs/graphics";

import {SkeletonBinaryLERPState} from "../states/SkeletonBinaryLERPState";

import {AnimatorBase} from "../AnimatorBase";

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