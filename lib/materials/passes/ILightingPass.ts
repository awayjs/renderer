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

	_iGetPerLightDiffuseFragmentCode(shader:LightingShader, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerLightSpecularFragmentCode(shader:LightingShader, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeDiffuseFragmentCode(shader:LightingShader, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeSpecularFragmentCode(shader:LightingShader, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingVertexCode(shader:LightingShader, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingFragmentCode(shader:LightingShader, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

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