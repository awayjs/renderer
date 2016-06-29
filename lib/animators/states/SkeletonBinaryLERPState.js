"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonBinaryLERPState = (function (_super) {
    __extends(SkeletonBinaryLERPState, _super);
    function SkeletonBinaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose_1.SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._inputA = animator.getAnimationState(this._skeletonAnimationNode.inputA);
        this._inputB = animator.getAnimationState(this._skeletonAnimationNode.inputB);
    }
    Object.defineProperty(SkeletonBinaryLERPState.prototype, "blendWeight", {
        /**
         * Defines a fractional value between 0 and 1 representing the blending ratio between inputA (0) and inputB (1),
         * used to produce the skeleton pose output.
         *
         * @see inputA
         * @see inputB
         */
        get: function () {
            return this._blendWeight;
        },
        set: function (value) {
            this._blendWeight = value;
            this._pPositionDeltaDirty = true;
            this._skeletonPoseDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._inputA.phase(value);
        this._inputB.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPState.prototype._pUpdateTime = function (time) {
        this._skeletonPoseDirty = true;
        this._inputA.update(time);
        this._inputB.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonBinaryLERPState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var deltA = this._inputA.positionDelta;
        var deltB = this._inputB.positionDelta;
        this._pRootDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
        this._pRootDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
        this._pRootDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
    };
    /**
     * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonBinaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var poses1 = this._inputA.getSkeletonPose(skeleton).jointPoses;
        var poses2 = this._inputB.getSkeletonPose(skeleton).jointPoses;
        var pose1, pose2;
        var p1, p2;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose_1.JointPose();
            pose1 = poses1[i];
            pose2 = poses2[i];
            p1 = pose1.translation;
            p2 = pose2.translation;
            endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);
            tr = endPose.translation;
            tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
            tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
            tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
        }
    };
    return SkeletonBinaryLERPState;
}(AnimationStateBase_1.AnimationStateBase));
exports.SkeletonBinaryLERPState = SkeletonBinaryLERPState;
