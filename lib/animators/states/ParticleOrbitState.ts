import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";
import {ContextGLVertexBufferFormat}		from "@awayjs/stage/lib/base/ContextGLVertexBufferFormat";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleOrbitNode}				from "../../animators/nodes/ParticleOrbitNode";
import {ParticleStateBase}				from "../../animators/states/ParticleStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

/**
 * ...
 */
export class ParticleOrbitState extends ParticleStateBase
{
	/** @private */
	public static ORBIT_INDEX:number = 0;

	/** @private */
	public static EULERS_INDEX:number = 1;

	private _particleOrbitNode:ParticleOrbitNode;
	private _usesEulers:boolean;
	private _usesCycle:boolean;
	private _usesPhase:boolean;
	private _radius:number;
	private _cycleDuration:number;
	private _cyclePhase:number;
	private _eulers:Vector3D;
	private _orbitData:Vector3D;
	private _eulersMatrix:Matrix3D;

	/**
	 * Defines the radius of the orbit when in global mode. Defaults to 100.
	 */
	public get radius():number
	{
		return this._radius;
	}

	public set radius(value:number)
	{
		this._radius = value;

		this.updateOrbitData();
	}

	/**
	 * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	 */
	public get cycleDuration():number
	{
		return this._cycleDuration;
	}

	public set cycleDuration(value:number)
	{
		this._cycleDuration = value;

		this.updateOrbitData();
	}

	/**
	 * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	 */
	public get cyclePhase():number
	{
		return this._cyclePhase;
	}

	public set cyclePhase(value:number)
	{
		this._cyclePhase = value;

		this.updateOrbitData();
	}

	/**
	 * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
	 */
	public get eulers():Vector3D
	{
		return this._eulers;
	}

	public set eulers(value:Vector3D)
	{
		this._eulers = value;

		this.updateOrbitData();

	}

	constructor(animator:ParticleAnimator, particleOrbitNode:ParticleOrbitNode)
	{
		super(animator, particleOrbitNode);

		this._particleOrbitNode = particleOrbitNode;
		this._usesEulers = this._particleOrbitNode._iUsesEulers;
		this._usesCycle = this._particleOrbitNode._iUsesCycle;
		this._usesPhase = this._particleOrbitNode._iUsesPhase;
		this._eulers = this._particleOrbitNode._iEulers;
		this._radius = this._particleOrbitNode._iRadius;
		this._cycleDuration = this._particleOrbitNode._iCycleDuration;
		this._cyclePhase = this._particleOrbitNode._iCyclePhase;
		this.updateOrbitData();
	}

	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{
		var index:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.ORBIT_INDEX);

		if (this._particleOrbitNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
			if (this._usesPhase)
				animationElements.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
			else
				animationElements.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
		} else
			shader.setVertexConst(index, this._orbitData.x, this._orbitData.y, this._orbitData.z, this._orbitData.w);

		if (this._usesEulers)
			shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.EULERS_INDEX), this._eulersMatrix);
	}

	private updateOrbitData():void
	{
		if (this._usesEulers) {
			this._eulersMatrix = new Matrix3D();
			this._eulersMatrix.appendRotation(this._eulers.x, Vector3D.X_AXIS);
			this._eulersMatrix.appendRotation(this._eulers.y, Vector3D.Y_AXIS);
			this._eulersMatrix.appendRotation(this._eulers.z, Vector3D.Z_AXIS);
		}
		if (this._particleOrbitNode.mode == ParticlePropertiesMode.GLOBAL) {
			this._orbitData = new Vector3D(this._radius, 0, this._radius*Math.PI*2, this._cyclePhase*Math.PI/180);
			if (this._usesCycle) {
				if (this._cycleDuration <= 0)
					throw(new Error("the cycle duration must be greater than zero"));
				this._orbitData.y = Math.PI*2/this._cycleDuration;
			} else
				this._orbitData.y = Math.PI*2;
		}
	}
}