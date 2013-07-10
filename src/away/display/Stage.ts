/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="../display/Stage3D.ts" />
///<reference path="../utils/CSS.ts" />
///<reference path="../events/Event.ts" />
///<reference path="../events/EventDispatcher.ts" />
///<reference path="../errors/DocumentError.ts" />

module away.display
{
	
	export class Stage extends away.events.EventDispatcher
	{
		
		private static STAGE3D_MAX_QUANTITY: number = 8;
		public stage3Ds:away.display.Stage3D[];
		
		private _stageHeight:number;
		private _stageWidth:number;
		
		constructor( width: number = 640, height: number = 480 )
		{
			super();
			if( !document )
			{
				throw new away.errors.DocumentError( "A root document object does not exist." );
			}
			
			this.initStage3DObjects();
			this.resize( width, height );
		}
		
		public resize( width:number, height:number )
		{
			this._stageHeight = height;
			this._stageWidth = width;
			
			for( var i: number = 0; i <  Stage.STAGE3D_MAX_QUANTITY; ++i )
			{
				away.utils.CSS.setCanvasSize( this.stage3Ds[ i ].canvas, width, height );
				away.utils.CSS.setCanvasPosition( this.stage3Ds[ i ].canvas, 0, 0, true );
			}
			this.dispatchEvent( new away.events.Event( away.events.Event.RESIZE ) );
		}
		
		public getStage3DAt( index: number ): away.display.Stage3D
		{
			if( 0 <= index && index < Stage.STAGE3D_MAX_QUANTITY )
			{
				return this.stage3Ds[ index ];
			}
			throw new away.errors.ArgumentError( "Index is out of bounds [0.." + Stage.STAGE3D_MAX_QUANTITY + "]" );
		}
		
		public initStage3DObjects()
		{
			this.stage3Ds = [];
			for( var i: number = 0; i < Stage.STAGE3D_MAX_QUANTITY; ++i )
			{
				var canvas: HTMLCanvasElement = this.createHTMLCanvasElement();
				this.addChildHTMLElement( canvas );
				this.stage3Ds.push( new away.display.Stage3D( canvas ) );
			}
		}
		
		private createHTMLCanvasElement(): HTMLCanvasElement
		{
			return document.createElement( "canvas" );
		}
		
		private addChildHTMLElement( canvas: HTMLCanvasElement )
		{
			document.body.appendChild( canvas );
		}
	}
}