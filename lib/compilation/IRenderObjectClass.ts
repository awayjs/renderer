import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 * IRenderObjectClass is an interface for the constructable class definition RenderObjectBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.RenderObjectBase
 */
interface IRenderObjectClass
{
	/**
	 *
	 */
	new(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage):RenderObjectBase;
}

export = IRenderObjectClass;