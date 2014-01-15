///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * SegmentMaterial is a material exclusively used to render wireframe objects
	 *
	 * @see away3d.entities.Lines
	 */
	export class SegmentMaterial extends MaterialBase
	{
		private _screenPass:SegmentPass;

		/**
		 * Creates a new SegmentMaterial object.
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
