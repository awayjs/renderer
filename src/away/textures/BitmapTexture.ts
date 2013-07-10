///<reference path="../library/assets/IAsset.ts" />
///<reference path="../library/assets/NamedAssetBase.ts" />
///<reference path="../display3D/Context3D.ts" />
///<reference path="../display3D/TextureBase.ts" />
///<reference path="../display3D/Texture.ts" />
///<reference path="../display3D/Context3DTextureFormat.ts" />
///<reference path="../textures/Texture2DBase.ts" />
///<reference path="../display/BitmapData.ts" />
///<reference path="../errors/AbstractMethodError.ts" />

module away.textures
{
	//import away3d.arcane;
	//import away3d.materials.utils.MipmapGenerator;
	//import away3d.utils.TextureUtils;
	
	//import flash.display.BitmapData;
	//import flash.display3D.textures.Texture;
	//import flash.display3D.textures.TextureBase;
	
	//use namespace arcane;
	
	export class BitmapTexture extends away.textures.Texture2DBase
	{
		private static _mipMaps     = [];
		private static _mipMapUses  = [];
		
		private var _bitmapData: away.display.BitmapData;
		private var _mipMapHolder:away.display.BitmapData;
		private var _generateMipmaps:boolean;
		
		constructor(bitmapData:BitmapData, generateMipmaps:boolean = true)
		{
			super();
			
			this.bitmapData         = bitmapData;
			this._generateMipmaps   = generateMipmaps;
		}
		
		public get bitmapData():BitmapData
		{
			return this._bitmapData;
		}
		
		public set bitmapData(value:BitmapData)
		{
			if (value == this._bitmapData)
				return;
			
			if (!TextureUtils.isBitmapDataValid(value))
				throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");

            this.invalidateContent();
			setSize(value.width, value.height);

            this._bitmapData = value;
			
			if (this._generateMipmaps)
                this.getMipMapHolder();
		}
		
		public _pUploadContent(texture:away.display3D.TextureBase)
		{
			if (this._generateMipmaps)
            {

                MipmapGenerator.generateMipMaps(this._bitmapData, texture, this._mipMapHolder, true);

            }
			else
            {

                var tx : away.display3D.Texture = texture;
                    tx.uploadFromBitmapData(this._bitmapData, 0);

            }

		}
		
		private getMipMapHolder()
		{
			var newW:number, newH:number;
			
			newW = this._bitmapData.width;
			newH = this._bitmapData.height;
			
			if (this._mipMapHolder) {
				if (this._mipMapHolder.width == newW && this._bitmapData.height == newH)
					return;

                this.freeMipMapHolder();
			}
			
			if (!this._mipMaps[newW]) {
                this._mipMaps[newW] = [];
                this._mipMapUses[newW] = [];
			}
			if (!this._mipMaps[newW][newH]) {
                this._mipMapHolder = this._mipMaps[newW][newH] = new BitmapData(newW, newH, true);
                this._mipMapUses[newW][newH] = 1;
			} else {
                this._mipMapUses[newW][newH] = this._mipMapUses[newW][newH] + 1;
                this._mipMapHolder = this._mipMaps[newW][newH];
			}
		}
		
		private freeMipMapHolder()
		{
			var holderWidth:number = _mipMapHolder.width;
			var holderHeight:number = _mipMapHolder.height;
			
			if (--_mipMapUses[holderWidth][holderHeight] == 0) {
				_mipMaps[holderWidth][holderHeight].dispose();
				_mipMaps[holderWidth][holderHeight] = null;
			}
		}
		
		public dispose()
		{
			super.dispose();
			
			if (_mipMapHolder)
				freeMipMapHolder();
		}
	}
}
