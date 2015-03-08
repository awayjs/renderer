import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import CubeTextureBase				= require("awayjs-core/lib/textures/CubeTextureBase");

import TriangleSubGeometry			= require("awayjs-core/lib/data/TriangleSubGeometry");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import Camera						= require("awayjs-display/lib/entities/Camera");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePoolBase			= require("awayjs-renderergl/lib/pool/RenderablePoolBase");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");

/**
 * @class away.pool.SkyboxRenderable
 */
class SkyboxRenderable extends RenderableBase
{
	private _vertexArray:Array<number>;

	/**
	 *
	 */
	public static id:string = "skybox";

	public static vertexAttributesOffset:number = 1;

	/**
	 *
	 */
	private static _geometry:TriangleSubGeometry;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param skybox
	 */
	constructor(pool:RenderablePoolBase, skybox:Skybox, stage:Stage)
	{
		super(pool, skybox, skybox, skybox, stage);

		this._vertexArray = new Array<number>(0, 0, 0, 0, 1, 1, 1, 1);
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleSubGeometry}
	 * @private
	 */
	public _pGetSubGeometry():TriangleSubGeometry
	{
		var geometry:TriangleSubGeometry = SkyboxRenderable._geometry;

		if (!geometry) {
			geometry = SkyboxRenderable._geometry = new TriangleSubGeometry(true);
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.updateIndices(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			geometry.updatePositions(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
		}

		this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;

		return geometry;
	}

	public static _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{

	}

	/**
	 * @inheritDoc
	 */
	public static _iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul vt0, va0, vc5\n" +
			"add vt0, vt0, vc4\n" +
			"m44 op, vt0, vc0\n" +
			"mov v0, va0\n";
	}

	/**
	 * @inheritDoc
	 */
	public _iRender(pass:RenderPassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(pass, camera, viewProjection);

		var context:IContextGL = this._stage.context;
		var pos:Vector3D = camera.scenePosition;
		this._vertexArray[0] = pos.x;
		this._vertexArray[1] = pos.y;
		this._vertexArray[2] = pos.z;
		this._vertexArray[4] = this._vertexArray[5] = this._vertexArray[6] = camera.projection.far/Math.sqrt(3);
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexArray, 2);

		this._stage.activateBuffer(0, this.getVertexData(TriangleSubGeometry.POSITION_DATA), this.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
		context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
	}
}

export = SkyboxRenderable;