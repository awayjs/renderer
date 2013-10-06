///<reference path="../../build/Away3D.next.d.ts" />

module aglsl
{
	export class AssemblerTest
	{
		
		constructor()
		{

            var div : HTMLDivElement = <HTMLDivElement> document.createElement( 'div');
                div.style.position = 'absolute'
                div.style.height    = "100%";
                div.style.width     = "100%";
                div.style.left      = '0px';
                div.style.top       = '0px';
                div.style.color     = '#000000';
            document.body.appendChild( div );

            var p : HTMLParagraphElement = <HTMLParagraphElement> document.createElement( 'p');

            div.appendChild( p );


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
			
			console.log("=== Vertex Description ===" );
			console.log( vertDesc );
			
			console.log( "\n" );
			
			console.log("=== Fragment Description ===" );
			console.log( fragDesc );
			
			console.log("\n" );
			console.log( "=== Vertex GLSL ===" );

			var vertParser:aglsl.AGLSLParser = new aglsl.AGLSLParser();
            var vertStr : string =  vertParser.parse( vertDesc )
			console.log( vertStr);

            p.innerHTML = vertStr ;//+ '</p>';

            console.log( "\n" );
			console.log( "=== Fragment GLSL ===" );
			var fragParser:aglsl.AGLSLParser = new aglsl.AGLSLParser();
			console.log( fragParser.parse( fragDesc ) );
            //div.innerHTML += fragParser.parse( fragDesc )

            p.innerHTML += '<br/><br/>'
            p.innerHTML += fragParser.parse( fragDesc ) ;//+ '</p>';


		}
	}
}