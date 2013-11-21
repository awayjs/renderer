///<reference path="../_definitions.ts"/>

module away.utils
{
	export class PerspectiveMatrix3D extends away.geom.Matrix3D
	{
		constructor(v:number[] = null)
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
}