import {
	AssetEvent,
	Box,
	IAbstractionClass,
	IAbstractionPool,
	IAsset,
	IAssetClass,
	Matrix3D,
	PerspectiveProjection,
	Rectangle,
} from '@awayjs/core';
import {
	AttributesBuffer,
	BlendMode,
	Image2D,
	ImageSampler,
	ContextGLTriangleFace
} from '@awayjs/stage';
import {
	BoundsPicker,
	ContainerNode,
	ContainerNodeEvent,
	IEntityTraverser,
	INode,
	PartitionBase,
	PickGroup,
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
import { RenderGroup } from './RenderGroup';
import { ImageTexture2D } from './textures/ImageTexture2D';
import { Settings as StageSettings } from '@awayjs/stage';
import { Settings } from './Settings';
import { RenderEntity } from './base/RenderEntity';
import { DefaultRenderer } from './DefaultRenderer';

export class CacheRenderer extends RendererBase implements IMaterial, IAbstractionPool {
	public static assetType: string = '[renderer CacheRenderer]';

	private _texture: ImageTexture2D;
	private _textures: Array<ITexture> = new Array<ITexture>();
	private _onTextureInvalidate: (event: AssetEvent) => void;
	private _onInvalidateParentNode: (event: ContainerNodeEvent) => void;
	private _onInvalidateColorTransform: (event: ContainerNodeEvent) => void;

	public animateUVs: boolean = false;

	public bothSides: boolean = false;

	public curves: boolean = false;

	public imageRect: boolean = false;

	public useColorTransform: boolean = true;

	public alphaThreshold: number = 0;

	public get assetType(): string {
		return CacheRenderer.assetType;
	}

	/**
	 *
	 * @returns {EntityNode}
	 */
	public get parent(): ContainerNode {
		return this._node;
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

	constructor(partition: PartitionBase, pool: RenderGroup) {
		super(partition, pool);

		this._onTextureInvalidate = (_event: AssetEvent) => this.invalidate();
		this._onInvalidateParentNode = (_event: ContainerNodeEvent) => this.onInvalidate(null);
		this._onInvalidateColorTransform = (_event: ContainerNodeEvent) => {
			this.onInvalidate(null);
		};

		if (this._parentNode) {
			this._parentNode.addEventListener(ContainerNodeEvent.INVALIDATE_MATRIX3D, this._onInvalidateParentNode);
			this._parentNode.addEventListener(ContainerNodeEvent.INVALIDATE_COLOR_TRANSFORM, this._onInvalidateColorTransform);
		}

		// for check filters/blends changes
		this._node.container.addEventListener(RenderableEvent.INVALIDATE_STYLE, this._onInvalidateParentNode);
		this._node.container.addEventListener(ContainerNodeEvent.INVALIDATE_COLOR_TRANSFORM, this._onInvalidateColorTransform);

		this.texture = new ImageTexture2D();

		this._traverserGroup = RenderGroup.getInstance(CacheRenderer);
		this._maskGroup = RenderGroup.getInstance(DefaultRenderer);
	}

	public render(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0,
		mipmapSelector: number = 0,
		maskConfig: number = 0
	): void {
		const container = this._node.container;

		const stage = this.stage;
		const useNonNativeBlend = this.useNonNativeBlend;
		const targetImage = <Image2D> (useNonNativeBlend? this.parentRenderer.style.image : this._style.image);

		if (!targetImage) {
			return super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
		}

		// WE MUST store older render target config,
		// because node can have cached child, that can be filtered
		this.stage.pushRenderTargetConfig();

		let sourceImage: Image2D;

		// we not require use TMP texture when not have MSAA
		if (stage.context.glVersion === 2 &&
			StageSettings.ENABLE_MULTISAMPLE_TEXTURE
		) {
			sourceImage = stage.filterManager.popTemp(
				targetImage.width,
				targetImage.height,
				true
			);

		}
 
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

		// we should render with colorTransform to self, enable it
		this._node.colorTransformDisabled = false;

		this._initRender(sourceImage || targetImage);
		super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);

		// restore colorTransform state as in transform state
		this._node.colorTransformDisabled = this._node.transformDisabled;


		if (targetImage.width * targetImage.height === 0) {
			debugger;
		}

		//@ts-ignore
		const filters = container.filters;
		if (filters && filters.length > 0) {
			filters.forEach((e) => e && (e.imageScale = this._boundsScale));
			stage.filterManager.applyFilters(
				sourceImage || targetImage,
				targetImage, // because we use source as filter target - we not require copy
				targetImage.rect,
				targetImage.rect,
				filters
			);
		} else if (sourceImage) {
			// this is fast, it should only call blitFramebuffer,
			// same as in regular MSAA
			stage.filterManager.copyPixels(
				sourceImage,
				targetImage,
				targetImage.rect,
				targetImage.rect.topLeft,
				useNonNativeBlend,
				useNonNativeBlend? <string> container.blendMode : ''
			);
		}

		if (sourceImage) {
			stage.filterManager.pushTemp(sourceImage);
		}

		// pop render target after any filters,
		// required for deep filters (when node with filter has filtered child)
		this.stage.popRenderTarget();
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
	public enterNode(node: INode): boolean {
		const enter: boolean = super.enterNode(node);

		if (enter && node.boundsVisible)
			this.applyEntity(node.getBoundsPrimitive(PickGroup.getInstance()));

		return enter;
	}

	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);

		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_ELEMENTS, this));

		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_STYLE, this));

		this.invalidate();
		this.invalidatePasses();
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this.texture.clear();
		this.texture = null;

		this.style.image.clear();
		this.style.image = null;
	}

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		RenderGroup.getInstance(CacheRenderer).materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}

export class _Render_Renderer extends _Render_RenderableBase {

	public static assetType: string = '[render Renderer]';

	private _elements: TriangleElements;

	protected _getStageElements(): _Stage_ElementsBase {

		const asset = <CacheRenderer> this._asset;
		const paddedBounds = asset.getPaddedBounds();
		const bounds = asset.getBounds();
		const offsetX = 0;//paddedBounds.x - bounds.x;
		const offsetY = 0;//paddedBounds.y - bounds.y;
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
		this._stage.context.setCulling(ContextGLTriangleFace.NONE);
		super.executeRender(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
	}

	protected _getRenderMaterial(): _Render_RendererMaterial {
		return this._asset.getAbstraction<_Render_RendererMaterial>(
			this.renderer.getRenderElements(this.stageElements.elements));
	}

	protected _getStyle(): Style {

		return (<CacheRenderer> this._asset).style;
	}
}
DefaultRenderer.registerMaterial(_Render_RendererMaterial, CacheRenderer);
CacheRenderer.registerMaterial(_Render_RendererMaterial, CacheRenderer);
RenderEntity.registerRenderable(_Render_Renderer, CacheRenderer);