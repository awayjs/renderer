"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("@awayjs/core/lib/events/EventBase");
var RTTEvent = (function (_super) {
    __extends(RTTEvent, _super);
    function RTTEvent(type, rttManager) {
        _super.call(this, type);
        this._rttManager = rttManager;
    }
    Object.defineProperty(RTTEvent.prototype, "rttManager", {
        /**
         *
         */
        get: function () {
            return this._rttManager;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    RTTEvent.prototype.clone = function () {
        return new RTTEvent(this.type, this._rttManager);
    };
    /**
     *
     */
    RTTEvent.RESIZE = "rttManagerResize";
    return RTTEvent;
}(EventBase_1.EventBase));
exports.RTTEvent = RTTEvent;
