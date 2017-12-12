import {Matrix3D, Plane3D, Point, Rectangle, Vector3D, IAbstractionPool, ProjectionBase} from "@awayjs/core";

import {ImageBase, BitmapImage2D, ContextGLProfile, ContextMode, AGALMiniAssembler, ContextGLBlendFactor, ContextGLCompareMode, ContextGLStencilAction, ContextGLTriangleFace, IContextGL, Stage, StageEvent, StageManager, ProgramData} from "@awayjs/stage";

import {IMaterialStateClass} from "./base/IMaterialStateClass";
import {MaterialStatePool} from "./base/MaterialStatePool";
import {MaterialStateBase} from "./base/MaterialStateBase";
import {RenderStateBase} from "./base/RenderStateBase";
import {RenderStatePool} from "./base/RenderStatePool";
import {IMapper} from "./base/IMapper";
import {RenderGroup} from "./RenderGroup";

import {IEntity} from "./base/IEntity";
import {INode} from "./base/INode";
import {IPass} from "./base/IPass";
import {IView} from "./base/IView";
import {IRenderer} from "./base/IRenderer";
import {TraverserBase} from "./base/TraverserBase"
import {IRenderable} from "./base/IRenderable";
import {RendererEvent} from "./events/RendererEvent";
import {RTTBufferManager} from "./managers/RTTBufferManager";
import {IEntitySorter} from "./sort/IEntitySorter";
import {RenderableMergeSort} from "./sort/RenderableMergeSort";


/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export class RendererBase extends TraverserBase implements IRenderer
{
	public static _iCollectionMark = 0;

    private _mappers:Array<IMapper> = new Array<IMapper>();
	private _maskConfig:number;
	private _activeMasksDirty:boolean;
	private _activeMasksConfig:Array<Array<number>> = new Array<Array<number>>();
	private _registeredMasks : Array<RenderStateBase> = new Array<RenderStateBase>();
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;

	public _pContext:IContextGL;
	public _pStage:Stage;

	public _cameraTransform:Matrix3D;
	private _cameraForward:Vector3D = new Vector3D();

	public _pRttBufferManager:RTTBufferManager;
	private _scissorDirty:boolean;

	public _pBackBufferInvalid:boolean = true;
	public _pDepthTextureInvalid:boolean = true;
	public _depthPrepass:boolean = false;
	private _backgroundR:number = 0;
	private _backgroundG:number = 0;
	private _backgroundB:number = 0;
	private _backgroundAlpha:number = 1;

	// only used by renderers that need to render geometry to textures
	public _width:number = 0;
	public _height:number = 0;

	public textureRatioX:number = 1;
	public textureRatioY:number = 1;

	private _snapshotBitmapImage2D:BitmapImage2D;
	private _snapshotRequired:boolean;

	private _x:number = 0;
	private _y:number = 0;
	public _pScissorRect:Rectangle = new Rectangle();

	private _scissorUpdated:RendererEvent;
	private _viewPortUpdated:RendererEvent;

	private _onContextUpdateDelegate:(event:StageEvent) => void;
	private _onViewportUpdatedDelegate:(event:StageEvent) => void;

	public _pNumElements:number = 0;

	public _pOpaqueRenderableHead:RenderStateBase;
	public _pBlendedRenderableHead:RenderStateBase;
	public _disableColor:boolean = false;
	public _disableClear:boolean = false;
	public _renderBlended:boolean = true;
	private _cullPlanes:Array<Plane3D>;
	private _customCullPlanes:Array<Plane3D>;
	private _numCullPlanes:number = 0;
	private _sourceEntity:IEntity;
	protected _renderGroup:RenderGroup;
	private _renderablePool:RenderStatePool;
	private _zIndex:number;
	private _renderSceneTransform:Matrix3D;
	private _renderProjection:ProjectionBase;

	
	/**
	 * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
	 * to share the same ContextGL object.
	 */
	public shareContext:boolean;
	
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
	public renderableSorter:IEntitySorter;


	/**
	 * A viewPort rectangle equivalent of the Stage size and position.
	 */
	public get viewPort():Rectangle
	{
		return this._pStage.viewPort;
	}

	/**
	 * A scissor rectangle equivalent of the view size and position.
	 */
	public get scissorRect():Rectangle
	{
		if (this._scissorDirty) {
			this._scissorDirty = false;

			if (this.shareContext) {
				this._pScissorRect.x = this._x - this._pStage.viewPort.x;
				this._pScissorRect.y = this._y - this._pStage.viewPort.y;
			} else {
				this._pScissorRect.x = 0;
				this._pScissorRect.y = 0;
			}
		}

		return this._pScissorRect;
	}

	/**
	 *
	 */
	public get x():number
	{
		return this._x;
	}

	public set x(value:number)
	{
		if (this._x == value)
			return;

		this._x = value;

		if (!this.shareContext)
			this._pStage.x = value;

		this.notifyScissorUpdate();
	}

	/**
	 *
	 */
	public get y():number
	{
		return this._y;
	}

	public set y(value:number)
	{
		if (this._y == value)
			return;

		this._y = value;

		if (!this.shareContext)
			this._pStage.y = value;

		this.notifyScissorUpdate();
	}

	/**
	 *
	 */
	public get width():number
	{
		return this._width;
	}

	public set width(value:number)
	{
		if (this._width == value)
			return;

		this._width = value;

		this._pScissorRect.width = value;

		if (this._pRttBufferManager)
			this._pRttBufferManager.viewWidth = value;

		if (!this.shareContext) {
			this._pBackBufferInvalid = true;
			this._pDepthTextureInvalid = true;
		}

		this.notifyScissorUpdate();
	}

	/**
	 *
	 */
	public get height():number
	{
		return this._height;
	}

	public set height(value:number)
	{
		if (this._height == value)
			return;

		this._height = value;

		this._pScissorRect.height = value;

		if (this._pRttBufferManager)
			this._pRttBufferManager.viewHeight = value;

		if (!this.shareContext) {
			this._pBackBufferInvalid = true;
			this._pDepthTextureInvalid = true;
		}

		this.notifyScissorUpdate();
	}

	/**
	 * Creates a new RendererBase object.
	 */
	constructor(stage:Stage = null, forceSoftware:boolean = false, profile:ContextGLProfile = ContextGLProfile.BASELINE, mode:ContextMode = ContextMode.AUTO)
	{
		super();

		this._onViewportUpdatedDelegate = (event:StageEvent) => this.onViewportUpdated(event);
		this._onContextUpdateDelegate = (event:StageEvent) => this.onContextUpdate(event);

		//default sorting algorithm
		this.renderableSorter = new RenderableMergeSort();

		//set stage
		this._pStage = stage || StageManager.getInstance().getFreeStage(forceSoftware, profile, mode);

		this._pStage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._pStage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._pStage.addEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
		
		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.stage = value;
		 */
		if (this._pStage.context)
			this._pContext = <IContextGL> this._pStage.context;
	}

	public activatePass(pass:IPass, projection:ProjectionBase):void
	{
		//clear unused vertex streams
		var i:number
		for (i = pass.numUsedStreams; i < this._numUsedStreams; i++)
			this._pContext.setVertexBufferAt(i, null);

		//clear unused texture streams
		for (i = pass.numUsedTextures; i < this._numUsedTextures; i++)
			this._pContext.setTextureAt(i, null);

		//activate shader object through pass
		pass._activate(projection);
	}

	public deactivatePass(pass:IPass):void
	{
		//deactivate shader object through pass
		pass._deactivate();

		this._numUsedStreams = pass.numUsedStreams;
		this._numUsedTextures = pass.numUsedTextures;
	}

	/**
	 * The background color's red component, used when clearing.
	 *
	 * @private
	 */
	public get _iBackgroundR():number
	{
		return this._backgroundR;
	}

	public set _iBackgroundR(value:number)
	{
		if (this._backgroundR == value)
			return;

		this._backgroundR = value;

		this._pBackBufferInvalid = true;
	}

	/**
	 * The background color's green component, used when clearing.
	 *
	 * @private
	 */
	public get _iBackgroundG():number
	{
		return this._backgroundG;
	}

	public set _iBackgroundG(value:number)
	{
		if (this._backgroundG == value)
			return;

		this._backgroundG = value;

		this._pBackBufferInvalid = true;
	}

	/**
	 * The background color's blue component, used when clearing.
	 *
	 * @private
	 */
	public get _iBackgroundB():number
	{
		return this._backgroundB;
	}

	public set _iBackgroundB(value:number)
	{
		if (this._backgroundB == value)
			return;

		this._backgroundB = value;

		this._pBackBufferInvalid = true;
	}

	public get context():IContextGL
	{
		return this._pContext;
	}

	/**
	 * The Stage that will provide the ContextGL used for rendering.
	 */
	public get stage():Stage
	{
		return this._pStage;
	}

	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose():void
	{

		this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);

		this._pStage = null;
		this._pContext = null;
		/*
		 if (_backgroundImageRenderer) {
		 _backgroundImageRenderer.dispose();
		 _backgroundImageRenderer = null;
		 }
		 */
	}

	public render(projection:ProjectionBase, view:IView):void
	{
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
	public _iRender(projection:ProjectionBase, view:IView, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0):void
	{
		//TODO refactor setTarget so that rendertextures are created before this check
		if (!this._pStage || !this._pContext)
			return;

		//update mappers
        var len:number = this._mappers.length;
        for (var i:number = 0; i < len; i++)
            this._mappers[i].update(projection, view, this);

		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumElements = 0;

		this._cameraTransform = projection.transform.concatenatedMatrix3D;
		this._cameraForward = projection.transform.forwardVector;
		this._cullPlanes = this._customCullPlanes? this._customCullPlanes : projection.frustumPlanes;
		this._numCullPlanes = this._cullPlanes? this._cullPlanes.length : 0;

		RendererBase._iCollectionMark++;

		view.traversePartitions(this);

		//sort the resulting renderables
		if (this.renderableSorter) {
			this._pOpaqueRenderableHead = <RenderStateBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = <RenderStateBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}

		// this._pRttViewProjectionMatrix.copyFrom(projection.viewMatrix3D);
		// this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		this.pExecuteRender(projection, view, target, scissorRect, surfaceSelector);

		// invalidate mipmaps (if target exists) to regenerate if required
		if (target)
			target.invalidateMipmaps();

		// clear buffers
		for (var i:number = 0; i < 8; ++i) {
			this._pContext.setVertexBufferAt(i, null);
			this._pContext.setTextureAt(i, null);
		}
	}

	public _iRenderCascades(projection:ProjectionBase, view:IView, target:ImageBase, numCascades:number, scissorRects:Array<Rectangle>, projections:Array<ProjectionBase>):void
	{
		this._pStage.setRenderTarget(target, true, 0);
		this._pContext.clear(1, 1, 1, 1, 1, 0);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

		var head:RenderStateBase = this._pOpaqueRenderableHead;

		var first:boolean = true;

		//TODO cascades must have separate collectors, rather than separate draw commands
		for (var i:number = numCascades - 1; i >= 0; --i) {
			this._pStage.scissorRect = scissorRects[i];
			//this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
			first = false;
		}

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

		this._pStage.scissorRect = null;
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public pExecuteRender(projection:ProjectionBase, view:IView, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0):void
	{
		this._pStage.setRenderTarget(target, true, surfaceSelector);

		if ((target || !this.shareContext) && !this._depthPrepass && !this._disableClear)
			this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

		this._pStage.scissorRect = scissorRect;

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		this.pDraw(projection);

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (target || !this.shareContext) {
			if (this._snapshotRequired && this._snapshotBitmapImage2D) {
				this._pContext.drawToBitmapImage2D(this._snapshotBitmapImage2D);
				this._snapshotRequired = false;
			}
		}

		this._pStage.scissorRect = null;
	}

	/*
	 * Will draw the renderer's output on next render to the provided bitmap data.
	 * */
	public queueSnapshot(bmd:BitmapImage2D):void
	{
		this._snapshotRequired = true;
		this._snapshotBitmapImage2D = bmd;
	}

	/**
	 * Performs the actual drawing of geometry to the target.
	 */
	public pDraw(projection:ProjectionBase):void
	{
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		if (this._disableColor)
			this._pContext.setColorMask(false, false, false, false);

		this.drawRenderables(projection, this._pOpaqueRenderableHead);

		if (this._renderBlended)
			this.drawRenderables(projection, this._pBlendedRenderableHead);

		if (this._disableColor)
			this._pContext.setColorMask(true, true, true, true);
	}

	//private drawCascadeRenderables(renderableGL:RenderStateBase, camera:Camera, cullPlanes:Array<Plane3D>)
	//{
	//	var renderableGL2:RenderStateBase;
	//	var render:MaterialStateBase;
	//	var pass:IPass;
	//
	//	while (renderableGL) {
	//		renderableGL2 = renderableGL;
	//		render = renderableGL.render;
	//		pass = render.passes[0] //assuming only one pass per material
	//
	//		this.activatePass(renderableGL, pass, camera);
	//
	//		do {
	//			// if completely in front, it will fall in a different cascade
	//			// do not use near and far planes
	//			if (!cullPlanes || renderableGL2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
	//				renderableGL2._iRender(pass, camera, this._pRttViewProjectionMatrix);
	//			} else {
	//				renderableGL2.cascaded = true;
	//			}
	//
	//			renderableGL2 = renderableGL2.next;
	//
	//		} while (renderableGL2 && renderableGL2.render == render && !renderableGL2.cascaded);
	//
	//		this.deactivatePass(renderableGL, pass);
	//
	//		renderableGL = renderableGL2;
	//	}
	//}

	/**
	 * Draw a list of renderables.
	 *
	 * @param renderables The renderables to draw.
	 */
	public drawRenderables(projection:ProjectionBase, renderableGL:RenderStateBase):void
	{
		var i:number;
		var len:number;
		var renderableGL2:RenderStateBase;
		var materialGL:MaterialStateBase;
		var passes:Array<IPass>;
		var pass:IPass;

		this._pContext.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.ALWAYS, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP);

		this._registeredMasks.length = 0;
		//var gl = this._pContext["_gl"];
		//if(gl) {
			//gl.disable(gl.STENCIL_TEST);
		//}
		this._pContext.disableStencil();
		this._maskConfig = 0;

		while (renderableGL) {
			materialGL = renderableGL.materialGL;
			passes = materialGL.passes;

			// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
			if (this._disableColor && materialGL.material.alphaThreshold != 0) {
				renderableGL2 = renderableGL;
				// fast forward
				do {
					renderableGL2 = renderableGL2.next;

				} while (renderableGL2 && renderableGL2.materialGL == materialGL);
			} else {
				if (this._activeMasksDirty || this._checkMasksConfig(renderableGL.masksConfig)) {
					this._activeMasksConfig = renderableGL.masksConfig;
					if (!this._activeMasksConfig.length) {
						// disable stencil
						//if(gl) {
							//gl.disable(gl.STENCIL_TEST);
							this._pContext.disableStencil();
							//gl.stencilFunc(gl.ALWAYS, 0, 0xff);
							//gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
							this._pContext.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.ALWAYS, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP);
							this._pContext.setStencilReferenceValue(0);

						//}
					} else {
						this._renderMasks(projection, renderableGL.sourceEntity._iAssignedMasks());
					}
					this._activeMasksDirty = false;
				}


				//iterate through each shader object
				len = passes.length;
				for (i = 0; i < len; i++) {
					renderableGL2 = renderableGL;
					pass = passes[i];

					this.activatePass(pass, projection);

					do {
						if (renderableGL2.maskId !== -1) {
							if (i == 0)
								this._registerMask(renderableGL2);
						} else {
							renderableGL2._iRender(pass, projection);
						}

						renderableGL2 = renderableGL2.next;

					} while (renderableGL2 && renderableGL2.materialGL == materialGL && !(this._activeMasksDirty = this._checkMasksConfig(renderableGL2.masksConfig)));

					this.deactivatePass(pass);
				}
			}

			renderableGL = renderableGL2;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event:StageEvent):void
	{
		this._pContext = <IContextGL> this._pStage.context;
	}

	public get _iBackgroundAlpha():number
	{
		return this._backgroundAlpha;
	}

	public set _iBackgroundAlpha(value:number)
	{
		if (this._backgroundAlpha == value)
			return;

		this._backgroundAlpha = value;

		this._pBackBufferInvalid = true;
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

	 this._backgroundImageRenderer = new BackgroundImageRenderer(this._pStage);

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
	 * @private
	 */
	private notifyScissorUpdate():void
	{
		if (this._scissorDirty)
			return;

		this._scissorDirty = true;

		if (!this._scissorUpdated)
			this._scissorUpdated = new RendererEvent(RendererEvent.SCISSOR_UPDATED);

		this.dispatchEvent(this._scissorUpdated);
	}


	/**
	 * @private
	 */
	private notifyViewportUpdate():void
	{
		if (!this._viewPortUpdated)
			this._viewPortUpdated = new RendererEvent(RendererEvent.VIEWPORT_UPDATED);

		this.dispatchEvent(this._viewPortUpdated);
	}

	/**
	 *
	 */
	public onViewportUpdated(event:StageEvent):void
	{
		if (this.shareContext)
			this.notifyScissorUpdate();

		this.notifyViewportUpdate();
	}

	/**
	 *
	 * @param node
	 * @returns {boolean}
	 */
	public enterNode(node:INode):boolean
	{
		var enter:boolean = node._iCollectionMark != RendererBase._iCollectionMark && node.isRenderable() && node.isInFrustum(this._cullPlanes, this._numCullPlanes);

		node._iCollectionMark = RendererBase._iCollectionMark;

		return enter;
	}

	public applyEntity(entity:IEntity):void
	{
		this._sourceEntity = entity;
		this._renderablePool = this._renderGroup.getRenderStatePool(entity);

		// project onto camera's z-axis
		this._zIndex = entity.zOffset + this._cameraTransform.position.subtract(entity.scenePosition).dotProduct(this._cameraForward);

		//save sceneTransform
		this._renderSceneTransform = entity.getRenderSceneTransform(this._cameraTransform);

		//collect renderables
		entity._acceptTraverser(this);
	}

	public applyRenderable(renderable:IRenderable):void
	{
		var renderableGL:RenderStateBase = this._renderablePool.getAbstraction(renderable);


		//set local vars for faster referencing
		renderableGL.cascaded = false;
		
		renderableGL.zIndex = this._zIndex;
		renderableGL.maskId = this._sourceEntity._iAssignedMaskId();
		renderableGL.masksConfig = this._sourceEntity._iMasksConfig();

		var materialGL:MaterialStateBase = renderableGL.materialGL;
		renderableGL.materialID = materialGL.materialID;
		renderableGL.renderOrderId = materialGL.renderOrderId;

		//store reference to scene transform
		renderableGL.renderSceneTransform = this._renderSceneTransform;

		if (materialGL.requiresBlending) {
			renderableGL.next = this._pBlendedRenderableHead;
			this._pBlendedRenderableHead = renderableGL;
		} else {
			renderableGL.next = this._pOpaqueRenderableHead;
			this._pOpaqueRenderableHead = renderableGL;
		}

		this._pNumElements += renderableGL.elementsGL.elements.numElements; //need to re-trigger elementsGL getter in case animator has changed
	}

	/**
	 *
	 * @param entity
	 */
	public applyDirectionalLight(entity:IEntity):void
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applyLightProbe(entity:IEntity):void
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applyPointLight(entity:IEntity):void
	{
		//don't do anything here
	}

	private _registerMask(obj:RenderStateBase):void
	{
		//console.log("registerMask");
		this._registeredMasks.push(obj);
	}

	public _renderMasks(projection:ProjectionBase, masks:IEntity[][]):void
	{
		//var gl = this._pContext["_gl"];
		//f (!gl)
		//	return;

		//var oldRenderTarget = this._stage.renderTarget;

		//this._stage.setRenderTarget(this._image);
		//this._stage.clear();
		this._pContext.setColorMask(false, false, false, false);
		// TODO: Could we create masks within masks by providing a previous configID, and supply "clear/keep" on stencil fail
		//context.setStencilActions("frontAndBack", "always", "set", "set", "set");
		//gl.enable(gl.STENCIL_TEST);
		this._pContext.enableStencil();
		this._maskConfig++;
		//gl.stencilFunc(gl.ALWAYS, this._maskConfig, 0xff);
		//gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
		this._pContext.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.ALWAYS, ContextGLStencilAction.SET, ContextGLStencilAction.SET, ContextGLStencilAction.SET);
		this._pContext.setStencilReferenceValue(this._maskConfig);
		var numLayers:number = masks.length;
		var numRenderables:number = this._registeredMasks.length;
		var renderableGL:RenderStateBase;
		var children:Array<IEntity>;
		var numChildren:number;
		var mask:IEntity;

		for (var i:number = 0; i < numLayers; ++i) {
			if (i != 0) {
				//gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
				//gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
				this._pContext.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.EQUAL, ContextGLStencilAction.INCREMENT_SATURATE, ContextGLStencilAction.INCREMENT_SATURATE, ContextGLStencilAction.KEEP);
				this._pContext.setStencilReferenceValue(this._maskConfig);
				this._maskConfig++;
			}

			children = masks[i];
			numChildren = children.length;

			for (var j:number = 0; j < numChildren; ++j) {
				mask = children[j];
				for (var k:number = 0; k < numRenderables; ++k) {
					renderableGL = this._registeredMasks[k];
					//console.log("testing for " + mask["hierarchicalMaskID"] + ", " + mask.name);
					if (renderableGL.maskId == mask.id) {
						//console.log("Rendering hierarchicalMaskID " + mask["hierarchicalMaskID"]);
						this._drawMask(projection, renderableGL);
					}
				}
			}
		}

		//gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
		//gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
		this._pContext.setStencilActions(ContextGLTriangleFace.FRONT_AND_BACK, ContextGLCompareMode.EQUAL, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP, ContextGLStencilAction.KEEP);
		this._pContext.setStencilReferenceValue(this._maskConfig);

		this._pContext.setColorMask(true, true, true, true);
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
		//this._stage.setRenderTarget(oldRenderTarget);
	}

	private _drawMask(projection:ProjectionBase, renderableGL:RenderStateBase):void
	{
		var materialGL = renderableGL.materialGL;
		var passes = materialGL.passes;
		var len = passes.length;
		var pass = passes[len-1];

		this.activatePass(pass, projection);
		this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //TODO: setup so as not to override activate
		// only render last pass for now
		renderableGL._iRender(pass, projection);
		this.deactivatePass(pass);
	}

	private _checkMasksConfig(masksConfig:Array<Array<number>>):boolean
	{
		if (this._activeMasksConfig.length != masksConfig.length)
			return true;

		var numLayers:number = masksConfig.length;
		var numChildren:number;
		var childConfig:Array<number>;
		var activeNumChildren:number;
		var activeChildConfig:Array<number>;
		for (var i:number = 0; i < numLayers; i++) {
			childConfig = masksConfig[i];
			numChildren = childConfig.length;
			activeChildConfig = this._activeMasksConfig[i];
			activeNumChildren = activeChildConfig.length;
			if (activeNumChildren != numChildren)
				return true;

			for (var j:number = 0; j < numChildren; j++) {
				if (activeChildConfig[j] != childConfig[j])
					return true;
			}
		}

		return false;
	}
}