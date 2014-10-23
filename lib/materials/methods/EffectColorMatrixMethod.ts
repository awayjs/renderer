import Stage							= require("awayjs-stagegl/lib/base/Stage");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import EffectMethodBase					= require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");

/**
 * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
 */
class EffectColorMatrixMethod extends EffectMethodBase
{
	private _matrix:Array<number>;

	/**
	 * Creates a new EffectColorTransformMethod.
	 *
	 * @param matrix An array of 20 items for 4 x 5 color transform.
	 */
	constructor(matrix:Array<number>)
	{
		super();

		if (matrix.length != 20)
			throw new Error("Matrix length must be 20!");

		this._matrix = matrix;
	}

	/**
	 * The 4 x 5 matrix to transform the color of the material.
	 */
	public get colorMatrix():Array<number>
	{
		return this._matrix;
	}

	public set colorMatrix(value:Array<number>)
	{
		this._matrix = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var colorMultReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		registerCache.getFreeFragmentConstant();
		registerCache.getFreeFragmentConstant();
		registerCache.getFreeFragmentConstant();

		var colorOffsetReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = colorMultReg.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

		code += "m44 " + temp + ", " + targetReg + ", " + colorMultReg + "\n" +
				"add " + targetReg + ", " + temp + ", " + colorOffsetReg + "\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var matrix:Array<number> = this._matrix;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;

		// r
		data[index] = matrix[0];
		data[index + 1] = matrix[1];
		data[index + 2] = matrix[2];
		data[index + 3] = matrix[3];

		// g
		data[index + 4] = matrix[5];
		data[index + 5] = matrix[6];
		data[index + 6] = matrix[7];
		data[index + 7] = matrix[8];

		// b
		data[index + 8] = matrix[10];
		data[index + 9] = matrix[11];
		data[index + 10] = matrix[12];
		data[index + 11] = matrix[13];

		// a
		data[index + 12] = matrix[15];
		data[index + 13] = matrix[16];
		data[index + 14] = matrix[17];
		data[index + 15] = matrix[18];

		// rgba offset
		data[index + 16] = matrix[4];
		data[index + 17] = matrix[9];
		data[index + 18] = matrix[14];
		data[index + 19] = matrix[19];
	}
}

export = EffectColorMatrixMethod;