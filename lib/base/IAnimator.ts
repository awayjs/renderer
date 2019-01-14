import {IAsset, ProjectionBase} from "@awayjs/core";

import {Stage} from "@awayjs/stage";

import {_Render_RenderableBase} from "./_Render_RenderableBase";
import {IRenderEntity} from "./IRenderEntity";
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
	addOwner(entity:IRenderEntity);

	/**
	 * Used by the graphics object from which the animator is removed, unregisters the owner for internal use.
	 *
	 * @private
	 */
	removeOwner(entity:IRenderEntity);

    testGPUCompatibility(shader:ShaderBase):void;

    setRenderState(shader:ShaderBase, renderState:_Render_RenderableBase, stage:Stage, projection:ProjectionBase):void;
}