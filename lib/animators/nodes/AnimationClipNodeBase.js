var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbkNsaXBOb2RlQmFzZSIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5sb29waW5nIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLnN0aXRjaEZpbmFsRnJhbWUiLCJBbmltYXRpb25DbGlwTm9kZUJhc2UudG90YWxEdXJhdGlvbiIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS50b3RhbERlbHRhIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLmxhc3RGcmFtZSIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5kdXJhdGlvbnMiLCJBbmltYXRpb25DbGlwTm9kZUJhc2UuX3BVcGRhdGVTdGl0Y2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBRWpFLElBQU8saUJBQWlCLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUU5RixBQUdBOztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQTBCQTtJQXFGcERBOztPQUVHQTtJQUNIQSxTQXhGS0EscUJBQXFCQTtRQTBGekJDLGlCQUFPQSxDQUFDQTtRQXhGRkEsY0FBU0EsR0FBV0EsSUFBSUEsQ0FBQ0E7UUFDekJBLG9CQUFlQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFHcENBLGtCQUFhQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUM3QkEsdUJBQWtCQSxHQUFXQSxLQUFLQSxDQUFDQTtRQUNuQ0EsZ0JBQVdBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQUVoQ0EsZ0JBQVdBLEdBQWlCQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFDQTtRQUN2REEsUUFBUUE7UUFDREEsaUJBQVlBLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBRXZDQSxtQkFBY0Es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bWF0b3JzL25vZGVzL0FuaW1hdGlvbkNsaXBOb2RlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xyXG5cclxuLyoqXHJcbiAqIFByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIG5vZGVzIHdpdGggdGltZS1iYXNlZCBhbmltYXRpb24gZGF0YSBpbiBhbiBhbmltYXRpb24gYmxlbmQgdHJlZS5cclxuICovXHJcbmNsYXNzIEFuaW1hdGlvbkNsaXBOb2RlQmFzZSBleHRlbmRzIEFuaW1hdGlvbk5vZGVCYXNlXHJcbntcclxuXHRwdWJsaWMgX3BMb29waW5nOmJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyBfcFRvdGFsRHVyYXRpb246bnVtYmVyIC8qdWludCovID0gMDtcclxuXHRwdWJsaWMgX3BMYXN0RnJhbWU6bnVtYmVyIC8qdWludCovO1xyXG5cclxuXHRwdWJsaWMgX3BTdGl0Y2hEaXJ0eTpib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgX3BTdGl0Y2hGaW5hbEZyYW1lOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgX3BOdW1GcmFtZXM6bnVtYmVyIC8qdWludCovID0gMDtcclxuXHJcblx0cHVibGljIF9wRHVyYXRpb25zOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xyXG5cdC8qdWludCovXHJcblx0cHVibGljIF9wVG90YWxEZWx0YTpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCgpO1xyXG5cclxuXHRwdWJsaWMgZml4ZWRGcmFtZVJhdGU6Ym9vbGVhbiA9IHRydWU7XHJcblxyXG5cdC8qKlxyXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0aGUgY29udGVudHMgb2YgdGhlIGFuaW1hdGlvbiBub2RlIGhhdmUgbG9vcGluZyBjaGFyYWN0ZXJpc3RpY3MgZW5hYmxlZC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGxvb3BpbmcoKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BMb29waW5nO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsb29waW5nKHZhbHVlOmJvb2xlYW4pXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX3BMb29waW5nID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fcExvb3BpbmcgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLl9wU3RpdGNoRGlydHkgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGVmaW5lcyBpZiBsb29waW5nIGNvbnRlbnQgYmxlbmRzIHRoZSBmaW5hbCBmcmFtZSBvZiBhbmltYXRpb24gZGF0YSB3aXRoIHRoZSBmaXJzdCAodHJ1ZSkgb3Igd29ya3Mgb24gdGhlXHJcblx0ICogYXNzdW1wdGlvbiB0aGF0IGJvdGggZmlyc3QgYW5kIGxhc3QgZnJhbWVzIGFyZSBpZGVudGljYWwgKGZhbHNlKS4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzdGl0Y2hGaW5hbEZyYW1lKCk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9wU3RpdGNoRmluYWxGcmFtZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgc3RpdGNoRmluYWxGcmFtZSh2YWx1ZTpib29sZWFuKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wU3RpdGNoRmluYWxGcmFtZSA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5fcFN0aXRjaERpcnR5ID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdG90YWxEdXJhdGlvbigpOm51bWJlciAvKnVpbnQqL1xyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wU3RpdGNoRGlydHkpXHJcblx0XHRcdHRoaXMuX3BVcGRhdGVTdGl0Y2goKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fcFRvdGFsRHVyYXRpb247XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRvdGFsRGVsdGEoKTpWZWN0b3IzRFxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wU3RpdGNoRGlydHkpXHJcblx0XHRcdHRoaXMuX3BVcGRhdGVTdGl0Y2goKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fcFRvdGFsRGVsdGE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGxhc3RGcmFtZSgpOm51bWJlciAvKnVpbnQqL1xyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wU3RpdGNoRGlydHkpXHJcblx0XHRcdHRoaXMuX3BVcGRhdGVTdGl0Y2goKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fcExhc3RGcmFtZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgYSB2ZWN0b3Igb2YgdGltZSB2YWx1ZXMgcmVwcmVzZW50aW5nIHRoZSBkdXJhdGlvbiAoaW4gbWlsbGlzZWNvbmRzKSBvZiBlYWNoIGFuaW1hdGlvbiBmcmFtZSBpbiB0aGUgY2xpcC5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGR1cmF0aW9ucygpOkFycmF5PG51bWJlcj4gLyp1aW50Ki9cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcER1cmF0aW9ucztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+QW5pbWF0aW9uQ2xpcE5vZGVCYXNlPC9jb2RlPiBvYmplY3QuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBVcGRhdGVzIHRoZSBub2RlJ3MgZmluYWwgZnJhbWUgc3RpdGNoIHN0YXRlLlxyXG5cdCAqXHJcblx0ICogQHNlZSAjc3RpdGNoRmluYWxGcmFtZVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcFVwZGF0ZVN0aXRjaCgpXHJcblx0e1xyXG5cdFx0dGhpcy5fcFN0aXRjaERpcnR5ID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5fcExhc3RGcmFtZSA9ICh0aGlzLl9wU3RpdGNoRmluYWxGcmFtZSk/IHRoaXMuX3BOdW1GcmFtZXMgOiB0aGlzLl9wTnVtRnJhbWVzIC0gMTtcclxuXHJcblx0XHR0aGlzLl9wVG90YWxEdXJhdGlvbiA9IDA7XHJcblx0XHR0aGlzLl9wVG90YWxEZWx0YS54ID0gMDtcclxuXHRcdHRoaXMuX3BUb3RhbERlbHRhLnkgPSAwO1xyXG5cdFx0dGhpcy5fcFRvdGFsRGVsdGEueiA9IDA7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBBbmltYXRpb25DbGlwTm9kZUJhc2U7Il19