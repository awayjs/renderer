import {
	AssetEvent,
	Box,
	IAbstractionClass,
	IAbstractionPool,
	IAsset,
	IAssetClass,
	Matrix3D,
	Rectangle,
} from '@awayjs/core';
import {
	AttributesBuffer,
	BlendMode,
	Image2D,
	ImageSampler
} from '@awayjs/stage';
import {
	BoundsPicker,
	ContainerNode,
	ContainerNodeEvent,
	INode,
	PartitionBase,
	View
} from '@awayjs/view';

import { IMaterial } from './base/IMaterial';
import { ITexture } from './base/ITexture';
import { Style } from './base/Style';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { _Render_RenderableBase } from './base/_Render_RenderableBase';
import { _Render_RendererMaterial } from './base/_Render_RendererMaterial';
import { _Stage_ElementsBase } from './base/_Stage_ElementsBase';
import { TriangleElements, _Stage_TriangleElements } from './elements/TriangleElements';
import { MaterialEvent } from './events/MaterialEvent';
import { RenderableEvent } from './events/RenderableEvent';
import { StyleEvent } from './events/StyleEvent';
import { RendererBase } from './RendererBase';
import { RendererPool, RenderGroup } from './RenderGroup';
import { ImageTexture2D } from './textures/ImageTexture2D';
import { Settings as StageSettings } from '@awayjs/stage';
import { Settings } from './Settings';

export class CacheRenderer extends RendererBase implements IMaterial, IAbstractionPool {

	public static assetType: string = '[renderer CacheRenderer]';
	public static materialClassPool: Record<string, _IRender_MaterialClass> = {};
	public static renderGroupPool: Record<string, RenderGroup> = {};
	public static defaultBackground: number = 0x0;

	public static isValidForCache (node: ContainerNode) {

	}

	private _boundsPicker: BoundsPicker;
	private _renderMatrix: Matrix3D = new Matrix3D();
	private _bounds: Box = new Box();
	private _paddedBounds: Rectangle = new Rectangle();
	/*internal*/ _boundsScale: number = 1;
	private _boundsDirty: boolean;
	private _style: Style;
	private _parentNode: ContainerNode;
	private _texture: ImageTexture2D;
	private _textures: Array<ITexture> = new Array<ITexture>();
	private _blendMode: string = BlendMode.NORMAL;
	private _onTextureInvalidate: (event: AssetEvent) => void;
	private _onInvalidateProperties: (event: StyleEvent) => void;
	private _onInvalidateParentNode: (event: ContainerNodeEvent) => void;

	public node: ContainerNode;

	public animateUVs: boolean = false;

	public bothSides: boolean = false;

	public curves: boolean = false;

	public imageRect: boolean = false;

	public useColorTransform: boolean = true;

	public alphaThreshold: number = 0;

	public rootView: View;

	public get assetType(): string {
		return CacheRenderer.assetType;
	}

	public getPaddedBounds(): Rectangle {
		if (this._boundsDirty)
			this._updateBounds();

		return this._paddedBounds;
	}

	public getBounds(): Box {
		if (this._boundsDirty)
			this._updateBounds();

		return this._bounds;
	}

	private _lockBlendMode = false;

	public get blendMode(): string {
		if (this._lockBlendMode) {
			return BlendMode.LAYER;
		}

		const containerBlend = <string> this.node.container.blendMode;

		// native blends
		switch (containerBlend) {
			case BlendMode.LAYER:
			case BlendMode.MULTIPLY:
			case BlendMode.NORMAL:
			case BlendMode.ADD:
			case BlendMode.SCREEN:
			case BlendMode.ALPHA:
				return containerBlend;
		}

		return BlendMode.LAYER;
	}

	/**
	 *
	 */
	public get style(): Style {
		if (this._boundsDirty)
			this._updateBounds();

		return this._style;
	}

	public set style(value: Style) {
		if (this._style == value)
			return;

		if (this._style)
			this._style.removeEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._style = value;

		if (this._style)
			this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._invalidateStyle();
	}

	/**
	* The 2d texture to use as a bitmap cache.
	*/
	public get texture(): ImageTexture2D {

		//TODO check invalidation of _texture

		return this._texture;
	}

	public set texture(value: ImageTexture2D) {
		if (this._texture == value)
			return;

		if (this._texture)
			this.removeTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.addTexture(this._texture);

		this.invalidatePasses();
	}

	constructor(partition: PartitionBase, pool: RendererPool) {
		super(partition, pool);

		this.node = partition.rootNode;

		this._onTextureInvalidate = (_event: AssetEvent) => this.invalidate();
		this._onInvalidateProperties = (_event: StyleEvent) => this._invalidateStyle();
		this._onInvalidateParentNode = (_event: ContainerNodeEvent) => this.onInvalidate(null);

		if (partition.parent) {
			this._parentNode = partition.parent.rootNode;
			this._parentNode.addEventListener(ContainerNodeEvent.INVALIDATE_MATRIX3D, this._onInvalidateParentNode);
		}

		// for check filters changings
		this.node.container.addEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateParentNode);

		this.style = new Style();

		this.texture = new ImageTexture2D();

		this._boundsPicker = this._renderGroup.pickGroup.getBoundsPicker(this._partition);

		this._boundsDirty = true;

		this._traverserClass = CacheRenderer;
	}

	public render(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0,
		mipmapSelector: number = 0,
		maskConfig: number = 0
	): void {

		const stage = this._stage;
		const sourceImage = <Image2D> this._style.image;

		if (!sourceImage) {
			return super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
		}

		let targetImage: Image2D;

		// we not require use TMP texture when not have MSAA
		if (stage.context.glVersion === 2 &&
			StageSettings.ENABLE_MULTISAMPLE_TEXTURE
		) {
			targetImage = stage.filterManager.popTemp(
				sourceImage.width,
				sourceImage.height,
				true
			);

		}

		this._lockBlendMode = true;
		this._initRender(targetImage || sourceImage);
		super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);

		this._lockBlendMode = false;

		const container = this.node.container;
		//@ts-ignore
		const filters = container.filters;
		if (filters && filters.length > 0) {
			filters.forEach((e) => e && (e.imageScale = this._boundsScale));
			stage.filterManager.applyFilters(
				targetImage || sourceImage,
				sourceImage, // because we use source as filter target - we not require copy
				sourceImage.rect,
				sourceImage.rect,
				filters
			);
		} else if (targetImage) {
			// this is fast, it should only call blitFramebuffer,
			// same as in regular MSAA
			stage.filterManager.copyPixels(
				targetImage,
				sourceImage,
				sourceImage.rect,
				sourceImage.rect.topLeft,
				false
			);
		}

		if (targetImage) {
			stage.filterManager.pushTemp(targetImage);
		}
	}

	// apply blend modes and swap texture if needed
	public preActivateRenderPass() {

	}

	public getNumTextures(): number {
		return this._textures.length;
	}

	public getTextureAt(index: number): ITexture {
		return this._textures[index];
	}

	public addTexture(texture: ITexture): void {
		this._textures.push(texture);

		texture.addEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidate);

		this.invalidate();
	}

	public removeTexture(texture: ITexture): void {
		this._textures.splice(this._textures.indexOf(texture), 1);

		texture.removeEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidate);

		this.invalidate();
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return _Render_Renderer;
	}

	/**
	 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
	 *
	 * @private
	 */
	public invalidatePasses(): void {
		this.dispatchEvent(new MaterialEvent(MaterialEvent.INVALIDATE_PASSES, this));
	}

	/**
	 *
	 */
	public enterNode(node: INode): boolean {
		const enter: boolean = super.enterNode(node);

		if (enter && node.boundsVisible)
			this.applyEntity(node.getBoundsPrimitive(this._renderGroup.pickGroup));

		return enter;
	}

	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);

		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_ELEMENTS, this));

		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_STYLE, this));

		this.invalidate();
		this.invalidatePasses();

		this._boundsDirty = true;
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this.texture.clear();
		this.texture = null;

		this.style.image.clear();
		this.style.image = null;
	}

	private _invalidateStyle(): void {
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_STYLE, this));
	}

	private _updateBounds(): void {
		this._boundsDirty = false;

		const matrix3D = this._renderMatrix;
		const container = this.node.container;
		const pad = this._paddedBounds;
		const view = this.rootView;

		//should be method to evaluate real scale relative screen
		const scale: number = view ? Math.min(3, view.projection.scale) : 1;
		this._boundsScale = scale;

		if (this._parentNode) {
			matrix3D.copyFrom(this._parentNode.getMatrix3D());
		} else {
			// no parent - no transform
			matrix3D.identity();
		}

		if (scale !== 1)
			matrix3D.appendScale(scale, scale, scale);

		const bounds = this._boundsPicker.getBoxBounds(this.node, true, true);

		if (!bounds) {
			console.error('[CachedRenderer] Bounds invalid, supress calculation', this.node);
			return;
		}

		this._bounds.copyFrom(bounds);

		matrix3D.transformBox(this._bounds, this._bounds);
		matrix3D.invert();

		pad.setTo(
			this._bounds.x,
			this._bounds.y,
			this._bounds.width,
			this._bounds.height
		);

		if (container.filters && container.filters.length > 0) {
			container.filters.forEach((e) => e && (e.imageScale = scale));
			this._stage.filterManager.computeFiltersPadding(pad, container.filters, pad);
		}

		pad.x = (pad.x - 2) | 0;
		pad.y = (pad.y - 2) | 0;
		pad.width = (pad.width + 4) | 0;
		pad.height = (pad.height + 4) | 0;

		const image =  <Image2D> this._style.image;
		if (image) {
			// resize only when we have texture lower that was, reduce texture swappings
			//if (image.width < pad.width || image.height < pad.height) {
			(<Image2D> this._style.image)._setSize(pad.width, pad.height);
			//}
		} else {

			this._style.image = new Image2D(pad.width, pad.height, false);
			this._style.sampler = new ImageSampler(false, Settings.SMOOTH_CACHED_IMAGE, false);
			//this._view.target = this._style.image;
		}
	}

	private _initRender(target: Image2D) {
		const pad = this._paddedBounds;
		const scale = this._boundsScale;
		const matrix3D = this._renderMatrix;
		const ox = pad.x - this._bounds.x;
		const oy = pad.y - this._bounds.y;
		const view = this._view;
		const proj = view.projection;

		matrix3D._rawData[14] = -1000;

		// without this we will handle empty image when target is big (scale > +3)
		proj.far = 4000;
		proj.near = 1;
		proj.transform.matrix3D = matrix3D;
		proj.ratio = (target.width / target.height);
		proj.originX = -1 - 2 * (pad.x - ox * 0.5) / target.width;
		proj.originY = -1 - 2 * (pad.y - oy * 0.5) / target.height;
		proj.scale = scale * 1000 / target.height;

		view.target = target;
	}

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		CacheRenderer.materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}

export class _Render_Renderer extends _Render_RenderableBase {

	public static assetType: string = '[render Renderer]';

	private _elements: TriangleElements;

	protected _getStageElements(): _Stage_ElementsBase {

		const asset = <CacheRenderer> this._asset;
		const paddedBounds = asset.getPaddedBounds();
		const bounds = asset.getBounds();
		const offsetX = paddedBounds.x - bounds.x;
		const offsetY = paddedBounds.y - bounds.y;
		const matrix3D: Matrix3D = Matrix3D.CALCULATION_MATRIX;

		matrix3D.copyFrom(this.renderSceneTransform);
		matrix3D.appendScale(asset._boundsScale, asset._boundsScale, asset._boundsScale);
		matrix3D.appendTranslation(offsetX * 0.5, offsetY * 0.5, 0);
		matrix3D.invert();

		const vectors: number[] = [
			paddedBounds.left, paddedBounds.top, 0,
			paddedBounds.right, paddedBounds.bottom, 0,
			paddedBounds.right, paddedBounds.top, 0,

			paddedBounds.left, paddedBounds.top, 0,
			paddedBounds.left, paddedBounds.bottom, 0,
			paddedBounds.right, paddedBounds.bottom, 0,
		];

		matrix3D.transformVectors(vectors, vectors);

		let elements: TriangleElements = this._elements;

		if (!elements) {
			elements = this._elements = new TriangleElements(new AttributesBuffer(5, 6));
			elements.setPositions(vectors);
			elements.setUVs([0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1]);
		} else {
			elements.setPositions(vectors);
		}

		return elements.getAbstraction<_Stage_TriangleElements>(this._stage);
	}

	public executeRender(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0, mipmapSelector: number = 0, maskConfig: number = 0): void {

		// disable cull, because for render to texture it is bugged
		// this._stage.context.setCulling(ContextGLTriangleFace.NONE);
		super.executeRender(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
	}

	protected _getRenderMaterial(): _Render_RendererMaterial {
		return this._asset.getAbstraction<_Render_RendererMaterial>(
			this.renderGroup.getRenderElements(this.stageElements.elements));
	}

	protected _getStyle(): Style {

		return (<CacheRenderer> this._asset).style;
	}
}

CacheRenderer.registerMaterial(_Render_RendererMaterial, CacheRenderer);