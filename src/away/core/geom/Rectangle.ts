///<reference path="../../_definitions.ts"/>


module away.geom
{
	export class Rectangle
	{
		public x:number;
		public y:number;
		public width:number;
		public height:number;

		constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}

		public get left():number
		{
			return this.x;
		}

		public get right():number
		{
			return this.x + this.width;
		}

		public get top():number
		{
			return this.y;
		}

		public get bottom():number
		{
			return this.y + this.height;
		}

		public get topLeft():away.geom.Point
		{
			return new away.geom.Point(this.x, this.y);
		}

		public get bottomRight():away.geom.Point
		{
			return new away.geom.Point(this.x + this.width, this.y + this.height);
		}

		public clone():Rectangle
		{

			return new Rectangle(this.x, this.y, this.width, this.height);

		}
	}
}