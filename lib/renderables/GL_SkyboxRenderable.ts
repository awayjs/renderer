import {AttributesBuffer} from "@awayjs/core";

import {IEntity, TriangleElements} from "@awayjs/graphics";

import {GL_MaterialBase, ShaderBase, GL_RenderableBase, RenderablePool} from "@awayjs/stage";

import {Skybox} from "@awayjs/scene";

import {GL_SkyboxElements} from "../elements/GL_SkyboxElements";

import {RendererBase} from "../RendererBase";

/**
 * @class away.pool.GL_SkyboxRenderable
 */
export class GL_SkyboxRenderable extends GL_RenderableBase
{
	/**
	 *
	 */
	private static _elementsGL:GL_SkyboxElements;

	/**
	 *
	 */
	private _skybox:Skybox;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param skybox
	 */
	constructor(skybox:Skybox, renderablePool:RenderablePool)
	{
		super(skybox, renderablePool);

		this._skybox = skybox;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleElements}
	 * @private
	 */
	protected _getElements():GL_SkyboxElements
	{
		var elementsGL:GL_SkyboxElements = GL_SkyboxRenderable._elementsGL;

		if (!elementsGL) {
			var elements:TriangleElements = new TriangleElements(new AttributesBuffer(11, 4));
			elements.autoDeriveNormals = false;
			elements.autoDeriveTangents = false;
			elements.setIndices(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			elements.setPositions(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));

			elementsGL = GL_SkyboxRenderable._elementsGL = new GL_SkyboxElements(elements, this._stage);
		}

		return elementsGL;
	}

	protected _getMaterial():GL_MaterialBase
	{
		return this._materialGroup.getMaterialPool(this.elementsGL).getAbstraction(this._skybox);
	}

	public static _iIncludeDependencies(shader:ShaderBase):void
	{

	}
}