/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
///<reference path="../events/EventDispatcher.ts" />
///<reference path="../events/AwayEvent.ts" />
///<reference path="../display3D/Context3D.ts" />

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
                this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.ERROR, e ) );
			}
			
			if( this._context3D )
			{
				this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.CONTEXT3D_CREATE ) );
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