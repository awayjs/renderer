import {Transform, Box, ColorTransform, Sphere, Matrix3D, Vector3D, IAsset} from "@awayjs/core";

import {PickingCollision} from "../pick/PickingCollision";

import {IAnimator} from "./IAnimator";
import {IMaterial} from "./IMaterial";
import {IRenderable} from "./IRenderable";
import {TraverserBase} from "./TraverserBase";
import {Style} from "./Style";

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

	isPartition:boolean;

	traverseName:string;

	_iInternalUpdate():void;
	
	_iMasksConfig():Array<Array<number>>;

	_iAssignedMaskId():number;

	_iAssignedColorTransform():ColorTransform;

	_iAssignedMasks():Array<Array<IEntity>>;

	_iPickingCollision:PickingCollision;

	maskMode:boolean;

	getBox():Box;

	getSphere():Sphere;

	transform:Transform;

	partition:IEntity;

	/**
	 *
	 */
	debugVisible:boolean;

	/**
	 *
	 */
	boundsType:string;

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
	_acceptTraverser(traverser:TraverserBase);

	hitTestPoint(x:number, y:number, shapeFlag?:boolean, masksFlag?:boolean):boolean;

	invalidateMaterial();

	invalidateElements();
}