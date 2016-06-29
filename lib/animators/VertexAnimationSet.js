"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationSetBase_1 = require("../animators/AnimationSetBase");
var AnimationRegisterData_1 = require("../animators/data/AnimationRegisterData");
var VertexAnimationMode_1 = require("../animators/data/VertexAnimationMode");
/**
 * The animation data set used by vertex-based animators, containing vertex animation state data.
 *
 * @see VertexAnimator
 */
var VertexAnimationSet = (function (_super) {
    __extends(VertexAnimationSet, _super);
    /**
     * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
     */
    //		public get useNormals():boolean
    //		{
    //			return this._uploadNormals;
    //		}
    /**
     * Creates a new <code>VertexAnimationSet</code> object.
     *
     * @param numPoses The number of poses made available at once to the GPU animation code.
     * @param blendMode Optional value for setting the animation mode of the vertex animator object.
     *
     * @see away3d.animators.data.VertexAnimationMode
     */
    function VertexAnimationSet(numPoses, blendMode) {
        if (numPoses === void 0) { numPoses = 2; }
        if (blendMode === void 0) { blendMode = "absolute"; }
        _super.call(this);
        this._numPoses = numPoses;
        this._blendMode = blendMode;
    }
    Object.defineProperty(VertexAnimationSet.prototype, "numPoses", {
        /**
         * Returns the number of poses made available at once to the GPU animation code.
         */
        get: function () {
            return this._numPoses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexAnimationSet.prototype, "blendMode", {
        /**
         * Returns the active blend mode of the vertex animator object.
         */
        get: function () {
            return this._blendMode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        //grab animationRegisterData from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterData = shader.animationRegisterData;
        if (this._iAnimationRegisterData == null)
            this._iAnimationRegisterData = shader.animationRegisterData = new AnimationRegisterData_1.AnimationRegisterData();
        if (this._blendMode == VertexAnimationMode_1.VertexAnimationMode.ABSOLUTE)
            return this.getAbsoluteAGALCode(shader, registerCache, sharedRegisters);
        else
            return this.getAdditiveAGALCode(shader, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        return "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.doneAGALCode = function (shader) {
    };
    /**
     * Generates the vertex AGAL code for absolute blending.
     */
    VertexAnimationSet.prototype.getAbsoluteAGALCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var temp1 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var regs = new Array(".x", ".y", ".z", ".w");
        var len = sharedRegisters.animatableAttributes.length;
        var constantReg = registerCache.getFreeVertexConstant();
        this._iAnimationRegisterData.weightsIndex = constantReg.index;
        this._iAnimationRegisterData.poseIndices = new Array(this._numPoses);
        var poseInput;
        var k = 0;
        if (len > 2)
            len = 2;
        for (var i = 0; i < len; ++i) {
            code += "mul " + temp1 + ", " + sharedRegisters.animatableAttributes[i] + ", " + constantReg + regs[0] + "\n";
            for (var j = 1; j < this._numPoses; ++j) {
                poseInput = registerCache.getFreeVertexAttribute();
                this._iAnimationRegisterData.poseIndices[k++] = poseInput.index;
                code += "mul " + temp2 + ", " + poseInput + ", " + constantReg + regs[j] + "\n";
                if (j < this._numPoses - 1)
                    code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";
            }
            code += "add " + sharedRegisters.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
        }
        // add code for bitangents if tangents are used
        if (shader.tangentDependencies > 0 || shader.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + sharedRegisters.animatableAttributes[2] + ", " + sharedRegisters.animationTargetRegisters[1] + "\n" +
                "mul " + temp1 + ", " + sharedRegisters.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
                "sub " + sharedRegisters.animationTargetRegisters[2] + ", " + sharedRegisters.animationTargetRegisters[2] + ", " + temp1 + "\n";
        }
        //
        // // simply write attributes to targets, do not animate them
        // // projection will pick up on targets[0] to do the projection
        // var len:number = sharedRegisters.animatableAttributes.length;
        // for (var i:number = 0; i < len; ++i)
        // 	code += "mov " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animatableAttributes[i] + "\n";
        return code;
    };
    /**
     * Generates the vertex AGAL code for additive blending.
     */
    VertexAnimationSet.prototype.getAdditiveAGALCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var len = sharedRegisters.animatableAttributes.length;
        var regs = [".x", ".y", ".z", ".w"];
        var temp1 = registerCache.getFreeVertexVectorTemp();
        var constantReg = registerCache.getFreeVertexConstant();
        this._iAnimationRegisterData.weightsIndex = constantReg.index;
        this._iAnimationRegisterData.poseIndices = new Array(this._numPoses);
        var poseInput;
        var k = 0;
        if (len > 2)
            len = 2;
        code += "mov  " + sharedRegisters.animationTargetRegisters[0] + ", " + sharedRegisters.animatableAttributes[0] + "\n";
        if (shader.normalDependencies > 0)
            code += "mov " + sharedRegisters.animationTargetRegisters[1] + ", " + sharedRegisters.animatableAttributes[1] + "\n";
        for (var i = 0; i < len; ++i) {
            for (var j = 0; j < this._numPoses; ++j) {
                poseInput = registerCache.getFreeVertexAttribute();
                this._iAnimationRegisterData.poseIndices[k++] = poseInput.index;
                code += "mul " + temp1 + ", " + poseInput + ", " + constantReg + regs[j] + "\n" +
                    "add " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animationTargetRegisters[i] + ", " + temp1 + "\n";
            }
        }
        if (shader.tangentDependencies > 0 || shader.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + sharedRegisters.animatableAttributes[2] + ", " + sharedRegisters.animationTargetRegisters[1] + "\n" +
                "mul " + temp1 + ", " + sharedRegisters.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
                "sub " + sharedRegisters.animationTargetRegisters[2] + ", " + sharedRegisters.animatableAttributes[2] + ", " + temp1 + "\n";
        }
        return code;
    };
    return VertexAnimationSet;
}(AnimationSetBase_1.AnimationSetBase));
exports.VertexAnimationSet = VertexAnimationSet;
