import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleTimeState}				from "../../animators/states/ParticleTimeState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
 */
export class ParticleTimeNode extends ParticleNodeBase
{
	/** @private */
	public _iUsesDuration:boolean;
	/** @private */
	public _iUsesDelay:boolean;
	/** @private */
	public _iUsesLooping:boolean;

	/**
	 * Creates a new <code>ParticleTimeNode</code>
	 *
	 * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
	 * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
	 * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
	 */
	constructor(usesDuration:boolean = false, usesLooping:boolean = false, usesDelay:boolean = false)
	{
		super("ParticleTime", ParticlePropertiesMode.LOCAL_STATIC, 4, 0);
		
		this._pStateClass = ParticleTimeState;

		this._iUsesDuration = usesDuration;
		this._iUsesLooping = usesLooping;
		this._iUsesDelay = usesDelay;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var timeStreamRegister:ShaderRegisterElement = registerCache.getFreeVertexAttribute(); //timeStreamRegister.x is start，timeStreamRegister.y is during time
		animationRegisterData.setRegisterIndex(this, ParticleTimeState.TIME_STREAM_INDEX, timeStreamRegister.index);
		var timeConst:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		animationRegisterData.setRegisterIndex(this, ParticleTimeState.TIME_CONSTANT_INDEX, timeConst.index);

		var code:string = "";
		code += "sub " + animationRegisterData.vertexTime + "," + timeConst + "," + timeStreamRegister + ".x\n";
		//if time=0,set the position to zero.
		var temp:ShaderRegisterElement = registerCache.getFreeVertexSingleTemp();
		code += "sge " + temp + "," + animationRegisterData.vertexTime + "," + animationRegisterData.vertexZeroConst + "\n";
		code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
		if (this._iUsesDuration) {
			if (this._iUsesLooping) {
				var div:ShaderRegisterElement = registerCache.getFreeVertexSingleTemp();
				if (this._iUsesDelay) {
					code += "div " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".z\n";
					code += "frc " + div + "," + div + "\n";
					code += "mul " + animationRegisterData.vertexTime + "," + div + "," + timeStreamRegister + ".z\n";
					code += "slt " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".y\n";
					code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + div + "\n";
				} else {
					code += "mul " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".w\n";
					code += "frc " + div + "," + div + "\n";
					code += "mul " + animationRegisterData.vertexTime + "," + div + "," + timeStreamRegister + ".y\n";
				}
			} else {
				var sge:ShaderRegisterElement = registerCache.getFreeVertexSingleTemp();
				code += "sge " + sge + "," + timeStreamRegister + ".y," + animationRegisterData.vertexTime + "\n";
				code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + sge + "\n";
			}
		}
		code += "mul " + animationRegisterData.vertexLife + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".w\n";
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleTimeState
	{
		return <ParticleTimeState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		this._pOneData[0] = param.startTime;
		this._pOneData[1] = param.duration;
		this._pOneData[2] = param.delay + param.duration;
		this._pOneData[3] = 1/param.duration;

	}
}