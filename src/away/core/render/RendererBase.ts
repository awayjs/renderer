///<reference path="../../_definitions.ts"/>

/**
 * @module away.render
 */
module away.render
{
	/**
	 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
	 * contents of a partition
	 *
	 * @class away.render.RendererBase
	 */
	export class RendererBase extends away.events.EventDispatcher
	{
		private _billboardRenderablePool:away.pool.RenderablePool;
		private _skyboxRenderablePool:away.pool.RenderablePool;
		private _triangleSubMeshRenderablePool:away.pool.RenderablePool;
		private _lineSubMeshRenderablePool:away.pool.RenderablePool;

		public _pContext:away.gl.ContextGL;
		public _pStageGL:away.base.StageGL;

		public _pCamera:away.entities.Camera;
		public _iEntryPoint:away.geom.Vector3D;
		public _pCameraForward:away.geom.Vector3D;

		public _pRttBufferManager:away.managers.RTTBufferManager;
		private _viewPort:away.geom.Rectangle = new away.geom.Rectangle();
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

		private _snapshotBitmapData:away.base.BitmapData;
		private _snapshotRequired:boolean;

		public _pRttViewProjectionMatrix:away.geom.Matrix3D = new away.geom.Matrix3D();

		private _localPos:away.geom.Point = new away.geom.Point();
		private _globalPos:away.geom.Point = new away.geom.Point();
		public _pScissorRect:away.geom.Rectangle = new away.geom.Rectangle();

		private _scissorUpdated:away.events.RendererEvent;
		private _viewPortUpdated:away.events.RendererEvent;

		private _onContextUpdateDelegate:Function;
		private _onViewportUpdatedDelegate;

		public _pNumTriangles:number = 0;

		public _pOpaqueRenderableHead:away.pool.RenderableBase;
		public _pBlendedRenderableHead:away.pool.RenderableBase;

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
		public renderableSorter:away.sort.IEntitySorter;


		/**
		 * A viewPort rectangle equivalent of the StageGL size and position.
		 */
		public get viewPort():away.geom.Rectangle
		{
			return this._viewPort;
		}

		/**
		 * A scissor rectangle equivalent of the view size and position.
		 */
		public get scissorRect():away.geom.Rectangle
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

			this._onViewportUpdatedDelegate = away.utils.Delegate.create(this, this.onViewportUpdated);

			this._billboardRenderablePool = away.pool.RenderablePool.getPool(away.pool.BillboardRenderable);
			this._skyboxRenderablePool = away.pool.RenderablePool.getPool(away.pool.SkyboxRenderable);
			this._triangleSubMeshRenderablePool = away.pool.RenderablePool.getPool(away.pool.TriangleSubMeshRenderable);
			this._lineSubMeshRenderablePool = away.pool.RenderablePool.getPool(away.pool.LineSubMeshRenderable);

			this._onContextUpdateDelegate = away.utils.Delegate.create(this, this.onContextUpdate);

			//default sorting algorithm
			this.renderableSorter = new away.sort.RenderableMergeSort();
		}

		public _iCreateEntityCollector():away.traverse.ICollector
		{
			return new away.traverse.EntityCollector();
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
		 * The StageGL that will provide the ContextGL used for rendering.
		 */
		public get stageGL():away.base.StageGL
		{
			return this._pStageGL;
		}

		public set stageGL(value:away.base.StageGL)
		{
			if (value == this._pStageGL)
				return;

			this.iSetStageGL(value);
		}

		public iSetStageGL(value:away.base.StageGL)
		{
			if (this._pStageGL) {
				this._pStageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextUpdateDelegate);
				this._pStageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_RECREATED, this._onContextUpdateDelegate);
				this._pStageGL.removeEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
			}

			if (!value) {
				this._pStageGL = null;
				this._pContext = null;
			} else {
				this._pStageGL = value;
				this._pStageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextUpdateDelegate);
				this._pStageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_RECREATED, this._onContextUpdateDelegate);
				this._pStageGL.addEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);

				/*
				 if (_backgroundImageRenderer)
				 _backgroundImageRenderer.stageGL = value;
				 */
				if (this._pStageGL.contextGL)
					this._pContext = this._pStageGL.contextGL;
			}

			this._pBackBufferInvalid = true;

			this.updateGlobalPos();
		}

		/**
		 * Defers control of ContextGL clear() and present() calls to StageGL, enabling multiple StageGL frameworks
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

			this._pStageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextUpdateDelegate);
			this._pStageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_RECREATED, this._onContextUpdateDelegate);
			this._pStageGL.removeEventListener(away.events.StageGLEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);

			this._pStageGL = null;

			/*
			 if (_backgroundImageRenderer) {
			 _backgroundImageRenderer.dispose();
			 _backgroundImageRenderer = null;
			 }
			 */
		}

		public render(entityCollector:away.traverse.ICollector)
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
		public _iRender(entityCollector:away.traverse.ICollector, target:away.textures.TextureProxyBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{
			if (!this._pStageGL || !this._pContext || !entityCollector.entityHead)
				return;

			this._pRttViewProjectionMatrix.copyFrom(entityCollector.camera.viewProjection);
			this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

			this.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);

			// generate mip maps on target (if target exists) //TODO
			//if (target)
			//	(<away.gl.Texture>target).generateMipmaps();

			// clear buffers
			for (var i:number = 0; i < 8; ++i) {
				this._pContext.setVertexBufferAt(i, null);
				this._pContext.setTextureAt(i, null);
			}
		}

		public pCollectRenderables(entityCollector:away.traverse.ICollector)
		{
			//reset head values
			this._pBlendedRenderableHead = null;
			this._pOpaqueRenderableHead = null;
			this._pNumTriangles = 0;

			//grab entity head
			var item:away.pool.EntityListItem = entityCollector.entityHead;

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
			this._pOpaqueRenderableHead = <away.pool.RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = <away.pool.RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}

		/**
		 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 * @param target An option target texture to render to.
		 * @param surfaceSelector The index of a CubeTexture's face to render to.
		 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
		 */
		public pExecuteRender(entityCollector:away.traverse.ICollector, target:away.textures.TextureProxyBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{
			this._pStageGL.setRenderTarget(target, true, surfaceSelector);

			if ((target || !this._shareContext) && !this._depthPrepass)
				this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

			this._pContext.setDepthTest(false, away.gl.ContextGLCompareMode.ALWAYS);

			this._pStageGL.scissorRect = scissorRect;

			/*
			 if (_backgroundImageRenderer)
			 _backgroundImageRenderer.render();
			 */

			this.pDraw(entityCollector, target);

			//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
			//this._pContext.setDepthTest(false, away.gl.ContextGLCompareMode.LESS_EQUAL); //oopsie

			if (!this._shareContext) {
				if (this._snapshotRequired && this._snapshotBitmapData) {
					this._pContext.drawToBitmapData(this._snapshotBitmapData);
					this._snapshotRequired = false;
				}
			}

			this._pStageGL.scissorRect = null;
		}

		/*
		 * Will draw the renderer's output on next render to the provided bitmap data.
		 * */
		public queueSnapshot(bmd:away.base.BitmapData)
		{
			this._snapshotRequired = true;
			this._snapshotBitmapData = bmd;
		}

		/**
		 * Performs the actual drawing of geometry to the target.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 */
		public pDraw(entityCollector:away.traverse.ICollector, target:away.textures.TextureProxyBase)
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Assign the context once retrieved
		 */
		private onContextUpdate(event:Event)
		{

			this._pContext = this._pStageGL.contextGL;
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
		 public get iBackground():away.textures.Texture2DBase
		 {
		 return this._background;
		 }
		 */

		/*
		 public set iBackground(value:away.textures.Texture2DBase)
		 {
		 if (this._backgroundImageRenderer && !value) {
		 this._backgroundImageRenderer.dispose();
		 this._backgroundImageRenderer = null;
		 }

		 if (!this._backgroundImageRenderer && value)
		 {

		 this._backgroundImageRenderer = new BackgroundImageRenderer(this._pStageGL);

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
				this._scissorUpdated = new away.events.RendererEvent(away.events.RendererEvent.SCISSOR_UPDATED);

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
				this._viewPortUpdated = new away.events.RendererEvent(away.events.RendererEvent.VIEWPORT_UPDATED);

			this.dispatchEvent(this._viewPortUpdated);
		}

		/**
		 *
		 */
		public onViewportUpdated(event:away.events.StageGLEvent)
		{
			this._viewPort = this._pStageGL.viewPort;
			//TODO stop firing viewport updated for every stagegl viewport change

			if (this._shareContext) {
				this._pScissorRect.x = this._globalPos.x - this._pStageGL.x;
				this._pScissorRect.y = this._globalPos.y - this._pStageGL.y;
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
		public applyBillboard(billboard:away.entities.Billboard)
		{
			this._applyRenderable(<away.pool.RenderableBase> this._billboardRenderablePool.getItem(billboard));
		}

		/**
		 *
		 * @param triangleSubMesh
		 */
		public applyTriangleSubMesh(triangleSubMesh:away.base.TriangleSubMesh)
		{
			this._applyRenderable(<away.pool.RenderableBase> this._triangleSubMeshRenderablePool.getItem(triangleSubMesh));
		}

		/**
		 *
		 * @param lineSubMesh
		 */
		public applyLineSubMesh(lineSubMesh:away.base.LineSubMesh)
		{
			this._applyRenderable(<away.pool.RenderableBase> this._lineSubMeshRenderablePool.getItem(lineSubMesh));
		}

		/**
		 *
		 * @param skybox
		 */
		public applySkybox(skybox:away.entities.Skybox)
		{
			this._applyRenderable(<away.pool.RenderableBase> this._skyboxRenderablePool.getItem(skybox));
		}

		/**
		 *
		 * @param renderable
		 * @protected
		 */
		private _applyRenderable(renderable:away.pool.RenderableBase)
		{
			var material:away.materials.IMaterial = renderable.materialOwner.material;
			var entity:away.entities.IEntity = renderable.sourceEntity;
			var position:away.geom.Vector3D = entity.scenePosition;

			if (!material)
				material = away.materials.DefaultMaterialManager.getDefaultMaterial(renderable.materialOwner);

			//set ids for faster referencing
			renderable.material = <away.materials.MaterialBase> material;
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
