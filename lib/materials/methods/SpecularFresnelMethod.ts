import Camera							= require("awayjs-display/lib/entities/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import SpecularBasicMethod				= require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");

import SpecularCompositeMethod			= require("awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod");

/**
 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
 */
class SpecularFresnelMethod extends SpecularCompositeMethod
{
	private _dataReg:ShaderRegisterElement;
	private _incidentLight:boolean;
	private _fresnelPower:number = 5;
	private _normalReflectance:number = .028; // default value for skin

	/**
	 * Creates a new SpecularFresnelMethod object.
	 * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	 * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
	 */
	constructor(basedOnSurface:boolean = true, baseMethod:SpecularBasicMethod = null)
	{
		// may want to offer diff speculars
		super(null, baseMethod);

		this.baseMethod._iModulateMethod = (shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

		this._incidentLight = !basedOnSurface;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{

		var index:number = methodVO.secondaryFragmentConstantsIndex;
		shaderObject.fragmentConstantData[index + 2] = 1;
		shaderObject.fragmentConstantData[index + 3] = 0;
	}

	/**
	 * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	 */
	public get basedOnSurface():boolean
	{
		return !this._incidentLight;
	}

	public set basedOnSurface(value:boolean)
	{
		if (this._incidentLight != value)
			return;

		this._incidentLight = !value;

		this.iInvalidateShaderProgram();
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
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._dataReg = null;
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
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		var fragmentData:Array<number> = shaderObject.fragmentConstantData;

		var index:number = methodVO.secondaryFragmentConstantsIndex;
		fragmentData[index] = this._normalReflectance;
		fragmentData[index + 1] = this._fresnelPower;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._dataReg = registerCache.getFreeFragmentConstant();

		console.log('SpecularFresnelMethod', 'iGetFragmentPreLightingCode', this._dataReg);

		methodVO.secondaryFragmentConstantsIndex = this._dataReg.index*4;

		return super.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * Applies the fresnel effect to the specular strength.
	 *
	 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
	 * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
	 * @param regCache The register cache used for the shader compilation.
	 * @param sharedRegisters The shared registers created by the compiler.
	 * @return The AGAL fragment code for the method.
	 */
	private modulateSpecular(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;

		code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight? targetReg : sharedRegisters.normalFragment) + ".xyz\n" +   // dot(V, H)
			"sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" +             // base = 1-dot(V, H)
			"pow " + targetReg + ".x, " + targetReg + ".y, " + this._dataReg + ".y\n" +             // exp = pow(base, 5)
			"sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" +             // 1 - exp
			"mul " + targetReg + ".y, " + this._dataReg + ".x, " + targetReg + ".y\n" +             // f0*(1 - exp)
			"add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" +          // exp + f0*(1 - exp)
			"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";


		console.log('SpecularFresnelMethod', 'modulateSpecular', code);

		return code;
	}

}

export = SpecularFresnelMethod;