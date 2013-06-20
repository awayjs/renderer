module away3d.core.math
{
	/**
	 * MathConsts provides some commonly used mathematical constants
	 */
	export class MathConsts
	{
		/**
		 * The amount to multiply with when converting radians to degrees.
		 */
		public static RADIANS_TO_DEGREES : Number = 180 / Math.PI;

		/**
		 * The amount to multiply with when converting degrees to radians.
		 */
		public static DEGREES_TO_RADIANS : Number = Math.PI / 180;
	}
}