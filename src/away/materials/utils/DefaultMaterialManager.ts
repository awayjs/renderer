///<reference path="../../_definitions.ts"/>

module away.materials
{
	export class DefaultMaterialManager
	{
		private static _defaultTextureBitmapData:away.base.BitmapData;
		private static _defaultTextureMaterial:TextureMaterial;
		private static _defaultSegmentMaterial:SegmentMaterial;
		private static _defaultTexture:away.textures.BitmapTexture;

		public static getDefaultMaterial(materialOwner:away.base.IMaterialOwner = null):MaterialBase
		{
			if (materialOwner != null && materialOwner.assetType == away.library.AssetType.LINE_SUB_MESH) {
				if (!DefaultMaterialManager._defaultSegmentMaterial)
					DefaultMaterialManager.createDefaultSegmentMaterial();

				return DefaultMaterialManager._defaultSegmentMaterial;
			} else {
				if (!DefaultMaterialManager._defaultTextureMaterial)
					DefaultMaterialManager.createDefaultTextureMaterial();

				return DefaultMaterialManager._defaultTextureMaterial;
			}
		}

		public static getDefaultTexture(materialOwner:away.base.IMaterialOwner = null):away.textures.BitmapTexture
		{
			if (!DefaultMaterialManager._defaultTexture)
				DefaultMaterialManager.createDefaultTexture();

			return DefaultMaterialManager._defaultTexture;
		}

		private static createDefaultTexture()
		{
			DefaultMaterialManager._defaultTextureBitmapData = DefaultMaterialManager.createCheckeredBitmapData();
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

		private static createDefaultTextureMaterial()
		{
			if (!DefaultMaterialManager._defaultTexture)
				DefaultMaterialManager.createDefaultTexture();

			DefaultMaterialManager._defaultTextureMaterial = new TextureMaterial(DefaultMaterialManager._defaultTexture);
			DefaultMaterialManager._defaultTextureMaterial.mipmap = false;
			DefaultMaterialManager._defaultTextureMaterial.smooth = false;
			DefaultMaterialManager._defaultTextureMaterial.name = "defaultTextureMaterial";
		}

		private static createDefaultSegmentMaterial()
		{
			DefaultMaterialManager._defaultSegmentMaterial = new SegmentMaterial();
			DefaultMaterialManager._defaultSegmentMaterial.name = "defaultSegmentMaterial";
		}
	}
}
