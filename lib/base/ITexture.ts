import {IAsset} from "@awayjs/core";

import {ImageBase, ImageSampler} from "@awayjs/stage";

import {MappingMode} from "./MappingMode";
/**
 *
 */
export interface ITexture extends IAsset
{
	mappingMode:MappingMode;

	getNumImages():number;

	getImageAt(index:number):ImageBase;

	getSamplerAt(index:number):ImageSampler;
}