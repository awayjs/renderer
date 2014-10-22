var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
/**
 *
 */
var AnimationStateBase = (function () {
    function AnimationStateBase(animator, animationNode) {
        this._pRootDelta = new Vector3D();
        this._pPositionDeltaDirty = true;
        this._pStartTime = 0;
        this._pAnimator = animator;
        this._pAnimationNode = animationNode;
    }
    Object.defineProperty(AnimationStateBase.prototype, "positionDelta", {
        /**
         * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
         */
        get: function () {
            if (this._pPositionDeltaDirty) {
                this._pUpdatePositionDelta();
            }
            return this._pRootDelta;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the start time of the node to a  new value.
     *
     * @param startTime The absolute start time (in milliseconds) of the node's starting time.
     */
    AnimationStateBase.prototype.offset = function (startTime) {
        this._pStartTime = startTime;
        this._pPositionDeltaDirty = true;
    };
    /**
     * Updates the configuration of the node to its current state.
     *
     * @param time The absolute time (in milliseconds) of the animator's play head position.
     *
     * @see AnimatorBase#update()
     */
    AnimationStateBase.prototype.update = function (time) {
        if (this._pTime == time - this._pStartTime) {
            return;
        }
        this._pUpdateTime(time);
    };
    /**
     * Sets the animation phase of the node.
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    AnimationStateBase.prototype.phase = function (value) {
    };
    /**
     * Updates the node's internal playhead position.
     *
     * @param time The local time (in milliseconds) of the node's playhead position.
     */
    AnimationStateBase.prototype._pUpdateTime = function (time) {
        this._pTime = time - this._pStartTime;
        this._pPositionDeltaDirty = true;
    };
    /**
     * Updates the node's root delta position
     */
    AnimationStateBase.prototype._pUpdatePositionDelta = function () {
    };
    return AnimationStateBase;
})();
module.exports = AnimationStateBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9zdGF0ZXMvYW5pbWF0aW9uc3RhdGViYXNlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvblN0YXRlQmFzZSIsIkFuaW1hdGlvblN0YXRlQmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblN0YXRlQmFzZS5wb3NpdGlvbkRlbHRhIiwiQW5pbWF0aW9uU3RhdGVCYXNlLm9mZnNldCIsIkFuaW1hdGlvblN0YXRlQmFzZS51cGRhdGUiLCJBbmltYXRpb25TdGF0ZUJhc2UucGhhc2UiLCJBbmltYXRpb25TdGF0ZUJhc2UuX3BVcGRhdGVUaW1lIiwiQW5pbWF0aW9uU3RhdGVCYXNlLl9wVXBkYXRlUG9zaXRpb25EZWx0YSJdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFPdEUsQUFHQTs7R0FERztJQUNHLGtCQUFrQjtJQXdCdkJBLFNBeEJLQSxrQkFBa0JBLENBd0JYQSxRQUFxQkEsRUFBRUEsYUFBK0JBO1FBckIzREMsZ0JBQVdBLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBQ3RDQSx5QkFBb0JBLEdBQVdBLElBQUlBLENBQUNBO1FBR3BDQSxnQkFBV0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFtQjdCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsYUFBYUEsQ0FBQ0E7SUFDdENBLENBQUNBO0lBZkRELHNCQUFXQSw2Q0FBYUE7UUFIeEJBOztXQUVHQTthQUNIQTtZQUVDRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLENBQUNBLENBQUNBO2dCQUUvQkEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7WUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7UUFFekJBLENBQUNBOzs7T0FBQUY7SUFRREE7Ozs7T0FJR0E7SUFDSUEsbUNBQU1BLEdBQWJBLFVBQWNBLFNBQWdCQTtRQUU3QkcsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFFN0JBLElBQUlBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDbENBLENBQUNBO0lBRURIOzs7Ozs7T0FNR0E7SUFDSUEsbUNBQU1BLEdBQWJBLFVBQWNBLElBQVdBO1FBRXhCSSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU1Q0EsTUFBTUEsQ0FBQ0E7UUFFUkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFFekJBLENBQUNBO0lBRURKOzs7O09BSUdBO0lBQ0lBLGtDQUFLQSxHQUFaQSxVQUFhQSxLQUFZQTtJQUd6QkssQ0FBQ0E7SUFFREw7Ozs7T0FJR0E7SUFDSUEseUNBQVlBLEdBQW5CQSxVQUFvQkEsSUFBV0E7UUFFOUJNLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBRXRDQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLENBQUNBO0lBQ2xDQSxDQUFDQTtJQUVETjs7T0FFR0E7SUFDSUEsa0RBQXFCQSxHQUE1QkE7SUFFQU8sQ0FBQ0E7SUFDRlAseUJBQUNBO0FBQURBLENBekZBLEFBeUZDQSxJQUFBO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9zdGF0ZXMvQW5pbWF0aW9uU3RhdGVCYXNlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgSUFuaW1hdGlvblN0YXRlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lBbmltYXRpb25TdGF0ZVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblN0YXRlRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvQW5pbWF0aW9uU3RhdGVFdmVudFwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBBbmltYXRpb25TdGF0ZUJhc2UgaW1wbGVtZW50cyBJQW5pbWF0aW9uU3RhdGVcbntcblx0cHVibGljIF9wQW5pbWF0aW9uTm9kZTpBbmltYXRpb25Ob2RlQmFzZTtcblx0cHVibGljIF9wUm9vdERlbHRhOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cdHB1YmxpYyBfcFBvc2l0aW9uRGVsdGFEaXJ0eTpib29sZWFuID0gdHJ1ZTtcblxuXHRwdWJsaWMgX3BUaW1lOm51bWJlcjtcblx0cHVibGljIF9wU3RhcnRUaW1lOm51bWJlciA9IDA7XG5cdHB1YmxpYyBfcEFuaW1hdG9yOkFuaW1hdG9yQmFzZTtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIDNkIHZlY3RvciByZXByZXNlbnRpbmcgdGhlIHRyYW5zbGF0aW9uIGRlbHRhIG9mIHRoZSBhbmltYXRpbmcgZW50aXR5IGZvciB0aGUgY3VycmVudCB0aW1lc3RlcCBvZiBhbmltYXRpb25cblx0ICovXG5cdHB1YmxpYyBnZXQgcG9zaXRpb25EZWx0YSgpOlZlY3RvcjNEXG5cdHtcblx0XHRpZiAodGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSkge1xuXG5cdFx0XHR0aGlzLl9wVXBkYXRlUG9zaXRpb25EZWx0YSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9wUm9vdERlbHRhO1xuXG5cdH1cblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIGFuaW1hdGlvbk5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpXG5cdHtcblx0XHR0aGlzLl9wQW5pbWF0b3IgPSBhbmltYXRvcjtcblx0XHR0aGlzLl9wQW5pbWF0aW9uTm9kZSA9IGFuaW1hdGlvbk5vZGU7XG5cdH1cblxuXHQvKipcblx0ICogUmVzZXRzIHRoZSBzdGFydCB0aW1lIG9mIHRoZSBub2RlIHRvIGEgIG5ldyB2YWx1ZS5cblx0ICpcblx0ICogQHBhcmFtIHN0YXJ0VGltZSBUaGUgYWJzb2x1dGUgc3RhcnQgdGltZSAoaW4gbWlsbGlzZWNvbmRzKSBvZiB0aGUgbm9kZSdzIHN0YXJ0aW5nIHRpbWUuXG5cdCAqL1xuXHRwdWJsaWMgb2Zmc2V0KHN0YXJ0VGltZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wU3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuXG5cdFx0dGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgbm9kZSB0byBpdHMgY3VycmVudCBzdGF0ZS5cblx0ICpcblx0ICogQHBhcmFtIHRpbWUgVGhlIGFic29sdXRlIHRpbWUgKGluIG1pbGxpc2Vjb25kcykgb2YgdGhlIGFuaW1hdG9yJ3MgcGxheSBoZWFkIHBvc2l0aW9uLlxuXHQgKlxuXHQgKiBAc2VlIEFuaW1hdG9yQmFzZSN1cGRhdGUoKVxuXHQgKi9cblx0cHVibGljIHVwZGF0ZSh0aW1lOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9wVGltZSA9PSB0aW1lIC0gdGhpcy5fcFN0YXJ0VGltZSkge1xuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9XG5cblx0XHR0aGlzLl9wVXBkYXRlVGltZSh0aW1lKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGFuaW1hdGlvbiBwaGFzZSBvZiB0aGUgbm9kZS5cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBwaGFzZSB2YWx1ZSB0byB1c2UuIDAgcmVwcmVzZW50cyB0aGUgYmVnaW5uaW5nIG9mIGFuIGFuaW1hdGlvbiBjbGlwLCAxIHJlcHJlc2VudHMgdGhlIGVuZC5cblx0ICovXG5cdHB1YmxpYyBwaGFzZSh2YWx1ZTpudW1iZXIpXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIG5vZGUncyBpbnRlcm5hbCBwbGF5aGVhZCBwb3NpdGlvbi5cblx0ICpcblx0ICogQHBhcmFtIHRpbWUgVGhlIGxvY2FsIHRpbWUgKGluIG1pbGxpc2Vjb25kcykgb2YgdGhlIG5vZGUncyBwbGF5aGVhZCBwb3NpdGlvbi5cblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZVRpbWUodGltZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wVGltZSA9IHRpbWUgLSB0aGlzLl9wU3RhcnRUaW1lO1xuXG5cdFx0dGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgbm9kZSdzIHJvb3QgZGVsdGEgcG9zaXRpb25cblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZVBvc2l0aW9uRGVsdGEoKVxuXHR7XG5cdH1cbn1cblxuZXhwb3J0ID0gQW5pbWF0aW9uU3RhdGVCYXNlOyJdfQ==