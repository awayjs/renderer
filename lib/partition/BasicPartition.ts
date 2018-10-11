import {IEntity} from "../base/IEntity";

import {NodeBase} from "./NodeBase";
import {PartitionBase} from "./PartitionBase";
import { Viewport } from '@awayjs/stage';


/**
 * @class away.partition.Partition
 */
export class BasicPartition extends PartitionBase
{
	constructor(root:IEntity, viewport:Viewport = null)
	{
		super(root, viewport);

		this._rootNode = new NodeBase(root, this);
	}
}