import {IAsset} from "@awayjs/core";

import {ITexture} from "../base/ITexture";

import {IAnimationSet} from "./IAnimationSet";
import {IEntity} from "./IEntity";
import {Style} from "./Style";

/**
 * ISurface provides an interface for objects that define the properties of a renderable's surface.
 *
 * @interface away.base.ISurface
 */
export interface IMaterial extends IAsset
{
	animationSet:IAnimationSet;

	style:Style;

	bothSides:boolean;

	curves:boolean;

	imageRect:boolean;

	animateUVs:boolean;

	blendMode:string;

	iOwners:Array<IEntity>;

	iAddOwner(owner:IEntity);

	iRemoveOwner(owner:IEntity);

	getNumTextures():number;

	getTextureAt(i:number):ITexture;
}