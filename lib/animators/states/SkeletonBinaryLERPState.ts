import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {JointPose}						from "../../animators/data/JointPose";
import {Skeleton}							from "../../animators/data/Skeleton";
import {SkeletonPose}						from "../../animators/data/SkeletonPose";
import {SkeletonBinaryLERPNode}			from "../../animators/nodes/SkeletonBinaryLERPNode";
import {AnimationStateBase}				from "../../animators/states/AnimationStateBase";
import {ISkeletonAnimationState}			from "../../animators/states/ISkeletonAnimationState";

/**
 *
 */
export class SkeletonBinaryLERPState extends AnimationStateBase implements ISkeletonAnimationState
{
	private _blendWeight:number = 0;
	private _skeletonAnimationNode:SkeletonBinaryLERPNode;
	private _skeletonPose:SkeletonPose = new SkeletonPose();
	private _skeletonPoseDirty:boolean = true;
	private _inputA:ISkeletonAnimationState;
	private _inputB:ISkeletonAnimationState;

	/**
	 * Defines a fractional value between 0 and 1 representing the blending ratio between inputA (0) and inputB (1),
	 * used to produce the skeleton pose output.
	 *
	 * @see inputA
	 * @see inputB
	 */
	public get blendWeight():number
	{
		return this._blendWeight;
	}

	public set blendWeight(value:number)
	{
		this._blendWeight = value;

		this._pPositionDeltaDirty = true;
		this._skeletonPoseDirty = true;
	}

	constructor(animator:AnimatorBase, skeletonAnimationNode:SkeletonBinaryLERPNode)
	{
		super(animator, skeletonAnimationNode);

		this._skeletonAnimationNode = skeletonAnimationNode;

		this._inputA = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode.inputA);
		this._inputB = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode.inputB);
	}

	/**
	 * @inheritDoc
	 */
	public phase(value:number):void
	{
		this._skeletonPoseDirty = true;

		this._pPositionDeltaDirty = true;

		this._inputA.phase(value);
		this._inputB.phase(value);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateTime(time:number):void
	{
		this._skeletonPoseDirty = true;

		this._inputA.update(time);
		this._inputB.update(time);

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
	 * @inheritDoc
	 */
	public _pUpdatePositionDelta():void
	{
		this._pPositionDeltaDirty = false;

		var deltA:Vector3D = this._inputA.positionDelta;
		var deltB:Vector3D = this._inputB.positionDelta;

		this._pRootDelta.x = deltA.x + this._blendWeight*(deltB.x - deltA.x);
		this._pRootDelta.y = deltA.y + this._blendWeight*(deltB.y - deltA.y);
		this._pRootDelta.z = deltA.z + this._blendWeight*(deltB.z - deltA.z);
	}

	/**
	 * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
	 *
	 * @param skeleton The skeleton used by the animator requesting the ouput pose.
	 */
	private updateSkeletonPose(skeleton:Skeleton):void
	{
		this._skeletonPoseDirty = false;

		var endPose:JointPose;
		var endPoses:Array<JointPose> = this._skeletonPose.jointPoses;
		var poses1:Array<JointPose> = this._inputA.getSkeletonPose(skeleton).jointPoses;
		var poses2:Array<JointPose> = this._inputB.getSkeletonPose(skeleton).jointPoses;
		var pose1:JointPose, pose2:JointPose;
		var p1:Vector3D, p2:Vector3D;
		var tr:Vector3D;
		var numJoints:number = skeleton.numJoints;

		// :s
		if (endPoses.length != numJoints)
			endPoses.length = numJoints;

		for (var i:number = 0; i < numJoints; ++i) {
			endPose = endPoses[i];

			if (endPose == null)
				endPose = endPoses[i] = new JointPose();

			pose1 = poses1[i];
			pose2 = poses2[i];
			p1 = pose1.translation;
			p2 = pose2.translation;

			endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);

			tr = endPose.translation;
			tr.x = p1.x + this._blendWeight*(p2.x - p1.x);
			tr.y = p1.y + this._blendWeight*(p2.y - p1.y);
			tr.z = p1.z + this._blendWeight*(p2.z - p1.z);
		}
	}
}