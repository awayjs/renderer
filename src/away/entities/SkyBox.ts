///<reference path="../_definitions.ts"/>
module away.entities
{

	/**
	 * A SkyBox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
	 * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
	 * the sky box is always as large as possible without being clipped.
	 */
	export class SkyBox extends Entity implements away.base.IRenderable
	{
		// todo: remove SubGeometry, use a simple single buffer with offsets
		private _geometry:away.base.SubGeometry;
		private _material:away.materials.SkyBoxMaterial;
		private _uvTransform:away.geom.Matrix = new away.geom.Matrix();
		private _animator:away.animators.IAnimator;
		
		public get animator():away.animators.IAnimator
		{
			return this._animator;
		}
		
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.NullBounds();
		}
		
		/**
		 * Create a new SkyBox object.
		 * @param cubeMap The CubeMap to use for the sky box's texture.
		 */
		constructor(cubeMap:away.textures.CubeTextureBase)
		{
			super();
			this._material = new away.materials.SkyBoxMaterial(cubeMap);
			this._material.iAddOwner(this);
			this._geometry = new away.base.SubGeometry();
			this.buildGeometry(this._geometry);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexBuffer(index:number , stage3DProxy:away.managers.Stage3DProxy):void
		{
			this._geometry.activateVertexBuffer(index, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy):void
		{
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexNormalBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy):void
		{
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexTangentBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy):void
		{
		}
		
		public activateSecondaryUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy):void
		{
		}
		
		/**
		 * @inheritDoc
		 */
		public getIndexBuffer(stage3DProxy:away.managers.Stage3DProxy):away.display3D.IndexBuffer3D
		{
			return this._geometry.getIndexBuffer(stage3DProxy);
		}
		
		/**
		 * The amount of triangles that comprise the SkyBox geometry.
		 */
		public get numTriangles():number
		{
			return this._geometry.numTriangles;
		}
		
		/**
		 * The entity that that initially provided the IRenderable to the render pipeline.
		 */
		public get sourceEntity():away.entities.Entity
		{
			return null;
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
		 * @inheritDoc
		 */
		public pInvalidateBounds()
		{
			// dead end
		}
		
		/**
		 * @inheritDoc
		 */
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
            var node : away.partition.SkyBoxNode = new away.partition.SkyBoxNode(this)
			return <away.partition.EntityNode> node ;
		}
		
		/**
		 * @inheritDoc
		 */
		public pUpdateBounds()
		{
            this._pBoundsInvalid = false;
		}
		
		/**
		 * Builds the geometry that forms the SkyBox
		 */
		private buildGeometry(target:away.base.SubGeometry):void
		{
			var vertices:Array<number> = new Array<number>(
				-1, 1, -1, 1, 1, -1,
				1, 1, 1, -1, 1, 1,
				-1, -1, -1, 1, -1, -1,
				1, -1, 1, -1, -1, 1
            );

			var indices:Array<number> = new Array<number>(
				0, 1, 2, 2, 3, 0,
				6, 5, 4, 4, 7, 6,
				2, 6, 7, 7, 3, 2,
				4, 5, 1, 1, 0, 4,
				4, 0, 3, 3, 7, 4,
				2, 1, 5, 5, 6, 2
            );
			
			target.updateVertexData(vertices);
			target.updateIndexData(indices);
		}
		
		public get castsShadows():boolean
		{
			return false;
		}
		
		public get uvTransform():away.geom.Matrix
		{
			return this._uvTransform;
		}
		
		public get vertexData():number[]
		{
			return this._geometry.vertexData;
		}
		
		public get indexData():number[]
		{
			return this._geometry.indexData;
		}
		
		public get UVData():number[]
		{
			return this._geometry.UVData;
		}
		
		public get numVertices():number
		{
			return this._geometry.numVertices;
		}
		
		public get vertexStride():number
		{
			return this._geometry.vertexStride;
		}
		
		public get vertexNormalData():number[]
		{
			return this._geometry.vertexNormalData;
		}
		
		public get vertexTangentData():number[]
		{
			return this._geometry.vertexTangentData;
		}
		
		public get vertexOffset():number
		{
			return this._geometry.vertexOffset;
		}
		
		public get vertexNormalOffset():number
		{
			return this._geometry.vertexNormalOffset;
		}
		
		public get vertexTangentOffset():number
		{
			return this._geometry.vertexTangentOffset;
		}
		
		public getRenderSceneTransform(camera:away.cameras.Camera3D):away.geom.Matrix3D
		{

			return this._pSceneTransform
		}
	}
}
