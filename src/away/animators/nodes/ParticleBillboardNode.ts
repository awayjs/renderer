///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Vector3D						= away.geom.Vector3D;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	/**
	 * A particle animation node that controls the rotation of a particle to always face the camera.
	 */
	export class ParticleBillboardNode extends ParticleNodeBase
	{
		/** @private */
		public static MATRIX_INDEX:number /*int*/ = 0;
		
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
		public getAGALVertexCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var rotationMatrixRegister:ShaderRegisterElement = animationRegisterCache.getFreeVertexConstant();
			animationRegisterCache.setRegisterIndex(this, ParticleBillboardNode.MATRIX_INDEX, rotationMatrixRegister.index);
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
}
