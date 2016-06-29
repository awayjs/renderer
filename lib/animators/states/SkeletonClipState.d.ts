import { AnimatorBase } from "../../animators/AnimatorBase";
import { Skeleton } from "../../animators/data/Skeleton";
import { SkeletonPose } from "../../animators/data/SkeletonPose";
import { SkeletonClipNode } from "../../animators/nodes/SkeletonClipNode";
import { AnimationClipState } from "../../animators/states/AnimationClipState";
import { ISkeletonAnimationState } from "../../animators/states/ISkeletonAnimationState";
/**
 *
 */
export declare class SkeletonClipState extends AnimationClipState implements ISkeletonAnimationState {
    private _rootPos;
    private _frames;
    private _skeletonClipNode;
    private _skeletonPose;
    private _skeletonPoseDirty;
    private _currentPose;
    private _nextPose;
    /**
     * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
     */
    readonly currentPose: SkeletonPose;
    /**
     * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
     */
    readonly nextPose: SkeletonPose;
    constructor(animator: AnimatorBase, skeletonClipNode: SkeletonClipNode);
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
    /**
     * @inheritDoc
     */
    _pUpdateTime(time: number): void;
    /**
     * @inheritDoc
     */
    _pUpdateFrames(): void;
    /**
     * Updates the output skeleton pose of the node based on the internal playhead position.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    private updateSkeletonPose(skeleton);
    /**
     * @inheritDoc
     */
    _pUpdatePositionDelta(): void;
}
