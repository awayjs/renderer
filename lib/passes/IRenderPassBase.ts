import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");

/**
 *
 * @class away.pool.ScreenPasses
 */
interface IRenderPassBase
{
	animationSet:AnimationSetBase;
	
	_iIncludeDependencies(shaderObject:ShaderObjectBase);

	_iInitConstantData(shaderObject:ShaderObjectBase);

	_iGetPreLightingVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPreLightingFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetNormalVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetNormalFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_pOutputsNormals(shaderObject:ShaderObjectBase):boolean;

	_pOutputsTangentNormals(shaderObject:ShaderObjectBase):boolean;

	_pUsesTangentSpace(shaderObject:ShaderObjectBase):boolean;
}

export = IRenderPassBase;