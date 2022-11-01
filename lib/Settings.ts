export interface IRendererSettings {
	ALLOW_VAO: boolean;

	ENABLE_CONVEX_BOUNDS: boolean;
	CONVEX_MIN_REQUIEST_FOR_BUILD: number;
	POINTS_COUNT_FOR_CONVEX: number;

	USE_NON_NATIVE_BLEND: boolean;

	USE_ALPHA_CUTOFF: boolean;
	ALPHA_CUTOFF_VALUE: number;

	SMOOTH_CACHED_IMAGE: boolean;

	LINE_BUFFER_DIM: number;
}

export const Settings: IRendererSettings = {
	/**
	 * @description Enable use of blendmodes that cannot be achived natively in WebGL,
	 * such as Overlay, Hardlight, Invert etc
	 */
	 USE_NON_NATIVE_BLEND: false,

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
	 * @description use smoothed image for cacheAsBitmap and filters
	 */
	SMOOTH_CACHED_IMAGE: true,

	/**
	 * @description Dimensions for LineElements buffer, 2 or 3, 3 is standart, but more memory-expensive, we can use 2
	 */
	LINE_BUFFER_DIM: 2,
};