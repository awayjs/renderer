import BitmapData					= require("awayjs-core/lib/base/BitmapData");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import BitmapTexture				= require("awayjs-core/lib/textures/BitmapTexture");

import IMaterialOwner				= require("awayjs-display/lib/base/IMaterialOwner");

import LineBasicMaterial			= require("awayjs-renderergl/lib/materials/LineBasicMaterial");
import TriangleBasicMaterial		= require("awayjs-renderergl/lib/materials/TriangleBasicMaterial");
import StageGLMaterialBase			= require("awayjs-renderergl/lib/materials/StageGLMaterialBase");

class DefaultMaterialManager
{
	private static _defaultBitmapData:BitmapData;
	private static _defaultTriangleMaterial:TriangleBasicMaterial;
	private static _defaultLineMaterial:LineBasicMaterial;
	private static _defaultTexture:BitmapTexture;

	public static getDefaultMaterial(materialOwner:IMaterialOwner = null):StageGLMaterialBase
	{
		if (materialOwner != null && materialOwner.assetType == AssetType.LINE_SUB_MESH) {
			if (!DefaultMaterialManager._defaultLineMaterial)
				DefaultMaterialManager.createDefaultLineMaterial();

			return DefaultMaterialManager._defaultLineMaterial;
		} else {
			if (!DefaultMaterialManager._defaultTriangleMaterial)
				DefaultMaterialManager.createDefaultTriangleMaterial();

			return DefaultMaterialManager._defaultTriangleMaterial;
		}
	}

	public static getDefaultTexture(materialOwner:IMaterialOwner = null):BitmapTexture
	{
		if (!DefaultMaterialManager._defaultTexture)
			DefaultMaterialManager.createDefaultTexture();

		return DefaultMaterialManager._defaultTexture;
	}

	private static createDefaultTexture()
	{
		DefaultMaterialManager._defaultBitmapData = DefaultMaterialManager.createCheckeredBitmapData();
		DefaultMaterialManager._defaultTexture = new BitmapTexture(DefaultMaterialManager._defaultBitmapData, true);
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

		DefaultMaterialManager._defaultTriangleMaterial = new TriangleBasicMaterial(DefaultMaterialManager._defaultTexture);
		DefaultMaterialManager._defaultTriangleMaterial.mipmap = false;
		DefaultMaterialManager._defaultTriangleMaterial.smooth = false;
		DefaultMaterialManager._defaultTriangleMaterial.name = "defaultTriangleMaterial";
	}

	private static createDefaultLineMaterial()
	{
		DefaultMaterialManager._defaultLineMaterial = new LineBasicMaterial();
		DefaultMaterialManager._defaultLineMaterial.name = "defaultSegmentMaterial";
	}
}

export = DefaultMaterialManager;