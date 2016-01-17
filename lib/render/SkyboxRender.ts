import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import BlendMode					= require("awayjs-core/lib/image/BlendMode");

import Camera						= require("awayjs-display/lib/entities/Camera");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import RenderPassBase				= require("awayjs-renderergl/lib/render/RenderPassBase");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");

/**
 * SkyboxRender forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class SkyboxRender extends RenderPassBase
{
	public _skybox:Skybox;
	public _texture:TextureVOBase;

	constructor(skybox:Skybox, renderableClass:IRenderableClass, renderPool:RenderPool)
	{
		super(skybox, renderableClass, renderPool);

		this._skybox = skybox;

		this._shader = new ShaderBase(renderableClass, this, this._stage);

		this._texture = <TextureVOBase> this._shader.getAbstraction(this._skybox.texture);

		this._pAddPass(this);
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._skybox.texture));
		this._texture = null;

		this._skybox = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender()
	{
		super._pUpdateRender();

		this._pRequiresBlending = (this._renderOwner.blendMode != BlendMode.NORMAL);

		this.shader.setBlendMode((this._renderOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._renderOwner.blendMode);
	}

	public _iIncludeDependencies(shader:ShaderBase)
	{
		super._iIncludeDependencies(shader);

		shader.usesLocalPosFragment = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._texture._iGetFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters, sharedRegisters.localPositionVarying);
	}


	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(renderable, camera, viewProjection);

		this._texture._setRenderState(renderable);
	}
	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		this._stage.context.setDepthTest(false, ContextGLCompareMode.LESS);

		this._texture.activate(this);
	}
}

export = SkyboxRender;