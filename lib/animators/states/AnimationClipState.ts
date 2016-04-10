import AnimatorBase						from "../../animators/AnimatorBase";
import AnimationClipNodeBase			from "../../animators/nodes/AnimationClipNodeBase";
import AnimationStateBase				from "../../animators/states/AnimationStateBase";
import AnimationStateEvent				from "../../events/AnimationStateEvent";

/**
 *
 */
class AnimationClipState extends AnimationStateBase
{
	private _animationClipNode:AnimationClipNodeBase;
	private _animationStatePlaybackComplete:AnimationStateEvent;
	public _pBlendWeight:number;
	public _pCurrentFrame:number /*uint*/;
	public _pNextFrame:number /*uint*/;

	public _pOldFrame:number /*uint*/;
	public _pTimeDir:number /*int*/;
	public _pFramesDirty:boolean = true;

	/**
	 * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	 * between the current frame (0) and next frame (1) of the animation.
	 *
	 * @see #currentFrame
	 * @see #nextFrame
	 */
	public get blendWeight():number
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._pBlendWeight;
	}

	/**
	 * Returns the current frame of animation in the clip based on the internal playhead position.
	 */
	public get currentFrame():number /*uint*/
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._pCurrentFrame;
	}

	/**
	 * Returns the next frame of animation in the clip based on the internal playhead position.
	 */
	public get nextFrame():number /*uint*/
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._pNextFrame;
	}

	constructor(animator:AnimatorBase, animationClipNode:AnimationClipNodeBase)
	{
		super(animator, animationClipNode);

		this._animationClipNode = animationClipNode;
	}

	/**
	 * @inheritDoc
	 */
	public update(time:number /*int*/)
	{
		if (!this._animationClipNode.looping) {
			if (time > this._pStartTime + this._animationClipNode.totalDuration)
				time = this._pStartTime + this._animationClipNode.totalDuration; else if (time < this._pStartTime)
				time = this._pStartTime;
		}

		if (this._pTime == time - this._pStartTime)
			return;

		this._pUpdateTime(time);
	}

	/**
	 * @inheritDoc
	 */
	public phase(value:number)
	{
		var time:number /*int*/ = value*this._animationClipNode.totalDuration + this._pStartTime;

		if (this._pTime == time - this._pStartTime)
			return;

		this._pUpdateTime(time);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateTime(time:number /*int*/)
	{
		this._pFramesDirty = true;

		this._pTimeDir = (time - this._pStartTime > this._pTime)? 1 : -1;

		super._pUpdateTime(time);
	}

	/**
	 * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
	 *
	 * @see #currentFrame
	 * @see #nextFrame
	 * @see #blendWeight
	 */
	public _pUpdateFrames()
	{
		this._pFramesDirty = false;

		var looping:boolean = this._animationClipNode.looping;
		var totalDuration:number /*uint*/ = this._animationClipNode.totalDuration;
		var lastFrame:number /*uint*/ = this._animationClipNode.lastFrame;
		var time:number /*int*/ = this._pTime;

		//trace("time", time, totalDuration)
		if (looping && (time >= totalDuration || time < 0)) {
			time %= totalDuration;
			if (time < 0)
				time += totalDuration;
		}

		if (!looping && time >= totalDuration) {
			this.notifyPlaybackComplete();
			this._pCurrentFrame = lastFrame;
			this._pNextFrame = lastFrame;
			this._pBlendWeight = 0;
		} else if (!looping && time <= 0) {
			this._pCurrentFrame = 0;
			this._pNextFrame = 0;
			this._pBlendWeight = 0;
		} else if (this._animationClipNode.fixedFrameRate) {
			var t:number = time/totalDuration*lastFrame;
			this._pCurrentFrame = Math.floor(t);
			this._pBlendWeight = t - this._pCurrentFrame;
			this._pNextFrame = this._pCurrentFrame + 1;
		} else {
			this._pCurrentFrame = 0;
			this._pNextFrame = 0;

			var dur:number /*uint*/ = 0, frameTime:number /*uint*/;
			var durations:Array<number> /*uint*/ = this._animationClipNode.durations;

			do {
				frameTime = dur;
				dur += durations[this._pNextFrame];
				this._pCurrentFrame = this._pNextFrame++;
			} while (time > dur);

			if (this._pCurrentFrame == lastFrame) {
				this._pCurrentFrame = 0;
				this._pNextFrame = 1;
			}

			this._pBlendWeight = (time - frameTime)/durations[this._pCurrentFrame];
		}
	}

	private notifyPlaybackComplete()
	{
		if (this._animationStatePlaybackComplete == null)
			this._animationStatePlaybackComplete = new AnimationStateEvent(AnimationStateEvent.PLAYBACK_COMPLETE, this._pAnimator, this, this._animationClipNode);

		this._animationClipNode.dispatchEvent(this._animationStatePlaybackComplete);
	}
}

export default AnimationClipState;