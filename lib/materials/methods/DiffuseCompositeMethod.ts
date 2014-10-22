import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");
import Camera							= require("awayjs-core/lib/entities/Camera");

import Stage							= require("awayjs-stagegl/lib/core/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/core/pool/RenderableBase");
import ShadingMethodEvent				= require("awayjs-stagegl/lib/events/ShadingMethodEvent");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import DiffuseBasicMethod				= require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");

/**
 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
 * calculated diffuse reflection strength.
 */
class DiffuseCompositeMethod extends DiffuseBasicMethod
{
	public pBaseMethod:DiffuseBasicMethod;

	private _onShaderInvalidatedDelegate:Function;

	/**
	 * Creates a new <code>DiffuseCompositeMethod</code> object.
	 *
	 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	 * @param baseMethod The base diffuse method on which this method's shading is based.
	 */
	constructor(modulateMethod:(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string, baseMethod:DiffuseBasicMethod = null)
	{
		super();

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this.pBaseMethod = baseMethod || new DiffuseBasicMethod();
		this.pBaseMethod._iModulateMethod = modulateMethod;
		this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * The base diffuse method on which this method's shading is based.
	 */
	public get baseMethod():DiffuseBasicMethod
	{
		return this.pBaseMethod;
	}

	public set baseMethod(value:DiffuseBasicMethod)
	{
		if (this.pBaseMethod == value)
			return;

		this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this.pBaseMethod = value;
		this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		this.pBaseMethod.iInitVO(shaderObject, methodVO);
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		this.pBaseMethod.iInitConstants(shaderObject, methodVO);
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this.pBaseMethod.dispose();
	}

	/**
	 * @inheritDoc
	 */
	public get texture():Texture2DBase
	{
		return this.pBaseMethod.texture;
	}

	/**
	 * @inheritDoc
	 */
	public set texture(value:Texture2DBase)
	{
		this.pBaseMethod.texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public get diffuseColor():number
	{
		return this.pBaseMethod.diffuseColor;
	}

	/**
	 * @inheritDoc
	 */
	public set diffuseColor(value:number)
	{
		this.pBaseMethod.diffuseColor = value;
	}


	/**
	 * @inheritDoc
	 */
	public get ambientColor():number
	{
		return this.pBaseMethod.ambientColor;
	}

	/**
	 * @inheritDoc
	 */
	public set ambientColor(value:number)
	{
		this.pBaseMethod.ambientColor = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this.pBaseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this.pBaseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
		this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerProbe(shaderObject:ShaderLightingObject, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this.pBaseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
		this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		this.pBaseMethod.iActivate(shaderObject, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shaderObject:ShaderLightingObject, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		this.pBaseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
	}

	/**
	 * @inheritDoc
	 */
	public iDeactivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		this.pBaseMethod.iDeactivate(shaderObject, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this.pBaseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this.pBaseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iReset()
	{
		this.pBaseMethod.iReset();
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this.pBaseMethod.iCleanCompilationData();
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent)
	{
		this.iInvalidateShaderProgram();
	}
}

export = DiffuseCompositeMethod;