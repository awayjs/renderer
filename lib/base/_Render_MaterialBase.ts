import { AssetEvent, AbstractionBase } from '@awayjs/core';

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
import { RenderGroup } from '../RenderGroup';
import { IAnimationSet } from './IAnimationSet';
import { _Render_ElementsBase } from './_Render_ElementsBase';
import { ShaderBase } from './ShaderBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { IRenderContainer } from './IRenderContainer';
import { RendererBase } from '../RendererBase';

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
	private _owners: Array<_Render_RenderableBase> = new Array<_Render_RenderableBase>();

	protected _renderOrderId: number;
	protected _passes: Array<IPass> = new Array<IPass>();
	protected _material: IMaterial;
	private _animationSet: IAnimationSet;
	protected _renderElements: _Render_ElementsBase;
	protected _stage: Stage;
	protected _renderer: RendererBase;

	private _invalidAnimation: boolean = true;
	protected _invalidRender: boolean = true;
	private _invalidImages: boolean = true;

	private _imageIndices: Object = new Object();
	private _numImages: number;
	private _usesAnimation: boolean = false;

	public _activePass: IPass;

	public images: Array<_Stage_ImageBase> = new Array<_Stage_ImageBase>();

	public samplers: Array<ImageSampler> = new Array<ImageSampler>();

	/**
     * Indicates whether or not the renderable requires alpha blending during rendering.
     */
	public requiresBlending: boolean = false;

	public materialID: number;

	public get animationSet(): IAnimationSet {
		return this._animationSet;
	}

	public get material(): IMaterial {
		return this._material;
	}

	public get numImages(): number {
		if (this._invalidImages)
			this._updateImages();

		return this._numImages;
	}

	public get renderOrderId(): number {
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._renderOrderId;
	}

	public get numPasses(): number {
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._passes.length;
	}

	public get style(): Style {
		return this._material.style;
	}

	public get renderer(): RendererBase {
		return this._renderer;
	}

	public get renderElements(): _Render_ElementsBase {
		return this._renderElements;
	}

	constructor(material: IMaterial, renderElements: _Render_ElementsBase) {
		super(material, renderElements);

		this.materialID = material.id;
		this._material = material;
		this._renderElements = renderElements;
		this._stage = renderElements.stage;
		this._renderer = renderElements.renderer;

		this._onInvalidateTexturesDelegate = (event: MaterialEvent) => this.onInvalidateTextures(event);
		this._onInvalidatePassesDelegate = (event: MaterialEvent) => this.onInvalidatePasses(event);

		this._material.addEventListener(MaterialEvent.INVALIDATE_TEXTURES, this._onInvalidateTexturesDelegate);
		this._material.addEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

		this._onPassInvalidateDelegate = (event: PassEvent) => this.onPassInvalidate(event);

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
		this._activePass._activate(this._renderer.view);
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
		this._owners.push(owner);

		let animationSet: IAnimationSet;
		const animator: IAnimator = (<IRenderContainer> owner.node.container).animator;

		if (animator)
			animationSet = <IAnimationSet> animator.animationSet;

		if ((<IRenderContainer> owner.node.container).animator) {
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
		this._owners.splice(this._owners.indexOf(owner), 1);

		if (!this._owners.length)
			this.onClear(null);
	}

	public getImageIndex(texture: ITexture, index: number = 0): number {
		if (this._invalidImages)
			this._updateImages();

		return this._imageIndices[texture.id][index];
	}

	/**
	 *
	 */
	public onClear(event: AssetEvent): void {
		super.onClear(event);

		const len: number = this._passes.length;
		for (let i: number = 0; i < len; i++) {
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
			this._passes[i].dispose();
		}

		this._passes = null;

		this._material.removeEventListener(MaterialEvent.INVALIDATE_TEXTURES, this._onInvalidateTexturesDelegate);
		this._material.removeEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

		this._animationSet = null;
		this._material = null;
		this._renderElements = null;
		this._stage = null;
		this._owners = null;
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
		const renderables: Array<_Render_RenderableBase> = this._owners;
		const numOwners: number = renderables.length;
		for (let j: number = 0; j < numOwners; j++)
			renderables[j]._onInvalidateStyle();
	}

	/**
	 *
	 */
	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);

		this._invalidRender = true;
		this._invalidAnimation = true;
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
		if (this._invalidRender)
			this._pUpdateRender();

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

			const renderables: Array<_Render_RenderableBase> = this._owners;
			const numOwners: number = renderables.length;
			for (let j: number = 0; j < numOwners; j++)
				renderables[j]._onInvalidateElements();
		}

		this._renderOrderId = renderOrderId;
	}

	private _updateImages(): void {
		this._invalidImages = false;

		const style: Style = this._material.style;
		const numTextures: number = this._material.getNumTextures();
		let texture: ITexture;
		let numImages: number;
		let images: Array<number>;
		let asset: ImageBase;
		let index: number = 0;

		for (let i: number = 0; i < numTextures; i++) {
			texture = this._material.getTextureAt(i);
			numImages = texture.getNumImages();
			images = this._imageIndices[texture.id] = new Array<number>();
			for (let j: number = 0; j < numImages; j++) {
				asset = texture.getImageAt(j) || style?.getImageAt(texture, j) || ImageUtils.getDefaultImage2D();
				this.images[index] = asset.getAbstraction<_Stage_ImageBase>(this._stage);

				this.samplers[index] = texture.getSamplerAt(j)
					|| style?.getSamplerAt(texture, j)
					|| ImageUtils.getDefaultSampler();

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

			const entities: Array<_Render_RenderableBase> = this._owners;
			const numOwners: number = entities.length;

			const len: number = this._passes.length;
			let shader: ShaderBase;
			for (let i: number = 0; i < len; i++) {
				shader = <ShaderBase> this._passes[i].shader;
				shader.usesAnimation = false;
				for (let j: number = 0; j < numOwners; j++)
					if ((<IRenderContainer> entities[j].node.container).animator)
						(<IRenderContainer> entities[j].node.container).animator.testGPUCompatibility(shader);
			}

			return !this._animationSet.usesCPU;
		}

		return false;
	}
}