import { IRenderEntitySorter } from './IRenderEntitySorter';
import { IRenderable } from '../base/IRenderable';

/**
 * @class away.sort.NullSort
 */
export class RenderableNullSort implements IRenderEntitySorter {
	public sortBlendedRenderables(head: IRenderable): IRenderable {
		return head;
	}

	public sortOpaqueRenderables(head: IRenderable): IRenderable {
		return head;
	}
}