import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import NamedAssetBase				= require("awayjs-core/lib/library/NamedAssetBase");
import ArgumentError				= require("awayjs-core/lib/errors/ArgumentError");
import Event						= require("awayjs-core/lib/events/Event");

import BlendMode					= require("awayjs-display/lib/base/BlendMode");
import Camera						= require("awayjs-display/lib/entities/Camera");
import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
import IMaterialPass				= require("awayjs-display/lib/materials/passes/IMaterialPass");

import Stage						= require("awayjs-stagegl/lib/base/Stage")
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");

import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import RendererBase					= require("awayjs-renderergl/lib/render/RendererBase");


/**
 * MaterialPassGLBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
class MaterialPassGLBase extends NamedAssetBase implements IMaterialPass
{
	private _materialPassData:Array<MaterialPassData> = new Array<MaterialPassData>();
	private _preserveAlpha:boolean = true;
	private _forceSeparateMVP:boolean = false;

	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	private _blendFactorSource:string = ContextGLBlendFactor.ONE;
	private _blendFactorDest:string = ContextGLBlendFactor.ZERO;

	public _pEnableBlending:boolean = false;

	public  _pLightPicker:LightPickerBase;

	private _writeDepth:boolean = true;
	private _onLightsChangeDelegate:(event:Event) => void;

	/**
	 * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
	 */
	public get preserveAlpha():boolean
	{
		return this._preserveAlpha;
	}

	public set preserveAlpha(value:boolean)
	{
		if (this._preserveAlpha == value)
			return;

		this._preserveAlpha = value;

		this._pInvalidatePass();
	}

	/**
	 * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
	 * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
	 * projection code.
	 */
	public get forceSeparateMVP():boolean
	{
		return this._forceSeparateMVP;
	}

	public set forceSeparateMVP(value:boolean)
	{
		if (this._forceSeparateMVP == value)
			return;

		this._forceSeparateMVP = value;

		this._pInvalidatePass();
	}

	/**
	 * Creates a new MaterialPassGLBase object.
	 */
	constructor()
	{
		super();

		this._onLightsChangeDelegate = (event:Event) => this.onLightsChange(event);
	}

	/**
	 * Factory method to create a concrete shader object for this pass.
	 *
	 * @param profile The compatibility profile used by the renderer.
	 */
	public createShaderObject(profile:string):ShaderObjectBase
	{
		return new ShaderObjectBase(profile);
	}

	/**
	 * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
	 */
	public get writeDepth():boolean
	{
		return this._writeDepth;
	}

	public set writeDepth(value:boolean)
	{
		this._writeDepth = value;
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
		this._depthCompareMode = value;
	}

	/**
	 * Cleans up any resources used by the current object.
	 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	 */
	public dispose()
	{
		if (this._pLightPicker)
			this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);

		while (this._materialPassData.length)
			this._materialPassData[0].dispose();

		this._materialPassData = null;
	}

	/**
	 * Renders an object to the current render target.
	 *
	 * @private
	 */
	public _iRender(pass:MaterialPassData, renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
	{
		this.setRenderState(pass, renderable, stage, camera, viewProjection);
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public setRenderState(pass:MaterialPassData, renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
	{
		pass.shaderObject.setRenderState(renderable, stage, camera, viewProjection);
	}

	/**
	 * The blend mode to use when drawing this renderable. The following blend modes are supported:
	 * <ul>
	 * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
	 * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
	 * <li>BlendMode.MULTIPLY</li>
	 * <li>BlendMode.ADD</li>
	 * <li>BlendMode.ALPHA</li>
	 * </ul>
	 */
	public setBlendMode(value:string)
	{
		switch (value) {

			case BlendMode.NORMAL:

				this._blendFactorSource = ContextGLBlendFactor.ONE;
				this._blendFactorDest = ContextGLBlendFactor.ZERO;
				this._pEnableBlending = false;

				break;

			case BlendMode.LAYER:

				this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
				this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
				this._pEnableBlending = true;

				break;

			case BlendMode.MULTIPLY:

				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
				this._pEnableBlending = true;

				break;

			case BlendMode.ADD:

				this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
				this._blendFactorDest = ContextGLBlendFactor.ONE;
				this._pEnableBlending = true;

				break;

			case BlendMode.ALPHA:

				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
				this._pEnableBlending = true;

				break;

			default:

				throw new ArgumentError("Unsupported blend mode!");

		}
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(pass:MaterialPassData, renderer:RendererBase, camera:Camera)
	{
		renderer.context.setDepthTest(( this._writeDepth && !this._pEnableBlending ), this._depthCompareMode);

		if (this._pEnableBlending)
			renderer.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);

		renderer.activateMaterialPass(pass, camera);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate(pass:MaterialPassData, renderer:RendererBase)
	{
		renderer.deactivateMaterialPass(pass);

		renderer.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL); // TODO : imeplement
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
	 */
	public _pInvalidatePass()
	{
		var len:number = this._materialPassData.length;
		for (var i:number = 0; i < len; i++)
			this._materialPassData[i].invalidate();

		this.dispatchEvent(new Event(Event.CHANGE));
	}

	/**
	 * The light picker used by the material to provide lights to the material if it supports lighting.
	 *
	 * @see away.materials.LightPickerBase
	 * @see away.materials.StaticLightPicker
	 */
	public get lightPicker():LightPickerBase
	{
		return this._pLightPicker;
	}

	public set lightPicker(value:LightPickerBase)
	{
		if (this._pLightPicker)
			this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);

		this._pLightPicker = value;

		if (this._pLightPicker)
			this._pLightPicker.addEventListener(Event.CHANGE, this._onLightsChangeDelegate);

		this.pUpdateLights();
	}

	/**
	 * Called when the light picker's configuration changes.
	 */
	private onLightsChange(event:Event)
	{
		this.pUpdateLights();
	}

	/**
	 * Implemented by subclasses if the pass uses lights to update the shader.
	 */
	public pUpdateLights()
	{
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		if (this._forceSeparateMVP)
			shaderObject.globalPosDependencies++;

		shaderObject.outputsNormals = this._pOutputsNormals(shaderObject);
		shaderObject.outputsTangentNormals = shaderObject.outputsNormals && this._pOutputsTangentNormals(shaderObject);
		shaderObject.usesTangentSpace = shaderObject.outputsTangentNormals && this._pUsesTangentSpace(shaderObject);

		if (!shaderObject.usesTangentSpace && shaderObject.viewDirDependencies > 0)
			shaderObject.globalPosDependencies++;
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

	public _iAddMaterialPassData(materialPassData:MaterialPassData):MaterialPassData
	{
		this._materialPassData.push(materialPassData);

		return materialPassData;
	}

	public _iRemoveMaterialPassData(materialPassData:MaterialPassData):MaterialPassData
	{
		this._materialPassData.splice(this._materialPassData.indexOf(materialPassData), 1);

		return materialPassData;
	}
}

export = MaterialPassGLBase;