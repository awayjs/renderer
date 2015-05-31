import IWrapperClass				= require("awayjs-core/lib/library/IWrapperClass");
import ISubGeometryVO				= require("awayjs-core/lib/vos/ISubGeometryVO");
import SubGeometryBase				= require("awayjs-core/lib/data/SubGeometryBase");

import SubGeometryVOPool			= require("awayjs-renderergl/lib/vos/SubGeometryVOPool");

/**
 * ISubGeometryVOClass is an interface for the constructable class definition ISubGeometryVO that is used to
 * create renderable objects in the rendering pipeline to render the contents of a partition
 *
 * @class away.render.ISubGeometryVOClass
 */
interface ISubGeometryVOClass extends IWrapperClass
{
	/**
	 *
	 */
	new(pool:SubGeometryVOPool, subGeometry:SubGeometryBase):ISubGeometryVO;
}

export = ISubGeometryVOClass;