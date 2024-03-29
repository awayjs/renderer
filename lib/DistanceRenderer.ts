import { INode, PartitionBase } from '@awayjs/view';

import { RenderGroup } from './RenderGroup';

import { RendererBase } from './RendererBase';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IAssetClass } from '@awayjs/core';
import { CacheRenderer } from './CacheRenderer';
import { DefaultRenderer } from './DefaultRenderer';

/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
export class DistanceRenderer extends RendererBase {
	public static assetType: string = '[renderer DistanceRenderer]';

	/**
	 * Creates a new DistanceRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(partition: PartitionBase, pool: RenderGroup) {
		super(partition, pool);

		this._traverserGroup = RenderGroup.getInstance(CacheRenderer);
		this._maskGroup = RenderGroup.getInstance(DefaultRenderer);
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
		RenderGroup.getInstance(DistanceRenderer).materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}