var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
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
        this._pTotalDelta = new Vector3D();
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
})(AnimationNodeBase);
module.exports = AnimationClipNodeBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9ub2Rlcy9hbmltYXRpb25jbGlwbm9kZWJhc2UudHMiXSwibmFtZXMiOlsiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLmNvbnN0cnVjdG9yIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLmxvb3BpbmciLCJBbmltYXRpb25DbGlwTm9kZUJhc2Uuc3RpdGNoRmluYWxGcmFtZSIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS50b3RhbER1cmF0aW9uIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLnRvdGFsRGVsdGEiLCJBbmltYXRpb25DbGlwTm9kZUJhc2UubGFzdEZyYW1lIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLmR1cmF0aW9ucyIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5fcFVwZGF0ZVN0aXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxpQkFBaUIsV0FBYyxtREFBbUQsQ0FBQyxDQUFDO0FBQzNGLElBQU8sUUFBUSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBRXRFLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFBU0EsVUFBOUJBLHFCQUFxQkEsVUFBMEJBO0lBcUZwREE7O09BRUdBO0lBQ0hBLFNBeEZLQSxxQkFBcUJBO1FBMEZ6QkMsaUJBQU9BLENBQUNBO1FBeEZGQSxjQUFTQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUN6QkEsb0JBQWVBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQUdwQ0Esa0JBQWFBLEdBQVdBLElBQUlBLENBQUNBO1FBQzdCQSx1QkFBa0JBLEdBQVdBLEtBQUtBLENBQUNBO1FBQ25DQSxnQkFBV0EsR0FBbUJBLENBQUNBLENBQUNBO1FBRWhDQSxnQkFBV0EsR0FBaUJBLElBQUlBLEtBQUtBLEVBQVVBLENBQUNBO1FBQ3ZEQSxRQUFRQTtRQUNEQSxpQkFBWUEsR0FBWUEsSUFBSUEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFFdkNBLG1CQUFjQSxHQUFXQSxJQUFJQSxDQUFDQTtJQTZF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Q2xpcE5vZGVCYXNlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIG5vZGVzIHdpdGggdGltZS1iYXNlZCBhbmltYXRpb24gZGF0YSBpbiBhbiBhbmltYXRpb24gYmxlbmQgdHJlZS5cbiAqL1xuY2xhc3MgQW5pbWF0aW9uQ2xpcE5vZGVCYXNlIGV4dGVuZHMgQW5pbWF0aW9uTm9kZUJhc2Vcbntcblx0cHVibGljIF9wTG9vcGluZzpib29sZWFuID0gdHJ1ZTtcblx0cHVibGljIF9wVG90YWxEdXJhdGlvbjpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRwdWJsaWMgX3BMYXN0RnJhbWU6bnVtYmVyIC8qdWludCovO1xuXG5cdHB1YmxpYyBfcFN0aXRjaERpcnR5OmJvb2xlYW4gPSB0cnVlO1xuXHRwdWJsaWMgX3BTdGl0Y2hGaW5hbEZyYW1lOmJvb2xlYW4gPSBmYWxzZTtcblx0cHVibGljIF9wTnVtRnJhbWVzOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cblx0cHVibGljIF9wRHVyYXRpb25zOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHQvKnVpbnQqL1xuXHRwdWJsaWMgX3BUb3RhbERlbHRhOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cblx0cHVibGljIGZpeGVkRnJhbWVSYXRlOmJvb2xlYW4gPSB0cnVlO1xuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGNvbnRlbnRzIG9mIHRoZSBhbmltYXRpb24gbm9kZSBoYXZlIGxvb3BpbmcgY2hhcmFjdGVyaXN0aWNzIGVuYWJsZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGxvb3BpbmcoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcExvb3Bpbmc7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGxvb3BpbmcodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9wTG9vcGluZyA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3BMb29waW5nID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wU3RpdGNoRGlydHkgPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmluZXMgaWYgbG9vcGluZyBjb250ZW50IGJsZW5kcyB0aGUgZmluYWwgZnJhbWUgb2YgYW5pbWF0aW9uIGRhdGEgd2l0aCB0aGUgZmlyc3QgKHRydWUpIG9yIHdvcmtzIG9uIHRoZVxuXHQgKiBhc3N1bXB0aW9uIHRoYXQgYm90aCBmaXJzdCBhbmQgbGFzdCBmcmFtZXMgYXJlIGlkZW50aWNhbCAoZmFsc2UpLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3RpdGNoRmluYWxGcmFtZSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wU3RpdGNoRmluYWxGcmFtZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3RpdGNoRmluYWxGcmFtZSh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcFN0aXRjaEZpbmFsRnJhbWUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BTdGl0Y2hEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHRvdGFsRHVyYXRpb24oKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdGlmICh0aGlzLl9wU3RpdGNoRGlydHkpXG5cdFx0XHR0aGlzLl9wVXBkYXRlU3RpdGNoKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fcFRvdGFsRHVyYXRpb247XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHRvdGFsRGVsdGEoKTpWZWN0b3IzRFxuXHR7XG5cdFx0aWYgKHRoaXMuX3BTdGl0Y2hEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVTdGl0Y2goKTtcblxuXHRcdHJldHVybiB0aGlzLl9wVG90YWxEZWx0YTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgbGFzdEZyYW1lKCk6bnVtYmVyIC8qdWludCovXG5cdHtcblx0XHRpZiAodGhpcy5fcFN0aXRjaERpcnR5KVxuXHRcdFx0dGhpcy5fcFVwZGF0ZVN0aXRjaCgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3BMYXN0RnJhbWU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiB0aW1lIHZhbHVlcyByZXByZXNlbnRpbmcgdGhlIGR1cmF0aW9uIChpbiBtaWxsaXNlY29uZHMpIG9mIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGluIHRoZSBjbGlwLlxuXHQgKi9cblx0cHVibGljIGdldCBkdXJhdGlvbnMoKTpBcnJheTxudW1iZXI+IC8qdWludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcER1cmF0aW9ucztcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPkFuaW1hdGlvbkNsaXBOb2RlQmFzZTwvY29kZT4gb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBub2RlJ3MgZmluYWwgZnJhbWUgc3RpdGNoIHN0YXRlLlxuXHQgKlxuXHQgKiBAc2VlICNzdGl0Y2hGaW5hbEZyYW1lXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVTdGl0Y2goKVxuXHR7XG5cdFx0dGhpcy5fcFN0aXRjaERpcnR5ID0gZmFsc2U7XG5cblx0XHR0aGlzLl9wTGFzdEZyYW1lID0gKHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lKT8gdGhpcy5fcE51bUZyYW1lcyA6IHRoaXMuX3BOdW1GcmFtZXMgLSAxO1xuXG5cdFx0dGhpcy5fcFRvdGFsRHVyYXRpb24gPSAwO1xuXHRcdHRoaXMuX3BUb3RhbERlbHRhLnggPSAwO1xuXHRcdHRoaXMuX3BUb3RhbERlbHRhLnkgPSAwO1xuXHRcdHRoaXMuX3BUb3RhbERlbHRhLnogPSAwO1xuXHR9XG59XG5cbmV4cG9ydCA9IEFuaW1hdGlvbkNsaXBOb2RlQmFzZTsiXX0=