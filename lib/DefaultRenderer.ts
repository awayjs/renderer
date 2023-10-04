import { AssetEvent, IAssetClass } from '@awayjs/core';
import { BitmapImage2D, IContextGL } from '@awayjs/stage';
import { INode, PartitionBase, PickGroup, View } from '@awayjs/view';
import { RenderGroup } from './RenderGroup';
import { DepthRenderer } from './DepthRenderer';
import { DistanceRenderer } from './DistanceRenderer';
import { RendererBase } from './RendererBase';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { CacheRenderer } from './CacheRenderer';
import { _Render_RendererMaterial } from './base/_Render_RendererMaterial';

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
export class DefaultRenderer extends RendererBase {
	public static assetType: string = '[renderer DefaultRenderer]';

	private _requireDepthRender: boolean;

	private _distanceRenderer: DistanceRenderer;
	private _depthRenderer: DepthRenderer;

	public _depthRender: BitmapImage2D;

	public get antiAlias(): number {
		return this.stage.antiAlias;
	}

	public set antiAlias(value: number) {
		this.stage.antiAlias = value;
	}

	/**
	 *
	 */
	public get depthPrepass(): boolean {
		return this._depthPrepass;
	}

	public set depthPrepass(value: boolean) {
		this._depthPrepass = value;
	}

	/**
	 * Creates a new DefaultRenderer object.
	 *
	 * @param antiAlias The amount of anti-aliasing to use.
	 * @param renderMode The render mode to use.
	 */
	constructor(partition: PartitionBase, pool: RenderGroup) {
		super(partition, pool);

		this._depthRenderer = RenderGroup
			.getInstance(DepthRenderer)
			.getRenderer(partition);

		this._distanceRenderer = RenderGroup
			.getInstance(DistanceRenderer)
			.getRenderer(partition);

		this._traverserGroup = RenderGroup.getInstance(CacheRenderer);
		this._maskGroup = RenderGroup.getInstance(DefaultRenderer);
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

	public render(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0,
		mipmapSelector: number = 0,
		maskConfig: number = 0): void {

		if (!this.stage.recoverFromDisposal()) {//if context has Disposed by the OS,don't render at this frame
			return;
		}

		if (this._requireDepthRender)
			this._renderSceneDepthToTexture();

		if (this._depthPrepass)
			this._renderDepthPrepass();

		//this._view.target = null;
		super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);

		if (!maskConfig)
			this.view.present();
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		if (this._pRttBufferManager) {
			this._pRttBufferManager.dispose();
			this._pRttBufferManager = null;
		}

		this._depthRenderer.onClear(event);
		this._distanceRenderer.onClear(event);
		this._depthRenderer = null;
		this._distanceRenderer = null;

		this._depthRender = null;
	}

	/**
	 *
	 */
	private _renderDepthPrepass(): void {
		this._depthRenderer.disableColor = true;

		this._depthRenderer.view.projection = this.view.projection;
		this._depthRenderer.view.target = null;
		this._depthRenderer.render();

		this._depthRenderer.disableColor = false;
	}

	/**
	 *
	 */
	private _renderSceneDepthToTexture(): void {
		if (this._depthTextureDirty || !this._depthRender)
			this.initDepthTexture(<IContextGL> this.stage.context);

		this._depthRenderer.render();
	}

	/**
	 *
	 */
	private initDepthTexture(context: IContextGL): void {
		this._depthTextureDirty = false;

		if (this._depthRender)
			this._depthRender.dispose();

		this._depthRender = new BitmapImage2D(
			this._pRttBufferManager.textureWidth,
			this._pRttBufferManager.textureHeight);

		this._depthRenderer.view.target = this._depthRender;
		this._depthRenderer.view.projection = this.view.projection;
	}

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		RenderGroup.getInstance(DefaultRenderer).materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}