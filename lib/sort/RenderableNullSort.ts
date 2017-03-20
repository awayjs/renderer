import {GL_RenderableBase} from "@awayjs/stage";

import {IEntitySorter} from "./IEntitySorter";

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