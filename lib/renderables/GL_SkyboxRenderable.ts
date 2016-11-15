import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {IEntity}						from "@awayjs/graphics/lib/base/IEntity";
import {TriangleElements}				from "@awayjs/graphics/lib/elements/TriangleElements";

import {Skybox}						from "@awayjs/scene/lib/display/Skybox";

import {RendererBase}					from "../RendererBase";
import {ShaderBase}					from "../shaders/ShaderBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_MaterialBase}				from "../materials/GL_MaterialBase";
import {GL_SkyboxElements}			from "../elements/GL_SkyboxElements";
import {RenderablePool}					from "../renderables/RenderablePool";

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
	constructor(skybox:Skybox, entity:IEntity, renderer:RendererBase, pool:RenderablePool)
	{
		super(skybox, entity, renderer, pool);

		this._skybox = skybox;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleElements}
	 * @private
	 */
	public _pGetElements():GL_SkyboxElements
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

	public _pGetMaterial():GL_MaterialBase
	{
		return this._renderer.getMaterialPool(this.elementsGL).getAbstraction(this._skybox);
	}

	public static _iIncludeDependencies(shader:ShaderBase):void
	{

	}
}