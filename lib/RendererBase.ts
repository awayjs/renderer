import ImageBase					= require("awayjs-core/lib/data/ImageBase");
import BitmapImage2D				= require("awayjs-core/lib/data/BitmapImage2D");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Plane3D						= require("awayjs-core/lib/geom/Plane3D");
import Point						= require("awayjs-core/lib/geom/Point");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");
import ByteArray					= require("awayjs-core/lib/utils/ByteArray");

import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import EntityListItem				= require("awayjs-display/lib/pool/EntityListItem");
import IEntitySorter				= require("awayjs-display/lib/sort/IEntitySorter");
import RenderableMergeSort			= require("awayjs-display/lib/sort/RenderableMergeSort");
import IRenderer					= require("awayjs-display/lib/IRenderer");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import DisplayObject				= require("awayjs-display/lib/base/DisplayObject");
import Camera						= require("awayjs-display/lib/entities/Camera");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import RendererEvent				= require("awayjs-display/lib/events/RendererEvent");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import CollectorBase				= require("awayjs-display/lib/traverse/CollectorBase");
import ShadowCasterCollector		= require("awayjs-display/lib/traverse/ShadowCasterCollector");

import AGALMiniAssembler			= require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import StageEvent					= require("awayjs-stagegl/lib/events/StageEvent");
import StageManager					= require("awayjs-stagegl/lib/managers/StageManager");
import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");


/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
class RendererBase extends EventDispatcher implements IRenderer
{
	private _maskConfig:number;
	private _activeMasksDirty:boolean;
	private _activeMasksConfig:Array<Array<number>> = new Array<Array<number>>();
	private _registeredMasks : Array<RenderableBase> = new Array<RenderableBase>();
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;

	public _pRenderablePool:RenderablePool;

	public _pContext:IContextGL;
	public _pStage:Stage;

	public _pCamera:Camera;
	public _iEntryPoint:Vector3D;
	public _pCameraForward:Vector3D;

	public _pRttBufferManager:RTTBufferManager;
	private _viewPort:Rectangle = new Rectangle();
	private _viewportDirty:boolean;
	private _scissorDirty:boolean;

	public _pBackBufferInvalid:boolean = true;
	public _pDepthTextureInvalid:boolean = true;
	public _depthPrepass:boolean = false;
	private _backgroundR:number = 0;
	private _backgroundG:number = 0;
	private _backgroundB:number = 0;
	private _backgroundAlpha:number = 1;
	public _shareContext:boolean;

	// only used by renderers that need to render geometry to textures
	public _width:number;
	public _height:number;

	public textureRatioX:number = 1;
	public textureRatioY:number = 1;

	private _snapshotBitmapImage2D:BitmapImage2D;
	private _snapshotRequired:boolean;

	public _pRttViewProjectionMatrix:Matrix3D = new Matrix3D();

	private _localPos:Point = new Point();
	private _globalPos:Point = new Point();
	public _pScissorRect:Rectangle = new Rectangle();

	private _scissorUpdated:RendererEvent;
	private _viewPortUpdated:RendererEvent;

	private _onContextUpdateDelegate:Function;
	private _onViewportUpdatedDelegate;

	public _pNumElements:number = 0;

	public _pOpaqueRenderableHead:RenderableBase;
	public _pBlendedRenderableHead:RenderableBase;
	public _disableColor:boolean = false;
	public _renderBlended:boolean = true;


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
		return this._viewPort;
	}

	/**
	 * A scissor rectangle equivalent of the view size and position.
	 */
	public get scissorRect():Rectangle
	{
		return this._pScissorRect;
	}

	/**
	 *
	 */
	public get x():number
	{
		return this._localPos.x;
	}

	public set x(value:number)
	{
		if (this.x == value)
			return;

		this._globalPos.x = this._localPos.x = value;

		this.updateGlobalPos();
	}

	/**
	 *
	 */
	public get y():number
	{
		return this._localPos.y;
	}

	public set y(value:number)
	{
		if (this.y == value)
			return;

		this._globalPos.y = this._localPos.y = value;

		this.updateGlobalPos();
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

		this._pBackBufferInvalid = true;
		this._pDepthTextureInvalid = true;

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

		this._pBackBufferInvalid = true;
		this._pDepthTextureInvalid = true;

		this.notifyScissorUpdate();
	}

	/**
	 * Creates a new RendererBase object.
	 */
	constructor(stage:Stage = null, forceSoftware:boolean = false, profile:string = "baseline", mode:string = "auto")
	{
		super();

		this._onViewportUpdatedDelegate = (event:StageEvent) => this.onViewportUpdated(event);
		this._onContextUpdateDelegate = (event:Event) => this.onContextUpdate(event);

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

	public activatePass(renderable:RenderableBase, pass:IPass, camera:Camera)
	{
		//clear unused vertex streams
		for (var i = pass.shader.numUsedStreams; i < this._numUsedStreams; i++)
			this._pContext.setVertexBufferAt(i, null);

		//clear unused texture streams
		for (var i = pass.shader.numUsedTextures; i < this._numUsedTextures; i++)
			this._pContext.setTextureAt(i, null);

		//check program data is uploaded
		var programData:ProgramData = pass.shader.programData;

		if (!programData.program) {
			programData.program = this._pContext.createProgram();
			var vertexByteCode:ByteArray = (new AGALMiniAssembler().assemble("part vertex 1\n" + programData.vertexString + "endpart"))['vertex'].data;
			var fragmentByteCode:ByteArray = (new AGALMiniAssembler().assemble("part fragment 1\n" + programData.fragmentString + "endpart"))['fragment'].data;
			programData.program.upload(vertexByteCode, fragmentByteCode);
		}

		//set program data
		this._pContext.setProgram(programData.program);

		//activate shader object through renderable
		renderable._iActivate(pass, camera);
	}

	public deactivatePass(renderable:RenderableBase, pass:IPass)
	{
		//deactivate shader object
		renderable._iDeactivate(pass);

		this._numUsedStreams = pass.shader.numUsedStreams;
		this._numUsedTextures = pass.shader.numUsedTextures;
	}

	public _iCreateEntityCollector():CollectorBase
	{
		return new EntityCollector();
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
	 * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
	 * to share the same ContextGL object.
	 */
	public get shareContext():boolean
	{
		return this._shareContext;
	}

	public get renderablePool():RenderablePool
	{
		return this._pRenderablePool;
	}

	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose()
	{
		this._pRenderablePool.dispose();

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

	public render(entityCollector:CollectorBase)
	{
		this._viewportDirty = false;
		this._scissorDirty = false;
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture.
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public _iRender(entityCollector:CollectorBase, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		//TODO refactor setTarget so that rendertextures are created before this check
		if (!this._pStage || !this._pContext)
			return;

		this._pRttViewProjectionMatrix.copyFrom(entityCollector.camera.viewProjection);
		this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		this.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);

		// generate mip maps on target (if target exists) //TODO
		//if (target)
		//	(<Texture>target).generateMipmaps();

		// clear buffers
		for (var i:number = 0; i < 8; ++i) {
			this._pContext.setVertexBufferAt(i, null);
			this._pContext.setTextureAt(i, null);
		}
	}

	public _iRenderCascades(entityCollector:ShadowCasterCollector, target:ImageBase, numCascades:number, scissorRects:Array<Rectangle>, cameras:Array<Camera>)
	{
		this._applyCollector(entityCollector);

		this._pStage.setRenderTarget(target, true, 0);
		this._pContext.clear(1, 1, 1, 1, 1, 0);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

		var head:RenderableBase = this._pOpaqueRenderableHead;

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

	private _applyCollector(entityCollector:CollectorBase)
	{
		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumElements = 0;

		//grab entity head
		var item:EntityListItem = entityCollector.entityHead;

		//set temp values for entry point and camera forward vector
		this._pCamera = entityCollector.camera;
		this._iEntryPoint = this._pCamera.scenePosition;
		this._pCameraForward = this._pCamera.transform.forwardVector;

		//iterate through all entities
		while (item) {
			item.entity._applyRenderer(this);
			item = item.next;
		}

		//sort the resulting renderables
		if (this.renderableSorter) {
			this._pOpaqueRenderableHead = <RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = <RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public pExecuteRender(entityCollector:CollectorBase, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		this._pStage.setRenderTarget(target, true, surfaceSelector);

		if ((target || !this._shareContext) && !this._depthPrepass)
			this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

		this._pStage.scissorRect = scissorRect;

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */
		this._applyCollector(entityCollector);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		this.pDraw(entityCollector);

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this._shareContext) {
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
	public queueSnapshot(bmd:BitmapImage2D)
	{
		this._snapshotRequired = true;
		this._snapshotBitmapImage2D = bmd;
	}

	/**
	 * Performs the actual drawing of geometry to the target.
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 */
	public pDraw(entityCollector:CollectorBase)
	{
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		if (this._disableColor)
			this._pContext.setColorMask(false, false, false, false);

		this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);

		if (this._renderBlended)
			this.drawRenderables(this._pBlendedRenderableHead, entityCollector);

		if (this._disableColor)
			this._pContext.setColorMask(true, true, true, true);
	}

	//private drawCascadeRenderables(renderable:RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
	//{
	//	var renderable2:RenderableBase;
	//	var render:RenderBase;
	//	var pass:IPass;
	//
	//	while (renderable) {
	//		renderable2 = renderable;
	//		render = renderable.render;
	//		pass = render.passes[0] //assuming only one pass per material
	//
	//		this.activatePass(renderable, pass, camera);
	//
	//		do {
	//			// if completely in front, it will fall in a different cascade
	//			// do not use near and far planes
	//			if (!cullPlanes || renderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
	//				renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
	//			} else {
	//				renderable2.cascaded = true;
	//			}
	//
	//			renderable2 = renderable2.next;
	//
	//		} while (renderable2 && renderable2.render == render && !renderable2.cascaded);
	//
	//		this.deactivatePass(renderable, pass);
	//
	//		renderable = renderable2;
	//	}
	//}

	/**
	 * Draw a list of renderables.
	 *
	 * @param renderables The renderables to draw.
	 * @param entityCollector The EntityCollector containing all potentially visible information.
	 */
	public drawRenderables(renderable:RenderableBase, entityCollector:CollectorBase)
	{
		var i:number;
		var len:number;
		var renderable2:RenderableBase;
		var render:RenderBase;
		var passes:Array<IPass>;
		var pass:IPass;
		var camera:Camera = entityCollector.camera;

		this._pContext.setStencilActions("frontAndBack", "always", "keep", "keep", "keep");

		this._registeredMasks.length = 0;
		var gl = this._pContext["_gl"];
		if(gl) {
			gl.disable(gl.STENCIL_TEST);
		}

		this._maskConfig = 0;

		while (renderable) {
			render = renderable.render;
			passes = render.passes;

			// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
			if (this._disableColor && render._renderOwner.alphaThreshold != 0) {
				renderable2 = renderable;
				// fast forward
				do {
					renderable2 = renderable2.next;

				} while (renderable2 && renderable2.render == render);
			} else {
				if (this._activeMasksDirty || this._checkMasksConfig(renderable.masksConfig)) {
					this._activeMasksConfig = renderable.masksConfig;
					if (!this._activeMasksConfig.length) {
						// disable stencil
						if(gl) {
							gl.disable(gl.STENCIL_TEST);
							gl.stencilFunc(gl.ALWAYS, 0, 0xff);
							gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
						}
					} else {
						this._renderMasks(renderable.sourceEntity._iAssignedMasks());
					}
					this._activeMasksDirty = false;
				}


				//iterate through each shader object
				len = passes.length;
				for (i = 0; i < len; i++) {
					renderable2 = renderable;
					pass = passes[i];

					this.activatePass(renderable, pass, camera);

					do {
						if (renderable2.maskId !== -1) {
							if (i == 0)
								this._registerMask(renderable2);
						} else {
							renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
						}

						renderable2 = renderable2.next;

					} while (renderable2 && renderable2.render == render && !(this._activeMasksDirty = this._checkMasksConfig(renderable2.masksConfig)));

					this.deactivatePass(renderable, pass);
				}
			}

			renderable = renderable2;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event:Event)
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
	private notifyScissorUpdate()
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
	private notifyViewportUpdate()
	{
		if (this._viewportDirty)
			return;

		this._viewportDirty = true;

		if (!this._viewPortUpdated)
			this._viewPortUpdated = new RendererEvent(RendererEvent.VIEWPORT_UPDATED);

		this.dispatchEvent(this._viewPortUpdated);
	}

	/**
	 *
	 */
	public onViewportUpdated(event:StageEvent)
	{
		this._viewPort = this._pStage.viewPort;
		//TODO stop firing viewport updated for every stagegl viewport change

		if (this._shareContext) {
			this._pScissorRect.x = this._globalPos.x - this._pStage.x;
			this._pScissorRect.y = this._globalPos.y - this._pStage.y;
			this.notifyScissorUpdate();
		}

		this.notifyViewportUpdate();
	}

	/**
	 *
	 */
	public updateGlobalPos()
	{
		if (this._shareContext) {
			this._pScissorRect.x = this._globalPos.x - this._viewPort.x;
			this._pScissorRect.y = this._globalPos.y - this._viewPort.y;
		} else {
			this._pScissorRect.x = 0;
			this._pScissorRect.y = 0;
			this._viewPort.x = this._globalPos.x;
			this._viewPort.y = this._globalPos.y;
		}

		this.notifyScissorUpdate();
	}

	public _iApplyRenderableOwner(renderableOwner:IRenderableOwner)
	{
		var renderable:RenderableBase = this._pRenderablePool.getItem(renderableOwner);
		var render:RenderBase = renderable.render;

		//set local vars for faster referencing
		renderable.renderId = render.renderId;
		renderable.renderOrderId = render.renderOrderId;

		renderable.cascaded = false;

		var entity:IEntity = renderable.sourceEntity;
		var position:Vector3D = entity.scenePosition;

		// project onto camera's z-axis
		position = this._iEntryPoint.subtract(position);
		renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);
		renderable.maskId = entity._iAssignedMaskId();
		renderable.masksConfig = entity._iMasksConfig();

		//store reference to scene transform
		renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);

		if (render.requiresBlending) {
			renderable.next = this._pBlendedRenderableHead;
			this._pBlendedRenderableHead = renderable;
		} else {
			renderable.next = this._pOpaqueRenderableHead;
			this._pOpaqueRenderableHead = renderable;
		}

		this._pNumElements += renderable.subGeometryVO.subGeometry.numElements;
	}

	private _registerMask(obj:RenderableBase)
	{
		//console.log("registerMask");
		this._registeredMasks.push(obj);
	}

	public _renderMasks(masks:DisplayObject[][])
	{
		var gl = this._pContext["_gl"];
		//var oldRenderTarget = this._stage.renderTarget;

		//this._stage.setRenderTarget(this._image);
		//this._stage.clear();
		this._pContext.setColorMask(false, false, false, false);
		// TODO: Could we create masks within masks by providing a previous configID, and supply "clear/keep" on stencil fail
		//context.setStencilActions("frontAndBack", "always", "set", "set", "set");
		gl.enable(gl.STENCIL_TEST);
		this._maskConfig++;
		gl.stencilFunc(gl.ALWAYS, this._maskConfig, 0xff);
		gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

		var numLayers:number = masks.length;
		var numRenderables:number = this._registeredMasks.length;
		var renderable:RenderableBase;
		var children:Array<DisplayObject>;
		var numChildren:number;
		var mask:DisplayObject;

		for (var i:number = 0; i < numLayers; ++i) {
			if (i != 0) {
				gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
				gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
				this._maskConfig++;
			}

			children = masks[i];
			numChildren = children.length;

			for (var j:number = 0; j < numChildren; ++j) {
				mask = children[j];
				for (var k:number = 0; k < numRenderables; ++k) {
					renderable = this._registeredMasks[k];
					//console.log("testing for " + mask["hierarchicalMaskID"] + ", " + mask.name);
					if (renderable.maskId == mask.id) {
						//console.log("Rendering hierarchicalMaskID " + mask["hierarchicalMaskID"]);
						this._drawMask(renderable);
					}
				}
			}
		}

		gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

		this._pContext.setColorMask(true, true, true, true);
		//this._stage.setRenderTarget(oldRenderTarget);
	}

	private _drawMask(renderable:RenderableBase)
	{
		var render = renderable.render;
		var passes = render.passes;
		var len = passes.length;
		var pass = passes[len-1];

		this.activatePass(renderable, pass, this._pCamera);
		// only render last pass for now
		renderable._iRender(pass, this._pCamera, this._pRttViewProjectionMatrix);
		this.deactivatePass(renderable, pass);
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

export = RendererBase;