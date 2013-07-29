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
		private _directionalLights:away.lights.DirectionalLight[];
		private _pointLights:away.lights.PointLight[];
		private _lightProbes:away.lights.LightProbe[];
		public _pNumEntities:number = 0;
		public _pNumLights:number = 0;
		public _pNumTriangles:number = 0;
		public _pNumMouseEnableds:number =0;
		public _pCamera:away.cameras.Camera3D;
		private _numDirectionalLights:number =0;
		private _numPointLights:number = 0;
		private _numLightProbes:number = 0;
		public _pCameraForward:away.geom.Vector3D;
		private _customCullPlanes:away.math.Plane3D[];
		private _cullPlanes:away.math.Plane3D[];
		private _numCullPlanes:number = 0;
		
		constructor()
		{
			super();
			this.init();
		}
		
		private init()
		{
			this._pLights = [];
			this._directionalLights = [];
			this._pointLights = [];
			this._lightProbes = [];
			this._pRenderableListItemPool = new away.data.RenderableListItemPool();
			this._pEntityListItemPool = new away.data.EntityListItemPool();
		}
		
		public get camera():away.cameras.Camera3D
		{
			return this._pCamera;
		}
		
		public set camera( value:away.cameras.Camera3D )
		{
			this._pCamera = value;
			this._iEntryPoint = this._pCamera.scenePosition;
			this._pCameraForward = this._pCamera.forwardVector;
			this._cullPlanes = this._pCamera.frustumPlanes;
		}
		
		public get cullPlanes():away.math.Plane3D[]
		{
			return this._customCullPlanes;
		}
		
		public set cullPlanes( value:away.math.Plane3D[] )
		{
			this._customCullPlanes = value;
		}
		
		public get numMouseEnableds():number
		{
			return this._pNumMouseEnableds;
		}
		
		public get skyBox():away.base.IRenderable
		{
			return this._pSkyBox;
		}
		
		public get opaqueRenderableHead():away.data.RenderableListItem
		{
			return this._pOpaqueRenderableHead;
		}
		
		public set opaqueRenderableHead( value:away.data.RenderableListItem )
		{
			this._pOpaqueRenderableHead = value;
		}
		
		public get blendedRenderableHead():away.data.RenderableListItem
		{
			return this._pBlendedRenderableHead;
		}
		
		public set blendedRenderableHead( value:away.data.RenderableListItem )
		{
			this._pBlendedRenderableHead = value;
		}
		
		public get entityHead():away.data.EntityListItem
		{
			return this._entityHead;
		}
		
		public get lights():away.lights.LightBase[]
		{
			return this._pLights;
		}
		
		public get directionalLights():away.lightsDirectionalLight[]
		{
			return this._directionalLights;
		}
		
		public get pointLights():away.lights.PointLight[]
		{
			return this._pointLights;
		}
		
		public get lightProbes():away.lights.LightProbe[]
		{
			return this._lightProbes;
		}
		
		public clear()
		{
			this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : ( this._pCamera ? this._pCamera.frustumPlanes : null );
			this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;
			this._pNumTriangles = this._pNumMouseEnableds = 0;
			this._pBlendedRenderableHead = null;
			this._pOpaqueRenderableHead = null;
			this._entityHead = null;
			this._pRenderableListItemPool.freeAll();
			this._pEntityListItemPool.freeAll();
			this._pSkyBox = null;
			if( this._pNumLights > 0 )
			{
				this._pLights.length = this._pNumLights = 0;
			}
			if( this._numDirectionalLights > 0 )
			{
				this._directionalLights.length = this._numDirectionalLights = 0;
			}
			if( this._numPointLights > 0 )
			{
				this._pointLights.length = this._numPointLights = 0;
			}
			if( this._numLightProbes > 0 )
			{
				this._lightProbes.length = this._numLightProbes = 0;
			}
		}
		
		//@override
		public enterNode( node:away.partition.NodeBase ):boolean
		{

            var enter : boolean = away.traverse.PartitionTraverser._iCollectionMark != node._iCollectionMark && node.isInFrustum( this._cullPlanes, this._numCullPlanes );

            node._iCollectionMark = away.traverse.PartitionTraverser._iCollectionMark;

			return enter;
		}
		
		//@override
		public applySkyBox( renderable:away.base.IRenderable )
		{
			this._pSkyBox = renderable;
		}
		
		//@override
		public applyRenderable( renderable:away.base.IRenderable )
		{
			var material:away.materials.MaterialBase;
			var entity:away.entities.Entity = renderable.sourceEntity;
			if( renderable.mouseEnabled )
			{
				++this._pNumMouseEnableds;
			}
			this._pNumTriangles += renderable.numTriangles;
			
			material = renderable.material;
			if( material )
			{
				var item:away.data.RenderableListItem = this._pRenderableListItemPool.getItem();
				item.renderable = renderable;
				item.materialId = material._iUniqueId;
				item.renderOrderId = material._iRenderOrderId;
				item.cascaded = false;
				var dx:number = this._iEntryPoint.x - entity.x;
				var dy:number = this._iEntryPoint.y - entity.y;
				var dz:number = this._iEntryPoint.z - entity.z;
				// project onto camera's z-axis
				item.zIndex = dx*this._pCameraForward.x + dy*this._pCameraForward.y + dz*this._pCameraForward.z + entity.zOffset;
				item.renderSceneTransform = renderable.getRenderSceneTransform( this._pCamera );
				if( material.requiresBlending )
				{
					item.next = this._pBlendedRenderableHead;
					this._pBlendedRenderableHead = item;
				}
				else
				{
					item.next = this._pOpaqueRenderableHead;
					this._pOpaqueRenderableHead = item;
				}
			}
		}
		
		//@override
		public applyEntity(entity:away.entities.Entity )
		{



			++this._pNumEntities;
			
			var item:away.data.EntityListItem = this._pEntityListItemPool.getItem();
			item.entity = entity;
			
			item.next = this._entityHead;
			this._entityHead = item;


            //console.log ( 'EntityCollector' , 'applyEntity: ' , entity , ' item: ' , item , 'item.next' , item.next , ' head: ' , this._entityHead );

		}
		
		//@override
		public applyUnknownLight( light:away.lights.LightBase )
		{
			this._pLights[ this._pNumLights++ ] = light;
		}
		
		//@override
		public applyDirectionalLight( light:away.lights.DirectionalLight )
		{
			this._pLights[ this._pNumLights++ ] = light;
			this._directionalLights[ this._numDirectionalLights++ ] = light;
		}
		
		//@override
		public applyPointLight( light:away.lights.PointLight )
		{
			this._pLights[ this._pNumLights++ ] = light;
			this._pointLights[ this._numPointLights++ ] = light;
		}
		
		//@override
		public applyLightProbe( light:away.lights.LightProbe )
		{
			this._pLights[ this._pNumLights++ ] = light;
			this._lightProbes[ this._numLightProbes++ ] = light;
		}

        /**
         * Cleans up any data at the end of a frame.
         */
        public cleanUp()
        {
        }

	}
}