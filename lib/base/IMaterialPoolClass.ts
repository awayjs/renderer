import {Stage} from "@awayjs/stage";

import {MaterialStatePool} from "./MaterialStatePool";
import {RenderGroup} from "../RenderGroup";

/**
 *
 */
export interface IMaterialPoolClass
{
	/**
	 *
	 */
	new(stage:Stage, abstractionClassPool:Object, renderGroup:RenderGroup):MaterialStatePool;
}