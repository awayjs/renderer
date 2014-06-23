///<reference path="../../_definitions.ts"/>

/**
 * @module away.render
 */
module away.render
{
	import BitmapData					= away.base.BitmapData;
	import LineSubMesh					= away.base.LineSubMesh;
	import TriangleSubMesh				= away.base.TriangleSubMesh;
	import Stage						= away.base.Stage;
	import Billboard					= away.entities.Billboard;
	import Camera						= away.entities.Camera;
	import IEntity						= away.entities.IEntity;
	import Skybox						= away.entities.Skybox;
	import RendererEvent				= away.events.RendererEvent;
	import StageEvent					= away.events.StageEvent;
	import Matrix3D						= away.geom.Matrix3D;
	import Point						= away.geom.Point;
	import Rectangle					= away.geom.Rectangle;
	import Vector3D						= away.geom.Vector3D;
	import RTTBufferManager				= away.managers.RTTBufferManager;
	import DefaultMaterialManager		= away.materials.DefaultMaterialManager;
	import MaterialBase					= away.materials.MaterialBase;
	import BillboardRenderable			= away.pool.BillboardRenderable;
	import EntityListItem				= away.pool.EntityListItem;
	import LineSubMeshRenderable		= away.pool.LineSubMeshRenderable;
	import RenderablePool				= away.pool.RenderablePool;
	import RenderableBase				= away.pool.RenderableBase;
	import TriangleSubMeshRenderable	= away.pool.TriangleSubMeshRenderable;
	import IEntitySorter				= away.sort.IEntitySorter;
	import RenderableMergeSort			= away.sort.RenderableMergeSort;
	import ContextGLCompareMode			= away.stagegl.ContextGLCompareMode;
	import IContextStageGL				= away.stagegl.IContextStageGL;
	import TextureProxyBase				= away.textures.TextureProxyBase;
	import EntityCollector				= away.traverse.EntityCollector;
	import ICollector					= away.traverse.ICollector;
	import ShadowCasterCollector		= away.traverse.ShadowCasterCollector;
	
	/**
	 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
	 * contents of a partition
	 *
	 * @class away.render.RendererBase
	 */
	export class RendererBase extends away.events.EventDispatcher
	{
		private _billboardRenderablePool:RenderablePool;
		private _triangleSubMeshRenderablePool:RenderablePool;
		private _lineSubMeshRenderablePool:RenderablePool;

		public _pContext:IContextStageGL;
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

			this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable);
			this._triangleSubMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable);
			this._lineSubMeshRenderablePool = RenderablePool.getPool(LineSubMeshRenderable);

			this._onContextUpdateDelegate = (event:Event) => this.onContextUpdate(event);

			//default sorting algorithm
			this.renderableSorter = new RenderableMergeSort();
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
					this._pContext = <IContextStageGL> this._pStage.context;
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
			if (!this._pStage || !this._pContext || !entityCollector.entityHead)
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
			this._pContext.setRenderTarget(target, true, surfaceSelector);

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
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Assign the context once retrieved
		 */
		private onContextUpdate(event:Event)
		{
			this._pContext = <IContextStageGL> this._pStage.context;
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
			var material:MaterialBase = renderable.materialOwner.material;
			var entity:IEntity = renderable.sourceEntity;
			var position:Vector3D = entity.scenePosition;

			if (!material)
				material = DefaultMaterialManager.getDefaultMaterial(renderable.materialOwner);

			//update material if invalidated
			material.iUpdateMaterial();

			//set ids for faster referencing
			renderable.material = material;
			renderable.materialId = material._iMaterialId;
			renderable.renderOrderId = material._iRenderOrderId;
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
	}
}
