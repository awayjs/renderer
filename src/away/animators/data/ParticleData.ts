///<reference path="../../_definitions.ts"/>

module away.animators
{
	import TriangleSubGeometry = away.base.TriangleSubGeometry;
	
	export class ParticleData
	{
		public particleIndex:number /*uint*/;
		public numVertices:number /*uint*/;
		public startVertexIndex:number /*uint*/;
		public subGeometry:TriangleSubGeometry;
	}

}