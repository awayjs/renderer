import {Rectangle, ProjectionBase} from "@awayjs/core";

import {ImageBase, BitmapImage2D, ContextGLProfile, ContextMode, Stage, ContextGLClearMask, IContextGL} from "@awayjs/stage";

import {IEntity} from "./base/IEntity";
import {INode} from "./base/INode";
import {IView} from "./base/IView";
import {IRenderer} from "./base/IRenderer";
import {IMaterialClass} from "./base/IMaterialClass";
import {_IRender_MaterialClass} from "./base/_IRender_MaterialClass";

import {Filter3DBase} from "./filters/Filter3DBase";
import {RTTBufferManager} from "./managers/RTTBufferManager";
import {RenderGroup} from "./RenderGroup";

import {DepthRenderer} from "./DepthRenderer";
import {DistanceRenderer} from "./DistanceRenderer";
import {Filter3DRenderer} from "./Filter3DRenderer";
import {RendererBase} from "./RendererBase";

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
export class DefaultRenderer extends RendererBase
{
    public static _renderMaterialClassPool:Object = new Object();

	public _pRequireDepthRender:boolean;

	private _distanceRenderer:DistanceRenderer;
	private _depthRenderer:DepthRenderer;
	public _pFilter3DRenderer:Filter3DRenderer;

	public _pDepthRender:BitmapImage2D;

	private _antiAlias:number = 0;
	
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
	constructor(stage:Stage = null, forceSoftware:boolean = false, profile:ContextGLProfile = ContextGLProfile.BASELINE, mode:ContextMode = ContextMode.AUTO)
	{
		super(stage, forceSoftware, profile, mode);

		if (stage)
			this.shareContext = true;

		this._renderGroup = new RenderGroup(this._pStage, DefaultRenderer._renderMaterialClassPool, this);
		this._pRttBufferManager = RTTBufferManager.getInstance(this._pStage);

		this._depthRenderer = new DepthRenderer(this._pStage);
		this._distanceRenderer = new DistanceRenderer(this._pStage);

		if (this._width == 0)
			this.width = window.innerWidth;
		else
			this._pRttBufferManager.viewWidth = this._width;

		if (this._height == 0)
			this.height = window.innerHeight;
		else
			this._pRttBufferManager.viewHeight = this._height;
	}

	public getDepthRenderer():DepthRenderer
	{
		return this._depthRenderer;
	}

    public getDistanceRenderer():DistanceRenderer
    {
        return this._distanceRenderer;
    }

    /**
     *
     * @param imageObjectClass
     */
    public static registerMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
    {
        DefaultRenderer._renderMaterialClassPool[materialClass.assetType] = renderMaterialClass;
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

	public render(projection:ProjectionBase, view:IView):void
	{
		super.render(projection, view);

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
			this.pRenderSceneDepthToTexture(projection, view);

		if (this._depthPrepass)
			this.pRenderDepthPrepass(projection, view);

		if (this._pFilter3DRenderer && this._pContext) { //TODO
			this._iRender(projection, view, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pFilter3DRenderer.renderToTextureRect);
			this._pFilter3DRenderer.render(this._pStage, projection, this._pDepthRender);
		} else {

			if (this.shareContext)
				this._iRender(projection, view, null, this._pScissorRect);
			else
				this._iRender(projection, view);
		}

		if (!this.shareContext && this._pContext)
			this._pContext.present();

		// register that a view has been rendered
		this._pStage.bufferClear = false;
	}

	public dispose():void
	{
		if (!this.shareContext)
			this._pStage.dispose();

		this._pRttBufferManager.dispose();
		this._pRttBufferManager = null;

		this._depthRenderer.dispose();
		this._distanceRenderer.dispose();
		this._depthRenderer = null;
		this._distanceRenderer = null;

		this._pDepthRender = null;

		super.dispose();
	}

	/**
	 *
	 */
	public pRenderDepthPrepass(projection:ProjectionBase, view:IView):void
	{
		this._depthRenderer.disableColor = true;

		if (this._pFilter3DRenderer) {
			this._depthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
			this._depthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
			this._depthRenderer._iRender(projection, view, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
		} else {
			this._depthRenderer.textureRatioX = 1;
			this._depthRenderer.textureRatioY = 1;
			this._depthRenderer._iRender(projection, view);
		}

		this._depthRenderer.disableColor = false;
	}


	/**
	 *
	 */
	public pRenderSceneDepthToTexture(projection:ProjectionBase, view:IView):void
	{
		if (this._pDepthTextureInvalid || !this._pDepthRender)
			this.initDepthTexture(<IContextGL> this._pStage.context);

		this._depthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
		this._depthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
		this._depthRenderer._iRender(projection, view, this._pDepthRender);
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