///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class Token
	{

		public dest:aglsl.Destination = new aglsl.Destination();
		public opcode:number = 0;
		public a:aglsl.Destination = new aglsl.Destination();
		public b:aglsl.Destination = new aglsl.Destination();

		constructor()
		{
		}
	}
}