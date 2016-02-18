import IEventDispatcher				= require("awayjs-core/lib/events/IEventDispatcher");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");

import Camera						= require("awayjs-display/lib/entities/Camera");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import IElementsClassGL				= require("awayjs-renderergl/lib/elements/IElementsClassGL");
import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");

/**
 *
 * @class away.pool.Passes
 */
interface IPass extends IEventDispatcher
{
	shader:ShaderBase;

	animationSet:AnimationSetBase;
	
	_iIncludeDependencies(shader:ShaderBase);

	_iInitConstantData(shader:ShaderBase);

	_iGetPreLightingVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPreLightingFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetNormalVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetNormalFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;


	_iActivate(camera:Camera);

	_iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)

	_iDeactivate();

	invalidate();

	dispose();

	getImageIndex(texture:TextureBase, index?:number):number;
}

export = IPass;