import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleSpriteSheetState}			from "../../animators/states/ParticleSpriteSheetState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used when a spritesheet texture is required to animate the particle.
 * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
 */
export class ParticleSpriteSheetNode extends ParticleNodeBase
{
	/** @private */
	public _iUsesCycle:boolean;

	/** @private */
	public _iUsesPhase:boolean;

	/** @private */
	public _iTotalFrames:number;
	/** @private */
	public _iNumColumns:number;
	/** @private */
	public _iNumRows:number;
	/** @private */
	public _iCycleDuration:number;
	/** @private */
	public _iCyclePhase:number;

	/**
	 * Reference for spritesheet node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
	 */
	public static UV_VECTOR3D:string = "UVVector3D";

	/**
	 * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
	 */
	public get numColumns():number
	{
		return this._iNumColumns;
	}

	/**
	 * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
	 */
	public get numRows():number
	{
		return this._iNumRows;
	}

	/**
	 * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
	 */
	public get totalFrames():number
	{
		return this._iTotalFrames;
	}

	/**
	 * Creates a new <code>ParticleSpriteSheetNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] numColumns      Defines the number of columns in the spritesheet, when in global mode. Defaults to 1.
	 * @param    [optional] numRows         Defines the number of rows in the spritesheet, when in global mode. Defaults to 1.
	 * @param    [optional] cycleDuration   Defines the default cycle duration in seconds, when in global mode. Defaults to 1.
	 * @param    [optional] cyclePhase      Defines the default cycle phase, when in global mode. Defaults to 0.
	 * @param    [optional] totalFrames     Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows.
	 * @param    [optional] looping         Defines whether the spritesheet animation is set to loop indefinitely. Defaults to true.
	 */
	constructor(mode:number, usesCycle:boolean, usesPhase:boolean, numColumns:number = 1, numRows:number = 1, cycleDuration:number = 1, cyclePhase:number = 0, totalFrames:number = Number.MAX_VALUE)
	{
		super("ParticleSpriteSheet", mode, usesCycle? (usesPhase? 3 : 2) : 1, ParticleAnimationSet.POST_PRIORITY + 1);

		this._pStateClass = ParticleSpriteSheetState;

		this._iUsesCycle = usesCycle;
		this._iUsesPhase = usesPhase;

		this._iNumColumns = numColumns;
		this._iNumRows = numRows;
		this._iCyclePhase = cyclePhase;
		this._iCycleDuration = cycleDuration;
		this._iTotalFrames = Math.min(totalFrames, numColumns*numRows);
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		//get 2 vc
		var uvParamConst1:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		var uvParamConst2:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleSpriteSheetState.UV_INDEX_0, uvParamConst1.index);
		animationRegisterData.setRegisterIndex(this, ParticleSpriteSheetState.UV_INDEX_1, uvParamConst2.index);

		var uTotal:ShaderRegisterElement = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 0);
		var uStep:ShaderRegisterElement = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 1);
		var vStep:ShaderRegisterElement = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 2);

		var uSpeed:ShaderRegisterElement = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 0);
		var cycle:ShaderRegisterElement = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 1);
		var phaseTime:ShaderRegisterElement = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 2);

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var time:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
		var vOffset:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);
		temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
		var temp2:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 3);

		var u:ShaderRegisterElement = new ShaderRegisterElement(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, 0);
		var v:ShaderRegisterElement = new ShaderRegisterElement(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, 1);

		var code:string = "";
		//scale uv
		code += "mul " + u + "," + u + "," + uStep + "\n";
		if (this._iNumRows > 1)
			code += "mul " + v + "," + v + "," + vStep + "\n";

		if (this._iUsesCycle) {
			if (this._iUsesPhase)
				code += "add " + time + "," + animationRegisterData.vertexTime + "," + phaseTime + "\n";
			else
				code += "mov " + time + "," + animationRegisterData.vertexTime + "\n";
			code += "div " + time + "," + time + "," + cycle + "\n";
			code += "frc " + time + "," + time + "\n";
			code += "mul " + time + "," + time + "," + cycle + "\n";
			code += "mul " + temp + "," + time + "," + uSpeed + "\n";
		} else
			code += "mul " + temp.toString() + "," + animationRegisterData.vertexLife + "," + uTotal + "\n";

		if (this._iNumRows > 1) {
			code += "frc " + temp2 + "," + temp + "\n";
			code += "sub " + vOffset + "," + temp + "," + temp2 + "\n";
			code += "mul " + vOffset + "," + vOffset + "," + vStep + "\n";
			code += "add " + v + "," + v + "," + vOffset + "\n";
		}

		code += "div " + temp2 + "," + temp + "," + uStep + "\n";
		code += "frc " + temp + "," + temp2 + "\n";
		code += "sub " + temp2 + "," + temp2 + "," + temp + "\n";
		code += "mul " + temp + "," + temp2 + "," + uStep + "\n";

		if (this._iNumRows > 1)
			code += "frc " + temp + "," + temp + "\n";
		code += "add " + u + "," + u + "," + temp + "\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleSpriteSheetState
	{
		return <ParticleSpriteSheetState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet):void
	{
		particleAnimationSet.hasUVNode = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		if (this._iUsesCycle) {
			var uvCycle:Vector3D = param[ParticleSpriteSheetNode.UV_VECTOR3D];
			if (!uvCycle)
				throw(new Error("there is no " + ParticleSpriteSheetNode.UV_VECTOR3D + " in param!"));
			if (uvCycle.x <= 0)
				throw(new Error("the cycle duration must be greater than zero"));
			var uTotal:number = this._iTotalFrames/this._iNumColumns;
			this._pOneData[0] = uTotal/uvCycle.x;
			this._pOneData[1] = uvCycle.x;
			if (this._iUsesPhase)
				this._pOneData[2] = uvCycle.y;
		}
	}
}