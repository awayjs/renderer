import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {SkeletonNaryLERPState}			from "../../animators/states/SkeletonNaryLERPState";

/**
 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
export class SkeletonNaryLERPNode extends AnimationNodeBase
{
	public _iInputs:Array<AnimationNodeBase> = new Array<AnimationNodeBase>();

	private _numInputs:number;

	public get numInputs():number
	{
		return this._numInputs;
	}

	/**
	 * Creates a new <code>SkeletonNaryLERPNode</code> object.
	 */
	constructor()
	{
		super();

		this._pStateClass = SkeletonNaryLERPState;
	}

	/**
	 * Returns an integer representing the input index of the given skeleton animation node.
	 *
	 * @param input The skeleton animation node for with the input index is requested.
	 */
	public getInputIndex(input:AnimationNodeBase):number
	{
		return this._iInputs.indexOf(input);
	}

	/**
	 * Returns the skeleton animation node object that resides at the given input index.
	 *
	 * @param index The input index for which the skeleton animation node is requested.
	 */
	public getInputAt(index:number):AnimationNodeBase
	{
		return this._iInputs[index];
	}

	/**
	 * Adds a new skeleton animation node input to the animation node.
	 */
	public addInput(input:AnimationNodeBase):void
	{
		this._iInputs[this._numInputs++] = input;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):SkeletonNaryLERPState
	{
		return <SkeletonNaryLERPState> animator.getAnimationState(this);
	}
}

export default SkeletonNaryLERPNode