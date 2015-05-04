import ImageBase					= require("awayjs-core/lib/data/ImageBase");
import BitmapImage2D				= require("awayjs-core/lib/data/BitmapImage2D");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import LightBase					= require("awayjs-display/lib/base/LightBase");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import CollectorBase				= require("awayjs-display/lib/traverse/CollectorBase");
import Camera						= require("awayjs-display/lib/entities/Camera");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import ShadowMapperBase				= require("awayjs-display/lib/materials/shadowmappers/ShadowMapperBase");


import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLClearMask			= require("awayjs-stagegl/lib/base/ContextGLClearMask");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import DepthRenderer				= require("awayjs-renderergl/lib/DepthRenderer");
import DistanceRenderer				= require("awayjs-renderergl/lib/DistanceRenderer");
import Filter3DRenderer				= require("awayjs-renderergl/lib/Filter3DRenderer");
import Filter3DBase					= require("awayjs-renderergl/lib/filters/Filter3DBase");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");
import SkyboxRenderable				= require("awayjs-renderergl/lib/renderables/SkyboxRenderable");
import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
class DefaultRenderer extends RendererBase
{
	public _pRequireDepthRender:boolean;

	private _pDistanceRenderer:DepthRenderer;
	private _pDepthRenderer:DepthRenderer;
	private _skyboxProjection:Matrix3D = new Matrix3D();
	public _pFilter3DRenderer:Filter3DRenderer;

	public _pDepthRender:BitmapImage2D;

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
	constructor(stage:Stage = null)
	{
		super(stage);

		this._pRenderablePool = new RenderablePool(this._pStage);
		
		if (stage)
			this._shareContext = true;

		this._pRttBufferManager = RTTBufferManager.getInstance(this._pStage);

		this._pDepthRenderer = new DepthRenderer(this._pStage);
		this._pDistanceRenderer = new DistanceRenderer(this._pStage);

		if (this._width == 0)
			this.width = window.innerWidth;
		else
			this._pRttBufferManager.viewWidth = this._width;

		if (this._height == 0)
			this.height = window.innerHeight;
		else
			this._pRttBufferManager.viewHeight = this._height;
	}

	public render(entityCollector:CollectorBase)
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

	public pExecuteRender(entityCollector:EntityCollector, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		this.updateLights(entityCollector);

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
	public pDraw(entityCollector:EntityCollector)
	{
		if (entityCollector.skyBox) {
			this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);

			this.drawSkybox(entityCollector);
		}

		super.pDraw(entityCollector);
	}

	/**
	 * Draw the skybox if present.
	 *
	 * @param entityCollector The EntityCollector containing all potentially visible information.
	 */
	private drawSkybox(entityCollector:EntityCollector)
	{
		var renderable:RenderableBase = this._pRenderablePool.getItem(entityCollector.skyBox);

		var camera:Camera = entityCollector.camera;

		this.updateSkyboxProjection(camera);

		var render:RenderBase = this._pRenderablePool.getRenderPool(renderable.renderableOwner).getItem(renderable.renderOwner);

		var pass:IPass = render.passes[0];

		this.activatePass(renderable, pass, camera);
		renderable._iRender(pass, camera, this._skyboxProjection);
		this.deactivatePass(renderable, pass);
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

	public dispose()
	{
		if (!this._shareContext)
			this._pStage.dispose();

		this._pRttBufferManager.dispose();
		this._pRttBufferManager = null;

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

	/**
	 *
	 */
	private initDepthTexture(context:IContextGL):void
	{
		this._pDepthTextureInvalid = false;

		if (this._pDepthRender)
			this._pDepthRender.dispose();

		this._pDepthRender = new BitmapImage2D(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
	}
}

export = DefaultRenderer;