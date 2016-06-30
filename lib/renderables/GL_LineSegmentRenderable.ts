import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {LineElements}					from "@awayjs/display/lib/graphics/LineElements";
import {LineSegment}					from "@awayjs/display/lib/display/LineSegment";
import {DefaultMaterialManager}		from "@awayjs/display/lib/managers/DefaultMaterialManager";

import {RendererBase}					from "../RendererBase";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_SurfaceBase}				from "../surfaces/GL_SurfaceBase";

/**
 * @class away.pool.GL_LineSegmentRenderable
 */
export class GL_LineSegmentRenderable extends GL_RenderableBase
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

	public onClear(event:AssetEvent):void
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
	public _pGetElements():GL_ElementsBase
	{
		var elements:LineElements = GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] || (GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] = new LineElements());

		var start:Vector3D = this._lineSegment.startPostion;
		var end:Vector3D = this._lineSegment.endPosition;

		var positions:Float32Array = new Float32Array(6);
		var thickness:Float32Array = new Float32Array(1);

		positions[0] = start.x;
		positions[1] = start.y;
		positions[2] = start.z;
		positions[3] = end.x;
		positions[4] = end.y;
		positions[5] = end.z;
		thickness[0] = this._lineSegment.thickness;

		elements.setPositions(positions);
		elements.setThickness(thickness);

		return <GL_ElementsBase> this._stage.getAbstraction(elements);
	}

	public _pGetSurface():GL_SurfaceBase
	{
		return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._lineSegment.material || DefaultMaterialManager.getDefaultMaterial(this.renderable));
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