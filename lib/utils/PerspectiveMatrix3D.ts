import Matrix3D							= require("awayjs-core/lib/core/geom/Matrix3D");

/**
 *
 */
class PerspectiveMatrix3D extends Matrix3D
{
	constructor(v:Array<number> = null)
	{
		super(v);
	}

	public perspectiveFieldOfViewLH(fieldOfViewY:number, aspectRatio:number, zNear:number, zFar:number)
	{
		var yScale:number = 1/Math.tan(fieldOfViewY/2);
		var xScale:number = yScale/aspectRatio;

		this.copyRawDataFrom([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zFar/(zFar - zNear), 1.0, 0.0, 0.0, (zNear*zFar)/(zNear - zFar), 0.0]);
	}
}

export = PerspectiveMatrix3D;