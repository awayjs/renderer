"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationClipState_1 = require("../../animators/states/AnimationClipState");
/**
 *
 */
var SkeletonClipState = (function (_super) {
    __extends(SkeletonClipState, _super);
    function SkeletonClipState(animator, skeletonClipNode) {
        _super.call(this, animator, skeletonClipNode);
        this._rootPos = new Vector3D_1.Vector3D();
        this._skeletonPose = new SkeletonPose_1.SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonClipNode = skeletonClipNode;
        this._frames = this._skeletonClipNode.frames;
    }
    Object.defineProperty(SkeletonClipState.prototype, "currentPose", {
        /**
         * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._currentPose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonClipState.prototype, "nextPose", {
        /**
         * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._nextPose;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonClipState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonClipState.prototype._pUpdateTime = function (time) {
        this._skeletonPoseDirty = true;
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * @inheritDoc
     */
    SkeletonClipState.prototype._pUpdateFrames = function () {
        _super.prototype._pUpdateFrames.call(this);
        this._currentPose = this._frames[this._pCurrentFrame];
        if (this._skeletonClipNode.looping && this._pNextFrame >= this._skeletonClipNode.lastFrame) {
            this._nextPose = this._frames[0];
            this._pAnimator.dispatchCycleEvent();
        }
        else
            this._nextPose = this._frames[this._pNextFrame];
    };
    /**
     * Updates the output skeleton pose of the node based on the internal playhead position.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonClipState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        if (!this._skeletonClipNode.totalDuration)
            return;
        if (this._pFramesDirty)
            this._pUpdateFrames();
        var currentPose = this._currentPose.jointPoses;
        var nextPose = this._nextPose.jointPoses;
        var numJoints = skeleton.numJoints;
        var p1, p2;
        var pose1, pose2;
        var endPoses = this._skeletonPose.jointPoses;
        var endPose;
        var tr;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        if ((numJoints != currentPose.length) || (numJoints != nextPose.length))
            throw new Error("joint counts don't match!");
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose_1.JointPose();
            pose1 = currentPose[i];
            pose2 = nextPose[i];
            p1 = pose1.translation;
            p2 = pose2.translation;
            if (this._skeletonClipNode.highQuality)
                endPose.orientation.slerp(pose1.orientation, pose2.orientation, this._pBlendWeight);
            else
                endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._pBlendWeight);
            if (i > 0) {
                tr = endPose.translation;
                tr.x = p1.x + this._pBlendWeight * (p2.x - p1.x);
                tr.y = p1.y + this._pBlendWeight * (p2.y - p1.y);
                tr.z = p1.z + this._pBlendWeight * (p2.z - p1.z);
            }
        }
    };
    /**
     * @inheritDoc
     */
    SkeletonClipState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        if (this._pFramesDirty)
            this._pUpdateFrames();
        var p1, p2, p3;
        var totalDelta = this._skeletonClipNode.totalDelta;
        // jumping back, need to reset position
        if ((this._pTimeDir > 0 && this._pNextFrame < this._pOldFrame) || (this._pTimeDir < 0 && this._pNextFrame > this._pOldFrame)) {
            this._rootPos.x -= totalDelta.x * this._pTimeDir;
            this._rootPos.y -= totalDelta.y * this._pTimeDir;
            this._rootPos.z -= totalDelta.z * this._pTimeDir;
        }
        var dx = this._rootPos.x;
        var dy = this._rootPos.y;
        var dz = this._rootPos.z;
        if (this._skeletonClipNode.stitchFinalFrame && this._pNextFrame == this._skeletonClipNode.lastFrame) {
            p1 = this._frames[0].jointPoses[0].translation;
            p2 = this._frames[1].jointPoses[0].translation;
            p3 = this._currentPose.jointPoses[0].translation;
            this._rootPos.x = p3.x + p1.x + this._pBlendWeight * (p2.x - p1.x);
            this._rootPos.y = p3.y + p1.y + this._pBlendWeight * (p2.y - p1.y);
            this._rootPos.z = p3.z + p1.z + this._pBlendWeight * (p2.z - p1.z);
        }
        else {
            p1 = this._currentPose.jointPoses[0].translation;
            p2 = this._frames[this._pNextFrame].jointPoses[0].translation; //cover the instances where we wrap the pose but still want the final frame translation values
            this._rootPos.x = p1.x + this._pBlendWeight * (p2.x - p1.x);
            this._rootPos.y = p1.y + this._pBlendWeight * (p2.y - p1.y);
            this._rootPos.z = p1.z + this._pBlendWeight * (p2.z - p1.z);
        }
        this._pRootDelta.x = this._rootPos.x - dx;
        this._pRootDelta.y = this._rootPos.y - dy;
        this._pRootDelta.z = this._rootPos.z - dz;
        this._pOldFrame = this._pNextFrame;
    };
    return SkeletonClipState;
}(AnimationClipState_1.AnimationClipState));
exports.SkeletonClipState = SkeletonClipState;
