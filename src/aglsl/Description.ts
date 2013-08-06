/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class Description
	{
		public regread:Array = [[],[],[],[],[],[],[]];
        public regwrite:Array = [[],[],[],[],[],[],[]];
        public hasindirect:boolean =  false;
        public writedepth:boolean = false;
        public hasmatrix:boolean = false;
        public samplers:Array = [];
		
		// added due to dynamic assignment 3*0xFFFFFFuuuu
		public tokens: aglsl.Token[] = [];
		public header: aglsl.Header = new aglsl.Header();
		
		constructor()
		{
		}
	}
}