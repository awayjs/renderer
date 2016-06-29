"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
/**
 *
 */
var PerspectiveMatrix3D = (function (_super) {
    __extends(PerspectiveMatrix3D, _super);
    function PerspectiveMatrix3D(v) {
        if (v === void 0) { v = null; }
        _super.call(this, v);
    }
    PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
        var yScale = 1 / Math.tan(fieldOfViewY / 2);
        var xScale = yScale / aspectRatio;
        this.rawData[0] = xScale;
        this.rawData[1] = 0.0;
        this.rawData[2] = 0.0;
        this.rawData[3] = 0.0;
        this.rawData[4] = 0.0;
        this.rawData[5] = yScale;
        this.rawData[6] = 0.0;
        this.rawData[7] = 0.0;
        this.rawData[8] = 0.0;
        this.rawData[9] = 0.0;
        this.rawData[10] = zFar / (zFar - zNear);
        this.rawData[11] = 1.0;
        this.rawData[12] = 0.0;
        this.rawData[13] = 0.0;
        this.rawData[14] = (zNear * zFar) / (zNear - zFar);
        this.rawData[15] = 0.0;
    };
    return PerspectiveMatrix3D;
}(Matrix3D_1.Matrix3D));
exports.PerspectiveMatrix3D = PerspectiveMatrix3D;
