import { IAsset } from '@awayjs/core';

import { ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement } from '@awayjs/stage';

import { ShaderBase } from './ShaderBase';

/**
 * Provides an interface for data set classes that hold animation data for use in animator classes.
 *
 * @see away.animators.AnimatorBase
 */
export interface IAnimationSet extends IAsset
{
	/**
	 * Check to determine whether a state is registered in the animation set under the given name.
	 *
	 * @param stateName The name of the animation state object to be checked.
	 */
	hasAnimation(name: string): boolean;

	/**
	 * Indicates whether the properties of the animation data contained within the set combined with
	 * the vertex registers aslready in use on shading materials allows the animation data to utilise
	 * GPU calls.
	 */
	usesCPU: boolean; // GET

	/**
	 * Called by the material to reset the GPU indicator before testing whether register space in the shader
	 * is available for running GPU-based animation code.
	 *
	 * @private
	 */
	resetGPUCompatibility();

	/**
	 * Called by the animator to void the GPU indicator when register space in the shader
	 * is no longer available for running GPU-based animation code.
	 *
	 * @private
	 */
	cancelGPUCompatibility();

	/**
     * @inheritDoc
     */
	getAGALVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;

	/**
	 * @inheritDoc
	 */
	getAGALFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, shadedTarget: ShaderRegisterElement): string;

	/**
	 * @inheritDoc
	 */
	getAGALUVCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;

	/**
	 * @inheritDoc
	 */
	doneAGALCode(shader: ShaderBase): void;
}