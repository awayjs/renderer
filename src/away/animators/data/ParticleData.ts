///<reference path="../../_definitions.ts"/>

module away.animators
{
	import CompactSubGeometry = away.base.CompactSubGeometry;
	
	export class ParticleData
	{
		public particleIndex:number /*uint*/;
		public numVertices:number /*uint*/;
		public startVertexIndex:number /*uint*/;
		public subGeometry:CompactSubGeometry;
	}

}