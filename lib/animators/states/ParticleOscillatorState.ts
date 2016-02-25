import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import Camera							= require("awayjs-display/lib/display/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import ContextGLVertexBufferFormat		= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationRegisterCache			= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import AnimationElements				= require("awayjs-renderergl/lib/animators/data/AnimationElements");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleOscillatorNode			= require("awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
import GL_RenderableBase				= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");

/**
 * ...
 */
class ParticleOscillatorState extends ParticleStateBase
{
	/** @private */
	public static OSCILLATOR_INDEX:number /*uint*/ = 0;

	private _particleOscillatorNode:ParticleOscillatorNode;
	private _oscillator:Vector3D;
	private _oscillatorData:Vector3D;

	/**
	 * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
	 */
	public get oscillator():Vector3D
	{
		return this._oscillator;
	}

	public set oscillator(value:Vector3D)
	{
		this._oscillator = value;

		this.updateOscillatorData();
	}

	constructor(animator:ParticleAnimator, particleOscillatorNode:ParticleOscillatorNode)
	{
		super(animator, particleOscillatorNode);

		this._particleOscillatorNode = particleOscillatorNode;
		this._oscillator = this._particleOscillatorNode._iOscillator;

		this.updateOscillatorData();
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleOscillatorState.OSCILLATOR_INDEX);

		if (this._particleOscillatorNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
			animationElements.activateVertexBuffer(index, this._particleOscillatorNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
		else
			animationRegisterCache.setVertexConst(index, this._oscillatorData.x, this._oscillatorData.y, this._oscillatorData.z, this._oscillatorData.w);
	}

	private updateOscillatorData()
	{
		if (this._particleOscillatorNode.mode == ParticlePropertiesMode.GLOBAL) {
			if (this._oscillator.w <= 0)
				throw(new Error("the cycle duration must greater than zero"));

			if (this._oscillatorData == null)
				this._oscillatorData = new Vector3D();

			this._oscillatorData.x = this._oscillator.x;
			this._oscillatorData.y = this._oscillator.y;
			this._oscillatorData.z = this._oscillator.z;
			this._oscillatorData.w = Math.PI*2/this._oscillator.w;
		}
	}
}

export = ParticleOscillatorState;