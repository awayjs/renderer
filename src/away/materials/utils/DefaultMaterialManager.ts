///<reference path="../../_definitions.ts"/>

module away.materials
{
	export class DefaultMaterialManager
	{
		private static _defaultBitmapData:away.base.BitmapData;
		private static _defaultTriangleMaterial:TriangleMaterial;
		private static _defaultLineMaterial:LineMaterial;
		private static _defaultTexture:away.textures.BitmapTexture;

		public static getDefaultMaterial(materialOwner:away.base.IMaterialOwner = null):MaterialBase
		{
			if (materialOwner != null && materialOwner.assetType == away.library.AssetType.LINE_SUB_MESH) {
				if (!DefaultMaterialManager._defaultLineMaterial)
					DefaultMaterialManager.createDefaultLineMaterial();

				return DefaultMaterialManager._defaultLineMaterial;
			} else {
				if (!DefaultMaterialManager._defaultTriangleMaterial)
					DefaultMaterialManager.createDefaultTriangleMaterial();

				return DefaultMaterialManager._defaultTriangleMaterial;
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
			DefaultMaterialManager._defaultBitmapData = DefaultMaterialManager.createCheckeredBitmapData();
			DefaultMaterialManager._defaultTexture = new away.textures.BitmapTexture(DefaultMaterialManager._defaultBitmapData, true);
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

		private static createDefaultTriangleMaterial()
		{
			if (!DefaultMaterialManager._defaultTexture)
				DefaultMaterialManager.createDefaultTexture();

			DefaultMaterialManager._defaultTriangleMaterial = new TriangleMaterial(DefaultMaterialManager._defaultTexture);
			DefaultMaterialManager._defaultTriangleMaterial.mipmap = false;
			DefaultMaterialManager._defaultTriangleMaterial.smooth = false;
			DefaultMaterialManager._defaultTriangleMaterial.name = "defaultTriangleMaterial";
		}

		private static createDefaultLineMaterial()
		{
			DefaultMaterialManager._defaultLineMaterial = new LineMaterial();
			DefaultMaterialManager._defaultLineMaterial.name = "defaultSegmentMaterial";
		}
	}
}
