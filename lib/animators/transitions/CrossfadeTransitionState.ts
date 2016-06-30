import {AnimatorBase}						from "../../animators/AnimatorBase";
import {SkeletonBinaryLERPNode}			from "../../animators/nodes/SkeletonBinaryLERPNode";
import {SkeletonBinaryLERPState}			from "../../animators/states/SkeletonBinaryLERPState";
import {CrossfadeTransitionNode}			from "../../animators/transitions/CrossfadeTransitionNode";
import {AnimationStateEvent}				from "../../animators/../events/AnimationStateEvent";

/**
 *
 */
export class CrossfadeTransitionState extends SkeletonBinaryLERPState
{
	private _crossfadeTransitionNode:CrossfadeTransitionNode;
	private _animationStateTransitionComplete:AnimationStateEvent;

	constructor(animator:AnimatorBase, skeletonAnimationNode:CrossfadeTransitionNode)
	{
		super(animator, <SkeletonBinaryLERPNode> skeletonAnimationNode);

		this._crossfadeTransitionNode = skeletonAnimationNode;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateTime(time:number):void
	{
		this.blendWeight = Math.abs(time - this._crossfadeTransitionNode.startBlend)/(1000*this._crossfadeTransitionNode.blendSpeed);

		if (this.blendWeight >= 1) {
			this.blendWeight = 1;

			if (this._animationStateTransitionComplete == null)
				this._animationStateTransitionComplete = new AnimationStateEvent(AnimationStateEvent.TRANSITION_COMPLETE, this._pAnimator, this, this._crossfadeTransitionNode);

			this._crossfadeTransitionNode.dispatchEvent(this._animationStateTransitionComplete);
		}

		super._pUpdateTime(time);
	}
}