"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleOrbitState_1 = require("../../animators/states/ParticleOrbitState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used to control the position of a particle over time around a circular orbit.
 */
var ParticleOrbitNode = (function (_super) {
    __extends(ParticleOrbitNode, _super);
    /**
     * Creates a new <code>ParticleOrbitNode</code> object.
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesEulers      Defines whether the node uses the <code>eulers</code> property in the shader to calculate a rotation on the orbit. Defaults to true.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the orbit independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
     * @param    [optional] radius          Defines the radius of the orbit when in global mode. Defaults to 100.
     * @param    [optional] cycleDuration   Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     * @param    [optional] eulers          Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
     */
    function ParticleOrbitNode(mode, usesEulers, usesCycle, usesPhase, radius, cycleDuration, cyclePhase, eulers) {
        if (usesEulers === void 0) { usesEulers = true; }
        if (usesCycle === void 0) { usesCycle = false; }
        if (usesPhase === void 0) { usesPhase = false; }
        if (radius === void 0) { radius = 100; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        if (eulers === void 0) { eulers = null; }
        var len = 3;
        if (usesPhase)
            len++;
        _super.call(this, "ParticleOrbit", mode, len);
        this._pStateClass = ParticleOrbitState_1.ParticleOrbitState;
        this._iUsesEulers = usesEulers;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iRadius = radius;
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
        this._iEulers = eulers || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var orbitRegister = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleOrbitState_1.ParticleOrbitState.ORBIT_INDEX, orbitRegister.index);
        var eulersMatrixRegister = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleOrbitState_1.ParticleOrbitState.EULERS_INDEX, eulersMatrixRegister.index);
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        var temp1 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp1, 1);
        var distance = new ShaderRegisterElement_1.ShaderRegisterElement(temp1.regName, temp1.index);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var cos = new ShaderRegisterElement_1.ShaderRegisterElement(temp2.regName, temp2.index, 0);
        var sin = new ShaderRegisterElement_1.ShaderRegisterElement(temp2.regName, temp2.index, 1);
        var degree = new ShaderRegisterElement_1.ShaderRegisterElement(temp2.regName, temp2.index, 2);
        registerCache.removeVertexTempUsage(temp1);
        var code = "";
        if (this._iUsesCycle) {
            code += "mul " + degree + "," + animationRegisterData.vertexTime + "," + orbitRegister + ".y\n";
            if (this._iUsesPhase)
                code += "add " + degree + "," + degree + "," + orbitRegister + ".w\n";
        }
        else
            code += "mul " + degree + "," + animationRegisterData.vertexLife + "," + orbitRegister + ".y\n";
        code += "cos " + cos + "," + degree + "\n";
        code += "sin " + sin + "," + degree + "\n";
        code += "mul " + distance + ".x," + cos + "," + orbitRegister + ".x\n";
        code += "mul " + distance + ".y," + sin + "," + orbitRegister + ".x\n";
        code += "mov " + distance + ".wz" + animationRegisterData.vertexZeroConst + "\n";
        if (this._iUsesEulers)
            code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity) {
            code += "neg " + distance + ".x," + sin + "\n";
            code += "mov " + distance + ".y," + cos + "\n";
            code += "mov " + distance + ".zw," + animationRegisterData.vertexZeroConst + "\n";
            if (this._iUsesEulers)
                code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
            code += "mul " + distance + "," + distance + "," + orbitRegister + ".z\n";
            code += "div " + distance + "," + distance + "," + orbitRegister + ".y\n";
            if (!this._iUsesCycle)
                code += "div " + distance + "," + distance + "," + animationRegisterData.vertexLife + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        //Vector3D.x is radius, Vector3D.y is cycle duration, Vector3D.z is phase
        var orbit = param[ParticleOrbitNode.ORBIT_VECTOR3D];
        if (!orbit)
            throw new Error("there is no " + ParticleOrbitNode.ORBIT_VECTOR3D + " in param!");
        this._pOneData[0] = orbit.x;
        if (this._iUsesCycle && orbit.y <= 0)
            throw (new Error("the cycle duration must be greater than zero"));
        this._pOneData[1] = Math.PI * 2 / (!this._iUsesCycle ? 1 : orbit.y);
        this._pOneData[2] = orbit.x * Math.PI * 2;
        if (this._iUsesPhase)
            this._pOneData[3] = orbit.z * Math.PI / 180;
    };
    /**
     * Reference for orbit node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the radius (x), cycle speed (y) and cycle phase (z) of the motion on the particle.
     */
    ParticleOrbitNode.ORBIT_VECTOR3D = "OrbitVector3D";
    return ParticleOrbitNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleOrbitNode = ParticleOrbitNode;
