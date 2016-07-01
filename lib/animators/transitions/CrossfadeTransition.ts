import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {CrossfadeTransitionNode}			from "../../animators/transitions/CrossfadeTransitionNode";
import {IAnimationTransition}				from "../../animators/transitions/IAnimationTransition";

/**
 *
 */
export class CrossfadeTransition implements IAnimationTransition
{
	public blendSpeed:number = 0.5;

	constructor(blendSpeed:number)
	{
		this.blendSpeed = blendSpeed;
	}

	public getAnimationNode(animator:AnimatorBase, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startBlend:number):AnimationNodeBase
	{
		var crossFadeTransitionNode:CrossfadeTransitionNode = new CrossfadeTransitionNode();
		crossFadeTransitionNode.inputA = startNode;
		crossFadeTransitionNode.inputB = endNode;
		crossFadeTransitionNode.blendSpeed = this.blendSpeed;
		crossFadeTransitionNode.startBlend = startBlend;

		return <AnimationNodeBase> crossFadeTransitionNode;
	}
}