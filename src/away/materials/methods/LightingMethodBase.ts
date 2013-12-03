///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.arcane;
	//import away3d.materials.compilation.ShaderRegisterCache;
	//import away3d.materials.compilation.ShaderRegisterElement;

	//use namespace arcane;

	/**
	 * LightingMethodBase provides an abstract base method for shading methods that uses lights.
	 * Used for diffuse and specular shaders only.
	 */
	export class LightingMethodBase extends away.materials.ShadingMethodBase
	{
		/**
		 * A method that is exposed to wrappers in case the strength needs to be controlled
		 */
		public _iModulateMethod;
		public _iModulateMethodScope:Object;

		/**
		 * Creates a new LightingMethodBase.
		 */
		constructor()
		{
			super();
		}

		/**
		 * Get the fragment shader code that will be needed before any per-light code is added.
		 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
		 * @param regCache The register cache used during the compilation.
		 * @private
		 */
		public iGetFragmentPreLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			return "";
		}

		/**
		 * Get the fragment shader code that will generate the code relevant to a single light.
		 *
		 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
		 * @param lightDirReg The register containing the light direction vector.
		 * @param lightColReg The register containing the light colour.
		 * @param regCache The register cache used during the compilation.
		 */
		public iGetFragmentCodePerLight(vo:away.materials.MethodVO, lightDirReg:away.materials.ShaderRegisterElement, lightColReg:away.materials.ShaderRegisterElement, regCache:away.materials.ShaderRegisterCache):string
		{
			return "";
		}

		/**
		 * Get the fragment shader code that will generate the code relevant to a single light probe object.
		 *
		 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
		 * @param cubeMapReg The register containing the cube map for the current probe
		 * @param weightRegister A string representation of the register + component containing the current weight
		 * @param regCache The register cache providing any necessary registers to the shader
		 */
		public iGetFragmentCodePerProbe(vo:away.materials.MethodVO, cubeMapReg:away.materials.ShaderRegisterElement, weightRegister:string, regCache:away.materials.ShaderRegisterCache):string
		{
			return "";
		}

		/**
		 * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
		 *
		 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
		 * @param regCache The register cache used during the compilation.
		 * @param targetReg The register containing the final shading output.
		 * @private
		 */
		public iGetFragmentPostLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			return "";
		}
	}
}
