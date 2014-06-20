///<reference path="../../_definitions.ts"/>

module away.filters
{
	import Stage					 		= away.base.Stage;
	import IContextStageGL					= away.stagegl.IContextStageGL;
	import ByteArray						= away.utils.ByteArray;

	export class Filter3DTaskBase
	{
		private _mainInputTexture:away.stagegl.ITexture;

		private _scaledTextureWidth:number = -1;
		private _scaledTextureHeight:number = -1;
		private _textureWidth:number = -1;
		private _textureHeight:number = -1;
		private _textureDimensionsInvalid:boolean = true;
		private _program3DInvalid:boolean = true;
		private _program3D:away.stagegl.IProgram;
		private _target:away.stagegl.ITexture;
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

		public get target():away.stagegl.ITexture
		{

			return this._target;

		}

		public set target(value:away.stagegl.ITexture)
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

		public getMainInputTexture(stage:Stage):away.stagegl.ITexture
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

		public pUpdateProgram(stage:Stage)
		{
			if (this._program3D) {

				this._program3D.dispose();

			}

			this._program3D = (<IContextStageGL> stage.context).createProgram();

			var vertexByteCode:ByteArray = (new aglsl.assembler.AGALMiniAssembler().assemble("part vertex 1\n" + this.pGetVertexCode() + "endpart"))['vertex'].data;
			var fragmentByteCode:ByteArray = (new aglsl.assembler.AGALMiniAssembler().assemble("part fragment 1\n" + this.pGetFragmentCode() + "endpart"))['fragment'].data;
			this._program3D.upload(vertexByteCode, fragmentByteCode);
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

		public pUpdateTextures(stage:Stage)
		{

			if (this._mainInputTexture) {

				this._mainInputTexture.dispose();

			}


			this._mainInputTexture = (<IContextStageGL> stage.context).createTexture(this._scaledTextureWidth, this._scaledTextureHeight, away.stagegl.ContextGLTextureFormat.BGRA, true);

			this._textureDimensionsInvalid = false;

		}

		public getProgram(stage:Stage):away.stagegl.IProgram
		{
			if (this._program3DInvalid) {

				this.pUpdateProgram(stage);

			}

			return this._program3D;
		}

		public activate(stage:Stage, camera:away.entities.Camera, depthTexture:away.stagegl.ITexture)
		{
		}

		public deactivate(stage:Stage)
		{
		}

		public get requireDepthRender():boolean
		{
			return this._requireDepthRender;
		}

	}
}
