/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.data
{
	export class RenderableListItem
	{
		
		public next:away.data.RenderableListItem;
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