import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import IAbstractionPool				= require("awayjs-core/lib/library/IAbstractionPool");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ISurface						= require("awayjs-display/lib/base/ISurface");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/display/Skybox");

import IElementsClassGL				= require("awayjs-renderergl/lib/elements/IElementsClassGL");
import GL_BasicMaterialSurface		= require("awayjs-renderergl/lib/surfaces/GL_BasicMaterialSurface");
import ISurfaceClassGL				= require("awayjs-renderergl/lib/surfaces/ISurfaceClassGL");
import GL_SurfaceBase				= require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
import GL_SkyboxSurface				= require("awayjs-renderergl/lib/surfaces/GL_SkyboxSurface");

/**
 * @class away.pool.SurfacePool
 */
class SurfacePool implements IAbstractionPool
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
	public clearAbstraction(surface:ISurface)
	{
		delete this._abstractionPool[surface.id];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(surfaceClassGL:ISurfaceClassGL, assetClass:IAssetClass)
	{
		SurfacePool._abstractionClassPool[assetClass.assetType] = surfaceClassGL;
	}
}

export = SurfacePool;