import {IAssetClass}					from "@awayjs/core/lib/library/IAssetClass";
import {IAbstractionPool}				from "@awayjs/core/lib/library/IAbstractionPool";
import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {IEntity}						from "@awayjs/graphics/lib/base/IEntity";
import {IRenderable}						from "@awayjs/graphics/lib/base/IRenderable";

import {IRenderableClassGL}				from "../renderables/IRenderableClassGL";
import {GL_RenderableBase}				from "../renderables/GL_RenderableBase";
import {RendererBase}				from "../RendererBase";

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