import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");

/**
 * IRenderableClass is an interface for the constructable class definition IRenderable that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.IRenderableClass
 */
interface IRenderableClass
{
	vertexAttributesOffset:number;

	/**
	 *
	 */
	new(renderableOwner:IRenderableOwner, renderer:RendererBase):RenderableBase;

	_iIncludeDependencies(shader:ShaderBase);

	_iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}

export = IRenderableClass;