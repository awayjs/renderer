import Quaternion						= require("awayjs-core/lib/core/geom/Quaternion");
import Vector3D							= require("awayjs-core/lib/core/geom/Vector3D");

/**
 * 
 */
class BaseFrameData
{
	/**
	 *
	 */
	public position:Vector3D;

	/**
	 *
	 */
	public orientation:Quaternion;
}

export = BaseFrameData;