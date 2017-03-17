import {Vector3D, ColorTransform} from "@awayjs/core";

import {ProjectionBase} from "@awayjs/core";

import {Stage, ContextGLVertexBufferFormat} from "@awayjs/stage";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {ShaderBase} from "../../shaders/ShaderBase";

import {AnimationRegisterData} from "../data/AnimationRegisterData";
import {AnimationElements} from "../data/AnimationElements";
import {ParticlePropertiesMode} from "../data/ParticlePropertiesMode";
import {ParticleInitialColorNode} from "../nodes/ParticleInitialColorNode";

import {ParticleAnimator} from "../ParticleAnimator";

import {ParticleStateBase} from "./ParticleStateBase";

/**
*
*/
export class ParticleInitialColorState extends ParticleStateBase
{
	/** @private */
	public static MULTIPLIER_INDEX:number = 0;
	/** @private */
	public static OFFSET_INDEX:number = 1;

	private _particleInitialColorNode:ParticleInitialColorNode;
	private _usesMultiplier:boolean;
	private _usesOffset:boolean;
	private _initialColor:ColorTransform;
	private _multiplierData:Vector3D;
	private _offsetData:Vector3D;

	constructor(animator:ParticleAnimator, particleInitialColorNode:ParticleInitialColorNode)
	{
		super(animator, particleInitialColorNode);

		this._particleInitialColorNode = particleInitialColorNode;
		this._usesMultiplier = particleInitialColorNode._iUsesMultiplier;
		this._usesOffset = particleInitialColorNode._iUsesOffset;
		this._initialColor = particleInitialColorNode._iInitialColor;

		this.updateColorData();
	}

	/**
	 * Defines the initial color transform of the state, when in global mode.
	 */
	public get initialColor():ColorTransform
	{
		return this._initialColor;
	}

	public set initialColor(value:ColorTransform)
	{
		this._initialColor = value;
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterData:AnimationRegisterData, projection:ProjectionBase, stage:Stage):void
	{
		if (shader.usesFragmentAnimation) {
			var index:number;
			if (this._particleInitialColorNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
				var dataOffset:number = this._particleInitialColorNode._iDataOffset;
				if (this._usesMultiplier) {
					animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
					dataOffset += 4;
				}
				if (this._usesOffset)
					animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
			} else {
				if (this._usesMultiplier)
					shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), this._multiplierData.x, this._multiplierData.y, this._multiplierData.z, this._multiplierData.w);
				if (this._usesOffset)
					shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), this._offsetData.x, this._offsetData.y, this._offsetData.z, this._offsetData.w);
			}
		}
	}

	private updateColorData():void
	{
		if (this._particleInitialColorNode.mode == ParticlePropertiesMode.GLOBAL) {
			if (this._usesMultiplier)
				this._multiplierData = new Vector3D(this._initialColor.redMultiplier, this._initialColor.greenMultiplier, this._initialColor.blueMultiplier, this._initialColor.alphaMultiplier);
			if (this._usesOffset)
				this._offsetData = new Vector3D(this._initialColor.redOffset/255, this._initialColor.greenOffset/255, this._initialColor.blueOffset/255, this._initialColor.alphaOffset/255);
		}
	}

}