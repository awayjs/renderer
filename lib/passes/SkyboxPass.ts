import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");

/**
 * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
 */
class SkyboxPass extends MaterialPassGLBase
{
	/**
	 * Creates a new SkyboxPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor()
	{
		super();
	}


	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		shaderObject.useMipmapping = false;
	}
}

export = SkyboxPass;