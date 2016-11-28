import {IMaterial} from "@awayjs/graphics";

import {IElementsClassGL} from "../elements/IElementsClassGL";

import {GL_MaterialBase} from "./GL_MaterialBase";
import {MaterialPool} from "./MaterialPool";

/**
 * IMaterialClassGL is an interface for the constructable class definition GL_MaterialBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_MaterialBase
 */
export interface IMaterialClassGL
{
	/**
	 *
	 */
	new(material:IMaterial, elementsClass:IElementsClassGL, pool:MaterialPool):GL_MaterialBase;
}