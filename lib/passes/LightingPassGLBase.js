var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var MaterialPassGLBase = require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var LightingPassGLBase = (function (_super) {
    __extends(LightingPassGLBase, _super);
    /**
     *
     */
    function LightingPassGLBase() {
        _super.call(this);
        this._pNumPointLights = 0;
        this._pNumDirectionalLights = 0;
        this._pNumLightProbes = 0;
        this._directionalLightsOffset = 0;
        this._pointLightsOffset = 0;
        this._lightProbesOffset = 0;
    }
    Object.defineProperty(LightingPassGLBase.prototype, "directionalLightsOffset", {
        /**
         * Indicates the offset in the light picker's directional light vector for which to start including lights.
         * This needs to be set before the light picker is assigned.
         */
        get: function () {
            return this._directionalLightsOffset;
        },
        set: function (value) {
            this._directionalLightsOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightingPassGLBase.prototype, "pointLightsOffset", {
        /**
         * Indicates the offset in the light picker's point light vector for which to start including lights.
         * This needs to be set before the light picker is assigned.
         */
        get: function () {
            return this._pointLightsOffset;
        },
        set: function (value) {
            this._pointLightsOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightingPassGLBase.prototype, "lightProbesOffset", {
        /**
         * Indicates the offset in the light picker's light probes vector for which to start including lights.
         * This needs to be set before the light picker is assigned.
         */
        get: function () {
            return this._lightProbesOffset;
        },
        set: function (value) {
            this._lightProbesOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightingPassGLBase.prototype, "iNumPointLights", {
        /**
         * The amount of point lights that need to be supported.
         */
        get: function () {
            return this._pNumPointLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightingPassGLBase.prototype, "iNumDirectionalLights", {
        /**
         * The amount of directional lights that need to be supported.
         */
        get: function () {
            return this._pNumDirectionalLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightingPassGLBase.prototype, "iNumLightProbes", {
        /**
         * The amount of light probes that need to be supported.
         */
        get: function () {
            return this._pNumLightProbes;
        },
        enumerable: true,
        configurable: true
    });
    LightingPassGLBase.prototype._iUsesSpecular = function () {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iUsesShadows = function () {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPerLightDiffuseFragmentCode = function (shaderObject, lightDirReg, diffuseColorReg, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPerLightSpecularFragmentCode = function (shaderObject, lightDirReg, specularColorReg, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPerProbeDiffuseFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPerProbeSpecularFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPostLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    LightingPassGLBase.prototype._iGetPostLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        throw new AbstractMethodError();
    };
    return LightingPassGLBase;
})(MaterialPassGLBase);
module.exports = LightingPassGLBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvbGlnaHRpbmdwYXNzZ2xiYXNlLnRzIl0sIm5hbWVzIjpbIkxpZ2h0aW5nUGFzc0dMQmFzZSIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5jb25zdHJ1Y3RvciIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5kaXJlY3Rpb25hbExpZ2h0c09mZnNldCIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5wb2ludExpZ2h0c09mZnNldCIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5saWdodFByb2Jlc09mZnNldCIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5pTnVtUG9pbnRMaWdodHMiLCJMaWdodGluZ1Bhc3NHTEJhc2UuaU51bURpcmVjdGlvbmFsTGlnaHRzIiwiTGlnaHRpbmdQYXNzR0xCYXNlLmlOdW1MaWdodFByb2JlcyIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5faVVzZXNTcGVjdWxhciIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5faVVzZXNTaGFkb3dzIiwiTGlnaHRpbmdQYXNzR0xCYXNlLl9pR2V0UHJlTGlnaHRpbmdWZXJ0ZXhDb2RlIiwiTGlnaHRpbmdQYXNzR0xCYXNlLl9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUiLCJMaWdodGluZ1Bhc3NHTEJhc2UuX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUiLCJMaWdodGluZ1Bhc3NHTEJhc2UuX2lHZXRQZXJMaWdodFNwZWN1bGFyRnJhZ21lbnRDb2RlIiwiTGlnaHRpbmdQYXNzR0xCYXNlLl9pR2V0UGVyUHJvYmVEaWZmdXNlRnJhZ21lbnRDb2RlIiwiTGlnaHRpbmdQYXNzR0xCYXNlLl9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZSIsIkxpZ2h0aW5nUGFzc0dMQmFzZS5faUdldFBvc3RMaWdodGluZ1ZlcnRleENvZGUiLCJMaWdodGluZ1Bhc3NHTEJhc2UuX2lHZXRQb3N0TGlnaHRpbmdGcmFnbWVudENvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sbUJB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aUNBLEVBQUVBLFdBQWlDQSxFQUFFQSxnQkFBc0NBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0E7UUFFM05hLE1BQU1BLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRU1iLDZEQUFnQ0EsR0FBdkNBLFVBQXdDQSxZQUFpQ0EsRUFBRUEsTUFBNEJBLEVBQUVBLFNBQWdCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRS9MYyxNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUVNZCw4REFBaUNBLEdBQXhDQSxVQUF5Q0EsWUFBaUNBLEVBQUVBLE1BQTRCQSxFQUFFQSxTQUFnQkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUVoTWUsTUFBTUEsSUFBSUEsbUJBQW1CQSxFQUFFQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFFTWYsd0RBQTJCQSxHQUFsQ0EsVUFBbUNBLFlBQWlDQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRTFJZ0IsTUFBTUEsSUFBSUEsbUJBQW1CQSxFQUFFQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFFTWhCLDBEQUE2QkEsR0FBcENBLFVBQXFDQSxZQUFpQ0EsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUU1SWlCLE1BQU1BLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBQ0ZqQix5QkFBQ0E7QUFBREEsQ0F0SUEsQUFzSUNBLEVBdElnQyxrQkFBa0IsRUFzSWxEO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6InBhc3Nlcy9MaWdodGluZ1Bhc3NHTEJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0TWV0aG9kRXJyb3JcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lcnJvcnMvQWJzdHJhY3RNZXRob2RFcnJvclwiKTtcblxuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzR0xCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL01hdGVyaWFsUGFzc0dMQmFzZVwiKTtcblxuLyoqXG4gKiBDb21waWxlZFBhc3MgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgY29tcGlsZWQgcGFzcyBtYXRlcmlhbHMgcHJvdmlkZWQgYnkgQXdheTNELFxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cbiAqL1xuY2xhc3MgTGlnaHRpbmdQYXNzR0xCYXNlIGV4dGVuZHMgTWF0ZXJpYWxQYXNzR0xCYXNlXG57XG5cdHB1YmxpYyBfcE51bVBvaW50TGlnaHRzOm51bWJlciA9IDA7XG5cdHB1YmxpYyBfcE51bURpcmVjdGlvbmFsTGlnaHRzOm51bWJlciA9IDA7XG5cdHB1YmxpYyBfcE51bUxpZ2h0UHJvYmVzOm51bWJlciA9IDA7XG5cblx0cHJpdmF0ZSBfZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQ6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfcG9pbnRMaWdodHNPZmZzZXQ6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbGlnaHRQcm9iZXNPZmZzZXQ6bnVtYmVyID0gMDtcblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBvZmZzZXQgaW4gdGhlIGxpZ2h0IHBpY2tlcidzIGRpcmVjdGlvbmFsIGxpZ2h0IHZlY3RvciBmb3Igd2hpY2ggdG8gc3RhcnQgaW5jbHVkaW5nIGxpZ2h0cy5cblx0ICogVGhpcyBuZWVkcyB0byBiZSBzZXQgYmVmb3JlIHRoZSBsaWdodCBwaWNrZXIgaXMgYXNzaWduZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpcmVjdGlvbmFsTGlnaHRzT2Zmc2V0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGlyZWN0aW9uYWxMaWdodHNPZmZzZXQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpcmVjdGlvbmFsTGlnaHRzT2Zmc2V0KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzT2Zmc2V0ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBvZmZzZXQgaW4gdGhlIGxpZ2h0IHBpY2tlcidzIHBvaW50IGxpZ2h0IHZlY3RvciBmb3Igd2hpY2ggdG8gc3RhcnQgaW5jbHVkaW5nIGxpZ2h0cy5cblx0ICogVGhpcyBuZWVkcyB0byBiZSBzZXQgYmVmb3JlIHRoZSBsaWdodCBwaWNrZXIgaXMgYXNzaWduZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBvaW50TGlnaHRzT2Zmc2V0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcG9pbnRMaWdodHNPZmZzZXQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHBvaW50TGlnaHRzT2Zmc2V0KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BvaW50TGlnaHRzT2Zmc2V0ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoZSBvZmZzZXQgaW4gdGhlIGxpZ2h0IHBpY2tlcidzIGxpZ2h0IHByb2JlcyB2ZWN0b3IgZm9yIHdoaWNoIHRvIHN0YXJ0IGluY2x1ZGluZyBsaWdodHMuXG5cdCAqIFRoaXMgbmVlZHMgdG8gYmUgc2V0IGJlZm9yZSB0aGUgbGlnaHQgcGlja2VyIGlzIGFzc2lnbmVkLlxuXHQgKi9cblx0cHVibGljIGdldCBsaWdodFByb2Jlc09mZnNldCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2xpZ2h0UHJvYmVzT2Zmc2V0O1xuXHR9XG5cblx0cHVibGljIHNldCBsaWdodFByb2Jlc09mZnNldCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9saWdodFByb2Jlc09mZnNldCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgb2YgcG9pbnQgbGlnaHRzIHRoYXQgbmVlZCB0byBiZSBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGlOdW1Qb2ludExpZ2h0cygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BOdW1Qb2ludExpZ2h0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IG9mIGRpcmVjdGlvbmFsIGxpZ2h0cyB0aGF0IG5lZWQgdG8gYmUgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIGdldCBpTnVtRGlyZWN0aW9uYWxMaWdodHMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wTnVtRGlyZWN0aW9uYWxMaWdodHM7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiBsaWdodCBwcm9iZXMgdGhhdCBuZWVkIHRvIGJlIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgaU51bUxpZ2h0UHJvYmVzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcE51bUxpZ2h0UHJvYmVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBfaVVzZXNTcGVjdWxhcigpOmJvb2xlYW5cblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHRwdWJsaWMgX2lVc2VzU2hhZG93cygpOmJvb2xlYW5cblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBlckxpZ2h0RGlmZnVzZUZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIGxpZ2h0RGlyUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgZGlmZnVzZUNvbG9yUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJMaWdodFNwZWN1bGFyRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbGlnaHREaXJSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBzcGVjdWxhckNvbG9yUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJQcm9iZURpZmZ1c2VGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCB0ZXhSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB3ZWlnaHRSZWc6c3RyaW5nLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBlclByb2JlU3BlY3VsYXJGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCB0ZXhSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB3ZWlnaHRSZWc6c3RyaW5nLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBvc3RMaWdodGluZ1ZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBvc3RMaWdodGluZ0ZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG59XG5cbmV4cG9ydCA9IExpZ2h0aW5nUGFzc0dMQmFzZTsiXX0=