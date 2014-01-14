///<reference path="../../_definitions.ts"/>

/**
 * @module away.data
 */
module away.data
{
	/**
	 * @class away.data.RenderableListItem
	 */
	export class RenderableListItem
	{

		public next:RenderableListItem;
		public renderable:away.base.IRenderable;

		public materialId:number;
		public renderOrderId:number;
		public zIndex:number;
		public renderSceneTransform:away.geom.Matrix3D;

		public cascaded:boolean;

		constructor()
		{
		}
	}
}