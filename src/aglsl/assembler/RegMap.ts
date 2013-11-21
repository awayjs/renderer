///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{

	export class Reg
	{

		public code:number;
		public desc:string;

		constructor(code:number, desc:string)
		{
			this.code = code;
			this.desc = desc;
		}
	}

	export class RegMap
	{

		/*
		 public static map = [ new aglsl.assembler.Reg( 0x00, "vertex attribute" ),
		 new aglsl.assembler.Reg( 0x01, "fragment constant" ),
		 new aglsl.assembler.Reg( 0x01, "vertex constant" ),
		 new aglsl.assembler.Reg( 0x02, "fragment temporary" ),
		 new aglsl.assembler.Reg( 0x02, "vertex temporary" ),
		 new aglsl.assembler.Reg( 0x03, "vertex output" ),
		 new aglsl.assembler.Reg( 0x03, "vertex output" ),
		 new aglsl.assembler.Reg( 0x03, "fragment depth output" ),
		 new aglsl.assembler.Reg( 0x03, "fragment output" ),
		 new aglsl.assembler.Reg( 0x03, "fragment output" ),
		 new aglsl.assembler.Reg( 0x04, "varying" ),
		 new aglsl.assembler.Reg( 0x04, "varying output" ),
		 new aglsl.assembler.Reg( 0x04, "varying input" ),
		 new aglsl.assembler.Reg( 0x05, "sampler" ) ];
		 */

		private static _map:any[];
		public static get map():any[]
		{

			if (!RegMap._map) {

				RegMap._map = new Array<Object>();
				RegMap._map['va'] = new aglsl.assembler.Reg(0x00, "vertex attribute");
				RegMap._map['fc'] = new aglsl.assembler.Reg(0x01, "fragment constant");
				RegMap._map['vc'] = new aglsl.assembler.Reg(0x01, "vertex constant")
				RegMap._map['ft'] = new aglsl.assembler.Reg(0x02, "fragment temporary");
				RegMap._map['vt'] = new aglsl.assembler.Reg(0x02, "vertex temporary");
				RegMap._map['vo'] = new aglsl.assembler.Reg(0x03, "vertex output");
				RegMap._map['op'] = new aglsl.assembler.Reg(0x03, "vertex output");
				RegMap._map['fd'] = new aglsl.assembler.Reg(0x03, "fragment depth output");
				RegMap._map['fo'] = new aglsl.assembler.Reg(0x03, "fragment output");
				RegMap._map['oc'] = new aglsl.assembler.Reg(0x03, "fragment output");
				RegMap._map['v'] = new aglsl.assembler.Reg(0x04, "varying")
				RegMap._map['vi'] = new aglsl.assembler.Reg(0x04, "varying output");
				RegMap._map['fi'] = new aglsl.assembler.Reg(0x04, "varying input");
				RegMap._map['fs'] = new aglsl.assembler.Reg(0x05, "sampler");


			}

			return RegMap._map;

		}

		/*
		 public static va:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x00, "vertex attribute" );
		 public static fc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x01, "fragment constant" );
		 public static vc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x01, "vertex constant" );
		 public static ft:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x02, "fragment temporary" );
		 public static vt:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x02, "vertex temporary" );
		 public static vo:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "vertex output" );
		 public static op:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "vertex output" );
		 public static fd:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment depth output" );
		 public static fo:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment output" );
		 public static oc:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x03, "fragment output" );
		 public static v: aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying" );
		 public static vi:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying output" );
		 public static fi:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x04, "varying input" );
		 public static fs:aglsl.assembler.Reg = new aglsl.assembler.Reg( 0x05, "sampler" );
		 */
		constructor()
		{
		}
	}
}