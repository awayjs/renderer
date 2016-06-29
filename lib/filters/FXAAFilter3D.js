"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filter3DFXAATask_1 = require("../filters/tasks/Filter3DFXAATask");
var Filter3DBase_1 = require("../filters/Filter3DBase");
var FXAAFilter3D = (function (_super) {
    __extends(FXAAFilter3D, _super);
    /**
     * Creates a new FXAAFilter3D object
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function FXAAFilter3D(amount, stepSize) {
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._fxaaTask = new Filter3DFXAATask_1.Filter3DFXAATask(amount, stepSize);
        this.addTask(this._fxaaTask);
    }
    Object.defineProperty(FXAAFilter3D.prototype, "amount", {
        get: function () {
            return this._fxaaTask.amount;
        },
        set: function (value) {
            this._fxaaTask.amount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FXAAFilter3D.prototype, "stepSize", {
        get: function () {
            return this._fxaaTask.stepSize;
        },
        set: function (value) {
            this._fxaaTask.stepSize = value;
        },
        enumerable: true,
        configurable: true
    });
    return FXAAFilter3D;
}(Filter3DBase_1.Filter3DBase));
exports.FXAAFilter3D = FXAAFilter3D;
