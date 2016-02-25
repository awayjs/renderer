import ISurface						= require("awayjs-display/lib/base/ISurface");

import IElementsClassGL				= require("awayjs-renderergl/lib/elements/IElementsClassGL");
import GL_SurfaceBase				= require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
import SurfacePool					= require("awayjs-renderergl/lib/surfaces/SurfacePool");

/**
 * ISurfaceClassGL is an interface for the constructable class definition GL_SurfaceBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_SurfaceBase
 */
interface ISurfaceClassGL
{
	/**
	 *
	 */
	new(surface:ISurface, elementsClass:IElementsClassGL, pool:SurfacePool):GL_SurfaceBase;
}

export = ISurfaceClassGL;