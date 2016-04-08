import AnimationNodeBase				from "awayjs-display/lib/animators/nodes/AnimationNodeBase";

import AnimatorBase						from "awayjs-renderergl/lib/animators/AnimatorBase";

/**
 *
 */
interface IAnimationTransition
{
	getAnimationNode(animator:AnimatorBase, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startTime:number /*int*/):AnimationNodeBase
}

export default IAnimationTransition;