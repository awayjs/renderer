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
		private _segmentSetRenderablePool:away.pool.RenderablePool;
		private _skyboxRenderablePool:away.pool.RenderablePool;
		private _subMeshRenderablePool:away.pool.RenderablePool;

		public _pContext:away.gl.ContextGL;
		public _pStageGL:away.base.StageGL;

		public _pCamera:away.entities.Camera;
		public _iEntryPoint:away.geom.Vector3D;
		public _pCameraForward:away.geom.Vector3D;

		public _pBackBufferInvalid:boolean = true;
		public _depthPrepass:boolean = false;
		private _backgroundR:number = 0;
		private _backgroundG:number = 0;
		private _backgroundB:number = 0;
		private _backgroundAlpha:number = 1;
		public _shareContext:boolean = false;

		public _pRenderTarget:away.gl.TextureBase;
		public _pRenderTargetSurface:number;

		// only used by renderers that need to render geometry to textures
		public _width:number;
		public _height:number;

		private _renderToTexture:boolean;
		public textureRatioX:number = 1;
		public textureRatioY:number = 1;

		private _snapshotBitmapData:away.base.BitmapData;
		private _snapshotRequired:boolean;

		public _pRttViewProjectionMatrix:away.geom.Matrix3D = new away.geom.Matrix3D();

		private _onContextUpdateDelegate:Function;
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
		 * Creates a new RendererBase object.
		 */
		constructor(renderToTexture:boolean = false)
		{
			super();

			this._billboardRenderablePool = away.pool.RenderablePool.getPool(away.pool.BillboardRenderable);
			this._segmentSetRenderablePool = away.pool.RenderablePool.getPool(away.pool.SegmentSetRenderable);
			this._skyboxRenderablePool = away.pool.RenderablePool.getPool(away.pool.SkyboxRenderable);
			this._subMeshRenderablePool = away.pool.RenderablePool.getPool(away.pool.SubMeshRenderable);

			this._renderToTexture = renderToTexture;

			this._onContextUpdateDelegate = away.utils.Delegate.create(this, this.onContextUpdate);

			//default sorting algorithm
			this.renderableSorter = new away.sort.RenderableMergeSort();
		}

		public _iCreateEntityCollector():away.traverse.ICollector
		{
			return new away.traverse.EntityCollector();
		}

		public get iRenderToTexture():boolean
		{
			return this._renderToTexture;
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

			}

			if (!value) {
				this._pStageGL = null;
				this._pContext = null;
			} else {
				this._pStageGL = value;
				this._pStageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextUpdateDelegate);
				this._pStageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_RECREATED, this._onContextUpdateDelegate);

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
			this._pStageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextUpdateDelegate);
			this._pStageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_RECREATED, this._onContextUpdateDelegate);

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
		}

		/**
		 * Renders the potentially visible geometry to the back buffer or texture.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 * @param target An option target texture to render to.
		 * @param surfaceSelector The index of a CubeTexture's face to render to.
		 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
		 */
		public _iRender(entityCollector:away.traverse.ICollector, target:away.gl.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{
			if (!this._pStageGL || !this._pContext || !entityCollector.entityHead)
				return;

			this._pRttViewProjectionMatrix.copyFrom(entityCollector.camera.viewProjection);
			this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);

			this.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);

			// generate mip maps on target (if target exists)
			if (target)
				(<away.gl.Texture>target).generateMipmaps();

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
			var entity:away.pool.EntityListItem = entityCollector.entityHead;

			//set temp values for entry point and camera forward vector
			this._pCamera = entityCollector.camera;
			this._iEntryPoint = this._pCamera.scenePosition;
			this._pCameraForward = this._pCamera.transform.forwardVector;

			//iterate through all entities
			while (entity) {
				this.pFindRenderables(entity.entity)
				entity = entity.next;
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
		public pExecuteRender(entityCollector:away.traverse.ICollector, target:away.gl.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{
			this._pRenderTarget = target;
			this._pRenderTargetSurface = surfaceSelector;

			if (this._renderToTexture)
				this.pExecuteRenderToTexturePass(entityCollector);

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

		public pExecuteRenderToTexturePass(entityCollector:away.traverse.ICollector)
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Performs the actual drawing of geometry to the target.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 */
		public pDraw(entityCollector:away.traverse.ICollector, target:away.gl.TextureBase)
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
		 *
		 */
		public updateGlobalPos()
		{

		}


		/**
		 *
		 * @param billboard
		 * @protected
		 */
		public pApplyBillboard(billboard:away.entities.Billboard)
		{
			this.pApplyRenderable(<away.pool.RenderableBase> this._billboardRenderablePool.getItem(billboard));
		}


		/**
		 *
		 * @param mesh
		 * @protected
		 */
		public pApplyMesh(mesh:away.entities.Mesh)
		{
			var subMesh:away.base.SubMesh;
			var renderable:away.pool.SubMeshRenderable;

			var len:number /*uint*/ = mesh.subMeshes.length;
			for (var i:number /*uint*/ = 0; i < len; i++)
				this.pApplyRenderable(<away.pool.RenderableBase> this._subMeshRenderablePool.getItem(mesh.subMeshes[i]));
		}
		/**
		 *
		 * @param renderable
		 * @protected
		 */
		public pApplyRenderable(renderable:away.pool.RenderableBase)
		{
			var material:away.materials.MaterialBase = <away.materials.MaterialBase> renderable.materialOwner.material;
			var entity:away.entities.IEntity = renderable.sourceEntity;
			var position:away.geom.Vector3D = entity.scenePosition;

			if (material) {
				//set ids for faster referencing
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
			}

			this._pNumTriangles += renderable.subGeometry.numTriangles;
		}

		public pApplySkybox(skybox:away.entities.Skybox)
		{
			this.pApplyRenderable(<away.pool.RenderableBase> this._skyboxRenderablePool.getItem(skybox));
		}


		public pApplySegmentSet(segmentSet:away.entities.SegmentSet)
		{
			this.pApplyRenderable(<away.pool.RenderableBase> this._segmentSetRenderablePool.getItem(segmentSet));
		}

		/**
		 *
		 * @param entity
		 */
		public pFindRenderables(entity:away.entities.IEntity)
		{
			//TODO abstract conditional in the entity with a callback to IRenderer
			if (entity.assetType === away.library.AssetType.BILLBOARD) {
				this.pApplyBillboard(<away.entities.Billboard> entity);
			} else if (entity.assetType === away.library.AssetType.MESH) {
				this.pApplyMesh(<away.entities.Mesh> entity);
			} else if (entity.assetType === away.library.AssetType.SKYBOX) {
				this.pApplySkybox(<away.entities.Skybox> entity)
			} else if (entity.assetType === away.library.AssetType.SEGMENT_SET) {
				this.pApplySegmentSet(<away.entities.SegmentSet> entity)
			}
		}
	}
}
