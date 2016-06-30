import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";

import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleInitialColorState}		from "../../animators/states/ParticleInitialColorState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 *
 */
export class ParticleInitialColorNode extends ParticleNodeBase
{
	//default values used when creating states
	/** @private */
	public _iUsesMultiplier:boolean;
	/** @private */
	public _iUsesOffset:boolean;
	/** @private */
	public _iInitialColor:ColorTransform;

	/**
	 * Reference for color node properties on a single particle (when in local property mode).
	 * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
	 */
	public static COLOR_INITIAL_COLORTRANSFORM:string = "ColorInitialColorTransform";

	constructor(mode:number, usesMultiplier:boolean = true, usesOffset:boolean = false, initialColor:ColorTransform = null)
	{
		super("ParticleInitialColor", mode, (usesMultiplier && usesOffset)? 8 : 4, ParticleAnimationSet.COLOR_PRIORITY);

		this._pStateClass = ParticleInitialColorState;

		this._iUsesMultiplier = usesMultiplier;
		this._iUsesOffset = usesOffset;
		this._iInitialColor = initialColor || new ColorTransform();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var code:string = "";
		if (shader.usesFragmentAnimation) {

			if (this._iUsesMultiplier) {
				var multiplierValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
				animationRegisterData.setRegisterIndex(this, ParticleInitialColorState.MULTIPLIER_INDEX, multiplierValue.index);

				code += "mul " + animationRegisterData.colorMulTarget + "," + multiplierValue + "," + animationRegisterData.colorMulTarget + "\n";
			}

			if (this._iUsesOffset) {
				var offsetValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC)? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
				animationRegisterData.setRegisterIndex(this, ParticleInitialColorState.OFFSET_INDEX, offsetValue.index);

				code += "add " + animationRegisterData.colorAddTarget + "," + offsetValue + "," + animationRegisterData.colorAddTarget + "\n";
			}
		}

		return code;
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
		var initialColor:ColorTransform = param[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM];
		if (!initialColor)
			throw(new Error("there is no " + ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM + " in param!"));

		var i:number = 0;

		//multiplier
		if (this._iUsesMultiplier) {
			this._pOneData[i++] = initialColor.redMultiplier;
			this._pOneData[i++] = initialColor.greenMultiplier;
			this._pOneData[i++] = initialColor.blueMultiplier;
			this._pOneData[i++] = initialColor.alphaMultiplier;
		}
		//offset
		if (this._iUsesOffset) {
			this._pOneData[i++] = initialColor.redOffset/255;
			this._pOneData[i++] = initialColor.greenOffset/255;
			this._pOneData[i++] = initialColor.blueOffset/255;
			this._pOneData[i++] = initialColor.alphaOffset/255;
		}

	}

}