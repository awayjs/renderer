import IEntitySorter				from "awayjs-renderergl/lib/sort/IEntitySorter";

import GL_RenderableBase			from "awayjs-renderergl/lib/renderables/GL_RenderableBase";

/**
 * @class away.sort.NullSort
 */
class RenderableNullSort implements IEntitySorter
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

export default RenderableNullSort;