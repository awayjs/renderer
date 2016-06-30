import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {SkeletonAnimator}					from "../../animators/SkeletonAnimator";
import {JointPose}						from "../../animators/data/JointPose";
import {Skeleton}							from "../../animators/data/Skeleton";
import {SkeletonPose}						from "../../animators/data/SkeletonPose";
import {SkeletonClipNode}					from "../../animators/nodes/SkeletonClipNode";
import {AnimationClipState}				from "../../animators/states/AnimationClipState";
import {ISkeletonAnimationState}			from "../../animators/states/ISkeletonAnimationState";

/**
 *
 */
export class SkeletonClipState extends AnimationClipState implements ISkeletonAnimationState
{
	private _rootPos:Vector3D = new Vector3D();
	private _frames:Array<SkeletonPose>;
	private _skeletonClipNode:SkeletonClipNode;
	private _skeletonPose:SkeletonPose = new SkeletonPose();
	private _skeletonPoseDirty:boolean = true;
	private _currentPose:SkeletonPose;
	private _nextPose:SkeletonPose;

	/**
	 * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
	 */
	public get currentPose():SkeletonPose
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._currentPose;
	}

	/**
	 * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
	 */
	public get nextPose():SkeletonPose
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._nextPose;
	}

	constructor(animator:AnimatorBase, skeletonClipNode:SkeletonClipNode)
	{
		super(animator, skeletonClipNode);

		this._skeletonClipNode = skeletonClipNode;
		this._frames = this._skeletonClipNode.frames;
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
	public _pUpdateTime(time:number):void
	{
		this._skeletonPoseDirty = true;

		super._pUpdateTime(time);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateFrames():void
	{
		super._pUpdateFrames();

		this._currentPose = this._frames[this._pCurrentFrame];

		if (this._skeletonClipNode.looping && this._pNextFrame >= this._skeletonClipNode.lastFrame) {
			this._nextPose = this._frames[0];
			(<SkeletonAnimator> this._pAnimator).dispatchCycleEvent();
		} else
			this._nextPose = this._frames[this._pNextFrame];
	}

	/**
	 * Updates the output skeleton pose of the node based on the internal playhead position.
	 *
	 * @param skeleton The skeleton used by the animator requesting the ouput pose.
	 */
	private updateSkeletonPose(skeleton:Skeleton):void
	{
		this._skeletonPoseDirty = false;

		if (!this._skeletonClipNode.totalDuration)
			return;

		if (this._pFramesDirty)
			this._pUpdateFrames();

		var currentPose:Array<JointPose> = this._currentPose.jointPoses;
		var nextPose:Array<JointPose> = this._nextPose.jointPoses;
		var numJoints:number = skeleton.numJoints;
		var p1:Vector3D, p2:Vector3D;
		var pose1:JointPose, pose2:JointPose;
		var endPoses:Array<JointPose> = this._skeletonPose.jointPoses;
		var endPose:JointPose;
		var tr:Vector3D;

		// :s
		if (endPoses.length != numJoints)
			endPoses.length = numJoints;

		if ((numJoints != currentPose.length) || (numJoints != nextPose.length))
			throw new Error("joint counts don't match!");

		for (var i:number = 0; i < numJoints; ++i) {
			endPose = endPoses[i];

			if (endPose == null)
				endPose = endPoses[i] = new JointPose();

			pose1 = currentPose[i];
			pose2 = nextPose[i];
			p1 = pose1.translation;
			p2 = pose2.translation;

			if (this._skeletonClipNode.highQuality)
				endPose.orientation.slerp(pose1.orientation, pose2.orientation, this._pBlendWeight); else
				endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._pBlendWeight);

			if (i > 0) {
				tr = endPose.translation;
				tr.x = p1.x + this._pBlendWeight*(p2.x - p1.x);
				tr.y = p1.y + this._pBlendWeight*(p2.y - p1.y);
				tr.z = p1.z + this._pBlendWeight*(p2.z - p1.z);
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdatePositionDelta():void
	{
		this._pPositionDeltaDirty = false;

		if (this._pFramesDirty)
			this._pUpdateFrames();

		var p1:Vector3D, p2:Vector3D, p3:Vector3D;
		var totalDelta:Vector3D = this._skeletonClipNode.totalDelta;

		// jumping back, need to reset position
		if ((this._pTimeDir > 0 && this._pNextFrame < this._pOldFrame) || (this._pTimeDir < 0 && this._pNextFrame > this._pOldFrame)) {
			this._rootPos.x -= totalDelta.x*this._pTimeDir;
			this._rootPos.y -= totalDelta.y*this._pTimeDir;
			this._rootPos.z -= totalDelta.z*this._pTimeDir;
		}

		var dx:number = this._rootPos.x;
		var dy:number = this._rootPos.y;
		var dz:number = this._rootPos.z;

		if (this._skeletonClipNode.stitchFinalFrame && this._pNextFrame == this._skeletonClipNode.lastFrame) {
			p1 = this._frames[0].jointPoses[0].translation;
			p2 = this._frames[1].jointPoses[0].translation;
			p3 = this._currentPose.jointPoses[0].translation;

			this._rootPos.x = p3.x + p1.x + this._pBlendWeight*(p2.x - p1.x);
			this._rootPos.y = p3.y + p1.y + this._pBlendWeight*(p2.y - p1.y);
			this._rootPos.z = p3.z + p1.z + this._pBlendWeight*(p2.z - p1.z);
		} else {
			p1 = this._currentPose.jointPoses[0].translation;
			p2 = this._frames[this._pNextFrame].jointPoses[0].translation; //cover the instances where we wrap the pose but still want the final frame translation values
			this._rootPos.x = p1.x + this._pBlendWeight*(p2.x - p1.x);
			this._rootPos.y = p1.y + this._pBlendWeight*(p2.y - p1.y);
			this._rootPos.z = p1.z + this._pBlendWeight*(p2.z - p1.z);
		}

		this._pRootDelta.x = this._rootPos.x - dx;
		this._pRootDelta.y = this._rootPos.y - dy;
		this._pRootDelta.z = this._rootPos.z - dz;

		this._pOldFrame = this._pNextFrame;
	}
}