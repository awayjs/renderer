import {Stage, MaterialGroupBase} from "@awayjs/stage";

import {INode} from "@awayjs/graphics";

import {GL_DistanceMaterial} from "./materials/GL_DistanceMaterial";

import {RendererBase} from "./RendererBase";

/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
export class DistanceRenderer extends RendererBase
{
	public static _abstractionClassPool:Object = Object();

	/**
	 * Creates a new DistanceRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(stage:Stage = null)
	{
		super(stage);

		this._materialGroup = new MaterialGroupBase(this._pStage, DistanceRenderer._abstractionClassPool);

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