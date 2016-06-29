"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("@awayjs/core/lib/events/EventBase");
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
    AnimatorEvent.START = "animatorStart";
    /**
     * Defines the value of the type property of a stop event object.
     */
    AnimatorEvent.STOP = "animatorStop";
    /**
     * Defines the value of the type property of a cycle complete event object.
     */
    AnimatorEvent.CYCLE_COMPLETE = "animatorCycleComplete";
    return AnimatorEvent;
}(EventBase_1.EventBase));
exports.AnimatorEvent = AnimatorEvent;
