import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import NamedAssetBase				= require("awayjs-core/lib/library/NamedAssetBase");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import getTimer						= require("awayjs-core/lib/utils/getTimer");

import IAnimationSet				= require("awayjs-display/lib/animators/IAnimationSet");
import IAnimator					= require("awayjs-display/lib/animators/IAnimator");
import AnimationNodeBase			= require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
import TriangleSubGeometry			= require("awayjs-core/lib/data/TriangleSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");
import Mesh							= require("awayjs-display/lib/entities/Mesh");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IAnimationState				= require("awayjs-renderergl/lib/animators/states/IAnimationState");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
import AnimatorEvent				= require("awayjs-renderergl/lib/events/AnimatorEvent");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");

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
class AnimatorBase extends NamedAssetBase implements IAnimator
{
	private _broadcaster:RequestAnimationFrame;
	private _isPlaying:boolean;
	private _autoUpdate:boolean = true;
	private _startEvent:AnimatorEvent;
	private _stopEvent:AnimatorEvent;
	private _cycleEvent:AnimatorEvent;
	private _time:number /*int*/ = 0;
	private _playbackSpeed:number = 1;

	public _pAnimationSet:IAnimationSet;
	public _pOwners:Array<Mesh> = new Array<Mesh>();
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

		this._broadcaster = new RequestAnimationFrame(this.onEnterFrame, this);
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

	public setRenderState(shaderObject:ShaderObjectBase, renderable:RenderableBase, stage:Stage, camera:Camera, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		throw new AbstractMethodError();
	}

	/**
	 * Resumes the automatic playback clock controling the active state of the animator.
	 */
	public start()
	{
		if (this._isPlaying || !this._autoUpdate)
			return;

		this._time = this._pAbsoluteTime = getTimer();

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
		this.update(getTimer());
	}

	private applyPositionDelta()
	{
		var delta:Vector3D = this._pActiveState.positionDelta;
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
	public testGPUCompatibility(shaderObject:ShaderObjectBase)
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


	public getRenderableSubGeometry(renderable:TriangleSubMeshRenderable, sourceSubGeometry:TriangleSubGeometry):TriangleSubGeometry
	{
		//nothing to do here
		return sourceSubGeometry;
	}
}

export = AnimatorBase;