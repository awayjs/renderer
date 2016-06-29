"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Quaternion_1 = require("@awayjs/core/lib/geom/Quaternion");
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDifferenceState = (function (_super) {
    __extends(SkeletonDifferenceState, _super);
    function SkeletonDifferenceState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose_1.SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._baseInput = animator.getAnimationState(this._skeletonAnimationNode.baseInput);
        this._differenceInput = animator.getAnimationState(this._skeletonAnimationNode.differenceInput);
    }
    Object.defineProperty(SkeletonDifferenceState.prototype, "blendWeight", {
        /**
         * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
         * used to produce the skeleton pose output.
         *
         * @see #baseInput
         * @see #differenceInput
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
    SkeletonDifferenceState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._baseInput.phase(value);
        this._baseInput.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype._pUpdateTime = function (time) {
        this._skeletonPoseDirty = true;
        this._baseInput.update(time);
        this._differenceInput.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonDifferenceState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var deltA = this._baseInput.positionDelta;
        var deltB = this._differenceInput.positionDelta;
        this.positionDelta.x = deltA.x + this._blendWeight * deltB.x;
        this.positionDelta.y = deltA.y + this._blendWeight * deltB.y;
        this.positionDelta.z = deltA.z + this._blendWeight * deltB.z;
    };
    /**
     * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonDifferenceState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var basePoses = this._baseInput.getSkeletonPose(skeleton).jointPoses;
        var diffPoses = this._differenceInput.getSkeletonPose(skeleton).jointPoses;
        var base, diff;
        var basePos, diffPos;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose_1.JointPose();
            base = basePoses[i];
            diff = diffPoses[i];
            basePos = base.translation;
            diffPos = diff.translation;
            SkeletonDifferenceState._tempQuat.multiply(diff.orientation, base.orientation);
            endPose.orientation.lerp(base.orientation, SkeletonDifferenceState._tempQuat, this._blendWeight);
            tr = endPose.translation;
            tr.x = basePos.x + this._blendWeight * diffPos.x;
            tr.y = basePos.y + this._blendWeight * diffPos.y;
            tr.z = basePos.z + this._blendWeight * diffPos.z;
        }
    };
    SkeletonDifferenceState._tempQuat = new Quaternion_1.Quaternion();
    return SkeletonDifferenceState;
}(AnimationStateBase_1.AnimationStateBase));
exports.SkeletonDifferenceState = SkeletonDifferenceState;
