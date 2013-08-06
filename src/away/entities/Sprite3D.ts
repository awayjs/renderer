///<reference path="../_definitions.ts"/>

module away.entities
{

	/**
	 * Sprite3D is a 3D billboard, a renderable rectangular area that is always aligned with the projection plane.
	 * As a result, no perspective transformation occurs on a Sprite3D object.
	 *
	 * todo: mvp generation or vertex shader code can be optimized
	 */
	export class Sprite3D extends away.entities.Entity implements away.base.IRenderable
	{
		// TODO: Replace with CompactSubGeometry
		private static _geometry:away.base.SubGeometry;
		//private static var _pickingSubMesh:SubGeometry;
		
		private _material:away.materials.MaterialBase;
		private _spriteMatrix:away.geom.Matrix3D;
		private _animator:away.animators.IAnimator;
		
		private _pickingSubMesh:away.base.SubMesh;
		private _pickingTransform:away.geom.Matrix3D;
		private _camera:away.cameras.Camera3D;
		
		private _width:number;
		private _height:number;
		private _shadowCaster:boolean = false;
		
		constructor(material:away.materials.MaterialBase, width:number, height:number)
		{
			super();
			this.material = material;
			this._width = width;
            this._height = height;
            this._spriteMatrix = new away.geom.Matrix3D();
			if (!Sprite3D._geometry) {
                Sprite3D._geometry = new away.base.SubGeometry();
                Sprite3D._geometry.updateVertexData(Array<number>(-.5, .5, .0, .5, .5, .0, .5, -.5, .0, -.5, -.5, .0));
                Sprite3D._geometry.updateUVData(Array<number>(.0, .0, 1.0, .0, 1.0, 1.0, .0, 1.0));
                Sprite3D._geometry.updateIndexData(Array<number>(0, 1, 2, 0, 2, 3));
                Sprite3D._geometry.updateVertexTangentData(Array<number>(1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0));
                Sprite3D._geometry.updateVertexNormalData(Array<number>(.0, .0, -1.0, .0, .0, -1.0, .0, .0, -1.0, .0, .0, -1.0));
			}
		}
		
		public set pickingCollider(value:away.pick.IPickingCollider)
		{
			super.setPickingCollider ( value );

			if (value)
            { // bounds collider is the only null value
				this._pickingSubMesh = new away.base.SubMesh(Sprite3D._geometry, null);
                this._pickingTransform = new away.geom.Matrix3D();
			}
		}
		
		public get width():number
		{
			return this._width;
		}
		
		public set width(value:number)
		{
			if (this._width == value)
				return;
            this._width = value;
            this.iInvalidateTransform();
		}
		
		public get height():number
		{
			return this._height;
		}
		
		public set height(value:number)
		{
			if (this._height == value)
				return;
            this._height = value;
            this.iInvalidateTransform();
		}
		
		public activateVertexBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
            Sprite3D._geometry.activateVertexBuffer(index, stage3DProxy);
		}
		
		public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
            Sprite3D._geometry.activateUVBuffer(index, stage3DProxy);
		}
		
		public activateSecondaryUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
            Sprite3D._geometry.activateSecondaryUVBuffer(index, stage3DProxy);
		}
		
		public activateVertexNormalBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
            Sprite3D._geometry.activateVertexNormalBuffer(index, stage3DProxy);
		}
		
		public activateVertexTangentBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
            Sprite3D._geometry.activateVertexTangentBuffer(index, stage3DProxy);
		}
		
		public getIndexBuffer(stage3DProxy:away.managers.Stage3DProxy):away.display3D.IndexBuffer3D
		{
			return Sprite3D._geometry.getIndexBuffer(stage3DProxy);
		}
		
		public get numTriangles():number
		{
			return 2;
		}
		
		public get sourceEntity():Entity
		{
			return this;
		}
		
		public get material():away.materials.MaterialBase
		{
			return this._material;
		}
		
		public set material(value:away.materials.MaterialBase)
		{
			if (value == this._material)
				return;
			if (this._material)
                this._material.iRemoveOwner(this);
            this._material = value;
			if (this._material)
                this._material.iAddOwner(this);
		}
		
		/**
		 * Defines the animator of the mesh. Act on the mesh's geometry. Defaults to null
		 */
		public get animator():away.animators.IAnimator
		{
			return this._animator;
		}
		
		public get castsShadows():boolean
		{
			return this._shadowCaster;
		}
		
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.AxisAlignedBoundingBox();
		}
		
		public pUpdateBounds()
		{
			this._pBounds.fromExtremes(-.5*this._pScaleX, -.5*this._pScaleY, -.5*this._pScaleZ, .5*this._pScaleX, .5*this._pScaleY, .5*this._pScaleZ);
			this._pBoundsInvalid = false;
		}
		
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.RenderableNode(this);
		}
		
		public pUpdateTransform()
		{
			super.pUpdateTransform();
			this._pTransform.prependScale(this._width, this._height, Math.max(this._width, this._height));
		}
		
		public get uvTransform():away.geom.Matrix
		{
			return null;
		}
		
		public get vertexData():number[]
		{
			return Sprite3D._geometry.vertexData;
		}
		
		public get indexData():number[] /*uint*/
		{
			return Sprite3D._geometry.indexData;
		}
		
		public get UVData():number[]
		{
			return Sprite3D._geometry.UVData;
		}
		
		public get numVertices():number
		{
			return Sprite3D._geometry.numVertices;
		}
		
		public get vertexStride():number
		{
			return Sprite3D._geometry.vertexStride;
		}
		
		public get vertexNormalData():number[]
		{
			return Sprite3D._geometry.vertexNormalData;
		}
		
		public get vertexTangentData():number[]
		{
			return Sprite3D._geometry.vertexTangentData;
		}
		
		public get vertexOffset():number
		{
			return Sprite3D._geometry.vertexOffset;
		}
		
		public get vertexNormalOffset():number
		{
			return Sprite3D._geometry.vertexNormalOffset;
		}
		
		public get vertexTangentOffset():number
		{
			return Sprite3D._geometry.vertexTangentOffset;
		}
		
		public iCollidesBefore(shortestCollisionDistance:number, findClosest:boolean):boolean
		{
			findClosest = findClosest;

			var viewTransform:away.geom.Matrix3D = this._camera.inverseSceneTransform.clone();
			viewTransform.transpose();
			var rawViewTransform:number[] = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
			viewTransform.copyRawDataTo(rawViewTransform);
			rawViewTransform[ 3  ] = 0;
			rawViewTransform[ 7  ] = 0;
			rawViewTransform[ 11 ] = 0;
			rawViewTransform[ 12 ] = 0;
			rawViewTransform[ 13 ] = 0;
			rawViewTransform[ 14 ] = 0;
			
			this._pickingTransform.copyRawDataFrom(rawViewTransform);
            this._pickingTransform.prependScale(this._width, this._height, Math.max(this._width, this._height));
            this._pickingTransform.appendTranslation(this.scenePosition.x, this.scenePosition.y, this.scenePosition.z);
            this._pickingTransform.invert();
			
			var localRayPosition:away.geom.Vector3D = this._pickingTransform.transformVector(this._iPickingCollisionVO.rayPosition);
			var localRayDirection:away.geom.Vector3D = this._pickingTransform.deltaTransformVector(this._iPickingCollisionVO.rayDirection);
			
			this._iPickingCollider.setLocalRay(localRayPosition, localRayDirection);
			
			this._iPickingCollisionVO.renderable = null;

			if (this._iPickingCollider.testSubMeshCollision(this._pickingSubMesh, this._iPickingCollisionVO, shortestCollisionDistance))
				this._iPickingCollisionVO.renderable = this._pickingSubMesh;
			
			return this._iPickingCollisionVO.renderable != null;
		}
		
		public getRenderSceneTransform(camera:away.cameras.Camera3D):away.geom.Matrix3D
		{
			var comps:away.geom.Vector3D[] = camera.sceneTransform.decompose();
			var scale:away.geom.Vector3D = comps[2];
			comps[0] = this.scenePosition;
			scale.x = this._width*this._pScaleX;
			scale.y = this._height*this._pScaleY;
			this._spriteMatrix.recompose(comps);
			return this._spriteMatrix;
		}
	}
}
