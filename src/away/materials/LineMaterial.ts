///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * LineMaterial is a material exclusively used to render wireframe objects
	 *
	 * @see away.entities.Lines
	 */
	export class LineMaterial extends MaterialBase
	{
		private _screenPass:SegmentPass;

		/**
		 * Creates a new LineMaterial object.
		 *
		 * @param thickness The thickness of the wireframe lines.
		 */
		constructor(thickness:number = 1.25)
		{
			super();

			this.bothSides = true;
			this.pAddPass(this._screenPass = new SegmentPass(thickness));
			this._screenPass.material = this;
		}
	}
}