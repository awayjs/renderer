"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("@awayjs/stage/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
var Filter3DHBlurTask = (function (_super) {
    __extends(Filter3DHBlurTask, _super);
    /**
     * Creates a new Filter3DHDepthOfFFieldTask
     * @param amount The maximum amount of blur to apply in pixels at the most out-of-focus areas
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function Filter3DHBlurTask(amount, stepSize) {
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._stepSize = 1;
        this._amount = amount;
        this._data = new Float32Array([0, 0, 0, 1]);
        this.stepSize = stepSize;
    }
    Object.defineProperty(Filter3DHBlurTask.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (value) {
            if (this._amount == value)
                return;
            this._amount = value;
            this.invalidateProgram();
            this.updateBlurData();
            this.calculateStepSize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DHBlurTask.prototype, "stepSize", {
        get: function () {
            return this._stepSize;
        },
        set: function (value) {
            if (this._stepSize == value)
                return;
            this._stepSize = value;
            this.calculateStepSize();
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Filter3DHBlurTask.prototype.getFragmentCode = function () {
        var code;
        var numSamples = 1;
        code = "mov ft0, v0	\n" +
            "sub ft0.x, v0.x, fc0.x\n";
        code += "tex ft1, ft0, fs0 <2d,linear,clamp>\n";
        for (var x = this._realStepSize; x <= this._amount; x += this._realStepSize) {
            code += "add ft0.x, ft0.x, fc0.y\n" +
                "tex ft2, ft0, fs0 <2d,linear,clamp>\n" +
                "add ft1, ft1, ft2\n";
            ++numSamples;
        }
        code += "mul oc, ft1, fc0.z\n";
        this._data[2] = 1 / numSamples;
        return code;
    };
    Filter3DHBlurTask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.FRAGMENT, this._data);
    };
    Filter3DHBlurTask.prototype.updateTextures = function (stage) {
        _super.prototype.updateTextures.call(this, stage);
        this.updateBlurData();
    };
    Filter3DHBlurTask.prototype.updateBlurData = function () {
        // todo: must be normalized using view size ratio instead of texture
        var invW = 1 / this._textureWidth;
        this._data[0] = this._amount * .5 * invW;
        this._data[1] = this._realStepSize * invW;
    };
    Filter3DHBlurTask.prototype.calculateStepSize = function () {
        this._realStepSize = this._stepSize > 0 ? this._stepSize : this._amount > Filter3DHBlurTask.MAX_AUTO_SAMPLES ? this._amount / Filter3DHBlurTask.MAX_AUTO_SAMPLES : 1;
    };
    Filter3DHBlurTask.MAX_AUTO_SAMPLES = 15;
    return Filter3DHBlurTask;
}(Filter3DTaskBase_1.Filter3DTaskBase));
exports.Filter3DHBlurTask = Filter3DHBlurTask;
