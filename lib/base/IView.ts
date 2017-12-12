import {IEntity} from "./IEntity";
import {TraverserBase} from "./TraverserBase";
import {TouchPoint} from "./TouchPoint";

/**
 *
 */
export interface IView
{
	traversePartitions(traverser:TraverserBase)

	getLocalMouseX(entity:IEntity):number;

	getLocalMouseY(entity:IEntity):number;

	getLocalTouchPoints(entity:IEntity):Array<TouchPoint>;

    invalidateEntity(entity:IEntity);

	clearEntity(entity:IEntity);
}