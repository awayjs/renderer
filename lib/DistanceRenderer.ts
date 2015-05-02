import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import DistanceRenderObject			= require("awayjs-renderergl/lib/compilation/DistanceRenderObject");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/pool/RenderablePool");


/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
class DistanceRenderer extends RendererBase
{
	/**
	 * Creates a new DistanceRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(stage:Stage = null)
	{
		super(stage);
		
		this._pRenderablePool = new RenderablePool(this._pStage, DistanceRenderObject);
		
		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}
}

export = DistanceRenderer;