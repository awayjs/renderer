import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import Camera						= require("awayjs-display/lib/entities/Camera");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");

/**
 * @class away.pool.SkyboxRenderable
 */
class SkyboxRenderable extends RenderableBase
{
	public static assetClass:IAssetClass = Skybox;

	public static vertexAttributesOffset:number = 1;

	/**
	 *
	 */
	private static _geometry:TriangleSubGeometry;

	private _vertexArray:Array<number>;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param skybox
	 */
	constructor(pool:RenderablePool, skybox:Skybox, stage:Stage)
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
			geometry = SkyboxRenderable._geometry = new TriangleSubGeometry(new AttributesBuffer(11, 4));
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.setIndices(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			geometry.setPositions(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
		}

		return geometry;
	}

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

	/**
	 * @inheritDoc
	 */
	public _setRenderState(pass:PassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._setRenderState(pass, camera, viewProjection);

		var context:IContextGL = this._stage.context;
		var pos:Vector3D = camera.scenePosition;
		this._vertexArray[0] = pos.x;
		this._vertexArray[1] = pos.y;
		this._vertexArray[2] = pos.z;
		this._vertexArray[4] = this._vertexArray[5] = this._vertexArray[6] = camera.projection.far/Math.sqrt(3);
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexArray, 2);
	}
}

export = SkyboxRenderable;