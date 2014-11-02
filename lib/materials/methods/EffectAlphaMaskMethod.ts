import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import MethodVO							= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import EffectMethodBase					= require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
import ShaderCompilerHelper				= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");

/**
 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
 * etc).
 */
class EffectAlphaMaskMethod extends EffectMethodBase
{
	private _texture:Texture2DBase;
	private _useSecondaryUV:boolean;

	/**
	 * Creates a new EffectAlphaMaskMethod object.
	 *
	 * @param texture The texture to use as the alpha mask.
	 * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
	 */
	constructor(texture:Texture2DBase, useSecondaryUV:boolean = false)
	{
		super();

		this._texture = texture;
		this._useSecondaryUV = useSecondaryUV;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.needsSecondaryUV = this._useSecondaryUV;
		methodVO.needsUV = !this._useSecondaryUV;
	}

	/**
	 * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
	 * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
	 * transparency over a tiled water surface.
	 */
	public get useSecondaryUV():boolean
	{
		return this._useSecondaryUV;
	}

	public set useSecondaryUV(value:boolean)
	{
		if (this._useSecondaryUV == value)
			return;
		this._useSecondaryUV = value;
		this.iInvalidateShaderProgram();
	}

	/**
	 * The texture to use as the alpha mask.
	 */
	public get texture():Texture2DBase
	{
		return this._texture;
	}

	public set texture(value:Texture2DBase)
	{
		this._texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		stage.context.activateTexture(methodVO.texturesIndex, this._texture);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var textureReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		var uvReg:ShaderRegisterElement = this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying;
		methodVO.texturesIndex = textureReg.index;

		return ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, textureReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, uvReg) +
			"mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
	}
}

export = EffectAlphaMaskMethod;