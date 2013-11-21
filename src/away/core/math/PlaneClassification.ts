///<reference path="../../_definitions.ts"/>
module away.math
{

	export class PlaneClassification
	{
		// "back" is synonymous with "in", but used for planes (back of plane is "inside" a solid volume walled by a plane)
		public static BACK:number = 0;
		public static FRONT:number = 1;

		public static IN:number = 0;
		public static OUT:number = 1;
		public static INTERSECT:number = 2;

	}
}
