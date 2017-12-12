import {AbstractMethodError, AssetEvent, Matrix, Matrix3D, AbstractionBase, ProjectionBase} from "@awayjs/core";

import {Stage, GL_ImageBase, ImageSampler, ImageBase} from "@awayjs/stage";

import {RenderableEvent} from "../events/RenderableEvent";
import {MaterialUtils} from "../utils/MaterialUtils";

import {RenderGroup} from "../RenderGroup";

import {MaterialStateBase} from "./MaterialStateBase";
import {ElementsStateBase} from "./ElementsStateBase";
import {IRenderable} from "./IRenderable";
import {IEntity} from "./IEntity";
import {IPass} from "./IPass";
import {IMaterial} from "./IMaterial";
import {RenderStatePool} from "./RenderStatePool";
import {ITexture} from "./ITexture";
import {Style} from "./Style";


/**
 * @class RenderableListItem
 */
export class RenderStateBase extends AbstractionBase
{
    private _onInvalidateElementsDelegate:(event:RenderableEvent) => void;
	private _onInvalidateMaterialDelegate:(event:RenderableEvent) => void;
	private _materialDirty:boolean = true;
    private _elementsGL:ElementsStateBase;
    private _elementsDirty:boolean = true;

    public JOINT_INDEX_FORMAT:string;
    public JOINT_WEIGHT_FORMAT:string;

    public _count:number = 0;
    public _offset:number = 0;

    protected _stage:Stage;
    protected _renderGroup:RenderGroup;
    protected _materialGL:MaterialStateBase;


    /**
     *
     */
    public images:Array<GL_ImageBase> = new Array<GL_ImageBase>();

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
    public next:RenderStateBase;

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
    public masksConfig:Array<Array<number>>;

    /**
     *
     */
    public cascaded:boolean;

    /**
     *
     * @returns {ElementsStateBase}
     */
    public get elementsGL():ElementsStateBase
    {
        if (this._elementsDirty)
            this._updateElements();

        return this._elementsGL;
    }

	/**
	 *
	 * @returns {MaterialStateBase}
	 */
	public get materialGL():MaterialStateBase
	{
		if (this._materialDirty)
			this._updateMaterial();

		return this._materialGL;
	}

	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	constructor(renderable:IRenderable, renderStatePool:RenderStatePool)
	{
		super(renderable, renderStatePool);

        this._onInvalidateElementsDelegate = (event:RenderableEvent) => this.onInvalidateElements(event);
        this._onInvalidateMaterialDelegate = (event:RenderableEvent) => this._onInvalidateMaterial(event);

		//store references
		this.sourceEntity = renderStatePool.entity;
        this._stage = renderStatePool.stage;
        this._renderGroup = renderStatePool.renderGroup;

		this.renderable = renderable;

        this.renderable.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.renderable.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
	}

    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    public _iRender(pass:IPass, projection:ProjectionBase):void
    {
        pass._setRenderState(this, projection);

        var elements:ElementsStateBase = this.elementsGL;
        if (pass.shader.activeElements != elements) {
            pass.shader.activeElements = elements;
            elements._setRenderState(this, pass.shader, projection);
        }

        this._elementsGL.draw(this, pass.shader, projection, this._count, this._offset)
    }


	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this.renderSceneTransform = null;

		this.sourceEntity = null;
		this._stage = null;

        this.next = null;
        this.masksConfig = null;

        this.renderable.removeEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.renderable.removeEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
		this.renderable = null;

		this._materialGL.usages--;

		if (!this._materialGL.usages)
			this._materialGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._materialGL.material));

		this._materialGL = null;
        this._elementsGL = null;
	}

    public onInvalidateElements(event:RenderableEvent):void
    {
        this._elementsDirty = true;
    }

	private _onInvalidateMaterial(event:RenderableEvent):void
	{
		this._materialDirty = true;
	}

    protected _getElements():ElementsStateBase
    {
        throw new AbstractMethodError();
    }

	protected _getMaterial():MaterialStateBase
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
        this._elementsGL = this._getElements();

        this._elementsDirty = false;
    }

	protected _updateMaterial():void
	{
		var materialGL:MaterialStateBase = this._getMaterial();

		if (this._materialGL != materialGL) {

			if (this._materialGL) {
				this._materialGL.usages--;

				//dispose current materialGL object
				if (!this._materialGL.usages)
					this._materialGL.onClear(new AssetEvent(AssetEvent.CLEAR, this._materialGL.material));
			}

			this._materialGL = materialGL;

			this._materialGL.usages++;
		}

        //create a cache of image & sampler objects for the renderable
        var numImages:number = this._materialGL.numImages;
        var style:Style = this.renderable.style || this.sourceEntity.style;
        var material:IMaterial = this._materialGL.material;

        this.images.length = numImages;
        this.samplers.length = numImages;
        this.uvMatrix = style? style.uvMatrix : material.style? material.style.uvMatrix : null;

        var numTextures:number = this._materialGL.material.getNumTextures();
        var texture:ITexture;
        var numImages:number;
        var image:ImageBase;
        var sampler:ImageSampler;
        var index:number;

        for (var i:number = 0; i < numTextures; i++) {
            texture = material.getTextureAt(i);
            numImages = texture.getNumImages();
            for (var j:number = 0; j < numImages; j++) {
                index = this._materialGL.getImageIndex(texture, j);
                image =  style? style.getImageAt(texture, j) : null;
                this.images[index] = image? <GL_ImageBase> this._stage.getAbstraction(image) : null;
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