import {Transform, ColorTransform, Matrix3D, Vector3D, IAsset, Point} from "@awayjs/core";

import {IAnimator} from "./IAnimator";
import {IMaterial} from "./IMaterial";
import {IRenderable} from "./IRenderable";
import {Style} from "./Style";
import { BoundingVolumeType } from '../bounds/BoundingVolumeType';
import { PartitionBase } from '../partition/PartitionBase';
import { IPicker } from '../pick/IPicker';
import { IRenderer } from './IRenderer';
import { PickGroup } from '../PickGroup';


export interface IEntity extends IAsset
{
    style:Style;

	animator:IAnimator;

	material:IMaterial;

	parent:IEntity;

	_depthID:number;

	_startDrag():void;

	_stopDrag():void;

	isDragEntity():boolean;

	isEntity():boolean;

	getMouseCursor():string;

	tabEnabled:boolean;

	tabIndex:number;

	isInFocus:boolean;

	isAncestor(entity:IEntity):boolean;

	isDescendant(entity:IEntity):boolean;

	_iInternalUpdate():void;
	
	maskId:number;

	_iAssignedColorTransform():ColorTransform;

	maskOwners:Array<IEntity>;

	maskMode:boolean;

	_registrationMatrix3D:Matrix3D;

	transform:Transform;

	masks:Array<IEntity>;
	
	partition:PartitionBase;

	globalToLocal(point:Point, target?:Point):Point
	/**
	 * 
	 */
	defaultBoundingVolume:BoundingVolumeType;
	
	pickObject:IEntity;

	/**
	 *
	 */
	boundsVisible:boolean;

	/**
	 * 
	 */
	getBoundsPrimitive(pickGroup:PickGroup):IEntity;

	/**
	 *
	 */
	castsShadows:boolean;

	/**
	 *
	 */
    scenePosition:Vector3D;
    
	/**
	 *
	 */
	setFocus(value:boolean, fromMouseDown?:boolean, sendSoftKeyEvent?:boolean);

	/**
	 *
	 */
	zOffset:number;

	/**
	 * @internal
	 */
	_iIsMouseEnabled():boolean;

	/**
	 * @internal
	 */
	_iIsVisible():boolean;

	/**
	 * The transformation matrix that transforms from model to world space, adapted with any special operations needed to render.
	 * For example, assuring certain alignedness which is not inherent in the scene transform. By default, this would
	 * return the scene transform.
	 */
	getRenderSceneTransform(cameraTransform:Matrix3D):Matrix3D;

	getRenderableIndex(renderable:IRenderable):number;

	/**
	 *
	 * @param renderer
	 * @private
	 */
	_applyPickables(picker:IPicker);

	_applyRenderables(renderer:IRenderer);

	invalidateMaterial();

	invalidateElements();
}