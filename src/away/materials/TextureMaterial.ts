///<reference path="../_definitions.ts"/>

module away.materials
{
	//import away3d.*;
	//import away3d.textures.*;
	
	//import flash.display.*;
	//import flash.geom.*;
	
	//use namespace arcane;
	
	/**
	 * TextureMaterial is a single-pass material that uses a texture to define the surface's diffuse reflection colour (albedo).
	 */
	export class TextureMaterial extends away.materials.SinglePassMaterialBase
	{
		/**
		 * Creates a new TextureMaterial.
		 * @param texture The texture used for the material's albedo color.
		 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
		 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to true.
		 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to true.
		 */
		constructor(texture:away.textures.Texture2DBase = null, smooth:boolean = true, repeat:boolean = false, mipmap:boolean = true)
		{
			super();


			this.texture = texture;

			this.smooth = smooth;
			this.repeat = repeat;
			this.mipmap = mipmap;

		}

		/**
		 * Specifies whether or not the UV coordinates should be animated using IRenderable's uvTransform matrix.
		 *
		 * @see IRenderable.uvTransform
		 */
		public get animateUVs():boolean
		{
			return this._pScreenPass.animateUVs;
		}
		
		public set animateUVs(value:boolean)
		{
			this._pScreenPass.animateUVs = value;
		}
		
		/**
		 * The alpha of the surface.
		 */
		public get alpha():number
		{
			return this._pScreenPass.colorTransform? this._pScreenPass.colorTransform.alphaMultiplier : 1;
		}
		
		public set alpha(value:number)
		{
			if (value > 1)
				value = 1;
			else if (value < 0)
				value = 0;

            if ( this.colorTransform == null )
            {
                    //colorTransform ||= new ColorTransform();
                this.colorTransform = new away.geom.ColorTransform();
            }

			this.colorTransform.alphaMultiplier = value;

            this._pScreenPass.preserveAlpha = this.getRequiresBlending();
            this._pScreenPass.setBlendMode( this.getBlendMode() == away.display.BlendMode.NORMAL && this.getRequiresBlending() ? away.display.BlendMode.LAYER : this.getBlendMode() );

		}
		
		/**
		 * The texture object to use for the albedo colour.
		 */

		public get texture():away.textures.Texture2DBase
		{
			return this._pScreenPass.diffuseMethod.texture;
		}
		
		public set texture(value:away.textures.Texture2DBase)
		{
            this._pScreenPass.diffuseMethod.texture = value;
		}
		/**
		 * The texture object to use for the ambient colour.
		 */
		public get ambientTexture():away.textures.Texture2DBase
		{
			return this._pScreenPass.ambientMethod.texture;
		}
		
		public set ambientTexture(value:away.textures.Texture2DBase)
		{
            this._pScreenPass.ambientMethod.texture = value;
            this._pScreenPass.diffuseMethod.iUseAmbientTexture = ! (value == null ); // Boolean( value ) //<-------- TODO: Check this works as expected
		}

	}
}
