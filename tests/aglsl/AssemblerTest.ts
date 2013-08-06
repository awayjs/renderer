/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../src/away/_definitions.ts" />

module aglsl
{
	export class AssemblerTest
	{
		
		constructor()
		{
			
			var shader:string =
				"part fragment 1                            	\n" +
				"mov oc, fc0                                    \n" +
				"endpart                                  		\n\n" +
				"part vertex 1                             		\n" +
				"m44 op, vt0, vc0	                        	\n" +
				"endpart                                		\n";
			
			var agalMiniAssembler: aglsl.assembler.AGALMiniAssembler = new aglsl.assembler.AGALMiniAssembler()
			agalMiniAssembler.assemble( shader );
			
			var tokenizer:aglsl.AGALTokenizer = new aglsl.AGALTokenizer();
			
			// TODO clean up the API for data access
			var vertData:away.utils.ByteArray = agalMiniAssembler.r['vertex'].data;
			var vertDesc:aglsl.Description = tokenizer.decribeAGALByteArray( vertData );
			
			var fragData:away.utils.ByteArray = agalMiniAssembler.r['fragment'].data;
			var fragDesc:aglsl.Description = tokenizer.decribeAGALByteArray( fragData );
			
			console.log( "=== Vertex Description ===" );
			console.log( vertDesc );
			
			console.log( "\n" );
			
			console.log( "=== Fragment Description ===" );
			console.log( fragDesc );
			
			console.log( "\n" );
			console.log( "=== Vertex GLSL ===" );
			var vertParser:aglsl.AGLSLParser = new aglsl.AGLSLParser();
			console.log( vertParser.parse( vertDesc ) );
			
			console.log( "\n" );
			console.log( "=== Fragment GLSL ===" );
			var fragParser:aglsl.AGLSLParser = new aglsl.AGLSLParser();
			console.log( fragParser.parse( fragDesc ) );
		}
	}
}