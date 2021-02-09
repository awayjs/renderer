import {
	Matrix3D,
	Plane3D,
	Vector3D,
	ProjectionBase,
	AbstractionBase,
	AssetEvent,
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
} from '@awayjs/stage';

import {
	View,
	ViewEvent,
	IPartitionTraverser,
	IEntityTraverser,
	INode,
	PartitionBase,
	IPartitionEntity,
	ITraversable,
	EntityNode,
	ContainerNode,
} from '@awayjs/view';

import { _Render_MaterialBase } from './base/_Render_MaterialBase';
import { _Render_RenderableBase } from './base/_Render_RenderableBase';
import { RenderEntity } from './base/RenderEntity';
import { IRendererPool, RenderGroup } from './RenderGroup';

import { IRenderEntity } from './base/IRenderEntity';
import { IRenderEntitySorter } from './sort/IRenderEntitySorter';
import { RenderableMergeSort } from './sort/RenderableMergeSort';
import { IRenderable } from './base/IRenderable';
import { _Stage_ElementsBase } from './base/_Stage_ElementsBase';

/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export class RendererBase extends AbstractionBase implements IPartitionTraverser, IEntityTraverser, IRenderable {
	public static _collectionMark = 0;
	private _enableDepthAndStencil: boolean;
	private _surfaceSelector: number;
	private _mipmapSelector: number;
	private _maskConfig: number;
	private _maskId: number;
	private _activeMasksDirty: boolean;
	private _activeMaskOwners: ContainerNode[];

	protected _partition: PartitionBase;
	protected _context: IContextGL;
	protected _stage: Stage;
	protected _view: View;

	public _cameraTransform: Matrix3D;
	private _cameraForward: Vector3D = new Vector3D();

	public _pRttBufferManager: RTTBufferManager;

	protected _depthTextureDirty: boolean = true;
	protected _depthPrepass: boolean = false;

	private _snapshotBitmapImage2D: BitmapImage2D;
	private _snapshotRequired: boolean;

	private _onContextUpdateDelegate: (event: StageEvent) => void;
	private _onSizeInvalidateDelegate: (event: ViewEvent) => void;

	public _pNumElements: number = 0;

	public _pOpaqueRenderableHead: IRenderable;
	public _pBlendedRenderableHead: IRenderable;
	public _disableColor: boolean = false;
	public _disableClear: boolean = false;
	public _renderBlended: boolean = true;
	private _cullPlanes: Array<Plane3D>;
	private _customCullPlanes: Array<Plane3D>;
	private _numCullPlanes: number = 0;
	private _sourceEntity: EntityNode;
	protected _renderGroup: RenderGroup;
	private _renderEntity: RenderEntity;
	private _zIndex: number;
	private _renderSceneTransform: Matrix3D;

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

	public next: IRenderable;

	public sourceEntity: ContainerNode;

	public renderMaterial: _Render_MaterialBase;

	public stageElements: _Stage_ElementsBase;

	public get maskOwners(): ContainerNode[] {
		return this.sourceEntity.getMaskOwners();
	}

	public get partition(): PartitionBase {
		return this._partition;
	}

	public get renderGroup(): RenderGroup {
		return this._renderGroup;
	}

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

	/**
	 *
	 */
	public renderableSorter: IRenderEntitySorter;

	/**
	 * Creates a new RendererBase object.
	 */
	constructor(partition: PartitionBase, pool: IRendererPool) {
		super(partition, pool);

		this._partition = partition;
		this.sourceEntity = partition.rootNode;
		this._maskId = partition.rootNode.getMaskId();

		this._onSizeInvalidateDelegate = (event: ViewEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event: StageEvent) => this.onContextUpdate(event);

		//default sorting algorithm
		this.renderableSorter = new RenderableMergeSort();

		this._renderGroup = pool.renderGroup;
		this._renderGroup.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._renderGroup.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._renderGroup.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._view = this._renderGroup.view;
		this._stage = this._renderGroup.stage;

		if (this._stage.context)
			this._context = <IContextGL> this._stage.context;
	}

	public get context(): IContextGL {
		return this._context;
	}

	/**
	 * The Stage that will provide the ContextGL used for rendering.
	 */
	public get stage(): Stage {
		return this._stage;
	}

	public get view(): View {
		return this._view;
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this._renderGroup.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._renderGroup.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._renderGroup.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._onContextUpdateDelegate = null;
		this._onSizeInvalidateDelegate = null;
		this._view = null;
		this._stage = null;
		this._context = null;

		this.next = null;
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

		this._renderGroup.update(this._partition);

		// invalidate mipmaps (if target exists) to regenerate if required
		if (this._view.target)
			this._view.target.invalidateMipmaps();

		// this._pRttViewProjectionMatrix.copyFrom(projection.viewMatrix3D);
		// this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		//TODO: allow sharedContexts for image targets
		this._view.clear(
			!this._depthPrepass && !this._disableClear,
			enableDepthAndStencil,
			surfaceSelector,
			mipmapSelector,
			(!this._view.shareContext || this._view.target)
				? ContextGLClearMask.ALL
				: ContextGLClearMask.DEPTH);

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		//initialise blend mode
		this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		//initialise depth test
		this._context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		this.executeRender(enableDepthAndStencil, surfaceSelector, mipmapSelector);

		//line required for correct rendering when using away3d with starling.
		//DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this._view.shareContext || this._view.target) {
			if (this._snapshotRequired && this._snapshotBitmapImage2D) {
				this._context.drawToBitmapImage2D(this._snapshotBitmapImage2D);
				this._snapshotRequired = false;
			}
		}
	}

	public traverse(): void {
		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumElements = 0;
		this._activeMaskOwners = null;

		this._cameraTransform = this._view.projection.transform.matrix3D;
		this._cameraForward = this._view.projection.transform.forwardVector;
		this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : this._view.projection.viewFrustumPlanes;
		this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;

		RendererBase._collectionMark++;

		this._partition.traverse(this);

		//sort the resulting renderables
		if (this.renderableSorter) {
			this._pOpaqueRenderableHead = this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}

		this._invalid = false;
	}

	public _iRenderCascades(
		projection: ProjectionBase, node: INode,
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

		//if (this._invalid) TODO: this is not triggering as often as it should
		this.traverse();

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

		this.drawRenderables(this._pOpaqueRenderableHead);

		if (this._renderBlended)
			this.drawRenderables(this._pBlendedRenderableHead);
	}

	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);

		this._renderGroup.invalidate();
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
	//			if (!cullPlanes || renderRenderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
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
	public drawRenderables(renderRenderable: IRenderable): void {
		let i: number;
		let r: IRenderable;
		let renderMaterial: _Render_MaterialBase;
		let numPasses: number;

		while (renderRenderable) {
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
			for (i = 0; i < numPasses; i++) {
				renderMaterial && renderMaterial.activatePass(i);

				r = renderRenderable;
				do {
					///console.log("maskOwners", renderRenderable2.maskOwners);
					r.executeRender(
						this._enableDepthAndStencil,
						this._surfaceSelector,
						this._mipmapSelector,
						this._maskConfig);

					r = r.next;

				} while (r
						&& r.renderMaterial == renderMaterial
						&& !(this._activeMasksDirty = this._checkMaskOwners(r.maskOwners)));

				renderMaterial && renderMaterial.deactivatePass();
			}

			renderRenderable = r;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event: StageEvent): void {
		this._context = <IContextGL> this._stage.context;
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
			this._pRttBufferManager.viewWidth = this._view.width;
			this._pRttBufferManager.viewHeight = this._view.height;
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
				this._partition.rootNode,
				this._cullPlanes,
				this._numCullPlanes,
				this._renderGroup.pickGroup));

		const enter = node._collectionMark != RendererBase._collectionMark
			&& node.isRenderable()
			&& maskOrFrustrum
			&& node.getMaskId() == this._maskId;

		node._collectionMark = RendererBase._collectionMark;

		return enter;
	}

	public getTraverser(partition: PartitionBase): IPartitionTraverser {
		// var traverser:RendererBase = this._renderGroup.getRenderer(partition);
		// traverser.renderableSorter = null;
		// traverser.disableClear = true;

		// if (this._invalid) {
		// 	traverser.next = this._pBlendedRenderableHead;
		// 	this._pBlendedRenderableHead = traverser;
		// }

		return this;
	}

	public applyEntity(entity: EntityNode): void {
		this._sourceEntity = entity;
		this._renderEntity = entity.getAbstraction<RenderEntity>(this._renderGroup);

		// project onto camera's z-axis
		this._zIndex = this._cameraTransform.position.subtract(this._sourceEntity.parent.getPosition()).dotProduct(this._cameraForward);
		this._zIndex += (<IRenderEntity> this._sourceEntity.entity).zOffset;

		//save sceneTransform
		this._renderSceneTransform = this._sourceEntity.parent.getRenderMatrix3D(this._cameraTransform);

		//collect renderables
		this._sourceEntity.entity._acceptTraverser(this);
	}

	public applyTraversable(traversable: ITraversable): void {
		const renderRenderable: _Render_RenderableBase = traversable.getAbstraction(this._renderEntity);

		//set local vars for faster referencing
		renderRenderable.cascaded = false;

		renderRenderable.zIndex = this._zIndex;
		renderRenderable.maskId = this._sourceEntity.parent.getMaskId();
		renderRenderable.maskOwners = this._sourceEntity.parent.getMaskOwners();

		const renderMaterial: _Render_MaterialBase = renderRenderable.renderMaterial;
		renderRenderable.materialID = renderMaterial.materialID;
		renderRenderable.renderOrderId = renderMaterial.renderOrderId;

		//store reference to scene transform
		renderRenderable.renderSceneTransform = this._renderSceneTransform;

		if (renderMaterial.requiresBlending) {
			renderRenderable.next = this._pBlendedRenderableHead;
			this._pBlendedRenderableHead = renderRenderable;
		} else {
			renderRenderable.next = this._pOpaqueRenderableHead;
			this._pOpaqueRenderableHead = renderRenderable;
		}

		//need to re-trigger stageElements getter in case animator has changed
		this._pNumElements += renderRenderable.stageElements.elements.numElements;
	}

	public _renderMasks(maskOwners: ContainerNode[]): void {
		//calculate the bit index of maskConfig devided by two
		const halfBitIndex: number = Math.log2(this._maskConfig) >> 1;

		//create a new base and config value for the mask to be rendered
		//maskBase set to next odd significant bit
		const newMaskBase: number = this._maskConfig ? Math.pow(2, (halfBitIndex + 1) << 1) : 1;
		let newMaskConfig: number = newMaskBase;

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
						this._renderGroup.getRenderer(mask.partition).render(true, 0, 0, newMaskConfig);
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
}