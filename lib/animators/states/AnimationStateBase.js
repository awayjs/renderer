var Vector3D = require("awayjs-core/lib/geom/Vector3D");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvblN0YXRlQmFzZS50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TdGF0ZUJhc2UiLCJBbmltYXRpb25TdGF0ZUJhc2UuY29uc3RydWN0b3IiLCJBbmltYXRpb25TdGF0ZUJhc2UucG9zaXRpb25EZWx0YSIsIkFuaW1hdGlvblN0YXRlQmFzZS5vZmZzZXQiLCJBbmltYXRpb25TdGF0ZUJhc2UudXBkYXRlIiwiQW5pbWF0aW9uU3RhdGVCYXNlLnBoYXNlIiwiQW5pbWF0aW9uU3RhdGVCYXNlLl9wVXBkYXRlVGltZSIsIkFuaW1hdGlvblN0YXRlQmFzZS5fcFVwZGF0ZVBvc2l0aW9uRGVsdGEiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBU2pFLEFBR0E7O0dBREc7SUFDRyxrQkFBa0I7SUF3QnZCQSxTQXhCS0Esa0JBQWtCQSxDQXdCWEEsUUFBcUJBLEVBQUVBLGFBQStCQTtRQXJCM0RDLGdCQUFXQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUN0Q0EseUJBQW9CQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUdwQ0EsZ0JBQVdBLEdBQVVBLENBQUNBLENBQUNBO1FBbUI3QkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGFBQWFBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQWZERCxzQkFBV0EsNkNBQWFBO1FBSHhCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFL0JBLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7WUFDOUJBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBRXpCQSxDQUFDQTs7O09BQUFGO0lBUURBOzs7O09BSUdBO0lBQ0lBLG1DQUFNQSxHQUFiQSxVQUFjQSxTQUFnQkE7UUFFN0JHLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLFNBQVNBLENBQUNBO1FBRTdCQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLENBQUNBO0lBQ2xDQSxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ0lBLG1DQUFNQSxHQUFiQSxVQUFjQSxJQUFXQTtRQUV4QkksRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFNUNBLE1BQU1BLENBQUNBO1FBRVJBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBRXpCQSxDQUFDQTtJQUVESjs7OztPQUlHQTtJQUNJQSxrQ0FBS0EsR0FBWkEsVUFBYUEsS0FBWUE7SUFHekJLLENBQUNBO0lBRURMOzs7O09BSUdBO0lBQ0lBLHlDQUFZQSxHQUFuQkEsVUFBb0JBLElBQVdBO1FBRTlCTSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUV0Q0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUNsQ0EsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLGtEQUFxQkEsR0FBNUJBO0lBRUFPLENBQUNBO0lBQ0ZQLHlCQUFDQTtBQUFEQSxDQXpGQSxBQXlGQ0EsSUFBQTtBQUVELEFBQTRCLGlCQUFuQixrQkFBa0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvblN0YXRlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBJQW5pbWF0aW9uU3RhdGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSUFuaW1hdGlvblN0YXRlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU3RhdGVFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9BbmltYXRpb25TdGF0ZUV2ZW50XCIpO1xuXG4vKipcbiAqXG4gKi9cbmNsYXNzIEFuaW1hdGlvblN0YXRlQmFzZSBpbXBsZW1lbnRzIElBbmltYXRpb25TdGF0ZVxue1xuXHRwdWJsaWMgX3BBbmltYXRpb25Ob2RlOkFuaW1hdGlvbk5vZGVCYXNlO1xuXHRwdWJsaWMgX3BSb290RGVsdGE6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcblx0cHVibGljIF9wUG9zaXRpb25EZWx0YURpcnR5OmJvb2xlYW4gPSB0cnVlO1xuXG5cdHB1YmxpYyBfcFRpbWU6bnVtYmVyO1xuXHRwdWJsaWMgX3BTdGFydFRpbWU6bnVtYmVyID0gMDtcblx0cHVibGljIF9wQW5pbWF0b3I6QW5pbWF0b3JCYXNlO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgM2QgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgdHJhbnNsYXRpb24gZGVsdGEgb2YgdGhlIGFuaW1hdGluZyBlbnRpdHkgZm9yIHRoZSBjdXJyZW50IHRpbWVzdGVwIG9mIGFuaW1hdGlvblxuXHQgKi9cblx0cHVibGljIGdldCBwb3NpdGlvbkRlbHRhKCk6VmVjdG9yM0Rcblx0e1xuXHRcdGlmICh0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5KSB7XG5cblx0XHRcdHRoaXMuX3BVcGRhdGVQb3NpdGlvbkRlbHRhKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3BSb290RGVsdGE7XG5cblx0fVxuXG5cdGNvbnN0cnVjdG9yKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSwgYW5pbWF0aW9uTm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcblx0e1xuXHRcdHRoaXMuX3BBbmltYXRvciA9IGFuaW1hdG9yO1xuXHRcdHRoaXMuX3BBbmltYXRpb25Ob2RlID0gYW5pbWF0aW9uTm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNldHMgdGhlIHN0YXJ0IHRpbWUgb2YgdGhlIG5vZGUgdG8gYSAgbmV3IHZhbHVlLlxuXHQgKlxuXHQgKiBAcGFyYW0gc3RhcnRUaW1lIFRoZSBhYnNvbHV0ZSBzdGFydCB0aW1lIChpbiBtaWxsaXNlY29uZHMpIG9mIHRoZSBub2RlJ3Mgc3RhcnRpbmcgdGltZS5cblx0ICovXG5cdHB1YmxpYyBvZmZzZXQoc3RhcnRUaW1lOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BTdGFydFRpbWUgPSBzdGFydFRpbWU7XG5cblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBub2RlIHRvIGl0cyBjdXJyZW50IHN0YXRlLlxuXHQgKlxuXHQgKiBAcGFyYW0gdGltZSBUaGUgYWJzb2x1dGUgdGltZSAoaW4gbWlsbGlzZWNvbmRzKSBvZiB0aGUgYW5pbWF0b3IncyBwbGF5IGhlYWQgcG9zaXRpb24uXG5cdCAqXG5cdCAqIEBzZWUgQW5pbWF0b3JCYXNlI3VwZGF0ZSgpXG5cdCAqL1xuXHRwdWJsaWMgdXBkYXRlKHRpbWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BUaW1lID09IHRpbWUgLSB0aGlzLl9wU3RhcnRUaW1lKSB7XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH1cblxuXHRcdHRoaXMuX3BVcGRhdGVUaW1lKHRpbWUpO1xuXG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgYW5pbWF0aW9uIHBoYXNlIG9mIHRoZSBub2RlLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHBoYXNlIHZhbHVlIHRvIHVzZS4gMCByZXByZXNlbnRzIHRoZSBiZWdpbm5pbmcgb2YgYW4gYW5pbWF0aW9uIGNsaXAsIDEgcmVwcmVzZW50cyB0aGUgZW5kLlxuXHQgKi9cblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcblx0e1xuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgbm9kZSdzIGludGVybmFsIHBsYXloZWFkIHBvc2l0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gdGltZSBUaGUgbG9jYWwgdGltZSAoaW4gbWlsbGlzZWNvbmRzKSBvZiB0aGUgbm9kZSdzIHBsYXloZWFkIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlVGltZSh0aW1lOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BUaW1lID0gdGltZSAtIHRoaXMuX3BTdGFydFRpbWU7XG5cblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBub2RlJ3Mgcm9vdCBkZWx0YSBwb3NpdGlvblxuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlUG9zaXRpb25EZWx0YSgpXG5cdHtcblx0fVxufVxuXG5leHBvcnQgPSBBbmltYXRpb25TdGF0ZUJhc2U7Il19