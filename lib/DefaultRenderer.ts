import ImageBase					from "awayjs-core/lib/image/ImageBase";
import BitmapImage2D				from "awayjs-core/lib/image/BitmapImage2D";
import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";
import Rectangle					from "awayjs-core/lib/geom/Rectangle";
import Vector3D						from "awayjs-core/lib/geom/Vector3D";

import LightBase					from "awayjs-display/lib/display/LightBase";
import Camera						from "awayjs-display/lib/display/Camera";
import DirectionalLight				from "awayjs-display/lib/display/DirectionalLight";
import PointLight					from "awayjs-display/lib/display/PointLight";
import IEntity						from "awayjs-display/lib/display/IEntity";
import LightProbe					from "awayjs-display/lib/display/LightProbe";
import Skybox						from "awayjs-display/lib/display/Skybox";
import Scene						from "awayjs-display/lib/display/Scene";
import ShadowMapperBase				from "awayjs-display/lib/materials/shadowmappers/ShadowMapperBase";
import INode						from "awayjs-display/lib/partition/INode";

import Stage						from "awayjs-stagegl/lib/base/Stage";
import ContextGLCompareMode			from "awayjs-stagegl/lib/base/ContextGLCompareMode";
import ContextGLClearMask			from "awayjs-stagegl/lib/base/ContextGLClearMask";
import IContextGL					from "awayjs-stagegl/lib/base/IContextGL";

import RendererBase					from "awayjs-renderergl/lib/RendererBase";
import DepthRenderer				from "awayjs-renderergl/lib/DepthRenderer";
import DistanceRenderer				from "awayjs-renderergl/lib/DistanceRenderer";
import Filter3DRenderer				from "awayjs-renderergl/lib/Filter3DRenderer";
import Filter3DBase					from "awayjs-renderergl/lib/filters/Filter3DBase";
import GL_SkyboxElements			from "awayjs-renderergl/lib/elements/GL_SkyboxElements";
import GL_RenderableBase			from "awayjs-renderergl/lib/renderables/GL_RenderableBase";
import RTTBufferManager				from "awayjs-renderergl/lib/managers/RTTBufferManager";
import IPass						from "awayjs-renderergl/lib/surfaces/passes/IPass";
import SurfacePool					from "awayjs-renderergl/lib/surfaces/SurfacePool";

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
	private _skyBoxSurfacePool:SurfacePool;
	private _skyboxProjection:Matrix3D = new Matrix3D();
	public _pFilter3DRenderer:Filter3DRenderer;

	public _pDepthRender:BitmapImage2D;

	private _antiAlias:number = 0;
	private _skybox:Skybox;
	private _directionalLights:Array<DirectionalLight> = new Array<DirectionalLight>();
	private _pointLights:Array<PointLight> = new Array<PointLight>();
	private _lightProbes:Array<LightProbe> = new Array<LightProbe>();

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
	constructor(stage:Stage = null, forceSoftware:boolean = false, profile:string = "baseline", mode:string = "auto")
	{
		super(stage, null, forceSoftware, profile, mode);

		if (stage)
			this.shareContext = true;

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

		this._skyBoxSurfacePool = new SurfacePool(GL_SkyboxElements, this._pStage);
	}

	/**
	 *
	 */
	public enterNode(node:INode):boolean
	{
		var enter:boolean = super.enterNode(node);

		if (enter && node.debugVisible)
			this.applyEntity(node.bounds.boundsPrimitive);

		return enter;
	}

	public render(camera:Camera, scene:Scene)
	{
		super.render(camera, scene);

		if (!this._pStage.recoverFromDisposal()) {//if context has Disposed by the OS,don't render at this frame
			this._pBackBufferInvalid = true;
			return;
		}

		if (this._pBackBufferInvalid)// reset or update render settings
			this.pUpdateBackBuffer();

		if (this.shareContext && this._pContext)
			this._pContext.clear(0, 0, 0, 1, 1, 0, ContextGLClearMask.DEPTH);

		if (this._pFilter3DRenderer) {
			this.textureRatioX = this._pRttBufferManager.textureRatioX;
			this.textureRatioY = this._pRttBufferManager.textureRatioY;
		} else {
			this.textureRatioX = 1;
			this.textureRatioY = 1;
		}

		if (this._pRequireDepthRender)
			this.pRenderSceneDepthToTexture(camera, scene);

		if (this._depthPrepass)
			this.pRenderDepthPrepass(camera, scene);

		//reset lights
		this._directionalLights.length = 0;
		this._pointLights.length = 0;
		this._lightProbes.length = 0;

		if (this._pFilter3DRenderer && this._pContext) { //TODO
			this._iRender(camera, scene, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
			this._pFilter3DRenderer.render(this._pStage, camera, this._pDepthRender);
		} else {

			if (this.shareContext)
				this._iRender(camera, scene, null, this._pScissorRect);
			else
				this._iRender(camera, scene);
		}

		if (!this.shareContext && this._pContext)
			this._pContext.present();

		// register that a view has been rendered
		this._pStage.bufferClear = false;
	}

	public pExecuteRender(camera:Camera, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0)
	{
		this.updateLights(camera);

		super.pExecuteRender(camera, target, scissorRect, surfaceSelector);
	}

	private updateLights(camera:Camera)
	{
		var len:number, i:number;
		var light:LightBase;
		var shadowMapper:ShadowMapperBase;

		len = this._directionalLights.length;
		for (i = 0; i < len; ++i) {
				light = this._directionalLights[i];

			shadowMapper = light.shadowMapper;

			if (light.shadowsEnabled && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid ))
				shadowMapper.iRenderDepthMap(camera, light.scene, this._pDepthRenderer);
		}

		len = this._pointLights.length;
		for (i = 0; i < len; ++i) {
			light = this._pointLights[i];

			shadowMapper = light.shadowMapper;

			if (light.shadowsEnabled && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
				shadowMapper.iRenderDepthMap(camera, light.scene, this._pDistanceRenderer);
		}
	}

	/**
	 * @inheritDoc
	 */
	public pDraw(camera:Camera)
	{
		if (this._skybox) {
			this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);

			this.drawSkybox(camera);
		}

		super.pDraw(camera);
	}

	/**
	 * Draw the skybox if present.
	 **/
	private drawSkybox(camera:Camera)
	{
		var renderable:GL_RenderableBase = this.getAbstraction(this._skybox);

		renderable.renderSceneTransform = this._skybox.getRenderSceneTransform(this._cameraTransform);
		this.updateSkyboxProjection(camera);

		var pass:IPass = this._skyBoxSurfacePool.getAbstraction(renderable.surfaceGL.surface).passes[0];

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

	/**
	 *
	 * @param entity
	 */
	public applyDirectionalLight(entity:IEntity)
	{
		this._directionalLights.push(<DirectionalLight> entity);
	}

	/**
	 *
	 * @param entity
	 */
	public applyLightProbe(entity:IEntity)
	{
		this._lightProbes.push(<LightProbe> entity);
	}

	/**
	 *
	 * @param entity
	 */
	public applyPointLight(entity:IEntity)
	{
		this._pointLights.push(<PointLight> entity);
	}

	/**
	 *
	 * @param entity
	 */
	public applySkybox(entity:IEntity)
	{
		this._skybox = <Skybox> entity;
	}

	public dispose()
	{
		if (!this.shareContext)
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
	public pRenderDepthPrepass(camera:Camera, scene:Scene)
	{
		this._pDepthRenderer.disableColor = true;

		if (this._pFilter3DRenderer) {
			this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
			this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
			this._pDepthRenderer._iRender(camera, scene, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
		} else {
			this._pDepthRenderer.textureRatioX = 1;
			this._pDepthRenderer.textureRatioY = 1;
			this._pDepthRenderer._iRender(camera, scene);
		}

		this._pDepthRenderer.disableColor = false;
	}


	/**
	 *
	 */
	public pRenderSceneDepthToTexture(camera:Camera, scene:Scene)
	{
		if (this._pDepthTextureInvalid || !this._pDepthRender)
			this.initDepthTexture(<IContextGL> this._pStage.context);

		this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
		this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
		this._pDepthRenderer._iRender(camera, scene, this._pDepthRender);
	}


	/**
	 * Updates the backbuffer dimensions.
	 */
	public pUpdateBackBuffer()
	{
		// No reason trying to configure back buffer if there is no context available.
		// Doing this anyway (and relying on _stage to cache width/height for
		// context does get available) means usesSoftwareRendering won't be reliable.
		if (this._pStage.context && !this.shareContext) {
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

export default DefaultRenderer;