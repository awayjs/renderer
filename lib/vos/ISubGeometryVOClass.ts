import Stage						= require("awayjs-stagegl/lib/base/Stage");

import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import ISubGeometryVO				= require("awayjs-display/lib/vos/ISubGeometryVO");

/**
 * ISubGeometryVOClass is an interface for the constructable class definition ISubGeometryVO that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.ISubGeometryVOClass
 */
interface ISubGeometryVOClass
{
	/**
	 *
	 */
	new(subGeometry:SubGeometryBase, stage:Stage):ISubGeometryVO;
}

export = ISubGeometryVOClass;