import {
	AbstractMethodError,
	AssetEvent,
	Matrix,
	Matrix3D,
	AbstractionBase,
	IAsset,
} from '@awayjs/core';

import {
	Stage,
	_Stage_ImageBase,
	ImageSampler,
	ImageBase,
} from '@awayjs/stage';

import { EntityNode, ContainerNode, INode } from '@awayjs/view';
import { RenderableEvent } from '../events/RenderableEvent';
import { MaterialUtils } from '../utils/MaterialUtils';
import { RenderGroup } from '../RenderGroup';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';
import { IPass } from './IPass';
import { IMaterial } from './IMaterial';
import { RenderEntity } from './RenderEntity';
import { ITexture } from './ITexture';
import { Style } from './Style';
import { IRenderable } from './IRenderable';
import { Settings } from '../Settings';
import { IShaderBase } from './IShaderBase';
import { RendererBase } from '../RendererBase';
import { CacheRenderer } from '../CacheRenderer';

/**
 * @class RenderableListItem
 */
export class _Render_RenderableBase extends AbstractionBase implements IRenderable {
	private _onInvalidateElementsDelegate: (event: RenderableEvent) => void;
	private _onInvalidateMaterialDelegate: (event: RenderableEvent) => void;
	private _onInvalidateStyleDelegate: (event: RenderableEvent) => void;
	private _materialDirty: boolean = true;
	private _stageElements: _Stage_ElementsBase;
	private _elementsDirty: boolean = true;
	private _styleDirty: boolean = true;

	private _images: Array<_Stage_ImageBase> = new Array<_Stage_ImageBase>();
	private _samplers: Array<ImageSampler> = new Array<ImageSampler>();
	private _uvMatrix: Matrix;

	public JOINT_INDEX_FORMAT: string;
	public JOINT_WEIGHT_FORMAT: string;

	public _count: number = 0;
	public _offset: number = 0;

	protected _stage: Stage;
	protected _renderMaterial: _Render_MaterialBase;

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
	public renderSceneTransform: Matrix3D;

	/**
	 *
	 */
	public renderGroup: RendererBase;

	/**
	 *
	 */
	readonly node: ContainerNode;

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
	public next: IRenderable;

	public id: number;

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
	public zIndex: number;

	/**
     *
     */
	private _maskId: number = -1;
	public set maskId(v: number) {
		if (v !== this._maskId) {
			this._updateMaskHack(v >= 0);
		}
		this._maskId = v;
	}

	public get maskId() {
		return this._maskId;
	}

	/**
     *
     */
	public maskOwners: ContainerNode[];

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

	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	constructor(renderable: IAsset, renderEntity: RenderEntity) {
		super(renderable, renderEntity);

		this._onInvalidateElementsDelegate = (event: RenderableEvent) => this._onInvalidateElements(event);
		this._onInvalidateMaterialDelegate = (event: RenderableEvent) => this._onInvalidateMaterial(event);
		this._onInvalidateStyleDelegate = (event: RenderableEvent) => this._onInvalidateStyle(event);

		//store references
		this.node = renderEntity.node;
		this._stage = renderEntity.stage;

		this._asset.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this._asset.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this._asset.addEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);
	}

	private _updateMaskHack(enable: boolean) {
		if (!Settings.USE_ALPHA_CUTOFF
			|| Settings.ALPHA_CUTOFF_VALUE < 0
			|| Settings.ALPHA_CUTOFF_VALUE > 1) {
			return;
		}

		const mat = this.renderMaterial?.material as IMaterial & {alphaThreshold: number};
		if (!mat) {
			return;
		}

		mat.alphaThreshold = enable ? Settings.ALPHA_CUTOFF_VALUE : 0;
	}

	/**
     * Renders an object to the current render target.
     *
     * @private
     */
	public executeRender(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0,
		mipmapSelector: number = 0, maskConfig: number = 0): void {

		const pass: IPass = this._renderMaterial._activePass;
		pass._setRenderState(this);

		const shader: IShaderBase = pass.shader;
		const elements: _Stage_ElementsBase = this.stageElements;

		if (shader.activeElements != elements) {
			shader.activeElements = elements;
			elements._setRenderState(this, shader);
		}

		this._stageElements.draw(this, shader, this._count, this._offset);
	}

	public onClear(event: AssetEvent): void {
		this._asset.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
		this._asset.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this._asset.removeEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateStyleDelegate);

		super.onClear(event);

		this.renderSceneTransform = null;

		//this.sourceEntity = null;
		this._stage = null;

		this.next = null;
		this.maskOwners = null;

		this._renderMaterial.removeOwner(this);

		this._renderMaterial = null;
		this._stageElements = null;
	}

	public _onInvalidateElements(event: RenderableEvent = null): void {
		this._elementsDirty = true;
	}

	public _onInvalidateMaterial(event: RenderableEvent = null): void {
		this._materialDirty = true;
		this._styleDirty = true;
	}

	public _onInvalidateStyle(event: RenderableEvent = null): void {
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
		let image: ImageBase;
		let index: number;

		for (let i: number = 0; i < numTextures; i++) {
			texture = material.getTextureAt(i);
			numImages = texture.getNumImages();
			for (let j: number = 0; j < numImages; j++) {
				index = this._renderMaterial.getImageIndex(texture, j);
				image =  style ? style.getImageAt(texture, j) : null;
				this._images[index] = image ? image.getAbstraction<_Stage_ImageBase>(this._stage) : null;
				this._samplers[index] = style ? style.getSamplerAt(texture, j) : null;
			}
		}

		this._styleDirty = false;
	}

	protected getDefaultMaterial(): IMaterial {
		return MaterialUtils.getDefaultTextureMaterial();
	}
}