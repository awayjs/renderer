/// <reference path="../math/Matrix3D.ts" />
/// <reference path="../base/IRenderable.ts" />

module away3d.core.data
{

	//import away3d.core.base.IRenderable;

	//import flash.geom.Matrix3D;

	export class RenderableListItem
	{
		public next : RenderableListItem;
		public renderable : away3d.core.base.IRenderable; // to implemement

		// for faster access while sorting or rendering (cached values)
		public materialId : number;
		public renderOrderId : number;
		public zIndex : number;
		public renderSceneTransform : away3d.core.math.Matrix3D;
		
		public cascaded : Boolean;
		
		public RenderableListItem() {
		
		}
	}
}
