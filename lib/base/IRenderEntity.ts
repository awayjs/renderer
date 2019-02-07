import {IAnimator} from "./IAnimator";
import {IMaterial} from "./IMaterial";
import {Style} from "./Style";
import { IPartitionEntity, ITraversable } from '@awayjs/view';
import { Matrix3D, Vector3D } from '@awayjs/core';


export interface IRenderEntity extends IPartitionEntity
{
    style:Style;

	animator:IAnimator;

	material:IMaterial;
	
	/**
	 *
	 */
	scenePosition:Vector3D;
	
	/**
	 *
	 */
	zOffset:number;

	invalidateElements():void;

	invalidateMaterial():void;

	/**
	 * The transformation matrix that transforms from model to world space, adapted with any special operations needed to render.
	 * For example, assuring certain alignedness which is not inherent in the scene transform. By default, this would
	 * return the scene transform.
	 */
	getRenderSceneTransform(cameraTransform:Matrix3D):Matrix3D;
}