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
		public _pCastingLight:away.lights.LightBase;
		public _pShadowMapper:away.lights.ShadowMapperBase;

		public _pEpsilon:number = .02;
		public _pAlpha:number = 1;

		/**
		 * Creates a new ShadowMapMethodBase object.
		 * @param castingLight The light used to cast shadows.
		 */
			constructor(castingLight:away.lights.LightBase)
		{
			super();
			this._pCastingLight = castingLight;
			castingLight.castsShadows = true;
			this._pShadowMapper = castingLight.shadowMapper;

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
			return this._pAlpha;
		}

		public set alpha(value:number)
		{
			this._pAlpha = value;
		}

		/**
		 * The light casting the shadows.
		 */
		public get castingLight():away.lights.LightBase
		{
			return this._pCastingLight;
		}

		/**
		 * A small value to counter floating point precision errors when comparing values in the shadow map with the
		 * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
		 */
		public get epsilon():number
		{
			return this._pEpsilon;
		}

		public set epsilon(value:number)
		{
			this._pEpsilon = value;
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
