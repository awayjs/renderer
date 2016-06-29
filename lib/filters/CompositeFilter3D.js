"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filter3DCompositeTask_1 = require("../filters/tasks/Filter3DCompositeTask");
var Filter3DBase_1 = require("../filters/Filter3DBase");
var CompositeFilter3D = (function (_super) {
    __extends(CompositeFilter3D, _super);
    /**
     * Creates a new CompositeFilter3D object
     * @param blurX The amount of horizontal blur to apply
     * @param blurY The amount of vertical blur to apply
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function CompositeFilter3D(blendMode, exposure) {
        if (exposure === void 0) { exposure = 1; }
        _super.call(this);
        this._compositeTask = new Filter3DCompositeTask_1.Filter3DCompositeTask(blendMode, exposure);
        this.addTask(this._compositeTask);
    }
    Object.defineProperty(CompositeFilter3D.prototype, "exposure", {
        get: function () {
            return this._compositeTask.exposure;
        },
        set: function (value) {
            this._compositeTask.exposure = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompositeFilter3D.prototype, "overlayTexture", {
        get: function () {
            return this._compositeTask.overlayTexture;
        },
        set: function (value) {
            this._compositeTask.overlayTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    return CompositeFilter3D;
}(Filter3DBase_1.Filter3DBase));
exports.CompositeFilter3D = CompositeFilter3D;
