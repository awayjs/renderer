import {SkeletonBinaryLERPNode} from "../nodes/SkeletonBinaryLERPNode";

import {CrossfadeTransitionState} from "./CrossfadeTransitionState";

/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
export class CrossfadeTransitionNode extends SkeletonBinaryLERPNode
{
	public blendSpeed:number;

	public startBlend:number;

	/**
	 * Creates a new <code>CrossfadeTransitionNode</code> object.
	 */
	constructor()
	{
		super();

		this._pStateClass = CrossfadeTransitionState;
	}
}