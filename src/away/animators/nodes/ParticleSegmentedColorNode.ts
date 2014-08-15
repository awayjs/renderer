///<reference path="../../_definitions.ts"/>

module away.animators
{
	import ColorTransform				= away.geom.ColorTransform;
	import Vector3D						= away.geom.Vector3D;
	import ShaderObjectBase				= away.materials.ShaderObjectBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	export class ParticleSegmentedColorNode extends ParticleNodeBase
	{
		/** @private */
		public static START_MULTIPLIER_INDEX:number /*uint*/ = 0;
		
		/** @private */
		public static START_OFFSET_INDEX:number /*uint*/ = 1;
		
		/** @private */
		public static TIME_DATA_INDEX:number /*uint*/ = 2;
		
		/** @private */
		public _iUsesMultiplier:boolean;
		/** @private */
		public _iUsesOffset:boolean;
		/** @private */
		public _iStartColor:ColorTransform;
		/** @private */
		public _iEndColor:ColorTransform;
		/** @private */
		public _iNumSegmentPoint:number /*int*/;
		/** @private */
		public _iSegmentPoints:Array<ColorSegmentPoint>;
		
		constructor(usesMultiplier:boolean, usesOffset:boolean, numSegmentPoint:number /*int*/, startColor:ColorTransform, endColor:ColorTransform, segmentPoints:Array<ColorSegmentPoint>)
		{
			//because of the stage3d register limitation, it only support the global mode
			super("ParticleSegmentedColor", ParticlePropertiesMode.GLOBAL, 0, ParticleAnimationSet.COLOR_PRIORITY);

			this._pStateClass = ParticleSegmentedColorState;

			if (numSegmentPoint > 4)
				throw(new Error("the numSegmentPoint must be less or equal 4"));
			this._iUsesMultiplier = usesMultiplier;
			this._iUsesOffset = usesOffset;
			this._iNumSegmentPoint = numSegmentPoint;
			this._iStartColor = startColor;
			this._iEndColor = endColor;
			this._iSegmentPoints = segmentPoints;
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
		public getAGALVertexCode(shaderObject:ShaderObjectBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var code:string = "";
			if (animationRegisterCache.needFragmentAnimation) {
				var accMultiplierColor:ShaderRegisterElement;
				//var accOffsetColor:ShaderRegisterElement;
				if (this._iUsesMultiplier) {
					accMultiplierColor = animationRegisterCache.getFreeVertexVectorTemp();
					animationRegisterCache.addVertexTempUsages(accMultiplierColor, 1);
				}
				
				var tempColor:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(tempColor, 1);
				
				var temp:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				var accTime:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
				var tempTime:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);
				
				if (this._iUsesMultiplier)
					animationRegisterCache.removeVertexTempUsage(accMultiplierColor);
				
				animationRegisterCache.removeVertexTempUsage(tempColor);
				
				//for saving all the life values (at most 4)
				var lifeTimeRegister:ShaderRegisterElement = animationRegisterCache.getFreeVertexConstant();
				animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorNode.TIME_DATA_INDEX, lifeTimeRegister.index);
				
				var i:number /*int*/;
				
				var startMulValue:ShaderRegisterElement;
				var deltaMulValues:Array<ShaderRegisterElement>;
				if (this._iUsesMultiplier) {
					startMulValue = animationRegisterCache.getFreeVertexConstant();
					animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorNode.START_MULTIPLIER_INDEX, startMulValue.index);
					deltaMulValues = new Array<ShaderRegisterElement>();
					for (i = 0; i < this._iNumSegmentPoint + 1; i++)
						deltaMulValues.push(animationRegisterCache.getFreeVertexConstant());
				}
				
				var startOffsetValue:ShaderRegisterElement;
				var deltaOffsetValues:Array<ShaderRegisterElement>;
				if (this._iUsesOffset) {
					startOffsetValue = animationRegisterCache.getFreeVertexConstant();
					animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorNode.START_OFFSET_INDEX, startOffsetValue.index);
					deltaOffsetValues = new Array<ShaderRegisterElement>();
					for (i = 0; i < this._iNumSegmentPoint + 1; i++)
						deltaOffsetValues.push(animationRegisterCache.getFreeVertexConstant());
				}
				
				if (this._iUsesMultiplier)
					code += "mov " + accMultiplierColor + "," + startMulValue + "\n";
				if (this._iUsesOffset)
					code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + startOffsetValue + "\n";
				
				for (i = 0; i < this._iNumSegmentPoint; i++) {
					switch (i) {
						case 0:
							code += "min " + tempTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
							break;
						case 1:
							code += "sub " + accTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
							code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
							code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".y\n";
							break;
						case 2:
							code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
							code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
							code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".z\n";
							break;
						case 3:
							code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
							code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
							code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".w\n";
							break;
					}
					if (this._iUsesMultiplier) {
						code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[i] + "\n";
						code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
					}
					if (this._iUsesOffset) {
						code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[i] + "\n";
						code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + tempColor + "\n";
					}
				}
				
				//for the last segment:
				if (this._iNumSegmentPoint == 0)
					tempTime = animationRegisterCache.vertexLife;
				else {
					switch (this._iNumSegmentPoint) {
						case 1:
							code += "sub " + accTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
							break;
						case 2:
							code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
							break;
						case 3:
							code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
							break;
						case 4:
							code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".w\n";
							break;
					}
					code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
				}
				if (this._iUsesMultiplier) {
					code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[this._iNumSegmentPoint] + "\n";
					code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
					code += "mul " + animationRegisterCache.colorMulTarget + "," + animationRegisterCache.colorMulTarget + "," + accMultiplierColor + "\n";
				}
				if (this._iUsesOffset) {
					code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[this._iNumSegmentPoint] + "\n";
					code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + tempColor + "\n";
				}
				
			}
			return code;
		}
	
	}

}
