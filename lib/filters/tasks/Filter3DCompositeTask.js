"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("@awayjs/stage/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
var Filter3DCompositeTask = (function (_super) {
    __extends(Filter3DCompositeTask, _super);
    function Filter3DCompositeTask(blendMode, exposure) {
        if (exposure === void 0) { exposure = 1; }
        _super.call(this);
        this._data = new Float32Array([exposure, 0.5, 2.0, -1, 0.0, 0.0, 0.0, 0.0]);
        this._blendMode = blendMode;
    }
    Object.defineProperty(Filter3DCompositeTask.prototype, "overlayTexture", {
        get: function () {
            return this._overlayTexture;
        },
        set: function (value) {
            this._overlayTexture = value;
            this._overlayWidth = this._overlayTexture.width;
            this._overlayHeight = this._overlayTexture.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DCompositeTask.prototype, "exposure", {
        get: function () {
            return this._data[0];
        },
        set: function (value) {
            this._data[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DCompositeTask.prototype.getFragmentCode = function () {
        var temp1 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp2, 1);
        var temp3 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp3, 1);
        var temp4 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp4, 1);
        var inputTexture = this._registerCache.getFreeTextureReg();
        this._inputTextureIndex = inputTexture.index;
        var overlayTexture = this._registerCache.getFreeTextureReg();
        this._overlayTextureIndex = overlayTexture.index;
        var exposure = this._registerCache.getFreeFragmentConstant();
        this._exposureIndex = exposure.index * 4;
        var scaling = this._registerCache.getFreeFragmentConstant();
        this._scalingIndex = scaling.index * 4;
        var code;
        code = "tex " + temp1 + ", " + this._uvVarying + ", " + inputTexture + " <2d,linear,clamp>\n" +
            "mul " + temp2 + ", " + this._uvVarying + ", " + scaling + ".zw\n" +
            "add " + temp2 + ", " + temp2 + ", " + scaling + ".xy\n" +
            "tex " + temp2 + ", " + temp2 + ", " + overlayTexture + " <2d,linear,clamp>\n" +
            "mul " + temp2 + ", " + temp2 + ", " + exposure + ".xxx\n" +
            "add " + temp2 + ", " + temp2 + ", " + exposure + ".xxx\n";
        switch (this._blendMode) {
            case "multiply":
                code += "mul oc, " + temp1 + ", " + temp2 + "\n";
                break;
            case "add":
                code += "add oc, " + temp1 + ", " + temp2 + "\n";
                break;
            case "subtract":
                code += "sub oc, " + temp1 + ", " + temp2 + "\n";
                break;
            case "overlay":
                code += "sge " + temp3 + ", " + temp1 + ", " + exposure + ".yyy\n"; // t2 = (blend >= 0.5)? 1 : 0
                code += "sub " + temp1 + ", " + temp3 + ", " + temp1 + "\n"; // base = (1 : 0 - base)
                code += "sub " + temp2 + ", " + temp2 + ", " + temp3 + "\n"; // blend = (blend - 1 : 0)
                code += "mul " + temp2 + ", " + temp2 + ", " + temp1 + "\n"; // blend = blend * base
                code += "sub " + temp4 + ", " + temp3 + ", " + exposure + ".yyy\n"; // t3 = (blend >= 0.5)? 0.5 : -0.5
                code += "div " + temp2 + ", " + temp2 + ", " + temp4 + "\n"; // blend = blend / ( 0.5 : -0.5)
                code += "add oc, " + temp2 + ", " + temp3 + "\n";
                break;
            case "normal":
                // for debugging purposes
                code += "mov oc, " + temp1 + "\n";
                break;
            default:
                throw new Error("Unknown blend mode");
        }
        return code;
    };
    Filter3DCompositeTask.prototype.activate = function (stage, camera3D, depthTexture) {
        this._data[4] = -0.5 * (this._scaledTextureWidth - this._overlayWidth) / this._overlayWidth;
        this._data[5] = -0.5 * (this._scaledTextureHeight - this._overlayHeight) / this._overlayHeight;
        this._data[6] = this._scaledTextureWidth / this._overlayWidth;
        this._data[7] = this._scaledTextureHeight / this._overlayHeight;
        var context = stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.FRAGMENT, this._data);
        stage.getAbstraction(this._overlayTexture).activate(this._overlayTextureIndex, false);
    };
    Filter3DCompositeTask.prototype.deactivate = function (stage) {
        stage.context.setTextureAt(1, null);
    };
    return Filter3DCompositeTask;
}(Filter3DTaskBase_1.Filter3DTaskBase));
exports.Filter3DCompositeTask = Filter3DCompositeTask;
