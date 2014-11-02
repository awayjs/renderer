import CubeTextureBase					= require("awayjs-core/lib/textures/CubeTextureBase");
import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import MethodVO							= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderObjectBase					= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import EffectMethodBase					= require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
import ShaderCompilerHelper				= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");

/**
 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
 * stronger as the viewing angle becomes more grazing.
 */
class EffectFresnelEnvMapMethod extends EffectMethodBase
{
	private _cubeTexture:CubeTextureBase;
	private _fresnelPower:number = 5;
	private _normalReflectance:number = 0;
	private _alpha:number;
	private _mask:Texture2DBase;

	/**
	 * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
	 *
	 * @param envMap The environment map containing the reflected scene.
	 * @param alpha The reflectivity of the material.
	 */
	constructor(envMap:CubeTextureBase, alpha:number = 1)
	{
		super();

		this._cubeTexture = envMap;
		this._alpha = alpha;
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
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
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
		if (Boolean(value) != Boolean(this._mask) ||
			(value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format))) {
			this.iInvalidateShaderProgram();
		}
		this._mask = value;
	}

	/**
	 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	 */
	public get fresnelPower():number
	{
		return this._fresnelPower;
	}

	public set fresnelPower(value:number)
	{
		this._fresnelPower = value;
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
	 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	 */
	public get normalReflectance():number
	{
		return this._normalReflectance;
	}

	public set normalReflectance(value:number)
	{
		this._normalReflectance = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var data:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		data[index] = this._alpha;
		data[index + 1] = this._normalReflectance;
		data[index + 2] = this._fresnelPower;

		stage.context.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture);

		if (this._mask)
			stage.context.activateTexture(methodVO.texturesIndex + 1, this._mask);
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
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		methodVO.texturesIndex = cubeMapReg.index;
		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		registerCache.addFragmentTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		// r = V - 2(V.N)*N
		code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +
				"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
				"mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" +
				"sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" +
			ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, temp) +
				"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" +               	// -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "\n";

		// calculate fresnel term
		code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +  // dot(V, H)
				"sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +       // base = 1-dot(V, H)
				"pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" +       // exp = pow(base, 5)
				"sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +        // 1 - exp
				"mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" +         // f0*(1 - exp)
				"add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" +          // exp + f0*(1 - exp)

				// total alpha
				"mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";

		if (this._mask) {
			var maskReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
			code += ShaderCompilerHelper.getTex2DSampleCode(temp2, sharedRegisters, maskReg, this._mask, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) +
				"mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
		}

		// blend
		code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

		registerCache.removeFragmentTempUsage(temp);

		return code;
	}
}

export = EffectFresnelEnvMapMethod;