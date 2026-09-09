import { BlendMode, ContextGLCompareMode, ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';

import { CacheRenderer } from '../CacheRenderer';
import { ShaderBase } from './ShaderBase';
import { _Render_ElementsBase } from './_Render_ElementsBase';
import { _Render_MaterialPassBase } from './_Render_MaterialPassBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Shader_TextureBase } from './_Shader_TextureBase';

export class _Render_RendererMaterial extends _Render_MaterialPassBase {
	public _texture: _Shader_TextureBase;

	public init(material: CacheRenderer, renderElements: _Render_ElementsBase): void {
		super.init(material, renderElements);

		this._shader = new ShaderBase(renderElements, this, this, this._stage);

		this._texture = this._shader.abstractions.getAbstraction<_Shader_TextureBase>(material.texture);

		this._pAddPass(this);
	}

	public onClear(): void {
		super.onClear();

		this._texture = null;
	}

	/**
     * @inheritDoc
     */
	public _pUpdateRender(): void {
		super._pUpdateRender();

		const material = <CacheRenderer> this.material;

		// Sticky cache: only rebuild RTT when contentDirty (child/material/filter).
		// Parent scene-transform refreshes the blit quad without re-entering render().
		if (material.contentDirty || !material.style?.image)
			material.render();

		this.requiresBlending = true;

		this.shader.setBlendMode((material.blendMode == BlendMode.NORMAL) ? BlendMode.LAYER : material.blendMode);
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
		super._activate();

		this._stage.context.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

		this._texture.activate();
	}
}