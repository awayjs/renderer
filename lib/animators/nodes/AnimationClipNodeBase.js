"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var AnimationNodeBase_1 = require("@awayjs/display/lib/animators/nodes/AnimationNodeBase");
/**
 * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
 */
var AnimationClipNodeBase = (function (_super) {
    __extends(AnimationClipNodeBase, _super);
    /**
     * Creates a new <code>AnimationClipNodeBase</code> object.
     */
    function AnimationClipNodeBase() {
        _super.call(this);
        this._pLooping = true;
        this._pTotalDuration = 0;
        this._pStitchDirty = true;
        this._pStitchFinalFrame = false;
        this._pNumFrames = 0;
        this._pDurations = new Array();
        /*uint*/
        this._pTotalDelta = new Vector3D_1.Vector3D();
        this.fixedFrameRate = true;
    }
    Object.defineProperty(AnimationClipNodeBase.prototype, "looping", {
        /**
         * Determines whether the contents of the animation node have looping characteristics enabled.
         */
        get: function () {
            return this._pLooping;
        },
        set: function (value) {
            if (this._pLooping == value)
                return;
            this._pLooping = value;
            this._pStitchDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "stitchFinalFrame", {
        /**
         * Defines if looping content blends the final frame of animation data with the first (true) or works on the
         * assumption that both first and last frames are identical (false). Defaults to false.
         */
        get: function () {
            return this._pStitchFinalFrame;
        },
        set: function (value) {
            if (this._pStitchFinalFrame == value)
                return;
            this._pStitchFinalFrame = value;
            this._pStitchDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "totalDuration", {
        get: function () {
            if (this._pStitchDirty)
                this._pUpdateStitch();
            return this._pTotalDuration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "totalDelta", {
        get: function () {
            if (this._pStitchDirty)
                this._pUpdateStitch();
            return this._pTotalDelta;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "lastFrame", {
        get: function () {
            if (this._pStitchDirty)
                this._pUpdateStitch();
            return this._pLastFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "durations", {
        /**
         * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
         */
        get: function () {
            return this._pDurations;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the node's final frame stitch state.
     *
     * @see #stitchFinalFrame
     */
    AnimationClipNodeBase.prototype._pUpdateStitch = function () {
        this._pStitchDirty = false;
        this._pLastFrame = (this._pStitchFinalFrame) ? this._pNumFrames : this._pNumFrames - 1;
        this._pTotalDuration = 0;
        this._pTotalDelta.x = 0;
        this._pTotalDelta.y = 0;
        this._pTotalDelta.z = 0;
    };
    return AnimationClipNodeBase;
}(AnimationNodeBase_1.AnimationNodeBase));
exports.AnimationClipNodeBase = AnimationClipNodeBase;
