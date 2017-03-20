import {AnimationNodeBase} from "@awayjs/graphics";

import {AnimatorBase} from "@awayjs/stage";

/**
 *
 */
export interface IAnimationTransition
{
	getAnimationNode(animator:AnimatorBase, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startTime:number):AnimationNodeBase
}