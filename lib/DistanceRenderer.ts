import TextureProxyBase				= require("awayjs-core/lib/textures/TextureProxyBase");

import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");

import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRendererPoolClass			= require("awayjs-renderergl/lib/pool/IRendererPoolClass");


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
	constructor(rendererPoolClass:IRendererPoolClass = null, stage:Stage = null)
	{
		super(rendererPoolClass, stage);

		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}

	public _pGetRenderObject(renderable:RenderableBase, renderObjectOwner:IRenderObjectOwner):RenderObjectBase
	{
		return renderable._pool.getDistanceRenderObject(renderObjectOwner);
	}
}

export = DistanceRenderer;