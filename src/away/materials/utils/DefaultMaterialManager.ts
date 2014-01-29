///<reference path="../../_definitions.ts"/>

module away.materials
{

	export class DefaultMaterialManager
	{
		private static _defaultTextureBitmapData:away.base.BitmapData;
		private static _defaultMaterial:TextureMaterial;
		private static _defaultTexture:away.textures.BitmapTexture;

		public static getDefaultMaterial(renderable:away.base.IMaterialOwner = null):TextureMaterial
		{
			if (!DefaultMaterialManager._defaultTexture) {
				DefaultMaterialManager.createDefaultTexture();
			}


			if (!DefaultMaterialManager._defaultMaterial) {
				DefaultMaterialManager.createDefaultMaterial();
			}

			return DefaultMaterialManager._defaultMaterial;

		}

		public static getDefaultTexture(renderable:away.base.IMaterialOwner = null):away.textures.BitmapTexture
		{
			if (!DefaultMaterialManager._defaultTexture) {
				DefaultMaterialManager.createDefaultTexture();

			}

			return DefaultMaterialManager._defaultTexture;

		}

		private static createDefaultTexture()
		{
			DefaultMaterialManager._defaultTextureBitmapData = DefaultMaterialManager.createCheckeredBitmapData();//new away.base.BitmapData(8, 8, false, 0x000000);

			//create chekerboard
			/*
			 var i:number, j:number;
			 for (i = 0; i < 8; i++)
			 {
			 for (j = 0; j < 8; j++)
			 {
			 if ((j & 1) ^ (i & 1))
			 {
			 DefaultMaterialManager._defaultTextureBitmapData.setPixel(i, j, 0XFFFFFF);
			 }
			 }
			 }
			 */

			DefaultMaterialManager._defaultTexture = new away.textures.BitmapTexture(DefaultMaterialManager._defaultTextureBitmapData, false);
			DefaultMaterialManager._defaultTexture.name = "defaultTexture";
		}

		public static createCheckeredBitmapData():away.base.BitmapData
		{
			var b:away.base.BitmapData = new away.base.BitmapData(8, 8, false, 0x000000);

			//create chekerboard
			var i:number, j:number;
			for (i = 0; i < 8; i++) {
				for (j = 0; j < 8; j++) {
					if ((j & 1) ^ (i & 1)) {
						b.setPixel(i, j, 0XFFFFFF);
					}
				}
			}

			return b;

		}

		private static createDefaultMaterial()
		{
			DefaultMaterialManager._defaultMaterial = new TextureMaterial(DefaultMaterialManager._defaultTexture);
			DefaultMaterialManager._defaultMaterial.mipmap = false;
			DefaultMaterialManager._defaultMaterial.smooth = false;
			DefaultMaterialManager._defaultMaterial.name = "defaultMaterial";

		}
	}
}
