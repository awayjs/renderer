/**
 * @class away.base.HitTestCache
 */
export class HitTestCache {
	/**
	 *
	 */
	public cells: Array<Array<number>> = new Array<Array<number>>();

	/**
	 *
	 */
	public lastCollisionIndex: number = -1;

	/**
	 *
	 */
	public divisions: number;
}