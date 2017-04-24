import {ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, IPass} from "@awayjs/stage";

import {LightPickerBase} from "@awayjs/scene";

import {LightingShader} from "../../shaders/LightingShader";

/**
 *
 * @class away.pool.Passes
 */
export interface ILightingPass extends IPass
{
	enableLightFallOff:boolean;

	diffuseLightSources:number;

	specularLightSources:number;

	numDirectionalLights:number;

	numPointLights:number;

	numLightProbes:number;

	pointLightsOffset:number;

	directionalLightsOffset:number;

	lightProbesOffset:number;

	lightPicker:LightPickerBase;

	_getPreLightingVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getPreLightingFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getPerLightDiffuseFragmentCode(lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getPerLightSpecularFragmentCode(lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getPerProbeDiffuseFragmentCode(texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getPerProbeSpecularFragmentCode(texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * Indicates whether the shader uses any shadows.
	 */
	_iUsesShadows(shader:LightingShader):boolean;

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	_iUsesSpecular(shader:LightingShader):boolean;

	/**
	 * Indicates whether the shader uses any diffuse component.
	 */
	_iUsesDiffuse(shader:LightingShader):boolean;
}