import {IAssetClass} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {INode} from "./base/INode";
import {IMaterialStateClass} from "./base/IMaterialStateClass";

import {RenderGroup} from "./RenderGroup";

import {RendererBase} from "./RendererBase";

/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
export class DepthRenderer extends RendererBase
{
	public static _materialClassPool:Object = Object();
	/**
	 * Creates a new DepthRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(stage:Stage = null)
	{
		super(stage);

		this._renderGroup = new RenderGroup(this._pStage, DepthRenderer._materialClassPool, this);
		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}

    /**
     *
     * @param imageObjectClass
     */
    public static registerMaterial(materialStateClass:IMaterialStateClass, materialClass:IAssetClass):void
    {
        DepthRenderer._materialClassPool[materialClass.assetType] = materialStateClass;
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