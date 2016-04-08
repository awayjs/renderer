import Stage						from "awayjs-stagegl/lib/base/Stage";

import INode						from "awayjs-display/lib/partition/INode";

import RendererBase					from "awayjs-renderergl/lib/RendererBase";
import GL_DepthSurface				from "awayjs-renderergl/lib/surfaces/GL_DepthSurface";

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
		super(stage, GL_DepthSurface);

		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}

	/**
	 *
	 */
	public enterNode(node:INode):boolean
	{
		var enter:boolean = node._iCollectionMark != RendererBase._iCollectionMark && node.isCastingShadow();

		if (!enter) {
			node._iCollectionMark = RendererBase._iCollectionMark;

			return false;
		}

		return super.enterNode(node);
	}
}

export default DepthRenderer;