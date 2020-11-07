import { IRenderable } from '../base/IRenderable';

/**
 * @interface away.sort.IRenderEntitySorter
 */
export interface IRenderEntitySorter
{
	sortBlendedRenderables(head: IRenderable): IRenderable;

	sortOpaqueRenderables(head: IRenderable): IRenderable;
}