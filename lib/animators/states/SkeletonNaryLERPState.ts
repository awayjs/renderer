import {Quaternion}						from "@awayjs/core/lib/geom/Quaternion";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {JointPose}						from "../../animators/data/JointPose";
import {Skeleton}							from "../../animators/data/Skeleton";
import {SkeletonPose}						from "../../animators/data/SkeletonPose";
import {SkeletonNaryLERPNode}				from "../../animators/nodes/SkeletonNaryLERPNode";
import {AnimationStateBase}				from "../../animators/states/AnimationStateBase";
import {ISkeletonAnimationState}			from "../../animators/states/ISkeletonAnimationState";

/**
 *
 */
export class SkeletonNaryLERPState extends AnimationStateBase implements ISkeletonAnimationState
{
	private _skeletonAnimationNode:SkeletonNaryLERPNode;
	private _skeletonPose:SkeletonPose = new SkeletonPose();
	private _skeletonPoseDirty:boolean = true;
	private _blendWeights:Array<number> = new Array<number>();
	private _inputs:Array<ISkeletonAnimationState> = new Array<ISkeletonAnimationState>();

	constructor(animator:AnimatorBase, skeletonAnimationNode:SkeletonNaryLERPNode)
	{
		super(animator, skeletonAnimationNode);

		this._skeletonAnimationNode = skeletonAnimationNode;

		var i:number = this._skeletonAnimationNode.numInputs;

		while (i--)
			this._inputs[i] = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode._iInputs[i]);
	}

	/**
	 * @inheritDoc
	 */
	public phase(value:number):void
	{
		this._skeletonPoseDirty = true;

		this._pPositionDeltaDirty = true;

		for (var j:number = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
			if (this._blendWeights[j])
				this._inputs[j].update(value);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _pUdateTime(time:number):void
	{
		for (var j:number = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
			if (this._blendWeights[j])
				this._inputs[j].update(time);
		}

		super._pUpdateTime(time);
	}

	/**
	 * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	 */
	public getSkeletonPose(skeleton:Skeleton):SkeletonPose
	{
		if (this._skeletonPoseDirty)
			this.updateSkeletonPose(skeleton);

		return this._skeletonPose;
	}

	/**
	 * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
	 *
	 * @param index The input index for which the skeleton animation node blend weight is requested.
	 */
	public getBlendWeightAt(index:number):number
	{
		return this._blendWeights[index];
	}

	/**
	 * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
	 *
	 * @param index The input index on which the skeleton animation node blend weight is to be set.
	 * @param blendWeight The blend weight value to use for the given skeleton animation node index.
	 */
	public setBlendWeightAt(index:number, blendWeight:number):void
	{
		this._blendWeights[index] = blendWeight;

		this._pPositionDeltaDirty = true;
		this._skeletonPoseDirty = true;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdatePositionDelta():void
	{
		this._pPositionDeltaDirty = false;

		var delta:Vector3D;
		var weight:number;

		this.positionDelta.x = 0;
		this.positionDelta.y = 0;
		this.positionDelta.z = 0;

		for (var j:number = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
			weight = this._blendWeights[j];

			if (weight) {
				delta = this._inputs[j].positionDelta;
				this.positionDelta.x += weight*delta.x;
				this.positionDelta.y += weight*delta.y;
				this.positionDelta.z += weight*delta.z;
			}
		}
	}

	/**
	 * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
	 *
	 * @param skeleton The skeleton used by the animator requesting the ouput pose.
	 */
	private updateSkeletonPose(skeleton:Skeleton):void
	{
		this._skeletonPoseDirty = false;

		var weight:number;
		var endPoses:Array<JointPose> = this._skeletonPose.jointPoses;
		var poses:Array<JointPose>;
		var endPose:JointPose, pose:JointPose;
		var endTr:Vector3D, tr:Vector3D;
		var endQuat:Quaternion, q:Quaternion;
		var firstPose:Array<JointPose>;
		var i:number;
		var w0:number, x0:number, y0:number, z0:number;
		var w1:number, x1:number, y1:number, z1:number;
		var numJoints:number = skeleton.numJoints;

		// :s
		if (endPoses.length != numJoints)
			endPoses.length = numJoints;

		for (var j:number = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
			weight = this._blendWeights[j];

			if (!weight)
				continue;

			poses = this._inputs[j].getSkeletonPose(skeleton).jointPoses;

			if (!firstPose) {
				firstPose = poses;
				for (i = 0; i < numJoints; ++i) {
					endPose = endPoses[i];

					if (endPose == null)
						endPose = endPoses[i] = new JointPose();

					pose = poses[i];
					q = pose.orientation;
					tr = pose.translation;

					endQuat = endPose.orientation;

					endQuat.x = weight*q.x;
					endQuat.y = weight*q.y;
					endQuat.z = weight*q.z;
					endQuat.w = weight*q.w;

					endTr = endPose.translation;
					endTr.x = weight*tr.x;
					endTr.y = weight*tr.y;
					endTr.z = weight*tr.z;
				}
			} else {
				for (i = 0; i < skeleton.numJoints; ++i) {
					endPose = endPoses[i];
					pose = poses[i];

					q = firstPose[i].orientation;
					x0 = q.x;
					y0 = q.y;
					z0 = q.z;
					w0 = q.w;

					q = pose.orientation;
					tr = pose.translation;

					x1 = q.x;
					y1 = q.y;
					z1 = q.z;
					w1 = q.w;
					// find shortest direction
					if (x0*x1 + y0*y1 + z0*z1 + w0*w1 < 0) {
						x1 = -x1;
						y1 = -y1;
						z1 = -z1;
						w1 = -w1;
					}
					endQuat = endPose.orientation;
					endQuat.x += weight*x1;
					endQuat.y += weight*y1;
					endQuat.z += weight*z1;
					endQuat.w += weight*w1;

					endTr = endPose.translation;
					endTr.x += weight*tr.x;
					endTr.y += weight*tr.y;
					endTr.z += weight*tr.z;
				}
			}
		}

		for (i = 0; i < skeleton.numJoints; ++i)
			endPoses[i].orientation.normalize();
	}
}