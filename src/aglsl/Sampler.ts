///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class Sampler
	{
		public lodbias:number = 0;
		public dim:number = 0;
		public readmode:number = 0;
		public special:number = 0;
		public wrap:number = 0;
		public mipmap:number = 0;
		public filter:number = 0;

		constructor()
		{
		}
	}
}