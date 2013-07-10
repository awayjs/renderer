/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

module away.utils
{
	export class CSS
	{
		public static setCanvasSize( canvas:HTMLCanvasElement, width:number, height:number )
		{
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			canvas.width = width;
			canvas.height = height;
		}
		
		public static setCanvasVisibility( canvas:HTMLCanvasElement, visible:boolean )
		{
			if( visible )
			{
				canvas.style.visibility = 'visible';
			}
			else
			{
				canvas.style.visibility = 'hidden';
			}
		}
		
		public static setCanvasAlpha( canvas:HTMLCanvasElement, alpha:number )
		{
			var context = canvas.getContext( "2d" );
			context.globalAlpha = alpha;
		}
		
		public static setCanvasPosition( canvas:HTMLCanvasElement, x:number, y:number, absolute:boolean = false )
		{
			if( absolute )
			{
				canvas.style.position = "absolute";
			}
			else
			{
				canvas.style.position = "relative";
			}
			
			canvas.style.left = x + "px";
			canvas.style.top = y + "px";
		}
	}
}