"use strict";
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * ...
 */
var AnimationRegisterData = (function () {
    function AnimationRegisterData() {
        this.indexDictionary = new Object();
    }
    AnimationRegisterData.prototype.reset = function (registerCache, sharedRegisters, needVelocity) {
        this.rotationRegisters = new Array();
        this.positionAttribute = sharedRegisters.animatableAttributes[0];
        this.scaleAndRotateTarget = sharedRegisters.animationTargetRegisters[0];
        for (var i = 1; i < sharedRegisters.animationTargetRegisters.length; i++)
            this.rotationRegisters.push(sharedRegisters.animationTargetRegisters[i]);
        //allot const register
        this.vertexZeroConst = registerCache.getFreeVertexConstant();
        this.vertexZeroConst = new ShaderRegisterElement_1.ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 0);
        this.vertexOneConst = new ShaderRegisterElement_1.ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 1);
        this.vertexTwoConst = new ShaderRegisterElement_1.ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 2);
        //allot temp register
        this.positionTarget = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(this.positionTarget, 1);
        this.positionTarget = new ShaderRegisterElement_1.ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
        if (needVelocity) {
            this.velocityTarget = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(this.velocityTarget, 1);
            this.velocityTarget = new ShaderRegisterElement_1.ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index);
            this.vertexTime = new ShaderRegisterElement_1.ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index, 3);
            this.vertexLife = new ShaderRegisterElement_1.ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index, 3);
        }
        else {
            var tempTime = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(tempTime, 1);
            this.vertexTime = new ShaderRegisterElement_1.ShaderRegisterElement(tempTime.regName, tempTime.index, 0);
            this.vertexLife = new ShaderRegisterElement_1.ShaderRegisterElement(tempTime.regName, tempTime.index, 1);
        }
    };
    AnimationRegisterData.prototype.setUVSourceAndTarget = function (sharedRegisters) {
        this.uvVar = sharedRegisters.uvTarget;
        this.uvAttribute = sharedRegisters.uvSource;
        //uv action is processed after normal actions,so use offsetTarget as uvTarget
        this.uvTarget = new ShaderRegisterElement_1.ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
    };
    AnimationRegisterData.prototype.setRegisterIndex = function (node, parameterIndex, registerIndex) {
        //8 should be enough for any node.
        var t = this.indexDictionary[node.id];
        if (t == null)
            t = this.indexDictionary[node.id] = new Array(8);
        t[parameterIndex] = registerIndex;
    };
    AnimationRegisterData.prototype.getRegisterIndex = function (node, parameterIndex) {
        return this.indexDictionary[node.id][parameterIndex];
    };
    return AnimationRegisterData;
}());
exports.AnimationRegisterData = AnimationRegisterData;
