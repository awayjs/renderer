import {AnimationNodeBase} from "@awayjs/graphics";

import {AnimatorBase} from "../AnimatorBase";

/**
 *
 */
export interface IAnimationTransition
{
	getAnimationNode(animator:AnimatorBase, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startTime:number):AnimationNodeBase
}