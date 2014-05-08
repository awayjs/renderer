///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * TextureMultiPassMaterial is a multi-pass material that uses a texture to define the surface's diffuse reflection colour (albedo).
	 */
	export class TextureMultiPassMaterial extends MultiPassMaterialBase
	{
		private _animateUVs:boolean = false;

		/**
		 * Creates a new TextureMultiPassMaterial.
		 * @param texture The texture used for the material's albedo color.
		 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
		 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
		 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
		 */
		constructor(texture:away.textures.Texture2DBase = null, smooth:boolean = true, repeat:boolean = false, mipmap:boolean = false)
		{
			super();
			this.texture = texture;
			this.smooth = smooth;
			this.repeat = repeat;
			this.mipmap = mipmap;
		}

		/**
		 * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
		 */
		public get animateUVs():boolean
		{
			return this._animateUVs;
		}

		public set animateUVs(value:boolean)
		{
			this._animateUVs = value;
		}

		/**
		 * The texture object to use for the albedo colour.
		 */
		public get texture():away.textures.Texture2DBase
		{
			return this.diffuseMethod.texture;
		}

		public set texture(value:away.textures.Texture2DBase)
		{
			this.diffuseMethod.texture = value;

			if (value) {
				this._pHeight = value.height;
				this._pWidth = value.width;
			}
		}

		/**
		 * The texture object to use for the ambient colour.
		 */
		public get ambientTexture():away.textures.Texture2DBase
		{
			return this.ambientMethod.texture;
		}

		public set ambientTexture(value:away.textures.Texture2DBase)
		{
			this.ambientMethod.texture = value;
			this.diffuseMethod.iUseAmbientTexture = (value != null );
		}

		public pUpdateScreenPasses()
		{
			super.pUpdateScreenPasses();

			if (this._pEffectsPass)
				this._pEffectsPass.animateUVs = this._animateUVs;
		}
	}
}
