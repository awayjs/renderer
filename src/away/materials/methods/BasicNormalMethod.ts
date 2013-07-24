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
		private _normalTextureRegister:ShaderRegisterElement;

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
            if ( this._texture )
            {

                vo.needsUV = true;

            }
            else
            {

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

            var s : any = method;
            var bnm : BasicNormalMethod = <BasicNormalMethod> method;

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

            var b : boolean =  ( value != null );

			if ( b != this._useTexture ||
				(value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) {
				this.iInvalidateShaderProgram();//invalidateShaderProgram();
			}
			this._useTexture = Boolean(value);
            this._texture = value;

		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._normalTextureRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			if (this._texture)
            {

                this._texture = null;

            }

		}


		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy)
		{
			if (vo.texturesIndex >= 0)
            {

                away.Debug.throwPIR( 'BasicNormalMethod' , 'iActivate' , 'Context3D.setGLSLTextureAt - params not matching');
                //stage3DProxy._iContext3D.setGLSLTextureAt( vo.texturesIndex, this._texture.getTextureForStage3D(stage3DProxy));

            }


		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			this._normalTextureRegister = regCache.getFreeTextureReg();

			vo.texturesIndex = this._normalTextureRegister.index;

            // TODO: AGAL <> GLSL
            /*
			return this.pGetTex2DSampleCode(vo, targetReg, this._normalTextureRegister, this._texture) +
				"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + this._sharedRegisters.commons + ".xxx	\n" +
				"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
            */
            return '';

		}
	}
}
