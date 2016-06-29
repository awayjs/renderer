import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { SkeletonDifferenceState } from "../../animators/states/SkeletonDifferenceState";
/**
 * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
 */
export declare class SkeletonDifferenceNode extends AnimationNodeBase {
    /**
     * Defines a base input node to use for the blended output.
     */
    baseInput: AnimationNodeBase;
    /**
     * Defines a difference input node to use for the blended output.
     */
    differenceInput: AnimationNodeBase;
    /**
     * Creates a new <code>SkeletonAdditiveNode</code> object.
     */
    constructor();
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): SkeletonDifferenceState;
}
export default SkeletonDifferenceNode;
