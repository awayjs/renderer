import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import SpecularBasicMethod				= require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");

import SpecularCompositeMethod			= require("awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod");

/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
class SpecularCelMethod extends SpecularCompositeMethod
{
	private _dataReg:ShaderRegisterElement;
	private _smoothness:number = .1;
	private _specularCutOff:number = .1;

	/**
	 * Creates a new SpecularCelMethod object.
	 * @param specularCutOff The threshold at which the specular highlight should be shown.
	 * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
	 */
	constructor(specularCutOff:number = .5, baseMethod:SpecularBasicMethod = null)
	{
		super(null, baseMethod);

		this.baseMethod._iModulateMethod = (shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

		this._specularCutOff = specularCutOff;
	}

	/**
	 * The smoothness of the highlight edge.
	 */
	public get smoothness():number
	{
		return this._smoothness;
	}

	public set smoothness(value:number)
	{
		this._smoothness = value;
	}

	/**
	 * The threshold at which the specular highlight should be shown.
	 */
	public get specularCutOff():number
	{
		return this._specularCutOff;
	}

	public set specularCutOff(value:number)
	{
		this._specularCutOff = value;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		super.iActivate(shaderObject, methodVO, stage);

		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = this._smoothness;
		data[index + 1] = this._specularCutOff;
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
	 * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
	 * @param vo The MethodVO used to compile the current shader.
	 * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
	 * @param regCache The register cache used for the shader compilation.
	 * @param sharedRegisters The shared register data for this shader.
	 * @return The AGAL fragment code for the method.
	 */
	private clampSpecular(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" + // x - cutoff
			"div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" + // (x - cutoff)/epsilon
			"sat " + targetReg + ".y, " + targetReg + ".y\n" +
			"sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" +
			"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._dataReg = registerCache.getFreeFragmentConstant();
		methodVO.secondaryFragmentConstantsIndex = this._dataReg.index*4;

		return super.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
	}
}

export = SpecularCelMethod;