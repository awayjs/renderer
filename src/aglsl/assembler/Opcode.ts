///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{
	export class Opcode
	{

		public dest:string;
		public a:aglsl.assembler.FS;
		public b:aglsl.assembler.FS;
		public opcode:number;
		public flags:aglsl.assembler.Flags;

		constructor(dest:string, aformat:string, asize:number, bformat:string, bsize:number, opcode:number, simple:boolean, horizontal:boolean, fragonly:boolean, matrix:boolean)
		{
			this.a = new aglsl.assembler.FS();
			this.b = new aglsl.assembler.FS();
			this.flags = new aglsl.assembler.Flags();

			this.dest = dest;
			this.a.format = aformat;
			this.a.size = asize;
			this.b.format = bformat;
			this.b.size = bsize;
			this.opcode = opcode;
			this.flags.simple = simple;
			this.flags.horizontal = horizontal;
			this.flags.fragonly = fragonly;
			this.flags.matrix = matrix;
		}
	}

	export class FS
	{
		public format:string;
		public size:number;
	}

	export class Flags
	{
		public simple:boolean;
		public horizontal:boolean;
		public fragonly:boolean;
		public matrix:boolean;
	}
}