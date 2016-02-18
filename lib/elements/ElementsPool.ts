import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");
import IAbstractionPool				= require("awayjs-core/lib/library/IAbstractionPool");

import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import IElementsClassGL				= require("awayjs-renderergl/lib/elements/IElementsClassGL");
import GL_ElementsBase				= require("awayjs-renderergl/lib/elements/GL_ElementsBase");

/**
 * @class away.pool.RenderPool
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
	 * @param renderClass
	 */
	constructor(shader:ShaderBase, elementsClass:IElementsClassGL)
	{
		this._shader = shader;
		this._elementsClass = elementsClass;
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
	 * @returns IRenderable
	 */
	public getAbstraction(elements:ElementsBase):GL_ElementsBase
	{
		return (this._abstractionPool[elements.id] || (this._abstractionPool[elements.id] = new (this._elementsClass)(elements, this._shader, this)));
	}

	/**
	 * //TODO
	 *
	 * @param renderableOwner
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

export = ElementsPool;