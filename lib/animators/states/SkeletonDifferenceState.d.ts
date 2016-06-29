import { AnimatorBase } from "../../animators/AnimatorBase";
import { Skeleton } from "../../animators/data/Skeleton";
import { SkeletonPose } from "../../animators/data/SkeletonPose";
import { SkeletonDifferenceNode } from "../../animators/nodes/SkeletonDifferenceNode";
import { AnimationStateBase } from "../../animators/states/AnimationStateBase";
import { ISkeletonAnimationState } from "../../animators/states/ISkeletonAnimationState";
/**
 *
 */
export declare class SkeletonDifferenceState extends AnimationStateBase implements ISkeletonAnimationState {
    private _blendWeight;
    private static _tempQuat;
    private _skeletonAnimationNode;
    private _skeletonPose;
    private _skeletonPoseDirty;
    private _baseInput;
    private _differenceInput;
    /**
     * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
     * used to produce the skeleton pose output.
     *
     * @see #baseInput
     * @see #differenceInput
     */
    blendWeight: number;
    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDifferenceNode);
    /**
     * @inheritDoc
     */
    phase(value: number): void;
    /**
     * @inheritDoc
     */
    _pUpdateTime(time: number): void;
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
    /**
     * @inheritDoc
     */
    _pUpdatePositionDelta(): void;
    /**
     * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    private updateSkeletonPose(skeleton);
}
