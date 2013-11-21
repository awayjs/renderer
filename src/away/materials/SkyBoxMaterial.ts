///<reference path="../_definitions.ts"/>


module away.materials
{

	/**
	 * SkyBoxMaterial is a material exclusively used to render skyboxes
	 *
	 * @see away3d.primitives.SkyBox
	 */
	export class SkyBoxMaterial extends away.materials.MaterialBase
	{
		private _cubeMap:away.textures.CubeTextureBase;
		private _skyboxPass:away.materials.SkyBoxPass;

		/**
		 * Creates a new SkyBoxMaterial object.
		 * @param cubeMap The CubeMap to use as the skybox.
		 */
			constructor(cubeMap:away.textures.CubeTextureBase)
		{

			super();

			this._cubeMap = cubeMap;
			this.pAddPass(this._skyboxPass = new away.materials.SkyBoxPass());
			this._skyboxPass.cubeTexture = this._cubeMap;
		}

		/**
		 * The cube texture to use as the skybox.
		 */
		public get cubeMap():away.textures.CubeTextureBase
		{
			return this._cubeMap;
		}

		public set cubeMap(value:away.textures.CubeTextureBase)
		{
			if (value && this._cubeMap && (value.hasMipMaps != this._cubeMap.hasMipMaps || value.format != this._cubeMap.format))
				this.iInvalidatePasses(null);

			this._cubeMap = value;
			this._skyboxPass.cubeTexture = this._cubeMap;

		}
	}
}
