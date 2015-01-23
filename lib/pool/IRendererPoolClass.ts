import RendererPoolBase				= require("awayjs-renderergl/lib/pool/RendererPoolBase");
import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");

/**
 * IRendererPoolClass is an interface for the constructable class definition IRenderable that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.IRendererPoolClass
 */
interface IRendererPoolClass
{
	/**
	 *
	 */
	new(renderer:RendererBase):RendererPoolBase;
}

export = IRendererPoolClass;