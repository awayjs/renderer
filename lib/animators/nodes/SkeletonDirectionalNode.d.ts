import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { SkeletonDirectionalState } from "../../animators/states/SkeletonDirectionalState";
/**
 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
 */
export declare class SkeletonDirectionalNode extends AnimationNodeBase {
    /**
     * Defines the forward configured input node to use for the blended output.
     */
    forward: AnimationNodeBase;
    /**
     * Defines the backwards configured input node to use for the blended output.
     */
    backward: AnimationNodeBase;
    /**
     * Defines the left configured input node to use for the blended output.
     */
    left: AnimationNodeBase;
    /**
     * Defines the right configured input node to use for the blended output.
     */
    right: AnimationNodeBase;
    constructor();
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): SkeletonDirectionalState;
}
