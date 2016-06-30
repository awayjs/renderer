import {LightPickerBase}				from "@awayjs/display/lib/materials/lightpickers/LightPickerBase";

import {IPass}						from "../../surfaces/passes/IPass";
import {LightingShader}				from "../../shaders/LightingShader";
import {ShaderRegisterCache}			from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../../shaders/ShaderRegisterElement";

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