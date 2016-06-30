import {IAssetClass}					from "@awayjs/core/lib/library/IAssetClass";
import {IAbstractionPool}				from "@awayjs/core/lib/library/IAbstractionPool";

import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {ISurface}						from "@awayjs/display/lib/base/ISurface";

import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {ISurfaceClassGL}				from "../surfaces/ISurfaceClassGL";
import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";

/**
 * @class away.pool.SurfacePool
 */
export class SurfacePool implements IAbstractionPool
{
	private static _abstractionClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _elementsClass:IElementsClassGL;
	private _stage:Stage;
	private _surfaceClassGL:ISurfaceClassGL;

	get stage():Stage
	{
		return this._stage;
	}

	/**
	 * //TODO
	 *
	 * @param surfaceClassGL
	 */
	constructor(elementsClass:IElementsClassGL, stage:Stage, surfaceClassGL:ISurfaceClassGL = null)
	{
		this._elementsClass = elementsClass;
		this._stage = stage;
		this._surfaceClassGL = surfaceClassGL;
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 * @returns IElements
	 */
	public getAbstraction(surface:ISurface):GL_SurfaceBase
	{
		return (this._abstractionPool[surface.id] || (this._abstractionPool[surface.id] = new (<ISurfaceClassGL> this._surfaceClassGL || SurfacePool._abstractionClassPool[surface.assetType])(surface, this._elementsClass, this)));
	}

	/**
	 * //TODO
	 *
	 * @param elementsOwner
	 */
	public clearAbstraction(surface:ISurface):void
	{
		delete this._abstractionPool[surface.id];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(surfaceClassGL:ISurfaceClassGL, assetClass:IAssetClass):void
	{
		SurfacePool._abstractionClassPool[assetClass.assetType] = surfaceClassGL;
	}
}