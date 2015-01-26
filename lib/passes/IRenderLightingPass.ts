import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");


import ShaderLightingObject			= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import IRenderPassBase				= require("awayjs-renderergl/lib/passes/IRenderPassBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 *
 * @class away.pool.ScreenPasses
 */
interface IRenderLightingPass extends IRenderPassBase
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

	_iGetPerLightDiffuseFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerLightSpecularFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeDiffuseFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeSpecularFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * Indicates whether the shader uses any shadows.
	 */
	_iUsesShadows(shaderObject:ShaderLightingObject):boolean;

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	_iUsesSpecular(shaderObject:ShaderLightingObject):boolean;

	/**
	 * Indicates whether the shader uses any diffuse component.
	 */
	_iUsesDiffuse(shaderObject:ShaderLightingObject):boolean;
}

export = IRenderLightingPass;