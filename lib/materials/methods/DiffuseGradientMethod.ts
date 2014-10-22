import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import IContextStageGL					= require("awayjs-stagegl/lib/core/stagegl/IContextStageGL");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import DiffuseBasicMethod				= require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
import ShaderCompilerHelper				= require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");

/**
 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
 * scattered light within the skin attributing to the final colour)
 */
class DiffuseGradientMethod extends DiffuseBasicMethod
{
	private _gradientTextureRegister:ShaderRegisterElement;
	private _gradient:Texture2DBase;

	/**
	 * Creates a new DiffuseGradientMethod object.
	 * @param gradient A texture that contains the light colour based on the angle. This can be used to change
	 * the light colour due to subsurface scattering when the surface faces away from the light.
	 */
	constructor(gradient:Texture2DBase)
	{
		super();

		this._gradient = gradient;
	}

	/**
	 * A texture that contains the light colour based on the angle. This can be used to change the light colour
	 * due to subsurface scattering when the surface faces away from the light.
	 */
	public get gradient():Texture2DBase
	{
		return this._gradient;
	}

	public set gradient(value:Texture2DBase)
	{
		if (value.hasMipmaps != this._gradient.hasMipmaps || value.format != this._gradient.format)
			this.iInvalidateShaderProgram();
		this._gradient = value;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._gradientTextureRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = super.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
		this._pIsFirstLight = true;

		if (shaderObject.numLights > 0) {
			this._gradientTextureRegister = registerCache.getFreeTextureReg();
			methodVO.secondaryTexturesIndex = this._gradientTextureRegister.index;
		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight)
			t = this._pTotalLightColorReg;
		else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"mul " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
			"add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" +
			"mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

		code += ShaderCompilerHelper.getTex2DSampleCode(t, sharedRegisters, this._gradientTextureRegister, this._gradient, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, t, "clamp") +
			//					"mul " + t + ".xyz, " + t + ".xyz, " + t + ".w\n" +
			"mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public pApplyShadow(shaderObject:ShaderLightingObject, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var t:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

		return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" +
			ShaderCompilerHelper.getTex2DSampleCode(t, sharedRegisters, this._gradientTextureRegister, this._gradient, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, t, "clamp") +
			"mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		(<IContextStageGL> stage.context).activateTexture(methodVO.secondaryTexturesIndex, this._gradient);
	}
}

export = DiffuseGradientMethod;