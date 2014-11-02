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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3ZlcnRleGNsaXBzdGF0ZS50cyJdLCJuYW1lcyI6WyJWZXJ0ZXhDbGlwU3RhdGUiLCJWZXJ0ZXhDbGlwU3RhdGUuY29uc3RydWN0b3IiLCJWZXJ0ZXhDbGlwU3RhdGUuY3VycmVudEdlb21ldHJ5IiwiVmVydGV4Q2xpcFN0YXRlLm5leHRHZW9tZXRyeSIsIlZlcnRleENsaXBTdGF0ZS5fcFVwZGF0ZUZyYW1lcyIsIlZlcnRleENsaXBTdGF0ZS5fcFVwZGF0ZVBvc2l0aW9uRGVsdGEiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLElBQU8sa0JBQWtCLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUdwRyxBQUdBOztHQURHO0lBQ0csZUFBZTtJQUFTQSxVQUF4QkEsZUFBZUEsVUFBMkJBO0lBNkIvQ0EsU0E3QktBLGVBQWVBLENBNkJSQSxRQUFxQkEsRUFBRUEsY0FBNkJBO1FBRS9EQyxrQkFBTUEsUUFBUUEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFaENBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUM1Q0EsQ0FBQ0E7SUF6QkRELHNCQUFXQSw0Q0FBZUE7UUFIMUJBOztXQUVHQTthQUNIQTtZQUVDRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFGO0lBS0RBLHNCQUFXQSx5Q0FBWUE7UUFIdkJBOztXQUVHQTthQUNIQTtZQUVDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBSDtJQVVEQTs7T0FFR0E7SUFDSUEsd0NBQWNBLEdBQXJCQTtRQUVDSSxnQkFBS0EsQ0FBQ0EsY0FBY0EsV0FBRUEsQ0FBQ0E7UUFFdkJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFMURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hGQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsVUFBV0EsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUN6REEsQ0FBQ0E7UUFBQ0EsSUFBSUE7WUFDTEEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7SUFDdERBLENBQUNBO0lBRURKOztPQUVHQTtJQUNJQSwrQ0FBcUJBLEdBQTVCQTtRQUVDSyxrRUFBa0VBO0lBQ25FQSxDQUFDQTtJQUNGTCxzQkFBQ0E7QUFBREEsQ0E1REEsQUE0RENBLEVBNUQ2QixrQkFBa0IsRUE0RC9DO0FBRUQsQUFBeUIsaUJBQWhCLGVBQWUsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1ZlcnRleENsaXBTdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0dlb21ldHJ5XCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgVmVydGV4QW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9WZXJ0ZXhBbmltYXRvclwiKTtcbmltcG9ydCBWZXJ0ZXhDbGlwTm9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1ZlcnRleENsaXBOb2RlXCIpO1xuaW1wb3J0IEFuaW1hdGlvbkNsaXBTdGF0ZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvQW5pbWF0aW9uQ2xpcFN0YXRlXCIpO1xuaW1wb3J0IElWZXJ0ZXhBbmltYXRpb25TdGF0ZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lWZXJ0ZXhBbmltYXRpb25TdGF0ZVwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBWZXJ0ZXhDbGlwU3RhdGUgZXh0ZW5kcyBBbmltYXRpb25DbGlwU3RhdGUgaW1wbGVtZW50cyBJVmVydGV4QW5pbWF0aW9uU3RhdGVcbntcblx0cHJpdmF0ZSBfZnJhbWVzOkFycmF5PEdlb21ldHJ5Pjtcblx0cHJpdmF0ZSBfdmVydGV4Q2xpcE5vZGU6VmVydGV4Q2xpcE5vZGU7XG5cdHByaXZhdGUgX2N1cnJlbnRHZW9tZXRyeTpHZW9tZXRyeTtcblx0cHJpdmF0ZSBfbmV4dEdlb21ldHJ5Okdlb21ldHJ5O1xuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBjdXJyZW50R2VvbWV0cnkoKTpHZW9tZXRyeVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BGcmFtZXNEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9jdXJyZW50R2VvbWV0cnk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgbmV4dEdlb21ldHJ5KCk6R2VvbWV0cnlcblx0e1xuXHRcdGlmICh0aGlzLl9wRnJhbWVzRGlydHkpXG5cdFx0XHR0aGlzLl9wVXBkYXRlRnJhbWVzKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fbmV4dEdlb21ldHJ5O1xuXHR9XG5cblx0Y29uc3RydWN0b3IoYW5pbWF0b3I6QW5pbWF0b3JCYXNlLCB2ZXJ0ZXhDbGlwTm9kZTpWZXJ0ZXhDbGlwTm9kZSlcblx0e1xuXHRcdHN1cGVyKGFuaW1hdG9yLCB2ZXJ0ZXhDbGlwTm9kZSk7XG5cblx0XHR0aGlzLl92ZXJ0ZXhDbGlwTm9kZSA9IHZlcnRleENsaXBOb2RlO1xuXHRcdHRoaXMuX2ZyYW1lcyA9IHRoaXMuX3ZlcnRleENsaXBOb2RlLmZyYW1lcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlRnJhbWVzKClcblx0e1xuXHRcdHN1cGVyLl9wVXBkYXRlRnJhbWVzKCk7XG5cblx0XHR0aGlzLl9jdXJyZW50R2VvbWV0cnkgPSB0aGlzLl9mcmFtZXNbdGhpcy5fcEN1cnJlbnRGcmFtZV07XG5cblx0XHRpZiAodGhpcy5fdmVydGV4Q2xpcE5vZGUubG9vcGluZyAmJiB0aGlzLl9wTmV4dEZyYW1lID49IHRoaXMuX3ZlcnRleENsaXBOb2RlLmxhc3RGcmFtZSkge1xuXHRcdFx0dGhpcy5fbmV4dEdlb21ldHJ5ID0gdGhpcy5fZnJhbWVzWzBdO1xuXHRcdFx0KDxWZXJ0ZXhBbmltYXRvcj4gdGhpcy5fcEFuaW1hdG9yKS5kaXNwYXRjaEN5Y2xlRXZlbnQoKTtcblx0XHR9IGVsc2Vcblx0XHRcdHRoaXMuX25leHRHZW9tZXRyeSA9IHRoaXMuX2ZyYW1lc1t0aGlzLl9wTmV4dEZyYW1lXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlUG9zaXRpb25EZWx0YSgpXG5cdHtcblx0XHQvL1RPRE86aW1wbGVtZW50IHBvc2l0aW9uZGVsdGEgZnVuY3Rpb25hbGl0eSBmb3IgdmVydGV4IGFuaW1hdGlvbnNcblx0fVxufVxuXG5leHBvcnQgPSBWZXJ0ZXhDbGlwU3RhdGU7Il19