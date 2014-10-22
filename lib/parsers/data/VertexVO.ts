import Vector3D							= require("awayjs-core/lib/core/geom/Vector3D");

class VertexVO
{
	public x:number;
	public y:number;
	public z:number;
	public u:number;
	public v:number;
	public normal:Vector3D;
	public tangent:Vector3D;
}

export = VertexVO;