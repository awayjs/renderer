import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import BlendMode					= require("awayjs-display/lib/base/BlendMode");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");

import TriangleMaterialBase			= require("awayjs-renderergl/lib/materials/TriangleMaterialBase");
import TriangleBasicPass			= require("awayjs-renderergl/lib/passes/TriangleBasicPass");

/**
 * TriangleMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class TriangleBasicMaterial extends TriangleMaterialBase
{
	private _screenPass:TriangleBasicPass;

	private _alphaBlending:boolean = false;
	private _alpha:number = 1;

	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	/**
	 * Creates a new TriangleMaterial object.
	 *
	 * @param texture The texture used for the material's albedo color.
	 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
	 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
	 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
	 */
	constructor(texture?:Texture2DBase, smooth?:boolean, repeat?:boolean, mipmap?:boolean);
	constructor(color?:number, alpha?:number);
	constructor(textureColor:any = null, smoothAlpha:any = null, repeat:boolean = false, mipmap:boolean = false)
	{
		super();

		this._screenPass = new TriangleBasicPass();

		if (textureColor instanceof Texture2DBase) {
			this.texture = <Texture2DBase> textureColor;

			this.smooth = (smoothAlpha == null)? true : false;
			this.repeat = repeat;
			this.mipmap = mipmap;
		} else {
			this.color = textureColor? Number(textureColor) : 0xCCCCCC;
			this.alpha = (smoothAlpha == null)? 1 : Number(smoothAlpha);
		}
	}

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */

	public get depthCompareMode():string
	{
		return this._depthCompareMode;
	}

	public set depthCompareMode(value:string)
	{
		if (this._depthCompareMode == value)
			return;

		this._depthCompareMode = value;

		this._pInvalidatePasses();
	}

	/**
	 * The alpha of the surface.
	 */
	public get alpha():number
	{
		return this._alpha;
	}

	public set alpha(value:number)
	{
		if (value > 1)
			value = 1;
		else if (value < 0)
			value = 0;

		if (this._alpha == value)
			return;

		this._alpha = value;

		this._pInvalidatePasses();
	}

	/**
	 * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
	 * example when using textures of foliage, consider using alphaThreshold instead.
	 */
	public get alphaBlending():boolean
	{
		return this._alphaBlending;
	}

	public set alphaBlending(value:boolean)
	{
		if (this._alphaBlending == value)
			return;

		this._alphaBlending = value;

		this._pInvalidatePasses();
	}

	/**
	 * @inheritDoc
	 */
	public _iUpdateMaterial()
	{
		if (this._pScreenPassesInvalid) {
			//Updates screen passes when they were found to be invalid.
			this._pScreenPassesInvalid = false;

			this.setBlendAndCompareModes();

			this._pClearScreenPasses();

			this._pAddScreenPass(this._screenPass);
		}
	}

	/**
	 * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
	 */
	private setBlendAndCompareModes()
	{
		this._pRequiresBlending = (this._pBlendMode != BlendMode.NORMAL || this._alphaBlending || this._alpha < 1);
		this._screenPass.depthCompareMode = this._depthCompareMode;
		this._screenPass.preserveAlpha = this._pRequiresBlending;
		this._screenPass.setBlendMode((this._pBlendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._pBlendMode);
		this._screenPass.forceSeparateMVP = false;
	}
}

export = TriangleBasicMaterial;