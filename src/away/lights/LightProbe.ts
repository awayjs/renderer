///<reference path="../_definitions.ts" />

module away.lights
{
	import BoundingVolumeBase		= away.bounds.BoundingVolumeBase;
	import NullBounds				= away.bounds.NullBounds;
	import Camera					= away.entities.Camera;
	import IEntity					= away.entities.IEntity;
	import Matrix3D					= away.geom.Matrix3D;
	import Vector3D					= away.geom.Vector3D;
	import EntityNode				= away.partition.EntityNode;
	import LightProbeNode			= away.partition.LightProbeNode;
	import IRenderer				= away.render.IRenderer;
	import CubeTextureBase			= away.textures.CubeTextureBase;
	
	export class LightProbe extends LightBase implements away.entities.IEntity
	{
		private _diffuseMap:CubeTextureBase;
		private _specularMap:CubeTextureBase;

		constructor(diffuseMap:CubeTextureBase, specularMap:CubeTextureBase = null)
		{
			super();

			this._pIsEntity = true;

			this._diffuseMap = diffuseMap;
			this._specularMap = specularMap;
		}

		public get diffuseMap():CubeTextureBase
		{
			return this._diffuseMap;
		}

		public set diffuseMap(value:CubeTextureBase)
		{
			this._diffuseMap = value;
		}

		public get specularMap():CubeTextureBase
		{
			return this._specularMap;
		}

		public set specularMap(value:CubeTextureBase)
		{
			this._specularMap = value;
		}

		/**
		 * @protected
		 */
		public pCreateEntityPartitionNode():EntityNode
		{
			return new LightProbeNode(this);
		}

		//@override
		public pUpdateBounds()
		{
			this._pBoundsInvalid = false;
		}

		//@override
		public pGetDefaultBoundingVolume():BoundingVolumeBase
		{
			return new NullBounds();
		}

		//@override
		public iGetObjectProjectionMatrix(entity:IEntity, camera:Camera, target:Matrix3D = null):Matrix3D
		{
			throw new away.errors.Error("Object projection matrices are not supported for LightProbe objects!");
		}

		public _iCollectRenderables(renderer:IRenderer)
		{
			//nothing to do here
		}
	}
}