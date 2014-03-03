///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{
	/**
	 * @class away.traverse.EntityCollector
	 */
	export class EntityCollector extends RenderableCollectorBase
	{
		public _pSkybox:away.pool.RenderableBase;
		public _pLights:Array<away.lights.LightBase>;
		private _directionalLights:Array<away.lights.DirectionalLight>;
		private _pointLights:Array<away.lights.PointLight>;
		private _lightProbes:Array<away.lights.LightProbe>;

		public _pNumLights:number = 0;
		public _pNumEntities:number = 0;
		public _pNumInteractiveEntities:number = 0;
		private _numDirectionalLights:number = 0;
		private _numPointLights:number = 0;
		private _numLightProbes:number = 0;

		/**
		 *
		 */
		public get directionalLights():Array<away.lights.DirectionalLight>
		{
			return this._directionalLights;
		}

		/**
		 *
		 */
		public get lightProbes():Array<away.lights.LightProbe>
		{
			return this._lightProbes;
		}

		/**
		 *
		 */
		public get lights():Array<away.lights.LightBase>
		{
			return this._pLights;
		}

		/**
		 *
		 */
		public get numEntities():number
		{
			return this._pNumEntities;
		}

		/**
		 *
		 */
		public get numInteractiveEntities():number
		{
			return this._pNumInteractiveEntities;
		}

		/**
		 *
		 */
		public get pointLights():Array<away.lights.PointLight>
		{
			return this._pointLights;
		}

		/**
		 *
		 */
		public get skyBox():away.pool.RenderableBase
		{
			return this._pSkybox;
		}

		constructor()
		{
			super();

			this._pLights = new Array<away.lights.LightBase>();
			this._directionalLights = new Array<away.lights.DirectionalLight>();
			this._pointLights = new Array<away.lights.PointLight>();
			this._lightProbes = new Array<away.lights.LightProbe>();
		}

		/**
		 *
		 */
		public applyEntity(entity:away.entities.IEntity)
		{
			super.applyEntity(entity);

			this._pNumEntities++;

			if (entity._iIsMouseEnabled())
				this._pNumInteractiveEntities++;

			if (entity.assetType === away.library.AssetType.LIGHT) {
				this._pLights[ this._pNumLights++ ] = <away.lights.LightBase> entity;

				if (entity instanceof away.lights.DirectionalLight)
					this._directionalLights[ this._numDirectionalLights++ ] = <away.lights.DirectionalLight> entity;
				else if (entity instanceof away.lights.PointLight)
					this._pointLights[ this._numPointLights++ ] = <away.lights.PointLight> entity;
				else if (entity instanceof away.lights.LightProbe)
					this._lightProbes[ this._numLightProbes++ ] = <away.lights.LightProbe> entity;
			}
		}

		/**
		 *
		 */
		public clear()
		{
			super.clear();

			this._pNumEntities = this._pNumInteractiveEntities = 0;
			this._pSkybox = null;

			if (this._pNumLights > 0)
				this._pLights.length = this._pNumLights = 0;

			if (this._numDirectionalLights > 0)
				this._directionalLights.length = this._numDirectionalLights = 0;

			if (this._numPointLights > 0)
				this._pointLights.length = this._numPointLights = 0;

			if (this._numLightProbes > 0)
				this._lightProbes.length = this._numLightProbes = 0;
		}
	}
}