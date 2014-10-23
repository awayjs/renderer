import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import AnimatorBase						= require("awayjs-stagegl/lib/animators/AnimatorBase");
import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");

import ParticleAnimationSet				= require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
import ParticleProperties				= require("awayjs-renderergl/lib/animators/data/ParticleProperties");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleNodeBase					= require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
import ParticleBillboardState			= require("awayjs-renderergl/lib/animators/states/ParticleBillboardState");

/**
 * A particle animation node that controls the rotation of a particle to always face the camera.
 */
class ParticleBillboardNode extends ParticleNodeBase
{
	/** @private */
	public _iBillboardAxis:Vector3D;

	/**
	 * Creates a new <code>ParticleBillboardNode</code>
	 */
	constructor(billboardAxis:Vector3D = null)
	{
		super("ParticleBillboard", ParticlePropertiesMode.GLOBAL, 0, 4);

		this._pStateClass = ParticleBillboardState;

		this._iBillboardAxis = billboardAxis;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shaderObject:ShaderObjectBase, animationRegisterCache:AnimationRegisterCache):string
	{
		var rotationMatrixRegister:ShaderRegisterElement = animationRegisterCache.getFreeVertexConstant();
		animationRegisterCache.setRegisterIndex(this, ParticleBillboardState.MATRIX_INDEX, rotationMatrixRegister.index);
		animationRegisterCache.getFreeVertexConstant();
		animationRegisterCache.getFreeVertexConstant();
		animationRegisterCache.getFreeVertexConstant();

		var temp:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();

		var code:string = "m33 " + temp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + "," + rotationMatrixRegister + "\n" +
						  "mov " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";

		var shaderRegisterElement:ShaderRegisterElement;
		for (var i:number /*uint*/ = 0; i < animationRegisterCache.rotationRegisters.length; i++) {
			shaderRegisterElement = animationRegisterCache.rotationRegisters[i];
			code += "m33 " + temp + ".xyz," + shaderRegisterElement + "," + rotationMatrixRegister + "\n" +
					"mov " + shaderRegisterElement + ".xyz," + shaderRegisterElement + "\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleBillboardState
	{
		return <ParticleBillboardState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet)
	{
		particleAnimationSet.hasBillboard = true;
	}
}

export = ParticleBillboardNode;