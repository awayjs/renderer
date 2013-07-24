///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.*;
	//import away3d.cameras.*;
	//import away3d.core.base.*;
	//import away3d.managers.*;
	//import away3d.events.*;
	//import away3d.library.assets.*;
	//import away3d.materials.compilation.*;
	//import away3d.materials.passes.*;
	//import away3d.textures.*;
	
	//import flash.display3D.*;
	
	//use namespace arcane;
	
	/**
	 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
	 * the final shading program.
	 */
	export class ShadingMethodBase extends away.library.NamedAssetBase
	{
		public _sharedRegisters:away.materials.ShaderRegisterData; // should be protected
		private _passes:away.materials.MaterialPassBase[];//Vector.<MaterialPassBase>;
		
		/**
		 * Create a new ShadingMethodBase object.
		 * @param needsNormals Defines whether or not the method requires normals.
		 * @param needsView Defines whether or not the method requires the view direction.
		 */
		constructor() // needsNormals : boolean, needsView : boolean, needsGlobalPos : boolean
		{
            super();
		}

		/**
		 * Initializes the properties for a MethodVO, including register and texture indices.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 */
		public iInitVO(vo:away.materials.MethodVO)
		{
		
		}

		/**
		 * Initializes unchanging shader constants using the data from a MethodVO.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 */
		public iInitConstants(vo:away.materials.MethodVO)
		{



		}

		/**
		 * The shared registers created by the compiler and possibly used by methods.
		 */
		public get iSharedRegisters():away.materials.ShaderRegisterData
		{
			return this._sharedRegisters;
		}
		
		public set iSharedRegisters(value:away.materials.ShaderRegisterData)
		{
			this._sharedRegisters = value;
		}
		
		/**
		 * Any passes required that render to a texture used by this method.
		 */
		public get passes():away.materials.MaterialPassBase[]//Vector.<MaterialPassBase>
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
		 */
		public iCreateMethodVO():away.materials.MethodVO
		{
			return new away.materials.MethodVO();
		}

		/**
		 * Resets the compilation state of the method.
		 */
		public iReset()
		{
			this.iCleanCompilationData();
		}
		
		/**
		 * Resets the method's state for compilation.
		 * @private
		 */
		public iCleanCompilationData()
		{
		}
		
		/**
		 * Get the vertex shader code for this method.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 * @private
		 */
		public iGetVertexCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			return "";
		}
		
		/**
		 * Sets the render state for this method.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param stage3DProxy The Stage3DProxy object currently used for rendering.
		 * @private
		 */
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy)
		{
		
		}
		
		/**
		 * Sets the render state for a single renderable.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param renderable The renderable currently being rendered.
		 * @param stage3DProxy The Stage3DProxy object currently used for rendering.
		 * @param camera The camera from which the scene is currently rendered.
		 */
		public iSetRenderState(vo:away.materials.MethodVO, renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
		{
		
		}
		
		/**
		 * Clears the render state for this method.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param stage3DProxy The Stage3DProxy object currently used for rendering.
		 */
		public iDeactivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy)
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
		 */
		public pGetTex2DSampleCode(vo:away.materials.MethodVO, targetReg:away.materials.ShaderRegisterElement, inputReg:away.materials.ShaderRegisterElement, texture:away.textures.TextureProxyBase, uvReg:away.materials.ShaderRegisterElement = null, forceWrap:string = null):string
		{
			var wrap:string = forceWrap || (vo.repeatTextures? "wrap" : "clamp");
			var filter:string;

			var format:string = this.getFormatStringForTexture(texture);
			var enableMipMaps:boolean = vo.useMipmapping && texture.hasMipMaps;
			
			if (vo.useSmoothTextures)
				filter = enableMipMaps? "linear,miplinear" : "linear";
			else
				filter = enableMipMaps? "nearest,mipnearest" : "nearest";

            //uvReg ||= _sharedRegisters.uvVarying;
            if ( uvReg == null )
            {

                uvReg = this._sharedRegisters.uvVarying;

            }

			return "tex " + targetReg.toString() + ", " + uvReg.toString() + ", " + inputReg.toString() + " <2d," + filter + "," + format + wrap + ">\n";

		}

		/**
		 * A helper method that generates standard code for sampling from a cube texture.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param targetReg The register in which to store the sampled colour.
		 * @param inputReg The texture stream register.
		 * @param texture The cube map which will be assigned to the given slot.
		 * @param uvReg The direction vector with which to sample the cube map.
		 */
		public pGetTexCubeSampleCode(vo:MethodVO, targetReg:away.materials.ShaderRegisterElement, inputReg:away.materials.ShaderRegisterElement, texture:away.textures.TextureProxyBase, uvReg:away.materials.ShaderRegisterElement):string
		{
			var filter:string;
			var format:string = this.getFormatStringForTexture(texture);
			var enableMipMaps:boolean = vo.useMipmapping && texture.hasMipMaps;
			
			if (vo.useSmoothTextures)
				filter = enableMipMaps? "linear,miplinear" : "linear";
			else
				filter = enableMipMaps? "nearest,mipnearest" : "nearest";
			
			return "tex " + targetReg.toString() + ", " + uvReg.toString() + ", " + inputReg.toString() + " <cube," + format + filter + ">\n";
		}

		/**
		 * Generates a texture format string for the sample instruction.
		 * @param texture The texture for which to get the format string.
		 * @return
		 */
		private getFormatStringForTexture(texture:away.textures.TextureProxyBase):string
		{
			switch (texture.format) {
				case away.display3D.Context3DTextureFormat.COMPRESSED:
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
		 */
		public iInvalidateShaderProgram()
		{
			this.dispatchEvent(new away.events.ShadingMethodEvent(away.events.ShadingMethodEvent.SHADER_INVALIDATED));
		}
		
		/**
		 * Copies the state from a ShadingMethodBase object into the current object.
		 */
		public copyFrom(method:away.materials.ShadingMethodBase)
		{
		}
	}
}
