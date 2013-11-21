///<reference path="../../_definitions.ts"/>

module away.display3D
{
	export class Program3D
	{

		private _gl:WebGLRenderingContext;
		private _program:WebGLProgram;
		private _vertexShader:WebGLShader;
		private _fragmentShader:WebGLShader;

		constructor(gl:WebGLRenderingContext)
		{
			this._gl = gl;
			this._program = this._gl.createProgram();
		}

		public upload(vertexProgram:string, fragmentProgram:string)
		{

			this._vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
			this._fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);

			this._gl.shaderSource(this._vertexShader, vertexProgram);
			this._gl.compileShader(this._vertexShader);

			if (!this._gl.getShaderParameter(this._vertexShader, this._gl.COMPILE_STATUS)) {
				alert(this._gl.getShaderInfoLog(this._vertexShader));
				return null; //TODO throw errors
			}

			this._gl.shaderSource(this._fragmentShader, fragmentProgram);
			this._gl.compileShader(this._fragmentShader);

			if (!this._gl.getShaderParameter(this._fragmentShader, this._gl.COMPILE_STATUS)) {
				alert(this._gl.getShaderInfoLog(this._fragmentShader));
				return null; //TODO throw errors
			}

			this._gl.attachShader(this._program, this._vertexShader);
			this._gl.attachShader(this._program, this._fragmentShader);
			this._gl.linkProgram(this._program);

			if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
				alert("Could not link the program."); //TODO throw errors
			}
		}

		public dispose()
		{
			this._gl.deleteProgram(this._program);
		}

		public focusProgram()
		{
			this._gl.useProgram(this._program);
		}

		public get glProgram():WebGLProgram
		{
			return this._program;
		}
	}
}