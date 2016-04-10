import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";
import Vector3D						from "awayjs-core/lib/geom/Vector3D";

import ISurface						from "awayjs-display/lib/base/ISurface";
import IRenderable					from "awayjs-display/lib/base/IRenderable";
import ElementsBase					from "awayjs-display/lib/graphics/ElementsBase";
import LineElements					from "awayjs-display/lib/graphics/LineElements";
import ElementsEvent				from "awayjs-display/lib/events/ElementsEvent";
import Camera						from "awayjs-display/lib/display/Camera";
import LineSegment					from "awayjs-display/lib/display/LineSegment";
import DefaultMaterialManager		from "awayjs-display/lib/managers/DefaultMaterialManager";

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
 * @class away.pool.GL_LineSegmentRenderable
 */
class GL_LineSegmentRenderable extends GL_RenderableBase
{
	private static _lineGraphics:Object = new Object();

	/**
	 *
	 */
	private _lineSegment:LineSegment;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param graphic
	 * @param level
	 * @param dataOffset
	 */
	constructor(lineSegment:LineSegment, renderer:RendererBase)
	{
		super(lineSegment, renderer);

		this._lineSegment = lineSegment;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._lineSegment = null;
	}

	/**
	 * //TODO
	 *
	 * @returns {base.LineElements}
	 * @protected
	 */
	public _pGetElements():ElementsBase
	{
		var geometry:LineElements = GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] || (GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] = new LineElements());

		var start:Vector3D = this._lineSegment.startPostion;
		var end:Vector3D = this._lineSegment.endPosition;

		var positions:Float32Array;
		var thickness:Float32Array;

		//if (geometry.indices != null) {
		//	positions = <Float32Array> geometry.positions.get(geometry.numVertices);
		//	thickness = geometry.thickness.get(geometry.numVertices);
		//} else {
			positions = new Float32Array(6);
			thickness = new Float32Array(1);
		//}

		positions[0] = start.x;
		positions[1] = start.y;
		positions[2] = start.z;
		positions[3] = end.x;
		positions[4] = end.y;
		positions[5] = end.z;
		thickness[0] = this._lineSegment.thickness;

		geometry.setPositions(positions);
		geometry.setThickness(thickness);

		return geometry;
	}

	public _pGetSurface():ISurface
	{
		return this._lineSegment.material;
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderable
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.LineSubSpriteRenderable}
	 * @private
	 */
	public _pGetOverflowRenderable(indexOffset:number):GL_RenderableBase
	{
		return new GL_LineSegmentRenderable(<LineSegment> this.renderable, this._renderer);
	}
}

export default GL_LineSegmentRenderable;