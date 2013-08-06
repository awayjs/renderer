/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../away/_definitions.ts" />

module aglsl
{
	export class Context3D
	{
		
		public enableErrorChecking:boolean = false;    
		public resources:Array = []; 
		public driverInfo:string = "Call getter function instead";
		
		static maxvertexconstants:number = 128; 
		static maxfragconstants:number = 28; 
		static maxtemp:number = 8;
		static maxstreams:number = 8; 
		static maxtextures:number = 8;   
		static defaultsampler = new aglsl.Sampler();
		
		constructor()
		{
		}
	}
}