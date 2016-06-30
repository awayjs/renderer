import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {BlendMode}					from "@awayjs/core/lib/image/BlendMode";

import {Camera}						from "@awayjs/display/lib/display/Camera";
import {Skybox}						from "@awayjs/display/lib/display/Skybox";

import {ContextGLCompareMode}			from "@awayjs/stage/lib/base/ContextGLCompareMode";

import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_SurfacePassBase}			from "../surfaces/GL_SurfacePassBase";
import {SurfacePool}					from "../surfaces/SurfacePool";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {GL_TextureBase}				from "../textures/GL_TextureBase";

/**
 * GL_SkyboxSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class GL_SkyboxSurface extends GL_SurfacePassBase
{
	public _skybox:Skybox;
	public _texture:GL_TextureBase;

	constructor(skybox:Skybox, elementsClass:IElementsClassGL, renderPool:SurfacePool)
	{
		super(skybox, elementsClass, renderPool);

		this._skybox = skybox;

		this._shader = new ShaderBase(elementsClass, this, this._stage);

		this._texture = <GL_TextureBase> this._shader.getAbstraction(this._skybox.texture);

		this._pAddPass(this);
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._skybox.texture));
		this._texture = null;

		this._skybox = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender():void
	{
		super._pUpdateRender();

		this._pRequiresBlending = (this._surface.blendMode != BlendMode.NORMAL);

		this.shader.setBlendMode((this._surface.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._surface.blendMode);
	}

	public _iIncludeDependencies(shader:ShaderBase):void
	{
		super._iIncludeDependencies(shader);

		shader.usesPositionFragment = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._texture._iGetFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters, sharedRegisters.positionVarying);
	}


	public _setRenderState(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D):void
	{
		super._setRenderState(renderable, camera, viewProjection);

		this._texture._setRenderState(renderable);
	}
	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera):void
	{
		super._iActivate(camera);

		this._stage.context.setDepthTest(false, ContextGLCompareMode.LESS);

		this._texture.activate(this);
	}
}