import {Transform, Box, ColorTransform, Sphere, Matrix3D, Vector3D, IAsset} from "@awayjs/core";

import {PickingCollision} from "../pick/PickingCollision";
import {TraverserBase} from "../partition/TraverserBase";

import {IAnimator} from "./IAnimator";
import {IMaterial} from "./IMaterial";
import {IRenderable} from "./IRenderable";
import {Style} from "./Style";
import { BoundingVolumeType } from '../bounds/BoundingVolumeType';
import { BoundingVolumeBase } from '../bounds/BoundingVolumeBase';
import { PartitionBase } from '../partition/PartitionBase';
import { Viewport } from '@awayjs/stage';


export interface IEntity extends IAsset
{
    style:Style;

	animator:IAnimator;

	material:IMaterial;

	parent:IEntity;

	_depthID:number;

	isEntity:boolean;

	getMouseCursor():string;

	isTabEnabled:boolean;

	tabIndex:number;

	isInFocus:boolean;

	isContainer:boolean;

	partition:PartitionBase;

	_iInternalUpdate(viewport:Viewport):void;
	
	_iMasksConfig():Array<Array<number>>;

	_iAssignedMaskId():number;

	_iAssignedColorTransform():ColorTransform;

	_iAssignedMasks():Array<Array<IEntity>>;

	_iPickingCollision:PickingCollision;

	maskMode:boolean;

	getBoxBounds():Box;

	getSphereBounds():Sphere;

	transform:Transform;

	/**
	 * 
	 */
	defaultBoundingVolume:BoundingVolumeType;
	
	/**
	 *
	 */
	boundsVisible:boolean;

	/**
	 * 
	 */
	boundsPrimitive:IEntity;

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
	zOffset:number;

	pickShape:boolean;

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

	getBoundingVolume(targetCoordinateSpace?:IEntity, boundingVolumeType?:BoundingVolumeType):BoundingVolumeBase

	_getSphereBoundsInternal(matrix3D:Matrix3D, strokeFlag:boolean, cache?:Sphere, target?:Sphere):Sphere

	_getBoxBoundsInternal(matrix3D:Matrix3D, strokeFlag:boolean, fastFlag:boolean, cache?:Box, target?:Box ):Box

	/**
	 *
	 * @param renderer
	 * @private
	 */
	_acceptTraverser(traverser:TraverserBase);

	hitTestPoint(x:number, y:number, shapeFlag?:boolean, masksFlag?:boolean):boolean;

	invalidateMaterial();

	invalidateElements();
}