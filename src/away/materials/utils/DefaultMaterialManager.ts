///<reference path="../../_definitions.ts"/>

module away.materials
{

	export class DefaultMaterialManager
	{
		private static _defaultTextureBitmapData : away.display.BitmapData;
		private static _defaultMaterial : away.materials.TextureMaterial;
		private static _defaultTexture : away.textures.BitmapTexture;

		public static getDefaultMaterial( renderable : away.base.IMaterialOwner = null ) :  away.materials.TextureMaterial
		{
			if (!DefaultMaterialManager._defaultTexture)
            {
                DefaultMaterialManager.createDefaultTexture();
            }

			
			if (!DefaultMaterialManager._defaultMaterial)
            {
                DefaultMaterialManager.createDefaultMaterial();
            }

			return DefaultMaterialManager._defaultMaterial;

		}
		
		public static getDefaultTexture( renderable : away.base.IMaterialOwner= null ):away.textures.BitmapTexture
		{
			if (!DefaultMaterialManager._defaultTexture)
            {
                DefaultMaterialManager.createDefaultTexture();

            }

			return DefaultMaterialManager._defaultTexture;

		}
		
		private static createDefaultTexture()
		{
            DefaultMaterialManager._defaultTextureBitmapData = new away.display.BitmapData(8, 8, false, 0x0);
			
			//create chekerboard
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

            DefaultMaterialManager._defaultTexture = new away.textures.BitmapTexture( DefaultMaterialManager._defaultTextureBitmapData );
            DefaultMaterialManager._defaultTexture.name = "defaultTexture";
		}
		
		private static createDefaultMaterial()
		{
            DefaultMaterialManager._defaultMaterial         = new away.materials.TextureMaterial( DefaultMaterialManager._defaultTexture );
            DefaultMaterialManager._defaultMaterial.mipmap  = false;
            DefaultMaterialManager._defaultMaterial.smooth  = false;
            DefaultMaterialManager._defaultMaterial.name    = "defaultMaterial";

		}
	}
}
