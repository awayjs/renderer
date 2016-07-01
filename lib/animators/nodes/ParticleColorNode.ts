import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleColorState}				from "../../animators/states/ParticleColorState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to control the color variation of a particle over time.
 */
export class ParticleColorNode extends ParticleNodeBase
{
	//default values used when creating states
	/** @private */
	public _iUsesMultiplier:boolean;
	/** @private */
	public _iUsesOffset:boolean;
	/** @private */
	public _iUsesCycle:boolean;
	/** @private */
	public _iUsesPhase:boolean;
	/** @private */
	public _iStartColor:ColorTransform;
	/** @private */
	public _iEndColor:ColorTransform;
	/** @private */
	public _iCycleDuration:number;
	/** @private */
	public _iCyclePhase:number;

	/**
	 * Reference for color node properties on a single particle (when in local property mode).
	 * Expects a <code>ColorTransform</code> object representing the start color transform applied to the particle.
	 */
	public static COLOR_START_COLORTRANSFORM:string = "ColorStartColorTransform";

	/**
	 * Reference for color node properties on a single particle (when in local property mode).
	 * Expects a <code>ColorTransform</code> object representing the end color transform applied to the particle.
	 */
	public static COLOR_END_COLORTRANSFORM:string = "ColorEndColorTransform";

	/**
	 * Creates a new <code>ParticleColorNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] usesMultiplier  Defines whether the node uses multiplier data in the shader for its color transformations. Defaults to true.
	 * @param    [optional] usesOffset      Defines whether the node uses offset data in the shader for its color transformations. Defaults to true.
	 * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the animation independent of particle duration. Defaults to false.
	 * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
	 * @param    [optional] startColor      Defines the default start color transform of the node, when in global mode.
	 * @param    [optional] endColor        Defines the default end color transform of the node, when in global mode.
	 * @param    [optional] cycleDuration   Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	 * @param    [optional] cyclePhase      Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	 */
	constructor(mode:number, usesMultiplier:boolean = true, usesOffset:boolean = true, usesCycle:boolean = false, usesPhase:boolean = false, startColor:ColorTransform = null, endColor:ColorTransform = null, cycleDuration:number = 1, cyclePhase:number = 0)
	{
		super("ParticleColor", mode, (usesMultiplier && usesOffset)? 16 : 8, ParticleAnimationSet.COLOR_PRIORITY);

		this._pStateClass = ParticleColorState;

		this._iUsesMultiplier = usesMultiplier;
		this._iUsesOffset = usesOffset;
		this._iUsesCycle = usesCycle;
		this._iUsesPhase = usesPhase;

		this._iStartColor = startColor || new ColorTransform();
		this._iEndColor = endColor || new ColorTransform();
		this._iCycleDuration = cycleDuration;
		this._iCyclePhase = cyclePhase;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var code:string = "";
		if (shader.usesFragmentAnimation) {
			var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

			if (this._iUsesCycle) {
				var cycleConst:ShaderRegisterElement = registerCache.getFreeVertexConstant();
				animationRegisterData.setRegisterIndex(this, ParticleColorState.CYCLE_INDEX, cycleConst.index);

				registerCache.addVertexTempUsages(temp, 1);
				var sin:ShaderRegisterElement = registerCache.getFreeVertexSingleTemp();
				registerCache.removeVertexTempUsage(temp);

				code += "mul " + sin + "," + animationRegisterData.vertexTime + "," + cycleConst + ".x\n";

				if (this._iUsesPhase)
					code += "add " + sin + "," + sin + "," + cycleConst + ".y\n";

				code += "sin " + sin + "," + sin + "\n";
			}

			if (this._iUsesMultiplier) {
				var startMultiplierValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
				var deltaMultiplierValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();

				animationRegisterData.setRegisterIndex(this, ParticleColorState.START_MULTIPLIER_INDEX, startMultiplierValue.index);
				animationRegisterData.setRegisterIndex(this, ParticleColorState.DELTA_MULTIPLIER_INDEX, deltaMultiplierValue.index);

				code += "mul " + temp + "," + deltaMultiplierValue + "," + (this._iUsesCycle? sin : animationRegisterData.vertexLife) + "\n";
				code += "add " + temp + "," + temp + "," + startMultiplierValue + "\n";
				code += "mul " + animationRegisterData.colorMulTarget + "," + temp + "," + animationRegisterData.colorMulTarget + "\n";
			}

			if (this._iUsesOffset) {
				var startOffsetValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC)? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
				var deltaOffsetValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC)? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();

				animationRegisterData.setRegisterIndex(this, ParticleColorState.START_OFFSET_INDEX, startOffsetValue.index);
				animationRegisterData.setRegisterIndex(this, ParticleColorState.DELTA_OFFSET_INDEX, deltaOffsetValue.index);

				code += "mul " + temp + "," + deltaOffsetValue + "," + (this._iUsesCycle? sin : animationRegisterData.vertexLife) + "\n";
				code += "add " + temp + "," + temp + "," + startOffsetValue + "\n";
				code += "add " + animationRegisterData.colorAddTarget + "," + temp + "," + animationRegisterData.colorAddTarget + "\n";
			}
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleColorState
	{
		return <ParticleColorState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet):void
	{
		if (this._iUsesMultiplier)
			particleAnimationSet.hasColorMulNode = true;
		if (this._iUsesOffset)
			particleAnimationSet.hasColorAddNode = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		var startColor:ColorTransform = param[ParticleColorNode.COLOR_START_COLORTRANSFORM];
		if (!startColor)
			throw(new Error("there is no " + ParticleColorNode.COLOR_START_COLORTRANSFORM + " in param!"));

		var endColor:ColorTransform = param[ParticleColorNode.COLOR_END_COLORTRANSFORM];
		if (!endColor)
			throw(new Error("there is no " + ParticleColorNode.COLOR_END_COLORTRANSFORM + " in param!"));

		var i:number = 0;

		if (!this._iUsesCycle) {
			//multiplier
			if (this._iUsesMultiplier) {
				this._pOneData[i++] = startColor.redMultiplier;
				this._pOneData[i++] = startColor.greenMultiplier;
				this._pOneData[i++] = startColor.blueMultiplier;
				this._pOneData[i++] = startColor.alphaMultiplier;
				this._pOneData[i++] = endColor.redMultiplier - startColor.redMultiplier;
				this._pOneData[i++] = endColor.greenMultiplier - startColor.greenMultiplier;
				this._pOneData[i++] = endColor.blueMultiplier - startColor.blueMultiplier;
				this._pOneData[i++] = endColor.alphaMultiplier - startColor.alphaMultiplier;
			}

			//offset
			if (this._iUsesOffset) {
				this._pOneData[i++] = startColor.redOffset/255;
				this._pOneData[i++] = startColor.greenOffset/255;
				this._pOneData[i++] = startColor.blueOffset/255;
				this._pOneData[i++] = startColor.alphaOffset/255;
				this._pOneData[i++] = (endColor.redOffset - startColor.redOffset)/255;
				this._pOneData[i++] = (endColor.greenOffset - startColor.greenOffset)/255;
				this._pOneData[i++] = (endColor.blueOffset - startColor.blueOffset)/255;
				this._pOneData[i++] = (endColor.alphaOffset - startColor.alphaOffset)/255;
			}
		} else {
			//multiplier
			if (this._iUsesMultiplier) {
				this._pOneData[i++] = (startColor.redMultiplier + endColor.redMultiplier)/2;
				this._pOneData[i++] = (startColor.greenMultiplier + endColor.greenMultiplier)/2;
				this._pOneData[i++] = (startColor.blueMultiplier + endColor.blueMultiplier)/2;
				this._pOneData[i++] = (startColor.alphaMultiplier + endColor.alphaMultiplier)/2;
				this._pOneData[i++] = (startColor.redMultiplier - endColor.redMultiplier)/2;
				this._pOneData[i++] = (startColor.greenMultiplier - endColor.greenMultiplier)/2;
				this._pOneData[i++] = (startColor.blueMultiplier - endColor.blueMultiplier)/2;
				this._pOneData[i++] = (startColor.alphaMultiplier - endColor.alphaMultiplier)/2;
			}

			//offset
			if (this._iUsesOffset) {
				this._pOneData[i++] = (startColor.redOffset + endColor.redOffset)/(255*2);
				this._pOneData[i++] = (startColor.greenOffset + endColor.greenOffset)/(255*2);
				this._pOneData[i++] = (startColor.blueOffset + endColor.blueOffset)/(255*2);
				this._pOneData[i++] = (startColor.alphaOffset + endColor.alphaOffset)/(255*2);
				this._pOneData[i++] = (startColor.redOffset - endColor.redOffset)/(255*2);
				this._pOneData[i++] = (startColor.greenOffset - endColor.greenOffset)/(255*2);
				this._pOneData[i++] = (startColor.blueOffset - endColor.blueOffset)/(255*2);
				this._pOneData[i++] = (startColor.alphaOffset - endColor.alphaOffset)/(255*2);
			}
		}

	}
}