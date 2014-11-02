import MethodVO							= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import DiffuseBasicMethod				= require("awayjs-renderergl/lib/materials/methods/DiffuseBasicMethod");
import ShaderCompilerHelper				= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");

/**
 * DiffuseDepthMethod provides a debug method to visualise depth maps
 */
class DiffuseDepthMethod extends DiffuseBasicMethod
{
	/**
	 * Creates a new DiffuseBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		var data:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index] = 1.0;
		data[index + 1] = 1/255.0;
		data[index + 2] = 1/65025.0;
		data[index + 3] = 1/16581375.0;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement;
		var decReg:ShaderRegisterElement;

		if (!this._pUseTexture)
			throw new Error("DiffuseDepthMethod requires texture!");

		// incorporate input from ambient
		if (shaderObject.numLights > 0) {
			if (sharedRegisters.shadowTarget)
				code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
			code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" +
				"sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
			registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
		}

		temp = shaderObject.numLights > 0? registerCache.getFreeFragmentVectorTemp():targetReg;

		this._pDiffuseInputRegister = registerCache.getFreeTextureReg();
		methodVO.texturesIndex = this._pDiffuseInputRegister.index;
		decReg = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = decReg.index*4;
		code += ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pDiffuseInputRegister, this.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) +
			"dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" +
			"mov " + temp + ".yz, " + temp + ".xx			\n" +
			"mov " + temp + ".w, " + decReg + ".x\n" +
			"sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";

		if (shaderObject.numLights == 0)
			return code;

		code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" +
			"mov " + targetReg + ".w, " + temp + ".w\n";

		return code;
	}
}

export = DiffuseDepthMethod;