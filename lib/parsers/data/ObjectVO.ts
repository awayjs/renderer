class ObjectVO
{
	public name:string;
	public type:string;
	public pivotX:number;
	public pivotY:number;
	public pivotZ:number;
	public transform:Array<number>;
	public verts:Array<number>;
	public indices:Array<number> /*int*/;
	public uvs:Array<number>;
	public materialFaces:Object;
	public materials:Array<string>;
	public smoothingGroups:Array<number> /*int*/;
}

export = ObjectVO;