
///<reference path="../../_definitions.ts"/>

module away.filters
{

	export class Filter3DTaskBase
	{
		private _mainInputTexture:away.display3D.Texture;
		
		private _scaledTextureWidth:number = -1;
		private _scaledTextureHeight:number = -1;
		private _textureWidth:number = -1;
		private _textureHeight:number = -1;
		private _textureDimensionsInvalid:boolean = true;
		private _program3DInvalid:boolean = true;
		private _program3D:away.display3D.Program3D;
		private _target:away.display3D.Texture;
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

			if (this._textureScale == value)
            {

                return;

            }

			this._textureScale = value;
            this._scaledTextureWidth = this._textureWidth >> this._textureScale;
            this._scaledTextureHeight = this._textureHeight >> this._textureScale;
            this._textureDimensionsInvalid = true;

		}
		
		public get target():away.display3D.Texture
		{

			return this._target;

		}
		
		public set target(value:away.display3D.Texture)
		{

			this._target = value;

		}
		
		public get textureWidth():number
		{

			return this._textureWidth;

		}
		
		public set textureWidth(value:number)
		{

			if (this._textureWidth == value)
            {

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

			if (this._textureHeight == value)
            {

                return;

            }

            this._textureHeight = value;
            this._scaledTextureHeight = this._textureHeight >> this._textureScale;
            this._textureDimensionsInvalid = true;

		}
		
		public getMainInputTexture(stage:away.managers.Stage3DProxy):away.display3D.Texture
		{

			if (this._textureDimensionsInvalid)
            {

                this.pUpdateTextures(stage);

            }

			
			return this._mainInputTexture;

		}
		
		public dispose()
		{

			if (this._mainInputTexture)
            {

                this._mainInputTexture.dispose();

            }

			if (this._program3D)
            {

                this._program3D.dispose();

            }

		}
		
		public pInvalidateProgram3D()
		{
			this._program3DInvalid = true;
		}
		
		public pUpdateProgram3D(stage:away.managers.Stage3DProxy)
		{
			if (this._program3D)
            {

                this._program3D.dispose();

            }

			this._program3D = stage._iContext3D.createProgram();

            away.Debug.log( 'Filder3DTaskBase' , 'pUpdateProgram3D' , 'Program3D.upload / AGAL <> GLSL implementation' );

            // TODO: imeplement AGAL <> GLSL
			//this._program3D.upload(new AGALMiniAssembler(Debug.active).assemble(Context3DProgramType.VERTEX, getVertexCode()),new AGALMiniAssembler(Debug.active).assemble(Context3DProgramType.FRAGMENT, getFragmentCode()));

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
		
		public pUpdateTextures(stage:away.managers.Stage3DProxy)
		{

			if (this._mainInputTexture)
            {

                this._mainInputTexture.dispose();

            }

			
			this._mainInputTexture = stage._iContext3D.createTexture(this._scaledTextureWidth, this._scaledTextureHeight, away.display3D.Context3DTextureFormat.BGRA, true);
			
			this._textureDimensionsInvalid = false;

		}
		
		public getProgram3D(stage3DProxy:away.managers.Stage3DProxy):away.display3D.Program3D
		{
			if (this._program3DInvalid)
            {

                this.pUpdateProgram3D( stage3DProxy );

            }

			return this._program3D;
		}
		
		public activate(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D, depthTexture:away.display3D.Texture)
		{
		}
		
		public deactivate(stage3DProxy:away.managers.Stage3DProxy)
		{
		}
		
		public get requireDepthRender():boolean
		{
			return this._requireDepthRender;
		}
	}
}
