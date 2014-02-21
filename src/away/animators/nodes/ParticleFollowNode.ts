///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Vector3D						= away.geom.Vector3D;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	/**
	 * A particle animation node used to create a follow behaviour on a particle system.
	 */
	export class ParticleFollowNode extends ParticleNodeBase
	{
		/** @private */
		public static FOLLOW_POSITION_INDEX:number /*uint*/ = 0;
		
		/** @private */
		public static FOLLOW_ROTATION_INDEX:number /*uint*/ = 1;
		
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
		public getAGALVertexCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache):string
		{
			//TODO: use Quaternion to implement this function
			var code:string = "";
			if (this._iUsesRotation) {
				var rotationAttribute:ShaderRegisterElement = animationRegisterCache.getFreeVertexAttribute();
				animationRegisterCache.setRegisterIndex(this, ParticleFollowNode.FOLLOW_ROTATION_INDEX, rotationAttribute.index);
				
				var temp1:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(temp1, 1);
				var temp2:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(temp2, 1);
				var temp3:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				
				var temp4:ShaderRegisterElement;
				if (animationRegisterCache.hasBillboard) {
					animationRegisterCache.addVertexTempUsages(temp3, 1);
					temp4 = animationRegisterCache.getFreeVertexVectorTemp();
				}
				
				animationRegisterCache.removeVertexTempUsage(temp1);
				animationRegisterCache.removeVertexTempUsage(temp2);
				if (animationRegisterCache.hasBillboard)
					animationRegisterCache.removeVertexTempUsage(temp3);
				
				var len:number /*int*/ = animationRegisterCache.rotationRegisters.length;
				var i:number /*int*/;
				
				//x axis
				code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp1 + ".x," + animationRegisterCache.vertexOneConst + "\n";
				code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "sin " + temp3 + ".y," + rotationAttribute + ".x\n";
				code += "cos " + temp3 + ".z," + rotationAttribute + ".x\n";
				code += "mov " + temp2 + ".x," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp2 + ".y," + temp3 + ".z\n";
				code += "neg " + temp2 + ".z," + temp3 + ".y\n";
				
				if (animationRegisterCache.hasBillboard)
					code += "m33 " + temp4 + ".xyz," + animationRegisterCache.positionTarget + ".xyz," + temp1 + "\n";
				else {
					code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
					for (i = 0; i < len; i++)
						code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
				}
				
				//y axis
				code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "cos " + temp1 + ".x," + rotationAttribute + ".y\n";
				code += "sin " + temp1 + ".z," + rotationAttribute + ".y\n";
				code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp2 + ".y," + animationRegisterCache.vertexOneConst + "\n";
				code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "neg " + temp3 + ".x," + temp1 + ".z\n";
				code += "mov " + temp3 + ".z," + temp1 + ".x\n";
				
				if (animationRegisterCache.hasBillboard)
					code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
				else {
					code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
					for (i = 0; i < len; i++)
						code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
				}
				
				//z axis
				code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "sin " + temp2 + ".x," + rotationAttribute + ".z\n";
				code += "cos " + temp2 + ".y," + rotationAttribute + ".z\n";
				code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp1 + ".x," + temp2 + ".y\n";
				code += "neg " + temp1 + ".y," + temp2 + ".x\n";
				code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
				
				if (animationRegisterCache.hasBillboard) {
					code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
					code += "sub " + temp4 + ".xyz," + temp4 + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
					code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp4 + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
				} else {
					code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
					for (i = 0; i < len; i++)
						code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
				}
				
			}
			
			if (this._iUsesPosition) {
				var positionAttribute:ShaderRegisterElement = animationRegisterCache.getFreeVertexAttribute();
				animationRegisterCache.setRegisterIndex(this, ParticleFollowNode.FOLLOW_POSITION_INDEX, positionAttribute.index);
				code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + positionAttribute + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
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

}
