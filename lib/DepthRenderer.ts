import { IAbstractionPool } from '@awayjs/core';

import { INode, PartitionBase } from '@awayjs/view';

import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';

import { RenderGroup } from './RenderGroup';
import { RendererBase } from './RendererBase';

/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
export class DepthRenderer extends RendererBase {
	/**
	 * Creates a new DepthRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(renderGroup: RenderGroup, partition: PartitionBase, pool: IAbstractionPool) {
		super(renderGroup, partition, pool);
	}

	/**
	 *
	 */
	public enterNode(node: INode): boolean {
		const enter: boolean = node._collectionMark != RendererBase._collectionMark && node.isCastingShadow();

		if (!enter) {
			node._collectionMark = RendererBase._collectionMark;

			return false;
		}

		return super.enterNode(node);
	}
}