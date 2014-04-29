///<reference path="../_definitions.ts"/>

module away.lights
{
	export class PointLight extends away.lights.LightBase implements away.entities.IEntity
	{
		public _pRadius:number = 90000;
		public _pFallOff:number = 100000;
		public _pFallOffFactor:number;

		constructor()
		{
			super();

			this._pIsEntity = true;

			this._pFallOffFactor = 1/(this._pFallOff*this._pFallOff - this._pRadius*this._pRadius);
		}

		public pCreateShadowMapper():away.lights.ShadowMapperBase
		{
			return new away.lights.CubeMapShadowMapper();
		}

		public get radius():number
		{
			return this._pRadius;
		}

		public set radius(value:number)
		{
			this._pRadius = value;

			if (this._pRadius < 0) {
				this._pRadius = 0;
			} else if (this._pRadius > this._pFallOff) {
				this._pFallOff = this._pRadius;
				this.pInvalidateBounds();
			}
			this._pFallOffFactor = 1/( this._pFallOff*this._pFallOff - this._pRadius*this._pRadius );
		}

		public iFallOffFactor():number
		{
			return this._pFallOffFactor;
		}

		public get fallOff():number
		{
			return this._pFallOff;
		}

		public set fallOff(value:number)
		{
			this._pFallOff = value;

			if (this._pFallOff < 0)
				this._pFallOff = 0;

			if (this._pFallOff < this._pRadius)
				this._pRadius = this._pFallOff;

			this._pFallOffFactor = 1/( this._pFallOff*this._pFallOff - this._pRadius*this._pRadius);
			this.pInvalidateBounds();
		}

		/**
		 * @protected
		 */
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.PointLightNode(this);
		}

		public pUpdateBounds()
		{
			this._pBounds.fromSphere(new away.geom.Vector3D(), this._pFallOff);
			this._pBoundsInvalid = false;
		}

		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.BoundingSphere();
		}

		public iGetObjectProjectionMatrix(entity:away.entities.IEntity, camera:away.entities.Camera, target:away.geom.Matrix3D = null):away.geom.Matrix3D
		{
			var raw:number[] = new Array<number>(16);
			var bounds:away.bounds.BoundingVolumeBase = entity.bounds;
			var m:away.geom.Matrix3D = new away.geom.Matrix3D();

			// todo: do not use lookAt on Light
			m.copyFrom(entity.getRenderSceneTransform(camera));
			m.append(this._pParent.inverseSceneTransform);
			this.lookAt(m.position);

			m.copyFrom(entity.getRenderSceneTransform(camera));
			m.append(this.inverseSceneTransform);

			var box:away.geom.Box = bounds.aabb;
			var v1:away.geom.Vector3D = m.deltaTransformVector(new away.geom.Vector3D(box.left, box.bottom, box.front));
			var v2:away.geom.Vector3D = m.deltaTransformVector(new away.geom.Vector3D(box.right, box.top, box.back));
			var d1:number = v1.x*v1.x + v1.y*v1.y + v1.z*v1.z;
			var d2:number = v2.x*v2.x + v2.y*v2.y + v2.z*v2.z;
			var d:number = Math.sqrt(d1 > d2? d1 : d2);
			var zMin:number;
			var zMax:number;

			var z:number = m.rawData[14];
			zMin = z - d;
			zMax = z + d;

			raw[5] = raw[0] = zMin/d;
			raw[10] = zMax/(zMax - zMin);
			raw[11] = 1;
			raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[12] = raw[13] = raw[15] = 0;
			raw[14] = -zMin*raw[10];

			if (!target)
				target = new away.geom.Matrix3D();

			target.copyRawDataFrom(raw);
			target.prepend(m);

			return target;
		}

		public _iCollectRenderables(renderer:away.render.IRenderer)
		{
			//nothing to do here
		}
	}
}