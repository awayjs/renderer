import { AnimatorBase } from "../../animators/AnimatorBase";
import { Skeleton } from "../../animators/data/Skeleton";
import { SkeletonPose } from "../../animators/data/SkeletonPose";
import { SkeletonNaryLERPNode } from "../../animators/nodes/SkeletonNaryLERPNode";
import { AnimationStateBase } from "../../animators/states/AnimationStateBase";
import { ISkeletonAnimationState } from "../../animators/states/ISkeletonAnimationState";
/**
 *
 */
export declare class SkeletonNaryLERPState extends AnimationStateBase implements ISkeletonAnimationState {
    private _skeletonAnimationNode;
    private _skeletonPose;
    private _skeletonPoseDirty;
    private _blendWeights;
    private _inputs;
    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonNaryLERPNode);
    /**
     * @inheritDoc
     */
    phase(value: number): void;
    /**
     * @inheritDoc
     */
    _pUdateTime(time: number): void;
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
    /**
     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node blend weight is requested.
     */
    getBlendWeightAt(index: number): number;
    /**
     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index on which the skeleton animation node blend weight is to be set.
     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
     */
    setBlendWeightAt(index: number, blendWeight: number): void;
    /**
     * @inheritDoc
     */
    _pUpdatePositionDelta(): void;
    /**
     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    private updateSkeletonPose(skeleton);
}
