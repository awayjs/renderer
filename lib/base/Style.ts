import { Matrix, EventDispatcher, AssetEvent } from '@awayjs/core';

import { ImageBase, ImageSampler } from '@awayjs/stage';

import { StyleEvent } from '../events/StyleEvent';
import { ITexture } from '../base/ITexture';

/**
 *
 */
export class Style extends EventDispatcher {
	private _onClearImage: (event: AssetEvent) => void;
	private _sampler: ImageSampler;
	private _samplers: Object = new Object();
	private _image: ImageBase;
	private _images: Object = new Object();
	private _uvMatrix: Matrix;
	private _color: number = 0xFFFFFF;

	public get sampler(): ImageSampler {
		return this._sampler;
	}

	public set sampler(value: ImageSampler) {
		if (this._sampler == value)
			return;

		this._sampler = value;

		this._invalidateProperties();
	}

	public get image(): ImageBase {
		return this._image;
	}

	public set image(value: ImageBase) {
		if (this._image == value)
			return;

		if (this._image)
			this._image.removeEventListener(AssetEvent.CLEAR, this._onClearImage);

		this._image = value;

		if (this._image)
			this._image.addEventListener(AssetEvent.CLEAR, this._onClearImage);

		this._invalidateProperties();
	}

	public get uvMatrix(): Matrix {
		return this._uvMatrix;
	}

	public set uvMatrix(value: Matrix) {
		if (this._uvMatrix == value)
			return;

		this._uvMatrix = value;

		this._invalidateProperties();
	}

	/**
	 * The diffuse reflectivity color of the surface.
	 */
	public get color(): number {
		return this._color;
	}

	public set color(value: number) {
		if (this._color == value)
			return;

		this._color = value;

		this._invalidateProperties();
	}

	constructor() {
		super();

		this._onClearImage = (event: AssetEvent) => this._invalidateProperties();
	}

	public getImageAt(texture: ITexture, index: number = 0): ImageBase {
		return (this._images[texture.id] ? this._images[texture.id][index] : null) || this._image;
	}

	public getSamplerAt(texture: ITexture, index: number = 0): ImageSampler {
		return (this._samplers[texture.id] ? this._samplers[texture.id][index] : null) || this._sampler;
	}

	public addImageAt(image: ImageBase, texture: ITexture, index: number = 0): void {
		if (!this._images[texture.id])
			this._images[texture.id] = new Array<ImageBase>();

		this._images[texture.id][index] = image;

		image.addEventListener(AssetEvent.CLEAR, this._onClearImage);

		this._invalidateProperties();
	}

	public addSamplerAt(sampler: ImageSampler, texture: ITexture, index: number = 0): void {
		if (!this._samplers[texture.id])
			this._samplers[texture.id] = new Array<ImageSampler>();

		this._samplers[texture.id][index] = sampler;

		this._invalidateProperties();
	}

	public removeImageAt(texture: ITexture, index: number = 0): void {
		const image: ImageBase = this._images[texture.id]?.[index];

		if (!image)
			return;

		image.removeEventListener(AssetEvent.CLEAR, this._onClearImage);
		this._images[texture.id][index] = null;

		this._invalidateProperties();
	}

	public removeSamplerAt(texture: ITexture, index: number = 0): void {
		if (!this._samplers[texture.id])
			return;

		this._samplers[texture.id][index] = null;

		this._invalidateProperties();
	}

	private _invalidateProperties(): void {
		this.dispatchEvent(new StyleEvent(StyleEvent.INVALIDATE_PROPERTIES, this));
	}
}
