///<reference path="../../_definitions.ts"/>

module away.animators
{
	import ColorTransform				= away.geom.ColorTransform;
	import Vector3D						= away.geom.Vector3D;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	export class ParticleInitialColorNode extends ParticleNodeBase
	{
		/** @private */
		public static MULTIPLIER_INDEX:number /*uint*/ = 0;
		/** @private */
		public static OFFSET_INDEX:number /*uint*/ = 1;
		
		//default values used when creating states
		/** @private */
		public _iUsesMultiplier:boolean;
		/** @private */
		public _iUsesOffset:boolean;
		/** @private */
		public _iInitialColor:ColorTransform;
		
		/**
		 * Reference for color node properties on a single particle (when in local property mode).
		 * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
		 */
		public static COLOR_INITIAL_COLORTRANSFORM:string = "ColorInitialColorTransform";
		
		constructor(mode:number /*uint*/, usesMultiplier:boolean = true, usesOffset:boolean = false, initialColor:ColorTransform = null)
		{
			super("ParticleInitialColor", mode, (usesMultiplier && usesOffset)? 8 : 4, ParticleAnimationSet.COLOR_PRIORITY);

			this._pStateClass = ParticleInitialColorState;
			
			this._iUsesMultiplier = usesMultiplier;
			this._iUsesOffset = usesOffset;
			this._iInitialColor = initialColor || new ColorTransform();
		}
		
		/**
		 * @inheritDoc
		 */
		public getAGALVertexCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var code:string = "";
			if (animationRegisterCache.needFragmentAnimation) {
				
				if (this._iUsesMultiplier) {
					var multiplierValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
					animationRegisterCache.setRegisterIndex(this, ParticleInitialColorNode.MULTIPLIER_INDEX, multiplierValue.index);
					
					code += "mul " + animationRegisterCache.colorMulTarget + "," + multiplierValue + "," + animationRegisterCache.colorMulTarget + "\n";
				}
				
				if (this._iUsesOffset) {
					var offsetValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC)? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
					animationRegisterCache.setRegisterIndex(this, ParticleInitialColorNode.OFFSET_INDEX, offsetValue.index);
					
					code += "add " + animationRegisterCache.colorAddTarget + "," + offsetValue + "," + animationRegisterCache.colorAddTarget + "\n";
				}
			}
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet)
		{
			if (this._iUsesMultiplier)
				particleAnimationSet.hasColorMulNode = true;
			if (this._iUsesOffset)
				particleAnimationSet.hasColorAddNode = true;
		}
		
		/**
		 * @inheritDoc
		 */
		public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
		{
			var initialColor:ColorTransform = param[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM];
			if (!initialColor)
				throw(new Error("there is no " + ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM + " in param!"));
			
			var i:number /*uint*/;
			
			//multiplier
			if (this._iUsesMultiplier) {
				this._pOneData[i++] = initialColor.redMultiplier;
				this._pOneData[i++] = initialColor.greenMultiplier;
				this._pOneData[i++] = initialColor.blueMultiplier;
				this._pOneData[i++] = initialColor.alphaMultiplier;
			}
			//offset
			if (this._iUsesOffset) {
				this._pOneData[i++] = initialColor.redOffset/255;
				this._pOneData[i++] = initialColor.greenOffset/255;
				this._pOneData[i++] = initialColor.blueOffset/255;
				this._pOneData[i++] = initialColor.alphaOffset/255;
			}
		
		}
	
	}

}
