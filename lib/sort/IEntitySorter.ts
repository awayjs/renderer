import {GL_RenderableBase} from "@awayjs/stage";

/**
 * @interface away.sort.IEntitySorter
 */
export interface IEntitySorter
{
	sortBlendedRenderables(head:GL_RenderableBase):GL_RenderableBase;

	sortOpaqueRenderables(head:GL_RenderableBase):GL_RenderableBase;
}