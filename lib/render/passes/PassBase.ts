import BlendMode					= require("awayjs-core/lib/image/BlendMode");
import ImageBase					= require("awayjs-core/lib/image/ImageBase");
import SamplerBase					= require("awayjs-core/lib/image/SamplerBase");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import AssetBase					= require("awayjs-core/lib/library/AssetBase");
import ArgumentError				= require("awayjs-core/lib/errors/ArgumentError");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");

import Camera						= require("awayjs-display/lib/entities/Camera");
import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage")

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import PassEvent					= require("awayjs-renderergl/lib/events/PassEvent");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");

/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
class PassBase extends EventDispatcher implements IPass
{
	private _render:RenderBase;
	public _renderOwner:IRenderOwner;
	public _renderableClass:IRenderableClass;
	public _stage:Stage;
	
	public _shader:ShaderBase;

	private _preserveAlpha:boolean = true;
	private _forceSeparateMVP:boolean = false;

	public get shader():ShaderBase
	{
		return this._shader;
	}

	public get animationSet():AnimationSetBase
	{
		return <AnimationSetBase> this._renderOwner.animationSet;
	}

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

		this.invalidate();
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

		this.invalidate();
	}

	/**
	 * Creates a new PassBase object.
	 */
	constructor(render:RenderBase, renderOwner:IRenderOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super();

		this._render = render;
		this._renderOwner = renderOwner;
		this._renderableClass = renderableClass;
		this._stage = stage;
	}

	public getImageIndex(image:ImageBase):number
	{
		return this._renderOwner.getImageIndex(image);
	}


	public getSamplerIndex(texture:TextureBase, index:number = 0):number
	{
		return this._renderOwner.getSamplerIndex(texture, index);
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 */
	public invalidate()
	{
		this._shader.invalidateShader();

		this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
	}

	/**
	 * Cleans up any resources used by the current object.
	 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	 */
	public dispose()
	{
		this._render = null;
		this._renderOwner = null;
		this._renderableClass = null;
		this._stage = null;

		if (this._shader) {
			this._shader.dispose();
			this._shader = null;
		}
	}

	/**
	 * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
	 * @param pass The pass used to render the renderable.
	 * @param renderable The IRenderable object to draw.
	 * @param stage The Stage object used for rendering.
	 * @param entityCollector The EntityCollector object that contains the visible scene data.
	 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	 * camera.viewProjection as it includes the scaling factors when rendering to textures.
	 *
	 * @internal
	 */
	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		this._shader._iRender(renderable, camera, viewProjection);
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(camera:Camera)
	{
		this._shader._iActivate(camera);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate()
	{
		this._shader._iDeactivate();
	}

	public _iIncludeDependencies(shader:ShaderBase)
	{
		this._render._iIncludeDependencies(shader);
		
		if (this._forceSeparateMVP)
			shader.globalPosDependencies++;
	}


	public _iInitConstantData(shader:ShaderBase)
	{

	}

	public _iGetPreLightingVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetPreLightingFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
}

export = PassBase;