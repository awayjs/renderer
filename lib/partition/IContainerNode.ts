import {INode} from "./INode";
import { TraverserBase } from './TraverserBase';

/**
 * IDisplayObjectNode is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IDisplayObjectNode
 */
export interface IContainerNode extends INode
{
	numEntities:number;

	iAddNode(node:INode);

	iRemoveNode(node:INode);
}