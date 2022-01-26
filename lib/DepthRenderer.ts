import { INode, PartitionBase } from '@awayjs/view';

import { RenderGroup } from './RenderGroup';
import { RendererBase } from './RendererBase';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IAssetClass } from '@awayjs/core';
import { CacheRenderer } from './CacheRenderer';

/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
export class DepthRenderer extends RendererBase {
	public static assetType: string = '[renderer DepthRenderer]';

	/**
	 * Creates a new DepthRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(partition: PartitionBase, pool: RenderGroup) {
		super(partition, pool);

		this._traverserGroup = RenderGroup.getInstance(CacheRenderer);
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

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		RenderGroup.getInstance(DepthRenderer).materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}