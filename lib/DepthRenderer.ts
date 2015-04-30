import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRendererPoolClass			= require("awayjs-renderergl/lib/pool/IRendererPoolClass");


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
	constructor(rendererPoolClass:IRendererPoolClass = null, stage:Stage = null)
	{
		super(rendererPoolClass, stage);

		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}

	public _pGetRenderObject(renderable:RenderableBase, renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return renderable._pool.getDepthRenderObject(renderObjectOwner);
	}
}

export = DepthRenderer;