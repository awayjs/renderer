import GL_RenderableBase				= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");

/**
 * @interface away.sort.IEntitySorter
 */
interface IEntitySorter
{
	sortBlendedRenderables(head:GL_RenderableBase):GL_RenderableBase;

	sortOpaqueRenderables(head:GL_RenderableBase):GL_RenderableBase;
}

export = IEntitySorter;