/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="def/webgl.d.ts"/>
///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/events/EventDispatcher.ts" />

///<reference path="away/display3D/Stage3D.ts" />
///<reference path="away/display3D/Context3D.ts" />
///<reference path="away/display3D/VertexBuffer3D.ts" />

class Away3D extends away.events.EventDispatcher
{
	
	private _stage3D:away.display3d.Stage3D;
	
	constructor(canvas:HTMLCanvasElement = null)
	{
		super();
		
		if( !canvas )
		{
			canvas = document.createElement( "canvas" );
			document.body.appendChild( canvas );
		}
		
		this._stage3D = new away.display3d.Stage3D( canvas );
		this._stage3D.addEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler );
		this._stage3D.requestContext();
	}
	
	private onContext3DCreateHandler( e )
	{
		// test
		var stage3D: away.display3d.Stage3D = <away.display3d.Stage3D> e.target;
		var context3D: away.display3d.Context3D = stage3D.context3D;
		
		var vertices:number[] = [ 1, 0, 0,
								  0, 1, 0,
								  0, 0, 1 ];
		
		var vBuffer: away.display3D.VertexBuffer3D = context3D.createVertexBuffer( 3, 3 );
		vBuffer.upload( vertices, 0, 0 );
		
		context3D.clear( 1, 0, 0, 1 );
		context3D.present();
		
		this._stage3D.removeEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler );
	}
	
}
