import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import RenderTexture				= require("awayjs-core/lib/textures/RenderTexture");
import TextureProxyBase				= require("awayjs-core/lib/textures/TextureProxyBase");

import LightBase					= require("awayjs-display/lib/base/LightBase");
import RenderablePool				= require("awayjs-display/lib/pool/RenderablePool");
import IRenderer					= require("awayjs-display/lib/render/IRenderer");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import ICollector					= require("awayjs-display/lib/traverse/ICollector");
import Camera						= require("awayjs-display/lib/entities/Camera");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IMaterialPass				= require("awayjs-display/lib/materials/passes/IMaterialPass");
import ShadowMapperBase				= require("awayjs-display/lib/materials/shadowmappers/ShadowMapperBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLClearMask			= require("awayjs-stagegl/lib/base/ContextGLClearMask");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import StageManager					= require("awayjs-stagegl/lib/managers/StageManager");

import Filter3DBase					= require("awayjs-renderergl/lib/filters/Filter3DBase");
import MaterialData					= require("awayjs-renderergl/lib/pool/MaterialData");
import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import SkyboxRenderable				= require("awayjs-renderergl/lib/pool/SkyboxRenderable");
import DepthRenderer				= require("awayjs-renderergl/lib/render/DepthRenderer");
import Filter3DRenderer				= require("awayjs-renderergl/lib/render/Filter3DRenderer");
import RendererBase					= require("awayjs-renderergl/lib/render/RendererBase");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import DepthMapPass					= require("awayjs-renderergl/lib/materials/passes/DepthMapPass");
import DistanceMapPass				= require("awayjs-renderergl/lib/materials/passes/DistanceMapPass");
import MaterialPassBase				= require("awayjs-renderergl/lib/materials/passes/MaterialPassBase");
import StageGLMaterialBase			= require("awayjs-renderergl/lib/materials/StageGLMaterialBase");

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
class DefaultRenderer extends RendererBase implements IRenderer
{
	public _pRequireDepthRender:boolean;
	private _skyboxRenderablePool:RenderablePool;

//		private _activeMaterial:MaterialBase;
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

		this._pDepthRenderer = new DepthRenderer(new DepthMapPass());
		this._pDistanceRenderer = new DepthRenderer(new DistanceMapPass());

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

			this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);
			this.drawRenderables(this._pBlendedRenderableHead, entityCollector);
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
				shadowMapper.iRenderDepthMap(entityCollector, this._pDepthRenderer);
		}

		len = pointLights.length;
		for (i = 0; i < len; ++i) {
			light = pointLights[i];

			shadowMapper = light.shadowMapper;

			if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
				shadowMapper.iRenderDepthMap(entityCollector, this._pDistanceRenderer);
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
			this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);

			this.drawSkybox(entityCollector);
		}

		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);
		this.drawRenderables(this._pBlendedRenderableHead, entityCollector);
	}

	/**
	 * Draw the skybox if present.
	 *
	 * @param entityCollector The EntityCollector containing all potentially visible information.
	 */
	private drawSkybox(entityCollector:EntityCollector)
	{
		var skyBox:SkyboxRenderable = <SkyboxRenderable> this._skyboxRenderablePool.getItem(entityCollector.skyBox);

		var material:StageGLMaterialBase = <StageGLMaterialBase> entityCollector.skyBox.material;

		var camera:Camera = entityCollector.camera;

		this.updateSkyboxProjection(camera);

		var activePass:MaterialPassData = this.getMaterial(material, this._pStage.profile).getMaterialPass(<MaterialPassBase> material._iScreenPasses[0], this._pStage.profile);

		material._iActivatePass(activePass, this, camera);
		material._iRenderPass(activePass, skyBox, this._pStage, camera, this._skyboxProjection);
		material._iDeactivatePass(activePass, this);
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
	private drawRenderables(renderable:RenderableBase, entityCollector:ICollector)
	{
		var i:number;
		var len:number;
		var passes:Array<IMaterialPass>;
		var activePass:MaterialPassData;
		var activeMaterial:MaterialData;
		var context:IContextGL = <IContextGL> this._pStage.context;
		var camera:Camera = entityCollector.camera;
		var renderable2:RenderableBase;

		while (renderable) {
			activeMaterial = this.getMaterial(renderable.material, this._pStage.profile);

			//iterate through each screen pass
			passes = renderable.material._iScreenPasses;
			len = renderable.material._iNumScreenPasses();
			for (i = 0; i < len; i++) {
				renderable2 = renderable;

				activePass = activeMaterial.getMaterialPass(<MaterialPassBase> passes[i], this._pStage.profile);

				renderable.material._iActivatePass(activePass, this, camera);

				do {
					renderable.material._iRenderPass(activePass, renderable2, this._pStage, camera, this._pRttViewProjectionMatrix);

					renderable2 = renderable2.next;

				} while (renderable2 && renderable2.material == renderable.material);

				activeMaterial.material._iDeactivatePass(activePass, this);
			}

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
			this.initDepthTexture(<IContextGL> this._pStage.context);

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
	private initDepthTexture(context:IContextGL):void
	{
		this._pDepthTextureInvalid = false;

		if (this._pDepthRender)
			this._pDepthRender.dispose();

		this._pDepthRender = new RenderTexture(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
	}
}

export = DefaultRenderer;