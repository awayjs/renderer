import { AbstractionBase, WeakAssetSet } from '@awayjs/core';

import {
	Stage,
	_Stage_ImageBase,
	ImageSampler,
	ImageUtils,
	ImageBase,
} from '@awayjs/stage';

import { IPass } from './IPass';
import { Style } from './Style';
import { IMaterial } from './IMaterial';
import { IAnimator } from './IAnimator';
import { ITexture } from '../base/ITexture';
import { PassEvent } from '../events/PassEvent';
import { MaterialEvent } from '../events/MaterialEvent';
import { IAnimationSet } from './IAnimationSet';
import { _Render_ElementsBase } from './_Render_ElementsBase';
import { ShaderBase } from './ShaderBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { IRenderContainer } from './IRenderContainer';
import { CacheRenderer } from '../CacheRenderer';
import { RenderEntity } from './RenderEntity';

/**
 *
 * @class away.pool.Passes
 */
export class _Render_MaterialBase extends AbstractionBase {
	private _onInvalidateTexturesDelegate: (event: MaterialEvent) => void;
	private _onInvalidatePassesDelegate: (event: MaterialEvent) => void;
	private _onPassInvalidateDelegate: (event: PassEvent) => void;

	/**
	 * A list of material owners, renderables or custom Entities.
	 */
	public _owners: WeakAssetSet<_Render_RenderableBase> = new WeakAssetSet<_Render_RenderableBase>();

	protected _renderOrderId: number;
	protected _passes: IPass[] = [];
	private _animationSet: IAnimationSet;
	protected _stage: Stage;

	private _invalidAnimation: boolean = true;
	protected _invalidRender: boolean = true;
	private _invalidImages: boolean = true;

	private _imageIndices: Record<number, number[]> = {};
	private _numImages: number;
	private _usesAnimation: boolean = false;

	public _activePass: IPass;

	public readonly images: ImageBase[] = [];

	public readonly samplers: ImageSampler[] = [];

	/**
     * Indicates whether or not the renderable requires alpha blending during rendering.
     */
	public requiresBlending: boolean = false;

	public materialID: number;

	public get animationSet(): IAnimationSet {
		return this._animationSet;
	}

	public get material(): IMaterial {
		return this._useWeak ? (<WeakRef<IMaterial>> this._asset).deref() : <IMaterial> this._asset;
	}

	public get renderElements(): _Render_ElementsBase {
		return <_Render_ElementsBase> this._pool;
	}

	public get numImages(): number {
		if (this._invalidImages)
			this._updateImages();

		return this._numImages;
	}

	public get renderOrderId(): number {
		if (this._invalidRender)
			this._pUpdateRender();
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._renderOrderId;
	}

	public get numPasses(): number {
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._passes.length;
	}

	constructor() {
		super();

		this._onInvalidateTexturesDelegate = (event: MaterialEvent) => this.onInvalidateTextures(event);
		this._onInvalidatePassesDelegate = (event: MaterialEvent) => this.onInvalidatePasses(event);
		this._onPassInvalidateDelegate = (event: PassEvent) => this.onPassInvalidate(event);
	}

	public init(material: IMaterial, renderElements: _Render_ElementsBase): void {
		super.init(material, renderElements, true);

		this.materialID = material.id;
		this._stage = renderElements.stage;

		material.addEventListener(MaterialEvent.INVALIDATE_TEXTURES, this._onInvalidateTexturesDelegate);
		material.addEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);
	}

	public activatePass(index: number): void {
		this._activePass = this._passes[index];

		//clear unused vertex streams
		let i: number;
		for (i =  this._activePass.shader.numUsedStreams; i < this._stage.numUsedStreams; i++)
			this._stage.context.setVertexBufferAt(i, null);

		//clear unused texture streams
		for (i =  this._activePass.shader.numUsedTextures; i < this._stage.numUsedTextures; i++)
			this._stage.context.setTextureAt(i, null);

		//activate shader object through pass
		this._activePass._activate();
	}

	public deactivatePass(): void {
		//deactivate shader object through pass
		this._activePass._deactivate();

		this._stage.numUsedStreams = this._activePass.shader.numUsedStreams;
		this._stage.numUsedTextures = this._activePass.shader.numUsedTextures;
	}

	//
	// MATERIAL MANAGEMENT
	//
	/**
	 * Mark an IEntity as owner of this material.
	 * Assures we're not using the same material across renderables with different animations, since the
	 * Programs depend on animation. This method needs to be called when a material is assigned.
	 *
	 * @param owner The IEntity that had this material assigned
	 *
	 * @internal
	 */
	public addOwner(owner: _Render_RenderableBase): void {
		this._owners.add(owner);

		let animationSet: IAnimationSet;
		const animator: IAnimator = (<IRenderContainer> owner.entity.node.container).animator;

		if (animator)
			animationSet = <IAnimationSet> animator.animationSet;

		if ((<IRenderContainer> (<RenderEntity> owner.entity).node.container).animator) {
			if (this._animationSet && animationSet != this._animationSet) {
				throw new Error(
					'A Material instance cannot be shared across ' +
					'material owners with different animation sets');
			} else {
				if (this._animationSet != animationSet) {

					this._animationSet = animationSet;

					this._invalidAnimation = true;
				}
			}
		}
	}

	/**
	 * Removes an IEntity as owner.
	 * @param owner
	 *
	 * @internal
	 */
	public removeOwner(owner: _Render_RenderableBase): void {
		if (!this._owners) //check if material is already disposed
			return;

		this._owners.remove(owner);

		if (!this._owners.numAssets)
			this.onClear();
	}

	public getImageIndex(texture: ITexture, index: number = 0): number {
		if (this._invalidImages)
			this._updateImages();

		return this._imageIndices[texture.id][index];
	}

	/**
	 *
	 */
	public onClear(): void {
		const len: number = this._passes.length;
		for (let i: number = 0; i < len; i++) {
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
			this._passes[i].dispose();
		}

		this._passes.length = 0;
		this._owners.clear();

		const material = this.material;

		if (material) {
			material.removeEventListener(MaterialEvent.INVALIDATE_TEXTURES, this._onInvalidateTexturesDelegate);
			material.removeEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);
		}

		this._animationSet = null;
		this._stage = null;

		this._invalidAnimation = true;
		this._invalidRender = true;
		this._invalidImages = true;

		this._imageIndices = {};
		this._usesAnimation = false;

		this._activePass = null;
		this.images.length = 0;
		this.samplers.length = 0;

		super.onClear();
	}

	/**
     *
     */
	public onInvalidatePasses(event: MaterialEvent): void {
		const len: number = this._passes.length;
		for (let i: number = 0; i < len; i++)
			this._passes[i].invalidate();

		this._invalidAnimation = true;
		this._invalidImages = true;
	}

	/**
     * Listener for when a pass's shader code changes. It recalculates the render order id.
     */
	private onPassInvalidate(event: PassEvent): void {
		this._invalidAnimation = true;
	}

	/**
     *
     */
	public onInvalidateTextures(event: MaterialEvent): void {
		this._owners.forEach((asset: _Render_RenderableBase) => asset._onInvalidateStyle());
	}

	/**
	 *
	 */
	public onInvalidate(): void {
		super.onInvalidate();

		this._invalidRender = true;
		this._invalidAnimation = true;

		//prevent infinite loop with cacheRenderer invalidation
		if (<CacheRenderer> this.renderElements.renderer != this.material)
			(<CacheRenderer> this.renderElements.renderer).invalidate();
	}

	/**
     * Removes all passes from the surface
     */
	public _pClearPasses(): void {
		const len: number = this._passes.length;
		for (let i: number = 0; i < len; ++i)
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);

		this._passes.length = 0;
	}

	/**
     * Adds a pass to the surface
     * @param pass
     */
	public _pAddPass(pass: IPass): void {
		this._passes.push(pass);
		pass.addEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
	}

	/**
     * Removes a pass from the surface.
     * @param pass The pass to be removed.
     */
	public _pRemovePass(pass: IPass): void {
		pass.removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
		this._passes.splice(this._passes.indexOf(pass), 1);
	}

	/**
	 * Performs any processing that needs to occur before any of its passes are used.
	 *
	 * @private
	 */
	public _pUpdateRender(): void {
		if (this._invalidImages)
			this._updateImages();

		this._invalidRender = false;
	}

	/**
     *
     * @param surface
     */
	protected _updateAnimation(): void {
		// if (this._invalidRender)
		// 	this._pUpdateRender();

		this._invalidAnimation = false;

		const usesAnimation: boolean = this._getEnabledGPUAnimation();

		let renderOrderId = 0;
		let mult: number = 1;
		let shader: ShaderBase;
		const len: number = this._passes.length;
		for (let i: number = 0; i < len; i++) {
			shader = <ShaderBase> this._passes[i].shader;
			shader.usesAnimation = usesAnimation;

			// this is getter, this enforce update programData
			// renderOrderId += shader.programData.id * mult;
			if ((<any>shader)._programData) {
				renderOrderId += (<any>shader)._programData.id * mult;
			} else {
				renderOrderId += shader.programData.id * mult;
			}

			mult *= 1000;
		}

		if (this._usesAnimation != usesAnimation) {
			this._usesAnimation = usesAnimation;

			this._owners.forEach((asset: _Render_RenderableBase) => asset._onInvalidateElements());
		}

		this._renderOrderId = renderOrderId;
	}

	private _updateImages(): void {
		const material: IMaterial = this.material;
		this._invalidImages = false;

		const style: Style = material.style;
		const numTextures: number = material.getNumTextures();
		let texture: ITexture;
		let numImages: number;
		let images: number[];
		let index: number = 0;

		for (let i: number = 0; i < numTextures; i++) {
			texture = material.getTextureAt(i);
			numImages = texture.getNumImages();
			images = this._imageIndices[texture.id] = [];
			for (let j: number = 0; j < numImages; j++) {
				this.images[index] = style?.getImageAt(texture, j)
					|| texture.getImageAt(j)
					|| ImageUtils.getDefaultImage2D();

				this.samplers[index] = style?.getSamplerAt(texture, j)
					|| texture.getSamplerAt(j)
					|| ImageUtils.getDefaultImageSampler();

				images[j] = index++;
			}
		}

		this._numImages = index;
	}

	/**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
	private _getEnabledGPUAnimation(): boolean {
		if (this._animationSet) {
			this._animationSet.resetGPUCompatibility();

			const len: number = this._passes.length;
			let shader: ShaderBase;
			for (let i: number = 0; i < len; i++) {
				shader = <ShaderBase> this._passes[i].shader;
				shader.usesAnimation = false;
				this._owners.forEach((asset: _Render_RenderableBase) => {
					if ((<IRenderContainer> (<RenderEntity> asset.entity).node.container).animator)
						(<IRenderContainer> (<RenderEntity> asset.entity).node.container).animator.testGPUCompatibility(shader);
				});
			}

			return !this._animationSet.usesCPU;
		}

		return false;
	}
}