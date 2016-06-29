import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { SkeletonNaryLERPState } from "../../animators/states/SkeletonNaryLERPState";
/**
 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
export declare class SkeletonNaryLERPNode extends AnimationNodeBase {
    _iInputs: Array<AnimationNodeBase>;
    private _numInputs;
    readonly numInputs: number;
    /**
     * Creates a new <code>SkeletonNaryLERPNode</code> object.
     */
    constructor();
    /**
     * Returns an integer representing the input index of the given skeleton animation node.
     *
     * @param input The skeleton animation node for with the input index is requested.
     */
    getInputIndex(input: AnimationNodeBase): number;
    /**
     * Returns the skeleton animation node object that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node is requested.
     */
    getInputAt(index: number): AnimationNodeBase;
    /**
     * Adds a new skeleton animation node input to the animation node.
     */
    addInput(input: AnimationNodeBase): void;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): SkeletonNaryLERPState;
}
export default SkeletonNaryLERPNode;
