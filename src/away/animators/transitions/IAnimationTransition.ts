///<reference path="../../_definitions.ts"/>

module away.animators
{
	export interface IAnimationTransition
	{
		getAnimationNode(animator:IAnimator, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startTime:number /*int*/):AnimationNodeBase
	}
}
