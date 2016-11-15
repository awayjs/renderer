import {IRenderable}						from "@awayjs/graphics/lib/base/IRenderable";
import {IEntity}						from "@awayjs/graphics/lib/base/IEntity";

import {GL_RenderableBase}				from "../renderables/GL_RenderableBase";
import {RenderablePool}					from "../renderables/RenderablePool";
import {RendererBase}				from "../RendererBase";

/**
 * IMaterialClassGL is an interface for the constructable class definition GL_MaterialBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_MaterialBase
 */
export interface IRenderableClassGL
{
	/**
	 *
	 */
	new(renderable:IRenderable, entity:IEntity, renderer:RendererBase, pool:RenderablePool):GL_RenderableBase;
}