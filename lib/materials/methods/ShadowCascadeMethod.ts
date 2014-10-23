import Event							= require("awayjs-core/lib/events/Event");
import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import Camera							= require("awayjs-display/lib/entities/Camera");
import DirectionalLight					= require("awayjs-display/lib/entities/DirectionalLight");
import CascadeShadowMapper				= require("awayjs-display/lib/materials/shadowmappers/CascadeShadowMapper");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/pool/RenderableBase");
import IContextStageGL					= require("awayjs-stagegl/lib/base/IContextStageGL");
import ShadingMethodEvent				= require("awayjs-stagegl/lib/events/ShadingMethodEvent");
import MethodVO							= require("awayjs-stagegl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import ShadowMapMethodBase				= require("awayjs-stagegl/lib/materials/methods/ShadowMapMethodBase");
import ShadowMethodBase					= require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
import ShaderCompilerHelper				= require("awayjs-stagegl/lib/materials/utils/ShaderCompilerHelper");

/**
 * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
 *
 * @see away.lights.CascadeShadowMapper
 */
class ShadowCascadeMethod extends ShadowMapMethodBase
{
	private _baseMethod:ShadowMethodBase;
	private _cascadeShadowMapper:CascadeShadowMapper;
	private _depthMapCoordVaryings:Array<ShaderRegisterElement>;
	private _cascadeProjections:Array<ShaderRegisterElement>;

	/**
	 * Creates a new ShadowCascadeMethod object.
	 *
	 * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
	 */
	constructor(shadowMethodBase:ShadowMethodBase)
	{
		super(shadowMethodBase.castingLight);

		this._baseMethod = shadowMethodBase;
		if (!(this._pCastingLight instanceof DirectionalLight))
			throw new Error("ShadowCascadeMethod is only compatible with DirectionalLight");

		this._cascadeShadowMapper = <CascadeShadowMapper> this._pCastingLight.shadowMapper;

		if (!this._cascadeShadowMapper)
			throw new Error("ShadowCascadeMethod requires a light that has a CascadeShadowMapper instance assigned to shadowMapper.");

		this._cascadeShadowMapper.addEventListener(Event.CHANGE, (event:Event) => this.onCascadeChange(event));
		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, (event:ShadingMethodEvent) => this.onShaderInvalidated(event));
	}

	/**
	 * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
	 * with a DirectionalShadowMapper.
	 *
	 * @see ShadowHardMethod
	 * @see ShadowSoftMethod
	 */
	public get baseMethod():ShadowMethodBase
	{
		return this._baseMethod;
	}

	public set baseMethod(value:ShadowMethodBase)
	{
		if (this._baseMethod == value)
			return;

		this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, (event:ShadingMethodEvent) => this.onShaderInvalidated(event));

		this._baseMethod = value;

		this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, (event:ShadingMethodEvent) => this.onShaderInvalidated(event));

		this.iInvalidateShaderProgram();
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		var tempVO:MethodVO = new MethodVO(this._baseMethod);
		this._baseMethod.iInitVO(shaderObject, tempVO);

		methodVO.needsGlobalVertexPos = true;
		methodVO.needsProjection = true;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var vertexData:Array<number> = shaderObject.vertexConstantData;
		var index:number = methodVO.fragmentConstantsIndex;
		fragmentData[index] = 1.0;
		fragmentData[index + 1] = 1/255.0;
		fragmentData[index + 2] = 1/65025.0;
		fragmentData[index + 3] = 1/16581375.0;

		fragmentData[index + 6] = .5;
		fragmentData[index + 7] = -.5;

		index = methodVO.vertexConstantsIndex;
		vertexData[index] = .5;
		vertexData[index + 1] = -.5;
		vertexData[index + 2] = 0;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._cascadeProjections = null;
		this._depthMapCoordVaryings = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var dataReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();

		this.initProjectionsRegs(registerCache);
		methodVO.vertexConstantsIndex = dataReg.index*4;

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

		for (var i:number = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
			code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + this._cascadeProjections[i] + "\n" +
				"add " + this._depthMapCoordVaryings[i] + ", " + temp + ", " + dataReg + ".zzwz\n";
		}

		return code;
	}

	/**
	 * Creates the registers for the cascades' projection coordinates.
	 */
	private initProjectionsRegs(registerCache:ShaderRegisterCache)
	{
		this._cascadeProjections = new Array<ShaderRegisterElement>(this._cascadeShadowMapper.numCascades);
		this._depthMapCoordVaryings = new Array<ShaderRegisterElement>(this._cascadeShadowMapper.numCascades);

		for (var i:number = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
			this._depthMapCoordVaryings[i] = registerCache.getFreeVarying();
			this._cascadeProjections[i] = registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
		}
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var numCascades:number = this._cascadeShadowMapper.numCascades;
		var depthMapRegister:ShaderRegisterElement = registerCache.getFreeTextureReg();
		var decReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var planeDistanceReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var planeDistances:Array<string> = Array<string>( planeDistanceReg + ".x", planeDistanceReg + ".y", planeDistanceReg + ".z", planeDistanceReg + ".w" );
		var code:string;

		methodVO.fragmentConstantsIndex = decReg.index*4;
		methodVO.texturesIndex = depthMapRegister.index;

		var inQuad:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(inQuad, 1);
		var uvCoord:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(uvCoord, 1);

		// assume lowest partition is selected, will be overwritten later otherwise
		code = "mov " + uvCoord + ", " + this._depthMapCoordVaryings[numCascades - 1] + "\n";

		for (var i:number = numCascades - 2; i >= 0; --i) {
			var uvProjection:ShaderRegisterElement = this._depthMapCoordVaryings[i];

			// calculate if in texturemap (result == 0 or 1, only 1 for a single partition)
			code += "slt " + inQuad + ".z, " + sharedRegisters.projectionFragment + ".z, " + planeDistances[i] + "\n"; // z = x > minX, w = y > minY

			var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

			// linearly interpolate between old and new uv coords using predicate value == conditional toggle to new value if predicate == 1 (true)
			code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" +
				"mul " + temp + ", " + temp + ", " + inQuad + ".z\n" +
				"add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
		}

		registerCache.removeFragmentTempUsage(inQuad);

		code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" +
			"mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" +
			"add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";

		code += this._baseMethod._iGetCascadeFragmentCode(shaderObject, methodVO, decReg, depthMapRegister, uvCoord, targetReg, registerCache, sharedRegisters) +
			"add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";

		registerCache.removeFragmentTempUsage(uvCoord);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		(<IContextStageGL> stage.context).activateTexture(methodVO.texturesIndex, <Texture2DBase> this._pCastingLight.shadowMapper.depthMap);

		var vertexData:Array<number> = shaderObject.vertexConstantData;
		var vertexIndex:number = methodVO.vertexConstantsIndex;

		shaderObject.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1/(this._cascadeShadowMapper.depth*this._pEpsilon);

		var numCascades:number = this._cascadeShadowMapper.numCascades;
		vertexIndex += 4;
		for (var k:number = 0; k < numCascades; ++k) {
			this._cascadeShadowMapper.getDepthProjections(k).copyRawDataTo(vertexData, vertexIndex, true);
			vertexIndex += 16;
		}

		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var fragmentIndex:number = methodVO.fragmentConstantsIndex;
		fragmentData[fragmentIndex + 5] = 1 - this._pAlpha;

		var nearPlaneDistances:Array<number> = this._cascadeShadowMapper._iNearPlaneDistances;

		fragmentIndex += 8;
		for (var i:number = 0; i < numCascades; ++i)
			fragmentData[fragmentIndex + i] = nearPlaneDistances[i];

		this._baseMethod.iActivateForCascade(shaderObject, methodVO, stage);
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shaderObject:ShaderObjectBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
	}

	/**
	 * Called when the shadow mappers cascade configuration changes.
	 */
	private onCascadeChange(event:Event)
	{
		this.iInvalidateShaderProgram();
	}

	/**
	 * Called when the base method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent)
	{
		this.iInvalidateShaderProgram();
	}
}

export = ShadowCascadeMethod;