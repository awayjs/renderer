import {AttributesBuffer}				from "@awayjs/core/lib/attributes/AttributesBuffer";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {ISurface}						from "@awayjs/display/lib/base/ISurface";
import {ElementsBase}					from "@awayjs/display/lib/graphics/ElementsBase";
import {TriangleElements}				from "@awayjs/display/lib/graphics/TriangleElements";
import {Skybox}						from "@awayjs/display/lib/display/Skybox";
import {Camera}						from "@awayjs/display/lib/display/Camera";

import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";
import {ContextGLProgramType}			from "@awayjs/stage/lib/base/ContextGLProgramType";

import {RendererBase}					from "../RendererBase";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";
import {IPass}						from "../surfaces/passes/IPass";
import {GL_SkyboxElements}			from "../elements/GL_SkyboxElements";

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
	constructor(skybox:Skybox, renderer:RendererBase)
	{
		super(skybox, renderer);

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

	public _pGetSurface():GL_SurfaceBase
	{
		return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._skybox);
	}

	public static _iIncludeDependencies(shader:ShaderBase):void
	{

	}
}