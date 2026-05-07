import {
	AssetEvent,
	IAssetClass,
	Matrix3D,
	PerspectiveProjection,
} from '@awayjs/core';
import {
	AttributesBuffer,
	Image2D,
	ContextGLTriangleFace,
	StageEvent,
	ImageSampler
} from '@awayjs/stage';
import {
	ContainerNode,
	ContainerNodeEvent,
	HierarchicalProperty,
	INode,
	PickGroup
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
import { RendererBase } from './RendererBase';
import { RenderGroup } from './RenderGroup';
import { ImageTexture2D } from './textures/ImageTexture2D';
import { Settings as StageSettings } from '@awayjs/stage';
import { RenderEntity } from './base/RenderEntity';
import { DefaultRenderer } from './DefaultRenderer';
import { IRenderable } from './base/IRenderable';
import { IRenderContainer } from './base/IRenderContainer';

export class CacheRenderer extends RendererBase implements IMaterial, IRenderable {
	public static assetType: string = '[renderer CacheRenderer]';

	private _texture: ImageTexture2D;
	private _textures: ITexture[] = [];
	private _onTextureInvalidate: (event: AssetEvent) => void;
	private _onInvalidateSceneTransform: (event: ContainerNodeEvent) => void;
	private _onInvalidateColorTransform: (event: ContainerNodeEvent) => void;

	public animateUVs: boolean = false;

	public bothSides: boolean = false;

	public curves: boolean = false;

	public imageRect: boolean = false;

	public useColorTransform: boolean = true;

	public alphaBlending: boolean = true;

	public alphaThreshold: number = 0;

	public get assetType(): string {
		return CacheRenderer.assetType;
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

	constructor() {
		super();

		this._onTextureInvalidate = (event: AssetEvent) => this.invalidate();
		this._onInvalidateSceneTransform = (event: ContainerNodeEvent) => this.onInvalidateSceneTransform();
		this._onInvalidateColorTransform = (event: ContainerNodeEvent) => this.onInvalidateColorTransform();

		this._traverserGroup = RenderGroup.getInstance(CacheRenderer);
		this._maskGroup = RenderGroup.getInstance(DefaultRenderer);
	}

	public _onInvalidateElements(): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateElements();
	}

	public _onInvalidateMaterial(): void {
		// for (const key in this._abstractionPool)
		// 	(this._abstractionPool[key] as _Render_RenderableBase)._onInvalidateMaterial();
	}

	public init(node: INode, group: RenderGroup): void {
		super.init(node, group);

		node.view.stage.addEventListener(StageEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		if (this._parentNode) {
			this._parentNode.addEventListener(ContainerNodeEvent.INVALIDATE_MATRIX3D, this._onInvalidateSceneTransform);
			this._parentNode.addEventListener(ContainerNodeEvent.INVALIDATE_COLOR_TRANSFORM, this._onInvalidateColorTransform);
		}

		// for check filters/blends changes
		(<IRenderContainer> node.container)._renderObjects[group.id] = this;

		this.texture = new ImageTexture2D();
	}

	public render(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0,
		mipmapSelector: number = 0,
		maskConfig: number = 0
	): void {
		const container = this.node.container;

		const stage = this.stage;
		const useNonNativeBlend = this.useNonNativeBlend;
		const targetImage = <Image2D> (useNonNativeBlend ? this.parentRenderer.style.image : this._style.image);

		if (!targetImage) {
			return super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
		}

		// WE MUST store older render target config,
		// because node can have cached child, that can be filtered
		this.stage.pushRenderTargetConfig();

		const msaa = stage.context.glVersion === 2 && StageSettings.ENABLE_MULTISAMPLE_TEXTURE;

		// we not require use TMP texture when not have MSAA
		const sourceImage: Image2D = (msaa)
			? stage.filterManager.popTemp(targetImage.width, targetImage.height, true)
			: targetImage;

		//for DefaultRenderer when child has a blendmode applied
		if (useNonNativeBlend) {
			const proj = this.parentRenderer.view.projection;
			this.parentRenderer.view.projection = new PerspectiveProjection();
			this.parentRenderer.view.target = targetImage;
			//this.parentRenderer.disableClear = true;
			this.parentRenderer._initRender(targetImage);
			this.parentRenderer.executeRender();
			this.parentRenderer.resetHead();
			//this.parentRenderer.disableClear = false;
			this.parentRenderer.view.target = null;
			this.parentRenderer.view.projection = proj;
			this._disableClear = true;
		}

		this._initRender(sourceImage);
		super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);

		if (targetImage.width * targetImage.height === 0) {
			throw new Error('Cannot have image with size 0 * 0');
		}

		//@ts-ignore
		const filters = container.filters;
		const scale = this.getBoundsScale();
		if (filters && filters.length > 0) {
			filters.forEach((e) => e && (e.imageScale = scale));
			stage.filterManager.applyFilters(
				sourceImage,
				targetImage, // because we use source as filter target - we not require copy
				targetImage.rect,
				targetImage.rect,
				filters
			);
		} else if (msaa) {
			// this is fast, it should only call blitFramebuffer,
			// same as in regular MSAA
			stage.filterManager.copyPixels(
				sourceImage,
				targetImage,
				targetImage.rect,
				targetImage.rect.topLeft,
				useNonNativeBlend,
				useNonNativeBlend ? <string> container.blendMode : ''
			);
		}

		if (msaa) {
			stage.filterManager.pushTemp(sourceImage);
		}

		// pop render target after any filters,
		// required for deep filters (when node with filter has filtered child)
		this.stage.popRenderTarget();
	}

	public _updateBounds(): void {
		super._updateBounds();

		const image =  <Image2D> this._style.image;
		const pad = this._paddedBounds;

		if (image) {
			(<Image2D> this._style.image)._setSize(pad.width, pad.height);
		} else {

			this._style.image = new Image2D(pad.width, pad.height, false);
			this._style.sampler = new ImageSampler(false, false, false);
			//this._view.target = this._style.image;
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
	public enterNode(node: ContainerNode): boolean {
		const enter: boolean = super.enterNode(node);

		if (enter && node.boundsVisible)
			this.applyEntity(node.getBoundsPrimitive(PickGroup.getInstance()));

		return enter;
	}

	public onInvalidate(): void {
		super.onInvalidate();

		for (const key in this._renderObjects)
			this._renderObjects[key]._onInvalidateElements();

		for (const key in this._renderObjects)
			this._renderObjects[key]._onInvalidateStyle();

		this.invalidate();
		this.invalidatePasses();
	}

	public onInvalidateSceneTransform(): void {
		(<ContainerNode> this._asset).invalidateHierarchicalProperty(HierarchicalProperty.SCENE_TRANSFORM);
		this.onInvalidate();
	}

	public onInvalidateColorTransform(): void {
		(<ContainerNode> this._asset).invalidateHierarchicalProperty(HierarchicalProperty.COLOR_TRANSFORM);
		this.invalidate();
	}

	public onClear(): void {

		this.removeTexture(this._texture);
		this._texture.clear();
		this._texture = null;
		this._style.image.clear();
		this._style.image = null;

		(<ContainerNode> this._asset).view.stage.removeEventListener(StageEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		if (this._parentNode) {
			this._parentNode.removeEventListener(ContainerNodeEvent.INVALIDATE_MATRIX3D, this._onInvalidateSceneTransform);
			this._parentNode.removeEventListener(ContainerNodeEvent.INVALIDATE_COLOR_TRANSFORM, this._onInvalidateColorTransform);
		}

		const container: IRenderContainer = <IRenderContainer> (<ContainerNode> this._asset).container;

		if (container)
			delete container._renderObjects[this.group.id];

		super.onClear();
	}

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		RenderGroup.getInstance(CacheRenderer).registerMaterial(renderMaterialClass, materialClass);
	}
}

export class _Render_Renderer extends _Render_RenderableBase {

	public static assetType: string = '[render Renderer]';

	private _elements: TriangleElements;

	protected _getStageElements(): _Stage_ElementsBase {

		const asset = <CacheRenderer> this.renderable;
		const paddedBounds = asset.getPaddedBounds();
		const matrix3D: Matrix3D = Matrix3D.CALCULATION_MATRIX;
		const scale: number = asset.getBoundsScale();

		matrix3D.copyFrom(this.entity.renderSceneTransform);
		matrix3D.appendScale(scale, scale, scale);
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

		return this._stage.abstractions.getAbstraction<_Stage_TriangleElements>(elements);
	}

	public draw(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0, mipmapSelector: number = 0, maskConfig: number = 0): void {

		// disable cull, because for render to texture it is bugged
		this._stage.context.setCulling(ContextGLTriangleFace.NONE);
		super.draw();
	}

	protected _getRenderMaterial(): _Render_RendererMaterial {
		return this.entity.renderer
			.getRenderElements(this.stageElements.elements).abstractions
			.getAbstraction<_Render_RendererMaterial>((<CacheRenderer> this.renderable));
	}

	protected _getStyle(): Style {

		return this.renderable.style;
	}
}
DefaultRenderer.registerMaterial(_Render_RendererMaterial, CacheRenderer);
CacheRenderer.registerMaterial(_Render_RendererMaterial, CacheRenderer);
RenderEntity.registerRenderable(_Render_Renderer, CacheRenderer);