import {RenderStateBase} from "../base/RenderStateBase";

import {IEntitySorter} from "./IEntitySorter";

/**
 * @class away.sort.NullSort
 */
export class RenderableNullSort implements IEntitySorter
{
	public sortBlendedRenderables(head:RenderStateBase):RenderStateBase
	{
		return head;
	}

	public sortOpaqueRenderables(head:RenderStateBase):RenderStateBase
	{
		return head;
	}
}