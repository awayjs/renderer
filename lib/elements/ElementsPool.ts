import IAssetClass					from "awayjs-core/lib/library/IAssetClass";
import IAbstractionPool				from "awayjs-core/lib/library/IAbstractionPool";

import ElementsBase					from "awayjs-display/lib/graphics/ElementsBase";

import ShaderBase					from "awayjs-renderergl/lib/shaders/ShaderBase";
import IElementsClassGL				from "awayjs-renderergl/lib/elements/IElementsClassGL";
import GL_ElementsBase				from "awayjs-renderergl/lib/elements/GL_ElementsBase";

/**
 * @class away.pool.SurfacePool
 */
class ElementsPool implements IAbstractionPool
{
	public static _abstractionClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _shader:ShaderBase;
	private _elementsClass:IElementsClassGL;

	/**
	 * //TODO
	 *
	 * @param surfaceClassGL
	 */
	constructor(shader:ShaderBase, elementsClass:IElementsClassGL)
	{
		this._shader = shader;
		this._elementsClass = elementsClass;
	}

	/**
	 * //TODO
	 *
	 * @param renderable
	 * @returns IRenderable
	 */
	public getAbstraction(elements:ElementsBase):GL_ElementsBase
	{
		return (this._abstractionPool[elements.id] || (this._abstractionPool[elements.id] = new (this._elementsClass)(elements, this._shader, this)));
	}

	/**
	 * //TODO
	 *
	 * @param renderable
	 */
	public clearAbstraction(elements:ElementsBase)
	{
		delete this._abstractionPool[elements.id];
	}
	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(elementsClass:IElementsClassGL, assetClass:IAssetClass)
	{
		ElementsPool._abstractionClassPool[assetClass.assetType] = elementsClass;
	}
}

export default ElementsPool;