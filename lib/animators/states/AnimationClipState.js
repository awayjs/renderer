"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
var AnimationStateEvent_1 = require("../../events/AnimationStateEvent");
/**
 *
 */
var AnimationClipState = (function (_super) {
    __extends(AnimationClipState, _super);
    function AnimationClipState(animator, animationClipNode) {
        _super.call(this, animator, animationClipNode);
        this._pFramesDirty = true;
        this._animationClipNode = animationClipNode;
    }
    Object.defineProperty(AnimationClipState.prototype, "blendWeight", {
        /**
         * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
         * between the current frame (0) and next frame (1) of the animation.
         *
         * @see #currentFrame
         * @see #nextFrame
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pBlendWeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipState.prototype, "currentFrame", {
        /**
         * Returns the current frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pCurrentFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipState.prototype, "nextFrame", {
        /**
         * Returns the next frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pNextFrame;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype.update = function (time) {
        if (!this._animationClipNode.looping) {
            if (time > this._pStartTime + this._animationClipNode.totalDuration)
                time = this._pStartTime + this._animationClipNode.totalDuration;
            else if (time < this._pStartTime)
                time = this._pStartTime;
        }
        if (this._pTime == time - this._pStartTime)
            return;
        this._pUpdateTime(time);
    };
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype.phase = function (value) {
        var time = value * this._animationClipNode.totalDuration + this._pStartTime;
        if (this._pTime == time - this._pStartTime)
            return;
        this._pUpdateTime(time);
    };
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype._pUpdateTime = function (time) {
        this._pFramesDirty = true;
        this._pTimeDir = (time - this._pStartTime > this._pTime) ? 1 : -1;
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
     *
     * @see #currentFrame
     * @see #nextFrame
     * @see #blendWeight
     */
    AnimationClipState.prototype._pUpdateFrames = function () {
        this._pFramesDirty = false;
        var looping = this._animationClipNode.looping;
        var totalDuration = this._animationClipNode.totalDuration;
        var lastFrame = this._animationClipNode.lastFrame;
        var time = this._pTime;
        //trace("time", time, totalDuration)
        if (looping && (time >= totalDuration || time < 0)) {
            time %= totalDuration;
            if (time < 0)
                time += totalDuration;
        }
        if (!looping && time >= totalDuration) {
            this.notifyPlaybackComplete();
            this._pCurrentFrame = lastFrame;
            this._pNextFrame = lastFrame;
            this._pBlendWeight = 0;
        }
        else if (!looping && time <= 0) {
            this._pCurrentFrame = 0;
            this._pNextFrame = 0;
            this._pBlendWeight = 0;
        }
        else if (this._animationClipNode.fixedFrameRate) {
            var t = time / totalDuration * lastFrame;
            this._pCurrentFrame = Math.floor(t);
            this._pBlendWeight = t - this._pCurrentFrame;
            this._pNextFrame = this._pCurrentFrame + 1;
        }
        else {
            this._pCurrentFrame = 0;
            this._pNextFrame = 0;
            var dur = 0, frameTime;
            var durations = this._animationClipNode.durations;
            do {
                frameTime = dur;
                dur += durations[this._pNextFrame];
                this._pCurrentFrame = this._pNextFrame++;
            } while (time > dur);
            if (this._pCurrentFrame == lastFrame) {
                this._pCurrentFrame = 0;
                this._pNextFrame = 1;
            }
            this._pBlendWeight = (time - frameTime) / durations[this._pCurrentFrame];
        }
    };
    AnimationClipState.prototype.notifyPlaybackComplete = function () {
        if (this._animationStatePlaybackComplete == null)
            this._animationStatePlaybackComplete = new AnimationStateEvent_1.AnimationStateEvent(AnimationStateEvent_1.AnimationStateEvent.PLAYBACK_COMPLETE, this._pAnimator, this, this._animationClipNode);
        this._animationClipNode.dispatchEvent(this._animationStatePlaybackComplete);
    };
    return AnimationClipState;
}(AnimationStateBase_1.AnimationStateBase));
exports.AnimationClipState = AnimationClipState;
