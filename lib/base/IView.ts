import {IEntity} from "./IEntity";
import {TouchPoint} from "./TouchPoint";

/**
 *
 */
export interface IView
{
	getLocalMouseX(entity:IEntity):number;

	getLocalMouseY(entity:IEntity):number;

	getLocalTouchPoints(entity:IEntity):Array<TouchPoint>;
}