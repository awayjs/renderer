import BlendMode					= require("awayjs-core/lib/data/BlendMode");

import Camera						= require("awayjs-display/lib/entities/Camera");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

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
	public _cubeTexture:TextureVOBase;

	constructor(pool:RenderPool, skybox:Skybox, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, skybox, renderableClass, stage);

		this._skybox = skybox;

		this._shader = new ShaderBase(renderableClass, this, this._stage);

		this._cubeTexture = this._shader.getTextureVO(this._skybox.cubeMap);

		this._pAddPass(this);
	}

	public dispose()
	{
		super.dispose();

		this._skybox = null;

		this._cubeTexture.dispose();
		this._cubeTexture = null;
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
		this._cubeTexture._iInitRegisters(shader, registerCache);

		return this._cubeTexture._iGetFragmentCode(shader, sharedRegisters.shadedTarget, registerCache, sharedRegisters.localPositionVarying);
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		var context:IContextGL = this._stage.context;
		context.setDepthTest(false, ContextGLCompareMode.LESS);
		this._cubeTexture.activate(this._shader);
	}
}

export = SkyboxRender;