import BitmapData					= require("awayjs-core/lib/data/BitmapData");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import BitmapTexture				= require("awayjs-core/lib/textures/BitmapTexture");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");


class DefaultMaterialManager
{
	private static _defaultBitmapData:BitmapData;
	private static _defaultTriangleMaterial:BasicMaterial;
	private static _defaultLineMaterial:BasicMaterial;
	private static _defaultTexture:BitmapTexture;

	public static getDefaultMaterial(renderableOwner:IRenderableOwner = null):BasicMaterial
	{
		if (renderableOwner != null && renderableOwner.assetType == AssetType.LINE_SUB_MESH) {
			if (!DefaultMaterialManager._defaultLineMaterial)
				DefaultMaterialManager.createDefaultLineMaterial();
			return DefaultMaterialManager._defaultLineMaterial;
		} else {
			if (!DefaultMaterialManager._defaultTriangleMaterial)
				DefaultMaterialManager.createDefaultTriangleMaterial();
			return DefaultMaterialManager._defaultTriangleMaterial;
		}
	}

	public static getDefaultTexture(renderableOwner:IRenderableOwner = null):BitmapTexture
	{
		if (!DefaultMaterialManager._defaultTexture)
			DefaultMaterialManager.createDefaultTexture();
		return DefaultMaterialManager._defaultTexture;
	}

	private static createDefaultTexture()
	{
		DefaultMaterialManager._defaultBitmapData = DefaultMaterialManager.createCheckeredBitmapData();
		DefaultMaterialManager._defaultTexture = new BitmapTexture(DefaultMaterialManager._defaultBitmapData);
		DefaultMaterialManager._defaultTexture.name = "defaultTexture";
	}

	public static createCheckeredBitmapData():BitmapData
	{
		var b:BitmapData = new BitmapData(8, 8, false, 0x000000);
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
		DefaultMaterialManager._defaultTriangleMaterial = new BasicMaterial(DefaultMaterialManager._defaultTexture);
		DefaultMaterialManager._defaultTriangleMaterial.mipmap = false;
		DefaultMaterialManager._defaultTriangleMaterial.smooth = false;
		DefaultMaterialManager._defaultTriangleMaterial.name = "defaultTriangleMaterial";
	}

	private static createDefaultLineMaterial()
	{
		DefaultMaterialManager._defaultLineMaterial = new BasicMaterial();
		DefaultMaterialManager._defaultLineMaterial.name = "defaultLineMaterial";
	}
}

export = DefaultMaterialManager;