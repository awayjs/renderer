import IWrapperClass				= require("awayjs-core/lib/library/IWrapperClass");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import IRenderable					= require("awayjs-display/lib/pool/IRenderable");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");

/**
 * IRenderableClass is an interface for the constructable class definition IRenderable that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.IRenderableClass
 */
interface IRenderableClass extends IWrapperClass
{
	vertexAttributesOffset:number;

	/**
	 *
	 */
	new(pool:RenderablePool, renderableOwner:IRenderableOwner, stage:Stage):IRenderable;

	_iIncludeDependencies(shader:ShaderBase);

	_iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}

export = IRenderableClass;