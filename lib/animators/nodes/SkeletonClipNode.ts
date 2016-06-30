import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {SkeletonPose}						from "../../animators/data/SkeletonPose";
import {AnimationClipNodeBase}			from "../../animators/nodes/AnimationClipNodeBase";
import {SkeletonClipState}				from "../../animators/states/SkeletonClipState";

/**
 * A skeleton animation node containing time-based animation data as individual skeleton poses.
 */
export class SkeletonClipNode extends AnimationClipNodeBase
{
	private _frames:Array<SkeletonPose> = new Array<SkeletonPose>();

	/**
	 * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
	 * of the output skeleton pose. Defaults to false.
	 */
	public highQuality:boolean = false;

	/**
	 * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
	 */
	public get frames():Array<SkeletonPose>
	{
		return this._frames;
	}

	/**
	 * Creates a new <code>SkeletonClipNode</code> object.
	 */
	constructor()
	{
		super();

		this._pStateClass = SkeletonClipState;
	}

	/**
	 * Adds a skeleton pose frame to the internal timeline of the animation node.
	 *
	 * @param skeletonPose The skeleton pose object to add to the timeline of the node.
	 * @param duration The specified duration of the frame in milliseconds.
	 */
	public addFrame(skeletonPose:SkeletonPose, duration:number):void
	{
		this._frames.push(skeletonPose);
		this._pDurations.push(duration);

		this._pNumFrames = this._pDurations.length;

		this._pStitchDirty = true;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):SkeletonClipState
	{
		return <SkeletonClipState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateStitch():void
	{
		super._pUpdateStitch();

		var i:number = this._pNumFrames - 1;
		var p1:Vector3D, p2:Vector3D, delta:Vector3D;
		while (i--) {
			this._pTotalDuration += this._pDurations[i];
			p1 = this._frames[i].jointPoses[0].translation;
			p2 = this._frames[i + 1].jointPoses[0].translation;
			delta = p2.subtract(p1);
			this._pTotalDelta.x += delta.x;
			this._pTotalDelta.y += delta.y;
			this._pTotalDelta.z += delta.z;
		}

		if (this._pStitchFinalFrame || !this._pLooping) {
			this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
			p1 = this._frames[0].jointPoses[0].translation;
			p2 = this._frames[1].jointPoses[0].translation;
			delta = p2.subtract(p1);
			this._pTotalDelta.x += delta.x;
			this._pTotalDelta.y += delta.y;
			this._pTotalDelta.z += delta.z;
		}
	}
}