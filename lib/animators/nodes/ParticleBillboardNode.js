"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleBillboardState_1 = require("../../animators/states/ParticleBillboardState");
/**
 * A particle animation node that controls the rotation of a particle to always face the camera.
 */
var ParticleBillboardNode = (function (_super) {
    __extends(ParticleBillboardNode, _super);
    /**
     * Creates a new <code>ParticleBillboardNode</code>
     */
    function ParticleBillboardNode(billboardAxis) {
        if (billboardAxis === void 0) { billboardAxis = null; }
        _super.call(this, "ParticleBillboard", ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL, 0, 4);
        this._pStateClass = ParticleBillboardState_1.ParticleBillboardState;
        this._iBillboardAxis = billboardAxis;
    }
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var rotationMatrixRegister = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleBillboardState_1.ParticleBillboardState.MATRIX_INDEX, rotationMatrixRegister.index);
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        var temp = registerCache.getFreeVertexVectorTemp();
        var code = "m33 " + temp + ".xyz," + animationRegisterData.scaleAndRotateTarget + "," + rotationMatrixRegister + "\n" +
            "mov " + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
        var shaderRegisterElement;
        for (var i = 0; i < animationRegisterData.rotationRegisters.length; i++) {
            shaderRegisterElement = animationRegisterData.rotationRegisters[i];
            code += "m33 " + temp + ".xyz," + shaderRegisterElement + "," + rotationMatrixRegister + "\n" +
                "mov " + shaderRegisterElement + ".xyz," + shaderRegisterElement + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.hasBillboard = true;
    };
    return ParticleBillboardNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleBillboardNode = ParticleBillboardNode;
