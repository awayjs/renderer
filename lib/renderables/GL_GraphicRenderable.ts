import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";
import Matrix3DUtils				from "awayjs-core/lib/geom/Matrix3DUtils";
import AssetEvent					from "awayjs-core/lib/events/AssetEvent";

import ISurface						from "awayjs-display/lib/base/ISurface";
import IRenderable					from "awayjs-display/lib/base/IRenderable";
import Graphic						from "awayjs-display/lib/graphics/Graphic";
import TriangleElements				from "awayjs-display/lib/graphics/TriangleElements";
import ElementsBase					from "awayjs-display/lib/graphics/ElementsBase";
import Camera						from "awayjs-display/lib/display/Camera";

import IContextGL					from "awayjs-stagegl/lib/base/IContextGL";
import Stage						from "awayjs-stagegl/lib/base/Stage";
import ContextGLProgramType			from "awayjs-stagegl/lib/base/ContextGLProgramType";

import RendererBase					from "awayjs-renderergl/lib/RendererBase";
import AnimatorBase					from "awayjs-renderergl/lib/animators/AnimatorBase";
import ShaderBase					from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterCache			from "awayjs-renderergl/lib/shaders/ShaderRegisterCache";
import ShaderRegisterData			from "awayjs-renderergl/lib/shaders/ShaderRegisterData";
import ShaderRegisterElement		from "awayjs-renderergl/lib/shaders/ShaderRegisterElement";
import GL_RenderableBase			from "awayjs-renderergl/lib/renderables/GL_RenderableBase";
import PassBase						from "awayjs-renderergl/lib/surfaces/passes/PassBase";

/**
 * @class away.pool.GL_GraphicRenderable
 */
class GL_GraphicRenderable extends GL_RenderableBase
{
	/**
	 *
	 */
	public graphic:Graphic;


	/**
	 * //TODO
	 *
	 * @param pool
	 * @param graphic
	 * @param level
	 * @param indexOffset
	 */
	constructor(graphic:Graphic, renderer:RendererBase)
	{
		super(graphic, renderer);

		this.graphic = graphic;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this.graphic = null;
	}

	/**
	 *
	 * @returns {ElementsBase}
	 * @protected
	 */
	public _pGetElements():ElementsBase
	{
		return this.graphic.elements;
	}


	public _pGetSurface():ISurface
	{
		return this.graphic.material;
	}
}

export default GL_GraphicRenderable;