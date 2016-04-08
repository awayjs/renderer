import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import AnimatorBase						from "awayjs-renderergl/lib/animators/AnimatorBase";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import ParticleAnimationSet				from "awayjs-renderergl/lib/animators/ParticleAnimationSet";
import ParticlePropertiesMode			from "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode";
import ParticleNodeBase					from "awayjs-renderergl/lib/animators/nodes/ParticleNodeBase";
import ParticleBillboardState			from "awayjs-renderergl/lib/animators/states/ParticleBillboardState";
import ShaderBase						from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterElement			from "awayjs-renderergl/lib/shaders/ShaderRegisterElement";

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
	public getAGALVertexCode(shader:ShaderBase, animationRegisterCache:AnimationRegisterCache):string
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

export default ParticleBillboardNode;