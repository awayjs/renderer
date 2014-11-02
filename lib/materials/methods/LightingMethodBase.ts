import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderLightingObject			= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import ShadingMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadingMethodBase");

/**
 * LightingMethodBase provides an abstract base method for shading methods that uses lights.
 * Used for diffuse and specular shaders only.
 */
class LightingMethodBase extends ShadingMethodBase
{
	/**
	 * A method that is exposed to wrappers in case the strength needs to be controlled
	 */
	public _iModulateMethod:(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string;

	/**
	 * Creates a new LightingMethodBase.
	 */
	constructor()
	{
		super();
	}

	/**
	 * Get the fragment shader code that will be needed before any per-light code is added.
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param regCache The register cache used during the compilation.
	 * @private
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * Get the fragment shader code that will generate the code relevant to a single light.
	 *
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param lightDirReg The register containing the light direction vector.
	 * @param lightColReg The register containing the light colour.
	 * @param regCache The register cache used during the compilation.
	 */
	public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * Get the fragment shader code that will generate the code relevant to a single light probe object.
	 *
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param cubeMapReg The register containing the cube map for the current probe
	 * @param weightRegister A string representation of the register + component containing the current weight
	 * @param regCache The register cache providing any necessary registers to the shader
	 */
	public iGetFragmentCodePerProbe(shaderObject:ShaderLightingObject, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
	 *
	 * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
	 * @param regCache The register cache used during the compilation.
	 * @param targetReg The register containing the final shading output.
	 * @private
	 */
	public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
}

export = LightingMethodBase;