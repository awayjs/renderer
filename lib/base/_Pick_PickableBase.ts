import {AssetEvent, AbstractionBase, Matrix3D, Vector3D, AbstractMethodError, Sphere, Box} from "@awayjs/core";

import {Viewport} from "@awayjs/stage";

import {_Render_MaterialBase} from "./_Render_MaterialBase";
import {IEntity} from "./IEntity";
import { IPickable } from './IPickable';
import { PickEntity } from './PickEntity';
import { PickGroup } from '../PickGroup';
import { RenderableEvent } from '../events/RenderableEvent';
import { PickingCollision } from '../pick/PickingCollision';


/**
 * @class RenderableListItem
 */
export class _Pick_PickableBase extends AbstractionBase
{
    private _onInvalidateElementsDelegate:(event:RenderableEvent) => void;
    private _onInvalidateMaterialDelegate:(event:RenderableEvent) => void;
    private _materialDirty:boolean = true;
    private _elementsDirty:boolean = true;
    protected _viewport:Viewport;
    protected _pickGroup:PickGroup;

	/**
	 *
	 */
	public sourceEntity:IEntity;

	/**
	 *
	 */
    public pickable:IPickable;

	/**
	 *
	 * @param renderable
	 * @param sourceEntity
	 * @param surface
	 * @param renderer
	 */
	constructor(pickable:IPickable, pickEntity:PickEntity)
	{
        super(pickable, pickEntity);
        
        this._onInvalidateElementsDelegate = (event:RenderableEvent) => this.onInvalidateElements(event);
        this._onInvalidateMaterialDelegate = (event:RenderableEvent) => this._onInvalidateMaterial(event);

        //store references
		this.sourceEntity = pickEntity.entity;
        this._viewport = pickEntity.viewport;
        this._pickGroup = pickEntity.pickGroup;

        this.pickable = pickable;
        
        this.pickable.addEventListener(RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.pickable.addEventListener(RenderableEvent.INVALIDATE_MATERIAL, this._onInvalidateMaterialDelegate);
    }
    
    public onInvalidateElements(event:RenderableEvent):void
    {
        this._elementsDirty = true;
    }

	private _onInvalidateMaterial(event:RenderableEvent):void
	{
		this._materialDirty = true;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		//this.sourceEntity = null;
		this._viewport = null;

		this.pickable = null;
    }

    public hitTestPoint(x:number, y:number, z:number):boolean
	{
        throw new AbstractMethodError();
	}

	public getBoxBounds(matrix3D:Matrix3D = null, strokeFlag:boolean = true, cache:Box = null, target:Box = null):Box
	{
		return target;
	}

	public getSphereBounds(center:Vector3D, matrix3D:Matrix3D = null, strokeFlag:boolean = true, cache:Sphere = null, target:Sphere = null):Sphere
	{
		return target;
	}

	public testCollision(collision:PickingCollision, closestFlag:boolean):boolean
	{
        throw new AbstractMethodError();
    }
}