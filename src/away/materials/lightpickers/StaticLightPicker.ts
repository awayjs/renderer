///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Delegate					= away.utils.Delegate;

	import LightEvent				= away.events.LightEvent;
	import DirectionalLight			= away.lights.DirectionalLight;
	import LightBase				= away.lights.LightBase;
	import LightProbe				= away.lights.LightProbe;
	import PointLight				= away.lights.PointLight;

	/**
	 * StaticLightPicker is a light picker that provides a static set of lights. The lights can be reassigned, but
	 * if the configuration changes (number of directional lights, point lights, etc), a material recompilation may
	 * occur.
	 */
	export class StaticLightPicker extends LightPickerBase
	{
		private _lights:Array<any>;
		private _onCastShadowChangeDelegate:Function;

		/**
		 * Creates a new StaticLightPicker object.
		 * @param lights The lights to be used for shading.
		 */
		constructor(lights)
		{
			super();

			this._onCastShadowChangeDelegate = Delegate.create(this, this.onCastShadowChange);

			this.lights = lights;
		}

		/**
		 * The lights used for shading.
		 */
		public get lights()
		{
			return this._lights;
		}

		public set lights(value:Array<any>)
		{
			var numPointLights:number = 0;
			var numDirectionalLights:number = 0;
			var numCastingPointLights:number = 0;
			var numCastingDirectionalLights:number = 0;
			var numLightProbes:number = 0;
			var light:LightBase;

			if (this._lights)
				this.clearListeners();

			this._lights = value;
			this._pAllPickedLights = value;
			this._pPointLights = new Array<PointLight>();
			this._pCastingPointLights = new Array<PointLight>();
			this._pDirectionalLights = new Array<DirectionalLight>();
			this._pCastingDirectionalLights = new Array<DirectionalLight>();
			this._pLightProbes = new Array<LightProbe>();

			var len:number = value.length;

			for (var i:number = 0; i < len; ++i) {
				light = value[i];
				light.addEventListener(LightEvent.CASTS_SHADOW_CHANGE, this._onCastShadowChangeDelegate);

				if (light instanceof PointLight) {
					if (light.castsShadows)
						this._pCastingPointLights[numCastingPointLights++] = <PointLight> light; else
						this._pPointLights[numPointLights++] = <PointLight> light;

				} else if (light instanceof DirectionalLight) {
					if (light.castsShadows)
						this._pCastingDirectionalLights[numCastingDirectionalLights++] = <DirectionalLight> light; else
						this._pDirectionalLights[numDirectionalLights++] = <DirectionalLight> light;

				} else if (light instanceof LightProbe) {
					this._pLightProbes[numLightProbes++] = <LightProbe> light;

				}
			}

			if (this._pNumDirectionalLights == numDirectionalLights && this._pNumPointLights == numPointLights && this._pNumLightProbes == numLightProbes && this._pNumCastingPointLights == numCastingPointLights && this._pNumCastingDirectionalLights == numCastingDirectionalLights) {
				return;
			}

			this._pNumDirectionalLights = numDirectionalLights;
			this._pNumCastingDirectionalLights = numCastingDirectionalLights;
			this._pNumPointLights = numPointLights;
			this._pNumCastingPointLights = numCastingPointLights;
			this._pNumLightProbes = numLightProbes;

			// MUST HAVE MULTIPLE OF 4 ELEMENTS!
			this._pLightProbeWeights = new Array<number>(Math.ceil(numLightProbes/4)*4);

			// notify material lights have changed
			this.dispatchEvent(new away.events.Event(away.events.Event.CHANGE));

		}

		/**
		 * Remove configuration change listeners on the lights.
		 */
		private clearListeners()
		{
			var len:number = this._lights.length;
			for (var i:number = 0; i < len; ++i)
				this._lights[i].removeEventListener(away.events.LightEvent.CASTS_SHADOW_CHANGE, this._onCastShadowChangeDelegate);
		}

		/**
		 * Notifies the material of a configuration change.
		 */
		private onCastShadowChange(event:away.events.LightEvent)
		{
			// TODO: Assign to special caster collections, just append it to the lights in SinglePass
			// But keep seperated in multipass

			var light:LightBase = <LightBase> event.target;

			if (light instanceof PointLight) {

				var pl:PointLight = <PointLight> light;
				this.updatePointCasting(pl);

			} else if (light instanceof DirectionalLight) {

				var dl:DirectionalLight = <DirectionalLight> light;
				this.updateDirectionalCasting(dl);

			}

			this.dispatchEvent(new away.events.Event(away.events.Event.CHANGE));
		}

		/**
		 * Called when a directional light's shadow casting configuration changes.
		 */
		private updateDirectionalCasting(light:DirectionalLight)
		{

			var dl:DirectionalLight = <DirectionalLight> light;

			if (light.castsShadows) {
				--this._pNumDirectionalLights;
				++this._pNumCastingDirectionalLights;


				this._pDirectionalLights.splice(this._pDirectionalLights.indexOf(dl), 1);
				this._pCastingDirectionalLights.push(light);

			} else {
				++this._pNumDirectionalLights;
				--this._pNumCastingDirectionalLights;

				this._pCastingDirectionalLights.splice(this._pCastingDirectionalLights.indexOf(dl), 1);
				this._pDirectionalLights.push(light);
			}
		}

		/**
		 * Called when a point light's shadow casting configuration changes.
		 */
		private updatePointCasting(light:PointLight)
		{

			var pl:PointLight = <PointLight> light;

			if (light.castsShadows) {

				--this._pNumPointLights;
				++this._pNumCastingPointLights;
				this._pPointLights.splice(this._pPointLights.indexOf(pl), 1);
				this._pCastingPointLights.push(light);

			} else {

				++this._pNumPointLights;
				--this._pNumCastingPointLights;

				this._pCastingPointLights.splice(this._pCastingPointLights.indexOf(pl), 1);
				this._pPointLights.push(light);

			}
		}
	}
}
