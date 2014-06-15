///<reference path="../_definitions.ts"/>

module away.materials
{
	import CubeTextureBase				= away.textures.CubeTextureBase;

	/**
	 * SkyboxMaterial is a material exclusively used to render skyboxes
	 *
	 * @see away3d.primitives.Skybox
	 */
	export class SkyboxMaterial extends MaterialBase
	{
		private _cubeMap:CubeTextureBase;
		private _skyboxPass:SkyboxPass;

		/**
		 * Creates a new SkyboxMaterial object.
		 * @param cubeMap The CubeMap to use as the skybox.
		 */
		constructor(cubeMap:CubeTextureBase, smooth:boolean = true, repeat:boolean = false, mipmap:boolean = false)
		{

			super();

			this._cubeMap = cubeMap;
			this.pAddPass(this._skyboxPass = new SkyboxPass());
			this._skyboxPass.cubeTexture = this._cubeMap;
		}

		/**
		 * The cube texture to use as the skybox.
		 */
		public get cubeMap():CubeTextureBase
		{
			return this._cubeMap;
		}

		public set cubeMap(value:CubeTextureBase)
		{
			if (value && this._cubeMap && (value.hasMipmaps != this._cubeMap.hasMipmaps || value.format != this._cubeMap.format))
				this.iInvalidatePasses(null);

			this._cubeMap = value;
			this._skyboxPass.cubeTexture = this._cubeMap;

		}
	}
}