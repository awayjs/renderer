import AbstractMethodError				= require("awayjs-core/lib/errors/AbstractMethodError");

import ShaderLightingObject				= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import MaterialPassGLBase				= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
class LightingPassGLBase extends MaterialPassGLBase
{
	public _pNumPointLights:number = 0;
	public _pNumDirectionalLights:number = 0;
	public _pNumLightProbes:number = 0;

	private _directionalLightsOffset:number = 0;
	private _pointLightsOffset:number = 0;
	private _lightProbesOffset:number = 0;

	/**
	 * Indicates the offset in the light picker's directional light vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	public get directionalLightsOffset():number
	{
		return this._directionalLightsOffset;
	}

	public set directionalLightsOffset(value:number)
	{
		this._directionalLightsOffset = value;
	}

	/**
	 * Indicates the offset in the light picker's point light vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	public get pointLightsOffset():number
	{
		return this._pointLightsOffset;
	}

	public set pointLightsOffset(value:number)
	{
		this._pointLightsOffset = value;
	}

	/**
	 * Indicates the offset in the light picker's light probes vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	public get lightProbesOffset():number
	{
		return this._lightProbesOffset;
	}

	public set lightProbesOffset(value:number)
	{
		this._lightProbesOffset = value;
	}

	/**
	 * The amount of point lights that need to be supported.
	 */
	public get iNumPointLights():number
	{
		return this._pNumPointLights;
	}

	/**
	 * The amount of directional lights that need to be supported.
	 */
	public get iNumDirectionalLights():number
	{
		return this._pNumDirectionalLights;
	}

	/**
	 * The amount of light probes that need to be supported.
	 */
	public get iNumLightProbes():number
	{
		return this._pNumLightProbes;
	}

	/**
	 * 
	 */
	constructor()
	{
		super();
	}

	public _iUsesSpecular():boolean
	{
		throw new AbstractMethodError();
	}

	public _iUsesShadows():boolean
	{
		throw new AbstractMethodError();
	}


	public _iGetPreLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPreLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPerLightDiffuseFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPerLightSpecularFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPerProbeDiffuseFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPerProbeSpecularFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPostLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	public _iGetPostLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}
}

export = LightingPassGLBase;