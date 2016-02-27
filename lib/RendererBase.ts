import ImageBase					= require("awayjs-core/lib/image/ImageBase");
import BitmapImage2D				= require("awayjs-core/lib/image/BitmapImage2D");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Plane3D						= require("awayjs-core/lib/geom/Plane3D");
import Point						= require("awayjs-core/lib/geom/Point");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import IAbstractionPool				= require("awayjs-core/lib/library/IAbstractionPool");
import ByteArray					= require("awayjs-core/lib/utils/ByteArray");

import IRenderable					= require("awayjs-display/lib/base/IRenderable");
import IRenderer					= require("awayjs-display/lib/IRenderer");
import INode						= require("awayjs-display/lib/partition/INode");
import DisplayObject				= require("awayjs-display/lib/display/DisplayObject");
import Camera						= require("awayjs-display/lib/display/Camera");
import IEntity						= require("awayjs-display/lib/display/IEntity");
import Scene						= require("awayjs-display/lib/display/Scene");
import RendererEvent				= require("awayjs-display/lib/events/RendererEvent");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");

import AGALMiniAssembler			= require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import StageEvent					= require("awayjs-stagegl/lib/events/StageEvent");
import StageManager					= require("awayjs-stagegl/lib/managers/StageManager");
import ProgramData					= require("awayjs-stagegl/lib/image/ProgramData");
import GL_IAssetClass				= require("awayjs-stagegl/lib/library/GL_IAssetClass");

import ISurfaceClassGL				= require("awayjs-renderergl/lib/surfaces/ISurfaceClassGL");
import GL_SurfaceBase				= require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
import GL_RenderableBase			= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import SurfacePool					= require("awayjs-renderergl/lib/surfaces/SurfacePool");
import IPass						= require("awayjs-renderergl/lib/surfaces/passes/IPass");
import ElementsPool					= require("awayjs-renderergl/lib/elements/ElementsPool");
import IEntitySorter				= require("awayjs-renderergl/lib/sort/IEntitySorter");
import RenderableMergeSort			= require("awayjs-renderergl/lib/sort/RenderableMergeSort");


/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
class RendererBase extends EventDispatcher implements IRenderer, IAbstractionPool
{
	public static _iCollectionMark = 0;
	public static _abstractionClassPool:Object = new Object();

	private _objectPools:Object = new Object();
	private _abstractionPool:Object = new Object();

	private _maskConfig:number;
	private _activeMasksDirty:boolean;
	private _activeMasksConfig:Array<Array<number>> = new Array<Array<number>>();
	private _registeredMasks : Array<GL_RenderableBase> = new Array<GL_RenderableBase>();
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;

	public _pContext:IContextGL;
	public _pStage:Stage;

	private _cameraPosition:Vector3D;
	private _cameraTransform:Matrix3D;
	private _cameraForward:Vector3D = new Vector3D();

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

	private _onContextUpdateDelegate:(event:StageEvent) => void;
	private _onViewportUpdatedDelegate:(event:StageEvent) => void;

	public _pNumElements:number = 0;

	public _pOpaqueRenderableHead:GL_RenderableBase;
	public _pBlendedRenderableHead:GL_RenderableBase;
	public _disableColor:boolean = false;
	public _renderBlended:boolean = true;
	private _cullPlanes:Array<Plane3D>;
	private _customCullPlanes:Array<Plane3D>;
	private _numCullPlanes:number = 0;

	public isDebugEnabled:boolean = false;

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
	constructor(stage:Stage = null, surfaceClassGL:ISurfaceClassGL = null, forceSoftware:boolean = false, profile:string = "baseline", mode:string = "auto")
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

		for (var i in ElementsPool._abstractionClassPool)
			this._objectPools[i] = new SurfacePool(ElementsPool._abstractionClassPool[i], this._pStage, surfaceClassGL);
	}


	public getAbstraction(renderable:IRenderable):GL_RenderableBase
	{
		return this._abstractionPool[renderable.id] || (this._abstractionPool[renderable.id] = new (<GL_IAssetClass> RendererBase._abstractionClassPool[renderable.assetType])(renderable, this));
	}

	/**
	 *
	 * @param image
	 */
	public clearAbstraction(renderable:IRenderable)
	{
		this._abstractionPool[renderable.id] = null;
	}

	/**
	 * //TODO
	 *
	 * @param elementsClass
	 * @returns SurfacePool
	 */
	public getSurfacePool(elements:ElementsBase):SurfacePool
	{
		return this._objectPools[elements.assetType];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(renderableClass:GL_IAssetClass, assetClass:IAssetClass)
	{
		RendererBase._abstractionClassPool[assetClass.assetType] = renderableClass;
	}

	public activatePass(renderableGL:GL_RenderableBase, pass:IPass, camera:Camera)
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

		//activate shader object through renderableGL
		renderableGL._iActivate(pass, camera);
	}

	public deactivatePass(renderableGL:GL_RenderableBase, pass:IPass)
	{
		//deactivate shader object
		renderableGL._iDeactivate(pass);

		this._numUsedStreams = pass.shader.numUsedStreams;
		this._numUsedTextures = pass.shader.numUsedTextures;
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

	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose()
	{
		for (var id in this._abstractionPool)
			this._abstractionPool[id].clear();

		this._abstractionPool = null;

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

	public render(camera:Camera, scene:Scene)
	{
		this._viewportDirty = false;
		this._scissorDirty = false;
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public _iRender(camera:Camera, scene:Scene, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		//TODO refactor setTarget so that rendertextures are created before this check
		if (!this._pStage || !this._pContext)
			return;

		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumElements = 0;

		this._cullPlanes = this._customCullPlanes? this._customCullPlanes : camera.frustumPlanes;
		this._numCullPlanes = this._cullPlanes? this._cullPlanes.length : 0;
		this._cameraPosition = camera.scenePosition;
		this._cameraTransform = camera.sceneTransform;
		this._cameraForward = Matrix3DUtils.getForward(camera.sceneTransform, this._cameraForward);

		RendererBase._iCollectionMark++;

		scene.traversePartitions(this);

		//sort the resulting renderables
		if (this.renderableSorter) {
			this._pOpaqueRenderableHead = <GL_RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = <GL_RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}

		this._pRttViewProjectionMatrix.copyFrom(camera.viewProjection);
		this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

		this.pExecuteRender(camera, target, scissorRect, surfaceSelector);

		// generate mip maps on target (if target exists) //TODO
		//if (target)
		//	(<Texture>target).generateMipmaps();

		// clear buffers
		for (var i:number = 0; i < 8; ++i) {
			this._pContext.setVertexBufferAt(i, null);
			this._pContext.setTextureAt(i, null);
		}
	}

	public _iRenderCascades(camera:Camera, scene:Scene, target:ImageBase, numCascades:number, scissorRects:Array<Rectangle>, cameras:Array<Camera>)
	{
		this._pStage.setRenderTarget(target, true, 0);
		this._pContext.clear(1, 1, 1, 1, 1, 0);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

		var head:GL_RenderableBase = this._pOpaqueRenderableHead;

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
	public pExecuteRender(camera:Camera, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		this._pStage.setRenderTarget(target, true, surfaceSelector);

		if ((target || !this._shareContext) && !this._depthPrepass)
			this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

		this._pStage.scissorRect = scissorRect;

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		this.pDraw(camera);

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
	 */
	public pDraw(camera:Camera)
	{
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		if (this._disableColor)
			this._pContext.setColorMask(false, false, false, false);

		this.drawRenderables(camera, this._pOpaqueRenderableHead);

		if (this._renderBlended)
			this.drawRenderables(camera, this._pBlendedRenderableHead);

		if (this._disableColor)
			this._pContext.setColorMask(true, true, true, true);
	}

	//private drawCascadeRenderables(renderableGL:GL_RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
	//{
	//	var renderableGL2:GL_RenderableBase;
	//	var render:GL_SurfaceBase;
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
	public drawRenderables(camera:Camera, renderableGL:GL_RenderableBase)
	{
		var i:number;
		var len:number;
		var renderableGL2:GL_RenderableBase;
		var surfaceGL:GL_SurfaceBase;
		var passes:Array<IPass>;
		var pass:IPass;

		this._pContext.setStencilActions("frontAndBack", "always", "keep", "keep", "keep");

		this._registeredMasks.length = 0;
		var gl = this._pContext["_gl"];
		if(gl) {
			gl.disable(gl.STENCIL_TEST);
		}

		this._maskConfig = 0;

		while (renderableGL) {
			surfaceGL = renderableGL.surfaceGL;
			passes = surfaceGL.passes;

			// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
			if (this._disableColor && surfaceGL._surface.alphaThreshold != 0) {
				renderableGL2 = renderableGL;
				// fast forward
				do {
					renderableGL2 = renderableGL2.next;

				} while (renderableGL2 && renderableGL2.surfaceGL == surfaceGL);
			} else {
				if (this._activeMasksDirty || this._checkMasksConfig(renderableGL.masksConfig)) {
					this._activeMasksConfig = renderableGL.masksConfig;
					if (!this._activeMasksConfig.length) {
						// disable stencil
						if(gl) {
							gl.disable(gl.STENCIL_TEST);
							gl.stencilFunc(gl.ALWAYS, 0, 0xff);
							gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
						}
					} else {
						this._renderMasks(camera, renderableGL.sourceEntity._iAssignedMasks());
					}
					this._activeMasksDirty = false;
				}


				//iterate through each shader object
				len = passes.length;
				for (i = 0; i < len; i++) {
					renderableGL2 = renderableGL;
					pass = passes[i];

					this.activatePass(renderableGL, pass, camera);

					do {
						if (renderableGL2.maskId !== -1) {
							if (i == 0)
								this._registerMask(renderableGL2);
						} else {
							renderableGL2._iRender(pass, camera, this._pRttViewProjectionMatrix);
						}

						renderableGL2 = renderableGL2.next;

					} while (renderableGL2 && renderableGL2.surfaceGL == surfaceGL && !(this._activeMasksDirty = this._checkMasksConfig(renderableGL2.masksConfig)));

					this.deactivatePass(renderableGL, pass);
				}
			}

			renderableGL = renderableGL2;
		}
	}

	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event:StageEvent)
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

	/**
	 *
	 * @param node
	 * @returns {boolean}
	 */
	public enterNode(node:INode):boolean
	{
		var enter:boolean = node._iCollectionMark != RendererBase._iCollectionMark && node.isInFrustum(this._cullPlanes, this._numCullPlanes);

		node._iCollectionMark = RendererBase._iCollectionMark;

		return enter;
	}

	public applyRenderable(renderable:IRenderable)
	{
		var renderableGL:GL_RenderableBase = this.getAbstraction(renderable);
		var surfaceGL:GL_SurfaceBase = renderableGL.surfaceGL;

		//set local vars for faster referencing
		renderableGL.surfaceID = surfaceGL.surfaceID;
		renderableGL.renderOrderId = surfaceGL.renderOrderId;

		renderableGL.cascaded = false;

		var entity:IEntity = renderableGL.sourceEntity;
		var position:Vector3D = entity.scenePosition;

		// project onto camera's z-axis
		position = this._cameraPosition.subtract(position);
		renderableGL.zIndex = entity.zOffset + position.dotProduct(this._cameraForward);
		renderableGL.maskId = entity._iAssignedMaskId();
		renderableGL.masksConfig = entity._iMasksConfig();

		//store reference to scene transform
		renderableGL.renderSceneTransform = renderableGL.sourceEntity.getRenderSceneTransform(this._cameraTransform);

		if (surfaceGL.requiresBlending) {
			renderableGL.next = this._pBlendedRenderableHead;
			this._pBlendedRenderableHead = renderableGL;
		} else {
			renderableGL.next = this._pOpaqueRenderableHead;
			this._pOpaqueRenderableHead = renderableGL;
		}

		this._pNumElements += renderableGL.elements.numElements;
	}

	/**
	 *
	 * @param entity
	 */
	public applyDirectionalLight(entity:IEntity)
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applyLightProbe(entity:IEntity)
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applyPointLight(entity:IEntity)
	{
		//don't do anything here
	}

	/**
	 *
	 * @param entity
	 */
	public applySkybox(entity:IEntity)
	{
		//don't do anything here
	}

	private _registerMask(obj:GL_RenderableBase)
	{
		//console.log("registerMask");
		this._registeredMasks.push(obj);
	}

	public _renderMasks(camera:Camera, masks:DisplayObject[][])
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
		var renderableGL:GL_RenderableBase;
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
					renderableGL = this._registeredMasks[k];
					//console.log("testing for " + mask["hierarchicalMaskID"] + ", " + mask.name);
					if (renderableGL.maskId == mask.id) {
						//console.log("Rendering hierarchicalMaskID " + mask["hierarchicalMaskID"]);
						this._drawMask(camera, renderableGL);
					}
				}
			}
		}

		gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

		this._pContext.setColorMask(true, true, true, true);
		//this._stage.setRenderTarget(oldRenderTarget);
	}

	private _drawMask(camera:Camera, renderableGL:GL_RenderableBase)
	{
		var surfaceGL = renderableGL.surfaceGL;
		var passes = surfaceGL.passes;
		var len = passes.length;
		var pass = passes[len-1];

		this.activatePass(renderableGL, pass, camera);
		// only render last pass for now
		renderableGL._iRender(pass, camera, this._pRttViewProjectionMatrix);
		this.deactivatePass(renderableGL, pass);
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