import { AssetBase } from '@awayjs/core';

/**
 * Provides an abstract base class for nodes in an animation blend tree.
 */
export class AnimationNodeBase extends AssetBase {
	public static assetType: string = '[asset AnimationNodeBase]';

	public _pStateClass: any;

	public get stateClass(): any {
		return this._pStateClass;
	}

	/**
	 * Creates a new <code>AnimationNodeBase</code> object.
	 */
	constructor() {
		super();
	}

	/**
	 * @inheritDoc
	 */
	public dispose(): void {
	}

	/**
	 * @inheritDoc
	 */
	public get assetType(): string {
		return AnimationNodeBase.assetType;
	}
}