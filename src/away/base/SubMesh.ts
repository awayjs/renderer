///<reference path="../_definitions.ts"/>
/**
 * @module away.base
 */
module away.base
{

    /**
	 * SubMesh wraps a SubGeometry as a scene graph instantiation. A SubMesh is owned by a Mesh object.
	 *
     *
	 * @see away3d.core.base.SubGeometry
	 * @see away3d.scenegraph.Mesh
     *
     * @class away.base.SubGeometryBase
	 */
	export class SubMesh implements away.base.IRenderable
	{
		public _iMaterial:away.materials.MaterialBase;
		private _parentMesh:away.entities.Mesh;
		private _subGeometry:away.base.ISubGeometry;
		public _iIndex:number = 0;
		private _uvTransform:away.geom.Matrix;
		private _uvTransformDirty:boolean;
		private _uvRotation:number = 0;
		private _scaleU:number = 1;
		private _scaleV:number = 1;
		private _offsetU:number = 0;
		private _offsetV:number = 0;
		
		//public animationSubGeometry:AnimationSubGeometry;// TODO: implement dependencies AnimationSubGeometry
		//public animatorSubGeometry:AnimationSubGeometry;// TODO: implement dependencies AnimationSubGeometry
		
		/**
		 * Creates a new SubMesh object
		 * @param subGeometry The SubGeometry object which provides the geometry data for this SubMesh.
		 * @param parentMesh The Mesh object to which this SubMesh belongs.
		 * @param material An optional material used to render this SubMesh.
		 */
		constructor(subGeometry:away.base.ISubGeometry, parentMesh:away.entities.Mesh, material:away.materials.MaterialBase = null)
		{
			this._parentMesh = parentMesh;
            this._subGeometry = subGeometry;
			this.material = material;
		}
		
		public get shaderPickingDetails():boolean
		{

			return this.sourceEntity.shaderPickingDetails;
		}
		
		public get offsetU():number
		{
			return this._offsetU;
		}
		
		public set offsetU(value:number)
		{
			if (value == this._offsetU)
            {

                return;

            }

			this._offsetU = value;
            this._uvTransformDirty = true;
		}
		
		public get offsetV():number
		{
			return this._offsetV;
		}
		
		public set offsetV(value:number)
		{
			if (value == this._offsetV)
            {

                return;

            }

			this._offsetV = value;
            this._uvTransformDirty = true;

		}
		
		public get scaleU():number
		{
			return this._scaleU;
		}
		
		public set scaleU(value:number)
		{
			if (value == this._scaleU)
            {

                return;

            }

            this._scaleU = value;
            this._uvTransformDirty = true;
		}
		
		public get scaleV():number
		{
			return this._scaleV;
		}
		
		public set scaleV(value:number)
		{
			if (value ==this._scaleV)
            {

                return;

            }

			this._scaleV = value;
            this._uvTransformDirty = true;
		}
		
		public get uvRotation():number
		{
			return this._uvRotation;
		}
		
		public set uvRotation(value:number)
		{
			if (value == this._uvRotation)
            {

                return;

            }

			this._uvRotation = value;
            this._uvTransformDirty = true;
		}
		
		/**
		 * The entity that that initially provided the IRenderable to the render pipeline (ie: the owning Mesh object).
		 */
		public get sourceEntity():away.entities.Entity
		{
			return this._parentMesh;
		}
		
		/**
		 * The SubGeometry object which provides the geometry data for this SubMesh.
		 */
		public get subGeometry():away.base.ISubGeometry
		{
			return this._subGeometry;
		}
		
		public set subGeometry(value:away.base.ISubGeometry)
		{
            this._subGeometry = value;
		}
		
		/**
		 * The material used to render the current SubMesh. If set to null, its parent Mesh's material will be used instead.
		 */
		public get material():away.materials.MaterialBase
		{
			return this._iMaterial || this._parentMesh.material;
		}
		
		public set material(value:away.materials.MaterialBase)
		{

            //away.Debug.throwPIR( 'away.base.Submesh' , 'set material' , 'away.base.MaterialBase _iRemoveOwner , _iAddOwner');
            //*
			if (this._iMaterial)
            {

                this._iMaterial.iRemoveOwner(this);

            }

			this._iMaterial = value;
			
			if (this._iMaterial)
            {

                this._iMaterial.iAddOwner(this);

            }
            //*/
		}
		
		/**
		 * The scene transform object that transforms from model to world space.
		 */
		public get sceneTransform():away.geom.Matrix3D
		{
			return this._parentMesh.sceneTransform;
		}
		
		/**
		 * The inverse scene transform object that transforms from world to model space.
		 */
		public get inverseSceneTransform():away.geom.Matrix3D
		{
			return this._parentMesh.inverseSceneTransform;
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			this._subGeometry.activateVertexBuffer(index, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexNormalBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			this._subGeometry.activateVertexNormalBuffer(index, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexTangentBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			this._subGeometry.activateVertexTangentBuffer(index, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			this._subGeometry.activateUVBuffer(index, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateSecondaryUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
            this._subGeometry.activateSecondaryUVBuffer(index, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public getIndexBuffer(stage3DProxy:away.managers.Stage3DProxy):away.display3D.IndexBuffer3D
		{
			return this._subGeometry.getIndexBuffer(stage3DProxy);
		}
		
		/**
		 * The amount of triangles that make up this SubMesh.
		 */
		public get numTriangles():number
		{
			return this._subGeometry.numTriangles;
		}
		
		/**
		 * The animator object that provides the state for the SubMesh's animation.
		 */
		public get animator():away.animators.IAnimator
		{

			return this._parentMesh.animator;

		}
		/**
		 * Indicates whether the SubMesh should trigger mouse events, and hence should be rendered for hit testing.
		 */
		public get mouseEnabled():boolean
		{


			return this._parentMesh.mouseEnabled || this._parentMesh._iAncestorsAllowMouseEnabled;//this._parentMesh._ancestorsAllowMouseEnabled;
		}
		
		public get castsShadows():boolean
		{
			return this._parentMesh.castsShadows;
		}
		
		/**
		 * A reference to the owning Mesh object
		 *
		 * @private
		 */
		public get iParentMesh():away.entities.Mesh
		{
			return this._parentMesh;
		}
		
		public set iParentMesh(value:away.entities.Mesh)
		{
            this._parentMesh = value;
		}
		
		public get uvTransform():away.geom.Matrix
		{
			if (this._uvTransformDirty)
            {

                this.updateUVTransform();

            }

			return this._uvTransform;
		}
		
		private updateUVTransform()
		{
            if ( this._uvTransform  == null )
            {

                this._uvTransform = new away.geom.Matrix();
                //_uvTransform ||= new Matrix();

            }

			this._uvTransform.identity();

			if (this._uvRotation != 0)
            {

                this._uvTransform.rotate(this._uvRotation);

            }

			if (this._scaleU != 1 || this._scaleV != 1)
            {

                this._uvTransform.scale(this._scaleU, this._scaleV);

            }

            this._uvTransform.translate(this._offsetU, this._offsetV);
            this._uvTransformDirty = false;
		}
		
		public dispose()
		{
            this.material = null;
		}
		
		public get vertexData():number[]
		{
			return this._subGeometry.vertexData;
		}
		
		public get indexData():number[] /*uint*/
		{
			return this._subGeometry.indexData;
		}
		
		public get UVData():number[]
		{
			return this._subGeometry.UVData;
		}
		
		public get bounds():away.bounds.BoundingVolumeBase
		{
			return this._parentMesh.getBounds(); // TODO: return smaller, sub mesh bounds instead
		}
		
		public get visible():boolean
		{
			return this._parentMesh.visible;
		}
		
		public get numVertices():number
		{
			return this._subGeometry.numVertices;
		}
		
		public get vertexStride():number
		{
			return this._subGeometry.vertexStride;
		}
		
		public get UVStride():number
		{
			return this._subGeometry.UVStride;
		}
		
		public get vertexNormalData():number[]
		{
			return this._subGeometry.vertexNormalData;
		}
		
		public get vertexTangentData():number[]
		{
			return this._subGeometry.vertexTangentData;
		}
		
		public get UVOffset():number
		{
			return this._subGeometry.UVOffset;
		}
		
		public get vertexOffset():number
		{
			return this._subGeometry.vertexOffset;
		}
		
		public get vertexNormalOffset():number
		{
			return this._subGeometry.vertexNormalOffset;
		}
		
		public get vertexTangentOffset():number
		{
			return this._subGeometry.vertexTangentOffset;
		}
		
		public getRenderSceneTransform(camera:away.cameras.Camera3D):away.geom.Matrix3D
		{
			return this._parentMesh.sceneTransform;
		}
	}
}
