///<reference path="../_definitions.ts"/>

module away.entities
{

	/**
	 * A Skybox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
	 * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
	 * the sky box is always as large as possible without being clipped.
	 */
	export class Skybox extends away.base.DisplayObject implements IEntity, away.base.IMaterialOwner
	{
		private _uvTransform:away.geom.UVTransform;

		private _material:away.materials.SkyboxMaterial;
		private _animator:away.animators.AnimatorBase;

		public get animator():away.animators.AnimatorBase
		{
			return this._animator;
		}

		/**
		 *
		 */
		public get uvTransform():away.geom.UVTransform
		{
			return this._uvTransform;
		}

		/**
		 * Create a new Skybox object.
		 * @param cubeMap The CubeMap to use for the sky box's texture.
		 */
		constructor(cubeMap:away.textures.CubeTextureBase)
		{
			super();

			this._pIsEntity = true;

			//create material
			this._material = new away.materials.SkyboxMaterial(cubeMap);
			this._material.iAddOwner(this);

			this._uvTransform = new away.geom.UVTransform(this);
		}

		/**
		 * The material with which to render the object.
		 */
		public get material():away.materials.MaterialBase
		{
			return this._material;
		}

		public set material(value:away.materials.MaterialBase)
		{
			throw new away.errors.AbstractMethodError("Unsupported method!");
		}

		public get assetType():string
		{
			return away.library.AssetType.SKYBOX;
		}

		/**
		 * @protected
		 */
		public pInvalidateBounds()
		{
			// dead end
		}

		/**
		 * @protected
		 */
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.SkyboxNode(this);
		}

		/**
		 * @protected
		 */
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return <away.bounds.BoundingVolumeBase> new away.bounds.NullBounds();
		}

		/**
		 * @protected
		 */
		public pUpdateBounds()
		{
			this._pBoundsInvalid = false;
		}

		public get castsShadows():boolean
		{
			return false; //TODO
		}


		/**
		 * @internal
		 */
		public _iSetUVMatrixComponents(offsetU:number, offsetV:number, scaleU:number, scaleV:number, rotationUV:number)
		{

		}
	}
}
