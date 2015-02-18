var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
var VertexClipState = require("awayjs-renderergl/lib/animators/states/VertexClipState");
/**
 * A vertex animation node containing time-based animation data as individual geometry obejcts.
 */
var VertexClipNode = (function (_super) {
    __extends(VertexClipNode, _super);
    /**
     * Creates a new <code>VertexClipNode</code> object.
     */
    function VertexClipNode() {
        _super.call(this);
        this._frames = new Array();
        this._translations = new Array();
        this._pStateClass = VertexClipState;
    }
    Object.defineProperty(VertexClipNode.prototype, "frames", {
        /**
         * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
         */
        get: function () {
            return this._frames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a geometry object to the internal timeline of the animation node.
     *
     * @param geometry The geometry object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
     */
    VertexClipNode.prototype.addFrame = function (geometry, duration /*uint*/, translation) {
        if (translation === void 0) { translation = null; }
        this._frames.push(geometry);
        this._pDurations.push(duration);
        this._translations.push(translation || new Vector3D());
        this._pNumFrames = this._pDurations.length;
        this._pStitchDirty = true;
    };
    /**
     * @inheritDoc
     */
    VertexClipNode.prototype._pUpdateStitch = function () {
        _super.prototype._pUpdateStitch.call(this);
        var i = this._pNumFrames - 1;
        var p1, p2, delta;
        while (i--) {
            this._pTotalDuration += this._pDurations[i];
            p1 = this._translations[i];
            p2 = this._translations[i + 1];
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
        if (this._pNumFrames > 1 && (this._pStitchFinalFrame || !this._pLooping)) {
            this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
            p1 = this._translations[0];
            p2 = this._translations[1];
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
    };
    return VertexClipNode;
})(AnimationClipNodeBase);
module.exports = VertexClipNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGUudHMiXSwibmFtZXMiOlsiVmVydGV4Q2xpcE5vZGUiLCJWZXJ0ZXhDbGlwTm9kZS5jb25zdHJ1Y3RvciIsIlZlcnRleENsaXBOb2RlLmZyYW1lcyIsIlZlcnRleENsaXBOb2RlLmFkZEZyYW1lIiwiVmVydGV4Q2xpcE5vZGUuX3BVcGRhdGVTdGl0Y2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBTWpFLElBQU8scUJBQXFCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUN4RyxJQUFPLGVBQWUsV0FBZSx3REFBd0QsQ0FBQyxDQUFDO0FBRS9GLEFBR0E7O0dBREc7SUFDRyxjQUFjO0lBQVNBLFVBQXZCQSxjQUFjQSxVQUE4QkE7SUFhakRBOztPQUVHQTtJQUNIQSxTQWhCS0EsY0FBY0E7UUFrQmxCQyxpQkFBT0EsQ0FBQ0E7UUFoQkRBLFlBQU9BLEdBQW1CQSxJQUFJQSxLQUFLQSxFQUFZQSxDQUFDQTtRQUNoREEsa0JBQWFBLEdBQW1CQSxJQUFJQSxLQUFLQSxFQUFZQSxDQUFDQTtRQWlCN0RBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLGVBQWVBLENBQUNBO0lBQ3JDQSxDQUFDQTtJQWJERCxzQkFBV0Esa0NBQU1BO1FBSGpCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDckJBLENBQUNBOzs7T0FBQUY7SUFZREE7Ozs7OztPQU1HQTtJQUNJQSxpQ0FBUUEsR0FBZkEsVUFBZ0JBLFFBQWlCQSxFQUFFQSxRQUFRQSxDQUFRQSxRQUFEQSxBQUFTQSxFQUFFQSxXQUEyQkE7UUFBM0JHLDJCQUEyQkEsR0FBM0JBLGtCQUEyQkE7UUFFdkZBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzVCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsSUFBSUEsSUFBSUEsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFdkRBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBO1FBRTNDQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFREg7O09BRUdBO0lBQ0lBLHVDQUFjQSxHQUFyQkE7UUFFQ0ksZ0JBQUtBLENBQUNBLGNBQWNBLFdBQUVBLENBQUNBO1FBRXZCQSxJQUFJQSxDQUFDQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLElBQUlBLEVBQVdBLEVBQUVBLEVBQVdBLEVBQUVBLEtBQWNBLENBQUNBO1FBQzdDQSxPQUFPQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNaQSxJQUFJQSxDQUFDQSxlQUFlQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM1Q0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0RBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDaENBLENBQUNBO0lBQ0ZBLENBQUNBO0lBQ0ZKLHFCQUFDQTtBQUFEQSxDQXRFQSxBQXNFQ0EsRUF0RTRCLHFCQUFxQixFQXNFakQ7QUFFRCxBQUF3QixpQkFBZixjQUFjLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL25vZGVzL1ZlcnRleENsaXBOb2RlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XHJcblxyXG5pbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0dlb21ldHJ5XCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdGlvbkNsaXBOb2RlQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uQ2xpcE5vZGVCYXNlXCIpO1xyXG5pbXBvcnQgVmVydGV4Q2xpcFN0YXRlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL1ZlcnRleENsaXBTdGF0ZVwiKTtcclxuXHJcbi8qKlxyXG4gKiBBIHZlcnRleCBhbmltYXRpb24gbm9kZSBjb250YWluaW5nIHRpbWUtYmFzZWQgYW5pbWF0aW9uIGRhdGEgYXMgaW5kaXZpZHVhbCBnZW9tZXRyeSBvYmVqY3RzLlxyXG4gKi9cclxuY2xhc3MgVmVydGV4Q2xpcE5vZGUgZXh0ZW5kcyBBbmltYXRpb25DbGlwTm9kZUJhc2Vcclxue1xyXG5cdHByaXZhdGUgX2ZyYW1lczpBcnJheTxHZW9tZXRyeT4gPSBuZXcgQXJyYXk8R2VvbWV0cnk+KCk7XHJcblx0cHJpdmF0ZSBfdHJhbnNsYXRpb25zOkFycmF5PFZlY3RvcjNEPiA9IG5ldyBBcnJheTxWZWN0b3IzRD4oKTtcclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiBnZW9tZXRyeSBmcmFtZXMgcmVwcmVzZW50aW5nIHRoZSB2ZXJ0ZXggdmFsdWVzIG9mIGVhY2ggYW5pbWF0aW9uIGZyYW1lIGluIHRoZSBjbGlwLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgZnJhbWVzKCk6QXJyYXk8R2VvbWV0cnk+XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZyYW1lcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+VmVydGV4Q2xpcE5vZGU8L2NvZGU+IG9iamVjdC5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3RvcigpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9wU3RhdGVDbGFzcyA9IFZlcnRleENsaXBTdGF0ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZHMgYSBnZW9tZXRyeSBvYmplY3QgdG8gdGhlIGludGVybmFsIHRpbWVsaW5lIG9mIHRoZSBhbmltYXRpb24gbm9kZS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBnZW9tZXRyeSBUaGUgZ2VvbWV0cnkgb2JqZWN0IHRvIGFkZCB0byB0aGUgdGltZWxpbmUgb2YgdGhlIG5vZGUuXHJcblx0ICogQHBhcmFtIGR1cmF0aW9uIFRoZSBzcGVjaWZpZWQgZHVyYXRpb24gb2YgdGhlIGZyYW1lIGluIG1pbGxpc2Vjb25kcy5cclxuXHQgKiBAcGFyYW0gdHJhbnNsYXRpb24gVGhlIGFic29sdXRlIHRyYW5zbGF0aW9uIG9mIHRoZSBmcmFtZSwgdXNlZCBpbiByb290IGRlbHRhIGNhbGN1bGF0aW9ucyBmb3IgbWVzaCBtb3ZlbWVudC5cclxuXHQgKi9cclxuXHRwdWJsaWMgYWRkRnJhbWUoZ2VvbWV0cnk6R2VvbWV0cnksIGR1cmF0aW9uOm51bWJlciAvKnVpbnQqLywgdHJhbnNsYXRpb246VmVjdG9yM0QgPSBudWxsKVxyXG5cdHtcclxuXHRcdHRoaXMuX2ZyYW1lcy5wdXNoKGdlb21ldHJ5KTtcclxuXHRcdHRoaXMuX3BEdXJhdGlvbnMucHVzaChkdXJhdGlvbik7XHJcblx0XHR0aGlzLl90cmFuc2xhdGlvbnMucHVzaCh0cmFuc2xhdGlvbiB8fCBuZXcgVmVjdG9yM0QoKSk7XHJcblxyXG5cdFx0dGhpcy5fcE51bUZyYW1lcyA9IHRoaXMuX3BEdXJhdGlvbnMubGVuZ3RoO1xyXG5cclxuXHRcdHRoaXMuX3BTdGl0Y2hEaXJ0eSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcFVwZGF0ZVN0aXRjaCgpXHJcblx0e1xyXG5cdFx0c3VwZXIuX3BVcGRhdGVTdGl0Y2goKTtcclxuXHJcblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9wTnVtRnJhbWVzIC0gMTtcclxuXHRcdHZhciBwMTpWZWN0b3IzRCwgcDI6VmVjdG9yM0QsIGRlbHRhOlZlY3RvcjNEO1xyXG5cdFx0d2hpbGUgKGktLSkge1xyXG5cdFx0XHR0aGlzLl9wVG90YWxEdXJhdGlvbiArPSB0aGlzLl9wRHVyYXRpb25zW2ldO1xyXG5cdFx0XHRwMSA9IHRoaXMuX3RyYW5zbGF0aW9uc1tpXTtcclxuXHRcdFx0cDIgPSB0aGlzLl90cmFuc2xhdGlvbnNbaSArIDFdO1xyXG5cdFx0XHRkZWx0YSA9IHAyLnN1YnRyYWN0KHAxKTtcclxuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueCArPSBkZWx0YS54O1xyXG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS55ICs9IGRlbHRhLnk7XHJcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnogKz0gZGVsdGEuejtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcE51bUZyYW1lcyA+IDEgJiYgKHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lIHx8ICF0aGlzLl9wTG9vcGluZykpIHtcclxuXHRcdFx0dGhpcy5fcFRvdGFsRHVyYXRpb24gKz0gdGhpcy5fcER1cmF0aW9uc1t0aGlzLl9wTnVtRnJhbWVzIC0gMV07XHJcblx0XHRcdHAxID0gdGhpcy5fdHJhbnNsYXRpb25zWzBdO1xyXG5cdFx0XHRwMiA9IHRoaXMuX3RyYW5zbGF0aW9uc1sxXTtcclxuXHRcdFx0ZGVsdGEgPSBwMi5zdWJ0cmFjdChwMSk7XHJcblx0XHRcdHRoaXMuX3BUb3RhbERlbHRhLnggKz0gZGVsdGEueDtcclxuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueSArPSBkZWx0YS55O1xyXG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS56ICs9IGRlbHRhLno7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBWZXJ0ZXhDbGlwTm9kZTsiXX0=