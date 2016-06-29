"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("@awayjs/core/lib/events/EventBase");
var PassEvent = (function (_super) {
    __extends(PassEvent, _super);
    function PassEvent(type, pass) {
        _super.call(this, type);
        this._pass = pass;
    }
    Object.defineProperty(PassEvent.prototype, "pass", {
        /**
         *
         */
        get: function () {
            return this._pass;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    PassEvent.prototype.clone = function () {
        return new PassEvent(this.type, this._pass);
    };
    /**
     *
     */
    PassEvent.INVALIDATE = "invalidatePass";
    return PassEvent;
}(EventBase_1.EventBase));
exports.PassEvent = PassEvent;
