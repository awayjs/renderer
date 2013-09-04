/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{
	export class AGALMiniAssembler
	{
		
		public r:Object;
		public cur:aglsl.assembler.Part;
		
		constructor()
		{
			this.r = {};
			this.cur = new aglsl.assembler.Part();
		}
		
		public assemble( source:string, ext_part = null, ext_version = null )
		{
			if( !ext_version )
			{
				ext_version = 1;
			}
			
			if( ext_part )
			{
				this.addHeader( ext_part, ext_version );
			}
			
			var lines = source.replace( /[\f\n\r\v]+/g, "\n" ).split( "\n" ); // handle breaks, then split into lines        
			
			for( var i in lines )
			{
				this.processLine( lines[i], i );
			}
			
			return this.r;
		}
		
		private processLine( line, linenr )
		{            
			var startcomment = line.search( "//" );  // remove comments
			if ( startcomment != -1 )
			{
				line = line.slice( 0, startcomment );
			}
			line = line.replace( /^\s+|\s+$/g, "" ); // remove outer space
			if ( !(line.length > 0 ) )
			{
				return;
			}
			var optsi = line.search( /<.*>/g ); // split of options part <*> if there
			var opts = null;
			if ( optsi != -1 )
			{
				opts = line.slice( optsi ).match( /([\w\.\-\+]+)/gi );
				line = line.slice( 0, optsi );
			}
			
			// get opcode/command				            
			var tokens = line.match( /([\w\.\+\[\]]+)/gi ); // get tokens in line
			if ( !tokens || tokens.length<1 )
			{
				if ( line.length >= 3 )
				{
					console.log ( "Warning: bad line "+linenr+": "+line );
				}
				return;
			}
			
			//console.log ( linenr, line, cur, tokens ); 
			switch ( tokens[0] )
			{
				case "part":
					this.addHeader( tokens[1], Number(tokens[2]) ); 
					break;                
				case "endpart":
					if ( !this.cur )
					{
						throw "Unexpected endpart";
					}
					this.cur.data.position = 0;
					this.cur = null; 
					return; 
				default: 
					if( !this.cur )
					{
						console.log( "Warning: bad line "+linenr+": "+line+" (Outside of any part definition)" );
						return; 
					}
					if ( this.cur.name == "comment" )
					{
						return;
					}
					var op: aglsl.assembler.Opcode = <aglsl.assembler.Opcode> OpcodeMap.map[tokens[0]];
					if ( !op )
					{
						throw "Bad opcode "+tokens[0]+" "+linenr+": "+line;
					}
                    // console.log( 'AGALMiniAssembler' , 'op' , op );
					
					this.emitOpcode ( this.cur, op.opcode );
					var ti:number = 1; 
					if ( op.dest && op.dest!="none" )
					{
						if ( !this.emitDest ( this.cur, tokens[ti++], op.dest ) )
						{
							throw "Bad destination register "+tokens[ti-1]+" "+linenr+": "+line;
						}
					}
					else 
					{
						this.emitZeroDword( this.cur );
					}
					
					if ( op.a && op.a.format!="none" )
					{
						if ( !this.emitSource( this.cur, tokens[ti++], op.a ) ) throw "Bad source register "+tokens[ti-1]+" "+linenr+": "+line; 
					}
					else
					{
						this.emitZeroQword( this.cur ); 
					}
					
					if ( op.b && op.b.format!="none" )
					{
						if ( op.b.format == "sampler" )
						{
							if( !this.emitSampler( this.cur, tokens[ti++], op.b, opts ) )
							{
								throw "Bad sampler register "+tokens[ti-1]+" "+linenr+": "+line;
							}
						}
						else
						{
							if ( !this.emitSource( this.cur, tokens[ti++], op.b ) )
							{
								throw "Bad source register " + tokens[ti-1] + " " + linenr + ": " + line;
							}
						}
					}
					else
					{
						this.emitZeroQword( this.cur ); 
					}
					break;
			}                			                                             
		}
		
		public emitHeader( pr:aglsl.assembler.Part )
		{
			pr.data.writeUnsignedByte( 0xa0 ); 	// tag version
			pr.data.writeUnsignedInt( pr.version ); 
			if( pr.version >= 0x10 )
			{
				pr.data.writeUnsignedByte ( 0 ); // align, for higher versions
			}
			pr.data.writeUnsignedByte ( 0xa1 );		// tag program id
			switch( pr.name )
			{
				case "fragment" : pr.data.writeUnsignedByte ( 1 ); break;
				case "vertex" : pr.data.writeUnsignedByte ( 0 ); break;
				case "cpu" : pr.data.writeUnsignedByte ( 2 ); break;
				default : pr.data.writeUnsignedByte ( 0xff ); break; // unknown/comment
			}                        
		}    
		
		public emitOpcode( pr:aglsl.assembler.Part, opcode )
		{
			pr.data.writeUnsignedInt( opcode );
			//console.log ( "Emit opcode: ", opcode ); 
		}
		
		public emitZeroDword( pr:aglsl.assembler.Part )
		{
			pr.data.writeUnsignedInt( 0 );
		}
		
		public emitZeroQword( pr )
		{
			pr.data.writeUnsignedInt( 0 );
			pr.data.writeUnsignedInt( 0 );
		}
		
		public emitDest( pr, token, opdest )
		{
			
            //console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'RegMap.map' , RegMap.map);           
			var reg = token.match ( /([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i ); // g1: regname, g2:regnum, g3:mask
			
			// console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'reg' , reg , reg[1] , RegMap.map[reg[1]] );
			// console.log( 'aglsl.assembler.AGALMiniAssembler' , 'emitDest' , 'RegMap.map[reg[1]]' , RegMap.map[reg[1]] , 'bool' , !RegMap.map[reg[1]] ) ;
            
			if ( !RegMap.map[reg[1]] ) return false;
			var em = { num:reg[2]?reg[2]:0, code:RegMap.map[reg[1]].code, mask:this.stringToMask(reg[3]) };
			pr.data.writeUnsignedShort ( em.num );
			pr.data.writeUnsignedByte ( em.mask );
			pr.data.writeUnsignedByte ( em.code );
			//console.log ( "  Emit dest: ", em );
			return true;
		}
	
		public stringToMask( s:string ):number
		{
			if ( !s ) return 0xf; 
			var r = 0;
			if ( s.indexOf ( "x" ) != -1 ) r|=1;
			if ( s.indexOf ( "y" ) != -1 ) r|=2;
			if ( s.indexOf ( "z" ) != -1 ) r|=4;
			if ( s.indexOf ( "w" ) != -1 ) r|=8;
			return r;
		} 
		
		public stringToSwizzle( s )
		{
			if( !s )
			{
				return 0xe4;
			}
			var chartoindex = { x:0, y:1, z:2, w:3 };
			var sw = 0;
			
			if( s.charAt(0) != "." )
			{
				throw "Missing . for swizzle";
			}
			
			if( s.length > 1)
			{
				sw |= chartoindex[s.charAt(1)];
			}
			
			if( s.length > 2 )
			{
				sw |= chartoindex[s.charAt(2)] << 2;
			}
			else
			{
				sw |= (sw&3)<<2;
			}
			
			if( s.length > 3)
			{
				sw |= chartoindex[s.charAt(3)] << 4;
			}
			else
			{
				sw |= (sw&(3<<2))<<2;
			}
			
			if( s.length > 4)
			{
				sw |= chartoindex[s.charAt(4)] << 6;
			}
			else
			{
				sw |= (sw&(3<<4)) << 2;
			}
			
			return sw;
		}
		
		public emitSampler( pr: aglsl.assembler.Part, token, opsrc, opts )
		{
			var reg = token.match( /fs(\d*)/i ); // g1:regnum
			if( !reg || !reg[1] )
			{
				return false;
			}
			pr.data.writeUnsignedShort ( reg[1] ); 
			pr.data.writeUnsignedByte ( 0 );   // bias
			pr.data.writeUnsignedByte ( 0 );         
			/*
			pr.data.writeUnsignedByte ( 0x5 ); 
			pr.data.writeUnsignedByte ( 0 );   // readmode, dim
			pr.data.writeUnsignedByte ( 0 );   // special, wrap        
			pr.data.writeUnsignedByte ( 0 );   // mip, filter                            
			*/
			var samplerbits:number = 0x5; 
			var sampleroptset:number = 0; 
			for ( var i:number = 0; i < opts.length; i++ )
			{
				var o:aglsl.assembler.Sampler = <aglsl.assembler.Sampler> SamplerMap.map[ opts[i].toLowerCase() ];
				
                //console.log( 'AGALMiniAssembler' , 'emitSampler' , 'SampleMap opt:' , o , '<-------- WATCH FOR THIS');
				
				if( o )
				{
					if ( ((sampleroptset >> o.shift) & o.mask) != 0 )
					{
						console.log("Warning, duplicate sampler option");
					}
					sampleroptset |= o.mask << o.shift;
					samplerbits &= ~(o.mask << o.shift);
					samplerbits |= o.value << o.shift;
				}
				else
				{
					console.log("Warning, unknown sampler option: ", opts[i] );
					// todo bias
				}
			}
			pr.data.writeUnsignedInt( samplerbits );             
			return true;
		}
		
		public emitSource( pr, token, opsrc )
		{
			var indexed = token.match( /vc\[(v[tcai])(\d+)\.([xyzw])([\+\-]\d+)?\](\.[xyzw]{1,4})?/i ); // g1: indexregname, g2:indexregnum, g3:select, [g4:offset], [g5:swizzle] 
			var reg;
			if( indexed )
			{
				if ( !RegMap.map[indexed[1]] )
				{
					return false;
				}
				var selindex = { x:0, y:1, z:2, w:3 };
				var em:any = { num:indexed[2]|0, code:RegMap.map[indexed[1]].code, swizzle:this.stringToSwizzle(indexed[5]), select:selindex[indexed[3]], offset:indexed[4]|0 };
				pr.data.writeUnsignedShort( em.num );
				pr.data.writeByte( em.offset );
				pr.data.writeUnsignedByte( em.swizzle );
				pr.data.writeUnsignedByte( 0x1 ); // constant reg
				pr.data.writeUnsignedByte( em.code );
				pr.data.writeUnsignedByte( em.select );
				pr.data.writeUnsignedByte( 1 << 7 );
			}
			else
			{
				reg = token.match( /([fov]?[tpocidavs])(\d*)(\.[xyzw]{1,4})?/i ); // g1: regname, g2:regnum, g3:swizzle
				if( !RegMap.map[reg[1]] )
				{
					return false;
				}
				var em : any = { num:reg[2]|0, code:RegMap.map[reg[1]].code, swizzle:this.stringToSwizzle(reg[3]) };
				pr.data.writeUnsignedShort ( em.num );
				pr.data.writeUnsignedByte ( 0 );
				pr.data.writeUnsignedByte ( em.swizzle );
				pr.data.writeUnsignedByte ( em.code );
				pr.data.writeUnsignedByte ( 0 );
				pr.data.writeUnsignedByte ( 0 );
				pr.data.writeUnsignedByte ( 0 );
				//console.log ( "  Emit source: ", em, pr.data.length );
			}                    
			return true; 
		}  
		
		public addHeader( partname, version )
		{
			if( !version )
			{
				version = 1;
			}
			if ( this.r[partname] == undefined )
			{
				this.r[partname] = new aglsl.assembler.Part( partname, version );
				this.emitHeader( this.r[ partname ] ); 
			} 
			else if ( this.r[partname].version != version )
			{
				throw "Multiple versions for part " + partname;
			}
			this.cur = this.r[partname]; 
		}
	}
}