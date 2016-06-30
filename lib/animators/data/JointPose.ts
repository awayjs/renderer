import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";
import {Quaternion}						from "@awayjs/core/lib/geom/Quaternion";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

/**
 * Contains transformation data for a skeleton joint, used for skeleton animation.
 *
 * @see away.animation.Skeleton
 * @see away.animation.SkeletonJoint
 *
 * todo: support (uniform) scale
 */
export class JointPose
{
	/**
	 * The name of the joint to which the pose is associated
	 */
	public name:string; // intention is that this should be used only at load time, not in the main loop

	/**
	 * The rotation of the pose stored as a quaternion
	 */
	public orientation:Quaternion = new Quaternion();

	/**
	 * The translation of the pose
	 */
	public translation:Vector3D = new Vector3D();

	constructor()
	{

	}

	/**
	 * Converts the transformation to a Matrix3D representation.
	 *
	 * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
	 * @return The transformation matrix of the pose.
	 */
	public toMatrix3D(target:Matrix3D = null):Matrix3D
	{
		if (target == null)
			target = new Matrix3D();

		this.orientation.toMatrix3D(target);
		target.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
		return target;
	}

	/**
	 * Copies the transformation data from a source pose object into the existing pose object.
	 *
	 * @param pose The source pose to copy from.
	 */
	public copyFrom(pose:JointPose):void
	{
		var or:Quaternion = pose.orientation;
		var tr:Vector3D = pose.translation;
		this.orientation.x = or.x;
		this.orientation.y = or.y;
		this.orientation.z = or.z;
		this.orientation.w = or.w;
		this.translation.x = tr.x;
		this.translation.y = tr.y;
		this.translation.z = tr.z;
	}
}