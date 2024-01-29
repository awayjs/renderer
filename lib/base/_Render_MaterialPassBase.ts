
import { ShaderRegisterCache, ShaderRegisterData } from '@awayjs/stage';
import { PassEvent } from '../events/PassEvent';
import { IPass } from './IPass';
import { ShaderBase } from './ShaderBase';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';

/**
 * _Render_MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
export class _Render_MaterialPassBase extends _Render_MaterialBase implements IPass {
	public _shader: ShaderBase;

	public get shader(): ShaderBase {
		return this._shader;
	}

	public get numUsedStreams(): number {
		return this._shader.numUsedStreams;
	}

	public get numUsedTextures(): number {
		return this._shader.numUsedTextures;
	}

	public _includeDependencies(shader: ShaderBase): void {
		shader.alphaThreshold = this._material.alphaThreshold;
		shader.useImageRect = this._material.imageRect;
		shader.usesCurves =  this._material.curves;
		shader.useBothSides =  this._material.bothSides;
		shader.usesUVTransform =  this._material.animateUVs;
		shader.usesColorTransform = this._material.useColorTransform;
	}

	/**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
	public invalidate(): void {
		this._shader.invalidateProgram();

		this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
	}

	public dispose(): void {
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
	public _setRenderState(renderState: _Render_RenderableBase): void {
		this._shader._setRenderState(renderState);
	}

	/**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
	public _activate(): void {
		this._shader._activate();
	}

	/**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
	public _deactivate(): void {
		this._shader._deactivate();
	}

	public _initConstantData(): void {

	}

	public _getVertexCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		return '';
	}

	public _getFragmentCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		return '';
	}

	public _getPostAnimationFragmentCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		return '';
	}

	public _getNormalVertexCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		return '';
	}

	public _getNormalFragmentCode(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string {
		return '';
	}
}