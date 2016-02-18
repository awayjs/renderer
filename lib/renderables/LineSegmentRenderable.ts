import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");
import LineElements					= require("awayjs-display/lib/graphics/LineElements");
import ElementsEvent				= require("awayjs-display/lib/events/ElementsEvent");
import Camera						= require("awayjs-display/lib/entities/Camera");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");

/**
 * @class away.pool.LineSubMeshRenderable
 */
class LineSegmentRenderable extends RenderableBase
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
		var geometry:LineElements = LineSegmentRenderable._lineGraphics[this._lineSegment.id] || (LineSegmentRenderable._lineGraphics[this._lineSegment.id] = new LineElements());

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

	public _pGetRenderOwner():IRenderOwner
	{
		return this._lineSegment.material;
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderableOwner
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.LineSubMeshRenderable}
	 * @private
	 */
	public _pGetOverflowRenderable(indexOffset:number):RenderableBase
	{
		return new LineSegmentRenderable(<LineSegment> this.renderableOwner, this._renderer);
	}
}

export = LineSegmentRenderable;