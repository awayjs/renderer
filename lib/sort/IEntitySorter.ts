import GL_RenderableBase				from "../renderables/GL_RenderableBase";

/**
 * @interface away.sort.IEntitySorter
 */
interface IEntitySorter
{
	sortBlendedRenderables(head:GL_RenderableBase):GL_RenderableBase;

	sortOpaqueRenderables(head:GL_RenderableBase):GL_RenderableBase;
}

export default IEntitySorter;