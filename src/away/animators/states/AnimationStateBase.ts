///<reference path="../../_definitions.ts"/>
module away.animators
{

	/**
	 *
	 */
	export class AnimationStateBase //implements away.animators.IAnimationState // TODO: imeplement
	{
		private _animationNode:away.animators.AnimationNodeBase;
		private _rootDelta:away.geom.Vector3D = new away.geom.Vector3D();
		private _positionDeltaDirty:boolean = true;
		
		private _time:number;
		private _startTime:number;
		private _animator:away.animators.IAnimator;
		
		/**
		 * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
		 */
		public get positionDelta():away.geom.Vector3D
		{
			if (this._positionDeltaDirty)
            {

                this.pUpdatePositionDelta();
            }

			return this._rootDelta;

		}
		
		constructor (animator:away.animators.IAnimator, animationNode:away.animators.AnimationNodeBase)
		{
			this._animator = animator;
            this._animationNode = animationNode;
		}
		
		/**
		 * Resets the start time of the node to a  new value.
		 *
		 * @param startTime The absolute start time (in milliseconds) of the node's starting time.
		 */
		public offset(startTime:number)
		{
            this._startTime = startTime;

            this._positionDeltaDirty = true;
		}
		
		/**
		 * Updates the configuration of the node to its current state.
		 *
		 * @param time The absolute time (in milliseconds) of the animator's play head position.
		 *
		 * @see away3d.animators.AnimatorBase#update()
		 */
		public update(time:number)
		{
			if (this._time == time - this._startTime)
            {

                return;

            }

            this.pUpdateTime(time);

		}
		
		/**
		 * Sets the animation phase of the node.
		 *
		 * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
		 */
		public phase(value:number)
		{

		}
		
		/**
		 * Updates the node's internal playhead position.
		 *
		 * @param time The local time (in milliseconds) of the node's playhead position.
		 */
		public pUpdateTime(time:number)
		{
			this._time = time - this._startTime;
			
			this._positionDeltaDirty = true;
		}
		
		/**
		 * Updates the node's root delta position
		 */
		public pUpdatePositionDelta()
		{
		}
	}
}
