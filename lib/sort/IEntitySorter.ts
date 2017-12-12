import {RenderStateBase} from "../base/RenderStateBase";

/**
 * @interface away.sort.IEntitySorter
 */
export interface IEntitySorter
{
	sortBlendedRenderables(head:RenderStateBase):RenderStateBase;

	sortOpaqueRenderables(head:RenderStateBase):RenderStateBase;
}