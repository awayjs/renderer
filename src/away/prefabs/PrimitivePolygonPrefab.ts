///<reference path="../_definitions.ts"/>

module away.prefabs
{

	/**
	 * A UV RegularPolygon primitive mesh.
	 */
	export class PrimitivePolygonPrefab extends away.prefabs.PrimitiveCylinderPrefab implements away.library.IAsset
	{

		/**
		 * The radius of the regular polygon.
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
		 * The number of sides of the regular polygon.
		 */
		public get sides():number
		{
			return this._pSegmentsW;
		}

		public set sides(value:number)
		{
			this.setSegmentsW(value);
		}

		/**
		 * The number of subdivisions from the edge to the center of the regular polygon.
		 */
		public get subdivisions():number
		{
			return this._pSegmentsH;
		}

		public set subdivisions(value:number)
		{
			this.setSegmentsH(value);
		}

		/**
		 * Creates a new RegularPolygon disc object.
		 * @param radius The radius of the regular polygon
		 * @param sides Defines the number of sides of the regular polygon.
		 * @param yUp Defines whether the regular polygon should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		constructor(radius:number = 100, sides:number = 16, yUp:boolean = true)
		{
			super(radius, 0, 0, sides, 1, true, false, false, yUp);
		}
	}
}
