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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbkNsaXBOb2RlQmFzZSIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5sb29waW5nIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLnN0aXRjaEZpbmFsRnJhbWUiLCJBbmltYXRpb25DbGlwTm9kZUJhc2UudG90YWxEdXJhdGlvbiIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS50b3RhbERlbHRhIiwiQW5pbWF0aW9uQ2xpcE5vZGVCYXNlLmxhc3RGcmFtZSIsIkFuaW1hdGlvbkNsaXBOb2RlQmFzZS5kdXJhdGlvbnMiLCJBbmltYXRpb25DbGlwTm9kZUJhc2UuX3BVcGRhdGVTdGl0Y2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBRWpFLElBQU8saUJBQWlCLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUU5RixBQUdBOztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQTBCQTtJQXFGcERBOztPQUVHQTtJQUNIQSxTQXhGS0EscUJBQXFCQTtRQTBGekJDLGlCQUFPQSxDQUFDQTtRQXhGRkEsY0FBU0EsR0FBV0EsSUFBSUEsQ0FBQ0E7UUFDekJBLG9CQUFlQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFHcENBLGtCQUFhQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUM3QkEsdUJBQWtCQSxHQUFXQSxLQUFLQSxDQUFDQTtRQUNuQ0EsZ0JBQVdBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQUVoQ0EsZ0JBQVdBLEdBQWlCQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFDQTtRQUN2REEsUUFBUUE7UUFDREEsaUJBQVlBLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBRXZDQSxtQkFBY0Es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bWF0b3JzL25vZGVzL0FuaW1hdGlvbkNsaXBOb2RlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3Igbm9kZXMgd2l0aCB0aW1lLWJhc2VkIGFuaW1hdGlvbiBkYXRhIGluIGFuIGFuaW1hdGlvbiBibGVuZCB0cmVlLlxuICovXG5jbGFzcyBBbmltYXRpb25DbGlwTm9kZUJhc2UgZXh0ZW5kcyBBbmltYXRpb25Ob2RlQmFzZVxue1xuXHRwdWJsaWMgX3BMb29waW5nOmJvb2xlYW4gPSB0cnVlO1xuXHRwdWJsaWMgX3BUb3RhbER1cmF0aW9uOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdHB1YmxpYyBfcExhc3RGcmFtZTpudW1iZXIgLyp1aW50Ki87XG5cblx0cHVibGljIF9wU3RpdGNoRGlydHk6Ym9vbGVhbiA9IHRydWU7XG5cdHB1YmxpYyBfcFN0aXRjaEZpbmFsRnJhbWU6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwdWJsaWMgX3BOdW1GcmFtZXM6bnVtYmVyIC8qdWludCovID0gMDtcblxuXHRwdWJsaWMgX3BEdXJhdGlvbnM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdC8qdWludCovXG5cdHB1YmxpYyBfcFRvdGFsRGVsdGE6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcblxuXHRwdWJsaWMgZml4ZWRGcmFtZVJhdGU6Ym9vbGVhbiA9IHRydWU7XG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0aGUgY29udGVudHMgb2YgdGhlIGFuaW1hdGlvbiBub2RlIGhhdmUgbG9vcGluZyBjaGFyYWN0ZXJpc3RpY3MgZW5hYmxlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgbG9vcGluZygpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wTG9vcGluZztcblx0fVxuXG5cdHB1YmxpYyBzZXQgbG9vcGluZyh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BMb29waW5nID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcExvb3BpbmcgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BTdGl0Y2hEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyBpZiBsb29waW5nIGNvbnRlbnQgYmxlbmRzIHRoZSBmaW5hbCBmcmFtZSBvZiBhbmltYXRpb24gZGF0YSB3aXRoIHRoZSBmaXJzdCAodHJ1ZSkgb3Igd29ya3Mgb24gdGhlXG5cdCAqIGFzc3VtcHRpb24gdGhhdCBib3RoIGZpcnN0IGFuZCBsYXN0IGZyYW1lcyBhcmUgaWRlbnRpY2FsIChmYWxzZSkuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0cHVibGljIGdldCBzdGl0Y2hGaW5hbEZyYW1lKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lO1xuXHR9XG5cblx0cHVibGljIHNldCBzdGl0Y2hGaW5hbEZyYW1lKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5fcFN0aXRjaEZpbmFsRnJhbWUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wU3RpdGNoRmluYWxGcmFtZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcFN0aXRjaERpcnR5ID0gdHJ1ZTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgdG90YWxEdXJhdGlvbigpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0aWYgKHRoaXMuX3BTdGl0Y2hEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVTdGl0Y2goKTtcblxuXHRcdHJldHVybiB0aGlzLl9wVG90YWxEdXJhdGlvbjtcblx0fVxuXG5cdHB1YmxpYyBnZXQgdG90YWxEZWx0YSgpOlZlY3RvcjNEXG5cdHtcblx0XHRpZiAodGhpcy5fcFN0aXRjaERpcnR5KVxuXHRcdFx0dGhpcy5fcFVwZGF0ZVN0aXRjaCgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3BUb3RhbERlbHRhO1xuXHR9XG5cblx0cHVibGljIGdldCBsYXN0RnJhbWUoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdGlmICh0aGlzLl9wU3RpdGNoRGlydHkpXG5cdFx0XHR0aGlzLl9wVXBkYXRlU3RpdGNoKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fcExhc3RGcmFtZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIHRpbWUgdmFsdWVzIHJlcHJlc2VudGluZyB0aGUgZHVyYXRpb24gKGluIG1pbGxpc2Vjb25kcykgb2YgZWFjaCBhbmltYXRpb24gZnJhbWUgaW4gdGhlIGNsaXAuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGR1cmF0aW9ucygpOkFycmF5PG51bWJlcj4gLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wRHVyYXRpb25zO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+QW5pbWF0aW9uQ2xpcE5vZGVCYXNlPC9jb2RlPiBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIG5vZGUncyBmaW5hbCBmcmFtZSBzdGl0Y2ggc3RhdGUuXG5cdCAqXG5cdCAqIEBzZWUgI3N0aXRjaEZpbmFsRnJhbWVcblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZVN0aXRjaCgpXG5cdHtcblx0XHR0aGlzLl9wU3RpdGNoRGlydHkgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3BMYXN0RnJhbWUgPSAodGhpcy5fcFN0aXRjaEZpbmFsRnJhbWUpPyB0aGlzLl9wTnVtRnJhbWVzIDogdGhpcy5fcE51bUZyYW1lcyAtIDE7XG5cblx0XHR0aGlzLl9wVG90YWxEdXJhdGlvbiA9IDA7XG5cdFx0dGhpcy5fcFRvdGFsRGVsdGEueCA9IDA7XG5cdFx0dGhpcy5fcFRvdGFsRGVsdGEueSA9IDA7XG5cdFx0dGhpcy5fcFRvdGFsRGVsdGEueiA9IDA7XG5cdH1cbn1cblxuZXhwb3J0ID0gQW5pbWF0aW9uQ2xpcE5vZGVCYXNlOyJdfQ==