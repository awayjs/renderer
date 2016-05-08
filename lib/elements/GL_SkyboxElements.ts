import ShaderBase					from "../shaders/ShaderBase";
import ShaderRegisterCache			from "../shaders/ShaderRegisterCache";
import ShaderRegisterElement		from "../shaders/ShaderRegisterElement";
import GL_TriangleElements			from "../elements/GL_TriangleElements";
import ShaderRegisterData			from "../shaders/ShaderRegisterData";

/**
 *
 * @class away.pool.GL_SkyboxElements
 */
class GL_SkyboxElements extends GL_TriangleElements
{
	public static _iIncludeDependencies(shader:ShaderBase)
	{
	}

	/**
	 * @inheritDoc
	 */
	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul vt0, va0, vc5\n" +
			"add vt0, vt0, vc4\n" +
			"m44 op, vt0, vc0\n";
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
}

export default GL_SkyboxElements;