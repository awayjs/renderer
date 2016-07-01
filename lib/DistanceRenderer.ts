import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {INode}						from "@awayjs/display/lib/partition/INode";

import {RendererBase}					from "./RendererBase";
import {GL_DistanceSurface}			from "./surfaces/GL_DistanceSurface";

/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
export class DistanceRenderer extends RendererBase
{
	/**
	 * Creates a new DistanceRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(stage:Stage = null)
	{
		super(stage, GL_DistanceSurface);

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