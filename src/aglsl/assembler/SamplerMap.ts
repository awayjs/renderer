///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{
	export class Sampler
	{
		public shift:number;
		public mask:number;
		public value:number;

		constructor(shift:number, mask:number, value:number)
		{
			this.shift = shift;
			this.mask = mask;
			this.value = value;
		}
	}

	export class SamplerMap
	{

		private static _map:Object[];

		public static get map():Object[]
		{

			if (!SamplerMap._map) {

				SamplerMap._map = new Array<Object>();
				SamplerMap._map['rgba'] = new aglsl.assembler.Sampler(8, 0xf, 0);
				SamplerMap._map['rg'] = new aglsl.assembler.Sampler(8, 0xf, 5);
				SamplerMap._map['r'] = new aglsl.assembler.Sampler(8, 0xf, 4);
				SamplerMap._map['compressed'] = new aglsl.assembler.Sampler(8, 0xf, 1);
				SamplerMap._map['compressed_alpha'] = new aglsl.assembler.Sampler(8, 0xf, 2);
				SamplerMap._map['dxt1'] = new aglsl.assembler.Sampler(8, 0xf, 1);
				SamplerMap._map['dxt5'] = new aglsl.assembler.Sampler(8, 0xf, 2);

				// dimension
				SamplerMap._map['2d'] = new aglsl.assembler.Sampler(12, 0xf, 0);
				SamplerMap._map['cube'] = new aglsl.assembler.Sampler(12, 0xf, 1);
				SamplerMap._map['3d'] = new aglsl.assembler.Sampler(12, 0xf, 2);

				// special
				SamplerMap._map['centroid'] = new aglsl.assembler.Sampler(16, 1, 1);
				SamplerMap._map['ignoresampler'] = new aglsl.assembler.Sampler(16, 4, 4);

				// repeat
				SamplerMap._map['clamp'] = new aglsl.assembler.Sampler(20, 0xf, 0);
				SamplerMap._map['repeat'] = new aglsl.assembler.Sampler(20, 0xf, 1);
				SamplerMap._map['wrap'] = new aglsl.assembler.Sampler(20, 0xf, 1);

				// mip
				SamplerMap._map['nomip'] = new aglsl.assembler.Sampler(24, 0xf, 0);
				SamplerMap._map['mipnone'] = new aglsl.assembler.Sampler(24, 0xf, 0);
				SamplerMap._map['mipnearest'] = new aglsl.assembler.Sampler(24, 0xf, 1);
				SamplerMap._map['miplinear'] = new aglsl.assembler.Sampler(24, 0xf, 2);

				// filter
				SamplerMap._map['nearest'] = new aglsl.assembler.Sampler(28, 0xf, 0);
				SamplerMap._map['linear'] = new aglsl.assembler.Sampler(28, 0xf, 1);

			}

			return SamplerMap._map;

		}

		/*
		 public static map =     [ new aglsl.assembler.Sampler( 8, 0xf, 0 ),
		 new aglsl.assembler.Sampler( 8, 0xf, 5 ),
		 new aglsl.assembler.Sampler( 8, 0xf, 4 ),
		 new aglsl.assembler.Sampler( 8, 0xf, 1 ),
		 new aglsl.assembler.Sampler( 8, 0xf, 2 ),
		 new aglsl.assembler.Sampler( 8, 0xf, 1 ),
		 new aglsl.assembler.Sampler( 8, 0xf, 2 ),

		 // dimension
		 new aglsl.assembler.Sampler( 12, 0xf, 0 ),
		 new aglsl.assembler.Sampler( 12, 0xf, 1 ),
		 new aglsl.assembler.Sampler( 12, 0xf, 2 ),

		 // special
		 new aglsl.assembler.Sampler( 16, 1, 1 ),
		 new aglsl.assembler.Sampler( 16, 4, 4 ),

		 // repeat
		 new aglsl.assembler.Sampler( 20, 0xf, 0 ),
		 new aglsl.assembler.Sampler( 20, 0xf, 1 ),
		 new aglsl.assembler.Sampler( 20, 0xf, 1 ),

		 // mip
		 new aglsl.assembler.Sampler( 24, 0xf, 0 ),
		 new aglsl.assembler.Sampler( 24, 0xf, 0 ),
		 new aglsl.assembler.Sampler( 24, 0xf, 1 ),
		 new aglsl.assembler.Sampler( 24, 0xf, 2 ),

		 // filter
		 new aglsl.assembler.Sampler( 28, 0xf, 0 ),
		 new aglsl.assembler.Sampler( 28, 0xf, 1 ) ]
		 */
		/*
		 public static rgba: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 0 );
		 public static rg: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 5 );
		 public static r: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 4 );
		 public static compressed: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 1 );
		 public static compressed_alpha: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 2 );
		 public static dxt1: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 1 );
		 public static dxt5: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 8, 0xf, 2 );

		 // dimension
		 public static sampler2d: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 0 );
		 public static cube: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 1 );
		 public static sampler3d: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 12, 0xf, 2 );

		 // special
		 public static centroid: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 16, 1, 1 );
		 public static ignoresampler: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 16, 4, 4 );

		 // repeat
		 public static clamp: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 0 );
		 public static repeat: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 1 );
		 public static wrap: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 20, 0xf, 1 );

		 // mip
		 public static nomip: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 0 );
		 public static mipnone: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 0 );
		 public static mipnearest: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 1 );
		 public static miplinear: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 24, 0xf, 2 );

		 // filter
		 public static nearest: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 28, 0xf, 0 );
		 public static linear: aglsl.assembler.Sampler = new aglsl.assembler.Sampler( 28, 0xf, 1 );
		 */
		constructor()
		{
		}
	}
}

