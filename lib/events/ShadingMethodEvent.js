"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("@awayjs/core/lib/events/EventBase");
var ShadingMethodEvent = (function (_super) {
    __extends(ShadingMethodEvent, _super);
    function ShadingMethodEvent(type) {
        _super.call(this, type);
    }
    ShadingMethodEvent.SHADER_INVALIDATED = "ShaderInvalidated";
    return ShadingMethodEvent;
}(EventBase_1.EventBase));
exports.ShadingMethodEvent = ShadingMethodEvent;
