import NamedAssetBase				= require("awayjs-core/lib/library/NamedAssetBase");

import Camera						= require("awayjs-display/lib/entities/Camera");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShadingMethodEvent			= require("awayjs-renderergl/lib/events/ShadingMethodEvent");
import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import MaterialPassBase				= require("awayjs-renderergl/lib/materials/passes/MaterialPassBase");


/**
 * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
 * the final shading program.
 */
class ShadingMethodBase extends NamedAssetBase
{
	public _passes:Array<MaterialPassBase>; // should be protected

	/**
	 * Create a new ShadingMethodBase object.
	 */
	constructor()
	{
		super();
	}

	public iIsUsed(shaderObject:ShaderObjectBase):boolean
	{
		return true;
	}

	/**
	 * Initializes the properties for a MethodVO, including register and texture indices.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{

	}

	/**
	 * Initializes unchanging shader constants using the data from a MethodVO.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 *
	 * @internal
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{


	}

	/**
	 * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
	 */
	public iUsesTangentSpace():boolean
	{
		return true;
	}

	/**
	 * Any passes required that render to a texture used by this method.
	 */
	public get passes():Array<MaterialPassBase>
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
	public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return null;
	}

	/**
	 * Sets the render state for this method.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{

	}

	/**
	 * Sets the render state for a single renderable.
	 *
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param renderable The renderable currently being rendered.
	 * @param stage The Stage object currently used for rendering.
	 * @param camera The camera from which the scene is currently rendered.
	 *
	 * @internal
	 */
	public iSetRenderState(shaderObject:ShaderObjectBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{

	}

	/**
	 * Clears the render state for this method.
	 * @param vo The MethodVO object linking this method with the pass currently being compiled.
	 * @param stage The Stage object currently used for rendering.
	 *
	 * @internal
	 */
	public iDeactivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{

	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @internal
	 */
	public iInvalidateShaderProgram()
	{
		this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));
	}

	/**
	 * Copies the state from a ShadingMethodBase object into the current object.
	 */
	public copyFrom(method:ShadingMethodBase)
	{
	}
}

export = ShadingMethodBase;