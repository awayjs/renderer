import {EventBase} from "@awayjs/core";

import {IRenderable} from "../base/IRenderable";

/**
 * Dispatched to notify changes in a sub geometry object's state.
 *
 * @class away.events.RenderableEvent
 * @see away.core.base.Graphics
 */
export class RenderableEvent extends EventBase
{
	/**
	 * Dispatched when a Renderable has been updated.
	 */
	public static INVALIDATE_MATERIAL:string = "invalidateMaterial";

	/**
	 *
	 */
	public static INVALIDATE_ELEMENTS:string = "invalidateElements";

	private _renderable:IRenderable;

	/**
	 * Create a new GraphicsEvent
	 * @param type The event type.
	 * @param dataType An optional data type of the vertex data being updated.
	 */
	constructor(type:string, renderable:IRenderable)
	{
		super(type);

		this._renderable = renderable;
	}

	/**
	 * The renderobject owner of the renderable owner.
	 */
	public get renderable():IRenderable
	{
		return this._renderable;
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current object.
	 */
	public clone():RenderableEvent
	{
		return new RenderableEvent(this.type, this._renderable);
	}
}