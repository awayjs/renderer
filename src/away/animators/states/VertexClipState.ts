///<reference path="../../_definitions.ts"/>

module away.animators
{
	/**
	 *
	 */
	export class VertexClipState extends AnimationClipState implements IVertexAnimationState
	{
		private _frames:Array<away.base.Geometry>;
		private _vertexClipNode:VertexClipNode;
		private _currentGeometry:away.base.Geometry;
		private _nextGeometry:away.base.Geometry;

		/**
		 * @inheritDoc
		 */
		public get currentGeometry():away.base.Geometry
		{
			if (this._pFramesDirty)
				this._pUpdateFrames();

			return this._currentGeometry;
		}

		/**
		 * @inheritDoc
		 */
		public get nextGeometry():away.base.Geometry
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
}
