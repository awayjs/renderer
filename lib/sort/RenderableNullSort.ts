import {_Render_RenderableBase} from "../base/_Render_RenderableBase";

import {IEntitySorter} from "./IEntitySorter";

/**
 * @class away.sort.NullSort
 */
export class RenderableNullSort implements IEntitySorter
{
	public sortBlendedRenderables(head:_Render_RenderableBase):_Render_RenderableBase
	{
		return head;
	}

	public sortOpaqueRenderables(head:_Render_RenderableBase):_Render_RenderableBase
	{
		return head;
	}
}