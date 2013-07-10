/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../display/Stage3D.ts" />
///<reference path="../events/AwayEvent.ts" />

module away.display
{
	
	export class Stage
	{
		
		private static MAX_STAGE3D_QUANTITY: number = 8;
		public stage3Ds:away.display.Stage3D[];
		
		private _stageHeight:number;
		private _stageWidth:number;
		
		constructor( width: number = 640, height: number = 480 )
		{
			if( !document )
			{
				throw "Error: document does not exist."; // TODO throw Error
			}
			
			this.initStage3DObjects();
			this.resize( width, height );
		}
		
		public resize( width:number, height:number )
		{
			this._stageHeight = height;
			this._stageWidth = width;
			
			for( var i: number = 0; i <  Stage.MAX_STAGE3D_QUANTITY; ++i )
			{
				this.stage3Ds[ i ].canvas.style.width = width + "px";
				this.stage3Ds[ i ].canvas.style.height = height + "px";
				this.stage3Ds[ i ].canvas.width = width;
				this.stage3Ds[ i ].canvas.height = height;
			}
			// TODO dispatchEvent
		}
		
		public getStage3DAt( index: number ): away.display.Stage3D
		{
			if( 0 <= index && index < Stage.MAX_STAGE3D_QUANTITY )
			{
				return this.stage3Ds[ index ];
			}
			throw "Index is out of bounds"; // TODO throw ArgumentError
		}
		
		public initStage3DObjects()
		{
			this.stage3Ds = [];
            var stage3DObj : away.display.Stage3D;

			for( var i: number = 0; i < Stage.MAX_STAGE3D_QUANTITY; ++i )
			{
				var canvas: HTMLCanvasElement = this.createHTMLCanvasElement();

                stage3DObj = new away.display.Stage3D( canvas );
                stage3DObj.addEventListener( away.events.AwayEvent.CONTEXT3D_CREATE , this.onContextCreated , this )
				this.stage3Ds.push( stage3DObj );

			}
		}

        private onContextCreated( e : away.events.AwayEvent ) : void
        {

            var stage3DObj : away.display.Stage3D = <away.display.Stage3D> e.target;
            this.addChildHTMLElement( stage3DObj.canvas );

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