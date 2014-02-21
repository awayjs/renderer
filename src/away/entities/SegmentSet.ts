///<reference path="../_definitions.ts"/>


module away.entities
{
	import SegmentSubGeometry			= away.base.SegmentSubGeometry;

	export class SegmentSet extends away.base.DisplayObject implements IEntity, away.base.IMaterialOwner
	{
		private _uvTransform:away.geom.UVTransform;

		private _material:away.materials.MaterialBase;
		private _animator:away.animators.IAnimator;
		public _pSubGeometry:SegmentSubGeometry;

		/**
		 *
		 */
		public get animator():away.animators.IAnimator
		{
			return this._animator;
		}

		/**
		 *
		 */
		public get assetType():string
		{
			return away.library.AssetType.SEGMENT_SET;
		}

		/**
		 *
		 */
		public get castsShadows():boolean
		{
			return false;
		}

		/**
		 *
		 */
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
		 *
		 */
		public get subGeometry():SegmentSubGeometry
		{
			return this._pSubGeometry;
		}

		/**
		 *
		 */
		public get uvTransform():away.geom.UVTransform
		{
			return this._uvTransform;
		}

		/**
		 *
		 */
		constructor()
		{
			super();

			this._pIsEntity = true;

			this.material = new away.materials.SegmentMaterial();

			this._pSubGeometry = new SegmentSubGeometry();
			this._uvTransform = new away.geom.UVTransform(this);
		}

		/**
		 * //TODO
		 *
		 * @param segment
		 */
		public addSegment(segment:away.base.Segment)
		{
			this._pSubGeometry.addSegment(segment);

			this._pBoundsInvalid = true;
		}

		/**
		 * //TODO
		 *
		 * @param index
		 * @returns {*}
		 */
		public getSegment(index:number):away.base.Segment
		{
			return this._pSubGeometry.getSegment(index);
		}

		/**
		 * //TODO
		 *
		 * @param index
		 * @param dispose
		 */
		public removeSegmentByIndex(index:number, dispose:boolean = false)
		{
			this._pSubGeometry.removeSegmentByIndex(index, dispose);

			this._pBoundsInvalid = true;
		}

		/**
		 * //TODO
		 */
		public removeAllSegments()
		{
			this._pSubGeometry.removeAllSegments();

			this._pBoundsInvalid = true;
		}

		/**
		 * //TODO
		 *
		 * @param segment
		 * @param dispose
		 */
		public removeSegment(segment:away.base.Segment, dispose:boolean = false)
		{
			this._pSubGeometry.removeSegment(segment, dispose);

			this._pBoundsInvalid = true;
		}

		/**
		 * //TODO
		 */
		public dispose()
		{
			super.dispose();

			this._pSubGeometry.dispose();

			this._material = null;
		}

		/**
		 * @protected
		 */
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.EntityNode(this);
		}

		/**
		 * //TOOD
		 *
		 * @returns {away.bounds.BoundingSphere}
		 *
		 * @protected
		 */
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.BoundingSphere();
		}

		/**
		 * //TODO
		 *
		 * @protected
		 */
		public pUpdateBounds()
		{
			this._pSubGeometry.updateBounds(this._pBounds);

			super.pUpdateBounds();
		}

		/**
		 * //TODO
		 *
		 * @internal
		 */
		public _iSetUVMatrixComponents(offsetU:number, offsetV:number, scaleU:number, scaleV:number, rotationUV:number)
		{

		}

		/**
		 * //TODO
		 *
		 * @internal
		 */
		public _iIsMouseEnabled():boolean
		{
			return false;
		}
	}
}
