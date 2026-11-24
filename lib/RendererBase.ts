import {
	Matrix3D,
	Plane3D,
	Vector3D,
	AbstractionBase,
	IAsset,
	Box,
	Rectangle,
	IAbstraction,
	IAbstractionPool,
} from '@awayjs/core';

import {
	BitmapImage2D,
	ContextGLBlendFactor,
	ContextGLCompareMode,
	ContextGLStencilAction,
	ContextGLTriangleFace,
	IContextGL,
	Stage,
	StageEvent,
	ContextGLClearMask,
	RTTBufferManager,
	Image2D,
	ImageSampler,
	BlendMode,
	isNativeBlend,
	Settings as StageSettings
} from '@awayjs/stage';

import {
	View,
	ViewEvent,
	IPartitionTraverser,
	IEntityTraverser,
	INode,
	ContainerNode,
	BoundsPicker,
	PickGroup,
	PickEntity,
} from '@awayjs/view';

import { _Render_MaterialBase } from './base/_Render_MaterialBase';
import { _Render_RenderableBase } from './base/_Render_RenderableBase';
import { RenderEntity } from './base/RenderEntity';
import { IMapper } from './base/IMapper';
import { RenderGroup, RenderPool } from './RenderGroup';

import { IRenderEntitySorter } from './sort/IRenderEntitySorter';
import { RenderableMergeSort } from './sort/RenderableMergeSort';
import { _Render_Renderer, CacheRenderer } from './CacheRenderer';
import { _Render_ElementsBase } from './base/_Render_ElementsBase';
import { Style } from './base/Style';
import { StyleEvent } from './events/StyleEvent';
import { RendererEvent } from './events/RendererEvent';
import { IRenderable } from './base/IRenderable';
import { AbstractionSet } from '@awayjs/core/dist/lib/base/AbstractionSet';

/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export class RendererBase extends AbstractionBase implements IPartitionTraverser, IEntityTraverser, IAbstractionPool {
	private static _store: IAbstraction[] = [];
	private static _tmpMatrix3D: Matrix3D = new Matrix3D();
	private static _tmpBox: Box = new Box();
	private static _tmpViewportBounds: Rectangle = new Rectangle();
	private static _childSyncMark: number = 0;
	public static _collectionMark = 0;

	public readonly abstractions: AbstractionSet;

	public _renderObjects: Record<number, _Render_Renderer> = {};

	protected _renderMatrix: Matrix3D = new Matrix3D();
	protected _parentNode: ContainerNode;
	private _boundsPicker: BoundsPicker;
	private _boundsScale: number = 1;
	private _maskConfig: number;
	private _maskId: number;
	private _activeMasksDirty: boolean;
	private _activeMaskOwners: ContainerNode[];
	protected _paddedBounds: Rectangle = new Rectangle();
	private _unclippedPaddedBounds: Rectangle = new Rectangle();
	private _bounds: Box = new Box();
	protected _style: Style;
	protected _boundsDirty: boolean = true;
	protected _unclippedBoundsDirty: boolean = true;
	private _childRenderers: RendererBase[] = [];
	private _syncMark: number = 0;
	protected _childListDirty: boolean = true;
	private _parentClipBounds: Rectangle = new Rectangle();
	private static _syncStack: ContainerNode[] = [];
	private _invalidatePadsEvent: RendererEvent;
	private _onChildInvalidatePads: (event: RendererEvent) => void;
	private _mappers: Array<IMapper> = new Array<IMapper>();
	private _elementsPools: Record<string, _Render_ElementsBase> = {};

	protected _context: IContextGL;

	public _cameraTransform: Matrix3D;
	private _cameraForward: Vector3D = new Vector3D();

	public _pRttBufferManager: RTTBufferManager;

	protected _depthTextureDirty: boolean = true;
	protected _depthPrepass: boolean = false;

	private _snapshotBitmapImage2D: BitmapImage2D;
	private _snapshotRequired: boolean;

	private _onInvalidateProperties: (event: StyleEvent) => void;
	private _onContextUpdateDelegate: (event: StageEvent) => void;
	protected _onSizeInvalidateDelegate: (event: ViewEvent | StageEvent) => void;

	public _pNumElements: number = 0;

	protected _opaqueRenderables: _Render_RenderableBase[] = [];
	protected _blendedRenderables: _Render_RenderableBase[] = [];
	public _disableColor: boolean = false;
	public _disableClear: boolean = false;
	public _renderBlended: boolean = true;
	private _cullPlanes: Array<Plane3D>;
	private _customCullPlanes: Array<Plane3D>;
	private _numCullPlanes: number = 0;
	protected _traverserGroup: RenderGroup;
	protected _maskGroup: RenderGroup;
	private _pickEntity: PickEntity;
	private _renderEntity: RenderEntity;

	/**
	 *
	 */
	public get cullPlanes(): Array<Plane3D> {
		return this._customCullPlanes;
	}

	public set cullPlanes(value: Array<Plane3D>) {
		this._customCullPlanes = value;
	}

	public get renderBlended(): boolean {
		return this._renderBlended;
	}

	public set renderBlended(value: boolean) {
		this._renderBlended = value;
	}

	public get disableColor(): boolean {
		return this._disableColor;
	}

	public set disableColor(value: boolean) {
		if (this._disableColor == value)
			return;

		this._disableColor = value;

		this._invalid = true;
	}

	public get disableClear(): boolean {
		return this._disableClear;
	}

	public set disableClear(value: boolean) {
		if (this._disableClear == value)
			return;

		this._disableClear = value;

		this._invalid = true;
	}

	/**
	 *
	 */
	public get numElements(): number {
		return this._pNumElements;
	}

	public get context(): IContextGL {
		return this._context;
	}

	public getPaddedBounds(): Rectangle {
		this._updatePaddedBoundsIfNeeded();

		return this._paddedBounds;
	}

	public getBounds(): Box {
		this._updatePaddedBoundsIfNeeded();

		return this._bounds;
	}

	public getBoundsScale(): number {
		this._updatePaddedBoundsIfNeeded();

		return this._boundsScale;
	}

	/**
	 *
	 */
	public get style(): Style {
		this._updatePaddedBoundsIfNeeded();

		return this._style;
	}

	/**
	 * Re-clip against the parent cache when its pad has changed, even if this
	 * node's own unclipped pad is still valid. Hierarchical invalidation
	 * walks down from the node that changed, so a sibling that grew the
	 * parent union would otherwise leave this clip stale.
	 */
	private _updatePaddedBoundsIfNeeded(): void {
		if (!this._boundsDirty && this._parentRenderer) {
			const parentBounds = this._parentRenderer.getPaddedBounds();
			if (parentBounds.x != this._parentClipBounds.x
				|| parentBounds.y != this._parentClipBounds.y
				|| parentBounds.width != this._parentClipBounds.width
				|| parentBounds.height != this._parentClipBounds.height)
				this._boundsDirty = true;
		}

		if (this._boundsDirty)
			this._updateBounds();
	}

	public set style(value: Style) {
		if (this._style == value)
			return;

		if (this._style)
			this._style.removeEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._style = value;

		if (this._style)
			this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._onInvalidateStyle();
	}

	private _parentRenderer: RendererBase;

	public get parentRenderer(): RendererBase {
		return this._parentRenderer;
	}

	/**
	 * Attach this cache as a direct child-cache of <code>parent</code>, or
	 * pass <code>null</code> to detach. Matches ContainerNode.setParent:
	 * list membership and parent notification live here, not in a setter.
	 */
	public setParent(parent: RendererBase): void {
		if (this._parentRenderer == parent)
			return;

		if (this._parentRenderer) {
			this.removeEventListener(RendererEvent.INVALIDATE_PADS, this._parentRenderer._onChildInvalidatePads);

			const list = this._parentRenderer._childRenderers;
			const index = list.indexOf(this);
			if (index != -1) {
				const last = list.length - 1;
				list[index] = list[last];
				list.pop();
			}
			this._parentRenderer._unclippedBoundsDirty = true;
			this._parentRenderer._boundsDirty = true;
		}

		this._parentRenderer = parent;

		if (this._parentRenderer) {
			this.addEventListener(RendererEvent.INVALIDATE_PADS, this._parentRenderer._onChildInvalidatePads);

			const list = this._parentRenderer._childRenderers;
			if (list.indexOf(this) == -1)
				list.push(this);
			this._parentRenderer._unclippedBoundsDirty = true;
			this._parentRenderer._boundsDirty = true;
		}
	}

	/**
	 * True when this renderer draws the bitmap mask of its parent renderer's node.
	 * Set by the parent renderer when it hands out this renderer as a traverser.
	 */
	public isBitmapMask: boolean = false;

	/**
	 * Set by ContainerNode while it visits its bitmap mask node after its other content.
	 */
	public isBitmapMaskVisit: boolean = false;

	public rootView: View;

	/**
	 *
	 */
	public renderableSorter: IRenderEntitySorter = new RenderableMergeSort();

	public get node(): ContainerNode {
		return <ContainerNode> this._asset;
	}

	public get pool(): RenderPool {
		return <RenderPool> this._pool;
	}

	public view: View;

	public stage: Stage;

	public get blendMode(): string {
		const containerBlend = <string> this.node.container.blendMode;

		// a bitmap mask is drawn last into its owner's cached image,
		// multiplying the owner's pixels by the mask's alpha
		if (this.isBitmapMask)
			return BlendMode.ALPHA;

		// native blends
		if (isNativeBlend(containerBlend))
			return containerBlend;

		return BlendMode.LAYER;
	}

	public get useNonNativeBlend(): boolean {
		return StageSettings.USE_NON_NATIVE_BLEND
				&& (<ContainerNode> this._asset).container.blendMode
				&& (<ContainerNode> this._asset).container.blendMode !== BlendMode.NORMAL
				&& this.blendMode == BlendMode.LAYER;
	}

	constructor() {
		super();

		this.abstractions = new AbstractionSet(this);
		this._onInvalidateProperties = (_event: StyleEvent) => this._onInvalidateStyle();
		this._onSizeInvalidateDelegate = (event: ViewEvent | StageEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event: StageEvent) => this.onContextUpdate(event);
		this._onChildInvalidatePads = (_event: RendererEvent) => this.onInvalidate();
	}

	/**
	 * Creates a new RendererBase object.
	 */
	public init(node: INode, pool: RenderPool): void {
		super.init(node, pool);

		this._parentNode = node.parent;

		this.style = new Style();
		this.view = pool.view;
		this.stage = this.view.stage;
		this.rootView = this.view;

		this.stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._boundsPicker = PickGroup.getPool(this.rootView).getBoundsPicker(node);

		if (this.stage.context)
			this._context = <IContextGL> this.stage.context;
	}

	public onClear(): void {
		this.clear();

		super.onClear();

		this.stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this.setParent(null);
		this.isBitmapMask = false;

		const leftover = this._childRenderers.slice();
		this._childRenderers.length = 0;
		for (let i = 0; i < leftover.length; i++) {
			if (leftover[i].parentRenderer == this)
				leftover[i].setParent(null);
		}

		this._parentNode = null;
		this.view = null;
		this.stage = null;
		this.style = null;
		this.rootView = null;

		this._boundsPicker = null;
		this._activeMasksDirty = false;
		this._activeMaskOwners = null;
		this._renderEntity = null;

		this.abstractions.forEach((entity: RenderEntity) => entity.onClear());

		this.resetHead();

		for (const key in  this._elementsPools) {
			this._elementsPools[key].clear();
			delete this._elementsPools[key];
		}

		this._boundsDirty = true;
		this._unclippedBoundsDirty = true;

		this._disableColor = false;
		this._disableClear = false;
		this._renderBlended = true;
	}

	public onInvalidate(): void {
		super.onInvalidate();

		this._boundsDirty = true;
		this._unclippedBoundsDirty = true;

		// A bitmap mask is not parented to its owner in the partition tree,
		// so ContainerNode.invalidate() cannot reach the owner cache.
		if (this.isBitmapMask)
			this.dispatchEvent(this._invalidatePadsEvent
				|| (this._invalidatePadsEvent = new RendererEvent(RendererEvent.INVALIDATE_PADS)));
	}

	public update(node: INode): void {
		//update mappers
		const len: number = this._mappers.length;
		for (let i: number = 0; i < len; i++)
			this._mappers[i].update(this.view, node);
	}

	public _addMapper(mapper: IMapper) {
		if (this._mappers.indexOf(mapper) != -1)
			return;

		this._mappers.push(mapper);
	}

	public _removeMapper(mapper: IMapper) {
		const index: number = this._mappers.indexOf(mapper);

		if (index != -1)
			this._mappers.splice(index, 1);
	}

	public getRenderElements(elements: IAsset): _Render_ElementsBase {

		return this._elementsPools[elements.assetType]
			|| (this._elementsPools[elements.assetType] = new (RenderGroup.getRenderElementsClass(elements))(this));
	}

	public requestAbstraction(asset: IAsset): IAbstraction {
		return RendererBase._store.length ? RendererBase._store.pop() : new RenderEntity();
	}

	public storeAbstraction(abstraction: IAbstraction): void {
		RendererBase._store.push(abstraction);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public render(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0,
		mipmapSelector: number = 0, maskConfig: number = 0): void {

		//TODO refactor setTarget so that rendertextures are created before this check
		// if (!this._stage || !this._context)
		// 	return;
		this._maskConfig = maskConfig;

		//check for mask rendering
		if (this._maskConfig) {
			this._disableClear = true;
			this._disableColor = true;
		}

		this.update(<ContainerNode> this._asset);

		// invalidate mipmaps (if target exists) to regenerate if required
		if (this.view.target)
			this.view.target.invalidateMipmaps();

		// this._pRttViewProjectionMatrix.copyFrom(projection.viewMatrix3D);
		// this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		if (!StageSettings.USE_NON_NATIVE_BLEND || this._invalid)
			this.traverse();

		this.executeRender(enableDepthAndStencil, surfaceSelector, mipmapSelector);

		//line required for correct rendering when using away3d with starling.
		//DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this.view.shareContext || this.view.target) {
			if (this._snapshotRequired && this._snapshotBitmapImage2D) {
				this._context.drawToBitmapImage2D(this._snapshotBitmapImage2D);
				this._snapshotRequired = false;
			}
		}
	}

	public resetHead(): void {
		//reset head values
		this._blendedRenderables = [];
		this._opaqueRenderables = [];

	}

	public traverse(): void {
		this.resetHead();

		this._invalid = false;
		this._pNumElements = 0;
		this._activeMaskOwners = null;

		this._cameraTransform = this.view.projection.transform.matrix3D;
		this._cameraForward = this.view.projection.transform.forwardVector;
		this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : this.rootView.projection.viewFrustumPlanes;
		this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;
		this._maskId = (<ContainerNode> this._asset).getMaskId();

		RendererBase._collectionMark++;

		(<ContainerNode> this._asset).acceptTraverser(this);

		//sort the resulting renderables
		if (this.renderableSorter) {
			// this._pOpaqueRenderableHead = this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			// this._pBlendedRenderableHead = this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}
	}

	public _iRenderCascades(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0): void {
		// this._stage.setRenderTarget(target, true, 0);
		// this._context.clear(1, 1, 1, 1, 1, 0);

		// this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		// this._context.setDepthTest(true, ContextGLCompareMode.LESS);

		// var head:_Render_RenderableBase = this._pOpaqueRenderableHead;

		// var first:boolean = true;

		// //TODO cascades must have separate collectors, rather than separate draw commands
		// for (var i:number = numCascades - 1; i >= 0; --i) {
		// 	//this._stage.scissorRect = scissorRects[i];
		// 	//this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
		// 	first = false;
		// }

		// line required for correct rendering when using away3d with starling.
		// DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		// this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public executeRender(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0, mipmapSelector: number = 0): void {

		//initialise blend mode
		this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		//initialise depth test
		this._context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		//initialise color mask
		if (this._disableColor)
			this._context.setColorMask(false, false, false, false);
		else
			this._context.setColorMask(true, true, true, true);

		//TODO: allow sharedContexts for image targets
		this.view.clear(
			!this._depthPrepass && !this._disableClear,
			enableDepthAndStencil,
			surfaceSelector,
			mipmapSelector,
			(!this.view.shareContext || this.view.target)
				? ContextGLClearMask.ALL
				: ContextGLClearMask.DEPTH);

		//initialise stencil
		if (this._maskConfig)
			this._context.enableStencil();
		else
			this._context.disableStencil();

		this.drawRenderables(this._opaqueRenderables);

		if (this._renderBlended)
			this.drawRenderables(this._blendedRenderables);
	}

	/*
	 * Will draw the renderer's output on next render to the provided bitmap data.
	 * */
	public queueSnapshot(bmd: BitmapImage2D): void {
		this._snapshotRequired = true;
		this._snapshotBitmapImage2D = bmd;
	}

	//private drawCascadeRenderables(renderRenderable:_Render_RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
	//{
	//	var renderRenderable2:_Render_RenderableBase;
	//	var render:_Render_MaterialBase;
	//	var pass:IPass;
	//
	//	while (renderRenderable) {
	//		renderRenderable2 = renderRenderable;
	//		render = renderRenderable.render;
	//		pass = render.passes[0] //assuming only one pass per material
	//
	//		this.activatePass(renderRenderable, pass, camera);
	//
	//		do {
	//			// if completely in front, it will fall in a different cascade
	//			// do not use near and far planes
	//			if (!cullPlanes || renderRenderable2.node.worldBounds.isInFrustum(cullPlanes, 4)) {
	//				renderRenderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
	//			} else {
	//				renderRenderable2.cascaded = true;
	//			}
	//
	//			renderRenderable2 = renderRenderable2.next;
	//
	//		} while (renderRenderable2 && renderRenderable2.render == render && !renderRenderable2.cascaded);
	//
	//		this.deactivatePass(renderRenderable, pass);
	//
	//		renderRenderable = renderRenderable2;
	//	}
	//}

	/**
	 * Draw a list of renderables.
	 *
	 * @param renderables The renderables to draw.
	 */
	public drawRenderables(renderRenderables: _Render_RenderableBase[]): void {
		let index: number = 0;
		const len: number = renderRenderables.length;
		let renderRenderable: _Render_RenderableBase = renderRenderables[index];

		let renderMaterial: _Render_MaterialBase;
		let numPasses: number;

		let i: number;
		let r: _Render_RenderableBase;

		while (index < len) {
			renderMaterial = renderRenderable.renderMaterial;
			numPasses = renderMaterial ? renderMaterial.numPasses : 1;

			if (this._activeMasksDirty || this._checkMaskOwners(renderRenderable.entity.maskOwners)) {
				if (!(this._activeMaskOwners = renderRenderable.entity.maskOwners)) {
					//re-establish stencil settings (if not inside another mask)
					if (!this._maskConfig)
						this._context.disableStencil();
				} else {
					this._renderMasks(this._activeMaskOwners);
				}
				this._activeMasksDirty = false;
			}

			//iterate through each shader object
			for (let p: number = 0; p < numPasses; p++) {
				renderMaterial && renderMaterial.activatePass(p);

				i = index;
				r = renderRenderable;
				do {
					///console.log("maskOwners", renderRenderable2.maskOwners);
					r.draw();

					if (++i == len)
						break;

					r = renderRenderables[i];

				} while (r.renderMaterial == renderMaterial
						&& !(this._activeMasksDirty = this._checkMaskOwners(r.entity.node.getMaskOwners())));

				renderMaterial && renderMaterial.deactivatePass();
			}

			index = i;
			renderRenderable = r;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event: StageEvent): void {
		this._context = <IContextGL> this.stage.context;
	}

	/*
	 public get iBackground():Texture2DBase
	 {
	 return this._background;
	 }
	 */

	/*
	 public set iBackground(value:Texture2DBase)
	 {
	 if (this._backgroundImageRenderer && !value) {
	 this._backgroundImageRenderer.dispose();
	 this._backgroundImageRenderer = null;
	 }

	 if (!this._backgroundImageRenderer && value)
	 {

	 this._backgroundImageRenderer = new BackgroundImageRenderer(this._stage);

	 }

	 this._background = value;

	 if (this._backgroundImageRenderer)
	 this._backgroundImageRenderer.texture = value;
	 }
	 */
	/*
	 public get backgroundImageRenderer():BackgroundImageRenderer
	 {
	 return _backgroundImageRenderer;
	 }
	 */

	/**
	 *
	 */
	public onSizeInvalidate(event: ViewEvent | StageEvent): void {
		if (this._pRttBufferManager) {
			this._pRttBufferManager.viewWidth = this.view.width;
			this._pRttBufferManager.viewHeight = this.view.height;
		}

		this._depthTextureDirty = true;

		this.onInvalidate();

		// The local view's size event is not a ContainerNode invalidation,
		// so it does not bubble to the parent cache.
		if (this._parentRenderer && !this.isBitmapMask)
			this.dispatchEvent(this._invalidatePadsEvent
				|| (this._invalidatePadsEvent = new RendererEvent(RendererEvent.INVALIDATE_PADS)));
	}

	/**
	 *
	 * @param node
	 * @returns {boolean}
	 */
	public enterNode(node: INode): boolean {
		const maskOrFrustrum = (
			this._maskConfig
			|| node.isInFrustum(
				<ContainerNode> this._asset,
				this._cullPlanes,
				this._numCullPlanes,
				PickGroup.getPool(this.view)));

		const enter = node._collectionMark != RendererBase._collectionMark
			&& node.isRenderable()
			&& maskOrFrustrum
			&& node.getMaskId() == this._maskId;

		node._collectionMark = RendererBase._collectionMark;

		return enter;
	}

	public getTraverser(rootNode: ContainerNode): IPartitionTraverser | void {

		// mask nodes are only drawn by their mask renderer, or as the bitmap mask of their owner
		// when the owner visits it after all its other content (see ContainerNode.acceptTraverser)
		const isBitmapMask: boolean = this.isBitmapMaskVisit;
		if (!isBitmapMask && rootNode.getMaskId() != this._maskId)
			return;

		if (rootNode.renderToImage) {
			//new node for the container
			//const node: ContainerNode = rootNode.getLocalNode();
			const boundsPicker: BoundsPicker = PickGroup.getPool(this.rootView).getBoundsPicker(rootNode);

			// a bitmap mask covers its owner's whole image (see _updateBounds), so it is drawn
			// even when its own bounds are empty or off screen: an empty mask hides the owner
			if (!isBitmapMask
				&& !boundsPicker._isInFrustumInternal((<ContainerNode> this._asset).root, this._cullPlanes, this._numCullPlanes))
				return;

			const traverser: CacheRenderer = this._traverserGroup.getRenderer<CacheRenderer>(rootNode.getLocalView(this.stage), rootNode);

			traverser.renderableSorter = null;
			traverser.setParent(this);
			traverser.rootView = this.rootView;

			// the bounds and blend of a renderer depend on whether it draws a bitmap mask
			if (traverser.isBitmapMask != isBitmapMask) {
				traverser.isBitmapMask = isBitmapMask;
				traverser.onInvalidate();
			}

			//if (this._invalid) {
			this._renderEntity = this.abstractions.getAbstraction<RenderEntity>(rootNode);

			// project onto camera's z-axis
			this._renderEntity.zIndex = this._cameraTransform.position
				.subtract(rootNode.getPosition())
				.dotProduct(this._cameraForward) + rootNode.container.zOffset;

			//save sceneTransform
			this._renderEntity.renderSceneTransform = rootNode.getRenderMatrix3D(this._cameraTransform);

			//save colorTransform (null for CacheRenderer)
			this._renderEntity.colorTransform = ContainerNode.nullColorTransform;

			//save mask owners (null for CacheRenderer)
			this._renderEntity.maskOwners = undefined;
			//this._renderEntity.maskOwners = rootNode.getMaskOwners();

			// keep a bitmap mask image in step with the bounds of its owner
			if (isBitmapMask && !traverser.getPaddedBounds().equals(this.getPaddedBounds()))
				traverser.onInvalidate();

			//apply CacheRenderer as renderable (a bitmap mask is visited after all other content)
			this.applyTraversable(traverser);

			return traverser;
		}

		return this;
	}

	public applyEntity(node: ContainerNode): void {
		const entity = node.container.getEntity();

		if (entity) {
			this._pickEntity = PickGroup.getPool(this.rootView).abstractions.getAbstraction<PickEntity>(node);

			if (!this._pickEntity._isInFrustumInternal(<ContainerNode>(<ContainerNode> this._asset).root, this._cullPlanes, this._numCullPlanes))
				return;

			this._renderEntity = this.abstractions.getAbstraction<RenderEntity>(node);

			// project onto camera's z-axis
			this._renderEntity.zIndex = this._cameraTransform.position
				.subtract(node.getPosition())
				.dotProduct(this._cameraForward) + node.container.zOffset;

			//save sceneTransform
			this._renderEntity.renderSceneTransform = node.getRenderMatrix3D(this._cameraTransform);

			//save colorTransform
			this._renderEntity.colorTransform = node.getColorTransform();

			//save mask owners
			this._renderEntity.maskOwners = node.getMaskOwners();

			//collect renderables
			entity._acceptTraverser(this);
		} else {
			//check if we have a RenderEntity abstraction and if so, clear it!
			this.abstractions.checkAbstraction(node)?.onClear();
			PickGroup.getPool(this.rootView).abstractions.checkAbstraction(node)?.onClear();
		}
	}

	public applyTraversable(renderable: IRenderable): void {
		const renderRenderable: _Render_RenderableBase = this._renderEntity.abstractions.getAbstraction<_Render_RenderableBase>(renderable);

		//store renderable properties
		renderRenderable.cascaded = false;

		const renderMaterial: _Render_MaterialBase = renderRenderable.renderMaterial;
		renderRenderable.materialID = renderMaterial.materialID;
		renderRenderable.renderOrderId = renderMaterial.renderOrderId;

		if (renderMaterial.requiresBlending) {
			this._blendedRenderables.push(renderRenderable);
		} else {
			this._opaqueRenderables.push(renderRenderable);
		}

		//need to re-trigger stageElements getter in case animator has changed
		this._pNumElements += renderRenderable.stageElements.elements.numElements;
	}

	protected _renderMasks(maskOwners: ContainerNode[]): void {
		//calculate the bit index of maskConfig devided by two
		const halfBitIndex: number = Math.log2(this._maskConfig) >> 1;

		//create a new base and config value for the mask to be rendered
		//maskBase set to next odd significant bit
		const newMaskBase: number = this._maskConfig ? Math.pow(2, (halfBitIndex + 1) << 1) : 1;
		let newMaskConfig: number = newMaskBase;

		if (newMaskConfig > 0xff) {
			console.warn('[RenderBase] Mask bit overflow, maskConfig %d', newMaskConfig);
			return;
		}

		this._context.enableStencil();

		const numLayers: number = maskOwners.length;
		let children: INode[];
		//let children: IContainer[];
		let numChildren: number;
		let first: boolean = true;

		for (let i: number = 0; i < numLayers; ++i) {
			children = maskOwners[i].getMasks();
			numChildren = children.length;

			if (numChildren) {
				this._context.setStencilActions(
					ContextGLTriangleFace.FRONT_AND_BACK,
					(first) ? ContextGLCompareMode.ALWAYS
						: ContextGLCompareMode.EQUAL,
					ContextGLStencilAction.SET,
					ContextGLStencilAction.SET,
					ContextGLStencilAction.KEEP);

				first = false;

				//flips between read odd write even to read even write odd
				this._context.setStencilReferenceValue(
					0xFF,
					newMaskConfig,
					newMaskConfig = (newMaskConfig & newMaskBase) + newMaskBase);

				//clears write mask to zero
				this._context.clear(0, 0, 0, 0, 0, 0, ContextGLClearMask.STENCIL);
				// for (let j: number = 0; j < numChildren; ++j)
				// 	this._maskGroup.getRenderer(this.view.getNode(children[j])).render(true, 0, 0, newMaskConfig);
				for (let j: number = 0; j < numChildren; ++j)
					this._maskGroup.getRenderer(this.view, children[j]).render(true, 0, 0, newMaskConfig);

			}
		}

		if (!first) {
			this._context.setStencilActions(
				ContextGLTriangleFace.FRONT_AND_BACK,
				ContextGLCompareMode.EQUAL,
				ContextGLStencilAction.SET,
				ContextGLStencilAction.SET,
				ContextGLStencilAction.KEEP);
		}

		//reads from mask output, writes to previous mask state
		this._context.setStencilReferenceValue(0xFF, newMaskConfig, this._maskConfig);

		//re-establish color mask settings (if not inside another mask)
		if (!this._disableColor) {
			this._context.setColorMask(true, true, true, true);
		}
	}

	private _checkMaskOwners(maskOwners: ContainerNode[]): boolean {
		if (this._activeMaskOwners == null || maskOwners == null)
			return Boolean(this._activeMaskOwners != maskOwners);

		if (this._activeMaskOwners.length != maskOwners.length)
			return true;

		const numLayers: number = maskOwners.length;
		let numMasks: number;
		let masks: INode[];
		let activeNumMasks: number;
		let activeMasks: INode[];

		for (let i: number = 0; i < numLayers; i++) {
			masks = maskOwners[i].getMasks();
			numMasks = masks.length;
			activeMasks = this._activeMaskOwners[i].getMasks();
			activeNumMasks = activeMasks.length;
			if (activeNumMasks != numMasks)
				return true;

			for (let j: number = 0; j < numMasks; j++) {
				if (activeMasks[j] != masks[j])
					return true;
			}
		}

		return false;
	}

	public _onInvalidateStyle(): void {
		for (const key in this._renderObjects)
			this._renderObjects[key]._onInvalidateStyle();
	}

	/**
	 * Geometric bounds plus own and descendant filter padding, in scaled root
	 * space, with no parent or viewport clip. A parent renderer unions this
	 * rectangle instead of walking the node's descendants. Must not read
	 * parentRenderer.getPaddedBounds(): the parent computes its unclipped pad
	 * first, then the child applies the parent clip in _updateBounds.
	 */
	public getUnclippedPaddedBounds(): Rectangle {
		if (!this._unclippedBoundsDirty)
			return this._unclippedPaddedBounds;

		this._unclippedBoundsDirty = false;

		const node: ContainerNode = <ContainerNode> this._asset;
		const matrix3D = this._renderMatrix;
		const container = node.container;
		const rootView = this.rootView;
		const pad = this._unclippedPaddedBounds;

		const scale = this._boundsScale = Math.min(3, rootView.height * this.stage.pixelRatio * rootView.projection.scale / 1000);

		matrix3D.identity();

		if (scale !== 1)
			matrix3D.appendScale(scale, scale, scale);

		const bounds = this._boundsPicker.getBoxBounds(node.root, true, true);

		if (bounds) {
			this._bounds.copyFrom(bounds);
			matrix3D.transformBox(this._bounds, this._bounds);
			pad.setTo(
				this._bounds.x,
				this._bounds.y,
				this._bounds.width,
				this._bounds.height
			);
		} else {
			// Empty subtree: no geometry yet (empty cache, empty filtered
			// sprite, or a node just after reparent). Resolve to an empty
			// pad that a parent union ignores, then still fold in any
			// child caches that do have content.
			pad.setTo(0, 0, 0, 0);
		}

		matrix3D.invert();

		const children = this._childRenderers;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.isBitmapMask)
				continue;

			const childPad = child.getUnclippedPaddedBounds();

			// An empty child pad must not pull the union to the origin.
			if (childPad.width == 0 && childPad.height == 0)
				continue;

			if (childPad.left < pad.left)
				pad.left = childPad.left;
			if (childPad.top < pad.top)
				pad.top = childPad.top;
			if (childPad.right > pad.right)
				pad.right = childPad.right;
			if (childPad.bottom > pad.bottom)
				pad.bottom = childPad.bottom;
		}

		if (container.filters && container.filters.length > 0 && (pad.width != 0 || pad.height != 0)) {
			container.filters.forEach((e) => e && (e.imageScale = scale));
			this.stage.filterManager.computeFiltersPadding(pad, container.filters, pad);
		}

		return pad;
	}

	protected _updateBounds(): void {
		this._boundsDirty = false;

		const matrix3D = this._renderMatrix;
		const rootView = this.rootView;
		const pad = this._paddedBounds;

		const scale = this._boundsScale = Math.min(3, rootView.height * this.stage.pixelRatio * rootView.projection.scale / 1000);

		// Every renderer stores _bounds / _paddedBounds in scaled root space,
		// including the root. Children used to apply only identity * scale here,
		// while the root also multiplied in the view's inverse camera transform,
		// so getPaddedBounds() meant something different for a root parent and
		// each child had to map those bounds back. Compute both the same way.
		matrix3D.identity();

		if (scale !== 1)
			matrix3D.appendScale(scale, scale, scale);

		if (this.isBitmapMask) {
			// a bitmap mask covers the whole image of its owner, so that owner pixels
			// outside the mask's own bounds are multiplied by zero alpha.
			// Its own bounds are not needed, so skip computing them.
			matrix3D.invert();
			pad.copyFrom(this.parentRenderer.getPaddedBounds());
			this._parentClipBounds.copyFrom(pad);
			return;
		}

		if (this._unclippedBoundsDirty) {
			this.getUnclippedPaddedBounds();
		} else {
			// _initRender expects the inverted scale matrix left by a bounds update.
			matrix3D.invert();
		}

		if (this.useNonNativeBlend) {
			//set to bounds of parent
			const parentBounds = this.parentRenderer.getPaddedBounds();

			pad.setTo(
				parentBounds.x,
				parentBounds.y,
				parentBounds.width,
				parentBounds.height
			);

			this._style.image = <Image2D> this.parentRenderer.style.image;
			this._style.sampler = new ImageSampler(false, false, false);
			this._parentClipBounds.copyFrom(parentBounds);
			return;
		}

		pad.copyFrom(this._unclippedPaddedBounds);

		// Empty content stays 0x0. The 2px safety and parent/viewport clip
		// would turn a point pad into a negative rectangle when the clip
		// does not contain the origin.
		if (pad.width == 0 && pad.height == 0)
			return;

		// 2px safety (or ALPHA snap) belongs on this cache's RTT, not on the
		// unclipped pad a parent unions, or the parent would pad twice.
		if (this.blendMode == BlendMode.ALPHA) {
			// no transparent padding for ALPHA, as it would clear the pixels underneath it
			pad.width = Math.ceil(pad.right) - (pad.x = Math.floor(pad.x));
			pad.height = Math.ceil(pad.bottom) - (pad.y = Math.floor(pad.y));
		} else {
			pad.x = (pad.x - 2) | 0;
			pad.y = (pad.y - 2) | 0;
			pad.width = (pad.width + 4) | 0;
			pad.height = (pad.height + 4) | 0;
		}

		let parentBounds: Rectangle;
		if (this._parentNode) {
			// Parent pad is already in scaled root space (root and children alike).
			parentBounds = this.parentRenderer.getPaddedBounds();
		} else {
			// No parent cache: clip against the viewport, mapped from view
			// space into scaled root space so a view with a 2d matrix or
			// y-flip (e.g. SceneImage2D.draw) still clips against the visible
			// rectangle rather than a transformed one.
			const box: Box = RendererBase._tmpBox;
			const map: Matrix3D = RendererBase._tmpMatrix3D;

			box.x = 0;
			box.y = 0;
			box.z = 0;
			box.width = this.view.width * this.stage.pixelRatio;
			box.height = this.view.height * this.stage.pixelRatio;
			box.depth = 0;

			map.copyFrom(this.view.projection.transform.inverseMatrix3D);

			if (this._boundsScale !== 1)
				map.appendScale(this._boundsScale, this._boundsScale, this._boundsScale);

			map.invert();

			if (scale !== 1)
				map.appendScale(scale, scale, scale);

			map.transformBox(box, box);

			parentBounds = RendererBase._tmpViewportBounds;
			parentBounds.setTo(box.x, box.y, box.width, box.height);
		}

		if (pad.left < parentBounds.left)
			pad.left = parentBounds.left;

		if (pad.top < parentBounds.top)
			pad.top = parentBounds.top;

		if (pad.right > parentBounds.right)
			pad.right = parentBounds.right;

		if (pad.bottom > parentBounds.bottom)
			pad.bottom = parentBounds.bottom;

		this._parentClipBounds.copyFrom(parentBounds);
	}

	/**
	 * Rebuilds the direct child-cache list from descendants that render to an
	 * image. Nested caches are not entered: their pads already include their
	 * own descendants. Mask nodes are skipped, matching BoundsPicker, because
	 * they are not drawn into the owner's cache. Called from init, and from
	 * onInvalidate / render when INVALIDATE_STRUCTURE has marked the list
	 * dirty, not from _updateBounds.
	 */
	protected _syncChildRenderers(): void {
		const mark = ++RendererBase._childSyncMark;
		const root: ContainerNode = <ContainerNode> this._asset;
		const stack = RendererBase._syncStack;
		// A nested sync (a new child's init) must not empty this walk.
		const base = stack.length;

		for (let i = 0; i < root.numChildNodes; i++)
			stack.push(root.getChildAt(i));

		while (stack.length > base) {
			const child = stack.pop();
			if (child.getMaskId() != -1)
				continue;

			if (child.renderToImage) {
				const renderer: RendererBase = this._traverserGroup.getRenderer(child.getLocalView(this.stage), child);
				renderer.setParent(this);
				renderer._syncMark = mark;
			} else {
				for (let i = child.numChildNodes - 1; i >= 0; i--)
					stack.push(child.getChildAt(i));
			}
		}

		const list = this._childRenderers;
		let write = 0;
		for (let i = 0; i < list.length; i++) {
			const child = list[i];
			// Bitmap-mask renderers are not visited by the walk (mask nodes
			// are skipped), so they never receive _syncMark. Keep them: the
			// union already ignores isBitmapMask, and dropping them would
			// null parentRenderer, crashing the next getPaddedBounds().
			if (child._syncMark == mark || child.isBitmapMask) {
				list[write++] = child;
			} else if (child._parentRenderer == this) {
				child.setParent(null);
			}
		}
		list.length = write;

		this._childListDirty = false;
		this._unclippedBoundsDirty = true;
		this._boundsDirty = true;
	}

	public _initRender(target: Image2D) {
		const pad = this._paddedBounds;
		const scale = this._boundsScale;
		const matrix3D = this._renderMatrix;
		const view = this.view;
		const proj = view.projection;

		matrix3D._rawData[14] = -1000;

		// without this we will handle empty image when target is big (scale > +3)
		proj.far = 4000;
		proj.near = 1;
		proj.transform.matrix3D = matrix3D;
		proj.ratio = (target.width / target.height);
		proj.originX = -1 - 2 * pad.x / target.width;
		proj.originY = -1 - 2 * pad.y / target.height;
		proj.scale = scale * 1000 / target.height;

		view.target = target;
	}
}
