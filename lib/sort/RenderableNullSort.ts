import IEntitySorter				= require("awayjs-renderergl/lib/sort/IEntitySorter");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");

/**
 * @class away.sort.NullSort
 */
class RenderableNullSort implements IEntitySorter
{
	public sortBlendedRenderables(head:RenderableBase):RenderableBase
	{
		return head;
	}

	public sortOpaqueRenderables(head:RenderableBase):RenderableBase
	{
		return head;
	}
}

export = RenderableNullSort;