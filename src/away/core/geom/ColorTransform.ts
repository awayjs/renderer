///<reference path="../../_definitions.ts"/>
module away.geom
{


	export class ColorTransform
	{

		public alphaMultiplier:number;
		public alphaOffset:number;
		public blueMultiplier:number;
		public blueOffset:number;
		public greenMultiplier:number;
		public greenOffset:number;
		public redMultiplier:number;
		public redOffset:number;

		constructor(inRedMultiplier:number = 1.0, inGreenMultiplier:number = 1.0, inBlueMultiplier:number = 1.0, inAlphaMultiplier:number = 1.0, inRedOffset:number = 0.0, inGreenOffset:number = 0.0, inBlueOffset:number = 0.0, inAlphaOffset:number = 0.0)
		{

			this.redMultiplier = inRedMultiplier;
			this.greenMultiplier = inGreenMultiplier;
			this.blueMultiplier = inBlueMultiplier;
			this.alphaMultiplier = inAlphaMultiplier;
			this.redOffset = inRedOffset;
			this.greenOffset = inGreenOffset;
			this.blueOffset = inBlueOffset;
			this.alphaOffset = inAlphaOffset;

		}

		public concat(second:ColorTransform):void
		{
			this.redMultiplier += second.redMultiplier;
			this.greenMultiplier += second.greenMultiplier;
			this.blueMultiplier += second.blueMultiplier;
			this.alphaMultiplier += second.alphaMultiplier;
		}

		public get color():number
		{

			return((this.redOffset << 16) | ( this.greenOffset << 8) | this.blueOffset);

		}

		public set color(value:number)
		{

			var argb:number[] = away.utils.ColorUtils.float32ColorToARGB(value);

			this.redOffset = argb[1];  //(value >> 16) & 0xFF;
			this.greenOffset = argb[2];  //(value >> 8) & 0xFF;
			this.blueOffset = argb[3];  //value & 0xFF;

			this.redMultiplier = 0;
			this.greenMultiplier = 0;
			this.blueMultiplier = 0;

		}

	}
}