import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Event						= require("awayjs-core/lib/events/Event");
import AssetType					= require("awayjs-core/lib/library/AssetType");

import IRenderObject				= require("awayjs-display/lib/pool/IRenderObject");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import Camera						= require("awayjs-display/lib/entities/Camera");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import IRenderObjectBase			= require("awayjs-renderergl/lib/compilation/IRenderObjectBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 *
 * @class away.pool.ScreenPasses
 */
class RenderObjectBase implements IRenderObject, IRenderObjectBase
{
	public _forceSeparateMVP:boolean = false;

	private _pool:RenderObjectPool;
	public _renderObjectOwner:IRenderObjectOwner;
	public _renderableClass:IRenderableClass;
	public _stage:Stage;

	private _renderOrderId:number;
	private _invalidAnimation:boolean = true;
	private _invalidRenderObject:boolean = true;
	private _shaderObjects:Array<ShaderObjectBase> = new Array<ShaderObjectBase>();



	public _pRequiresBlending:boolean = false;

	private _onShaderChangeDelegate:(event:Event) => void;

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

	public get shaderObjects():Array<ShaderObjectBase>
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._shaderObjects;
	}

	constructor(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		this._pool = pool;
		this.renderObjectId = renderObjectOwner.id;
		this._renderObjectOwner = renderObjectOwner;
		this._renderableClass = renderableClass;
		this._stage = stage;


		this._onShaderChangeDelegate = (event:Event) => this.onShaderChange(event);
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		if (this._renderObjectOwner.assetType = AssetType.MATERIAL) {
			var material:MaterialBase = <MaterialBase> this._renderObjectOwner;
			shaderObject.useAlphaPremultiplied = material.alphaPremultiplied;
			shaderObject.useBothSides = material.bothSides;
			shaderObject.repeatTextures = material.repeat;
			shaderObject.usesUVTransform = material.animateUVs;
			shaderObject.texture = material.texture;
			shaderObject.color = material.color;
		}

		if (this._forceSeparateMVP)
			shaderObject.globalPosDependencies++;

		shaderObject.outputsNormals = this._pOutputsNormals(shaderObject);
		shaderObject.outputsTangentNormals = shaderObject.outputsNormals && this._pOutputsTangentNormals(shaderObject);
		shaderObject.usesTangentSpace = shaderObject.outputsTangentNormals && this._pUsesTangentSpace(shaderObject);

		if (!shaderObject.usesTangentSpace && shaderObject.viewDirDependencies > 0)
			shaderObject.globalPosDependencies++;
	}

	/**
	 * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
	 * @param pass The pass used to render the renderable.
	 * @param renderable The IRenderable object to draw.
	 * @param stage The Stage object used for rendering.
	 * @param entityCollector The EntityCollector object that contains the visible scene data.
	 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	 * camera.viewProjection as it includes the scaling factors when rendering to textures.
	 *
	 * @internal
	 */
	public _iRender(renderable:RenderableBase, shader:ShaderObjectBase, camera:Camera, viewProjection:Matrix3D)
	{
		if (this._renderObjectOwner.lightPicker)
			this._renderObjectOwner.lightPicker.collectLights(renderable);

		shader._iRender(renderable, camera, viewProjection);
	}

	/**
	 *
	 */
	public dispose()
	{
		this._pClearScreenShaders();

		var len:number = this._shaderObjects.length;
		for (var i:number = 0; i < len; i++)
			this._shaderObjects[i].dispose();

		this._shaderObjects = null;

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
	public invalidateProperties()
	{
		var len:number = this._shaderObjects.length;
		for (var i:number = 0; i < len; i++)
			this._shaderObjects[i].invalidateShader();

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
		var len:number = this._shaderObjects.length;
		for (var i:number = 0; i < len; i++) {
			shaderObject = this._shaderObjects[i];

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
	public _pRemoveScreenShader(shader:ShaderObjectBase)
	{
		shader.removeEventListener(Event.CHANGE, this._onShaderChangeDelegate);
		this._shaderObjects.splice(this._shaderObjects.indexOf(shader), 1);
	}

	/**
	 * Removes all passes from the renderObjectOwner
	 */
	public _pClearScreenShaders()
	{
		var len:number = this._shaderObjects.length;
		for (var i:number = 0; i < len; ++i)
			this._shaderObjects[i].removeEventListener(Event.CHANGE, this._onShaderChangeDelegate);

		this._shaderObjects.length = 0;
	}

	/**
	 * Adds a pass to the renderObjectOwner
	 * @param pass
	 */
	public _pAddScreenShader(shader:ShaderObjectBase)
	{
		this._shaderObjects.push(shader);
		shader.addEventListener(Event.CHANGE, this._onShaderChangeDelegate);
	}

	/**
	 * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
	 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param pass The pass data to activate.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(shader:ShaderObjectBase, camera:Camera) // ARCANE
	{
		shader._iActivate(camera);
	}

	/**
	 * Clears the render state for a pass. This needs to be called before activating another pass.
	 * @param pass The pass to deactivate.
	 * @param stage The Stage used for rendering
	 *
	 * @internal
	 */
	public _iDeactivate(shader:ShaderObjectBase) // ARCANE
	{
		shader._iDeactivate();
	}

	public _iInitConstantData(shaderObject:ShaderObjectBase)
	{

	}

	public _iGetPreLightingVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetPreLightingFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * Indicates whether or not normals are calculated at all.
	 */
	public _pOutputsNormals(shaderObject:ShaderObjectBase):boolean
	{
		return false;
	}

	/**
	 * Indicates whether or not normals are calculated in tangent space.
	 */
	public _pOutputsTangentNormals(shaderObject:ShaderObjectBase):boolean
	{
		return false;
	}

	/**
	 * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
	 * dependencies exist.
	 */
	public _pUsesTangentSpace(shaderObject:ShaderObjectBase):boolean
	{
		return false;
	}

	/**
	 * Listener for when a pass's shader code changes. It recalculates the render order id.
	 */
	private onShaderChange(event:Event)
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

			var len:number = this._shaderObjects.length;
			for (var i:number = 0; i < len; i++)
				for (var j:number = 0; j < numOwners; j++)
					if (owners[j].animator)
						(<AnimatorBase> owners[j].animator).testGPUCompatibility(this._shaderObjects[i]);

			return !this._renderObjectOwner.animationSet.usesCPU;
		}

		return false;
	}
}

export = RenderObjectBase;