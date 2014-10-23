import Geometry							= require("awayjs-display/lib/base/Geometry");

import AnimatorBase						= require("awayjs-stagegl/lib/animators/AnimatorBase");

import VertexAnimator					= require("awayjs-renderergl/lib/animators/VertexAnimator");
import VertexClipNode					= require("awayjs-renderergl/lib/animators/nodes/VertexClipNode");
import AnimationClipState				= require("awayjs-renderergl/lib/animators/states/AnimationClipState");
import IVertexAnimationState			= require("awayjs-renderergl/lib/animators/states/IVertexAnimationState");

/**
 *
 */
class VertexClipState extends AnimationClipState implements IVertexAnimationState
{
	private _frames:Array<Geometry>;
	private _vertexClipNode:VertexClipNode;
	private _currentGeometry:Geometry;
	private _nextGeometry:Geometry;

	/**
	 * @inheritDoc
	 */
	public get currentGeometry():Geometry
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._currentGeometry;
	}

	/**
	 * @inheritDoc
	 */
	public get nextGeometry():Geometry
	{
		if (this._pFramesDirty)
			this._pUpdateFrames();

		return this._nextGeometry;
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
	public _pUpdateFrames()
	{
		super._pUpdateFrames();

		this._currentGeometry = this._frames[this._pCurrentFrame];

		if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
			this._nextGeometry = this._frames[0];
			(<VertexAnimator> this._pAnimator).dispatchCycleEvent();
		} else
			this._nextGeometry = this._frames[this._pNextFrame];
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdatePositionDelta()
	{
		//TODO:implement positiondelta functionality for vertex animations
	}
}

export = VertexClipState;