import { EventBase } from '@awayjs/core';

import { IMaterial } from '../base/IMaterial';

export class MaterialEvent extends EventBase {
	public static INVALIDATE_TEXTURES: string = 'invalidateTextures';

	public static INVALIDATE_PASSES: string = 'invalidatePasses';

	private _material: IMaterial;

	/**
	 * Create a new GraphicsEvent
	 * @param type The event type.
	 * @param dataType An optional data type of the vertex data being updated.
	 */
	constructor(type: string, material: IMaterial) {
		super(type);

		this._material = material;
	}

	/**
	 * The material of the renderable.
	 */
	public get material(): IMaterial {
		return this._material;
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current object.
	 */
	public clone(): MaterialEvent {
		return new MaterialEvent(this.type, this._material);
	}
}