///<reference path="../../_definitions.ts"/>
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

            // Move ( to Sprite ) / possibly remove:
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

            var s3d : away.display.Stage3D;

			for( var i: number = 0; i <  Stage.STAGE3D_MAX_QUANTITY; ++i )
			{

                s3d         = this.stage3Ds[ i ];
                s3d.width   = width;
                s3d.height  = height;
                s3d.x       = 0;
                s3d.y       = 0;

				//away.utils.CSS.setCanvasSize( this.stage3Ds[ i ].canvas, width, height );
				//away.utils.CSS.setCanvasPosition( this.stage3Ds[ i ].canvas, 0, 0, true );
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

				var canvas  : HTMLCanvasElement     = this.createHTMLCanvasElement();
                var stage3D : away.display.Stage3D  = new away.display.Stage3D( canvas );
                    stage3D.addEventListener( away.events.Event.CONTEXT3D_CREATE , this.onContextCreated , this );

				this.stage3Ds.push( stage3D );

			}

		}

        private onContextCreated(e : away.events.Event ) : void
        {

            var stage3D : away.display.Stage3D = <away.display.Stage3D> e.target;
            this.addChildHTMLElement( stage3D.canvas );
        }

		private createHTMLCanvasElement(): HTMLCanvasElement
		{
			return document.createElement( "canvas" );
		}
		
		private addChildHTMLElement( canvas: HTMLCanvasElement )
		{
			document.body.appendChild( canvas );
		}

        public get stageWidth(): number
        {

            return this._stageWidth;

        }

        public get stageHeight(): number
        {

            return this._stageHeight;

        }

        public get rect() : away.geom.Rectangle
        {

            return new away.geom.Rectangle( 0 ,0 , this._stageWidth , this._stageHeight );

        }
	}
}