///<reference path="../_definitions.ts"/>

module away.prefabs
{
//	import BatchObject				= away.base.BatchObject;
	import DisplayObject			= away.base.DisplayObject;
	import Geometry					= away.base.Geometry;
	import SubGeometryBase			= away.base.SubGeometryBase;
	import TriangleSubGeometry		= away.base.TriangleSubGeometry;
	import LineSubGeometry			= away.base.LineSubGeometry;
	import Mesh						= away.entities.Mesh;
	import AbstractMethodError		= away.errors.AbstractMethodError;
	import IMaterial				= away.materials.IMaterial;

	/**
	 * PrimitivePrefabBase is an abstract base class for polytope prefabs, which are simple pre-built geometric shapes
	 */
	export class PrimitivePrefabBase extends PrefabBase
	{
		public _geomDirty:boolean = true;
		public _uvDirty:boolean = true;

		private _material:IMaterial;
		private _geometry:Geometry;
		private _subGeometry:SubGeometryBase;
		private _geometryType:string;
		private _geometryTypeDirty:boolean = true;


		/**
		 *
		 */
		public get assetType():string
		{
			return away.library.AssetType.PRIMITIVE_PREFAB;
		}

		/**
		 * 
		 */
		public get geometryType():string
		{
			return this._geometryType;
		}
		
		public set geometryType(value:string)
		{
			if (this._geometryType == value)
				return;

			this._geometryType = value;
			
			this.invalidateGeometryType();
		}

		public get geometry():Geometry
		{
			this._iValidate();

			return this._geometry;
		}

		/**
		 * The material with which to render the primitive.
		 */
		public get material():IMaterial
		{
			return this._material;
		}

		public set material(value:IMaterial)
		{
			if (value == this._material)
				return;

			this._material = value;

			var len:number = this._pObjects.length;
			for (var i:number = 0; i < len; i++)
				(<away.entities.Mesh> this._pObjects[i]).material = this._material;
		}

		/**
		 * Creates a new PrimitivePrefabBase object.
		 *
		 * @param material The material with which to render the object
		 */
		constructor(material:IMaterial = null, geometryType:string = "triangleSubGeometry")
		{
			super();

			this._geometry = new Geometry();
			this._material = material;
			this._geometryType = geometryType;
		}

		/**
		 * Builds the primitive's geometry when invalid. This method should not be called directly. The calling should
		 * be triggered by the invalidateGeometry method (and in turn by updateGeometry).
		 */
		public _pBuildGeometry(target:SubGeometryBase, geometryType:string)
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Builds the primitive's uv coordinates when invalid. This method should not be called directly. The calling
		 * should be triggered by the invalidateUVs method (and in turn by updateUVs).
		 */
		public _pBuildUVs(target:SubGeometryBase, geometryType:string)
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Invalidates the primitive's geometry type, causing it to be updated when requested.
		 */
		public invalidateGeometryType()
		{
			this._geometryTypeDirty = true;
			this._geomDirty = true;
			this._uvDirty = true;
		}
		
		/**
		 * Invalidates the primitive's geometry, causing it to be updated when requested.
		 */
		public _pInvalidateGeometry()
		{
			this._geomDirty = true;
		}

		/**
		 * Invalidates the primitive's uv coordinates, causing them to be updated when requested.
		 */
		public _pInvalidateUVs()
		{
			this._uvDirty = true;
		}

		/**
		 * Updates the subgeometry when invalid.
		 */
		private updateGeometryType()
		{
			//remove any existing sub geometry
			if (this._subGeometry)
				this._geometry.removeSubGeometry(this._subGeometry);

			if (this._geometryType == "triangleSubGeometry") {
				var triangleGeometry:TriangleSubGeometry = new TriangleSubGeometry(true);
				triangleGeometry.autoDeriveNormals = false;
				triangleGeometry.autoDeriveTangents = false;
				triangleGeometry.autoDeriveUVs = false;
				this._geometry.addSubGeometry(triangleGeometry);
				this._subGeometry = triangleGeometry;
			} else if (this._geometryType == "lineSubGeometry") {
				this._geometry.addSubGeometry(this._subGeometry = new LineSubGeometry());
			}

			this._geometryTypeDirty = false;
		}

		
		/**
		 * Updates the geometry when invalid.
		 */
		private updateGeometry()
		{
			this._pBuildGeometry(this._subGeometry, this._geometryType);

			this._geomDirty = false;
		}

		/**
		 * Updates the uv coordinates when invalid.
		 */
		private updateUVs()
		{
			this._pBuildUVs(this._subGeometry, this._geometryType);

			this._uvDirty = false;
		}

		public _iValidate()
		{
			if (this._geometryTypeDirty)
				this.updateGeometryType();
			
			if (this._geomDirty)
				this.updateGeometry();

			if (this._uvDirty)
				this.updateUVs();
		}


		public _pCreateObject():DisplayObject
		{
			var mesh:Mesh = new Mesh(this._geometry, this._material);
			mesh._iSourcePrefab = this;

			return mesh;
		}


//		public _pCreateBatchObject():BatchObject
//		{
//			var batch:BatchObject = new BatchObject(this._geometry, this._material);
//			batch._iSourcePrefab = this;
//
//			return batch;
//		}
	}
}
