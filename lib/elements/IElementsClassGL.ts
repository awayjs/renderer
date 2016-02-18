import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ElementsPool					= require("awayjs-renderergl/lib/elements/ElementsPool");
import GL_ElementsBase				= require("awayjs-renderergl/lib/elements/GL_ElementsBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");

/**
 * IElementsClassGL is an interface for the constructable class definition IRenderable that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.IElementsClassGL
 */
interface IElementsClassGL
{
	vertexAttributesOffset:number;

	/**
	 *
	 */
	new(elements:ElementsBase, shader:ShaderBase, pool:ElementsPool):GL_ElementsBase;

	_iIncludeDependencies(shader:ShaderBase);

	_iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}

export = IElementsClassGL;