import { INode, PartitionBase } from '@awayjs/view';

import { IRendererPool, RenderGroup } from './RenderGroup';

import { RendererBase } from './RendererBase';
import { IAbstractionPool } from '@awayjs/core';

/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
export class DistanceRenderer extends RendererBase {
	/**
	 * Creates a new DistanceRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(partition: PartitionBase, pool: IRendererPool) {
		super(partition, pool);
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