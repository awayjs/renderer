import {IAssetClass, IAbstractionPool, AbstractionBase} from "@awayjs/core";

import {IEntity, IRenderable} from "@awayjs/graphics";

import {RendererBase} from "../RendererBase";

import {IRenderableClassGL} from "./IRenderableClassGL";
import {GL_RenderableBase} from "./GL_RenderableBase";

/**
 * @class away.pool.RenderablePool
 */
export class RenderablePool extends AbstractionBase implements IAbstractionPool
{
	private static _abstractionClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _entity:IEntity;
	private _renderer:RendererBase;

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(entity:IEntity, renderer:RendererBase)
	{
		super(entity, renderer);

		this._entity = entity;
		this._renderer = renderer;
	}

	/**
	 * //TODO
	 *
	 * @param renderable
	 * @returns GL_RenderableBase
	 */
	public getAbstraction(renderable:IRenderable):GL_RenderableBase
	{
		return this._abstractionPool[renderable.id] || (this._abstractionPool[renderable.id] = new (<IRenderableClassGL> RenderablePool._abstractionClassPool[renderable.assetType])(renderable, this._entity, this._renderer, this));
	}
	
	/**
	 *
	 * @param renderable
	 */
	public clearAbstraction(renderable:IRenderable):void
	{
		this._abstractionPool[renderable.id] = null;
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(renderableClass:IRenderableClassGL, assetClass:IAssetClass):void
	{
		RenderablePool._abstractionClassPool[assetClass.assetType] = renderableClass;
	}
}