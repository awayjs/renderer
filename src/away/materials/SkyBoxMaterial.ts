///<reference path="../_definitions.ts"/>


module away.materials
{

	/**
	 * SkyboxMaterial is a material exclusively used to render skyboxes
	 *
	 * @see away3d.primitives.Skybox
	 */
	export class SkyboxMaterial extends MaterialBase
	{
		private _cubeMap:away.textures.CubeTextureBase;
		private _skyboxPass:SkyboxPass;

		/**
		 * Creates a new SkyboxMaterial object.
		 * @param cubeMap The CubeMap to use as the skybox.
		 */
		constructor(cubeMap:away.textures.CubeTextureBase)
		{

			super();

			this._cubeMap = cubeMap;
			this.pAddPass(this._skyboxPass = new SkyboxPass());
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
