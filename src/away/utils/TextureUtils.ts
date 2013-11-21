///<reference path="../_definitions.ts"/>
module away.utils
{
	//import flash.display.BitmapData;

	export class TextureUtils
	{
		private static MAX_SIZE:number = 2048;

		public static isBitmapDataValid(bitmapData:away.display.BitmapData):boolean
		{
			if (bitmapData == null) {

				return true;

			}

			return TextureUtils.isDimensionValid(bitmapData.width) && TextureUtils.isDimensionValid(bitmapData.height);

		}

		public static isHTMLImageElementValid(image:HTMLImageElement):boolean
		{
			if (image == null) {

				return true;

			}

			return TextureUtils.isDimensionValid(image.width) && TextureUtils.isDimensionValid(image.height);

		}

		public static isDimensionValid(d:number):boolean
		{

			return d >= 1 && d <= TextureUtils.MAX_SIZE && TextureUtils.isPowerOfTwo(d);

		}

		public static isPowerOfTwo(value:number):boolean
		{

			return value? ( ( value & -value ) == value ) : false;

		}

		public static getBestPowerOf2(value:number):number
		{

			var p:number = 1;

			while (p < value)
				p <<= 1;

			if (p > TextureUtils.MAX_SIZE)
				p = TextureUtils.MAX_SIZE;

			return p;

		}
	}
}
