import {
	AbstractMethodError,
	Matrix,
	AbstractionBase,
} from '@awayjs/core';

import {
	Stage,
	_Stage_ImageBase,
	ImageSampler,
} from '@awayjs/stage';

import { MaterialUtils } from '../utils/MaterialUtils';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';
import { IPass } from './IPass';
import { IMaterial } from './IMaterial';
import { RenderEntity } from './RenderEntity';
import { ITexture } from './ITexture';
import { Style } from './Style';
import { IShaderBase } from './IShaderBase';
import { IRenderable } from './IRenderable';

/**
 * @class RenderableListItem
 */
export class _Render_RenderableBase extends AbstractionBase {
	private _renderMaterial: _Render_MaterialBase;
	private _materialDirty: boolean = true;
	private _stageElements: _Stage_ElementsBase;
	private _elementsDirty: boolean = true;
	private _styleDirty: boolean = true;

	private _images: _Stage_ImageBase[] = [];
	private _samplers: ImageSampler[] = [];
	private _uvMatrix: Matrix;

	public JOINT_INDEX_FORMAT: string;
	public JOINT_WEIGHT_FORMAT: string;

	public _count: number = 0;
	public _offset: number = 0;

	protected _stage: Stage;

	/**
     *
     */
	public get images(): Array<_Stage_ImageBase> {
		if (this._styleDirty)
			this._updateStyle();

		return this._images;
	}

	/**
     *
     */
	public get samplers(): Array<ImageSampler> {
		if (this._styleDirty)
			this._updateStyle();

		return this._samplers;
	}

	/**
	 *
	 */
	public get uvMatrix(): Matrix {
		if (this._styleDirty)
			this._updateStyle();

		return this._uvMatrix;
	}

	/**
     *
     */
	public next: _Render_RenderableBase;

	/**
     *
     */
	public materialID: number;

	/**
     *
     */
	public renderOrderId: number;

	/**
     *
     */
	public cascaded: boolean;

	/**
     *
     * @returns {_Stage_ElementsBase}
     */
	public get stageElements(): _Stage_ElementsBase {
		if (this._elementsDirty)
			this._updateElements();

		return this._stageElements;
	}

	/**
	 *
	 * @returns {_Render_MaterialBase}
	 */
	public get renderMaterial(): _Render_MaterialBase {
		if (this._materialDirty)
			this._updateMaterial();

		return this._renderMaterial;
	}

	public get entity(): RenderEntity {
		return this._useWeak ? (<WeakRef<RenderEntity>> this._pool).deref() : <RenderEntity> this._pool;
	}

	constructor() {
		super();
	}

	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	public init(renderable: IRenderable, entity: RenderEntity): void {
		super.init(renderable, entity, true);

		//store references
		this._stage = entity.stage;

		entity.addRenderable(this);

		renderable._renderObjects[entity.id] = this;
	}

	/**
     * Renders an object to the current render target.
     *
     * @private
     */
	public draw(): void {

		const pass: IPass = this._renderMaterial._activePass;
		pass._setRenderState(this);

		const shader: IShaderBase = pass.shader;
		const elements: _Stage_ElementsBase = this.stageElements;

		if (shader.activeElements != elements) {
			shader.activeElements = elements;
			elements._setRenderState(this, shader);
		}

		elements.draw(this, shader, this._count, this._offset);
	}

	public onClear(): void {
		const entity = this.entity;
		if (entity) {
			entity.removeRenderable(this);
			delete (<IRenderable> this.asset)._renderObjects[entity.id];
		} else {
			delete (<IRenderable> this.asset)._renderObjects[this._poolId];
		}

		this._stage = null;

		this.next = null;

		this._renderMaterial.removeOwner(this);

		this._renderMaterial = null;
		this._stageElements = null;

		this._materialDirty = true;
		this._elementsDirty = true;
		this._styleDirty = true;

		this._images.length = 0;
		this._samplers.length = 0;

		super.onClear();
	}

	public _onInvalidateElements(): void {
		this._elementsDirty = true;
	}

	public _onInvalidateMaterial(): void {
		this._materialDirty = true;
		this._styleDirty = true;
	}

	public _onInvalidateStyle(): void {
		this._styleDirty = true;
	}

	protected _getStageElements(): _Stage_ElementsBase {
		throw new AbstractMethodError();
	}

	protected _getRenderMaterial(): _Render_MaterialBase {
		throw new AbstractMethodError();
	}

	protected _getStyle(): Style {
		throw new AbstractMethodError();
	}

	/**
     * //TODO
     *
     * @private
     */
	private _updateElements(): void {
		this._stageElements = this._getStageElements();

		this._elementsDirty = false;
	}

	protected _updateMaterial(): void {
		const renderMaterial: _Render_MaterialBase = this._getRenderMaterial();

		if (this._renderMaterial != renderMaterial) {

			if (this._renderMaterial)
				this._renderMaterial.removeOwner(this);

			this._renderMaterial = renderMaterial;

			this._renderMaterial.addOwner(this);
		}

		this._materialDirty = false;
	}

	protected _updateStyle(): void {
		const style: Style = this._getStyle();

		if (this._materialDirty)
			this._updateMaterial();

		//create a cache of image & sampler objects for the renderable
		let numImages: number = this._renderMaterial.numImages;
		const material: IMaterial = this._renderMaterial.material;

		this._images.length = numImages;
		this._samplers.length = numImages;
		this._uvMatrix = style ? style.uvMatrix : material.style ? material.style.uvMatrix : null;

		const numTextures: number = this._renderMaterial.material.getNumTextures();
		let texture: ITexture;
		let index: number;

		for (let i: number = 0; i < numTextures; i++) {
			texture = material.getTextureAt(i);
			numImages = texture.getNumImages();
			for (let j: number = 0; j < numImages; j++) {
				index = this._renderMaterial.getImageIndex(texture, j);

				this._images[index] = (style?.getImageAt(texture, j)
					|| this._renderMaterial.images[index])
					.getAbstraction<_Stage_ImageBase>(this._stage);

				this._samplers[index] = style?.getSamplerAt(texture, j)
					|| this._renderMaterial.samplers[index];
			}
		}

		this._styleDirty = false;
	}

	protected getDefaultMaterial(): IMaterial {
		return MaterialUtils.getDefaultTextureMaterial();
	}
}