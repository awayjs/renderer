///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.arcane;

	/**
	 * MethodVOSet provides a EffectMethodBase and MethodVO combination to be used by a material, allowing methods
	 * to be shared across different materials while their internal state changes.
	 */
	export class MethodVOSet
	{
		//use namespace arcane;

		/**
		 * An instance of a concrete EffectMethodBase subclass.
		 */
		public method:away.materials.EffectMethodBase;

		/**
		 * The MethodVO data for the given method containing the material-specific data for a given material/method combination.
		 */
		public data:away.materials.MethodVO;

		/**
		 * Creates a new MethodVOSet object.
		 * @param method The method for which we need to store a MethodVO object.
		 */
		constructor(method:away.materials.EffectMethodBase)
		{
			this.method = method;
			this.data = method.iCreateMethodVO();
		}
	}
}
