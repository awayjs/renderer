///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class Description
	{
		public regread:any[] = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		public regwrite:any[] = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		public hasindirect:boolean = false;
		public writedepth:boolean = false;
		public hasmatrix:boolean = false;
		public samplers:any[] = [];

		// added due to dynamic assignment 3*0xFFFFFFuuuu
		public tokens:aglsl.Token[] = [];
		public header:aglsl.Header = new aglsl.Header();

		constructor()
		{
		}
	}
}