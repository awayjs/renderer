///<reference path="../../_definitions.ts"/>

/**
 * @module away.base
 */
module away.base
{
	/**
	 * SubMesh wraps a SubGeometry as a scene graph instantiation. A SubMesh is owned by a Mesh object.
	 *
	 *
	 * @see away.base.SubGeometry
	 * @see away.entities.Mesh
	 *
	 * @class away.base.SubMesh
	 */
	export class SubMesh extends away.library.NamedAssetBase implements IMaterialOwner
	{
		public _iMaterial:away.materials.MaterialBase;
		private _parentMesh:away.entities.Mesh;
		private _subGeometry:ISubGeometry;
		private _uvTransform:away.geom.UVTransform;

		public _iIndex:number = 0;
		public animationSubGeometry:away.animators.AnimationSubGeometry;
		public animatorSubGeometry:away.animators.AnimationSubGeometry;

		private _renderables:Array<away.pool.IRenderable> = new Array<away.pool.IRenderable>();

		//TODO test shader picking
//		public get shaderPickingDetails():boolean
//		{
//
//			return this.sourceEntity.shaderPickingDetails;
//		}

		/**
		 * The animator object that provides the state for the SubMesh's animation.
		 */
		public get animator():away.animators.IAnimator
		{
			return this._parentMesh.animator;
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
			if (this._iMaterial)
				this._iMaterial.iRemoveOwner(this);

			this._iMaterial = value;

			if (this._iMaterial)
				this._iMaterial.iAddOwner(this);
		}

		/**
		 * The scene transform object that transforms from model to world space.
		 */
		public get sceneTransform():away.geom.Matrix3D
		{
			return this._parentMesh.sceneTransform;
		}

		/**
		 * The entity that that initially provided the IRenderable to the render pipeline (ie: the owning Mesh object).
		 */
		public get sourceEntity():away.entities.IEntity
		{
			return this._parentMesh;
		}

		/**
		 * The SubGeometry object which provides the geometry data for this SubMesh.
		 */
		public get subGeometry():ISubGeometry
		{
			return this._subGeometry;
		}

		public set subGeometry(value:ISubGeometry)
		{
			this._subGeometry = value; //TODO remove setter
		}

		/**
		 *
		 */
		public get uvTransform():away.geom.UVTransform
		{
			return this._uvTransform;
		}

		/**
		 * Creates a new SubMesh object
		 * @param subGeometry The SubGeometry object which provides the geometry data for this SubMesh.
		 * @param parentMesh The Mesh object to which this SubMesh belongs.
		 * @param material An optional material used to render this SubMesh.
		 */
		constructor(subGeometry:ISubGeometry, parentMesh:away.entities.Mesh, material:away.materials.MaterialBase = null)
		{
			super();

			this._parentMesh = parentMesh;
			this._subGeometry = subGeometry;
			this.material = material;

			this._uvTransform = new away.geom.UVTransform(this);
		}

		/**
		 * 
		 */
		public dispose()
		{
			this.material = null;

			var len:number = this._renderables.length;
			for (var i:number = 0; i < len; i++)
				this._renderables[i].dispose();
		}
		
		/**
		 * 
		 * @param camera
		 * @returns {away.geom.Matrix3D}
		 */
		public getRenderSceneTransform(camera:away.entities.Camera):away.geom.Matrix3D
		{
			return this._parentMesh.getRenderSceneTransform(camera);
		}

		public _iAddRenderable(renderable:away.pool.IRenderable):away.pool.IRenderable
		{
			this._renderables.push(renderable);

			return renderable;
		}


		public _iRemoveRenderable(renderable:away.pool.IRenderable):away.pool.IRenderable
		{
			var index:number = this._renderables.indexOf(renderable);

			this._renderables.splice(index, 1);

			return renderable;
		}

		/**
		 * @internal
		 */
		public _iSetUVMatrixComponents(offsetU:number, offsetV:number, scaleU:number, scaleV:number, rotationUV:number)
		{

		}
	}
}
