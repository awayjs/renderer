import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleBillboardState}			from "../../animators/states/ParticleBillboardState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node that controls the rotation of a particle to always face the camera.
 */
export class ParticleBillboardNode extends ParticleNodeBase
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
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var rotationMatrixRegister:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		animationRegisterData.setRegisterIndex(this, ParticleBillboardState.MATRIX_INDEX, rotationMatrixRegister.index);
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

		var code:string = "m33 " + temp + ".xyz," + animationRegisterData.scaleAndRotateTarget + "," + rotationMatrixRegister + "\n" +
						  "mov " + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";

		var shaderRegisterElement:ShaderRegisterElement;
		for (var i:number = 0; i < animationRegisterData.rotationRegisters.length; i++) {
			shaderRegisterElement = animationRegisterData.rotationRegisters[i];
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
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet):void
	{
		particleAnimationSet.hasBillboard = true;
	}
}