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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9zdGF0ZXMvdmVydGV4Y2xpcHN0YXRlLnRzIl0sIm5hbWVzIjpbIlZlcnRleENsaXBTdGF0ZSIsIlZlcnRleENsaXBTdGF0ZS5jb25zdHJ1Y3RvciIsIlZlcnRleENsaXBTdGF0ZS5jdXJyZW50R2VvbWV0cnkiLCJWZXJ0ZXhDbGlwU3RhdGUubmV4dEdlb21ldHJ5IiwiVmVydGV4Q2xpcFN0YXRlLl9wVXBkYXRlRnJhbWVzIiwiVmVydGV4Q2xpcFN0YXRlLl9wVXBkYXRlUG9zaXRpb25EZWx0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsSUFBTyxrQkFBa0IsV0FBYywyREFBMkQsQ0FBQyxDQUFDO0FBR3BHLEFBR0E7O0dBREc7SUFDRyxlQUFlO0lBQVNBLFVBQXhCQSxlQUFlQSxVQUEyQkE7SUE2Qi9DQSxTQTdCS0EsZUFBZUEsQ0E2QlJBLFFBQXFCQSxFQUFFQSxjQUE2QkE7UUFFL0RDLGtCQUFNQSxRQUFRQSxFQUFFQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUVoQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLENBQUNBO0lBQzVDQSxDQUFDQTtJQXpCREQsc0JBQVdBLDRDQUFlQTtRQUgxQkE7O1dBRUdBO2FBQ0hBO1lBRUNFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO2dCQUN0QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7WUFFdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7UUFDOUJBLENBQUNBOzs7T0FBQUY7SUFLREEsc0JBQVdBLHlDQUFZQTtRQUh2QkE7O1dBRUdBO2FBQ0hBO1lBRUNHLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO2dCQUN0QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7WUFFdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1FBQzNCQSxDQUFDQTs7O09BQUFIO0lBVURBOztPQUVHQTtJQUNJQSx3Q0FBY0EsR0FBckJBO1FBRUNJLGdCQUFLQSxDQUFDQSxjQUFjQSxXQUFFQSxDQUFDQTtRQUV2QkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUUxREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsV0FBV0EsSUFBSUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEZBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25CQSxJQUFJQSxDQUFDQSxVQUFXQSxDQUFDQSxrQkFBa0JBLEVBQUVBLENBQUNBO1FBQ3pEQSxDQUFDQTtRQUFDQSxJQUFJQTtZQUNMQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtJQUN0REEsQ0FBQ0E7SUFFREo7O09BRUdBO0lBQ0lBLCtDQUFxQkEsR0FBNUJBO1FBRUNLLGtFQUFrRUE7SUFDbkVBLENBQUNBO0lBQ0ZMLHNCQUFDQTtBQUFEQSxDQTVEQSxBQTREQ0EsRUE1RDZCLGtCQUFrQixFQTREL0M7QUFFRCxBQUF5QixpQkFBaEIsZUFBZSxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9zdGF0ZXMvVmVydGV4Q2xpcFN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdlb21ldHJ5XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9iYXNlL0dlb21ldHJ5XCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBWZXJ0ZXhBbmltYXRvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1ZlcnRleEFuaW1hdG9yXCIpO1xuaW1wb3J0IFZlcnRleENsaXBOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGVcIik7XG5pbXBvcnQgQW5pbWF0aW9uQ2xpcFN0YXRlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9BbmltYXRpb25DbGlwU3RhdGVcIik7XG5pbXBvcnQgSVZlcnRleEFuaW1hdGlvblN0YXRlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSVZlcnRleEFuaW1hdGlvblN0YXRlXCIpO1xuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFZlcnRleENsaXBTdGF0ZSBleHRlbmRzIEFuaW1hdGlvbkNsaXBTdGF0ZSBpbXBsZW1lbnRzIElWZXJ0ZXhBbmltYXRpb25TdGF0ZVxue1xuXHRwcml2YXRlIF9mcmFtZXM6QXJyYXk8R2VvbWV0cnk+O1xuXHRwcml2YXRlIF92ZXJ0ZXhDbGlwTm9kZTpWZXJ0ZXhDbGlwTm9kZTtcblx0cHJpdmF0ZSBfY3VycmVudEdlb21ldHJ5Okdlb21ldHJ5O1xuXHRwcml2YXRlIF9uZXh0R2VvbWV0cnk6R2VvbWV0cnk7XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGN1cnJlbnRHZW9tZXRyeSgpOkdlb21ldHJ5XG5cdHtcblx0XHRpZiAodGhpcy5fcEZyYW1lc0RpcnR5KVxuXHRcdFx0dGhpcy5fcFVwZGF0ZUZyYW1lcygpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnRHZW9tZXRyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBuZXh0R2VvbWV0cnkoKTpHZW9tZXRyeVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BGcmFtZXNEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9uZXh0R2VvbWV0cnk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIHZlcnRleENsaXBOb2RlOlZlcnRleENsaXBOb2RlKVxuXHR7XG5cdFx0c3VwZXIoYW5pbWF0b3IsIHZlcnRleENsaXBOb2RlKTtcblxuXHRcdHRoaXMuX3ZlcnRleENsaXBOb2RlID0gdmVydGV4Q2xpcE5vZGU7XG5cdFx0dGhpcy5fZnJhbWVzID0gdGhpcy5fdmVydGV4Q2xpcE5vZGUuZnJhbWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVGcmFtZXMoKVxuXHR7XG5cdFx0c3VwZXIuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHRoaXMuX2N1cnJlbnRHZW9tZXRyeSA9IHRoaXMuX2ZyYW1lc1t0aGlzLl9wQ3VycmVudEZyYW1lXTtcblxuXHRcdGlmICh0aGlzLl92ZXJ0ZXhDbGlwTm9kZS5sb29waW5nICYmIHRoaXMuX3BOZXh0RnJhbWUgPj0gdGhpcy5fdmVydGV4Q2xpcE5vZGUubGFzdEZyYW1lKSB7XG5cdFx0XHR0aGlzLl9uZXh0R2VvbWV0cnkgPSB0aGlzLl9mcmFtZXNbMF07XG5cdFx0XHQoPFZlcnRleEFuaW1hdG9yPiB0aGlzLl9wQW5pbWF0b3IpLmRpc3BhdGNoQ3ljbGVFdmVudCgpO1xuXHRcdH0gZWxzZVxuXHRcdFx0dGhpcy5fbmV4dEdlb21ldHJ5ID0gdGhpcy5fZnJhbWVzW3RoaXMuX3BOZXh0RnJhbWVdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVQb3NpdGlvbkRlbHRhKClcblx0e1xuXHRcdC8vVE9ETzppbXBsZW1lbnQgcG9zaXRpb25kZWx0YSBmdW5jdGlvbmFsaXR5IGZvciB2ZXJ0ZXggYW5pbWF0aW9uc1xuXHR9XG59XG5cbmV4cG9ydCA9IFZlcnRleENsaXBTdGF0ZTsiXX0=