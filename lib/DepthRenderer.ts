import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import DepthRender					= require("awayjs-renderergl/lib/render/DepthRender");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");

/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
class DepthRenderer extends RendererBase
{
	/**
	 * Creates a new DepthRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(stage:Stage = null)
	{
		super(stage);

		this._pRenderablePool = new RenderablePool(this._pStage, DepthRender);

		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}
}

export = DepthRenderer;