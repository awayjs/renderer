import {IAbstractionPool} from "@awayjs/core";

import {IEntity} from "../base/IEntity";
import {PartitionBase} from "./PartitionBase";
import { SceneGraphNode } from './SceneGraphNode';

/**
 * @class away.partition.Partition
 */
export class SceneGraphPartition extends PartitionBase
{
	constructor(root:IEntity, isScene:boolean = false)
	{
		super(root, isScene);

		this._rootNode = new SceneGraphNode(root, this);
	}

	public getPartition(entity:IEntity):PartitionBase
	{
		//get a new partition for every displayobjectcontainer
		return new SceneGraphPartition(entity);
	}
}