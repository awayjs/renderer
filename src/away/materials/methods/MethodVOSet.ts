///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away.arcane;

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
		public method:EffectMethodBase;

		/**
		 * The MethodVO data for the given method containing the material-specific data for a given material/method combination.
		 */
		public data:MethodVO;

		/**
		 * Creates a new MethodVOSet object.
		 * @param method The method for which we need to store a MethodVO object.
		 */
		constructor(method:EffectMethodBase)
		{
			this.method = method;
			this.data = method.iCreateMethodVO();
		}
	}
}
