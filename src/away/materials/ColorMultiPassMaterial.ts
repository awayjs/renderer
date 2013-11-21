///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * ColorMultiPassMaterial is a multi-pass material that uses a flat color as the surface's diffuse reflection value.
	 */
	export class ColorMultiPassMaterial extends away.materials.MultiPassMaterialBase
	{
		/**
		 * Creates a new ColorMultiPassMaterial object.
		 *
		 * @param color The material's diffuse surface color.
		 */
			constructor(color:number = 0xcccccc)
		{
			super();
			this.color = color;
		}

		/**
		 * The diffuse reflectivity color of the surface.
		 */
		public get color():number
		{
			return this.diffuseMethod.diffuseColor;
		}

		public set color(value:number)
		{
			this.diffuseMethod.diffuseColor = value;
		}
	}
}
