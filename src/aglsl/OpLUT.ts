///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class OpLUT
	{

		public s:string;
		public flags:number;
		public dest:boolean;
		public a:boolean;
		public b:boolean;
		public matrixwidth:number;
		public matrixheight:number;
		public ndwm:boolean;
		public scalar:boolean;
		public dm:boolean;
		public lod:boolean;

		constructor(s:string, flags:number, dest:boolean, a:boolean, b:boolean, matrixwidth:number, matrixheight:number, ndwm:boolean, scaler:boolean, dm:boolean, lod:boolean)
		{
			this.s = s;
			this.flags = flags;
			this.dest = dest;
			this.a = a;
			this.b = b;
			this.matrixwidth = matrixwidth;
			this.matrixheight = matrixheight;
			this.ndwm = ndwm;
			this.scalar = scaler;
			this.dm = dm;
			this.lod = lod;
		}
	}
}