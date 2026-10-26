import { BlendMode, ContextGLCompareMode, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { CacheRenderer } from '../CacheRenderer';
import { ShaderBase } from './ShaderBase';
import { _Render_ElementsBase } from './_Render_ElementsBase';
import { _Render_MaterialPassBase } from './_Render_MaterialPassBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Shader_TextureBase } from './_Shader_TextureBase';

export class _Render_RendererMaterial extends _Render_MaterialPassBase {
	public _texture: _Shader_TextureBase;
	private _fragmentConstantsIndex: number = -1;

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
		const targetReg: ShaderRegisterElement = sharedReg.shadedTarget;
		let code: string = this._texture._getFragmentCode(targetReg, regCache, sharedReg, sharedReg.uvVarying);

		// a cached image drawn into an alpha-channel mask clips by its alpha, like any other textured fill
		if (this._shader.alphaThreshold > 0) {
			const cutOffReg: ShaderRegisterElement = regCache.getFreeFragmentConstant();
			this._fragmentConstantsIndex = cutOffReg.index * 4;

			code += 'sub ' + targetReg + '.w, ' + targetReg + '.w, ' + cutOffReg + '.x\n'
				+ 'kil ' + targetReg + '.w\n'
				+ 'add ' + targetReg + '.w, ' + targetReg + '.w, ' + cutOffReg + '.x\n';
		} else {
			this._fragmentConstantsIndex = -1;
		}

		return code;
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

		if (this._fragmentConstantsIndex >= 0)
			this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
	}
}