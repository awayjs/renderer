import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import Camera							= require("awayjs-display/lib/entities/Camera");

import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import Stage							= require("awayjs-stagegl/lib/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/pool/RenderableBase");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticleUVNode					= require("awayjs-renderergl/lib/animators/nodes/ParticleUVNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");

/**
 * ...
 */
class ParticleUVState extends ParticleStateBase
{
	/** @private */
	public static UV_INDEX:number /*uint*/ = 0;

	private _particleUVNode:ParticleUVNode;

	constructor(animator:ParticleAnimator, particleUVNode:ParticleUVNode)
	{
		super(animator, particleUVNode);

		this._particleUVNode = particleUVNode;
	}

	public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (animationRegisterCache.needUVAnimation) {
			var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleUVState.UV_INDEX);
			var data:Vector3D = this._particleUVNode._iUvData;
			animationRegisterCache.setVertexConst(index, data.x, data.y);
		}
	}

}

export = ParticleUVState;