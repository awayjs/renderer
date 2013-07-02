/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
///<reference path="../events/EventDispatcher.ts" />
///<reference path="../events/AwayEvent.ts" />
///<reference path="Context3D.ts" />

module away.display3d 
{
	
	export class Stage3D extends away.events.EventDispatcher
	{
		private _context3D:away.display3d.Context3D;
		private _canvas: HTMLCanvasElement;
		
		constructor( canvas: HTMLCanvasElement = null )
		{
			super();
			this._canvas = canvas;
		}
		
		public requestContext()
		{
			try
			{
				this._context3D = new away.display3d.Context3D( this._canvas );
			}
			catch( e )
			{
                this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) ); // TODO: check why removed/ Rename event ?
			}
			
			if( this._context3D)
			{
				this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.CONTEXT3D_CREATE ) );
			}
		}
		
		public get context3D()
		{
			return this._context3D;
		}
	}
	
}