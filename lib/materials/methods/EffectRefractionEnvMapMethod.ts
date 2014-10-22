import CubeTextureBase					= require("awayjs-core/lib/textures/CubeTextureBase");

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
 * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
 */
class EffectRefractionEnvMapMethod extends EffectMethodBase
{
	private _envMap:CubeTextureBase;

	private _dispersionR:number = 0;
	private _dispersionG:number = 0;
	private _dispersionB:number = 0;
	private _useDispersion:boolean;
	private _refractionIndex:number;
	private _alpha:number = 1;

	/**
	 * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
	 *
	 * @param envMap The environment map containing the refracted scene.
	 * @param refractionIndex The refractive index of the material.
	 * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	constructor(envMap:CubeTextureBase, refractionIndex:number = .1, dispersionR:number = 0, dispersionG:number = 0, dispersionB:number = 0)
	{
		super();
		this._envMap = envMap;
		this._dispersionR = dispersionR;
		this._dispersionG = dispersionG;
		this._dispersionB = dispersionB;
		this._useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		this._refractionIndex = refractionIndex;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index + 4] = 1;
		data[index + 5] = 0;
		data[index + 7] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.needsNormals = true;
		methodVO.needsView = true;
	}

	/**
	 * The cube environment map to use for the refraction.
	 */
	public get envMap():CubeTextureBase
	{
		return this._envMap;
	}

	public set envMap(value:CubeTextureBase)
	{
		this._envMap = value;
	}

	/**
	 * The refractive index of the material.
	 */
	public get refractionIndex():number
	{
		return this._refractionIndex;
	}

	public set refractionIndex(value:number)
	{
		this._refractionIndex = value;
	}

	/**
	 * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	 */
	public get dispersionR():number
	{
		return this._dispersionR;
	}

	public set dispersionR(value:number)
	{
		this._dispersionR = value;

		var useDispersion:boolean = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		if (this._useDispersion != useDispersion) {
			this.iInvalidateShaderProgram();
			this._useDispersion = useDispersion;
		}
	}

	/**
	 * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	 */
	public get dispersionG():number
	{
		return this._dispersionG;
	}

	public set dispersionG(value:number)
	{
		this._dispersionG = value;

		var useDispersion:boolean = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		if (this._useDispersion != useDispersion) {
			this.iInvalidateShaderProgram();
			this._useDispersion = useDispersion;
		}
	}

	/**
	 * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	 */
	public get dispersionB():number
	{
		return this._dispersionB;
	}

	public set dispersionB(value:number)
	{
		this._dispersionB = value;

		var useDispersion:boolean = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
		if (this._useDispersion != useDispersion) {
			this.iInvalidateShaderProgram();
			this._useDispersion = useDispersion;
		}
	}

	/**
	 * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
	 * material. A value of 1 will make it appear fully transparent.
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
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;

		data[index] = this._dispersionR + this._refractionIndex;

		if (this._useDispersion) {
			data[index + 1] = this._dispersionG + this._refractionIndex;
			data[index + 2] = this._dispersionB + this._refractionIndex;
		}
		data[index + 3] = this._alpha;

		(<IContextStageGL> stage.context).activateCubeTexture(methodVO.texturesIndex, this._envMap);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		// todo: data2.x could use common reg, so only 1 reg is used
		var data:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var data2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var code:string = "";
		var cubeMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
		var refractionDir:ShaderRegisterElement;
		var refractionColor:ShaderRegisterElement;
		var temp:ShaderRegisterElement;

		methodVO.texturesIndex = cubeMapReg.index;
		methodVO.fragmentConstantsIndex = data.index*4;

		refractionDir = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(refractionDir, 1);
		refractionColor = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(refractionColor, 1);

		temp = registerCache.getFreeFragmentVectorTemp();

		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

		code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
			"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
			"mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
			"mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" +
			"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
			"sqt " + temp + ".y, " + temp + ".w\n" +

			"mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" +
			"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
			"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

			"mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" +
			"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
			"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
		code += ShaderCompilerHelper.getTexCubeSampleCode(refractionColor, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) +
			"sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" +
			"kil " + refractionColor + ".w\n";

		if (this._useDispersion) {
			// GREEN
			code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"sqt " + temp + ".y, " + temp + ".w\n" +

				"mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" +
				"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
				"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

				"mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" +
				"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
				"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
			code += ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) +
				"mov " + refractionColor + ".y, " + temp + ".y\n";

			// BLUE
			code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
				"mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" +
				"sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" +
				"sqt " + temp + ".y, " + temp + ".w\n" +

				"mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" +
				"add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" +
				"mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" +

				"mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" +
				"sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" +
				"nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
			code += ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) +
				"mov " + refractionColor + ".z, " + temp + ".z\n";
		}

		registerCache.removeFragmentTempUsage(refractionDir);

		code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" +
			"mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" +
			"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";

		registerCache.removeFragmentTempUsage(refractionColor);

		// restore
		code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

		return code;
	}
}

export = EffectRefractionEnvMapMethod;