///<reference path="../_definitions.ts"/>

module away.textures
{

	export class RenderTexture extends away.textures.Texture2DBase
	{
		constructor(width:number, height:number)
		{
			super();
			this.pSetSize(width, height);
		}

        /**
         *
         * @returns {number}
         */
        public get width() : number
        {
            return this._pWidth;
        }

		public set width(value:number)
		{
			if (value == this._pWidth)
            {
				return;
            }

			if (!away.utils.TextureUtils.isDimensionValid(value))
				throw new Error("Invalid size: Width and height must be power of 2 and cannot exceed 2048");
			
			this.invalidateContent();
			this.pSetSize(value, this._pHeight);
		}

        /**
         *
         * @returns {number}
         */
        public get height() : number
        {
            return this._pHeight;
        }

		public set height(value:number)
		{
			if (value == this._pHeight)
            {
				return;
            }

			if (!away.utils.TextureUtils.isDimensionValid(value))
            {
				throw new Error("Invalid size: Width and height must be power of 2 and cannot exceed 2048");
            }

			this.invalidateContent();
			this.pSetSize( this._pWidth, value);
		}
		
		public pUploadContent(texture:away.display3D.TextureBase)
		{
			// fake data, to complete texture for sampling
			var bmp:away.display.BitmapData = new away.display.BitmapData ( this.width, this.height, false, 0xff0000);
            //(<away.display3D.Texture> texture).uploadFromBitmapData(bmp, 0);
			//away.materials.MipmapGenerator.generateMipMaps(bmp, texture);
            (<away.display3D.Texture>texture).generateFromRenderBuffer(bmp);
            bmp.dispose();
		}
		
		public pCreateTexture(context:away.display3D.Context3D):away.display3D.TextureBase
		{
			return context.createTexture(this.width, this.height, away.display3D.Context3DTextureFormat.BGRA, true);
		}
	}
}
