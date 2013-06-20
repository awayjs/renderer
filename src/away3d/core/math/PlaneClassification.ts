module away3d.core.math
{
	export class PlaneClassification
	{
		// "back" is synonymous with "in", but used for planes (back of plane is "inside" a solid volume walled by a plane)
		public static BACK : int = 0;
		public static FRONT : int = 1;

		public static IN : int = 0;
		public static OUT : int = 1;
		public static PlaneClassification.INTERSECT : int = 2;
	}
}
