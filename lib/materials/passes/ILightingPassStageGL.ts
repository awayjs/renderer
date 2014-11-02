import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");

import ShaderLightingObject			= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import IMaterialPassStageGL			= require("awayjs-renderergl/lib/materials/passes/IMaterialPassStageGL");


interface ILightingPassStageGL extends IMaterialPassStageGL
{
	/**
	 * The amount of point lights that need to be supported.
	 */
	iNumPointLights:number;

	/**
	 * The amount of directional lights that need to be supported.
	 */
	iNumDirectionalLights:number;

	/**
	 * The amount of light probes that need to be supported.
	 */
	iNumLightProbes:number;

	/**
	 * Indicates the offset in the light picker's directional light vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	directionalLightsOffset:number;

	/**
	 * Indicates the offset in the light picker's point light vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	pointLightsOffset:number;

	/**
	 * Indicates the offset in the light picker's light probes vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	lightProbesOffset:number;

	/**
	 * The light picker used by the material to provide lights to the material if it supports lighting.
	 *
	 * @see away.materials.LightPickerBase
	 * @see away.materials.StaticLightPicker
	 */
	lightPicker:LightPickerBase;

	_iUsesSpecular();

	_iUsesShadows();

	_iGetPerLightDiffuseFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerLightSpecularFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeDiffuseFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeSpecularFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
	_iGetPostLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}

export = ILightingPassStageGL;