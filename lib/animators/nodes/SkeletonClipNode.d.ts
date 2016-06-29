import { AnimatorBase } from "../../animators/AnimatorBase";
import { SkeletonPose } from "../../animators/data/SkeletonPose";
import { AnimationClipNodeBase } from "../../animators/nodes/AnimationClipNodeBase";
import { SkeletonClipState } from "../../animators/states/SkeletonClipState";
/**
 * A skeleton animation node containing time-based animation data as individual skeleton poses.
 */
export declare class SkeletonClipNode extends AnimationClipNodeBase {
    private _frames;
    /**
     * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
     * of the output skeleton pose. Defaults to false.
     */
    highQuality: boolean;
    /**
     * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
     */
    readonly frames: Array<SkeletonPose>;
    /**
     * Creates a new <code>SkeletonClipNode</code> object.
     */
    constructor();
    /**
     * Adds a skeleton pose frame to the internal timeline of the animation node.
     *
     * @param skeletonPose The skeleton pose object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     */
    addFrame(skeletonPose: SkeletonPose, duration: number): void;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): SkeletonClipState;
    /**
     * @inheritDoc
     */
    _pUpdateStitch(): void;
}
