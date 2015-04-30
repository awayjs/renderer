import IWrapperClass				= require("awayjs-core/lib/library/IWrapperClass");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ITextureObject				= require("awayjs-display/lib/pool/ITextureObject");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import TextureObjectPool			= require("awayjs-renderergl/lib/pool/TextureObjectPool");

/**
 * ITextureObjectClass is an interface for the constructable class definition ITextureObject that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.ITextureObjectClass
 */
interface ITextureObjectClass extends IWrapperClass
{
	/**
	 *
	 */
	new(pool:TextureObjectPool, texture:TextureBase, stage:Stage):ITextureObject;
}

export = ITextureObjectClass;