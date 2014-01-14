///<reference path="../../_definitions.ts"/>

module away.filters
{

	export class Filter3DTaskBase
	{
		private _mainInputTexture:away.displayGL.Texture;

		private _scaledTextureWidth:number = -1;
		private _scaledTextureHeight:number = -1;
		private _textureWidth:number = -1;
		private _textureHeight:number = -1;
		private _textureDimensionsInvalid:boolean = true;
		private _program3DInvalid:boolean = true;
		private _program3D:away.displayGL.Program;
		private _target:away.displayGL.Texture;
		private _requireDepthRender:boolean;
		private _textureScale:number = 0;

		constructor(requireDepthRender:boolean = false)
		{

			this._requireDepthRender = requireDepthRender;

		}

		/**
		 * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
		 */
		public get textureScale():number
		{

			return this._textureScale;

		}

		public set textureScale(value:number)
		{

			if (this._textureScale == value) {

				return;

			}

			this._textureScale = value;
			this._scaledTextureWidth = this._textureWidth >> this._textureScale;
			this._scaledTextureHeight = this._textureHeight >> this._textureScale;
			this._textureDimensionsInvalid = true;

		}

		public get target():away.displayGL.Texture
		{

			return this._target;

		}

		public set target(value:away.displayGL.Texture)
		{

			this._target = value;

		}

		public get textureWidth():number
		{

			return this._textureWidth;

		}

		public set textureWidth(value:number)
		{

			if (this._textureWidth == value) {

				return;

			}

			this._textureWidth = value;
			this._scaledTextureWidth = this._textureWidth >> this._textureScale;
			this._textureDimensionsInvalid = true;

		}

		public get textureHeight():number
		{

			return this._textureHeight;

		}

		public set textureHeight(value:number)
		{

			if (this._textureHeight == value) {

				return;

			}

			this._textureHeight = value;
			this._scaledTextureHeight = this._textureHeight >> this._textureScale;
			this._textureDimensionsInvalid = true;

		}

		public getMainInputTexture(stage:away.managers.StageGLProxy):away.displayGL.Texture
		{

			if (this._textureDimensionsInvalid) {

				this.pUpdateTextures(stage);

			}


			return this._mainInputTexture;

		}

		public dispose()
		{

			if (this._mainInputTexture) {

				this._mainInputTexture.dispose();

			}

			if (this._program3D) {

				this._program3D.dispose();

			}

		}

		public pInvalidateProgram()
		{
			this._program3DInvalid = true;
		}

		public pUpdateProgram(stage:away.managers.StageGLProxy)
		{
			if (this._program3D) {

				this._program3D.dispose();

			}

			this._program3D = stage._iContextGL.createProgram();

			//away.Debug.log( 'Filder3DTaskBase' , 'pUpdateProgram' , 'Program.upload / AGAL <> GLSL implementation' );

			// TODO: imeplement AGAL <> GLSL
			//this._program3D.upload(new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.VERTEX, getVertexCode()),new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.FRAGMENT, getFragmentCode()));

			//new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.VERTEX, getVertexCode()),
			//new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.FRAGMENT, getFragmentCode()));

			var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
			var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();

			var vertString:string = vertCompiler.compile(away.displayGL.ContextGLProgramType.VERTEX, this.pGetVertexCode());
			var fragString:string = fragCompiler.compile(away.displayGL.ContextGLProgramType.FRAGMENT, this.pGetFragmentCode());

			this._program3D.upload(vertString, fragString);
			this._program3DInvalid = false;
		}

		public pGetVertexCode():string
		{

			// TODO: imeplement AGAL <> GLSL

			return "mov op, va0\n" + "mov v0, va1\n";

		}

		public pGetFragmentCode():string
		{

			throw new away.errors.AbstractMethodError();

			return null;

		}

		public pUpdateTextures(stage:away.managers.StageGLProxy)
		{

			if (this._mainInputTexture) {

				this._mainInputTexture.dispose();

			}


			this._mainInputTexture = stage._iContextGL.createTexture(this._scaledTextureWidth, this._scaledTextureHeight, away.displayGL.ContextGLTextureFormat.BGRA, true);

			this._textureDimensionsInvalid = false;

		}

		public getProgram(stageGLProxy:away.managers.StageGLProxy):away.displayGL.Program
		{
			if (this._program3DInvalid) {

				this.pUpdateProgram(stageGLProxy);

			}

			return this._program3D;
		}

		public activate(stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D, depthTexture:away.displayGL.Texture)
		{
		}

		public deactivate(stageGLProxy:away.managers.StageGLProxy)
		{
		}

		public get requireDepthRender():boolean
		{
			return this._requireDepthRender;
		}

	}
}
