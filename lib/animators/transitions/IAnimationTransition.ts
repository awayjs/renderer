import {AnimationNodeBase}				from "@awayjs/graphics/lib/animators/nodes/AnimationNodeBase";

import {AnimatorBase}						from "../../animators/AnimatorBase";

/**
 *
 */
export interface IAnimationTransition
{
	getAnimationNode(animator:AnimatorBase, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startTime:number):AnimationNodeBase
}