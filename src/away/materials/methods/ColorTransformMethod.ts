///<reference path="../../_definitions.ts"/>
module away.materials
{
	//import away3d.arcane;
	//import away3d.managers.StageGLProxy;
	//import away3d.materials.compilation.ShaderRegisterCache;
	//import away3d.materials.compilation.ShaderRegisterElement;

	//import flash.geom.ColorTransform;

	//use namespace arcane;

	/**
	 * ColorTransformMethod provides a shading method that changes the colour of a material analogous to a
	 * ColorTransform object.
	 */
	export class ColorTransformMethod extends away.materials.EffectMethodBase
	{
		private _colorTransform:away.geom.ColorTransform;

		/**
		 * Creates a new ColorTransformMethod.
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
		public iGetFragmentCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			var code:string = "";
			var colorMultReg:away.materials.ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var colorOffsReg:away.materials.ShaderRegisterElement = regCache.getFreeFragmentConstant();

			vo.fragmentConstantsIndex = colorMultReg.index*4;

			//TODO: AGAL <> GLSL

			code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stageGLProxy:away.managers.StageGLProxy)
		{
			var inv:number = 1/0xff;
			var index:number = vo.fragmentConstantsIndex;
			var data:number[] = vo.fragmentData;

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
