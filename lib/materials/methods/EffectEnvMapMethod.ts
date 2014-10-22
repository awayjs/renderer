import CubeTextureBase					= require("awayjs-core/lib/textures/CubeTextureBase");
import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import IContextStageGL					= require("awayjs-stagegl/lib/core/stagegl/IContextStageGL");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import EffectMethodBase					= require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
import ShaderCompilerHelper				= require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");

/**
 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
 */
class EffectEnvMapMethod extends EffectMethodBase
{
	private _cubeTexture:CubeTextureBase;
	private _alpha:number;
	private _mask:Texture2DBase;

	/**
	 * Creates an EffectEnvMapMethod object.
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the surface.
	 */
	constructor(envMap:CubeTextureBase, alpha:number = 1)
	{
		super();
		this._cubeTexture = envMap;
		this._alpha = alpha;

	}

	/**
	 * An optional texture to modulate the reflectivity of the surface.
	 */
	public get mask():Texture2DBase
	{
		return this._mask;
	}

	public set mask(value:Texture2DBase)
	{
		if (value != this._mask || (value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format)))
			this.iInvalidateShaderProgram();

		this._mask = value;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;
		methodVO.needsUV = this._mask != null;
	}

	/**
	 * The cubic environment map containing the reflected scene.
	 */
	public get envMap():CubeTextureBase
	{
		return this._cubeTexture;
	}

	public set envMap(value:CubeTextureBase)
	{
		this._cubeTexture = value;
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
	}

	/**
	 * The reflectivity of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		this._alpha = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;

		(<IContextStageGL> stage.context).activateCubeTexture(methodVO.texturesIndex, this._cubeTexture);
		if (this._mask)
			(<IContextStageGL> stage.context).activateTexture(methodVO.texturesIndex + 1, this._mask);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		var code:string = "";
		var cubeMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();

		methodVO.texturesIndex = cubeMapReg.index;
		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		// r = I - 2(I.N)*N
		code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
				"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
				"mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
				"sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" +
			ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, temp) +
				"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		if (this._mask)
			code += ShaderCompilerHelper.getTex2DSampleCode(temp2, sharedRegisters, registerCache.getFreeTextureReg(), this._mask, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) +
				"mul " + temp + ", " + temp2 + ", " + temp + "\n";

		code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}

export = EffectEnvMapMethod;