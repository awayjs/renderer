import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleFollowState}				from "../../animators/states/ParticleFollowState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to create a follow behaviour on a particle system.
 */
export class ParticleFollowNode extends ParticleNodeBase
{
	/** @private */
	public _iUsesPosition:boolean;

	/** @private */
	public _iUsesRotation:boolean;

	/** @private */
	public _iSmooth:boolean;

	/**
	 * Creates a new <code>ParticleFollowNode</code>
	 *
	 * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
	 * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
	 * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
	 */
	constructor(usesPosition:boolean = true, usesRotation:boolean = true, smooth:boolean = false)
	{
		super("ParticleFollow", ParticlePropertiesMode.LOCAL_DYNAMIC, (usesPosition && usesRotation)? 6 : 3, ParticleAnimationSet.POST_PRIORITY);

		this._pStateClass = ParticleFollowState;

		this._iUsesPosition = usesPosition;
		this._iUsesRotation = usesRotation;
		this._iSmooth = smooth;

	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		//TODO: use Quaternion to implement this function
		var code:string = "";
		if (this._iUsesRotation) {
			var rotationAttribute:ShaderRegisterElement = registerCache.getFreeVertexAttribute();
			animationRegisterData.setRegisterIndex(this, ParticleFollowState.FOLLOW_ROTATION_INDEX, rotationAttribute.index);

			var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp1, 1);
			var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp2, 1);
			var temp3:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

			var temp4:ShaderRegisterElement;
			if (animationSet.hasBillboard) {
				registerCache.addVertexTempUsages(temp3, 1);
				temp4 = registerCache.getFreeVertexVectorTemp();
			}

			registerCache.removeVertexTempUsage(temp1);
			registerCache.removeVertexTempUsage(temp2);
			if (animationSet.hasBillboard)
				registerCache.removeVertexTempUsage(temp3);

			var len:number = animationRegisterData.rotationRegisters.length;
			var i:number;

			//x axis
			code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp1 + ".x," + animationRegisterData.vertexOneConst + "\n";
			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "sin " + temp3 + ".y," + rotationAttribute + ".x\n";
			code += "cos " + temp3 + ".z," + rotationAttribute + ".x\n";
			code += "mov " + temp2 + ".x," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp2 + ".y," + temp3 + ".z\n";
			code += "neg " + temp2 + ".z," + temp3 + ".y\n";

			if (animationSet.hasBillboard)
				code += "m33 " + temp4 + ".xyz," + animationRegisterData.positionTarget + ".xyz," + temp1 + "\n";
			else {
				code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
				for (i = 0; i < len; i++)
					code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
			}

			//y axis
			code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "cos " + temp1 + ".x," + rotationAttribute + ".y\n";
			code += "sin " + temp1 + ".z," + rotationAttribute + ".y\n";
			code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp2 + ".y," + animationRegisterData.vertexOneConst + "\n";
			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "neg " + temp3 + ".x," + temp1 + ".z\n";
			code += "mov " + temp3 + ".z," + temp1 + ".x\n";

			if (animationSet.hasBillboard)
				code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
			else {
				code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
				for (i = 0; i < len; i++)
					code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
			}

			//z axis
			code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "sin " + temp2 + ".x," + rotationAttribute + ".z\n";
			code += "cos " + temp2 + ".y," + rotationAttribute + ".z\n";
			code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp1 + ".x," + temp2 + ".y\n";
			code += "neg " + temp1 + ".y," + temp2 + ".x\n";
			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";

			if (animationSet.hasBillboard) {
				code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
				code += "sub " + temp4 + ".xyz," + temp4 + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
				code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp4 + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
			} else {
				code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
				for (i = 0; i < len; i++)
					code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
			}

		}

		if (this._iUsesPosition) {
			var positionAttribute:ShaderRegisterElement = registerCache.getFreeVertexAttribute();
			animationRegisterData.setRegisterIndex(this, ParticleFollowState.FOLLOW_POSITION_INDEX, positionAttribute.index);
			code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + positionAttribute + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleFollowState
	{
		return <ParticleFollowState> animator.getAnimationState(this);
	}
}