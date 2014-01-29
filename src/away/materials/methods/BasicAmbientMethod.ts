///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * BasicAmbientMethod provides the default shading method for uniform ambient lighting.
	 */
	export class BasicAmbientMethod extends ShadingMethodBase
	{
		private _useTexture:boolean = false;
		private _texture:away.textures.Texture2DBase;

		private _ambientInputRegister:ShaderRegisterElement;

		private _ambientColor:number = 0xffffff;

		private _ambientR:number = 0;
		private _ambientG:number = 0;
		private _ambientB:number = 0;

		private _ambient:number = 1;

		public _iLightAmbientR:number = 0;
		public _iLightAmbientG:number = 0;
		public _iLightAmbientB:number = 0;

		/**
		 * Creates a new BasicAmbientMethod object.
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
			 (value && _texture && (value.hasMipMaps != _texture.hasMipMaps || value.format != _texture.format))) {
			 invalidateShaderProgram();
			 }
			 */
			if (b != this._useTexture || (value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) {
				this.iInvalidateShaderProgram();//invalidateShaderProgram();
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
			var b:BasicAmbientMethod = <BasicAmbientMethod> m;

			var diff:BasicAmbientMethod = b;//BasicAmbientMethod(method);

			this.ambient = diff.ambient;
			this.ambientColor = diff.ambientColor;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._ambientInputRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{

			var code:string = "";

			if (this._useTexture) {

				this._ambientInputRegister = regCache.getFreeTextureReg();

				vo.texturesIndex = this._ambientInputRegister.index;

				// TODO: AGAL <> GLSL
				code += this.pGetTex2DSampleCode(vo, targetReg, this._ambientInputRegister, this._texture) + "div " + targetReg + ".xyz, " + targetReg + ".xyz, " + targetReg + ".w\n"; // apparently, still needs to un-premultiply :s

			} else {

				this._ambientInputRegister = regCache.getFreeFragmentConstant();
				vo.fragmentConstantsIndex = this._ambientInputRegister.index*4;

				code += "mov " + targetReg + ", " + this._ambientInputRegister + "\n";

			}

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			if (this._useTexture) {

				stageGL.contextGL.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.gl.ContextGLWrapMode.REPEAT : away.gl.ContextGLWrapMode.CLAMP, vo.useSmoothTextures? away.gl.ContextGLTextureFilter.LINEAR : away.gl.ContextGLTextureFilter.NEAREST, vo.useMipmapping? away.gl.ContextGLMipFilter.MIPLINEAR : away.gl.ContextGLMipFilter.MIPNONE);

				stageGL.contextGL.setTextureAt(vo.texturesIndex, this._texture.getTextureForStageGL(stageGL));

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
		public iSetRenderState(vo:MethodVO, renderable:away.base.IRenderable, stageGL:away.base.StageGL, camera:away.cameras.Camera3D)
		{
			this.updateAmbient();

			if (!this._useTexture) {

				var index:number = vo.fragmentConstantsIndex;
				var data:number[] = vo.fragmentData;
				data[index] = this._ambientR;
				data[index + 1] = this._ambientG;
				data[index + 2] = this._ambientB;

			}
		}
	}
}
