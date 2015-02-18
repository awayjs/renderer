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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvblN0YXRlQmFzZS50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TdGF0ZUJhc2UiLCJBbmltYXRpb25TdGF0ZUJhc2UuY29uc3RydWN0b3IiLCJBbmltYXRpb25TdGF0ZUJhc2UucG9zaXRpb25EZWx0YSIsIkFuaW1hdGlvblN0YXRlQmFzZS5vZmZzZXQiLCJBbmltYXRpb25TdGF0ZUJhc2UudXBkYXRlIiwiQW5pbWF0aW9uU3RhdGVCYXNlLnBoYXNlIiwiQW5pbWF0aW9uU3RhdGVCYXNlLl9wVXBkYXRlVGltZSIsIkFuaW1hdGlvblN0YXRlQmFzZS5fcFVwZGF0ZVBvc2l0aW9uRGVsdGEiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBU2pFLEFBR0E7O0dBREc7SUFDRyxrQkFBa0I7SUF3QnZCQSxTQXhCS0Esa0JBQWtCQSxDQXdCWEEsUUFBcUJBLEVBQUVBLGFBQStCQTtRQXJCM0RDLGdCQUFXQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUN0Q0EseUJBQW9CQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUdwQ0EsZ0JBQVdBLEdBQVVBLENBQUNBLENBQUNBO1FBbUI3QkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGFBQWFBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQWZERCxzQkFBV0EsNkNBQWFBO1FBSHhCQTs7V0FFR0E7YUFDSEE7WUFFQ0UsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFL0JBLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7WUFDOUJBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1FBRXpCQSxDQUFDQTs7O09BQUFGO0lBUURBOzs7O09BSUdBO0lBQ0lBLG1DQUFNQSxHQUFiQSxVQUFjQSxTQUFnQkE7UUFFN0JHLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLFNBQVNBLENBQUNBO1FBRTdCQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEdBQUdBLElBQUlBLENBQUNBO0lBQ2xDQSxDQUFDQTtJQUVESDs7Ozs7O09BTUdBO0lBQ0lBLG1DQUFNQSxHQUFiQSxVQUFjQSxJQUFXQTtRQUV4QkksRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFNUNBLE1BQU1BLENBQUNBO1FBRVJBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBRXpCQSxDQUFDQTtJQUVESjs7OztPQUlHQTtJQUNJQSxrQ0FBS0EsR0FBWkEsVUFBYUEsS0FBWUE7SUFHekJLLENBQUNBO0lBRURMOzs7O09BSUdBO0lBQ0lBLHlDQUFZQSxHQUFuQkEsVUFBb0JBLElBQVdBO1FBRTlCTSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUV0Q0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUNsQ0EsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLGtEQUFxQkEsR0FBNUJBO0lBRUFPLENBQUNBO0lBQ0ZQLHlCQUFDQTtBQUFEQSxDQXpGQSxBQXlGQ0EsSUFBQTtBQUVELEFBQTRCLGlCQUFuQixrQkFBa0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvblN0YXRlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xyXG5pbXBvcnQgSUFuaW1hdGlvblN0YXRlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lBbmltYXRpb25TdGF0ZVwiKTtcclxuXHJcbmltcG9ydCBBbmltYXRpb25TdGF0ZUV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXZlbnRzL0FuaW1hdGlvblN0YXRlRXZlbnRcIik7XHJcblxyXG4vKipcclxuICpcclxuICovXHJcbmNsYXNzIEFuaW1hdGlvblN0YXRlQmFzZSBpbXBsZW1lbnRzIElBbmltYXRpb25TdGF0ZVxyXG57XHJcblx0cHVibGljIF9wQW5pbWF0aW9uTm9kZTpBbmltYXRpb25Ob2RlQmFzZTtcclxuXHRwdWJsaWMgX3BSb290RGVsdGE6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcclxuXHRwdWJsaWMgX3BQb3NpdGlvbkRlbHRhRGlydHk6Ym9vbGVhbiA9IHRydWU7XHJcblxyXG5cdHB1YmxpYyBfcFRpbWU6bnVtYmVyO1xyXG5cdHB1YmxpYyBfcFN0YXJ0VGltZTpudW1iZXIgPSAwO1xyXG5cdHB1YmxpYyBfcEFuaW1hdG9yOkFuaW1hdG9yQmFzZTtcclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyBhIDNkIHZlY3RvciByZXByZXNlbnRpbmcgdGhlIHRyYW5zbGF0aW9uIGRlbHRhIG9mIHRoZSBhbmltYXRpbmcgZW50aXR5IGZvciB0aGUgY3VycmVudCB0aW1lc3RlcCBvZiBhbmltYXRpb25cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHBvc2l0aW9uRGVsdGEoKTpWZWN0b3IzRFxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5KSB7XHJcblxyXG5cdFx0XHR0aGlzLl9wVXBkYXRlUG9zaXRpb25EZWx0YSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLl9wUm9vdERlbHRhO1xyXG5cclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSwgYW5pbWF0aW9uTm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcclxuXHR7XHJcblx0XHR0aGlzLl9wQW5pbWF0b3IgPSBhbmltYXRvcjtcclxuXHRcdHRoaXMuX3BBbmltYXRpb25Ob2RlID0gYW5pbWF0aW9uTm9kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc2V0cyB0aGUgc3RhcnQgdGltZSBvZiB0aGUgbm9kZSB0byBhICBuZXcgdmFsdWUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gc3RhcnRUaW1lIFRoZSBhYnNvbHV0ZSBzdGFydCB0aW1lIChpbiBtaWxsaXNlY29uZHMpIG9mIHRoZSBub2RlJ3Mgc3RhcnRpbmcgdGltZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgb2Zmc2V0KHN0YXJ0VGltZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0dGhpcy5fcFN0YXJ0VGltZSA9IHN0YXJ0VGltZTtcclxuXHJcblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFVwZGF0ZXMgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIG5vZGUgdG8gaXRzIGN1cnJlbnQgc3RhdGUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gdGltZSBUaGUgYWJzb2x1dGUgdGltZSAoaW4gbWlsbGlzZWNvbmRzKSBvZiB0aGUgYW5pbWF0b3IncyBwbGF5IGhlYWQgcG9zaXRpb24uXHJcblx0ICpcclxuXHQgKiBAc2VlIEFuaW1hdG9yQmFzZSN1cGRhdGUoKVxyXG5cdCAqL1xyXG5cdHB1YmxpYyB1cGRhdGUodGltZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX3BUaW1lID09IHRpbWUgLSB0aGlzLl9wU3RhcnRUaW1lKSB7XHJcblxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3BVcGRhdGVUaW1lKHRpbWUpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldHMgdGhlIGFuaW1hdGlvbiBwaGFzZSBvZiB0aGUgbm9kZS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgcGhhc2UgdmFsdWUgdG8gdXNlLiAwIHJlcHJlc2VudHMgdGhlIGJlZ2lubmluZyBvZiBhbiBhbmltYXRpb24gY2xpcCwgMSByZXByZXNlbnRzIHRoZSBlbmQuXHJcblx0ICovXHJcblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVXBkYXRlcyB0aGUgbm9kZSdzIGludGVybmFsIHBsYXloZWFkIHBvc2l0aW9uLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHRpbWUgVGhlIGxvY2FsIHRpbWUgKGluIG1pbGxpc2Vjb25kcykgb2YgdGhlIG5vZGUncyBwbGF5aGVhZCBwb3NpdGlvbi5cclxuXHQgKi9cclxuXHRwdWJsaWMgX3BVcGRhdGVUaW1lKHRpbWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3BUaW1lID0gdGltZSAtIHRoaXMuX3BTdGFydFRpbWU7XHJcblxyXG5cdFx0dGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBVcGRhdGVzIHRoZSBub2RlJ3Mgcm9vdCBkZWx0YSBwb3NpdGlvblxyXG5cdCAqL1xyXG5cdHB1YmxpYyBfcFVwZGF0ZVBvc2l0aW9uRGVsdGEoKVxyXG5cdHtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IEFuaW1hdGlvblN0YXRlQmFzZTsiXX0=