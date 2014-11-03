import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import CubeTextureBase				= require("awayjs-core/lib/textures/CubeTextureBase");

import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import IContextGL				= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import StageGLMaterialBase			= require("awayjs-renderergl/lib/materials/StageGLMaterialBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import SkyboxPass					= require("awayjs-renderergl/lib/materials/passes/SkyboxPass");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");
import RendererBase					= require("awayjs-renderergl/lib/render/RendererBase");

/**
 * SkyboxMaterial is a material exclusively used to render skyboxes
 *
 * @see away3d.primitives.Skybox
 */
class SkyboxMaterial extends StageGLMaterialBase
{
	private _vertexData:Array<number>;
	private _cubeMap:CubeTextureBase;
	private _skyboxPass:SkyboxPass;

	/**
	 * Creates a new SkyboxMaterial object.
	 * @param cubeMap The CubeMap to use as the skybox.
	 */
	constructor(cubeMap:CubeTextureBase, smooth:boolean = true, repeat:boolean = false, mipmap:boolean = false)
	{

		super();

		this._cubeMap = cubeMap;
		this._pAddScreenPass(this._skyboxPass = new SkyboxPass());

		this._vertexData = new Array<number>(0, 0, 0, 0, 1, 1, 1, 1);
	}

	/**
	 * The cube texture to use as the skybox.
	 */
	public get cubeMap():CubeTextureBase
	{
		return this._cubeMap;
	}

	public set cubeMap(value:CubeTextureBase)
	{
		if (value && this._cubeMap && (value.hasMipmaps != this._cubeMap.hasMipmaps || value.format != this._cubeMap.format))
			this._pInvalidatePasses();

		this._cubeMap = value;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul vt0, va0, vc5\n" +
			"add vt0, vt0, vc4\n" +
			"m44 op, vt0, vc0\n" +
			"mov v0, va0\n";
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		//var cubeMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();

		//this._texturesIndex = cubeMapReg.index;

		//ShaderCompilerHelper.getTexCubeSampleCode(sharedRegisters.shadedTarget, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping);

		var mip:string = ",mipnone";

		if (this._cubeMap.hasMipmaps)
			mip = ",miplinear";

		return "tex ft0, v0, fs0 <cube," + ShaderCompilerHelper.getFormatStringForTexture(this._cubeMap) + "linear,clamp" + mip + ">\n";
	}

	/**
	 * @inheritDoc
	 */
	public _iActivatePass(pass:MaterialPassData, renderer:RendererBase, camera:Camera)
	{
		super._iActivatePass(pass, renderer, camera);

		var context:IContextGL = renderer.context;
		context.setSamplerStateAt(0, ContextGLWrapMode.CLAMP, ContextGLTextureFilter.LINEAR, this._cubeMap.hasMipmaps? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
		context.setDepthTest(false, ContextGLCompareMode.LESS);
		context.activateCubeTexture(0, this._cubeMap);
	}

	/**
	 * @inheritDoc
	 */
	public _iRenderPass(pass:MaterialPassData, renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRenderPass(pass, renderable, stage, camera, viewProjection);

		var context:IContextGL = <IContextGL> stage.context;
		var pos:Vector3D = camera.scenePosition;
		this._vertexData[0] = pos.x;
		this._vertexData[1] = pos.y;
		this._vertexData[2] = pos.z;
		this._vertexData[4] = this._vertexData[5] = this._vertexData[6] = camera.projection.far/Math.sqrt(3);
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexData, 2);

		context.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
		context.drawTriangles(context.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
	}
}

export = SkyboxMaterial;