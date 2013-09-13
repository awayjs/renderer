///<reference path="../_definitions.ts"/>
/**
 * @module away.base
 */
module away.base
{
    /**
     *
	 * Geometry is a collection of SubGeometries, each of which contain the actual geometrical data such as vertices,
	 * normals, uvs, etc. It also contains a reference to an animation class, which defines how the geometry moves.
	 * A Geometry object is assigned to a Mesh, a scene graph occurence of the geometry, which in turn assigns
	 * the SubGeometries to its respective SubMesh objects.
	 *
	 *
	 *
	 * @see away3d.core.base.SubGeometry
	 * @see away3d.scenegraph.Mesh
     *
     * @class away.base.Geometry
	 */
	export class Geometry extends away.library.NamedAssetBase implements away.library.IAsset
	{
        private _subGeometries:away.base.ISubGeometry[];//Vector.<ISubGeometry>;//private var _subGeometries:Vector.<ISubGeometry>;
		
		public get assetType():string
		{

			return away.library.AssetType.GEOMETRY;

		}
		
		/**
		 * A collection of SubGeometry objects, each of which contain geometrical data such as vertices, normals, etc.
		 */
        public get subGeometries():away.base.ISubGeometry[]//Vector.<ISubGeometry>
        {

            return this._subGeometries;

        }
        public getSubGeometries():away.base.ISubGeometry[]//Vector.<ISubGeometry>
        {

            return this._subGeometries;

        }

        /**
		 * Creates a new Geometry object.
		 */
		constructor()
		{
            super();

            this._subGeometries = new Array<away.base.ISubGeometry>();//Vector.<ISubGeometry>();

		}
		
		public applyTransformation(transform:away.geom.Matrix3D)
		{
			var len:number = this._subGeometries.length;
			for (var i:number = 0; i < len; ++i)
            {

                this._subGeometries[i].applyTransformation(transform);

            }

		}
		
		/**
		 * Adds a new SubGeometry object to the list.
		 * @param subGeometry The SubGeometry object to be added.
		 */
		public addSubGeometry(subGeometry:away.base.ISubGeometry)
		{
			this._subGeometries.push(subGeometry);
			
			subGeometry.parentGeometry = this;

            // TODO: add hasEventListener optimisation;
			//if (hasEventListener(GeometryEvent.SUB_GEOMETRY_ADDED))
			this.dispatchEvent(new away.events.GeometryEvent(away.events.GeometryEvent.SUB_GEOMETRY_ADDED, subGeometry));
			
			this.iInvalidateBounds(subGeometry);

		}
		
		/**
		 * Removes a new SubGeometry object from the list.
		 * @param subGeometry The SubGeometry object to be removed.
		 */
		public removeSubGeometry(subGeometry:ISubGeometry)
		{
			this._subGeometries.splice(this._subGeometries.indexOf(subGeometry), 1);

			subGeometry.parentGeometry = null;

            // TODO: add hasEventListener optimisation;
			//if (hasEventListener(GeometryEvent.SUB_GEOMETRY_REMOVED))
				this.dispatchEvent(new away.events.GeometryEvent(away.events.GeometryEvent.SUB_GEOMETRY_REMOVED, subGeometry));

            this.iInvalidateBounds( subGeometry );
		}
		
		/**
		 * Clones the geometry.
		 * @return An exact duplicate of the current Geometry object.
		 */
		public clone():Geometry
		{
			var clone:Geometry = new Geometry();
			var len:number = this._subGeometries.length;

			for (var i:number = 0; i < len; ++i)
            {

                clone.addSubGeometry(this._subGeometries[i].clone());

            }

			return clone;
		}
		
		/**
		 * Scales the geometry.
		 * @param scale The amount by which to scale.
		 */
		public scale(scale:number)
		{
			var numSubGeoms:number = this._subGeometries.length;
			for (var i:number = 0; i < numSubGeoms; ++i)
            {

                this._subGeometries[i].scale(scale);

            }

		}
		
		/**
		 * Clears all resources used by the Geometry object, including SubGeometries.
		 */
		public dispose()
		{

			var numSubGeoms:number = this._subGeometries.length;
			
			for (var i:number = 0; i < numSubGeoms; ++i)
            {
				var subGeom:ISubGeometry = this._subGeometries[0];
                this.removeSubGeometry(subGeom);
				subGeom.dispose();
			}

		}
		
		/**
		 * Scales the uv coordinates (tiling)
		 * @param scaleU The amount by which to scale on the u axis. Default is 1;
		 * @param scaleV The amount by which to scale on the v axis. Default is 1;
		 */
		public scaleUV(scaleU:number = 1, scaleV:number = 1)
		{
			var numSubGeoms:number = this._subGeometries.length;

			for (var i:number = 0; i < numSubGeoms; ++i)
            {

                this._subGeometries[i].scaleUV(scaleU, scaleV);

            }

		}
		
		/**
		 * Updates the SubGeometries so all vertex data is represented in different buffers.
		 * Use this for compatibility with Pixel Bender and PBPickingCollider
		 */
		public convertToSeparateBuffers()
		{
			var subGeom:away.base.ISubGeometry;
			var numSubGeoms:number = this._subGeometries.length;
			var _removableCompactSubGeometries:away.base.CompactSubGeometry[] = new Array<away.base.CompactSubGeometry>();//Vector.<CompactSubGeometry> = new Vector.<CompactSubGeometry>();

			for (var i:number = 0; i < numSubGeoms; ++i)
            {
				subGeom = this._subGeometries[i];

				if (subGeom instanceof away.base.SubGeometry)
                {

                    continue;

                }


				_removableCompactSubGeometries.push( <away.base.CompactSubGeometry> subGeom);

				this.addSubGeometry(subGeom.cloneWithSeperateBuffers());
			}

            var l : number = _removableCompactSubGeometries.length;
            var s : away.base.CompactSubGeometry;

            for ( var c : number = 0 ; c  < l ; c++ )
            {

                s = _removableCompactSubGeometries[c];
                this.removeSubGeometry( s );
                s.dispose();

            }

		}
		
		public iValidate()
		{
			// To be overridden when necessary
		}
		
		public iInvalidateBounds(subGeom:ISubGeometry)
		{
			//if (hasEventListener(GeometryEvent.BOUNDS_INVALID))
			this.dispatchEvent(new away.events.GeometryEvent(away.events.GeometryEvent.BOUNDS_INVALID, subGeom));

		}

	}

}
