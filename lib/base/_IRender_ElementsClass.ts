import {Stage} from "@awayjs/stage";

import {_Render_ElementsBase} from "./_Render_ElementsBase";
import {RenderGroup} from "../RenderGroup";

/**
 *
 */
export interface _IRender_ElementsClass
{
	/**
	 *
	 */
	new(stage:Stage, abstractionClassPool:Object, renderGroup:RenderGroup):_Render_ElementsBase;
}