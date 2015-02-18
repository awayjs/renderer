var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
/**
 * Dispatched to notify changes in an animator's state.
 */
var AnimatorEvent = (function (_super) {
    __extends(AnimatorEvent, _super);
    /**
     * Create a new <code>AnimatorEvent</code> object.
     *
     * @param type The event type.
     * @param animator The animator object that is the subject of this event.
     */
    function AnimatorEvent(type, animator) {
        _super.call(this, type);
        this._animator = animator;
    }
    Object.defineProperty(AnimatorEvent.prototype, "animator", {
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current event object.
     */
    AnimatorEvent.prototype.clone = function () {
        return new AnimatorEvent(this.type, this._animator);
    };
    /**
     * Defines the value of the type property of a start event object.
     */
    AnimatorEvent.START = "start";
    /**
     * Defines the value of the type property of a stop event object.
     */
    AnimatorEvent.STOP = "stop";
    /**
     * Defines the value of the type property of a cycle complete event object.
     */
    AnimatorEvent.CYCLE_COMPLETE = "cycle_complete";
    return AnimatorEvent;
})(Event);
module.exports = AnimatorEvent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvQW5pbWF0b3JFdmVudC50cyJdLCJuYW1lcyI6WyJBbmltYXRvckV2ZW50IiwiQW5pbWF0b3JFdmVudC5jb25zdHJ1Y3RvciIsIkFuaW1hdG9yRXZlbnQuYW5pbWF0b3IiLCJBbmltYXRvckV2ZW50LmNsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLEtBQUssV0FBZ0IsOEJBQThCLENBQUMsQ0FBQztBQUk1RCxBQUdBOztHQURHO0lBQ0csYUFBYTtJQUFTQSxVQUF0QkEsYUFBYUEsVUFBY0E7SUFtQmhDQTs7Ozs7T0FLR0E7SUFDSEEsU0F6QktBLGFBQWFBLENBeUJOQSxJQUFXQSxFQUFFQSxRQUFxQkE7UUFFN0NDLGtCQUFNQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNaQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFREQsc0JBQVdBLG1DQUFRQTthQUFuQkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUY7SUFFREE7Ozs7T0FJR0E7SUFDSUEsNkJBQUtBLEdBQVpBO1FBRUNHLE1BQU1BLENBQUNBLElBQUlBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO0lBQ3JEQSxDQUFDQTtJQTFDREg7O09BRUdBO0lBQ1dBLG1CQUFLQSxHQUFVQSxPQUFPQSxDQUFDQTtJQUVyQ0E7O09BRUdBO0lBQ1dBLGtCQUFJQSxHQUFVQSxNQUFNQSxDQUFDQTtJQUVuQ0E7O09BRUdBO0lBQ1dBLDRCQUFjQSxHQUFVQSxnQkFBZ0JBLENBQUNBO0lBOEJ4REEsb0JBQUNBO0FBQURBLENBN0NBLEFBNkNDQSxFQTdDMkIsS0FBSyxFQTZDaEM7QUFFRCxBQUF1QixpQkFBZCxhQUFhLENBQUMiLCJmaWxlIjoiZXZlbnRzL0FuaW1hdG9yRXZlbnQuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcclxuXHJcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XHJcblxyXG4vKipcclxuICogRGlzcGF0Y2hlZCB0byBub3RpZnkgY2hhbmdlcyBpbiBhbiBhbmltYXRvcidzIHN0YXRlLlxyXG4gKi9cclxuY2xhc3MgQW5pbWF0b3JFdmVudCBleHRlbmRzIEV2ZW50XHJcbntcclxuXHQvKipcclxuXHQgKiBEZWZpbmVzIHRoZSB2YWx1ZSBvZiB0aGUgdHlwZSBwcm9wZXJ0eSBvZiBhIHN0YXJ0IGV2ZW50IG9iamVjdC5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIFNUQVJUOnN0cmluZyA9IFwic3RhcnRcIjtcclxuXHJcblx0LyoqXHJcblx0ICogRGVmaW5lcyB0aGUgdmFsdWUgb2YgdGhlIHR5cGUgcHJvcGVydHkgb2YgYSBzdG9wIGV2ZW50IG9iamVjdC5cclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIFNUT1A6c3RyaW5nID0gXCJzdG9wXCI7XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlZmluZXMgdGhlIHZhbHVlIG9mIHRoZSB0eXBlIHByb3BlcnR5IG9mIGEgY3ljbGUgY29tcGxldGUgZXZlbnQgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgQ1lDTEVfQ09NUExFVEU6c3RyaW5nID0gXCJjeWNsZV9jb21wbGV0ZVwiO1xyXG5cclxuXHRwcml2YXRlIF9hbmltYXRvcjpBbmltYXRvckJhc2U7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBhIG5ldyA8Y29kZT5BbmltYXRvckV2ZW50PC9jb2RlPiBvYmplY3QuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gdHlwZSBUaGUgZXZlbnQgdHlwZS5cclxuXHQgKiBAcGFyYW0gYW5pbWF0b3IgVGhlIGFuaW1hdG9yIG9iamVjdCB0aGF0IGlzIHRoZSBzdWJqZWN0IG9mIHRoaXMgZXZlbnQuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IodHlwZTpzdHJpbmcsIGFuaW1hdG9yOkFuaW1hdG9yQmFzZSlcclxuXHR7XHJcblx0XHRzdXBlcih0eXBlKTtcclxuXHRcdHRoaXMuX2FuaW1hdG9yID0gYW5pbWF0b3I7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGFuaW1hdG9yKCk6QW5pbWF0b3JCYXNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdG9yO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2xvbmVzIHRoZSBldmVudC5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm4gQW4gZXhhY3QgZHVwbGljYXRlIG9mIHRoZSBjdXJyZW50IGV2ZW50IG9iamVjdC5cclxuXHQgKi9cclxuXHRwdWJsaWMgY2xvbmUoKTpFdmVudFxyXG5cdHtcclxuXHRcdHJldHVybiBuZXcgQW5pbWF0b3JFdmVudCh0aGlzLnR5cGUsIHRoaXMuX2FuaW1hdG9yKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IEFuaW1hdG9yRXZlbnQ7Il19