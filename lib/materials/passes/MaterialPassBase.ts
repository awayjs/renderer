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
import IContextStageGL				= require("awayjs-stagegl/lib/base/IContextStageGL");

import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import IMaterialPassStageGL			= require("awayjs-renderergl/lib/materials/passes/IMaterialPassStageGL");
import MaterialPassMode				= require("awayjs-renderergl/lib/materials/passes/MaterialPassMode");
import RendererBase					= require("awayjs-renderergl/lib/render/RendererBase");


/**
 * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
class MaterialPassBase extends NamedAssetBase implements IMaterialPass, IMaterialPassStageGL
{
	private _materialPassData:Array<MaterialPassData> = new Array<MaterialPassData>();
	private _maxLights:number = 3;
	private _preserveAlpha:boolean = true;
	private _includeCasters:boolean = true;
	private _forceSeparateMVP:boolean = false;

	private _directionalLightsOffset:number = 0;
	private _pointLightsOffset:number = 0;
	private _lightProbesOffset:number = 0;

	public _pNumPointLights:number = 0;
	public _pNumDirectionalLights:number = 0;
	public _pNumLightProbes:number = 0;
	public _pNumLights:number = 0;

	private _passMode:number;

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
	 * Indicates whether or not shadow casting lights need to be included.
	 */
	public get includeCasters():boolean
	{
		return this._includeCasters;
	}

	public set includeCasters(value:boolean)
	{
		if (this._includeCasters == value)
			return;

		this._includeCasters = value;

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
	 * Indicates the offset in the light picker's directional light vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	public get directionalLightsOffset():number
	{
		return this._directionalLightsOffset;
	}

	public set directionalLightsOffset(value:number)
	{
		this._directionalLightsOffset = value;
	}

	/**
	 * Indicates the offset in the light picker's point light vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	public get pointLightsOffset():number
	{
		return this._pointLightsOffset;
	}

	public set pointLightsOffset(value:number)
	{
		this._pointLightsOffset = value;
	}

	/**
	 * Indicates the offset in the light picker's light probes vector for which to start including lights.
	 * This needs to be set before the light picker is assigned.
	 */
	public get lightProbesOffset():number
	{
		return this._lightProbesOffset;
	}

	public set lightProbesOffset(value:number)
	{
		this._lightProbesOffset = value;
	}

	/**
	 *
	 */
	public get passMode():number
	{
		return this._passMode;
	}

	public set passMode(value:number)
	{
		this._passMode = value;

		this._pInvalidatePass();
	}

	/**
	 * Creates a new MaterialPassBase object.
	 */
	constructor(passMode:number = 0x03)
	{
		super();

		this._passMode = passMode;

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
		var numDirectionalLightsOld:number = this._pNumDirectionalLights;
		var numPointLightsOld:number = this._pNumPointLights;
		var numLightProbesOld:number = this._pNumLightProbes;

		if (this._pLightPicker && (this._passMode & MaterialPassMode.LIGHTING)) {
			this._pNumDirectionalLights = this.calculateNumDirectionalLights(this._pLightPicker.numDirectionalLights);
			this._pNumPointLights = this.calculateNumPointLights(this._pLightPicker.numPointLights);
			this._pNumLightProbes = this.calculateNumProbes(this._pLightPicker.numLightProbes);

			if (this._includeCasters) {
				this._pNumDirectionalLights += this._pLightPicker.numCastingDirectionalLights;
				this._pNumPointLights += this._pLightPicker.numCastingPointLights;
			}

		} else {
			this._pNumDirectionalLights = 0;
			this._pNumPointLights = 0;
			this._pNumLightProbes = 0;
		}

		this._pNumLights = this._pNumDirectionalLights + this._pNumPointLights;

		if (numDirectionalLightsOld != this._pNumDirectionalLights || numPointLightsOld != this._pNumPointLights || numLightProbesOld != this._pNumLightProbes)
			this._pInvalidatePass();
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		if (this._forceSeparateMVP)
			shaderObject.globalPosDependencies++;

		shaderObject.outputsNormals = this._pOutputsNormals(shaderObject);
		shaderObject.outputsTangentNormals = shaderObject.outputsNormals && this._pOutputsTangentNormals(shaderObject);
		shaderObject.usesTangentSpace = shaderObject.outputsTangentNormals && this._pUsesTangentSpace(shaderObject);

		if (!shaderObject.usesTangentSpace)
			shaderObject.addWorldSpaceDependencies(Boolean(this._passMode & MaterialPassMode.EFFECTS));
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
	 * The amount of point lights that need to be supported.
	 */
	public get iNumPointLights():number
	{
		return this._pNumPointLights;
	}

	/**
	 * The amount of directional lights that need to be supported.
	 */
	public get iNumDirectionalLights():number
	{
		return this._pNumDirectionalLights;
	}

	/**
	 * The amount of light probes that need to be supported.
	 */
	public get iNumLightProbes():number
	{
		return this._pNumLightProbes;
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
	 * Calculates the amount of directional lights this material will support.
	 * @param numDirectionalLights The maximum amount of directional lights to support.
	 * @return The amount of directional lights this material will support, bounded by the amount necessary.
	 */
	private calculateNumDirectionalLights(numDirectionalLights:number):number
	{
		return Math.min(numDirectionalLights - this._directionalLightsOffset, this._maxLights);
	}

	/**
	 * Calculates the amount of point lights this material will support.
	 * @param numDirectionalLights The maximum amount of point lights to support.
	 * @return The amount of point lights this material will support, bounded by the amount necessary.
	 */
	private calculateNumPointLights(numPointLights:number):number
	{
		var numFree:number = this._maxLights - this._pNumDirectionalLights;
		return Math.min(numPointLights - this._pointLightsOffset, numFree);
	}

	/**
	 * Calculates the amount of light probes this material will support.
	 * @param numDirectionalLights The maximum amount of light probes to support.
	 * @return The amount of light probes this material will support, bounded by the amount necessary.
	 */
	private calculateNumProbes(numLightProbes:number):number
	{
		var numChannels:number = 0;
		//			if ((this._pSpecularLightSources & LightSources.PROBES) != 0)
		//				++numChannels;
		//
		//			if ((this._pDiffuseLightSources & LightSources.PROBES) != 0)
		//				++numChannels;

		// 4 channels available
		return Math.min(numLightProbes - this._lightProbesOffset, (4/numChannels) | 0);
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

export = MaterialPassBase;