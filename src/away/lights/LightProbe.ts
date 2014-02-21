///<reference path="../_definitions.ts" />

module away.lights
{
	export class LightProbe extends away.lights.LightBase implements away.entities.IEntity
	{
		private _diffuseMap:away.textures.CubeTextureBase;
		private _specularMap:away.textures.CubeTextureBase;

		constructor(diffuseMap:away.textures.CubeTextureBase, specularMap:away.textures.CubeTextureBase = null)
		{
			super();

			this._pIsEntity = true;

			this._diffuseMap = diffuseMap;
			this._specularMap = specularMap;
		}

		public get diffuseMap():away.textures.CubeTextureBase
		{
			return this._diffuseMap;
		}

		public set diffuseMap(value:away.textures.CubeTextureBase)
		{
			this._diffuseMap = value;
		}

		public get specularMap():away.textures.CubeTextureBase
		{
			return this._specularMap;
		}

		public set specularMap(value:away.textures.CubeTextureBase)
		{
			this._specularMap = value;
		}

		/**
		 * @protected
		 */
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.LightProbeNode(this);
		}

		//@override
		public pUpdateBounds()
		{
			this._pBoundsInvalid = false;
		}

		//@override
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.NullBounds();
		}

		//@override
		public iGetObjectProjectionMatrix(entity:away.entities.IEntity, camera:away.entities.Camera, target:away.geom.Matrix3D = null):away.geom.Matrix3D
		{
			throw new away.errors.Error("Object projection matrices are not supported for LightProbe objects!");
		}
	}
}