import {IMaterial} from "./IMaterial";
import {MaterialStateBase} from "./MaterialStateBase";
import {MaterialStatePool} from "./MaterialStatePool";

/**
 * IMaterialClassGL is an interface for the constructable class definition GL_MaterialBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_MaterialBase
 */
export interface IMaterialStateClass
{
	/**
	 *
	 */
	new(material:IMaterial, pool:MaterialStatePool):MaterialStateBase;
}