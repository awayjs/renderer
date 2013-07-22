/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.traverse
{
	export class EntityCollector extends PartitionTraverser
	{
		
		protected var _skyBox:away.base.IRenderable;
		protected var _opaqueRenderableHead:away.data.RenderableListItem;
		protected var _blendedRenderableHead:away.data.RenderableListItem;
		private var _entityHead:EntityListItem;
		//protected var _renderableListItemPool:RenderableListItemPool;
		protected var _entityListItemPool:EntityListItemPool;
		protected var _lights:Vector.<LightBase>;
		private var _directionalLights:Vector.<DirectionalLight>;
		private var _pointLights:Vector.<PointLight>;
		private var _lightProbes:Vector.<LightProbe>;
		protected var _numEntities:number;
		protected var _numLights:number;
		protected var _numTriangles:number;
		protected var _numMouseEnableds:number;
		protected var _camera:away.cameras.Camera3D;
		private var _numDirectionalLights:number;
		private var _numPointLights:number;
		private var _numLightProbes:number;
		protected var _cameraForward:away.geom.Vector3D;
		private var _customCullPlanes:away.math.Plane3D[];
		private var _cullPlanes:away.math.Plane3D[];
		private var _numCullPlanes:uint;
		
		constructor()
		{
			
		}
	}
}