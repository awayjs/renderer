///<reference path="../../_definitions.ts"/>
module away.materials
{
	//import away.arcane;
	//import away.base.StageGL;
	//import away.materials.compilation.ShaderRegisterCache;
	//import away.materials.compilation.ShaderRegisterElement;

	//import flash.geom.ColorTransform;

	//use namespace arcane;

	/**
	 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
	 * ColorTransform object.
	 */
	export class EffectColorTransformMethod extends EffectMethodBase
	{
		private _colorTransform:away.geom.ColorTransform;

		/**
		 * Creates a new EffectColorTransformMethod.
		 */
		constructor()
		{
			super();
		}

		/**
		 * The ColorTransform object to transform the colour of the material with.
		 */
		public get colorTransform():away.geom.ColorTransform
		{
			return this._colorTransform;
		}

		public set colorTransform(value:away.geom.ColorTransform)
		{
			this._colorTransform = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = "";
			var colorMultReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var colorOffsReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

			vo.fragmentConstantsIndex = colorMultReg.index*4;

			//TODO: AGAL <> GLSL

			code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			var inv:number = 1/0xff;
			var index:number = vo.fragmentConstantsIndex;
			var data:Array<number> = vo.fragmentData;

			data[index] = this._colorTransform.redMultiplier;
			data[index + 1] = this._colorTransform.greenMultiplier;
			data[index + 2] = this._colorTransform.blueMultiplier;
			data[index + 3] = this._colorTransform.alphaMultiplier;
			data[index + 4] = this._colorTransform.redOffset*inv;
			data[index + 5] = this._colorTransform.greenOffset*inv;
			data[index + 6] = this._colorTransform.blueOffset*inv;
			data[index + 7] = this._colorTransform.alphaOffset*inv;

		}
	}
}
