///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{
	/**
	 * @class away.traverse.EntityCollector
	 */
	export class EntityCollector extends CollectorBase
	{
		public _pSkybox:away.pool.RenderableBase;
		public _pLights:Array<away.lights.LightBase>;
		private _directionalLights:Array<away.lights.DirectionalLight>;
		private _pointLights:Array<away.lights.PointLight>;
		private _lightProbes:Array<away.lights.LightProbe>;

		public _pNumLights:number = 0;

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
		 * @param entity
		 */
		public applyDirectionalLight(entity:away.entities.IEntity)
		{
			this._directionalLights[ this._numDirectionalLights++ ] = <away.lights.DirectionalLight> entity;
		}

		/**
		 *
		 * @param entity
		 */
		public applyLightProbe(entity:away.entities.IEntity)
		{
			this._lightProbes[ this._numLightProbes++ ] = <away.lights.LightProbe> entity;
		}

		/**
		 *
		 * @param entity
		 */
		public applyPointLight(entity:away.entities.IEntity)
		{
			this._pointLights[ this._numPointLights++ ] = <away.lights.PointLight> entity;
		}

		/**
		 *
		 */
		public clear()
		{
			super.clear();

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