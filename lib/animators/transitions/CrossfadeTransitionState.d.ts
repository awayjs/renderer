import { AnimatorBase } from "../../animators/AnimatorBase";
import { SkeletonBinaryLERPState } from "../../animators/states/SkeletonBinaryLERPState";
import { CrossfadeTransitionNode } from "../../animators/transitions/CrossfadeTransitionNode";
/**
 *
 */
export declare class CrossfadeTransitionState extends SkeletonBinaryLERPState {
    private _crossfadeTransitionNode;
    private _animationStateTransitionComplete;
    constructor(animator: AnimatorBase, skeletonAnimationNode: CrossfadeTransitionNode);
    /**
     * @inheritDoc
     */
    _pUpdateTime(time: number): void;
}
