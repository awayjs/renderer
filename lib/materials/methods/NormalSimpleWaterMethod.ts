import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import MethodVO							= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderObjectBase					= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import NormalBasicMethod				= require("awayjs-renderergl/lib/materials/methods/NormalBasicMethod");
import ShaderCompilerHelper				= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");

/**
 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
 */
class NormalSimpleWaterMethod extends NormalBasicMethod
{
	private _texture2:Texture2DBase;
	private _normalTextureRegister2:ShaderRegisterElement;
	private _useSecondNormalMap:boolean = false;
	private _water1OffsetX:number = 0;
	private _water1OffsetY:number = 0;
	private _water2OffsetX:number = 0;
	private _water2OffsetY:number = 0;

	/**
	 * Creates a new NormalSimpleWaterMethod object.
	 * @param waveMap1 A normal map containing one layer of a wave structure.
	 * @param waveMap2 A normal map containing a second layer of a wave structure.
	 */
	constructor(waveMap1:Texture2DBase, waveMap2:Texture2DBase)
	{
		super();
		this.normalMap = waveMap1;
		this.secondaryNormalMap = waveMap2;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = .5;
		data[index + 1] = 0;
		data[index + 2] = 0;
		data[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		super.iInitVO(shaderObject, methodVO);

		this._useSecondNormalMap = this.normalMap != this.secondaryNormalMap;
	}

	/**
	 * The translation of the first wave layer along the X-axis.
	 */
	public get water1OffsetX():number
	{
		return this._water1OffsetX;
	}

	public set water1OffsetX(value:number)
	{
		this._water1OffsetX = value;
	}

	/**
	 * The translation of the first wave layer along the Y-axis.
	 */
	public get water1OffsetY():number
	{
		return this._water1OffsetY;
	}

	public set water1OffsetY(value:number)
	{
		this._water1OffsetY = value;
	}

	/**
	 * The translation of the second wave layer along the X-axis.
	 */
	public get water2OffsetX():number
	{
		return this._water2OffsetX;
	}

	public set water2OffsetX(value:number)
	{
		this._water2OffsetX = value;
	}

	/**
	 * The translation of the second wave layer along the Y-axis.
	 */
	public get water2OffsetY():number
	{
		return this._water2OffsetY;
	}

	public set water2OffsetY(value:number)
	{
		this._water2OffsetY = value;
	}

	/**
	 * A second normal map that will be combined with the first to create a wave-like animation pattern.
	 */
	public get secondaryNormalMap():Texture2DBase
	{
		return this._texture2;
	}

	public set secondaryNormalMap(value:Texture2DBase)
	{
		this._texture2 = value;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._normalTextureRegister2 = null;
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		super.dispose();
		this._texture2 = null;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		var data:Array<number> = shaderObject.fragmentConstantData;
		var index:number = methodVO.fragmentConstantsIndex;

		data[index + 4] = this._water1OffsetX;
		data[index + 5] = this._water1OffsetY;
		data[index + 6] = this._water2OffsetX;
		data[index + 7] = this._water2OffsetY;

		//if (this._useSecondNormalMap >= 0)
		if (this._useSecondNormalMap)
			stage.activateTexture(methodVO.texturesIndex + 1, this._texture2);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		this._pNormalTextureRegister = registerCache.getFreeTextureReg();
		this._normalTextureRegister2 = this._useSecondNormalMap? registerCache.getFreeTextureReg():this._pNormalTextureRegister;
		methodVO.texturesIndex = this._pNormalTextureRegister.index;

		methodVO.fragmentConstantsIndex = dataReg.index*4;

		return "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n" +
			ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) +
			"add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n" +
			ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._normalTextureRegister2, this._texture2, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) +
			"add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
			"mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
			"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" +
			"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
	}
}

export = NormalSimpleWaterMethod;