///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import flash.events.Event;
	
	//import away3d.events.LightEvent;
	//import away3d.lights.DirectionalLight;
	//import away3d.lights.LightBase;
	//import away3d.lights.LightProbe;
	//import away3d.lights.PointLight;

	/**
	 * StaticLightPicker is a light picker that provides a static set of lights. The lights can be reassigned, but
	 * if the configuration changes (number of directional lights, point lights, etc), a material recompilation may
	 * occur.
	 */
	export class StaticLightPicker extends LightPickerBase
	{
		private _lights : any[] ; // not typed in AS3 - should it be lightbase ?

		/**
		 * Creates a new StaticLightPicker object.
		 * @param lights The lights to be used for shading.
		 */
		constructor(lights)
		{
            super();
			this.lights = lights;
		}

		/**
		 * The lights used for shading.
		 */
		public get lights()
		{
			return this._lights;
		}

		public set lights(value : any[] )
		{
			var numPointLights:number = 0;
			var numDirectionalLights:number = 0;
			var numCastingPointLights:number = 0;
			var numCastingDirectionalLights:number = 0;
			var numLightProbes:number = 0;
			var light:away.lights.LightBase;
			
			if (this._lights)
				this.clearListeners();
			
			this._lights = value;
			this._pAllPickedLights = value;
            this._pPointLights = new Array<away.lights.PointLight>();
            this._pCastingPointLights = new Array<away.lights.PointLight>();
            this._pDirectionalLights = new Array<away.lights.DirectionalLight>();
            this._pCastingDirectionalLights = new Array<away.lights.DirectionalLight>();
            this._pLightProbes = new Array<away.lights.LightProbe>();
			
			var len:number = value.length;

			for (var i:number = 0; i < len; ++i)
            {
				light = value[i];
				light.addEventListener(away.events.LightEvent.CASTS_SHADOW_CHANGE, this.onCastShadowChange , this );

				if (light instanceof away.lights.PointLight)
                {
					if (light.castsShadows)
						this._pCastingPointLights[numCastingPointLights++] = <away.lights.PointLight> light;
					else
						this._pPointLights[numPointLights++] = <away.lights.PointLight> light;
					
				}
                else if (light instanceof away.lights.DirectionalLight)
                {
					if (light.castsShadows)
						this._pCastingDirectionalLights[numCastingDirectionalLights++] = <away.lights.DirectionalLight> light;
					else
						this._pDirectionalLights[numDirectionalLights++] = <away.lights.DirectionalLight> light;

				}
                else if (light instanceof away.lights.LightProbe)
                {
					this._pLightProbes[numLightProbes++] = <away.lights.LightProbe> light;

                }
			}
			
			if (this._pNumDirectionalLights == numDirectionalLights && this._pNumPointLights == numPointLights && this._pNumLightProbes == numLightProbes &&
				this._pNumCastingPointLights == numCastingPointLights && this._pNumCastingDirectionalLights == numCastingDirectionalLights) {
				return;
			}
			
			this._pNumDirectionalLights = numDirectionalLights;
			this._pNumCastingDirectionalLights = numCastingDirectionalLights;
			this._pNumPointLights = numPointLights;
			this._pNumCastingPointLights = numCastingPointLights;
			this._pNumLightProbes = numLightProbes;
			
			// MUST HAVE MULTIPLE OF 4 ELEMENTS!
			this._pLightProbeWeights = new Array<number>(Math.ceil(numLightProbes/4)*4 );
			
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
				this._lights[i].removeEventListener(away.events.LightEvent.CASTS_SHADOW_CHANGE, this.onCastShadowChange , this );
		}

		/**
		 * Notifies the material of a configuration change.
		 */
		private onCastShadowChange(event:away.events.LightEvent)
		{
			// TODO: Assign to special caster collections, just append it to the lights in SinglePass
			// But keep seperated in multipass
			
			var light:away.lights.LightBase = <away.lights.LightBase > event.target;
			
			if (light instanceof away.lights.PointLight)
            {

                var pl : away.lights.PointLight = <away.lights.PointLight> light;
                this.updatePointCasting( pl );

            }
			else if (light instanceof away.lights.DirectionalLight)
            {

                var dl : away.lights.DirectionalLight = <away.lights.DirectionalLight> light;
				this.updateDirectionalCasting( dl );

            }

			this.dispatchEvent(new away.events.Event(away.events.Event.CHANGE));
		}

		/**
		 * Called when a directional light's shadow casting configuration changes.
		 */
		private updateDirectionalCasting(light:away.lights.DirectionalLight)
		{

            var dl : away.lights.DirectionalLight = <away.lights.DirectionalLight> light;

			if (light.castsShadows)
            {
				-- this._pNumDirectionalLights;
				++this._pNumCastingDirectionalLights;



				this._pDirectionalLights.splice(this._pDirectionalLights.indexOf( dl ), 1);
				this._pCastingDirectionalLights.push(light);

			}
            else
            {
				++this._pNumDirectionalLights;
				--this._pNumCastingDirectionalLights;

				this._pCastingDirectionalLights.splice(this._pCastingDirectionalLights.indexOf( dl ), 1);
				this._pDirectionalLights.push(light);
			}
		}

		/**
		 * Called when a point light's shadow casting configuration changes.
		 */
		private updatePointCasting(light:away.lights.PointLight)
		{

            var pl : away.lights.PointLight = <away.lights.PointLight> light;

			if (light.castsShadows)
            {

				--this._pNumPointLights;
				++this._pNumCastingPointLights;
                this._pPointLights.splice( this._pPointLights.indexOf( pl ), 1);
                this._pCastingPointLights.push(light);

			}
            else
            {

				++this._pNumPointLights;
				--this._pNumCastingPointLights;

                this._pCastingPointLights.splice(this._pCastingPointLights.indexOf( pl ) , 1);
                this._pPointLights.push(light);

			}
		}
	}
}
