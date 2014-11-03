import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");
import CubeTextureBase				= require("awayjs-core/lib/textures/CubeTextureBase");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import LightBase					= require("awayjs-display/lib/base/LightBase");
import Camera						= require("awayjs-display/lib/entities/Camera");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import DirectionalShadowMapper		= require("awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderLightingObject			= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import ShadowMapMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadowMapMethodBase");

/**
 * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
 */
class ShadowMethodBase extends ShadowMapMethodBase
{
	public _pDepthMapCoordReg:ShaderRegisterElement;
	public _pUsePoint:boolean;

	/**
	 * Creates a new ShadowMethodBase object.
	 * @param castingLight The light used to cast shadows.
	 */
	constructor(castingLight:LightBase)
	{
		this._pUsePoint = (castingLight instanceof PointLight);

		super(castingLight);
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		methodVO.needsView = true;
		methodVO.needsGlobalVertexPos = true;
		methodVO.needsGlobalFragmentPos = this._pUsePoint;
		methodVO.needsNormals = shaderObject.numLights > 0;
	}

	/**
	 * @inheritDoc
	 */
	public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var vertexData:Array<number> = shaderObject.vertexConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;
		fragmentData[index] = 1.0;
		fragmentData[index + 1] = 1/255.0;
		fragmentData[index + 2] = 1/65025.0;
		fragmentData[index + 3] = 1/16581375.0;

		fragmentData[index + 6] = 0;
		fragmentData[index + 7] = 1;

		if (this._pUsePoint) {
			fragmentData[index + 8] = 0;
			fragmentData[index + 9] = 0;
			fragmentData[index + 10] = 0;
			fragmentData[index + 11] = 1;
		}

		index = methodVO.vertexConstantsIndex;
		if (index != -1) {
			vertexData[index] = .5;
			vertexData[index + 1] = .5;
			vertexData[index + 2] = 0.0;
			vertexData[index + 3] = 1.0;
		}
	}

	/**
	 * Wrappers that override the vertex shader need to set this explicitly
	 */
	public get _iDepthMapCoordReg():ShaderRegisterElement
	{
		return this._pDepthMapCoordReg;
	}

	public set _iDepthMapCoordReg(value:ShaderRegisterElement)
	{
		this._pDepthMapCoordReg = value;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();

		this._pDepthMapCoordReg = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._pUsePoint? this._pGetPointVertexCode(methodVO, regCache, sharedRegisters):this.pGetPlanarVertexCode(methodVO, regCache, sharedRegisters);
	}

	/**
	 * Gets the vertex code for shadow mapping with a point light.
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 */
	public _pGetPointVertexCode(methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		methodVO.vertexConstantsIndex = -1;
		return "";
	}

	/**
	 * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
	 *
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 */
	public pGetPlanarVertexCode(methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp:ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
		var dataReg:ShaderRegisterElement = regCache.getFreeVertexConstant();
		var depthMapProj:ShaderRegisterElement = regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		regCache.getFreeVertexConstant();
		this._pDepthMapCoordReg = regCache.getFreeVarying();
		methodVO.vertexConstantsIndex = dataReg.index*4;

		// todo: can epsilon be applied here instead of fragment shader?

		code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" + "div " + temp + ", " + temp + ", " + temp + ".w\n" + "mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" + "add " + this._pDepthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";
		//"sub " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".w\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._pUsePoint? this._pGetPointFragmentCode(methodVO, targetReg, registerCache, sharedRegisters):this._pGetPlanarFragmentCode(methodVO, targetReg, registerCache, sharedRegisters);
		code += "add " + targetReg + ".w, " + targetReg + ".w, fc" + (methodVO.fragmentConstantsIndex/4 + 1) + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
		return code;
	}

	/**
	 * Gets the fragment code for shadow mapping with a planar shadow map.
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 * @param targetReg The register to contain the shadow coverage
	 * @return
	 */
	public _pGetPlanarFragmentCode(methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
		return "";
	}

	/**
	 * Gets the fragment code for shadow mapping with a point light.
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 * @param targetReg The register to contain the shadow coverage
	 * @return
	 */
	public _pGetPointFragmentCode(methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shaderObject:ShaderObjectBase, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		if (!this._pUsePoint)
			(<DirectionalShadowMapper> this._pShadowMapper).iDepthProjection.copyRawDataTo(shaderObject.vertexConstantData, methodVO.vertexConstantsIndex + 4, true);
	}

	/**
	 * Gets the fragment code for combining this method with a cascaded shadow map method.
	 * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
	 * @param regCache The register cache used during the compilation.
	 * @param decodeRegister The register containing the data to decode the shadow map depth value.
	 * @param depthTexture The texture containing the shadow map.
	 * @param depthProjection The projection of the fragment relative to the light.
	 * @param targetRegister The register to contain the shadow coverage
	 * @return
	 */
	public _iGetCascadeFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new Error("This shadow method is incompatible with cascade shadows");
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		var fragmentData:Array<number> = shaderObject.fragmentConstantData;
		var index:number /*int*/ = methodVO.fragmentConstantsIndex;

		if (this._pUsePoint)
			fragmentData[index + 4] = -Math.pow(1/((<PointLight> this._pCastingLight).fallOff*this._pEpsilon), 2);
		else
			shaderObject.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1/((<DirectionalShadowMapper> this._pShadowMapper).depth*this._pEpsilon);

		fragmentData[index + 5] = 1 - this._pAlpha;

		if (this._pUsePoint) {
			var pos:Vector3D = this._pCastingLight.scenePosition;
			fragmentData[index + 8] = pos.x;
			fragmentData[index + 9] = pos.y;
			fragmentData[index + 10] = pos.z;
			// used to decompress distance
			var f:number = (<PointLight> this._pCastingLight).fallOff;
			fragmentData[index + 11] = 1/(2*f*f);
		}

		if (!this._pUsePoint)
			stage.activateRenderTexture(methodVO.texturesIndex, <Texture2DBase> this._pCastingLight.shadowMapper.depthMap);
		//else
		//	stage.activateCubeRenderTexture(methodVO.texturesIndex, <CubeTextureBase> this._pCastingLight.shadowMapper.depthMap);
	}

	/**
	 * Sets the method state for cascade shadow mapping.
	 */
	public iActivateForCascade(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
	{
		throw new Error("This shadow method is incompatible with cascade shadows");
	}
}

export = ShadowMethodBase;