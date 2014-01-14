///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * BasicNormalMethod is the default method for standard tangent-space normal mapping.
	 */
	export class BasicNormalMethod extends away.materials.ShadingMethodBase
	{
		private _texture:away.textures.Texture2DBase;
		private _useTexture:boolean;
		public _pNormalTextureRegister:away.materials.ShaderRegisterElement;

		/**
		 * Creates a new BasicNormalMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:away.materials.MethodVO)
		{
			if (this._texture) {

				vo.needsUV = true;

			} else {

				vo.needsUV = false;

			}

			//vo.needsUV = Boolean(_texture);
		}

		/**
		 * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
		 */
		public get iTangentSpace():boolean
		{
			return true;
		}

		/**
		 * Indicates if the normal method output is not based on a texture (if not, it will usually always return true)
		 * Override if subclasses are different.
		 */
		public get iHasOutput():boolean
		{
			return this._useTexture;
		}

		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{

			var s:any = method;
			var bnm:BasicNormalMethod = <BasicNormalMethod> method;

			this.normalMap = bnm.normalMap;

		}

		/**
		 * The texture containing the normals per pixel.
		 */
		public get normalMap():away.textures.Texture2DBase
		{
			return this._texture;
		}

		public set normalMap(value:away.textures.Texture2DBase)
		{

			this.setNormalMap(value);

		}

		public setNormalMap(value:away.textures.Texture2DBase)
		{

			var b:boolean = ( value != null );

			if (b != this._useTexture || (value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) {
				this.iInvalidateShaderProgram();//invalidateShaderProgram();
			}
			this._useTexture = b;
			this._texture = value;

		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._pNormalTextureRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			if (this._texture) {

				this._texture = null;

			}

		}


		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stageGLProxy:away.managers.StageGLProxy)
		{
			if (vo.texturesIndex >= 0) {

				stageGLProxy._iContextGL.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.displayGL.ContextGLWrapMode.REPEAT : away.displayGL.ContextGLWrapMode.CLAMP, vo.useSmoothTextures? away.displayGL.ContextGLTextureFilter.LINEAR : away.displayGL.ContextGLTextureFilter.NEAREST, vo.useMipmapping? away.displayGL.ContextGLMipFilter.MIPLINEAR : away.displayGL.ContextGLMipFilter.MIPNONE);
				stageGLProxy._iContextGL.setTextureAt(vo.texturesIndex, this._texture.getTextureForStageGL(stageGLProxy));

			}

		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			this._pNormalTextureRegister = regCache.getFreeTextureReg();

			vo.texturesIndex = this._pNormalTextureRegister.index;

			// TODO: AGAL <> GLSL

			return this.pGetTex2DSampleCode(vo, targetReg, this._pNormalTextureRegister, this._texture) + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + this._sharedRegisters.commons + ".xxx\n" + "nrm " + targetReg + ".xyz, " + targetReg + "\n";

		}
	}
}
