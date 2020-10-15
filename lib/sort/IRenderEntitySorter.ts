import { _Render_RenderableBase } from '../base/_Render_RenderableBase';
import { IRenderable } from '../base/IRenderable';

/**
 * @interface away.sort.IRenderEntitySorter
 */
export interface IRenderEntitySorter
{
	sortBlendedRenderables(head: IRenderable): IRenderable;

	sortOpaqueRenderables(head: IRenderable): IRenderable;
}