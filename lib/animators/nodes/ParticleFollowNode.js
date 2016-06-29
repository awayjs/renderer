"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleFollowState_1 = require("../../animators/states/ParticleFollowState");
/**
 * A particle animation node used to create a follow behaviour on a particle system.
 */
var ParticleFollowNode = (function (_super) {
    __extends(ParticleFollowNode, _super);
    /**
     * Creates a new <code>ParticleFollowNode</code>
     *
     * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
     * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
     * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
     */
    function ParticleFollowNode(usesPosition, usesRotation, smooth) {
        if (usesPosition === void 0) { usesPosition = true; }
        if (usesRotation === void 0) { usesRotation = true; }
        if (smooth === void 0) { smooth = false; }
        _super.call(this, "ParticleFollow", ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_DYNAMIC, (usesPosition && usesRotation) ? 6 : 3, ParticleAnimationSet_1.ParticleAnimationSet.POST_PRIORITY);
        this._pStateClass = ParticleFollowState_1.ParticleFollowState;
        this._iUsesPosition = usesPosition;
        this._iUsesRotation = usesRotation;
        this._iSmooth = smooth;
    }
    /**
     * @inheritDoc
     */
    ParticleFollowNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        //TODO: use Quaternion to implement this function
        var code = "";
        if (this._iUsesRotation) {
            var rotationAttribute = registerCache.getFreeVertexAttribute();
            animationRegisterData.setRegisterIndex(this, ParticleFollowState_1.ParticleFollowState.FOLLOW_ROTATION_INDEX, rotationAttribute.index);
            var temp1 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp1, 1);
            var temp2 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp2, 1);
            var temp3 = registerCache.getFreeVertexVectorTemp();
            var temp4;
            if (animationSet.hasBillboard) {
                registerCache.addVertexTempUsages(temp3, 1);
                temp4 = registerCache.getFreeVertexVectorTemp();
            }
            registerCache.removeVertexTempUsage(temp1);
            registerCache.removeVertexTempUsage(temp2);
            if (animationSet.hasBillboard)
                registerCache.removeVertexTempUsage(temp3);
            var len = animationRegisterData.rotationRegisters.length;
            var i;
            //x axis
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + animationRegisterData.vertexOneConst + "\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "sin " + temp3 + ".y," + rotationAttribute + ".x\n";
            code += "cos " + temp3 + ".z," + rotationAttribute + ".x\n";
            code += "mov " + temp2 + ".x," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".y," + temp3 + ".z\n";
            code += "neg " + temp2 + ".z," + temp3 + ".y\n";
            if (animationSet.hasBillboard)
                code += "m33 " + temp4 + ".xyz," + animationRegisterData.positionTarget + ".xyz," + temp1 + "\n";
            else {
                code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
            }
            //y axis
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "cos " + temp1 + ".x," + rotationAttribute + ".y\n";
            code += "sin " + temp1 + ".z," + rotationAttribute + ".y\n";
            code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".y," + animationRegisterData.vertexOneConst + "\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "neg " + temp3 + ".x," + temp1 + ".z\n";
            code += "mov " + temp3 + ".z," + temp1 + ".x\n";
            if (animationSet.hasBillboard)
                code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
            else {
                code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
            }
            //z axis
            code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "sin " + temp2 + ".x," + rotationAttribute + ".z\n";
            code += "cos " + temp2 + ".y," + rotationAttribute + ".z\n";
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp2 + ".y\n";
            code += "neg " + temp1 + ".y," + temp2 + ".x\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";
            if (animationSet.hasBillboard) {
                code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
                code += "sub " + temp4 + ".xyz," + temp4 + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
                code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp4 + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
            }
            else {
                code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
            }
        }
        if (this._iUsesPosition) {
            var positionAttribute = registerCache.getFreeVertexAttribute();
            animationRegisterData.setRegisterIndex(this, ParticleFollowState_1.ParticleFollowState.FOLLOW_POSITION_INDEX, positionAttribute.index);
            code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + positionAttribute + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleFollowNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return ParticleFollowNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleFollowNode = ParticleFollowNode;
