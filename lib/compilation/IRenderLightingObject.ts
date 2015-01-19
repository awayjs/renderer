import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import IRenderObjectBase			= require("awayjs-renderergl/lib/compilation/IRenderObjectBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import ShaderLightingObject			= require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 *
 * @class away.pool.ScreenPasses
 */
interface IRenderLightingObject extends IRenderObjectBase
{
	enableLightFallOff:boolean;

	diffuseLightSources:number;

	specularLightSources:number;

	_iGetPerLightDiffuseFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerLightSpecularFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeDiffuseFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPerProbeSpecularFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPostLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	/**
	 * Indicates whether the shader uses any shadows.
	 */
	_iUsesShadows():boolean;

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	_iUsesSpecular():boolean;
}

export = IRenderLightingObject;