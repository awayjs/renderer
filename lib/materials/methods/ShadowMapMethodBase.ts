import AssetType					= require("awayjs-core/lib/library/AssetType");
import IAsset						= require("awayjs-core/lib/library/IAsset");

import LightBase					= require("awayjs-display/lib/base/LightBase");
import ShadowMapperBase				= require("awayjs-display/lib/materials/shadowmappers/ShadowMapperBase");

import ShadingMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadingMethodBase");

/**
 * ShadowMapMethodBase provides an abstract base method for shadow map methods.
 */
class ShadowMapMethodBase extends ShadingMethodBase implements IAsset
{
	public _pCastingLight:LightBase;
	public _pShadowMapper:ShadowMapperBase;

	public _pEpsilon:number = .02;
	public _pAlpha:number = 1;

	/**
	 * Creates a new ShadowMapMethodBase object.
	 * @param castingLight The light used to cast shadows.
	 */
	constructor(castingLight:LightBase)
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
		return AssetType.SHADOW_MAP_METHOD;
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
	public get castingLight():LightBase
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
}

export = ShadowMapMethodBase;