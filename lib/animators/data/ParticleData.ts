import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");

class ParticleData
{
	public particleIndex:number /*uint*/;
	public numVertices:number /*uint*/;
	public startVertexIndex:number /*uint*/;
	public subGeometry:TriangleSubGeometry;
}

export = ParticleData