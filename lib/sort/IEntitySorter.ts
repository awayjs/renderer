import GL_RenderableBase				from "awayjs-renderergl/lib/renderables/GL_RenderableBase";

/**
 * @interface away.sort.IEntitySorter
 */
interface IEntitySorter
{
	sortBlendedRenderables(head:GL_RenderableBase):GL_RenderableBase;

	sortOpaqueRenderables(head:GL_RenderableBase):GL_RenderableBase;
}

export default IEntitySorter;