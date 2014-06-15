module away.materials
{

	/**
	 * Enumeration class for defining which lighting types affect the specific material
	 * lighting component (diffuse and specular). This can be useful if, for example, you
	 * want to use light probes for diffuse global lighting, but want specular reflections from
	 * traditional light sources without those affecting the diffuse light.
	 *
	 * @see away.materials.ColorMaterial.diffuseLightSources
	 * @see away.materials.ColorMaterial.specularLightSources
	 * @see away.materials.TextureMaterial.diffuseLightSources
	 * @see away.materials.TextureMaterial.specularLightSources
	 */
	export class LightSources
	{
		/**
		 * Defines normal lights are to be used as the source for the lighting
		 * component.
		 */
		public static LIGHTS:number = 0x01;

		/**
		 * Defines that global lighting probes are to be used as the source for the
		 * lighting component.
		 */
		public static PROBES:number = 0x02;

		/**
		 * Defines that both normal and global lighting probes  are to be used as the
		 * source for the lighting component. This is equivalent to LightSources.LIGHTS | LightSources.PROBES.
		 */
		public static ALL:number = 0x03;
	}
}