"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filter3DHBlurTask_1 = require("../filters/tasks/Filter3DHBlurTask");
var Filter3DVBlurTask_1 = require("../filters/tasks/Filter3DVBlurTask");
var Filter3DBase_1 = require("../filters/Filter3DBase");
var BlurFilter3D = (function (_super) {
    __extends(BlurFilter3D, _super);
    /**
     * Creates a new BlurFilter3D object
     * @param blurX The amount of horizontal blur to apply
     * @param blurY The amount of vertical blur to apply
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function BlurFilter3D(blurX, blurY, stepSize) {
        if (blurX === void 0) { blurX = 3; }
        if (blurY === void 0) { blurY = 3; }
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._hBlurTask = new Filter3DHBlurTask_1.Filter3DHBlurTask(blurX, stepSize);
        this._vBlurTask = new Filter3DVBlurTask_1.Filter3DVBlurTask(blurY, stepSize);
        this.addTask(this._hBlurTask);
        this.addTask(this._vBlurTask);
    }
    Object.defineProperty(BlurFilter3D.prototype, "blurX", {
        get: function () {
            return this._hBlurTask.amount;
        },
        set: function (value) {
            this._hBlurTask.amount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter3D.prototype, "blurY", {
        get: function () {
            return this._vBlurTask.amount;
        },
        set: function (value) {
            this._vBlurTask.amount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter3D.prototype, "stepSize", {
        /**
         * The distance between two blur samples. Set to -1 to autodetect with acceptable quality (default value).
         * Higher values provide better performance at the cost of reduces quality.
         */
        get: function () {
            return this._hBlurTask.stepSize;
        },
        set: function (value) {
            this._hBlurTask.stepSize = value;
            this._vBlurTask.stepSize = value;
        },
        enumerable: true,
        configurable: true
    });
    BlurFilter3D.prototype.setRenderTargets = function (mainTarget, stage) {
        this._hBlurTask.target = this._vBlurTask.getMainInputTexture(stage);
        _super.prototype.setRenderTargets.call(this, mainTarget, stage);
    };
    return BlurFilter3D;
}(Filter3DBase_1.Filter3DBase));
exports.BlurFilter3D = BlurFilter3D;
