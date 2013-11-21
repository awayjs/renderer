///<reference path="../../_definitions.ts"/>

module away.library
{

	/**
	 * Abstract base class for naming conflict resolution classes. Extend this to create a
	 * strategy class which the asset library can use to resolve asset naming conflicts, or
	 * use one of the bundled concrete strategy classes:
	 *
	 * <ul>
	 *   <li>IgnoreConflictStrategy (ConflictStrategy.IGNORE)</li>
	 *   <li>ErrorConflictStrategy (ConflictStrategy.THROW_ERROR)</li>
	 *   <li>NumSuffixConflictStrategy (ConflictStrategy.APPEND_NUM_SUFFIX)</li>
	 * </ul>
	 *
	 * @see away3d.library.AssetLibrary.conflictStrategy
	 * @see away3d.library.naming.ConflictStrategy
	 * @see away3d.library.naming.IgnoreConflictStrategy
	 * @see away3d.library.naming.ErrorConflictStrategy
	 * @see away3d.library.naming.NumSuffixConflictStrategy
	 */
	export class ConflictStrategyBase
	{

		constructor()
		{
		}

		/**
		 * Resolve a naming conflict between two assets. Must be implemented by concrete strategy
		 * classes.
		 */
		public resolveConflict(changedAsset:away.library.IAsset, oldAsset:away.library.IAsset, assetsDictionary:Object, precedence:string)
		{

			throw new away.errors.AbstractMethodError();

		}

		/**
		 * Create instance of this conflict strategy. Used internally by the AssetLibrary to
		 * make sure the same strategy instance is not used in all AssetLibrary instances, which
		 * would break any state caching that happens inside the strategy class.
		 */
		public create():ConflictStrategyBase
		{

			throw new away.errors.AbstractMethodError();

		}

		/**
		 * Provided as a convenience method for all conflict strategy classes, as a way to finalize
		 * the conflict resolution by applying the new names and dispatching the correct events.
		 */
		public _pUpdateNames(ns:string, nonConflictingName:string, oldAsset:IAsset, newAsset:IAsset, assetsDictionary:Object, precedence:string)
		{
			var loser_prev_name:string;
			var winner:IAsset;
			var loser:IAsset;

			winner = (precedence === away.library.ConflictPrecedence.FAVOR_NEW)? newAsset : oldAsset;
			loser = (precedence === away.library.ConflictPrecedence.FAVOR_NEW)? oldAsset : newAsset;

			loser_prev_name = loser.name;

			assetsDictionary[winner.name] = winner;
			assetsDictionary[nonConflictingName] = loser;
			loser.resetAssetPath(nonConflictingName, ns, false);

			loser.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.ASSET_CONFLICT_RESOLVED, loser, loser_prev_name));
		}
	}
}
