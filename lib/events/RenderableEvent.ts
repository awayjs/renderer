import {EventBase, IAsset} from "@awayjs/core";

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

	/**
	 *
	 */
	public static INVALIDATE_STYLE:string = "invalidateStyle";

	private _renderable:IAsset;

	/**
	 * Create a new GraphicsEvent
	 * @param type The event type.
	 * @param dataType An optional data type of the vertex data being updated.
	 */
	constructor(type:string, renderable:IAsset)
	{
		super(type);

		this._renderable = renderable;
	}

	/**
	 * The renderobject owner of the renderable owner.
	 */
	public get renderable():IAsset
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