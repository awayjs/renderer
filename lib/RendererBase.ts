import {
	Matrix3D,
	Plane3D,
	Vector3D,
	AbstractionBase,
	AssetEvent,
	IAsset,
	IAbstractionClass,
	Box,
	Rectangle,
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
	PartitionBase,
	ITraversable,
	EntityNode,
	ContainerNode,
	BoundsPicker,
	PickGroup,
} from '@awayjs/view';

import { Settings } from './Settings';
import { _Render_MaterialBase } from './base/_Render_MaterialBase';
import { _Render_RenderableBase } from './base/_Render_RenderableBase';
import { RenderEntity } from './base/RenderEntity';
import { IMapper } from './base/IMapper';
import { RenderGroup } from './RenderGroup';

import { IRenderEntitySorter } from './sort/IRenderEntitySorter';
import { RenderableMergeSort } from './sort/RenderableMergeSort';
import { IRenderable } from './base/IRenderable';
import { CacheRenderer } from './CacheRenderer';
import { _Render_ElementsBase } from './base/_Render_ElementsBase';
import { Style } from './base/Style';
import { StyleEvent } from './events/StyleEvent';
import { RenderableEvent } from './events/RenderableEvent';

/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export class RendererBase extends AbstractionBase implements IPartitionTraverser, IEntityTraverser {
	public static _collectionMark = 0;

	protected _renderMatrix: Matrix3D = new Matrix3D();
	protected _node: ContainerNode;
	protected _parentNode: ContainerNode;
	private _boundsPicker: BoundsPicker;
	/*internal*/ _boundsScale: number = 1;
	private _enableDepthAndStencil: boolean;
	private _surfaceSelector: number;
	private _mipmapSelector: number;
	private _maskConfig: number;
	private _maskId: number;
	private _activeMasksDirty: boolean;
	private _activeMaskOwners: ContainerNode[];
	private _paddedBounds: Rectangle = new Rectangle();
	private _bounds: Box = new Box();
	protected _style: Style;
	private _boundsDirty: boolean = true;
	private _mappers: Array<IMapper> = new Array<IMapper>();
	private _elementsPools: Record<string, _Render_ElementsBase> = {};
	private _entityMaskId: number;
	private _entityMaskOwners: ContainerNode[];

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
	private _onSizeInvalidateDelegate: (event: ViewEvent) => void;

	public _pNumElements: number = 0;

	protected _opaqueRenderables: IRenderable[];
	protected _blendedRenderables: IRenderable[];
	public _disableColor: boolean = false;
	public _disableClear: boolean = false;
	public _renderBlended: boolean = true;
	private _cullPlanes: Array<Plane3D>;
	private _customCullPlanes: Array<Plane3D>;
	private _numCullPlanes: number = 0;
	protected _traverserGroup: RenderGroup;
	protected _maskGroup: RenderGroup;
	private _renderEntity: RenderEntity;
	private _zIndex: number;
	private _renderSceneTransform: Matrix3D;

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
		if (this._boundsDirty)
			this._updateBounds();

		return this._paddedBounds;
	}

	public getBounds(): Box {
		if (this._boundsDirty)
			this._updateBounds();

		return this._bounds;
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

	public parentRenderer: RendererBase;

	/**
	 *
	 */
	public renderableSorter: IRenderEntitySorter = new RenderableMergeSort();

	public readonly view: View;

	public readonly stage: Stage;

	public get blendMode(): string {
		const containerBlend = <string> this._node.container.blendMode;

		// native blends
		if (isNativeBlend(containerBlend))
			return containerBlend;

		return BlendMode.LAYER;
	}

	public get useNonNativeBlend(): boolean {
		return StageSettings.USE_NON_NATIVE_BLEND
				&& this._node.container.blendMode
				&& this._node.container.blendMode !== BlendMode.LAYER
				&& this.blendMode == BlendMode.LAYER;
	}

	/**
	 * Creates a new RendererBase object.
	 */
	constructor(
		public readonly partition: PartitionBase,
		public readonly group: RenderGroup
	) {
		super(partition, group);

		this._node = partition.rootNode;
		this._parentNode = partition.parent?.rootNode;

		this._onInvalidateProperties = (_event: StyleEvent) => this._invalidateStyle();
		this._onSizeInvalidateDelegate = (event: ViewEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event: StageEvent) => this.onContextUpdate(event);

		this.style = new Style();
		this.view = this.partition.rootNode.view;
		this.stage = this.view.stage;

		this.stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._boundsPicker = PickGroup.getInstance().getBoundsPicker(this.partition);

		if (this.stage.context)
			this._context = <IContextGL> this.stage.context;
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this.stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this.stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this.view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._onContextUpdateDelegate = null;
		this._onSizeInvalidateDelegate = null;

		for (const key in  this._elementsPools) {
			this._elementsPools[key].clear();
			delete this._elementsPools[key];
		}
	}

	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);

		this._boundsDirty = true;
	}

	public update(partition: PartitionBase): void {
		//update mappers
		const len: number = this._mappers.length;
		for (let i: number = 0; i < len; i++)
			this._mappers[i].update(partition);
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

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return RenderEntity;
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

		this._enableDepthAndStencil = enableDepthAndStencil;
		this._surfaceSelector = surfaceSelector;
		this._mipmapSelector = mipmapSelector;
		this._maskConfig = maskConfig;

		//check for mask rendering
		if (this._maskConfig) {
			this._disableClear = true;
			this._disableColor = true;
		}

		this.update(this.partition);

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
		this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : this.view.projection.viewFrustumPlanes;
		this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;
		this._maskId = this.partition.rootNode.getMaskId();

		RendererBase._collectionMark++;

		this.partition.traverse(this);

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

		//TODO: allow sharedContexts for image targets
		this.view.clear(
			!this._depthPrepass && !this._disableClear,
			enableDepthAndStencil,
			surfaceSelector,
			mipmapSelector,
			(!this.view.shareContext || this.view.target)
				? ContextGLClearMask.ALL
				: ContextGLClearMask.DEPTH);

		//initialise blend mode
		this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		//initialise depth test
		this._context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		//initialise color mask
		if (this._disableColor)
			this._context.setColorMask(false, false, false, false);
		else
			this._context.setColorMask(true, true, true, true);

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
	public drawRenderables(renderRenderables: IRenderable[]): void {
		let index: number = 0;
		const len: number = renderRenderables.length;
		let renderRenderable: IRenderable = renderRenderables[index];

		let renderMaterial: _Render_MaterialBase;
		let numPasses: number;

		let i: number;
		let r: IRenderable;

		while (index < len) {
			renderMaterial = renderRenderable.renderMaterial;
			numPasses = renderMaterial ? renderMaterial.numPasses : 1;

			if (this._activeMasksDirty || this._checkMaskOwners(renderRenderable.maskOwners)) {
				if (!(this._activeMaskOwners = renderRenderable.maskOwners)) {
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
					r.executeRender(
						this._enableDepthAndStencil,
						this._surfaceSelector,
						this._mipmapSelector,
						this._maskConfig);

					if (++i == len)
						break;

					r = renderRenderables[i];

				} while (r.renderMaterial == renderMaterial
						&& !(this._activeMasksDirty = this._checkMaskOwners(r.maskOwners)));

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
	public onSizeInvalidate(event: ViewEvent): void {
		if (this._pRttBufferManager) {
			this._pRttBufferManager.viewWidth = this.view.width;
			this._pRttBufferManager.viewHeight = this.view.height;
		}

		this._depthTextureDirty = true;
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
				this.partition.rootNode,
				this._cullPlanes,
				this._numCullPlanes,
				PickGroup.getInstance()));

		const enter = node._collectionMark != RendererBase._collectionMark
			&& node.isRenderable()
			&& maskOrFrustrum
			&& node.getMaskId() == this._maskId;

		node._collectionMark = RendererBase._collectionMark;

		return enter;
	}

	public getTraverser(partition: PartitionBase): IPartitionTraverser {

		if (partition.rootNode.renderToImage) {
			//new node for the container
			const node: ContainerNode = partition.getLocalNode();
			const boundsPicker: BoundsPicker = PickGroup.getInstance().getBoundsPicker(node.partition);

			if (!boundsPicker.getBoxBounds(node, true, true))
				return this;

			const traverser: CacheRenderer = this._traverserGroup.getRenderer<CacheRenderer>(node.partition);

			traverser.renderableSorter = null;
			traverser.parentRenderer = this;
			//if (this._invalid) {
			this._renderEntity = traverser.getAbstraction<RenderEntity>(this);

			// project onto camera's z-axis
			this._zIndex = this._cameraTransform.position.subtract(partition.rootNode.getPosition())
				.dotProduct(this._cameraForward)
					+ partition.rootNode.container.zOffset;

			//save sceneTransform
			this._renderSceneTransform = partition.rootNode.getRenderMatrix3D(this._cameraTransform);

			//save mask id
			this._entityMaskId = partition.rootNode.getMaskId();
			this._entityMaskOwners = partition.rootNode.getMaskOwners();

			this.applyTraversable(traverser);
			//}

			return traverser;
		}

		return this;
	}

	public applyEntity(node: EntityNode): void {
		this._renderEntity = node.getAbstraction<RenderEntity>(this);

		// project onto camera's z-axis
		this._zIndex = this._cameraTransform.position.subtract(node.parent.getPosition())
			.dotProduct(this._cameraForward)
			+ node.parent.container.zOffset;

		//save sceneTransform
		this._renderSceneTransform = node.parent.getRenderMatrix3D(this._cameraTransform);

		//save mask id
		this._entityMaskId = node.parent.getMaskId();
		this._entityMaskOwners = node.parent.getMaskOwners();

		//collect renderables
		node.entity._acceptTraverser(this);
	}

	public applyTraversable(traversable: ITraversable): void {
		const renderRenderable: IRenderable = traversable.getAbstraction<_Render_RenderableBase>(this._renderEntity);

		//store renderable properties
		renderRenderable.renderer = this;
		renderRenderable.cascaded = false;
		renderRenderable.zIndex = this._zIndex;
		renderRenderable.maskId = this._entityMaskId;
		renderRenderable.maskOwners = this._entityMaskOwners;
		renderRenderable.renderSceneTransform = this._renderSceneTransform;

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
		let numChildren: number;
		let mask: INode;
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

				for (let j: number = 0; j < numChildren; ++j) {
					mask = children[j];
					//todo: figure out why masks can be null here
					if (mask)
						this._maskGroup.getRenderer(mask.partition).render(true, 0, 0, newMaskConfig);
				}
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

	private _invalidateStyle(): void {
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_STYLE, this));
	}

	protected _updateBounds(): void {
		this._boundsDirty = false;

		const matrix3D = this._renderMatrix;
		const container = this._node.container;
		const pad = this._paddedBounds;

		let scale: number;

		if (this._parentNode) {
			scale = Math.min(3, this._parentNode.view.projection.scale);
			matrix3D.copyFrom(this._parentNode.getMatrix3D());
		} else {
			// no parent - no transform
			scale = Math.min(3, this._node.view.projection.scale);
			matrix3D.identity() ;
		}
		//scale = 1;
		this._boundsScale = scale;

		if (scale !== 1)
			matrix3D.appendScale(scale, scale, scale);

		const bounds = this._boundsPicker.getBoxBounds(this._node, true, true);

		if (!bounds) {
			console.error('[CachedRenderer] Bounds invalid, supress calculation', this._node);
			return;
		}

		if (isNaN(bounds.width) || isNaN(bounds.height)) {
			console.error('[CachedRenderer] Bounds invalid (NaN), supress calculation', this._node);
			return;
		}

		this._bounds.copyFrom(bounds);

		matrix3D.transformBox(this._bounds, this._bounds);
		matrix3D.invert();

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
			this._style.sampler = new ImageSampler(false, Settings.SMOOTH_CACHED_IMAGE, false);
		} else {
			pad.setTo(
				this._bounds.x,
				this._bounds.y,
				this._bounds.width,
				this._bounds.height
			);

			if (container.filters && container.filters.length > 0) {
				container.filters.forEach((e) => e && (e.imageScale = scale));
				this.stage.filterManager.computeFiltersPadding(pad, container.filters, pad);
			}

			pad.x = (pad.x - 2) | 0;
			pad.y = (pad.y - 2) | 0;
			pad.width = (pad.width + 4) | 0;
			pad.height = (pad.height + 4) | 0;

			const image =  <Image2D> this._style.image;

			if (pad.width * pad.height == 0) {
				throw new Error('Cannot have image with size 0 * 0');
			}

			if (image) {
				(<Image2D> this._style.image)._setSize(pad.width, pad.height);
			} else {

				this._style.image = new Image2D(pad.width, pad.height, false);
				this._style.sampler = new ImageSampler(false, Settings.SMOOTH_CACHED_IMAGE, false);
				//this._view.target = this._style.image;
			}
		}

	}

	public _initRender(target: Image2D) {
		const pad = this._paddedBounds;
		const scale = this._boundsScale;
		const matrix3D = this._renderMatrix;
		const ox = 0;//pad.x - this._bounds.x;
		const oy = 0;//pad.y - this._bounds.y;
		const view = this.view;
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
}