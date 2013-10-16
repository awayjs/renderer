///<reference path="../../_definitions.ts"/>

module away.partition
{
	export class PointLightNode extends away.partition.EntityNode
	{
		
		private _light:away.lights.PointLight;
		
		constructor( light:away.lights.PointLight )
		{
			super( light );
			this._light = light;
		}
		
		public get light():away.lights.PointLight
		{
			return this._light;
		}
		
		public acceptTraverser( traverser:away.traverse.PartitionTraverser )
		{
			if( traverser.enterNode( <away.partition.NodeBase> this ) )
			{
				super.acceptTraverser( traverser );
				traverser.applyPointLight( this._light );
			}
		}

        public isCastingShadow():boolean
        {
            return false;
        }
	}
}