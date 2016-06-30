import {IEntitySorter}				from "../sort/IEntitySorter";

import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";

/**
 * @class away.sort.NullSort
 */
export class RenderableNullSort implements IEntitySorter
{
	public sortBlendedRenderables(head:GL_RenderableBase):GL_RenderableBase
	{
		return head;
	}

	public sortOpaqueRenderables(head:GL_RenderableBase):GL_RenderableBase
	{
		return head;
	}
}