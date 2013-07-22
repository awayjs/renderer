/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

module away.partition
{
	export class DirectionalLightNode extends away.partition.EntityNode
	{
		
		private _light:away.lights.DirectionalLight;
		
		constructor( light:away.lights.DirectionalLight )
		{
			super( light );
			this._light = light;
		}
		
		public get light():away.light.DirectionalLight
		{
			return this._light;
		}
		
		//@override
		public acceptTraverser( traverser:away.traverse.PartitionTraverser )
		{
			if( traverser.enterNode(this))
			{
				super.acceptTraverser( traverser );
				traverser.applyDirectionalLight( this._light );
			}
		}
	}
}