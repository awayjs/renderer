import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {Camera}							from "@awayjs/display/lib/display/Camera";

import {Stage}							from "@awayjs/stage/lib/base/Stage";
import {ContextGLVertexBufferFormat}		from "@awayjs/stage/lib/base/ContextGLVertexBufferFormat";

import {ParticleAnimator}					from "../../animators/ParticleAnimator";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../../animators/data/AnimationElements";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleRotationalVelocityNode}	from "../../animators/nodes/ParticleRotationalVelocityNode";
import {ParticleStateBase}				from "../../animators/states/ParticleStateBase";
import {GL_RenderableBase}				from "../../renderables/GL_RenderableBase";
import {ShaderBase}						from "../../shaders/ShaderBase";

/**
 * ...
 */
export class ParticleRotationalVelocityState extends ParticleStateBase
{
	/** @private */
	public static ROTATIONALVELOCITY_INDEX:number = 0;

	private _particleRotationalVelocityNode:ParticleRotationalVelocityNode;
	private _rotationalVelocityData:Vector3D;
	private _rotationalVelocity:Vector3D;

	/**
	 * Defines the default rotationalVelocity of the state, used when in global mode.
	 */
	public get rotationalVelocity():Vector3D
	{
		return this._rotationalVelocity;
	}

	public set rotationalVelocity(value:Vector3D)
	{
		this._rotationalVelocity = value;

		this.updateRotationalVelocityData();
	}

	/**
	 *
	 */
	public getRotationalVelocities():Array<Vector3D>
	{
		return this._pDynamicProperties;
	}

	public setRotationalVelocities(value:Array<Vector3D>):void
	{
		this._pDynamicProperties = value;

		this._pDynamicPropertiesDirty = new Object();
	}

	constructor(animator:ParticleAnimator, particleRotationNode:ParticleRotationalVelocityNode)
	{
		super(animator, particleRotationNode);

		this._particleRotationalVelocityNode = particleRotationNode;
		this._rotationalVelocity = this._particleRotationalVelocityNode._iRotationalVelocity;

		this.updateRotationalVelocityData();
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, camera:Camera, stage:Stage):void
	{
		if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
			this._pUpdateDynamicProperties(animationElements);

		var index:number = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX);

		if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
			shader.setVertexConst(index, this._rotationalVelocityData.x, this._rotationalVelocityData.y, this._rotationalVelocityData.z, this._rotationalVelocityData.w);
		else
			animationElements.activateVertexBuffer(index, this._particleRotationalVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
	}

	private updateRotationalVelocityData():void
	{
		if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.GLOBAL) {
			if (this._rotationalVelocity.w <= 0)
				throw(new Error("the cycle duration must greater than zero"));
			var rotation:Vector3D = this._rotationalVelocity.clone();

			if (rotation.length <= 0)
				rotation.z = 1; //set the default direction
			else
				rotation.normalize();
			// w is used as angle/2 in agal
			this._rotationalVelocityData = new Vector3D(rotation.x, rotation.y, rotation.z, Math.PI/rotation.w);
		}
	}
}