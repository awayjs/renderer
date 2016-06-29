import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { IAnimationTransition } from "../../animators/transitions/IAnimationTransition";
/**
 *
 */
export declare class CrossfadeTransition implements IAnimationTransition {
    blendSpeed: number;
    constructor(blendSpeed: number);
    getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startBlend: number): AnimationNodeBase;
}
