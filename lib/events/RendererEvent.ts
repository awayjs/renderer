import { EventBase } from '@awayjs/core';

/**
 * Events a CacheRenderer dispatches to its parent renderer when a change
 * would not already reach that parent through ContainerNode.invalidate().
 */
export class RendererEvent extends EventBase {
	/**
	 * The dispatcher's unclipped pad or image size changed (bitmap-mask
	 * updates, or a local-view size event) and the parent cache must re-union
	 * or recache.
	 */
	public static INVALIDATE_PADS: string = 'invalidatePads';

	constructor(type: string) {
		super(type);
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current object.
	 */
	public clone(): RendererEvent {
		return new RendererEvent(this.type);
	}
}
