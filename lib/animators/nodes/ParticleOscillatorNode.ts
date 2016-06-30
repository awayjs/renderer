import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleOscillatorState}			from "../../animators/states/ParticleOscillatorState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to control the position of a particle over time using simple harmonic motion.
 */
export class ParticleOscillatorNode extends ParticleNodeBase
{
	/** @private */
	public _iOscillator:Vector3D;

	/**
	 * Reference for ocsillator node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the axis (x,y,z) and cycle speed (w) of the motion on the particle.
	 */
	public static OSCILLATOR_VECTOR3D:string = "OscillatorVector3D";

	/**
	 * Creates a new <code>ParticleOscillatorNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
	 */
	constructor(mode:number, oscillator:Vector3D = null)
	{
		super("ParticleOscillator", mode, 4);

		this._pStateClass = ParticleOscillatorState;

		this._iOscillator = oscillator || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var oscillatorRegister:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleOscillatorState.OSCILLATOR_INDEX, oscillatorRegister.index);
		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var dgree:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
		var sin:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);
		var cos:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 2);
		registerCache.addVertexTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var distance:ShaderRegisterElement = new ShaderRegisterElement(temp2.regName, temp2.index);
		registerCache.removeVertexTempUsage(temp);

		var code:string = "";
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
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleOscillatorState
	{
		return <ParticleOscillatorState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		//(Vector3D.x,Vector3D.y,Vector3D.z) is oscillator axis, Vector3D.w is oscillator cycle duration
		var drift:Vector3D = param[ParticleOscillatorNode.OSCILLATOR_VECTOR3D];
		if (!drift)
			throw(new Error("there is no " + ParticleOscillatorNode.OSCILLATOR_VECTOR3D + " in param!"));

		this._pOneData[0] = drift.x;
		this._pOneData[1] = drift.y;
		this._pOneData[2] = drift.z;
		if (drift.w <= 0)
			throw(new Error("the cycle duration must greater than zero"));
		this._pOneData[3] = Math.PI*2/drift.w;
	}
}