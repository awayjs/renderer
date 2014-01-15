///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * ColorMaterial is a single-pass material that uses a flat color as the surface's diffuse reflection value.
	 */
	export class ColorMaterial extends SinglePassMaterialBase
	{
		private _diffuseAlpha:number = 1;

		/**
		 * Creates a new ColorMaterial object.
		 * @param color The material's diffuse surface color.
		 * @param alpha The material's surface alpha.
		 */
		constructor(color:number = 0xcccccc, alpha:number = 1)
		{

			super();

			this.color = color;
			this.alpha = alpha;

		}

		/**
		 * The alpha of the surface.
		 */
		public get alpha():number
		{
			return this._pScreenPass.diffuseMethod.diffuseAlpha;
		}

		public set alpha(value:number)
		{
			if (value > 1) {

				value = 1;

			} else if (value < 0) {

				value = 0;
			}

			this._pScreenPass.diffuseMethod.diffuseAlpha = this._diffuseAlpha = value;
			this._pScreenPass.preserveAlpha = this.requiresBlending;
			this._pScreenPass.setBlendMode(this.getBlendMode() == away.display.BlendMode.NORMAL && this.requiresBlending? away.display.BlendMode.LAYER : this.getBlendMode());
		}

		/**
		 * The diffuse reflectivity color of the surface.
		 */
		public get color():number
		{
			return this._pScreenPass.diffuseMethod.diffuseColor;
		}

		public set color(value:number)
		{
			this._pScreenPass.diffuseMethod.diffuseColor = value;
		}

		/**
		 * @inheritDoc
		 */
		public get requiresBlending():boolean
		{
			return this.getRequiresBlending() || this._diffuseAlpha < 1;
		}
	}
}
