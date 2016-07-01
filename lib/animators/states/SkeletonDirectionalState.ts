import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {JointPose}						from "../../animators/data/JointPose";
import {Skeleton}							from "../../animators/data/Skeleton";
import {SkeletonPose}						from "../../animators/data/SkeletonPose";
import {SkeletonDirectionalNode}			from "../../animators/nodes/SkeletonDirectionalNode";
import {AnimationStateBase}				from "../../animators/states/AnimationStateBase";
import {ISkeletonAnimationState}			from "../../animators/states/ISkeletonAnimationState";

/**
 *
 */
export class SkeletonDirectionalState extends AnimationStateBase implements ISkeletonAnimationState
{
	private _skeletonAnimationNode:SkeletonDirectionalNode;
	private _skeletonPose:SkeletonPose = new SkeletonPose();
	private _skeletonPoseDirty:boolean = true;
	private _inputA:ISkeletonAnimationState;
	private _inputB:ISkeletonAnimationState;
	private _blendWeight:number = 0;
	private _direction:number = 0;
	private _blendDirty:boolean = true;
	private _forward:ISkeletonAnimationState;
	private _backward:ISkeletonAnimationState;
	private _left:ISkeletonAnimationState;
	private _right:ISkeletonAnimationState;

	/**
	 * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
	 * used to produce the skeleton pose output.
	 */
	public set direction(value:number)
	{
		if (this._direction == value)
			return;

		this._direction = value;

		this._blendDirty = true;

		this._skeletonPoseDirty = true;
		this._pPositionDeltaDirty = true;
	}

	public get direction():number
	{
		return this._direction;
	}

	constructor(animator:AnimatorBase, skeletonAnimationNode:SkeletonDirectionalNode)
	{
		super(animator, skeletonAnimationNode);

		this._skeletonAnimationNode = skeletonAnimationNode;

		this._forward = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode.forward);
		this._backward = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode.backward);
		this._left = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode.left);
		this._right = <ISkeletonAnimationState> animator.getAnimationState(this._skeletonAnimationNode.right);
	}

	/**
	 * @inheritDoc
	 */
	public phase(value:number):void
	{
		if (this._blendDirty)
			this.updateBlend();

		this._skeletonPoseDirty = true;

		this._pPositionDeltaDirty = true;

		this._inputA.phase(value);
		this._inputB.phase(value);
	}

	/**
	 * @inheritDoc
	 */
	public _pUdateTime(time:number):void
	{
		if (this._blendDirty)
			this.updateBlend();

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

		if (this._blendDirty)
			this.updateBlend();

		var deltA:Vector3D = this._inputA.positionDelta;
		var deltB:Vector3D = this._inputB.positionDelta;

		this.positionDelta.x = deltA.x + this._blendWeight*(deltB.x - deltA.x);
		this.positionDelta.y = deltA.y + this._blendWeight*(deltB.y - deltA.y);
		this.positionDelta.z = deltA.z + this._blendWeight*(deltB.z - deltA.z);
	}

	/**
	 * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
	 *
	 * @param skeleton The skeleton used by the animator requesting the ouput pose.
	 */
	private updateSkeletonPose(skeleton:Skeleton):void
	{
		this._skeletonPoseDirty = false;

		if (this._blendDirty)
			this.updateBlend();

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

	/**
	 * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
	 *
	 * @private
	 */
	private updateBlend():void
	{
		this._blendDirty = false;

		if (this._direction < 0 || this._direction > 360) {
			this._direction %= 360;
			if (this._direction < 0)
				this._direction += 360;
		}

		if (this._direction < 90) {
			this._inputA = this._forward;
			this._inputB = this._right;
			this._blendWeight = this._direction/90;
		} else if (this._direction < 180) {
			this._inputA = this._right;
			this._inputB = this._backward;
			this._blendWeight = (this._direction - 90)/90;
		} else if (this._direction < 270) {
			this._inputA = this._backward;
			this._inputB = this._left;
			this._blendWeight = (this._direction - 180)/90;
		} else {
			this._inputA = this._left;
			this._inputB = this._forward;
			this._blendWeight = (this._direction - 270)/90;
		}
	}
}