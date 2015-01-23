import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Event						= require("awayjs-core/lib/events/Event");
import AssetType					= require("awayjs-core/lib/library/AssetType");

import IRenderObject				= require("awayjs-display/lib/pool/IRenderObject");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import Camera						= require("awayjs-display/lib/entities/Camera");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 *
 * @class away.pool.ScreenPasses
 */
class RenderObjectBase implements IRenderObject
{
	public _forceSeparateMVP:boolean = false;

	private _pool:RenderObjectPool;
	public _renderObjectOwner:IRenderObjectOwner;
	public _renderableClass:IRenderableClass;
	public _stage:Stage;

	private _renderOrderId:number;
	private _invalidAnimation:boolean = true;
	private _invalidRenderObject:boolean = true;
	private _passes:Array<RenderPassBase> = new Array<RenderPassBase>();



	public _pRequiresBlending:boolean = false;

	private _onPassChangeDelegate:(event:Event) => void;

	public renderObjectId:number;

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

	public get passes():Array<RenderPassBase>
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._passes;
	}

	constructor(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		this._pool = pool;
		this.renderObjectId = renderObjectOwner.id;
		this._renderObjectOwner = renderObjectOwner;
		this._renderableClass = renderableClass;
		this._stage = stage;


		this._onPassChangeDelegate = (event:Event) => this.onPassChange(event);
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		shaderObject.alphaThreshold = this._renderObjectOwner.alphaThreshold;
		shaderObject.useMipmapping = this._renderObjectOwner.mipmap;
		shaderObject.useSmoothTextures = this._renderObjectOwner.smooth;

		if (this._renderObjectOwner.assetType = AssetType.MATERIAL) {
			var material:MaterialBase = <MaterialBase> this._renderObjectOwner;
			shaderObject.useAlphaPremultiplied = material.alphaPremultiplied;
			shaderObject.useBothSides = material.bothSides;
			shaderObject.repeatTextures = material.repeat;
			shaderObject.usesUVTransform = material.animateUVs;
			shaderObject.texture = material.texture;
			shaderObject.color = material.color;
		}
	}

	/**
	 *
	 */
	public dispose()
	{
		this._pClearScreenPasses();

		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++)
			this._passes[i].dispose();

		this._passes = null;

		this._pool.disposeItem(this._renderObjectOwner);
	}

	/**
	 *
	 */
	public invalidateRenderObject()
	{
		this._invalidRenderObject = true;
		this._invalidAnimation = true;
	}

	/**
	 *
	 */
	public invalidatePasses()
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++)
			this._passes[i].invalidatePass();

		this._invalidAnimation = true;
	}

	/**
	 *
	 */
	public invalidateAnimation()
	{
		this._invalidAnimation = true;
	}

	/**
	 *
	 * @param renderObjectOwner
	 */
	private _updateAnimation()
	{
		if (this._invalidRenderObject)
			this._pUpdateRenderObject();

		this._invalidAnimation = false;

		var enabledGPUAnimation:boolean = this._getEnabledGPUAnimation();

		var renderOrderId = 0;
		var mult:number = 1;
		var shaderObject:ShaderObjectBase;
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			shaderObject = this._passes[i].shader;

			if (shaderObject.usesAnimation != enabledGPUAnimation) {
				shaderObject.usesAnimation = enabledGPUAnimation;
				shaderObject.invalidateProgram();
			}

			renderOrderId += shaderObject.programData.id*mult;
			mult *= 1000;
		}

		this._renderOrderId = renderOrderId;
	}

	/**
	 * Performs any processing that needs to occur before any of its passes are used.
	 *
	 * @private
	 */
	public _pUpdateRenderObject()
	{
		this._invalidRenderObject = false;

		//overrride to update shader object properties
	}

	/**
	 * Removes a pass from the renderObjectOwner.
	 * @param pass The pass to be removed.
	 */
	public _pRemoveScreenPass(pass:RenderPassBase)
	{
		pass.removeEventListener(Event.CHANGE, this._onPassChangeDelegate);
		this._passes.splice(this._passes.indexOf(pass), 1);
	}

	/**
	 * Removes all passes from the renderObjectOwner
	 */
	public _pClearScreenPasses()
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; ++i)
			this._passes[i].removeEventListener(Event.CHANGE, this._onPassChangeDelegate);

		this._passes.length = 0;
	}

	/**
	 * Adds a pass to the renderObjectOwner
	 * @param pass
	 */
	public _pAddScreenPass(pass:RenderPassBase)
	{
		this._passes.push(pass);
		pass.addEventListener(Event.CHANGE, this._onPassChangeDelegate);
	}

	/**
	 * Listener for when a pass's shader code changes. It recalculates the render order id.
	 */
	private onPassChange(event:Event)
	{
		this.invalidateAnimation();
	}


	/**
	 * test if animation will be able to run on gpu BEFORE compiling materials
	 * test if the shader objects supports animating the animation set in the vertex shader
	 * if any object using this material fails to support accelerated animations for any of the shader objects,
	 * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	 */
	private _getEnabledGPUAnimation():boolean
	{
		if (this._renderObjectOwner.animationSet) {
			this._renderObjectOwner.animationSet.resetGPUCompatibility();

			var owners:Array<IRenderableOwner> = this._renderObjectOwner.iOwners;
			var numOwners:number = owners.length;

			var len:number = this._passes.length;
			for (var i:number = 0; i < len; i++)
				for (var j:number = 0; j < numOwners; j++)
					if (owners[j].animator)
						(<AnimatorBase> owners[j].animator).testGPUCompatibility(this._passes[i].shader);

			return !this._renderObjectOwner.animationSet.usesCPU;
		}

		return false;
	}
}

export = RenderObjectBase;