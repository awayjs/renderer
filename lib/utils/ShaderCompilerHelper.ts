import TextureProxyBase				= require("awayjs-core/lib/textures/TextureProxyBase");

import ContextGLTextureFormat		= require("awayjs-stagegl/lib/base/ContextGLTextureFormat");

import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");

class ShaderCompilerHelper
{
	/**
	 * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param sharedReg The shared register object for the shader.
	 * @param inputReg The texture stream register.
	 * @param texture The texture which will be assigned to the given slot.
	 * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
	 * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
	 * @return The fragment code that performs the sampling.
	 *
	 * @protected
	 */
	public static getTex2DSampleCode(targetReg:ShaderRegisterElement, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement, texture:TextureProxyBase, smooth:boolean, repeat:boolean, mipmaps:boolean, uvReg:ShaderRegisterElement = null, forceWrap:string = null):string
	{
		var wrap:string = forceWrap || (repeat? "wrap":"clamp");
		var format:string = ShaderCompilerHelper.getFormatStringForTexture(texture);
		var enableMipMaps:boolean = mipmaps && texture.hasMipmaps;
		var filter:string = (smooth)? (enableMipMaps? "linear,miplinear" : "linear") : (enableMipMaps? "nearest,mipnearest" : "nearest");

		if (uvReg == null)
			uvReg = sharedReg.uvVarying;

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
	public static getTexCubeSampleCode(targetReg:ShaderRegisterElement, inputReg:ShaderRegisterElement, texture:TextureProxyBase, smooth:boolean, mipmaps:boolean, uvReg:ShaderRegisterElement):string
	{
		var filter:string;
		var format:string = ShaderCompilerHelper.getFormatStringForTexture(texture);
		var enableMipMaps:boolean = mipmaps && texture.hasMipmaps;
		var filter:string = (smooth)? (enableMipMaps? "linear,miplinear" : "linear") : (enableMipMaps? "nearest,mipnearest" : "nearest");

		return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <cube," + format + filter + ">\n";
	}

	/**
	 * Generates a texture format string for the sample instruction.
	 * @param texture The texture for which to get the format string.
	 * @return
	 *
	 * @protected
	 */
	public static getFormatStringForTexture(texture:TextureProxyBase):string
	{
		switch (texture.format) {
			case ContextGLTextureFormat.COMPRESSED:
				return "dxt1,";
				break;
			case ContextGLTextureFormat.COMPRESSED_ALPHA:
				return "dxt5,";
				break;
			default:
				return "";
		}
	}
}

export = ShaderCompilerHelper;