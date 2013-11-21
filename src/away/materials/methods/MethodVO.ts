///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * MethodVO contains data for a given method for the use within a single material.
	 * This allows methods to be shared across materials while their non-public state differs.
	 */
	export class MethodVO
	{
		public vertexData:number[];
		public fragmentData:number[];

		// public register indices
		public texturesIndex:number;
		public secondaryTexturesIndex:number; // sometimes needed for composites
		public vertexConstantsIndex:number;
		public secondaryVertexConstantsIndex:number; // sometimes needed for composites
		public fragmentConstantsIndex:number;
		public secondaryFragmentConstantsIndex:number; // sometimes needed for composites

		public useMipmapping:boolean;
		public useSmoothTextures:boolean;
		public repeatTextures:boolean;

		// internal stuff for the material to know before assembling code
		public needsProjection:boolean;
		public needsView:boolean;
		public needsNormals:boolean;
		public needsTangents:boolean;
		public needsUV:boolean;
		public needsSecondaryUV:boolean;
		public needsGlobalVertexPos:boolean;
		public needsGlobalFragmentPos:boolean;

		public numLights:number;
		public useLightFallOff:boolean = true;

		/**
		 * Creates a new MethodVO object.
		 */
			constructor()
		{

		}

		/**
		 * Resets the values of the value object to their "unused" state.
		 */
		public reset()
		{
			this.texturesIndex = -1;
			this.vertexConstantsIndex = -1;
			this.fragmentConstantsIndex = -1;

			this.useMipmapping = true;
			this.useSmoothTextures = true;
			this.repeatTextures = false;

			this.needsProjection = false;
			this.needsView = false;
			this.needsNormals = false;
			this.needsTangents = false;
			this.needsUV = false;
			this.needsSecondaryUV = false;
			this.needsGlobalVertexPos = false;
			this.needsGlobalFragmentPos = false;

			this.numLights = 0;
			this.useLightFallOff = true;
		}
	}
}
