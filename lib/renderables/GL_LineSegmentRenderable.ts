import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");

import ISurface						= require("awayjs-display/lib/base/ISurface");
import IRenderable					= require("awayjs-display/lib/base/IRenderable");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");
import LineElements					= require("awayjs-display/lib/graphics/LineElements");
import ElementsEvent				= require("awayjs-display/lib/events/ElementsEvent");
import Camera						= require("awayjs-display/lib/display/Camera");
import LineSegment					= require("awayjs-display/lib/display/LineSegment");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import GL_RenderableBase			= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
import PassBase						= require("awayjs-renderergl/lib/surfaces/passes/PassBase");

/**
 * @class away.pool.LineSubMeshRenderable
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
		super(lineSegment, lineSegment, renderer);

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

	public _pGetRenderOwner():ISurface
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
	 * @returns {away.pool.LineSubMeshRenderable}
	 * @private
	 */
	public _pGetOverflowRenderable(indexOffset:number):GL_RenderableBase
	{
		return new GL_LineSegmentRenderable(<LineSegment> this.renderable, this._renderer);
	}
}

export = GL_LineSegmentRenderable;