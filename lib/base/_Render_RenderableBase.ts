import {AbstractMethodError, AssetEvent, Matrix, Matrix3D, AbstractionBase, ProjectionBase} from "@awayjs/core";

import {Stage, _Stage_ImageBase, ImageSampler, ImageBase, Viewport} from "@awayjs/stage";

import {RenderableEvent} from "../events/RenderableEvent";
import {MaterialUtils} from "../utils/MaterialUtils";

import {RenderGroup} from "../RenderGroup";

import {_Render_MaterialBase} from "./_Render_MaterialBase";
import {_Stage_ElementsBase} from "./_Stage_ElementsBase";
import {IRenderable} from "./IRenderable";
import {IEntity} from "./IEntity";
import {IPass} from "./IPass";
import {IMaterial} from "./IMaterial";
import {RenderEntity} from "./RenderEntity";
import {ITexture} from "./ITexture";
import {Style} from "./Style";


/**
 * @class RenderableListItem
 */
export class _Render_RenderableBase extends AbstractionBase
{
    private _onInvalidateElementsDelegate:(event:RenderableEvent) => void;
	private _onInvalidateMaterialDelegate:(event:RenderableEvent) => void;
	private _materialDirty:boolean = true;
    private _stageElements:_Stage_ElementsBase;
    private _elementsDirty:boolean = true;

    public JOINT_INDEX_FORMAT:string;
    public JOINT_WEIGHT_FORMAT:string;

    public _count:number = 0;
    public _offset:number = 0;

    protected _stage:Stage;
    protected _renderMaterial:_Render_MaterialBase;

    public renderGroup:RenderGroup;

    /**
     *
     */
    public images:Array<_Stage_ImageBase> = new Array<_Stage_ImageBase>();

    /**
     *
     */
    public samplers:Array<ImageSampler> = new Array<ImageSampler>();

	/**
	 *
	 */
	public renderSceneTransform:Matrix3D;

	/**
	 *
	 */
	public sourceEntity:IEntity;

	/**
	 *
	 */
	public renderable:IRenderable;

	/**
	 *
	 */
	public uvMatrix:Matrix;


    /**
     *
     */
    public next:_Render_RenderableBase;

    public id:number;

    /**
     *
     */
    public materialID:number;

    /**
     *
     */
    public renderOrderId:number;

    /**
     *
     */
    public zIndex:number;

    /**
     *
     */
    public maskId:number;

    /**
     *
     */
    public maskOwners:Array<IEntity>;

    /**
     *
     */
    public cascaded:boolean;

    /**
     *
     * @returns {_Stage_ElementsBase}
     */
    public get stageElements():_Stage_ElementsBase
    {
        if (this._elementsDirty)
            this._updateElements();

        return this._stageElements;
    }

	/**
	 *
	 * @returns {_Render_MaterialBase}
	 */
	public get renderMaterial():_Render_MaterialBase
	{
		if (this._materialDirty)
			this._updateMaterial();

		return this._renderMaterial;
	}

	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	constructor(renderable:IRenderable, renderEntity:RenderEntity)
	{
		super(renderable, renderEntity);

        this._onInvalidateElementsDelegate = (event:RenderableEvent) => this.onInvalidateElements(event);
        this._onInvalidateMaterialDelegate = (event:RenderableEvent) => this._onInvalidateMaterial(event);

		//store references
		this.sourceEntity = renderEntity.entity;
        this._stage = renderEntity.stage;
        this.renderGroup = renderEntity.renderGroup;

		this.renderable = renderable;

        this.renderable.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.renderable.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
	}

    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    public _iRender(pass:IPass, viewport:Viewport):void
    {
        pass._setRenderState(this, viewport);

        var elements:_Stage_ElementsBase = this.stageElements;
        if (pass.shader.activeElements != elements) {
            pass.shader.activeElements = elements;
            elements._setRenderState(this, pass.shader, viewport);
        }

        this._stageElements.draw(this, pass.shader, viewport, this._count, this._offset)
    }


	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this.renderSceneTransform = null;

		//this.sourceEntity = null;
		this._stage = null;

        this.next = null;
        this.maskOwners = null;

        this.renderable.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.renderable.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this.renderable = null;

		this._renderMaterial.usages--;

		if (!this._renderMaterial.usages)
			this._renderMaterial.onClear(new AssetEvent(AssetEvent.CLEAR, this._renderMaterial.material));

		this._renderMaterial = null;
        this._stageElements = null;
	}

    public onInvalidateElements(event:RenderableEvent):void
    {
        this._elementsDirty = true;
    }

	private _onInvalidateMaterial(event:RenderableEvent):void
	{
		this._materialDirty = true;
	}

    protected _getStageElements():_Stage_ElementsBase
    {
        throw new AbstractMethodError();
    }

	protected _getRenderMaterial():_Render_MaterialBase
	{
		throw new AbstractMethodError();
	}

    /**
     * //TODO
     *
     * @private
     */
    private _updateElements():void
    {
        this._stageElements = this._getStageElements();

        this._elementsDirty = false;
    }

	protected _updateMaterial():void
	{
		var renderMaterial:_Render_MaterialBase = this._getRenderMaterial();

		if (this._renderMaterial != renderMaterial) {

			if (this._renderMaterial) {
				this._renderMaterial.usages--;

				//dispose current renderMaterial object
				if (!this._renderMaterial.usages)
					this._renderMaterial.onClear(new AssetEvent(AssetEvent.CLEAR, this._renderMaterial.material));
			}

			this._renderMaterial = renderMaterial;

			this._renderMaterial.usages++;
		}

        //create a cache of image & sampler objects for the renderable
        var numImages:number = this._renderMaterial.numImages;
        var style:Style = this.renderable.style || this.sourceEntity.style;
        var material:IMaterial = this._renderMaterial.material;

        this.images.length = numImages;
        this.samplers.length = numImages;
        this.uvMatrix = style? style.uvMatrix : material.style? material.style.uvMatrix : null;

        var numTextures:number = this._renderMaterial.material.getNumTextures();
        var texture:ITexture;
        var numImages:number;
        var image:ImageBase;
        var sampler:ImageSampler;
        var index:number;

        for (var i:number = 0; i < numTextures; i++) {
            texture = material.getTextureAt(i);
            numImages = texture.getNumImages();
            for (var j:number = 0; j < numImages; j++) {
                index = this._renderMaterial.getImageIndex(texture, j);
                image =  style? style.getImageAt(texture, j) : null;
                this.images[index] = image? <_Stage_ImageBase> this._stage.getAbstraction(image) : null;
                this.samplers[index] = style? style.getSamplerAt(texture, j) : null;
            }
        }

		this._materialDirty = false;
	}

	protected getDefaultMaterial():IMaterial
    {
        return MaterialUtils.getDefaultTextureMaterial();
    }
}