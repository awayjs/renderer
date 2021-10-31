import { AssetEvent } from '@awayjs/core';

import { BlendMode, ContextGLCompareMode, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';

import { CacheRenderer } from '../CacheRenderer';
import { ShaderBase } from './ShaderBase';
import { _Render_ElementsBase } from './_Render_ElementsBase';
import { _Render_MaterialPassBase } from './_Render_MaterialPassBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Shader_TextureBase } from './_Shader_TextureBase';

export class _Render_RendererMaterial extends _Render_MaterialPassBase {
	public _renderer: CacheRenderer;
	public _texture: _Shader_TextureBase;

	constructor(renderer: CacheRenderer, renderElements: _Render_ElementsBase) {
		super(renderer, renderElements);

		this._renderer = renderer;

		this._shader = new ShaderBase(renderElements, this, this, this._stage);

		this._texture = this._renderer.texture.getAbstraction<_Shader_TextureBase>(this._shader);

		this._pAddPass(this);
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._renderer.texture));
		this._texture = null;

		this._renderer = null;
	}

	/**
     * @inheritDoc
     */
	public _pUpdateRender(): void {
		super._pUpdateRender();

		const asset = <CacheRenderer> this._asset;

		this.shader.setBlendMode(BlendMode.LAYER);

		asset.render();

		// LOL, this will broke state
		// this.shader._stage.setRenderTarget(null);

		this.requiresBlending = true;

		this.shader.setBlendMode(asset.blendMode || BlendMode.LAYER);
	}

	public _includeDependencies(shader: ShaderBase): void {
		super._includeDependencies(shader);

		shader.uvDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public _getFragmentCode(regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string {
		return this._texture._getFragmentCode(sharedReg.shadedTarget, regCache, sharedReg, sharedReg.uvVarying);
	}

	public _setRenderState(renderable: _Render_RenderableBase): void {
		super._setRenderState(renderable);

		this._texture._setRenderState(renderable);
	}

	/**
     * @inheritDoc
     */
	public _activate(): void {
		// (<CacheRenderer> this._asset).render();
		// this.shader._stage.setRenderTarget(null);
		super._activate();

		this._stage.context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

		this._texture.activate();
	}
}