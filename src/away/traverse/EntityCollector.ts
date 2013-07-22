/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.traverse
{
	export class EntityCollector extends away.traverse.PartitionTraverser
	{
		
		public _pSkyBox:away.base.IRenderable;
		public _pOpaqueRenderableHead:away.data.RenderableListItem;
		public _pBlendedRenderableHead:away.data.RenderableListItem;
		private _entityHead:away.data.EntityListItem;
		public _pRenderableListItemPool:away.data.RenderableListItemPool;
		public _pEntityListItemPool:away.data.EntityListItemPool;
		public _pLights:away.lights.LightBase[];
		//private _directionalLights:away.lights.DirectionalLight[];
		private _pointLights:away.lights.PointLight[];
		//private _lightProbes:Vector.<LightProbe>;
		public _pNumEntities:number;
		public _pNumLights:number;
		public _pNumTriangles:number;
		public _pNumMouseEnableds:number;
		public _pCamera:away.cameras.Camera3D;
		private _numDirectionalLights:number;
		private _numPointLights:number;
		private _numLightProbes:number;
		public _pCameraForward:away.geom.Vector3D;
		private _customCullPlanes:away.math.Plane3D[];
		private _cullPlanes:away.math.Plane3D[];
		private _numCullPlanes:number;
		
		constructor()
		{
			super();
		}
	}
}