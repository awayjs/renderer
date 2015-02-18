var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
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
    Object.defineProperty(VertexClipState.prototype, "currentGeometry", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._currentGeometry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexClipState.prototype, "nextGeometry", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._nextGeometry;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdateFrames = function () {
        _super.prototype._pUpdateFrames.call(this);
        this._currentGeometry = this._frames[this._pCurrentFrame];
        if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
            this._nextGeometry = this._frames[0];
            this._pAnimator.dispatchCycleEvent();
        }
        else
            this._nextGeometry = this._frames[this._pNextFrame];
    };
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdatePositionDelta = function () {
        //TODO:implement positiondelta functionality for vertex animations
    };
    return VertexClipState;
})(AnimationClipState);
module.exports = VertexClipState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL1ZlcnRleENsaXBTdGF0ZS50cyJdLCJuYW1lcyI6WyJWZXJ0ZXhDbGlwU3RhdGUiLCJWZXJ0ZXhDbGlwU3RhdGUuY29uc3RydWN0b3IiLCJWZXJ0ZXhDbGlwU3RhdGUuY3VycmVudEdlb21ldHJ5IiwiVmVydGV4Q2xpcFN0YXRlLm5leHRHZW9tZXRyeSIsIlZlcnRleENsaXBTdGF0ZS5fcFVwZGF0ZUZyYW1lcyIsIlZlcnRleENsaXBTdGF0ZS5fcFVwZGF0ZVBvc2l0aW9uRGVsdGEiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLElBQU8sa0JBQWtCLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUdwRyxBQUdBOztHQURHO0lBQ0csZUFBZTtJQUFTQSxVQUF4QkEsZUFBZUEsVUFBMkJBO0lBNkIvQ0EsU0E3QktBLGVBQWVBLENBNkJSQSxRQUFxQkEsRUFBRUEsY0FBNkJBO1FBRS9EQyxrQkFBTUEsUUFBUUEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFaENBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUM1Q0EsQ0FBQ0E7SUF6QkRELHNCQUFXQSw0Q0FBZUE7UUFIMUJBOztXQUVHQTthQUNIQTtZQUVDRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBS0RBLHNCQUFXQSx5Q0FBWUE7UUFIdkJBOztXQUVHQTthQUNIQTtZQUVDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBSDtJQVVEQTs7T0FFR0E7SUFDSUEsd0NBQWNBLEdBQXJCQTtRQUVDSSxnQkFBS0EsQ0FBQ0EsY0FBY0EsV0FBRUEsQ0FBQ0E7UUFFdkJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFMURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hGQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsVUFBV0EsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUN6REEsQ0FBQ0E7UUFBQ0EsSUFBSUE7WUFDTEEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7SUFDdERBLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSwrQ0FBcUJBLEdBQTVCQTtRQUVDSyxrRUFBa0VBO0lBQ25FQSxDQUFDQTtJQUNGTCxzQkFBQ0E7QUFBREEsQ0E1REEsQUE0RENBLEVBNUQ2QixrQkFBa0IsRUE0RC9DO0FBRUQsQUFBeUIsaUJBQWhCLGVBQWUsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1ZlcnRleENsaXBTdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0dlb21ldHJ5XCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xyXG5pbXBvcnQgVmVydGV4QW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9WZXJ0ZXhBbmltYXRvclwiKTtcclxuaW1wb3J0IFZlcnRleENsaXBOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGVcIik7XHJcbmltcG9ydCBBbmltYXRpb25DbGlwU3RhdGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvbkNsaXBTdGF0ZVwiKTtcclxuaW1wb3J0IElWZXJ0ZXhBbmltYXRpb25TdGF0ZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lWZXJ0ZXhBbmltYXRpb25TdGF0ZVwiKTtcclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuY2xhc3MgVmVydGV4Q2xpcFN0YXRlIGV4dGVuZHMgQW5pbWF0aW9uQ2xpcFN0YXRlIGltcGxlbWVudHMgSVZlcnRleEFuaW1hdGlvblN0YXRlXHJcbntcclxuXHRwcml2YXRlIF9mcmFtZXM6QXJyYXk8R2VvbWV0cnk+O1xyXG5cdHByaXZhdGUgX3ZlcnRleENsaXBOb2RlOlZlcnRleENsaXBOb2RlO1xyXG5cdHByaXZhdGUgX2N1cnJlbnRHZW9tZXRyeTpHZW9tZXRyeTtcclxuXHRwcml2YXRlIF9uZXh0R2VvbWV0cnk6R2VvbWV0cnk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldCBjdXJyZW50R2VvbWV0cnkoKTpHZW9tZXRyeVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wRnJhbWVzRGlydHkpXHJcblx0XHRcdHRoaXMuX3BVcGRhdGVGcmFtZXMoKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fY3VycmVudEdlb21ldHJ5O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IG5leHRHZW9tZXRyeSgpOkdlb21ldHJ5XHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX3BGcmFtZXNEaXJ0eSlcclxuXHRcdFx0dGhpcy5fcFVwZGF0ZUZyYW1lcygpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9uZXh0R2VvbWV0cnk7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIHZlcnRleENsaXBOb2RlOlZlcnRleENsaXBOb2RlKVxyXG5cdHtcclxuXHRcdHN1cGVyKGFuaW1hdG9yLCB2ZXJ0ZXhDbGlwTm9kZSk7XHJcblxyXG5cdFx0dGhpcy5fdmVydGV4Q2xpcE5vZGUgPSB2ZXJ0ZXhDbGlwTm9kZTtcclxuXHRcdHRoaXMuX2ZyYW1lcyA9IHRoaXMuX3ZlcnRleENsaXBOb2RlLmZyYW1lcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIF9wVXBkYXRlRnJhbWVzKClcclxuXHR7XHJcblx0XHRzdXBlci5fcFVwZGF0ZUZyYW1lcygpO1xyXG5cclxuXHRcdHRoaXMuX2N1cnJlbnRHZW9tZXRyeSA9IHRoaXMuX2ZyYW1lc1t0aGlzLl9wQ3VycmVudEZyYW1lXTtcclxuXHJcblx0XHRpZiAodGhpcy5fdmVydGV4Q2xpcE5vZGUubG9vcGluZyAmJiB0aGlzLl9wTmV4dEZyYW1lID49IHRoaXMuX3ZlcnRleENsaXBOb2RlLmxhc3RGcmFtZSkge1xyXG5cdFx0XHR0aGlzLl9uZXh0R2VvbWV0cnkgPSB0aGlzLl9mcmFtZXNbMF07XHJcblx0XHRcdCg8VmVydGV4QW5pbWF0b3I+IHRoaXMuX3BBbmltYXRvcikuZGlzcGF0Y2hDeWNsZUV2ZW50KCk7XHJcblx0XHR9IGVsc2VcclxuXHRcdFx0dGhpcy5fbmV4dEdlb21ldHJ5ID0gdGhpcy5fZnJhbWVzW3RoaXMuX3BOZXh0RnJhbWVdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgX3BVcGRhdGVQb3NpdGlvbkRlbHRhKClcclxuXHR7XHJcblx0XHQvL1RPRE86aW1wbGVtZW50IHBvc2l0aW9uZGVsdGEgZnVuY3Rpb25hbGl0eSBmb3IgdmVydGV4IGFuaW1hdGlvbnNcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFZlcnRleENsaXBTdGF0ZTsiXX0=