///<reference path="../_definitions.ts"/>

module away.prefabs
{

	/**
	 * A UV Cone primitive mesh.
	 */
	export class PrimitiveConePrefab extends away.prefabs.PrimitiveCylinderPrefab implements away.library.IAsset
	{

		/**
		 * The radius of the bottom end of the cone.
		 */
		public get radius():number
		{
			return this._pBottomRadius;
		}

		public set radius(value:number)
		{
			this._pBottomRadius = value;

			this._pInvalidateGeometry();
		}

		/**
		 * Creates a new Cone object.
		 * @param radius The radius of the bottom end of the cone
		 * @param height The height of the cone
		 * @param segmentsW Defines the number of horizontal segments that make up the cone. Defaults to 16.
		 * @param segmentsH Defines the number of vertical segments that make up the cone. Defaults to 1.
		 * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		constructor(radius:number = 50, height:number = 100, segmentsW:number = 16, segmentsH:number = 1, closed:boolean = true, yUp:boolean = true)
		{
			super(0, radius, height, segmentsW, segmentsH, false, closed, true, yUp);
		}
	}
}
