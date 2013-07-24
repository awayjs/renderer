///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.*;
	//import away3d.errors.*;
	//import away3d.library.assets.*;
	//import away3d.lights.*;
	//import away3d.lights.shadowmaps.*;
	//import away3d.materials.compilation.*;
	
	//use namespace arcane;

	/**
	 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
	 */
	export class ShadowMapMethodBase extends away.materials.ShadingMethodBase implements away.library.IAsset
	{
		private _castingLight:away.lights.LightBase;
		private _shadowMapper:away.lights.ShadowMapperBase;
		
		private _epsilon:number = .02;
		private _alpha:number = 1;

		/**
		 * Creates a new ShadowMapMethodBase object.
		 * @param castingLight The light used to cast shadows.
		 */
		constructor(castingLight:away.lights.LightBase)
		{
			super();
			this._castingLight = castingLight;
			castingLight.castsShadows = true;
            this._shadowMapper = castingLight.shadowMapper;

		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return away.library.AssetType.SHADOW_MAP_METHOD;
		}

		/**
		 * The "transparency" of the shadows. This allows making shadows less strong.
		 */
		public get alpha():number
		{
			return this._alpha;
		}
		
		public set alpha(value:number)
		{
            this._alpha = value;
		}

		/**
		 * The light casting the shadows.
		 */
		public get castingLight():away.lights.LightBase
		{
			return this._castingLight;
		}

		/**
		 * A small value to counter floating point precision errors when comparing values in the shadow map with the
		 * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
		 */
		public get epsilon():number
		{
			return this._epsilon;
		}
		
		public set epsilon(value:number)
		{
            this._epsilon = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			throw new away.errors.AbstractMethodError();
			return null;
		}
	}
}
