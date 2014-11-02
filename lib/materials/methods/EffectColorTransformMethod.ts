import ColorTransform				= require("awayjs-core/lib/geom/ColorTransform");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import EffectMethodBase				= require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");

/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
class EffectColorTransformMethod extends EffectMethodBase
{
	private _colorTransform:ColorTransform;

	/**
	 * Creates a new EffectColorTransformMethod.
	 */
	constructor()
	{
		super();
	}

	/**
	 * The ColorTransform object to transform the colour of the material with.
	 */
	public get colorTransform():ColorTransform
	{
		return this._colorTransform;
	}

	public set colorTransform(value:ColorTransform)
	{
		this._colorTransform = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var colorMultReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var colorOffsReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		methodVO.fragmentConstantsIndex = colorMultReg.index*4;

		//TODO: AGAL <> GLSL

		code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var inv:number = 1/0xff;
		var index:number = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;

		data[index] = this._colorTransform.redMultiplier;
		data[index + 1] = this._colorTransform.greenMultiplier;
		data[index + 2] = this._colorTransform.blueMultiplier;
		data[index + 3] = this._colorTransform.alphaMultiplier;
		data[index + 4] = this._colorTransform.redOffset*inv;
		data[index + 5] = this._colorTransform.greenOffset*inv;
		data[index + 6] = this._colorTransform.blueOffset*inv;
		data[index + 7] = this._colorTransform.alphaOffset*inv;

	}
}

export = EffectColorTransformMethod;