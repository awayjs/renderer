///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{
	export class Part
	{
		public name:string = "";
		public version:number = 0;
		public data:away.utils.ByteArray;

		constructor(name:string = null, version:number = null)
		{
			this.name = name;
			this.version = version;
			this.data = new away.utils.ByteArray();
		}
	}
}