import { IRenderEntitySorter } from './IRenderEntitySorter';
import { _Render_RenderableBase } from '../base/_Render_RenderableBase';

/**
 * @class away.sort.NullSort
 */
export class RenderableNullSort implements IRenderEntitySorter {
	public sortBlendedRenderables(head: _Render_RenderableBase): _Render_RenderableBase {
		return head;
	}

	public sortOpaqueRenderables(head: _Render_RenderableBase): _Render_RenderableBase {
		return head;
	}
}