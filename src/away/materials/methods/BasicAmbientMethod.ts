///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * BasicAmbientMethod provides the default shading method for uniform ambient lighting.
	 */
	export class BasicAmbientMethod extends away.materials.ShadingMethodBase
	{
		private _useTexture:boolean = false;
		private _texture:away.textures.Texture2DBase;

		private _ambientInputRegister:away.materials.ShaderRegisterElement;

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
		public iInitVO(vo:away.materials.MethodVO)
		{
			vo.needsUV = this._useTexture;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:away.materials.MethodVO)
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
		public copyFrom(method:away.materials.ShadingMethodBase)
		{
			var m:any = method;
			var b:away.materials.BasicAmbientMethod = <away.materials.BasicAmbientMethod> m;

			var diff:away.materials.BasicAmbientMethod = b;//BasicAmbientMethod(method);

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
		public iGetFragmentCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
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
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy)
		{
			if (this._useTexture) {

				stage3DProxy._iContext3D.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.display3D.Context3DWrapMode.REPEAT : away.display3D.Context3DWrapMode.CLAMP, vo.useSmoothTextures? away.display3D.Context3DTextureFilter.LINEAR : away.display3D.Context3DTextureFilter.NEAREST, vo.useMipmapping? away.display3D.Context3DMipFilter.MIPLINEAR : away.display3D.Context3DMipFilter.MIPNONE);

				stage3DProxy._iContext3D.setTextureAt(vo.texturesIndex, this._texture.getTextureForStage3D(stage3DProxy));

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
		public iSetRenderState(vo:away.materials.MethodVO, renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
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
