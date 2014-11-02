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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvYW5pbWF0aW9uc3RhdGVldmVudC50cyJdLCJuYW1lcyI6WyJBbmltYXRpb25TdGF0ZUV2ZW50IiwiQW5pbWF0aW9uU3RhdGVFdmVudC5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvblN0YXRlRXZlbnQuYW5pbWF0b3IiLCJBbmltYXRpb25TdGF0ZUV2ZW50LmFuaW1hdGlvblN0YXRlIiwiQW5pbWF0aW9uU3RhdGVFdmVudC5hbmltYXRpb25Ob2RlIiwiQW5pbWF0aW9uU3RhdGVFdmVudC5jbG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxLQUFLLFdBQWlCLDhCQUE4QixDQUFDLENBQUM7QUFLN0QsQUFHQTs7R0FERztJQUNHLG1CQUFtQjtJQUFTQSxVQUE1QkEsbUJBQW1CQSxVQUFjQTtJQWF0Q0E7Ozs7OztPQU1HQTtJQUNIQSxTQXBCS0EsbUJBQW1CQSxDQW9CWkEsSUFBV0EsRUFBRUEsUUFBcUJBLEVBQUVBLGNBQThCQSxFQUFFQSxhQUErQkE7UUFFOUdDLGtCQUFNQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUVaQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLGFBQWFBLENBQUNBO0lBQ3JDQSxDQUFDQTtJQUtERCxzQkFBV0EseUNBQVFBO1FBSG5CQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUY7SUFLREEsc0JBQVdBLCtDQUFjQTtRQUh6QkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQzdCQSxDQUFDQTs7O09BQUFIO0lBS0RBLHNCQUFXQSw4Q0FBYUE7UUFIeEJBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7OztPQUFBSjtJQUVEQTs7OztPQUlHQTtJQUNJQSxtQ0FBS0EsR0FBWkE7UUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtJQUN0R0EsQ0FBQ0E7SUEzRERMOztPQUVHQTtJQUNXQSxxQ0FBaUJBLEdBQVVBLGtCQUFrQkEsQ0FBQ0E7SUFFOUNBLHVDQUFtQkEsR0FBVUEsb0JBQW9CQSxDQUFDQTtJQXVEakVBLDBCQUFDQTtBQUFEQSxDQTlEQSxBQThEQ0EsRUE5RGlDLEtBQUssRUE4RHRDO0FBRUQsQUFBNkIsaUJBQXBCLG1CQUFtQixDQUFDIiwiZmlsZSI6ImV2ZW50cy9BbmltYXRpb25TdGF0ZUV2ZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25Ob2RlQmFzZVwiKTtcblxuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0V2ZW50XCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgSUFuaW1hdGlvblN0YXRlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lBbmltYXRpb25TdGF0ZVwiKTtcblxuLyoqXG4gKiBEaXNwYXRjaGVkIHRvIG5vdGlmeSBjaGFuZ2VzIGluIGFuIGFuaW1hdGlvbiBzdGF0ZSdzIHN0YXRlLlxuICovXG5jbGFzcyBBbmltYXRpb25TdGF0ZUV2ZW50IGV4dGVuZHMgRXZlbnRcbntcblx0LyoqXG5cdCAqIERpc3BhdGNoZWQgd2hlbiBhIG5vbi1sb29waW5nIGNsaXAgbm9kZSBpbnNpZGUgYW4gYW5pbWF0aW9uIHN0YXRlIHJlYWNoZXMgdGhlIGVuZCBvZiBpdHMgdGltZWxpbmUuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIFBMQVlCQUNLX0NPTVBMRVRFOnN0cmluZyA9IFwicGxheWJhY2tDb21wbGV0ZVwiO1xuXG5cdHB1YmxpYyBzdGF0aWMgVFJBTlNJVElPTl9DT01QTEVURTpzdHJpbmcgPSBcInRyYW5zaXRpb25Db21wbGV0ZVwiO1xuXG5cdHByaXZhdGUgX2FuaW1hdG9yOkFuaW1hdG9yQmFzZTtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uU3RhdGU6SUFuaW1hdGlvblN0YXRlO1xuXHRwcml2YXRlIF9hbmltYXRpb25Ob2RlOkFuaW1hdGlvbk5vZGVCYXNlO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgPGNvZGU+QW5pbWF0b25TdGF0ZUV2ZW50PC9jb2RlPlxuXHQgKlxuXHQgKiBAcGFyYW0gdHlwZSBUaGUgZXZlbnQgdHlwZS5cblx0ICogQHBhcmFtIGFuaW1hdG9yIFRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0IHRoYXQgaXMgdGhlIHN1YmplY3Qgb2YgdGhpcyBldmVudC5cblx0ICogQHBhcmFtIGFuaW1hdGlvbk5vZGUgVGhlIGFuaW1hdGlvbiBub2RlIGluc2lkZSB0aGUgYW5pbWF0aW9uIHN0YXRlIGZyb20gd2hpY2ggdGhlIGV2ZW50IG9yaWdpbmF0ZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0eXBlOnN0cmluZywgYW5pbWF0b3I6QW5pbWF0b3JCYXNlLCBhbmltYXRpb25TdGF0ZTpJQW5pbWF0aW9uU3RhdGUsIGFuaW1hdGlvbk5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpXG5cdHtcblx0XHRzdXBlcih0eXBlKTtcblxuXHRcdHRoaXMuX2FuaW1hdG9yID0gYW5pbWF0b3I7XG5cdFx0dGhpcy5fYW5pbWF0aW9uU3RhdGUgPSBhbmltYXRpb25TdGF0ZTtcblx0XHR0aGlzLl9hbmltYXRpb25Ob2RlID0gYW5pbWF0aW9uTm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW5pbWF0b3Igb2JqZWN0IHRoYXQgaXMgdGhlIHN1YmplY3Qgb2YgdGhpcyBldmVudC5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW5pbWF0b3IoKTpBbmltYXRvckJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdCB0aGF0IGlzIHRoZSBzdWJqZWN0IG9mIHRoaXMgZXZlbnQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvblN0YXRlKCk6SUFuaW1hdGlvblN0YXRlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uU3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFuaW1hdGlvbiBub2RlIGluc2lkZSB0aGUgYW5pbWF0aW9uIHN0YXRlIGZyb20gd2hpY2ggdGhlIGV2ZW50IG9yaWdpbmF0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvbk5vZGUoKTpBbmltYXRpb25Ob2RlQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvbk5vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmVzIHRoZSBldmVudC5cblx0ICpcblx0ICogQHJldHVybiBBbiBleGFjdCBkdXBsaWNhdGUgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIGNsb25lKCk6RXZlbnRcblx0e1xuXHRcdHJldHVybiBuZXcgQW5pbWF0aW9uU3RhdGVFdmVudCh0aGlzLnR5cGUsIHRoaXMuX2FuaW1hdG9yLCB0aGlzLl9hbmltYXRpb25TdGF0ZSwgdGhpcy5fYW5pbWF0aW9uTm9kZSk7XG5cdH1cbn1cblxuZXhwb3J0ID0gQW5pbWF0aW9uU3RhdGVFdmVudDsiXX0=