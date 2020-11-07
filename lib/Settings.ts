export interface IRendererSettings {
	USE_ALPHA_CUTOFF: boolean;
	ALPHA_CUTOFF_VALUE: number;
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
};