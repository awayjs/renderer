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
var SkeletonDirectionalState = (function (_super) {
    __extends(SkeletonDirectionalState, _super);
    function SkeletonDirectionalState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose_1.SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeight = 0;
        this._direction = 0;
        this._blendDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._forward = animator.getAnimationState(this._skeletonAnimationNode.forward);
        this._backward = animator.getAnimationState(this._skeletonAnimationNode.backward);
        this._left = animator.getAnimationState(this._skeletonAnimationNode.left);
        this._right = animator.getAnimationState(this._skeletonAnimationNode.right);
    }
    Object.defineProperty(SkeletonDirectionalState.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        /**
         * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
         * used to produce the skeleton pose output.
         */
        set: function (value) {
            if (this._direction == value)
                return;
            this._direction = value;
            this._blendDirty = true;
            this._skeletonPoseDirty = true;
            this._pPositionDeltaDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype.phase = function (value) {
        if (this._blendDirty)
            this.updateBlend();
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._inputA.phase(value);
        this._inputB.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype._pUdateTime = function (time) {
        if (this._blendDirty)
            this.updateBlend();
        this._skeletonPoseDirty = true;
        this._inputA.update(time);
        this._inputB.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonDirectionalState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        if (this._blendDirty)
            this.updateBlend();
        var deltA = this._inputA.positionDelta;
        var deltB = this._inputB.positionDelta;
        this.positionDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
        this.positionDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
        this.positionDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
    };
    /**
     * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonDirectionalState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        if (this._blendDirty)
            this.updateBlend();
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
    /**
     * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
     *
     * @private
     */
    SkeletonDirectionalState.prototype.updateBlend = function () {
        this._blendDirty = false;
        if (this._direction < 0 || this._direction > 360) {
            this._direction %= 360;
            if (this._direction < 0)
                this._direction += 360;
        }
        if (this._direction < 90) {
            this._inputA = this._forward;
            this._inputB = this._right;
            this._blendWeight = this._direction / 90;
        }
        else if (this._direction < 180) {
            this._inputA = this._right;
            this._inputB = this._backward;
            this._blendWeight = (this._direction - 90) / 90;
        }
        else if (this._direction < 270) {
            this._inputA = this._backward;
            this._inputB = this._left;
            this._blendWeight = (this._direction - 180) / 90;
        }
        else {
            this._inputA = this._left;
            this._inputB = this._forward;
            this._blendWeight = (this._direction - 270) / 90;
        }
    };
    return SkeletonDirectionalState;
}(AnimationStateBase_1.AnimationStateBase));
exports.SkeletonDirectionalState = SkeletonDirectionalState;
