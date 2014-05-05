///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
	 * the final shading program.
	 */
	export class ShadingMethodBase extends away.library.NamedAssetBase
	{
		public _sharedRegisters:ShaderRegisterData; // should be protected
		public _passes:MaterialPassBase[]; // should be protected

		/**
		 * Create a new ShadingMethodBase object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * Initializes the properties for a MethodVO, including register and texture indices.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 *
		 * @internal
		 */
		public iInitVO(vo:MethodVO)
		{

		}

		/**
		 * Initializes unchanging shader constants using the data from a MethodVO.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 *
		 * @internal
		 */
		public iInitConstants(vo:MethodVO)
		{


		}

		/**
		 * The shared registers created by the compiler and possibly used by methods.
		 *
		 * @internal
		 */
		public get iSharedRegisters():ShaderRegisterData
		{
			return this._sharedRegisters;
		}

		/**
		 * @internal
		 */
		public set iSharedRegisters(value:ShaderRegisterData)
		{
			this._sharedRegisters = value;
		}

		public setISharedRegisters(value:ShaderRegisterData)
		{
			this._sharedRegisters = value;
		}

		/**
		 * Any passes required that render to a texture used by this method.
		 */
		public get passes():MaterialPassBase[]//Array<MaterialPassBase>
		{
			return this._passes;
		}

		/**
		 * Cleans up any resources used by the current object.
		 */
		public dispose()
		{

		}

		/**
		 * Creates a data container that contains material-dependent data. Provided as a factory method so a custom subtype can be overridden when needed.
		 *
		 * @internal
		 */
		public iCreateMethodVO():MethodVO
		{
			return new MethodVO();
		}

		/**
		 * Resets the compilation state of the method.
		 *
		 * @internal
		 */
		public iReset()
		{
			this.iCleanCompilationData();
		}

		/**
		 * Resets the method's state for compilation.
		 *
		 * @internal
		 */
		public iCleanCompilationData()
		{
		}

		/**
		 * Get the vertex shader code for this method.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 *
		 * @internal
		 */
		public iGetVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			return "";
		}

		/**
		 * Sets the render state for this method.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param stageGL The StageGL object currently used for rendering.
		 *
		 * @internal
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{

		}

		/**
		 * Sets the render state for a single renderable.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param renderable The renderable currently being rendered.
		 * @param stageGL The StageGL object currently used for rendering.
		 * @param camera The camera from which the scene is currently rendered.
		 *
		 * @internal
		 */
		public iSetRenderState(vo:MethodVO, renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera)
		{

		}

		/**
		 * Clears the render state for this method.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param stageGL The StageGL object currently used for rendering.
		 *
		 * @internal
		 */
		public iDeactivate(vo:MethodVO, stageGL:away.base.StageGL)
		{

		}

		/**
		 * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param targetReg The register in which to store the sampled colour.
		 * @param inputReg The texture stream register.
		 * @param texture The texture which will be assigned to the given slot.
		 * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
		 * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
		 * @return The fragment code that performs the sampling.
		 *
		 * @protected
		 */
		public pGetTex2DSampleCode(vo:MethodVO, targetReg:ShaderRegisterElement, inputReg:ShaderRegisterElement, texture:away.textures.TextureProxyBase, uvReg:ShaderRegisterElement = null, forceWrap:string = null):string
		{
			var wrap:string = forceWrap || (vo.repeatTextures? "wrap":"clamp");
			var filter:string;

			var format:string = this.getFormatStringForTexture(texture);
			var enableMipMaps:boolean = vo.useMipmapping && texture.hasMipmaps;

			if (vo.useSmoothTextures)
				filter = enableMipMaps? "linear,miplinear":"linear";
			else
				filter = enableMipMaps? "nearest,mipnearest":"nearest";

			if (uvReg == null)
				uvReg = this._sharedRegisters.uvVarying;

			return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <2d," + filter + "," + format + wrap + ">\n";

		}

		/**
		 * A helper method that generates standard code for sampling from a cube texture.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param targetReg The register in which to store the sampled colour.
		 * @param inputReg The texture stream register.
		 * @param texture The cube map which will be assigned to the given slot.
		 * @param uvReg The direction vector with which to sample the cube map.
		 *
		 * @protected
		 */
		public pGetTexCubeSampleCode(vo:MethodVO, targetReg:ShaderRegisterElement, inputReg:ShaderRegisterElement, texture:away.textures.TextureProxyBase, uvReg:ShaderRegisterElement):string
		{
			var filter:string;
			var format:string = this.getFormatStringForTexture(texture);
			var enableMipMaps:boolean = vo.useMipmapping && texture.hasMipmaps;

			if (vo.useSmoothTextures)
				filter = enableMipMaps? "linear,miplinear":"linear"; else
				filter = enableMipMaps? "nearest,mipnearest":"nearest";

			return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <cube," + format + filter + ">\n";
		}

		/**
		 * Generates a texture format string for the sample instruction.
		 * @param texture The texture for which to get the format string.
		 * @return
		 *
		 * @protected
		 */
		private getFormatStringForTexture(texture:away.textures.TextureProxyBase):string
		{
			switch (texture.format) {
				case away.gl.ContextGLTextureFormat.COMPRESSED:
					return "dxt1,";
					break;
				case "compressedAlpha":
					return "dxt5,";
					break;
				default:
					return "";
			}
		}

		/**
		 * Marks the shader program as invalid, so it will be recompiled before the next render.
		 *
		 * @internal
		 */
		public iInvalidateShaderProgram()
		{
			this.dispatchEvent(new away.events.ShadingMethodEvent(away.events.ShadingMethodEvent.SHADER_INVALIDATED));
		}

		/**
		 * Copies the state from a ShadingMethodBase object into the current object.
		 */
		public copyFrom(method:ShadingMethodBase)
		{
		}
	}
}
