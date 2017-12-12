import {EventBase} from "@awayjs/core";

import {AttributesView} from "@awayjs/stage";

/**
 * Dispatched to notify changes in a sub geometry object's state.
 *
 * @class away.events.ElementsEvent
 * @see away.core.base.Graphics
 */
export class ElementsEvent extends EventBase
{
	/**
	 * Dispatched when a Elements's index data has been updated.
	 */
	public static INVALIDATE_INDICES:string = "invalidateIndices";

	/**
	 * Dispatched when a Elements's index data has been disposed.
	 */
	public static CLEAR_INDICES:string = "clearIndices";
	
	/**
	 * Dispatched when a Elements's vertex data has been updated.
	 */
	public static INVALIDATE_VERTICES:string = "invalidateVertices";

	/**
	 * Dispatched when a Elements's vertex data has been disposed.
	 */
	public static CLEAR_VERTICES:string = "clearVertices";

	
	private _attributesView:AttributesView;

	/**
	 * Create a new GraphicsEvent
	 * @param type The event type.
	 * @param attributesView An optional data type of the vertex data being updated.
	 */
	constructor(type:string, attributesView:AttributesView)
	{
		super(type);

		this._attributesView = attributesView;
	}

	/**
	 * The attributes view of the vertex data.
	 */
	public get attributesView():AttributesView
	{
		return this._attributesView;
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current object.
	 */
	public clone():ElementsEvent
	{
		return new ElementsEvent(this.type, this._attributesView);
	}
}