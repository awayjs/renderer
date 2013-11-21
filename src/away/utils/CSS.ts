///<reference path="../_definitions.ts"/>
module away.utils
{
	export class CSS
	{
		public static setCanvasSize(canvas:HTMLCanvasElement, width:number, height:number)
		{
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			canvas.width = width;
			canvas.height = height;
		}

		public static setCanvasWidth(canvas:HTMLCanvasElement, width:number)
		{
			canvas.style.width = width + "px";
			canvas.width = width;
		}

		public static setCanvasHeight(canvas:HTMLCanvasElement, height:number)
		{
			canvas.style.height = height + "px";
			canvas.height = height;
		}

		public static setCanvasX(canvas:HTMLCanvasElement, x:number)
		{
			canvas.style.position = 'absolute';
			canvas.style.left = x + "px";
		}

		public static setCanvasY(canvas:HTMLCanvasElement, y:number)
		{
			canvas.style.position = 'absolute';
			canvas.style.top = y + "px";
		}

		public static getCanvasVisibility(canvas:HTMLCanvasElement):boolean
		{
			return canvas.style.visibility == 'visible';
		}

		public static setCanvasVisibility(canvas:HTMLCanvasElement, visible:boolean)
		{
			if (visible) {
				canvas.style.visibility = 'visible';
			} else {
				canvas.style.visibility = 'hidden';
			}
		}

		public static setCanvasAlpha(canvas:HTMLCanvasElement, alpha:number)
		{
			var context = canvas.getContext("2d");
			context.globalAlpha = alpha;
		}

		public static setCanvasPosition(canvas:HTMLCanvasElement, x:number, y:number, absolute:boolean = false)
		{
			if (absolute) {
				canvas.style.position = "absolute";
			} else {
				canvas.style.position = "relative";
			}

			canvas.style.left = x + "px";
			canvas.style.top = y + "px";
		}
	}
}