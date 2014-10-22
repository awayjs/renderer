var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
/**
 * Dispatched to notify changes in an animation state's state.
 */
var AnimationStateEvent = (function (_super) {
    __extends(AnimationStateEvent, _super);
    /**
     * Create a new <code>AnimatonStateEvent</code>
     *
     * @param type The event type.
     * @param animator The animation state object that is the subject of this event.
     * @param animationNode The animation node inside the animation state from which the event originated.
     */
    function AnimationStateEvent(type, animator, animationState, animationNode) {
        _super.call(this, type);
        this._animator = animator;
        this._animationState = animationState;
        this._animationNode = animationNode;
    }
    Object.defineProperty(AnimationStateEvent.prototype, "animator", {
        /**
         * The animator object that is the subject of this event.
         */
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationStateEvent.prototype, "animationState", {
        /**
         * The animation state object that is the subject of this event.
         */
        get: function () {
            return this._animationState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationStateEvent.prototype, "animationNode", {
        /**
         * The animation node inside the animation state from which the event originated.
         */
        get: function () {
            return this._animationNode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    AnimationStateEvent.prototype.clone = function () {
        return new AnimationStateEvent(this.type, this._animator, this._animationState, this._animationNode);
    };
    /**
     * Dispatched when a non-looping clip node inside an animation state reaches the end of its timeline.
     */
    AnimationStateEvent.PLAYBACK_COMPLETE = "playbackComplete";
    AnimationStateEvent.TRANSITION_COMPLETE = "transitionComplete";
    return AnimationStateEvent;
})(Event);
module.exports = AnimationStateEvent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50cy9hbmltYXRpb25zdGF0ZWV2ZW50LnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvblN0YXRlRXZlbnQiLCJBbmltYXRpb25TdGF0ZUV2ZW50LmNvbnN0cnVjdG9yIiwiQW5pbWF0aW9uU3RhdGVFdmVudC5hbmltYXRvciIsIkFuaW1hdGlvblN0YXRlRXZlbnQuYW5pbWF0aW9uU3RhdGUiLCJBbmltYXRpb25TdGF0ZUV2ZW50LmFuaW1hdGlvbk5vZGUiLCJBbmltYXRpb25TdGF0ZUV2ZW50LmNsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFPLEtBQUssV0FBaUIsOEJBQThCLENBQUMsQ0FBQztBQUs3RCxBQUdBOztHQURHO0lBQ0csbUJBQW1CO0lBQVNBLFVBQTVCQSxtQkFBbUJBLFVBQWNBO0lBYXRDQTs7Ozs7O09BTUdBO0lBQ0hBLFNBcEJLQSxtQkFBbUJBLENBb0JaQSxJQUFXQSxFQUFFQSxRQUFxQkEsRUFBRUEsY0FBOEJBLEVBQUVBLGFBQStCQTtRQUU5R0Msa0JBQU1BLElBQUlBLENBQUNBLENBQUNBO1FBRVpBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFFBQVFBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxjQUFjQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsYUFBYUEsQ0FBQ0E7SUFDckNBLENBQUNBO0lBS0RELHNCQUFXQSx5Q0FBUUE7UUFIbkJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUN2QkEsQ0FBQ0E7OztPQUFBRjtJQUtEQSxzQkFBV0EsK0NBQWNBO1FBSHpCQTs7V0FFR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDN0JBLENBQUNBOzs7T0FBQUg7SUFLREEsc0JBQVdBLDhDQUFhQTtRQUh4QkE7O1dBRUdBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBQzVCQSxDQUFDQTs7O09BQUFKO0lBRURBOzs7O09BSUdBO0lBQ0lBLG1DQUFLQSxHQUFaQTtRQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO0lBQ3RHQSxDQUFDQTtJQTNEREw7O09BRUdBO0lBQ1dBLHFDQUFpQkEsR0FBVUEsa0JBQWtCQSxDQUFDQTtJQUU5Q0EsdUNBQW1CQSxHQUFVQSxvQkFBb0JBLENBQUNBO0lBdURqRUEsMEJBQUNBO0FBQURBLENBOURBLEFBOERDQSxFQTlEaUMsS0FBSyxFQThEdEM7QUFFRCxBQUE2QixpQkFBcEIsbUJBQW1CLENBQUMiLCJmaWxlIjoiZXZlbnRzL0FuaW1hdGlvblN0YXRlRXZlbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5pbXBvcnQgRXZlbnRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnRcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBJQW5pbWF0aW9uU3RhdGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSUFuaW1hdGlvblN0YXRlXCIpO1xuXG4vKipcbiAqIERpc3BhdGNoZWQgdG8gbm90aWZ5IGNoYW5nZXMgaW4gYW4gYW5pbWF0aW9uIHN0YXRlJ3Mgc3RhdGUuXG4gKi9cbmNsYXNzIEFuaW1hdGlvblN0YXRlRXZlbnQgZXh0ZW5kcyBFdmVudFxue1xuXHQvKipcblx0ICogRGlzcGF0Y2hlZCB3aGVuIGEgbm9uLWxvb3BpbmcgY2xpcCBub2RlIGluc2lkZSBhbiBhbmltYXRpb24gc3RhdGUgcmVhY2hlcyB0aGUgZW5kIG9mIGl0cyB0aW1lbGluZS5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgUExBWUJBQ0tfQ09NUExFVEU6c3RyaW5nID0gXCJwbGF5YmFja0NvbXBsZXRlXCI7XG5cblx0cHVibGljIHN0YXRpYyBUUkFOU0lUSU9OX0NPTVBMRVRFOnN0cmluZyA9IFwidHJhbnNpdGlvbkNvbXBsZXRlXCI7XG5cblx0cHJpdmF0ZSBfYW5pbWF0b3I6QW5pbWF0b3JCYXNlO1xuXHRwcml2YXRlIF9hbmltYXRpb25TdGF0ZTpJQW5pbWF0aW9uU3RhdGU7XG5cdHByaXZhdGUgX2FuaW1hdGlvbk5vZGU6QW5pbWF0aW9uTm9kZUJhc2U7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyA8Y29kZT5BbmltYXRvblN0YXRlRXZlbnQ8L2NvZGU+XG5cdCAqXG5cdCAqIEBwYXJhbSB0eXBlIFRoZSBldmVudCB0eXBlLlxuXHQgKiBAcGFyYW0gYW5pbWF0b3IgVGhlIGFuaW1hdGlvbiBzdGF0ZSBvYmplY3QgdGhhdCBpcyB0aGUgc3ViamVjdCBvZiB0aGlzIGV2ZW50LlxuXHQgKiBAcGFyYW0gYW5pbWF0aW9uTm9kZSBUaGUgYW5pbWF0aW9uIG5vZGUgaW5zaWRlIHRoZSBhbmltYXRpb24gc3RhdGUgZnJvbSB3aGljaCB0aGUgZXZlbnQgb3JpZ2luYXRlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHR5cGU6c3RyaW5nLCBhbmltYXRvcjpBbmltYXRvckJhc2UsIGFuaW1hdGlvblN0YXRlOklBbmltYXRpb25TdGF0ZSwgYW5pbWF0aW9uTm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcblx0e1xuXHRcdHN1cGVyKHR5cGUpO1xuXG5cdFx0dGhpcy5fYW5pbWF0b3IgPSBhbmltYXRvcjtcblx0XHR0aGlzLl9hbmltYXRpb25TdGF0ZSA9IGFuaW1hdGlvblN0YXRlO1xuXHRcdHRoaXMuX2FuaW1hdGlvbk5vZGUgPSBhbmltYXRpb25Ob2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbmltYXRvciBvYmplY3QgdGhhdCBpcyB0aGUgc3ViamVjdCBvZiB0aGlzIGV2ZW50LlxuXHQgKi9cblx0cHVibGljIGdldCBhbmltYXRvcigpOkFuaW1hdG9yQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdG9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRoYXQgaXMgdGhlIHN1YmplY3Qgb2YgdGhpcyBldmVudC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW5pbWF0aW9uU3RhdGUoKTpJQW5pbWF0aW9uU3RhdGVcblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRpb25TdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW5pbWF0aW9uIG5vZGUgaW5zaWRlIHRoZSBhbmltYXRpb24gc3RhdGUgZnJvbSB3aGljaCB0aGUgZXZlbnQgb3JpZ2luYXRlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW5pbWF0aW9uTm9kZSgpOkFuaW1hdGlvbk5vZGVCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uTm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZXMgdGhlIGV2ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGV4YWN0IGR1cGxpY2F0ZSBvZiB0aGUgY3VycmVudCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTpFdmVudFxuXHR7XG5cdFx0cmV0dXJuIG5ldyBBbmltYXRpb25TdGF0ZUV2ZW50KHRoaXMudHlwZSwgdGhpcy5fYW5pbWF0b3IsIHRoaXMuX2FuaW1hdGlvblN0YXRlLCB0aGlzLl9hbmltYXRpb25Ob2RlKTtcblx0fVxufVxuXG5leHBvcnQgPSBBbmltYXRpb25TdGF0ZUV2ZW50OyJdfQ==