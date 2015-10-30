import IWrapperClass				= require("awayjs-core/lib/library/IWrapperClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ITextureVO					= require("awayjs-display/lib/pool/ITextureVO");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");

/**
 * ITextureVOClass is an interface for the constructable class definition ITextureVO that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.ITextureVOClass
 */
interface ITextureVOClass extends IWrapperClass
{
	/**
	 *
	 */
	new(pool:TextureVOPool, texture:TextureBase, shader:ShaderBase, stage:Stage):ITextureVO;
}

export = ITextureVOClass;