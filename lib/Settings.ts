export interface IRendererSettings {
	ALLOW_VAO: boolean;

	ENABLE_CONVEX_BOUNDS: boolean;
	CONVEX_MIN_REQUIEST_FOR_BUILD: number;
	POINTS_COUNT_FOR_CONVEX: number;

	USE_ALPHA_CUTOFF: boolean;
	ALPHA_CUTOFF_VALUE: number;

	LINE_BUFFER_DIM: number;

	/**
	 * Merge consecutive TriangleElements that share a material pass into one
	 * draw by baking scene transforms + uvMatrix into a dynamic VB.
	 * Order-preserving within a material run (SWF-safe for blended).
	 */
	ALLOW_DRAWCALL_BATCHING: boolean;

	/**
	 * Minimum drawables in a merge segment before issuing a batched draw.
	 * Segments of 1 always fall back to the original draw.
	 */
	DRAWCALL_BATCH_MIN: number;

	/**
	 * Sort opaque renderables by material (then depthOrder) so depth-tested
	 * opaques form longer merge runs. Blended list is never reordered.
	 */
	ALLOW_OPAQUE_MATERIAL_SORT: boolean;

	/**
	 * Encode display-list depthOrder into position.z so opaque material-sort
	 * + depth test stays SWF-correct for 2D (same geometric Z).
	 */
	ENCODE_DEPTH_ORDER: boolean;

	/** Z bias per depthOrder step (world/view units). */
	DEPTH_ORDER_EPS: number;

	/** Disable depth test for batched draws (painter order within VB). Required for Diggy SWF-safe coverage; pair with no opaque-sort while batching. */
	DRAWCALL_BATCH_DISABLE_DEPTH: boolean;

	/** Signature-keyed merged VB cache. */
	DRAWCALL_BATCH_CACHE: boolean;
}

export const Settings: IRendererSettings = {
	/**
	 * @description Apply alpha cutoff for masking, used for remove boxing artefacts
	 * when used a bitmap mask
	 */
	USE_ALPHA_CUTOFF: false,

	/**
	 * @description Alpha cutoff threshold value, 0 - 1, 0 or 1 is disable affect
	 */
	ALPHA_CUTOFF_VALUE: 0.5,

	/**
	 * @description Allow vao for elements
	 */
	ALLOW_VAO: true,

	/**
	 * @description Enable construct a approximation convex for triangle element.
	 */
	ENABLE_CONVEX_BOUNDS: false,

	/**
	 * @description Run convex filling after bounds N requiest, 0 - immedate when any bounds requested
	 */
	CONVEX_MIN_REQUIEST_FOR_BUILD: 10,
	/**
	 * @description Threshold for points count, that enable a hull generator
	 */
	POINTS_COUNT_FOR_CONVEX: 10,

	/**
	 * @description Dimensions for LineElements buffer, 2 or 3, 3 is standart, but more memory-expensive, we can use 2
	 */
	LINE_BUFFER_DIM: 2,

	ALLOW_DRAWCALL_BATCHING: false,

	DRAWCALL_BATCH_MIN: 2,

	ALLOW_OPAQUE_MATERIAL_SORT: true,

	ENCODE_DEPTH_ORDER: true,

	DEPTH_ORDER_EPS: 1e-4,

	DRAWCALL_BATCH_DISABLE_DEPTH: true,

	DRAWCALL_BATCH_CACHE: true,
};
