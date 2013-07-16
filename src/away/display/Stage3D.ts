/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts" />

module away.display
{
	
	export class Stage3D extends away.events.EventDispatcher
	{
		private _context3D:away.display3D.Context3D;
		private _canvas:HTMLCanvasElement;
		
		constructor( canvas: HTMLCanvasElement )
		{
			super();
			this._canvas = canvas;
		}
		
		public requestContext()
		{
			try
			{
				this._context3D = new away.display3D.Context3D( this._canvas );
			}
			catch( e )
			{
                this.dispatchEvent( new away.events.Event( away.events.Event.ERROR ) );
			}
			
			if( this._context3D )
			{
				this.dispatchEvent( new away.events.Event( away.events.Event.CONTEXT3D_CREATE ) );
			}
		}
		
		public get canvas(): HTMLCanvasElement
		{
			return this._canvas;
		}
		
		public get context3D()
		{
			return this._context3D;
		}
		
	}
}