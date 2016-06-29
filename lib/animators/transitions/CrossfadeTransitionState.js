"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SkeletonBinaryLERPState_1 = require("../../animators/states/SkeletonBinaryLERPState");
var AnimationStateEvent_1 = require("../../animators/../events/AnimationStateEvent");
/**
 *
 */
var CrossfadeTransitionState = (function (_super) {
    __extends(CrossfadeTransitionState, _super);
    function CrossfadeTransitionState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._crossfadeTransitionNode = skeletonAnimationNode;
    }
    /**
     * @inheritDoc
     */
    CrossfadeTransitionState.prototype._pUpdateTime = function (time) {
        this.blendWeight = Math.abs(time - this._crossfadeTransitionNode.startBlend) / (1000 * this._crossfadeTransitionNode.blendSpeed);
        if (this.blendWeight >= 1) {
            this.blendWeight = 1;
            if (this._animationStateTransitionComplete == null)
                this._animationStateTransitionComplete = new AnimationStateEvent_1.AnimationStateEvent(AnimationStateEvent_1.AnimationStateEvent.TRANSITION_COMPLETE, this._pAnimator, this, this._crossfadeTransitionNode);
            this._crossfadeTransitionNode.dispatchEvent(this._animationStateTransitionComplete);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    return CrossfadeTransitionState;
}(SkeletonBinaryLERPState_1.SkeletonBinaryLERPState));
exports.CrossfadeTransitionState = CrossfadeTransitionState;
