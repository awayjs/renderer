import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import AnimationNodeBase				= require("awayjs-display/lib/animators/nodes/AnimationNodeBase");

import AnimatorBase						= require("awayjs-stagegl/lib/animators/AnimatorBase");

import SkeletonBinaryLERPState			= require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");

/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
class SkeletonBinaryLERPNode extends AnimationNodeBase
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

export = SkeletonBinaryLERPNode;