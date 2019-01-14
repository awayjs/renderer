import {ProjectionBase} from "@awayjs/core";

import {BitmapImage2D, IContextGL} from "@awayjs/stage";

import {INode, PartitionBase, View} from "@awayjs/view";

import {IMaterialClass} from "./base/IMaterialClass";
import {_IRender_MaterialClass} from "./base/_IRender_MaterialClass";

import {Filter3DBase} from "./filters/Filter3DBase";
import {RTTBufferManager} from "./managers/RTTBufferManager";
import {RenderGroup} from "./RenderGroup";

import {DepthRenderer} from "./DepthRenderer";
import {DistanceRenderer} from "./DistanceRenderer";
import {Filter3DRenderer} from "./Filter3DRenderer";
import {RendererBase} from "./RendererBase";
import { IRenderEntity } from './base/IRenderEntity';

/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
export class DefaultRenderer extends RendererBase
{
    public static _renderMaterialClassPool:Object = new Object();

	private _requireDepthRender:boolean;

	private _distanceRenderer:DistanceRenderer;
	private _depthRenderer:DepthRenderer;
	private _filter3DRenderer:Filter3DRenderer;

	public _depthRender:BitmapImage2D;
	
	public get antiAlias():number
	{
		return this._stage.antiAlias;
	}

	public set antiAlias(value:number)
	{
		this._stage.antiAlias = value;
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
		return this._filter3DRenderer? this._filter3DRenderer.filters : null;
	}
	public set filters3d(value:Array<Filter3DBase>)
	{
		if (value && value.length == 0)
			value = null;

		if (this._filter3DRenderer && !value) {
			this._filter3DRenderer.dispose();
			this._filter3DRenderer = null;
		} else if (!this._filter3DRenderer && value) {
			this._filter3DRenderer = new Filter3DRenderer(this._stage);
			this._filter3DRenderer.filters = value;
		}

		if (this._filter3DRenderer) {
			this._filter3DRenderer.filters = value;
			this._requireDepthRender = this._filter3DRenderer.requireDepthRender;
		} else {
			this._requireDepthRender = false;

			if (this._depthRender) {
				this._depthRender.dispose();
				this._depthRender = null;
			}
		}
	}

	/**
	 * Creates a new DefaultRenderer object.
	 *
	 * @param antiAlias The amount of anti-aliasing to use.
	 * @param renderMode The render mode to use.
	 */
	constructor(partition:PartitionBase, view:View = null)
	{
		super(partition, view);
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

		if (enter && node.boundsVisible)
			this.applyEntity(<IRenderEntity> node.getBoundsPrimitive(this._pickGroup));

		return enter;
	}

	public render(enableDepthAndStencil:boolean = true, surfaceSelector:number = 0):void
	{
		if (!this._stage.recoverFromDisposal()) {//if context has Disposed by the OS,don't render at this frame
			return;
		}

		if (this._requireDepthRender)
			this._renderSceneDepthToTexture();

		if (this._depthPrepass)
			this._renderDepthPrepass();

		if (this._filter3DRenderer) { //TODO
			this._view.target = this._filter3DRenderer.getMainInputTexture(this._stage);
			super.render(enableDepthAndStencil, surfaceSelector);
			this._filter3DRenderer.render(this._stage, this._view.projection, this._depthRender);
		} else {
			this._view.target = null;
			super.render(enableDepthAndStencil, surfaceSelector);
		}

		this._view.present();
	}

	public dispose():void
	{
		this._view.dispose();

		this._pRttBufferManager.dispose();
		this._pRttBufferManager = null;

		this._depthRenderer.dispose();
		this._distanceRenderer.dispose();
		this._depthRenderer = null;
		this._distanceRenderer = null;

		this._depthRender = null;

		super.dispose();
	}

	/**
	 *
	 */
	private _renderDepthPrepass():void
	{
		this._depthRenderer.disableColor = true;

		this._depthRenderer.view.projection = this._view.projection;
		if (this._filter3DRenderer) {
			this._depthRenderer.view.target = this._filter3DRenderer.getMainInputTexture(this._stage);
			this._depthRenderer.render();
		} else {
			this._depthRenderer.view.target = null;
			this._depthRenderer.render();
		}

		this._depthRenderer.disableColor = false;
	}


	/**
	 *
	 */
	private _renderSceneDepthToTexture():void
	{
		if (this._depthTextureDirty || !this._depthRender)
			this.initDepthTexture(<IContextGL> this._stage.context);

		this._depthRenderer.render();
	}

	/**
	 *
	 */
	private initDepthTexture(context:IContextGL):void
	{
		this._depthTextureDirty = false;

		if (this._depthRender)
			this._depthRender.dispose();

		this._depthRender = new BitmapImage2D(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
		this._depthRenderer.view.target = this._depthRender;
		this._depthRenderer.view.projection = this._view.projection;
	}

	protected _setView(value:View):void
	{
		super._setView(value);

		if (!this._renderGroup || this._renderGroup.stage != this._stage)
			this._renderGroup = new RenderGroup(this._stage, DefaultRenderer._renderMaterialClassPool, this);

		this._pRttBufferManager = RTTBufferManager.getInstance(this._stage);

		if (!this._depthRenderer)
			this._depthRenderer = new DepthRenderer(this._partition, new View(null, this._stage));
		else if (this._depthRenderer.stage != this._stage)
			this._depthRenderer.view = new View(null, this._stage);
		
		if (!this._distanceRenderer)
			this._distanceRenderer = new DistanceRenderer(this._partition, new View(null, this._stage));
		else if (this._distanceRenderer.stage != this._stage)
			this._distanceRenderer.view = new View(null, this._stage);

		this._depthTextureDirty = true;
	}

	protected _setPartition(value:PartitionBase):void
	{
		super._setPartition(value);
		
		this._depthRenderer.partition = value;
		this._distanceRenderer.partition = value;
	}
}