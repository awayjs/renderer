import { ImageUtils } from '@awayjs/stage';
import { IMaterial } from '../base/IMaterial';
import { IMaterialClass } from '../base/IMaterialClass';

export class MaterialUtils {
	private static _defaultMaterialClass: IMaterialClass;
	private static _defaultCubeTextureMaterial: IMaterial;
	private static _defaultTextureMaterial: IMaterial;
	private static _defaultColorMaterial: IMaterial;

	public static getDefaultTextureMaterial(): IMaterial {
		if (!this._defaultTextureMaterial)
			this.createDefaultTextureMaterial();

		return this._defaultTextureMaterial;
	}

	public static getDefaultCubeTextureMaterial(): IMaterial {
		if (!this._defaultCubeTextureMaterial)
			this.createDefaultCubeTextureMaterial();

		return this._defaultCubeTextureMaterial;
	}

	public static getDefaultColorMaterial(): IMaterial {
		if (!MaterialUtils._defaultColorMaterial)
			MaterialUtils.createDefaultColorMaterial();

		return MaterialUtils._defaultColorMaterial;
	}

	private static createDefaultTextureMaterial(): void {
		this._defaultTextureMaterial = new this._defaultMaterialClass(ImageUtils.getDefaultImage2D());
		this._defaultTextureMaterial.name = 'defaultTextureMaterial';
	}

	private static createDefaultCubeTextureMaterial(): void {
		this._defaultCubeTextureMaterial = new this._defaultMaterialClass(ImageUtils.getDefaultImageCube());
		this._defaultCubeTextureMaterial.name = 'defaultCubeTextureMaterial';
	}

	private static createDefaultColorMaterial(): void {
		this._defaultColorMaterial = new this._defaultMaterialClass(0xFFFFFF);
		this._defaultColorMaterial.name = 'defaultColorMaterial';
	}

	public static setDefaultMaterialClass(materialClass: IMaterialClass): void {
		this._defaultMaterialClass = materialClass;
	}

}