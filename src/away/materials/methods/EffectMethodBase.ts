///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
	 * and are in essence post-process effects on the materials.
	 */
	export class EffectMethodBase extends ShadingMethodBase implements away.library.IAsset
	{
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return away.library.AssetType.EFFECTS_METHOD;
		}

		/**
		 * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
		 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
		 * @param regCache The register cache used during the compilation.
		 * @param targetReg The register that will be containing the method's output.
		 * @private
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			throw new away.errors.AbstractMethodError();
			return "";
		}
	}
}
