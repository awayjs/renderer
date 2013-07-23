

///<reference path="../_definitions.ts"/>

module away.textures
{

	export class HTMLImageElementTexture extends away.textures.Texture2DBase
	{
		private static _mipMaps     = [];
		private static _mipMapUses  = [];
		
		private _htmlImageElement   : HTMLImageElement;
        private _generateMipmaps    : boolean;
		private _mipMapHolder       : away.display.BitmapData;

		
		constructor( htmlImageElement:HTMLImageElement , generateMipmaps:boolean = true)
		{
			super();
			
			this._htmlImageElement= htmlImageElement;
			this._generateMipmaps   = generateMipmaps;
		}
		
		public get htmlImageElement():HTMLImageElement
		{
			return this._htmlImageElement;
		}
		
		public set htmlImageElement(value:HTMLImageElement)
		{

			if (value == this._htmlImageElement)
            {

                return;

            }

			if ( ! away.utils.TextureUtils.isHTMLImageElementValid( value ) )
            {

                throw new away.errors.Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");

            }

            this.invalidateContent();
			this.pSetSize( value.width , value.height );
            this._htmlImageElement = value;
			
			if ( this._generateMipmaps )
            {

                this.getMipMapHolder();

            }

		}
		
		public pUploadContent(texture:away.display3D.TextureBase)
		{

			if (this._generateMipmaps)
            {

                away.materials.MipmapGenerator.generateHTMLImageElementMipMaps( this._htmlImageElement , texture , this._mipMapHolder , true);

            }
			else
            {

                var tx : away.display3D.Texture = <any> texture;
                    tx.uploadFromHTMLImageElement( this._htmlImageElement , 0 );

            }

		}
		
		private getMipMapHolder()
		{

            var newW : number  = this._htmlImageElement.width;
            var newH : number = this._htmlImageElement.height;
			
			if (this._mipMapHolder) {

				if (this._mipMapHolder.width == newW && this._htmlImageElement.height == newH)
                {

                    return;

                }

                this.freeMipMapHolder();

			}
			
			if (!HTMLImageElementTexture._mipMaps[newW])
            {

                HTMLImageElementTexture._mipMaps[newW]      = [];
                HTMLImageElementTexture._mipMapUses[newW]   = [];

			}

			if (!HTMLImageElementTexture._mipMaps[newW][newH])
            {

                this._mipMapHolder = HTMLImageElementTexture._mipMaps[newW][newH] = new away.display.BitmapData(newW, newH, true);
                HTMLImageElementTexture._mipMapUses[newW][newH] = 1;

			}
            else
            {

                HTMLImageElementTexture._mipMapUses[newW][newH] = HTMLImageElementTexture._mipMapUses[newW][newH] + 1;
                this._mipMapHolder = HTMLImageElementTexture._mipMaps[newW][newH];

			}
		}
		
		private freeMipMapHolder()
		{
			var holderWidth     : number = this._mipMapHolder.width;
			var holderHeight    : number = this._mipMapHolder.height;
			
			if ( --HTMLImageElementTexture._mipMapUses[holderWidth][holderHeight] == 0 )
            {

                HTMLImageElementTexture._mipMaps[holderWidth][holderHeight].dispose();
                HTMLImageElementTexture._mipMaps[holderWidth][holderHeight] = null;

			}
		}
		
		public dispose()
		{
			super.dispose();
			
			if (this._mipMapHolder)
            {

                this.freeMipMapHolder();

            }

		}

	}
}
