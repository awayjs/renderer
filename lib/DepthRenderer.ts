import { INode, PartitionBase } from '@awayjs/view';

import { RendererPool, RenderGroup } from './RenderGroup';
import { RendererBase } from './RendererBase';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IAssetClass } from '@awayjs/core';

/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
export class DepthRenderer extends RendererBase {

	public static materialClassPool: Record<string, _IRender_MaterialClass> = {};

	public static renderGroupPool: Record<string, RenderGroup> = {};

	public static defaultBackground: number = 0x0;

	/**
	 * Creates a new DepthRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(partition: PartitionBase, pool: RendererPool) {
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

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		DepthRenderer.materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}