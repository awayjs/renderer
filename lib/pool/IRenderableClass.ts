import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import IRenderable					= require("awayjs-display/lib/pool/IRenderable");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");

/**
 * IRenderableClass is an interface for the constructable class definition IRenderable that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.IRenderableClass
 */
interface IRenderableClass
{
	/**
	 *
	 */
	id:string;

	vertexAttributesOffset:number;

	/**
	 *
	 */
	new(pool:RenderablePoolBase, renderableOwner:IRenderableOwner, stage:Stage):IRenderable;

	_iIncludeDependencies(shaderObject:ShaderObjectBase);

	_iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;
}

export = IRenderableClass;