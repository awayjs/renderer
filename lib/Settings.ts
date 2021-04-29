export interface IRendererSettings {
	ALLOW_VAO: boolean;

	ENABLE_CONVEX_BOUNDS: boolean;
	CONVEX_MIN_REQUIEST_FOR_BUILD: number;
	POINTS_COUNT_FOR_CONVEX: number;

	USE_ALPHA_CUTOFF: boolean;
	ALPHA_CUTOFF_VALUE: number;

	LINE_BUFFER_DIM: number;
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
};