import {Stage} from "@awayjs/stage";

import {INode} from "./partition/INode";
import {IMaterialClass} from "./base/IMaterialClass";
import {_IRender_MaterialClass} from "./base/_IRender_MaterialClass";

import {RenderGroup} from "./RenderGroup";

import {RendererBase} from "./RendererBase";
import { PartitionBase } from './partition/PartitionBase';
import { ProjectionBase } from '@awayjs/core';

/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
export class DistanceRenderer extends RendererBase
{
	public static _materialClassPool:Object = Object();

	/**
	 * Creates a new DistanceRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(partition:PartitionBase, projection:ProjectionBase = null, stage:Stage = null)
	{
		super(partition, projection, stage);

		this._renderGroup = new RenderGroup(this._stage, DistanceRenderer._materialClassPool, this);
		this._viewport.backgroundColor = 0xFFFFFF;
	}

    /**
     *
     * @param imageObjectClass
     */
    public static registerMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
    {
        DistanceRenderer._materialClassPool[materialClass.assetType] = renderMaterialClass;
    }

	/**
	 *
	 */
	public enterNode(node:INode):boolean
	{
		var enter:boolean = node._collectionMark != RendererBase._collectionMark && node.isCastingShadow();

		if (!enter) {
			node._collectionMark = RendererBase._collectionMark;

			return false;
		}

		return super.enterNode(node);
	}
}