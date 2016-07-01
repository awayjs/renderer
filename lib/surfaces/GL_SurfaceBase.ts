import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {ImageBase}					from "@awayjs/core/lib/image/ImageBase";
import {SamplerBase}					from "@awayjs/core/lib/image/SamplerBase";
import {Sampler2D}					from "@awayjs/core/lib/image/Sampler2D";

import {AbstractionBase}				from "@awayjs/core/lib/library/AbstractionBase";

import {ISurface}						from "@awayjs/display/lib/base/ISurface";
import {Camera}						from "@awayjs/display/lib/display/Camera";
import {SurfaceEvent}					from "@awayjs/display/lib/events/SurfaceEvent";
import {IRenderable}					from "@awayjs/display/lib/base/IRenderable";
import {MaterialBase}					from "@awayjs/display/lib/materials/MaterialBase";
import {DefaultMaterialManager}		from "@awayjs/display/lib/managers/DefaultMaterialManager";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {GL_ImageBase}					from "@awayjs/stage/lib/image/GL_ImageBase";
import {GL_SamplerBase}				from "@awayjs/stage/lib/image/GL_SamplerBase";

import {AnimatorBase}					from "../animators/AnimatorBase";
import {PassEvent}					from "../events/PassEvent";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {SurfacePool}					from "../surfaces/SurfacePool";
import {IPass}						from "../surfaces/passes/IPass";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_TextureBase}				from "../textures/GL_TextureBase";

/**
 *
 * @class away.pool.Passes
 */
export class GL_SurfaceBase extends AbstractionBase
{
	private _onInvalidateAnimationDelegate:(event:SurfaceEvent) => void;
	private _onInvalidatePassesDelegate:(event:SurfaceEvent) => void;

	public usages:number = 0;
	public _forceSeparateMVP:boolean = false;

	public _surface:ISurface;
	public _elementsClass:IElementsClassGL;
	public _stage:Stage;

	private _renderOrderId:number;
	private _usesAnimation:boolean = true;
	private _invalidAnimation:boolean = true;
	private _invalidRender:boolean = true;
	private _invalidImages:boolean = true;
	private _passes:Array<IPass> = new Array<IPass>();
	private _imageIndices:Object = new Object();
	private _numImages:number;




	public _pRequiresBlending:boolean = false;

	private _onPassInvalidateDelegate:(event:PassEvent) => void;

	public surfaceID:number;

	public images:Array<GL_ImageBase> = new Array<GL_ImageBase>();
	public samplers:Array<GL_SamplerBase> = new Array<GL_SamplerBase>();

	/**
	 * Indicates whether or not the renderable requires alpha blending during rendering.
	 */
	public get requiresBlending():boolean
	{
		return this._pRequiresBlending;
	}

	public get renderOrderId():number
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._renderOrderId;
	}

	public get passes():Array<IPass>
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._passes;
	}

	public get surface():ISurface
	{
		return this._surface;
	}

	public get numImages():number
	{
		if (this._invalidImages)
			this._updateImages();

		return this._numImages;
	}

	constructor(surface:ISurface, elementsClass:IElementsClassGL, renderPool:SurfacePool)
	{
		super(surface, renderPool);

		this._onInvalidateAnimationDelegate = (event:SurfaceEvent) => this.onInvalidateAnimation(event);
		this._onInvalidatePassesDelegate = (event:SurfaceEvent) => this.onInvalidatePasses(event);

		this.surfaceID = surface.id;
		this._surface = surface;
		this._elementsClass = elementsClass;
		this._stage = renderPool.stage;

		this._surface.addEventListener(SurfaceEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
		this._surface.addEventListener(SurfaceEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

		this._onPassInvalidateDelegate = (event:PassEvent) => this.onPassInvalidate(event);
	}

	public _iIncludeDependencies(shader:ShaderBase):void
	{
		this._elementsClass._iIncludeDependencies(shader);

		shader.alphaThreshold = this._surface.alphaThreshold;
		shader.useImageRect = this._surface.imageRect;
		shader.usesCurves = this._surface.curves;

		if (this._surface instanceof MaterialBase) {
			var material:MaterialBase = <MaterialBase> this._surface;
			shader.useAlphaPremultiplied = material.alphaPremultiplied;
			shader.useBothSides = material.bothSides;
			shader.usesUVTransform = material.animateUVs;
			shader.usesColorTransform = material.useColorTransform;
		}
	}

	public getImageIndex(texture:TextureBase, index:number = 0):number
	{
		if (this._invalidImages)
			this._updateImages();

		return this._imageIndices[texture.id][index];
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._surface = null;
		this._elementsClass = null;
		this._stage = null;

		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
			this._passes[i].dispose();
		}

		this._passes = null;
	}

	/**
	 *
	 */
	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		this._invalidRender = true;
		this._invalidAnimation = true;
	}

	/**
	 *
	 */
	public onInvalidatePasses(event:SurfaceEvent):void
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++)
			this._passes[i].invalidate();

		this._invalidAnimation = true;
		this._invalidImages = true;
	}

	/**
	 *
	 */
	public onInvalidateAnimation(event:SurfaceEvent):void
	{
		this._invalidAnimation = true;
	}

	/**
	 *
	 * @param surface
	 */
	private _updateAnimation():void
	{
		if (this._invalidRender)
			this._pUpdateRender();

		this._invalidAnimation = false;

		var usesAnimation:boolean = this._getEnabledGPUAnimation();

		var renderOrderId = 0;
		var mult:number = 1;
		var shader:ShaderBase;
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			shader = this._passes[i].shader;
			shader.usesAnimation = usesAnimation;

			renderOrderId += shader.programData.id*mult;
			mult *= 1000;
		}
		
		if (this._usesAnimation != usesAnimation) {
			this._usesAnimation = usesAnimation;

			var renderables:Array<IRenderable> = this._surface.iOwners;
			var numOwners:number = renderables.length;
			for (var j:number = 0; j < numOwners; j++)
				renderables[j].invalidateElements();
		}

		this._renderOrderId = renderOrderId;
	}

	private _updateImages():void
	{
		this._invalidImages = false;

		var numTextures:number = this._surface.getNumTextures();
		var texture:TextureBase;
		var numImages:number;
		var images:Array<number>;
		var image:ImageBase;
		var sampler:SamplerBase;
		var index:number = 0;

		for (var i:number = 0; i < numTextures; i++) {
			texture = this._surface.getTextureAt(i);
			numImages = texture.getNumImages();
			images = this._imageIndices[texture.id] = new Array<number>();
			for (var j:number = 0; j < numImages; j++) {
				image = texture.getImageAt(j) || (this._surface.style? this._surface.style.getImageAt(texture, j) : null) || DefaultMaterialManager.getDefaultImage2D();
				this.images[index] = <GL_ImageBase> this._stage.getAbstraction(image);

				sampler = texture.getSamplerAt(j) || (this._surface.style? this._surface.style.getSamplerAt(texture, j) : null) || DefaultMaterialManager.getDefaultSampler();
				this.samplers[index] = <GL_SamplerBase> this._stage.getAbstraction(sampler);

				images[j] = index++;
			}
		}

		this._numImages = index;
	}

	/**
	 * Performs any processing that needs to occur before any of its passes are used.
	 *
	 * @private
	 */
	public _pUpdateRender():void
	{
		this._invalidRender = false;

		//overrride to update shader object properties
	}

	/**
	 * Removes a pass from the surface.
	 * @param pass The pass to be removed.
	 */
	public _pRemovePass(pass:IPass):void
	{
		pass.removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
		this._passes.splice(this._passes.indexOf(pass), 1);
	}

	/**
	 * Removes all passes from the surface
	 */
	public _pClearPasses():void
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; ++i)
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);

		this._passes.length = 0;
	}

	/**
	 * Adds a pass to the surface
	 * @param pass
	 */
	public _pAddPass(pass:IPass):void
	{
		this._passes.push(pass);
		pass.addEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
	}

	/**
	 * Listener for when a pass's shader code changes. It recalculates the render order id.
	 */
	private onPassInvalidate(event:PassEvent):void
	{
		this._invalidAnimation = true;
	}


	/**
	 * test if animation will be able to run on gpu BEFORE compiling materials
	 * test if the shader objects supports animating the animation set in the vertex shader
	 * if any object using this material fails to support accelerated animations for any of the shader objects,
	 * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	 */
	private _getEnabledGPUAnimation():boolean
	{
		if (this._surface.animationSet) {
			this._surface.animationSet.resetGPUCompatibility();

			var renderables:Array<IRenderable> = this._surface.iOwners;
			var numOwners:number = renderables.length;

			var len:number = this._passes.length;
			var shader:ShaderBase;
			for (var i:number = 0; i < len; i++) {
				shader = this._passes[i].shader;
				shader.usesAnimation = false;
				for (var j:number = 0; j < numOwners; j++)
					if (renderables[j].animator)
						(<AnimatorBase> renderables[j].animator).testGPUCompatibility(shader);
			}


			return !this._surface.animationSet.usesCPU;
		}

		return false;
	}
}