"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("@awayjs/stage/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
var Filter3DFXAATask = (function (_super) {
    __extends(Filter3DFXAATask, _super);
    /**
     *
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function Filter3DFXAATask(amount, stepSize) {
        if (amount === void 0) { amount = 1; }
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._stepSize = 1;
        this._data = new Float32Array(20);
        //luma
        this._data.set([0.299, 0.587, 0.114, 0], 0); //0.212, 0.716, 0.072
        //helpers
        this._data.set([0.25, 0.5, 0.75, 1], 4);
        //settings (screen x, screen y, ...)
        this._data.set([1 / 1024, 1 / 1024, -1, 1], 8);
        //deltas
        this._data.set([1 / 128, 1 / 8, 8, 0], 12);
        //deltas
        this._data.set([1.0 / 3.0 - 0.5, 2.0 / 3.0 - 0.5, 0.0 / 3.0 - 0.5, 3.0 / 3.0 - 0.5], 16);
        this.amount = amount;
        this.stepSize = stepSize;
    }
    Object.defineProperty(Filter3DFXAATask.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (value) {
            if (this._amount == value)
                return;
            this._amount = value;
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DFXAATask.prototype, "stepSize", {
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
    Filter3DFXAATask.prototype.getFragmentCode = function () {
        var lum = "fc0"; //	0.299, 0.587, 0.114
        var _0 = "fc0.w";
        var _025 = "fc1.x";
        var _05 = "fc1.y";
        var _075 = "fc1.z";
        var _1 = "fc1.w";
        var pix = "fc2.xy";
        var dx = "fc2.x"; // 1/1024
        var dy = "fc2.y"; // 1/1024
        var mOne = "fc2.z"; // -1.0
        var mul = "fc2.w"; // 1.0  -- one for now
        var fxaaReduceMin = "fc3.x"; //1/128
        var fxaaReduceMul = "fc3.y"; //1/8
        var fxaaSpanMax = "fc3.z"; //8
        var delta1 = "fc4.x"; //1.0/3.0 - 0.5
        var delta2 = "fc4.y"; //2.0/3.0 - 0.5
        var delta3 = "fc4.z"; //0.0/3.0 - 0.5
        var delta4 = "fc4.w"; //3.0/3.0 - 0.5
        var uv_in = "v0";
        var uv = "ft0.xy";
        var uvx = "ft0.x";
        var uvy = "ft0.y";
        var TL = "ft2.x";
        var TR = "ft2.y";
        var BL = "ft2.z";
        var BR = "ft2.w";
        var M = "ft3.x";
        var tempf1 = "ft3.y";
        var tempf2 = "ft3.z";
        var tempf3 = "ft3.w";
        var tex = "ft1";
        var dir = "ft4";
        var dirx = "ft4.x";
        var diry = "ft4.y";
        var dirxy = "ft4.xy";
        var dirReduce = "ft5.x";
        var inverseDirAdjustment = "ft5.y";
        var result1 = "ft6";
        var result2 = "ft7";
        var lumaMin = "ft5.x";
        var lumaMax = "ft5.y";
        var sample = "fs0";
        var temp = tex;
        var tempxy = temp + ".xy";
        var code = new Array();
        //lumas
        code.push("tex", tex, uv_in, sample, "<2d wrap linear>", "\n");
        code.push("dp3", M, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("sub", uv, uv, pix, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", TL, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("add", uv, uv, pix, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", BR, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("sub", uvy, uvy, dy, "\n");
        code.push("add", uvx, uvx, dx, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", TR, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("add", uvy, uvy, dy, "\n");
        code.push("sub", uvx, uvx, dx, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", BL, tex, lum, "\n");
        //dir
        code.push("add", tempf1, TL, TR, "\n");
        code.push("add", tempf2, BL, BR, "\n");
        code.push("sub", dirx, tempf1, tempf2, "\n");
        code.push("neg", dirx, dirx, "\n");
        code.push("add", tempf1, TL, BL, "\n");
        code.push("add", tempf2, TR, BR, "\n");
        code.push("sub", diry, tempf1, tempf2, "\n");
        code.push("add", tempf1, tempf1, tempf2, "\n");
        code.push("mul", tempf1, tempf1, fxaaReduceMul, "\n");
        code.push("mul", tempf1, tempf1, _025, "\n");
        code.push("max", dirReduce, tempf1, fxaaReduceMin, "\n");
        code.push("abs", tempf1, dirx, "\n");
        code.push("abs", tempf2, diry, "\n");
        code.push("min", tempf1, tempf1, tempf2, "\n");
        code.push("add", tempf1, tempf1, dirReduce, "\n");
        code.push("rcp", inverseDirAdjustment, tempf1, "\n");
        code.push("mul", tempf1, dirx, inverseDirAdjustment, "\n");
        code.push("mov", tempf2, fxaaSpanMax, "\n");
        code.push("neg", tempf2, tempf2, "\n");
        code.push("max", tempf1, tempf1, tempf2, "\n");
        code.push("min", tempf1, fxaaSpanMax, tempf1, "\n");
        code.push("mul", dirx, tempf1, dx, "\n");
        code.push("mul", tempf1, diry, inverseDirAdjustment, "\n");
        code.push("mov", tempf2, fxaaSpanMax, "\n");
        code.push("neg", tempf2, tempf2, "\n");
        code.push("max", tempf1, tempf1, tempf2, "\n");
        code.push("min", tempf1, fxaaSpanMax, tempf1, "\n");
        code.push("mul", diry, tempf1, dy, "\n");
        code.push("mul", tempxy, dirxy, delta1, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", result1, uv, sample, "<2d wrap linear>", "\n");
        code.push("mul", tempxy, dirxy, delta2, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("add", result1, result1, tex, "\n");
        code.push("mul", result1, result1, _05, "\n");
        code.push("mul", tempxy, dirxy, delta3, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", result2, uv, sample, "<2d wrap linear>", "\n");
        code.push("mul", tempxy, dirxy, delta4, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("add", result2, result2, tex, "\n");
        code.push("mul", result2, result2, _025, "\n");
        code.push("mul", tex, result1, _05, "\n");
        code.push("add", result2, result2, tex, "\n");
        code.push("min", tempf1, BL, BR, "\n");
        code.push("min", tempf2, TL, TR, "\n");
        code.push("min", tempf1, tempf1, tempf2, "\n");
        code.push("min", lumaMin, tempf1, M, "\n");
        code.push("max", tempf1, BL, BR, "\n");
        code.push("max", tempf2, TL, TR, "\n");
        code.push("max", tempf1, tempf1, tempf2, "\n");
        code.push("max", lumaMax, tempf1, M, "\n");
        code.push("dp3", tempf1, lum, result2, "\n");
        code.push("slt", tempf2, tempf1, lumaMin, "\n");
        code.push("sge", tempf3, tempf1, lumaMax, "\n");
        code.push("mul", tempf2, tempf2, tempf3, "\n");
        code.push("mul", result1, result1, tempf2, "\n");
        code.push("sub", tempf2, _1, tempf2, "\n");
        code.push("mul", result2, result2, tempf2, "\n");
        code.push("add", "oc", result1, result2, "\n");
        //this._data[2] = 1/numSamples;
        return code.join(" ");
    };
    Filter3DFXAATask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.FRAGMENT, this._data);
    };
    Filter3DFXAATask.prototype.updateTextures = function (stage) {
        _super.prototype.updateTextures.call(this, stage);
        this.updateBlurData();
    };
    Filter3DFXAATask.prototype.updateBlurData = function () {
        // todo: must be normalized using view size ratio instead of texture
        if (this._rttManager) {
            this._data[8] = 1 / this._textureWidth;
            this._data[9] = 1 / this._textureHeight;
        }
    };
    Filter3DFXAATask.prototype.calculateStepSize = function () {
        this._realStepSize = 1; //this._stepSize > 0? this._stepSize : this._amount > Filter3DVBlurTask.MAX_AUTO_SAMPLES? this._amount/Filter3DVBlurTask.MAX_AUTO_SAMPLES : 1;
    };
    //TODO - remove blur variables and create setters/getters for FXAA
    Filter3DFXAATask.MAX_AUTO_SAMPLES = 15;
    return Filter3DFXAATask;
}(Filter3DTaskBase_1.Filter3DTaskBase));
exports.Filter3DFXAATask = Filter3DFXAATask;
