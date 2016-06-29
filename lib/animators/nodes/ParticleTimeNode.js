"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleTimeState_1 = require("../../animators/states/ParticleTimeState");
/**
 * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
 */
var ParticleTimeNode = (function (_super) {
    __extends(ParticleTimeNode, _super);
    /**
     * Creates a new <code>ParticleTimeNode</code>
     *
     * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
     * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
     * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
     */
    function ParticleTimeNode(usesDuration, usesLooping, usesDelay) {
        if (usesDuration === void 0) { usesDuration = false; }
        if (usesLooping === void 0) { usesLooping = false; }
        if (usesDelay === void 0) { usesDelay = false; }
        _super.call(this, "ParticleTime", ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC, 4, 0);
        this._pStateClass = ParticleTimeState_1.ParticleTimeState;
        this._iUsesDuration = usesDuration;
        this._iUsesLooping = usesLooping;
        this._iUsesDelay = usesDelay;
    }
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var timeStreamRegister = registerCache.getFreeVertexAttribute(); //timeStreamRegister.x is start，timeStreamRegister.y is during time
        animationRegisterData.setRegisterIndex(this, ParticleTimeState_1.ParticleTimeState.TIME_STREAM_INDEX, timeStreamRegister.index);
        var timeConst = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleTimeState_1.ParticleTimeState.TIME_CONSTANT_INDEX, timeConst.index);
        var code = "";
        code += "sub " + animationRegisterData.vertexTime + "," + timeConst + "," + timeStreamRegister + ".x\n";
        //if time=0,set the position to zero.
        var temp = registerCache.getFreeVertexSingleTemp();
        code += "sge " + temp + "," + animationRegisterData.vertexTime + "," + animationRegisterData.vertexZeroConst + "\n";
        code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
        if (this._iUsesDuration) {
            if (this._iUsesLooping) {
                var div = registerCache.getFreeVertexSingleTemp();
                if (this._iUsesDelay) {
                    code += "div " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".z\n";
                    code += "frc " + div + "," + div + "\n";
                    code += "mul " + animationRegisterData.vertexTime + "," + div + "," + timeStreamRegister + ".z\n";
                    code += "slt " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".y\n";
                    code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + div + "\n";
                }
                else {
                    code += "mul " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".w\n";
                    code += "frc " + div + "," + div + "\n";
                    code += "mul " + animationRegisterData.vertexTime + "," + div + "," + timeStreamRegister + ".y\n";
                }
            }
            else {
                var sge = registerCache.getFreeVertexSingleTemp();
                code += "sge " + sge + "," + timeStreamRegister + ".y," + animationRegisterData.vertexTime + "\n";
                code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + sge + "\n";
            }
        }
        code += "mul " + animationRegisterData.vertexLife + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        this._pOneData[0] = param.startTime;
        this._pOneData[1] = param.duration;
        this._pOneData[2] = param.delay + param.duration;
        this._pOneData[3] = 1 / param.duration;
    };
    return ParticleTimeNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleTimeNode = ParticleTimeNode;
