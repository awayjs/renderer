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
var SkeletonNaryLERPState = (function (_super) {
    __extends(SkeletonNaryLERPState, _super);
    function SkeletonNaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose_1.SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeights = new Array();
        this._inputs = new Array();
        this._skeletonAnimationNode = skeletonAnimationNode;
        var i = this._skeletonAnimationNode.numInputs;
        while (i--)
            this._inputs[i] = animator.getAnimationState(this._skeletonAnimationNode._iInputs[i]);
    }
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(value);
        }
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUdateTime = function (time) {
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(time);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonNaryLERPState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node blend weight is requested.
     */
    SkeletonNaryLERPState.prototype.getBlendWeightAt = function (index) {
        return this._blendWeights[index];
    };
    /**
     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index on which the skeleton animation node blend weight is to be set.
     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
     */
    SkeletonNaryLERPState.prototype.setBlendWeightAt = function (index, blendWeight) {
        this._blendWeights[index] = blendWeight;
        this._pPositionDeltaDirty = true;
        this._skeletonPoseDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var delta;
        var weight;
        this.positionDelta.x = 0;
        this.positionDelta.y = 0;
        this.positionDelta.z = 0;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (weight) {
                delta = this._inputs[j].positionDelta;
                this.positionDelta.x += weight * delta.x;
                this.positionDelta.y += weight * delta.y;
                this.positionDelta.z += weight * delta.z;
            }
        }
    };
    /**
     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonNaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var weight;
        var endPoses = this._skeletonPose.jointPoses;
        var poses;
        var endPose, pose;
        var endTr, tr;
        var endQuat, q;
        var firstPose;
        var i;
        var w0, x0, y0, z0;
        var w1, x1, y1, z1;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (!weight)
                continue;
            poses = this._inputs[j].getSkeletonPose(skeleton).jointPoses;
            if (!firstPose) {
                firstPose = poses;
                for (i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];
                    if (endPose == null)
                        endPose = endPoses[i] = new JointPose_1.JointPose();
                    pose = poses[i];
                    q = pose.orientation;
                    tr = pose.translation;
                    endQuat = endPose.orientation;
                    endQuat.x = weight * q.x;
                    endQuat.y = weight * q.y;
                    endQuat.z = weight * q.z;
                    endQuat.w = weight * q.w;
                    endTr = endPose.translation;
                    endTr.x = weight * tr.x;
                    endTr.y = weight * tr.y;
                    endTr.z = weight * tr.z;
                }
            }
            else {
                for (i = 0; i < skeleton.numJoints; ++i) {
                    endPose = endPoses[i];
                    pose = poses[i];
                    q = firstPose[i].orientation;
                    x0 = q.x;
                    y0 = q.y;
                    z0 = q.z;
                    w0 = q.w;
                    q = pose.orientation;
                    tr = pose.translation;
                    x1 = q.x;
                    y1 = q.y;
                    z1 = q.z;
                    w1 = q.w;
                    // find shortest direction
                    if (x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1 < 0) {
                        x1 = -x1;
                        y1 = -y1;
                        z1 = -z1;
                        w1 = -w1;
                    }
                    endQuat = endPose.orientation;
                    endQuat.x += weight * x1;
                    endQuat.y += weight * y1;
                    endQuat.z += weight * z1;
                    endQuat.w += weight * w1;
                    endTr = endPose.translation;
                    endTr.x += weight * tr.x;
                    endTr.y += weight * tr.y;
                    endTr.z += weight * tr.z;
                }
            }
        }
        for (i = 0; i < skeleton.numJoints; ++i)
            endPoses[i].orientation.normalize();
    };
    return SkeletonNaryLERPState;
}(AnimationStateBase_1.AnimationStateBase));
exports.SkeletonNaryLERPState = SkeletonNaryLERPState;
