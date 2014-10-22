import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import EffectMethodBase					= require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");

/**
 * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
 */
class EffectRimLightMethod extends EffectMethodBase
{
	public static ADD:string = "add";
	public static MULTIPLY:string = "multiply";
	public static MIX:string = "mix";

	private _color:number /*uint*/;
	private _blendMode:string;
	private _colorR:number;
	private _colorG:number;
	private _colorB:number;
	private _strength:number;
	private _power:number;

	/**
	 * Creates a new <code>EffectRimLightMethod</code> object.
	 *
	 * @param color The colour of the rim light.
	 * @param strength The strength of the rim light.
	 * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
	 * @param blend The blend mode with which to add the light to the object.
	 */
	constructor(color:number /*uint*/ = 0xffffff, strength:number = .4, power:number = 2, blend:string = "mix")
	{
		super();

		this._blendMode = blend;
		this._strength = strength;
		this._power = power;

		this.color = color;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
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
	 * The blend mode with which to add the light to the object.
	 *
	 * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
	 * EffectRimLightMethod.ADD adds the rim light with the material's colour.
	 * EffectRimLightMethod.MIX provides normal alpha blending.
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	public set blendMode(value:string)
	{
		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.iInvalidateShaderProgram();
	}

	/**
	 * The color of the rim light.
	 */
	public get color():number /*uint*/
	{
		return this._color;
	}

	public set color(value:number /*uint*/)
	{
		this._color = value;
		this._colorR = ((value >> 16) & 0xff)/0xff;
		this._colorG = ((value >> 8) & 0xff)/0xff;
		this._colorB = (value & 0xff)/0xff;
	}

	/**
	 * The strength of the rim light.
	 */
	public get strength():number
	{
		return this._strength;
	}

	public set strength(value:number)
	{
		this._strength = value;
	}

	/**
	 * The power of the rim light. Higher values will result in a higher edge fall-off.
	 */
	public get power():number
	{
		return this._power;
	}

	public set power(value:number)
	{
		this._power = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = this._colorR;
		data[index + 1] = this._colorG;
		data[index + 2] = this._colorB;
		data[index + 4] = this._strength;
		data[index + 5] = this._power;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var dataRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataRegister2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		var code:string = "";

		methodVO.fragmentConstantsIndex = dataRegister.index*4;

		code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
			"sat " + temp + ".x, " + temp + ".x\n" +
			"sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" +
			"pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" +
			"mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" +
			"sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" +
			"mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" +
			"sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";

		if (this._blendMode == EffectRimLightMethod.ADD) {
			code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
		} else if (this._blendMode == EffectRimLightMethod.MULTIPLY) {
			code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" +
				"mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
		} else {
			code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" +
				"mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
		}

		return code;
	}
}

export = EffectRimLightMethod;