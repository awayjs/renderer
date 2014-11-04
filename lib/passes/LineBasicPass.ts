import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");

/**
 * LineBasicPass is a material pass that draws wireframe segments.
 */
class LineBasicPass extends MaterialPassGLBase
{
	/**
	 * Creates a new SegmentPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var targetReg:ShaderRegisterElement = sharedReg.shadedTarget;

		return "mov " + targetReg + ", v0\n";
	}
}

export = LineBasicPass;