///<reference path="../_definitions.ts" />

module away.lights
{
	import BoundingVolumeBase		= away.bounds.BoundingVolumeBase;
	import NullBounds				= away.bounds.NullBounds;
	import Camera					= away.entities.Camera;
	import IEntity					= away.entities.IEntity;
	import Matrix3D					= away.geom.Matrix3D;
	import Vector3D					= away.geom.Vector3D;
	import DirectionalLightNode		= away.partition.DirectionalLightNode;
	import EntityNode				= away.partition.EntityNode;
	import IRenderer				= away.render.IRenderer;

	export class DirectionalLight extends LightBase implements away.entities.IEntity
	{
		private _direction:Vector3D;
		private _tmpLookAt:Vector3D;
		private _sceneDirection:Vector3D;
		private _projAABBPoints:Array<number>;

		constructor(xDir:number = 0, yDir:number = -1, zDir:number = 1)
		{
			super();

			this._pIsEntity = true;

			this.direction = new Vector3D(xDir, yDir, zDir);

			this._sceneDirection = new Vector3D();
		}

		public get sceneDirection():Vector3D
		{
			if (this._pSceneTransformDirty)
				this.pUpdateSceneTransform();

			return this._sceneDirection;
		}

		public get direction():Vector3D
		{
			return this._direction;
		}

		public set direction(value:Vector3D)
		{
			this._direction = value;

			if (!this._tmpLookAt)
				this._tmpLookAt = new Vector3D();

			this._tmpLookAt.x = this.x + this._direction.x;
			this._tmpLookAt.y = this.y + this._direction.y;
			this._tmpLookAt.z = this.z + this._direction.z;

			this.lookAt(this._tmpLookAt);
		}

		//@override
		public pGetDefaultBoundingVolume():BoundingVolumeBase
		{
			return new NullBounds();
		}

		//@override
		public pUpdateBounds()
		{
		}

		//@override
		public pUpdateSceneTransform()
		{
			super.pUpdateSceneTransform();
			this.sceneTransform.copyColumnTo(2, this._sceneDirection);
			this._sceneDirection.normalize();
		}

		//@override
		public pCreateShadowMapper():ShadowMapperBase
		{
			return new DirectionalShadowMapper();
		}

		/**
		 * @protected
		 */
		public pCreateEntityPartitionNode():EntityNode
		{
			return new DirectionalLightNode(this);
		}

		//override
		public iGetObjectProjectionMatrix(entity:IEntity, camera:Camera, target:Matrix3D = null):Matrix3D
		{
			var raw:Array<number> = new Array<number>();
			var bounds:BoundingVolumeBase = entity.bounds;
			var m:Matrix3D = new Matrix3D();

			m.copyFrom(entity.getRenderSceneTransform(camera));
			m.append(this.inverseSceneTransform);

			if (!this._projAABBPoints)
				this._projAABBPoints = [];

			m.transformVectors(bounds.aabbPoints, this._projAABBPoints);

			var xMin:number = Infinity, xMax:number = -Infinity;
			var yMin:number = Infinity, yMax:number = -Infinity;
			var zMin:number = Infinity, zMax:number = -Infinity;
			var d:number;
			for (var i:number = 0; i < 24;) {
				d = this._projAABBPoints[i++];

				if (d < xMin)
					xMin = d;

				if (d > xMax)
					xMax = d;

				d = this._projAABBPoints[i++];

				if (d < yMin)
					yMin = d;

				if (d > yMax)
					yMax = d;

				d = this._projAABBPoints[i++];

				if (d < zMin)
					zMin = d;

				if (d > zMax)
					zMax = d;
			}

			var invXRange:number = 1/(xMax - xMin);
			var invYRange:number = 1/(yMax - yMin);
			var invZRange:number = 1/(zMax - zMin);
			raw[0] = 2*invXRange;
			raw[5] = 2*invYRange;
			raw[10] = invZRange;
			raw[12] = -(xMax + xMin)*invXRange;
			raw[13] = -(yMax + yMin)*invYRange;
			raw[14] = -zMin*invZRange;
			raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
			raw[15] = 1;

			if (!target)
				target = new Matrix3D();

			target.copyRawDataFrom(raw);
			target.prepend(m);

			return target;
		}

		public _iCollectRenderables(renderer:IRenderer)
		{
			//nothing to do here
		}
	}
}