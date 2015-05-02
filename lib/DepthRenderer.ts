import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import DepthRenderObject			= require("awayjs-renderergl/lib/compilation/DepthRenderObject");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/pool/RenderablePool");

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

		this._pRenderablePool = new RenderablePool(this._pStage, DepthRenderObject);

		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}
}

export = DepthRenderer;