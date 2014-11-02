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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9ldmVudHMvYW5pbWF0b3JldmVudC50cyJdLCJuYW1lcyI6WyJBbmltYXRvckV2ZW50IiwiQW5pbWF0b3JFdmVudC5jb25zdHJ1Y3RvciIsIkFuaW1hdG9yRXZlbnQuYW5pbWF0b3IiLCJBbmltYXRvckV2ZW50LmNsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLEtBQUssV0FBZ0IsOEJBQThCLENBQUMsQ0FBQztBQUk1RCxBQUdBOztHQURHO0lBQ0csYUFBYTtJQUFTQSxVQUF0QkEsYUFBYUEsVUFBY0E7SUFtQmhDQTs7Ozs7T0FLR0E7SUFDSEEsU0F6QktBLGFBQWFBLENBeUJOQSxJQUFXQSxFQUFFQSxRQUFxQkE7UUFFN0NDLGtCQUFNQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNaQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFREQsc0JBQVdBLG1DQUFRQTthQUFuQkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUY7SUFFREE7Ozs7T0FJR0E7SUFDSUEsNkJBQUtBLEdBQVpBO1FBRUNHLE1BQU1BLENBQUNBLElBQUlBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO0lBQ3JEQSxDQUFDQTtJQTFDREg7O09BRUdBO0lBQ1dBLG1CQUFLQSxHQUFVQSxPQUFPQSxDQUFDQTtJQUVyQ0E7O09BRUdBO0lBQ1dBLGtCQUFJQSxHQUFVQSxNQUFNQSxDQUFDQTtJQUVuQ0E7O09BRUdBO0lBQ1dBLDRCQUFjQSxHQUFVQSxnQkFBZ0JBLENBQUNBO0lBOEJ4REEsb0JBQUNBO0FBQURBLENBN0NBLEFBNkNDQSxFQTdDMkIsS0FBSyxFQTZDaEM7QUFFRCxBQUF1QixpQkFBZCxhQUFhLENBQUMiLCJmaWxlIjoiZXZlbnRzL0FuaW1hdG9yRXZlbnQuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcblxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcblxuLyoqXG4gKiBEaXNwYXRjaGVkIHRvIG5vdGlmeSBjaGFuZ2VzIGluIGFuIGFuaW1hdG9yJ3Mgc3RhdGUuXG4gKi9cbmNsYXNzIEFuaW1hdG9yRXZlbnQgZXh0ZW5kcyBFdmVudFxue1xuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgdmFsdWUgb2YgdGhlIHR5cGUgcHJvcGVydHkgb2YgYSBzdGFydCBldmVudCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIFNUQVJUOnN0cmluZyA9IFwic3RhcnRcIjtcblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgdmFsdWUgb2YgdGhlIHR5cGUgcHJvcGVydHkgb2YgYSBzdG9wIGV2ZW50IG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgU1RPUDpzdHJpbmcgPSBcInN0b3BcIjtcblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgdmFsdWUgb2YgdGhlIHR5cGUgcHJvcGVydHkgb2YgYSBjeWNsZSBjb21wbGV0ZSBldmVudCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIENZQ0xFX0NPTVBMRVRFOnN0cmluZyA9IFwiY3ljbGVfY29tcGxldGVcIjtcblxuXHRwcml2YXRlIF9hbmltYXRvcjpBbmltYXRvckJhc2U7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyA8Y29kZT5BbmltYXRvckV2ZW50PC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB0eXBlIFRoZSBldmVudCB0eXBlLlxuXHQgKiBAcGFyYW0gYW5pbWF0b3IgVGhlIGFuaW1hdG9yIG9iamVjdCB0aGF0IGlzIHRoZSBzdWJqZWN0IG9mIHRoaXMgZXZlbnQuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih0eXBlOnN0cmluZywgYW5pbWF0b3I6QW5pbWF0b3JCYXNlKVxuXHR7XG5cdFx0c3VwZXIodHlwZSk7XG5cdFx0dGhpcy5fYW5pbWF0b3IgPSBhbmltYXRvcjtcblx0fVxuXG5cdHB1YmxpYyBnZXQgYW5pbWF0b3IoKTpBbmltYXRvckJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9hbmltYXRvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZXMgdGhlIGV2ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJuIEFuIGV4YWN0IGR1cGxpY2F0ZSBvZiB0aGUgY3VycmVudCBldmVudCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTpFdmVudFxuXHR7XG5cdFx0cmV0dXJuIG5ldyBBbmltYXRvckV2ZW50KHRoaXMudHlwZSwgdGhpcy5fYW5pbWF0b3IpO1xuXHR9XG59XG5cbmV4cG9ydCA9IEFuaW1hdG9yRXZlbnQ7Il19