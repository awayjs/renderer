/**
 * Created with JetBrains PhpStorm.
 * User: karimbeyrouti
 * Date: 20/06/2013
 * Time: 10:08
 * To change this template use File | Settings | File Templates.
 */
module away3d.core.math
{
    //import flash.geom.Matrix3D;
    //import flash.geom.Orientation3D;
    //import flash.geom.Vector3D;

    /**
     * A Quaternion object which can be used to represent rotations.
     */
    export class Orientation3D
    {

        public static AXIS_ANGLE : string   = "axisAngle";//[static] The axis angle orientation uses a combination of an axis and an angle to determine the orientation.        Orientation3D
        public static EULER_ANGLES : string = "eulerAngles";//[static] Euler angles, the default orientation for decompose() and recompose() methods, defines the orientation with three separate angles of rotation for each axis.
        public static QUATERNION : string   = "quaternion";//[static] The quaternion orientation uses complex numbers.

    }


}