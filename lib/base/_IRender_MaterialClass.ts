import {IMaterial} from "./IMaterial";
import {_Render_MaterialBase} from "./_Render_MaterialBase";
import {_Render_ElementsBase} from "./_Render_ElementsBase";

/**
 * IMaterialClassGL is an interface for the constructable class definition GL_MaterialBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_MaterialBase
 */
export interface _IRender_MaterialClass
{
	/**
	 *
	 */
	new(material:IMaterial, renderElements:_Render_ElementsBase):_Render_MaterialBase;
}