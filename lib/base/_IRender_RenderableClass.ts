import { _Render_RenderableBase } from './_Render_RenderableBase';

/**
 * IMaterialClassGL is an interface for the constructable class definition GL_MaterialBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_MaterialBase
 */
export interface _IRender_RenderableClass
{
	/**
	 *
	 */
	new(): _Render_RenderableBase;
}