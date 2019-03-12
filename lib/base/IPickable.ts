import {IAsset} from "@awayjs/core";

import {IMaterial} from "./IMaterial";
import {IElements} from "./IElements";
import {Style} from "./Style";
import { PickingCollision } from '../pick/PickingCollision';

/**
 * IPickable provides an interface for objects that can use materials.
 *
 * @interface away.base.IPickable
 */
export interface IPickable extends IAsset
{

}