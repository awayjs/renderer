import BitmapData					= require("awayjs-core/lib/base/BitmapData");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Point						= require("awayjs-core/lib/geom/Point");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");
import TextureProxyBase				= require("awayjs-core/lib/textures/TextureProxyBase");
import ByteArray					= require("awayjs-core/lib/utils/ByteArray");

import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import IMaterialOwner				= require("awayjs-display/lib/base/IMaterialOwner");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import EntityListItem				= require("awayjs-display/lib/pool/EntityListItem");
import RenderablePool				= require("awayjs-display/lib/pool/RenderablePool");
import IEntitySorter				= require("awayjs-display/lib/sort/IEntitySorter");
import RenderableMergeSort			= require("awayjs-display/lib/sort/RenderableMergeSort");
import IRenderer					= require("awayjs-display/lib/render/IRenderer");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import Camera						= require("awayjs-display/lib/entities/Camera");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import RendererEvent				= require("awayjs-display/lib/events/RendererEvent");
import StageEvent					= require("awayjs-display/lib/events/StageEvent");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import ICollector					= require("awayjs-display/lib/traverse/ICollector");
import ShadowCasterCollector		= require("awayjs-display/lib/traverse/ShadowCasterCollector");

import AGALMiniAssembler			= require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import BillboardRenderable			= require("awayjs-renderergl/lib/pool/BillboardRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
import MaterialData					= require("awayjs-renderergl/lib/pool/MaterialData");
import MaterialDataPool				= require("awayjs-renderergl/lib/pool/MaterialDataPool");
import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import MaterialPassDataPool			= require("awayjs-renderergl/lib/pool/MaterialPassDataPool");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import MaterialGLBase				= require("awayjs-renderergl/lib/materials/MaterialGLBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import DefaultMaterialManager		= require("awayjs-renderergl/lib/managers/DefaultMaterialManager");

/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
class RendererBase extends EventDispatcher
{
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;

	private _materialDataPool:MaterialDataPool;
	private _billboardRenderablePool:RenderablePool;
	private _triangleSubMeshRenderablePool:RenderablePool;
	private _lineSubMeshRenderablePool:RenderablePool;

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
	public _shareContext:boolean = false;

	// only used by renderers that need to render geometry to textures
	public _width:number;
	public _height:number;

	public textureRatioX:number = 1;
	public textureRatioY:number = 1;

	private _snapshotBitmapData:BitmapData;
	private _snapshotRequired:boolean;

	public _pRttViewProjectionMatrix:Matrix3D = new Matrix3D();

	private _localPos:Point = new Point();
	private _globalPos:Point = new Point();
	public _pScissorRect:Rectangle = new Rectangle();

	private _scissorUpdated:RendererEvent;
	private _viewPortUpdated:RendererEvent;

	private _onContextUpdateDelegate:Function;
	private _onViewportUpdatedDelegate;

	public _pNumTriangles:number = 0;

	public _pOpaqueRenderableHead:RenderableBase;
	public _pBlendedRenderableHead:RenderableBase;

	/**
	 *
	 */
	public get numTriangles():number
	{
		return this._pNumTriangles;
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
	constructor()
	{
		super();

		this._onViewportUpdatedDelegate = (event:StageEvent) => this.onViewportUpdated(event);

		this._materialDataPool = new MaterialDataPool();

		this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable);
		this._triangleSubMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable);
		this._lineSubMeshRenderablePool = RenderablePool.getPool(LineSubMeshRenderable);

		this._onContextUpdateDelegate = (event:Event) => this.onContextUpdate(event);

		//default sorting algorithm
		this.renderableSorter = new RenderableMergeSort();
	}


	public getProgram(materialPassData:MaterialPassData):ProgramData
	{
		//check key doesn't need re-concatenating
		if (!materialPassData.key.length) {
			materialPassData.key = materialPassData.animationVertexCode +
			materialPassData.vertexCode +
			"---" +
			materialPassData.fragmentCode +
			materialPassData.animationFragmentCode +
			materialPassData.postAnimationFragmentCode;
		} else {
			return materialPassData.programData;
		}

		var programData:ProgramData = this._pStage.getProgramData(materialPassData.key);

		//check program data hasn't changed, keep count of program usages
		if (materialPassData.programData != programData) {
			if (materialPassData.programData)
				materialPassData.programData.dispose();

			materialPassData.programData = programData;

			programData.usages++;
		}

		return programData;
	}

	/**
	 *
	 * @param material
	 */
	public getMaterial(material:MaterialGLBase, profile:string):MaterialData
	{
		var materialData:MaterialData = this._materialDataPool.getItem(material);

		if (materialData.invalidAnimation) {
			materialData.invalidAnimation = false;

			var materialDataPasses:Array<MaterialPassData> = materialData.getMaterialPasses(profile);

			var enabledGPUAnimation:boolean = this.getEnabledGPUAnimation(material, materialDataPasses);

			var renderOrderId = 0;
			var mult:number = 1;
			var materialPassData:MaterialPassData;
			var len:number = materialDataPasses.length;
			for (var i:number = 0; i < len; i++) {
				materialPassData = materialDataPasses[i];

				if (materialPassData.usesAnimation != enabledGPUAnimation) {
					materialPassData.usesAnimation = enabledGPUAnimation;
					materialPassData.key == "";
				}

				if (materialPassData.key == "")
					this.calcAnimationCode(material, materialPassData);

				renderOrderId += this.getProgram(materialPassData).id*mult;
				mult *= 1000;
			}

			materialData.renderOrderId = renderOrderId;
		}

		return materialData;
	}

	public activateMaterialPass(materialPassData:MaterialPassData, camera:Camera)
	{
		var shaderObject:ShaderObjectBase = materialPassData.shaderObject;

		//clear unused vertex streams
		for (var i = shaderObject.numUsedStreams; i < this._numUsedStreams; i++)
			this._pContext.setVertexBufferAt(i, null);

		//clear unused texture streams
		for (var i = shaderObject.numUsedTextures; i < this._numUsedTextures; i++)
			this._pContext.setTextureAt(i, null);

		if (materialPassData.usesAnimation)
			(<AnimationSetBase> materialPassData.material.animationSet).activate(shaderObject, this._pStage);

		//activate shader object
		shaderObject.iActivate(this._pStage, camera);

		//check program data is uploaded
		var programData:ProgramData = this.getProgram(materialPassData);

		if (!programData.program) {
			programData.program = this._pContext.createProgram();
			var vertexByteCode:ByteArray = (new AGALMiniAssembler().assemble("part vertex 1\n" + materialPassData.animationVertexCode + materialPassData.vertexCode + "endpart"))['vertex'].data;
			var fragmentByteCode:ByteArray = (new AGALMiniAssembler().assemble("part fragment 1\n" + materialPassData.fragmentCode + materialPassData.animationFragmentCode + materialPassData.postAnimationFragmentCode + "endpart"))['fragment'].data;
			programData.program.upload(vertexByteCode, fragmentByteCode);
		}

		//set program data
		this._pContext.setProgram(programData.program);
	}

	public deactivateMaterialPass(materialPassData:MaterialPassData)
	{
		var shaderObject:ShaderObjectBase = materialPassData.shaderObject;

		if (materialPassData.usesAnimation)
			(<AnimationSetBase> materialPassData.material.animationSet).deactivate(shaderObject, this._pStage);

		materialPassData.shaderObject.iDeactivate(this._pStage);

		this._numUsedStreams = shaderObject.numUsedStreams;
		this._numUsedTextures = shaderObject.numUsedTextures;
	}

	public _iCreateEntityCollector():ICollector
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

	public set stage(value:Stage)
	{
		if (value == this._pStage)
			return;

		this.iSetStage(value);
	}

	public iSetStage(value:Stage)
	{
		if (this._pStage) {
			this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
			this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
			this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
		}

		if (!value) {
			this._pStage = null;
			this._pContext = null;
		} else {
			this._pStage = value;
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

		this._pBackBufferInvalid = true;

		this.updateGlobalPos();
	}

	/**
	 * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
	 * to share the same ContextGL object.
	 */
	public get shareContext():boolean
	{
		return this._shareContext;
	}

	public set shareContext(value:boolean)
	{
		if (this._shareContext == value)
			return;

		this._shareContext = value;

		this.updateGlobalPos();
	}

	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose()
	{
		if (this._pRttBufferManager)
			this._pRttBufferManager.dispose();

		this._pRttBufferManager = null;

		this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);

		this._pStage = null;

		/*
		 if (_backgroundImageRenderer) {
		 _backgroundImageRenderer.dispose();
		 _backgroundImageRenderer = null;
		 }
		 */
	}

	public render(entityCollector:ICollector)
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
	public _iRender(entityCollector:ICollector, target:TextureProxyBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
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

	public _iRenderCascades(entityCollector:ShadowCasterCollector, target:TextureProxyBase, numCascades:number, scissorRects:Array<Rectangle>, cameras:Array<Camera>)
	{

	}

	public pCollectRenderables(entityCollector:ICollector)
	{
		//reset head values
		this._pBlendedRenderableHead = null;
		this._pOpaqueRenderableHead = null;
		this._pNumTriangles = 0;

		//grab entity head
		var item:EntityListItem = entityCollector.entityHead;

		//set temp values for entry point and camera forward vector
		this._pCamera = entityCollector.camera;
		this._iEntryPoint = this._pCamera.scenePosition;
		this._pCameraForward = this._pCamera.transform.forwardVector;

		//iterate through all entities
		while (item) {
			item.entity._iCollectRenderables(this);
			item = item.next;
		}

		//sort the resulting renderables
		this._pOpaqueRenderableHead = <RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
		this._pBlendedRenderableHead = <RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
	}

	/**
	 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	 *
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 * @param target An option target texture to render to.
	 * @param surfaceSelector The index of a CubeTexture's face to render to.
	 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	 */
	public pExecuteRender(entityCollector:ICollector, target:TextureProxyBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		this._pStage.setRenderTarget(target, true, surfaceSelector);

		if ((target || !this._shareContext) && !this._depthPrepass)
			this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

		this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);

		this._pStage.scissorRect = scissorRect;

		/*
		 if (_backgroundImageRenderer)
		 _backgroundImageRenderer.render();
		 */

		this.pDraw(entityCollector, target);

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		//this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie

		if (!this._shareContext) {
			if (this._snapshotRequired && this._snapshotBitmapData) {
				this._pContext.drawToBitmapData(this._snapshotBitmapData);
				this._snapshotRequired = false;
			}
		}

		this._pStage.scissorRect = null;
	}

	/*
	 * Will draw the renderer's output on next render to the provided bitmap data.
	 * */
	public queueSnapshot(bmd:BitmapData)
	{
		this._snapshotRequired = true;
		this._snapshotBitmapData = bmd;
	}

	/**
	 * Performs the actual drawing of geometry to the target.
	 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	 */
	public pDraw(entityCollector:ICollector, target:TextureProxyBase)
	{
		throw new AbstractMethodError();
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


	/**
	 *
	 * @param billboard
	 * @protected
	 */
	public applyBillboard(billboard:Billboard)
	{
		this._applyRenderable(<RenderableBase> this._billboardRenderablePool.getItem(billboard));
	}

	/**
	 *
	 * @param triangleSubMesh
	 */
	public applyTriangleSubMesh(triangleSubMesh:TriangleSubMesh)
	{
		this._applyRenderable(<RenderableBase> this._triangleSubMeshRenderablePool.getItem(triangleSubMesh));
	}

	/**
	 *
	 * @param lineSubMesh
	 */
	public applyLineSubMesh(lineSubMesh:LineSubMesh)
	{
		this._applyRenderable(<RenderableBase> this._lineSubMeshRenderablePool.getItem(lineSubMesh));
	}

	/**
	 *
	 * @param renderable
	 * @protected
	 */
	private _applyRenderable(renderable:RenderableBase)
	{
		var material:MaterialGLBase = <MaterialGLBase> renderable.materialOwner.material;
		var entity:IEntity = renderable.sourceEntity;
		var position:Vector3D = entity.scenePosition;

		if (!material)
			material = DefaultMaterialManager.getDefaultMaterial(renderable.materialOwner);

		//update material if invalidated
		material._iUpdateMaterial();

		//set ids for faster referencing
		renderable.material = material;
		renderable.materialId = material._iMaterialId;
		renderable.renderOrderId = this.getMaterial(material, this._pStage.profile).renderOrderId;
		renderable.cascaded = false;

		// project onto camera's z-axis
		position = this._iEntryPoint.subtract(position);
		renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);

		//store reference to scene transform
		renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);

		if (material.requiresBlending) {
			renderable.next = this._pBlendedRenderableHead;
			this._pBlendedRenderableHead = renderable;
		} else {
			renderable.next = this._pOpaqueRenderableHead;
			this._pOpaqueRenderableHead = renderable;
		}

		this._pNumTriangles += renderable.numTriangles;

		//handle any overflow for renderables with data that exceeds GPU limitations
		if (renderable.overflow)
			this._applyRenderable(renderable.overflow);
	}


	/**
	 * test if animation will be able to run on gpu BEFORE compiling materials
	 * test if the shader objects supports animating the animation set in the vertex shader
	 * if any object using this material fails to support accelerated animations for any of the shader objects,
	 * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	 */
	private getEnabledGPUAnimation(material:MaterialBase, materialDataPasses:Array<MaterialPassData>):boolean
	{
		if (material.animationSet) {
			material.animationSet.resetGPUCompatibility();

			var owners:Array<IMaterialOwner> = material.iOwners;
			var numOwners:number = owners.length;

			var len:number = materialDataPasses.length;
			for (var i:number = 0; i < len; i++)
				for (var j:number = 0; j < numOwners; j++)
					if (owners[j].animator)
						(<AnimatorBase> owners[j].animator).testGPUCompatibility(materialDataPasses[i].shaderObject);

			return !material.animationSet.usesCPU;
		}

		return false;
	}

	public calcAnimationCode(material:MaterialBase, materialPassData:MaterialPassData)
	{
		//reset key so that the program is re-calculated
		materialPassData.key = "";
		materialPassData.animationVertexCode = "";
		materialPassData.animationFragmentCode = "";

		var shaderObject:ShaderObjectBase = materialPassData.shaderObject;

		//check to see if GPU animation is used
		if (materialPassData.usesAnimation) {

			var animationSet:AnimationSetBase = <AnimationSetBase> material.animationSet;

			materialPassData.animationVertexCode += animationSet.getAGALVertexCode(shaderObject);

			if (shaderObject.uvDependencies > 0 && !shaderObject.usesUVTransform)
				materialPassData.animationVertexCode += animationSet.getAGALUVCode(shaderObject);

			if (shaderObject.usesFragmentAnimation)
				materialPassData.animationFragmentCode += animationSet.getAGALFragmentCode(shaderObject, materialPassData.shadedTarget);

			animationSet.doneAGALCode(shaderObject);

		} else {
			// simply write attributes to targets, do not animate them
			// projection will pick up on targets[0] to do the projection
			var len:number = shaderObject.animatableAttributes.length;
			for (var i:number = 0; i < len; ++i)
				materialPassData.animationVertexCode += "mov " + shaderObject.animationTargetRegisters[i] + ", " + shaderObject.animatableAttributes[i] + "\n";

			if (shaderObject.uvDependencies > 0 && !shaderObject.usesUVTransform)
				materialPassData.animationVertexCode += "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
		}
	}
}

export = RendererBase;