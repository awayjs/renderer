///<reference path="../_definitions.ts"/>

module away.animators
{
	import TriangleSubGeometry				= away.base.TriangleSubGeometry;
	import Stage							= away.base.Stage;
	import Camera							= away.entities.Camera;
	import Mesh								= away.entities.Mesh;
	import AbstractMethodError				= away.errors.AbstractMethodError;
	import AnimatorEvent					= away.events.AnimatorEvent;
	import AssetType						= away.library.AssetType;
	import IMaterialPass					= away.materials.IMaterialPass;
	import RenderableBase					= away.pool.RenderableBase;

	/**
	 * Dispatched when playback of an animation inside the animator object starts.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	//[Event(name="start", type="away3d.events.AnimatorEvent")]

	/**
	 * Dispatched when playback of an animation inside the animator object stops.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	//[Event(name="stop", type="away3d.events.AnimatorEvent")]

	/**
	 * Dispatched when playback of an animation reaches the end of an animation.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	//[Event(name="cycle_complete", type="away3d.events.AnimatorEvent")]

	/**
	 * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
	 *
	 * @see away.animators.AnimationSetBase
	 */
	export class AnimatorBase extends away.library.NamedAssetBase implements IAnimator
	{
		private _broadcaster:away.utils.RequestAnimationFrame;
		private _isPlaying:boolean;
		private _autoUpdate:boolean = true;
		private _startEvent:AnimatorEvent;
		private _stopEvent:AnimatorEvent;
		private _cycleEvent:AnimatorEvent;
		private _time:number /*int*/ = 0;
		private _playbackSpeed:number = 1;

		public _pAnimationSet:IAnimationSet;
		public _pOwners:Array<away.entities.Mesh> = new Array<Mesh>();
		public _pActiveNode:AnimationNodeBase;
		public _pActiveState:IAnimationState;
		public _pActiveAnimationName:string;
		public _pAbsoluteTime:number = 0;

		private _animationStates:Object = new Object();

		/**
		 * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
		 *
		 * @see away.animators.IAnimationState#positionDelta
		 */
		public updatePosition:boolean = true;

		public getAnimationState(node:AnimationNodeBase):IAnimationState
		{
			var className:any = node.stateClass;
			var uID:number = node.id;

			if (this._animationStates[uID] == null)
				this._animationStates[uID] = new className(this, node);

			return this._animationStates[uID];
		}

		public getAnimationStateByName(name:string):IAnimationState
		{
			return this.getAnimationState(this._pAnimationSet.getAnimation(name));
		}

		/**
		 * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
		 *
		 * @see #time
		 * @see #playbackSpeed
		 */
		public get absoluteTime():number
		{
			return this._pAbsoluteTime;
		}

		/**
		 * Returns the animation data set in use by the animator.
		 */
		public get animationSet():IAnimationSet
		{
			return this._pAnimationSet;
		}

		/**
		 * Returns the current active animation state.
		 */
		public get activeState():IAnimationState
		{
			return this._pActiveState;
		}

		/**
		 * Returns the current active animation node.
		 */
		public get activeAnimation():AnimationNodeBase
		{
			return this._pAnimationSet.getAnimation(this._pActiveAnimationName);
		}

		/**
		 * Returns the current active animation node.
		 */
		public get activeAnimationName():string
		{
			return this._pActiveAnimationName;
		}

		/**
		 * Determines whether the animators internal update mechanisms are active. Used in cases
		 * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
		 * Defaults to true.
		 *
		 * @see #time
		 * @see #update()
		 */
		public get autoUpdate():boolean
		{
			return this._autoUpdate;
		}

		public set autoUpdate(value:boolean)
		{
			if (this._autoUpdate == value)
				return;

			this._autoUpdate = value;

			if (this._autoUpdate)
				this.start(); else
				this.stop();
		}

		/**
		 * Gets and sets the internal time clock of the animator.
		 */
		public get time():number /*int*/
		{
			return this._time;
		}

		public set time(value:number /*int*/)
		{
			if (this._time == value)
				return;

			this.update(value);
		}

		/**
		 * Sets the animation phase of the current active state's animation clip(s).
		 *
		 * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
		 */
		public phase(value:number)
		{
			this._pActiveState.phase(value);
		}

		/**
		 * Creates a new <code>AnimatorBase</code> object.
		 *
		 * @param animationSet The animation data set to be used by the animator object.
		 */
		constructor(animationSet:IAnimationSet)
		{
			super();

			this._pAnimationSet = animationSet;

			this._broadcaster = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
		}

		/**
		 * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
		 */
		public get playbackSpeed():number
		{
			return this._playbackSpeed;
		}

		public set playbackSpeed(value:number)
		{
			this._playbackSpeed = value;
		}

		public setRenderState(stage:Stage, renderable:RenderableBase, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/, camera:Camera)
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Resumes the automatic playback clock controling the active state of the animator.
		 */
		public start()
		{
			if (this._isPlaying || !this._autoUpdate)
				return;

			this._time = this._pAbsoluteTime = away.utils.getTimer();

			this._isPlaying = true;

			this._broadcaster.start();

			if (!this.hasEventListener(AnimatorEvent.START))
				return;

			if (this._startEvent == null)
				this._startEvent = new AnimatorEvent(AnimatorEvent.START, this);

			this.dispatchEvent(this._startEvent);
		}

		/**
		 * Pauses the automatic playback clock of the animator, in case manual updates are required via the
		 * <code>time</code> property or <code>update()</code> method.
		 *
		 * @see #time
		 * @see #update()
		 */
		public stop()
		{
			if (!this._isPlaying)
				return;

			this._isPlaying = false;

			this._broadcaster.stop();

			if (!this.hasEventListener(AnimatorEvent.STOP))
				return;

			if (this._stopEvent == null)
				this._stopEvent = new AnimatorEvent(AnimatorEvent.STOP, this);

			this.dispatchEvent(this._stopEvent);
		}

		/**
		 * Provides a way to manually update the active state of the animator when automatic
		 * updates are disabled.
		 *
		 * @see #stop()
		 * @see #autoUpdate
		 */
		public update(time:number /*int*/)
		{
			var dt:number = (time - this._time)*this.playbackSpeed;

			this._pUpdateDeltaTime(dt);

			this._time = time;
		}

		public reset(name:string, offset:number = 0)
		{
			this.getAnimationState(this._pAnimationSet.getAnimation(name)).offset(offset + this._pAbsoluteTime);
		}

		/**
		 * Used by the mesh object to which the animator is applied, registers the owner for internal use.
		 *
		 * @private
		 */
		public addOwner(mesh:Mesh)
		{
			this._pOwners.push(mesh);
		}

		/**
		 * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
		 *
		 * @private
		 */
		public removeOwner(mesh:Mesh)
		{
			this._pOwners.splice(this._pOwners.indexOf(mesh), 1);
		}

		/**
		 * Internal abstract method called when the time delta property of the animator's contents requires updating.
		 *
		 * @private
		 */
		public _pUpdateDeltaTime(dt:number)
		{
			this._pAbsoluteTime += dt;

			this._pActiveState.update(this._pAbsoluteTime);

			if (this.updatePosition)
				this.applyPositionDelta();
		}

		/**
		 * Enter frame event handler for automatically updating the active state of the animator.
		 */
		private onEnterFrame(event:Event = null)
		{
			this.update(away.utils.getTimer());
		}

		private applyPositionDelta()
		{
			var delta:away.geom.Vector3D = this._pActiveState.positionDelta;
			var dist:number = delta.length;
			var len:number /*uint*/;
			if (dist > 0) {
				len = this._pOwners.length;
				for (var i:number /*uint*/ = 0; i < len; ++i)
					this._pOwners[i].translateLocal(delta, dist);
			}
		}

		/**
		 *  for internal use.
		 *
		 * @private
		 */
		public dispatchCycleEvent()
		{
			if (this.hasEventListener(AnimatorEvent.CYCLE_COMPLETE)) {
				if (this._cycleEvent == null)
					this._cycleEvent = new AnimatorEvent(AnimatorEvent.CYCLE_COMPLETE, this);

				this.dispatchEvent(this._cycleEvent);
			}
		}

		/**
		 * @inheritDoc
		 */
		public clone():AnimatorBase
		{
			throw new AbstractMethodError();
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
		}

		/**
		 * @inheritDoc
		 */
		public testGPUCompatibility(pass:IMaterialPass)
		{
			throw new AbstractMethodError();
		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return AssetType.ANIMATOR;
		}


		public getRenderableSubGeometry(renderable:away.pool.TriangleSubMeshRenderable, sourceSubGeometry:TriangleSubGeometry):TriangleSubGeometry
		{
			//nothing to do here
			return sourceSubGeometry;
		}
	}
}
