import {IRenderable} from "./IRenderable";

import {RenderStateBase} from "./RenderStateBase";
import {RenderStatePool} from "./RenderStatePool";

/**
 * IMaterialClassGL is an interface for the constructable class definition GL_MaterialBase that is used to
 * create render objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.GL_MaterialBase
 */
export interface IRenderStateClass
{
	/**
	 *
	 */
	new(renderable:IRenderable, pool:RenderStatePool):RenderStateBase;
}