import {ColorTransform}					from "@awayjs/core/lib/geom/ColorTransform";

export class ColorSegmentPoint
{
	private _color:ColorTransform;
	private _life:number;

	constructor(life:number, color:ColorTransform)
	{
		//0<life<1
		if (life <= 0 || life >= 1)
			throw(new Error("life exceeds range (0,1)"));
		this._life = life;
		this._color = color;
	}

	public get color():ColorTransform
	{
		return this._color;
	}

	public get life():number
	{
		return this._life;
	}

}