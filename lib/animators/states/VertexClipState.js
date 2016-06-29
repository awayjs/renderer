"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationClipState_1 = require("../../animators/states/AnimationClipState");
/**
 *
 */
var VertexClipState = (function (_super) {
    __extends(VertexClipState, _super);
    function VertexClipState(animator, vertexClipNode) {
        _super.call(this, animator, vertexClipNode);
        this._vertexClipNode = vertexClipNode;
        this._frames = this._vertexClipNode.frames;
    }
    Object.defineProperty(VertexClipState.prototype, "currentGraphics", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._currentGraphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexClipState.prototype, "nextGraphics", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._nextGraphics;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdateFrames = function () {
        _super.prototype._pUpdateFrames.call(this);
        this._currentGraphics = this._frames[this._pCurrentFrame];
        if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
            this._nextGraphics = this._frames[0];
            this._pAnimator.dispatchCycleEvent();
        }
        else
            this._nextGraphics = this._frames[this._pNextFrame];
    };
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdatePositionDelta = function () {
        //TODO:implement positiondelta functionality for vertex animations
    };
    return VertexClipState;
}(AnimationClipState_1.AnimationClipState));
exports.VertexClipState = VertexClipState;
