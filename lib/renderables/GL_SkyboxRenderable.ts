import AttributesBuffer				from "awayjs-core/lib/attributes/AttributesBuffer";
import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";
import Vector3D						from "awayjs-core/lib/geom/Vector3D";

import ISurface						from "awayjs-display/lib/base/ISurface";
import ElementsBase					from "awayjs-display/lib/graphics/ElementsBase";
import TriangleElements				from "awayjs-display/lib/graphics/TriangleElements";
import Skybox						from "awayjs-display/lib/display/Skybox";
import Camera						from "awayjs-display/lib/display/Camera";

import IContextGL					from "awayjs-stagegl/lib/base/IContextGL";
import ContextGLProgramType			from "awayjs-stagegl/lib/base/ContextGLProgramType";
import Stage						from "awayjs-stagegl/lib/base/Stage";

import RendererBase					from "../RendererBase";
import ShaderBase					from "../shaders/ShaderBase";
import ShaderRegisterCache			from "../shaders/ShaderRegisterCache";
import ShaderRegisterData			from "../shaders/ShaderRegisterData";
import ShaderRegisterElement		from "../shaders/ShaderRegisterElement";
import GL_RenderableBase			from "../renderables/GL_RenderableBase";
import PassBase						from "../surfaces/passes/PassBase";

/**
 * @class away.pool.GL_SkyboxRenderable
 */
class GL_SkyboxRenderable extends GL_RenderableBase
{
	/**
	 *
	 */
	private static _geometry:TriangleElements;

	private _vertexArray:Float32Array;

	/**
	 *
	 */
	private _skybox:Skybox;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param skybox
	 */
	constructor(skybox:Skybox, renderer:RendererBase)
	{
		super(skybox, renderer);

		this._skybox = skybox;

		this._vertexArray = new Float32Array(24);
		this._vertexArray[19] = 1;
		this._vertexArray[23] = 1;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleElements}
	 * @private
	 */
	public _pGetElements():ElementsBase
	{
		var geometry:TriangleElements = GL_SkyboxRenderable._geometry;

		if (!geometry) {
			geometry = GL_SkyboxRenderable._geometry = new TriangleElements(new AttributesBuffer(11, 4));
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.setIndices(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			geometry.setPositions(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
		}

		return geometry;
	}

	public _pGetSurface():ISurface
	{
		return this._skybox;
	}

	public static _iIncludeDependencies(shader:ShaderBase)
	{

	}

	/**
	 * @inheritDoc
	 */
	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();

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
		this._vertexArray[16] = pos.x;
		this._vertexArray[17] = pos.y;
		this._vertexArray[18] = pos.z;
		this._vertexArray[20] = this._vertexArray[21] = this._vertexArray[22] = camera.projection.far/Math.sqrt(3);
		viewProjection.copyRawDataTo(this._vertexArray, 0, true);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, this._vertexArray);
	}
}

export default GL_SkyboxRenderable;