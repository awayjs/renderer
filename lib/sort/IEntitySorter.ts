import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");

/**
 * @interface away.sort.IEntitySorter
 */
interface IEntitySorter
{
	sortBlendedRenderables(head:RenderableBase):RenderableBase;

	sortOpaqueRenderables(head:RenderableBase):RenderableBase;
}

export = IEntitySorter;