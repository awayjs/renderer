import { AssetBase } from '@awayjs/core';

import { ImageBase, ImageSampler } from '@awayjs/stage';
import { ITexture } from '../base/ITexture';
import { MappingMode } from '../base/MappingMode';

// import { MethodEvent } from '../events/MethodEvent';

/**
 *
 */
export class TextureBase extends AssetBase implements ITexture {
	public _numImages: number = 0;
	public _images: Array<ImageBase> = new Array<ImageBase>();
	public _samplers: Array<ImageSampler> = new Array<ImageSampler>();

	protected _mappingMode: MappingMode;

	public get mappingMode(): MappingMode {
		return this._mappingMode;
	}

	public set mappingMode(value: MappingMode) {
		if (this._mappingMode == value)
			return;

		this._mappingMode = value;
	}

	/**
	 *
	 */
	constructor() {
		super();
	}

	public getNumImages(): number {
		return this._numImages;
	}

	protected setNumImages(value: number): void {
		if (this._numImages == value)
			return;

		this._numImages = value;

		this._images.length = value;
		this._samplers.length = value;

		this.invalidate();
	}

	public getImageAt(index: number): ImageBase {
		return this._images[index];
	}

	protected setImageAt(image: ImageBase, index: number): void {
		this._images[index] = image;

		this.invalidate();
	}

	public getSamplerAt(index: number): ImageSampler {
		return this._samplers[index];
	}

	protected setSamplerAt(sampler: ImageSampler, index: number): void {
		this._samplers[index] = sampler;

		this.invalidate();
	}

	// /**
    //  * Marks the shader program as invalid, so it will be recompiled before the next render.
    //  *
    //  * @internal
    //  */
	// public invalidateShaderProgram(): void {
	// 	this.invalidate();

	// 	this.dispatchEvent(new MethodEvent(MethodEvent.SHADER_INVALIDATED));
	// }
}