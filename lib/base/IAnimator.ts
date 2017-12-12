import {IAsset, ProjectionBase} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {RenderStateBase} from "./RenderStateBase";
import {IEntity} from "./IEntity";
import {ShaderBase} from "./ShaderBase";
import {IAnimationSet} from "./IAnimationSet";

/**
 * Provides an interface for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
 *
 * @see away.animators.IAnimationSet
 */
export interface IAnimator extends IAsset
{
	/**
	 *
	 */
	animationSet:IAnimationSet;

	/**
	 *
	 */
	clone():IAnimator;

	/**
	 *
	 */
	dispose();

	/**
	 * Used by the graphics object to which the animator is applied, registers the owner for internal use.
	 *
	 * @private
	 */
	addOwner(entity:IEntity);

	/**
	 * Used by the graphics object from which the animator is removed, unregisters the owner for internal use.
	 *
	 * @private
	 */
	removeOwner(entity:IEntity);

    testGPUCompatibility(shader:ShaderBase):void;

    setRenderState(shader:ShaderBase, renderState:RenderStateBase, stage:Stage, projection:ProjectionBase):void;
}