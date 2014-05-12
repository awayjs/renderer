///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
	 */
	export class AmbientBasicMethod extends ShadingMethodBase
	{
		private _useTexture:boolean = false;
		private _texture:away.textures.Texture2DBase;

		public _pAmbientInputRegister:ShaderRegisterElement;

		private _ambientColor:number = 0xffffff;

		private _ambientR:number = 0;
		private _ambientG:number = 0;
		private _ambientB:number = 0;

		private _ambient:number = 1;

		public _iLightAmbientR:number = 0;
		public _iLightAmbientG:number = 0;
		public _iLightAmbientB:number = 0;

		/**
		 * Creates a new AmbientBasicMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsUV = this._useTexture;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			vo.fragmentData[vo.fragmentConstantsIndex + 3] = 1;
		}

		/**
		 * The strength of the ambient reflection of the surface.
		 */
		public get ambient():number
		{
			return this._ambient;
		}

		public set ambient(value:number)
		{
			this._ambient = value;
		}

		/**
		 * The colour of the ambient reflection of the surface.
		 */
		public get ambientColor():number
		{
			return this._ambientColor;
		}

		public set ambientColor(value:number)
		{
			this._ambientColor = value;
		}

		/**
		 * The bitmapData to use to define the diffuse reflection color per texel.
		 */
		public get texture():away.textures.Texture2DBase
		{
			return this._texture;
		}

		public set texture(value:away.textures.Texture2DBase)
		{

			var b:boolean = ( value != null );

			/* // ORIGINAL conditional
			 if (Boolean(value) != _useTexture ||
			 (value && _texture && (value.hasMipmaps != _texture.hasMipmaps || value.format != _texture.format))) {
			 iInvalidateShaderProgram();
			 }
			 */
			if (b != this._useTexture || (value && this._texture && (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format))) {
				this.iInvalidateShaderProgram();
			}
			this._useTexture = b;//Boolean(value);
			this._texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{
			var m:any = method;
			var b:AmbientBasicMethod = <AmbientBasicMethod> m;

			var diff:AmbientBasicMethod = b;//AmbientBasicMethod(method);

			this.ambient = diff.ambient;
			this.ambientColor = diff.ambientColor;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._pAmbientInputRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{

			var code:string = "";

			if (this._useTexture) {

				this._pAmbientInputRegister = regCache.getFreeTextureReg();

				vo.texturesIndex = this._pAmbientInputRegister.index;

				// TODO: AGAL <> GLSL
				code += this.pGetTex2DSampleCode(vo, targetReg, this._pAmbientInputRegister, this._texture) + "div " + targetReg + ".xyz, " + targetReg + ".xyz, " + targetReg + ".w\n"; // apparently, still needs to un-premultiply :s

			} else {

				this._pAmbientInputRegister = regCache.getFreeFragmentConstant();
				vo.fragmentConstantsIndex = this._pAmbientInputRegister.index*4;

				code += "mov " + targetReg + ", " + this._pAmbientInputRegister + "\n";

			}

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			if (this._useTexture) {

				stageGL.contextGL.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.stagegl.ContextGLWrapMode.REPEAT:away.stagegl.ContextGLWrapMode.CLAMP, vo.useSmoothTextures? away.stagegl.ContextGLTextureFilter.LINEAR:away.stagegl.ContextGLTextureFilter.NEAREST, vo.useMipmapping? away.stagegl.ContextGLMipFilter.MIPLINEAR:away.stagegl.ContextGLMipFilter.MIPNONE);

				this._texture.activateTextureForStage(vo.texturesIndex, stageGL);

			}

		}

		/**
		 * Updates the ambient color data used by the render state.
		 */
		private updateAmbient()
		{
			this._ambientR = ((this._ambientColor >> 16) & 0xff)/0xff*this._ambient*this._iLightAmbientR;
			this._ambientG = ((this._ambientColor >> 8) & 0xff)/0xff*this._ambient*this._iLightAmbientG;
			this._ambientB = (this.ambientColor & 0xff)/0xff*this._ambient*this._iLightAmbientB;
		}

		/**
		 * @inheritDoc
		 */
		public iSetRenderState(vo:MethodVO, renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera)
		{
			this.updateAmbient();

			if (!this._useTexture) {

				var index:number = vo.fragmentConstantsIndex;
				var data:Array<number> = vo.fragmentData;
				data[index] = this._ambientR;
				data[index + 1] = this._ambientG;
				data[index + 2] = this._ambientB;

			}
		}
	}
}
