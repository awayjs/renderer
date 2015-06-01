import IWrapperClass				= require("awayjs-core/lib/library/IWrapperClass");

import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import ISubGeometryVO				= require("awayjs-display/lib/vos/ISubGeometryVO");

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