import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {IEntity}						from "@awayjs/graphics/lib/base/IEntity";
import {LineElements}					from "@awayjs/graphics/lib/elements/LineElements";
import {DefaultMaterialManager}		from "@awayjs/graphics/lib/managers/DefaultMaterialManager";

import {LineSegment}					from "@awayjs/scene/lib/display/LineSegment";

import {RendererBase}					from "../RendererBase";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {GL_MaterialBase}				from "../materials/GL_MaterialBase";
import {RenderablePool}					from "../renderables/RenderablePool";

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
	constructor(lineSegment:LineSegment, entity:IEntity, renderer:RendererBase, pool:RenderablePool)
	{
		super(lineSegment, entity, renderer, pool);

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

	public _pGetMaterial():GL_MaterialBase
	{
		return this._renderer.getMaterialPool(this.elementsGL).getAbstraction(this._lineSegment.material || DefaultMaterialManager.getDefaultMaterial(this.renderable));
	}
}