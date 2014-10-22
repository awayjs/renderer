import NearDirectionalShadowMapper		= require("awayjs-core/lib/materials/shadowmappers/NearDirectionalShadowMapper");
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
import ShadowMethodBase					= require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");

// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
/**
 * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
 *
 * @see away.lights.NearDirectionalShadowMapper
 */
class ShadowNearMethod extends ShadowMethodBase
{
	private _baseMethod:ShadowMethodBase;

	private _fadeRatio:number;
	private _nearShadowMapper:NearDirectionalShadowMapper;

	private _onShaderInvalidatedDelegate:Function;

	/**
	 * Creates a new ShadowNearMethod object.
	 * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
	 * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	 */
	constructor(baseMethod:ShadowMethodBase, fadeRatio:number = .1)
	{
		super(baseMethod.castingLight);

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

		this._baseMethod = baseMethod;
		this._fadeRatio = fadeRatio;
		this._nearShadowMapper = <NearDirectionalShadowMapper> this._pCastingLight.shadowMapper;
		if (!this._nearShadowMapper)
			throw new Error("ShadowNearMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * The base shadow map method on which this method's shading is based.
	 */
	public get baseMethod():ShadowMethodBase
	{
		return this._baseMethod;
	}

	public set baseMethod(value:ShadowMethodBase)
	{
		if (this._baseMethod == value)
			return;

		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this._baseMethod = value;

		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		super.iInitConstants(shaderObject, methodVO);
		this._baseMethod.iInitConstants(shaderObject, methodVO);

		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		fragmentData[index + 2] = 0;
		fragmentData[index + 3] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		this._baseMethod.iInitVO(shaderObject, methodVO);

		methodVO.needsProjection = true;
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
	}

	/**
	 * @inheritDoc
	 */
	public get alpha():number
	{
		return this._baseMethod.alpha;
	}

	public set alpha(value:number)
	{
		this._baseMethod.alpha = value;
	}

	/**
	 * @inheritDoc
	 */
	public get epsilon():number
	{
		return this._baseMethod.epsilon;
	}

	public set epsilon(value:number)
	{
		this._baseMethod.epsilon = value;
	}

	/**
	 * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	 */
	public get fadeRatio():number
	{
		return this._fadeRatio;
	}

	public set fadeRatio(value:number)
	{
		this._fadeRatio = value;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._baseMethod.iGetFragmentCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentSingleTemp();
		methodVO.secondaryFragmentConstantsIndex = dataReg.index*4;

		code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" +
			"sub " + temp + ", " + temp + ", " + dataReg + ".x\n" +
			"mul " + temp + ", " + temp + ", " + dataReg + ".y\n" +
			"sat " + temp + ", " + temp + "\n" +
			"sub " + temp + ", " + dataReg + ".w," + temp + "\n" +
			"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" +
			"mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" +
			"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		this._baseMethod.iActivate(shaderObject, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iDeactivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		this._baseMethod.iDeactivate(shaderObject, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shaderObject:ShaderObjectBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		// todo: move this to activate (needs camera)
		var near:number = camera.projection.near;
		var d:number = camera.projection.far - near;
		var maxDistance:number = this._nearShadowMapper.coverageRatio;
		var minDistance:number = maxDistance*(1 - this._fadeRatio);

		maxDistance = near + maxDistance*d;
		minDistance = near + minDistance*d;

		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
		fragmentData[index] = minDistance;
		fragmentData[index + 1] = 1/(maxDistance - minDistance);

		this._baseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._baseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public iReset()
	{
		this._baseMethod.iReset();
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._baseMethod.iCleanCompilationData();
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent)
	{
		this.iInvalidateShaderProgram();
	}
}

export = ShadowNearMethod;