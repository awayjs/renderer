import {IAssetClass} from "@awayjs/core";

import {MaterialGroupBase, IMaterialClassGL, Stage, GL_ElementsBase} from "@awayjs/stage";

import {GL_DepthMaterial} from "./GL_DepthMaterial";
import {GL_DistanceMaterial} from "./GL_DistanceMaterial";

import {DepthRenderer} from "../DepthRenderer";
import {DistanceRenderer} from "../DistanceRenderer";

/**
 * @class away.pool.DefaultMaterialGroup
 */
export class DefaultMaterialGroup extends MaterialGroupBase
{
	private static _abstractionClassPool:Object = new Object();

	constructor(stage:Stage)
	{
		super(stage, DefaultMaterialGroup._abstractionClassPool);
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(materialClassGL:IMaterialClassGL, assetClass:IAssetClass):void
	{
		DefaultMaterialGroup._abstractionClassPool[assetClass.assetType] = materialClassGL;

		DepthRenderer._abstractionClassPool[assetClass.assetType] = GL_DepthMaterial;
		DistanceRenderer._abstractionClassPool[assetClass.assetType] = GL_DistanceMaterial;
	}
}