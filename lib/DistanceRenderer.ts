import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import DistanceRender				= require("awayjs-renderergl/lib/render/DistanceRender");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");


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
		
		this._pRenderablePool = new RenderablePool(this._pStage, DistanceRender);
		
		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}
}

export = DistanceRenderer;