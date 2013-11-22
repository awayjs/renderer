///<reference path="../../_definitions.ts"/>

module away.geom
{
	/**
	 * A Quaternion object which can be used to represent rotations.
	 */
	export class Orientation3D
	{

		public static AXIS_ANGLE:string = "axisAngle";      //[static] The axis angle orientation uses a combination of an axis and an angle to determine the orientation.
		public static EULER_ANGLES:string = "eulerAngles";    //[static] Euler angles, the default orientation for decompose() and recompose() methods, defines the orientation with three separate angles of rotation for each axis.
		public static QUATERNION:string = "quaternion";     //[static] The quaternion orientation uses complex numbers.

	}


}