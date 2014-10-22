import DirectionalLight					= require("awayjs-core/lib/entities/DirectionalLight");

import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import ShadowMethodBase					= require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");

/**
 * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
 * results of neighbouring pixels.
 */
class ShadowFilteredMethod extends ShadowMethodBase
{
	/**
	 * Creates a new DiffuseBasicMethod object.
	 *
	 * @param castingLight The light casting the shadow
	 */
	constructor(castingLight:DirectionalLight)
	{
		super(castingLight);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		super.iInitConstants(shaderObject, methodVO);

		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		fragmentData[index + 8] = .5;
		var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
		fragmentData[index + 9] = size;
		fragmentData[index + 10] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _pGetPlanarFragmentCode(methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
		var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		// TODO: not used
		dataReg = dataReg;
		var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
		var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
		var uvReg:ShaderRegisterElement;
		var code:string = "";
		methodVO.fragmentConstantsIndex = decReg.index*4;

		regCache.addFragmentTempUsages(depthCol, 1);

		uvReg = regCache.getFreeFragmentVectorTemp();
		regCache.addFragmentTempUsages(uvReg, 1);

		code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" +

			"tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + 	// (1, 0)
			"tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" + "add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" +	// (0, 1)
			"tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" +	// (1, 1)
			"tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

			// recalculate fraction, since we ran out of registers :(
			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

			"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";

		regCache.removeFragmentTempUsage(depthCol);
		regCache.removeFragmentTempUsage(uvReg);

		methodVO.texturesIndex = depthMapRegister.index;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivateForCascade(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = size;
		data[index + 1] = 1/size;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetCascadeFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp, 1);
		var predicate:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(predicate, 1);

		code = "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" +

			"add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" +

			"sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" +

			"mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" + "frc " + temp + ".xy, " + temp + ".xy\n" +

			// some strange register juggling to prevent agal bugging out
			"sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" + "mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" +

			"add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" +

			"sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" + "mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" + "add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";

		registerCache.removeFragmentTempUsage(temp);
		registerCache.removeFragmentTempUsage(predicate);
		return code;
	}
}

export = ShadowFilteredMethod;