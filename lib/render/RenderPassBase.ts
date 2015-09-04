import BlendMode					= require("awayjs-core/lib/data/BlendMode");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import AssetBase					= require("awayjs-core/lib/library/AssetBase");
import ArgumentError				= require("awayjs-core/lib/errors/ArgumentError");
import Event						= require("awayjs-core/lib/events/Event");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");

import Camera						= require("awayjs-display/lib/entities/Camera");
import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage")

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");

/**
 * RenderPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
class RenderPassBase extends RenderBase implements IPass
{
	public _shader:ShaderBase;

	public get shader():ShaderBase
	{
		return this._shader;
	}

	public get animationSet():AnimationSetBase
	{
		return <AnimationSetBase> this._renderOwner.animationSet;
	}

	/**
	 * Cleans up any resources used by the current object.
	 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	 */
	public dispose()
	{
		super.dispose();

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

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
	 */
	public invalidatePass()
	{
		this._shader.invalidateShader();

		this.dispatchEvent(new Event(Event.CHANGE));
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

export = RenderPassBase;