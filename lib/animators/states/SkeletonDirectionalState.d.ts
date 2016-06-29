import { AnimatorBase } from "../../animators/AnimatorBase";
import { Skeleton } from "../../animators/data/Skeleton";
import { SkeletonPose } from "../../animators/data/SkeletonPose";
import { SkeletonDirectionalNode } from "../../animators/nodes/SkeletonDirectionalNode";
import { AnimationStateBase } from "../../animators/states/AnimationStateBase";
import { ISkeletonAnimationState } from "../../animators/states/ISkeletonAnimationState";
/**
 *
 */
export declare class SkeletonDirectionalState extends AnimationStateBase implements ISkeletonAnimationState {
    private _skeletonAnimationNode;
    private _skeletonPose;
    private _skeletonPoseDirty;
    private _inputA;
    private _inputB;
    private _blendWeight;
    private _direction;
    private _blendDirty;
    private _forward;
    private _backward;
    private _left;
    private _right;
    /**
     * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
     * used to produce the skeleton pose output.
     */
    direction: number;
    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDirectionalNode);
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
     * @inheritDoc
     */
    _pUpdatePositionDelta(): void;
    /**
     * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    private updateSkeletonPose(skeleton);
    /**
     * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
     *
     * @private
     */
    private updateBlend();
}
