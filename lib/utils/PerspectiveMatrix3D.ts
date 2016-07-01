import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";

/**
 *
 */
export class PerspectiveMatrix3D extends Matrix3D
{
	constructor(v:Float32Array = null)
	{
		super(v);
	}

	public perspectiveFieldOfViewLH(fieldOfViewY:number, aspectRatio:number, zNear:number, zFar:number):void
	{
		var yScale:number = 1/Math.tan(fieldOfViewY/2);
		var xScale:number = yScale/aspectRatio;

		this.rawData[0] = xScale;
		this.rawData[1] = 0.0;
		this.rawData[2] = 0.0;
		this.rawData[3] = 0.0;

		this.rawData[4] = 0.0;
		this.rawData[5] = yScale;
		this.rawData[6] = 0.0;
		this.rawData[7] = 0.0;

		this.rawData[8] = 0.0;
		this.rawData[9] = 0.0;
		this.rawData[10] = zFar/(zFar - zNear);
		this.rawData[11] = 1.0;

		this.rawData[12] = 0.0;
		this.rawData[13] = 0.0;
		this.rawData[14] = (zNear*zFar)/(zNear - zFar);
		this.rawData[15] = 0.0;
	}
}