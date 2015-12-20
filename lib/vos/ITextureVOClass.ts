import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");

/**
 * ITextureVOClass is an interface for the constructable class definition ITextureVO that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.ITextureVOClass
 */
interface ITextureVOClass
{
	/**
	 *
	 */
	new(texture:TextureBase, shader:ShaderBase):TextureVOBase;
}

export = ITextureVOClass;