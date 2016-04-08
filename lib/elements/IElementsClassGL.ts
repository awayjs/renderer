import IRenderable					from "awayjs-display/lib/base/IRenderable";

import Stage						from "awayjs-stagegl/lib/base/Stage";

import RendererBase					from "awayjs-renderergl/lib/RendererBase";
import ElementsPool					from "awayjs-renderergl/lib/elements/ElementsPool";
import GL_ElementsBase				from "awayjs-renderergl/lib/elements/GL_ElementsBase";
import ShaderBase					from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterCache			from "awayjs-renderergl/lib/shaders/ShaderRegisterCache";
import ShaderRegisterData			from "awayjs-renderergl/lib/shaders/ShaderRegisterData";
import ElementsBase					from "awayjs-display/lib/graphics/ElementsBase";

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

export default IElementsClassGL;