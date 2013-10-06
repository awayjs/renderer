///<reference path="../../build/Away3D.next.d.ts" />
var aglsl;
(function (aglsl) {
    var AssemblerTest = (function () {
        function AssemblerTest() {
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.height = "100%";
            div.style.width = "100%";
            div.style.left = '0px';
            div.style.top = '0px';
            div.style.color = '#000000';
            document.body.appendChild(div);

            var p = document.createElement('p');

            div.appendChild(p);

            var shader = "part fragment 1                            	\n" + "mov oc, fc0                                    \n" + "endpart                                  		\n\n" + "part vertex 1                             		\n" + "m44 op, vt0, vc0	                        	\n" + "endpart                                		\n";

            var agalMiniAssembler = new aglsl.assembler.AGALMiniAssembler();
            agalMiniAssembler.assemble(shader);

            var tokenizer = new aglsl.AGALTokenizer();

            // TODO clean up the API for data access
            var vertData = agalMiniAssembler.r['vertex'].data;
            var vertDesc = tokenizer.decribeAGALByteArray(vertData);

            var fragData = agalMiniAssembler.r['fragment'].data;
            var fragDesc = tokenizer.decribeAGALByteArray(fragData);

            console.log("=== Vertex Description ===");
            console.log(vertDesc);

            console.log("\n");

            console.log("=== Fragment Description ===");
            console.log(fragDesc);

            console.log("\n");
            console.log("=== Vertex GLSL ===");

            var vertParser = new aglsl.AGLSLParser();
            var vertStr = vertParser.parse(vertDesc);
            console.log(vertStr);

            p.innerHTML = vertStr;

            console.log("\n");
            console.log("=== Fragment GLSL ===");
            var fragParser = new aglsl.AGLSLParser();
            console.log(fragParser.parse(fragDesc));

            //div.innerHTML += fragParser.parse( fragDesc )
            p.innerHTML += '<br/><br/>';
            p.innerHTML += fragParser.parse(fragDesc);
        }
        return AssemblerTest;
    })();
    aglsl.AssemblerTest = AssemblerTest;
})(aglsl || (aglsl = {}));
//# sourceMappingURL=AssemblerTest.js.map
