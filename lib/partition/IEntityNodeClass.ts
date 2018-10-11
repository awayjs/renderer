import {IEntity} from "../base/IEntity";

import {EntityNode} from "./EntityNode";
import {PartitionBase} from "./PartitionBase";

/**
 * IEntityNodeClass is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IEntityNodeClass
 */
export interface IEntityNodeClass
{
	/**
	 *
	 */
	new(entity:IEntity, pool:PartitionBase):EntityNode;
}