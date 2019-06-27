import {Matrix3D, Plane3D, Vector3D, ProjectionBase} from "@awayjs/core";

import {BitmapImage2D, ContextGLProfile, ContextMode, ContextGLBlendFactor, ContextGLCompareMode, ContextGLStencilAction, ContextGLTriangleFace, IContextGL, Stage, StageEvent, ContextGLClearMask} from "@awayjs/stage";

import {View, ViewEvent, IPartitionTraverser, IEntityTraverser, INode, PartitionBase, PickGroup, IPartitionEntity, ITraversable} from "@awayjs/view";

import {_Render_MaterialBase} from "./base/_Render_MaterialBase";
import {_Render_RenderableBase} from "./base/_Render_RenderableBase";
import {RenderEntity} from "./base/RenderEntity";
import {IMapper} from "./base/IMapper";
import {RenderGroup} from "./RenderGroup";

import {IRenderEntity} from "./base/IRenderEntity";
import {IPass} from "./base/IPass";
import {RTTBufferManager} from "./managers/RTTBufferManager";
import {IRenderEntitySorter} from "./sort/IRenderEntitySorter";
import {RenderableMergeSort} from "./sort/RenderableMergeSort";


/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export class RendererBase implements IPartitionTraverser, IEntityTraverser
{
	public static _collectionMark = 0;

	public _pickGroup:PickGroup;
    private _mappers:Array<IMapper> = new Array<IMapper>();
	private _maskConfig:number;
	private _activeMasksDirty:boolean;
	private _activeMaskOwners:Array<IPartitionEntity> = new Array<IPartitionEntity>();
	private _registeredMasks : Array<_Render_RenderableBase> = new Array<_Render_RenderableBase>();
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;

	protected _partition:PartitionBase;
	protected _context:IContextGL;
	protected _stage:Stage;
	protected _view:View;

	public _cameraTransform:Matrix3D;
	private _cameraForward:Vector3D = new Vector3D();

	public _pRttBufferManager:RTTBufferManager;

	protected _depthTextureDirty:boolean = true;
	protected _depthPrepass:boolean = false;

	private _snapshotBitmapImage2D:BitmapImage2D;
	private _snapshotRequired:boolean;

	private _onContextUpdateDelegate:(event:StageEvent) => void;
	private _onSizeInvalidateDelegate:(event:ViewEvent) => void;

	public _pNumElements:number = 0;

	public _pOpaqueRenderableHead:_Render_RenderableBase;
	public _pBlendedRenderableHead:_Render_RenderableBase;
	public _disableColor:boolean = false;
	public _disableClear:boolean = false;
	public _renderBlended:boolean = true;
	private _cullPlanes:Array<Plane3D>;
	private _customCullPlanes:Array<Plane3D>;
	private _numCullPlanes:number = 0;
	private _sourceEntity:IRenderEntity;
	protected _renderGroup:RenderGroup;
	private _renderEntity:RenderEntity;
	private _zIndex:number;
	private _renderSceneTransform:Matrix3D;
	
	public get partition():PartitionBase
	{
		return this._partition;
	}

	public set partition(value:PartitionBase)
	{
		if (this._partition == value)
			return;

		this._setPartition(value);
	}

	public get pickGroup():PickGroup
	{
		return this._pickGroup;
	}

	/**
	 *
	 */
	public get cullPlanes():Array<Plane3D>
	{
		return this._customCullPlanes;
	}

	public set cullPlanes(value:Array<Plane3D>)
	{
		this._customCullPlanes = value;
	}


	public get renderBlended():boolean
	{
		return this._renderBlended;
	}

	public set renderBlended(value:boolean)
	{
		this._renderBlended = value;
	}


	public get disableColor():boolean
	{
		return this._disableColor;
	}

	public set disableColor(value:boolean)
	{
		this._disableColor = value;
	}

	public get disableClear():boolean
	{
		return this._disableClear;
	}

	public set disableClear(value:boolean)
	{
		this._disableClear = value;
	}

	/**
	 *
	 */
	public get numElements():number
	{
		return this._pNumElements;
	}

	/**
	 *
	 */
	public renderableSorter:IRenderEntitySorter;

	/**
	 * Creates a new RendererBase object.
	 */
	constructor(partition:PartitionBase, view:View = null)
	{
		this._partition = partition;

		this._onSizeInvalidateDelegate = (event:ViewEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event:StageEvent) => this.onContextUpdate(event);

		//default sorting algorithm
		this.renderableSorter = new RenderableMergeSort();

		this._setView(view || new View())
	}

	public activatePass(pass:IPass):void
	{
		//clear unused vertex streams
		var i:number
		for (i = pass.shader.numUsedStreams; i < this._numUsedStreams; i++)
			this._context.setVertexBufferAt(i, null);

		//clear unused texture streams
		for (i = pass.shader.numUsedTextures; i < this._numUsedTextures; i++)
			this._context.setTextureAt(i, null);

		//activate shader object through pass
		pass._activate(this._view);
	}

	public deactivatePass(pass:IPass):void
	{
		//deactivate shader object through pass
		pass._deactivate();

		this._numUsedStreams = pass.shader.numUsedStreams;
		this._numUsedTextures = pass.shader.numUsedTextures;
	}

	public get context():IContextGL
	{
		return this._context;
	}

	/**
	 * The Stage that will provide the ContextGL used for rendering.
	 */
	public get stage():Stage
	{
		return this._stage;
	}

	public get view():View
	{
		return this._view;
	}

	public set view(value:View)
	{
		if (this._view == value)
			return;
		
		this._stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
	
		this._setView(value);
	}

	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose():void
	{

		this._registeredMasks.length=0;
		this._stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
		this._onContextUpdateDelegate=null;
		this._onSizeInvalidateDelegate=null;
		this._view = null;
		this._stage = null;
		this._context = null;
		/*
		 if (_backgroundImageRenderer) {
		 _backgroundImageRenderer.dispose();
		 _backgroundImageRenderer = null;
		 }
		 */
	}


    public _addMapper(mapper:IMapper)
    {
    	if (this._mappers.indexOf(mapper) != -1)
    		return;

        this._mappers.push(mapper)
    }

    public _removeMapper(mapper:IMapper)
    {
    	var index:number = this._mappers.indexOf(mapper);

    	if (index != -1)
        	this._mappers.splice(index, 1);
    }

	/**
	 * Renders the potentially visible geometry to the back buffer or texture.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public render(enableDepthAndStencil:boolean = true, surfaceSelector:number = 0):void
	{
		//TODO refactor setTarget so that rendertextures are created before this check
		// if (!this._stage || !this._context)
		// 	return;

		//update mappers
        var len:number = this._mappers.length;
        for (var i:number = 0; i < len; i++)
            this._mappers[i].update(this._view.projection, this);

		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumElements = 0;

		this._cameraTransform = this._view.projection.transform.concatenatedMatrix3D;
		this._cameraForward = this._view.projection.transform.forwardVector;
		this._cullPlanes = this._customCullPlanes? this._customCullPlanes : this._view.projection.viewFrustumPlanes;
		this._numCullPlanes = this._cullPlanes? this._cullPlanes.length : 0;

		RendererBase._collectionMark++;

		this._partition.traverse(this);

		//sort the resulting renderables
		if (this.renderableSorter) {
			this._pOpaqueRenderableHead = <_Render_RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = <_Render_RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}

		// this._pRttViewProjectionMatrix.copyFrom(projection.viewMatrix3D);
		// this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		this._executeRender(enableDepthAndStencil, surfaceSelector);

		// invalidate mipmaps (if target exists) to regenerate if required
		if (this._view.target)
			this._view.target.invalidateMipmaps();

		// clear buffers
		for (var i:number = 0; i < 8; ++i) {
			this._context.setVertexBufferAt(i, null);
			this._context.setTextureAt(i, null);
		}
	}

	public _iRenderCascades(projection:ProjectionBase, node:INode, enableDepthAndStencil:boolean = true, surfaceSelector:number = 0):void
	{
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

		// //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		// this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	protected _executeRender(enableDepthAndStencil:boolean = true, surfaceSelector:number = 0):void
	{
		//TODO: allow sharedContexts for image targets
		this._view.backgroundClearMask = (!this._view.shareContext || this._view.target)? ContextGLClearMask.ALL : ContextGLClearMask.DEPTH;
		this._view.clear(!this._depthPrepass && !this._disableClear, enableDepthAndStencil, surfaceSelector);

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		this._context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		if (this._disableColor)
			this._context.setColorMask(false, false, false, false);

		this.drawRenderables(this._pOpaqueRenderableHead);

		if (this._renderBlended)
			this.drawRenderables(this._pBlendedRenderableHead);

		if (this._disableColor)
			this._context.setColorMask(true, true, true, true);

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this._view.shareContext || this._view.target) {
			if (this._snapshotRequired && this._snapshotBitmapImage2D) {
				this._context.drawToBitmapImage2D(this._snapshotBitmapImage2D);
				this._snapshotRequired = false;
			}
		}
	}

	/*
	 * Will draw the renderer's output on next render to the provided bitmap data.
	 * */
	public queueSnapshot(bmd:BitmapImage2D):void
	{
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
	public drawRenderables(renderRenderable:_Render_RenderableBase):void
	{
		var i:number;
		var len:number;
		var renderRenderable2:_Render_RenderableBase;
		var renderMaterial:_Render_MaterialBase;
		var passes:Array<IPass>;
		var pass:IPass;

		this._context.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.ALWAYS, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP);

		this._registeredMasks.length = 0;
		//var gl = this._context["_gl"];
		//if(gl) {
			//gl.disable(gl.STENCIL_TEST);
		//}
		this._context.disableStencil();
		this._maskConfig = 0;

		while (renderRenderable) {
			renderMaterial = renderRenderable.renderMaterial;
			passes = renderMaterial.passes;

			// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
			// if (this._disableColor && renderMaterial.material.alphaThreshold != 0) {
			// 	renderRenderable2 = renderRenderable;
			// 	// fast forward
			// 	do {
			// 		renderRenderable2 = renderRenderable2.next;
            //
			// 	} while (renderRenderable2 && renderRenderable2.renderMaterial == renderMaterial);
			// } else {
				if (this._activeMasksDirty || this._checkMaskOwners(renderRenderable.maskOwners)) {
					this._activeMaskOwners = renderRenderable.maskOwners;
					if (this._activeMaskOwners == null) {
						//console.log("disable mask");
						// disable stencil
						//if(gl) {
							//gl.disable(gl.STENCIL_TEST);
							this._context.disableStencil();
							//gl.stencilFunc(gl.ALWAYS, 0, 0xff);
							//gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
							this._context.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.ALWAYS, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP);
							this._context.setStencilReferenceValue(0);

						//}
					} else {
						this._renderMasks(this._activeMaskOwners);
					}
					this._activeMasksDirty = false;
				}


				//iterate through each shader object
				len = passes.length;
				for (i = 0; i < len; i++) {
					renderRenderable2 = renderRenderable;
					pass = passes[i];

					this.activatePass(pass);

					do {
						if (renderRenderable2.maskId !== -1) {
							if (i == 0)
								this._registerMask(renderRenderable2);
						} else {
							///console.log("maskOwners", renderRenderable2.maskOwners);
							renderRenderable2._iRender(pass, this._view);
						}

						renderRenderable2 = renderRenderable2.next;

					} while (renderRenderable2 && renderRenderable2.renderMaterial == renderMaterial && !(this._activeMasksDirty = this._checkMaskOwners(renderRenderable2.maskOwners)));

					this.deactivatePass(pass);
				}
			// }

			renderRenderable = renderRenderable2;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event:StageEvent):void
	{
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
	public onSizeInvalidate(event:ViewEvent):void
	{
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
	public enterNode(node:INode):boolean
	{
		var enter:boolean = node._collectionMark != RendererBase._collectionMark && node.isRenderable() && node.isInFrustum(this._cullPlanes, this._numCullPlanes);

		node._collectionMark = RendererBase._collectionMark;

		return enter;
	}

	public getTraverser(partition:PartitionBase):RendererBase
	{
		return this;
	}

	public applyEntity(entity:IRenderEntity):void
	{
		this._sourceEntity = entity;
		this._renderEntity = this._renderGroup.getAbstraction(entity);

		// project onto camera's z-axis
		this._zIndex = entity.zOffset + this._cameraTransform.position.subtract(entity.scenePosition).dotProduct(this._cameraForward);

		//save sceneTransform
		this._renderSceneTransform = entity.getRenderSceneTransform(this._cameraTransform);

		//collect renderables
		entity._acceptTraverser(this);
	}

	public applyTraversable(renderable:ITraversable):void
	{
		var renderRenderable:_Render_RenderableBase = this._renderEntity.getAbstraction(renderable);


		//set local vars for faster referencing
		renderRenderable.cascaded = false;
		
		renderRenderable.zIndex = this._zIndex;
		renderRenderable.maskId = this._sourceEntity.maskId;
		renderRenderable.maskOwners = this._sourceEntity.maskOwners;

		var renderMaterial:_Render_MaterialBase = renderRenderable.renderMaterial;
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

		this._pNumElements += renderRenderable.stageElements.elements.numElements; //need to re-trigger stageElements getter in case animator has changed
	}

	private _registerMask(obj:_Render_RenderableBase):void
	{
		//console.log("registerMask");
		this._registeredMasks.push(obj);
	}

	public _renderMasks(maskOwners:IPartitionEntity[]):void
	{
		//var gl = this._context["_gl"];
		//f (!gl)
		//	return;

		//var oldRenderTarget = this._stage.renderTarget;

		//this._stage.setRenderTarget(this._image);
		//this._stage.clear();
		this._context.setColorMask(false, false, false, false);
		// TODO: Could we create masks within masks by providing a previous configID, and supply "clear/keep" on stencil fail
		//context.setStencilActions("frontAndBack", "always", "set", "set", "set");
		//gl.enable(gl.STENCIL_TEST);
		this._context.enableStencil();
		this._maskConfig++;
		//gl.stencilFunc(gl.ALWAYS, this._maskConfig, 0xff);
		//gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
		this._context.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.ALWAYS, ContextGLStencilAction.SET, ContextGLStencilAction.SET, ContextGLStencilAction.SET);
		this._context.setStencilReferenceValue(this._maskConfig);
		var numLayers:number = maskOwners.length;
		var numRenderables:number = this._registeredMasks.length;
		var renderRenderable:_Render_RenderableBase;
		var children:Array<IPartitionEntity>;
		var numChildren:number;
		var mask:IPartitionEntity;

		for (var i:number = 0; i < numLayers; ++i) {
			if (i != 0) {
				//gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
				//gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
				this._context.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.EQUAL, ContextGLStencilAction.INCREMENT_SATURATE, ContextGLStencilAction.INCREMENT_SATURATE, ContextGLStencilAction.KEEP);
				this._context.setStencilReferenceValue(this._maskConfig);
				this._maskConfig++;
			}

			children = maskOwners[i].masks;
			numChildren = children.length;

			for (var j:number = 0; j < numChildren; ++j) {
				mask = children[j];
				//todo: figure out why masks can be null here
				if(mask){
					for (var k:number = 0; k < numRenderables; ++k) {
						renderRenderable = this._registeredMasks[k];
						//console.log("testing for " + mask["hierarchicalMaskID"] + ", " + mask.name);
						if (renderRenderable.maskId == mask.id) {
							//console.log("Rendering hierarchicalMaskID " + mask["hierarchicalMaskID"]);
							this._drawMask(renderRenderable);
						}
					}
				}
			}
		}

		//gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
		//gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
		this._context.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.EQUAL, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP);
		this._context.setStencilReferenceValue(this._maskConfig);

		this._context.setColorMask(true, true, true, true);
		this._context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
		//this._stage.setRenderTarget(oldRenderTarget);
	}

	private _drawMask(renderRenderable:_Render_RenderableBase):void
	{
		//console.log("drawMask ", renderRenderable.maskId);
		var renderMaterial = renderRenderable.renderMaterial;
		var passes = renderMaterial.passes;
		var len = passes.length;
		var pass = passes[len-1];

		this.activatePass(pass);
		this._context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //TODO: setup so as not to override activate
		// only render last pass for now
		renderRenderable._iRender(pass, this._view);
		this.deactivatePass(pass);
	}

	private _checkMaskOwners(maskOwners:Array<IPartitionEntity>):boolean
	{
		if (this._activeMaskOwners == null || maskOwners == null)
			return Boolean(this._activeMaskOwners != maskOwners);

		if (this._activeMaskOwners.length != maskOwners.length)
			return true;

		var numLayers:number = maskOwners.length;
		var numMasks:number;
		var masks:Array<IPartitionEntity>;
		var activeNumMasks:number;
		var activeMasks:Array<IPartitionEntity>;
		for (var i:number = 0; i < numLayers; i++) {
			masks = maskOwners[i].masks;
			numMasks = masks.length;
			activeMasks = this._activeMaskOwners[i].masks;
			activeNumMasks = activeMasks.length;
			if (activeNumMasks != numMasks)
				return true;

			for (var j:number = 0; j < numMasks; j++) {
				if (activeMasks[j] != masks[j])
					return true;
			}
		}

		return false;
	}

	protected _setView(value:View):void
	{
		this._view = value;
		this._stage = value.stage;

		this._stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._pickGroup = PickGroup.getInstance(value);

		if (this._stage.context)
			this._context = <IContextGL> this._stage.context;
	}

	protected _setPartition(value:PartitionBase):void
	{
		this._partition = value;
	}
}