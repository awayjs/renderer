import {Graphics} from "@awayjs/graphics";

import {VertexAnimator} from "../VertexAnimator";
import {VertexClipNode} from "../nodes/VertexClipNode";

import {AnimationClipState} from "./AnimationClipState";
import {IVertexAnimationState} from "./IVertexAnimationState";

import {AnimatorBase} from "../AnimatorBase";

/**
 *
 */
export class VertexClipState extends AnimationClipState implements IVertexAnimationState
{
	private _frames:Array<Graphics>;
	private _vertexClipNode:VertexClipNode;
	private _currentGraphics:Graphics;
	private _nextGraphics:Graphics;

	/**
	 * @inheritDoc
	 */
	public get currentGraphics():Graphics
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._currentGraphics;
	}

	/**
	 * @inheritDoc
	 */
	public get nextGraphics():Graphics
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._nextGraphics;
	}

	constructor(animator:AnimatorBase, vertexClipNode:VertexClipNode)
	{
		super(animator, vertexClipNode);

		this._vertexClipNode = vertexClipNode;
		this._frames = this._vertexClipNode.frames;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateFrames():void
	{
		super._pUpdateFrames();

		this._currentGraphics = this._frames[this._pCurrentFrame];

		if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
			this._nextGraphics = this._frames[0];
			(<VertexAnimator> this._pAnimator).dispatchCycleEvent();
		} else
			this._nextGraphics = this._frames[this._pNextFrame];
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdatePositionDelta():void
	{
		//TODO:implement positiondelta functionality for vertex animations
	}
}