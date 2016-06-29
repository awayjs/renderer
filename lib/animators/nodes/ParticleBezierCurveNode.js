"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleBezierCurveState_1 = require("../../animators/states/ParticleBezierCurveState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used to control the position of a particle over time along a bezier curve.
 */
var ParticleBezierCurveNode = (function (_super) {
    __extends(ParticleBezierCurveNode, _super);
    /**
     * Creates a new <code>ParticleBezierCurveNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
     * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
     */
    function ParticleBezierCurveNode(mode, controlPoint, endPoint) {
        if (controlPoint === void 0) { controlPoint = null; }
        if (endPoint === void 0) { endPoint = null; }
        _super.call(this, "ParticleBezierCurve", mode, 6);
        this._pStateClass = ParticleBezierCurveState_1.ParticleBezierCurveState;
        this._iControlPoint = controlPoint || new Vector3D_1.Vector3D();
        this._iEndPoint = endPoint || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var controlValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleBezierCurveState_1.ParticleBezierCurveState.BEZIER_CONTROL_INDEX, controlValue.index);
        var endValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleBezierCurveState_1.ParticleBezierCurveState.BEZIER_END_INDEX, endValue.index);
        var temp = registerCache.getFreeVertexVectorTemp();
        var rev_time = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 0);
        var time_2 = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 1);
        var time_temp = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 2);
        registerCache.addVertexTempUsages(temp, 1);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var distance = new ShaderRegisterElement_1.ShaderRegisterElement(temp2.regName, temp2.index);
        registerCache.removeVertexTempUsage(temp);
        var code = "";
        code += "sub " + rev_time + "," + animationRegisterData.vertexOneConst + "," + animationRegisterData.vertexLife + "\n";
        code += "mul " + time_2 + "," + animationRegisterData.vertexLife + "," + animationRegisterData.vertexLife + "\n";
        code += "mul " + time_temp + "," + animationRegisterData.vertexLife + "," + rev_time + "\n";
        code += "mul " + time_temp + "," + time_temp + "," + animationRegisterData.vertexTwoConst + "\n";
        code += "mul " + distance + ".xyz," + time_temp + "," + controlValue + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        code += "mul " + distance + ".xyz," + time_2 + "," + endValue + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity) {
            code += "mul " + time_2 + "," + animationRegisterData.vertexLife + "," + animationRegisterData.vertexTwoConst + "\n";
            code += "sub " + time_temp + "," + animationRegisterData.vertexOneConst + "," + time_2 + "\n";
            code += "mul " + time_temp + "," + animationRegisterData.vertexTwoConst + "," + time_temp + "\n";
            code += "mul " + distance + ".xyz," + controlValue + "," + time_temp + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
            code += "mul " + distance + ".xyz," + endValue + "," + time_2 + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var bezierControl = param[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D];
        if (!bezierControl)
            throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D + " in param!");
        var bezierEnd = param[ParticleBezierCurveNode.BEZIER_END_VECTOR3D];
        if (!bezierEnd)
            throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_END_VECTOR3D + " in param!");
        this._pOneData[0] = bezierControl.x;
        this._pOneData[1] = bezierControl.y;
        this._pOneData[2] = bezierControl.z;
        this._pOneData[3] = bezierEnd.x;
        this._pOneData[4] = bezierEnd.y;
        this._pOneData[5] = bezierEnd.z;
    };
    /**
     * Reference for bezier curve node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the control point position (0, 1, 2) of the curve.
     */
    ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D = "BezierControlVector3D";
    /**
     * Reference for bezier curve node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the end point position (0, 1, 2) of the curve.
     */
    ParticleBezierCurveNode.BEZIER_END_VECTOR3D = "BezierEndVector3D";
    return ParticleBezierCurveNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleBezierCurveNode = ParticleBezierCurveNode;
