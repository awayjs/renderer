import ColorTransform				= require("awayjs-core/lib/geom/ColorTransform");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import BlendMode					= require("awayjs-display/lib/base/BlendMode");
import Camera						= require("awayjs-display/lib/entities/Camera");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");

import TriangleMaterialBase			= require("awayjs-renderergl/lib/materials/TriangleMaterialBase");
import TriangleMaterialMode			= require("awayjs-renderergl/lib/materials/TriangleMaterialMode");
import AmbientBasicMethod			= require("awayjs-renderergl/lib/materials/methods/AmbientBasicMethod");
import DiffuseBasicMethod			= require("awayjs-renderergl/lib/materials/methods/DiffuseBasicMethod");
import EffectMethodBase				= require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
import NormalBasicMethod			= require("awayjs-renderergl/lib/materials/methods/NormalBasicMethod");
import ShadowMapMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadowMapMethodBase");
import SpecularBasicMethod			= require("awayjs-renderergl/lib/materials/methods/SpecularBasicMethod");
import MaterialPassMode				= require("awayjs-renderergl/lib/materials/passes/MaterialPassMode");
import TriangleMethodPass			= require("awayjs-renderergl/lib/materials/passes/TriangleMethodPass");

/**
 * TriangleMethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class TriangleMethodMaterial extends TriangleMaterialBase
{
	private _alphaBlending:boolean = false;
	private _alpha:number = 1;
	private _colorTransform:ColorTransform;
	private _materialMode:string;
	private _casterLightPass:TriangleMethodPass;
	private _nonCasterLightPasses:Array<TriangleMethodPass>;
	private _screenPass:TriangleMethodPass;

	private _ambientMethod:AmbientBasicMethod = new AmbientBasicMethod();
	private _shadowMethod:ShadowMapMethodBase;
	private _diffuseMethod:DiffuseBasicMethod = new DiffuseBasicMethod();
	private _normalMethod:NormalBasicMethod = new NormalBasicMethod();
	private _specularMethod:SpecularBasicMethod = new SpecularBasicMethod();


	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	/**
	 * Creates a new TriangleMethodMaterial object.
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

		this._materialMode = TriangleMaterialMode.SINGLE_PASS;

		if (textureColor instanceof Texture2DBase) {
			this.texture = <Texture2DBase> textureColor;

			this.smooth = (smoothAlpha == null)? true : false;
			this.repeat = repeat;
			this.mipmap = mipmap;
		} else {
			this.color = (textureColor == null)? 0xFFFFFF : Number(textureColor);
			this.alpha = (smoothAlpha == null)? 1 : Number(smoothAlpha);
		}
	}


	public get materialMode():string
	{
		return this._materialMode;
	}

	public set materialMode(value:string)
	{
		if (this._materialMode == value)
			return;

		this._materialMode = value;

		this._pInvalidateScreenPasses();
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

		this._pInvalidateScreenPasses();
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

		if (this._colorTransform == null)
			this._colorTransform = new ColorTransform();

		this._colorTransform.alphaMultiplier = value;

		this._pInvalidatePasses();
	}

	/**
	 * The ColorTransform object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransform():ColorTransform
	{
		return this._screenPass.colorTransform;
	}

	public set colorTransform(value:ColorTransform)
	{
		this._screenPass.colorTransform = value;
	}

	/**
	 * The texture object to use for the ambient colour.
	 */
	public get diffuseTexture():Texture2DBase
	{
		return this._diffuseMethod.texture;
	}

	public set diffuseTexture(value:Texture2DBase)
	{
		this._diffuseMethod.texture = value;
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():AmbientBasicMethod
	{
		return this._ambientMethod;
	}

	public set ambientMethod(value:AmbientBasicMethod)
	{
		if (this._ambientMethod == value)
			return;

		if (value && this._ambientMethod)
			value.copyFrom(this._ambientMethod);

		this._ambientMethod = value;

		this._pInvalidateScreenPasses();
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():ShadowMapMethodBase
	{
		return this._shadowMethod;
	}

	public set shadowMethod(value:ShadowMapMethodBase)
	{
		if (this._shadowMethod == value)
			return;

		if (value && this._shadowMethod)
			value.copyFrom(this._shadowMethod);

		this._shadowMethod = value;

		this._pInvalidateScreenPasses();
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():DiffuseBasicMethod
	{
		return this._diffuseMethod;
	}

	public set diffuseMethod(value:DiffuseBasicMethod)
	{
		if (this._diffuseMethod == value)
			return;

		if (value && this._diffuseMethod)
			value.copyFrom(this._diffuseMethod);

		this._diffuseMethod = value;

		this._pInvalidateScreenPasses();
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():SpecularBasicMethod
	{
		return this._specularMethod;
	}

	public set specularMethod(value:SpecularBasicMethod)
	{
		if (this._specularMethod == value)
			return;

		if (value && this._specularMethod)
			value.copyFrom(this._specularMethod);

		this._specularMethod = value;

		this._pInvalidateScreenPasses();
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():NormalBasicMethod
	{
		return this._normalMethod;
	}

	public set normalMethod(value:NormalBasicMethod)
	{
		if (this._normalMethod == value)
			return;

		if (value && this._normalMethod)
			value.copyFrom(this._normalMethod);

		this._normalMethod = value;

		this._pInvalidateScreenPasses();
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:EffectMethodBase)
	{
		if (this._screenPass == null)
			this._screenPass = new TriangleMethodPass();

		this._screenPass.addEffectMethod(method);

		this._pInvalidateScreenPasses();
	}

	/**
	 * The number of "effect" methods added to the material.
	 */
	public get numEffectMethods():number
	{
		return this._screenPass? this._screenPass.numEffectMethods : 0;
	}

	/**
	 * Queries whether a given effect method was added to the material.
	 *
	 * @param method The method to be queried.
	 * @return true if the method was added to the material, false otherwise.
	 */
	public hasEffectMethod(method:EffectMethodBase):boolean
	{
		return this._screenPass? this._screenPass.hasEffectMethod(method) : false;
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):EffectMethodBase
	{
		if (this._screenPass == null)
			return null;

		return this._screenPass.getEffectMethodAt(index);
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:EffectMethodBase, index:number)
	{
		if (this._screenPass == null)
			this._screenPass = new TriangleMethodPass();

		this._screenPass.addEffectMethodAt(method, index);

		this._pInvalidatePasses();
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase)
	{
		if (this._screenPass == null)
			return;

		this._screenPass.removeEffectMethod(method);

		// reconsider
		if (this._screenPass.numEffectMethods == 0)
			this._pInvalidatePasses();
	}

	/**
	 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
	 * tangent-space normal maps, but others could expect object-space maps.
	 */
	public get normalMap():Texture2DBase
	{
		return this._normalMethod.normalMap;
	}

	public set normalMap(value:Texture2DBase)
	{
		this._normalMethod.normalMap = value;
	}

	/**
	 * A specular map that defines the strength of specular reflections for each texel in the red channel,
	 * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
	 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
	 */
	public get specularMap():Texture2DBase
	{
		return this._specularMethod.texture;
	}

	public set specularMap(value:Texture2DBase)
	{
		this._specularMethod.texture = value;
	}

	/**
	 * The glossiness of the material (sharpness of the specular highlight).
	 */
	public get gloss():number
	{
		return this._specularMethod.gloss;
	}

	public set gloss(value:number)
	{
		this._specularMethod.gloss = value;
	}

	/**
	 * The strength of the ambient reflection.
	 */
	public get ambient():number
	{
		return this._ambientMethod.ambient;
	}

	public set ambient(value:number)
	{
		this._ambientMethod.ambient = value;
	}

	/**
	 * The overall strength of the specular reflection.
	 */
	public get specular():number
	{
		return this._specularMethod.specular;
	}

	public set specular(value:number)
	{
		this._specularMethod.specular = value;
	}

	/**
	 * The colour of the ambient reflection.
	 */
	public get ambientColor():number
	{
		return this._diffuseMethod.ambientColor;
	}

	public set ambientColor(value:number)
	{
		this._diffuseMethod.ambientColor = value;
	}

	/**
	 * The colour of the diffuse reflection.
	 */
	public get diffuseColor():number
	{
		return this._diffuseMethod.diffuseColor;
	}

	public set diffuseColor(value:number)
	{
		this._diffuseMethod.diffuseColor = value;
	}

	/**
	 * The colour of the specular reflection.
	 */
	public get specularColor():number
	{
		return this._specularMethod.specularColor;
	}

	public set specularColor(value:number)
	{
		this._specularMethod.specularColor = value;
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

			this.initPasses();

			this.setBlendAndCompareModes();

			this._pClearScreenPasses();

			if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
				if (this._casterLightPass)
					this._pAddScreenPass(this._casterLightPass);

				if (this._nonCasterLightPasses)
					for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
						this._pAddScreenPass(this._nonCasterLightPasses[i]);
			}

			if (this._screenPass)
				this._pAddScreenPass(this._screenPass);
		}
	}

	/**
	 * Initializes all the passes and their dependent passes.
	 */
	private initPasses()
	{
		// let the effects pass handle everything if there are no lights, when there are effect methods applied
		// after shading, or when the material mode is single pass.
		if (this.numLights == 0 || this.numEffectMethods > 0 || this._materialMode == TriangleMaterialMode.SINGLE_PASS)
			this.initEffectPass();
		else if (this._screenPass)
			this.removeEffectPass();

		// only use a caster light pass if shadows need to be rendered
		if (this._shadowMethod && this._materialMode == TriangleMaterialMode.MULTI_PASS)
			this.initCasterLightPass();
		else if (this._casterLightPass)
			this.removeCasterLightPass();

		// only use non caster light passes if there are lights that don't cast
		if (this.numNonCasters > 0 && this._materialMode == TriangleMaterialMode.MULTI_PASS)
			this.initNonCasterLightPasses();
		else if (this._nonCasterLightPasses)
			this.removeNonCasterLightPasses();
	}

	/**
	 * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
	 */
	private setBlendAndCompareModes()
	{
		var forceSeparateMVP:boolean = Boolean(this._casterLightPass || this._screenPass);

		// caster light pass is always first if it exists, hence it uses normal blending
		if (this._casterLightPass) {
			this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
			this._casterLightPass.setBlendMode(BlendMode.NORMAL);
			this._casterLightPass.depthCompareMode = this._depthCompareMode;
		}

		if (this._nonCasterLightPasses) {
			var firstAdditiveIndex:number = 0;

			// if there's no caster light pass, the first non caster light pass will be the first
			// and should use normal blending
			if (!this._casterLightPass) {
				this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
				this._nonCasterLightPasses[0].setBlendMode(BlendMode.NORMAL);
				this._nonCasterLightPasses[0].depthCompareMode = this._depthCompareMode;
				firstAdditiveIndex = 1;
			}

			// all lighting passes following the first light pass should use additive blending
			for (var i:number = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
				this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
				this._nonCasterLightPasses[i].setBlendMode(BlendMode.ADD);
				this._nonCasterLightPasses[i].depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
			}
		}

		if (this._casterLightPass || this._nonCasterLightPasses) {
			//cannot be blended by blendmode property if multipass enabled
			this._pRequiresBlending = false;

			// there are light passes, so this should be blended in
			if (this._screenPass) {
				this._screenPass.passMode = MaterialPassMode.EFFECTS;
				this._screenPass.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
				this._screenPass.setBlendMode(BlendMode.LAYER);
				this._screenPass.forceSeparateMVP = forceSeparateMVP;
			}

		} else if (this._screenPass) {
			this._pRequiresBlending = (this._pBlendMode != BlendMode.NORMAL || this._alphaBlending || (this._colorTransform && this._colorTransform.alphaMultiplier < 1));
			// effects pass is the only pass, so it should just blend normally
			this._screenPass.passMode = MaterialPassMode.SUPER_SHADER;
			this._screenPass.depthCompareMode = this._depthCompareMode;
			this._screenPass.preserveAlpha = this._pRequiresBlending;
			this._screenPass.colorTransform = this._colorTransform;
			this._screenPass.setBlendMode((this._pBlendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._pBlendMode);
			this._screenPass.forceSeparateMVP = false;
		}
	}

	private initCasterLightPass()
	{

		if (this._casterLightPass == null)
			this._casterLightPass = new TriangleMethodPass(MaterialPassMode.LIGHTING);

		this._casterLightPass.lightPicker = new StaticLightPicker([this._shadowMethod.castingLight]);
		this._casterLightPass.shadowMethod = this._shadowMethod;
		this._casterLightPass.diffuseMethod = this._diffuseMethod;
		this._casterLightPass.ambientMethod = this._ambientMethod;
		this._casterLightPass.normalMethod = this._normalMethod;
		this._casterLightPass.specularMethod = this._specularMethod;
	}

	private removeCasterLightPass()
	{
		this._casterLightPass.dispose();
		this._pRemoveScreenPass(this._casterLightPass);
		this._casterLightPass = null;
	}

	private initNonCasterLightPasses()
	{
		this.removeNonCasterLightPasses();
		var pass:TriangleMethodPass;
		var numDirLights:number = this._pLightPicker.numDirectionalLights;
		var numPointLights:number = this._pLightPicker.numPointLights;
		var numLightProbes:number = this._pLightPicker.numLightProbes;
		var dirLightOffset:number = 0;
		var pointLightOffset:number = 0;
		var probeOffset:number = 0;

		if (!this._casterLightPass) {
			numDirLights += this._pLightPicker.numCastingDirectionalLights;
			numPointLights += this._pLightPicker.numCastingPointLights;
		}

		this._nonCasterLightPasses = new Array<TriangleMethodPass>();

		while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
			pass = new TriangleMethodPass(MaterialPassMode.LIGHTING);
			pass.includeCasters = this._shadowMethod == null;
			pass.directionalLightsOffset = dirLightOffset;
			pass.pointLightsOffset = pointLightOffset;
			pass.lightProbesOffset = probeOffset;
			pass.lightPicker = this._pLightPicker;
			pass.diffuseMethod = this._diffuseMethod;
			pass.ambientMethod = this._ambientMethod;
			pass.normalMethod = this._normalMethod;
			pass.specularMethod = this._specularMethod;
			this._nonCasterLightPasses.push(pass);

			dirLightOffset += pass.iNumDirectionalLights;
			pointLightOffset += pass.iNumPointLights;
			probeOffset += pass.iNumLightProbes;
		}
	}

	private removeNonCasterLightPasses()
	{
		if (!this._nonCasterLightPasses)
			return;

		for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
			this._pRemoveScreenPass(this._nonCasterLightPasses[i]);

		this._nonCasterLightPasses = null;
	}

	private removeEffectPass()
	{
		if (this._screenPass.ambientMethod != this._ambientMethod)
			this._screenPass.ambientMethod.dispose();

		if (this._screenPass.diffuseMethod != this._diffuseMethod)
			this._screenPass.diffuseMethod.dispose();

		if (this._screenPass.specularMethod != this._specularMethod)
			this._screenPass.specularMethod.dispose();

		if (this._screenPass.normalMethod != this._normalMethod)
			this._screenPass.normalMethod.dispose();

		this._pRemoveScreenPass(this._screenPass);
		this._screenPass = null;
	}

	private initEffectPass()
	{
		if (this._screenPass == null)
			this._screenPass = new TriangleMethodPass();

		if (this._materialMode == TriangleMaterialMode.SINGLE_PASS) {
			this._screenPass.ambientMethod = this._ambientMethod;
			this._screenPass.diffuseMethod = this._diffuseMethod;
			this._screenPass.specularMethod = this._specularMethod;
			this._screenPass.normalMethod = this._normalMethod;
			this._screenPass.shadowMethod = this._shadowMethod;
		} else if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
			if (this.numLights == 0) {
				this._screenPass.ambientMethod = this._ambientMethod;
			} else {
				this._screenPass.ambientMethod = null;
			}

			this._screenPass.preserveAlpha = false;
			this._screenPass.normalMethod = this._normalMethod;
		}
	}

	/**
	 * The maximum total number of lights provided by the light picker.
	 */
	private get numLights():number
	{
		return this._pLightPicker? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights + this._pLightPicker.numCastingDirectionalLights + this._pLightPicker.numCastingPointLights : 0;
	}

	/**
	 * The amount of lights that don't cast shadows.
	 */
	private get numNonCasters():number
	{
		return this._pLightPicker? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights : 0;
	}
}

export = TriangleMethodMaterial;