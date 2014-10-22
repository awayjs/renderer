import AnimationNodeBase				= require("awayjs-core/lib/animators/nodes/AnimationNodeBase");

import AnimatorBase						= require("awayjs-stagegl/lib/animators/AnimatorBase");

import CrossfadeTransitionNode			= require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode");
import IAnimationTransition				= require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");

/**
 *
 */
class CrossfadeTransition implements IAnimationTransition
{
	public blendSpeed:number = 0.5;

	constructor(blendSpeed:number)
	{
		this.blendSpeed = blendSpeed;
	}

	public getAnimationNode(animator:AnimatorBase, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startBlend:number /*int*/):AnimationNodeBase
	{
		var crossFadeTransitionNode:CrossfadeTransitionNode = new CrossfadeTransitionNode();
		crossFadeTransitionNode.inputA = startNode;
		crossFadeTransitionNode.inputB = endNode;
		crossFadeTransitionNode.blendSpeed = this.blendSpeed;
		crossFadeTransitionNode.startBlend = startBlend;

		return <AnimationNodeBase> crossFadeTransitionNode;
	}
}

export = CrossfadeTransition;