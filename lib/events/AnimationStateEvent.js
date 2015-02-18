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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvQW5pbWF0aW9uU3RhdGVFdmVudC50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TdGF0ZUV2ZW50IiwiQW5pbWF0aW9uU3RhdGVFdmVudC5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblN0YXRlRXZlbnQuYW5pbWF0b3IiLCJBbmltYXRpb25TdGF0ZUV2ZW50LmFuaW1hdGlvblN0YXRlIiwiQW5pbWF0aW9uU3RhdGVFdmVudC5hbmltYXRpb25Ob2RlIiwiQW5pbWF0aW9uU3RhdGVFdmVudC5jbG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxLQUFLLFdBQWlCLDhCQUE4QixDQUFDLENBQUM7QUFLN0QsQUFHQTs7R0FERztJQUNHLG1CQUFtQjtJQUFTQSxVQUE1QkEsbUJBQW1CQSxVQUFjQTtJQWF0Q0E7Ozs7OztPQU1HQTtJQUNIQSxTQXBCS0EsbUJBQW1CQSxDQW9CWkEsSUFBV0EsRUFBRUEsUUFBcUJBLEVBQUVBLGNBQThCQSxFQUFFQSxhQUErQkE7UUFFOUdDLGtCQUFNQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUVaQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLGFBQWFBLENBQUNBO0lBQ3JDQSxDQUFDQTtJQUtERCxzQkFBV0EseUNBQVFBO1FBSG5CQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUY7SUFLREEsc0JBQVdBLCtDQUFjQTtRQUh6QkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQzdCQSxDQUFDQTs7O09BQUFIO0lBS0RBLHNCQUFXQSw4Q0FBYUE7UUFIeEJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7OztPQUFBSjtJQUVEQTs7OztPQUlHQTtJQUNJQSxtQ0FBS0EsR0FBWkE7UUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtJQUN0R0EsQ0FBQ0E7SUEzRERMOztPQUVHQTtJQUNXQSxxQ0FBaUJBLEdBQVVBLGtCQUFrQkEsQ0FBQ0E7SUFFOUNBLHVDQUFtQkEsR0FBVUEsb0JBQW9CQSxDQUFDQTtJQXVEakVBLDBCQUFDQTtBQUFEQSxDQTlEQSxBQThEQ0EsRUE5RGlDLEtBQUssRUE4RHRDO0FBRUQsQUFBNkIsaUJBQXBCLG1CQUFtQixDQUFDIiwiZmlsZSI6ImV2ZW50cy9BbmltYXRpb25TdGF0ZUV2ZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25Ob2RlQmFzZVwiKTtcclxuXHJcbmltcG9ydCBFdmVudFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcclxuXHJcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcclxuaW1wb3J0IElBbmltYXRpb25TdGF0ZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9JQW5pbWF0aW9uU3RhdGVcIik7XHJcblxyXG4vKipcclxuICogRGlzcGF0Y2hlZCB0byBub3RpZnkgY2hhbmdlcyBpbiBhbiBhbmltYXRpb24gc3RhdGUncyBzdGF0ZS5cclxuICovXHJcbmNsYXNzIEFuaW1hdGlvblN0YXRlRXZlbnQgZXh0ZW5kcyBFdmVudFxyXG57XHJcblx0LyoqXHJcblx0ICogRGlzcGF0Y2hlZCB3aGVuIGEgbm9uLWxvb3BpbmcgY2xpcCBub2RlIGluc2lkZSBhbiBhbmltYXRpb24gc3RhdGUgcmVhY2hlcyB0aGUgZW5kIG9mIGl0cyB0aW1lbGluZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIFBMQVlCQUNLX0NPTVBMRVRFOnN0cmluZyA9IFwicGxheWJhY2tDb21wbGV0ZVwiO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIFRSQU5TSVRJT05fQ09NUExFVEU6c3RyaW5nID0gXCJ0cmFuc2l0aW9uQ29tcGxldGVcIjtcclxuXHJcblx0cHJpdmF0ZSBfYW5pbWF0b3I6QW5pbWF0b3JCYXNlO1xyXG5cdHByaXZhdGUgX2FuaW1hdGlvblN0YXRlOklBbmltYXRpb25TdGF0ZTtcclxuXHRwcml2YXRlIF9hbmltYXRpb25Ob2RlOkFuaW1hdGlvbk5vZGVCYXNlO1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgYSBuZXcgPGNvZGU+QW5pbWF0b25TdGF0ZUV2ZW50PC9jb2RlPlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHR5cGUgVGhlIGV2ZW50IHR5cGUuXHJcblx0ICogQHBhcmFtIGFuaW1hdG9yIFRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRoYXQgaXMgdGhlIHN1YmplY3Qgb2YgdGhpcyBldmVudC5cclxuXHQgKiBAcGFyYW0gYW5pbWF0aW9uTm9kZSBUaGUgYW5pbWF0aW9uIG5vZGUgaW5zaWRlIHRoZSBhbmltYXRpb24gc3RhdGUgZnJvbSB3aGljaCB0aGUgZXZlbnQgb3JpZ2luYXRlZC5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3Rvcih0eXBlOnN0cmluZywgYW5pbWF0b3I6QW5pbWF0b3JCYXNlLCBhbmltYXRpb25TdGF0ZTpJQW5pbWF0aW9uU3RhdGUsIGFuaW1hdGlvbk5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpXHJcblx0e1xyXG5cdFx0c3VwZXIodHlwZSk7XHJcblxyXG5cdFx0dGhpcy5fYW5pbWF0b3IgPSBhbmltYXRvcjtcclxuXHRcdHRoaXMuX2FuaW1hdGlvblN0YXRlID0gYW5pbWF0aW9uU3RhdGU7XHJcblx0XHR0aGlzLl9hbmltYXRpb25Ob2RlID0gYW5pbWF0aW9uTm9kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBhbmltYXRvciBvYmplY3QgdGhhdCBpcyB0aGUgc3ViamVjdCBvZiB0aGlzIGV2ZW50LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYW5pbWF0b3IoKTpBbmltYXRvckJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0b3I7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0aGF0IGlzIHRoZSBzdWJqZWN0IG9mIHRoaXMgZXZlbnQuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBhbmltYXRpb25TdGF0ZSgpOklBbmltYXRpb25TdGF0ZVxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9hbmltYXRpb25TdGF0ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBhbmltYXRpb24gbm9kZSBpbnNpZGUgdGhlIGFuaW1hdGlvbiBzdGF0ZSBmcm9tIHdoaWNoIHRoZSBldmVudCBvcmlnaW5hdGVkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYW5pbWF0aW9uTm9kZSgpOkFuaW1hdGlvbk5vZGVCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbk5vZGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDbG9uZXMgdGhlIGV2ZW50LlxyXG5cdCAqXHJcblx0ICogQHJldHVybiBBbiBleGFjdCBkdXBsaWNhdGUgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBjbG9uZSgpOkV2ZW50XHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBBbmltYXRpb25TdGF0ZUV2ZW50KHRoaXMudHlwZSwgdGhpcy5fYW5pbWF0b3IsIHRoaXMuX2FuaW1hdGlvblN0YXRlLCB0aGlzLl9hbmltYXRpb25Ob2RlKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IEFuaW1hdGlvblN0YXRlRXZlbnQ7Il19