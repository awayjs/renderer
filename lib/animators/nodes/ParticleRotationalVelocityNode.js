"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleRotationalVelocityState_1 = require("../../animators/states/ParticleRotationalVelocityState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used to set the starting rotational velocity of a particle.
 */
var ParticleRotationalVelocityNode = (function (_super) {
    __extends(ParticleRotationalVelocityNode, _super);
    /**
     * Creates a new <code>ParticleRotationalVelocityNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     */
    function ParticleRotationalVelocityNode(mode, rotationalVelocity) {
        if (rotationalVelocity === void 0) { rotationalVelocity = null; }
        _super.call(this, "ParticleRotationalVelocity", mode, 4);
        this._pStateClass = ParticleRotationalVelocityState_1.ParticleRotationalVelocityState;
        this._iRotationalVelocity = rotationalVelocity || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var rotationRegister = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleRotationalVelocityState_1.ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX, rotationRegister.index);
        var nrmVel = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(nrmVel, 1);
        var xAxis = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(xAxis, 1);
        var temp = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp, 1);
        var Rtemp = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index);
        var R_rev = registerCache.getFreeVertexVectorTemp();
        R_rev = new ShaderRegisterElement_1.ShaderRegisterElement(R_rev.regName, R_rev.index);
        var cos = new ShaderRegisterElement_1.ShaderRegisterElement(Rtemp.regName, Rtemp.index, 3);
        var sin = new ShaderRegisterElement_1.ShaderRegisterElement(R_rev.regName, R_rev.index, 3);
        registerCache.removeVertexTempUsage(nrmVel);
        registerCache.removeVertexTempUsage(xAxis);
        registerCache.removeVertexTempUsage(temp);
        var code = "";
        code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
        code += "mov " + nrmVel + ".w," + animationRegisterData.vertexZeroConst + "\n";
        code += "mul " + cos + "," + animationRegisterData.vertexTime + "," + rotationRegister + ".w\n";
        code += "sin " + sin + "," + cos + "\n";
        code += "cos " + cos + "," + cos + "\n";
        code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
        code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
        code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
        //nrmVel and xAxis are used as temp register
        code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
        code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
        code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
        //use cos as R_rev.w
        code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
        code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
        code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        var len = animationRegisterData.rotationRegisters.length;
        for (var i = 0; i < len; i++) {
            code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
            code += "mov " + nrmVel + ".w," + animationRegisterData.vertexZeroConst + "\n";
            code += "mul " + cos + "," + animationRegisterData.vertexTime + "," + rotationRegister + ".w\n";
            code += "sin " + sin + "," + cos + "\n";
            code += "cos " + cos + "," + cos + "\n";
            code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
            code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.rotationRegisters[i] + "\n";
            code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterData.rotationRegisters[i] + "\n";
            code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
            code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
            code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
            code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
            code += "add " + animationRegisterData.rotationRegisters[i] + "," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        //(Vector3d.x,Vector3d.y,Vector3d.z) is rotation axis,Vector3d.w is cycle duration
        var rotate = param[ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D];
        if (!rotate)
            throw (new Error("there is no " + ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D + " in param!"));
        if (rotate.length <= 0)
            rotate.z = 1; //set the default direction
        else
            rotate.normalize();
        this._pOneData[0] = rotate.x;
        this._pOneData[1] = rotate.y;
        this._pOneData[2] = rotate.z;
        if (rotate.w <= 0)
            throw (new Error("the cycle duration must greater than zero"));
        // it's used as angle/2 in agal
        this._pOneData[3] = Math.PI / rotate.w;
    };
    /**
     * Reference for rotational velocity node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
     */
    ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D = "RotationalVelocityVector3D";
    return ParticleRotationalVelocityNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleRotationalVelocityNode = ParticleRotationalVelocityNode;
