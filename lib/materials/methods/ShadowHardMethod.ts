import LightBase					= require("awayjs-display/lib/base/LightBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import ShadowMethodBase				= require("awayjs-renderergl/lib/materials/methods/ShadowMethodBase");

/**
 * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
 */
class ShadowHardMethod extends ShadowMethodBase
{
	/**
	 * Creates a new ShadowHardMethod object.
	 */
	constructor(castingLight:LightBase)
	{
		super(castingLight);
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		// needs to be reserved anyway. DO NOT REMOVE
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

		var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		var code:string = "";

		methodVO.fragmentConstantsIndex = decReg.index*4;
		methodVO.texturesIndex = depthMapRegister.index;

		code += "tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" +
			"dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" +
			"slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPointFragmentCode(methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var epsReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var posReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var depthSampleCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(depthSampleCol, 1);
		var lightDir:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		var code:string = "";

		methodVO.fragmentConstantsIndex = decReg.index*4;
		methodVO.texturesIndex = depthMapRegister.index;

		code += "sub " + lightDir + ", " + sharedRegisters.globalPositionVarying + ", " + posReg + "\n" +
			"dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" +
			"mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" +
			"nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" +

			"tex " + depthSampleCol + ", " + lightDir + ", " + depthMapRegister + " <cube, nearest, clamp>\n" +
			"dp4 " + depthSampleCol + ".z, " + depthSampleCol + ", " + decReg + "\n" +
			"add " + targetReg + ".w, " + lightDir + ".w, " + epsReg + ".x\n" +    // offset by epsilon

			"slt " + targetReg + ".w, " + targetReg + ".w, " + depthSampleCol + ".z\n"; // 0 if in shadow

		regCache.removeFragmentTempUsage(depthSampleCol);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		return "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" +
			"dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" +
			"slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
	}
}

export = ShadowHardMethod;