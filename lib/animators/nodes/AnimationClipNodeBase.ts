import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";

/**
 * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
 */
export class AnimationClipNodeBase extends AnimationNodeBase
{
	public _pLooping:boolean = true;
	public _pTotalDuration:number = 0;
	public _pLastFrame:number;

	public _pStitchDirty:boolean = true;
	public _pStitchFinalFrame:boolean = false;
	public _pNumFrames:number = 0;

	public _pDurations:Array<number> = new Array<number>();
	/*uint*/
	public _pTotalDelta:Vector3D = new Vector3D();

	public fixedFrameRate:boolean = true;

	/**
	 * Determines whether the contents of the animation node have looping characteristics enabled.
	 */
	public get looping():boolean
	{
		return this._pLooping;
	}

	public set looping(value:boolean)
	{
		if (this._pLooping == value)
			return;

		this._pLooping = value;

		this._pStitchDirty = true;
	}

	/**
	 * Defines if looping content blends the final frame of animation data with the first (true) or works on the
	 * assumption that both first and last frames are identical (false). Defaults to false.
	 */
	public get stitchFinalFrame():boolean
	{
		return this._pStitchFinalFrame;
	}

	public set stitchFinalFrame(value:boolean)
	{
		if (this._pStitchFinalFrame == value)
			return;

		this._pStitchFinalFrame = value;

		this._pStitchDirty = true;
	}

	public get totalDuration():number
	{
		if (this._pStitchDirty)
			this._pUpdateStitch();

		return this._pTotalDuration;
	}

	public get totalDelta():Vector3D
	{
		if (this._pStitchDirty)
			this._pUpdateStitch();

		return this._pTotalDelta;
	}

	public get lastFrame():number
	{
		if (this._pStitchDirty)
			this._pUpdateStitch();

		return this._pLastFrame;
	}

	/**
	 * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
	 */
	public get durations():Array<number>
	{
		return this._pDurations;
	}

	/**
	 * Creates a new <code>AnimationClipNodeBase</code> object.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Updates the node's final frame stitch state.
	 *
	 * @see #stitchFinalFrame
	 */
	public _pUpdateStitch():void
	{
		this._pStitchDirty = false;

		this._pLastFrame = (this._pStitchFinalFrame)? this._pNumFrames : this._pNumFrames - 1;

		this._pTotalDuration = 0;
		this._pTotalDelta.x = 0;
		this._pTotalDelta.y = 0;
		this._pTotalDelta.z = 0;
	}
}