import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";

import {ImageBase}					from "@awayjs/graphics/lib/image/ImageBase";
import {BitmapImage2D}				from "@awayjs/graphics/lib/image/BitmapImage2D";
import {IEntity}						from "@awayjs/graphics/lib/base/IEntity";
import {INode}						from "@awayjs/graphics/lib/base/INode";

import {LightBase}					from "@awayjs/display/lib/display/LightBase";
import {Camera}						from "@awayjs/display/lib/display/Camera";
import {DirectionalLight}				from "@awayjs/display/lib/display/DirectionalLight";
import {PointLight}					from "@awayjs/display/lib/display/PointLight";
import {LightProbe}					from "@awayjs/display/lib/display/LightProbe";
import {ShadowMapperBase}				from "@awayjs/display/lib/shadowmappers/ShadowMapperBase";
import {IView}						from "@awayjs/display/lib/IView";

import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {ContextGLClearMask}			from "@awayjs/stage/lib/base/ContextGLClearMask";
import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";

import {RendererBase}					from "./RendererBase";
import {DepthRenderer}				from "./DepthRenderer";
import {DistanceRenderer}				from "./DistanceRenderer";
import {Filter3DRenderer}				from "./Filter3DRenderer";
import {Filter3DBase}					from "./filters/Filter3DBase";
import {RTTBufferManager}				from "./managers/RTTBufferManager";

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
export class DefaultRenderer extends RendererBase
{
	public _pRequireDepthRender:boolean;

	private _pDistanceRenderer:DepthRenderer;
	private _pDepthRenderer:DepthRenderer;
	public _pFilter3DRenderer:Filter3DRenderer;

	public _pDepthRender:BitmapImage2D;

	private _antiAlias:number = 0;
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
	}

	/**
	 *
	 */
	public enterNode(node:INode):boolean
	{
		var enter:boolean = super.enterNode(node);

		if (enter && node.debugVisible)
			node.renderBounds(this);

		return enter;
	}

	public render(view:IView):void
	{
		super.render(view);

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
			this.pRenderSceneDepthToTexture(view);

		if (this._depthPrepass)
			this.pRenderDepthPrepass(view);

		//reset lights
		this._directionalLights.length = 0;
		this._pointLights.length = 0;
		this._lightProbes.length = 0;

		if (this._pFilter3DRenderer && this._pContext) { //TODO
			this._iRender(view.camera, view, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pFilter3DRenderer.renderToTextureRect);
			this._pFilter3DRenderer.render(this._pStage, view.camera, this._pDepthRender);
		} else {

			if (this.shareContext)
				this._iRender(view.camera, view, null, this._pScissorRect);
			else
				this._iRender(view.camera, view);
		}

		if (!this.shareContext && this._pContext)
			this._pContext.present();

		// register that a view has been rendered
		this._pStage.bufferClear = false;
	}

	public pExecuteRender(camera:Camera, view:IView, target:ImageBase = null, scissorRect:Rectangle = null, surfaceSelector:number = 0):void
	{
		this.updateLights(camera, view);

		super.pExecuteRender(camera, view, target, scissorRect, surfaceSelector);
	}

	private updateLights(camera:Camera, view:IView):void
	{
		var len:number, i:number;
		var light:LightBase;
		var shadowMapper:ShadowMapperBase;

		len = this._directionalLights.length;
		for (i = 0; i < len; ++i) {
				light = this._directionalLights[i];

			shadowMapper = light.shadowMapper;

			if (light.shadowsEnabled && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid ))
				shadowMapper.iRenderDepthMap(view, this._pDepthRenderer);
		}

		len = this._pointLights.length;
		for (i = 0; i < len; ++i) {
			light = <LightBase> this._pointLights[i];

			shadowMapper = light.shadowMapper;

			if (light.shadowsEnabled && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
				shadowMapper.iRenderDepthMap(view, this._pDistanceRenderer);
		}
	}

	/**
	 *
	 * @param entity
	 */
	public applyDirectionalLight(entity:IEntity):void
	{
		this._directionalLights.push(<DirectionalLight> entity);
	}

	/**
	 *
	 * @param entity
	 */
	public applyLightProbe(entity:IEntity):void
	{
		this._lightProbes.push(<LightProbe> entity);
	}

	/**
	 *
	 * @param entity
	 */
	public applyPointLight(entity:IEntity):void
	{
		this._pointLights.push(<PointLight> entity);
	}

	public dispose():void
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
	public pRenderDepthPrepass(view:IView):void
	{
		this._pDepthRenderer.disableColor = true;

		if (this._pFilter3DRenderer) {
			this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
			this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
			this._pDepthRenderer._iRender(view.camera, view, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
		} else {
			this._pDepthRenderer.textureRatioX = 1;
			this._pDepthRenderer.textureRatioY = 1;
			this._pDepthRenderer._iRender(view.camera, view);
		}

		this._pDepthRenderer.disableColor = false;
	}


	/**
	 *
	 */
	public pRenderSceneDepthToTexture(view:IView):void
	{
		if (this._pDepthTextureInvalid || !this._pDepthRender)
			this.initDepthTexture(<IContextGL> this._pStage.context);

		this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
		this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
		this._pDepthRenderer._iRender(view.camera, view, this._pDepthRender);
	}


	/**
	 * Updates the backbuffer dimensions.
	 */
	public pUpdateBackBuffer():void
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