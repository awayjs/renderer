"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleOscillatorState_1 = require("../../animators/states/ParticleOscillatorState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used to control the position of a particle over time using simple harmonic motion.
 */
var ParticleOscillatorNode = (function (_super) {
    __extends(ParticleOscillatorNode, _super);
    /**
     * Creates a new <code>ParticleOscillatorNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
     */
    function ParticleOscillatorNode(mode, oscillator) {
        if (oscillator === void 0) { oscillator = null; }
        _super.call(this, "ParticleOscillator", mode, 4);
        this._pStateClass = ParticleOscillatorState_1.ParticleOscillatorState;
        this._iOscillator = oscillator || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var oscillatorRegister = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleOscillatorState_1.ParticleOscillatorState.OSCILLATOR_INDEX, oscillatorRegister.index);
        var temp = registerCache.getFreeVertexVectorTemp();
        var dgree = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 0);
        var sin = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 1);
        var cos = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 2);
        registerCache.addVertexTempUsages(temp, 1);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var distance = new ShaderRegisterElement_1.ShaderRegisterElement(temp2.regName, temp2.index);
        registerCache.removeVertexTempUsage(temp);
        var code = "";
        code += "mul " + dgree + "," + animationRegisterData.vertexTime + "," + oscillatorRegister + ".w\n";
        code += "sin " + sin + "," + dgree + "\n";
        code += "mul " + distance + ".xyz," + sin + "," + oscillatorRegister + ".xyz\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity) {
            code += "cos " + cos + "," + dgree + "\n";
            code += "mul " + distance + ".xyz," + cos + "," + oscillatorRegister + ".xyz\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        //(Vector3D.x,Vector3D.y,Vector3D.z) is oscillator axis, Vector3D.w is oscillator cycle duration
        var drift = param[ParticleOscillatorNode.OSCILLATOR_VECTOR3D];
        if (!drift)
            throw (new Error("there is no " + ParticleOscillatorNode.OSCILLATOR_VECTOR3D + " in param!"));
        this._pOneData[0] = drift.x;
        this._pOneData[1] = drift.y;
        this._pOneData[2] = drift.z;
        if (drift.w <= 0)
            throw (new Error("the cycle duration must greater than zero"));
        this._pOneData[3] = Math.PI * 2 / drift.w;
    };
    /**
     * Reference for ocsillator node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the axis (x,y,z) and cycle speed (w) of the motion on the particle.
     */
    ParticleOscillatorNode.OSCILLATOR_VECTOR3D = "OscillatorVector3D";
    return ParticleOscillatorNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleOscillatorNode = ParticleOscillatorNode;
