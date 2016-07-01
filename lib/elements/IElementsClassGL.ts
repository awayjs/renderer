import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ElementsBase}					from "@awayjs/display/lib/graphics/ElementsBase";

/**
 * IElementsClassGL is an interface for the constructable class definition IRenderable that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.IElementsClassGL
 */
export interface IElementsClassGL
{
	/**
	 *
	 */
	new(elements:ElementsBase, stage:Stage):GL_ElementsBase;

	_iIncludeDependencies(shader:ShaderBase);

	_iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}