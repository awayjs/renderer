///<reference path="../../_definitions.ts"/>
module away.animators
{

	/**
	 *
	 */
	export class AnimationStateBase implements IAnimationState
	{
		public _pAnimationNode:away.animators.AnimationNodeBase;
        public _pRootDelta:away.geom.Vector3D = new away.geom.Vector3D();
        public _pPositionDeltaDirty:boolean = true;
		
		public _pTime:number;
		public _pStartTime:number = 0;
		public _pAnimator:away.animators.IAnimator;
		
		/**
		 * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
		 */
		public get positionDelta():away.geom.Vector3D
		{
			if (this._pPositionDeltaDirty)
            {

                this._pUpdatePositionDelta();
            }

			return this._pRootDelta;

		}
		
		constructor (animator:away.animators.IAnimator, animationNode:away.animators.AnimationNodeBase)
		{
			this._pAnimator = animator;
            this._pAnimationNode = animationNode;
		}
		
		/**
		 * Resets the start time of the node to a  new value.
		 *
		 * @param startTime The absolute start time (in milliseconds) of the node's starting time.
		 */
		public offset(startTime:number)
		{
            this._pStartTime = startTime;

            this._pPositionDeltaDirty = true;
		}
		
		/**
		 * Updates the configuration of the node to its current state.
		 *
		 * @param time The absolute time (in milliseconds) of the animator's play head position.
		 *
		 * @see away.animators.AnimatorBase#update()
		 */
		public update(time:number)
		{
			if (this._pTime == time - this._pStartTime)
            {

                return;

            }

            this._pUpdateTime(time);

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
		public _pUpdateTime(time:number)
		{
			this._pTime = time - this._pStartTime;
			
			this._pPositionDeltaDirty = true;
		}
		
		/**
		 * Updates the node's root delta position
		 */
		public _pUpdatePositionDelta()
		{
		}
	}
}
