import { ImageSampler, ImageCube } from '@awayjs/stage';

import { TextureCube } from './TextureCube';

export class ImageTextureCube extends TextureCube {
	public static assetType: string = '[texture ImageTextureCube]';

	/**
	 *
	 * @returns {string}
	 */
	public get assetType(): string {
		return ImageTextureCube.assetType;
	}

	/**
	 *
	 * @returns {ImageCube}
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
	 * @returns {ImageCube}
	 */
	public get image(): ImageCube {
		return <ImageCube> this._images[0];
	}

	public set image(value: ImageCube) {
		if (this._images[0] == value)
			return;

		this.setImageAt(value, 0);
	}

	constructor(image: ImageCube = null) {
		super();

		this.setNumImages(1);

		this.image = image;
	}
}

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, _Stage_ImageBase } from '@awayjs/stage';
import { _Shader_TextureBase } from '../base/_Shader_TextureBase';
import { _Render_RenderableBase } from '../base/_Render_RenderableBase';
import { ShaderBase } from '../base/ShaderBase';

/**
 *
 * @class away.pool.GL_SingleImageTexture
 */
export class _Shader_ImageTexture extends _Shader_TextureBase {
	protected _textureIndex: number;
	protected _imageIndex: number;
	protected _samplerIndex: number;

	/**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The uv coordinate vector with which to sample the texture map.
     * @returns {string}
     * @private
     */
	public _getFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement): string {
		const wrap: string = 'wrap';
		const format: string = '';
		const filter: string = 'linear,miplinear';

		this._imageIndex = this._shader.renderMaterial.getImageIndex(this._texture, 0);

		const textureReg: ShaderRegisterElement = this.getTextureReg(this._imageIndex, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		return 'tex ' + targetReg + ', ' + inputReg + ', ' + textureReg + ' <' + this._shader.renderMaterial.images[this._imageIndex].getType() + ',' + filter + ',' + format + wrap + '>\n';
	}

	public activate(): void {
		const sampler: ImageSampler = <ImageSampler> this._shader.renderMaterial.samplers[this._imageIndex];
		const stageImage: _Stage_ImageBase = <_Stage_ImageBase> this._shader.renderMaterial.images[this._imageIndex];

		stageImage.activate(this._textureIndex, sampler);
	}

	public _setRenderState(renderState: _Render_RenderableBase): void {
		const sampler: ImageSampler = renderState.samplers[this._imageIndex];
		const stageImage: _Stage_ImageBase = <_Stage_ImageBase> renderState.images[this._imageIndex];

		if (stageImage && sampler)
			stageImage.activate(this._textureIndex, sampler);
	}
}

ShaderBase.registerAbstraction(_Shader_ImageTexture, ImageTextureCube);