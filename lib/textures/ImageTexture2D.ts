import { ErrorBase } from '@awayjs/core';

import { ImageSampler, Image2D, ImageUtils } from '@awayjs/stage';

import { Texture2D } from './Texture2D';

export class ImageTexture2D extends Texture2D {
	public static assetType: string = '[texture ImageTexture2D]';

	/**
	 *
	 * @returns {string}
	 */
	public get assetType(): string {
		return ImageTexture2D.assetType;
	}

	/**
	 *
	 * @returns {ImageBase}
	 */
	public get sampler(): ImageSampler {
		return <ImageSampler> this._samplers[0];
	}

	public set sampler(value: ImageSampler) {
		if (this._samplers[0] == value)
			return;

		this.setSamplerAt(value, 0);
	}

	/**
	 *
	 * @returns {ImageBase}
	 */
	public get image(): Image2D {
		return <Image2D> this._images[0];
	}

	public set image(value: Image2D) {
		if (this._images[0] == value)
			return;

		if (!ImageUtils.isImage2DValid(value))
			throw new ErrorBase('Invalid imageData: Width and height must be power of 2 and cannot exceed 2048');

		this.setImageAt(value, 0);
	}

	constructor(image: Image2D = null, mappingMode: MappingMode = null) {
		super(mappingMode);

		this.setNumImages(1);

		this.image = image;
	}
}

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { _Shader_ImageTexture } from './ImageTextureCube';
import { MappingMode } from '../base/MappingMode';
import { _Render_RenderableBase } from '../base/_Render_RenderableBase';
import { ShaderBase } from '../base/ShaderBase';

/**
 *
 * @class away.pool.GL_SingleImageTexture
 */
export class _Shader_ImageTexture2D extends _Shader_ImageTexture {
	/**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The uv coordinate vector with which to sample the texture map.
     * @returns {string}
     * @private
     */
	public _getFragmentCode(
		targetReg: ShaderRegisterElement,
		regCache: ShaderRegisterCache,
		sharedReg: ShaderRegisterData,
		inputReg: ShaderRegisterElement
	): string {
		let code: string = '';

		let temp: ShaderRegisterElement;

		//modify depending on mapping mode
		if ((<Texture2D> this._texture).mappingMode == MappingMode.RADIAL) {
			temp = regCache.getFreeFragmentVectorTemp();
			code += 'mul ' + temp + '.xy, ' + inputReg + ', ' + inputReg + '\n';
			code += 'add ' + temp + '.x, ' + temp + '.x, ' + temp + '.y\n';
			code += 'sub ' + temp + '.y, ' + temp + '.y, ' + temp + '.y\n';
			code += 'sqt ' + temp + '.x, ' + temp + '.x, ' + temp + '.x\n';
			inputReg = temp;
		}

		//handles texture atlasing
		if (this._shader.useImageRect) {
			const samplerReg: ShaderRegisterElement = regCache.getFreeFragmentConstant();
			this._samplerIndex = samplerReg.index * 4;
			temp = regCache.getFreeFragmentVectorTemp();

			code += 'mul ' + temp + ', ' + inputReg + ', ' + samplerReg + '.xy\n';
			code += 'add ' + temp + ', ' + temp + ', ' + samplerReg + '.zw\n';
			inputReg = temp;
		}

		code += super._getFragmentCode(targetReg, regCache, sharedReg, inputReg);

		//un-premultiply alpha if is is required
		if (this._shader.usesPremultipliedAlpha) {
			const tmp = regCache.getFreeFragmentSingleTemp();

			code += 'sge ' + tmp +  ' #native vec4(0.0) native#, ' +  targetReg + '.w  \n';
			code += 'add ' + tmp + ', ' + tmp + ',' + targetReg + '.w \n';
			code += 'div ' + targetReg + '.xyz, ' + targetReg + ', ' + tmp + '\n';
		}

		return code;
	}

	public activate(): void {
		super.activate();

		const sampler: ImageSampler = <ImageSampler> this._shader.renderMaterial.samplers[this._imageIndex];

		if (this._shader.useImageRect) {
			const index: number = this._samplerIndex;
			const data: Float32Array = this._shader.fragmentConstantData;
			if (!sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				data[index] = sampler.imageRect.width;
				data[index + 1] = sampler.imageRect.height;
				data[index + 2] = sampler.imageRect.x;
				data[index + 3] = sampler.imageRect.y;

			}
		}
	}

	public _setRenderState(renderState: _Render_RenderableBase): void {
		super._setRenderState(renderState);

		const sampler: ImageSampler = renderState.samplers[this._imageIndex];

		if (this._shader.useImageRect && sampler) {
			const index: number = this._samplerIndex;
			const data: Float32Array = this._shader.fragmentConstantData;
			if (!sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				data[index] = sampler.imageRect.width;
				data[index + 1] = sampler.imageRect.height;
				data[index + 2] = sampler.imageRect.x;
				data[index + 3] = sampler.imageRect.y;

			}
		}
	}
}

ShaderBase.registerAbstraction(_Shader_ImageTexture2D, ImageTexture2D);