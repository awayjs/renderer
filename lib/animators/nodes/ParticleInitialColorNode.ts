import ColorTransform					= require("awayjs-core/lib/geom/ColorTransform");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");
import AnimationRegisterCache			= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");

import ParticleAnimationSet				= require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
import ParticleProperties				= require("awayjs-renderergl/lib/animators/data/ParticleProperties");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleNodeBase					= require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
import ParticleInitialColorState		= require("awayjs-renderergl/lib/animators/states/ParticleInitialColorState");

/**
 *
 */
class ParticleInitialColorNode extends ParticleNodeBase
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

	constructor(mode:number /*uint*/, usesMultiplier:boolean = true, usesOffset:boolean = false, initialColor:ColorTransform = null)
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
	public getAGALVertexCode(shader:ShaderBase, animationRegisterCache:AnimationRegisterCache):string
	{
		var code:string = "";
		if (animationRegisterCache.needFragmentAnimation) {

			if (this._iUsesMultiplier) {
				var multiplierValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
				animationRegisterCache.setRegisterIndex(this, ParticleInitialColorState.MULTIPLIER_INDEX, multiplierValue.index);

				code += "mul " + animationRegisterCache.colorMulTarget + "," + multiplierValue + "," + animationRegisterCache.colorMulTarget + "\n";
			}

			if (this._iUsesOffset) {
				var offsetValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC)? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
				animationRegisterCache.setRegisterIndex(this, ParticleInitialColorState.OFFSET_INDEX, offsetValue.index);

				code += "add " + animationRegisterCache.colorAddTarget + "," + offsetValue + "," + animationRegisterCache.colorAddTarget + "\n";
			}
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet)
	{
		if (this._iUsesMultiplier)
			particleAnimationSet.hasColorMulNode = true;
		if (this._iUsesOffset)
			particleAnimationSet.hasColorAddNode = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
	{
		var initialColor:ColorTransform = param[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM];
		if (!initialColor)
			throw(new Error("there is no " + ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM + " in param!"));

		var i:number /*uint*/ = 0;

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

export = ParticleInitialColorNode;