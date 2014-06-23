///<reference path="../../_definitions.ts"/>

/**
 * @module away.render
 */
module away.render
{
	import LightBase					= away.base.LightBase;
	import Stage						= away.base.Stage;
	import Camera						= away.entities.Camera;
	import DirectionalLight				= away.entities.DirectionalLight;
	import PointLight					= away.entities.PointLight;
	import Filter3DBase					= away.filters.Filter3DBase;
	import Matrix3D						= away.geom.Matrix3D;
	import Rectangle					= away.geom.Rectangle;
	import Vector3D						= away.geom.Vector3D;
	import RTTBufferManager				= away.managers.RTTBufferManager;
	import StageManager					= away.managers.StageManager;
	import MaterialBase					= away.materials.MaterialBase;
	import ShadowMapperBase				= away.materials.ShadowMapperBase;
	import RenderableBase				= away.pool.RenderableBase;
	import RenderablePool				= away.pool.RenderablePool;
	import SkyboxRenderable				= away.pool.SkyboxRenderable;
	import ContextGLBlendFactor			= away.stagegl.ContextGLBlendFactor;
	import ContextGLCompareMode			= away.stagegl.ContextGLCompareMode;
	import ContextGLClearMask			= away.stagegl.ContextGLClearMask;
	import IContextStageGL				= away.stagegl.IContextStageGL;
	import RenderTexture				= away.textures.RenderTexture;
	import TextureProxyBase				= away.textures.TextureProxyBase;
	import EntityCollector				= away.traverse.EntityCollector;
	import ICollector					= away.traverse.ICollector;

	/**
	 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
	 * materials assigned to them.
	 *
	 * @class away.render.DefaultRenderer
	 */
	export class DefaultRenderer extends RendererBase implements IRenderer
	{
		public _pRequireDepthRender:boolean;
		private _skyboxRenderablePool:RenderablePool;

		private static RTT_PASSES:number = 1;
		private static SCREEN_PASSES:number = 2;
		private static ALL_PASSES:number = 3;

		private _activeMaterial:MaterialBase;
		private _pDistanceRenderer:DepthRenderer;
		private _pDepthRenderer:DepthRenderer;
		private _skyboxProjection:Matrix3D = new Matrix3D();
		public _pFilter3DRenderer:Filter3DRenderer;

		public _pDepthRender:TextureProxyBase;

		private _antiAlias:number;

		public get antiAlias():number
		{
			return this._antiAlias;
		}

		public set antiAlias(value:number)
		{
			if (this._antiAlias == value)
				return;

			this._antiAlias = value;

			this._pBackBufferInvalid = true;
		}

		/**
		 *
		 */
		public get depthPrepass():boolean
		{
			return this._depthPrepass;
		}

		public set depthPrepass(value:boolean)
		{
			this._depthPrepass = value;
		}

		/**
		 *
		 * @returns {*}
		 */
		public get filters3d():Array<Filter3DBase>
		{
			return this._pFilter3DRenderer? this._pFilter3DRenderer.filters : null;
		}
		public set filters3d(value:Array<Filter3DBase>)
		{
			if (value && value.length == 0)
				value = null;

			if (this._pFilter3DRenderer && !value) {
				this._pFilter3DRenderer.dispose();
				this._pFilter3DRenderer = null;
			} else if (!this._pFilter3DRenderer && value) {
				this._pFilter3DRenderer = new Filter3DRenderer(this._pStage);
				this._pFilter3DRenderer.filters = value;
			}

			if (this._pFilter3DRenderer) {
				this._pFilter3DRenderer.filters = value;
				this._pRequireDepthRender = this._pFilter3DRenderer.requireDepthRender;
			} else {
				this._pRequireDepthRender = false;

				if (this._pDepthRender) {
					this._pDepthRender.dispose();
					this._pDepthRender = null;
				}
			}
		}

		/**
		 * Creates a new DefaultRenderer object.
		 *
		 * @param antiAlias The amount of anti-aliasing to use.
		 * @param renderMode The render mode to use.
		 */
		constructor(forceSoftware:boolean = false, profile:string = "baseline", mode = "auto")
		{
			super();

			this._skyboxRenderablePool = RenderablePool.getPool(SkyboxRenderable);

			this._pDepthRenderer = new DepthRenderer();
			this._pDistanceRenderer = new DepthRenderer(false, true);

			if (this._pStage == null)
				this.stage = StageManager.getInstance().getFreeStage(forceSoftware, profile, mode);

			this._pRttBufferManager = RTTBufferManager.getInstance(this._pStage);

			if (this._width == 0)
				this.width = window.innerWidth;
			else
				this._pRttBufferManager.viewWidth = this._width;

			if (this._height == 0)
				this.height = window.innerHeight;
			else
				this._pRttBufferManager.viewHeight = this._height;
		}

		public render(entityCollector:ICollector)
		{
			super.render(entityCollector);

			if (!this._pStage.recoverFromDisposal()) {//if context has Disposed by the OS,don't render at this frame
				this._pBackBufferInvalid = true;
				return;
			}

			if (this._pBackBufferInvalid)// reset or update render settings
				this.pUpdateBackBuffer();

			if (this._shareContext && this._pContext)
				this._pContext.clear(0, 0, 0, 1, 1, 0, ContextGLClearMask.DEPTH);

			if (this._pFilter3DRenderer) {
				this.textureRatioX = this._pRttBufferManager.textureRatioX;
				this.textureRatioY = this._pRttBufferManager.textureRatioY;
			} else {
				this.textureRatioX = 1;
				this.textureRatioY = 1;
			}

			if (this._pRequireDepthRender)
				this.pRenderSceneDepthToTexture(<EntityCollector> entityCollector);

			if (this._depthPrepass)
				this.pRenderDepthPrepass(<EntityCollector> entityCollector);

			if (this._pFilter3DRenderer && this._pContext) { //TODO
				//this._iRender(entityCollector, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
				//this._pFilter3DRenderer.render(this._pStage, entityCollector.camera, this._pDepthRender);

			} else {

				if (this._shareContext)
					this._iRender(entityCollector, null, this._pScissorRect);
				else
					this._iRender(entityCollector);
			}

			super.render(entityCollector);

			if (!this._shareContext && this._pContext)
				this._pContext.present();

			// register that a view has been rendered
			this._pStage.bufferClear = false;
		}

		public pExecuteRender(entityCollector:EntityCollector, target:TextureProxyBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
		{
			this.updateLights(entityCollector);

			// otherwise RTT will interfere with other RTTs
			if (target) {
				this.pCollectRenderables(entityCollector);

				this.drawRenderables(this._pOpaqueRenderableHead, entityCollector, DefaultRenderer.RTT_PASSES);
				this.drawRenderables(this._pBlendedRenderableHead, entityCollector, DefaultRenderer.RTT_PASSES);
			}

			super.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);
		}

		private updateLights(entityCollector:EntityCollector)
		{
			var dirLights:Array<DirectionalLight> = entityCollector.directionalLights;
			var pointLights:Array<PointLight> = entityCollector.pointLights;
			var len:number, i:number;
			var light:LightBase;
			var shadowMapper:ShadowMapperBase;

			len = dirLights.length;
			for (i = 0; i < len; ++i) {
				light = dirLights[i];

				shadowMapper = light.shadowMapper;

				if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid ))
					shadowMapper.iRenderDepthMap(this._pStage, entityCollector, this._pDepthRenderer);
			}

			len = pointLights.length;
			for (i = 0; i < len; ++i) {
				light = pointLights[i];

				shadowMapper = light.shadowMapper;

				if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
					shadowMapper.iRenderDepthMap(this._pStage, entityCollector, this._pDistanceRenderer);
			}
		}

		/**
		 * @inheritDoc
		 */
		public pDraw(entityCollector:EntityCollector, target:TextureProxyBase)
		{
			if (!target)
				this.pCollectRenderables(entityCollector);

			this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

			if (entityCollector.skyBox) {
				if (this._activeMaterial)
					this._activeMaterial.iDeactivate(this._pStage);

				this._activeMaterial = null;

				this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);

				this.drawSkybox(entityCollector);
			}

			this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

			var which:number = target? DefaultRenderer.SCREEN_PASSES : DefaultRenderer.ALL_PASSES;

			this.drawRenderables(this._pOpaqueRenderableHead, entityCollector, which);
			this.drawRenderables(this._pBlendedRenderableHead, entityCollector, which);

			this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

			if (this._activeMaterial)
				this._activeMaterial.iDeactivate(this._pStage);

			this._activeMaterial = null;
		}

		/**
		 * Draw the skybox if present.
		 *
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawSkybox(entityCollector:EntityCollector)
		{
			var skyBox:SkyboxRenderable = <SkyboxRenderable> this._skyboxRenderablePool.getItem(entityCollector.skyBox);

			var material:MaterialBase = entityCollector.skyBox.material;

			var camera:Camera = entityCollector.camera;

			this.updateSkyboxProjection(camera);

			material.iActivatePass(0, this._pStage, camera);
			material.iRenderPass(0, skyBox, this._pStage, entityCollector, this._skyboxProjection);
			material.iDeactivatePass(0, this._pStage);
		}

		private updateSkyboxProjection(camera:Camera)
		{
			var near:Vector3D = new Vector3D();

			this._skyboxProjection.copyFrom(this._pRttViewProjectionMatrix);
			this._skyboxProjection.copyRowTo(2, near);

			var camPos:Vector3D = camera.scenePosition;

			var cx:number = near.x;
			var cy:number = near.y;
			var cz:number = near.z;
			var cw:number = -(near.x*camPos.x + near.y*camPos.y + near.z*camPos.z + Math.sqrt(cx*cx + cy*cy + cz*cz));

			var signX:number = cx >= 0? 1 : -1;
			var signY:number = cy >= 0? 1 : -1;

			var p:Vector3D = new Vector3D(signX, signY, 1, 1);

			var inverse:Matrix3D = this._skyboxProjection.clone();
			inverse.invert();

			var q:Vector3D = inverse.transformVector(p);

			this._skyboxProjection.copyRowTo(3, p);

			var a:number = (q.x*p.x + q.y*p.y + q.z*p.z + q.w*p.w)/(cx*q.x + cy*q.y + cz*q.z + cw*q.w);

			this._skyboxProjection.copyRowFrom(2, new Vector3D(cx*a, cy*a, cz*a, cw*a));
		}

		/**
		 * Draw a list of renderables.
		 *
		 * @param renderables The renderables to draw.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawRenderables(renderable:RenderableBase, entityCollector:ICollector, which:number)
		{
			var numPasses:number;
			var j:number;
			var camera:Camera = entityCollector.camera;
			var renderable2:RenderableBase;

			while (renderable) {
				this._activeMaterial = renderable.material;

				numPasses = this._activeMaterial._iNumPasses;

				j = this._activeMaterial._iBaseScreenPassIndex; //skip any depth passes

				do {
					renderable2 = renderable;

					var rttMask:number = this._activeMaterial.iPassRendersToTexture(j)? 1 : 2;

					if ((rttMask & which) != 0) {
						this._activeMaterial.iActivatePass(j, this._pStage, camera);

						do {
							this._activeMaterial.iRenderPass(j, renderable2, this._pStage, entityCollector, this._pRttViewProjectionMatrix);

							renderable2 = renderable2.next;

						} while (renderable2 && renderable2.material == this._activeMaterial);

						this._activeMaterial.iDeactivatePass(j, this._pStage);

					} else {
						do {
							renderable2 = renderable2.next;

						} while (renderable2 && renderable2.material == this._activeMaterial);
					}
				} while (++j < numPasses);

				renderable = renderable2;
			}
		}

		public dispose()
		{
			if (!this._shareContext)
				this._pStage.dispose();

			this._pDepthRenderer.dispose();
			this._pDistanceRenderer.dispose();
			this._pDepthRenderer = null;
			this._pDistanceRenderer = null;

			this._pDepthRender = null;

			super.dispose();
		}


		/**
		 *
		 */
		public pRenderDepthPrepass(entityCollector:EntityCollector)
		{
			this._pDepthRenderer.disableColor = true;

			if (this._pFilter3DRenderer) { //TODO
//				this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
//				this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
//				this._pDepthRenderer._iRender(entityCollector, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
			} else {
				this._pDepthRenderer.textureRatioX = 1;
				this._pDepthRenderer.textureRatioY = 1;
				this._pDepthRenderer._iRender(entityCollector);
			}

			this._pDepthRenderer.disableColor = false;
		}


		/**
		 *
		 */
		public pRenderSceneDepthToTexture(entityCollector:EntityCollector)
		{
			if (this._pDepthTextureInvalid || !this._pDepthRender)
				this.initDepthTexture(<IContextStageGL> this._pStage.context);

			this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
			this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
			this._pDepthRenderer._iRender(entityCollector, this._pDepthRender);
		}


		/**
		 * Updates the backbuffer dimensions.
		 */
		public pUpdateBackBuffer()
		{
			// No reason trying to configure back buffer if there is no context available.
			// Doing this anyway (and relying on _stage to cache width/height for
			// context does get available) means usesSoftwareRendering won't be reliable.
			if (this._pStage.context && !this._shareContext) {
				if (this._width && this._height) {
					this._pStage.configureBackBuffer(this._width, this._height, this._antiAlias, true);
					this._pBackBufferInvalid = false;
				}
			}
		}

		public iSetStage(value:Stage)
		{
			super.iSetStage(value);

			this._pDistanceRenderer.iSetStage(value);
			this._pDepthRenderer.iSetStage(value);
		}

		/**
		 *
		 */
		private initDepthTexture(context:IContextStageGL):void
		{
			this._pDepthTextureInvalid = false;

			if (this._pDepthRender)
				this._pDepthRender.dispose();

			this._pDepthRender = new RenderTexture(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
		}
	}
}