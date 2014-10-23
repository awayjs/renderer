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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3ZlcnRleGNsaXBzdGF0ZS50cyJdLCJuYW1lcyI6WyJWZXJ0ZXhDbGlwU3RhdGUiLCJWZXJ0ZXhDbGlwU3RhdGUuY29uc3RydWN0b3IiLCJWZXJ0ZXhDbGlwU3RhdGUuY3VycmVudEdlb21ldHJ5IiwiVmVydGV4Q2xpcFN0YXRlLm5leHRHZW9tZXRyeSIsIlZlcnRleENsaXBTdGF0ZS5fcFVwZGF0ZUZyYW1lcyIsIlZlcnRleENsaXBTdGF0ZS5fcFVwZGF0ZVBvc2l0aW9uRGVsdGEiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLElBQU8sa0JBQWtCLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUdwRyxBQUdBOztHQURHO0lBQ0csZUFBZTtJQUFTQSxVQUF4QkEsZUFBZUEsVUFBMkJBO0lBNkIvQ0EsU0E3QktBLGVBQWVBLENBNkJSQSxRQUFxQkEsRUFBRUEsY0FBNkJBO1FBRS9EQyxrQkFBTUEsUUFBUUEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFaENBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUM1Q0EsQ0FBQ0E7SUF6QkRELHNCQUFXQSw0Q0FBZUE7UUFIMUJBOztXQUVHQTthQUNIQTtZQUVDRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBS0RBLHNCQUFXQSx5Q0FBWUE7UUFIdkJBOztXQUVHQTthQUNIQTtZQUVDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBSDtJQVVEQTs7T0FFR0E7SUFDSUEsd0NBQWNBLEdBQXJCQTtRQUVDSSxnQkFBS0EsQ0FBQ0EsY0FBY0EsV0FBRUEsQ0FBQ0E7UUFFdkJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFMURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hGQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsVUFBV0EsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUN6REEsQ0FBQ0E7UUFBQ0EsSUFBSUE7WUFDTEEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7SUFDdERBLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSwrQ0FBcUJBLEdBQTVCQTtRQUVDSyxrRUFBa0VBO0lBQ25FQSxDQUFDQTtJQUNGTCxzQkFBQ0E7QUFBREEsQ0E1REEsQUE0RENBLEVBNUQ2QixrQkFBa0IsRUE0RC9DO0FBRUQsQUFBeUIsaUJBQWhCLGVBQWUsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1ZlcnRleENsaXBTdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0dlb21ldHJ5XCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBWZXJ0ZXhBbmltYXRvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1ZlcnRleEFuaW1hdG9yXCIpO1xuaW1wb3J0IFZlcnRleENsaXBOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGVcIik7XG5pbXBvcnQgQW5pbWF0aW9uQ2xpcFN0YXRlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9BbmltYXRpb25DbGlwU3RhdGVcIik7XG5pbXBvcnQgSVZlcnRleEFuaW1hdGlvblN0YXRlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSVZlcnRleEFuaW1hdGlvblN0YXRlXCIpO1xuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFZlcnRleENsaXBTdGF0ZSBleHRlbmRzIEFuaW1hdGlvbkNsaXBTdGF0ZSBpbXBsZW1lbnRzIElWZXJ0ZXhBbmltYXRpb25TdGF0ZVxue1xuXHRwcml2YXRlIF9mcmFtZXM6QXJyYXk8R2VvbWV0cnk+O1xuXHRwcml2YXRlIF92ZXJ0ZXhDbGlwTm9kZTpWZXJ0ZXhDbGlwTm9kZTtcblx0cHJpdmF0ZSBfY3VycmVudEdlb21ldHJ5Okdlb21ldHJ5O1xuXHRwcml2YXRlIF9uZXh0R2VvbWV0cnk6R2VvbWV0cnk7XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGN1cnJlbnRHZW9tZXRyeSgpOkdlb21ldHJ5XG5cdHtcblx0XHRpZiAodGhpcy5fcEZyYW1lc0RpcnR5KVxuXHRcdFx0dGhpcy5fcFVwZGF0ZUZyYW1lcygpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnRHZW9tZXRyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBuZXh0R2VvbWV0cnkoKTpHZW9tZXRyeVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BGcmFtZXNEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9uZXh0R2VvbWV0cnk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIHZlcnRleENsaXBOb2RlOlZlcnRleENsaXBOb2RlKVxuXHR7XG5cdFx0c3VwZXIoYW5pbWF0b3IsIHZlcnRleENsaXBOb2RlKTtcblxuXHRcdHRoaXMuX3ZlcnRleENsaXBOb2RlID0gdmVydGV4Q2xpcE5vZGU7XG5cdFx0dGhpcy5fZnJhbWVzID0gdGhpcy5fdmVydGV4Q2xpcE5vZGUuZnJhbWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVGcmFtZXMoKVxuXHR7XG5cdFx0c3VwZXIuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHRoaXMuX2N1cnJlbnRHZW9tZXRyeSA9IHRoaXMuX2ZyYW1lc1t0aGlzLl9wQ3VycmVudEZyYW1lXTtcblxuXHRcdGlmICh0aGlzLl92ZXJ0ZXhDbGlwTm9kZS5sb29waW5nICYmIHRoaXMuX3BOZXh0RnJhbWUgPj0gdGhpcy5fdmVydGV4Q2xpcE5vZGUubGFzdEZyYW1lKSB7XG5cdFx0XHR0aGlzLl9uZXh0R2VvbWV0cnkgPSB0aGlzLl9mcmFtZXNbMF07XG5cdFx0XHQoPFZlcnRleEFuaW1hdG9yPiB0aGlzLl9wQW5pbWF0b3IpLmRpc3BhdGNoQ3ljbGVFdmVudCgpO1xuXHRcdH0gZWxzZVxuXHRcdFx0dGhpcy5fbmV4dEdlb21ldHJ5ID0gdGhpcy5fZnJhbWVzW3RoaXMuX3BOZXh0RnJhbWVdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVQb3NpdGlvbkRlbHRhKClcblx0e1xuXHRcdC8vVE9ETzppbXBsZW1lbnQgcG9zaXRpb25kZWx0YSBmdW5jdGlvbmFsaXR5IGZvciB2ZXJ0ZXggYW5pbWF0aW9uc1xuXHR9XG59XG5cbmV4cG9ydCA9IFZlcnRleENsaXBTdGF0ZTsiXX0=