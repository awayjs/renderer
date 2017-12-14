import {_Render_RenderableBase} from "../base/_Render_RenderableBase";

/**
 * @interface away.sort.IEntitySorter
 */
export interface IEntitySorter
{
	sortBlendedRenderables(head:_Render_RenderableBase):_Render_RenderableBase;

	sortOpaqueRenderables(head:_Render_RenderableBase):_Render_RenderableBase;
}