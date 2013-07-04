/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
 
module away.display3D
{
	export class Program3D
	{
		private _program: WebGLProgram;
		private _vertexShader: WebGLShader;
		private _fragmentShader: WebGLShader;
		
		constructor( )
		{
			this._program = GL.createProgram();
		}
		
		public upload( vertexProgram:string, fragmentProgram:string )
		{
			
			this._vertexShader = GL.createShader( GL.VERTEX_SHADER );
			this._fragmentShader = GL.createShader( GL.FRAGMENT_SHADER );
			
			GL.shaderSource( this._vertexShader, vertexProgram );
			GL.compileShader( this._vertexShader );
			
			if ( !GL.getShaderParameter( this._vertexShader, GL.COMPILE_STATUS ) )
			{
				alert( GL.getShaderInfoLog( this._vertexShader ) );
				return null; //TODO throw errors
			}
			
			GL.shaderSource( this._fragmentShader, fragmentProgram );
			GL.compileShader( this._fragmentShader );
			
			if ( !GL.getShaderParameter( this._fragmentShader, GL.COMPILE_STATUS ) )
			{
				alert( GL.getShaderInfoLog( this._fragmentShader ) );
				return null; //TODO throw errors
			}
			
			GL.attachShader( this._program, this._vertexShader );
			GL.attachShader( this._program, this._fragmentShader );
			GL.linkProgram( this._program );
			
			if ( !GL.getProgramParameter( this._program, GL.LINK_STATUS ) )
			{
				alert("Could not link the program."); //TODO throw errors
			}
			
			GL.useProgram( this._program ); // TODO remove this and carriage through to sequential calls
			
			var positionLocation:number = GL.getAttribLocation( this._program, "a_position" );
			GL.enableVertexAttribArray( positionLocation );
			GL.vertexAttribPointer( positionLocation, 2, GL.FLOAT, false, 0, 0 );
			
			GL.drawArrays( GL.TRIANGLES, 0, 6 );
		}
		
		public focusProgram()
		{
			GL.useProgram( this._program );
		}
	}
}